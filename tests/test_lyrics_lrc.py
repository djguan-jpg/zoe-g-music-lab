# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
import http.client,json,re,subprocess,sys,tempfile,threading,unittest
from pathlib import Path
from musiclab.lyrics import parse_lrc,lrc_text
from musiclab.application import build
from music_lab_server import WorkbenchServer,WorkbenchHandler
ROOT=Path(__file__).resolve().parents[1]
SOURCE='\ufeff[OFFSET:+125]\r\n[00:01.000]  原文 [00:02.000] [offset:999]\t  \r[00:04.500]字\u0085後\u2028尾\u2029終\n'
PAYLOAD={'title':'原文校時','content':SOURCE,'suffix':'.lrc','duration':10}

def run(args,content=None,cwd=ROOT):
    p=subprocess.run(args,cwd=cwd,input=content,capture_output=True,timeout=25)
    if p.returncode:raise AssertionError(p.stderr.decode('utf-8',errors='replace')[-1500:])
    return p.stdout

class LrcTests(unittest.TestCase):
    def test_export_import_preserves_literal_remainder(self):
        for text in ['  原文\t  ','原文 [00:02.000] 括號','原文 [offset:125]','字\u0085後\u2028尾\u2029終','\ufeff字 <script>','', ' \t ']:
            cues=[{'start':1.125,'text':text}]
            with self.subTest(text=text):self.assertEqual(parse_lrc(lrc_text(cues)),cues)

    def test_only_adjacent_leading_tags_are_syntax(self):
        self.assertEqual(parse_lrc(' \t[00:01.25][00:02.125]  字 [00:03]  '),
                         [{'start':1.25,'text':'  字 [00:03]  '},{'start':2.125,'text':'  字 [00:03]  '}])
        self.assertEqual(parse_lrc('[00:01] [00:02]字'),[{'start':1,'text':' [00:02]字'}])
        self.assertEqual(parse_lrc('備註 [00:01]不是句子\n[ar:原創]'),[])

    def test_standalone_offset_last_wins_and_crlf_cr_lf_are_boundaries(self):
        self.assertEqual(parse_lrc('[offset:999]\r\n[00:01]字 [offset:555]\r \t[OFFset:-125]\t\n[00:02]尾'),
                         [{'start':.875,'text':'字 [offset:555]'},{'start':1.875,'text':'尾'}])
        self.assertEqual(parse_lrc('[offset:125]尾\n[00:01]字'),[{'start':1,'text':'字'}])

    def test_bom_removed_only_at_document_start_once(self):
        self.assertEqual(parse_lrc('\ufeff[00:01]\ufeff字'),[{'start':1,'text':'\ufeff字'}])
        self.assertEqual(parse_lrc('\ufeff\ufeff[00:01]字'),[])
        self.assertEqual(parse_lrc('\n\ufeff[00:01]字'),[])

    def test_invalid_leading_time_negative_offset_and_precision_refuse(self):
        cases=['[00:60]字','[00:1]字',' \t[00:01.1234]字','[offset:-1001]\n[00:01]字',
               '[offset:9007199254740992]\n[00:01]字','[150119987579:59.991]字','['+'9'*5000+':00]字']
        for source in cases:
            with self.subTest(source=source[:80]),self.assertRaises(ValueError):parse_lrc(source)
        with self.assertRaises(ValueError):parse_lrc(None)

    def test_long_leading_zero_times_do_not_trigger_integer_digit_limit(self):
        self.assertEqual(parse_lrc('[offset:+'+'0'*5000+'125]\n['+'0'*5000+'00:01]字'),[{'start':1.125,'text':'字'}])

    def test_source_exact_then_explicit_shift_applied_once(self):
        source=dict(PAYLOAD);data=build('lyrics',{**source,'shift_seconds':.5}).data
        self.assertEqual([c['start'] for c in data['cues']],[1.625,5.125])
        self.assertEqual([c['text'] for c in data['cues']],['  原文 [00:02.000] [offset:999]\t  ','字\u0085後\u2028尾\u2029終'])
        self.assertEqual(source,PAYLOAD);self.assertEqual(data['timing']['applied_shift_seconds'],.5)

    def test_real_cli_retains_selected_file_and_matches_application(self):
        with tempfile.TemporaryDirectory() as folder:
            path=Path(folder)/'source.LRC';path.write_bytes(SOURCE.encode('utf-8'));before=path.read_bytes();out=Path(folder)/'out'
            run([sys.executable,'-X','utf8',str(ROOT/'music_lab.py'),'lyrics','--input',str(path),'--title',PAYLOAD['title'],'--duration','10','--out',str(out)],cwd=folder)
            self.assertEqual({p.name:p.read_text(encoding='utf-8') for p in out.iterdir()},build('lyrics',PAYLOAD).files)
            self.assertEqual(path.read_bytes(),before)

    def test_actual_jsonlines_refuses_bad_source_then_preserves_next_request(self):
        rows=[{'protocol_version':1,'id':str(i),'operation':'lyrics','payload':p} for i,p in enumerate([{**PAYLOAD,'content':'[00:60]字'},PAYLOAD])]
        replies=[json.loads(line) for line in run([sys.executable,'-X','utf8','music_lab_agent.py'],(''.join(json.dumps(r)+'\n' for r in rows)).encode()).splitlines()]
        self.assertFalse(replies[0]['ok']);self.assertEqual(replies[1]['result'],build('lyrics',PAYLOAD).wire())

    def test_actual_mcp_matches_application_without_new_tool(self):
        rows=[{'jsonrpc':'2.0','id':1,'method':'initialize','params':{'protocolVersion':'2025-11-25','capabilities':{},'clientInfo':{'name':'lrc-check','version':'1'}}},
              {'jsonrpc':'2.0','method':'notifications/initialized'},{'jsonrpc':'2.0','id':2,'method':'tools/list'},
              {'jsonrpc':'2.0','id':3,'method':'tools/call','params':{'name':'lyrics_validate','arguments':{'payload':PAYLOAD}}}]
        replies=[json.loads(line) for line in run([sys.executable,'-X','utf8','music_lab_mcp.py'],(''.join(json.dumps(r)+'\n' for r in rows)).encode()).splitlines()]
        self.assertEqual(len(replies[1]['result']['tools']),15);self.assertEqual(replies[2]['result']['structuredContent'],build('lyrics',PAYLOAD).wire())

    def test_actual_http_asset_order_and_response_match(self):
        with WorkbenchServer(('127.0.0.1',0),WorkbenchHandler) as server:
            server.draft_library=None;t=threading.Thread(target=server.serve_forever,daemon=True);t.start()
            def request(method,path,body=None):
                c=http.client.HTTPConnection('127.0.0.1',server.server_port,timeout=5);c.request(method,path,body);r=c.getresponse();data=r.read();status=r.status;c.close();return status,data
            try:
                status,raw=request('POST','/api/lyrics',json.dumps(PAYLOAD));self.assertEqual(status,200);self.assertEqual(json.loads(raw),build('lyrics',PAYLOAD).wire())
                status,raw=request('GET','/lyrics-lrc.js');self.assertEqual(status,200);self.assertEqual(raw,(ROOT/'musiclab/assets/lyrics-lrc.js').read_bytes())
                scripts=re.findall(r'<script src="([^"]+)"',request('GET','/')[1].decode('utf-8'))
                self.assertEqual(scripts.count('/lyrics-lrc.js'),1);self.assertLess(scripts.index('/lyric-time.js'),scripts.index('/lyrics-lrc.js'));self.assertLess(scripts.index('/lyrics-lrc.js'),scripts.index('/lyrics-import.js'))
            finally:server.shutdown();t.join(timeout=5)

    def test_python_node_corpus_matches_including_safe_boundary_and_errors(self):
        cases=[SOURCE,'[00:01][00:02] 字 ','[00:01] [00:02]字','[00:01]字\u2028尾',
               '[offset:-1]\r[00:00.001]字','[offset:125]尾\n[00:01]字','\ufeff\ufeff[00:01]字',
               '[00:60]字','[00:1]字','[offset:-1]\n[00:00]字','[150119987579:00]字','[150119987579:59.991]字',
               '[offset:9007199254740992]\n[00:01]字','['+'9'*5000+':00]字','['+'0'*5000+'00:01]字']
        expected=[]
        for source in cases:
            try:expected.append(parse_lrc(source))
            except ValueError:expected.append({'error':True})
        code="const L=require('./musiclab/assets/lyrics-lrc.js'),fs=require('node:fs');process.stdout.write(JSON.stringify(JSON.parse(fs.readFileSync(0,'utf8')).map(s=>{try{return L.parse(s);}catch{return {error:true};}})));"
        self.assertEqual(json.loads(run(['node','-e',code],json.dumps(cases).encode())),expected)
