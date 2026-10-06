# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
"""Large read-only catalogs must remain separate from bounded recovery writes."""
import json
import subprocess
import sys
import tempfile
import unittest
import weakref
from pathlib import Path
from unittest.mock import patch

from musiclab.maintenance_fs import audit, prune, restore, write_new
from test_maintenance import PackageFixture

ROOT = Path(__file__).resolve().parents[1]


class MaintenanceCatalogTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory(prefix='zoe-catalog-test-')
        self.root = Path(self.temp.name).resolve()
        (self.root / 'projects.json').write_text(json.dumps({'suite': 'ZOE. G Music Lab'}), encoding='utf-8')
        self.releases = self.root / 'outputs/releases'
        self.releases.mkdir(parents=True)

    def tearDown(self):
        self.assertEqual(self.root.parent, Path(tempfile.gettempdir()).resolve())
        self.temp.cleanup()

    def test_real_129_entry_cli_preview_prune_restore_preserves_partial_files(self):
        fixture = PackageFixture(self.root)
        unknown = []
        for index in range(125):
            directory = self.releases / f'partial-{index:03}'
            directory.mkdir()
            path = directory / 'FAILED.txt'
            path.write_bytes(b'original synthetic diagnostic')
            unknown.append(path)
        before = fixture.snapshot()
        args = [sys.executable, '-X', 'utf8', str(ROOT / 'scripts/iteration_audit.py'), '--workspace', str(self.root)]
        reply = subprocess.run(args + ['--out', 'outputs/preview.json'], cwd=self.root.parent,
                               capture_output=True, text=True, encoding='utf-8', timeout=30)
        self.assertEqual(reply.returncode, 0, reply.stdout + reply.stderr)
        report = json.loads(reply.stdout)
        self.assertEqual(len(report['packages']), 4)
        self.assertEqual(len(report['excluded']), 125)
        self.assertEqual(report['protected_versions'], ['0.4.0', '0.3.0', '0.2.0'])
        self.assertEqual(len(report['candidates']), 1)
        self.assertEqual(before, fixture.snapshot())
        result = prune(self.root, report['prune_token'])
        self.assertEqual(len(result['removed']), 1)
        restore(self.root, self.root / result['journal'])
        self.assertEqual(before, fixture.snapshot())
        for path in unknown:
            self.assertEqual(path.read_bytes(), b'original synthetic diagnostic')
        self.assertEqual(len(list(self.releases.iterdir())), 129)

    def test_full_catalog_boundary_and_overflow_refuse_before_package_io(self):
        for index in range(1024):
            (self.releases / f'unknown-{index:04}').mkdir()
        report = audit(self.root)
        self.assertEqual(len(report['excluded']), 1024)
        self.assertEqual(report['candidates'], [])
        extra = self.releases / 'unknown-overflow'
        extra.mkdir()
        original = sorted(path.name for path in self.releases.iterdir())
        with patch('musiclab.maintenance_fs.package_facts') as reader:
            with self.assertRaisesRegex(ValueError, 'Release directory capacity'):
                audit(self.root)
            with self.assertRaisesRegex(ValueError, 'Release directory capacity'):
                prune(self.root, report['prune_token'])
            reader.assert_not_called()
        self.assertEqual(sorted(path.name for path in self.releases.iterdir()), original)
        self.assertFalse((self.root / 'outputs/maintenance').exists())

    def test_each_full_manifest_is_released_before_the_next_package(self):
        class Manifest:
            pass
        references = []
        for index in range(1, 6):
            (self.releases / f'package-{index}').mkdir()
        def read(root, directory, now):
            self.assertFalse(any(reference() is not None for reference in references))
            manifest = Manifest()
            manifest.large_ledger = 'x' * (1024 * 1024)
            references.append(weakref.ref(manifest))
            version = '0.' + directory.name[-1] + '.0'
            relative = directory.relative_to(root).as_posix()
            return {'directory': relative, 'version': version, 'newest_mtime': now,
                    'verified': True, 'reasons': [], 'identity': {'directory': relative},
                    'manifest': manifest}
        with patch('musiclab.maintenance_fs.package_facts', side_effect=read):
            report = audit(self.root)
        self.assertEqual(len(report['packages']), 5)
        self.assertFalse(any(reference() is not None for reference in references))
        self.assertEqual(report['protected_versions'], ['0.5.0', '0.4.0', '0.3.0'])

    def test_129_prune_candidates_refuse_before_rechecks_or_journal_creation(self):
        token = 'a' * 64
        report = {'prune_token': token, 'running_or_unverified': 0,
                  'candidates': [{'directory': f'synthetic-{index}'} for index in range(129)]}
        with patch('musiclab.maintenance_fs.audit', return_value=report), patch('musiclab.maintenance_fs.package_facts') as reader:
            with self.assertRaisesRegex(ValueError, 'Recovery package capacity'):
                prune(self.root, token)
            reader.assert_not_called()
        self.assertFalse((self.root / 'outputs/maintenance').exists())
        self.assertEqual(list(self.releases.iterdir()), [])

    def test_129_recovery_entries_refuse_before_source_reads(self):
        path = write_new(self.root, self.root / 'outputs/maintenance/oversized.json',
                         {'format': 'zoe-iteration-recovery', 'schema_version': 1, 'packages': [{}] * 129})
        before = path.read_bytes()
        with patch('musiclab.maintenance_fs._source_metadata') as source, patch('musiclab.maintenance_fs._rebuild') as rebuild:
            with self.assertRaisesRegex(ValueError, 'Unknown recovery journal version or shape'):
                restore(self.root, path)
            source.assert_not_called()
            rebuild.assert_not_called()
        self.assertEqual(path.read_bytes(), before)
        self.assertEqual(list(self.releases.iterdir()), [])

    def test_128_recovery_entries_pass_count_gate_and_still_validate_every_entry(self):
        path = write_new(self.root, self.root / 'outputs/maintenance/boundary.json',
                         {'format': 'zoe-iteration-recovery', 'schema_version': 1, 'packages': [{}] * 128})
        with self.assertRaisesRegex(ValueError, 'Invalid recovery package entry'):
            restore(self.root, path)
        self.assertEqual(list(self.releases.iterdir()), [])


if __name__ == '__main__':
    unittest.main()
