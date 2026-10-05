# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
"""Shared application boundary for CLI, loopback HTTP and local agents.

Domain modules return deterministic data/files. Adapters own transport.
An explicitly injected draft library owns immutable local revision writes.
Audio sources are selected by an adapter, never by request JSON.
"""
import json
from .json_document import decode_json, MAX_JSON_DEPTH, MAX_JSON_BYTES
from dataclasses import dataclass
from pathlib import Path
from . import __version__
from .audio import analyze_wav, audio_bundle
from .delivery_package import prepare as prepare_delivery, descriptor as delivery_descriptor
from .delivery_inspect import read as read_delivery, descriptor as inspection_descriptor, MAX_INLINE_FILES_BYTES
from .delivery_selection import checked_names, select as select_delivery_files, descriptor as selection_descriptor
from .delivery_text import checked_request as checked_text_window, select as select_text_window, descriptor as text_window_descriptor
from .delivery_search import checked_request as checked_text_search, select as select_text_search, descriptor as text_search_descriptor
from .delivery_review import compare as compare_delivery, descriptor as comparison_descriptor
from .delivery_report import files as delivery_report_files, descriptor as report_descriptor
from .audio_acceptance import validate as validate_acceptance, prepare as prepare_acceptance, descriptor as acceptance_descriptor
from .audio_acceptance_review import review_bundle as acceptance_review_bundle, descriptor as acceptance_review_descriptor
from .common import json_text
from .loudness import descriptor as loudness_descriptor
from .storyboard_frames import descriptor as frames_descriptor
from .creative import music_bundle, storyboard_bundle
from .design import music_plan_bundle, motif_bundle
from .storyboard_seed import storyboard_seed_bundle, SEED_SCHEMA_VERSION, MAX_SLOTS
from .lyrics_seed import lyrics_seed_bundle, LYRICS_SEED_SCHEMA_VERSION, MAX_SOURCE_BYTES, MAX_LINES
from .lyrics_review import review_bundle, descriptor as lyrics_review_descriptor
from .lyrics_export_review import review_bundle as lyrics_export_review_bundle, descriptor as lyrics_export_review_descriptor
from .music_review import review_bundle as music_review_bundle, descriptor as music_review_descriptor
from .storyboard_review import review_bundle as storyboard_review_bundle, descriptor as storyboard_review_descriptor
from .storyboard_timing_review import review_bundle as storyboard_timing_review_bundle, descriptor as storyboard_timing_review_descriptor
from .lyrics import read_cues, lyrics_bundle, edits
from .lyrics_package import (PACKAGE_SCHEMA_VERSION, MAX_PACKAGE_BYTES, validate_package,
                             package_files, decode_document, is_legacy, needs_review as package_needs_review)
from .tool_contracts import payload_schema, output_schema
from .draft_contract import MAX_DRAFT_BYTES
from .draft_library import LIBRARY_SCHEMA_VERSION, MAX_ENTRIES
from .draft_backup import (BACKUP_SCHEMA_VERSION, MAX_BACKUP_BYTES, MAX_EXPANDED_BYTES,
                           export_backup, inspect_backup, restore_backup)

