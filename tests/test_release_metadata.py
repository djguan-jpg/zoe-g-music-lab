# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
import copy
from dataclasses import FrozenInstanceError
import importlib.util
import json
from pathlib import Path
import subprocess
import tempfile
import unittest
from unittest.mock import patch

from musiclab.delivery_versions import POLICY
from musiclab.release_metadata import (ReleaseIdentity, validate_metadata,
                                      decode_metadata, MAX_PROJECT_METADATA_BYTES)

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('release_packager_for_tests', ROOT/'scripts/package_release.py')
packager = importlib.util.module_from_spec(spec)
spec.loader.exec_module(packager)


def contract(version='0.79.0'):
    return {'format': 'zoe-delivery-versions', 'schema_version': 1,
            'current': version, 'supported': ['0.38.0', version]}


def metadata(version='0.79.0'):
    return {'version': version, 'release_version': 'v'+version,
            'delivery_versions_schema_version': 1, 'scope_note': '合成資料🎵'}


class ReleaseMetadataTests(unittest.TestCase):
    def test_isolated_immutable_identity_keeps_original_and_ignores_unrelated_metadata(self):
        value=metadata();policy=contract();before=copy.deepcopy((value,policy))
        result=validate_metadata(value,policy)
        self.assertEqual(result,ReleaseIdentity('0.79.0','v0.79.0'))
        self.assertEqual((value,policy),before)
        value['release_version']='changed';policy['supported'].clear()
        self.assertEqual(result.tag,'v0.79.0')
        with self.assertRaises(FrozenInstanceError):result.tag='v0.80.0'

    def test_stale_missing_or_malformed_tags_fail_instead_of_being_inferred(self):
        for tag in ['v0.77.0','0.79.0','v0.079.0','v0.79.0\n','v0.79.0-beta','Ｖ0.79.0',None,True,{},[]]:
            value=dict(metadata(),release_version=tag);before=copy.deepcopy(value)
            with self.subTest(tag=tag),self.assertRaisesRegex(ValueError,'expected tag'):
                validate_metadata(value,contract())
            self.assertEqual(value,before)
        value=metadata();del value['release_version']
        with self.assertRaises(ValueError):validate_metadata(value,contract())

    def test_product_and_schema_must_match_the_same_validated_policy(self):
        for change in [{'version':'0.38.0'},{'version':'0.80.0'},{'version':True},
                       {'delivery_versions_schema_version':True},{'delivery_versions_schema_version':2},
                       {'delivery_versions_schema_version':1.0}]:
            with self.subTest(change=change),self.assertRaises(ValueError):validate_metadata(dict(metadata(),**change),contract())
        for value in [None,[],True]:
            with self.assertRaises(ValueError):validate_metadata(value,contract())
        for policy in [dict(contract(),schema_version=2),dict(contract(),current='0.80.0'),
                       dict(contract(),supported=['0.79.0','0.38.0'])]:
            with self.assertRaises(ValueError):validate_metadata(metadata(),policy)

    def test_strict_decoder_rejects_duplicate_unicode_and_budget_without_repairs(self):
        good=json.dumps(metadata(),ensure_ascii=False)
        self.assertEqual(decode_metadata(good.encode()),metadata())
        for raw in [good.replace('"version":','"version":"0.79.0","version":',1),
                    '\ufeff'+good,b'\xff',' '* (MAX_PROJECT_METADATA_BYTES+1),
                    good.replace('合成資料🎵','bad\\ud800'),good.replace('1,','NaN,',1)]:
            with self.subTest(raw=repr(raw)[:60]),self.assertRaises(ValueError):decode_metadata(raw)

    def test_repository_identity_uses_expected_tag_without_claiming_publication(self):
        value=decode_metadata((ROOT/'projects.json').read_bytes())
        identity=validate_metadata(value,POLICY.descriptor())
        self.assertEqual(identity,ReleaseIdentity(POLICY.current,'v'+POLICY.current))
        self.assertEqual(set(identity.__dict__),{'version','tag'})


class CommittedReleaseTests(unittest.TestCase):
    def setUp(self):
        self.temp=tempfile.TemporaryDirectory(prefix='zoe-release-metadata-')
        self.root=Path(self.temp.name).resolve();self.calls=[]
        self.git('init','--quiet');self.git('config','user.name','Synthetic Test')
        self.git('config','user.email','synthetic@example.invalid')
        self.git('config','core.autocrlf','false');self.git('config','commit.gpgsign','false')
        self.original=packager.command
        self.root_patch=patch.object(packager,'ROOT',self.root)
        self.command_patch=patch.object(packager,'command',self.command)
        self.root_patch.start();self.command_patch.start()

    def tearDown(self):
        self.command_patch.stop();self.root_patch.stop()
        self.assertEqual(self.root.parent,Path(tempfile.gettempdir()).resolve());self.temp.cleanup()

    def git(self,*args):
        result=subprocess.run(['git',*args],cwd=self.root,capture_output=True,timeout=10)
        self.assertEqual(result.returncode,0,result.stderr[-1000:]);return result.stdout.decode().strip()

    def command(self,args,cwd=None,input=None,timeout=60):
        self.calls.append(list(args));return self.original(args,cwd=self.root if cwd is None else cwd,input=input,timeout=timeout)

    def commit(self,value,policy=None,raw=None):
        (self.root/'projects.json').write_text(json.dumps(value,ensure_ascii=False) if raw is None else raw,encoding='utf-8')
        target=self.root/'musiclab/assets/delivery-versions.json';target.parent.mkdir(parents=True,exist_ok=True)
        target.write_text(json.dumps(contract() if policy is None else policy),encoding='utf-8')
        self.git('add','projects.json','musiclab/assets/delivery-versions.json')
        self.git('commit','--quiet','-m','Synthetic release metadata');return self.git('rev-parse','HEAD')

    def test_selected_commit_is_used_even_when_working_metadata_is_newer_or_invalid(self):
        selected=self.commit(metadata(),contract())
        self.commit(metadata('0.80.0'),contract('0.80.0'))
        (self.root/'projects.json').write_text('{broken working file',encoding='utf-8')
        value,identity=packager.committed_metadata(selected)
        self.assertEqual(value,metadata());self.assertEqual(identity,ReleaseIdentity('0.79.0','v0.79.0'))
        self.assertTrue(all(selected in str(call) for call in self.calls))
        self.assertFalse((self.root/'outputs').exists())

    def test_real_stale_commits_refuse_before_archive_or_destination_creation(self):
        cases=[(dict(metadata(),release_version='v0.77.0'),contract(),None),
               (dict(metadata(),version='0.38.0'),contract(),None),
               (metadata(),contract('0.80.0'),None),
               (metadata(),contract(),'{"version":"0.79.0","version":"0.79.0"}')]
        for value,policy,raw in cases:
            selected=self.commit(value,policy,raw);self.calls.clear()
            with self.assertRaises(ValueError):packager.package(selected)
            self.assertFalse((self.root/'outputs').exists())
            self.assertFalse(any(call[1]=='archive' for call in self.calls))

    def test_large_committed_marker_is_rejected_before_show_or_any_output(self):
        selected=self.commit(metadata(),raw=' '* (MAX_PROJECT_METADATA_BYTES+1));self.calls.clear()
        with self.assertRaisesRegex(ValueError,'metadata limit'):packager.package(selected)
        self.assertFalse(any(call[1]=='show' for call in self.calls));self.assertFalse((self.root/'outputs').exists())


if __name__=='__main__':unittest.main()
