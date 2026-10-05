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
DEADLINE_SECONDS = 120
WORKERS = 2


def tests(suite):
    for item in suite:
        if isinstance(item, unittest.TestSuite): yield from tests(item)
        else: yield item


def worker(group):
    all_tests = list(tests(unittest.defaultTestLoader.discover(str(ROOT/'tests'))))
    modules = sorted({test.__class__.__module__ for test in all_tests})
    selected = unittest.TestSuite(test for test in all_tests if modules.index(test.__class__.__module__) % WORKERS == group)
    stream = io.StringIO()
    result = unittest.TextTestRunner(stream=stream).run(selected)
    print(json.dumps({'group': group, 'count': result.testsRun, 'ids': [test.id() for test in all_tests
          if modules.index(test.__class__.__module__) % WORKERS == group], 'passed': result.wasSuccessful()}))
    if not result.wasSuccessful(): print(stream.getvalue()[-12000:], file=sys.stderr)
    return 0 if result.wasSuccessful() else 1


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--group', type=int, choices=range(WORKERS), help=argparse.SUPPRESS)
    args = parser.parse_args()
    if args.group is not None: return worker(args.group)
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
    rows = []
    for process, (output, error) in zip(processes, replies):
        if process.returncode or len(output) > 1024*1024:
            print((output+error).decode('utf-8', errors='replace')[-16000:], file=sys.stderr); return 1
        rows.append(json.loads(output))
    ids = [identifier for row in rows for identifier in row['ids']]
    # Parent discovery independently proves complete coverage, not just summed counts.
    expected = [test.id() for test in tests(unittest.defaultTestLoader.discover(str(ROOT/'tests')))]
    if (time.monotonic()-started >= DEADLINE_SECONDS or not expected or len(ids) != len(set(ids)) or sorted(ids) != sorted(expected) or
            any(not row['passed'] or row['count'] != len(row['ids']) for row in rows)):
        print('Python test partition coverage did not match complete discovery.', file=sys.stderr); return 1
    print(f'Ran {len(ids)} tests in {time.monotonic()-started:.3f}s\n\nOK (two isolated workers; 120 second overall deadline)')
    return 0


if __name__ == '__main__': raise SystemExit(main())
