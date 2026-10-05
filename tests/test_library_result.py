# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
import copy, http.client, json, subprocess, sys, tempfile, threading, unittest
from pathlib import Path
from musiclab.application import build
from musiclab.draft_library import DraftLibrary
from music_lab_server import WorkbenchHandler, WorkbenchServer
from test_draft_library import draft

ROOT=Path(__file__).resolve().parents[1]
IDS=['draft-'+f'{n:032x}' for n in (1,2,3)]

def run(args, *, cwd=ROOT, requests=None):
    reply=subprocess.run(args,cwd=cwd,input=None if requests is None else ''.join(json.dumps(v,ensure_ascii=False)+'\n' for v in requests),capture_output=True,text=True,encoding='utf-8',timeout=20)
    if reply.returncode: raise AssertionError(reply.stderr[-1500:])
    return reply.stdout

def checked(cases):
    source="const L=require('./web/library-result.js'),D=require('./web/library-revision.js'),R=require('./web/library-receipt.js'),E=require('./web/editor-state.js');let s='';process.stdin.on('data',v=>s+=v);process.stdin.on('end',()=>console.log(JSON.stringify(JSON.parse(s).map(c=>{try{const data=L.checkedEnvelope(c.action,c.wire);return {ok:true,data:c.action==='list'?L.checkedList(c.payload,data,c.after||null):c.action==='read'?D.checkedRead(c.payload.id,data,E.validateDraft,c.selected):R.checkedAck(c.payload,data,E.validateDraft)};}catch(e){return {ok:false};}}))));"
    reply=subprocess.run(['node','-e',source],cwd=ROOT,input=json.dumps(cases,ensure_ascii=False),capture_output=True,text=True,encoding='utf-8',timeout=15)
    if reply.returncode: raise AssertionError(reply.stderr[-1500:])
    return json.loads(reply.stdout)

def seeded(folder):
    library=DraftLibrary(folder); payloads=[]
    for i,identifier in enumerate(IDS):
        value=draft();value['panels']['music']['fields']['music-title']='🎵'*119+'甲尾\r\n'+str(i)
        p={'id':identifier,'label':' 原案🎵\r\n '+str(i),'draft':value};build('draft_save',p,draft_library=library);payloads.append(p)
    return library,payloads

