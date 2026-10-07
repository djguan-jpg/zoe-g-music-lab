# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
import importlib.util
import json
from pathlib import Path
import struct
import subprocess
import tempfile
import unittest
from unittest.mock import patch
import zipfile

from musiclab.release_zip import (MAX_ARCHIVE_BYTES, MAX_CENTRAL_BYTES,
    MAX_CENTRAL_ENTRIES, MAX_FOOTER_BYTES, MAX_MANIFEST_BYTES, ZipLayout,
    archive_size, footer_layout, central_entries, manifest_bytes)
from musiclab.release_zip_fs import inspect_archive, write_manifest
from musiclab.maintenance_fs import _zip_budget

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('capacity_packager_tests', ROOT/'scripts/package_release.py')
packager = importlib.util.module_from_spec(spec)
spec.loader.exec_module(packager)


def central(name=b'a'):
    return struct.pack('<4s6H3L5H2L', b'PK\x01\x02', 20, 20, 0, 0, 0, 0,
                       0, 0, 0, len(name), 0, 0, 0, 0, 0, 0) + name


def footer(count, size, offset=0, comment=b'', disk=0, disk_count=None):
    return struct.pack('<4s4H2LH', b'PK\x05\x06', disk, 0,
                       count if disk_count is None else disk_count,
                       count, size, offset, len(comment)) + comment


