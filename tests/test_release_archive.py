# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
import copy
import hashlib
import importlib.util
import json
import os
from pathlib import Path
import subprocess
import tempfile
import time
import unittest
import zipfile

from musiclab.release_archive import (RAW_PROFILE, MAX_SOURCE_BYTES,
                                     manifest_profile, archive_args, source_tree)
from musiclab.maintenance_fs import audit, package_facts, prune, restore, _manifest

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('raw_release_packager_tests', ROOT/'scripts/package_release.py')
packager = importlib.util.module_from_spec(spec);spec.loader.exec_module(packager)


class ArchiveProfileTests(unittest.TestCase):
    def test_manifest_versions_are_explicit_and_do_not_migrate_legacy(self):
        values = [{'schema_version':1}, {'schema_version':2,'archive_profile':RAW_PROFILE}]
        original = copy.deepcopy(values)
        self.assertIsNone(manifest_profile(values[0]));self.assertEqual(manifest_profile(values[1]),RAW_PROFILE)
        self.assertEqual(values,original)
        for value in [None,{}, {'schema_version':True}, {'schema_version':2.0},
                      {'schema_version':3,'archive_profile':RAW_PROFILE},
                      {'schema_version':1,'archive_profile':RAW_PROFILE},
                      {'schema_version':2}, {'schema_version':2,'archive_profile':'unknown'},
                      {'schema_version':2,'archive_profile':None}]:
            with self.subTest(value=value),self.assertRaises(ValueError):manifest_profile(value)
        self.assertEqual(archive_args('a'*40,'selected.zip',None)[0],'archive')
        with self.assertRaises(ValueError):archive_args('a'*40,'selected.zip','unknown')

    def test_source_tree_preserves_unicode_and_rejects_unsafe_or_nonblob_entries(self):
        raw=b'100644 blob '+b'a'*40+b' 0\t'+ '原文🎵.txt'.encode()+b'\0'
        result=source_tree(raw);self.assertEqual(result,{'原文🎵.txt':{'oid':'a'*40,'size':0}})
        for bad in [b'',raw[:-1],raw+raw,raw.replace(b'100644',b'120000'),
                    raw.replace(b'blob',b'commit'),raw.replace(b'a'*40,b'x'*40),
                    raw.replace('原文🎵.txt'.encode(),b'../private.txt'),
                    raw.replace('原文🎵.txt'.encode(),b'outputs/file.txt'),
                    raw.replace('原文🎵.txt'.encode(),b'.env'),
                    raw.replace('原文🎵.txt'.encode(),b'a//b'),
                    raw.replace('原文🎵.txt'.encode(),b'bad\xff'),
                    raw.replace(b' 0\t',b' 01\t')]:
            with self.subTest(raw=bad[:80]),self.assertRaises(ValueError):source_tree(bad)

    def test_source_tree_budget_is_checked_before_archive_creation(self):
        line=b'100644 blob '+b'a'*40+b' '+str(MAX_SOURCE_BYTES).encode()+b'\tone.txt\0'
        self.assertEqual(source_tree(line)['one.txt']['size'],MAX_SOURCE_BYTES)
        with self.assertRaises(ValueError):source_tree(line+line.replace(b'one.txt',b'two.txt'))
        many=b''.join(b'100644 blob '+b'a'*40+b' 0\t'+str(i).encode()+b'.txt\0' for i in range(2001))
        with self.assertRaises(ValueError):source_tree(many)
        with self.assertRaises(ValueError):source_tree(line.replace(str(MAX_SOURCE_BYTES).encode(),b'9'*10000))


