# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
import hashlib
import http.client
import io
import json
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
from musiclab.audio_source import copied_audio
from musiclab.application import build
from music_lab_server import WorkbenchServer, WorkbenchHandler

ROOT = Path(__file__).resolve().parents[1]


def wav_bytes(rate=48000, width=2, channels=2, frames=60):
    selected = io.BytesIO()
    with wave.open(selected, 'wb') as wav:
        wav.setnchannels(channels); wav.setsampwidth(width); wav.setframerate(rate)
        samples = b''.join((bytes([128 + (i % 2)]) if width == 1 else
                            (1000 if i % 2 else -1000).to_bytes(width, 'little', signed=True))
                           for i in range(frames * channels))
        wav.writeframes(samples)
    return selected.getvalue()


def run(args, request=None, cwd=ROOT):
    p = subprocess.run(args, cwd=cwd, input=request, capture_output=True, timeout=20)
    if p.returncode:
        raise AssertionError(p.stderr.decode('utf-8', errors='replace')[-1200:])
    return p.stdout


class AudioEvidenceTests(unittest.TestCase):
    def test_bad_fmt_fields_refuse_instead_of_silently_reinterpreting_pcm(self):
        raw = wav_bytes()
        with tempfile.TemporaryDirectory() as folder:
            path = Path(folder)/'bad.wav'
            for offset, pattern, value in ((28, '<I', 1), (32, '<H', 1), (34, '<H', 15),
                                           (20, '<H', 3), (22, '<H', 0), (24, '<I', 0)):
                broken = bytearray(raw); struct.pack_into(pattern, broken, offset, value)
                path.write_bytes(broken)
                with self.subTest(offset=offset), self.assertRaises(ValueError):
                    analyze_wav(path)
                self.assertEqual(path.read_bytes(), broken)

    def test_supported_integer_widths_keep_exact_byte_hash_and_header_evidence(self):
        with tempfile.TemporaryDirectory() as folder:
            path = Path(folder)/'原創.wav'
            for width in (1, 2, 3, 4):
                raw = wav_bytes(width=width); path.write_bytes(raw)
                report = analyze_wav(path)
                self.assertEqual(report['sha256'], hashlib.sha256(raw).hexdigest())
                self.assertEqual(report['source_evidence']['bytes'], len(raw))
                self.assertEqual(report['source_evidence']['block_align'], 2*width)
                self.assertEqual(report['source_evidence']['average_bytes_per_second'], 48000*2*width)
                self.assertEqual(report['bit_depth'], width*8)
                self.assertEqual(path.read_bytes(), raw)

    def test_odd_padded_metadata_before_fmt_is_skipped_without_treating_it_as_pcm(self):
        raw = wav_bytes(); selected = bytearray(raw[:12] + b'JUNK' + struct.pack('<I', 3) + b'abc\0' + raw[12:])
        struct.pack_into('<I', selected, 4, len(selected)-8)
        with tempfile.TemporaryDirectory() as folder:
            path=Path(folder)/'metadata.wav'; path.write_bytes(selected)
            report=analyze_wav(path)
            self.assertEqual(report['frames'],60)
            self.assertEqual(report['sha256'],hashlib.sha256(selected).hexdigest())

    def test_truncated_riff_missing_fmt_and_outside_chunk_refuse(self):
        raw=wav_bytes(); outside=bytearray(raw);struct.pack_into('<I',outside,16,100000)
        cases=[raw[:-2],bytes(outside),b'RIFF'+struct.pack('<I',12)+b'WAVEdata'+struct.pack('<I',0)]
        with tempfile.TemporaryDirectory() as folder:
            path=Path(folder)/'bad.wav'
            for content in cases:
                path.write_bytes(content)
                with self.assertRaises(ValueError):analyze_wav(path)

    def test_source_replacement_between_hash_and_wave_open_cannot_mix_the_report(self):
        original=wav_bytes();replacement=wav_bytes(rate=44100,channels=1)
        with tempfile.TemporaryDirectory() as folder:
            path=Path(folder)/'selected.wav';path.write_bytes(original);real_open=wave.open
            def replace_then_open(*args,**kwargs):
                path.write_bytes(replacement)
                return real_open(*args,**kwargs)
            with patch('musiclab.audio.wave.open',side_effect=replace_then_open):report=analyze_wav(path)
            self.assertEqual(report['sha256'],hashlib.sha256(original).hexdigest())
            self.assertEqual((report['sample_rate'],report['channels']),(48000,2))
            self.assertEqual(report['source_evidence']['bytes'],len(original))
            self.assertEqual(path.read_bytes(),replacement)  # Only the controlled external replacement wrote.

    def test_owned_copy_closes_after_success_domain_failure_and_header_failure(self):
        captured=[];factory=tempfile.SpooledTemporaryFile
        def capture(*args,**kwargs):
            copy=factory(*args,**kwargs);captured.append(copy);return copy
        with tempfile.TemporaryDirectory() as folder:
            path=Path(folder)/'selected.wav'
            with patch('musiclab.audio_source.tempfile.SpooledTemporaryFile',side_effect=capture):
                path.write_bytes(wav_bytes())
                with copied_audio(path) as (copy,digest,evidence):self.assertFalse(copy.closed)
                self.assertTrue(captured[-1].closed)
                with self.assertRaisesRegex(RuntimeError,'controlled'):
                    with copied_audio(path):raise RuntimeError('controlled')
                self.assertTrue(captured[-1].closed)
                path.write_bytes(b'bad')
                with self.assertRaises(ValueError):
                    with copied_audio(path):self.fail('Invalid header yielded')
                self.assertTrue(captured[-1].closed)

    def test_copy_larger_than_memory_threshold_keeps_exact_bytes_without_source_write(self):
        raw=wav_bytes(frames=300000)
        with tempfile.TemporaryDirectory() as folder:
            path=Path(folder)/'larger.wav';path.write_bytes(raw)
            with copied_audio(path) as (copy,digest,evidence):
                self.assertEqual(copy.read(),raw)
                self.assertEqual(digest,hashlib.sha256(raw).hexdigest())
                self.assertEqual(evidence['bytes'],len(raw))
            self.assertTrue(copy.closed);self.assertEqual(path.read_bytes(),raw)

    def test_markdown_records_actual_acceptance_and_copy_but_not_private_source_path(self):
        with tempfile.TemporaryDirectory() as folder:
            path=Path(folder)/'測試.wav';path.write_bytes(wav_bytes(rate=8000,channels=1))
            result=build('audio',{'profile':'video','display_name':'../原創.wav'},audio_source=path)
            self.assertEqual(result.data['file'],'原創.wav')
            self.assertTrue(result.needs_review)
            self.assertIn('| sample_rate | 8000 Hz | 48000 Hz | 不符 |',result.files['report.md'])
            self.assertIn('雜湊與量測使用同一次複製的位元組',result.files['report.md'])
            self.assertNotIn(folder,str(result.wire()))

    def test_multichannel_custom_acceptance_still_requires_role_review(self):
        with tempfile.TemporaryDirectory() as folder:
            path=Path(folder)/'three.wav';path.write_bytes(wav_bytes(channels=3))
            report=analyze_wav(path,channels=[3])
            self.assertTrue(all(report['checks'].values()))
            self.assertEqual(len(report['per_channel']),3)
            self.assertTrue(any('不解讀聲道位置' in w for w in report['warnings']))
            self.assertEqual(report['status'],'needs_review')

    def test_real_cli_and_jsonlines_use_same_selected_copy_and_preserve_input(self):
        raw=wav_bytes()
        with tempfile.TemporaryDirectory() as folder:
            path=Path(folder)/'chosen.wav';path.write_bytes(raw);out=Path(folder)/'result'
            cli=subprocess.run([sys.executable,'-X','utf8',str(ROOT/'music_lab.py'),'audio','--input',str(path),'--out',str(out)],cwd=folder,capture_output=True,timeout=20)
            self.assertEqual(cli.returncode,2)  # Completed analysis with an actionable DC warning.
            expected=build('audio',{},audio_source=path)
            self.assertEqual({p.name:p.read_text(encoding='utf-8') for p in out.iterdir()},expected.files)
            requests=[{'protocol_version':1,'id':str(i),'operation':'audio','payload':payload}
                      for i,payload in enumerate(({'profile':'wrong'},{}))]
            responses=[json.loads(line) for line in run([sys.executable,'-X','utf8',str(ROOT/'music_lab_agent.py'),'--audio',str(path)],
                         ''.join(json.dumps(r)+'\n' for r in requests).encode(),cwd=folder).splitlines()]
            self.assertFalse(responses[0]['ok']);self.assertEqual(responses[1]['result'],expected.wire())
            self.assertEqual(path.read_bytes(),raw)
            broken=bytearray(raw);struct.pack_into('<H',broken,32,1);path.write_bytes(broken)
            failed=Path(folder)/'refused'
            p=subprocess.run([sys.executable,str(ROOT/'music_lab.py'),'audio','--input',str(path),'--out',str(failed)],capture_output=True,timeout=20)
            self.assertNotEqual(p.returncode,0);self.assertFalse(failed.exists());self.assertEqual(path.read_bytes(),broken)

    def test_real_mcp_metadata_and_good_after_bad_call_match_application(self):
        with tempfile.TemporaryDirectory() as folder:
            path=Path(folder)/'chosen.wav';path.write_bytes(wav_bytes())
            requests=[{'jsonrpc':'2.0','id':1,'method':'initialize','params':{'protocolVersion':'2025-11-25','capabilities':{},'clientInfo':{'name':'audio-qa','version':'1'}}},
                {'jsonrpc':'2.0','method':'notifications/initialized'},
                {'jsonrpc':'2.0','id':2,'method':'tools/call','params':{'name':'audio_report','arguments':{'payload':{'profile':'wrong'}}}},
                {'jsonrpc':'2.0','id':3,'method':'tools/call','params':{'name':'audio_report','arguments':{'payload':{}}}}]
            replies=[json.loads(line) for line in run([sys.executable,'-X','utf8',str(ROOT/'music_lab_mcp.py'),'--audio',str(path)],
                      ''.join(json.dumps(r)+'\n' for r in requests).encode(),cwd=folder).splitlines()]
            self.assertTrue(replies[1]['result']['isError'])
            self.assertEqual(replies[2]['result']['structuredContent'],build('audio',{},audio_source=path).wire())

    def test_actual_http_invalid_header_then_good_data_and_review_asset(self):
        with WorkbenchServer(('127.0.0.1',0),WorkbenchHandler) as server:
            server.draft_library=None;thread=threading.Thread(target=server.serve_forever,daemon=True);thread.start()
            def request(method,path,body=None):
                c=http.client.HTTPConnection('127.0.0.1',server.server_port,timeout=5);c.request(method,path,body)
                r=c.getresponse();raw=r.read();status=r.status;c.close();return status,raw
            try:
                raw=wav_bytes();broken=bytearray(raw);struct.pack_into('<I',broken,28,1)
                self.assertEqual(request('POST','/api/audio',broken)[0],400)
                status,content=request('POST','/api/audio?name=chosen.wav',raw);self.assertEqual(status,200)
                report=json.loads(content)['data'];self.assertEqual(report['sha256'],hashlib.sha256(raw).hexdigest())
                self.assertEqual(report['source_evidence']['bytes'],len(raw));self.assertEqual(report['file'],'chosen.wav')
                self.assertEqual(request('GET','/audio-review.js')[1],(ROOT/'web/audio-review.js').read_bytes())
            finally:server.shutdown();thread.join(timeout=5)
            self.assertFalse(thread.is_alive())
