# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
import importlib.util
import json
from pathlib import Path
import subprocess
import sys
import tempfile
import threading
import time
import unittest
from unittest.mock import patch

from musiclab.release_capture import CaptureBuffer,tree_args,STDOUT_BYTES,STDERR_BYTES,READ_BYTES
from musiclab.release_git_fs import _capture,read_tree
from musiclab.maintenance_fs import _source_metadata

ROOT=Path(__file__).resolve().parents[1]
spec=importlib.util.spec_from_file_location('tree_capture_packager_tests',ROOT/'scripts/package_release.py')
packager=importlib.util.module_from_spec(spec);spec.loader.exec_module(packager)


def git(root,*args,input=None):
    result=subprocess.run(['git',*args],cwd=root,input=input,capture_output=True,timeout=30)
    if result.returncode:raise AssertionError(result.stderr[-1000:])
    return result.stdout


def fixture(root,large=False):
    git(root,'init','--quiet')
    for key,value in [('user.name','Synthetic tree test'),('user.email','synthetic@example.invalid'),
                      ('core.autocrlf','false'),('core.attributesFile',''),('commit.gpgsign','false')]:git(root,'config',key,value)
    files={'projects.json':json.dumps({'suite':'ZOE. G Music Lab','version':'0.157.0','release_version':'v0.157.0','delivery_versions_schema_version':1,'license':'PolyForm-Noncommercial-1.0.0'})+'\n',
           'musiclab/assets/delivery-versions.json':json.dumps({'format':'zoe-delivery-versions','schema_version':1,'current':'0.157.0','supported':['0.38.0','0.157.0']})+'\n',
           'scripts/check_python_tests.py':'raise SystemExit(97)\n',
           **{name:'Synthetic tree fixture\n' for name in ['LICENSE','NOTICE','README.md','music_lab_agent.py','music_lab_server.py']}}
    for name,text in files.items():
        path=root/name;path.parent.mkdir(parents=True,exist_ok=True);path.write_text(text,encoding='utf-8',newline='\n')
    git(root,'add','--','.');git(root,'commit','--quiet','-m','Synthetic base')
    base=git(root,'rev-parse','HEAD').decode().strip()
    if not large:return base
    blob=git(root,'hash-object','-w','--stdin',input=b'Synthetic leaf\n').strip()
    raw=b''.join(b'100644 blob '+blob+b'\tf'+str(i).zfill(4).encode()+b'-source.txt\0' for i in range(1900))
    tree=git(root,'mktree','-z',input=raw).strip()
    for level in range(6):tree=git(root,'mktree','-z',input=b'040000 tree '+tree+b'\t'+b'p'+b'x'*180+str(level).encode()+b'\0').strip()
    combined=git(root,'mktree','-z',input=git(root,'ls-tree','-z',base)+b'040000 tree '+tree+b'\tlong-source\0').strip()
    return git(root,'commit-tree',combined.decode(),'-p',base,input=b'Synthetic over-budget immutable tree\n').decode().strip()


class TrackedPipe:
    def __init__(self,pipe,fail=False):self.pipe=pipe;self.bytes=0;self.fail=fail
    def read(self,size=-1):
        if self.fail:raise OSError('Synthetic pipe failure')
        value=self.pipe.read(size);self.bytes+=len(value);return value
    def close(self):return self.pipe.close()


