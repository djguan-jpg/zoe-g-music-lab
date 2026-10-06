# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
import copy
import hashlib
import http.client
import io
import json
import subprocess
import sys
import tempfile
import threading
import unittest
from http.server import ThreadingHTTPServer
from pathlib import Path
from musiclab.application import build
from musiclab.draft_backup import export_backup, restore_backup
from musiclab.draft_library import DraftLibrary
from music_lab_server import WorkbenchHandler
from test_draft_backup import populate, contents

ROOT = Path(__file__).resolve().parents[1]

def checked(cases):
    script = "const B=require('./web/backup-result.js');let s='';process.stdin.on('data',v=>s+=v);process.stdin.on('end',()=>console.log(JSON.stringify(JSON.parse(s).map(([op,w,p,plan])=>{try{return {ok:true,data:op==='inspect'?B.checkedInspect(w,p):B.checkedRestore(w,p,plan)};}catch(error){return {ok:false};}}))));"
    r = subprocess.run(['node','-e',script],cwd=ROOT,input=json.dumps(cases,ensure_ascii=False),capture_output=True,text=True,encoding='utf-8',timeout=15)
    if r.returncode: raise AssertionError(r.stderr[-1500:])
    return json.loads(r.stdout)

def run(args, folder, requests=None):
    r = subprocess.run(args,cwd=folder,input=None if requests is None else ''.join(json.dumps(v)+'\n' for v in requests),capture_output=True,text=True,encoding='utf-8',timeout=20)
    if r.returncode: raise AssertionError((r.stdout+r.stderr)[-1500:])
    return r.stdout

