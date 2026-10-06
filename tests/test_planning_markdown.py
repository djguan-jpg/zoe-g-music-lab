# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
import copy
import html
import http.client
import json
import string
import subprocess
import sys
import tempfile
import threading
import unittest
from pathlib import Path
from musiclab.application import build
from musiclab.markdown_text import inline
from musiclab.markdown_table import cell
from music_lab_agent import response
from music_lab_mcp import MCP_VERSION,Session
from music_lab_server import WorkbenchHandler,WorkbenchServer

ROOT=Path(__file__).resolve().parents[1]
SPECIAL='原文\r\n\r\n## 次行 **粗體** [連結](https://example.com) ![圖片](x) `🎵` <b>字面</b> &amp; |'


def displayed(value):
    return html.unescape(value.replace('<br>','\n'))


def fixture(operation):
    payload=json.loads((ROOT/'examples'/('first-light-music.json' if operation=='music' else 'first-light-mv.json')).read_text(encoding='utf-8'))
    payload['title']=SPECIAL
    if operation=='music':
        payload['memory_hook']=SPECIAL
        payload['deliverables']=[SPECIAL,SPECIAL]
    else:
        for field in ['visual_style','character_anchor','aspect_ratio']:payload[field]=field+SPECIAL
        for field in ['purpose','visual','camera','transition']:payload['shots'][0][field]=field+SPECIAL
        old=payload['motifs'][0]['name'];payload['motifs'][0].update(name=SPECIAL,meaning='意義'+SPECIAL)
        for shot in payload['shots']:
            if shot['motif']==old:shot['motif']=SPECIAL
        payload['shots'][0]['motif_state']='狀態'+SPECIAL
        payload['motifs'].append({'name':'未用'+SPECIAL,'meaning':'保留原值'})
    return payload


