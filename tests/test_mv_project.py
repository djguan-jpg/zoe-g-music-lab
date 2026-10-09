# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
import copy
import hashlib
import json
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest

from musiclab import mv_project as P
from musiclab.draft_contract import CONTRACT

ROOT = Path(__file__).resolve().parents[1]


def project():
    panels = {p: {'fields': {f: '' for f in fields}} for p, fields in CONTRACT['fields'].items()}
    for p, row in CONTRACT['rows'].items():
        panels[p][row['key']] = []
    panels['music'].update(avoid=[], deliverables=[])
    panels['storyboard']['motifs'] = []
    shot = {k: '' for k in CONTRACT['rows']['storyboard']['columns']}
    shot.update(start='00.000', end='4.000', visual='原圖  🎵', screen_direction='neutral')
    panels['storyboard']['shots'] = [shot]
    panels['lyrics']['fields']['lyrics-format'] = '.json'
    panels['lyrics']['cues'] = [{'start': '.5', 'end': '2.00', 'text': '  原文 🎵  '}]
    panels['audio']['fields']['audio-profile'] = 'video'
    draft = {'format': CONTRACT['format'], 'schema_version': 3, 'tool_version': '0.171.0',
             'saved_at': '2026-10-09T00:00:00Z', 'tab': 'storyboard', 'panels': panels}
    return {'format': 'zoe-mv-project', 'schema_version': 1, 'draft': draft, 'shot_ids': ['shot-1'],
            'audio': P.pack('tone.wav', 'audio/wav', b'123'),
            'images': [{'shot_id': 'shot-1', 'asset': P.pack('art.png', 'image/png', b'456')}]}


