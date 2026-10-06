# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
import copy
import hashlib
import json
import os
import subprocess
import sys
import tempfile
import time
import unittest
import zipfile
from pathlib import Path
from unittest.mock import patch

from musiclab.maintenance import classify_run, validate_run, retention_plan, prune_token, DAY
from musiclab.maintenance_fs import audit, prune, restore, safe_path, workspace, write_new, package_facts
from musiclab.run_identity import observe_process, record_current_run

ROOT = Path(__file__).resolve().parents[1]


def run_record(pid=123, ticks='123456'):
    return {'format': 'zoe-iteration-run', 'schema_version': 1, 'job': 'synthetic-job',
            'identity': {'pid': pid, 'platform': 'windows', 'creation_ticks': ticks, 'image': 'python.exe'}}


def facts(version, age=8, verified=True):
    return {'directory': 'synthetic-'+version, 'version': version, 'verified': verified,
            'reasons': [] if verified else ['tag_or_source_unverified'], 'newest_mtime': 2000000-age*DAY}


class PackageFixture:
    def __init__(self, root, count=4):
        self.root = root
        self.git(['init', '--quiet']);self.git(['config', 'user.name', 'Synthetic maintenance test'])
        self.git(['config', 'user.email', 'synthetic@example.invalid']);self.git(['config', 'core.autocrlf', 'false'])
        self.packages=[]
        for minor in range(1,count+1):
            version=f'0.{minor}.0'
            (root/'projects.json').write_text(json.dumps({'suite':'ZOE. G Music Lab','version':version,'license':'PolyForm-Noncommercial-1.0.0'})+'\n',encoding='utf-8')
            (root/'README.md').write_text('Original synthetic source '+version+'\n',encoding='utf-8')
            self.git(['add','projects.json','README.md']);self.git(['commit','--quiet','-m','Synthetic source '+version])
            commit=self.git(['rev-parse','HEAD']).strip();self.git(['tag','v'+version,commit])
            directory=root/'outputs/releases'/f'v{version}-{commit[:12]}';directory.mkdir(parents=True)
            archive=directory/f'zoe-g-music-lab-v{version}.zip';self.git(['archive','--format=zip','--prefix=zoe-g-music-lab/','--output='+str(archive),commit])
            raw=archive.read_bytes()
            with zipfile.ZipFile(archive) as z:
                ledger={item.filename.removeprefix('zoe-g-music-lab/'):hashlib.sha256(z.read(item)).hexdigest() for item in z.infolist() if not item.is_dir()}
            manifest={'schema_version':1,'commit':commit,'version':version,'license':'PolyForm-Noncommercial-1.0.0','archive':archive.name,'sha256':hashlib.sha256(raw).hexdigest(),'bytes':len(raw),'files':ledger}
            (directory/'manifest.json').write_text(json.dumps(manifest,indent=2)+'\n',encoding='utf-8')
            for path in (archive,directory/'manifest.json'):os.utime(path,(time.time()-8*DAY,time.time()-8*DAY))
            self.packages.append(directory)

    def git(self,args):
        p=subprocess.run(['git',*args],cwd=self.root,capture_output=True,text=True,encoding='utf-8',timeout=10)
        if p.returncode:raise AssertionError(p.stdout+p.stderr)
        return p.stdout

    def snapshot(self):
        return {str(path.relative_to(self.root)):path.read_bytes() for d in self.packages if d.exists() for path in d.iterdir() if path.is_file()}


