# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
import hashlib
import http.client
import io
import json
import math
import struct
import subprocess
import sys
import tempfile
import threading
import unittest
import wave
from pathlib import Path
from unittest.mock import patch

from musiclab.audio import analyze_wav, audio_bundle
from musiclab.application import build, capabilities
from musiclab.loudness import (EnergyMeter, measurement, coefficients, complete_blocks,
                               window_frames, SHELF, HIGH_PASS, ABSOLUTE_ENERGY)
from musiclab.loudness_blocks import EnergyBlocks
from music_lab_server import WorkbenchServer, WorkbenchHandler

ROOT = Path(__file__).resolve().parents[1]


def tone_bytes(rate=8000, channels=1, frames=None, amplitude=.1, antiphase=False, frequency=1000):
    frames = rate if frames is None else frames
    stream = io.BytesIO()
    with wave.open(stream, 'wb') as wav:
        wav.setnchannels(channels); wav.setsampwidth(2); wav.setframerate(rate)
        for start in range(0, frames, 8192):
            raw = bytearray()
            for i in range(start, min(frames, start + 8192)):
                sample = round(32767 * amplitude * math.sin(2 * math.pi * frequency * i / rate))
                values = [sample] * channels
                if antiphase and channels == 2: values[1] = -sample
                raw.extend(struct.pack('<' + 'h' * channels, *values))
            wav.writeframes(raw)
    return stream.getvalue()


