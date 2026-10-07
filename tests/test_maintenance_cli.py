# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
"""Explicit action presence, early rejection and real Windows link boundaries."""
import hashlib
import io
import json
import os
import stat
import subprocess
import sys
import tempfile
import unittest
from contextlib import ExitStack, contextmanager, redirect_stderr, redirect_stdout
from pathlib import Path
from unittest.mock import patch

from musiclab.maintenance_cli import choose_action
from musiclab.maintenance import validate_job
from musiclab.maintenance_space_fs import space_report
from scripts.iteration_audit import main, explicit_path

DIRECTORY = 'outputs/releases/v0.139.0-eb916c99088c'


class MaintenanceActionPolicyTests(unittest.TestCase):
    def test_all_five_valid_actions_preserve_selection(self):
        for args, action in [({}, 'audit'), ({'prune': True, 'expected_token': 'a'*64}, 'prune'),
                             ({'restore': True}, 'restore'), ({'record_job': 'ok'}, 'record'), ({'space': True}, 'space')]:
            with self.subTest(action=action): self.assertEqual(choose_action(**args), action)

    def test_empty_record_job_does_not_fall_back_to_audit(self):
        self.assertEqual(choose_action(record_job=None), 'audit')
        for value in ['', ' ', '\t', 0, False]:
            with self.assertRaises(ValueError): choose_action(record_job=value)

    def test_supplied_empty_or_nonempty_token_rejects_every_nonprune_action(self):
        for args in [{}, {'restore': True}, {'record_job': 'ok'}, {'space': True}]:
            for value in ['', 'a'*64, False]:
                with self.subTest(args=args, value=value), self.assertRaisesRegex(ValueError, 'only valid'):
                    choose_action(expected_token=value, **args)

    def test_prune_token_is_strict_and_never_trimmed_or_coerced(self):
        for token in [None, '', 'A'*64, 'a'*63, 'a'*65, ' '+'a'*64, True, 0]:
            with self.assertRaises(ValueError): choose_action(prune=True, expected_token=token)
        self.assertEqual(choose_action(prune=True, expected_token='0'*64), 'prune')

    def test_presence_and_flag_types_are_checked_before_value_truthiness(self):
        for args in [{'record_job': '', 'space': True}, {'restore': True, 'space': True},
                     {'prune': True, 'record_job': ''}, {'restore': True, 'prune': True}]:
            with self.assertRaisesRegex(ValueError, 'mutually exclusive'): choose_action(**args)
        for name in ['prune', 'restore', 'space', 'has_records']:
            with self.assertRaises(ValueError): choose_action(**{name: 0})

    def test_record_and_package_controls_are_only_for_audit_or_prune(self):
        for args in [{'restore': True}, {'record_job': 'ok'}, {'space': True}]:
            with self.assertRaisesRegex(ValueError, 'only used'): choose_action(has_records=True, **args)
            for directories in [[], [DIRECTORY]]:
                with self.assertRaisesRegex(ValueError, 'only valid'): choose_action(package_directories=directories, **args)
        self.assertEqual(choose_action(has_records=True, package_directories=[DIRECTORY]), 'audit')

    def test_package_shape_refuses_before_catalog_and_input_order_is_preserved(self):
        other = 'outputs/releases/v0.138.0-cea1042139ba'; values = [DIRECTORY, other]; before = list(values)
        self.assertEqual(choose_action(package_directories=values), 'audit'); self.assertEqual(values, before)
        for value in [[], [''], [DIRECTORY, DIRECTORY], ['../'+DIRECTORY], [DIRECTORY]*129]:
            with self.assertRaises(ValueError): choose_action(package_directories=value)

    def test_shared_job_grammar_preserves_boundary_and_literal_spelling(self):
        self.assertEqual(validate_job('a'+'-'*79), 'a'+'-'*79)
        for value in ['a'+'-'*80, 'A', '工作', 'ok ', 'a_b', '\0', '']:
            with self.assertRaises(ValueError): choose_action(record_job=value)


