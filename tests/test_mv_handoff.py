# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
import base64
import copy
import hashlib
import io
import json
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest
import zipfile

from musiclab import mv_project as P, mv_handoff as H
from test_mv_project import project

ROOT = Path(__file__).resolve().parents[1]


class HandoffTests(unittest.TestCase):
    def test_standard_zip_extracts_original_bytes_explicit_cues_and_stable_shot_mapping(self):
        p = project()
        before = copy.deepcopy(p)
        raw, manifest = H.prepare(p)
        self.assertEqual(p, before)
        self.assertEqual(H.prepare(p)[0], raw)
        with zipfile.ZipFile(io.BytesIO(raw)) as archive:
            self.assertIsNone(archive.testzip())
            self.assertEqual(archive.read('audio-source.wav'), P.asset(p['audio']))
            self.assertEqual(archive.read('image-0001.png'), P.asset(p['images'][0]['asset'], True))
            self.assertEqual(json.loads(archive.read('music-video.plan.json')), {'draft': p['draft'], 'shot_ids': p['shot_ids']})
            self.assertEqual(json.loads(archive.read('HANDOFF-MANIFEST.json')), manifest)
            self.assertIn(b'00:00:00,500 --> 00:00:02,000', archive.read('subtitles.srt'))
            for entry in manifest['files']:
                data = archive.read(entry['name'])
                self.assertEqual(len(data), entry['bytes'])
                self.assertEqual(hashlib.sha256(data).hexdigest(), entry['sha256'])
            for info in archive.infolist():
                self.assertEqual(info.compress_type, zipfile.ZIP_STORED)
                self.assertEqual(info.date_time, (1980, 1, 1, 0, 0, 0))
                self.assertEqual(info.flag_bits, 0)
                self.assertNotIn('/', info.filename)
        self.assertFalse(manifest['media_transcoded'])
        self.assertFalse(manifest['creative_acceptance'])
        self.assertNotIn('base64', json.dumps(manifest))

    def test_javascript_zip_and_every_metadata_byte_agree_with_standard_python_writer(self):
        code = "const P=require('./web/mv-project.js'),H=require('./web/mv-handoff.js');let s='';process.stdin.on('data',b=>s+=b);process.stdin.on('end',async()=>{const p=await P.materialize(JSON.parse(s));const data=await H.prepare({draft:p.project.draft,shot_ids:p.project.shot_ids,audio:p.audio,images:p.images.map(i=>({shot_id:i.shot_id,asset:{name:i.name,type:i.type,bytes:i.bytes}}))});process.stdout.write(Buffer.from(data.bytes).toString('base64'));});"
        p = project()
        p['audio']['name'] = 'CON.WAV'
        p['images'][0]['asset']['name'] = '原圖 .png'
        expected, _ = H.prepare(p)
        result = subprocess.run(['node', '-e', code], cwd=ROOT, input=json.dumps(p), text=True,
                                capture_output=True, timeout=20)
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(base64.b64decode(result.stdout), expected)

    def test_missing_ends_empty_text_overlap_bad_hash_or_no_audio_refuse_without_mutation(self):
        cases = []
        for value in ['', ' ', '-1', 'NaN', '0']:
            p = project(); p['draft']['panels']['lyrics']['cues'][0]['end'] = value; cases.append(p)
        for value in [' ', '\t', '\0', 'line\nline']:
            p = project(); p['draft']['panels']['lyrics']['cues'][0]['text'] = value; cases.append(p)
        p = project(); p['audio']['sha256'] = '0' * 64; cases.append(p)
        p = project(); p['audio'] = None; cases.append(p)
        p = project(); p['draft']['panels']['lyrics']['cues'].append({'start': '1', 'end': '2', 'text': '重疊'}); cases.append(p)
        for p in cases:
            before = copy.deepcopy(p)
            with self.subTest(p=p['audio'] is None), self.assertRaises(ValueError):
                H.prepare(p)
            self.assertEqual(p, before)

    def test_cli_requires_same_project_hash_and_never_overwrites_source_or_archive(self):
        with tempfile.TemporaryDirectory(prefix='mv-handoff-') as folder:
            root = Path(folder); source = root / 'source.zoemv.json'; out = root / 'handoff.zip'
            original = P.encode(project()); source.write_bytes(original)
            def call(expected, target=out):
                return subprocess.run([sys.executable, '-B', '-X', 'utf8', 'scripts/mv_project.py', 'handoff',
                    '--input', str(source), '--expect-sha256', expected, '--out', str(target)],
                    cwd=ROOT, capture_output=True, encoding='utf-8', timeout=20)
            bad = call('0' * 64)
            self.assertNotEqual(bad.returncode, 0); self.assertFalse(out.exists())
            expected = hashlib.sha256(original).hexdigest()
            good = call(expected)
            self.assertEqual(good.returncode, 0, good.stderr)
            saved = out.read_bytes(); self.assertEqual(saved, H.prepare(project())[0])
            self.assertNotIn('base64', good.stdout)
            self.assertNotEqual(call(expected).returncode, 0); self.assertEqual(out.read_bytes(), saved)
            self.assertNotEqual(call(expected, source).returncode, 0); self.assertEqual(source.read_bytes(), original)


if __name__ == '__main__':
    unittest.main()
