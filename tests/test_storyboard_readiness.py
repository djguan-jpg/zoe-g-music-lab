# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
"""Real Node field readiness stays distinct from shared Python complete validation."""
import copy
import http.client
import json
import subprocess
import threading
import unittest
from pathlib import Path
from musiclab.application import build, available_operations
from musiclab.storyboard_frames import frame_index
from music_lab_server import WorkbenchHandler, WorkbenchServer

ROOT = Path(__file__).resolve().parents[1]
CONTRACT = json.loads((ROOT/'contracts/draft-v3.json').read_text(encoding='utf-8'))


def panel():
    brief = json.loads((ROOT/'examples/first-light-mv.json').read_text(encoding='utf-8'))
    fields = dict(zip(CONTRACT['fields']['storyboard'],
                      map(str, (brief['title'], brief['duration_seconds'], brief['fps'],
                                brief['aspect_ratio'], brief['visual_style'], brief['character_anchor']))))
    motifs = [dict(m, id=f'motif-{i}') for i, m in enumerate(brief['motifs'], 1)]
    names = {m['name']: m['id'] for m in motifs}
    shots = [{key: names[s['motif']] if key == 'motif_id' else str(s.get(key, ''))
              for key in CONTRACT['rows']['storyboard']['columns']} for s in brief['shots']]
    return {'fields': fields, 'motifs': motifs, 'shots': shots}


def brief(p):
    keys = ['title','duration_seconds','fps','aspect_ratio','visual_style','character_anchor']
    result = dict(zip(keys, (p['fields'][k] for k in CONTRACT['fields']['storyboard'])))
    names = {m['id']: m['name'] for m in p['motifs']}
    result['motifs'] = [{k: m[k] for k in ('name','meaning')} for m in p['motifs']]
    result['shots'] = [dict({k: v for k, v in s.items() if k != 'motif_id'},
                            motif=names.get(s['motif_id'], 'unregistered')) for s in p['shots']]
    return result


def node_reviews(panels):
    script = "const fs=require('node:fs'),R=require('./web/storyboard-readiness.js');const data=JSON.parse(fs.readFileSync(0,'utf8'));process.stdout.write(JSON.stringify(data.map(p=>({report:R.inspect(p),source:p}))));"
    process = subprocess.run(['node','-e',script], cwd=ROOT, input=json.dumps(panels, ensure_ascii=False),
                             text=True, encoding='utf-8', capture_output=True, timeout=30)
    if process.returncode:
        raise AssertionError(process.stderr[-1500:])
    return json.loads(process.stdout)


class StoryboardReadinessTests(unittest.TestCase):
    def test_each_required_blank_field_and_ambiguous_registry_is_located_and_complete_domain_rejects_it(self):
        cases, locations = [], []
        for field in CONTRACT['fields']['storyboard']:
            p = panel();p['fields'][field] = '\u0085 ';cases.append(p);locations.append(('fields',0,field))
        for row in range(len(panel()['shots'])):
            for field in CONTRACT['rows']['storyboard']['columns']:
                if field == 'change_reason': continue
                p = panel();p['shots'][row][field] = '';cases.append(p);locations.append(('shots',row+1,field))
        for row in range(len(panel()['motifs'])):
            for field in ('name','meaning'):
                p = panel();p['motifs'][row][field] = '\u0085';cases.append(p);locations.append(('motifs',row+1,field))
        reports = node_reviews(cases)
        for p, result, (scope,row,field) in zip(cases, reports, locations):
            with self.subTest(scope=scope,row=row,field=field):
                self.assertEqual(result['source'],p)
                self.assertTrue(any((i['scope'],i['row'],i['field']) == (scope,row,field) for i in result['report']['issues']))
                with self.assertRaises(ValueError): build('storyboard',brief(p))
        p = panel();p['motifs'].append(dict(p['motifs'][0],id='motif-99',name=' '+p['motifs'][0]['name']+'\u0085'))
        self.assertTrue(any(i['code']=='duplicate_motif_name' for i in node_reviews([p])[0]['report']['issues']))
        with self.assertRaises(ValueError):build('storyboard',brief(p))

    def test_zero_field_issues_preserve_optional_choices_and_never_imply_timing_or_frame_acceptance(self):
        valid = panel()
        for s in valid['shots']:s['change_reason']=''
        fractional = copy.deepcopy(valid);fractional['fields']['mv-duration']='24.0004';fractional['fields']['mv-fps']='29.97';fractional['shots'][-1]['end']='24.0004'
        invalid = []
        for field,value in [('mv-duration','60'),('mv-fps','invalid')]:
            p = copy.deepcopy(valid);p['fields'][field]=value;invalid.append(p)
        p = copy.deepcopy(valid);p['shots'][1]['start']='5';invalid.append(p)
        p = copy.deepcopy(valid);p['shots'][0]['end']='0.06251';p['shots'][1]['start']='0.0616';invalid.append(p)
        values = [valid,fractional,*invalid]
        for p,r in zip(values,node_reviews(values)):
            self.assertEqual(r['report']['issueCount'],0);self.assertEqual(r['source'],p)
        result = build('storyboard',brief(fractional))
        self.assertEqual(result.data['duration_seconds'],24.0004)
        self.assertEqual(result.data['frame_timeline']['total_frames'],frame_index(24.0004,29.97))
        self.assertTrue(build('storyboard',brief(valid)).needs_review)
        for p in invalid:
            with self.assertRaises(ValueError):build('storyboard',brief(p))

    def test_actual_loopback_asset_and_defer_order_preserve_tool_contract_and_stop_normally(self):
        server = WorkbenchServer(('127.0.0.1',0),WorkbenchHandler);server.draft_library=None
        thread = threading.Thread(target=server.serve_forever);thread.start()
        try:
            connection = http.client.HTTPConnection('127.0.0.1',server.server_port,timeout=5)
            connection.request('GET','/storyboard-readiness.js');response=connection.getresponse()
            self.assertEqual(response.status,200);self.assertEqual(response.read(),(ROOT/'web/storyboard-readiness.js').read_bytes())
            connection.request('GET','/');response=connection.getresponse();html=response.read().decode('utf-8')
            self.assertLess(html.index('/editor-state.js'),html.index('/storyboard-readiness.js'))
            self.assertLess(html.index('/storyboard-readiness.js'),html.index('/app.js'))
            self.assertIn('id="mv-ready-check"',html);connection.close()
            self.assertEqual(len(available_operations()),18)
        finally:
            server.shutdown();thread.join(5);server.server_close();self.assertFalse(thread.is_alive())
