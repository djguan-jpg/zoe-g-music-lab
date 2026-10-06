# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
import copy
import csv
import http.client
import io
import json
import math
import subprocess
import sys
import tempfile
import threading
import unittest
from pathlib import Path
from musiclab.application import build, capabilities
from musiclab.creative import storyboard_bundle
from musiclab.storyboard_frames import descriptor, frame_index, frame_timeline
from music_lab_server import WorkbenchHandler, WorkbenchServer

ROOT = Path(__file__).resolve().parents[1]


def brief(end=.0625, start=.0625, duration=1, tail=None, fps=24):
    data = json.loads((ROOT/'examples/first-light-mv.json').read_text(encoding='utf-8'))
    data.update(title='原創影格邊界驗證', duration_seconds=duration, fps=fps)
    first = data['shots'][0]
    data['shots'] = [dict(first, start=0, end=end),
                     dict(first, start=start, end=duration if tail is None else tail)]
    return data


class StoryboardFramesTests(unittest.TestCase):
    def test_all_half_ties_retain_even_rounding(self):
        for index in range(20):
            self.assertEqual(frame_index((index+.5)/8, 8), index if index%2 == 0 else index+1)

    def test_representable_values_each_side_of_half_tie_do_not_snap(self):
        self.assertEqual(frame_index(math.nextafter(.0625, 0), 24), 1)
        self.assertEqual(frame_index(.0625, 24), 2)
        self.assertEqual(frame_index(math.nextafter(.0625, 1), 24), 2)

    def test_original_overlap_and_gap_inside_seconds_tolerance_now_refuse(self):
        for end, start, message in [(.06251,.0616,'重疊'),(.06249,.0634,'空缺'),(.104,.105,'空缺')]:
            with self.subTest(end=end), self.assertRaisesRegex(ValueError, message):
                build('storyboard',brief(end,start))

    def test_original_missing_and_extra_tail_frames_now_refuse(self):
        for duration,tail in [(.93751,.9366),(.93749,.9384)]:
            with self.subTest(duration=duration), self.assertRaisesRegex(ValueError,'尾鏡結束影格'):
                build('storyboard',brief(.1,.1,duration,tail))

    def test_exact_boundary_recovers_with_full_coverage_and_no_source_changes(self):
        source = brief(); before = copy.deepcopy(source); result = build('storyboard',source)
        self.assertEqual(source,before)
        self.assertEqual(json.loads(result.files['mv-brief.json']),source)
        self.assertEqual(result.data['frame_timeline'],{**descriptor(),'total_frames':24})
        self.assertEqual([(s['start_frame'],s['end_frame_exclusive']) for s in result.data['shots']],[(0,2),(2,24)])
        self.assertEqual([s['end'] for s in result.data['shots']],[.0625,1])
        # Existing motif reminders are independent of frame coverage.
        self.assertTrue(result.needs_review)
        self.assertIn('只有一種狀態',result.data['review_notes'][0]['message'])

    def test_fractional_fps_and_same_frame_seconds_tolerance_preserve_input(self):
        for fps in [23.976,29.97,59.94,120]:
            source=brief(.1,.1009,1,fps=fps);result=build('storyboard',source)
            self.assertEqual(result.data['shots'][1]['start'],.1009)
            self.assertEqual(result.data['frame_timeline']['total_frames'],round(fps))
        # 1 ms is inclusive; binary noise must not turn this into a seconds gap.
        self.assertEqual(build('storyboard',brief(.1,.101)).data['shots'][1]['start_frame'],2)

    def test_seconds_gap_larger_than_tolerance_refuses_even_when_frames_agree(self):
        with self.assertRaisesRegex(ValueError,'與前鏡'):build('storyboard',brief(.1,.102))

    def test_positive_seconds_subframe_and_incomplete_frame_lists_refuse(self):
        with self.assertRaisesRegex(ValueError,'短於一幀'):build('storyboard',brief(.01,.01))
        with self.assertRaises(ValueError):frame_timeline([],1,24)
        with self.assertRaises(ValueError):frame_timeline([{}],1,24)

    def test_completed_frames_refuse_forged_types_mapping_start_and_tail(self):
        result=build('storyboard',brief()).data
        for changes in [dict(start_frame=True),dict(start_frame=1),dict(end_frame_exclusive=3),dict(end_frame_exclusive=2.0)]:
            shots=copy.deepcopy(result['shots']);shots[0].update(changes)
            with self.subTest(changes=changes), self.assertRaises(ValueError):frame_timeline(shots,1,24)
        shots=copy.deepcopy(result['shots']);shots[-1]['end']=.94;shots[-1]['end_frame_exclusive']=23
        with self.assertRaisesRegex(ValueError,'尾鏡'):frame_timeline(shots,1,24)

    def test_helpers_refuse_nonfinite_boolean_negative_or_out_of_range_values(self):
        for seconds,fps in [(True,24),('1',24),(float('nan'),24),(-1,24),(14401,24),(1,True),(1,0),(1,121),(1,float('inf'))]:
            with self.subTest(seconds=seconds,fps=fps),self.assertRaises(ValueError):frame_index(seconds,fps)
        with self.assertRaises(ValueError):frame_timeline([{}],14400.001,24)

    def test_four_hour_cap_preserves_existing_same_frame_tail_tolerance(self):
        result=build('storyboard',brief(7200,7200,14400,14400.0009,120))
        self.assertEqual(result.data['shots'][-1]['end'],14400.0009)
        self.assertEqual(result.data['frame_timeline']['total_frames'],1728000)

    def test_csv_prompts_and_legacy_bundle_use_same_exclusive_boundaries(self):
        source=brief();source['shots'][0]['visual']='=2+2'
        files=storyboard_bundle(source);data=json.loads(files['storyboard.json'])
        rows=list(csv.DictReader(io.StringIO(files['storyboard.csv'])))
        self.assertEqual(rows[0]['visual'],"'=2+2")
        for row,shot in zip(rows,data['shots']):
            self.assertEqual(int(row['start_frame']),shot['start_frame'])
            self.assertEqual(int(row['end_frame_exclusive']),shot['end_frame_exclusive'])
            self.assertIn(f"[{shot['start_frame']}, {shot['end_frame_exclusive']})",files['prompts.md'])
        self.assertIn('正好半幀取偶數',files['prompts.md']);self.assertIn('未證明實際音畫同步',files['prompts.md'])
        self.assertEqual(set(files),{'storyboard.json','storyboard.csv','prompts.md'})

    def test_discovery_separates_completed_frames_from_seed_and_protocol_versions(self):
        info=capabilities()
        self.assertEqual(info['storyboard_frames'],descriptor())
        self.assertEqual((info['protocol_version'],info['storyboard_seed']['schema_version']),(1,1))
        self.assertEqual(len(info['operations']),18)

    def test_real_cli_bad_boundary_then_correction_and_overwrite_refusal(self):
        with tempfile.TemporaryDirectory() as folder:
            temp=Path(folder);source=temp/'brief.json';out=temp/'delivery'
            invalid=brief(.06251,.0616);source.write_text(json.dumps(invalid),encoding='utf-8');original=source.read_bytes()
            args=[sys.executable,'-X','utf8',str(ROOT/'music_lab.py'),'storyboard','--brief',str(source),'--out',str(out)]
            process=subprocess.run(args,cwd=temp,capture_output=True,encoding='utf-8',timeout=10)
            self.assertEqual(process.returncode,1);self.assertFalse(out.exists());self.assertEqual(source.read_bytes(),original)
            source.write_text(json.dumps(brief()),encoding='utf-8')
            process=subprocess.run(args,cwd=temp,capture_output=True,encoding='utf-8',timeout=10)
            self.assertEqual(process.returncode,0,process.stderr)
            expected=build('storyboard',brief()).files
            self.assertEqual({p.name:p.read_bytes().decode('utf-8') for p in out.iterdir()},expected)
            repeated=subprocess.run(args,cwd=temp,capture_output=True,encoding='utf-8',timeout=10)
            self.assertEqual(repeated.returncode,1)
            self.assertEqual({p.name:p.read_bytes().decode('utf-8') for p in out.iterdir()},expected)

    def test_real_json_lines_bad_then_valid_share_application_results(self):
        requests=[{'protocol_version':1,'id':str(i),'operation':'storyboard','payload':p} for i,p in enumerate([brief(.06249,.0634),brief()])]
        result=subprocess.run([sys.executable,'-X','utf8',str(ROOT/'music_lab_agent.py')],cwd=ROOT,input=''.join(json.dumps(r)+'\n' for r in requests),capture_output=True,encoding='utf-8',timeout=10)
        self.assertEqual(result.returncode,0,result.stderr)
        bad,good=map(json.loads,result.stdout.splitlines());self.assertFalse(bad['ok']);self.assertTrue(good['ok'])
        self.assertEqual(good['result'],build('storyboard',brief()).wire())

    def test_real_mcp_stdio_bad_then_valid_without_writes(self):
        requests=[{'jsonrpc':'2.0','id':1,'method':'initialize','params':{'protocolVersion':'2025-11-25','capabilities':{},'clientInfo':{'name':'frame-test','version':'1'}}},
                  {'jsonrpc':'2.0','method':'notifications/initialized'}]
        requests += [{'jsonrpc':'2.0','id':i+2,'method':'tools/call','params':{'name':'storyboard_plan','arguments':{'payload':p}}} for i,p in enumerate([brief(.1,.1,.93751,.9366),brief()])]
        with tempfile.TemporaryDirectory() as folder:
            result=subprocess.run([sys.executable,'-X','utf8',str(ROOT/'music_lab_mcp.py')],cwd=folder,input=''.join(json.dumps(r)+'\n' for r in requests),capture_output=True,encoding='utf-8',timeout=10)
            self.assertEqual(result.returncode,0,result.stderr);self.assertEqual(list(Path(folder).iterdir()),[])
        replies=list(map(json.loads,result.stdout.splitlines()))
        self.assertTrue(replies[1]['result']['isError']);self.assertFalse(replies[2]['result'].get('isError',False))
        self.assertEqual(replies[2]['result']['structuredContent'],build('storyboard',brief()).wire())

    def test_real_http_rejects_invalid_frames_then_recovers_and_serves_shared_module(self):
        with WorkbenchServer(('127.0.0.1',0),WorkbenchHandler) as server:
            server.draft_library=None;worker=threading.Thread(target=server.serve_forever,daemon=True);worker.start()
            try:
                for payload,status in [(brief(.06251,.0616),400),(brief(),200)]:
                    conn=http.client.HTTPConnection(*server.server_address,timeout=10)
                    conn.request('POST','/api/storyboard',json.dumps(payload),{'Content-Type':'application/json'})
                    response=conn.getresponse();data=json.loads(response.read());conn.close();self.assertEqual(response.status,status)
                    if status==200:self.assertEqual(data,build('storyboard',payload).wire())
                conn=http.client.HTTPConnection(*server.server_address,timeout=10);conn.request('GET','/storyboard-frames.js')
                response=conn.getresponse();self.assertEqual(response.status,200);self.assertEqual(response.read(),(ROOT/'web/storyboard-frames.js').read_bytes());conn.close()
            finally:server.shutdown();worker.join(timeout=3)


if __name__=='__main__':unittest.main()
