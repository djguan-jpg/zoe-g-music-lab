# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
import copy
import importlib.util
import json
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest

from musiclab.test_run_summary import summarize,checked_summary,decode_summary,worker_startup,MAX_SUMMARY_BYTES,MAX_STARTUP_BYTES
from musiclab.run_identity import observe_process
from musiclab.maintenance import classify_run

ROOT=Path(__file__).resolve().parents[1]


def record(group,pid):
    return {'format':'zoe-iteration-run','schema_version':1,'job':'python-tests-'+str(group),
            'identity':{'pid':pid,'platform':'windows','creation_ticks':'1234567890','image':'python.exe'}}


def fixture():
    ids=[['synthetic.Test.test_a','synthetic.Test.test_b'],['other.Test.test_c']]
    starts=[{'phase':'start','group':g,'run':record(g,50+g)} for g in range(2)]
    ends=[{'phase':'result','group':g,'count':len(ids[g]),'ids':list(ids[g]),'passed':True,
           'skipped':[],'expected_failures':[],'failures':0,'errors':0,'unexpected_successes':0} for g in range(2)]
    return ids,starts,ends


def wire(starts,ends):
    return [('\n'.join(json.dumps(v,ensure_ascii=False) for v in (starts[g],ends[g]))+'\n').encode() for g in range(2)]


