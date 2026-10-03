# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
"""Shared application boundary for CLI, loopback HTTP and local agents.

Domain modules return deterministic data/files. Adapters own transport.
An explicitly injected draft library owns immutable local revision writes.
Audio sources are selected by an adapter, never by request JSON.
"""
import json
from dataclasses import dataclass
from pathlib import Path
from . import __version__
from .audio import analyze_wav, audio_bundle
from .creative import music_bundle, storyboard_bundle
from .design import music_plan_bundle, motif_bundle
from .storyboard_seed import storyboard_seed_bundle, SEED_SCHEMA_VERSION, MAX_SLOTS
from .lyrics import read_cues, lyrics_bundle, edits
from .tool_contracts import payload_schema, output_schema
from .draft_contract import MAX_DRAFT_BYTES
from .draft_library import LIBRARY_SCHEMA_VERSION, MAX_ENTRIES
from .draft_backup import (BACKUP_SCHEMA_VERSION, MAX_BACKUP_BYTES, MAX_EXPANDED_BYTES,
                           export_backup, inspect_backup, restore_backup)

PROTOCOL_VERSION = 1
MAX_REQUEST_BYTES = 2 * 1024 * 1024
OPERATIONS = {
    "music": "Song planning and AI task packaging; no model invocation",
    "storyboard": "Shot timing and motif continuity; no media rendering",
    "lyrics": "Manual cue validation and LRC/SRT/JSON exports; no ASR",
    "audio": "Selected integer PCM WAV evidence; source is preserved",
    "storyboard_seed": "Create from a modern song brief or inspect an existing bar-aligned timing seed; incomplete visuals require manual writing; no model or media",
}
LIBRARY_OPERATIONS = {
    "draft_save": "Save an immutable revision only in the explicitly selected local library; no media",
    "draft_list": "List metadata from the explicitly selected library; no arbitrary path access",
    "draft_read": "Read a saved revision and verify its hash and draft shape before returning it",
    "draft_backup_inspect": "Validate the backup selected at launch and preview conflicts; no restore",
    "draft_backup_restore": "Restore the selected backup after confirming its SHA-256; never overwrite revisions",
}


def available_operations(draft_library=None):
    return {**OPERATIONS, **(LIBRARY_OPERATIONS if draft_library is not None else {})}


@dataclass(frozen=True)
class Result:
    files: dict
    data: dict
    needs_review: bool = False

    def wire(self):
        return {"files": self.files, "data": self.data,
                "meta": {"version": __version__, "protocol_version": PROTOCOL_VERSION,
                         "needs_review": self.needs_review}}


def capabilities(draft_library=None, backup_source=None):
    operations = available_operations(draft_library)
    return {"protocol_version": PROTOCOL_VERSION, "version": __version__,
            "license": "PolyForm-Noncommercial-1.0.0",
            "transport": "local_stdio_json_lines", "max_request_bytes": MAX_REQUEST_BYTES,
            "operations": operations, "media_generated": False,
            "draft_library_enabled": draft_library is not None,
            "draft_library": {"enabled": draft_library is not None, "library_schema_version": LIBRARY_SCHEMA_VERSION,
                              "max_draft_bytes": MAX_DRAFT_BYTES, "max_revisions": MAX_ENTRIES, "default_page_size": 20},
            "draft_backup": {"backup_schema_version": BACKUP_SCHEMA_VERSION, "source_selected": backup_source is not None,
                             "max_archive_bytes": MAX_BACKUP_BYTES, "max_expanded_bytes": MAX_EXPANDED_BYTES},
            "storyboard_seed": {"schema_version": SEED_SCHEMA_VERSION, "max_slots": MAX_SLOTS,
                                "status": "timing_seed_incomplete", "media_generated": False},
            "input_schemas": {operation: payload_schema(operation) for operation in operations},
            "output_schema": output_schema(),
            "audio_source": "Only --audio chosen at process launch; JSON cannot select paths",
            "output": "JSON results on stdout; draft_save and draft_backup_restore add immutable versions only to the selected library" if draft_library is not None else
                      "JSON results and file contents on stdout; agent adapter writes no files"}


def export_library_backup(draft_library, identifiers=None):
    if draft_library is None:
        raise ValueError("草稿庫未啟用；請明確選定草稿庫")
    return export_backup(draft_library, identifiers)


