# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
"""Explicit selection must preserve complete eligibility and exact recovery."""
import copy
import hashlib
import io
import json
import os
import subprocess
import sys
import tempfile
import unittest
from contextlib import redirect_stderr, redirect_stdout
from pathlib import Path
from unittest.mock import patch

from musiclab.maintenance import prune_batch_directories, prune_batch_plan, prune_token
from musiclab.maintenance_fs import audit, audit_batch, prune, restore, write_new
from scripts.iteration_audit import main
from test_maintenance import PackageFixture, run_record

ROOT = Path(__file__).resolve().parents[1]


def candidate(index):
    version=f'0.{index}.0';commit=f'{index:040x}'
    return {'directory':f'outputs/releases/v{version}-{commit[:12]}','version':version,'commit':commit,
            'archive':f'zoe-g-music-lab-v{version}.zip','archive_sha256':'a'*64,'manifest_sha256':'b'*64,
            'archive_mtime_ns':123456,'manifest_mtime_ns':123457,'archive_bytes':200}


class PruneBatchPolicyTests(unittest.TestCase):
    def test_two_of_129_candidates_are_explicitly_selected_and_input_is_isolated(self):
        rows=[candidate(i) for i in range(1,130)];original=copy.deepcopy(rows)
        directories=[rows[100]['directory'],rows[1]['directory']];plan=prune_batch_plan(rows,directories)
        self.assertEqual(len(plan['selected']),2);self.assertEqual(plan['eligible_prune_token'],prune_token(rows))
        self.assertEqual([p['directory'] for p in plan['selected']],sorted(directories));self.assertEqual(rows,original)
        plan['selected'][0]['archive_sha256']='c'*64;self.assertEqual(rows,original)

    def test_128_explicit_selection_boundary_and_129_rejection(self):
        rows=[candidate(i) for i in range(1,130)]
        self.assertEqual(len(prune_batch_plan(rows,[p['directory'] for p in rows[:128]])['selected']),128)
        with self.assertRaisesRegex(ValueError,'1–128'):prune_batch_plan(rows,[p['directory'] for p in rows])

    def test_unknown_directory_types_duplicates_and_path_variants_refuse(self):
        directory=candidate(1)['directory']
        for value in [None,[],directory,{directory},iter([directory]),[directory,directory],[Path(directory)],['../'+directory],[directory.replace('/','\\')],['C:/'+directory],[directory.upper()],[directory+'/'],[directory+'\x00']]:
            with self.subTest(value=repr(value)),self.assertRaises(ValueError):prune_batch_directories(value)

    def test_selection_and_complete_catalog_both_affect_the_domain_separated_token(self):
        rows=[candidate(1),candidate(2),candidate(3)];dirs=[rows[0]['directory']]
        plan=prune_batch_plan(rows,dirs);self.assertNotEqual(plan['prune_token'],prune_token(rows))
        self.assertNotEqual(plan['prune_token'],prune_token(plan['selected']))
        changed=copy.deepcopy(rows);changed[2]['archive_mtime_ns']+=1
        self.assertNotEqual(plan['prune_token'],prune_batch_plan(changed,dirs)['prune_token'])
        self.assertNotEqual(plan['prune_token'],prune_batch_plan(rows,[rows[1]['directory']])['prune_token'])

    def test_order_changes_do_not_change_the_reviewed_set_token(self):
        rows=[candidate(1),candidate(2),candidate(3)];dirs=[p['directory'] for p in rows[:2]]
        self.assertEqual(prune_batch_plan(rows,dirs),prune_batch_plan(rows[::-1],dirs[::-1]))

    def test_every_candidate_identity_is_checked_before_subset_selection(self):
        rows=[candidate(1),candidate(2)];dirs=[rows[0]['directory']]
        for altered in [dict(rows[1],archive_bytes=True),dict(rows[1],extra=True),dict(rows[1],commit='bad')]:
            with self.assertRaises(ValueError):prune_batch_plan([rows[0],altered],dirs)
        with self.assertRaisesRegex(ValueError,'duplicate'):prune_batch_plan([rows[0],rows[0]],dirs)
        with self.assertRaisesRegex(ValueError,'eligible'):prune_batch_plan(rows,[candidate(3)['directory']])

    def test_catalog_budget_is_not_a_partial_selection_budget(self):
        rows=[candidate(i) for i in range(1,1026)]
        self.assertEqual(len(prune_batch_plan(rows[:1024],[rows[0]['directory']])['selected']),1)
        with self.assertRaisesRegex(ValueError,'catalog'):prune_batch_plan(rows,[rows[0]['directory']])
        with self.assertRaises(ValueError):prune_batch_plan(iter(rows),[rows[0]['directory']])