class MediaProjectTests(unittest.TestCase):
    def test_roundtrip_raw_fields_media_and_source_immutability(self):
        p = project(); before = copy.deepcopy(p)
        result = P.decode(P.encode(p))
        self.assertEqual(result, before)
        self.assertEqual(P.asset(result['audio']), b'123')
        result['draft']['panels']['lyrics']['cues'][0]['text'] = 'edited'
        self.assertEqual(p, before)

    def test_corrupt_bytes_hash_noncanonical_base64_size_and_shape_rejected(self):
        cases = []
        for key, value in [('sha256', '0'*64), ('base64', 'MTI0'), ('base64', 'AB=='), ('size', True),
                           ('name', '../secret'), ('type', 'text/plain')]:
            p = project(); p['audio'][key] = value; cases.append(p)
        p = project(); p['schema_version'] = True; cases.append(p)
        p = project(); p['shot_ids'] = ['../shot']; cases.append(p)
        p = project(); p['images'][0]['shot_id'] = 'gone'; cases.append(p)
        p = project(); p['images'].append(p['images'][0]); cases.append(p)
        for p in cases:
            with self.subTest(p=p), self.assertRaises(ValueError):
                P.validate(p)

    def test_decode_duplicate_keys_bom_depth_and_budget_rejected(self):
        raw = P.encode(project())
        for value in (raw.replace(b'"schema_version":1', b'"schema_version":1,"schema_version":1'), b'\xef\xbb\xbf'+raw):
            with self.assertRaises(ValueError):
                P.decode(value)
        with self.assertRaises(ValueError):
            P.decode(b'['*70+b'0'+b']'*70)

    def test_agent_reorders_by_stable_id_revises_raw_plan_and_preserves_all_assets(self):
        p = project(); second = copy.deepcopy(p['draft']['panels']['storyboard']['shots'][0])
        p['draft']['panels']['storyboard']['shots'].append(second); p['shot_ids'].append('shot-2')
        plan = {'draft': copy.deepcopy(p['draft']), 'shot_ids': ['shot-2', 'shot-1']}
        plan['draft']['panels']['storyboard']['shots'].reverse()
        plan['draft']['panels']['music']['fields']['music-theme'] = '新構思'
        result = P.revise(p, plan)
        self.assertEqual(result['audio'], p['audio']); self.assertEqual(result['images'], p['images'])
        self.assertEqual(result['images'][0]['shot_id'], result['shot_ids'][1])
        self.assertEqual(result['draft']['panels']['music']['fields']['music-theme'], '新構思')
        self.assertNotEqual(result['draft'], p['draft'])
        plan['shot_ids'] = ['new-1', 'new-2']
        with self.assertRaises(ValueError):
            P.revise(p, plan)

    def test_python_and_browser_materialization_acceptance_agree(self):
        cases = [project()]
        for key, value in [('sha256', '0'*64), ('base64', 'AB=='), ('size', False), ('name', '../x')]:
            p = project(); p['audio'][key] = value; cases.append(p)
        expected = []
        for p in cases:
            try:
                P.validate(p); expected.append(True)
            except ValueError:
                expected.append(False)
        code = "const P=require('./web/mv-project.js');let s='';process.stdin.on('data',x=>s+=x);process.stdin.on('end',async()=>{const results=[];for(const p of JSON.parse(s)){try{await P.materialize(p);results.push(true);}catch{results.push(false);}}process.stdout.write(JSON.stringify(results));});"
        run = subprocess.run(['node', '-e', code], cwd=ROOT, input=json.dumps(cases), encoding='utf-8',
                             stdout=subprocess.PIPE, stderr=subprocess.PIPE, timeout=20)
        self.assertEqual(run.returncode, 0, run.stderr); self.assertEqual(json.loads(run.stdout), expected)

    def test_cli_inspect_revise_exclusive_output_and_stale_source_rejection(self):
        with tempfile.TemporaryDirectory(prefix='mv-contract-') as folder:
            root = Path(folder); source = root/'source.zoemv.json'; plan_file = root/'plan.json'; target = root/'changed.zoemv.json'
            original = P.encode(project()); source.write_bytes(original)
            def call(*args):
                return subprocess.run([sys.executable, '-X', 'utf8', 'scripts/mv_project.py', *map(str, args)],
                                      cwd=ROOT, capture_output=True, encoding='utf-8', timeout=20)
            first = call('inspect', '--input', source, '--plan-out', plan_file)
            self.assertEqual(first.returncode, 0, first.stderr)
            receipt = json.loads(first.stdout); self.assertNotIn('base64', first.stdout)
            plan = json.loads(plan_file.read_text(encoding='utf-8')); plan['draft']['panels']['lyrics']['cues'][0]['text'] = 'Agent 另改  🎵'
            plan_file.write_text(json.dumps(plan, ensure_ascii=False), encoding='utf-8')
            bad = call('revise', '--input', source, '--expect-sha256', '0'*64, '--plan', plan_file, '--out', target)
            self.assertNotEqual(bad.returncode, 0); self.assertFalse(target.exists())
            good = call('revise', '--input', source, '--expect-sha256', receipt['source_sha256'], '--plan', plan_file, '--out', target)
            self.assertEqual(good.returncode, 0, good.stderr)
            saved = target.read_bytes(); revised = P.decode(saved)
            self.assertEqual(revised['audio'], project()['audio']); self.assertEqual(revised['images'], project()['images'])
            self.assertEqual(source.read_bytes(), original)
            again = call('revise', '--input', source, '--expect-sha256', receipt['source_sha256'], '--plan', plan_file, '--out', target)
            self.assertNotEqual(again.returncode, 0); self.assertEqual(target.read_bytes(), saved)

    def test_cli_create_uses_only_explicit_media_and_collision_refuses(self):
        with tempfile.TemporaryDirectory(prefix='mv-create-') as folder:
            root = Path(folder); draft = root/'draft.json'; tone = root/'tone.wav'; art = root/'art.png'; out = root/'new.zoemv.json'
            draft.write_text(json.dumps(project()['draft'], ensure_ascii=False), encoding='utf-8'); tone.write_bytes(b'123'); art.write_bytes(b'456')
            args = [sys.executable, '-X', 'utf8', 'scripts/mv_project.py', 'create', '--draft', str(draft), '--audio', str(tone), '--image', 'shot-1='+str(art), '--out', str(out)]
            run = subprocess.run(args, cwd=ROOT, capture_output=True, encoding='utf-8', timeout=20)
            self.assertEqual(run.returncode, 0, run.stderr); created = P.decode(out.read_bytes())
            self.assertEqual(P.asset(created['audio']), tone.read_bytes()); self.assertEqual(P.asset(created['images'][0]['asset'], True), art.read_bytes())
            prior = out.read_bytes(); again = subprocess.run(args, cwd=ROOT, capture_output=True, encoding='utf-8', timeout=20)
            self.assertNotEqual(again.returncode, 0); self.assertEqual(prior, out.read_bytes())


if __name__ == '__main__':
    unittest.main()
