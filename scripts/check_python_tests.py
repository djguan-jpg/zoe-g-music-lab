# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
"""Run every discovered Python test once with two bounded isolated processes."""
import argparse
from concurrent.futures import ThreadPoolExecutor
import io
import json
from pathlib import Path
import subprocess
import sys
import time
import unittest

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
from musiclab.test_run_summary import summarize
from musiclab.test_schedule import partition
from musiclab.run_identity import record_current_run
DEADLINE_SECONDS = 120
WORKERS = 2


def tests(suite):
    for item in suite:
        if isinstance(item, unittest.TestSuite): yield from tests(item)
        else: yield item


def worker(group):
    # Self-register before discovery; only basename and creation identity leave
    # the worker. Non-Windows runs keep explicit unavailable identity evidence.
    record = record_current_run('python-tests-'+str(group)) if sys.platform == 'win32' else None
    print(json.dumps({'phase':'start','group':group,'run':record}),flush=True)
    all_tests = list(tests(unittest.defaultTestLoader.discover(str(ROOT/'tests'))))
    selected_ids = partition([test.id() for test in all_tests])[group]
    selected_set = set(selected_ids)
    selected = unittest.TestSuite(test for test in all_tests if test.id() in selected_set)
    stream = io.StringIO()
    result = unittest.TextTestRunner(stream=stream).run(selected)
    print(json.dumps({'phase':'result','group': group, 'count': result.testsRun, 'ids': selected_ids, 'passed': result.wasSuccessful(),
          'skipped':[test.id() for test,reason in result.skipped],
          'expected_failures':[test.id() for test,error in result.expectedFailures],
          'failures':len(result.failures),'errors':len(result.errors),'unexpected_successes':len(result.unexpectedSuccesses)}),flush=True)
    if not result.wasSuccessful(): print(stream.getvalue()[-12000:], file=sys.stderr)
    return 0 if result.wasSuccessful() else 1


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--group', type=int, choices=range(WORKERS), help=argparse.SUPPRESS)
    parser.add_argument('--report-json',action='store_true',help='Return a bounded validated test and original-worker completion summary')
    args = parser.parse_args()
    if args.group is not None:
        if args.report_json:parser.error('--report-json is only available on the parent runner')
        return worker(args.group)
    started = time.monotonic()
    processes = []
    try:
        for i in range(WORKERS):
            processes.append(subprocess.Popen([sys.executable, '-X', 'utf8', str(Path(__file__).resolve()), '--group', str(i)],
                             cwd=ROOT, stdout=subprocess.PIPE, stderr=subprocess.PIPE))
    except BaseException:
        for process in processes:
            if process.poll() is None: process.kill()
            process.communicate()
        raise
    def collect(process):
        try: return process.communicate(timeout=max(0.01, DEADLINE_SECONDS-(time.monotonic()-started)))
        except subprocess.TimeoutExpired:
            process.kill(); output, error = process.communicate()
            return output, error+b'\nPython test execution reached the 120 second overall deadline.'
    with ThreadPoolExecutor(max_workers=WORKERS) as pool:
        replies = list(pool.map(collect, processes))
    outputs = []
    for process, (output, error) in zip(processes, replies):
        if process.returncode or len(output) > 1024*1024:
            print((output+error).decode('utf-8', errors='replace')[-16000:], file=sys.stderr); return 1
        outputs.append(output)
    # Parent discovery independently proves complete coverage, not just summed counts.
    discovered=list(tests(unittest.defaultTestLoader.discover(str(ROOT/'tests'))))
    expected=partition([test.id() for test in discovered])
    try:
        if time.monotonic()-started >= DEADLINE_SECONDS:raise ValueError('Python test run reached its overall deadline')
        report=summarize(outputs,expected,[p.pid for p in processes],[p.returncode for p in processes],[p.poll() is not None for p in processes])
    except ValueError as error:
        print(str(error),file=sys.stderr);return 1
    if args.report_json:print(json.dumps(report,ensure_ascii=False,separators=(',',':')))
    else:print(f"Ran {report['tests']} tests in {time.monotonic()-started:.3f}s\nSkipped {report['skipped']}; expected failures {report['expected_failures']}\n\nOK (two isolated workers; 120 second overall deadline)")
    return 0


if __name__ == '__main__': raise SystemExit(main())
