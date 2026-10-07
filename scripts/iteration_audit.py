# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
"""Explicit local iteration audit / reviewed pruning / exact recovery.

Developer workflow, independent of Agent operations and product draft schemas.
"""
import argparse
import json
import subprocess
import sys
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
from musiclab.maintenance_fs import workspace, audit, audit_batch, audit_runs, prune, restore, write_new
from musiclab.run_identity import record_current_run
from musiclab.maintenance_cli import choose_action


def explicit_path(value):
    # Preserve literal path spelling; only an explicitly empty value is invalid.
    if value == '':
        raise argparse.ArgumentTypeError('Path value cannot be empty')
    return Path(value)


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--workspace', type=explicit_path, default=ROOT, help='Explicit ZOE. G project directory; defaults to this checkout')
    action = parser.add_mutually_exclusive_group()
    action.add_argument('--prune', action='store_true', help='Apply the exact reviewed eligible package set')
    action.add_argument('--restore-journal', type=explicit_path, help='Restore exact source packages without overwrite')
    action.add_argument('--record-self', metavar='JOB', help='Record this Python process identity for managed job wrappers')
    action.add_argument('--space-report', action='store_true', help='Read-only outputs size/age categories; does not evaluate deletion eligibility')
    action.add_argument('--runs-only', action='store_true', help='Read only 1–32 explicit run records without rescanning release packages; no pruning token')
    parser.add_argument('--expected-token', help='Required SHA-256 of the preview candidate identities for pruning')
    parser.add_argument('--run-record', type=explicit_path, action='append', default=[], help='Explicit same-host run record within selected project outputs')
    parser.add_argument('--package-directory', action='append', help='Preview or prune only these exact eligible release identities; repeat 1–128 times')
    parser.add_argument('--out', type=explicit_path, help='Save a new receipt within outputs; default refuses overwrite')
    args = parser.parse_args(argv)
    try:
        command = choose_action(prune=args.prune, restore=args.restore_journal is not None,
                                record_job=args.record_self, space=args.space_report, runs_only=args.runs_only,
                                expected_token=args.expected_token, has_records=bool(args.run_record),
                                package_directories=args.package_directory)
        root = workspace(args.workspace)
        selected = lambda path: path if path.is_absolute() else root/path
        records = [selected(path) for path in args.run_record]
        # Validate receipt location first; pruning independently journals recovery before moving.
        if args.out is not None:
            target = selected(args.out)
            from musiclab.maintenance_fs import safe_path
            target = safe_path(root, target)
            if not target.is_relative_to(root/'outputs') or target.exists():
                raise ValueError('Receipt path must be a new file within project outputs')
        if command == 'prune':
            result = prune(root, args.expected_token, records, package_directories=args.package_directory)
        elif command == 'restore':
            result = restore(root, selected(args.restore_journal))
        elif command == 'record':
            result = record_current_run(args.record_self)
        elif command == 'runs':
            result = audit_runs(root, records)
        elif command == 'space':
            from musiclab.maintenance_space_fs import space_report
            result = space_report(root)
        else:
            result = audit(root, records) if args.package_directory is None else audit_batch(root, args.package_directory, records)
        if args.out is not None:
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