class PruneBatchFilesystemTests(unittest.TestCase):
    def setUp(self):
        self.temp=tempfile.TemporaryDirectory(prefix='zoe-batch-test-');self.root=Path(self.temp.name).resolve()
        self.fixture=PackageFixture(self.root,count=6)
        self.directories=[p.relative_to(self.root).as_posix() for p in self.fixture.packages]

    def tearDown(self):
        self.assertEqual(self.root.parent,Path(tempfile.gettempdir()).resolve());self.temp.cleanup()

    def test_real_cli_two_package_batch_restore_and_remaining_candidate(self):
        before=self.fixture.snapshot();directories=[self.directories[2],self.directories[0]]
        args=[sys.executable,'-X','utf8',str(ROOT/'scripts/iteration_audit.py'),'--workspace',str(self.root)]
        for directory in directories:args+=['--package-directory',directory]
        reply=subprocess.run(args+['--out','outputs/batch-preview.json'],capture_output=True,text=True,encoding='utf-8',timeout=30)
        self.assertEqual(reply.returncode,0,reply.stderr);report=json.loads(reply.stdout)
        self.assertEqual(report['format'],'zoe-iteration-prune-batch');self.assertEqual(report['schema_version'],1)
        self.assertEqual(len(report['audit']['candidates']),3);self.assertEqual(len(report['selected']),2)
        self.assertEqual(report['audit']['protected_versions'],['0.6.0','0.5.0','0.4.0']);self.assertEqual(before,self.fixture.snapshot())
        reply=subprocess.run(args+['--prune','--expected-token',report['prune_token']],capture_output=True,text=True,encoding='utf-8',timeout=30)
        self.assertEqual(reply.returncode,0,reply.stderr);result=json.loads(reply.stdout)
        self.assertEqual(result['removed'],sorted(directories));self.assertEqual(result['mutation'],'pruned')
        remaining=audit(self.root);self.assertEqual([p['directory'] for p in remaining['candidates']],[self.directories[1]])
        journal=json.loads((self.root/result['journal']).read_text(encoding='utf-8'));self.assertEqual(journal['schema_version'],1);self.assertEqual(len(journal['packages']),2)
        reply=subprocess.run([*args[:6],'--restore-journal',result['journal']],capture_output=True,text=True,encoding='utf-8',timeout=30)
        # The restore action uses the original CLI prefix, without any package selectors.
        self.assertEqual(reply.returncode,0,reply.stderr);self.assertEqual(before,self.fixture.snapshot())

    def test_protected_unknown_and_noncanonical_selection_preserve_all_files(self):
        before=self.fixture.snapshot()
        for directory in [self.directories[-1],candidate(123)['directory'],'outputs/releases/../drafts']:
            with self.assertRaises(ValueError):audit_batch(self.root,[directory])
        self.assertEqual(before,self.fixture.snapshot());self.assertFalse((self.root/'outputs/maintenance').exists())

    def test_changed_unselected_identity_invalidates_the_complete_preview(self):
        directories=[self.directories[0]];report=audit_batch(self.root,directories)
        target=self.fixture.packages[1]/'manifest.json';info=target.stat();os.utime(target,ns=(info.st_atime_ns,info.st_mtime_ns-1000000))
        before=self.fixture.snapshot()
        with self.assertRaisesRegex(ValueError,'Preview changed'):prune(self.root,report['prune_token'],package_directories=directories)
        self.assertEqual(before,self.fixture.snapshot());self.assertFalse((self.root/'outputs/maintenance').exists())

    def test_full_or_other_batch_tokens_cannot_authorize_this_selection(self):
        report=audit(self.root);before=self.fixture.snapshot();directories=[self.directories[0]]
        wrong=[report['prune_token'],audit_batch(self.root,[self.directories[1]])['prune_token']]
        for token in wrong:
            with self.assertRaisesRegex(ValueError,'Preview changed'):prune(self.root,token,package_directories=directories)
        self.assertEqual(before,self.fixture.snapshot());self.assertFalse((self.root/'outputs/maintenance').exists())

    def test_recorded_running_or_unverified_job_blocks_selected_pruning(self):
        record=run_record();path=write_new(self.root,self.root/'outputs/run.json',record)
        directories=[self.directories[0]];token=audit_batch(self.root,directories)['prune_token'];before=self.fixture.snapshot()
        for observation in [{'pid':123,'state':'running','identity':record['identity']},{'pid':123,'state':'unavailable'}]:
            with patch('musiclab.maintenance_fs.observe_process',return_value=observation),self.assertRaisesRegex(ValueError,'active or unverified'):
                prune(self.root,token,[path],package_directories=directories)
        self.assertEqual(before,self.fixture.snapshot());self.assertFalse((self.root/'outputs/maintenance').exists())

    def test_selected_batch_still_obeys_the_unchanged_journal_byte_budget(self):
        directories=self.directories[:2];preview=audit_batch(self.root,directories);before=self.fixture.snapshot()
        with patch('musiclab.maintenance_fs.MAX_JOURNAL_BYTES',1),self.assertRaisesRegex(ValueError,'journal capacity'):
            prune(self.root,preview['prune_token'],package_directories=directories)
        self.assertEqual(before,self.fixture.snapshot());self.assertFalse((self.root/'outputs/maintenance').exists())

    def test_latest_versions_changed_before_move_leave_journal_and_original_files(self):
        directories=[self.directories[0]];preview=audit_batch(self.root,directories);before=self.fixture.snapshot()
        changed=copy.deepcopy(preview['audit']);changed['protected_versions']=['999.0.0','0.6.0','0.5.0']
        with patch('musiclab.maintenance_fs.audit',side_effect=[preview['audit'],changed]),self.assertRaisesRegex(ValueError,'Candidate changed'):
            prune(self.root,preview['prune_token'],package_directories=directories)
        self.assertEqual(before,self.fixture.snapshot());journals=list((self.root/'outputs/maintenance').glob('*.json'));self.assertEqual(len(journals),1)
        self.assertEqual(len(json.loads(journals[0].read_text(encoding='utf-8'))['packages']),1)

    def test_invalid_selection_refuses_before_audit_and_default_129_limit_remains(self):
        with patch('musiclab.maintenance_fs.audit') as reader:
            for directories in [[],[self.directories[0]]*129,['../outside']]:
                with self.assertRaises(ValueError):audit_batch(self.root,directories)
                with self.assertRaises(ValueError):prune(self.root,'a'*64,package_directories=directories)
            reader.assert_not_called()
        rows=[candidate(i) for i in range(1,130)];report={'candidates':rows,'prune_token':prune_token(rows),'running_or_unverified':0}
        directories=[rows[0]['directory']];token=prune_batch_plan(rows,directories)['prune_token']
        with patch('musiclab.maintenance_fs.audit',return_value=report),patch('musiclab.maintenance_fs.package_facts',side_effect=ValueError('selected source reached')) as reader:
            with self.assertRaisesRegex(ValueError,'Recovery package capacity'):prune(self.root,report['prune_token'])
            reader.assert_not_called()
            with self.assertRaisesRegex(ValueError,'selected source reached'):prune(self.root,token,package_directories=directories)
            reader.assert_called_once()
        self.assertFalse((self.root/'outputs/maintenance').exists())

    def test_default_preview_shape_and_restore_record_actions_are_not_expanded(self):
        normal=audit(self.root);self.assertEqual(normal['format'],'zoe-iteration-audit');self.assertEqual(normal['schema_version'],1)
        self.assertNotIn('selected',normal);self.assertNotIn('audit',normal)
        before=self.fixture.snapshot()
        for action in [['--record-self','synthetic'],['--restore-journal','outputs/missing.json']]:
            out,err=io.StringIO(),io.StringIO()
            with patch('scripts.iteration_audit.audit_batch') as reader,redirect_stdout(out),redirect_stderr(err):
                result=main(['--workspace',str(self.root),'--package-directory',self.directories[0],*action])
            self.assertEqual(result,1);self.assertIn('only valid',err.getvalue());reader.assert_not_called()
        self.assertEqual(before,self.fixture.snapshot())

    def test_existing_cli_receipt_refuses_before_any_preview_or_prune(self):
        path=write_new(self.root,self.root/'outputs/receipt.json',{'original':True});raw=path.read_bytes()
        out,err=io.StringIO(),io.StringIO()
        with patch('scripts.iteration_audit.audit_batch') as reader,redirect_stdout(out),redirect_stderr(err):
            result=main(['--workspace',str(self.root),'--package-directory',self.directories[0],'--out','outputs/receipt.json'])
        self.assertEqual(result,1);reader.assert_not_called();self.assertEqual(path.read_bytes(),raw)


if __name__=='__main__':unittest.main()
