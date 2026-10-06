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
from musiclab.application import build, capabilities
from musiclab.lyrics import edits, validate_cues, timecode
from musiclab.lyric_timing import milliseconds, normalized_seconds
from music_lab_agent import response
from music_lab_server import WorkbenchServer, WorkbenchHandler

ROOT=Path(__file__).resolve().parents[1]
CUES=[{'start':1,'end':2,'text':'原創一'},{'start':4,'end':5,'text':'原創二'}]


def run(args, input=None, cwd=ROOT):
    result=subprocess.run(args,cwd=cwd,input=input,capture_output=True,timeout=20)
    if result.returncode:raise AssertionError(result.stderr.decode('utf-8',errors='replace')[-1000:])
    return result.stdout


class LyricTimingTests(unittest.TestCase):
    def test_negative_decimal_underflow_rejected_while_true_zero_and_signed_shift_remain_valid(self):
        for value in ('-1e-999', ' -0.01e-999 ', '-1e-324', '-000.0001E-999', '-1e-100000'):
            with self.subTest(value=value):
                with self.assertRaisesRegex(ValueError, '負時間'):
                    normalized_seconds(value, nonnegative=True)
                with self.assertRaisesRegex(ValueError, '負時間'):
                    timecode(value)
                with self.assertRaisesRegex(ValueError, '負時間'):
                    validate_cues([{'start': value, 'end': 1, 'text': '合成'}])
                self.assertEqual(normalized_seconds(value), 0)
        for value in ('-0e-999', '-0.000E-999', '-0e+999', '1e-999', -0.0):
            self.assertEqual(normalized_seconds(value, nonnegative=True), 0)
            self.assertEqual(timecode(value), '00:00.000')

    def test_half_milliseconds_carry_identically_and_negative_submillisecond_rejected(self):
        self.assertEqual(normalized_seconds(1.2345),1.235)
        self.assertEqual(normalized_seconds(-0.0005),-0.001)
        self.assertEqual(timecode(59.9995),'01:00.000')
        self.assertEqual(timecode(3599.9995,True),'01:00:00,000')
        with self.assertRaises(ValueError):validate_cues([{'start':-0.0001,'end':1,'text':'邊界'}])
        with self.assertRaises(ValueError):timecode(-0.0001)

    def test_invalid_values_and_nonrepresentable_times_refused(self):
        for value in (True,None,'','1_0','0x10',float('nan'),float('inf'),1e100):
            with self.subTest(value=value),self.assertRaises(ValueError):normalized_seconds(value)
        with self.assertRaises(ValueError):build('lyrics',{'cues':CUES,'shift_seconds':True})
        with self.assertRaises(ValueError):build('lyrics',{'cues':CUES,'shift_seconds':None})

    def test_shift_and_indexed_edits_use_sorted_original_indices_keep_lengths_and_source(self):
        source=list(reversed(copy.deepcopy(CUES)));before=copy.deepcopy(source)
        result=build('lyrics',{'cues':source,'duration':10,'shift_seconds':0.5,'time_changes':['1=2'],'text_changes':['2=第二句後修']})
        self.assertEqual(result.data['cues'],[{'start':2,'end':3,'text':'原創一'},{'start':4.5,'end':5.5,'text':'第二句後修'}])
        self.assertEqual(result.data['duration'],10);self.assertEqual(result.data['timing']['applied_shift_seconds'],0.5)
        self.assertEqual(source,before)
        self.assertTrue(result.needs_review)

    def test_lrc_offset_is_applied_once_then_explicit_global_shift_before_missing_end_inference(self):
        result=build('lyrics',{'content':'[offset:125]\n[00:01.000]第一句\n[00:04.000]第二句','suffix':'.lrc','duration':10,'shift_seconds':0.5})
        self.assertEqual([c['start'] for c in result.data['cues']],[1.625,4.625])
        self.assertEqual([c['end'] for c in result.data['cues']],[4.625,10])
        self.assertEqual(result.data['timing']['inferred_end_count'],2)
        self.assertTrue(result.data['timing']['tail_end_inferred'])

    def test_outside_duration_overlap_and_duplicate_normalized_starts_never_clip(self):
        before=copy.deepcopy(CUES)
        cases=[{'cues':CUES,'shift_seconds':-2}, {'cues':CUES,'shift_seconds':1,'duration':5},
               {'cues':CUES,'time_changes':['1=4.5']},
               {'cues':[{'start':1.23451,'text':'a'},{'start':1.2346,'text':'b'}]}]
        for payload in cases:
            with self.assertRaises(ValueError):build('lyrics',payload)
        self.assertEqual(CUES,before)

    def test_explicit_ends_shift_as_millisecond_integers_without_shortening(self):
        result=edits([{'start':1.005,'end':2.005,'text':'精度'}],0.01)
        self.assertEqual(result,[{'start':1.015,'end':2.015,'text':'精度'}])
        data=build('lyrics',{'cues':result}).data
        self.assertEqual(data['timing']['duration_source'],'last_cue_end');self.assertFalse(data['timing']['tail_end_inferred'])

    def test_invalid_edit_lists_fail_with_input_error(self):
        for extra in ({'time_changes':None},{'text_changes':'1=x'},{'time_changes':[True]},
                      {'time_changes':['0=1']},{'time_changes':['3=1']},{'text_changes':['1=多行\n不接受']}):
            with self.subTest(extra=extra),self.assertRaises(ValueError):build('lyrics',{'cues':CUES,**extra})

    def test_real_cli_has_the_same_bundle_as_application_from_other_cwd(self):
        with tempfile.TemporaryDirectory() as folder:
            selected=Path(folder)/'selected.json';selected.write_text(json.dumps({'cues':CUES}),encoding='utf-8');before=selected.read_bytes()
            out=Path(folder)/'out'
            run([sys.executable,'-X','utf8',str(ROOT/'music_lab.py'),'lyrics','--input',str(selected),'--out',str(out),'--title','原創校時','--duration','10','--shift','0.5','--set','1=2','--text','2=第二句後修'],cwd=folder)
            expected=build('lyrics',{'cues':CUES,'title':'原創校時','duration':10,'shift_seconds':0.5,'time_changes':['1=2'],'text_changes':['2=第二句後修']})
            self.assertEqual({p.name:p.read_text(encoding='utf-8') for p in out.iterdir()},expected.files)
            self.assertEqual(selected.read_bytes(),before)

    def test_real_jsonlines_accepts_shift_refuses_bad_input_and_continues(self):
        rows=[{'protocol_version':1,'id':str(i),'operation':'lyrics','payload':payload} for i,payload in enumerate([
            {'cues':CUES,'duration':10,'shift_seconds':0.5},{'cues':CUES,'shift_seconds':True},{'cues':CUES,'shift_seconds':-0.5}])]
        replies=[json.loads(line) for line in run([sys.executable,'-X','utf8','music_lab_agent.py'],(''.join(json.dumps(r)+'\n' for r in rows)).encode()).splitlines()]
        self.assertTrue(replies[0]['ok']);self.assertFalse(replies[1]['ok']);self.assertTrue(replies[2]['ok'])
        self.assertEqual(replies[0]['result'],build('lyrics',rows[0]['payload']).wire())
        self.assertEqual(len(capabilities()['operations']),22)
        self.assertIn('shift_seconds',capabilities()['input_schemas']['lyrics']['properties'])

    def test_real_mcp_shift_discovery_and_actual_tool_match_application(self):
        payload={'cues':CUES,'duration':10,'shift_seconds':0.5}
        requests=[{'jsonrpc':'2.0','id':1,'method':'initialize','params':{'protocolVersion':'2025-11-25','capabilities':{},'clientInfo':{'name':'timing-qa','version':'1'}}},
            {'jsonrpc':'2.0','method':'notifications/initialized'},{'jsonrpc':'2.0','id':2,'method':'tools/list'},
            {'jsonrpc':'2.0','id':3,'method':'tools/call','params':{'name':'lyrics_validate','arguments':{'payload':payload}}}]
        replies=[json.loads(line) for line in run([sys.executable,'-X','utf8','music_lab_mcp.py'],(''.join(json.dumps(r)+'\n' for r in requests)).encode()).splitlines()]
        tools=replies[1]['result']['tools'];self.assertEqual(len(tools),22)
        tool=next(t for t in tools if t['name']=='lyrics_validate');self.assertIn('shift_seconds',tool['inputSchema']['properties']['payload']['properties'])
        self.assertEqual(replies[2]['result']['structuredContent'],build('lyrics',payload).wire())

    def test_real_http_shift_and_static_shared_asset_match(self):
        with WorkbenchServer(('127.0.0.1',0),WorkbenchHandler) as server:
            server.draft_library=None;thread=threading.Thread(target=server.serve_forever,daemon=True);thread.start()
            def request(method,path,body=None,headers=None):
                c=http.client.HTTPConnection('127.0.0.1',server.server_port,timeout=5);c.request(method,path,body,headers or {});r=c.getresponse();data=r.read();status=r.status;c.close();return status,data
            try:
                payload={'cues':CUES,'duration':10,'shift_seconds':0.5};status,raw=request('POST','/api/lyrics',json.dumps(payload));self.assertEqual(status,200)
                self.assertEqual(json.loads(raw),build('lyrics',payload).wire())
                self.assertEqual(request('GET','/lyric-time.js')[1],(ROOT/'musiclab/assets/lyric-time.js').read_bytes())
                # Avoid unread-body Windows resets while asserting the early 403.
                self.assertEqual(request('POST','/api/lyrics',None,{'Origin':'https://outside.invalid'})[0],403)
                self.assertEqual(request('POST','/api/lyrics',json.dumps({'cues':CUES,'shift_seconds':-2}))[0],400)
            finally:server.shutdown();thread.join(timeout=5)

    def test_python_and_browser_timing_corpus_match_in_actual_node_process(self):
        cases=[{'cues':[{'start':value,'end':value+1,'text':'邊界'}]} for value in (0,0.0005,0.0015,1.0015,1.2345,59.9995,3599.9995)]
        cases.extend([{'cues':CUES,'duration':10},{'cues':[{'start':1,'text':'缺結束'},{'start':4,'text':'尾句'}]},
                      {'cues':[{'start':'1_0','end':11,'text':'格式錯誤'}]},
                      {'cues':[{'start':-0.0001,'end':1,'text':'負數'}]},{'cues':[{'start':0,'end':2,'text':'超時'}],'duration':1},
                      {'cues':[{'start':0,'end':2,'text':'重疊'},{'start':1,'end':3,'text':'下一句'}]}])
        expected=[]
        for case in cases:
            try:
                result=build('lyrics',case).data;expected.append({k:result[k] for k in ('cues','duration','duration_estimated','timing')})
            except ValueError:expected.append({'error':True})
        code="const t=require('./musiclab/assets/lyric-time.js'),fs=require('node:fs');const cases=JSON.parse(fs.readFileSync(0,'utf8'));process.stdout.write(JSON.stringify(cases.map(c=>{try{return t.normalizeCues(c.cues,c.duration);}catch(e){return {error:true};}})));"
        actual=json.loads(run(['node','-e',code],json.dumps(cases).encode()));self.assertEqual(actual,expected)

    def test_standalone_uses_identical_shared_code_and_safely_embeds_lyric_text(self):
        result=build('lyrics',{'cues':[{'start':1,'end':2,'text':'</script><img src=x onerror=alert(1)>'}],'title':'<script>危險文字</script>','shift_seconds':0.5})
        preview=result.files['preview.html']
        self.assertIn((ROOT/'musiclab/assets/lyric-time.js').read_text(encoding='utf-8'),preview)
        self.assertNotIn('__TIMING_JS__',preview);self.assertNotIn('__PACKAGE_JS__',preview)
        self.assertIn('MusicLyricsPackage.revise(data,collect(),duration)',preview)
        self.assertNotIn('</script><img',preview);self.assertIn('\\u003c/script>',preview)
        self.assertNotIn('未提供實際歌曲時長時，最後一句結束為估計',preview)
        marker='__TITLE__ __DATA__ __TIMING_JS__'
        literal=build('lyrics',{'cues':[{'start':1,'end':2,'text':marker}],'title':marker})
        initial=re.search(r'<script id="initial" type="application/json">(.*?)</script>',literal.files['preview.html'],re.S)
        self.assertEqual(json.loads(initial[1]),literal.data)
        self.assertIn('<h1>'+marker+'</h1>',literal.files['preview.html'])


if __name__=='__main__':unittest.main()
