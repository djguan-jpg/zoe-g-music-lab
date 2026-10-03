# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
import json
import subprocess
import tempfile
import unittest
from pathlib import Path
from musiclab.application import build

ROOT = Path(__file__).resolve().parents[1]


class PlanningHandoffTests(unittest.TestCase):
    def test_actual_browser_contract_roundtrip_preserves_shared_domain_outputs(self):
        music = json.loads((ROOT / 'examples/first-light-music.json').read_text(encoding='utf-8'))
        music.update(language='English', avoid=['one item\nwith two lines'], deliverables=['two choruses','notes'])
        mv = json.loads((ROOT / 'examples/first-light-mv.json').read_text(encoding='utf-8'))
        mv['motifs'].append({'name':'信封','meaning':'回應'})
        mv['shots'][1]['motif'] = '信封'
        script = """
const path=require('node:path'),fs=require('node:fs'),root=process.argv[1];
const E=require(path.join(root,'web/editor-state.js')),P=require(path.join(root,'web/planning-import.js'));
const cases=JSON.parse(fs.readFileSync(0,'utf8'));
const panels={};for(const [name,fields] of Object.entries(E.draftFields)){
  panels[name]={fields:Object.fromEntries(fields.map(field=>[field,'']))};
  if(E.draftRows[name])panels[name][E.draftRows[name].key]=[];
}
panels.music.avoid=[];panels.music.deliverables=[];panels.storyboard.motifs=[];
panels.lyrics.fields['lyrics-format']='.lrc';panels.audio.fields['audio-profile']='video';
const draft={format:'zoe-music-lab-draft',schema_version:3,tool_version:'0.6.0',saved_at:'2026-10-03',tab:'lyrics',panels};
process.stdout.write(JSON.stringify(cases.map(({operation,payload})=>
  P.planningBrief(P.planningDraft(draft,operation,payload),operation))));
"""
        cases = [{'operation':'music','payload':music},{'operation':'storyboard','payload':mv}]
        with tempfile.TemporaryDirectory() as folder:
            result = subprocess.run(['node','-e',script,str(ROOT)], cwd=folder,
                                    input=json.dumps(cases,ensure_ascii=False), capture_output=True,
                                    text=True, encoding='utf-8',timeout=10)
            self.assertEqual(result.returncode,0,result.stderr)
            self.assertEqual(list(Path(folder).iterdir()),[])
        for case, returned in zip(cases,json.loads(result.stdout)):
            with self.subTest(operation=case['operation']):
                original_result = build(case['operation'],case['payload'])
                returned_result = build(case['operation'],returned)
                self.assertEqual(returned_result.data,original_result.data)
                for name, content in original_result.files.items():
                    if name != 'mv-brief.json':  # This artifact retains raw number/string types and source annotation.
                        self.assertEqual(returned_result.files[name],content)


if __name__=='__main__':
    unittest.main()
