# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
import copy,http.client,json,subprocess,sys,tempfile,threading,unittest
from pathlib import Path
from musiclab.application import build
from musiclab.common import json_text
from musiclab.lyrics_export_review import review
from musiclab.lyrics_package import validate_package
from music_lab_server import WorkbenchServer,WorkbenchHandler
from music_lab_mcp import tool_list
ROOT=Path(__file__).resolve().parents[1]
SOURCE=build('lyrics',{'title':'來源 <b>','cues':[{'start':2,'end':3,'text':' \t'},{'start':8,'end':9,'text':'[00:04] 字\u0085\u2028\u2029\t  '}],'duration':10}).data
SOURCE['timing']['applied_shift_seconds']=-.125;SOURCE['review_notes']=[' 已校時歷史\t ']
def run(args,text=None):return subprocess.run(args,cwd=ROOT,input=text,capture_output=True,text=True,encoding='utf-8',timeout=20)
class ExportBundleTests(unittest.TestCase):
    def test_default_false_are_identical_and_true_preserves_complete_history_without_rewriting(self):
        before=copy.deepcopy(SOURCE);compact=build('lyrics_export_review',{'package':SOURCE}).wire()
        self.assertEqual(build('lyrics_export_review',{'package':SOURCE,'include_package':False}).wire(),compact)
        included=build('lyrics_export_review',{'package':SOURCE,'include_package':True}).wire()
        self.assertEqual(included['data'],compact['data']);self.assertEqual(included['meta'],compact['meta']);self.assertTrue(included['meta']['needs_review'])
        self.assertEqual(set(included['files']),set(compact['files'])|{'lyrics.json'});self.assertEqual({k:included['files'][k] for k in compact['files']},compact['files'])
        restored=validate_package(json.loads(included['files']['lyrics.json']));self.assertEqual(restored,before);self.assertEqual(SOURCE,before)
        restored['cues'][0]['text']='後改';self.assertEqual(json.loads(included['files']['lyrics.json']),before)
    def test_explicit_boolean_only_unknown_paths_and_versions_still_refuse(self):
        for value in [None,0,1,'true',[],{}]:
            with self.assertRaises(ValueError):build('lyrics_export_review',{'package':SOURCE,'include_package':value})
        for payload in [{'package':SOURCE,'include_package':True,'path':'bad'},{'include_package':True},{'package':{**SOURCE,'schema_version':2},'include_package':True}]:
            with self.assertRaises(ValueError):build('lyrics_export_review',payload)
        schema=next(t for t in tool_list() if t['name']=='lyrics_export_review')['inputSchema']['properties']['payload']
        self.assertEqual(schema['required'],['package']);self.assertEqual(schema['properties']['include_package']['type'],'boolean');self.assertFalse(schema['additionalProperties'])
    def test_node_files_and_real_python_reply_match_semantically_with_literal_values(self):
        payload={'package':SOURCE,'include_package':True};wire=build('lyrics_export_review',payload).wire()
        code="const fs=require('node:fs'),R=require('./musiclab/assets/lyrics-export-review.js');(async()=>{const [p,w]=JSON.parse(fs.readFileSync(0,'utf8'));const d=await R.inspect(w,p);console.log(JSON.stringify(R.files(d,p)));})();"
        p=run(['node','-e',code],json.dumps([payload,wire]));self.assertEqual(p.returncode,0,p.stderr[-1000:]);files=json.loads(p.stdout)
        self.assertEqual(set(files),set(wire['files']))
        for name in files:self.assertEqual(json.loads(files[name]) if name.endswith('.json') else files[name],json.loads(wire['files'][name]) if name.endswith('.json') else wire['files'][name])
    def test_cli_explicit_option_writes_report_and_source_refuses_overwrite_preserves_input(self):
        with tempfile.TemporaryDirectory() as folder:
            source=Path(folder)/'input.json';source.write_text(json_text(SOURCE),encoding='utf-8');original=source.read_bytes();out=Path(folder)/'report'
            args=[sys.executable,'-X','utf8','music_lab.py','lyrics-export-review','--input',str(source),'--out',str(out),'--include-package']
            first=run(args);self.assertEqual(first.returncode,2,first.stderr);self.assertEqual(source.read_bytes(),original)
            saved={p.name:p.read_bytes() for p in out.iterdir()};self.assertEqual(set(saved),{'lyrics.json','lyrics-export-review.json','lyrics-export-review.md'});self.assertEqual(validate_package(json.loads(saved['lyrics.json'])),SOURCE)
            self.assertEqual(run(args).returncode,1);self.assertEqual({p.name:p.read_bytes() for p in out.iterdir()},saved);self.assertEqual(source.read_bytes(),original)
    def test_real_agent_mcp_default_and_included_payloads_use_same_service_without_extra_write(self):
        payloads=[{'package':SOURCE},{'package':SOURCE,'include_package':True},{'package':SOURCE,'include_package':'true'}]
        requests=[{'protocol_version':1,'id':str(i),'operation':'lyrics_export_review','payload':p} for i,p in enumerate(payloads)]
        p=run([sys.executable,'-X','utf8','music_lab_agent.py'],''.join(json.dumps(r)+'\n' for r in requests));self.assertEqual(p.returncode,0,p.stderr);rows=[json.loads(r) for r in p.stdout.split('\n') if r]
        for i in [0,1]:self.assertEqual(rows[i]['result'],build('lyrics_export_review',payloads[i]).wire())
        self.assertFalse(rows[2]['ok'])
        requests=[{'jsonrpc':'2.0','id':1,'method':'initialize','params':{'protocolVersion':'2025-11-25','capabilities':{},'clientInfo':{'name':'paired-files','version':'1'}}},{'jsonrpc':'2.0','method':'notifications/initialized'}]+[{'jsonrpc':'2.0','id':i+2,'method':'tools/call','params':{'name':'lyrics_export_review','arguments':{'payload':v}}} for i,v in enumerate(payloads)]
        p=run([sys.executable,'-X','utf8','music_lab_mcp.py'],''.join(json.dumps(r)+'\n' for r in requests));self.assertEqual(p.returncode,0,p.stderr);rows=[json.loads(r) for r in p.stdout.split('\n') if r]
        for i in [0,1]:self.assertEqual(rows[i+1]['result']['structuredContent'],build('lyrics_export_review',payloads[i]).wire())
        self.assertTrue(rows[3]['result']['isError'])
    def test_http_and_large_bounded_package_return_exact_source_not_a_compact_excerpt(self):
        large=copy.deepcopy(SOURCE);large['cues'][1]['text']='原\t  '*100000;validate_package(large)
        payload={'package':large,'include_package':True};wire=build('lyrics_export_review',payload).wire()
        self.assertEqual(json.loads(wire['files']['lyrics.json']),large);self.assertLess(len(wire['files']['lyrics.json'].encode()),2*1024*1024)
        self.assertLess(sum(len(v.encode()) for k,v in wire['files'].items() if k!='lyrics.json'),256*1024)
        self.assertEqual(review(payload),review({'package':large}))
        with WorkbenchServer(('127.0.0.1',0),WorkbenchHandler) as server:
            server.draft_library=None;t=threading.Thread(target=server.serve_forever);t.start()
            try:
                c=http.client.HTTPConnection(*server.server_address,timeout=10);c.request('POST','/api/lyrics-export-review',json.dumps(payload,ensure_ascii=False).encode(),{'Content-Type':'application/json'});r=c.getresponse();self.assertEqual(r.status,200);self.assertEqual(json.loads(r.read()),wire);c.close()
            finally:server.shutdown();t.join(5);self.assertFalse(t.is_alive())