class PureTestRunTests(unittest.TestCase):
    def setUp(self):self.ids,self.starts,self.ends=fixture()
    def run_report(self,**changes):
        args={'replies':wire(self.starts,self.ends),'expected':self.ids,'pids':[50,51],'exit_codes':[0,0],'eofs':[True,True]}
        args.update(changes);return summarize(**args)

    def test_complete_source_and_original_handle_evidence_isolated(self):
        self.ends[0]['skipped']=[self.ids[0][0]];self.ends[1]['expected_failures']=[self.ids[1][0]]
        before=copy.deepcopy((self.ids,self.starts,self.ends));v=self.run_report()
        self.assertEqual((v['tests'],v['skipped'],v['expected_failures']),(3,1,1));self.assertTrue(v['worker_identities_verified'])
        self.assertEqual([w['terminal'] for w in v['workers']],['eof','eof'])
        self.assertEqual(decode_summary(json.dumps(v).encode()),v)
        v['workers'][0]['run']['identity']['image']='changed';v['skipped_tests'].clear()
        self.assertEqual((self.ids,self.starts,self.ends),before)

    def test_empty_group_is_valid_but_empty_or_duplicate_discovery_is_not(self):
        self.ids[1]=[];self.ends[1].update(ids=[],count=0);self.assertEqual(self.run_report()['workers'][1]['tests'],0)
        for expected in ([[],[]],[self.ids[0],self.ids[0]]):
            with self.assertRaises(ValueError):self.run_report(expected=expected)

    def test_changed_coverage_wrong_count_or_group_never_passes(self):
        for change in ({'count':1},{'ids':list(reversed(self.ids[0]))},{'ids':[self.ids[0][0]]*2},{'group':1}):
            with self.subTest(change=change):
                old=copy.deepcopy(self.ends[0]);self.ends[0].update(change)
                with self.assertRaises(ValueError):self.run_report()
                self.ends[0]=old

    def test_boolean_and_truthy_fake_success_are_rejected(self):
        for change in ({'count':True},{'group':False},{'passed':'true'},{'passed':1},{'errors':False},{'failures':1},{'unexpected_successes':1}):
            with self.subTest(change=change):
                old=copy.deepcopy(self.ends[0]);self.ends[0].update(change)
                with self.assertRaises(ValueError):self.run_report()
                self.ends[0]=old

    def test_incomplete_or_nonzero_original_handles_rejected(self):
        for change in ({'exit_codes':[0,1]},{'exit_codes':[False,0]},{'eofs':[True,False]},{'eofs':[1,True]},{'pids':[50,50]},{'pids':[True,51]},{'pids':[52,51]}):
            with self.subTest(change=change),self.assertRaises(ValueError):self.run_report(**change)

    def test_start_registration_requires_correct_group_pid_and_run_shape(self):
        for change in ({'group':True},{'phase':'finished'},{'extra':1}):
            with self.subTest(change=change):
                old=copy.deepcopy(self.starts[0]);self.starts[0].update(change)
                with self.assertRaises(ValueError):self.run_report()
                self.starts[0]=old
        self.starts[0]['run']['identity']['creation_ticks']='0'
        with self.assertRaises(ValueError):self.run_report()

    def test_unavailable_identity_remains_explicit_without_losing_handle_completion(self):
        self.starts[0]['run']=None;v=self.run_report();self.assertFalse(v['worker_identities_verified']);self.assertIsNone(v['workers'][0]['run'])
        v['worker_identities_verified']=True
        with self.assertRaises(ValueError):checked_summary(v)

    def test_strict_two_frames_unicode_duplicate_keys_and_budget(self):
        good=wire(self.starts,self.ends)
        candidates=[b'',good[0].splitlines()[0],good[0]+b'{}\n',b'\xff\n{}',good[0].replace(b'"group": 0',b'"group":0,"group":0',1),b'x'*(1024*1024+1),good[0].replace(b'"start"',b'"\\ud800"',1)]
        for raw in candidates:
            with self.subTest(raw=raw[:30]),self.assertRaises(ValueError):self.run_report(replies=[raw,good[1]])
        self.assertEqual(self.run_report()['tests'],3)

    def test_skipped_events_refer_to_discovered_methods_including_subtests(self):
        self.ends[0]['skipped']=[self.ids[0][0]+' (number=1)',self.ids[0][0]+' (number=2)']
        self.assertEqual(self.run_report()['skipped'],2)
        for event in ('other.Test.test_c','unknown.Test.test_a',self.ids[0][0]+'\n',self.ids[0][0]+'\ud800'):
            self.ends[0]['skipped']=[event]
            with self.subTest(event=repr(event)),self.assertRaises(ValueError):self.run_report()

    def test_skip_count_and_byte_limits_preserve_complete_event_totals(self):
        base=self.ids[0][0];self.ends[0]['skipped']=[base+' (sample='+str(i)+')' for i in range(30)]
        v=self.run_report();self.assertEqual((v['skipped'],len(v['skipped_tests'])),(30,20));self.assertTrue(v['skipped_details_truncated'])
        self.ends[0]['skipped']=[base+' (sample='+str(i)+'x'*930+')' for i in range(20)]
        v=self.run_report();self.assertEqual(v['skipped'],20);self.assertLess(len(v['skipped_tests']),20)
        self.assertLessEqual(len(json.dumps(v,ensure_ascii=False,separators=(',',':')).encode()),MAX_SUMMARY_BYTES)

    def test_summary_unknown_version_extra_fields_totals_and_late_completion_refused(self):
        v=self.run_report()
        for change in ({'schema_version':2},{'schema_version':True},{'extra':1},{'tests':4},{'skipped':1},{'worker_identities_verified':False},{'status':'running'},{'skipped_details_truncated':True}):
            with self.subTest(change=change),self.assertRaises(ValueError):checked_summary(dict(v,**change))
        bad=copy.deepcopy(v);bad['workers'][1]['terminal']='running'
        with self.assertRaises(ValueError):checked_summary(bad)
        self.assertEqual(checked_summary(v),v)

    def test_failure_startup_retains_original_identity_without_accepting_incomplete_result(self):
        raw=(json.dumps(self.starts[0])+'\n'+'unfinished').encode()
        frame=worker_startup(raw,0,50)
        self.assertEqual(frame,self.starts[0])
        frame['run']['identity']['image']='changed'
        self.assertEqual(self.starts[0]['run']['identity']['image'],'python.exe')
        with self.assertRaises(ValueError):self.run_report(replies=[raw,wire(self.starts,self.ends)[1]])
        self.starts[0]['run']=None
        self.assertIsNone(worker_startup((json.dumps(self.starts[0])+'\n').encode(),0,50)['run'])

    def test_failure_startup_refuses_wrong_handle_or_unknown_source(self):
        good=(json.dumps(self.starts[0])+'\n').encode()
        for raw,group,pid in [(good,True,50),(good,0,True),(good,1,50),(good,0,51),
                              (good.replace(b'"group": 0',b'"group":0,"group":0'),0,50),
                              (good.replace(b'"phase": "start"',b'"phase":"other"'),0,50)]:
            with self.subTest(group=group,pid=pid),self.assertRaises(ValueError):worker_startup(raw,group,pid)

    def test_failure_startup_budget_does_not_read_or_trust_later_output(self):
        good=(json.dumps(self.starts[0])+'\n').encode()
        self.assertEqual(worker_startup(good+b'x'*(1024*1024+1),0,50),self.starts[0])
        for raw in (good.rstrip(b'\n'),b'\xff\n',b' '*MAX_STARTUP_BYTES+good,b'x'*(MAX_STARTUP_BYTES+1)+b'\n'):
            with self.subTest(raw=raw[:10]),self.assertRaises(ValueError):worker_startup(raw,0,50)


