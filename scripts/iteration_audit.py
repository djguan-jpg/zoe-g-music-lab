# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
"""Explicit local iteration audit / reviewed pruning / exact recovery.

Developer workflow, independent of Agent operations and product draft schemas.
"""
import argparse
import json
import re
import subprocess
import sys
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
from musiclab.maintenance_fs import workspace, audit, prune, restore, write_new
from musiclab.run_identity import record_current_run


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--workspace', type=Path, default=ROOT, help='Explicit ZOE. G project directory; defaults to this checkout')
    action = parser.add_mutually_exclusive_group()
    action.add_argument('--prune', action='store_true', help='Apply the exact reviewed eligible package set')
    action.add_argument('--restore-journal', type=Path, help='Restore exact source packages without overwrite')
    action.add_argument('--record-self', metavar='JOB', help='Record this Python process identity for managed job wrappers')
    parser.add_argument('--expected-token', help='Required SHA-256 of the preview candidate identities for pruning')
    parser.add_argument('--run-record', type=Path, action='append', default=[], help='Explicit same-host run record within selected project outputs')
    parser.add_argument('--out', type=Path, help='Save a new receipt within outputs; default refuses overwrite')
    args = parser.parse_args(argv)
    try:
        root = workspace(args.workspace)
        selected = lambda path: path if path.is_absolute() else root/path
        records = [selected(path) for path in args.run_record]
        if args.expected_token and not args.prune:
            raise ValueError('--expected-token is only valid with --prune')
        if args.prune and (not args.expected_token or not re.fullmatch('[0-9a-f]{64}', args.expected_token)):
            raise ValueError('--prune requires the exact preview --expected-token')
        if (args.restore_journal or args.record_self) and records:
            raise ValueError('Run records are only used by audit and pruning')
        # Validate receipt location first; pruning independently journals recovery before moving.
        if args.out:
            target = selected(args.out)
            from musiclab.maintenance_fs import safe_path
            target = safe_path(root, target)
            if not target.is_relative_to(root/'outputs') or target.exists():
                raise ValueError('Receipt path must be a new file within project outputs')
        if args.prune:
            result = prune(root, args.expected_token, records)
        elif args.restore_journal:
            result = restore(root, selected(args.restore_journal))
        elif args.record_self:
            result = record_current_run(args.record_self)
        else:
            result = audit(root, records)
        if args.out:
            write_new(root, target, result)
        print(json.dumps(result, ensure_ascii=False, allow_nan=False))
        return 0
    except (ValueError, OSError, RuntimeError, subprocess.TimeoutExpired, zipfile.BadZipFile) as error:
        print(str(error), file=sys.stderr)
        return 1


if __name__ == '__main__':
    if hasattr(sys.stdout, 'reconfigure'):
        sys.stdout.reconfigure(encoding='utf-8')
    raise SystemExit(main())