class PlanningMarkdownTests(unittest.TestCase):
    def test_shared_text_and_existing_cell_keep_literal_punctuation_unicode_and_breaks(self):
        source=string.punctuation+' e\u0301 🎵\t　\r\n\r終\n<br> &amp;'
        expected=source.replace('\r\n','\n').replace('\r','\n')
        self.assertEqual(displayed(inline(source)),expected)
        self.assertEqual(cell(source),inline(source))
        self.assertNotIn('\n',inline(source));self.assertNotIn('\r',inline(source))
        self.assertNotIn('<b>',inline(source));self.assertNotIn('**',inline(source))

    def test_all_four_titles_stay_one_physical_heading_with_literal_original_text(self):
        suffixes={'task.md':'：AI 音樂製作任務包','music-plan.md':'：歌曲設計','prompts.md':'：鏡頭提示','continuity.md':'：母題與連戲'}
        for operation in ['music','storyboard']:
            result=build(operation,fixture(operation))
            for name,content in result.files.items():
                if name.endswith('.md'):
                    with self.subTest(name=name):
                        self.assertEqual(sum(line.startswith('# ') for line in content.splitlines()),1)
                        self.assertEqual(displayed(content.split('\n',1)[0]),'# '+SPECIAL.replace('\r\n','\n')+suffixes[name])

    def test_memory_hook_retains_four_display_occurrences_without_extra_sections(self):
        result=build('music',fixture('music'));content=result.files['music-plan.md']
        self.assertEqual(sum(line.startswith('## ') for line in content.splitlines()),1)
        self.assertEqual(displayed(content).count(SPECIAL.replace('\r\n','\n')),5)  # title plus four hook references
        self.assertEqual(result.data['memory_hook'],SPECIAL)

    def test_multiline_duplicate_deliverables_stay_two_original_list_items(self):
        payload=fixture('music');content=build('music',payload).files['task.md']
        listed=content.split('## 交回內容\n\n',1)[1].split('\n\n以具體',1)[0].splitlines()
        self.assertEqual(len(listed),2)
        self.assertEqual([displayed(line) for line in listed],['- '+SPECIAL.replace('\r\n','\n')]*2)

    def test_each_shot_field_and_shared_visual_values_preserve_display_text_and_headings(self):
        payload=fixture('storyboard');content=build('storyboard',payload).files['prompts.md'];decoded=displayed(content)
        self.assertEqual(sum(line.startswith('## ') for line in content.splitlines()),len(payload['shots']))
        for field in ['purpose','visual','camera','transition']:
            self.assertIn(payload['shots'][0][field].replace('\r\n','\n'),decoded)
        for field in ['visual_style','character_anchor','aspect_ratio']:
            self.assertEqual(decoded.count(payload[field].replace('\r\n','\n')),len(payload['shots']))

    def test_motif_names_meanings_states_and_generated_warnings_cannot_add_sections(self):
        payload=fixture('storyboard');result=build('storyboard',payload);content=result.files['continuity.md'];decoded=displayed(content)
        self.assertEqual(sum(line.startswith('## ') for line in content.splitlines()),len(payload['motifs'])+1)
        self.assertIn('原始意義：'+payload['motifs'][0]['meaning'].replace('\r\n','\n'),decoded)
        self.assertIn(payload['shots'][0]['motif_state'].replace('\r\n','\n'),decoded)
        for warning in result.data['review_notes']:self.assertIn(warning['message'].replace('\r\n','\n'),decoded)
        self.assertEqual(list(result.data['motifs']),[m['name'] for m in payload['motifs']])

    def test_json_source_fence_and_input_values_remain_complete_and_unmodified(self):
        for operation in ['music','storyboard']:
            payload=fixture(operation);before=copy.deepcopy(payload);result=build(operation,payload)
            self.assertEqual(payload,before);self.assertEqual(result.data['title'],SPECIAL)
            if operation=='music':
                content=result.files['task.md'];self.assertEqual(content.count('\n```json\n'),1);self.assertEqual(content.count('\n```\n'),1)
                fenced=json.loads(content.split('\n```json\n',1)[1].split('\n```\n',1)[0])
                self.assertEqual(fenced['title'],SPECIAL);self.assertEqual(fenced['deliverables'],payload['deliverables'])
                self.assertEqual(json.loads(result.files['brief.json'])['memory_hook'],SPECIAL)
            else:
                self.assertEqual(json.loads(result.files['mv-brief.json']),before)
                self.assertEqual(json.loads(result.files['storyboard.json']),result.data)

    def test_agent_mcp_http_and_browser_guard_deliver_same_full_files_for_both_operations(self):
        class Handler(WorkbenchHandler):
            def log_message(self,*args):pass
        session=Session();session.response(json.dumps({'jsonrpc':'2.0','id':1,'method':'initialize','params':{'protocolVersion':MCP_VERSION,'capabilities':{},'clientInfo':{'name':'synthetic-markdown','version':'1'}}}));session.response(json.dumps({'jsonrpc':'2.0','method':'notifications/initialized'}))
        cases=[]
        with WorkbenchServer(('127.0.0.1',0),Handler) as server:
            worker=threading.Thread(target=server.serve_forever);worker.start()
            try:
                for operation,tool in [('music','music_plan'),('storyboard','storyboard_plan')]:
                    payload=fixture(operation);expected=build(operation,payload).wire()
                    agent=response(json.dumps({'protocol_version':1,'id':operation,'operation':operation,'payload':payload}));self.assertTrue(agent['ok']);self.assertEqual(agent['result'],expected)
                    rpc=session.response(json.dumps({'jsonrpc':'2.0','id':2,'method':'tools/call','params':{'name':tool,'arguments':{'payload':payload}}}));self.assertEqual(rpc['result']['structuredContent'],expected)
                    host='127.0.0.1:'+str(server.server_port);connection=http.client.HTTPConnection('127.0.0.1',server.server_port,timeout=5)
                    connection.request('POST','/api/'+operation,json.dumps(payload).encode(),{'Host':host,'Origin':'http://'+host,'Content-Type':'application/json'});reply=connection.getresponse();self.assertEqual(reply.status,200);actual=json.loads(reply.read());connection.close();self.assertEqual(actual,expected)
                    cases.append({'operation':operation,'payload':payload,'result':actual})
            finally:server.shutdown();worker.join(5)
        self.assertFalse(worker.is_alive())
        script="const P=require(process.argv[1]+'/web/planning-review.js');let s='';process.stdin.on('data',x=>s+=x);process.stdin.on('end',()=>{const rows=JSON.parse(s);for(const x of rows)P.checkedResult(x.operation,x.payload,x.result);process.stdout.write(JSON.stringify(rows.map(x=>x.result.files)));});"
        process=subprocess.run(['node','-e',script,str(ROOT)],input=json.dumps(cases),capture_output=True,text=True,encoding='utf-8',timeout=10);self.assertEqual(process.returncode,0,process.stderr);self.assertEqual(json.loads(process.stdout),[c['result']['files'] for c in cases])

    def test_cli_preserves_all_nine_file_bytes_and_refuses_replacing_each_output(self):
        with tempfile.TemporaryDirectory() as folder:
            for operation in ['music','storyboard']:
                payload=fixture(operation);source=Path(folder)/(operation+'.json');source.write_text(json.dumps(payload),encoding='utf-8');output=Path(folder)/operation
                args=[sys.executable,'-X','utf8',str(ROOT/'music_lab.py'),operation,'--brief',str(source),'--out',str(output)]
                process=subprocess.run(args,cwd=folder,capture_output=True,text=True,encoding='utf-8',timeout=10);self.assertEqual(process.returncode,0,process.stderr)
                expected={name:value.encode() for name,value in build(operation,payload).files.items()};self.assertEqual({p.name:p.read_bytes() for p in output.iterdir()},expected)
                repeated=subprocess.run(args,cwd=folder,capture_output=True,text=True,encoding='utf-8',timeout=10);self.assertNotEqual(repeated.returncode,0);self.assertEqual({p.name:p.read_bytes() for p in output.iterdir()},expected)

    def test_common_inline_rejects_non_text_without_coercion_and_cell_keeps_original_error(self):
        for value in [None,1,True,{},[]]:
            with self.subTest(value=value),self.assertRaises(ValueError):inline(value)
            with self.subTest(value=value),self.assertRaisesRegex(ValueError,'表格欄位需為文字'):cell(value)


if __name__=='__main__':unittest.main()
