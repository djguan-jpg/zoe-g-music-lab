# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
"""Real browser order model feeds the shared complete music and seed service."""
import copy
import http.client
import json
import subprocess
import threading
import unittest
from pathlib import Path
from musiclab.application import build, available_operations
from music_lab_server import WorkbenchHandler, WorkbenchServer

ROOT = Path(__file__).resolve().parents[1]


class MusicArrangementTests(unittest.TestCase):
    def test_every_original_adjacent_move_changes_song_and_seed_order_with_full_timing_validation(self):
        brief = json.loads((ROOT/'examples/first-light-music.json').read_text(encoding='utf-8'))
        rows = [{'id':f'row-{i}', 'value':{k:str(v) for k,v in s.items()}} for i,s in enumerate(brief['arrangement'])]
        script = "const fs=require('node:fs'),A=require('./web/music-arrangement.js');const r=JSON.parse(fs.readFileSync(0,'utf8'));const out=[];for(let i=0;i<r.length;i++)for(const d of [-1,1])if(i+d>=0&&i+d<r.length)out.push({from:i,to:i+d,...A.move(r,r[i].id,d)});process.stdout.write(JSON.stringify(out));"
        p = subprocess.run(['node','-e',script],cwd=ROOT,input=json.dumps(rows,ensure_ascii=False),capture_output=True,text=True,encoding='utf-8',timeout=15)
        self.assertEqual(p.returncode,0,p.stderr)
        original = copy.deepcopy(brief)
        for case in json.loads(p.stdout):
            with self.subTest(source=case['from'],target=case['to']):
                selected = dict(brief,arrangement=[r['value'] for r in case['entries']])
                music = build('music',selected);seed = build('storyboard_seed',{'music':selected}).data
                names = [r['value']['name'] for r in case['entries']]
                self.assertEqual([s['section'] for s in music.data['sections']],names)
                self.assertEqual([s['section'] for s in seed['source']['sections']],names)
                self.assertEqual(music.data['duration_seconds'],136)
                self.assertEqual(seed['duration_seconds'],136)
                normalized = [dict(s,bars=int(s['bars']),energy=float(s['energy'])) for s in selected['arrangement']]
                self.assertEqual(json.loads(music.files['brief.json'])['arrangement'],normalized)
                self.assertEqual(selected['arrangement'],[r['value'] for r in case['entries']])
                self.assertEqual(music.data['sections'][0]['start'],0)
                self.assertEqual(music.data['sections'][-1]['end'],136)
                self.assertEqual(music.needs_review,bool(music.data['review_notes']))
                self.assertNotIn('record',music.wire())
        invalid = dict(brief,arrangement=copy.deepcopy(selected['arrangement']))
        invalid['arrangement'][0]['bars']=''
        with self.assertRaises(ValueError):build('music',invalid)
        with self.assertRaises(ValueError):build('storyboard_seed',{'music':invalid})
        self.assertEqual(brief,original)

    def test_actual_asset_defer_order_and_existing_operation_contract(self):
        server = WorkbenchServer(('127.0.0.1',0),WorkbenchHandler);server.draft_library=None
        thread = threading.Thread(target=server.serve_forever);thread.start()
        try:
            c = http.client.HTTPConnection('127.0.0.1',server.server_port,timeout=5)
            c.request('GET','/music-arrangement.js');response=c.getresponse()
            self.assertEqual(response.status,200);self.assertEqual(response.read(),(ROOT/'web/music-arrangement.js').read_bytes())
            c.request('GET','/');response=c.getresponse();html=response.read().decode('utf-8')
            self.assertLess(html.index('/music-arrangement.js'),html.index('/app.js'))
            self.assertIn('id="section-order"',html);c.close();self.assertEqual(len(available_operations()),14)
        finally:
            server.shutdown();thread.join(5);server.server_close();self.assertFalse(thread.is_alive())