class ReleaseZipTests(unittest.TestCase):
    def test_archive_size_strict_types_and_exact_boundary(self):
        self.assertEqual(archive_size(MAX_ARCHIVE_BYTES), MAX_ARCHIVE_BYTES)
        for value in [0, -1, True, 1.0, '1', None, MAX_ARCHIVE_BYTES+1]:
            with self.subTest(value=value), self.assertRaises(ValueError): archive_size(value)

    def test_footer_accepts_exact_entry_limit_and_unicode_comment(self):
        raw = central() * MAX_CENTRAL_ENTRIES
        data = raw + footer(MAX_CENTRAL_ENTRIES, len(raw), comment='合成'.encode())
        layout = footer_layout(len(data), data[-MAX_FOOTER_BYTES:])
        self.assertEqual(central_entries(layout, raw).entries, MAX_CENTRAL_ENTRIES)
        self.assertEqual(layout.central_bytes, len(raw))

    def test_footer_rejects_overcount_multidisk_zip64_and_bad_layout(self):
        raw = central()
        cases = [footer(4097,len(raw)), footer(65535,len(raw)), footer(1,len(raw),disk=1),
                 footer(1,len(raw),disk_count=0), footer(1,len(raw),offset=1),
                 footer(1,MAX_CENTRAL_BYTES+1), footer(1,len(raw),comment=b'x')[:-1],
                 b'PK\x05\x06', b'unsupported']
        for end in cases:
            data = raw + end
            with self.subTest(end=end[:22]), self.assertRaises(ValueError): footer_layout(len(data),data)

    def test_footer_requires_complete_bounded_tail(self):
        data = central() + footer(1,len(central()))
        for tail in [data[:-1], bytearray(data), b'']:
            with self.assertRaises(ValueError): footer_layout(len(data),tail)

    def test_actual_central_count_and_variable_spans_are_checked(self):
        raw = central()
        for layout, value in [(ZipLayout(2,len(raw),0),raw),
                              (ZipLayout(1,len(raw),0),b'BAD!'+raw[4:]),
                              (ZipLayout(1,len(raw)-1,0),raw[:-1]),
                              (ZipLayout(1,len(raw),0),raw[:-1]),
                              (ZipLayout(True,len(raw),0),raw),
                              (ZipLayout(1,MAX_CENTRAL_BYTES+1,0),raw)]:
            with self.subTest(layout=layout), self.assertRaises(ValueError): central_entries(layout,value)
        over = raw * (MAX_CENTRAL_ENTRIES+1)
        with self.assertRaisesRegex(ValueError,'entry budget'):
            central_entries(ZipLayout(MAX_CENTRAL_ENTRIES,len(over),0),over)

    def test_central_byte_limit_is_independent_of_entry_count(self):
        # A syntactically bounded central directory with long literal names.
        raw = central(b'x'*65535)*32
        self.assertGreater(len(raw),MAX_CENTRAL_BYTES)
        with self.assertRaises(ValueError): central_entries(ZipLayout(32,len(raw),0),raw)
        self.assertEqual(central_entries(ZipLayout(1,len(central(b'')),0),central(b'')).entries,1)

    def test_manifest_exact_utf8_budget_includes_final_lf(self):
        value = {'name':'原文🎵\r\n'}
        expected = (json.dumps(value,ensure_ascii=False,indent=2,allow_nan=False)+'\n').encode()
        self.assertEqual(manifest_bytes(value),expected)
        overhead = len(manifest_bytes({'name':''}))
        self.assertEqual(len(manifest_bytes({'name':'x'*(MAX_MANIFEST_BYTES-overhead)})),MAX_MANIFEST_BYTES)
        for text in ['x'*(MAX_MANIFEST_BYTES-overhead+1), '🎵'*(MAX_MANIFEST_BYTES//4)]:
            with self.assertRaisesRegex(ValueError,'byte budget'): manifest_bytes({'name':text})

    def test_manifest_refuses_nonfinite_and_invalid_unicode(self):
        for value in [{'note':'\ud800'}, {'note':float('nan')}, {'note':float('inf')}]:
            with self.assertRaises(ValueError): manifest_bytes(value)

    def test_oversized_file_is_rejected_before_open(self):
        with tempfile.TemporaryDirectory(prefix='zoe-zip-stat-') as folder:
            path = Path(folder)/'large.zip'
            with path.open('wb') as target: target.truncate(MAX_ARCHIVE_BYTES+1)
            with patch.object(Path,'open',side_effect=AssertionError('opened oversized file')):
                with self.assertRaisesRegex(ValueError,'archive byte budget'): inspect_archive(path)

    def test_real_zip_shared_reader_has_no_entry_object_allocation(self):
        with tempfile.TemporaryDirectory(prefix='zoe-zip-read-') as folder:
            path = Path(folder)/'source.zip'
            with zipfile.ZipFile(path,'w') as target:
                target.writestr('zoe-g-music-lab/原文.txt','原文\n')
                target.comment = b'synthetic comment'
            with patch('zipfile.ZipFile',side_effect=AssertionError('allocated entries')):
                self.assertEqual(inspect_archive(path).entries,1)
                self.assertIsNone(_zip_budget(path))

    def test_manifest_exclusive_write_and_preflight_preserve_existing_files(self):
        with tempfile.TemporaryDirectory(prefix='zoe-manifest-') as folder:
            path = Path(folder)/'manifest.json'
            value = {'schema_version':2,'note':'原文'}
            write_manifest(path,value)
            original = path.read_bytes()
            self.assertEqual(original,manifest_bytes(value))
            with self.assertRaises(FileExistsError): write_manifest(path,{'different':True})
            self.assertEqual(path.read_bytes(),original)
            missing = Path(folder)/'unissued.json'
            with self.assertRaises(ValueError): write_manifest(missing,{'note':'x'*MAX_MANIFEST_BYTES})
            self.assertFalse(missing.exists())

    def test_real_git_producer_refuses_many_directories_before_zipfile_and_test_children(self):
        with tempfile.TemporaryDirectory(prefix='zoe-capacity-git-') as folder:
            root = Path(folder).resolve()
            def git(*args):
                result = subprocess.run(['git',*args],cwd=root,capture_output=True,timeout=60)
                self.assertEqual(result.returncode,0,result.stderr[-1000:])
                return result.stdout
            git('init','--quiet')
            for key,value in [('user.name','Synthetic capacity test'),('user.email','synthetic@example.invalid'),
                              ('core.autocrlf','false'),('core.attributesFile',''),('commit.gpgsign','false')]: git('config',key,value)
            fixtures = {
                'projects.json':json.dumps({'suite':'ZOE. G Music Lab','version':'0.156.0','release_version':'v0.156.0',
                    'delivery_versions_schema_version':1,'license':'PolyForm-Noncommercial-1.0.0'})+'\n',
                'musiclab/assets/delivery-versions.json':json.dumps({'format':'zoe-delivery-versions','schema_version':1,
                    'current':'0.156.0','supported':['0.38.0','0.156.0']})+'\n',
                'scripts/check_python_tests.py':'raise SystemExit(97)\n',
                **{name:'Synthetic fixture\n' for name in ['LICENSE','NOTICE','README.md','music_lab_agent.py','music_lab_server.py']}}
            for name,text in fixtures.items():
                path=root/name;path.parent.mkdir(parents=True,exist_ok=True);path.write_text(text,encoding='utf-8',newline='\n')
            for i in range(1400):
                path=root/f'd{i}/nested/leaf/source.txt';path.parent.mkdir(parents=True);path.write_bytes(b'Synthetic source\n')
            git('add','--','.');git('commit','--quiet','-m','Synthetic source capacity')
            commit=git('rev-parse','HEAD').decode().strip()
            original_command=packager.command
            commands=[]
            def command(args,cwd=None,input=None,timeout=60):
                commands.append(args)
                self.assertEqual(args[0],'git','Test child must never start')
                raw=original_command(args,cwd=root if cwd is None else cwd,input=input,timeout=timeout)
                if 'archive' in args:
                    # Unknown diagnostic must survive the producer's refusal.
                    output=next(arg[9:] for arg in args if arg.startswith('--output='))
                    (Path(output).parent/'FAILED.txt').write_bytes(b'Existing diagnostic\n')
                return raw
            with patch.object(packager,'ROOT',root), patch.object(packager,'command',command), \
                    patch.object(packager.zipfile,'ZipFile',side_effect=AssertionError('Allocated entries before gate')):
                with self.assertRaisesRegex(ValueError,'central directory budget'): packager.package(commit)
            target=root/'outputs/releases'/('v0.156.0-'+commit[:12])
            self.assertFalse((target/'manifest.json').exists())
            self.assertEqual((target/'FAILED.txt').read_bytes(),b'Existing diagnostic\n')
            archive=target/'zoe-g-music-lab-v0.156.0.zip'
            with zipfile.ZipFile(archive) as source:
                self.assertEqual(len(source.infolist()),5612)
                self.assertEqual(len([e for e in source.infolist() if not e.is_dir()]),1408)
            with self.assertRaisesRegex(ValueError,'central directory budget'): _zip_budget(archive)


if __name__ == '__main__': unittest.main()
