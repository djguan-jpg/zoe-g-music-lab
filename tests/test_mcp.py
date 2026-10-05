# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
import hashlib
import io
import json
import subprocess
import sys
import tempfile
import unittest
import wave
from pathlib import Path

from music_lab_mcp import MCP_VERSION, Session, serve
from musiclab.application import MAX_REQUEST_BYTES, build

ROOT = Path(__file__).resolve().parents[1]


def message(method, params=None, request_id=1):
    result = {"jsonrpc": "2.0", "id": request_id, "method": method}
    if params is not None:
        result["params"] = params
    return result


def initialize(version=MCP_VERSION):
    return message("initialize", {"protocolVersion": version, "capabilities": {},
                                  "clientInfo": {"name": "original-test-client", "version": "1.0"}})


def ready_session(source=None):
    session = Session(source)
    session.response(json.dumps(initialize()))
    session.response(json.dumps({"jsonrpc": "2.0", "method": "notifications/initialized"}))
    return session


def call(name, payload, request_id=3):
    return message("tools/call", {"name": name, "arguments": {"payload": payload}}, request_id)


class MCPTests(unittest.TestCase):
    def test_generated_launch_settings_work_from_another_directory(self):
        with tempfile.TemporaryDirectory() as folder:
            descriptor = subprocess.run([sys.executable, "-X", "utf8", str(ROOT / "scripts/agent_launch.py")],
                                        cwd=folder, capture_output=True, encoding="utf-8", timeout=10)
            self.assertEqual(descriptor.returncode, 0, descriptor.stderr)
            config = json.loads(descriptor.stdout)
            requests = [initialize(), {"jsonrpc": "2.0", "method": "notifications/initialized"},
                        call("lyrics_validate", {"content": "[00:00.000]接入測試", "duration": 3})]
            result = subprocess.run([config["command"], *config["args"]], cwd=folder,
                                    input="".join(json.dumps(item, ensure_ascii=False) + "\n" for item in requests),
                                    capture_output=True, encoding="utf-8", timeout=config["tool_timeout_sec"])
            self.assertEqual(result.returncode, 0, result.stderr)
            replies = [json.loads(line) for line in result.stdout.splitlines()]
            self.assertEqual(len(replies), 2)
            self.assertIn("接入測試", replies[1]["result"]["structuredContent"]["files"]["lyrics.lrc"])
            self.assertEqual(list(Path(folder).iterdir()), [])

    def test_real_subprocess_sixteen_tools_match_application_and_exit_on_eof(self):
        with tempfile.TemporaryDirectory() as folder:
            source = Path(folder) / "synthetic.wav"
            with wave.open(str(source), "wb") as wav:
                wav.setnchannels(1)
                wav.setsampwidth(2)
                wav.setframerate(48000)
                wav.writeframes(b"\x00\x10" * 480)
            original = hashlib.sha256(source.read_bytes()).hexdigest()
            from musiclab.delivery_package import prepare
            delivery=Path(folder)/'selected-delivery.zip';delivery.write_bytes(prepare({'scope':'music','files':{'plan.md':'原創文字'}}).archive)
            cases = [("music_plan", "music", json.loads((ROOT / "examples/first-light-music.json").read_text(encoding="utf-8"))),
                     ("storyboard_plan", "storyboard", json.loads((ROOT / "examples/first-light-mv.json").read_text(encoding="utf-8"))),
                     ("lyrics_validate", "lyrics", {"cues": [{"start": 0, "end": 3, "text": "原創"}]}),
                     ("audio_report", "audio", {"profile": "video"}),
                     ("storyboard_seed", "storyboard_seed", {"music": json.loads((ROOT / "examples/first-light-music.json").read_text(encoding="utf-8"))}),
                     ("lyrics_seed", "lyrics_seed", {"title":"未校時", "text":"原創\n原創"}),
                     ("lyrics_review", "lyrics_review", {"cues":[{"start":"","end":"","text":"未完成"}]}),
                     ("lyrics_search", "lyrics_search", {"texts":["原句", "未校時原句"],"query":"原句"}),
                     ("storyboard_search", "storyboard_search", {"shots":[dict.fromkeys(("section","purpose","visual","camera","transition","motif_state","character_state","change_reason"), "原文")],"query":"原文"}),
                     ("lyrics_export_review", "lyrics_export_review", {"package": build("lyrics", {"cues":[{"start":0,"end":1,"text":"[00:04]原句"}],"duration":2}).data}),
                     ("music_review", "music_review", json.loads((ROOT / "examples/unfinished-song-review.json").read_text(encoding="utf-8"))),
                     ("storyboard_review", "storyboard_review", json.loads((ROOT / "examples/unfinished-storyboard-review.json").read_text(encoding="utf-8"))),
                     ("storyboard_timing_review", "storyboard_timing_review", json.loads((ROOT / "examples/unfinished-storyboard-timing-review.json").read_text(encoding="utf-8"))),
                     ("delivery_package", "delivery_package", {"scope":"music","files":{"plan.md":"原創文字"}}),
                     ("delivery_inspect", "delivery_inspect", {}),
                     ("audio_acceptance_review", "audio_acceptance_review", {"document": {"format":"zoe-audio-acceptance-draft","schema_version":1,"profile":"video","custom":True,"fields":{"rates":"","bits":"16.5","channels":"0"}}})]
            requests = [initialize(), {"jsonrpc": "2.0", "method": "notifications/initialized"},
                        message("tools/list", request_id=2)]
            requests.extend(call(name, payload, i + 3) for i, (name, _, payload) in enumerate(cases))
            process = subprocess.run([sys.executable, "-X", "utf8", str(ROOT / "music_lab_mcp.py"), "--audio", str(source), "--delivery-zip", str(delivery)],
                                     input="".join(json.dumps(item, ensure_ascii=False) + "\n" for item in requests),
                                     capture_output=True, encoding="utf-8", cwd=folder, timeout=30)
            self.assertEqual(process.returncode, 0, process.stderr)
            self.assertEqual(process.stderr, "")
            replies = [json.loads(line) for line in process.stdout.splitlines()]
            self.assertEqual(len(replies), 2 + len(cases))  # Notifications must not yield responses.
            self.assertEqual(replies[0]["result"]["protocolVersion"], MCP_VERSION)
            tools = replies[1]["result"]["tools"]
            self.assertEqual([tool["name"] for tool in tools], [item[0] for item in cases])
            for reply, (_, operation, payload) in zip(replies[2:], cases):
                self.assertFalse(reply["result"]["isError"])
                data = reply["result"]["structuredContent"]
                self.assertEqual(data, build(operation, payload, audio_source=source, delivery_source=delivery).wire())
                self.assertEqual(json.loads(reply["result"]["content"][0]["text"]), data)
            self.assertEqual(hashlib.sha256(source.read_bytes()).hexdigest(), original)
            self.assertEqual(sorted(file.name for file in Path(folder).iterdir()), ["selected-delivery.zip", "synthetic.wav"])

    def test_unknown_version_rejects_and_can_retry_supported_version(self):
        session = Session()
        for version in ("1900-01-01", "2026-07-28", True):
            result = session.response(json.dumps(initialize(version)))
            self.assertEqual(result["error"]["code"], -32602)
            self.assertEqual(result["error"]["data"]["supported"], [MCP_VERSION])
        self.assertIn("result", session.response(json.dumps(initialize())))

    def test_tools_cannot_execute_before_handshake_completes(self):
        session = Session()
        self.assertIn("error", session.response(json.dumps(call("lyrics_validate", {}))))
        session.response(json.dumps(initialize()))
        self.assertIsNone(session.response('{"jsonrpc":"2.0","method":"notifications/initialized","params":[]}'))
        self.assertIn("error", session.response(json.dumps(call("lyrics_validate", {}))))
        self.assertIsNone(session.response('{"jsonrpc":"2.0","method":"notifications/initialized"}'))
        self.assertIn("tools", session.response(json.dumps(message("tools/list")))["result"])
        self.assertIn("error", session.response(json.dumps(initialize())))

    def test_bad_execution_returns_actionable_tool_error_and_later_call_succeeds(self):
        session = ready_session()
        error = session.response(json.dumps(call("lyrics_validate", {"cues": [{"start": -1, "text": "錯誤"}]})))
        self.assertTrue(error["result"]["isError"])
        self.assertIn("負時間", error["result"]["content"][0]["text"])
        good = session.response(json.dumps(call("lyrics_validate", {"content": "[00:00.000]原創", "duration": 3})))
        self.assertFalse(good["result"]["isError"])

    def test_protocol_errors_are_separate_from_execution_errors(self):
        session = ready_session()
        self.assertEqual(session.response(json.dumps(message("server/discover")))["error"]["code"], -32601)
        self.assertEqual(session.response(json.dumps(call("unknown", {})))["error"]["code"], -32602)
        self.assertEqual(session.response(json.dumps(message("tools/call", [])))["error"]["code"], -32602)
        self.assertEqual(session.response(json.dumps(message("tools/call", {"name": "lyrics_validate", "task": {}})))["error"]["code"], -32602)
        self.assertTrue(session.response(json.dumps(message("tools/call", {"name": "music_plan", "arguments": {}})))["result"]["isError"])

    def test_audio_cannot_read_json_paths_or_expose_os_error_paths(self):
        with tempfile.TemporaryDirectory() as folder:
            source = Path(folder) / "not-present.wav"
            session = ready_session(source)
            error = session.response(json.dumps(call("audio_report", {"path": str(source)})))
            self.assertTrue(error["result"]["isError"])
            error = session.response(json.dumps(call("audio_report", {})))
            self.assertTrue(error["result"]["isError"])
            self.assertNotIn(folder, json.dumps(error))

    def test_bad_frames_recover_and_notifications_stay_silent(self):
        frames = [b"x" * (MAX_REQUEST_BYTES + 1) + b"\n", b"\xff\n", b"[]\n",
                  b"[" * 2000 + b"]" * 2000 + b"\n",
                  json.dumps(message("ping", request_id=True)).encode() + b"\n",
                  b'{"jsonrpc":"2.0","method":"unknown-notification"}\n',
                  json.dumps(message("ping", request_id="after-errors")).encode() + b"\n"]
        output = io.StringIO()
        serve(io.BytesIO(b"".join(frames)), output)
        replies = [json.loads(line) for line in output.getvalue().splitlines()]
        self.assertEqual(len(replies), 6)
        self.assertEqual([reply["error"]["code"] for reply in replies[:-1]], [-32600, -32700, -32600, -32700, -32600])
        self.assertEqual(replies[-1], {"jsonrpc": "2.0", "id": "after-errors", "result": {}})


if __name__ == "__main__":
    unittest.main()
