# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
import copy
import html
import http.client
import json
import subprocess
import sys
import tempfile
import threading
import unittest
from pathlib import Path
from musiclab.application import build
from musiclab.markdown_table import cell
from music_lab_agent import response
from music_lab_mcp import MCP_VERSION, Session
from music_lab_server import WorkbenchHandler, WorkbenchServer

ROOT = Path(__file__).resolve().parents[1]


def fixture():
    brief = json.loads((ROOT/'examples/first-light-music.json').read_text(encoding='utf-8'))
    brief['arrangement'][0].update(name='主歌 | 回聲', focus='抬頭\r\n再轉身 | 🎵',
                                 texture='`鼓` **弦樂** <b>字面</b> &amp;')
    return brief


def table_rows(markdown):
    body = markdown.split('|---|---|---|---|---|---|\n',1)[1].split('\n\n##',1)[0]
    rows = []
    for line in body.splitlines():
        values = line.split('|')
        if len(values) != 8 or values[0] != '' or values[-1] != '':
            raise AssertionError('expected one physical row with exactly six columns')
        rows.append([html.unescape(value.strip().replace('<br>','\n')) for value in values[1:-1]])
    return rows


class MusicMarkdownTests(unittest.TestCase):
    def test_pipes_and_multiline_fields_keep_six_columns_and_section_count(self):
        brief=fixture();result=build('music',brief);rows=table_rows(result.files['music-plan.md'])
        self.assertEqual(len(rows),len(brief['arrangement']))
        self.assertEqual(rows[0][0],brief['arrangement'][0]['name'])
        self.assertEqual(rows[0][4],'抬頭\n再轉身 | 🎵')
        self.assertEqual(rows[0][5],brief['arrangement'][0]['texture'])

    def test_literal_html_entities_links_and_code_do_not_become_cell_markup(self):
        source='<br><script>x</script> &amp; &#124; [x](https://example.com) ![a](x) `c` **b** ~~s~~ \\|'
        encoded=cell(source)
        self.assertEqual(html.unescape(encoded),source)
        self.assertNotIn('<',encoded);self.assertNotIn('|',encoded);self.assertNotIn('`',encoded)
        self.assertNotIn('[',encoded);self.assertNotIn('**',encoded)

    def test_all_source_line_endings_become_fixed_breaks_without_trimming(self):
        self.assertEqual(cell('  一\r\n二\r三\n四\n\n五\t '),'  一<br>二<br>三<br>四<br><br>五\t ')

    def test_unicode_combining_emoji_and_original_json_are_preserved(self):
        brief=fixture();brief['arrangement'][1]['focus']='e\u0301 🎵\t　\n中文';original=copy.deepcopy(brief)
        result=build('music',brief);rows=table_rows(result.files['music-plan.md'])
        self.assertEqual(brief,original)
        self.assertEqual(rows[1][4],original['arrangement'][1]['focus'])
        saved=json.loads(result.files['brief.json']);plan=json.loads(result.files['music-plan.json'])
        for index,section in enumerate(original['arrangement']):
            self.assertEqual(saved['arrangement'][index],section)
            self.assertEqual(plan['sections'][index]['focus'],section['focus'])

    def test_forty_duplicate_sections_remain_distinct_in_original_order(self):
        brief=fixture();brief['arrangement']=[dict(brief['arrangement'][0],bars=1,focus=f'原列{i}\n|') for i in range(40)]
        rows=table_rows(build('music',brief).files['music-plan.md'])
        self.assertEqual(len(rows),40)
        self.assertEqual([row[4] for row in rows],[f'原列{i}\n|' for i in range(40)])

    def test_agent_and_mcp_return_same_full_files_without_source_changes(self):
        brief=fixture();expected=build('music',brief).wire()
        agent=response(json.dumps({'protocol_version':1,'id':'literal-cells','operation':'music','payload':brief}))
        self.assertTrue(agent['ok']);self.assertEqual(agent['result'],expected)
        session=Session()
        session.response(json.dumps({'jsonrpc':'2.0','id':1,'method':'initialize','params':{'protocolVersion':MCP_VERSION,'capabilities':{},'clientInfo':{'name':'synthetic-cells','version':'1'}}}))
        session.response(json.dumps({'jsonrpc':'2.0','method':'notifications/initialized'}))
        mcp=session.response(json.dumps({'jsonrpc':'2.0','id':2,'method':'tools/call','params':{'name':'music_plan','arguments':{'payload':brief}}}))
        self.assertEqual(mcp['result']['structuredContent'],expected)

    def test_cli_exact_utf8_files_and_default_no_overwrite(self):
        brief=fixture();expected=build('music',brief).files
        with tempfile.TemporaryDirectory() as folder:
            source=Path(folder)/'brief.json';source.write_text(json.dumps(brief,ensure_ascii=False),encoding='utf-8')
            output=Path(folder)/'result';args=[sys.executable,'-X','utf8',str(ROOT/'music_lab.py'),'music','--brief',str(source),'--out',str(output)]
            process=subprocess.run(args,cwd=folder,capture_output=True,text=True,encoding='utf-8',timeout=10)
            self.assertEqual(process.returncode,0,process.stderr)
            before={name:(output/name).read_bytes() for name in expected}
            self.assertEqual(before,{name:value.encode('utf-8') for name,value in expected.items()})
            repeated=subprocess.run(args,cwd=folder,capture_output=True,text=True,encoding='utf-8',timeout=10)
            self.assertNotEqual(repeated.returncode,0)
            self.assertEqual(before,{name:(output/name).read_bytes() for name in expected})

    def test_http_and_browser_source_guard_accept_exact_full_files(self):
        class Handler(WorkbenchHandler):
            def log_message(self,*args):pass
        brief=fixture();expected=build('music',brief).wire()
        with WorkbenchServer(('127.0.0.1',0),Handler) as server:
            thread=threading.Thread(target=server.serve_forever);thread.start()
            try:
                host='127.0.0.1:'+str(server.server_port)
                connection=http.client.HTTPConnection('127.0.0.1',server.server_port,timeout=5)
                connection.request('POST','/api/music',json.dumps(brief).encode(),{'Host':host,'Origin':'http://'+host,'Content-Type':'application/json'})
                reply=connection.getresponse();self.assertEqual(reply.status,200);actual=json.loads(reply.read());connection.close()
            finally:server.shutdown();thread.join(5)
        self.assertFalse(thread.is_alive());self.assertEqual(actual,expected)
        script="const P=require(process.argv[1]+'/web/planning-review.js');let s='';process.stdin.on('data',x=>s+=x);process.stdin.on('end',()=>{const x=JSON.parse(s);P.checkedResult('music',x.brief,x.reply);process.stdout.write(JSON.stringify(x.reply.files));});"
        process=subprocess.run(['node','-e',script,str(ROOT)],input=json.dumps({'brief':brief,'reply':actual}),capture_output=True,text=True,encoding='utf-8',timeout=10)
        self.assertEqual(process.returncode,0,process.stderr)
        self.assertEqual(json.loads(process.stdout),expected['files'])

    def test_cell_rejects_non_text_without_coercion(self):
        for value in (None,[],{},2,True):
            with self.subTest(value=value),self.assertRaises(ValueError):cell(value)


if __name__=='__main__':unittest.main()
