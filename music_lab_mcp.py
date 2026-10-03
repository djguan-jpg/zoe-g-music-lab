# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
"""Dependency-free local MCP stdio tools for the explicit 2025-11-25 revision.

Original adapter based on the public specification; no SDK code copied.
Only application.build performs domain work. No model or network. Draft writes require an explicit library at launch.
"""
import argparse
import json
import sys
from pathlib import Path

from musiclab import __version__
from musiclab.application import MAX_REQUEST_BYTES, OPERATIONS, LIBRARY_OPERATIONS, build, load_request
from musiclab.draft_library import DraftLibrary
from musiclab.tool_contracts import input_schema, output_schema

MCP_VERSION = "2025-11-25"
TOOLS = {"music_plan": "music", "storyboard_plan": "storyboard",
         "lyrics_validate": "lyrics", "audio_report": "audio", "storyboard_seed": "storyboard_seed",
         "lyrics_seed": "lyrics_seed", "lyrics_review": "lyrics_review", "music_review": "music_review", "storyboard_review": "storyboard_review"}



LIBRARY_TOOLS = {name: name for name in LIBRARY_OPERATIONS}


def tool_list(draft_library=None):
    operations = {**OPERATIONS, **LIBRARY_OPERATIONS}
    tools = {**TOOLS, **(LIBRARY_TOOLS if draft_library is not None else {})}
    return [{"name": name, "description": operations[operation],
             "title": name.replace("_", " ").title(),
             "inputSchema": input_schema(operation), "outputSchema": output_schema(),
             "execution": {"taskSupport": "forbidden"},
             "annotations": {"readOnlyHint": operation not in ("draft_save", "draft_backup_restore"), "destructiveHint": False,
                             "idempotentHint": True, "openWorldHint": False}}
            for name, operation in tools.items()]


def rpc_error(request_id, code, message, data=None):
    error = {"code": code, "message": message}
    if data is not None:
        error["data"] = data
    return {"jsonrpc": "2.0", "id": request_id, "error": error}


def tool_error(message):
    return {"content": [{"type": "text", "text": message}], "isError": True}


class Session:
    def __init__(self, audio_source=None, draft_library=None, backup_source=None):
        self.backup_source = backup_source
        self.draft_library = draft_library
        self.tools = {**TOOLS, **(LIBRARY_TOOLS if draft_library is not None else {})}
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
                                      "No AI generation or automatic exports; review returned content." +
                                      (" Draft save/read/list are enabled only in the selected library; saved drafts need creative validation." if self.draft_library is not None else "")}
        elif method not in ("tools/list", "tools/call"):
            return rpc_error(request_id, -32601, "Method not supported")
        elif not self.ready:
            return rpc_error(request_id, -32600, "Send initialize then notifications/initialized before using tools")
        elif method == "tools/list":
            if params.get("cursor") is not None:
                return rpc_error(request_id, -32602, "The complete static tool list has no cursor")
            result = {"tools": tool_list(self.draft_library)}
        else:
            if "task" in params:
                return rpc_error(request_id, -32602, "Task-augmented execution is not supported")
            name, arguments = params.get("name"), params.get("arguments")
            if not isinstance(name, str) or name not in self.tools:
                return rpc_error(request_id, -32602, "Unknown tool")
            if "arguments" in params and not isinstance(arguments, dict):
                return rpc_error(request_id, -32602, "arguments must be an object")
            if not isinstance(arguments, dict) or set(arguments) != {"payload"} or not isinstance(arguments["payload"], dict):
                result = tool_error("arguments must contain exactly one object: payload")
            else:
                try:
                    data = build(self.tools[name], arguments["payload"], audio_source=self.audio_source, draft_library=self.draft_library, backup_source=self.backup_source).wire()
                    result = {"content": [{"type": "text", "text": json.dumps(data, ensure_ascii=False, allow_nan=False)}],
                              "structuredContent": data, "isError": False}
                except (ValueError, TypeError, KeyError, AttributeError, UnicodeError, RecursionError) as error:
                    result = tool_error(str(error))
                except OSError:
                    result = tool_error("The explicitly selected WAV cannot be read")
                except Exception:
                    return rpc_error(request_id, -32603, "Local operation did not complete")
        return {"jsonrpc": "2.0", "id": request_id, "result": result}


def serve(source, destination, audio_source=None, draft_library=None, backup_source=None):
    session = Session(audio_source, draft_library, backup_source)
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
    parser.add_argument("--draft-library", help="Explicit selected directory enables immutable draft tools")
    parser.add_argument("--draft-backup", help="Explicit backup ZIP for preview and immutable restore")
    args = parser.parse_args()
    if args.draft_backup and not args.draft_library:
        parser.error("--draft-backup requires --draft-library")
    backup_source = Path(args.draft_backup) if args.draft_backup else None
    if backup_source is not None and backup_source.suffix.lower() != ".zip":
        parser.error("--draft-backup accepts only .zip")
    library = DraftLibrary(args.draft_library) if args.draft_library else None
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    source = Path(args.audio) if args.audio else None
    if source is not None and source.suffix.lower() != ".wav":
        parser.error("--audio accepts only .wav")
    serve(sys.stdin.buffer, sys.stdout, source, library, backup_source)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
