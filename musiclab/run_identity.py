# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
"""Read one explicit Windows process handle; never enumerate, signal or kill."""
import ctypes
import os
import sys
from .maintenance import validate_identity, validate_run


def observe_process(pid):
    if type(pid) is not int or not 0 < pid <= 2147483647:
        raise ValueError('Run PID must be a positive bounded integer')
    if sys.platform != 'win32':
        return {'pid': pid, 'state': 'unavailable', 'reason': 'Windows identity reader unavailable'}
    from ctypes import wintypes
    kernel = ctypes.WinDLL('kernel32', use_last_error=True)
    kernel.OpenProcess.argtypes = (wintypes.DWORD, wintypes.BOOL, wintypes.DWORD)
    kernel.OpenProcess.restype = wintypes.HANDLE
    kernel.CloseHandle.argtypes = (wintypes.HANDLE,)
    kernel.GetExitCodeProcess.argtypes = (wintypes.HANDLE, ctypes.POINTER(wintypes.DWORD))
    kernel.GetProcessTimes.argtypes = (wintypes.HANDLE, *([ctypes.POINTER(wintypes.FILETIME)] * 4))
    kernel.QueryFullProcessImageNameW.argtypes = (wintypes.HANDLE, wintypes.DWORD, wintypes.LPWSTR, ctypes.POINTER(wintypes.DWORD))
    handle = kernel.OpenProcess(0x1000, False, pid)  # QUERY_LIMITED_INFORMATION, no mutation rights.
    if not handle:
        error = ctypes.get_last_error()
        return {'pid': pid, 'state': 'absent' if error == 87 else 'unavailable', 'reason': 'process_not_found' if error == 87 else 'query_unavailable'}
    try:
        exit_code = wintypes.DWORD()
        if not kernel.GetExitCodeProcess(handle, ctypes.byref(exit_code)):
            return {'pid': pid, 'state': 'unavailable', 'reason': 'exit_state_unavailable'}
        if exit_code.value != 259:
            return {'pid': pid, 'state': 'absent', 'reason': 'process_exited'}
        times = [wintypes.FILETIME() for _ in range(4)]
        if not kernel.GetProcessTimes(handle, *[ctypes.byref(t) for t in times]):
            return {'pid': pid, 'state': 'unavailable', 'reason': 'creation_time_unavailable'}
        text = ctypes.create_unicode_buffer(32768);size = wintypes.DWORD(len(text))
        if not kernel.QueryFullProcessImageNameW(handle, 0, text, ctypes.byref(size)):
            return {'pid': pid, 'state': 'unavailable', 'reason': 'image_unavailable'}
        ticks = (times[0].dwHighDateTime << 32) | times[0].dwLowDateTime
        identity = validate_identity({'pid': pid, 'platform': 'windows', 'creation_ticks': str(ticks), 'image': os.path.basename(text.value)})
        return {'pid': pid, 'state': 'running', 'identity': identity}
    finally:
        kernel.CloseHandle(handle)


def record_current_run(job):
    observed = observe_process(os.getpid())
    if observed['state'] != 'running':
        raise ValueError('Cannot record current run without verified Windows creation identity')
    return validate_run({'format': 'zoe-iteration-run', 'schema_version': 1, 'job': job, 'identity': observed['identity']})
