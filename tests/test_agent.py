# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
import copy
import io
import json
import struct
import subprocess
import sys
import tempfile
import unittest
import wave
from pathlib import Path

from music_lab_agent import response, serve
from musiclab.application import MAX_REQUEST_BYTES, build

ROOT = Path(__file__).resolve().parents[1]


def request(operation, payload, request_id="original-1"):
    return {"protocol_version": 1, "id": request_id, "operation": operation, "payload": payload}


class AgentTests(unittest.TestCase):
    def test_agent_and_application_return_same_creative_exports(self):
        cases = [("music", "first-light-music.json"), ("storyboard", "first-light-mv.json")]
        for operation, name in cases:
            with self.subTest(operation=operation):
                payload = json.loads((ROOT / "examples" / name).read_text(encoding="utf-8"))
                original = copy.deepcopy(payload)
                result = response(json.dumps(request(operation, payload)))
                self.assertTrue(result["ok"])
                self.assertEqual(result["result"], build(operation, payload).wire())
                self.assertEqual(result["id"], "original-1")
                self.assertEqual(payload, original)
                self.assertFalse(result["result"]["meta"]["needs_review"])

    def test_estimated_lyrics_report_need_for_review(self):
        result = response(json.dumps(request("lyrics", {"content": "[00:01.000]原創"})))
        self.assertTrue(result["ok"])
        self.assertTrue(result["result"]["meta"]["needs_review"])
        self.assertIn("lyrics.srt", result["result"]["files"])

    def test_invalid_cue_returns_machine_error_not_traceback(self):
        result = response(json.dumps(request("lyrics", {"cues": [{"start": -1, "text": "錯誤"}]})))
        self.assertFalse(result["ok"])
        self.assertEqual(result["error"]["code"], "invalid_input")
        self.assertIn("負時間", result["error"]["message"])

    def test_request_version_shape_and_json_constants(self):
        valid = request("lyrics", {"content": "[00:00.000]原創"})
        cases = ["not json", "[]", json.dumps(dict(valid, protocol_version=2)),
                 json.dumps(dict(valid, protocol_version=True)), json.dumps(dict(valid, operation=[])),
                 json.dumps(dict(valid, output_path="ignored")),
                 json.dumps(dict(valid, payload={"duration": float("nan")})), "[" * 2000 + "]" * 2000]
        for raw in cases:
            with self.subTest(raw=raw[:60]):
                result = response(raw)
                self.assertFalse(result["ok"])
                self.assertEqual(result["error"]["code"], "invalid_request")

    def test_explicit_audio_source_and_hash_are_preserved(self):
        with tempfile.TemporaryDirectory() as folder:
            path = Path(folder) / "original.wav"
            with wave.open(str(path), "wb") as wav:
                wav.setnchannels(1); wav.setsampwidth(2); wav.setframerate(48000)
                wav.writeframes(struct.pack("<hh", 4096, -4096) * 100)
            before = path.read_bytes()
            raw = json.dumps(request("audio", {"profile": "video"}))
            self.assertFalse(response(raw)["ok"])
            result = response(raw, path)
            self.assertTrue(result["ok"])
            self.assertEqual(result["result"], build("audio", {"profile": "video"}, audio_source=path).wire())
            self.assertEqual(path.read_bytes(), before)
            forbidden = response(json.dumps(request("audio", {"path": "other.wav"})), path)
            self.assertFalse(forbidden["ok"])
            self.assertIn("不能指定", forbidden["error"]["message"])

    def test_stdio_recovers_after_oversize_encoding_and_malformed_requests(self):
        valid = json.dumps(request("lyrics", {"content": "[00:00.000]第一句", "duration": 3}), ensure_ascii=False)
        source = io.BytesIO(b"x" * (MAX_REQUEST_BYTES + 2) + b"\n\xff\ninvalid\n" + valid.encode() + b"\n")
        output = io.StringIO()
        serve(source, output)
        results = [json.loads(line) for line in output.getvalue().splitlines()]
        self.assertEqual([item.get("error", {}).get("code") for item in results[:3]],
                         ["request_too_large", "invalid_encoding", "invalid_request"])
        self.assertTrue(results[-1]["ok"])

    def test_real_agent_process_has_json_only_stdout_and_no_writes(self):
        with tempfile.TemporaryDirectory() as folder:
            before = set(Path(folder).iterdir())
            raw = json.dumps(request("lyrics", {"content": "[00:00.000]原創", "duration": 3}))
            process = subprocess.run([sys.executable, str(ROOT / "music_lab_agent.py")],
                                     input=raw + "\ninvalid\n", capture_output=True, text=True,
                                     encoding="utf-8", cwd=folder, timeout=20)
            self.assertEqual(process.returncode, 0)
            self.assertEqual(process.stderr, "")
            results = [json.loads(line) for line in process.stdout.splitlines()]
            self.assertTrue(results[0]["ok"])
            self.assertFalse(results[1]["ok"])
            self.assertEqual(set(Path(folder).iterdir()), before)

    def test_capabilities_describe_real_process(self):
        process = subprocess.run([sys.executable, str(ROOT / "music_lab_agent.py"), "--describe"],
                                 capture_output=True, text=True, encoding="utf-8", timeout=20)
        self.assertEqual(process.returncode, 0)
        data = json.loads(process.stdout)
        self.assertEqual(set(data["operations"]), {"music", "storyboard", "lyrics", "audio", "storyboard_seed", "lyrics_seed", "lyrics_review"})
        self.assertEqual(data["protocol_version"], 1)
        self.assertFalse(data["media_generated"])


if __name__ == "__main__":
    unittest.main()
