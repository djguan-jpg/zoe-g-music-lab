# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
import http.client,json,re,subprocess,sys,tempfile,threading,unittest
from pathlib import Path
from musiclab.lyrics import parse_srt,srt_text
from musiclab.application import build
from music_lab_server import WorkbenchServer,WorkbenchHandler
ROOT=Path(__file__).resolve().parents[1]
SOURCE='\ufeff1\r\n00:00:01,125 --> 00:00:02,500\r\n  原文 [00:02] [offset:999]\t  \r\n第二行 <b>\t \r\n\r\n2\r00:00:04.500\t-->\t00:00:05.875\r字\u0085後\u2028尾\u2029終\t  \n'
PAYLOAD={'title':'SRT 原文校時','content':SOURCE,'suffix':'.srt','duration':10}
TEXTS=['  原文 [00:02] [offset:999]\t   / 第二行 <b>\t ','字\u0085後\u2028尾\u2029終\t  ']
def run(args,content=None,cwd=ROOT):
    p=subprocess.run(args,cwd=cwd,input=content,capture_output=True,timeout=25)
    if p.returncode:raise AssertionError(p.stderr.decode('utf-8',errors='replace')[-1500:])
    return p.stdout
class SrtTests(unittest.TestCase):
    def test_export_import_retains_whitespace_unicode_bom_and_literal_tags(self):
        for text in ['  原文\t  ','字\u0085後\u2028尾\u2029終','\u2028','\ufeff字 <script>','字 00:01:00,000 --> 00:02:00,000 [offset:999]']:
            cues=[{'start':1.125,'end':2.5,'text':text}]
            with self.subTest(text=text):self.assertEqual(parse_srt(srt_text(cues)),cues)
    def test_multiline_flattens_only_physical_lines_preserving_each_literal_line(self):
        self.assertEqual(parse_srt(SOURCE),[{'start':1.125,'end':2.5,'text':TEXTS[0]},{'start':4.5,'end':5.875,'text':TEXTS[1]}])
    def test_ascii_blank_lines_delimit_without_trimming_lyric_edges(self):
        source=' \t\n1\n00:00:01,000 --> 00:00:02,000\n  字  \n \t\n\n2\n00:00:03,000 --> 00:00:04,000\n尾\t  \n\n'
        self.assertEqual([c['text'] for c in parse_srt(source)],['  字  ','尾\t  '])
        for source in ['',' \t\r\n','1\n00:00:01,000 --> 00:00:02,000\n \t\n']:
            with self.assertRaises(ValueError):parse_srt(source)
    def test_index_is_optional_ascii_and_timing_syntax_accepts_tabs_dots_and_cr(self):
        self.assertEqual(parse_srt(' \t00:00:01.125\t--> 00:00:02,500\t\r字'),[{'start':1.125,'end':2.5,'text':'字'}])
        self.assertEqual(parse_srt(' 99\t\r00:00:01,125 --> 00:00:02,500\r字')[0]['start'],1.125)
    def test_document_bom_removed_once_and_literal_bom_in_lyric_remains(self):
        raw='1\n00:00:01,000 --> 00:00:02,000\n\ufeff字'
        self.assertEqual(parse_srt('\ufeff'+raw)[0]['text'],'\ufeff字')
        with self.assertRaises(ValueError):parse_srt('\ufeff\ufeff'+raw)
    def test_malformed_clock_missing_text_and_precision_bounds_refuse(self):
        for clock in ['00:60:00,000','00:00:60,000','0:00:01,000','00:00:01,1234','-'+'01:00:00,000','2501999793:00:00,000','9'*5000+':00:00,000']:
            with self.subTest(clock=clock[:60]),self.assertRaises(ValueError):parse_srt(clock+' --> 00:00:02,000\n字')
        for source in [None,'1\n00:00:01,000 --> 00:00:02,000','1\u2028\n00:00:01,000 --> 00:00:02,000\n字','00:00:01,000 --> 00:00:02,000\u2029\n字']:
            with self.assertRaises(ValueError):parse_srt(source)
    def test_long_zero_hour_prefix_and_integer_milliseconds_preserve_precision(self):
        self.assertEqual(parse_srt('0'*5000+'00:00:01,125 --> 00:00:02,500\n字'),[{'start':1.125,'end':2.5,'text':'字'}])
        data=build('lyrics',{**PAYLOAD,'shift_seconds':.01}).data
        self.assertEqual([(c['start'],c['end']) for c in data['cues']],[(1.135,2.51),(4.51,5.885)]);self.assertEqual([c['text'] for c in data['cues']],TEXTS)
    def test_application_inference_preserves_explicit_ends_and_no_clipping(self):
        data=build('lyrics',{**PAYLOAD,'duration':None}).data
        self.assertEqual(data['duration'],5.875);self.assertTrue(data['duration_estimated']);self.assertEqual(data['timing'],{'duration_source':'last_cue_end','inferred_end_count':0,'tail_end_inferred':False})
        for source in ['00:00:02,000 --> 00:00:01,000\n字','00:00:01,000 --> 00:00:03,000\n字\n\n00:00:02,000 --> 00:00:04,000\n尾']:
            with self.assertRaises(ValueError):build('lyrics',{**PAYLOAD,'content':source})
    def test_actual_cli_matches_application_and_retains_original_selected_file(self):
        with tempfile.TemporaryDirectory() as folder:
            path=Path(folder)/'source.SRT';path.write_bytes(SOURCE.encode('utf-8'));before=path.read_bytes();out=Path(folder)/'out'
            run([sys.executable,'-X','utf8',str(ROOT/'music_lab.py'),'lyrics','--input',str(path),'--title',PAYLOAD['title'],'--duration','10','--out',str(out)],cwd=folder)
            self.assertEqual({p.name:p.read_text(encoding='utf-8') for p in out.iterdir()},build('lyrics',PAYLOAD).files);self.assertEqual(path.read_bytes(),before)
    def test_actual_jsonlines_bad_clock_then_next_source_continues(self):
        rows=[{'protocol_version':1,'id':str(i),'operation':'lyrics','payload':p} for i,p in enumerate([{**PAYLOAD,'content':'00:00:60,000 --> 00:01:02,000\n字'},PAYLOAD])]
        replies=[json.loads(line) for line in run([sys.executable,'-X','utf8','music_lab_agent.py'],(''.join(json.dumps(r)+'\n' for r in rows)).encode()).splitlines()]
        self.assertFalse(replies[0]['ok']);self.assertEqual(replies[1]['result'],build('lyrics',PAYLOAD).wire())
    def test_actual_mcp_same_source_and_default_tool_count(self):
        rows=[{'jsonrpc':'2.0','id':1,'method':'initialize','params':{'protocolVersion':'2025-11-25','capabilities':{},'clientInfo':{'name':'srt-check','version':'1'}}},
              {'jsonrpc':'2.0','method':'notifications/initialized'},{'jsonrpc':'2.0','id':2,'method':'tools/list'},
              {'jsonrpc':'2.0','id':3,'method':'tools/call','params':{'name':'lyrics_validate','arguments':{'payload':PAYLOAD}}}]
        replies=[json.loads(line) for line in run([sys.executable,'-X','utf8','music_lab_mcp.py'],(''.join(json.dumps(r)+'\n' for r in rows)).encode()).splitlines()]
        self.assertEqual(len(replies[1]['result']['tools']),14);self.assertEqual(replies[2]['result']['structuredContent'],build('lyrics',PAYLOAD).wire())
    def test_actual_http_static_script_order_and_source_response(self):
        with WorkbenchServer(('127.0.0.1',0),WorkbenchHandler) as server:
            server.draft_library=None;t=threading.Thread(target=server.serve_forever,daemon=True);t.start()
            def request(method,path,body=None):
                c=http.client.HTTPConnection('127.0.0.1',server.server_port,timeout=5);c.request(method,path,body);r=c.getresponse();data=r.read();status=r.status;c.close();return status,data
            try:
                status,raw=request('POST','/api/lyrics',json.dumps(PAYLOAD));self.assertEqual(status,200);self.assertEqual(json.loads(raw),build('lyrics',PAYLOAD).wire())
                status,raw=request('GET','/lyrics-srt.js');self.assertEqual(status,200);self.assertEqual(raw,(ROOT/'musiclab/assets/lyrics-srt.js').read_bytes())
                scripts=re.findall(r'<script src="([^"]+)"',request('GET','/')[1].decode('utf-8'));self.assertEqual(scripts.count('/lyrics-srt.js'),1);self.assertLess(scripts.index('/lyric-time.js'),scripts.index('/lyrics-srt.js'));self.assertLess(scripts.index('/lyrics-srt.js'),scripts.index('/lyrics-import.js'))
            finally:server.shutdown();t.join(timeout=5)
    def test_python_node_whole_line_corpus_matches_and_preserves_unicode(self):
        cases=[SOURCE,'00:00:01,000 --> 00:00:02,000\n\u2028','00:00:01,000 --> 00:00:02,000\n字\u0085後\u2028尾\u2029終',
               '\ufeff\ufeff1\n00:00:01,000 --> 00:00:02,000\n字','1\u2028\n00:00:01,000 --> 00:00:02,000\n字',
               '00:00:01,000 --> 00:00:02,000\u2029\n字','00:00:60,000 --> 00:00:62,000\n字','00:60:00,000 --> 00:00:02,000\n字',
               '9'*5000+':00:00,000 --> 00:00:02,000\n字','0'*5000+'00:00:01,125 --> 00:00:02,500\n字',
               '2501999792:00:00,000 --> 2501999792:00:00,001\n字','2501999793:00:00,000 --> 2501999793:00:00,001\n字','',' \t\r\n']
        expected=[]
        for source in cases:
            try:expected.append(parse_srt(source))
            except ValueError:expected.append({'error':True})
        code="const V=require('./musiclab/assets/lyrics-srt.js'),fs=require('node:fs');process.stdout.write(JSON.stringify(JSON.parse(fs.readFileSync(0,'utf8')).map(s=>{try{return V.parse(s);}catch{return {error:true};}})));"
        self.assertEqual(json.loads(run(['node','-e',code],json.dumps(cases).encode())),expected)
