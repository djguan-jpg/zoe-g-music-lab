# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
import copy
import hashlib
import json
import random
import subprocess
import sys
import tempfile
import threading
import unittest
import urllib.error
import urllib.request
from pathlib import Path
from musiclab.application import build
from music_lab_server import WorkbenchHandler, WorkbenchServer

ROOT = Path(__file__).resolve().parents[1]


def example(operation):
    return json.loads((ROOT / 'examples' / ('first-light-music.json' if operation == 'music' else 'first-light-mv.json')).read_text(encoding='utf-8'))


class PlanningSourceTests(unittest.TestCase):
    def test_music_title_uses_same_python_strip_in_all_primary_artifacts(self):
        for title in ['  原創回聲  ', '\x85原創回聲\x1c', '\ufeff保留字元\ufeff']:
            payload = example('music'); payload['title'] = title
            before = copy.deepcopy(payload); result = build('music', payload)
            self.assertEqual(result.data['title'], title.strip())
            self.assertEqual(json.loads(result.files['brief.json'])['title'], title.strip())
            self.assertTrue(result.files['music-plan.md'].startswith('# ' + title.strip() + '：'))
            self.assertTrue(result.files['task.md'].startswith('# ' + title.strip() + '：'))
            self.assertEqual(payload, before)

    def test_real_cross_language_full_sources_and_rounding_boundaries(self):
        rng = random.Random(2601); cases = []
        for index in range(50):
            brief = example('music')
            brief.update(title=f'\x85原創-{index} \x1c', bpm=str(rng.uniform(80, 190)), beats_per_bar=str(rng.randint(1, 8)),
                         existing_lyrics='  保留換行\r\n漢字 Latin 123\x85一句\u2028另一句\n' + '很' * 25,
                         avoid=['  保留\n多行  ', '<tag>不是指令</tag>'], deliverables=['  新方案  ', '原文 | 表格'])
            if index == 0: brief.update(bpm='١_٢٠.٠', beats_per_bar='４')
            if index == 1: brief.update(bpm='\x85120\x85', memory_hook='\ufeff保留\ufeff')
            for section in brief['arrangement']:
                section.update(bars=str(rng.randint(1, 9)), energy=str(rng.randint(1, 5)), name='  ' + section['name'] + '\x85')
            if index == 2: brief['arrangement'] = [{'name':'半毫秒', 'bars':1, 'energy':3, 'focus':'待唱', 'texture':'安靜'}]; brief.update(bpm=128, beats_per_bar=1)
            cases.append({'operation':'music', 'brief':brief, 'wire':build('music', brief).wire()})
        for index in range(10):
            brief = example('storyboard'); brief.update(title=f'  原創分鏡-{index}  ', fps=str([1, 23.976, 24, 30, 120][index % 5]), duration_seconds=str(brief['duration_seconds']))
            brief['motifs'].extend([{'name':'未使用', 'meaning':'保持選擇'}, {'name':'__proto__', 'meaning':'普通創作文字'}])
            brief['shots'][1]['motif'] = '__proto__'
            if index == 3: brief['motifs'].extend([{'name':'2','meaning':'第二'}, {'name':'1','meaning':'第一'}])
            for shot in brief['shots']:
                shot['start'] = str(shot['start']); shot['end'] = str(shot['end']); shot['visual'] = '\x85' + shot['visual'] + '\x1c'
            cases.append({'operation':'storyboard', 'brief':brief, 'wire':build('storyboard', brief).wire()})
        code = "const fs=require('node:fs'),R=require('./web/planning-review.js');const cases=JSON.parse(fs.readFileSync(0,'utf8'));(async()=>{for(const c of cases){let n=0;await R.inspect({operation:c.operation,brief:c.brief,isCurrent:()=>true,request:async()=>c.wire,onResult:(_r,m)=>{if(!m.sourceChecked)throw Error('unchecked');n++;}});if(n!==1)throw Error('not committed');}process.stdout.write(JSON.stringify({checked:cases.length}));})();"
        p = subprocess.run(['node','-e',code], cwd=ROOT, input=json.dumps(cases,ensure_ascii=False), capture_output=True, text=True, encoding='utf-8',timeout=15)
        self.assertEqual(p.returncode,0,p.stderr)
        self.assertEqual(json.loads(p.stdout)['checked'],60)

    def test_cli_spaced_source_real_files_and_overwrite_refusal(self):
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder); source = root/'source.json'; out = root/'out'; brief=example('music');brief['title']='  原創 CLI  '
            source.write_text(json.dumps(brief,ensure_ascii=False),encoding='utf-8');before=source.read_bytes()
            args=[sys.executable,'-X','utf8',str(ROOT/'music_lab.py'),'music','--brief',str(source),'--out',str(out)]
            p=subprocess.run(args,cwd=ROOT,capture_output=True,text=True,encoding='utf-8',timeout=10);self.assertEqual(p.returncode,0,p.stderr)
            expected=build('music',brief).files
            self.assertEqual({f.name:f.read_text(encoding='utf-8') for f in out.iterdir()},expected)
            hashes={f.name:hashlib.sha256(f.read_bytes()).hexdigest() for f in out.iterdir()}
            p=subprocess.run(args,cwd=ROOT,capture_output=True,text=True,encoding='utf-8',timeout=10);self.assertNotEqual(p.returncode,0)
            self.assertEqual(hashes,{f.name:hashlib.sha256(f.read_bytes()).hexdigest() for f in out.iterdir()});self.assertEqual(source.read_bytes(),before)

    def test_real_agent_and_mcp_same_sources_recover_after_error(self):
        cases=[('music',example('music')),('storyboard',example('storyboard'))]
        for op,brief in cases:brief['title']='  原創 Agent '+op+'  '
        requests=[{'protocol_version':1,'id':'bad','operation':'music','payload':{'title':'未完成'}}]
        requests += [{'protocol_version':1,'id':op,'operation':op,'payload':brief} for op,brief in cases]
        p=subprocess.run([sys.executable,'-X','utf8','music_lab_agent.py'],cwd=ROOT,input=''.join(json.dumps(r,ensure_ascii=False)+'\n' for r in requests),capture_output=True,text=True,encoding='utf-8',timeout=10)
        self.assertEqual(p.returncode,0,p.stderr);replies=[json.loads(r) for r in p.stdout.splitlines()]
        self.assertFalse(replies[0]['ok'])
        for (op,brief),reply in zip(cases,replies[1:]):self.assertEqual(reply['result'],build(op,brief).wire())
        requests=[{'jsonrpc':'2.0','id':1,'method':'initialize','params':{'protocolVersion':'2025-11-25','capabilities':{},'clientInfo':{'name':'planning-source-test','version':'1'}}},{'jsonrpc':'2.0','method':'notifications/initialized'},
                  {'jsonrpc':'2.0','id':2,'method':'tools/call','params':{'name':'music_plan','arguments':{'payload':{'title':'未完成'}}}}]
        requests += [{'jsonrpc':'2.0','id':i+3,'method':'tools/call','params':{'name':op+'_plan','arguments':{'payload':brief}}} for i,(op,brief) in enumerate(cases)]
        p=subprocess.run([sys.executable,'-X','utf8','music_lab_mcp.py'],cwd=ROOT,input=''.join(json.dumps(r,ensure_ascii=False)+'\n' for r in requests),capture_output=True,text=True,encoding='utf-8',timeout=10)
        self.assertEqual(p.returncode,0,p.stderr);replies={r['id']:r for r in map(json.loads,p.stdout.splitlines())};self.assertTrue(replies[2]['result']['isError'])
        for i,(op,brief) in enumerate(cases):self.assertEqual(replies[i+3]['result']['structuredContent'],build(op,brief).wire())

    def test_real_http_shared_result_and_ordered_asset(self):
        class Quiet(WorkbenchHandler):
            def log_message(self,*args):pass
        with WorkbenchServer(('127.0.0.1',0),Quiet) as server:
            server.draft_library=None;thread=threading.Thread(target=server.serve_forever,daemon=True);thread.start();base=f'http://127.0.0.1:{server.server_port}'
            try:
                asset=urllib.request.urlopen(base+'/planning-source.js',timeout=5).read();self.assertEqual(asset,(ROOT/'web/planning-source.js').read_bytes())
                page=urllib.request.urlopen(base+'/',timeout=5).read().decode('utf-8')
                self.assertLess(page.index('/json-document.js'),page.index('/planning-source.js'));self.assertLess(page.index('/storyboard-frames.js'),page.index('/planning-source.js'));self.assertLess(page.index('/planning-source.js'),page.index('/planning-review.js'))
                bad=urllib.request.Request(base+'/api/music',data=b'{"title":"bad"}',headers={'Content-Type':'application/json'},method='POST')
                with self.assertRaises(urllib.error.HTTPError) as error:urllib.request.urlopen(bad,timeout=5)
                self.assertEqual(error.exception.code,400)
                for op in ['music','storyboard']:
                    brief=example(op);brief['title']='  原創 HTTP '+op+'  '
                    request=urllib.request.Request(base+'/api/'+op,data=json.dumps(brief,ensure_ascii=False).encode('utf-8'),headers={'Content-Type':'application/json'},method='POST')
                    self.assertEqual(json.load(urllib.request.urlopen(request,timeout=5)),build(op,brief).wire())
            finally:server.shutdown();thread.join(timeout=5);self.assertFalse(thread.is_alive())


if __name__=='__main__':unittest.main()
