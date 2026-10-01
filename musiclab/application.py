# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
"""Shared application boundary for CLI, loopback HTTP and local agents.

Domain modules return deterministic data/files. Adapters own transport and writes.
Audio sources are selected by an adapter, never by request JSON.
"""
import json
from dataclasses import dataclass
from pathlib import Path
from . import __version__
from .audio import analyze_wav, audio_bundle
from .creative import music_bundle, storyboard_bundle
from .design import music_plan_bundle, motif_bundle
from .lyrics import read_cues, lyrics_bundle

PROTOCOL_VERSION = 1
MAX_REQUEST_BYTES = 2 * 1024 * 1024
OPERATIONS = {
    "music": "Song planning and AI task packaging; no model invocation",
    "storyboard": "Shot timing and motif continuity; no media rendering",
    "lyrics": "Manual cue validation and LRC/SRT/JSON exports; no ASR",
    "audio": "Selected integer PCM WAV evidence; source is preserved",
}


@dataclass(frozen=True)
class Result:
    files: dict
    data: dict
    needs_review: bool = False

    def wire(self):
        return {"files": self.files, "data": self.data,
                "meta": {"version": __version__, "protocol_version": PROTOCOL_VERSION,
                         "needs_review": self.needs_review}}


def capabilities():
    return {"protocol_version": PROTOCOL_VERSION, "version": __version__,
            "license": "PolyForm-Noncommercial-1.0.0",
            "transport": "local_stdio_json_lines", "max_request_bytes": MAX_REQUEST_BYTES,
            "operations": OPERATIONS, "media_generated": False,
            "audio_source": "Only --audio chosen at process launch; JSON cannot select paths",
            "output": "JSON results and file contents on stdout; agent adapter writes no files"}


def build(operation, payload, *, audio_source=None):
    if operation not in OPERATIONS:
        raise ValueError("未知操作；請使用 music、storyboard、lyrics 或 audio")
    if not isinstance(payload, dict):
        raise ValueError("輸入需為 JSON 物件")
    if operation == "music":
        files = music_plan_bundle(payload) if "arrangement" in payload else music_bundle(payload)
        data = json.loads(files.get("music-plan.json", files["brief.json"]))
    elif operation == "storyboard":
        files = motif_bundle(payload) if "motifs" in payload else storyboard_bundle(payload)
        data = json.loads(files["storyboard.json"])
    elif operation == "lyrics":
        cues = payload.get("cues") if "cues" in payload else read_cues(
            payload.get("content", ""), payload.get("suffix", ".lrc"))
        files = lyrics_bundle(cues, payload.get("title", "歌詞"), payload.get("duration"))
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
    return Result(files, data, review)


def load_request(raw):
    def nonfinite(_):
        raise ValueError("JSON 不接受 NaN 或 Infinity")
    return json.loads(raw, parse_constant=nonfinite)


def validate_request(request):
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
    if request.get("operation") not in OPERATIONS or not isinstance(request.get("payload"), dict):
        raise ValueError("Agent operation 或 payload 格式錯誤")
    return request_id, request["operation"], request["payload"]
