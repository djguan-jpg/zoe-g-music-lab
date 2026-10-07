# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
"""Process-only auditing preserves explicit identity and avoids release reads."""
import copy
import hashlib
import io
import json
import subprocess
import sys
import tempfile
import unittest
from contextlib import redirect_stdout
from pathlib import Path
from unittest.mock import patch

from musiclab.maintenance_fs import audit_runs, write_new
from musiclab.maintenance_runs import build_run_report, checked_records, check_run_count
from scripts.iteration_audit import main

ROOT = Path(__file__).resolve().parents[1]


def record(pid=123, ticks='123456'):
    return {'format': 'zoe-iteration-run', 'schema_version': 1, 'job': 'synthetic-'+str(pid),
            'identity': {'pid': pid, 'platform': 'windows', 'creation_ticks': ticks, 'image': 'python.exe'}}


class RunReportPolicyTests(unittest.TestCase):
    def test_original_identity_order_unavailable_and_limited_evidence(self):
        records = [record(100+i) for i in range(5)]
        reused = copy.deepcopy(records[2]['identity']); reused['creation_ticks'] = '123466'
        limited = copy.deepcopy(records[4]['identity']); limited['creation_ticks'] = '123450'
        observations = [{'pid':100, 'state':'running', 'identity':records[0]['identity']},
                        {'pid':101, 'state':'absent'}, {'pid':102, 'state':'running', 'identity':reused},
                        {'pid':103, 'state':'unavailable'}, {'pid':104, 'state':'limited',
                         'source':'windows-cim-process-v1', 'identity':limited, 'creation_margin_ticks':9}]
        result = build_run_report(records, observations, ['a'*64]*5)
        self.assertEqual([row['pid'] for row in result['runs']], [100,101,102,103,104])
        self.assertEqual([row['status'] for row in result['runs']], ['running','stopped','pid_reused','unverified','unverified'])
        self.assertEqual(result['running_or_unverified'], 3)
        self.assertEqual([row['original_run_terminal'] for row in result['runs']], [False,True,True,False,False])
        self.assertEqual(result['runs'][4]['evidence']['identity'], limited)
        self.assertNotIn('prune_token', result); self.assertNotIn('packages', result)

    def test_boundaries_unknown_records_and_exact_source_digest(self):
        self.assertEqual(len(checked_records([record()]*32)), 32)
        for values in ([record()]*33, iter([record()]), {0:record()}, [dict(record(),schema_version=2)], [{'pid':123}]):
            with self.assertRaises(ValueError): checked_records(values)
        for count in (True, -1, 33, 1.0):
            with self.assertRaises(ValueError): check_run_count(count)
        with self.assertRaises(ValueError): check_run_count(0, require_records=True)
        self.assertEqual(build_run_report([], [], [])['runs'], [])
        for values in ([], ['A'*64], ['a'*63], [True], iter(['a'*64])):
            with self.assertRaises(ValueError): build_run_report([record()], [{'pid':123,'state':'absent'}], values)
        for observations in ([], [{'pid':124,'state':'absent'}], [{'pid':123,'state':'unknown'}]):
            with self.assertRaises(ValueError): build_run_report([record()], observations, ['a'*64])

    def test_report_copies_input_and_does_not_mutate_original_evidence(self):
        records = [record()]; observations = [{'pid':123,'state':'running','identity':records[0]['identity']}]
        digests = ['a'*64]; before = copy.deepcopy((records,observations,digests))
        result = build_run_report(records,observations,digests)
        result['record_sha256'][0] = 'b'*64; result['runs'][0]['job'] = 'changed'
        self.assertEqual((records,observations,digests),before)
        isolated = checked_records(records); isolated[0]['identity']['creation_ticks'] = '999'
        self.assertEqual(records[0]['identity']['creation_ticks'],'123456')


class RunAuditFilesystemTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory(prefix='zoe-run-audit-')
        self.root = Path(self.temp.name).resolve()
        self.assertEqual(self.root.parent,Path(tempfile.gettempdir()).resolve())
        (self.root/'projects.json').write_text(json.dumps({'suite':'ZOE. G Music Lab'}),encoding='utf-8')
        (self.root/'outputs/releases').mkdir(parents=True)
        self.sentinel = self.root/'outputs/releases/unknown.bin'; self.sentinel.write_bytes(b'preserved synthetic source')
        self.path = write_new(self.root,self.root/'outputs/one-run.json',record())

    def tearDown(self):
        self.assertEqual(self.root.parent,Path(tempfile.gettempdir()).resolve()); self.temp.cleanup()

    def test_no_catalog_git_or_zip_read_and_ordered_source_bytes_are_pinned(self):
        second = write_new(self.root,self.root/'outputs/two-run.json',record(124))
        paths = [second,self.path]; before = [path.read_bytes() for path in paths]
        with patch('musiclab.maintenance_fs.package_facts') as catalog, patch('musiclab.maintenance_fs._git') as git, \
             patch('musiclab.maintenance_fs._zip_ledger') as zipped, \
             patch('musiclab.maintenance_fs.observe_process',side_effect=lambda pid:{'pid':pid,'state':'absent'}) as process:
            result = audit_runs(self.root,paths)
            self.assertEqual([row['pid'] for row in result['runs']],[124,123])
            self.assertEqual(result['record_sha256'],[hashlib.sha256(raw).hexdigest() for raw in before])
            self.assertEqual(process.call_count,2); catalog.assert_not_called(); git.assert_not_called(); zipped.assert_not_called()
        self.assertEqual([path.read_bytes() for path in paths],before)
        self.assertEqual(self.sentinel.read_bytes(),b'preserved synthetic source')

    def test_all_records_validate_before_any_process_query(self):
        bad = write_new(self.root,self.root/'outputs/bad-run.json',dict(record(124),schema_version=2))
        with patch('musiclab.maintenance_fs.observe_process') as process:
            with self.assertRaises(ValueError): audit_runs(self.root,[self.path,bad])
            process.assert_not_called()

    def test_path_count_duplicate_and_byte_limits_refuse_before_process_queries(self):
        oversized = self.root/'outputs/large-run.json'; oversized.write_bytes(b' '*4097)
        repeated = self.root/'outputs/duplicate-key-run.json'; repeated.write_bytes(b'{"schema_version":1,"schema_version":1}')
        for paths in ([], [self.path]*33, [self.path,self.path.parent/'.'/self.path.name],
                      [self.root/'projects.json'], [self.root/'../outside.json'], [oversized], [repeated]):
            with self.subTest(paths=paths), patch('musiclab.maintenance_fs.observe_process') as process:
                with self.assertRaises(ValueError): audit_runs(self.root,paths)
                process.assert_not_called()
        with patch('musiclab.maintenance_fs.workspace') as reader:
            with self.assertRaises(ValueError): audit_runs(self.root,iter([self.path]))
            reader.assert_not_called()

    def test_source_changes_during_query_do_not_mix_identity_and_digest(self):
        original = self.path.read_bytes()
        def observe(pid):
            self.path.write_text(json.dumps(record(999)),encoding='utf-8')
            return {'pid':pid,'state':'absent'}
        with patch('musiclab.maintenance_fs.observe_process',side_effect=observe) as process:
            result = audit_runs(self.root,[self.path])
        process.assert_called_once_with(123)
        self.assertEqual(result['runs'][0]['pid'],123)
        self.assertEqual(result['record_sha256'],[hashlib.sha256(original).hexdigest()])
        self.assertNotEqual(hashlib.sha256(self.path.read_bytes()).hexdigest(),result['record_sha256'][0])

    @unittest.skipUnless(sys.platform=='win32','Windows original creation identity')
    def test_real_child_reports_running_then_terminal_by_original_handle(self):
        code="import json,sys;from musiclab.run_identity import record_current_run;print(json.dumps(record_current_run('run-audit-child')),flush=True);sys.stdin.readline()"
        child=subprocess.Popen([sys.executable,'-X','utf8','-c',code],cwd=ROOT,stdin=subprocess.PIPE,stdout=subprocess.PIPE,stderr=subprocess.PIPE,text=True,encoding='utf-8')
        try:
            original=json.loads(child.stdout.readline()); self.assertEqual(original['identity']['pid'],child.pid)
            self.path.write_text(json.dumps(original),encoding='utf-8')
            running=audit_runs(self.root,[self.path])
            self.assertEqual(running['runs'][0]['status'],'running'); self.assertEqual(running['running_or_unverified'],1)
        finally:
            try: output,error=child.communicate('\n',timeout=10)
            except subprocess.TimeoutExpired:
                child.kill(); child.communicate(timeout=5); raise
        self.assertEqual(child.returncode,0,error); self.assertEqual(error,'')
        stopped=audit_runs(self.root,[self.path])
        self.assertTrue(stopped['runs'][0]['original_run_terminal']); self.assertEqual(stopped['running_or_unverified'],0)
        self.assertEqual(stopped['record_sha256'],running['record_sha256'])

    def test_two_cli_batches_scan_catalog_once_and_preserve_every_selected_record(self):
        paths=[self.path]+[write_new(self.root,self.root/'outputs'/('run-'+str(i)+'.json'),record(200+i)) for i in range(36)]
        directory=self.root/'outputs/releases/placeholder'; directory.mkdir()
        before=[path.read_bytes() for path in paths]
        fact={'directory':'outputs/releases/placeholder','version':'0.1.0','newest_mtime':2000000000,
              'verified':False,'reasons':['synthetic_preserved'],'identity':{},'manifest':{}}
        results=[]
        with patch('musiclab.maintenance_fs.package_facts',return_value=fact) as catalog, \
             patch('musiclab.maintenance_fs.observe_process',side_effect=lambda pid:{'pid':pid,'state':'absent'}) as process:
            for only,chunk in [(False,paths[:32]),(True,paths[32:])]:
                args=['--workspace',str(self.root)]+(['--runs-only'] if only else [])
                for path in chunk: args+=['--run-record',str(path)]
                with redirect_stdout(io.StringIO()) as stream: self.assertEqual(main(args),0)
                results.append(json.loads(stream.getvalue()))
            self.assertEqual(catalog.call_count,2)  # Both entries, one complete pass.
            self.assertEqual(process.call_count,37)
        self.assertEqual(sum(len(result['runs']) for result in results),37)
        self.assertEqual(results[1]['format'],'zoe-run-audit'); self.assertNotIn('prune_token',results[1])
        self.assertEqual([path.read_bytes() for path in paths],before)

    def test_cli_exclusive_receipt_and_existing_source_are_preserved(self):
        args=['--workspace',str(self.root),'--runs-only','--run-record',str(self.path),'--out','outputs/report.json']
        with patch('musiclab.maintenance_fs.observe_process',return_value={'pid':123,'state':'absent'}):
            with redirect_stdout(io.StringIO()) as stream: self.assertEqual(main(args),0)
        saved=self.root/'outputs/report.json'; raw=saved.read_bytes(); self.assertEqual(json.loads(raw),json.loads(stream.getvalue()))
        with patch('scripts.iteration_audit.audit_runs') as process, redirect_stdout(io.StringIO()), \
             patch('sys.stderr',io.StringIO()):
            self.assertEqual(main(args),1); process.assert_not_called()
        self.assertEqual(saved.read_bytes(),raw)


if __name__=='__main__': unittest.main()