class BackupResultTests(unittest.TestCase):
    def test_real_backup_empty_reused_conflict_and_restore_counts_pin_actual_selected_bytes(self):
        with tempfile.TemporaryDirectory() as folder:
            source = populate(Path(folder)/'source'); raw,summary=export_backup(source); before=contents(source.root)
            proof={'bytes':len(raw),'sha256':hashlib.sha256(raw).hexdigest()}; target=DraftLibrary(Path(folder)/'target')
            inspect=build('draft_backup_inspect',{},draft_library=target,backup_source=io.BytesIO(raw)).wire()
            wrong=copy.deepcopy(inspect);wrong['data']['backup_sha256']='f'*64
            restored=build('draft_backup_restore',{'backup_sha256':summary['backup_sha256']},draft_library=target,backup_source=io.BytesIO(raw)).wire()
            reused=build('draft_backup_restore',{'backup_sha256':summary['backup_sha256']},draft_library=target,backup_source=io.BytesIO(raw)).wire()
            result=checked([['inspect',inspect,proof,None],['inspect',wrong,proof,None],['restore',restored,proof,inspect['data']],['restore',reused,proof,inspect['data']]])
            self.assertEqual([v['ok'] for v in result],[True,False,True,True]);self.assertEqual(restored['data']['added_count'],2);self.assertEqual(reused['data']['added_count'],0)
            self.assertEqual(contents(source.root),before)
            for identifier in source.directories():self.assertEqual(source.revision_bytes(identifier)[:2],target.revision_bytes(identifier)[:2])
            # Same ID but independently saved bytes are a valid non-restorable conflict preview.
            conflict=populate(Path(folder)/'conflict',1)
            preview=build('draft_backup_inspect',{},draft_library=conflict,backup_source=io.BytesIO(raw)).wire()
            self.assertFalse(preview['data']['can_restore']);self.assertTrue(checked([['inspect',preview,proof,None]])[0]['ok'])
            empty_raw,_=export_backup(DraftLibrary(Path(folder)/'empty'));empty_proof={'bytes':len(empty_raw),'sha256':hashlib.sha256(empty_raw).hexdigest()}
            empty=build('draft_backup_inspect',{},draft_library=target,backup_source=io.BytesIO(empty_raw)).wire();self.assertTrue(checked([['inspect',empty,empty_proof,None]])[0]['ok'])

    def test_native_file_hash_actual_http_full_wire_and_fixed_asset_order(self):
        class Quiet(WorkbenchHandler):
            def log_message(self,*args):pass
        with tempfile.TemporaryDirectory() as folder:
            raw,_=export_backup(populate(Path(folder)/'source'));target=DraftLibrary(Path(folder)/'target')
            server=ThreadingHTTPServer(('127.0.0.1',0),Quiet);server.draft_library=target;thread=threading.Thread(target=server.serve_forever,daemon=True);thread.start()
            def request(path,payload=None):
                c=http.client.HTTPConnection('127.0.0.1',server.server_port,timeout=5)
                try:
                    c.request('GET' if payload is None else 'POST',path,payload);r=c.getresponse();self.assertEqual(r.status,200);return r.read()
                finally:c.close()
            try:
                for name in ['backup-file.js','backup-result.js']:self.assertEqual(request('/'+name),(ROOT/'web'/name).read_bytes())
                index=request('/').decode();self.assertLess(index.index('/backup-result.js'),index.index('/backup-transfer.js'));self.assertLess(index.index('/backup-file.js'),index.index('/app.js'))
                # Node native File/default WebCrypto hashes the same bytes used by the HTTP adapter.
                script="const F=require('./web/backup-file.js');let s='';process.stdin.on('data',v=>s+=v);process.stdin.on('end',async()=>console.log(JSON.stringify(await F.inspect(new File([Buffer.from(s,'base64')],'selected.zip')))));"
                import base64
                r=subprocess.run(['node','-e',script],cwd=ROOT,input=base64.b64encode(raw).decode(),capture_output=True,text=True,encoding='utf-8',timeout=15);self.assertEqual(r.returncode,0,r.stderr);proof=json.loads(r.stdout)
                inspect=json.loads(request('/api/drafts/backup/inspect',raw)); restored=json.loads(request('/api/drafts/backup/restore?sha256='+proof['sha256'],raw))
                changed=copy.deepcopy(restored);changed['data']['added_count']+=1
                self.assertEqual([v['ok'] for v in checked([['inspect',inspect,proof,None],['restore',restored,proof,inspect['data']],['restore',changed,proof,inspect['data']]])],[True,True,False])
            finally:server.shutdown();server.server_close();thread.join(5);self.assertFalse(thread.is_alive())

    def test_cli_agent_mcp_share_full_backup_result_contract_and_readonly_write_annotations(self):
        with tempfile.TemporaryDirectory() as folder:
            source=populate(Path(folder)/'source');raw,summary=export_backup(source);backup=Path(folder)/'source.zip';backup.write_bytes(raw);proof={'bytes':len(raw),'sha256':summary['backup_sha256']}
            cli_path=str(Path(folder)/'cli')
            cli=json.loads(run([sys.executable,'-X','utf8',str(ROOT/'music_lab.py'),'draft','inspect','--library',cli_path,'--input',str(backup)],folder))
            requests=[{'protocol_version':1,'id':str(i),'operation':op,'payload':payload} for i,(op,payload) in enumerate([('draft_backup_inspect',{}),('draft_backup_restore',{'backup_sha256':proof['sha256']}),('draft_backup_restore',{'backup_sha256':proof['sha256']})])]
            agent=[json.loads(v) for v in run([sys.executable,'-X','utf8',str(ROOT/'music_lab_agent.py'),'--draft-library',str(Path(folder)/'agent'),'--draft-backup',str(backup)],folder,requests).splitlines()]
            self.assertTrue(all(v['ok'] for v in agent));a,b,c=[v['result'] for v in agent]
            requests=[{'jsonrpc':'2.0','id':1,'method':'initialize','params':{'protocolVersion':'2025-11-25','capabilities':{},'clientInfo':{'name':'synthetic-backup','version':'1'}}},{'jsonrpc':'2.0','method':'notifications/initialized'},{'jsonrpc':'2.0','id':2,'method':'tools/list'}]
            requests += [{'jsonrpc':'2.0','id':i+3,'method':'tools/call','params':{'name':op,'arguments':{'payload':payload}}} for i,(op,payload) in enumerate([('draft_backup_inspect',{}),('draft_backup_restore',{'backup_sha256':proof['sha256']})])]
            mcp=[json.loads(v) for v in run([sys.executable,'-X','utf8',str(ROOT/'music_lab_mcp.py'),'--draft-library',str(Path(folder)/'mcp'),'--draft-backup',str(backup)],folder,requests).splitlines()]
            tools={t['name']:t for t in mcp[1]['result']['tools']};self.assertEqual(len(tools),27);self.assertTrue(tools['draft_backup_inspect']['annotations']['readOnlyHint']);self.assertFalse(tools['draft_backup_restore']['annotations']['readOnlyHint'])
            x,y=[v['result']['structuredContent'] for v in mcp[2:]]
            cases=[['inspect',w,proof,None] for w in [cli,a,x]]+[['restore',w,proof,a['data']] for w in [b,c,y]]
            self.assertTrue(all(v['ok'] for v in checked(cases)));self.assertEqual(a,cli);self.assertEqual(x,cli);self.assertEqual(b,y);self.assertEqual(c['data']['reused_count'],2);self.assertEqual(backup.read_bytes(),raw)

if __name__=='__main__':unittest.main()
