# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
"""Dependency-free local MCP stdio tools for the explicit 2025-11-25 revision.

Original adapter based on the public specification; no SDK code copied.
Only application.build performs domain work. No model, network or file writes.
"""
import argparse
import json
import sys
from pathlib import Path

from musiclab import __version__
from musiclab.application import MAX_REQUEST_BYTES, OPERATIONS, build, load_request

MCP_VERSION = "2025-11-25"
TOOLS = {"music_plan": "music", "storyboard_plan": "storyboard",
         "lyrics_validate": "lyrics", "audio_report": "audio"}
PAYLOAD_HELP = {
    "music": "Song brief: title, memory_hook, theme, style, vocal, audience, bpm, beats_per_bar, "
             "arrangement [{name,bars,energy,focus,texture}], optional existing_lyrics. Legacy brief also accepted.",
    "storyboard": "MV brief: title, duration_seconds, fps, aspect_ratio, visual_style, character_anchor, "
                  "motifs [{name,meaning}], shots [{start,end,section,purpose,visual,camera,transition,motif,"
                  "motif_state,character_state,screen_direction,change_reason}]. Legacy brief also accepted.",
    "lyrics": "title and either cues [{start,end,text}] or content with suffix (.lrc/.srt/.json); "
              "optional duration in seconds. Manual timing only.",
    "audio": "Optional profile (distribution/video), rates, bits, channels, display_name. "
             "Only the WAV selected using --audio is read; JSON paths are rejected.",
}


def tool_list():
    return [{"name": name, "description": OPERATIONS[operation],
             "inputSchema": {"type": "object", "properties": {
                 "payload": {"type": "object", "description": PAYLOAD_HELP[operation]}},
                 "required": ["payload"], "additionalProperties": False},
             "annotations": {"readOnlyHint": True, "destructiveHint": False,
                             "idempotentHint": True, "openWorldHint": False}}
            for name, operation in TOOLS.items()]


def rpc_error(request_id, code, message, data=None):
    error = {"code": code, "message": message}
    if data is not None:
        error["data"] = data
    return {"jsonrpc": "2.0", "id": request_id, "error": error}


def tool_error(message):
    return {"content": [{"type": "text", "text": message}], "isError": True}


class Session:
    def __init__(self, audio_source=None):
        self.audio_source = audio_source
        self.initialized = False
        self.ready = False

    def response(self, raw):
        try:
            request = load_request(raw)
        except (ValueError, TypeError, RecursionError):
            return rpc_error(None, -32700, "Invalid UTF-8 JSON request")
        if not isinstance(request, dict) or request.get("jsonrpc") != "2.0" or not isinstance(request.get("method"), str):
            return rpc_error(None, -32600, "Invalid JSON-RPC request; batches are not supported")
        has_id = "id" in request
        request_id = request.get("id")
        if has_id and not (type(request_id) is int or isinstance(request_id, str)):
            return rpc_error(None, -32600, "Request id must be an integer or string")
        # Never respond to a notification, including unknown notifications.
        if not has_id:
            if request["method"] == "notifications/initialized" and self.initialized and isinstance(request.get("params", {}), dict):
                self.ready = True
            return None
        params = request.get("params", {})
        if not isinstance(params, dict):
            return rpc_error(request_id, -32602, "params must be an object")
        method = request["method"]
        if method == "ping":
            return {"jsonrpc": "2.0", "id": request_id, "result": {}}
        if method == "initialize":
            if self.initialized:
                return rpc_error(request_id, -32600, "This process is already initialized")
            if params.get("protocolVersion") != MCP_VERSION:
                return rpc_error(request_id, -32602, "Unsupported protocol version", {
                    "supported": [MCP_VERSION], "requested": params.get("protocolVersion")})
            info = params.get("clientInfo")
            if not isinstance(params.get("capabilities"), dict) or not isinstance(info, dict) or any(
                    not isinstance(info.get(key), str) or not info[key] for key in ("name", "version")):
                return rpc_error(request_id, -32602, "initialize requires capabilities and clientInfo name/version")
            self.initialized = True
            result = {"protocolVersion": MCP_VERSION, "capabilities": {"tools": {"listChanged": False}},
                      "serverInfo": {"name": "zoe-g-music-lab", "version": __version__},
                      "instructions": "Local planning and evidence tools. PolyForm Noncommercial 1.0.0. "
                                      "No AI generation or automatic exports; review returned content."}
        elif method not in ("tools/list", "tools/call"):
            return rpc_error(request_id, -32601, "Method not supported")
        elif not self.ready:
            return rpc_error(request_id, -32600, "Send initialize then notifications/initialized before using tools")
        elif method == "tools/list":
            if params.get("cursor") is not None:
                return rpc_error(request_id, -32602, "The complete static tool list has no cursor")
            result = {"tools": tool_list()}
        else:
            if "task" in params:
                return rpc_error(request_id, -32602, "Task-augmented execution is not supported")
            name, arguments = params.get("name"), params.get("arguments")
            if not isinstance(name, str) or name not in TOOLS:
                return rpc_error(request_id, -32602, "Unknown tool")
            if not isinstance(arguments, dict) or set(arguments) != {"payload"} or not isinstance(arguments["payload"], dict):
                result = tool_error("arguments must contain exactly one object: payload")
            else:
                try:
                    data = build(TOOLS[name], arguments["payload"], audio_source=self.audio_source).wire()
                    result = {"content": [{"type": "text", "text": json.dumps(data, ensure_ascii=False, allow_nan=False)}],
                              "structuredContent": data, "isError": False}
                except (ValueError, TypeError, KeyError, AttributeError, UnicodeError, RecursionError) as error:
                    result = tool_error(str(error))
                except OSError:
                    result = tool_error("The explicitly selected WAV cannot be read")
                except Exception:
                    return rpc_error(request_id, -32603, "Local operation did not complete")
        return {"jsonrpc": "2.0", "id": request_id, "result": result}


def serve(source, destination, audio_source=None):
    session = Session(audio_source)
    while True:
        raw = source.readline(MAX_REQUEST_BYTES + 1)
        if not raw:
            return
        if len(raw) > MAX_REQUEST_BYTES:
            while not raw.endswith(b"\n"):
                raw = source.readline(MAX_REQUEST_BYTES + 1)
                if not raw:
                    break
            result = rpc_error(None, -32600, "Request exceeds the 2 MiB limit")
        else:
            try:
                text = raw.decode("utf-8")
                if not text.strip():
                    continue
                result = session.response(text)
            except UnicodeError:
                result = rpc_error(None, -32700, "Request must be UTF-8")
        if result is not None:
            destination.write(json.dumps(result, ensure_ascii=False, allow_nan=False) + "\n")
            destination.flush()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--audio", help="Explicitly selected integer PCM WAV; JSON cannot select a path")
    args = parser.parse_args()
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    source = Path(args.audio) if args.audio else None
    if source is not None and source.suffix.lower() != ".wav":
        parser.error("--audio accepts only .wav")
    serve(sys.stdin.buffer, sys.stdout, source)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