PROTOCOL_VERSION = 1
MAX_REQUEST_BYTES = MAX_JSON_BYTES
OPERATIONS = {
    "delivery_inspect": "Verify the complete selected canonical ZIP; explicit file_names returns original files within 512 KiB JSON, exclusive text_search returns bounded literal UTF-8 positions, or exclusive text_window returns <=16 KiB original UTF-8 bytes with pinned archive SHA for continuation; default metadata, baseline comparison or exclusive include_report; no paths, merging, automatic writes or model",
    "delivery_package": "Package explicitly provided text files with a SHA-256 manifest; metadata by default, archive_base64 only when include_archive=true and ZIP<=512 KiB; no source paths, media, creative acceptance or model",
    "music": "Song planning and AI task packaging; no model invocation",
    "music_review": "Locate incomplete raw song draft fields and numeric ranges; read-only; no content filling, complete plan acceptance or model",
    "storyboard": "Shot timing and motif continuity; no media rendering",
    "storyboard_review": "Locate incomplete raw storyboard fields and motif references; read-only; no timing edits, complete plan acceptance or model",
    "storyboard_timing_review": "Locate raw storyboard numeric, seconds and exclusive-frame coverage issues; read-only; no time edits, complete creative acceptance or media",
    "lyrics": "Manual cue validation and LRC/SRT/JSON exports; no ASR",
    "lyrics_review": "Locate incomplete lyric rows, duplicate starts, overlap and declared-duration limits; read-only; no guessed times or ASR",
    "lyrics_export_review": "Review a complete modern lyric package for LRC leading-tag and SRT blank-line round-trip risks; compact source-pinned report by default, explicit include_package adds checked complete lyrics.json; read-only, no rewrite, paths or media acceptance",
    "audio_acceptance_review": "Review all three raw acceptance fields; read-only; no media, paths, automatic filling, audio acceptance or model",
    "audio": "Selected integer PCM WAV evidence and gated mono/stereo integrated loudness; source is preserved; no normalization or true peak",
    "storyboard_seed": "Create from a modern song brief or inspect an existing bar-aligned timing seed; incomplete visuals require manual writing; no model or media",
    "lyrics_seed": "Create or inspect untimed lyric lines; preserves source and duplicates; no guessed times, ASR or model",
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


def capabilities(draft_library=None, backup_source=None, delivery_source=None):
    operations = available_operations(draft_library)
    return {"protocol_version": PROTOCOL_VERSION, "version": __version__,
            "license": "PolyForm-Noncommercial-1.0.0",
            "transport": "local_stdio_json_lines", "max_request_bytes": MAX_REQUEST_BYTES,
            "json_document": {"encoding": "UTF-8", "max_depth": MAX_JSON_DEPTH,
                              "duplicate_keys": "reject", "nonfinite_numbers": "reject"},
            "operations": operations, "media_generated": False,
            "draft_library_enabled": draft_library is not None,
            "draft_library": {"enabled": draft_library is not None, "library_schema_version": LIBRARY_SCHEMA_VERSION,
                              "max_draft_bytes": MAX_DRAFT_BYTES, "max_revisions": MAX_ENTRIES, "default_page_size": 20},
            "draft_backup": {"backup_schema_version": BACKUP_SCHEMA_VERSION, "source_selected": backup_source is not None,
                             "max_archive_bytes": MAX_BACKUP_BYTES, "max_expanded_bytes": MAX_EXPANDED_BYTES},
            "storyboard_seed": {"schema_version": SEED_SCHEMA_VERSION, "max_slots": MAX_SLOTS,
                                "status": "timing_seed_incomplete", "media_generated": False},
            "lyrics_seed": {"schema_version": LYRICS_SEED_SCHEMA_VERSION, "max_source_bytes": MAX_SOURCE_BYTES,
                            "max_lines": MAX_LINES, "status": "untimed", "media_generated": False},
            "lyrics_package": {"schema_version": PACKAGE_SCHEMA_VERSION, "max_bytes": MAX_PACKAGE_BYTES,
                               "legacy_conversion": "explicit allow_legacy only", "media_generated": False},
            "lyrics_review": lyrics_review_descriptor(),
            "lyrics_export_review": lyrics_export_review_descriptor(),
            "music_review": music_review_descriptor(),
            "storyboard_review": storyboard_review_descriptor(),
            "storyboard_timing_review": storyboard_timing_review_descriptor(),
            "delivery_package": {**delivery_descriptor(), "agent_max_request_bytes": MAX_REQUEST_BYTES},
            "delivery_inspection": {**inspection_descriptor(), "source_selected": delivery_source is not None},
            "delivery_file_selection": selection_descriptor(),
            "delivery_text_window": text_window_descriptor(),
            "delivery_text_search": text_search_descriptor(),
            "delivery_comparison": comparison_descriptor(),
            "delivery_comparison_report": report_descriptor(),
            "audio_acceptance_draft": acceptance_descriptor(),
            "audio_acceptance_review": acceptance_review_descriptor(),
            "audio_loudness": loudness_descriptor(),
            "storyboard_frames": frames_descriptor(),
            "input_schemas": {operation: payload_schema(operation) for operation in operations},
            "output_schema": output_schema(),
            "audio_source": "Only --audio chosen at process launch; JSON cannot select paths",
            "output": "JSON results on stdout; draft_save and draft_backup_restore add immutable versions only to the selected library" if draft_library is not None else
                      "JSON results and file contents on stdout; agent adapter writes no files"}


def export_library_backup(draft_library, identifiers=None):
    if draft_library is None:
        raise ValueError("草稿庫未啟用；請明確選定草稿庫")
    return export_backup(draft_library, identifiers)


def inspect_delivery(source, include_files=False, *, limit_files=True, baseline=None, include_report=False, file_names=None, text_window=None, text_search=None):
    if type(include_files) is not bool: raise ValueError('include_files需為布林值')
    if type(include_report) is not bool or (include_report and (baseline is None or include_files)):raise ValueError('比較報告需明確baseline；include_report與include_files不可同時啟用')
    if type(limit_files) is not bool:raise ValueError('原文傳輸限制需為布林值')
    if text_window is not None:
        checked_text_window(text_window)
        if include_files or include_report or file_names is not None:raise ValueError('text_window不可與全部檔案、選定檔案或比較報告混用')
    if text_search is not None:
        checked_text_search(text_search)
        if include_files or include_report or file_names is not None or text_window is not None:raise ValueError('text_search不可與原文分段、全部檔案、選定檔案或比較報告混用')
    if file_names is not None:
        checked_names(file_names)
        if not include_files:raise ValueError('file_names需明確include_files=true')
    result=read_delivery(source)
    files=result.files if include_files else {}
    if text_window is not None:result.data['text_window']=select_text_window(result,text_window)
    if text_search is not None:result.data['text_search']=select_text_search(result,text_search)
    if file_names is not None:
        files,selection=select_delivery_files(result.files,file_names)
        result.data['selection']=selection
    if include_files and limit_files and len(json_text(files).encode('utf-8'))>MAX_INLINE_FILES_BYTES:
        raise ValueError('文字成果JSON超過512KiB；請回傳摘要或在工作台選檔查看')
    if baseline is not None:
        comparison=compare_delivery(baseline,{'scope':result.data['manifest']['scope'],'files':result.files})
        if include_report:files=delivery_report_files(result.data,comparison)
        result.data['comparison']=comparison
    return Result(files,result.data,True)


def build(operation, payload, *, audio_source=None, draft_library=None, backup_source=None, delivery_source=None):
    if operation in LIBRARY_OPERATIONS and draft_library is None:
        raise ValueError("草稿庫未啟用；請在啟動時明確指定 --draft-library 目錄")
    if operation not in available_operations(draft_library):
        raise ValueError("未知操作；請使用 music、music_review、storyboard、storyboard_review、storyboard_timing_review、lyrics、audio、audio_acceptance_review、storyboard_seed、lyrics_seed、lyrics_review、lyrics_export_review 或 delivery_package、delivery_inspect")
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
    if operation == "delivery_inspect":
        if set(payload)-{'include_files','baseline','include_report','file_names','text_window','text_search'}:raise ValueError('交付核對不能由JSON指定來源路徑')
        if 'baseline' in payload and payload['baseline'] is None:raise ValueError('比較基準需為scope／files物件')
        if 'file_names' in payload:checked_names(payload['file_names'])
        if 'text_window' in payload:checked_text_window(payload['text_window'])
        if 'text_search' in payload:checked_text_search(payload['text_search'])
        return inspect_delivery(delivery_source,payload.get('include_files',False),baseline=payload.get('baseline'),include_report=payload.get('include_report',False),file_names=payload.get('file_names'),text_window=payload.get('text_window'),text_search=payload.get('text_search'))
    if operation == "delivery_package":
        return Result({}, prepare_delivery(payload).summary(payload.get("include_archive", False)), True)
    if operation == "audio_acceptance_review":
        files = acceptance_review_bundle(payload)
        data = json.loads(files["audio-acceptance-review.json"])
    elif operation == "music_review":
        files = music_review_bundle(payload)
        data = json.loads(files["music-review.json"])
    elif operation == "storyboard_review":
        files = storyboard_review_bundle(payload)
        data = json.loads(files["storyboard-review.json"])
    elif operation == "storyboard_timing_review":
        files = storyboard_timing_review_bundle(payload)
        data = json.loads(files["storyboard-timing-review.json"])
    elif operation == "lyrics_review":
        files = review_bundle(payload)
        data = json.loads(files["lyrics-review.json"])
    elif operation == "lyrics_export_review":
        files = lyrics_export_review_bundle(payload)
        data = json.loads(files["lyrics-export-review.json"])
    elif operation == "lyrics_seed":
        files = lyrics_seed_bundle(payload)
        data = json.loads(files['lyrics-seed.json'])
    elif operation == "storyboard_seed":
        files = storyboard_seed_bundle(payload)
        data = json.loads(files['storyboard-seed.json'])
    elif operation == "music":
        files = music_plan_bundle(payload) if "arrangement" in payload else music_bundle(payload)
        data = json.loads(files.get("music-plan.json", files["brief.json"]))
    elif operation == "storyboard":
        files = motif_bundle(payload) if "motifs" in payload else storyboard_bundle(payload)
        data = json.loads(files["storyboard.json"])
    elif operation == "lyrics":
        document = payload.get('package')
        inspecting = 'package' in payload
        if inspecting:
            if set(payload) - {'package', 'allow_legacy'}:
                raise ValueError('歌詞包檢查不能覆蓋名稱、總長或編修；請在工作台明確編修後另存')
        elif 'content' in payload and str(payload.get('suffix', '.lrc')).lower() == '.json':
            parsed = decode_document(payload['content'])
            if isinstance(parsed, dict) and (is_legacy(parsed) or {'format', 'schema_version'} & set(parsed)):
                if set(payload) - {'content', 'suffix'}:
                    raise ValueError('完整歌詞包檢查不能覆蓋名稱或總長；請使用 package 模式')
                document, inspecting = parsed, True
        if inspecting:
            files = package_files(validate_package(document, allow_legacy=payload.get('allow_legacy', False)))
        else:
            if set(payload) - {'cues', 'content', 'suffix', 'title', 'duration', 'shift_seconds', 'time_changes', 'text_changes'}:
                raise ValueError('歌詞操作含不支援的欄位')
            if 'allow_legacy' in payload:
                raise ValueError('allow_legacy 只用於完整舊歌詞包的明確轉換')
            if "cues" in payload and ("content" in payload or "suffix" in payload):
                raise ValueError("歌詞需選擇 cues 或 content 其中一種；逐句 cues 不使用原文 suffix")
            cues = payload.get("cues") if "cues" in payload else read_cues(
                payload.get("content", ""), payload.get("suffix", ".lrc"))
            if any(key in payload for key in ('shift_seconds', 'time_changes', 'text_changes')):
                cues = edits(cues, payload.get('shift_seconds', 0), payload.get('time_changes', ()), payload.get('text_changes', ()))
            notes = ['逐句時間或文字已編修；資料驗證不能替代實聽核對。'] if payload.get('time_changes') or payload.get('text_changes') else []
            files = lyrics_bundle(cues, payload.get("title", "歌詞"), payload.get("duration"),
                                  applied_shift=payload.get('shift_seconds'), review_notes=notes)
        data = json.loads(files["lyrics.json"])
    else:
        if audio_source is None:
            raise ValueError("音訊操作需要由啟動參數或上傳選定 WAV，JSON 不能指定路徑")
        if {"path", "input", "audio_source", "filename"}.intersection(payload):
            raise ValueError("JSON 不能指定音檔路徑")
        document = None
        if 'acceptance_draft' in payload:
            if set(payload) - {'acceptance_draft', 'display_name'}:
                raise ValueError('接受條件草稿不能與 profile／rates／bits／channels 或額外欄位混用')
            document = validate_acceptance(payload['acceptance_draft'])
            profile, limits = prepare_acceptance(document)
            data = analyze_wav(audio_source, profile, **limits)
            data['acceptance_draft'] = document
        else:
            if set(payload) - {'profile', 'rates', 'bits', 'channels', 'display_name'}:
                raise ValueError('音檔接受條件含不支援的欄位')
            data = analyze_wav(audio_source, payload.get("profile", "distribution"),
                               payload.get("rates"), payload.get("bits"), payload.get("channels"))
        if "display_name" in payload:
            name = payload["display_name"]
            if not isinstance(name, str):
                raise ValueError("檔名需為文字")
            data["file"] = Path(name.replace("\\", "/")).name[:200] or "selected.wav"
        files = audio_bundle(data)
        if document is not None:
            files["audio-acceptance-draft.json"] = json_text(document)
    review = bool(data.get("review_notes") or data.get("warnings") or data.get("duration_estimated"))
    if operation in ('audio_acceptance_review', 'lyrics_review', 'lyrics_export_review', 'music_review', 'storyboard_review', 'storyboard_timing_review'):
        review = True  # Diagnostic readiness never proves performance synchronization.
    if operation == 'lyrics':
        review = package_needs_review(data)
    if operation == 'lyrics' and (data['timing'].get('applied_shift_seconds', 0) != 0 or payload.get('time_changes') or payload.get('text_changes')):
        review = True  # Data checks do not verify a changed cue against the performance.
    return Result(files, data, review)


def load_request(raw):
    return decode_json(raw, max_bytes=MAX_REQUEST_BYTES)


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