class NativeTestRunnerTests(unittest.TestCase):
    def setUp(self):
        self.temp=tempfile.TemporaryDirectory(prefix='zoe-test-run-native-');self.root=Path(self.temp.name).resolve()
        self.assertEqual(self.root.parent,Path(tempfile.gettempdir()).resolve())
        for name in ('scripts','tests','musiclab'):(self.root/name).mkdir()
        (self.root/'musiclab/__init__.py').write_text('# Synthetic test fixture package\n',encoding='utf-8')
        for name in ('test_schedule.py','test_run_summary.py','json_document.py','maintenance.py','digests.py','run_identity.py','process_probe.py','process_probe_windows.py'):
            (self.root/'musiclab'/name).write_bytes((ROOT/'musiclab'/name).read_bytes())
        (self.root/'scripts/check_python_tests.py').write_bytes((ROOT/'scripts/check_python_tests.py').read_bytes())
        self.source='''import unittest
class Synthetic(unittest.TestCase):
 def test_good(self):self.assertEqual(1+1,2)
 @unittest.skip('synthetic skip')
 def test_skip(self):pass
 @unittest.expectedFailure
 def test_expected(self):self.assertEqual(1,2)
 def test_subtest(self):
  with self.subTest(number=1):self.skipTest('synthetic subtest skip')
'''
        (self.root/'tests/test_synthetic.py').write_text(self.source,encoding='utf-8')
    def tearDown(self):self.temp.cleanup()
    def command(self,*args):return subprocess.run([sys.executable,'-X','utf8','scripts/check_python_tests.py',*args],cwd=self.root,capture_output=True,text=True,encoding='utf-8',timeout=15)

    def test_real_workers_report_skip_expected_failure_and_original_eof(self):
        p=self.command('--report-json');self.assertEqual(p.returncode,0,p.stderr[-1500:]);v=decode_summary(p.stdout.encode())
        self.assertEqual((v['tests'],v['skipped'],v['expected_failures']),(4,2,1));self.assertEqual(len(v['skipped_tests']),2)
        self.assertEqual([row['tests'] for row in v['workers']],[2,2])
        for row in v['workers']:
            self.assertEqual((row['terminal'],row['exit_code']),('eof',0))
            if sys.platform=='win32':
                self.assertTrue(v['worker_identities_verified']);self.assertTrue(classify_run(row['run'],observe_process(row['pid']))['original_run_terminal'])

    def test_default_text_discloses_skips_without_breaking_legacy_count_line(self):
        p=self.command();self.assertEqual(p.returncode,0,p.stderr[-1000:]);self.assertIn('Ran 4 tests',p.stdout)
        self.assertIn('Skipped 2; expected failures 1',p.stdout);self.assertIn('OK (two isolated workers; 120 second overall deadline)',p.stdout)

    def test_failed_tests_cannot_emit_success_summary(self):
        (self.root/'tests/test_synthetic.py').write_text(self.source.replace('self.assertEqual(1+1,2)','self.assertEqual(1+1,3)'),encoding='utf-8')
        p=self.command('--report-json');self.assertEqual(p.returncode,1);self.assertIn('FAILED',p.stderr);self.assertNotIn('"format":"zoe-python-test-run"',p.stdout)
        starts=[json.loads(line) for line in p.stderr.splitlines() if line.startswith('{"phase": "start"')]
        self.assertEqual([start['group'] for start in starts],[0,1])
        finished=[json.loads(line) for line in p.stderr.splitlines() if line.startswith('{"phase": "worker-eof"')]
        self.assertEqual([row['group'] for row in finished],[0,1])
        self.assertTrue(all(row['terminal'] is True for row in finished))
        self.assertEqual([row['pid'] for row in finished],[start['run']['identity']['pid'] if start['run'] is not None else row['pid'] for start,row in zip(starts,finished)])
        for start in starts:
            if start['run'] is not None:self.assertTrue(classify_run(start['run'],observe_process(start['run']['identity']['pid']))['original_run_terminal'])

    def test_worker_json_parent_flag_misuse_rejects_before_discovery(self):
        p=self.command('--group','0','--report-json');self.assertEqual(p.returncode,2);self.assertNotIn('"phase"',p.stdout)

    def test_actual_deadline_collects_owned_worker_and_refuses_success(self):
        target=self.root/'scripts/check_python_tests.py';target.write_text(target.read_text().replace('DEADLINE_SECONDS = 120','DEADLINE_SECONDS = 1.2'),encoding='utf-8')
        (self.root/'tests/test_synthetic.py').write_text('import unittest,time\nclass Slow(unittest.TestCase):\n def test_slow(self):time.sleep(3)\n',encoding='utf-8')
        p=self.command('--report-json');self.assertEqual(p.returncode,1);self.assertNotIn('"format":"zoe-python-test-run"',p.stdout)
        starts=[]
        for line in p.stderr.splitlines():
            try:value=json.loads(line)
            except ValueError:continue
            if isinstance(value,dict) and value.get('phase')=='start':starts.append(value)
        # A cold worker may reach the actual short deadline before registering.
        # Only its original parent handle can prove EOF; do not invent identity.
        finished=[json.loads(line) for line in p.stderr.splitlines() if line.startswith('{"phase": "worker-eof"')]
        self.assertEqual([row['group'] for row in finished],[0,1])
        self.assertTrue(all(row['terminal'] is True for row in finished))
        self.assertTrue(all(type(row['exit_code']) is int for row in finished))
        self.assertEqual(len({row['pid'] for row in finished}),2)
        self.assertEqual({start['group'] for start in starts},{row['group'] for row in finished if row['startup_frame_available']})
        for start in starts:
            if start['run'] is not None:self.assertTrue(classify_run(start['run'],observe_process(start['run']['identity']['pid']))['original_run_terminal'])


if __name__=='__main__':unittest.main()
