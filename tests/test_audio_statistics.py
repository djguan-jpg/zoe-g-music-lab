# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
"""Real PCM producers must remain consumable by the independent browser bounds."""
import copy
import base64
import hashlib
import http.client
import io
import json
import subprocess
import sys
import tempfile
import threading
import unittest
import wave
from pathlib import Path

from musiclab.application import build
from music_lab_server import WorkbenchServer, WorkbenchHandler

ROOT = Path(__file__).resolve().parents[1]
DRAFT = {'format': 'zoe-audio-acceptance-draft', 'schema_version': 1, 'profile': 'distribution',
         'custom': False, 'fields': {'rates': '48000', 'bits': '16', 'channels': '1'}}


def pcm(width, rate, channels, pattern, frames=17):
    scale = 2 ** (width * 8 - 1)
    sample = {'silence': lambda i: 0, 'maximum': lambda i: scale - 1,
              'minimum': lambda i: -scale, 'alternating': lambda i: (-1 if i % 2 else 1) * (scale // 8),
              'quiet_edges': lambda i: 0 if i < channels or i >= (frames - 1) * channels else 1}[pattern]
    content = b''.join((sample(i) + 128).to_bytes(1, 'little') if width == 1 else
                       sample(i).to_bytes(width, 'little', signed=True) for i in range(frames * channels))
    selected = io.BytesIO()
    with wave.open(selected, 'wb') as wav:
        wav.setnchannels(channels); wav.setsampwidth(width); wav.setframerate(rate); wav.writeframes(content)
    return selected.getvalue()


def browser(rows, code):
    r = subprocess.run(['node', '-e', code], cwd=ROOT, input=json.dumps(rows), capture_output=True,
                       text=True, encoding='utf-8', timeout=25)
    if r.returncode:
        raise AssertionError((r.stdout + r.stderr)[-2400:])
    return json.loads(r.stdout)


class AudioStatisticsTests(unittest.TestCase):
    def test_actual_pcm_matrix_rounding_silence_extremes_and_supported_measurement_remain_readable(self):
        rows = []
        with tempfile.TemporaryDirectory() as folder:
            path = Path(folder) / '合成音檔🎵.wav'
            for width in (1, 2, 3, 4):
                for rate in (8000, 11025, 48000, 192000):
                    for index, pattern in enumerate(('silence', 'maximum', 'minimum', 'alternating', 'quiet_edges')):
                        channels = (1, 2, 3)[index % 3]
                        raw = pcm(width, rate, channels, pattern); path.write_bytes(raw)
                        wire = build('audio', {'acceptance_draft': DRAFT, 'display_name': path.name}, audio_source=path).wire()
                        rows.append({'wire': wire, 'source': base64.b64encode(raw).decode()})
                        self.assertEqual(path.read_bytes(), raw)
                        self.assertEqual(wire['data']['sha256'], hashlib.sha256(raw).hexdigest())
            for rate, frames in ((192000, 1), (11025, 13337), (48000, 48000)):
                raw = pcm(2, rate, 1, 'silence' if frames == 1 else 'alternating', frames); path.write_bytes(raw)
                rows.append({'wire': build('audio', {'acceptance_draft': DRAFT, 'display_name': path.name}, audio_source=path).wire(), 'source': base64.b64encode(raw).decode()})
                self.assertEqual(path.read_bytes(), raw)
        code = """const fs=require('fs'),audio=require('./web/audio-review.js');const rows=JSON.parse(fs.readFileSync(0,'utf8'));
        (async()=>{let accepted=0;for(const row of rows){const wire=row.wire,before=JSON.stringify(wire),file=new File([Buffer.from(row.source,'base64')],wire.data.file);
        const selected={file,profile:wire.data.profile,acceptanceDraft:wire.data.acceptance_draft};
        if(!await audio.inspect({selected:()=>selected,isCurrent:()=>true,request:async()=>wire,onResult:()=>accepted++}))throw Error('not accepted');
        if(JSON.stringify(wire)!==before)throw Error('mutated input');}console.log(JSON.stringify({accepted}));})().catch(e=>{console.error(e);process.exitCode=1});"""
        self.assertEqual(browser(rows, code), {'accepted': 83})

    def test_matching_raw_report_and_draft_cannot_bypass_pcm_consistency(self):
        with tempfile.TemporaryDirectory() as folder:
            path = Path(folder) / 'synthetic.wav'; raw = pcm(2, 48000, 1, 'alternating'); path.write_bytes(raw)
            original = build('audio', {'acceptance_draft': DRAFT, 'display_name': path.name}, audio_source=path).wire()
            before = copy.deepcopy(original)
            code = """const fs=require('fs'),audio=require('./web/audio-review.js'),row=JSON.parse(fs.readFileSync(0,'utf8')),original=row.wire;
            const changes=[r=>r.per_channel[0].peak_dbfs=6,r=>r.per_channel[0].rms_dbfs=0,
             r=>r.per_channel[0].full_scale_samples=r.frames+1,r=>r.quiet_regions.leading_seconds=r.duration_seconds+5,r=>r.stereo_correlation=.5];
            (async()=>{let refused=0,writes=0;for(const change of changes){const wire=structuredClone(original);change(wire.data);wire.files['report.json']=JSON.stringify(wire.data);wire.files['report.md']=require('./web/audio-report.js').render(wire.data);
             const file=new File([Buffer.from(row.source,'base64')],wire.data.file),selection={file,profile:wire.data.profile,acceptanceDraft:wire.data.acceptance_draft};
             try{await audio.inspect({selected:()=>selection,isCurrent:()=>true,request:async()=>wire,onResult:()=>writes++});throw Error('accepted contradiction');}
             catch(e){if(!e.message.includes('數值互相矛盾'))throw e;refused++;}}
             console.log(JSON.stringify({refused,writes}));})().catch(e=>{console.error(e);process.exitCode=1});"""
            self.assertEqual(browser({'wire': original, 'source': base64.b64encode(raw).decode()}, code), {'refused': 5, 'writes': 0})
            self.assertEqual(original, before); self.assertEqual(path.read_bytes(), raw)

    def test_fixed_native_asset_and_real_http_agent_mcp_cli_reports_keep_same_domain_data(self):
        with tempfile.TemporaryDirectory() as folder:
            path = Path(folder) / 'synthetic.wav'; raw = pcm(4, 48000, 2, 'maximum'); path.write_bytes(raw)
            expected = build('audio', {}, audio_source=path).wire()
            def run(name, args, requests):
                r = subprocess.run([sys.executable, '-X', 'utf8', str(ROOT / name), *args], cwd=folder,
                                   input=requests, capture_output=True, timeout=25)
                self.assertEqual(r.returncode, 0, r.stderr[-1000:]); return r.stdout
            request = {'protocol_version': 1, 'id': 'test', 'operation': 'audio', 'payload': {}}
            agent = json.loads(run('music_lab_agent.py', ['--audio', str(path)], (json.dumps(request)+'\n').encode()))
            self.assertEqual(agent['result'], expected)
            mcp_requests = [{'jsonrpc':'2.0','id':1,'method':'initialize','params':{'protocolVersion':'2025-11-25','capabilities':{},'clientInfo':{'name':'statistics-test','version':'1'}}},
                            {'jsonrpc':'2.0','method':'notifications/initialized'},
                            {'jsonrpc':'2.0','id':2,'method':'tools/call','params':{'name':'audio_report','arguments':{'payload':{}}}}]
            replies = [json.loads(line) for line in run('music_lab_mcp.py', ['--audio', str(path)], ''.join(json.dumps(r)+'\n' for r in mcp_requests).encode()).splitlines()]
            self.assertEqual(replies[-1]['result']['structuredContent'], expected)
            cli = subprocess.run([sys.executable, '-X', 'utf8', str(ROOT/'music_lab.py'), 'audio', '--input', str(path), '--out', str(Path(folder)/'report')],
                                 capture_output=True, timeout=25)
            self.assertEqual(cli.returncode, 2, cli.stderr[-1000:])  # Full scale requires listening.
            self.assertEqual((Path(folder)/'report/report.json').read_text(encoding='utf-8'), expected['files']['report.json'])
            with WorkbenchServer(('127.0.0.1',0),WorkbenchHandler) as server:
                server.draft_library=None; thread=threading.Thread(target=server.serve_forever,daemon=True); thread.start()
                try:
                    connection=http.client.HTTPConnection('127.0.0.1',server.server_address[1],timeout=10)
                    connection.request('GET','/audio-statistics.js'); response=connection.getresponse()
                    self.assertEqual(response.status,200); self.assertEqual(response.read(),(ROOT/'web/audio-statistics.js').read_bytes())
                    connection.request('POST','/api/audio?name=synthetic.wav&profile=distribution',raw,{'Content-Type':'audio/wav'})
                    response=connection.getresponse(); self.assertEqual(response.status,200); http_wire=json.loads(response.read())
                    self.assertEqual(http_wire,expected); connection.close()
                finally:
                    server.shutdown();thread.join(timeout=10);self.assertFalse(thread.is_alive())
            code="const fs=require('fs'),audio=require('./web/audio-review.js'),rows=JSON.parse(fs.readFileSync(0,'utf8'));for(const r of rows)audio.buildReview(r.data);console.log(JSON.stringify({accepted:rows.length}));"
            self.assertEqual(browser([expected,agent['result'],replies[-1]['result']['structuredContent'],http_wire],code),{'accepted':4})
            self.assertEqual(path.read_bytes(),raw)


if __name__ == '__main__':
    unittest.main()
