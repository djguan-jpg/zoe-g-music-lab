# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
import copy
import hashlib
import json
import subprocess
import sys
import tempfile
import threading
import unittest
import urllib.error
import urllib.request
from pathlib import Path
from musiclab.application import build
from music_lab_server import WorkbenchHandler, WorkbenchServer

ROOT = Path(__file__).resolve().parents[1]


class StoryboardDurationTests(unittest.TestCase):
    def test_sixty_real_node_adoptions_match_python_domain_and_source_stays_unchanged(self):
        cases = []
        original = json.loads((ROOT/'examples/first-light-mv.json').read_text(encoding='utf-8'))
        for fps in (8, 23.976, 24, 29.97, 60, 120):
            for offset in range(10):
                brief = copy.deepcopy(original)
                brief['fps'] = str(fps)
                brief['duration_seconds'] = '60.000'
                for i, shot in enumerate(brief['shots']):
                    shot['start'] = '0' if i == 0 else f'{i*6+offset*.0001:.4f}'
                    shot['end'] = f'{(i+1)*6+offset*.0001:.4f}'
                cases.append(brief)
        script = """const fs=require('node:fs'),D=require('./web/storyboard-duration.js');
const cases=JSON.parse(fs.readFileSync(0,'utf8'));
console.log(JSON.stringify(cases.map(b=>{
 const value={duration:b.duration_seconds,fps:b.fps,shots:b.shots.map((s,i)=>({id:String(i),start:s.start,end:s.end}))};
 const c=D.createController({capture:()=>value,apply:v=>value.duration=v,onState:()=>{}});c.refresh();
 c.adopt();const adopted=value.duration,p=D.proposal(value);c.undo();
 return {adopted,restored:value.duration,frames:p.totalFrames,originalShots:value.shots};
})));"""
        process = subprocess.run(['node', '-e', script], cwd=ROOT, input=json.dumps(cases), capture_output=True, text=True, encoding='utf-8', timeout=10)
        self.assertEqual(process.returncode, 0, process.stderr)
        replies = json.loads(process.stdout)
        self.assertEqual(len(replies), 60)
        for brief, reply in zip(cases, replies):
            before = copy.deepcopy(brief)
            changed = dict(brief, duration_seconds=reply['adopted'])
            wire = build('storyboard', changed).wire()
            self.assertEqual(wire['data']['duration_seconds'], float(brief['shots'][-1]['end']))
            self.assertEqual(wire['data']['frame_timeline']['total_frames'], reply['frames'])
            self.assertEqual(reply['restored'], '60.000')
            self.assertEqual(brief, before)
            self.assertEqual([(s['start'], s['end']) for s in reply['originalShots']], [(s['start'], s['end']) for s in brief['shots']])

    def test_real_four_adapters_reject_old_total_then_accept_adopted_request_without_overwriting_source(self):
        good = json.loads((ROOT/'examples/first-light-mv.json').read_text(encoding='utf-8'))
        good['duration_seconds'] = '24'
        bad = dict(good, duration_seconds='60')
        expected = build('storyboard', good).wire()
        with tempfile.TemporaryDirectory() as folder:
            destination = Path(folder)
            source = destination/'original.json'
            source.write_text(json.dumps(bad, ensure_ascii=False)+'\n', encoding='utf-8')
            original = hashlib.sha256(source.read_bytes()).hexdigest()
            adopted = destination/'adopted.json'
            adopted.write_text(json.dumps(good, ensure_ascii=False)+'\n', encoding='utf-8')
            args = [sys.executable, '-X', 'utf8', str(ROOT/'music_lab.py'), 'storyboard', '--brief', str(source), '--out', str(destination/'result')]
            run = lambda a, data=None: subprocess.run(a, cwd=ROOT, input=data, capture_output=True, text=True, encoding='utf-8', timeout=10)
            self.assertEqual(run(args).returncode, 1)
            args[args.index('--brief')+1] = str(adopted)
            self.assertEqual(run(args).returncode, 0)
            for name, content in expected['files'].items():
                self.assertEqual((destination/'result'/name).read_text(encoding='utf-8'), content.replace('\r\n', '\n'))
            self.assertEqual(run(args).returncode, 1)
            self.assertEqual(hashlib.sha256(source.read_bytes()).hexdigest(), original)
            payloads = [bad, good, bad, good]
            requests = [{'protocol_version': 1, 'id': 'duration-'+str(i), 'operation': 'storyboard', 'payload': b} for i, b in enumerate(payloads)]
            p = run([sys.executable, '-X', 'utf8', 'music_lab_agent.py'], ''.join(json.dumps(v)+'\n' for v in requests))
            self.assertEqual(p.returncode, 0, p.stderr)
            replies = list(map(json.loads, p.stdout.splitlines()))
            self.assertEqual([r['ok'] for r in replies], [False, True, False, True])
            for r in (replies[1], replies[3]): self.assertEqual(r['result'], expected)
            requests = [{'jsonrpc': '2.0', 'id': 1, 'method': 'initialize', 'params': {'protocolVersion': '2025-11-25', 'capabilities': {}, 'clientInfo': {'name': 'duration-check', 'version': '1'}}}, {'jsonrpc': '2.0', 'method': 'notifications/initialized'}]
            requests += [{'jsonrpc': '2.0', 'id': i+2, 'method': 'tools/call', 'params': {'name': 'storyboard_plan', 'arguments': {'payload': b}}} for i, b in enumerate(payloads)]
            p = run([sys.executable, '-X', 'utf8', 'music_lab_mcp.py'], ''.join(json.dumps(v)+'\n' for v in requests))
            self.assertEqual(p.returncode, 0, p.stderr)
            replies = list(map(json.loads, p.stdout.splitlines()))[1:]
            self.assertEqual([r['result']['isError'] for r in replies], [True, False, True, False])
            for r in (replies[1], replies[3]): self.assertEqual(r['result']['structuredContent'], expected)
        class Quiet(WorkbenchHandler):
            def log_message(self, *args): pass
        with WorkbenchServer(('127.0.0.1', 0), Quiet) as server:
            server.draft_library = None
            worker = threading.Thread(target=server.serve_forever, daemon=True)
            worker.start()
            base = f'http://127.0.0.1:{server.server_port}'
            try:
                self.assertEqual(urllib.request.urlopen(base+'/storyboard-duration.js', timeout=5).read(), (ROOT/'web/storyboard-duration.js').read_bytes())
                page = urllib.request.urlopen(base+'/', timeout=5).read().decode('utf-8')
                self.assertLess(page.index('/storyboard-frames.js'), page.index('/storyboard-duration.js'))
                self.assertLess(page.index('/storyboard-duration.js'), page.index('/app.js'))
                for payload in payloads:
                    req = urllib.request.Request(base+'/api/storyboard', data=json.dumps(payload).encode(), headers={'Content-Type': 'application/json'}, method='POST')
                    if payload is bad:
                        with self.assertRaises(urllib.error.HTTPError) as error: urllib.request.urlopen(req, timeout=5)
                        self.assertEqual(error.exception.code, 400)
                    else:
                        self.assertEqual(json.load(urllib.request.urlopen(req, timeout=5)), expected)
            finally:
                server.shutdown()
                worker.join(timeout=5)
                self.assertFalse(worker.is_alive())


if __name__ == '__main__': unittest.main()
