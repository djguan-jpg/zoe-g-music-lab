# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
"""Real Node song field checks remain distinct from complete Python acceptance."""
import copy
import http.client
import json
import subprocess
import threading
import unittest
from pathlib import Path
from musiclab.application import build, available_operations
from musiclab.common import number
from music_lab_server import WorkbenchHandler, WorkbenchServer

ROOT = Path(__file__).resolve().parents[1]
FIELDS = {'music-title':'title','music-hook':'memory_hook','music-theme':'theme','music-style':'style','music-vocal':'vocal','music-audience':'audience','music-bpm':'bpm','music-beats':'beats_per_bar','music-lyrics':'existing_lyrics','music-language':'language'}


def panel():
    b = json.loads((ROOT/'examples/first-light-music.json').read_text(encoding='utf-8'))
    return {'fields':{k:str(b[v]) for k,v in FIELDS.items()}, 'sections':[{k:str(v) for k,v in s.items()} for s in b['arrangement']], 'avoid':b['avoid'], 'deliverables':b['deliverables']}


def brief(p):
    return dict({v:p['fields'][k] for k,v in FIELDS.items()},arrangement=p['sections'],avoid=p['avoid'],deliverables=p['deliverables'])


def node(source, value):
    r = subprocess.run(['node','-e',source],cwd=ROOT,input=json.dumps(value,ensure_ascii=False),capture_output=True,text=True,encoding='utf-8',timeout=20)
    if r.returncode: raise AssertionError(r.stderr[-2000:])
    return json.loads(r.stdout)


def invalid_panels():
    result = []
    for field in FIELDS:
        if field=='music-lyrics':continue
        p=panel();p['fields'][field]='\u0085 ';result.append(p)
    for row in range(6):
        for field in ('name','bars','energy','focus','texture'):
            p=panel();p['sections'][row][field]='';result.append(p)
    for key in ('avoid','deliverables'):
        for row in range(len(panel()[key])):
            p=panel();p[key][row]='\u001c';result.append(p)
    for key in ('sections','deliverables'):
        p=panel();p[key]=[];result.append(p)
    for field,values in [('music-bpm',['19','301','NaN','Infinity','0x78','\u001c120','\ufeff120']),('music-beats',['0','13','1.5'])]:
        for value in values:
            p=panel();p['fields'][field]=value;result.append(p)
    for field,values in [('bars',['0','129','2.5']),('energy',['0.9','5.1'])]:
        for value in values:
            p=panel();p['sections'][2][field]=value;result.append(p)
    return result


class MusicReadinessTests(unittest.TestCase):
    def test_real_node_checks_all_original_invalid_fields_and_accepts_compatible_precision_and_text(self):
        invalid=invalid_panels();valid=[panel()]
        for value in ('120.0004','１２０.０００４','1_2_0','١٢٠'):
            p=panel();p['fields']['music-bpm']=value;p['sections'][2]['energy']='3.0004';valid.append(p)
        p=panel();p['avoid']=['\ufeff'];p['deliverables']=['\ufeff'];p['fields']['music-lyrics']='';valid.append(p)
        source="const fs=require('node:fs'),R=require('./web/music-readiness.js');const values=JSON.parse(fs.readFileSync(0,'utf8'));process.stdout.write(JSON.stringify(values.map(p=>({report:R.inspect(p),source:p}))));"
        values=invalid+valid
        for i,(p,result) in enumerate(zip(values,node(source,values))):
            with self.subTest(case=i):
                self.assertEqual(result['source'],p)
                if i<len(invalid):
                    self.assertGreater(result['report']['issueCount'],0)
                    with self.assertRaises(ValueError):build('music',brief(p))
                    with self.assertRaises(ValueError):build('storyboard_seed',{'music':brief(p)})
                else:
                    self.assertEqual(result['report']['issueCount'],0)
                    song=build('music',brief(p));seed=build('storyboard_seed',{'music':brief(p)})
                    self.assertEqual(song.data['bpm'],number(p['fields']['music-bpm'],'BPM'))
                    self.assertEqual(song.data['duration_seconds'],seed.data['duration_seconds'])
        over=panel();over['fields']['music-bpm']='20';over['fields']['music-beats']='12';over['sections']=[dict(over['sections'][0],bars='128') for _ in range(40)]
        self.assertEqual(node(source,[over])[0]['report']['issueCount'],0)
        with self.assertRaises(ValueError):build('music',brief(over))
        with self.assertRaises(ValueError):build('storyboard_seed',{'music':brief(over)})

    def test_shared_numeric_parser_matches_python_finite_float_semantics(self):
        values=['120.0004','1_2_0','１２３.５','١٢٠','1e2','1_0e1','\u0085 120 \u0085','\u001c120','\ufeff120','NaN','Infinity','0x78','0b10','1__2','_12','12_','','.5','1.','+12','-12','1e400',None,True,False,{},[],0,1.5]
        source="const fs=require('node:fs'),V=require('./web/planning-values.js');process.stdout.write(JSON.stringify(JSON.parse(fs.readFileSync(0,'utf8')).map(v=>{try{return {ok:true,value:V.number(v)};}catch{return {ok:false};}})));"
        for value,result in zip(values,node(source,values)):
            with self.subTest(value=value):
                try:expected=number(value,'test')
                except ValueError:self.assertFalse(result['ok'])
                else:self.assertTrue(result['ok']);self.assertEqual(result['value'],expected)

    def test_assets_defer_order_no_browser_validation_drift_and_normal_loopback_shutdown(self):
        server=WorkbenchServer(('127.0.0.1',0),WorkbenchHandler);server.draft_library=None
        thread=threading.Thread(target=server.serve_forever);thread.start()
        try:
            c=http.client.HTTPConnection('127.0.0.1',server.server_port,timeout=5)
            for name in ('planning-values.js','readiness-state.js','music-readiness.js','raw-fields.js','raw-fields-dom.js'):
                c.request('GET','/'+name);response=c.getresponse();self.assertEqual(response.status,200);self.assertEqual(response.read(),(ROOT/'web'/name).read_bytes())
            c.request('GET','/');response=c.getresponse();html=response.read().decode('utf-8')
            self.assertLess(html.index('/planning-values.js'),html.index('/planning-import.js'))
            self.assertLess(html.index('/readiness-state.js'),html.index('/storyboard-readiness.js'))
            self.assertLess(html.index('/music-readiness.js'),html.index('/app.js'))
            self.assertIn('<form id="music-form" novalidate>',html);self.assertIn('id="music-bpm" type="text" inputmode="decimal"',html);self.assertLess(html.index('/raw-fields.js'),html.index('/raw-fields-dom.js'));self.assertLess(html.index('/raw-fields-dom.js'),html.index('/app.js'));c.close();self.assertEqual(len(available_operations()),18)
        finally:server.shutdown();thread.join(5);server.server_close();self.assertFalse(thread.is_alive())
