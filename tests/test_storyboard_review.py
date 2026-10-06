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
from musiclab.storyboard_review import review, markdown, source, MAX_SOURCE_BYTES
from musiclab.draft_contract import CONTRACT
from musiclab.draft_library import DraftLibrary
from music_lab_server import WorkbenchHandler, WorkbenchServer
from music_lab_mcp import tool_list, MCP_VERSION

ROOT = Path(__file__).resolve().parents[1]


def partial():
    return json.loads((ROOT / 'examples/unfinished-storyboard-review.json').read_text(encoding='utf-8'))


def complete():
    p = partial();p['panel']['motifs'] = p['panel']['motifs'][:1]
    p['panel']['shots'][2]['visual'] = '原創畫面動作'
    return p


def cases():
    result = [partial()['panel'], complete()['panel']]
    for field in CONTRACT['fields']['storyboard']:
        p = complete()['panel'];p['fields'][field] = '\u0085 ';result.append(p)
    for row in range(4):
        for field in CONTRACT['rows']['storyboard']['columns']:
            if field == 'change_reason': continue
            p = complete()['panel'];p['shots'][row][field] = '';result.append(p)
    for field in ('name','meaning'):
        p = complete()['panel'];p['motifs'][0][field] = '';result.append(p)
    for value in ['unknown', ' left ', '\ufeff', '\u0085 ']:
        p = complete()['panel'];p['shots'][2]['screen_direction'] = value;result.append(p)
    p = complete()['panel'];p['shots'][3]['motif_id'] = 'motif-999';result.append(p)
    p = complete()['panel'];p['shots'][0]['motif_id'] = ' motif-1 ';result.append(p)
    p = partial()['panel'];p['motifs'][1]['name'] = '\u0085 '+p['motifs'][0]['name']+' ';result.append(p)
    p = complete()['panel'];p['shots'][0]['change_reason'] = '\ufeff';result.append(p)
    p = complete()['panel'];p['shots']=[];p['motifs']=[];result.append(p)
    p = complete()['panel'];p['motifs']=[{'id':f'motif-{i+1}','name':'','meaning':''} for i in range(30)];p['shots']=[{k:'' for k in CONTRACT['rows']['storyboard']['columns']} for _ in range(1000)];result.append(p)
    return result