class GitArchiveTests(unittest.TestCase):
    def setUp(self):
        self.temp=tempfile.TemporaryDirectory(prefix='zoe-raw-archive-')
        self.base=Path(self.temp.name).resolve();self.root=self.base/'repo';self.root.mkdir()
        self.git('init','--quiet')
        for key,value in [('user.name','Synthetic archive test'),('user.email','synthetic@example.invalid'),
                          ('core.autocrlf','false'),('core.attributesFile',''),('commit.gpgsign','false')]:self.git('config',key,value)
        self.sources={'literal.txt':b'LF line\ncommit $Format:%H$\n',
                      'mixed.bin':b'\x00\xff\r\n\noriginal', '原文🎵.txt':'原字\n'.encode()}
        for name,raw in self.sources.items():(self.root/name).write_bytes(raw)
        self.git('add','--',*self.sources);self.git('commit','--quiet','-m','Synthetic raw source')
        self.commit=self.git('rev-parse','HEAD').decode().strip()

    def tearDown(self):
        self.assertEqual(self.base.parent,Path(tempfile.gettempdir()).resolve());self.temp.cleanup()

    def git(self,*args):
        process=subprocess.run(['git',*args],cwd=self.root,capture_output=True,timeout=15)
        self.assertEqual(process.returncode,0,process.stderr[-1000:]);return process.stdout

    def archive(self,name,profile=RAW_PROFILE,outer=()):
        target=self.base/name;self.assertFalse(target.exists())
        self.git(*outer,*archive_args(self.commit,target,profile));return target

    def objects(self):return source_tree(self.git('ls-tree','-r','-z','--long',self.commit))

    def release(self,minor,modern=True):
        version=f'0.{minor}.0'
        (self.root/'projects.json').write_bytes((json.dumps({'suite':'ZOE. G Music Lab','version':version,'license':'PolyForm-Noncommercial-1.0.0'})+'\n').encode())
        self.git('add','projects.json');self.git('commit','--quiet','-m','Synthetic release '+version)
        self.commit=self.git('rev-parse','HEAD').decode().strip();self.git('tag','v'+version,self.commit)
        folder=self.root/'outputs/releases'/f'v{version}-{self.commit[:12]}';folder.mkdir(parents=True)
        archive=folder/f'zoe-g-music-lab-v{version}.zip'
        self.git(*archive_args(self.commit,archive,RAW_PROFILE if modern else None))
        with zipfile.ZipFile(archive) as z:files=packager.entries(z,self.objects() if modern else None)
        data={'schema_version':2 if modern else 1,'commit':self.commit,'version':version,
              'license':'PolyForm-Noncommercial-1.0.0','archive':archive.name,
              'sha256':hashlib.sha256(archive.read_bytes()).hexdigest(),'bytes':archive.stat().st_size,'files':files}
        if modern:data['archive_profile']=RAW_PROFILE
        (folder/'manifest.json').write_bytes((json.dumps(data,ensure_ascii=False)+'\n').encode())
        for p in folder.iterdir():os.utime(p,(time.time()-8*86400,)*2)
        return folder

    def test_fixed_profile_keeps_all_raw_bytes_when_autocrlf_and_eol_change(self):
        before=self.archive('legacy.zip',None,('-c','core.autocrlf=true'))
        after=[self.archive('raw-'+value+'.zip',outer=('-c','core.autocrlf='+value,'-c','core.eol=crlf')) for value in ['true','false']]
        self.assertEqual(after[0].read_bytes(),after[1].read_bytes())
        with zipfile.ZipFile(before) as z:self.assertNotEqual(z.read('zoe-g-music-lab/literal.txt'),self.sources['literal.txt'])
        for path in after:
            with zipfile.ZipFile(path) as z:
                ledger=packager.entries(z,self.objects());self.assertEqual(set(ledger),set(self.sources))
                for name,raw in self.sources.items():self.assertEqual(z.read('zoe-g-music-lab/'+name),raw)

    def test_global_export_attributes_are_disabled_without_mutating_config(self):
        attributes=self.base/'synthetic-global-attributes';attributes.write_text('literal.txt export-ignore\n',encoding='utf-8')
        outer=('-c','core.attributesFile='+str(attributes))
        legacy=self.archive('global-legacy.zip',None,outer)
        modern=self.archive('global-modern.zip',RAW_PROFILE,outer)
        with zipfile.ZipFile(legacy) as z:self.assertNotIn('zoe-g-music-lab/literal.txt',z.namelist())
        with zipfile.ZipFile(modern) as z:packager.entries(z,self.objects());self.assertEqual(z.read('zoe-g-music-lab/literal.txt'),self.sources['literal.txt'])
        self.assertEqual(self.git('config','--get','core.attributesFile').strip(),b'')

    def test_repository_substitution_cannot_issue_raw_blob_proof(self):
        (self.root/'.git/info/attributes').write_text('literal.txt export-subst\n',encoding='utf-8')
        archive=self.archive('substitution.zip')
        with zipfile.ZipFile(archive) as z:
            self.assertNotEqual(z.read('zoe-g-music-lab/literal.txt'),self.sources['literal.txt'])
            with self.assertRaisesRegex(ValueError,'immutable Git'):packager.entries(z,self.objects())

    def test_repository_export_omission_cannot_issue_complete_source_proof(self):
        (self.root/'.git/info/attributes').write_text('literal.txt export-ignore\n',encoding='utf-8')
        archive=self.archive('omitted.zip')
        with zipfile.ZipFile(archive) as z:
            with self.assertRaisesRegex(ValueError,'omits'):packager.entries(z,self.objects())

    def test_modern_prune_restore_reproduces_original_manifest_and_zip_after_config_change(self):
        self.git('config','core.autocrlf','true');folders=[self.release(i) for i in range(1,5)]
        snapshot={str(p.relative_to(self.root)):p.read_bytes() for folder in folders for p in folder.iterdir()}
        self.git('config','core.autocrlf','false');self.git('config','core.eol','crlf')
        report=audit(self.root);self.assertEqual(report['protected_versions'],['0.4.0','0.3.0','0.2.0']);self.assertEqual(len(report['candidates']),1)
        result=prune(self.root,report['prune_token']);self.assertEqual(len(result['removed']),1)
        restored=restore(self.root,self.root/result['journal']);self.assertEqual(len(restored['restored']),1)
        self.assertEqual(snapshot,{str(p.relative_to(self.root)):p.read_bytes() for folder in folders for p in folder.iterdir()})
        with self.assertRaisesRegex(ValueError,'existing'):restore(self.root,self.root/result['journal'])

    def test_legacy_reconstruction_mismatch_is_retained_without_profile_inference(self):
        self.git('config','core.autocrlf','true');folder=self.release(1,modern=False)
        original={p.name:p.read_bytes() for p in folder.iterdir()};self.git('config','core.autocrlf','false')
        fact=package_facts(self.root,folder,time.time());self.assertFalse(fact['verified']);self.assertIn('git_bytes_not_reproducible',fact['reasons'])
        self.assertEqual(original,{p.name:p.read_bytes() for p in folder.iterdir()});self.assertNotIn('archive_profile',_manifest(folder/'manifest.json'))

    def test_self_consistent_modern_manifest_cannot_hide_wrong_source_bytes(self):
        folder=self.release(1);data=json.loads((folder/'manifest.json').read_bytes());archive=folder/data['archive']
        with zipfile.ZipFile(archive) as z:files={i.filename:z.read(i) for i in z.infolist() if not i.is_dir()}
        files['zoe-g-music-lab/literal.txt']=b'Altered source\n'
        with zipfile.ZipFile(archive,'w') as z:
            for name,raw in files.items():z.writestr(name,raw)
        data['files']={n.removeprefix('zoe-g-music-lab/'):hashlib.sha256(raw).hexdigest() for n,raw in files.items()};data['sha256']=hashlib.sha256(archive.read_bytes()).hexdigest();data['bytes']=archive.stat().st_size
        (folder/'manifest.json').write_bytes((json.dumps(data)+'\n').encode())
        fact=package_facts(self.root,folder,time.time());self.assertFalse(fact['verified']);self.assertIn('tag_or_source_unverified',fact['reasons'])


if __name__=='__main__':unittest.main()
