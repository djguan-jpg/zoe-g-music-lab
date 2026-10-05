# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
"""Actual source bytes and transport replies cross the browser boundary together."""
import base64
import hashlib
import http.client
import json
import subprocess
import sys
import tempfile
import threading
import unittest
from pathlib import Path
from urllib.parse import quote

from musiclab.application import build
from music_lab_server import WorkbenchServer, WorkbenchHandler
from test_audio_evidence import wav_bytes

ROOT = Path(__file__).resolve().parents[1]
DRAFT = {'format':'zoe-audio-acceptance-draft','schema_version':1,'profile':'distribution','custom':False,
         'fields':{'rates':'48000','bits':'16','channels':'1'}}


def browser(value, code):
    r = subprocess.run(['node','-e',code],cwd=ROOT,input=json.dumps(value),capture_output=True,
                       text=True,encoding='utf-8',timeout=30)
    if r.returncode:
        raise AssertionError((r.stdout+r.stderr)[-2400:])
    return json.loads(r.stdout)


class AudioResultTests(unittest.TestCase):
    def test_real_same_name_size_wrong_source_and_seven_reply_gaps_refuse_before_result_write(self):
        with tempfile.TemporaryDirectory() as folder:
            path=Path(folder)/'synthetic.wav';raw=wav_bytes(channels=1);path.write_bytes(raw)
            altered=bytearray(raw);altered[44:46]=(2000).to_bytes(2,'little',signed=True)
            other=Path(folder)/'other.wav';other.write_bytes(altered)
            drafted=build('audio',{'acceptance_draft':DRAFT,'display_name':path.name},audio_source=path).wire()
            preset=build('audio',{'profile':'distribution','display_name':path.name},audio_source=path).wire()
            wrong=build('audio',{'acceptance_draft':DRAFT,'display_name':path.name},audio_source=other).wire()
            self.assertEqual(len(raw),len(altered));self.assertNotEqual(drafted['data']['sha256'],wrong['data']['sha256'])
            code="""const fs=require('fs'),audio=require('./web/audio-review.js'),row=JSON.parse(fs.readFileSync(0,'utf8'));
            const file=new File([Buffer.from(row.raw,'base64')],'synthetic.wav');
            const changes=[['protocol',r=>r.meta.protocol_version=999,true],['product',r=>{r.meta.version=r.data.version='99.0.0';r.files['report.json']=JSON.stringify(r.data)},true],
             ['tool',r=>{r.data.tool='Other';r.files['report.json']=JSON.stringify(r.data)},true],['missing_md',r=>delete r.files['report.md'],true],
             ['preset_json',r=>r.files['report.json']='{}',false],['preset_name',r=>{r.data.file='wrong.wav';r.files['report.json']=JSON.stringify(r.data)},false],['actual_source',()=>{},true]];
            (async()=>{let refused=0,writes=0;const previous={text:'原成果🎵'};
             for(const [name,change,draft] of changes){const wire=structuredClone(name==='actual_source'?row.wrong:draft?row.drafted:row.preset);change(wire);
              const selection={file,profile:'distribution',...(draft?{acceptanceDraft:row.drafted.data.acceptance_draft}:{})};
              try{await audio.inspect({selected:()=>selection,isCurrent:()=>true,request:async()=>wire,onResult:()=>{writes++;previous.text='changed'}});throw Error('accepted '+name);}
              catch(e){if(!e.message.includes('沒有替換目前結果'))throw e;refused++;}}
             if(previous.text!=='原成果🎵'||writes)throw Error('prior result changed');
             for(const [wire,draft] of [[row.preset,false],[row.drafted,true]]){const selection={file,profile:'distribution',...(draft?{acceptanceDraft:row.drafted.data.acceptance_draft}:{})};
              if(!await audio.inspect({selected:()=>selection,isCurrent:()=>true,request:async()=>wire,onResult:()=>writes++}))throw Error('retry rejected');}
             console.log(JSON.stringify({refused,retries:writes,source_bytes_preserved:(await file.arrayBuffer()).byteLength===file.size}));
            })().catch(e=>{console.error(e);process.exitCode=1});"""
            self.assertEqual(browser({'raw':base64.b64encode(raw).decode(),'drafted':drafted,'preset':preset,'wrong':wrong},code),
                             {'refused':7,'retries':2,'source_bytes_preserved':True})
            self.assertEqual(path.read_bytes(),raw);self.assertEqual(other.read_bytes(),altered)

    def test_actual_cli_agent_mcp_http_after_invalid_requests_share_source_bound_current_reports(self):
        with tempfile.TemporaryDirectory() as folder:
            path=Path(folder)/'原創🎵.wav';raw=wav_bytes(rate=8000,width=1,channels=1);path.write_bytes(raw)
            expected=build('audio',{},audio_source=path).wire()
            def run(name,args,requests):
                r=subprocess.run([sys.executable,'-X','utf8',str(ROOT/name),*args],cwd=folder,input=requests,
                                 capture_output=True,timeout=25)
                self.assertEqual(r.returncode,0,r.stderr[-1000:]);return [json.loads(line) for line in r.stdout.splitlines()]
            invalid={'protocol_version':999,'id':'bad','operation':'audio','payload':{}}
            valid={**invalid,'protocol_version':1,'id':'good'}
            agent=run('music_lab_agent.py',['--audio',str(path)],(json.dumps(invalid)+'\n'+json.dumps(valid)+'\n').encode())
            self.assertFalse(agent[0]['ok']);self.assertEqual(agent[1]['result'],expected)
            requests=[{'jsonrpc':'2.0','id':1,'method':'initialize','params':{'protocolVersion':'2025-11-25','capabilities':{},'clientInfo':{'name':'audio-result-test','version':'1'}}},
                      {'jsonrpc':'2.0','method':'notifications/initialized'},
                      {'jsonrpc':'2.0','id':2,'method':'tools/call','params':{'name':'audio_report','arguments':{'payload':{'profile':'unknown'}}}},
                      {'jsonrpc':'2.0','id':3,'method':'tools/call','params':{'name':'audio_report','arguments':{'payload':{}}}}]
            mcp=run('music_lab_mcp.py',['--audio',str(path)],''.join(json.dumps(r)+'\n' for r in requests).encode())
            self.assertTrue(mcp[-2]['result']['isError']);self.assertEqual(mcp[-1]['result']['structuredContent'],expected)
            cli=subprocess.run([sys.executable,'-X','utf8',str(ROOT/'music_lab.py'),'audio','--input',str(path),'--out',str(Path(folder)/'report')],capture_output=True,timeout=25)
            self.assertEqual(cli.returncode,2,cli.stderr[-1000:]);self.assertEqual((Path(folder)/'report/report.json').read_text(encoding='utf-8'),expected['files']['report.json'])
            self.assertEqual((Path(folder)/'report/report.md').read_bytes(),expected['files']['report.md'].encode('utf-8'))
            with WorkbenchServer(('127.0.0.1',0),WorkbenchHandler) as server:
                server.draft_library=None;thread=threading.Thread(target=server.serve_forever,daemon=True);thread.start()
                try:
                    connection=http.client.HTTPConnection('127.0.0.1',server.server_address[1],timeout=10)
                    for asset in ['audio-file.js','audio-result.js','audio-report.js']:
                        connection.request('GET','/'+asset);response=connection.getresponse();self.assertEqual(response.status,200)
                        self.assertEqual(response.read(),(ROOT/'web'/asset).read_bytes())
                    for profile,status in [('unknown',400),('distribution',200)]:
                        connection.request('POST','/api/audio?name='+quote(path.name)+'&profile='+profile,raw,{'Content-Type':'audio/wav'})
                        response=connection.getresponse();self.assertEqual(response.status,status);wire=json.loads(response.read())
                    self.assertEqual(wire,expected);connection.close()
                finally:
                    server.shutdown();thread.join(timeout=10);self.assertFalse(thread.is_alive())
            code="""const fs=require('fs'),audio=require('./web/audio-review.js'),row=JSON.parse(fs.readFileSync(0,'utf8'));
            const file=new File([Buffer.from(row.raw,'base64')],row.name),selection={file,profile:'distribution'};
            (async()=>{let accepted=0;for(const wire of row.wires)await audio.inspect({selected:()=>selection,isCurrent:()=>true,request:async()=>wire,onResult:()=>accepted++});
            console.log(JSON.stringify({accepted}));})().catch(e=>{console.error(e);process.exitCode=1});"""
            self.assertEqual(browser({'raw':base64.b64encode(raw).decode(),'name':path.name,
                                     'wires':[expected,agent[1]['result'],mcp[-1]['result']['structuredContent'],wire]},code),{'accepted':4})
            self.assertEqual(path.read_bytes(),raw);self.assertEqual(expected['data']['sha256'],hashlib.sha256(raw).hexdigest())


if __name__ == '__main__':
    unittest.main()