class ReleaseCaptureTests(unittest.TestCase):
    def owned(self,action,fail_pipe=False):
        processes=[];workers=[];original_popen=subprocess.Popen;original_thread=threading.Thread
        def spawn(*args,**kwargs):
            process=original_popen(*args,**kwargs)
            process.stdout=TrackedPipe(process.stdout,fail_pipe);process.stderr=TrackedPipe(process.stderr)
            processes.append(process);return process
        def thread(*args,**kwargs):
            value=original_thread(*args,**kwargs);workers.append(value);return value
        try:
            with patch('musiclab.release_git_fs.subprocess.Popen',spawn),patch('musiclab.release_git_fs.threading.Thread',thread):action()
        finally:
            self.assertTrue(processes)
            self.assertTrue(all(p.poll() is not None for p in processes),'Owned original child still live')
            self.assertTrue(all(not t.is_alive() for t in workers),'Owned reader still live')
        return processes,workers

    def test_pure_buffer_exact_limit_and_sentinel_refusal(self):
        buffer=CaptureBuffer(3);self.assertFalse(buffer.feed(b'abc'));self.assertEqual(buffer.value(),b'abc')
        self.assertTrue(buffer.feed(b'def'));self.assertEqual(len(buffer._data),4)
        with self.assertRaises(ValueError):buffer.value()
        buffer.feed(b'');self.assertTrue(buffer.overflow)

    def test_pure_buffer_rejects_unknown_budget_and_unbounded_blocks(self):
        for limit in [0,-1,True,1.0,STDOUT_BYTES+1]:
            with self.assertRaises(ValueError):CaptureBuffer(limit)
        for value in ['原文',bytearray(b'a'),b'x'*(READ_BYTES+1)]:
            with self.assertRaises(ValueError):CaptureBuffer(10).feed(value)

    def test_fixed_arguments_do_not_accept_unknown_commit_or_mode(self):
        self.assertEqual(tree_args('a'*40),['git','ls-tree','-r','-z','--long','a'*40])
        self.assertEqual(tree_args('a'*40,True)[4],'--name-only')
        for commit,mode in [('HEAD',False),('A'*40,False),('a'*40,1),('a'*40,None)]:
            with patch('musiclab.release_git_fs.subprocess.Popen',side_effect=AssertionError('Spawned invalid request')):
                with self.assertRaises(ValueError):read_tree(ROOT,commit,names_only=mode)

    def test_real_git_both_read_modes_preserve_exact_selected_source_bytes(self):
        with tempfile.TemporaryDirectory(prefix='zoe-tree-valid-') as folder:
            root=Path(folder);commit=fixture(root)
            (root/'README.md').write_bytes(b'Uncommitted edit\n')
            for names in [False,True]:
                expected=git(root,*tree_args(commit,names)[1:])
                self.owned(lambda:self.assertEqual(read_tree(root,commit,names_only=names),expected))
            _source_metadata(root,commit,'0.157.0')

    def test_real_git_overbudget_producer_and_names_reader_refuse_before_domain_or_archive(self):
        with tempfile.TemporaryDirectory(prefix='zoe-tree-large-') as folder:
            root=Path(folder);commit=fixture(root,True);original=packager.command
            def command(args,cwd=None,input=None,timeout=60):
                self.assertNotIn('archive',args)
                return original(args,cwd=root if cwd is None else cwd,input=input,timeout=timeout)
            def attempt():
                with patch.object(packager,'ROOT',root),patch.object(packager,'command',command), \
                        patch.object(packager,'source_tree',side_effect=AssertionError('Domain received oversized stdout')):
                    with self.assertRaisesRegex(ValueError,'capture byte budget'):packager.package(commit)
            processes,_=self.owned(attempt)
            # Includes the small fixed producer metadata commands too; the large
            # tree is identifiable through its owned stdout read count.
            captured=max(p.stdout.bytes for p in processes)
            self.assertLessEqual(captured,STDOUT_BYTES+READ_BYTES)
            self.assertLess(captured,2257835)
            self.owned(lambda:self.assertRaisesRegex(ValueError,'capture byte budget',_source_metadata,root,commit,'0.157.0'))
            target=root/'outputs/releases'/('v0.157.0-'+commit[:12])
            self.assertTrue((target/'FAILED.txt').is_file());self.assertFalse((target/'manifest.json').exists())
            self.assertFalse(list(target.glob('*.zip')))

    def test_stdout_exact_limit_and_stderr_warning_are_preserved_without_truncation(self):
        code='import sys;sys.stdout.buffer.write(b"x"*4096);sys.stderr.buffer.write(b"w"*4096)'
        self.owned(lambda:self.assertEqual(_capture([sys.executable,'-c',code],ROOT,stdout_limit=4096),b'x'*4096))

    def test_stdout_overflow_stops_and_reaps_only_original_child(self):
        code='import sys,time;sys.stdout.buffer.write(b"x"*(3*1024*1024));sys.stdout.flush();time.sleep(10)'
        processes,_=self.owned(lambda:self.assertRaisesRegex(ValueError,'byte budget',_capture,[sys.executable,'-c',code],ROOT))
        self.assertLessEqual(processes[0].stdout.bytes,STDOUT_BYTES+READ_BYTES)

    def test_stderr_overflow_refuses_without_deadlock_or_unbounded_capture(self):
        code='import sys,time;sys.stderr.buffer.write(b"x"*(3*1024*1024));sys.stderr.flush();time.sleep(10)'
        processes,_=self.owned(lambda:self.assertRaisesRegex(ValueError,'byte budget',_capture,[sys.executable,'-c',code],ROOT))
        self.assertLessEqual(processes[0].stderr.bytes,STDERR_BYTES+READ_BYTES)

    def test_nonzero_exit_never_returns_source_or_private_diagnostic(self):
        code='import sys;print("partial source");sys.stderr.write("private-looking-marker");sys.exit(2)'
        def attempt():
            with self.assertRaisesRegex(ValueError,'command failed') as error:_capture([sys.executable,'-c',code],ROOT)
            self.assertNotIn('private-looking-marker',str(error.exception));self.assertNotIn('partial source',str(error.exception))
        self.owned(attempt)

    def test_timeout_reaps_original_child_and_both_readers(self):
        code='import time;time.sleep(10)';started=time.monotonic()
        self.owned(lambda:self.assertRaises(subprocess.TimeoutExpired,_capture,[sys.executable,'-c',code],ROOT,timeout=0.05))
        self.assertLess(time.monotonic()-started,5)

    def test_pipe_failure_refuses_and_reaps_owned_process(self):
        code='import time;time.sleep(10)'
        self.owned(lambda:self.assertRaisesRegex(ValueError,'pipe read failed',_capture,[sys.executable,'-c',code],ROOT),fail_pipe=True)

    def test_invalid_deadline_and_spawn_failure_do_not_start_readers(self):
        for timeout in [0,True,float('nan'),61]:
            with patch('musiclab.release_git_fs.subprocess.Popen',side_effect=AssertionError('Invalid deadline spawned')):
                with self.assertRaises(ValueError):_capture(['unused'],ROOT,timeout=timeout)
        with patch('musiclab.release_git_fs.subprocess.Popen',side_effect=FileNotFoundError('synthetic spawn failure')), \
                patch('musiclab.release_git_fs.threading.Thread',side_effect=AssertionError('Spawn failure started readers')):
            with self.assertRaises(FileNotFoundError):_capture(['unused'],ROOT)


if __name__=='__main__':unittest.main()
