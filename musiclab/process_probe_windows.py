# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
"""One exact local PID, three CIM properties, no remote session or signals."""
import subprocess
import sys
from .process_probe import checked_pid, checked_reply, MAX_REPLY_BYTES
from .maintenance import CIM_SOURCE

QUERY_TIMEOUT_SECONDS = 5


def query_command(pid):
    checked_pid(pid)
    # Only the already validated decimal PID varies; no user strings or paths.
    return (
        "$ErrorActionPreference='Stop';"
        "[Console]::OutputEncoding=[System.Text.UTF8Encoding]::new($false);"
        "try {"
        "$probeItems=@(Get-CimInstance -ClassName Win32_Process "
        f"-Filter 'ProcessId={pid}' "
        "-Property ProcessId,Name,CreationDate -OperationTimeoutSec 3 -ErrorAction Stop);"
        "if($probeItems.Count -gt 1){throw 'Unexpected process count'};"
        "$probeRecord=$null;"
        "if($probeItems.Count -eq 1){"
        "$probeItem=$probeItems[0];"
        "if($null -eq $probeItem.CreationDate -or $null -eq $probeItem.Name){throw 'Incomplete identity'};"
        "$probeRecord=[ordered]@{pid=[int]$probeItem.ProcessId;platform='windows';"
        "image=[string]$probeItem.Name;creation_ticks=[string]$probeItem.CreationDate.ToUniversalTime().ToFileTimeUtc()};"
        "};"
        f"[ordered]@{{format='zoe-windows-process-probe';schema_version=1;pid={pid};record=$probeRecord}} "
        "| ConvertTo-Json -Compress -Depth 4;exit 0"
        "} catch {exit 1}"
    )


def observe_cim(pid):
    checked_pid(pid)
    unavailable = {'pid': pid, 'state': 'unavailable', 'source': CIM_SOURCE}
    if sys.platform != 'win32':
        return {**unavailable, 'reason': 'cim_platform_unavailable'}
    try:
        result = subprocess.run(
            ['powershell.exe', '-NoProfile', '-NonInteractive', '-Command', query_command(pid)],
            capture_output=True, timeout=QUERY_TIMEOUT_SECONDS,
            creationflags=subprocess.CREATE_NO_WINDOW,
        )
    except subprocess.TimeoutExpired:
        # subprocess.run closes and waits for its own transient helper on timeout.
        return {**unavailable, 'reason': 'cim_query_timeout'}
    except OSError:
        return {**unavailable, 'reason': 'cim_query_unavailable'}
    if result.returncode != 0:
        return {**unavailable, 'reason': 'cim_query_failed'}
    if len(result.stdout) > MAX_REPLY_BYTES or len(result.stderr) > MAX_REPLY_BYTES:
        return {**unavailable, 'reason': 'cim_reply_too_large'}
    if result.stderr:
        return {**unavailable, 'reason': 'cim_query_warning'}
    try:
        return checked_reply(pid, result.stdout)
    except ValueError:
        return {**unavailable, 'reason': 'cim_reply_invalid'}