class LoudnessTests(unittest.TestCase):
    def analyze(self, raw):
        with tempfile.TemporaryDirectory() as folder:
            path = Path(folder)/'chosen.wav'; path.write_bytes(raw)
            report = analyze_wav(path)
            self.assertEqual(path.read_bytes(), raw)
            self.assertEqual(report['sha256'], hashlib.sha256(raw).hexdigest())
            return report

    def test_reference_48k_coefficients_and_stability_across_supported_rates(self):
        self.assertEqual(coefficients(48000), (SHELF, HIGH_PASS))
        for rate in (8000, 11025, 44100, 44117, 96000, 192000):
            for b, a in coefficients(rate):
                self.assertTrue(all(math.isfinite(v) for v in b + a))
                self.assertLess(abs(a[2]), 1)
                self.assertGreater(1 + a[1] + a[2], 0)
                self.assertGreater(1 - a[1] + a[2], 0)

    def test_invalid_meter_configuration_and_frames_refuse(self):
        for rate in (7999, 192001, 48000.0, True):
            with self.assertRaises(ValueError): EnergyMeter(rate, 1)
        for channels in (0, 3, 1.0, True):
            with self.assertRaises(ValueError): EnergyMeter(8000, channels)
        meter = EnergyMeter(8000, 2)
        for values in ([0], [0, 0, 0], [0, float('nan')], [True, 0], [0, float('inf')]):
            with self.assertRaises(ValueError): meter.push(values)
        self.assertEqual(meter.frames, 0)

    def test_one_kilohertz_calibration_is_not_rms_renamed(self):
        report = self.analyze(tone_bytes(rate=48000))
        self.assertAlmostEqual(report['loudness']['integrated_lufs'], -23.004, delta=.01)
        self.assertAlmostEqual(report['per_channel'][0]['rms_dbfs'], -23.01, delta=.01)
        low = self.analyze(tone_bytes(rate=48000, frequency=50))
        self.assertAlmostEqual(low['per_channel'][0]['rms_dbfs'], report['per_channel'][0]['rms_dbfs'], delta=.002)
        self.assertLess(low['loudness']['integrated_lufs'], report['loudness']['integrated_lufs'] - 4)
        self.assertEqual(low['loudness']['status'], 'measured')
        self.assertEqual(low['loudness']['unit'], 'LUFS')

    def test_stereo_adds_channel_energy_even_in_antiphase(self):
        mono = self.analyze(tone_bytes())['loudness']['integrated_lufs']
        stereo = self.analyze(tone_bytes(channels=2))
        opposite = self.analyze(tone_bytes(channels=2, antiphase=True))
        self.assertAlmostEqual(stereo['loudness']['integrated_lufs'] - mono, 10 * math.log10(2), places=5)
        self.assertEqual(stereo['loudness'], opposite['loudness'])
        self.assertEqual(opposite['stereo_correlation'], -1)
        self.assertEqual(opposite['status'], 'needs_review')

    def test_gain_change_has_expected_loudness_difference(self):
        loud = self.analyze(tone_bytes(amplitude=.2))['loudness']['integrated_lufs']
        quiet = self.analyze(tone_bytes(amplitude=.1))['loudness']['integrated_lufs']
        self.assertAlmostEqual(loud - quiet, 20 * math.log10(2), delta=.002)

    def test_short_and_exact_block_boundary_and_tail(self):
        for frames, status, count, tail in ((3199, 'insufficient_duration', 0, 3199),
                                             (3200, 'measured', 1, 0), (3201, 'measured', 1, 1),
                                             (3999, 'measured', 1, 799), (4000, 'measured', 2, 0)):
            m = self.analyze(tone_bytes(frames=frames))['loudness']
            self.assertEqual((m['status'], m['complete_block_count'], m['tail_frames']), (status, count, tail))

    def test_silence_and_below_gate_return_null_not_fake_zero_or_floor(self):
        for amplitude in (0, .0001):
            report = self.analyze(tone_bytes(amplitude=amplitude))
            m = report['loudness']
            self.assertEqual(m['status'], 'below_gate')
            self.assertIsNone(m['integrated_lufs']); self.assertIsNone(m['relative_gate_lufs'])
            self.assertEqual((m['absolute_gate_block_count'], m['gated_block_count']), (0, 0))
        self.assertTrue(any('數位靜音' in w for w in self.analyze(tone_bytes(amplitude=0))['warnings']))

    def test_unavailable_loudness_does_not_add_technical_warning(self):
        report = self.analyze(tone_bytes(rate=48000, frames=9600))
        self.assertEqual(report['loudness']['status'], 'insufficient_duration')
        self.assertEqual(report['warnings'], [])
        self.assertEqual(report['status'], 'technical_checks_passed')

    def test_unsupported_channel_roles_and_rates_preserve_pcm_evidence(self):
        for rate, channels, expected in ((8000, 3, 'unsupported_channels'), (7999, 1, 'unsupported_sample_rate'),
                                          (192001, 1, 'unsupported_sample_rate'), (7999, 3, 'unsupported_channels')):
            report = self.analyze(tone_bytes(rate=rate, channels=channels, frames=4000))
            m = report['loudness']
            self.assertEqual(m['status'], expected); self.assertIsNone(m['integrated_lufs'])
            self.assertEqual(m['channel_weights'], []); self.assertIsNone(m['window_frames'])
            self.assertEqual(m['complete_block_count'], 0)
            self.assertEqual(len(report['per_channel']), channels)

    def test_strict_absolute_then_relative_gate(self):
        # Seven complete windows; low-energy windows pass the absolute gate,
        # then fail the relative gate computed from that complete first pass.
        energies = [1, 1, .001, .001, .001, .001, .001]
        result = measurement(8000, 1, 8000, lambda: iter(energies))
        self.assertEqual((result['absolute_gate_block_count'], result['gated_block_count']), (7, 2))
        self.assertEqual(result['integrated_lufs'], -.691)
        self.assertAlmostEqual(result['relative_gate_lufs'], -.691 + 10 * math.log10(sum(energies)/7) - 10, places=6)
        boundary = measurement(8000, 1, 3200, lambda: iter([ABSOLUTE_ENERGY]))
        self.assertEqual(boundary['status'], 'below_gate')

    def test_bad_or_incomplete_block_streams_refuse(self):
        for energies in ([], [1, 2], [-1], [float('nan')], [True], [float('inf')]):
            with self.assertRaises(ValueError): measurement(8000, 1, 3200, lambda: iter(energies))
        changed = iter(([1], []))
        with self.assertRaises(ValueError): measurement(8000, 1, 3200, lambda: iter(next(changed)))
        for frames in (0, True, 3200.0):
            with self.assertRaises(ValueError): measurement(8000, 1, frames, lambda: iter([]))

    def test_odd_rate_nearest_sample_schedule_and_chunk_independence(self):
        rate, frames = 11025, 13337
        values = [[.1 * math.sin(2 * math.pi * 500 * i/rate)] for i in range(frames)]
        def stream(chunks):
            meter = EnergyMeter(rate, 1); blocks = []
            for start, end in chunks:
                for frame in values[start:end]:
                    energy = meter.push(frame)
                    if energy is not None: blocks.append(energy)
            self.assertLessEqual(len(meter.history), window_frames(rate))
            self.assertEqual(meter.block_count, complete_blocks(rate, frames))
            return measurement(rate, 1, frames, lambda: iter(blocks))
        whole = stream([(0, frames)])
        split = stream([(i, min(i+137, frames)) for i in range(0, frames, 137)])
        self.assertEqual(whole, split)
        ends = [window_frames(rate) + (i * rate + 5)//10 for i in range(whole['complete_block_count'])]
        self.assertEqual(whole['tail_frames'], frames - ends[-1])

    def test_large_ledger_spills_reiterates_and_closes_without_overwrite(self):
        with EnergyBlocks(max_memory_bytes=8) as ledger:
            for i in range(10000): ledger.append(i/10000)
            self.assertTrue(ledger.file._rolled)
            self.assertEqual(sum(1 for _ in ledger), 10000)
            self.assertAlmostEqual(sum(ledger), 4999.5)
            self.assertEqual(list(ledger)[:2], [0, .0001])
            with self.assertRaises(ValueError): ledger.append(.2)
        self.assertTrue(ledger.file.closed)

    def test_ledger_validation_and_exception_cleanup(self):
        for energy in (-1, True, float('nan'), float('inf')):
            with EnergyBlocks() as ledger:
                with self.assertRaises(ValueError): ledger.append(energy)
                self.assertEqual(ledger.count, 0)
        with self.assertRaisesRegex(RuntimeError, 'controlled'):
            with EnergyBlocks() as ledger: raise RuntimeError('controlled')
        self.assertTrue(ledger.file.closed)
        with EnergyBlocks() as ledger:
            ledger.append(.1); ledger.file.truncate(7)
            with self.assertRaises(ValueError): list(ledger)

    def test_analysis_closes_owned_energy_ledger_on_success_and_domain_failure(self):
        captured = []; factory = tempfile.SpooledTemporaryFile
        def capture(*args, **kwargs):
            file = factory(*args, **kwargs); captured.append(file); return file
        with tempfile.TemporaryDirectory() as folder:
            path = Path(folder)/'chosen.wav'; path.write_bytes(tone_bytes())
            with patch('musiclab.loudness_blocks.tempfile.SpooledTemporaryFile', side_effect=capture):
                analyze_wav(path)
                self.assertTrue(captured); self.assertTrue(all(f.closed for f in captured))
                with patch('musiclab.audio.measurement', side_effect=ValueError('controlled')):
                    with self.assertRaisesRegex(ValueError, 'controlled'): analyze_wav(path)
                self.assertTrue(all(f.closed for f in captured))

    def test_measurement_uses_same_hashed_copy_after_source_replacement(self):
        original, replacement = tone_bytes(amplitude=.1), tone_bytes(amplitude=.5)
        expected = self.analyze(original)['loudness']
        with tempfile.TemporaryDirectory() as folder:
            path = Path(folder)/'chosen.wav'; path.write_bytes(original); real_open = wave.open
            def replace(*args, **kwargs):
                path.write_bytes(replacement)
                return real_open(*args, **kwargs)
            with patch('musiclab.audio.wave.open', side_effect=replace): report = analyze_wav(path)
            self.assertEqual(report['loudness'], expected)
            self.assertEqual(report['sha256'], hashlib.sha256(original).hexdigest())
            self.assertEqual(path.read_bytes(), replacement)

    def test_report_metadata_and_markdown_separate_rms_loudness_and_limits(self):
        report = self.analyze(tone_bytes()); text = audio_bundle(report)['report.md']
        self.assertIn('## 整合響度', text); self.assertIn('LUFS', text)
        self.assertIn('RMS 不是 LUFS', text); self.assertIn('未正規化', text)
        self.assertIn('尚非完整規範認證', text)
        self.assertEqual(report['loudness']['schema_version'], 1)
        description = capabilities()['audio_loudness']
        self.assertEqual(description['sample_rate_range'], [8000, 192000])
        self.assertFalse(description['normalization']); self.assertFalse(description['true_peak_measured'])
        self.assertEqual(capabilities()['protocol_version'], 1)

    def test_real_cli_agent_mcp_and_http_share_the_measured_result(self):
        raw = tone_bytes()
        with tempfile.TemporaryDirectory() as folder:
            path = Path(folder)/'chosen.wav'; path.write_bytes(raw); output = Path(folder)/'report'
            expected = build('audio', {}, audio_source=path)
            command = [sys.executable, '-X', 'utf8']
            cli = subprocess.run(command + [str(ROOT/'music_lab.py'), 'audio', '--input', str(path), '--out', str(output)],
                                 capture_output=True, cwd=folder, timeout=20)
            self.assertEqual(cli.returncode, 2)  # 8 kHz fails the example distribution rate, not the loudness measurement.
            self.assertEqual(json.loads((output/'report.json').read_text(encoding='utf-8')), expected.data)
            request = {'protocol_version':1, 'id':'loudness', 'operation':'audio', 'payload':{}}
            agent = subprocess.run(command + [str(ROOT/'music_lab_agent.py'), '--audio', str(path)],
                input=(json.dumps(request)+'\n').encode(), capture_output=True, cwd=folder, timeout=20)
            self.assertEqual(agent.returncode, 0); self.assertEqual(json.loads(agent.stdout)['result'], expected.wire())
            requests = [{'jsonrpc':'2.0','id':1,'method':'initialize','params':{'protocolVersion':'2025-11-25','capabilities':{},'clientInfo':{'name':'qa','version':'1'}}},
                        {'jsonrpc':'2.0','method':'notifications/initialized'},
                        {'jsonrpc':'2.0','id':2,'method':'tools/call','params':{'name':'audio_report','arguments':{'payload':{}}}}]
            mcp = subprocess.run(command + [str(ROOT/'music_lab_mcp.py'), '--audio', str(path)],
                input=''.join(json.dumps(r)+'\n' for r in requests).encode(), capture_output=True, cwd=folder, timeout=20)
            self.assertEqual(mcp.returncode, 0)
            self.assertEqual(json.loads(mcp.stdout.splitlines()[-1])['result']['structuredContent'], expected.wire())
            with WorkbenchServer(('127.0.0.1', 0), WorkbenchHandler) as server:
                server.draft_library=None; thread=threading.Thread(target=server.serve_forever,daemon=True); thread.start()
                try:
                    connection=http.client.HTTPConnection('127.0.0.1',server.server_port,timeout=10)
                    connection.request('POST','/api/audio?name=chosen.wav',raw)
                    response=connection.getresponse(); content=response.read(); connection.close()
                    self.assertEqual(response.status,200); self.assertEqual(json.loads(content),expected.wire())
                finally: server.shutdown(); thread.join(timeout=5)
                self.assertFalse(thread.is_alive())
            self.assertEqual(path.read_bytes(), raw)
