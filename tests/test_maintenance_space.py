# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
"""Space accounting is bounded, private and independent of deletion policy."""
import hashlib
import io
import json
import os
import stat
import subprocess
import sys
import tempfile
import unittest
from contextlib import redirect_stderr, redirect_stdout
from pathlib import Path
from types import SimpleNamespace
from unittest.mock import patch

from musiclab import maintenance_space as policy
from musiclab.maintenance_space import SpaceAccumulator, SEVEN_DAYS
from musiclab.maintenance_space_fs import space_report, _linked
from scripts.iteration_audit import main

ROOT = Path(__file__).resolve().parents[1]
NOW = 2000000


class SpacePolicyTests(unittest.TestCase):
    def model(self):
        return SpaceAccumulator(NOW, outputs_exists=True)

    def test_strict_seven_day_boundary_future_and_zero_size(self):
        m = self.model()
        for i, (age, size) in enumerate([(SEVEN_DAYS, 11), (SEVEN_DAYS + 1, 12), (-1, 13), (0, 0)]):
            m.add((str(i),), 'file', size=size, mtime=NOW-age)
        r = m.report()
        self.assertEqual((r['files'], r['bytes'], r['older_than_seven_days_files'],
                          r['older_than_seven_days_bytes'], r['future_timestamp_files']), (4, 36, 1, 12, 1))
        self.assertFalse(r['deletion_candidates_evaluated'])

    def test_fixed_placement_categories_and_unknown_names_not_in_report(self):
        m = self.model()
        for parts, size in [(('releases', 'unknown title'), 3), (('v139-qa', 'private name'), 5),
                            (('drafts-private-title', 'sensitive'), 7), (('v001-qa', 'other'), 9), (('v140-qa',), 1)]:
            m.add(parts, 'file', size=size, mtime=NOW)
        r = m.report()
        self.assertEqual([(v['category'], v['bytes']) for v in r['categories']],
                         [('release_area', 3), ('iteration_area', 5), ('other_area', 17)])
        raw = json.dumps(r)
        for name in ['unknown title', 'private name', 'drafts-private-title', 'sensitive', 'v001-qa', 'v140-qa']:
            self.assertNotIn(name, raw)

    def test_top_twenty_ties_use_numeric_version_and_input_order_is_irrelevant(self):
        a, b = self.model(), self.model()
        for m, order in [(a, range(25)), (b, reversed(range(25)))]:
            for n in order:
                m.add((f'v{n}-qa', 'file'), 'file', size=10, mtime=NOW)
        self.assertEqual(a.report(), b.report())
        self.assertEqual([v['iteration'] for v in a.report()['largest_iterations']], [f'v{n}-qa' for n in range(20)])
        self.assertEqual(a.report()['iterations_count'], 25)

    def test_top_twenty_orders_largest_first(self):
        m = self.model()
        for n in range(25):
            m.add((f'v{n}-qa', 'file'), 'file', size=n, mtime=NOW)
        self.assertEqual([v['bytes'] for v in m.report()['largest_iterations']], list(range(24, 4, -1)))

    def test_report_is_isolated_from_model(self):
        m = self.model(); m.add(('v1-qa', 'a'), 'file', size=3, mtime=NOW)
        r = m.report(); r['categories'][1]['bytes'] = 100; r['largest_iterations'][0]['files'] = 100
        self.assertEqual(m.report()['bytes'], 3); self.assertEqual(m.report()['largest_iterations'][0]['files'], 1)

    def test_missing_outputs_reject_entries_and_exist_flag_is_strict(self):
        m = SpaceAccumulator(NOW, outputs_exists=False)
        self.assertFalse(m.report()['outputs_exists']); self.assertEqual(m.report()['files'], 0)
        with self.assertRaises(ValueError): m.add(('a',), 'directory')
        for v in [0, None, 'false']:
            with self.assertRaises(ValueError): SpaceAccumulator(NOW, outputs_exists=v)

    def test_invalid_times_and_sizes_refuse_without_mutating_counts(self):
        m = self.model()
        for value in [True, None, float('nan'), float('inf'), 2**10000, '1']:
            with self.assertRaises(ValueError): SpaceAccumulator(value, outputs_exists=True)
            with self.assertRaises(ValueError): m.add(('a',), 'file', size=1, mtime=value)
        for value in [True, -1, 1.1, None, policy.MAX_TOTAL_BYTES+1]:
            with self.assertRaises(ValueError): m.add(('a',), 'file', size=value, mtime=NOW)
        self.assertEqual(m.report()['files'], 0)

    def test_paths_types_and_nonfile_metadata_refuse(self):
        m = self.model()
        for parts in [[], (), ('..',), ('a/b',), ('a\\b',), ('a\0b',), (1,), ('a',)*65]:
            with self.assertRaises(ValueError): m.add(parts, 'file', size=1, mtime=NOW)
        with self.assertRaises(ValueError): m.add(('a',), 'unknown')
        with self.assertRaises(ValueError): m.add(('a',), 'directory', size=1)
        with self.assertRaises(ValueError): m.add(('a',), 'link', mtime=NOW)

    def test_files_directories_entries_and_group_budgets_fail_closed(self):
        for constant, first, second in [
            ('MAX_FILES', (('a',), 'file'), (('b',), 'file')),
            ('MAX_DIRECTORIES', (('a',), 'directory'), (('b',), 'directory')),
            ('MAX_ENTRIES', (('a',), 'link'), (('b',), 'other')),
            ('MAX_ITERATIONS', (('v1-qa', 'a'), 'file'), (('v2-qa', 'a'), 'file'))]:
            with self.subTest(constant=constant), patch.object(policy, constant, 1):
                m = self.model()
                for position, (parts, kind) in enumerate([first, second]):
                    args = dict(size=1, mtime=NOW) if kind == 'file' else {}
                    if position == 0: m.add(parts, kind, **args)
                    else:
                        before = m.report()
                        with self.assertRaises(ValueError): m.add(parts, kind, **args)
                        self.assertEqual(m.report(), before)

    def test_total_byte_overflow_refuses_and_retains_prior_accounting(self):
        m = self.model(); m.add(('a',), 'file', size=policy.MAX_TOTAL_BYTES, mtime=NOW)
        with self.assertRaises(ValueError): m.add(('b',), 'file', size=1, mtime=NOW)
        self.assertEqual(m.report()['files'], 1)
        self.assertEqual(m.report()['bytes'], policy.MAX_TOTAL_BYTES)


class SpaceFilesystemTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory(prefix='zoe-space-')
        self.root = Path(self.temp.name).resolve()
        (self.root/'projects.json').write_text(json.dumps({'suite': 'ZOE. G Music Lab'}), encoding='utf-8')

    def tearDown(self):
        self.temp.cleanup()

    def file(self, relative, value=b'abc', stamp=NOW):
        p = self.root/'outputs'/relative; p.parent.mkdir(parents=True, exist_ok=True)
        p.write_bytes(value); os.utime(p, (stamp, stamp)); return p

    def test_missing_and_empty_outputs_are_distinct(self):
        self.assertFalse(space_report(self.root, now=NOW)['outputs_exists'])
        (self.root/'outputs').mkdir()
        r = space_report(self.root, now=NOW)
        self.assertTrue(r['outputs_exists']); self.assertEqual(r['files'], 0)
        self.assertEqual(r['directories'], 0)

    def test_real_files_totals_age_categories_and_hashes_remain(self):
        files = [self.file('releases/a.zip', b'12345', NOW-SEVEN_DAYS-1),
                 self.file('v139-qa/a.log', b'abc'), self.file('private-label/a.bin', b'12')]
        before = [(p.read_bytes(), p.stat().st_mtime_ns) for p in files]
        r = space_report(self.root, now=NOW)
        self.assertEqual((r['files'], r['directories'], r['bytes'], r['older_than_seven_days_files']), (3, 3, 10, 1))
        self.assertEqual([(p.read_bytes(), p.stat().st_mtime_ns) for p in files], before)
        self.assertNotIn('private-label', json.dumps(r)); self.assertEqual(r['mutation'], 'none')

    def test_no_output_content_is_opened(self):
        self.file('v1-qa/not-read.bin', b'private-content')
        original = Path.open
        def guarded(p, *args, **kwargs):
            if p.is_relative_to(self.root/'outputs'): raise AssertionError('Content opened')
            return original(p, *args, **kwargs)
        with patch.object(Path, 'open', guarded):
            self.assertEqual(space_report(self.root, now=NOW)['bytes'], 15)

    def test_external_symlink_is_skipped_without_following(self):
        self.file('v1-qa/a', b'abc'); outside = self.root/'external'; outside.mkdir(); (outside/'b').write_bytes(b'123456')
        try: (self.root/'outputs'/'link').symlink_to(outside, target_is_directory=True)
        except OSError as error: self.skipTest('OS does not permit synthetic symlink: '+str(error.winerror if hasattr(error, 'winerror') else error.errno))
        r = space_report(self.root, now=NOW)
        self.assertEqual((r['files'], r['bytes'], r['skipped_links']), (1, 3, 1))

    def test_reparse_detection_including_non_symlink_directory(self):
        self.assertTrue(_linked(SimpleNamespace(st_mode=stat.S_IFDIR, st_file_attributes=1024)))
        self.assertTrue(_linked(SimpleNamespace(st_mode=stat.S_IFLNK)))
        self.assertFalse(_linked(SimpleNamespace(st_mode=stat.S_IFDIR, st_file_attributes=0)))

    def test_reparse_and_special_entries_are_not_traversed_or_opened(self):
        (self.root/'outputs').mkdir()
        link = SimpleNamespace(name='private-link', stat=unittest.mock.Mock(return_value=SimpleNamespace(
            st_mode=stat.S_IFDIR, st_file_attributes=1024)))
        special = SimpleNamespace(name='private-device', stat=unittest.mock.Mock(return_value=SimpleNamespace(st_mode=stat.S_IFIFO)))
        context = unittest.mock.MagicMock(); context.__enter__.return_value = iter([link, special])
        with patch('musiclab.maintenance_space_fs.os.scandir', return_value=context) as scan:
            r = space_report(self.root, now=NOW)
            self.assertEqual((r['files'], r['bytes'], r['skipped_links'], r['skipped_other']), (0, 0, 1, 1))
            scan.assert_called_once_with(self.root/'outputs')
            link.stat.assert_called_once_with(follow_symlinks=False)
            special.stat.assert_called_once_with(follow_symlinks=False)
            self.assertNotIn('private-', json.dumps(r))

    def test_outputs_regular_file_is_rejected(self):
        (self.root/'outputs').write_bytes(b'abc')
        with self.assertRaises(ValueError): space_report(self.root, now=NOW)

    def test_unreadable_enumeration_has_no_partial_report_or_private_path(self):
        self.file('v1-qa/a')
        with patch('musiclab.maintenance_space_fs.os.scandir', side_effect=PermissionError(str(self.root/'private-label'))):
            with self.assertRaisesRegex(ValueError, '^Outputs metadata could not be fully read$'): space_report(self.root, now=NOW)

    def test_unreadable_stat_has_no_partial_report(self):
        self.file('v1-qa/a')
        fake = SimpleNamespace(name='private-entry', stat=lambda **kwargs: (_ for _ in ()).throw(OSError('private-path')))
        context = unittest.mock.MagicMock(); context.__enter__.return_value = iter([fake])
        with patch('musiclab.maintenance_space_fs.os.scandir', return_value=context):
            with self.assertRaisesRegex(ValueError, '^Outputs metadata could not be fully read$'): space_report(self.root, now=NOW)

    def test_entry_and_depth_limits_refuse_instead_of_truncating(self):
        self.file('v1-qa/a'); self.file('v1-qa/b')
        with patch.object(policy, 'MAX_FILES', 1):
            with self.assertRaisesRegex(ValueError, 'file budget'): space_report(self.root, now=NOW)
        with patch('musiclab.maintenance_space_fs.MAX_DEPTH', 1):
            with self.assertRaisesRegex(ValueError, 'depth budget'): space_report(self.root, now=NOW)

    def test_directory_replacement_observation_refuses(self):
        self.file('v1-qa/a')
        import musiclab.maintenance_space_fs as adapter
        original = adapter.safe_path; calls = 0
        def changed(root, path):
            nonlocal calls
            calls += 1
            if calls == 3:
                (self.root/'outputs').rename(self.root/'moved')
                (self.root/'outputs').mkdir()
            return original(root, path)
        with patch.object(adapter, 'safe_path', changed):
            with self.assertRaisesRegex(ValueError, 'changed during traversal'): space_report(self.root, now=NOW)

    def test_real_cli_report_and_exclusive_receipt(self):
        p = self.file('v1-qa/a'); original = hashlib.sha256(p.read_bytes()).hexdigest()
        args = [sys.executable, '-X', 'utf8', str(ROOT/'scripts/iteration_audit.py'), '--workspace', str(self.root),
                '--space-report', '--out', 'outputs/space.json']
        completed = subprocess.run(args, capture_output=True, text=True, encoding='utf-8', timeout=15)
        self.assertEqual(completed.returncode, 0, completed.stderr)
        r = json.loads(completed.stdout); self.assertEqual(r['format'], 'zoe-outputs-space-report')
        self.assertEqual(r['bytes'], 3); self.assertEqual(r, json.loads((self.root/'outputs/space.json').read_text(encoding='utf-8')))
        self.assertEqual(hashlib.sha256(p.read_bytes()).hexdigest(), original)
        with patch('musiclab.maintenance_space_fs.space_report') as scan, redirect_stdout(io.StringIO()), redirect_stderr(io.StringIO()):
            self.assertEqual(main(args[4:]), 1); scan.assert_not_called()

    def test_cli_incompatible_controls_and_action_exclusivity(self):
        for extra in [['--run-record', 'outputs/a.json'], ['--package-directory', 'outputs/releases/a'], ['--expected-token', 'a'*64]]:
            with self.subTest(extra=extra), redirect_stderr(io.StringIO()), redirect_stdout(io.StringIO()), patch('musiclab.maintenance_space_fs.space_report') as scan:
                self.assertEqual(main(['--workspace', str(self.root), '--space-report', *extra]), 1)
                scan.assert_not_called()
        with redirect_stderr(io.StringIO()), self.assertRaises(SystemExit):
            main(['--space-report', '--prune'])

    def test_default_cli_still_uses_original_audit(self):
        expected = {'format': 'existing-audit', 'mutation': 'none'}
        with patch('scripts.iteration_audit.audit', return_value=expected) as audit, redirect_stdout(io.StringIO()) as stdout:
            self.assertEqual(main(['--workspace', str(self.root)]), 0)
            audit.assert_called_once_with(self.root, [])
            self.assertEqual(json.loads(stdout.getvalue()), expected)


if __name__ == '__main__':
    unittest.main()
