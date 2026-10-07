# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
import copy,json,subprocess,sys,tempfile,unittest,http.client,threading
from pathlib import Path
from musiclab.lyric_timing import normalized_seconds
from musiclab.application import build
from music_lab_server import WorkbenchServer,WorkbenchHandler
ROOT=Path(__file__).resolve().parents[1]
class LyricsWhitespaceTests(unittest.TestCase):
    def test_authoritative_decimal_boundary_and_original_source(self):
        for c in ('\ufeff','\u200b','\u180e','\u001c','\u001d','\u001e','\u001f'):
            with self.assertRaises(ValueError):normalized_seconds(c+'1.5'+c)
        for c in ('\u0085','\u00a0','\u1680','\u2028','\u2029','\u3000'):
            self.assertEqual(normalized_seconds(c+'1.2345'+c),1.235)
        payload={'title':'合成原句','duration':4,'cues':[{'start':'\ufeff1\ufeff','end':2,'text':'原文'}]};before=copy.deepcopy(payload)
        with self.assertRaises(ValueError):build('lyrics',payload)
        self.assertEqual(payload,before)
    def test_jsonlines_and_mcp_good_bad_good_keep_original_clock_contract(self):
        good={'title':'合成原句','duration':4,'cues':[{'start':'\u00851\u0085','end':2,'text':'原文'}]};bad=copy.deepcopy(good);bad['cues'][0]['start']='\ufeff1\ufeff';values=[good,bad,good]
        rows=[{'protocol_version':1,'id':str(i),'operation':'lyrics','payload':p} for i,p in enumerate(values)]
        p=subprocess.run([sys.executable,'-X','utf8','music_lab_agent.py'],cwd=ROOT,input=''.join(json.dumps(x)+'\n' for x in rows),capture_output=True,encoding='utf-8',timeout=15);self.assertEqual(p.returncode,0,p.stderr);replies=[json.loads(x) for x in p.stdout.splitlines()];self.assertEqual([x['ok'] for x in replies],[True,False,True]);self.assertEqual(replies[0]['result'],build('lyrics',good).wire());self.assertEqual(replies[0]['result'],replies[2]['result'])
        rows=[{'jsonrpc':'2.0','id':1,'method':'initialize','params':{'protocolVersion':'2025-11-25','capabilities':{},'clientInfo':{'name':'whitespace-check','version':'1'}}},{'jsonrpc':'2.0','method':'notifications/initialized'}]+[{'jsonrpc':'2.0','id':i+2,'method':'tools/call','params':{'name':'lyrics_validate','arguments':{'payload':v}}} for i,v in enumerate(values)]
        p=subprocess.run([sys.executable,'-X','utf8','music_lab_mcp.py'],cwd=ROOT,input=''.join(json.dumps(x)+'\n' for x in rows),capture_output=True,encoding='utf-8',timeout=15);self.assertEqual(p.returncode,0,p.stderr);replies=[json.loads(x) for x in p.stdout.splitlines()][1:];self.assertEqual([bool(x['result'].get('isError',False)) for x in replies],[False,True,False]);self.assertEqual(replies[0]['result']['structuredContent'],build('lyrics',good).wire());self.assertEqual(replies[0]['result']['structuredContent'],replies[2]['result']['structuredContent'])
    def test_cli_and_http_reject_bom_recover_and_preserve_input(self):
        good={'title':'合成原句','duration':4,'cues':[{'start':'\u00851\u0085','end':2,'text':'原文'}]};bad=copy.deepcopy(good);bad['cues'][0]['start']='\ufeff1\ufeff'
        with tempfile.TemporaryDirectory() as folder:
            root=Path(folder)
            for i,v in enumerate([good,bad,good]):
                source=root/f'input-{i}.json';source.write_text(json.dumps({'cues':v['cues']}),encoding='utf-8');before=source.read_bytes();out=root/f'out-{i}'
                p=subprocess.run([sys.executable,'-X','utf8',str(ROOT/'music_lab.py'),'lyrics','--input',str(source),'--duration','4','--title',v['title'],'--out',str(out)],cwd=ROOT,capture_output=True,encoding='utf-8',timeout=15);self.assertEqual(p.returncode,1 if i==1 else 0,p.stderr);self.assertEqual(source.read_bytes(),before)
                if i==1:self.assertFalse(out.exists())
                else:self.assertEqual({x.name:x.read_text(encoding='utf-8') for x in out.iterdir()},build('lyrics',v).files)
        with WorkbenchServer(('127.0.0.1',0),WorkbenchHandler) as server:
            server.draft_library=None;t=threading.Thread(target=server.serve_forever,daemon=True);t.start()
            try:
                for v,status in [(good,200),(bad,400),(good,200)]:
                    c=http.client.HTTPConnection(*server.server_address,timeout=10);c.request('POST','/api/lyrics',json.dumps(v),{'Content-Type':'application/json'});response=c.getresponse();raw=response.read();c.close();self.assertEqual(response.status,status)
                    if status==200:self.assertEqual(json.loads(raw),build('lyrics',v).wire())
            finally:server.shutdown();t.join(5);self.assertFalse(t.is_alive())