def build(operation, payload, *, audio_source=None, draft_library=None, backup_source=None):
    if operation in LIBRARY_OPERATIONS and draft_library is None:
        raise ValueError("草稿庫未啟用；請在啟動時明確指定 --draft-library 目錄")
    if operation not in available_operations(draft_library):
        raise ValueError("未知操作；請使用 music、storyboard、lyrics、audio 或 storyboard_seed")
    if not isinstance(payload, dict):
        raise ValueError("輸入需為 JSON 物件")
    if operation in LIBRARY_OPERATIONS:
        required, optional = {"draft_save": ({"draft", "label", "id"}, set()),
                              "draft_list": (set(), {"limit", "cursor"}),
                              "draft_read": ({"id"}, set()), "draft_backup_inspect": (set(), set()),
                              "draft_backup_restore": ({"backup_sha256"}, set())}[operation]
        if not required <= set(payload) or set(payload) - required - optional:
            raise ValueError("草稿庫操作欄位錯誤；不能指定路徑或覆寫版本")
        if operation == "draft_save":
            data = draft_library.save(payload['draft'], payload['label'], payload['id'])
        elif operation == "draft_read":
            data = draft_library.read(payload['id'])
        elif operation == "draft_list":
            data = draft_library.list(payload.get('limit', 20), payload.get('cursor'))
        elif operation == "draft_backup_inspect":
            data = inspect_backup(draft_library, backup_source)
        else:
            data = restore_backup(draft_library, backup_source, payload['backup_sha256'])
        return Result({}, data, operation != 'draft_list')
    if operation == "storyboard_seed":
        files = storyboard_seed_bundle(payload)
        data = json.loads(files['storyboard-seed.json'])
    elif operation == "music":
        files = music_plan_bundle(payload) if "arrangement" in payload else music_bundle(payload)
        data = json.loads(files.get("music-plan.json", files["brief.json"]))
    elif operation == "storyboard":
        files = motif_bundle(payload) if "motifs" in payload else storyboard_bundle(payload)
        data = json.loads(files["storyboard.json"])
    elif operation == "lyrics":
        if "cues" in payload and ("content" in payload or "suffix" in payload):
            raise ValueError("歌詞需選擇 cues 或 content 其中一種；逐句 cues 不使用原文 suffix")
        cues = payload.get("cues") if "cues" in payload else read_cues(
            payload.get("content", ""), payload.get("suffix", ".lrc"))
        if any(key in payload for key in ('shift_seconds', 'time_changes', 'text_changes')):
            cues = edits(cues, payload.get('shift_seconds', 0), payload.get('time_changes', ()), payload.get('text_changes', ()))
        files = lyrics_bundle(cues, payload.get("title", "歌詞"), payload.get("duration"), applied_shift=payload.get('shift_seconds'))
        data = json.loads(files["lyrics.json"])
    else:
        if audio_source is None:
            raise ValueError("音訊操作需要由啟動參數或上傳選定 WAV，JSON 不能指定路徑")
        if {"path", "input", "audio_source", "filename"}.intersection(payload):
            raise ValueError("JSON 不能指定音檔路徑")
        data = analyze_wav(audio_source, payload.get("profile", "distribution"),
                           payload.get("rates"), payload.get("bits"), payload.get("channels"))
        if "display_name" in payload:
            name = payload["display_name"]
            if not isinstance(name, str):
                raise ValueError("檔名需為文字")
            data["file"] = Path(name.replace("\\", "/")).name[:200] or "selected.wav"
        files = audio_bundle(data)
    review = bool(data.get("review_notes") or data.get("warnings") or data.get("duration_estimated"))
    if operation == 'lyrics' and (data['timing'].get('applied_shift_seconds', 0) != 0 or payload.get('time_changes') or payload.get('text_changes')):
        review = True  # Data checks do not verify a changed cue against the performance.
    return Result(files, data, review)


def load_request(raw):
    def nonfinite(_):
        raise ValueError("JSON 不接受 NaN 或 Infinity")
    return json.loads(raw, parse_constant=nonfinite)


def validate_request(request, draft_library=None):
    if not isinstance(request, dict):
        raise ValueError("Agent request 需為物件")
    if set(request) - {"protocol_version", "id", "operation", "payload"}:
        raise ValueError("Agent request 含不支援的欄位")
    version = request.get("protocol_version")
    if type(version) is not int or version != PROTOCOL_VERSION:
        raise ValueError("Agent protocol_version 需為 1")
    request_id = request.get("id")
    if not isinstance(request_id, str) or not 1 <= len(request_id) <= 200:
        raise ValueError("Agent id 需為 1–200 字元的文字")
    if request.get("operation") not in available_operations(draft_library) or not isinstance(request.get("payload"), dict):
        raise ValueError("Agent operation 或 payload 格式錯誤")
    return request_id, request["operation"], request["payload"]
