import copy
import json
import subprocess
import sys
import tempfile
import unittest
import wave
from pathlib import Path

from musiclab.common import write_bundle
from musiclab.creative import music_bundle, storyboard_bundle
from musiclab.lyrics import parse_lrc, parse_srt, edits, validate_cues, lyrics_bundle, srt_text, lrc_text
from musiclab.audio import analyze_wav, audio_bundle

ROOT = Path(__file__).resolve().parents[1]


def write_wav(path, samples, width=2, channels=1, rate=48000):
    with wave.open(str(path), "wb") as output:
        output.setnchannels(channels)
        output.setsampwidth(width)
        output.setframerate(rate)
        payload = b"".join(bytes([value + 128]) if width == 1 else int(value).to_bytes(width, "little", signed=True)
                           for value in samples)
        output.writeframes(payload)


class CreativeTests(unittest.TestCase):
    def setUp(self):
        self.music = json.loads((ROOT / "examples/music-brief.json").read_text(encoding="utf-8"))
        self.mv = json.loads((ROOT / "examples/mv-brief.json").read_text(encoding="utf-8"))

    def test_music_packages_real_requirements(self):
        files = music_bundle(self.music)
        data = json.loads(files["brief.json"])
        self.assertEqual(data["theme"], self.music["theme"])
        self.assertEqual(data["deliverables"], self.music["deliverables"])
        self.assertIn("尚未呼叫模型", files["task.md"])

    def test_music_rejects_invalid_duration_and_empty_structure(self):
        self.music["duration_seconds"] = float("nan")
        with self.assertRaises(ValueError):
            music_bundle(self.music)
        self.music["duration_seconds"] = 60
        self.music["structure"] = []
        with self.assertRaises(ValueError):
            music_bundle(self.music)

    def test_mv_covers_duration_with_exclusive_frame_end(self):
        data = json.loads(storyboard_bundle(self.mv)["storyboard.json"])
        self.assertEqual(data["shots"][-1]["end_frame_exclusive"], 1440)
        self.assertEqual(len(data["shots"]), 6)
        self.assertEqual(data["shots"][2]["purpose"], self.mv["shots"][2]["purpose"])

    def test_mv_rejects_gap_overlap_and_missing_tail(self):
        for start in (9, 11):
            brief = copy.deepcopy(self.mv)
            brief["shots"][1]["start"] = start
            with self.assertRaises(ValueError):
                storyboard_bundle(brief)
        self.mv["shots"][-1]["end"] = 59
        with self.assertRaises(ValueError):
            storyboard_bundle(self.mv)

    def test_csv_formula_input_is_literal(self):
        self.mv["shots"][0]["visual"] = '=HYPERLINK("https://example.invalid")'
        files = storyboard_bundle(self.mv)
        self.assertIn("'=HYPERLINK", files["storyboard.csv"])
        self.assertEqual(json.loads(files["storyboard.json"])["shots"][0]["visual"], self.mv["shots"][0]["visual"])


class LyricsTests(unittest.TestCase):
    def test_lrc_multitag_offset_and_precision(self):
        cues = parse_lrc("[offset:125]\n[00:01.25][00:02.125]回家\n[01:02.5]下一句")
        self.assertAlmostEqual(cues[0]["start"], 1.375)
        self.assertAlmostEqual(cues[1]["start"], 2.25)
        self.assertAlmostEqual(cues[2]["start"], 62.625)

    def test_srt_keeps_explicit_end_and_combines_multiline(self):
        cues = parse_srt("1\n00:00:01,000 --> 00:00:02,500\n第一行\n第二行\n\n2\n00:00:04,000 --> 00:00:05,000\n結尾")
        result, duration, estimated = validate_cues(cues)
        self.assertEqual(result[0]["text"], "第一行 / 第二行")
        self.assertEqual(result[0]["end"], 2.5)
        self.assertEqual(duration, 5)
        self.assertTrue(estimated)

    def test_edit_shift_time_and_text_preserves_input(self):
        source = [{"start": 1, "end": 2, "text": "原句"}, {"start": 4, "end": 5, "text": "尾句"}]
        updated = edits(source, 0.5, ["1=2"], ["2=改過的尾句"])
        self.assertEqual(source[0]["start"], 1)
        self.assertEqual(updated[0]["start"], 2)
        self.assertEqual(updated[0]["end"], 3)
        self.assertEqual(updated[1]["text"], "改過的尾句")

    def test_invalid_times_are_rejected(self):
        cases = [[{"start": -1, "text": "x"}],
                 [{"start": 1, "text": "x"}, {"start": 1, "text": "y"}],
                 [{"start": 0, "end": 3, "text": "x"}, {"start": 2, "text": "y"}],
                 [{"start": 0, "end": float("inf"), "text": "x"}]]
        for cues in cases:
            with self.assertRaises(ValueError):
                validate_cues(cues)
        with self.assertRaises(ValueError):
            validate_cues([{"start": 2, "text": "x"}], 1)

    def test_exports_roundtrip_millisecond_timing(self):
        cues, _, _ = validate_cues([{"start": 61.999, "text": "一"}, {"start": 65.125, "text": "二"}], 70)
        self.assertEqual(parse_srt(srt_text(cues)), cues)
        self.assertEqual([c["start"] for c in parse_lrc(lrc_text(cues))], [61.999, 65.125])

    def test_preview_escapes_script_close_and_title_html(self):
        bundle = lyrics_bundle([{"start": 0, "text": '</script><script>alert("x")</script>'}], '<img src=x onerror=alert(1)>', 3)
        self.assertNotIn('<img src=x', bundle["preview.html"])
        self.assertNotIn('</script><script>alert', bundle["preview.html"])
        self.assertIn("\\u003c/script>", bundle["preview.html"])

    def test_duration_inference_is_explicit(self):
        result = json.loads(lyrics_bundle([{"start": 10, "text": "最後"}])["lyrics.json"])
        self.assertTrue(result["duration_estimated"])
        self.assertEqual(result["cues"][0]["end"], 13)


class AudioTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory(prefix="zoe-music-tests-")
        self.addCleanup(self.tmp.cleanup)
        self.path = Path(self.tmp.name) / "synthetic.wav"

    def test_known_pcm_levels_for_16_24_32bit(self):
        for width in (2, 3, 4):
            scale = 2 ** (width * 8 - 1)
            write_wav(self.path, [scale // 2, -scale // 2, 0, 0], width=width)
            report = analyze_wav(self.path)
            self.assertAlmostEqual(report["per_channel"][0]["peak_dbfs"], -6.021, places=3)
            self.assertAlmostEqual(report["per_channel"][0]["rms_dbfs"], -9.031, places=3)
            self.assertEqual(report["per_channel"][0]["dc_offset"], 0)
            self.assertEqual(report["frames"], 4)
            self.assertEqual(report["bit_depth"], width * 8)

    def test_8bit_unsigned_full_scale(self):
        write_wav(self.path, [-128, 127, 0, 0], width=1)
        report = analyze_wav(self.path, bits=[8])
        self.assertEqual(report["per_channel"][0]["full_scale_samples"], 2)
        self.assertEqual(report["status"], "needs_review")

    def test_stereo_channels_are_independent(self):
        write_wav(self.path, [16384, 0, -16384, 0], channels=2)
        report = analyze_wav(self.path)
        self.assertEqual(report["frames"], 2)
        self.assertAlmostEqual(report["per_channel"][0]["peak_dbfs"], -6.021)
        self.assertIsNone(report["per_channel"][1]["peak_dbfs"])

    def test_silence_serializes_as_null_not_infinity(self):
        write_wav(self.path, [0] * 100)
        report = analyze_wav(self.path)
        data = json.loads(audio_bundle(report)["report.json"])
        self.assertIsNone(data["per_channel"][0]["rms_dbfs"])
        self.assertTrue(any("靜音" in warning for warning in data["warnings"]))

    def test_video_rate_and_custom_profile(self):
        write_wav(self.path, [1024, -1024], rate=44100)
        self.assertFalse(analyze_wav(self.path, "video")["checks"]["sample_rate"])
        self.assertTrue(analyze_wav(self.path, "video", rates=[44100])["checks"]["sample_rate"])

    def test_truncated_wav_is_rejected(self):
        write_wav(self.path, [123] * 100)
        self.path.write_bytes(self.path.read_bytes()[:-10])
        with self.assertRaises(ValueError):
            analyze_wav(self.path)

    def test_empty_or_non_wav_is_rejected(self):
        write_wav(self.path, [])
        with self.assertRaises(ValueError):
            analyze_wav(self.path)
        self.path.write_bytes(b"not a WAV")
        with self.assertRaises(ValueError):
            analyze_wav(self.path)


class IntegrationTests(unittest.TestCase):
    def test_cli_all_four_outputs_and_collision_refusal(self):
        with tempfile.TemporaryDirectory(prefix="zoe-cli-tests-") as tmp:
            target = Path(tmp)
            wav = target / "synthetic.wav"
            write_wav(wav, [1024, -1024] * 100)
            commands = [
                ["music", "--brief", str(ROOT / "examples/music-brief.json")],
                ["storyboard", "--brief", str(ROOT / "examples/mv-brief.json")],
                ["lyrics", "--input", str(ROOT / "examples/lyrics.lrc"), "--duration", "60"],
                ["audio", "--input", str(wav)],
            ]
            for command in commands:
                args = [sys.executable, str(ROOT / "music_lab.py"), *command, "--out", str(target / command[0])]
                result = subprocess.run(args, cwd=ROOT, capture_output=True, text=True, encoding="utf-8")
                self.assertEqual(result.returncode, 0, result.stderr)
                self.assertEqual(result.stderr, "")
                self.assertIn("完成", result.stdout)
                again = subprocess.run(args, cwd=ROOT, capture_output=True, text=True, encoding="utf-8")
                self.assertEqual(again.returncode, 1)
                self.assertIn("輸出已存在", again.stderr)
            self.assertTrue((target / "lyrics/preview.html").is_file())
            self.assertTrue((target / "audio/report.json").is_file())

    def test_output_refusal_leaves_bundle_untouched(self):
        with tempfile.TemporaryDirectory(prefix="zoe-output-tests-") as tmp:
            target = Path(tmp)
            (target / "old.txt").write_text("keep", encoding="utf-8")
            with self.assertRaises(ValueError):
                write_bundle(target, {"new.txt": "new", "old.txt": "replace"})
            self.assertEqual((target / "old.txt").read_text(), "keep")
            self.assertFalse((target / "new.txt").exists())


if __name__ == "__main__":
    unittest.main()
