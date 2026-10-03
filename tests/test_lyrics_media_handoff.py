# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
import copy
import http.client
import json
import re
import subprocess
import sys
import tempfile
import threading
import unittest
from pathlib import Path
from musiclab.application import build
from music_lab_server import WorkbenchHandler, WorkbenchServer

ROOT=Path(__file__).resolve().parents[1]


def requests():
    source=build('lyrics',{'title':'原創時長交接','duration':10,'cues':[{'start':0,'end':2,'text':'保留十秒尾奏'}]}).data
    script="""
const fs=require('node:fs'),M=require('./musiclab/assets/lyrics-media.js'),P=require('./musiclab/assets/lyrics-package.js');
const source=JSON.parse(fs.readFileSync(0,'utf8'));let duration='10';
const controller=M.createController({capture:()=>duration,apply:v=>{duration=v;controller.refresh();},onState:()=>{}});
const request=()=>P.buildRequest({title:source.title,cues:source.cues,duration:Number(duration),content:JSON.stringify(source),suffix:'.json'});
controller.select('blob:original-synthetic');controller.loaded('blob:original-synthetic',4);const kept=request();
controller.adopt();const adopted=request();controller.undo();const undone=request();
process.stdout.write(JSON.stringify([kept,adopted,undone]));
"""
    result=subprocess.run(['node','-e',script],cwd=ROOT,input=json.dumps(source),capture_output=True,encoding='utf-8',timeout=10)
    if result.returncode:raise AssertionError(result.stderr)
    values=json.loads(result.stdout);assert values[0]==values[2]=={'package':source}
    assert values[1]['package']['duration']==4 and values[1]['package']['cues']==source['cues']
    return values


class LyricsMediaHandoffTests(unittest.TestCase):
    def test_actual_shared_browser_controller_requests_keep_adopt_and_undo_domain_metadata(self):
        values=requests();original=copy.deepcopy(values)
        for payload,expected in zip(values,[10,4,10]):
            result=build('lyrics',payload)
            self.assertEqual(result.data['duration'],expected)
            self.assertEqual(result.data['cues'],values[0]['package']['cues'])
            self.assertEqual(result.needs_review,expected==4)
            self.assertEqual(set(result.files),{'lyrics.json','lyrics.lrc','lyrics.srt','preview.html'})
        self.assertEqual(values,original)

    def test_real_cli_exports_all_three_choices_without_changing_source_or_overwriting(self):
        with tempfile.TemporaryDirectory() as folder:
            temp=Path(folder)
            for i,payload in enumerate(requests()):
                source=temp/f'choice-{i}.json';source.write_text(json.dumps(payload['package']),encoding='utf-8');before=source.read_bytes()
                out=temp/f'choice-{i}';args=[sys.executable,'-X','utf8',str(ROOT/'music_lab.py'),'lyrics','--input',str(source),'--out',str(out)]
                p=subprocess.run(args,cwd=temp,capture_output=True,encoding='utf-8',timeout=15)
                self.assertEqual(p.returncode,0,p.stderr);self.assertEqual(source.read_bytes(),before)
                expected=build('lyrics',payload).files
                self.assertEqual({f.name:f.read_bytes().decode('utf-8') for f in out.iterdir()},expected)
                p=subprocess.run(args,cwd=temp,capture_output=True,encoding='utf-8',timeout=15)
                self.assertEqual(p.returncode,1);self.assertEqual({f.name:f.read_bytes().decode('utf-8') for f in out.iterdir()},expected)

    def test_real_jsonlines_and_mcp_reject_short_declaration_then_preserve_three_choices(self):
        good=requests();bad=copy.deepcopy(good[0]);bad['package']['duration']=1;values=[bad,*good]
        rows=[{'protocol_version':1,'id':str(i),'operation':'lyrics','payload':payload} for i,payload in enumerate(values)]
        p=subprocess.run([sys.executable,'-X','utf8',str(ROOT/'music_lab_agent.py')],cwd=ROOT,input=''.join(json.dumps(x)+'\n' for x in rows),capture_output=True,encoding='utf-8',timeout=15)
        self.assertEqual(p.returncode,0,p.stderr);replies=list(map(json.loads,p.stdout.splitlines()));self.assertFalse(replies[0]['ok'])
        for response,payload in zip(replies[1:],good):self.assertEqual(response['result'],build('lyrics',payload).wire())
        rows=[{'jsonrpc':'2.0','id':1,'method':'initialize','params':{'protocolVersion':'2025-11-25','capabilities':{},'clientInfo':{'name':'duration-handoff','version':'1'}}},{'jsonrpc':'2.0','method':'notifications/initialized'}]
        rows += [{'jsonrpc':'2.0','id':i+2,'method':'tools/call','params':{'name':'lyrics_validate','arguments':{'payload':payload}}} for i,payload in enumerate(values)]
        p=subprocess.run([sys.executable,'-X','utf8',str(ROOT/'music_lab_mcp.py')],cwd=ROOT,input=''.join(json.dumps(x)+'\n' for x in rows),capture_output=True,encoding='utf-8',timeout=15)
        self.assertEqual(p.returncode,0,p.stderr);replies=list(map(json.loads,p.stdout.splitlines()));self.assertTrue(replies[1]['result']['isError'])
        for response,payload in zip(replies[2:],good):self.assertEqual(response['result']['structuredContent'],build('lyrics',payload).wire())

    def test_real_http_preserves_choices_recovers_from_invalid_and_embeds_same_media_layer(self):
        with WorkbenchServer(('127.0.0.1',0),WorkbenchHandler) as server:
            server.draft_library=None;thread=threading.Thread(target=server.serve_forever,daemon=True);thread.start()
            try:
                values=requests();bad=copy.deepcopy(values[0]);bad['package']['duration']=1
                for payload,status in [(bad,400),*[(value,200) for value in values]]:
                    c=http.client.HTTPConnection(*server.server_address,timeout=10);c.request('POST','/api/lyrics',json.dumps(payload),{'Content-Type':'application/json'})
                    response=c.getresponse();raw=response.read();c.close();self.assertEqual(response.status,status)
                    if status==200:
                        result=json.loads(raw);self.assertEqual(result,build('lyrics',payload).wire())
                        self.assertIn((ROOT/'musiclab/assets/lyrics-media.js').read_text(encoding='utf-8'),result['files']['preview.html'])
                c=http.client.HTTPConnection(*server.server_address,timeout=10);c.request('GET','/lyrics-media.js');response=c.getresponse()
                self.assertEqual(response.status,200);self.assertEqual(response.read(),(ROOT/'musiclab/assets/lyrics-media.js').read_bytes());c.close()
                c=http.client.HTTPConnection(*server.server_address,timeout=10);c.request('GET','/');response=c.getresponse()
                html=response.read().decode('utf-8');c.close();self.assertEqual(response.status,200)
                scripts=re.findall(r'<script\s+src="([^"]+)"[^>]*>',html)
                self.assertEqual(scripts.count('/lyrics-media.js'),1)
                self.assertLess(scripts.index('/lyric-time.js'),scripts.index('/lyrics-media.js'))
                self.assertLess(scripts.index('/lyrics-media.js'),scripts.index('/app.js'))
            finally:server.shutdown();thread.join(timeout=3)


if __name__=='__main__':unittest.main()