class LibraryResultTests(unittest.TestCase):
    def test_actual_cli_agent_and_mcp_full_wire_share_pure_library_checks(self):
        with tempfile.TemporaryDirectory() as folder:
            library,payloads=seeded(Path(folder)/'selected'); path=str(library.root)
            page=build('draft_list',{'limit':2,'cursor':None},draft_library=library).wire();after=page['data']['entries'][-1]
            p={'limit':2,'cursor':page['data']['next_cursor']}
            cli=json.loads(run([sys.executable,'-X','utf8',str(ROOT/'music_lab.py'),'draft','list','--library',path,'--limit','2','--cursor',p['cursor']],cwd=folder))
            actions=[('list',{'limit':2,'cursor':None}),('list',p),('read',{'id':IDS[0]}),('save',payloads[0])]
            agent=[json.loads(v)['result'] for v in run([sys.executable,'-X','utf8',str(ROOT/'music_lab_agent.py'),'--draft-library',path],cwd=folder,requests=[{'protocol_version':1,'id':str(i),'operation':'draft_'+a,'payload':d} for i,(a,d) in enumerate(actions)]).splitlines()]
            requests=[{'jsonrpc':'2.0','id':1,'method':'initialize','params':{'protocolVersion':'2025-11-25','capabilities':{},'clientInfo':{'name':'library-wire-qa','version':'1'}}},{'jsonrpc':'2.0','method':'notifications/initialized'}]
            requests += [{'jsonrpc':'2.0','id':i+2,'method':'tools/call','params':{'name':'draft_'+a,'arguments':{'payload':d}}} for i,(a,d) in enumerate(actions)]
            mcp=[json.loads(v)['result']['structuredContent'] for v in run([sys.executable,'-X','utf8',str(ROOT/'music_lab_mcp.py'),'--draft-library',path],cwd=folder,requests=requests).splitlines()[1:]]
            self.assertEqual(cli,agent[1]);self.assertEqual(agent,mcp)
            selected=library.metadata(IDS[0]);cases=[{'action':'list','payload':p,'after':after,'wire':cli}]
            for wires in [agent,mcp]:
                for (action,payload),wire in zip(actions,wires):cases.append({'action':action,'payload':payload,'wire':wire,'after':after if payload.get('cursor') else None,'selected':selected})
            before=copy.deepcopy(cases);results=checked(cases);self.assertTrue(all(r['ok'] for r in results));self.assertEqual(cases,before)
            self.assertEqual(selected['titles']['music'],'🎵'*119+'甲');self.assertEqual(agent[3]['data']['reused'],True)
            for action,payload in actions:
                wrong=build('draft_'+action,payload,draft_library=library).wire();wrong['meta']['version']='99.0.0';self.assertFalse(checked([{'action':action,'payload':payload,'wire':wrong,'after':after,'selected':selected}])[0]['ok'])

    def test_real_loopback_asset_pages_and_read_wires_preserve_source_and_host_origin_gates(self):
        class Quiet(WorkbenchHandler):
            def log_message(self,*args): pass
        with tempfile.TemporaryDirectory() as folder:
            library,payloads=seeded(Path(folder)/'selected')
            before={p.relative_to(library.root).as_posix():p.read_bytes() for p in library.root.rglob('*') if p.is_file()}
            server=WorkbenchServer(('127.0.0.1',0),Quiet);server.draft_library=library
            thread=threading.Thread(target=server.serve_forever);thread.start()
            def request(path,payload=None,headers=None):
                c=http.client.HTTPConnection('127.0.0.1',server.server_port,timeout=5)
                try:
                    c.request('GET' if payload is None else 'POST',path,None if payload is None else json.dumps(payload).encode(),headers or {})
                    response=c.getresponse();return response.status,response.read()
                finally: c.close()
            try:
                status,asset=request('/library-result.js');self.assertEqual(status,200);self.assertEqual(asset,(ROOT/'web/library-result.js').read_bytes())
                index=request('/')[1].decode();self.assertLess(index.index('/library-revision.js'),index.index('/library-result.js'));self.assertLess(index.index('/library-result.js'),index.index('/app.js'))
                payload={'limit':2,'cursor':None};status,raw=request('/api/drafts/list',payload);self.assertEqual(status,200);wire=json.loads(raw)
                self.assertTrue(checked([{'action':'list','payload':payload,'wire':wire}])[0]['ok']);after=wire['data']['entries'][-1]
                payload={'limit':2,'cursor':wire['data']['next_cursor']};status,raw=request('/api/drafts/list',payload);self.assertEqual(status,200)
                self.assertTrue(checked([{'action':'list','payload':payload,'after':after,'wire':json.loads(raw)}])[0]['ok'])
                status,raw=request('/api/drafts/read',{'id':IDS[0]});self.assertEqual(status,200);self.assertTrue(checked([{'action':'read','payload':{'id':IDS[0]},'selected':library.metadata(IDS[0]),'wire':json.loads(raw)}])[0]['ok'])
                self.assertEqual(request('/api/drafts/list',{}, {'Origin':'https://outside.invalid'})[0],403)
                self.assertEqual(request('/library-result.js',headers={'Host':'outside.invalid'})[0],403)
                self.assertEqual(before,{p.relative_to(library.root).as_posix():p.read_bytes() for p in library.root.rglob('*') if p.is_file()})
                self.assertFalse(hasattr(server,'backup_downloads'));self.assertFalse(hasattr(server,'delivery_downloads'))
            finally: server.shutdown();thread.join(5);server.server_close()
            self.assertFalse(thread.is_alive())

if __name__=='__main__':unittest.main()