class MaintenancePolicyTests(unittest.TestCase):
    def test_creation_time_rejects_same_pid_same_image_reuse(self):
        r=run_record();now={'pid':123,'state':'running','identity':copy.deepcopy(r['identity'])}
        self.assertEqual(classify_run(r,now)['status'],'running')
        now['identity']['creation_ticks']='123457';result=classify_run(r,now)
        self.assertEqual(result['status'],'pid_reused');self.assertTrue(result['original_run_terminal']);self.assertEqual(result['action'],'preserved')
        now['identity']['creation_ticks']='123456';now['identity']['image']='svchost.exe'
        self.assertEqual(classify_run(r,now)['status'],'pid_reused')

    def test_absent_and_unavailable_are_distinct_without_auto_termination(self):
        self.assertEqual(classify_run(run_record(),{'pid':123,'state':'absent'})['status'],'stopped')
        r=classify_run(run_record(),{'pid':123,'state':'unavailable'});self.assertEqual(r['status'],'unverified');self.assertFalse(r['original_run_terminal'])
        with self.assertRaises(ValueError):classify_run(run_record(),{'pid':124,'state':'absent'})

    def test_bare_pid_unknown_versions_and_noninteger_ids_refuse(self):
        for value in [{'pid':123}, dict(run_record(),schema_version=2), dict(run_record(),schema_version=True), dict(run_record(),extra=True)]:
            with self.assertRaises(ValueError):validate_run(value)
        for pid in [0,-1,True,1.0,'123',2147483648,None]:
            r=run_record();r['identity']['pid']=pid
            with self.assertRaises(ValueError):validate_run(r)
            with self.assertRaises(ValueError):observe_process(pid)
        for change in [{'creation_ticks':''},{'creation_ticks':'0'},{'creation_ticks':str(2**64)},{'image':'C:\\private\\python.exe'}]:
            r=run_record();r['identity'].update(change)
            with self.assertRaises(ValueError):validate_run(r)

    def test_latest_three_versions_and_strict_seven_day_age(self):
        packages=[facts('0.1.0'),facts('0.2.0'),facts('0.3.0'),facts('0.4.0')]
        p=retention_plan(packages,2000000);self.assertEqual(p['protected_versions'],['0.4.0','0.3.0','0.2.0']);self.assertEqual([d['version'] for d in p['decisions'] if d['eligible']],['0.1.0'])
        packages[0]=facts('0.1.0',7);self.assertFalse(retention_plan(packages,2000000)['decisions'][0]['eligible'])
        packages[0]=facts('0.1.0',-1);self.assertFalse(retention_plan(packages,2000000)['decisions'][0]['eligible'])

    def test_unverified_fake_high_version_cannot_displace_latest_three(self):
        p=retention_plan([facts('0.1.0'),facts('0.2.0'),facts('0.3.0'),facts('999.0.0',verified=False)],2000000)
        self.assertEqual(p['protected_versions'],['0.3.0','0.2.0','0.1.0']);self.assertFalse(any(d['eligible'] for d in p['decisions']))
        for now in [True,float('nan'),float('inf'),0]:
            with self.assertRaises(ValueError):retention_plan([],now)

    @unittest.skipUnless(sys.platform=='win32','Windows handle count')
    def test_repeated_explicit_observation_closes_every_native_handle(self):
        import ctypes
        from ctypes import wintypes
        kernel=ctypes.WinDLL('kernel32',use_last_error=True)
        kernel.GetCurrentProcess.restype=wintypes.HANDLE
        kernel.GetProcessHandleCount.argtypes=(wintypes.HANDLE,ctypes.POINTER(wintypes.DWORD))
        def count():
            value=wintypes.DWORD();self.assertTrue(kernel.GetProcessHandleCount(kernel.GetCurrentProcess(),ctypes.byref(value)));return value.value
        original=count()
        for _ in range(40):self.assertEqual(observe_process(os.getpid())['state'],'running')
        self.assertLessEqual(count(),original+1)

    @unittest.skipUnless(sys.platform=='win32','Windows creation identity reader')
    def test_real_managed_child_running_then_eof_and_parent_handle_closed(self):
        code="import json,sys;from musiclab.run_identity import record_current_run;print(json.dumps(record_current_run('owned-child')),flush=True);sys.stdin.readline()"
        child=subprocess.Popen([sys.executable,'-X','utf8','-c',code],cwd=ROOT,stdin=subprocess.PIPE,stdout=subprocess.PIPE,stderr=subprocess.PIPE,text=True,encoding='utf-8')
        try:
            record=json.loads(child.stdout.readline());self.assertEqual(record['identity']['pid'],child.pid)
            self.assertEqual(classify_run(record,observe_process(child.pid))['status'],'running')
        finally:
            output,error=child.communicate('\n',timeout=10)
        self.assertEqual(child.returncode,0,error);self.assertEqual(error,'')
        self.assertIn(classify_run(record,observe_process(child.pid))['status'],('stopped','pid_reused'))
        own=record_current_run('owned-parent');self.assertEqual(classify_run(own,observe_process(os.getpid()))['status'],'running')


