# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
import copy
import http.client
import json
import subprocess
import sys
import tempfile
import threading
import unittest
from pathlib import Path
from musiclab.application import build, capabilities
from musiclab.lyrics_seed import SPACE_CHARS
from music_lab_server import WorkbenchServer, WorkbenchHandler
from music_lab_mcp import MCP_VERSION, tool_list

ROOT = Path(__file__).resolve().parents[1]
SOURCE = '  第一行  \r\n\r\n重複\n重複\r[副歌]\n'
PAYLOAD = {'title': ' 未校時測試 ', 'text': SOURCE}


class LyricsSeedTests(unittest.TestCase):
    def test_source_whitespace_repeats_and_original_line_numbers_survive(self):
        original = copy.deepcopy(PAYLOAD)
        result = build('lyrics_seed', PAYLOAD)
        self.assertEqual(PAYLOAD, original)
        self.assertTrue(result.needs_review)
        self.assertEqual(result.data['source_text'], SOURCE)
        self.assertEqual(result.data['title'], '未校時測試')
        self.assertEqual(result.data['lines'], [{'line':1,'text':'  第一行  '},
            {'line':3,'text':'重複'},{'line':4,'text':'重複'},{'line':5,'text':'[副歌]'}])
        self.assertEqual(set(result.files), {'lyrics-seed.json', 'lyrics-seed.md'})
        self.assertEqual(json.loads(result.files['lyrics-seed.json']), result.data)
        self.assertFalse({'start','end','duration_seconds'} & set(result.data))
        self.assertIn('不是ASR', result.files['lyrics-seed.md'])

    def test_all_defined_white_space_is_blank_but_interior_and_other_separators_survive(self):
        with self.assertRaises(ValueError): build('lyrics_seed', {'title':'x','text':SPACE_CHARS})
        source = '\u0085\nA\u2028B\n\u3000\n\u001c'
        data = build('lyrics_seed', {'title':'x','text':source}).data
        self.assertEqual(data['lines'], [{'line':2,'text':'A\u2028B'},{'line':4,'text':'\u001c'}])

    def test_utf8_byte_line_and_title_limits(self):
        self.assertEqual(len(build('lyrics_seed', {'title':'x','text':'x'*65536}).data['source_text']),65536)
        for payload in [{'title':'x','text':'中'*21846}, {'title':'x','text':'x\n'*1001},
                        {'title':'x'*201,'text':'x'}, {'title':' '*200+'x','text':'x'}, {'title':'  ','text':'x'}, {'title':'x','text':None}]:
            with self.subTest(payload_size=str(payload)[:40]), self.assertRaises(ValueError): build('lyrics_seed',payload)
        self.assertEqual(len(build('lyrics_seed', {'title':'x','text':'x\n'*1000}).data['lines']),1000)

    def test_inspection_is_lossless_and_returns_an_isolated_copy(self):
        seed=build('lyrics_seed',PAYLOAD).data; seed['title']='  外部名稱  '
        before=copy.deepcopy(seed); result=build('lyrics_seed',{'seed':seed})
        self.assertEqual(result.data,before); result.data['lines'][0]['text']='else'
        self.assertEqual(seed,before)

    def test_unknown_versions_fields_timestamps_and_source_rewrites_refuse(self):
        mutations=[lambda s:s.update(schema_version=2),lambda s:s.update(schema_version=True),
            lambda s:s.update(status='timed'),lambda s:s.update(start=0),lambda s:s.update(review_notes=[]),
            lambda s:s['lines'][0].update(start=0),lambda s:s['lines'][0].update(line=True),
            lambda s:s['lines'][0].update(text='第一行'),lambda s:s['lines'].pop(),
            lambda s:s.update(source_text=SOURCE+'later')]
        for mutation in mutations:
            seed=build('lyrics_seed',PAYLOAD).data;mutation(seed)
            with self.assertRaises(ValueError): build('lyrics_seed',{'seed':seed})
        for payload in [{},dict(PAYLOAD,path='private.wav'),{'seed':build('lyrics_seed',PAYLOAD).data,'title':'override'}]:
            with self.assertRaises(ValueError): build('lyrics_seed',payload)

    def test_real_cli_bom_crlf_from_other_directory_and_no_overwrite(self):
        with tempfile.TemporaryDirectory() as folder:
            source=Path(folder)/'plain.txt'; source.write_bytes(b'\xef\xbb\xbf'+SOURCE.encode())
            original=source.read_bytes();out=Path(folder)/'out'
            args=[sys.executable,'-X','utf8',str(ROOT/'music_lab.py'),'lyrics-seed','--text',str(source),
                  '--title',PAYLOAD['title'],'--out',str(out)]
            proc=subprocess.run(args,cwd=folder,capture_output=True,encoding='utf-8',timeout=10)
            self.assertEqual(proc.returncode,0,proc.stderr)
            for name,content in build('lyrics_seed',PAYLOAD).files.items(): self.assertEqual((out/name).read_bytes(),content.encode())
            files={p.name:p.read_bytes() for p in out.iterdir()}
            again=subprocess.run(args,cwd=folder,capture_output=True,encoding='utf-8',timeout=10)
            self.assertEqual(again.returncode,1);self.assertIn('--overwrite',again.stderr)
            self.assertEqual({p.name:p.read_bytes() for p in out.iterdir()},files);self.assertEqual(source.read_bytes(),original)

    def test_cli_inspect_preserves_seed_and_refuses_override_without_output(self):
        with tempfile.TemporaryDirectory() as folder:
            source=Path(folder)/'seed.json';source.write_text(json.dumps(build('lyrics_seed',PAYLOAD).data),encoding='utf-8-sig')
            args=[sys.executable,'-X','utf8',str(ROOT/'music_lab.py'),'lyrics-seed','--seed',str(source),'--out',str(Path(folder)/'out')]
            proc=subprocess.run(args,cwd=folder,capture_output=True,encoding='utf-8',timeout=10)
            self.assertEqual(proc.returncode,0,proc.stderr)
            bad=subprocess.run([*args,'--title','override'],cwd=folder,capture_output=True,encoding='utf-8',timeout=10)
            self.assertEqual(bad.returncode,1);self.assertIn('覆蓋',bad.stderr)

    def test_json_lines_bad_then_good_and_inspection_write_nothing(self):
        seed=build('lyrics_seed',PAYLOAD).data
        requests=[{'protocol_version':1,'id':str(i),'operation':'lyrics_seed','payload':payload}
            for i,payload in enumerate([{'title':'x','text':''},PAYLOAD,{'seed':seed}])]
        with tempfile.TemporaryDirectory() as folder:
            proc=subprocess.run([sys.executable,'-X','utf8',str(ROOT/'music_lab_agent.py')],cwd=folder,
                input=''.join(json.dumps(x)+'\n' for x in requests),capture_output=True,encoding='utf-8',timeout=10)
            self.assertEqual(proc.returncode,0,proc.stderr); replies=[json.loads(x) for x in proc.stdout.splitlines()]
            self.assertFalse(replies[0]['ok']);self.assertEqual(replies[1]['result'],build('lyrics_seed',PAYLOAD).wire())
            self.assertEqual(replies[2]['result'],build('lyrics_seed',{'seed':seed}).wire());self.assertEqual(list(Path(folder).iterdir()),[])

    def test_real_mcp_discovery_create_and_inspection_match_application(self):
        seed=build('lyrics_seed',PAYLOAD).data
        requests=[{'jsonrpc':'2.0','id':1,'method':'initialize','params':{'protocolVersion':MCP_VERSION,
            'capabilities':{},'clientInfo':{'name':'lyric-seed-test','version':'1'}}},
            {'jsonrpc':'2.0','method':'notifications/initialized'}, {'jsonrpc':'2.0','id':2,'method':'tools/list'}]
        for i,payload in enumerate([PAYLOAD,{'seed':seed}]):
            requests.append({'jsonrpc':'2.0','id':i+3,'method':'tools/call','params':{'name':'lyrics_seed','arguments':{'payload':payload}}})
        with tempfile.TemporaryDirectory() as folder:
            proc=subprocess.run([sys.executable,'-X','utf8',str(ROOT/'music_lab_mcp.py')],cwd=folder,
                input=''.join(json.dumps(x)+'\n' for x in requests),capture_output=True,encoding='utf-8',timeout=10)
            self.assertEqual(proc.returncode,0,proc.stderr);replies=[json.loads(x) for x in proc.stdout.splitlines()]
            self.assertEqual(len(replies),4);self.assertEqual(len(replies[1]['result']['tools']),22)
            for reply,payload in zip(replies[2:],[PAYLOAD,{'seed':seed}]):self.assertEqual(reply['result']['structuredContent'],build('lyrics_seed',payload).wire())
            self.assertEqual(list(Path(folder).iterdir()),[])
        tool={t['name']:t for t in tool_list()}['lyrics_seed'];self.assertTrue(tool['annotations']['readOnlyHint'])
        self.assertFalse(tool['annotations']['openWorldHint']);self.assertEqual(capabilities()['lyrics_seed']['schema_version'],1)

    def test_real_http_assets_valid_seed_and_rejection_share_domain(self):
        with WorkbenchServer(('127.0.0.1',0),WorkbenchHandler) as server:
            server.draft_library=None;thread=threading.Thread(target=server.serve_forever);thread.start()
            try:
                conn=http.client.HTTPConnection('127.0.0.1',server.server_port,timeout=5)
                for path in ['/lyrics-seed.js','/cue-stamp.js','/lyrics-import.js']:
                    conn.request('GET',path);response=conn.getresponse();self.assertEqual(response.status,200);self.assertIn(b'SPDX',response.read())
                conn.request('POST','/api/lyrics-seed',json.dumps(PAYLOAD),{'Content-Type':'application/json'})
                response=conn.getresponse();self.assertEqual(response.status,200);self.assertEqual(json.loads(response.read()),build('lyrics_seed',PAYLOAD).wire())
                conn.request('POST','/api/lyrics-seed',json.dumps({'title':'x','text':''}),{'Content-Type':'application/json'})
                response=conn.getresponse();self.assertEqual(response.status,400);self.assertIn('error',json.loads(response.read()));conn.close()
            finally:server.shutdown();thread.join(timeout=5);self.assertFalse(thread.is_alive())


if __name__=='__main__':unittest.main()