class MaintenanceCliRoutingTests(unittest.TestCase):
    @contextmanager
    def readers(self):
        with ExitStack() as stack:
            names = ['workspace', 'audit', 'audit_batch', 'audit_runs', 'prune', 'restore', 'record_current_run', 'write_new']
            readers = {name: stack.enter_context(patch('scripts.iteration_audit.'+name)) for name in names}
            readers['space_report'] = stack.enter_context(patch('musiclab.maintenance_space_fs.space_report'))
            yield readers

    def rejected(self, args, code=1):
        with self.readers() as readers, redirect_stdout(io.StringIO()) as stdout, redirect_stderr(io.StringIO()) as stderr:
            if code == 2:
                with self.assertRaises(SystemExit) as error: main(args)
                self.assertEqual(error.exception.code, 2)
            else:
                self.assertEqual(main(args), code)
            self.assertEqual(stdout.getvalue(), ''); self.assertTrue(stderr.getvalue())
            for reader in readers.values(): reader.assert_not_called()

    def test_empty_token_no_longer_runs_any_reader_or_writes_receipt(self):
        for action in [[], ['--space-report'], ['--restore-journal', 'outputs/x.json'], ['--record-self', 'ok']]:
            self.rejected([*action, '--expected-token', '', '--out', 'outputs/should-not-exist.json'])

    def test_empty_and_invalid_job_never_reads_workspace_or_process_identity(self):
        for value in ['', ' ', 'private job label', 'a'*81]:
            self.rejected(['--record-self', value])
        self.rejected(['--record-self', '', '--package-directory', DIRECTORY])

    def test_empty_path_options_refuse_before_path_normalization_or_io(self):
        for name in ['--workspace', '--restore-journal', '--run-record', '--out']:
            self.rejected([name, ''], 2)
        self.assertEqual(str(explicit_path('relative path/原文.json')), str(Path('relative path/原文.json')))
        self.assertEqual(explicit_path('.'), Path('.'))

    def test_bad_prune_tokens_and_package_shapes_do_not_start_catalog_reads(self):
        for token in ['', 'invalid']:
            self.rejected(['--prune', '--expected-token', token])
        self.rejected(['--prune'])
        self.rejected(['--package-directory', ''])
        self.rejected(['--package-directory', DIRECTORY, '--package-directory', DIRECTORY])

    def test_incompatible_controls_reject_before_workspace_validation(self):
        self.rejected(['--space-report', '--run-record', 'outputs/a.json'])
        self.rejected(['--restore-journal', 'outputs/a.json', '--package-directory', DIRECTORY])
        self.rejected(['--space-report', '--record-self', ''], 2)

    def test_process_only_action_rejects_incompatible_or_missing_inputs_before_io(self):
        self.rejected(['--runs-only'])
        self.rejected(['--runs-only','--expected-token','a'*64,'--run-record','outputs/a.json'])
        self.rejected(['--runs-only','--package-directory',DIRECTORY,'--run-record','outputs/a.json'])
        for action in ['--prune','--space-report']:
            self.rejected(['--runs-only',action,'--run-record','outputs/a.json'],2)
        self.assertEqual(choose_action(runs_only=True,has_records=True),'runs')
        with self.assertRaises(ValueError): choose_action(runs_only=1,has_records=True)

    def test_valid_actions_dispatch_exactly_once_with_existing_arguments(self):
        root = Path(__file__).resolve().parents[1]
        cases = [([], 'audit', (root, []), {}),
                 (['--package-directory', DIRECTORY], 'audit_batch', (root, [DIRECTORY], []), {}),
                 (['--prune', '--expected-token', 'a'*64], 'prune', (root, 'a'*64, []), {'package_directories': None}),
                 (['--restore-journal', 'outputs/a.json'], 'restore', (root, root/'outputs/a.json'), {}),
                 (['--record-self', 'ok'], 'record_current_run', ('ok',), {}),
                 (['--space-report'], 'space_report', (root,), {}),
                 (['--runs-only','--run-record','outputs/a.json'], 'audit_runs', (root,[root/'outputs/a.json']), {})]
        for args, name, positional, keywords in cases:
            with self.subTest(action=name), self.readers() as readers, redirect_stdout(io.StringIO()) as stdout:
                readers['workspace'].return_value = root; readers[name].return_value = {'selected': name}
                self.assertEqual(main(args), 0); self.assertEqual(json.loads(stdout.getvalue()), {'selected': name})
                readers['workspace'].assert_called_once_with(root); readers[name].assert_called_once_with(*positional, **keywords)
                for key, reader in readers.items():
                    if key not in ('workspace', name): reader.assert_not_called()


@unittest.skipUnless(sys.platform == 'win32', 'Real junctions require Windows')
class MaintenanceWindowsJunctionTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory(prefix='zoe-junction-')
        self.base = Path(self.temp.name).resolve(); self.root = self.base/'workspace'; self.root.mkdir()
        self.target = self.base/'external'; self.target.mkdir()
        (self.root/'projects.json').write_text(json.dumps({'suite': 'ZOE. G Music Lab'}), encoding='utf-8')
        self.saved = self.target/'saved.bin'; self.saved.write_bytes(b'owned synthetic external content')
        self.before = (hashlib.sha256(self.saved.read_bytes()).hexdigest(), self.saved.stat().st_mtime_ns)
        self.links = []

    def tearDown(self):
        for link in reversed(self.links):
            # Remove only the exact owned reparse entry, never recursively follow its target.
            self.assertTrue(link.absolute().is_relative_to(self.root))
            self.assertEqual(link.resolve(), self.target)
            self.assertTrue(link.lstat().st_file_attributes & stat.FILE_ATTRIBUTE_REPARSE_POINT)
            os.rmdir(link)
        self.assertEqual((hashlib.sha256(self.saved.read_bytes()).hexdigest(), self.saved.stat().st_mtime_ns), self.before)
        self.assertEqual(self.base.parent, Path(tempfile.gettempdir()).resolve()); self.temp.cleanup()

    def junction(self, link):
        from windows_fixture import create_junction
        create_junction(link, self.target, self.base)
        self.links.append(link)
        self.assertTrue(link.lstat().st_file_attributes & stat.FILE_ATTRIBUTE_REPARSE_POINT)

    def test_descendant_junction_is_skipped_and_receipt_cannot_cross_it(self):
        outputs = self.root/'outputs'; outputs.mkdir(); (outputs/'normal.bin').write_bytes(b'abc')
        link = outputs/'v1-qa'; self.junction(link)
        report = space_report(self.root, now=2000000000)
        self.assertEqual((report['files'], report['bytes'], report['skipped_links']), (1, 3, 1))
        self.assertEqual(report['largest_iterations'], [])
        with redirect_stdout(io.StringIO()), redirect_stderr(io.StringIO()):
            self.assertEqual(main(['--workspace', str(self.root), '--space-report', '--out', 'outputs/v1-qa/receipt.json']), 1)
        self.assertFalse((self.target/'receipt.json').exists())

    def test_outputs_root_junction_refuses_report_and_new_receipt(self):
        self.junction(self.root/'outputs')
        with self.assertRaises(ValueError): space_report(self.root)
        with redirect_stdout(io.StringIO()), redirect_stderr(io.StringIO()):
            self.assertEqual(main(['--workspace', str(self.root), '--space-report', '--out', 'outputs/receipt.json']), 1)
        self.assertFalse((self.target/'receipt.json').exists())


if __name__ == '__main__':
    unittest.main()