class StoryboardReviewTests(unittest.TestCase):
    def test_partial_fields_keep_motif_ids_original_rows_related_rows_and_source(self):
        payload=partial();before=copy.deepcopy(payload);d=review(payload)
        self.assertEqual(d['issue_count'],7);self.assertEqual(d['filled_shots'],0)
        self.assertEqual(d['issues'][0]['related_row'],2);self.assertEqual(d['issues'][1]['related_row'],1)
        self.assertIn(('shots',3,'visual'),[(i['scope'],i['row'],i['field']) for i in d['issues']])
        self.assertEqual(d['status'],'needs_correction');self.assertEqual(d['source'],before['panel']);self.assertEqual(payload,before)
        d['source']['shots'][0]['visual']='changed';self.assertEqual(payload,before)

    def test_zero_fields_does_not_accept_invalid_timing_or_generate_media(self):
        p=complete();p['panel']['shots'][1]['start']='0'
        r=build('storyboard_review',p);self.assertEqual(r.data['status'],'fields_checked');self.assertTrue(r.needs_review)
        from test_storyboard_readiness import brief
        with self.assertRaises(ValueError):build('storyboard',brief(p['panel']))
        self.assertIn('時間、影格與連戲',markdown(r.data));self.assertEqual(r.data['source'],p['panel'])

    def test_every_shot_and_motif_count_is_separate_from_bounded_details(self):
        p=cases()[-1];d=review({'panel':p})
        self.assertEqual(d['issue_count'],11060);self.assertEqual(len(d['issues']),200)
        self.assertEqual(d['filled_shots'],0);self.assertTrue(d['details_truncated'])
        self.assertEqual(d['source'],p);self.assertIn('全部鏡頭與母題已檢查',markdown(d))

    def test_exact_shape_identifiers_unicode_and_canonical_source_byte_limit(self):
        mutations=[lambda p:p.update(path='no-read'),lambda p:p.update(schema_version=999),lambda p:p['panel'].update(extra=''),
                   lambda p:p['panel']['fields'].update({'mv-fps':24}),lambda p:p['panel']['shots'][0].update(id='row-1'),
                   lambda p:p['panel'].update(shots=p['panel']['shots']*251),lambda p:p['panel'].update(motifs=p['panel']['motifs']*31),
                   lambda p:p['panel']['motifs'][0].update(id='motif-٠'),lambda p:p['panel']['fields'].update({'mv-title':'\ud800'}),
                   lambda p:p['panel']['motifs'].append(dict(p['panel']['motifs'][0]))]
        for mutate in mutations:
            p=complete();mutate(p)
            with self.subTest(mutate=mutate),self.assertRaises(ValueError):review(p)
        p=complete()['panel'];original=p['fields']['mv-title'];used=len(json.dumps(source(p),ensure_ascii=False,separators=(',',':')).encode('utf-8'))
        p['fields']['mv-title']='x'*(MAX_SOURCE_BYTES-used+len(original.encode('utf-8')));source(p)
        p['fields']['mv-title']+='x'
        with self.assertRaisesRegex(ValueError,'8 MiB'):source(p)

    def test_python_and_real_node_entire_report_and_markdown_match(self):
        panels=cases();script="const fs=require('node:fs'),R=require('./web/storyboard-readiness.js');process.stdout.write(JSON.stringify(JSON.parse(fs.readFileSync(0,'utf8')).map(p=>{const d=R.report(p);return [d,R.markdown(d)];})));"
        r=subprocess.run(['node','-e',script],cwd=ROOT,input=json.dumps(panels,ensure_ascii=False),capture_output=True,text=True,encoding='utf-8',timeout=25)
        self.assertEqual(r.returncode,0,r.stderr);actual=json.loads(r.stdout);self.assertEqual(len(actual),len(panels))
        for i,(p,(data,text)) in enumerate(zip(panels,actual)):
            with self.subTest(case=i):
                expected=review({'panel':p});self.assertEqual(data,expected);self.assertEqual(text,markdown(expected))

    def test_cli_input_and_modern_draft_no_overwrite_and_exit_codes(self):
        with tempfile.TemporaryDirectory() as folder:
            root=Path(folder);input_file=root/'request.json';input_file.write_text(json.dumps(partial(),ensure_ascii=False),encoding='utf-8');before=input_file.read_bytes()
            args=[sys.executable,'-X','utf8',str(ROOT/'music_lab.py'),'storyboard-review','--input',str(input_file),'--out',str(root/'out')]
            p=subprocess.run(args,capture_output=True,text=True,encoding='utf-8',timeout=15);self.assertEqual(p.returncode,2,p.stderr)
            files={f.name:f.read_bytes() for f in (root/'out').iterdir()};expected=build('storyboard_review',partial()).files
            self.assertEqual({n:b.decode().replace('\r\n','\n') for n,b in files.items()},expected)
            self.assertEqual(subprocess.run(args,capture_output=True,timeout=15).returncode,1)
            self.assertEqual({f.name:f.read_bytes() for f in (root/'out').iterdir()},files);self.assertEqual(input_file.read_bytes(),before)
            from test_draft_library import draft
            d=draft();d['panels']['storyboard']=complete()['panel'];draft_file=root/'draft.json';draft_file.write_text(json.dumps(d,ensure_ascii=False),encoding='utf-8')
            cmd=[sys.executable,'-X','utf8',str(ROOT/'music_lab.py'),'storyboard-review','--draft',str(draft_file),'--out',str(root/'draft-out')]
            p=subprocess.run(cmd,capture_output=True,text=True,encoding='utf-8',timeout=15);self.assertEqual(p.returncode,0,p.stderr)
            self.assertEqual(json.loads((root/'draft-out/storyboard-review.json').read_text(encoding='utf-8'))['source'],d['panels']['storyboard'])
            d['schema_version']=999;draft_file.write_text(json.dumps(d),encoding='utf-8')
            cmd[-1]=str(root/'rejected');self.assertEqual(subprocess.run(cmd,capture_output=True,timeout=15).returncode,1);self.assertFalse((root/'rejected').exists())

    def test_real_json_lines_and_mcp_invalid_then_valid_recovery_and_eof(self):
        rows=[{'protocol_version':1,'id':str(i),'operation':'storyboard_review','payload':p} for i,p in enumerate([{'panel':{},'path':'bad'},partial()])]
        r=subprocess.run([sys.executable,'-X','utf8',str(ROOT/'music_lab_agent.py')],input=''.join(json.dumps(p)+'\n' for p in rows),capture_output=True,text=True,encoding='utf-8',timeout=15)
        self.assertEqual(r.returncode,0,r.stderr);replies=list(map(json.loads,r.stdout.splitlines()));self.assertFalse(replies[0]['ok']);self.assertEqual(replies[1]['result'],build('storyboard_review',partial()).wire())
        requests=[{'jsonrpc':'2.0','id':1,'method':'initialize','params':{'protocolVersion':MCP_VERSION,'capabilities':{},'clientInfo':{'name':'storyboard-check','version':'1'}}},{'jsonrpc':'2.0','method':'notifications/initialized'},{'jsonrpc':'2.0','id':2,'method':'tools/list'}]
        requests += [{'jsonrpc':'2.0','id':i+3,'method':'tools/call','params':{'name':'storyboard_review','arguments':{'payload':p}}} for i,p in enumerate([{'panel':{},'schema_version':999},partial()])]
        with tempfile.TemporaryDirectory() as folder:
            r=subprocess.run([sys.executable,'-X','utf8',str(ROOT/'music_lab_mcp.py')],cwd=folder,input=''.join(json.dumps(p)+'\n' for p in requests),capture_output=True,text=True,encoding='utf-8',timeout=15)
            self.assertEqual(r.returncode,0,r.stderr);replies=list(map(json.loads,r.stdout.splitlines()));self.assertEqual(len(replies[1]['result']['tools']),21)
            self.assertTrue(replies[2]['result']['isError']);self.assertEqual(replies[3]['result']['structuredContent'],build('storyboard_review',partial()).wire());self.assertEqual(list(Path(folder).iterdir()),[])

    def test_discovery_preserves_raw_blank_schema_and_read_only_annotations(self):
        info=capabilities();self.assertEqual(info['storyboard_review']['schema_version'],1);self.assertEqual(len(info['operations']),21)
        tool={t['name']:t for t in tool_list()}['storyboard_review'];self.assertTrue(tool['annotations']['readOnlyHint']);self.assertFalse(tool['annotations']['openWorldHint'])
        schema=tool['inputSchema']['properties']['payload'];self.assertFalse(schema['additionalProperties']);self.assertEqual(schema['required'],['panel'])
        self.assertEqual(schema['properties']['panel']['properties']['fields']['properties']['mv-fps'],{'type':'string'})
        self.assertNotIn('minItems',schema['properties']['panel']['properties']['shots'])
        with tempfile.TemporaryDirectory() as folder:self.assertEqual(len(tool_list(DraftLibrary(folder))),28)

    def test_loopback_http_uses_same_application_boundary(self):
        server=WorkbenchServer(('127.0.0.1',0),WorkbenchHandler);server.draft_library=None;thread=threading.Thread(target=server.serve_forever);thread.start()
        try:
            for payload,code in [(partial(),200),({'panel':{},'path':'bad'},400)]:
                c=http.client.HTTPConnection(*server.server_address,timeout=10);c.request('POST','/api/storyboard-review',json.dumps(payload),{'Content-Type':'application/json'});r=c.getresponse();raw=r.read();c.close();self.assertEqual(r.status,code)
                if code==200:self.assertEqual(json.loads(raw),build('storyboard_review',payload).wire())
        finally:server.shutdown();thread.join(5);server.server_close();self.assertFalse(thread.is_alive())
