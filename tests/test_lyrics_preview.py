# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
import http.client,json,subprocess,sys,tempfile,threading,unittest
from pathlib import Path
from musiclab.application import build
from musiclab.lyric_preview import preview_contract,contract_script,PREVIEW
from music_lab_server import WorkbenchServer,WorkbenchHandler
ROOT=Path(__file__).resolve().parents[1]
PAYLOAD={'title':' 原名 <b> & " \' __TITLE__ ','cues':[{'start':1.125,'end':2.5,'text':'</script> __DATA__ 字\u0085後\u2028尾\u2029終\t  '}],'duration':10}
def inspect(data,preview,contract=None):
    code="const V=require('./web/lyrics-preview.js'),fs=require('node:fs'),x=JSON.parse(fs.readFileSync(0,'utf8'));process.stdout.write(JSON.stringify(V.createInspector(x.contract).inspect(x.data,x.preview)));"
    r=subprocess.run(['node','-e',code],cwd=ROOT,input=json.dumps({'data':data,'preview':preview,'contract':preview_contract() if contract is None else contract}),capture_output=True,text=True,encoding='utf-8',timeout=15)
    if r.returncode:raise AssertionError(r.stderr[-1000:])
    return json.loads(r.stdout)
class PreviewTests(unittest.TestCase):
    def test_shared_fixed_template_and_modules_are_identical_to_generated_envelope(self):
        c=preview_contract();self.assertEqual(c['schema_version'],1);self.assertEqual(c['template'],PREVIEW);self.assertEqual(PREVIEW,(ROOT/'musiclab/assets/lyric-preview.html').read_text(encoding='utf-8'))
        self.assertLess(len(json.dumps(c,ensure_ascii=False).encode()),256*1024)
        r=build('lyrics',PAYLOAD);self.assertEqual(inspect(r.data,r.files['preview.html']),r.data)
        self.assertNotIn('</script> __DATA__',r.files['preview.html']);self.assertIn('\\u003c/script>',r.files['preview.html'])
    def test_complete_provided_history_and_estimated_sources_are_checked_across_languages(self):
        for duration in [None,10]:
            r=build('lyrics',{**PAYLOAD,'duration':duration});p=r.data;p['timing']['applied_shift_seconds']=-.125;p['review_notes']=[' 原來歷史\t ']
            r=build('lyrics',{'package':p});self.assertEqual(inspect(r.data,r.files['preview.html']),p)
    def test_actual_cli_preview_input_retention_and_exclusive_output(self):
        with tempfile.TemporaryDirectory() as t:
            folder=Path(t);source=folder/'input.json';source.write_text(json.dumps(build('lyrics',PAYLOAD).data),encoding='utf-8');before=source.read_bytes();out=folder/'out'
            args=[sys.executable,'-X','utf8','music_lab.py','lyrics','--input',str(source),'--out',str(out)]
            r=subprocess.run(args,cwd=ROOT,capture_output=True,text=True,encoding='utf-8',timeout=10);self.assertEqual(r.returncode,0,r.stderr)
            data=json.loads((out/'lyrics.json').read_text(encoding='utf-8'));preview=(out/'preview.html').read_text(encoding='utf-8');self.assertEqual(inspect(data,preview),data)
            r=subprocess.run(args,cwd=ROOT,capture_output=True,text=True,encoding='utf-8',timeout=10);self.assertEqual(r.returncode,1);self.assertEqual(source.read_bytes(),before);self.assertEqual((out/'preview.html').read_text(encoding='utf-8'),preview)
    def test_actual_json_lines_preview_and_bad_then_good_protocol(self):
        rows=[{'protocol_version':1,'id':str(i),'operation':'lyrics','payload':p} for i,p in enumerate([{'package':{'schema_version':2}},PAYLOAD])]
        r=subprocess.run([sys.executable,'-X','utf8','music_lab_agent.py'],cwd=ROOT,input='\n'.join(json.dumps(v) for v in rows)+'\n',capture_output=True,text=True,encoding='utf-8',timeout=15);self.assertEqual(r.returncode,0,r.stderr)
        reply=[json.loads(s) for s in r.stdout.split('\n') if s];self.assertFalse(reply[0]['ok']);good=reply[1]['result'];self.assertEqual(inspect(good['data'],good['files']['preview.html']),good['data'])
    def test_actual_mcp_preview_default_tool_set_and_read_only_contract(self):
        rows=[{'jsonrpc':'2.0','id':1,'method':'initialize','params':{'protocolVersion':'2025-11-25','capabilities':{},'clientInfo':{'name':'preview-test','version':'1'}}},{'jsonrpc':'2.0','method':'notifications/initialized'},{'jsonrpc':'2.0','id':2,'method':'tools/list'},{'jsonrpc':'2.0','id':3,'method':'tools/call','params':{'name':'lyrics_validate','arguments':{'payload':PAYLOAD}}}]
        r=subprocess.run([sys.executable,'-X','utf8','music_lab_mcp.py'],cwd=ROOT,input='\n'.join(json.dumps(v) for v in rows)+'\n',capture_output=True,text=True,encoding='utf-8',timeout=15);self.assertEqual(r.returncode,0,r.stderr)
        reply={s['id']:s for s in (json.loads(v) for v in r.stdout.split('\n') if v)};self.assertEqual(len(reply[2]['result']['tools']),17)
        good=reply[3]['result']['structuredContent'];self.assertEqual(inspect(good['data'],good['files']['preview.html']),good['data'])
    def test_actual_loopback_contract_asset_order_and_source_checked_http_preview(self):
        with WorkbenchServer(('127.0.0.1',0),WorkbenchHandler) as server:
            server.draft_library=None;thread=threading.Thread(target=server.serve_forever);thread.start()
            try:
                conn=http.client.HTTPConnection('127.0.0.1',server.server_port,timeout=10)
                conn.request('GET','/');r=conn.getresponse();self.assertEqual(r.status,200);page=r.read().decode()
                self.assertLess(page.index('/lyric-preview-contract.js'),page.index('/lyrics-preview.js'));self.assertLess(page.index('/lyrics-preview.js'),page.index('/lyrics-result.js'))
                for url,expected in [('/lyric-preview-contract.js',contract_script().encode()),('/lyrics-preview.js',(ROOT/'web/lyrics-preview.js').read_bytes())]:
                    conn.request('GET',url);r=conn.getresponse();self.assertEqual(r.status,200);self.assertEqual(r.read(),expected);self.assertIn('text/javascript',r.getheader('Content-Type'));self.assertEqual(r.getheader('Cache-Control'),'no-store')
                conn.request('POST','/api/lyrics',json.dumps(PAYLOAD).encode(),{'Content-Type':'application/json'});r=conn.getresponse();self.assertEqual(r.status,200);good=json.loads(r.read());self.assertEqual(inspect(good['data'],good['files']['preview.html']),good['data']);conn.close()
            finally:server.shutdown();thread.join(10);self.assertFalse(thread.is_alive())
