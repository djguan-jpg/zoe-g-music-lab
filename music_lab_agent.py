# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
"""Versioned JSON-lines adapter. No network, credentials or automatic writes."""
import argparse
import json
import sys
from pathlib import Path
from musiclab.application import (MAX_REQUEST_BYTES, PROTOCOL_VERSION, build,
                                  capabilities, load_request, validate_request)


def response(raw, audio_source=None):
    request_id = None
    try:
        request = load_request(raw)
        if isinstance(request, dict) and isinstance(request.get("id"), str):
            request_id = request["id"][:200]
        request_id, operation, payload = validate_request(request)
    except (ValueError, TypeError, RecursionError):
        return {"protocol_version": PROTOCOL_VERSION, "id": request_id, "ok": False,
                "error": {"code": "invalid_request", "message": "請核對 Agent v1 request 的格式、版本及操作"}}
    try:
        return {"protocol_version": PROTOCOL_VERSION, "id": request_id, "ok": True,
                "result": build(operation, payload, audio_source=audio_source).wire()}
    except (ValueError, TypeError, KeyError, AttributeError, UnicodeError) as error:
        code, message = "invalid_input", str(error)
    except OSError:
        code, message = "io_error", "選定音檔無法讀取"
    except Exception:
        code, message = "internal_error", "本機操作未完成，請檢查輸入或回報此 request id"
    return {"protocol_version": PROTOCOL_VERSION, "id": request_id, "ok": False,
            "error": {"code": code, "message": message}}


def serve(source, destination, audio_source=None):
    while True:
        raw = source.readline(MAX_REQUEST_BYTES + 1)
        if not raw:
            break
        if len(raw) > MAX_REQUEST_BYTES:
            while not raw.endswith(b"\n"):
                raw = source.readline(MAX_REQUEST_BYTES + 1)
                if not raw:
                    break
            result = {"protocol_version": PROTOCOL_VERSION, "id": None, "ok": False,
                      "error": {"code": "request_too_large", "message": "request 上限為 2 MiB"}}
        else:
            try:
                text = raw.decode("utf-8-sig")
                if not text.strip():
                    continue
                result = response(text, audio_source)
            except UnicodeError:
                result = {"protocol_version": PROTOCOL_VERSION, "id": None, "ok": False,
                          "error": {"code": "invalid_encoding", "message": "request 需為 UTF-8"}}
        destination.write(json.dumps(result, ensure_ascii=False, allow_nan=False) + "\n")
        destination.flush()


def main():
    parser = argparse.ArgumentParser(description="ZOE. G Music Lab local Agent v1")
    parser.add_argument("--describe", action="store_true")
    parser.add_argument("--audio", help="Explicit selected WAV for audio requests; no JSON path access")
    args = parser.parse_args()
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    if args.describe:
        print(json.dumps(capabilities(), ensure_ascii=False, indent=2))
        return 0
    audio_source = Path(args.audio) if args.audio else None
    if audio_source is not None and audio_source.suffix.lower() != ".wav":
        parser.error("--audio 只接受選定的 .wav")
    serve(sys.stdin.buffer, sys.stdout, audio_source)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
