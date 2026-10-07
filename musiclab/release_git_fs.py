# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
"""Fixed Git-tree adapter, bounded pipes and original child-handle cleanup.

No global process enumeration/signalling, environment reads, configurable Git
arguments, Agent/HTTP paths or persistent jobs. This is not a global RAM cap.
"""
import math
import subprocess
import threading
import time
from .release_capture import CaptureBuffer, tree_args, STDOUT_BYTES, STDERR_BYTES, READ_BYTES

DEADLINE_SECONDS=60
CLEANUP_SECONDS=5


def _capture(args, root, *, stdout_limit=STDOUT_BYTES, stderr_limit=STDERR_BYTES, timeout=DEADLINE_SECONDS):
    # Private execution seam; public reads always use the fixed tree_args above.
    if type(timeout) not in (int,float) or not math.isfinite(timeout) or not 0<timeout<=DEADLINE_SECONDS:
        raise ValueError('Invalid bounded Git deadline')
    stdout=CaptureBuffer(stdout_limit);stderr=CaptureBuffer(stderr_limit)
    signal=threading.Event();lock=threading.Lock();state={'ended':0,'failed':False}
    workers=[]
    started=time.monotonic()
    process=subprocess.Popen(args,cwd=root,stdin=subprocess.DEVNULL,stdout=subprocess.PIPE,stderr=subprocess.PIPE,bufsize=0)
    def collect(pipe, buffer):
        try:
            while not signal.is_set():
                block=pipe.read(READ_BYTES)
                if not block:break
                if buffer.feed(block):signal.set();break
        except Exception:
            with lock:state['failed']=True
            signal.set()
        finally:
            with lock:
                state['ended']+=1
                if state['ended']==2:signal.set()
    try:
        for pipe,buffer in [(process.stdout,stdout),(process.stderr,stderr)]:
            worker=threading.Thread(target=collect,args=(pipe,buffer),name='release-git-reader')
            workers.append(worker);worker.start()
        if not signal.wait(max(0,timeout-(time.monotonic()-started))):
            raise subprocess.TimeoutExpired(args,timeout)
        if stdout.overflow or stderr.overflow:
            raise ValueError('Git source tree capture byte budget exceeded')
        if state['failed']:raise ValueError('Git source tree pipe read failed')
        process.wait(timeout=max(0.001,timeout-(time.monotonic()-started)))
        if process.returncode:raise ValueError('Git source tree command failed')
        return stdout.value()
    finally:
        # Only this Popen handle is owned. Cleanup follows both refusal and
        # success, and unavailable cleanup can never issue a successful result.
        deadline=time.monotonic()+CLEANUP_SECONDS
        if process.poll() is None:process.kill()
        process.wait(timeout=max(0.001,deadline-time.monotonic()))
        for pipe in [process.stdout,process.stderr]:pipe.close()
        for worker in workers:
            if worker.ident is not None:worker.join(timeout=max(0,deadline-time.monotonic()))
        if any(worker.is_alive() for worker in workers):
            raise ValueError('Git source tree reader cleanup unavailable')


def read_tree(root, commit, *, names_only=False):
    return _capture(tree_args(commit,names_only),root)
