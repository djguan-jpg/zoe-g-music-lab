# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
import copy
import http.client
import json
import random
import re
import subprocess
import sys
import tempfile
import threading
import unittest
from pathlib import Path
from musiclab.application import build, capabilities
from musiclab.lyrics_review import review, markdown
from music_lab_server import WorkbenchHandler, WorkbenchServer
from music_lab_mcp import tool_list

ROOT = Path(__file__).resolve().parents[1]
PARTIAL = {'title':'原創待辦 🎵','duration':'10','cues':[
    {'start':'','end':'','text':'未標記'}, {'start':'0','end':'2','text':'  保留原文  '},
    {'start':'3','end':'','text':'缺少句尾'}]}


class LyricsReviewTests(unittest.TestCase):
    def test_partial_rows_report_original_positions_without_guess_or_mutation(self):
        original=copy.deepcopy(PARTIAL);data=review(PARTIAL)
        self.assertEqual([(i['row'],i['field'],i['code']) for i in data['issues']],[(1,'start','missing_time'),(1,'end','missing_time'),(3,'end','missing_time')])
        self.assertEqual((data['total_rows'],data['timed_rows'],data['blocking_rows'],data['issue_count']),(3,1,2,3))
        self.assertEqual(data['source'],PARTIAL);self.assertEqual(PARTIAL,original)
        data['source']['cues'][0]['text']='changed';self.assertEqual(PARTIAL,original)

    def test_valid_unsorted_rows_keep_original_order_and_readiness_needs_listening(self):
        source={'cues':[{'start':'3','end':'4','text':''},{'start':'0','end':'2','text':'重複'},{'start':'2','end':'3','text':'重複'}]}
        result=build('lyrics_review',source);self.assertEqual(result.data['status'],'timing_checked');self.assertTrue(result.needs_review)
        self.assertEqual(result.data['source']['cues'],source['cues']);self.assertFalse(result.data['duration_declared'])
        complete=build('lyrics',{'cues':source['cues']});self.assertEqual([c['start'] for c in complete.data['cues']],[0,2,3])

    def test_nested_overlap_uses_furthest_occupied_end_and_original_row_numbers(self):
        data=review({'cues':[{'start':4,'end':5,'text':'第三句'},{'start':0,'end':10,'text':'長句'},{'start':2,'end':3,'text':'短句'}]})
        self.assertEqual([(i['row'],i['related_row']) for i in data['issues']],[(2,3),(3,2),(2,1),(1,2)])
        self.assertEqual(data['blocking_rows'],3)

    def test_duplicate_start_and_exclusive_end_boundary(self):
        data=review({'cues':[{'start':0,'end':2,'text':'a'},{'start':2,'end':3,'text':'b'}]});self.assertEqual(data['issue_count'],0)
        duplicate=review({'cues':[{'start':'.00049','end':1,'text':'a'},{'start':'.0004','end':2,'text':'b'}]})
        self.assertEqual([i['row'] for i in duplicate['issues'] if i['code']=='duplicate_start'],[1,2])

    def test_clock_rounding_negative_and_invalid_numbers_are_diagnostics(self):
        for value in ['-.0001',True,'0x10','NaN','Infinity','1e300']:
            data=review({'cues':[{'start':value,'end':'2','text':'x'}]});self.assertEqual(data['issues'][0]['code'],'invalid_time')
        data=review({'cues':[{'start':'.0005','end':'.0015','text':'x'}]});self.assertEqual(data['issue_count'],0)
        data=review({'cues':[{'start':1,'end':1.0004,'text':'x'}]});self.assertEqual(data['issues'][0]['code'],'invalid_end')

    def test_duration_limits_are_independent_from_selected_media(self):
        source={'duration':'2','cues':[{'start':'2','end':'3','text':'x'}]};data=review(source)
        self.assertEqual([i['field'] for i in data['issues']],['start','end'])
        for value in [0,'-.0001',True,'garbage']:
            self.assertEqual(review({**source,'duration':value})['issues'][0]['code'],'invalid_duration')
        self.assertFalse(review({**source,'duration':' '})['duration_declared'])

    def test_no_cues_and_multiline_are_explicit_issues(self):
        data=review({'cues':[]});self.assertEqual(data['issues'][0]['code'],'no_cues');self.assertEqual(data['status'],'needs_correction')
        data=review({'cues':[{'start':'0','end':'2','text':'a\nb'}]});self.assertEqual(data['issues'][0]['field'],'text')

    def test_structure_paths_versions_nonfinite_and_bounds_refuse(self):
        good={'cues':[{'start':0,'end':2,'text':'x'}]}
        for bad in [{},{**good,'path':'private.wav'},{**good,'schema_version':999},{'cues':[{'start':0,'text':'x'}]},
                    {'cues':[{'start':{},'end':2,'text':'x'}]},{'cues':[{'start':float('nan'),'end':2,'text':'x'}]},
                    {'cues':[{'start':10**400,'end':2,'text':'x'}]}, {'cues':good['cues']*10001},
                    {'cues':[{'start':0,'end':2,'text':'x'*2001}]},{**good,'title':'\u0085'}]:
            with self.subTest(bad=str(bad)[:100]),self.assertRaises(ValueError):review(bad)

    def test_issue_details_are_bounded_but_counts_cover_every_row(self):
        source={'cues':[{'start':'','end':'','text':f'原創{i}'} for i in range(10000)]};data=review(source)
        self.assertEqual((data['issue_count'],data['blocking_rows'],len(data['issues'])),(20000,10000,200))
        self.assertTrue(data['details_truncated']);self.assertIn('全部句子已檢查',markdown(data));self.assertEqual(len(data['source']['cues']),10000)

    def test_real_javascript_report_and_markdown_match_python_on_adversarial_tables(self):
        values=[PARTIAL,{'cues':[]},{'title':'<script>保留原文</script>','duration':'\u0085 10 \u0085','cues':[{'start':'\u0085 0 \u0085','end':'2','text':'重複 🎵'}]},
                {'duration':'\ufeff10','cues':[{'start':'\ufeff0','end':2,'text':'x'}]}, {'cues':[{'start':'','end':'','text':str(i)} for i in range(120)]}]
        rng=random.Random(25);clocks=['',None,True,'0x10','-.0001','.0005',0,1,2,4,6,'6.0004','1e300']
        for _ in range(45):values.append({'duration':rng.choice(clocks),'cues':[{'start':rng.choice(clocks),'end':rng.choice(clocks),'text':rng.choice(['重複','  原文  ','🎵','a\nb',''])} for _ in range(rng.randrange(1,8))]})
        script="const fs=require('node:fs'),R=require('./musiclab/assets/lyrics-review.js');process.stdout.write(JSON.stringify(JSON.parse(fs.readFileSync(0,'utf8')).map(p=>{const d=R.review(p);return [d,R.markdown(d)];})));"
        p=subprocess.run(['node','-e',script],cwd=ROOT,input=json.dumps(values),capture_output=True,encoding='utf-8',timeout=15)
        self.assertEqual(p.returncode,0,p.stderr)
        self.assertEqual(json.loads(p.stdout),[[review(v),markdown(review(v))] for v in values])

    def test_cli_reports_incomplete_exit2_then_valid0_and_refuses_overwrite(self):
        with tempfile.TemporaryDirectory() as folder:
            root=Path(folder);source=root/'source.json';source.write_text(json.dumps(PARTIAL,ensure_ascii=False),encoding='utf-8-sig');before=source.read_bytes()
            args=[sys.executable,'-X','utf8',str(ROOT/'music_lab.py'),'lyrics-review','--input',str(source),'--out',str(root/'result')]
            p=subprocess.run(args,cwd=root,capture_output=True,encoding='utf-8',timeout=15);self.assertEqual(p.returncode,2,p.stderr)
            self.assertEqual(source.read_bytes(),before)
            expected=build('lyrics_review',PARTIAL).files
            self.assertEqual({p.name:p.read_bytes().decode('utf-8') for p in (root/'result').iterdir()},expected)
            p=subprocess.run(args,cwd=root,capture_output=True,encoding='utf-8',timeout=15);self.assertEqual(p.returncode,1)
            source.write_text(json.dumps({'cues':[{'start':0,'end':2,'text':'有效'}]}),encoding='utf-8');args[-1]=str(root/'valid')
            p=subprocess.run(args,cwd=root,capture_output=True,encoding='utf-8',timeout=15);self.assertEqual(p.returncode,0,p.stderr)

    def test_real_agent_and_mcp_bad_then_good_readonly_discovery(self):
        rows=[{'protocol_version':1,'id':str(i),'operation':'lyrics_review','payload':payload} for i,payload in enumerate([{'cues':[],'path':'bad'},PARTIAL])]
        p=subprocess.run([sys.executable,'-X','utf8',str(ROOT/'music_lab_agent.py')],cwd=ROOT,input=''.join(json.dumps(x)+'\n' for x in rows),capture_output=True,encoding='utf-8',timeout=15)
        self.assertEqual(p.returncode,0,p.stderr);replies=list(map(json.loads,p.stdout.splitlines()));self.assertFalse(replies[0]['ok']);self.assertEqual(replies[1]['result'],build('lyrics_review',PARTIAL).wire())
        rows=[{'jsonrpc':'2.0','id':1,'method':'initialize','params':{'protocolVersion':'2025-11-25','capabilities':{},'clientInfo':{'name':'review-qa','version':'1'}}},{'jsonrpc':'2.0','method':'notifications/initialized'},
              {'jsonrpc':'2.0','id':2,'method':'tools/list'},*({'jsonrpc':'2.0','id':i+3,'method':'tools/call','params':{'name':'lyrics_review','arguments':{'payload':v}}} for i,v in enumerate([{'cues':[],'schema_version':999},PARTIAL]))]
        p=subprocess.run([sys.executable,'-X','utf8',str(ROOT/'music_lab_mcp.py')],cwd=ROOT,input=''.join(json.dumps(x)+'\n' for x in rows),capture_output=True,encoding='utf-8',timeout=15)
        self.assertEqual(p.returncode,0,p.stderr);replies=list(map(json.loads,p.stdout.splitlines()));self.assertEqual(len(replies[1]['result']['tools']),12);self.assertTrue(replies[2]['result']['isError']);self.assertEqual(replies[3]['result']['structuredContent'],build('lyrics_review',PARTIAL).wire())
        tool={t['name']:t for t in tool_list()}['lyrics_review'];self.assertTrue(tool['annotations']['readOnlyHint']);self.assertFalse(tool['annotations']['openWorldHint']);self.assertEqual(capabilities()['lyrics_review']['schema_version'],1)

    def test_real_http_recovers_and_serves_actual_deferred_dependency(self):
        with WorkbenchServer(('127.0.0.1',0),WorkbenchHandler) as server:
            server.draft_library=None;thread=threading.Thread(target=server.serve_forever,daemon=True);thread.start()
            try:
                for payload,code in [({'cues':[],'file':'not-allowed'},400),(PARTIAL,200)]:
                    c=http.client.HTTPConnection(*server.server_address,timeout=10);c.request('POST','/api/lyrics-review',json.dumps(payload),{'Content-Type':'application/json'});response=c.getresponse();raw=response.read();c.close();self.assertEqual(response.status,code)
                    if code==200:self.assertEqual(json.loads(raw),build('lyrics_review',payload).wire())
                c=http.client.HTTPConnection(*server.server_address,timeout=10);c.request('GET','/lyrics-review.js');response=c.getresponse();self.assertEqual(response.status,200);self.assertEqual(response.read(),(ROOT/'musiclab/assets/lyrics-review.js').read_bytes());c.close()
                c=http.client.HTTPConnection(*server.server_address,timeout=10);c.request('GET','/');html=c.getresponse().read().decode('utf-8');c.close();scripts=re.findall(r'<script\s+src="([^"]+)"[^>]*>',html)
                self.assertEqual(scripts.count('/lyrics-review.js'),1);self.assertLess(scripts.index('/json-document.js'),scripts.index('/lyrics-review.js'));self.assertLess(scripts.index('/lyric-time.js'),scripts.index('/lyrics-review.js'));self.assertLess(scripts.index('/lyrics-review.js'),scripts.index('/app.js'))
            finally:server.shutdown();thread.join(timeout=3)


if __name__=='__main__':unittest.main()
