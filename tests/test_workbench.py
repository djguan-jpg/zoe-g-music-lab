# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
import copy
import http.client
import json
import math
import struct
import tempfile
import threading
import unittest
import urllib.parse
import wave
from pathlib import Path
from http.server import ThreadingHTTPServer
from musiclab.design import music_plan_bundle, motif_bundle
from musiclab.audio import analyze_wav
from music_lab_server import WorkbenchHandler, MAX_AUDIO

ROOT = Path(__file__).resolve().parents[1]


def example(name):
    return json.loads((ROOT / "examples" / name).read_text(encoding="utf-8"))


class PlanningTests(unittest.TestCase):
    def test_music_bar_math_and_source_preservation(self):
        brief = example("first-light-music.json")
        original = copy.deepcopy(brief)
        files = music_plan_bundle(brief)
        plan = json.loads(files["music-plan.json"])
        self.assertEqual(brief, original)
        self.assertEqual(plan["duration_seconds"], 136)
        self.assertEqual(plan["sections"][1]["start"], 8)
        self.assertEqual(plan["sections"][-1]["end"], 136)
        self.assertEqual(len(files), 4)
        self.assertEqual(plan["lyric_units"][0]["text_units"], 9)
        saved = json.loads(files["brief.json"])
        self.assertEqual(music_plan_bundle(saved)["music-plan.json"], files["music-plan.json"])

    def test_music_rejects_impossible_bars_meter_and_tempo(self):
        for changes in ({"bpm": 0}, {"bpm": float("nan")}, {"beats_per_bar": 3.5}):
            with self.subTest(changes=changes), self.assertRaises(ValueError):
                music_plan_bundle(dict(example("first-light-music.json"), **changes))
        brief = example("first-light-music.json")
        brief["arrangement"][0]["bars"] = 1.2
        with self.assertRaises(ValueError):
            music_plan_bundle(brief)

    def test_music_notes_are_mechanical_not_fake_generation(self):
        brief = example("first-light-music.json")
        brief["existing_lyrics"] = "很" * 30
        for section in brief["arrangement"]:
            section["energy"] = 2
        plan = json.loads(music_plan_bundle(brief)["music-plan.json"])
        self.assertEqual(len(plan["review_notes"]), 3)
        self.assertEqual(plan["status"], "design_only_not_generated")

    def test_motif_states_and_valid_explanation(self):
        files = motif_bundle(example("first-light-mv.json"))
        plan = json.loads(files["storyboard.json"])
        self.assertEqual(plan["review_notes"], [])
        self.assertEqual(len(plan["continuity"]), 4)
        self.assertIn("開口，無人緊抱", files["continuity.md"])
        self.assertEqual(motif_bundle(json.loads(files["mv-brief.json"]))["storyboard.json"], files["storyboard.json"])

    def test_motif_unexplained_change_and_missing_reference(self):
        brief = example("first-light-mv.json")
        brief["shots"][2]["change_reason"] = ""
        plan = json.loads(motif_bundle(brief)["storyboard.json"])
        self.assertEqual(plan["review_notes"][0]["shot"], 3)
        brief["shots"][0]["motif"] = "不存在"
        with self.assertRaisesRegex(ValueError, "未登記"):
            motif_bundle(brief)


class AudioEvidenceTests(unittest.TestCase):
    def test_edges_and_inverted_stereo(self):
        with tempfile.TemporaryDirectory() as folder:
            path = Path(folder) / "test.wav"
            with wave.open(str(path), "wb") as wav:
                wav.setnchannels(2)
                wav.setsampwidth(2)
                wav.setframerate(8000)
                wav.writeframes(b"\0" * 4 * 8000)
                wav.writeframes(b"".join(struct.pack("<hh", v, -v) for v in [8192, -8192] * 4000))
                wav.writeframes(b"\0" * 4 * 24000)
            report = analyze_wav(path, rates=[8000])
            self.assertEqual(report["quiet_regions"]["leading_seconds"], 1)
            self.assertEqual(report["quiet_regions"]["trailing_seconds"], 3)
            self.assertEqual(report["stereo_correlation"], -1)
            self.assertTrue(any("相消" in note for note in report["warnings"]))
            self.assertTrue(any("安靜段" in note for note in report["warnings"]))

    def test_silent_correlation_is_unmeasurable(self):
        with tempfile.TemporaryDirectory() as folder:
            path = Path(folder) / "silent.wav"
            with wave.open(str(path), "wb") as wav:
                wav.setnchannels(2)
                wav.setsampwidth(2)
                wav.setframerate(8000)
                wav.writeframes(b"\0" * 400)
            report = analyze_wav(path)
            self.assertIsNone(report["stereo_correlation"])
            self.assertEqual(report["quiet_regions"]["quiet_frame_ratio"], 1)
            self.assertEqual(report["quiet_regions"]["leading_seconds"], .0125)


class WorkbenchHTTPTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.server = ThreadingHTTPServer(("127.0.0.1", 0), WorkbenchHandler)
        cls.thread = threading.Thread(target=cls.server.serve_forever, daemon=True)
        cls.thread.start()

    @classmethod
    def tearDownClass(cls):
        cls.server.shutdown()
        cls.server.server_close()
        cls.thread.join(5)

    def request(self, method, path, body=None, headers=None):
        connection = http.client.HTTPConnection("127.0.0.1", self.server.server_port, timeout=10)
        try:
            connection.request(method, path, body, headers or {})
            response = connection.getresponse()
            return response.status, dict(response.getheaders()), response.read()
        finally:
            connection.close()

    def post_json(self, path, data):
        status, headers, raw = self.request("POST", path, json.dumps(data).encode(), {"Content-Type": "application/json"})
        return status, json.loads(raw)

    def test_seed_http_matches_shared_boundary_and_rejects_bad_options(self):
        from musiclab.application import build
        brief = json.loads((ROOT / 'examples/first-light-music.json').read_text(encoding='utf-8'))
        payload = {'music': brief, 'fps': 29.97, 'bars_per_shot': 5}
        status, result = self.post_json('/api/storyboard-seed', payload)
        self.assertEqual(status, 200)
        self.assertEqual(result, build('storyboard_seed', payload).wire())
        status, result = self.post_json('/api/storyboard-seed', {'music': brief, 'bars_per_shot': 0})
        self.assertEqual(status, 400)
        self.assertIn('小節', result['error'])
        for asset in ('/storyboard-seed.js', '/draft-undo.js', '/replacement-preview.js'):
            status, _, raw = self.request('GET', asset)
            self.assertEqual(status, 200)
            self.assertEqual(raw, (ROOT / 'web' / asset[1:]).read_bytes())

    def test_seed_import_http_preserves_exact_data_and_refuses_unknown_extensions(self):
        from musiclab.application import build
        brief=json.loads((ROOT/'examples/first-light-music.json').read_text(encoding='utf-8'))
        data=build('storyboard_seed',{'music':brief}).data
        status,result=self.post_json('/api/storyboard-seed',{'seed':data})
        self.assertEqual(status,200);self.assertEqual(result,build('storyboard_seed',{'seed':data}).wire())
        data['slots'][0]['visual']='must not silently drop'
        status,result=self.post_json('/api/storyboard-seed',{'seed':data})
        self.assertEqual(status,400);self.assertIn('未知欄位',result['error'])

    def test_page_and_assets_are_allowlisted(self):
        status, headers, raw = self.request("GET", "/")
        self.assertEqual(status, 200)
        self.assertIn("ZOE. G Music Lab", raw.decode())
        self.assertIn("default-src 'self'", headers["Content-Security-Policy"])
        status, headers, raw = self.request("GET", "/deletion-history.js")
        self.assertEqual(status, 200)
        self.assertIn("text/javascript", headers["Content-Type"])
        self.assertEqual(raw, (ROOT / "web/deletion-history.js").read_bytes())
        for path in ("/README.md", "/../README.md", "/does-not-exist"):
            self.assertEqual(self.request("GET", path)[0], 404)

    def test_license_notice_and_agent_discovery_are_served(self):
        status, headers, raw = self.request("GET", "/license")
        self.assertEqual(status, 200)
        self.assertEqual(raw, (ROOT / "LICENSE").read_bytes())
        self.assertIn("nosniff", headers["X-Content-Type-Options"])
        status, _, raw = self.request("GET", "/notice")
        self.assertEqual(status, 200)
        self.assertIn("Required Notice: ZOE. G", raw.decode())
        status, _, raw = self.request("GET", "/api/capabilities")
        self.assertEqual(status, 200)
        data = json.loads(raw)
        self.assertEqual(data["license"], "PolyForm-Noncommercial-1.0.0")
        self.assertEqual(data["protocol_version"], 1)
        self.assertEqual(len(data["operations"]), 8)

    def test_external_host_and_origin_are_rejected(self):
        self.assertEqual(self.request("GET", "/", headers={"Host": "example.com"})[0], 403)
        self.assertEqual(self.request("POST", "/api/music", b"{}", {"Origin": "https://example.com"})[0], 403)

    def test_both_planning_flows_return_real_exports(self):
        status, result = self.post_json("/api/music", example("first-light-music.json"))
        self.assertEqual(status, 200)
        self.assertEqual(result["data"]["duration_seconds"], 136)
        self.assertIn("記憶點", result["files"]["music-plan.md"])
        status, result = self.post_json("/api/storyboard", example("first-light-mv.json"))
        self.assertEqual(status, 200)
        self.assertIn("continuity.md", result["files"])

    def test_lyrics_roundtrip_and_overlap_refusal(self):
        status, result = self.post_json("/api/lyrics", {"content": "[00:01.250]原創一句\n[00:05.500]另一句", "duration": 9})
        self.assertEqual(status, 200)
        self.assertIn("00:00:01,250", result["files"]["lyrics.srt"])
        self.assertEqual(result["data"]["cues"][-1]["end"], 9)
        status, result = self.post_json("/api/lyrics", {"cues": [{"start": 0, "end": 8, "text": "甲"}, {"start": 5, "end": 9, "text": "乙"}]})
        self.assertEqual(status, 400)
        self.assertIn("重疊", result["error"])

    def test_ambiguous_lyrics_return_http_error_without_breaking_next_operation(self):
        cues = [{"start": 0, "end": 2, "text": "保留逐句"}]
        status, result = self.post_json("/api/lyrics", {"cues": cues, "content": "另一份原文"})
        self.assertEqual(status, 400)
        self.assertIn("cues 或 content", result["error"])
        status, result = self.post_json("/api/lyrics", {"cues": cues, "duration": 2})
        self.assertEqual(status, 200)
        self.assertEqual(result["data"]["cues"], cues)
        status, _, raw = self.request("GET", "/api/capabilities")
        self.assertEqual(status, 200)
        schema = json.loads(raw)["input_schemas"]["music"]
        self.assertIn("language", schema["properties"])

    def test_wav_upload_is_analyzed_and_named_without_path_access(self):
        import io
        stream = io.BytesIO()
        with wave.open(stream, "wb") as wav:
            wav.setnchannels(1)
            wav.setsampwidth(2)
            wav.setframerate(48000)
            wav.writeframes(struct.pack("<h", 4096) * 480)
        status, _, raw = self.request("POST", "/api/audio?name=example.wav", stream.getvalue())
        data = json.loads(raw)
        self.assertEqual(status, 200)
        self.assertEqual(data["data"]["file"], "example.wav")
        self.assertAlmostEqual(data["data"]["per_channel"][0]["peak_dbfs"], -18.062, places=3)
        self.assertIn("report.md", data["files"])

    def test_actual_download_response_is_utf8_attachment(self):
        content = "[00:01.250]原創測試\n"
        body = urllib.parse.urlencode({"name": "lyrics.lrc", "content": content})
        status, headers, raw = self.request("POST", "/api/export", body,
                                            {"Content-Type": "application/x-www-form-urlencoded"})
        self.assertEqual(status, 200)
        self.assertEqual(raw.decode("utf-8"), content)
        self.assertEqual(headers["Content-Disposition"], 'attachment; filename="lyrics.lrc"')
        self.assertEqual(int(headers["Content-Length"]), len(raw))
        self.assertEqual(self.request("POST", "/api/export", "name=../bad&content=x")[0], 400)

    def test_oversize_malformed_and_wrong_input_are_rejected(self):
        self.assertEqual(self.request("POST", "/api/audio", b"", {"Content-Length": str(MAX_AUDIO + 1)})[0], 413)
        self.assertEqual(self.request("POST", "/api/music", b"invalid")[0], 400)
        self.assertEqual(self.post_json("/api/music", [])[0], 400)

    def test_deep_json_is_rejected_with_a_response_and_server_recovers(self):
        status, _, raw = self.request("POST", "/api/music", b"[" * 2000 + b"]" * 2000)
        self.assertEqual(status, 400)
        self.assertIn("error", json.loads(raw))
        self.assertEqual(self.post_json("/api/music", example("first-light-music.json"))[0], 200)


if __name__ == "__main__":
    unittest.main()
