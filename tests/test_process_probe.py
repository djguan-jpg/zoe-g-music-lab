# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
import copy
import json
import os
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

from musiclab.maintenance import CIM_SOURCE, classify_run
from musiclab.process_probe import checked_reply, checked_pid
from musiclab.process_probe_windows import observe_cim, query_command, QUERY_TIMEOUT_SECONDS
from musiclab.run_identity import observe_process, record_current_run
from musiclab.maintenance_fs import audit, prune, write_new

ROOT = Path(__file__).resolve().parents[1]


def identity(pid=123, ticks='134355642003572860', image='python.exe'):
    return {'pid':pid,'platform':'windows','creation_ticks':ticks,'image':image}


def record(**changes):
    return {'format':'zoe-iteration-run','schema_version':1,'job':'synthetic-probe','identity':identity(**changes)}


def reply(item='default', pid=123, **changes):
    value={'format':'zoe-windows-process-probe','schema_version':1,'pid':pid,'record':identity(pid) if item=='default' else item}
    value.update(changes)
    return json.dumps(value,ensure_ascii=False).encode('utf-8')


class ProcessProbeTests(unittest.TestCase):
    def test_successful_empty_reply_is_required_before_absent(self):
        observation=checked_reply(123,reply(None));self.assertEqual(observation,{'pid':123,'state':'absent','source':CIM_SOURCE})
        self.assertEqual(classify_run(record(),observation)['status'],'stopped')
        for raw in [b'',b'null',b'{}',b'[]',b'false',b'NaN',b'\xff']:
            with self.subTest(raw=raw),self.assertRaises(ValueError):checked_reply(123,raw)

    def test_cim_microsecond_range_never_becomes_false_pid_reuse_or_ownership(self):
        observation=checked_reply(123,reply());start=int(observation['identity']['creation_ticks'])
        for delta in range(-9,10):
            with self.subTest(delta=delta):
                result=classify_run(record(ticks=str(start+delta)),observation)
                self.assertEqual(result['status'],'unverified');self.assertFalse(result['original_run_terminal'])
                self.assertEqual(result['evidence']['creation_margin_ticks'],9)
        for delta in (-10,10):
            self.assertEqual(classify_run(record(ticks=str(start+delta)),observation)['status'],'pid_reused')
        self.assertEqual(classify_run(record(image='PYTHON.EXE'),observation)['status'],'unverified')
        result=classify_run(record(image='SearchFilterHost.exe'),observation)
        self.assertEqual(result['status'],'pid_reused');self.assertTrue(result['original_run_terminal']);self.assertEqual(result['action'],'preserved')

    def test_unknown_shape_version_duplicate_keys_limits_and_wrong_pid_refuse(self):
        bad=[reply(schema_version=True),reply(schema_version=2),reply(extra=True),reply(format='unknown'),reply(pid=124),reply(record=identity(124)),reply(record=identity(ticks='134355642003572861')),reply(record=identity(image='C:/private/python.exe')),reply(record=[]),reply(record={}),reply(record=True)]
        for raw in bad+[reply()+b' '*2048,reply().replace(b'"pid": 123',b'"pid":123,"pid":123',1)]:
            with self.subTest(raw=raw[:90]),self.assertRaises(ValueError):checked_reply(123,raw)
        for pid in [True,False,0,-1,1.0,'123',None,2147483648,"123;Get-Content .env"]:
            with self.subTest(pid=pid),self.assertRaises(ValueError):query_command(pid)

    def test_unknown_limited_observation_and_forged_exact_cim_refuse(self):
        good=checked_reply(123,reply())
        for change in [{'source':'unknown'},{'creation_margin_ticks':10},{'creation_margin_ticks':True},{'extra':True},{'identity':identity(124)},{'identity':identity(ticks='134355642003572861')},{'state':'running'}]:
            value={**copy.deepcopy(good),**change}
            with self.subTest(change=change),self.assertRaises(ValueError):classify_run(record(),value)
        self.assertEqual(good,checked_reply(123,reply()))

    def test_fixed_command_is_local_three_properties_hidden_and_deadline(self):
        with patch('musiclab.process_probe_windows.sys.platform','win32'),patch('musiclab.process_probe_windows.subprocess.run',return_value=subprocess.CompletedProcess([],0,reply(None),b'')) as run:
            self.assertEqual(observe_cim(123)['state'],'absent')
        args=run.call_args.args[0];opts=run.call_args.kwargs
        self.assertEqual(args[:4],['powershell.exe','-NoProfile','-NonInteractive','-Command'])
        self.assertIn("-Filter 'ProcessId=123'",args[4]);self.assertIn('-Property ProcessId,Name,CreationDate',args[4])
        self.assertIn('-OperationTimeoutSec 3',args[4])
        for forbidden in ['-ComputerName','-CimSession','CommandLine','ExecutablePath','Environment','Terminate','Stop-Process','Invoke-CimMethod','Start-Process']:
            self.assertNotIn(forbidden,args[4])
        self.assertEqual(opts['timeout'],QUERY_TIMEOUT_SECONDS);self.assertTrue(opts['capture_output'])
        self.assertEqual(opts['creationflags'],subprocess.CREATE_NO_WINDOW)

    def test_timeout_missing_helper_error_warning_malformed_never_means_absent(self):
        failures=[subprocess.CompletedProcess([],1,b'',b'sensitive error must never escape'),subprocess.CompletedProcess([],0,b'',b''),subprocess.CompletedProcess([],0,reply(None),b'warning'),subprocess.CompletedProcess([],0,b'x'*2049,b''),subprocess.CompletedProcess([],0,reply(record=[]),b'')]
        with patch('musiclab.process_probe_windows.sys.platform','win32'):
            for item in failures:
                with patch('musiclab.process_probe_windows.subprocess.run',return_value=item):
                    value=observe_cim(123);self.assertEqual(value['state'],'unavailable');self.assertNotIn('sensitive',json.dumps(value))
                    self.assertEqual(classify_run(record(),value)['status'],'unverified')
            for error in [OSError('private path'),subprocess.TimeoutExpired('powershell',5)]:
                with patch('musiclab.process_probe_windows.subprocess.run',side_effect=error):
                    self.assertEqual(observe_cim(123)['state'],'unavailable')
        with patch('musiclab.process_probe_windows.sys.platform','linux'),patch('musiclab.process_probe_windows.subprocess.run') as run:
            self.assertEqual(observe_cim(123)['state'],'unavailable');run.assert_not_called()

    def test_native_proof_stays_fast_and_only_unavailable_probes(self):
        for native in [{'pid':123,'state':'running','identity':identity()},{'pid':123,'state':'absent','reason':'process_exited'}]:
            with patch('musiclab.run_identity.sys.platform','win32'),patch('musiclab.run_identity._observe_native',return_value=native),patch('musiclab.run_identity.observe_cim') as fallback:
                self.assertEqual(observe_process(123),native);fallback.assert_not_called()
        with patch('musiclab.run_identity.sys.platform','win32'),patch('musiclab.run_identity._observe_native',return_value={'pid':123,'state':'unavailable'}),patch('musiclab.run_identity.observe_cim',return_value=checked_reply(123,reply(None))) as fallback:
            self.assertEqual(observe_process(123)['state'],'absent');fallback.assert_called_once_with(123)
        with patch('musiclab.run_identity.sys.platform','linux'),patch('musiclab.run_identity.observe_cim') as fallback:
            self.assertEqual(observe_process(123)['state'],'unavailable');fallback.assert_not_called()
        with patch('musiclab.run_identity.observe_process',return_value=checked_reply(123,reply())):
            with self.assertRaisesRegex(ValueError,'verified Windows'):record_current_run('probe-cannot-forge-record')

    def test_real_audit_and_prune_keep_uncertain_identity_without_mutation(self):
        with tempfile.TemporaryDirectory(prefix='zoe-probe-test-') as temp:
            root=Path(temp).resolve();self.assertEqual(root.parent,Path(tempfile.gettempdir()).resolve())
            (root/'projects.json').write_text(json.dumps({'suite':'ZOE. G Music Lab','version':'0.45.0','license':'PolyForm-Noncommercial-1.0.0'}),encoding='utf-8')
            run_path=root/'outputs/run.json';write_new(root,run_path,record())
            before={p.relative_to(root).as_posix():p.read_bytes() for p in root.rglob('*') if p.is_file()}
            with patch('musiclab.maintenance_fs.observe_process',return_value=checked_reply(123,reply())):
                report=audit(root,[run_path]);self.assertEqual(report['running_or_unverified'],1)
                with self.assertRaisesRegex(ValueError,'active or unverified'):prune(root,report['prune_token'],[run_path])
            with patch('musiclab.maintenance_fs.observe_process',return_value=checked_reply(123,reply(None))):
                report=audit(root,[run_path]);self.assertEqual(report['running_or_unverified'],0)
                self.assertEqual(prune(root,report['prune_token'],[run_path])['removed'],[])
            after={p.relative_to(root).as_posix():p.read_bytes() for p in root.rglob('*') if p.is_file()};self.assertEqual(before,after)

    @unittest.skipUnless(sys.platform=='win32','Local Windows CIM probe')
    def test_real_cim_parent_never_declares_live_original_terminal(self):
        own=record_current_run('real-cim-parent');probe=observe_cim(os.getpid())
        self.assertEqual(probe['state'],'limited',probe)
        decision=classify_run(own,probe);self.assertEqual(decision['status'],'unverified');self.assertFalse(decision['original_run_terminal'])
        with patch('musiclab.run_identity._observe_native',return_value={'pid':os.getpid(),'state':'unavailable'}):
            self.assertEqual(classify_run(own,observe_process(os.getpid()))['status'],'unverified')

    @unittest.skipUnless(sys.platform=='win32','Local Windows managed child')
    def test_real_managed_child_cim_live_then_original_eof_and_empty_query(self):
        code="import sys,json;from musiclab.run_identity import record_current_run;print(json.dumps(record_current_run('cim-child')),flush=True);sys.stdin.readline()"
        child=subprocess.Popen([sys.executable,'-X','utf8','-c',code],cwd=ROOT,stdin=subprocess.PIPE,stdout=subprocess.PIPE,stderr=subprocess.PIPE,text=True,encoding='utf-8')
        try:
            owned=json.loads(child.stdout.readline());self.assertEqual(owned['identity']['pid'],child.pid)
            self.assertEqual(classify_run(owned,observe_cim(child.pid))['status'],'unverified')
        finally:
            _,error=child.communicate('\n',timeout=10)
        self.assertEqual(child.returncode,0,error)
        with patch('musiclab.run_identity._observe_native',return_value={'pid':child.pid,'state':'unavailable'}):
            observed=observe_process(child.pid)
        self.assertIn(classify_run(owned,observed)['status'],('stopped','pid_reused'))

    @unittest.skipUnless(sys.platform=='win32','Local Windows CLI and CIM probe')
    def test_real_cli_fallback_from_other_cwd_blocks_live_then_accepts_original_exit(self):
        code="import sys,json;from musiclab.run_identity import record_current_run;print(json.dumps(record_current_run('cim-cli-child')),flush=True);sys.stdin.readline()"
        child=subprocess.Popen([sys.executable,'-X','utf8','-c',code],cwd=ROOT,stdin=subprocess.PIPE,stdout=subprocess.PIPE,stderr=subprocess.PIPE,text=True,encoding='utf-8')
        bootstrap="import sys,runpy;sys.path.insert(0,sys.argv.pop(1));import musiclab.run_identity as r;r._observe_native=lambda pid:{'pid':pid,'state':'unavailable'};runpy.run_path(sys.argv.pop(1),run_name='__main__')"
        try:
            owned=json.loads(child.stdout.readline())
            with tempfile.TemporaryDirectory(prefix='zoe-cim-cli-') as temp:
                root=Path(temp).resolve();self.assertEqual(root.parent,Path(tempfile.gettempdir()).resolve())
                (root/'projects.json').write_text(json.dumps({'suite':'ZOE. G Music Lab','version':'0.45.0','license':'PolyForm-Noncommercial-1.0.0'}),encoding='utf-8')
                selected=root/'outputs/child-run.json';write_new(root,selected,owned)
                original=selected.read_bytes()
                args=[sys.executable,'-X','utf8','-c',bootstrap,str(ROOT),str(ROOT/'scripts/iteration_audit.py'),'--workspace',str(root),'--run-record','outputs/child-run.json']
                live=subprocess.run(args,cwd=root,capture_output=True,text=True,encoding='utf-8',timeout=15)
                self.assertEqual(live.returncode,0,live.stderr);report=json.loads(live.stdout)
                self.assertEqual(report['running_or_unverified'],1);self.assertEqual(report['runs'][0]['status'],'unverified')
                refused=subprocess.run(args+['--prune','--expected-token',report['prune_token']],cwd=root,capture_output=True,text=True,encoding='utf-8',timeout=15)
                self.assertNotEqual(refused.returncode,0);self.assertIn('active or unverified',refused.stderr)
                _,error=child.communicate('\n',timeout=10);self.assertEqual(child.returncode,0,error)
                ended=subprocess.run(args,cwd=root,capture_output=True,text=True,encoding='utf-8',timeout=15)
                self.assertEqual(ended.returncode,0,ended.stderr);report=json.loads(ended.stdout)
                self.assertEqual(report['running_or_unverified'],0);self.assertTrue(report['runs'][0]['original_run_terminal'])
                self.assertEqual(selected.read_bytes(),original)
                self.assertFalse((root/'outputs/maintenance').exists())
        finally:
            if child.poll() is None:child.communicate('\n',timeout=10)


if __name__=='__main__':unittest.main()
