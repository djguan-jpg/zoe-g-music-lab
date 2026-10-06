# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
import copy,http.client,json,subprocess,sys,tempfile,threading,unittest
from pathlib import Path
from musiclab.application import build,capabilities
from musiclab.lyrics_export_review import review,markdown,source_bytes
from music_lab_mcp import tool_list
from music_lab_server import WorkbenchServer,WorkbenchHandler
ROOT=Path(__file__).resolve().parents[1]
def package(texts):return build('lyrics',{'title':'格式 <b>','cues':[{'start':i*2,'end':i*2+1,'text':t} for i,t in enumerate(texts)],'duration':len(texts)*2}).data
SOURCE=package(['[00:04]字',' \t','[00:99.9]錯秒',' 字\u0085後\u2028尾\u2029終\t  ',' [00:04]原句'])
def run(args,content=None):return subprocess.run(args,cwd=ROOT,input=content,capture_output=True,text=True,encoding='utf-8',timeout=20)
class ExportReviewTests(unittest.TestCase):
    def test_original_rows_fields_and_compact_readonly_flags(self):
        before=copy.deepcopy(SOURCE);data=review({'package':SOURCE})
        self.assertEqual(SOURCE,before);self.assertEqual(data['issue_count'],3);self.assertEqual([(i['row'],i['format']) for i in data['issues']],[(1,'lrc'),(2,'srt'),(3,'lrc')])
        self.assertFalse(data['formats']['lrc']['end_times_encoded']);self.assertTrue(data['formats']['json']['package_metadata_preserved']);self.assertFalse(data['formats']['srt']['package_metadata_preserved'])
        self.assertNotIn('cues',data['source']);self.assertRegex(data['source']['sha256'],r'^[a-f0-9]{64}$');self.assertEqual(data['recommended_preservation'],'lyrics.json')
    def test_blank_structure_is_ascii_and_leading_tag_grammar_is_shared(self):
        source=package(['','\t ','\u0085','\u2028','\u2029','\u00a0','[0:01]字','[00:01.1234]字',' [00:01]字','[offset:9]字'])
        data=review({'package':source});self.assertEqual([(i['row'],i['format']) for i in data['issues']],[(1,'srt'),(2,'srt'),(7,'lrc')])
    def test_limits_all_counts_and_bounded_details(self):
        source=package(['[00:04]字' if i%2 else '' for i in range(10000)]);data=review({'package':source})
        self.assertEqual(data['issue_count'],10000);self.assertEqual(len(data['issues']),200);self.assertTrue(data['details_truncated']);self.assertEqual(data['formats']['lrc']['issue_count'],5000)
        self.assertLess(len((json.dumps(data,ensure_ascii=False,indent=2)+'\n'+markdown(data)).encode()),256*1024)
    def test_hash_pins_package_metadata_history_and_unicode_without_number_repr_drift(self):
        base=review({'package':SOURCE})['source']['sha256'];reordered=dict(reversed(list(SOURCE.items())));self.assertEqual(review({'package':reordered})['source']['sha256'],base)
        for mutate in [lambda p:p.update(title='其他'),lambda p:p['review_notes'].append('歷史'),lambda p:p['timing'].update(applied_shift_seconds=-.125),lambda p:p['cues'][4].update(text='不同')]:
            p=copy.deepcopy(SOURCE);mutate(p);self.assertNotEqual(review({'package':p})['source']['sha256'],base)
    def test_malformed_unknown_version_path_and_legacy_refuse(self):
        for payload in [{},{'package':SOURCE,'path':'private.wav'},{'package':{**SOURCE,'schema_version':2}},{'package':{k:v for k,v in SOURCE.items() if k not in ('format','schema_version','review_notes')}}]:
            with self.assertRaises(ValueError):review(payload)
    def test_real_node_hash_dto_and_markdown_parity(self):
        sources=[SOURCE,package(['正常','\u2028','[00:04] 原文']),package([''])]
        sources[1]['timing']['applied_shift_seconds']=-.125;sources[1]['review_notes']=[' 原文\t ']
        code="const R=require('./musiclab/assets/lyrics-export-review.js'),fs=require('node:fs');(async()=>{const a=[];for(const p of JSON.parse(fs.readFileSync(0,'utf8'))){const d=await R.review({package:p});a.push([d,R.markdown(d)]);}console.log(JSON.stringify(a));})();"
        result=run(['node','-e',code],json.dumps(sources));self.assertEqual(result.returncode,0,result.stderr[-1000:]);self.assertEqual(json.loads(result.stdout),[[review({'package':p}),markdown(review({'package':p}))] for p in sources])
    def test_cli_preserves_input_refuses_overwrite_and_reports_attention(self):
        with tempfile.TemporaryDirectory() as folder:
            source=Path(folder)/'source.json';source.write_text(json.dumps(SOURCE),encoding='utf-8');before=source.read_bytes();out=Path(folder)/'out'
            args=[sys.executable,'-X','utf8','music_lab.py','lyrics-export-review','--input',str(source),'--out',str(out)]
            first=run(args);self.assertEqual(first.returncode,2,first.stderr);self.assertEqual(source.read_bytes(),before)
            expected=build('lyrics_export_review',{'package':SOURCE}).files;self.assertEqual({p.name:p.read_text(encoding='utf-8') for p in out.iterdir()},expected)
            second=run(args);self.assertEqual(second.returncode,1);self.assertEqual(source.read_bytes(),before);self.assertEqual({p.name:p.read_text(encoding='utf-8') for p in out.iterdir()},expected)
    def test_agent_mcp_bad_then_good_discovery_readonly_no_extra_paths(self):
        payload={'package':SOURCE};expected=build('lyrics_export_review',payload).wire();self.assertTrue(expected['meta']['needs_review'])
        rows=[{'protocol_version':1,'id':str(i),'operation':'lyrics_export_review','payload':p} for i,p in enumerate([{'package':SOURCE,'path':'bad'},payload])]
        result=run([sys.executable,'-X','utf8','music_lab_agent.py'],''.join(json.dumps(r)+'\n' for r in rows));self.assertEqual(result.returncode,0);replies=[json.loads(r) for r in result.stdout.splitlines()];self.assertFalse(replies[0]['ok']);self.assertEqual(replies[1]['result'],expected)
        rows=[{'jsonrpc':'2.0','id':1,'method':'initialize','params':{'protocolVersion':'2025-11-25','capabilities':{},'clientInfo':{'name':'export-check','version':'1'}}},{'jsonrpc':'2.0','method':'notifications/initialized'},{'jsonrpc':'2.0','id':2,'method':'tools/list'},{'jsonrpc':'2.0','id':3,'method':'tools/call','params':{'name':'lyrics_export_review','arguments':{'payload':payload}}}]
        result=run([sys.executable,'-X','utf8','music_lab_mcp.py'],''.join(json.dumps(r)+'\n' for r in rows));self.assertEqual(result.returncode,0);replies=[json.loads(r) for r in result.stdout.splitlines()];self.assertEqual(len(replies[1]['result']['tools']),17);self.assertEqual(replies[2]['result']['structuredContent'],expected)
        tool=next(t for t in tool_list() if t['name']=='lyrics_export_review');self.assertTrue(tool['annotations']['readOnlyHint']);self.assertFalse(tool['annotations']['openWorldHint']);self.assertEqual(capabilities()['lyrics_export_review']['schema_version'],1)
    def test_actual_http_route_asset_order_and_no_table_mutation(self):
        with WorkbenchServer(('127.0.0.1',0),WorkbenchHandler) as server:
            server.draft_library=None;t=threading.Thread(target=server.serve_forever);t.start()
            try:
                c=http.client.HTTPConnection(*server.server_address,timeout=10);c.request('POST','/api/lyrics-export-review',json.dumps({'package':SOURCE}),{'Content-Type':'application/json'});r=c.getresponse();self.assertEqual(r.status,200);self.assertEqual(json.loads(r.read()),build('lyrics_export_review',{'package':SOURCE}).wire())
                for url,file in [('/lyrics-export-review.js','musiclab/assets/lyrics-export-review.js'),('/lyrics-export.js','web/lyrics-export.js')]:
                    c.request('GET',url);r=c.getresponse();self.assertEqual(r.status,200);self.assertEqual(r.read(),(ROOT/file).read_bytes())
                c.request('GET','/');r=c.getresponse();page=r.read().decode();self.assertLess(page.index('/lyrics-lrc.js'),page.index('/lyrics-export-review.js'));self.assertLess(page.index('/lyrics-export.js'),page.index('/app.js'));self.assertIn('id="lyrics-export-box"',page);c.close()
            finally:server.shutdown();t.join(10);self.assertFalse(t.is_alive())
