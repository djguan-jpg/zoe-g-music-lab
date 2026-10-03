# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
import copy
import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path
from musiclab.application import build, capabilities
from musiclab.tool_contracts import payload_schema
from music_lab_mcp import tool_list

ROOT = Path(__file__).resolve().parents[1]


def music():
    return json.loads((ROOT/'examples/first-light-music.json').read_text(encoding='utf-8'))


class SeedTests(unittest.TestCase):
    def test_real_song_handoff_is_incomplete_contiguous_and_does_not_invent_visuals(self):
        result = build('storyboard_seed', {'music': music()})
        data = result.data
        self.assertTrue(result.needs_review)
        self.assertEqual(set(result.files), {'storyboard-seed.json', 'storyboard-seed.md'})
        self.assertEqual(json.loads(result.files['storyboard-seed.json']), data)
        self.assertEqual((data['schema_version'], data['status']), (1, 'timing_seed_incomplete'))
        self.assertEqual((data['duration_seconds'],len(data['slots'])), (136,17))
        cursor, bar = 0, 1
        for slot in data['slots']:
            self.assertEqual(slot['start'], cursor)
            self.assertEqual(slot['bar_start'], bar)
            self.assertLessEqual(slot['bar_end']-bar+1,4)
            self.assertGreater(slot['end_frame_exclusive'],slot['start_frame'])
            self.assertFalse(set(slot)&{'visual','camera','transition','motif','character_state'})
            cursor,bar = slot['end'],slot['bar_end']+1
        self.assertEqual((cursor,bar),(136,69))
        self.assertIn('須人工編寫',result.files['storyboard-seed.md'])

    def test_numeric_strings_partial_bars_and_repeated_names_preserve_section_boundaries(self):
        brief=music(); brief['title']='  原創起稿  '
        brief['arrangement']=[dict(brief['arrangement'][0],bars='5'),dict(brief['arrangement'][0],bars='3')]
        data=build('storyboard_seed',{'music':brief,'fps':'29.97','bars_per_shot':'4'}).data
        self.assertEqual(data['title'],'原創起稿')
        self.assertEqual([(s['bar_start'],s['bar_end']) for s in data['slots']],[(1,4),(5,5),(6,8)])
        self.assertEqual([s['start'] for s in data['slots']],[0,8,10])
        self.assertEqual(data['fps'],29.97)

    def test_fractional_tempo_rounding_covers_exact_domain_duration(self):
        for bpm,beats,chunk in [(123.456,3,3),(299.99,1,1),(20,12,128)]:
            brief=music();brief.update(bpm=bpm,beats_per_bar=beats)
            brief['arrangement']=[dict(brief['arrangement'][0],bars=7),dict(brief['arrangement'][1],bars=9)]
            plan=build('music',brief).data;seed=build('storyboard_seed',{'music':brief,'fps':120,'bars_per_shot':chunk}).data
            self.assertEqual(seed['duration_seconds'],plan['duration_seconds'])
            self.assertEqual(seed['slots'][-1]['end'],plan['duration_seconds'])
            for prev,nxt in zip(seed['slots'],seed['slots'][1:]):self.assertEqual(prev['end'],nxt['start'])

    def test_invalid_options_unknown_fields_and_legacy_inputs_refuse(self):
        for option,value in [('fps',True),('fps',0),('fps',121),('fps',float('nan')),
                             ('bars_per_shot',True),('bars_per_shot',0),('bars_per_shot',1.5),('bars_per_shot',129)]:
            with self.subTest(option=option,value=value),self.assertRaises(ValueError):
                build('storyboard_seed',{'music':music(),option:value})
        for payload in [{},{'music':[]},{'music':{'duration_seconds':24}}, {'music':music(),'path':'x'}]:
            with self.assertRaises(ValueError):build('storyboard_seed',payload)

    def test_invalid_song_and_subframe_slots_refuse_without_partial_files(self):
        brief=music();brief['arrangement'][0]['focus']=''
        with self.assertRaisesRegex(ValueError,'敘事'):build('storyboard_seed',{'music':brief})
        brief=music();brief.update(bpm=300,beats_per_bar=1)
        with self.assertRaisesRegex(ValueError,'影格'):build('storyboard_seed',{'music':brief,'fps':1,'bars_per_shot':1})

    def test_limit_is_checked_before_allocating_and_larger_chunk_recovers(self):
        brief=music();brief.update(bpm=300,beats_per_bar=1)
        brief['arrangement']=[dict(brief['arrangement'][0],bars=128) for _ in range(40)]
        with self.assertRaisesRegex(ValueError,'1000'):build('storyboard_seed',{'music':brief,'bars_per_shot':1})
        self.assertEqual(len(build('storyboard_seed',{'music':brief,'bars_per_shot':128}).data['slots']),40)

    def test_source_request_preserved_and_every_seed_requires_human_review(self):
        payload={'music':music(),'bars_per_shot':8};before=copy.deepcopy(payload)
        result=build('storyboard_seed',payload)
        self.assertEqual(payload,before); self.assertTrue(result.needs_review)
        self.assertEqual(result.data['source']['timing_assumption'],'constant_tempo_no_pickup')
        self.assertIn('沒有弱起',result.data['review_notes'][0])

    def test_discovery_exposes_seed_schema_without_writes_or_media(self):
        schema=payload_schema('storyboard_seed')
        self.assertFalse(schema['additionalProperties'])
        self.assertIn('arrangement',schema['properties']['music']['required'])
        tool={t['name']:t for t in tool_list()}['storyboard_seed']
        self.assertTrue(tool['annotations']['readOnlyHint']);self.assertFalse(tool['annotations']['openWorldHint'])
        self.assertEqual(len(capabilities()['operations']),10)

    def test_real_cli_from_another_directory_matches_bytes_and_refuses_overwrite(self):
        source=ROOT/'examples/first-light-music.json';before=source.read_bytes()
        with tempfile.TemporaryDirectory() as temp:
            out=Path(temp)/'seed'
            args=[sys.executable,'-X','utf8',str(ROOT/'music_lab.py'),'storyboard-seed','--brief',str(source),'--fps','29.97','--bars-per-shot','5','--out',str(out)]
            process=subprocess.run(args,cwd=temp,capture_output=True,encoding='utf-8',timeout=10)
            self.assertEqual(process.returncode,0,process.stderr)
            expected=build('storyboard_seed',{'music':music(),'fps':29.97,'bars_per_shot':5}).files
            for name,content in expected.items():self.assertEqual((out/name).read_bytes().decode('utf-8'),content)
            original={p.name:p.read_bytes() for p in out.iterdir()}
            repeat=subprocess.run(args,cwd=temp,capture_output=True,encoding='utf-8',timeout=10)
            self.assertEqual(repeat.returncode,1);self.assertIn('--overwrite',repeat.stderr)
            self.assertEqual({p.name:p.read_bytes() for p in out.iterdir()},original)
        self.assertEqual(source.read_bytes(),before)

    def test_browser_seed_draft_roundtrip_remains_incomplete_until_manual_writing(self):
        payload={'music':music()};result=build('storyboard_seed',payload)
        script="""
const fs=require('node:fs'),path=require('node:path'),root=process.argv[1];
const E=require(path.join(root,'web/editor-state.js')),P=require(path.join(root,'web/planning-import.js')),S=require(path.join(root,'web/storyboard-seed.js'));
const input=JSON.parse(fs.readFileSync(0,'utf8')),panels={};
for(const [name,fields] of Object.entries(E.draftFields)){panels[name]={fields:Object.fromEntries(fields.map(key=>[key,'']))};if(E.draftRows[name])panels[name][E.draftRows[name].key]=[];}
panels.music.avoid=[];panels.music.deliverables=[];panels.storyboard.motifs=[];panels.lyrics.fields['lyrics-format']='.lrc';panels.audio.fields['audio-profile']='video';
let draft={format:'zoe-music-lab-draft',schema_version:3,tool_version:'0.14.0',saved_at:'2026-10-03',tab:'music',panels};
draft=P.planningDraft(P.planningDraft(draft,'music',input.music),'storyboard',input.mv);
const incomplete=S.seedDraft(draft,input.seed),complete=structuredClone(incomplete),source=draft.panels.storyboard.shots[0];
for(const row of complete.panels.storyboard.shots)for(const key of ['visual','camera','transition','motif_state','character_state','motif_id'])row[key]=source[key];
process.stdout.write(JSON.stringify({incomplete,brief:P.planningBrief(complete,'storyboard')}));
"""
        mv=json.loads((ROOT/'examples/first-light-mv.json').read_text(encoding='utf-8'))
        process=subprocess.run(['node','-e',script,str(ROOT)],cwd=ROOT,
            input=json.dumps({'music':music(),'mv':mv,'seed':result.data},ensure_ascii=False),capture_output=True,encoding='utf-8',timeout=10)
        self.assertEqual(process.returncode,0,process.stderr)
        returned=json.loads(process.stdout)
        from musiclab.draft_contract import validate_draft
        validate_draft(returned['incomplete'])
        panel=returned['incomplete']['panels']['storyboard']
        self.assertEqual(panel['shots'][0]['visual'],'')
        completed=build('storyboard',returned['brief'])
        self.assertEqual((completed.data['duration_seconds'],len(completed.data['shots'])),(136,17))
        self.assertEqual(set(completed.files),{'mv-brief.json','storyboard.json','storyboard.csv','prompts.md','continuity.md'})

    def test_real_jsonlines_failure_then_seed_matches_application_and_writes_nothing(self):
        payload={'music':music(),'bars_per_shot':8}
        requests=[{'protocol_version':1,'id':'bad','operation':'storyboard_seed','payload':{'music':{}}},
                  {'protocol_version':1,'id':'ok','operation':'storyboard_seed','payload':payload}]
        with tempfile.TemporaryDirectory() as temp:
            result=subprocess.run([sys.executable,'-X','utf8',str(ROOT/'music_lab_agent.py')],cwd=temp,
                input=''.join(json.dumps(r,ensure_ascii=False)+'\n' for r in requests),capture_output=True,encoding='utf-8',timeout=10)
            self.assertEqual(result.returncode,0,result.stderr)
            replies=[json.loads(line) for line in result.stdout.splitlines()]
            self.assertFalse(replies[0]['ok']);self.assertTrue(replies[1]['ok'])
            self.assertEqual(replies[1]['result'],build('storyboard_seed',payload).wire())
            self.assertEqual(list(Path(temp).iterdir()),[])


if __name__=='__main__':unittest.main()
