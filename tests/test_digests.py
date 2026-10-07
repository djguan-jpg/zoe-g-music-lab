# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
"""Cold discovery and original standard-provider digest behavior."""
import hashlib
import json
import subprocess
import sys
import unittest
from pathlib import Path
from unittest.mock import patch
from musiclab import digests

ROOT=Path(__file__).resolve().parents[1]


class DigestTests(unittest.TestCase):
    def test_cold_application_discovery_does_not_load_a_digest_provider(self):
        code="""import sys,json
assert 'hashlib' not in sys.modules and '_hashlib' not in sys.modules
class RefuseProvider:
 def find_spec(self,name,path=None,target=None):
  if name in ('hashlib','_hashlib'):raise RuntimeError('provider requested during discovery')
sys.meta_path.insert(0,RefuseProvider())
from musiclab.application import capabilities
data=capabilities()
assert 'hashlib' not in sys.modules and '_hashlib' not in sys.modules
print(json.dumps({'operations':len(data['operations']),'protocol':data['protocol_version']}))
"""
        result=subprocess.run([sys.executable,'-X','utf8','-c',code],cwd=ROOT,capture_output=True,text=True,encoding='utf-8',timeout=15)
        self.assertEqual(result.returncode,0,result.stderr)
        self.assertEqual(json.loads(result.stdout),{'operations':22,'protocol':1})

    def test_known_sha_vectors_and_large_raw_bytes_match_standard_provider(self):
        self.assertEqual(digests.sha256(b'abc').hexdigest(),'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad')
        self.assertEqual(digests.sha1(b'abc',usedforsecurity=False).hexdigest(),'a9993e364706816aba3e25717850c26c9cd0d89d')
        for data in (b'',b'abc',bytes(range(256))*4096,b'a'*1000000):
            for name in ('sha256','sha1'):
                actual=getattr(digests,name)(data,usedforsecurity=False)
                expected=getattr(hashlib,name)(data,usedforsecurity=False)
                self.assertEqual(type(actual),type(expected))
                self.assertEqual(actual.digest(),expected.digest())
                self.assertEqual((actual.name,actual.block_size,actual.digest_size),(expected.name,expected.block_size,expected.digest_size))

    def test_streaming_buffers_and_copy_keep_original_native_objects(self):
        for name in ('sha256','sha1'):
            actual=getattr(digests,name)(b'prefix',usedforsecurity=False); expected=getattr(hashlib,name)(b'prefix',usedforsecurity=False)
            for data in (bytearray(b'\0raw'),memoryview(b'original\0bytes'),b'x'*65536):
                actual.update(data);expected.update(data)
            branch=actual.copy();branch.update(b'changed')
            self.assertEqual(actual.digest(),expected.digest())
            expected_branch=expected.copy();expected_branch.update(b'changed')
            self.assertEqual(branch.hexdigest(),expected_branch.hexdigest())

    def test_constructor_keywords_and_invalid_input_errors_are_forwarded(self):
        for name in ('sha256','sha1'):
            for args,kwargs in [((None,),{}),(('text',),{}),((b'x',),{'unknown':True}),((b'x',b'y'),{})]:
                try:getattr(hashlib,name)(*args,**kwargs)
                except Exception as expected:
                    with self.assertRaises(type(expected)):getattr(digests,name)(*args,**kwargs)
                else:self.fail('Synthetic invalid input unexpectedly accepted')

    def test_provider_failure_is_preserved_without_substitute_or_retry(self):
        for name in ('sha256','sha1'):
            with patch('hashlib.'+name,side_effect=ValueError('provider refuses')) as constructor:
                with self.assertRaisesRegex(ValueError,'provider refuses'):getattr(digests,name)(b'raw',usedforsecurity=False)
                constructor.assert_called_once_with(b'raw',usedforsecurity=False)


if __name__=='__main__':unittest.main()
