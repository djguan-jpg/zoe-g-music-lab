# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
import copy
import http.client
import json
import subprocess
import sys
import tempfile
import threading
import unittest
from pathlib import Path
from musiclab.application import build, capabilities
from musiclab.music_review import review, markdown, source, MAX_SOURCE_BYTES
from musiclab.draft_contract import CONTRACT
from musiclab.draft_library import DraftLibrary
from music_lab_server import WorkbenchHandler, WorkbenchServer
from music_lab_mcp import tool_list, MCP_VERSION

ROOT = Path(__file__).resolve().parents[1]


def partial():
    return json.loads((ROOT / 'examples/unfinished-song-review.json').read_text(encoding='utf-8'))


def complete():
    p = partial()
    p['panel']['sections'][2]['focus'] = '原創敘事'
    p['panel']['sections'][3]['bars'] = '16'
    p['panel']['deliverables'][1] = '兩種副歌方案'
    return p


def node(script, value):
    p = subprocess.run(['node', '-e', script], cwd=ROOT, input=json.dumps(value, ensure_ascii=False),
                       capture_output=True, text=True, encoding='utf-8', timeout=25)
    if p.returncode: raise AssertionError(p.stderr[-2000:])
    return json.loads(p.stdout)


class MusicReviewTests(unittest.TestCase):
    def test_partial_fields_preserve_source_positions_and_isolate_returned_values(self):
        payload = partial(); before = copy.deepcopy(payload)
        d = review(payload)
        self.assertEqual(d['issue_count'], 3)
        self.assertEqual([(i['scope'], i['row'], i['field']) for i in d['issues']],
                         [('sections', 3, 'focus'), ('sections', 4, 'bars'), ('deliverables', 2, 'text')])
        self.assertEqual(d['filled_sections'], 4); self.assertEqual(d['status'], 'needs_correction')
        self.assertEqual(d['source'], before['panel']); self.assertEqual(payload, before)
        d['source']['sections'][0]['focus'] = 'altered'; self.assertEqual(payload, before)

    def test_zero_fields_is_not_complete_duration_or_media_acceptance(self):
        p = complete();p['panel']['fields']['music-bpm'] = '120.0004'
        r = build('music_review', p); self.assertEqual(r.data['status'], 'fields_checked')
        self.assertTrue(r.needs_review);self.assertEqual(r.data['source'], p['panel'])
        p['panel']['fields'].update({'music-bpm':'20', 'music-beats':'12'})
        p['panel']['sections'] = [dict(p['panel']['sections'][0], bars='128') for _ in range(40)]
        self.assertEqual(review(p)['issue_count'], 0)
        from test_music_readiness import brief
        with self.assertRaises(ValueError): build('music', brief(p['panel']))
        self.assertIn('仍須完整建立', markdown(review(p)))

    def test_all_items_count_and_details_remain_bounded(self):
        p = complete();p['panel']['sections'] = [{k:'' for k in CONTRACT['rows']['music']['columns']} for _ in range(40)]
        p['panel']['avoid'] = ['']*100;p['panel']['deliverables'] = ['']*100
        d = review(p);self.assertEqual(d['issue_count'],400);self.assertEqual(len(d['issues']),200)
        self.assertEqual(d['filled_sections'],0);self.assertTrue(d['details_truncated'])
        self.assertIn('全部欄位已檢查',markdown(d));self.assertEqual(p['panel'],d['source'])

    def test_exact_shapes_unicode_and_canonical_source_budget(self):
        mutations = [lambda p:p.update(path='no-read'), lambda p:p.update(schema_version=999),
                     lambda p:p['panel'].update(extra=''), lambda p:p['panel']['fields'].update({'music-bpm':120}),
                     lambda p:p['panel']['sections'][0].update(id='row-1'),
                     lambda p:p['panel'].update(sections=[p['panel']['sections'][0]]*41),
                     lambda p:p['panel'].update(avoid=['']*101), lambda p:p['panel'].update(deliverables=[None]),
                     lambda p:p['panel']['fields'].update({'music-title':'\ud800'})]
        for mutate in mutations:
            p = complete();mutate(p)
            with self.subTest(p=str(mutate)),self.assertRaises(ValueError):review(p)
        panel = complete()['panel']; base = source(panel); original = base['fields']['music-title']
        used = len(json.dumps(base,ensure_ascii=False,separators=(',',':')).encode('utf-8'))
        panel['fields']['music-title'] = 'x'*(MAX_SOURCE_BYTES-used+len(original.encode('utf-8')))
        source(panel);panel['fields']['music-title'] += 'x'
        with self.assertRaisesRegex(ValueError,'8 MiB'): source(panel)

    def test_python_and_real_node_reports_and_markdown_match_all_raw_field_cases(self):
        from test_music_readiness import invalid_panels, panel
        cases = invalid_panels() + [panel(), complete()['panel']]
        for value in ['120.0004','1_2_0','１２３.５','١٢٠','\u0085 120 \u0085','0x78','NaN','\u001c120','\ufeff120']:
            p = complete()['panel'];p['fields']['music-bpm'] = value;cases.append(p)
        p = complete()['panel'];p['fields']['music-title'] = '\u0085 ';p['avoid']=['\ufeff'];cases.append(p)
        p = complete()['panel'];p['sections']=[{k:'' for k in CONTRACT['rows']['music']['columns']} for _ in range(40)];p['avoid']=['']*100;p['deliverables']=['']*100;cases.append(p)
        script = "const fs=require('node:fs'),R=require('./web/music-readiness.js');process.stdout.write(JSON.stringify(JSON.parse(fs.readFileSync(0,'utf8')).map(p=>{const d=R.report(p);return [d,R.markdown(d)];})));"
        actual = node(script,cases)
        for i,(p,(data,text)) in enumerate(zip(cases,actual)):
            with self.subTest(case=i):
                expected=review({'panel':p});self.assertEqual(data,expected);self.assertEqual(text,markdown(expected))

    def test_cli_input_and_modern_draft_no_overwrite_and_exit_codes(self):
        with tempfile.TemporaryDirectory() as folder:
            root=Path(folder);input_file=root/'request.json';input_file.write_text(json.dumps(partial(),ensure_ascii=False),encoding='utf-8');before=input_file.read_bytes()
            args=[sys.executable,'-X','utf8',str(ROOT/'music_lab.py'),'music-review','--input',str(input_file),'--out',str(root/'out')]
            p=subprocess.run(args,capture_output=True,text=True,encoding='utf-8',timeout=15);self.assertEqual(p.returncode,2,p.stderr)
            files={f.name:f.read_bytes() for f in (root/'out').iterdir()};expected=build('music_review',partial()).files
            self.assertEqual({n:b.decode().replace('\r\n','\n') for n,b in files.items()},expected)
            self.assertEqual(subprocess.run(args,capture_output=True,timeout=15).returncode,1)
            self.assertEqual({f.name:f.read_bytes() for f in (root/'out').iterdir()},files);self.assertEqual(input_file.read_bytes(),before)
            from test_draft_library import draft
            d=draft();d['panels']['music']=complete()['panel'];draft_file=root/'draft.json';draft_file.write_text(json.dumps(d,ensure_ascii=False),encoding='utf-8')
            cmd=[sys.executable,'-X','utf8',str(ROOT/'music_lab.py'),'music-review','--draft',str(draft_file),'--out',str(root/'draft-out')]
            p=subprocess.run(cmd,capture_output=True,text=True,encoding='utf-8',timeout=15);self.assertEqual(p.returncode,0,p.stderr)
            self.assertEqual(json.loads((root/'draft-out/music-review.json').read_text(encoding='utf-8'))['source'],d['panels']['music'])
            d['schema_version']=999;draft_file.write_text(json.dumps(d),encoding='utf-8')
            cmd[-1]=str(root/'rejected');self.assertEqual(subprocess.run(cmd,capture_output=True,timeout=15).returncode,1);self.assertFalse((root/'rejected').exists())

    def test_real_json_lines_and_mcp_invalid_then_valid_recovery_and_eof(self):
        rows=[{'protocol_version':1,'id':str(i),'operation':'music_review','payload':p} for i,p in enumerate([{'panel':{},'path':'bad'},partial()])]
        r=subprocess.run([sys.executable,'-X','utf8',str(ROOT/'music_lab_agent.py')],input=''.join(json.dumps(p)+'\n' for p in rows),capture_output=True,text=True,encoding='utf-8',timeout=15)
        self.assertEqual(r.returncode,0,r.stderr);replies=list(map(json.loads,r.stdout.splitlines()));self.assertFalse(replies[0]['ok']);self.assertEqual(replies[1]['result'],build('music_review',partial()).wire())
        requests=[{'jsonrpc':'2.0','id':1,'method':'initialize','params':{'protocolVersion':MCP_VERSION,'capabilities':{},'clientInfo':{'name':'song-check','version':'1'}}},{'jsonrpc':'2.0','method':'notifications/initialized'},{'jsonrpc':'2.0','id':2,'method':'tools/list'}]
        requests += [{'jsonrpc':'2.0','id':i+3,'method':'tools/call','params':{'name':'music_review','arguments':{'payload':p}}} for i,p in enumerate([{'panel':{},'schema_version':999},partial()])]
        with tempfile.TemporaryDirectory() as folder:
            r=subprocess.run([sys.executable,'-X','utf8',str(ROOT/'music_lab_mcp.py')],cwd=folder,input=''.join(json.dumps(p)+'\n' for p in requests),capture_output=True,text=True,encoding='utf-8',timeout=15)
            self.assertEqual(r.returncode,0,r.stderr);replies=list(map(json.loads,r.stdout.splitlines()));self.assertEqual(len(replies[1]['result']['tools']),22)
            self.assertTrue(replies[2]['result']['isError']);self.assertEqual(replies[3]['result']['structuredContent'],build('music_review',partial()).wire());self.assertEqual(list(Path(folder).iterdir()),[])

    def test_discovery_preserves_raw_blank_schema_and_read_only_annotations(self):
        info=capabilities();self.assertEqual(info['music_review']['schema_version'],1);self.assertEqual(len(info['operations']),22)
        tool={t['name']:t for t in tool_list()}['music_review'];self.assertTrue(tool['annotations']['readOnlyHint']);self.assertFalse(tool['annotations']['openWorldHint'])
        schema=tool['inputSchema']['properties']['payload'];self.assertFalse(schema['additionalProperties']);self.assertEqual(schema['required'],['panel'])
        self.assertEqual(schema['properties']['panel']['properties']['fields']['properties']['music-bpm'],{'type':'string'})
        self.assertNotIn('minItems',schema['properties']['panel']['properties']['sections'])
        with tempfile.TemporaryDirectory() as folder:self.assertEqual(len(tool_list(DraftLibrary(folder))),29)

    def test_loopback_http_uses_same_application_boundary(self):
        server=WorkbenchServer(('127.0.0.1',0),WorkbenchHandler);server.draft_library=None;thread=threading.Thread(target=server.serve_forever);thread.start()
        try:
            for payload,code in [(partial(),200),({'panel':{},'path':'bad'},400)]:
                c=http.client.HTTPConnection(*server.server_address,timeout=10);c.request('POST','/api/music-review',json.dumps(payload),{'Content-Type':'application/json'});r=c.getresponse();raw=r.read();c.close();self.assertEqual(r.status,code)
                if code==200:self.assertEqual(json.loads(raw),build('music_review',payload).wire())
        finally:server.shutdown();thread.join(5);server.server_close();self.assertFalse(thread.is_alive())