class MaintenanceFilesystemTests(unittest.TestCase):
    def setUp(self):
        self.temp=tempfile.TemporaryDirectory(prefix='zoe-maintenance-test-');self.root=Path(self.temp.name).resolve();self.fixture=PackageFixture(self.root)

    def tearDown(self):
        self.assertEqual(self.root.parent,Path(tempfile.gettempdir()).resolve());self.temp.cleanup()

    def test_real_git_preview_prune_journal_restore_exact_and_no_overwrite(self):
        before=self.fixture.snapshot();report=audit(self.root)
        self.assertEqual(len(report['candidates']),1);self.assertEqual(report['mutation'],'none');self.assertEqual(before,self.fixture.snapshot())
        result=prune(self.root,report['prune_token']);self.assertEqual(result['removed'],[str(self.fixture.packages[0].relative_to(self.root)).replace('\\','/')]);self.assertFalse(self.fixture.packages[0].exists())
        self.assertEqual(audit(self.root)['protected_versions'],['0.4.0','0.3.0','0.2.0'])
        saved=restore(self.root,self.root/result['journal']);self.assertEqual(len(saved['restored']),1);self.assertEqual(before,self.fixture.snapshot())
        with self.assertRaisesRegex(ValueError,'existing'):restore(self.root,self.root/result['journal'])
        self.assertEqual(before,self.fixture.snapshot())

    def test_changed_token_bytes_age_or_tag_refuse_without_deletion(self):
        preview=audit(self.root);original=self.fixture.snapshot()
        with self.assertRaises(ValueError):prune(self.root,'0'*64)
        self.assertEqual(original,self.fixture.snapshot())
        first=self.fixture.packages[0];path=first/'manifest.json';os.utime(path,None)
        with self.assertRaises(ValueError):prune(self.root,preview['prune_token'])
        self.assertTrue(first.exists())
        self.fixture.git(['tag','-d','v0.1.0']);self.assertFalse(audit(self.root)['candidates']);self.assertTrue(first.exists())

    def test_corrupt_archive_or_extra_user_files_never_become_candidates(self):
        first=self.fixture.packages[0];unknown=first/'user-draft.json';unknown.write_text('preserve original',encoding='utf-8')
        self.assertFalse(audit(self.root)['candidates']);self.assertEqual(unknown.read_text(),'preserve original')
        unknown.unlink();archive=next(first.glob('*.zip'));archive.write_bytes(archive.read_bytes()+b'corruption')
        report=audit(self.root);self.assertFalse(report['candidates']);self.assertTrue(archive.exists());self.assertIn('archive_digest_or_size_mismatch',report['packages'][0]['reasons'])

    def test_source_reproduction_failure_prevents_pruning(self):
        before=self.fixture.snapshot()
        with patch('musiclab.maintenance_fs._rebuild',side_effect=ValueError('cannot reproduce')):
            report=audit(self.root);self.assertFalse(report['candidates'])
        self.assertEqual(before,self.fixture.snapshot())

    def test_oversized_recovery_journal_refuses_before_any_move(self):
        before=self.fixture.snapshot();token=audit(self.root)['prune_token']
        with patch('musiclab.maintenance_fs.MAX_JOURNAL_BYTES',1):
            with self.assertRaisesRegex(ValueError,'journal capacity'):prune(self.root,token)
        self.assertEqual(before,self.fixture.snapshot());self.assertFalse((self.root/'outputs/maintenance').exists())

    def test_zip_central_budget_refuses_before_entry_object_allocation(self):
        import struct
        first=self.fixture.packages[0];archive=next(first.glob('*.zip'));raw=bytearray(archive.read_bytes());index=raw.rfind(b'PK\x05\x06')
        struct.pack_into('<HH',raw,index+8,65535,65535);archive.write_bytes(raw)
        manifest=first/'manifest.json';data=json.loads(manifest.read_text());data['sha256']=hashlib.sha256(raw).hexdigest();manifest.write_text(json.dumps(data),encoding='utf-8')
        with patch('musiclab.maintenance_fs.zipfile.ZipFile') as loader:
            result=package_facts(self.root,first,time.time());loader.assert_not_called()
        self.assertFalse(result['verified']);self.assertIn('archive_ledger_or_crc_unverified',result['reasons'])

    def test_drafts_backups_media_other_outputs_and_partial_packages_preserved(self):
        files=[self.root/'outputs/drafts/user.json',self.root/'outputs/backups/original.zip',self.root/'outputs/media/original.wav']
        for file in files:file.parent.mkdir(parents=True,exist_ok=True);file.write_bytes(b'original synthetic bytes');os.utime(file,(1,1))
        partial=self.root/'outputs/releases/unfinished';partial.mkdir();(partial/'FAILED.txt').write_text('diagnostic')
        report=audit(self.root);self.assertEqual(len(report['excluded']),1);result=prune(self.root,report['prune_token'])
        self.assertEqual(len(result['removed']),1)
        for file in files:self.assertEqual(file.read_bytes(),b'original synthetic bytes')
        self.assertTrue((partial/'FAILED.txt').is_file())

    def test_recorded_active_or_unavailable_process_blocks_pruning(self):
        record=run_record();path=write_new(self.root,self.root/'outputs/run.json',record);token=audit(self.root)['prune_token'];before=self.fixture.snapshot()
        for observation in [{'pid':123,'state':'running','identity':record['identity']},{'pid':123,'state':'unavailable'}]:
            with patch('musiclab.maintenance_fs.observe_process',return_value=observation):
                with self.assertRaises(ValueError):prune(self.root,token,[path])
        self.assertEqual(before,self.fixture.snapshot())

    def test_path_escape_normalization_output_refusal_and_unknown_record(self):
        with self.assertRaises(ValueError):safe_path(self.root,self.root/'../outside')
        with self.assertRaises(ValueError):workspace(self.root.parent)
        with self.assertRaises(ValueError):write_new(self.root,self.root/'outputs/../outside.json',{})
        self.assertFalse((self.root/'outside.json').exists())
        path=write_new(self.root,self.root/'outputs/old-run.json',{'pid':123})
        with self.assertRaises(ValueError):audit(self.root,[path])
        with self.assertRaises(FileExistsError):write_new(self.root,path,{})

    def test_reparse_guard_and_changed_receipt_destination_refuse(self):
        selected=self.root/'outputs/releases'
        from musiclab.maintenance_fs import _unsafe
        with patch('musiclab.maintenance_fs._unsafe',side_effect=lambda path:path==selected or _unsafe(path)):
            with self.assertRaises(ValueError):audit(self.root)
            with self.assertRaises(ValueError):safe_path(self.root,selected/'untrusted/manifest.json')
        target=self.root/'outputs/new-receipt.json';target.parent.mkdir(exist_ok=True)
        self.assertEqual(safe_path(self.root,target),target)
        target.write_text('existing original',encoding='utf-8')
        with self.assertRaises(FileExistsError):write_new(self.root,target,{})
        self.assertEqual(target.read_text(),'existing original')

    def test_tampered_recovery_identity_or_unknown_version_refuse_all_publishing(self):
        result=prune(self.root,audit(self.root)['prune_token']);path=self.root/result['journal'];original=json.loads(path.read_text(encoding='utf-8'))
        for edit in [lambda r:r.update(schema_version=2),lambda r:r['packages'][0]['identity'].update(archive_mtime_ns=True),lambda r:r['packages'][0]['identity'].update(directory='outputs/../media'),lambda r:r['packages'][0].update(manifest_utf8='{}')]:
            data=copy.deepcopy(original);edit(data);path.write_text(json.dumps(data),encoding='utf-8')
            with self.assertRaises(ValueError):restore(self.root,path)
            self.assertFalse(self.fixture.packages[0].exists())

    def test_real_cli_another_cwd_preview_prune_and_restore_and_invalid_flags(self):
        args=[sys.executable,'-X','utf8',str(ROOT/'scripts/iteration_audit.py'),'--workspace',str(self.root)]
        def call(extra,code=0):
            p=subprocess.run([*args,*extra],cwd=self.root.parent,capture_output=True,text=True,encoding='utf-8',timeout=20);self.assertEqual(p.returncode,code,p.stdout+p.stderr);return p
        preview=json.loads(call(['--out','outputs/preview.json']).stdout);self.assertEqual(len(preview['candidates']),1)
        call(['--out','outputs/preview.json'],1);call(['--prune'],1);call(['--expected-token',preview['prune_token']],1)
        result=json.loads(call(['--prune','--expected-token',preview['prune_token'],'--out','outputs/pruned.json']).stdout)
        restored=json.loads(call(['--restore-journal',result['journal'],'--out','outputs/restored.json']).stdout);self.assertEqual(len(restored['restored']),1)
        call(['--restore-journal',result['journal']],1)


if __name__=='__main__':
    unittest.main()
