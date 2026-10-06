# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
import copy
import json
import subprocess
import unittest
from pathlib import Path
from musiclab.application import build, capabilities
from musiclab.storyboard_review import review as whole
from musiclab.storyboard_shot_review import review, markdown
from musiclab.tool_contracts import payload_schema, output_schema
from music_lab_mcp import tool_list

ROOT = Path(__file__).resolve().parents[1]


def partial(count=120):
    panel = json.loads((ROOT/'examples/unfinished-storyboard-review.json').read_text(encoding='utf-8'))['panel']
    panel['shots'] = [{key: '' for key in panel['shots'][0]} for _ in range(count)]
    return {'panel': panel, 'row': min(count,100)}


class StoryboardShotReviewTests(unittest.TestCase):
    def test_later_original_row_beyond_whole_details_keeps_source_and_all_issues(self):
        p=partial();before=copy.deepcopy(p);d=review(p)
        self.assertEqual(d['row'],100);self.assertEqual(d['total_shots'],120)
        self.assertEqual(d['issue_count'],11);self.assertTrue(all(i['row']==100 and i['scope']=='shots' for i in d['issues']))
        self.assertFalse(d['details_truncated']);self.assertEqual(p,before)
        self.assertFalse(any(i['row']==100 for i in whole({'panel':p['panel']})['issues']))
        self.assertEqual(d['source']['shot'],before['panel']['shots'][99]);d['source']['shot']['visual']='changed';self.assertEqual(p,before)

    def test_every_original_row_matches_the_shared_whole_board_rules(self):
        p=json.loads((ROOT/'examples/unfinished-storyboard-review.json').read_text(encoding='utf-8'))
        all_issues=whole(p)['issues']
        for row in range(1,len(p['panel']['shots'])+1):
            d=review({**p,'row':row});self.assertEqual(d['issues'],[i for i in all_issues if i['scope']=='shots' and i['row']==row])

    def test_zero_selected_issues_still_needs_review_with_bad_times_and_other_rows(self):
        p=partial();p['panel']['motifs']=p['panel']['motifs'][:1]
        shot={key:'原文' for key in p['panel']['shots'][0]};shot.update(screen_direction='neutral',motif_id='motif-1',start='bad',end='bad')
        p['panel']['shots'][99]=shot;r=build('storyboard_shot_review',p)
        self.assertEqual(r.data['issue_count'],0);self.assertTrue(r.needs_review);self.assertEqual(r.data['status'],'fields_checked')
        self.assertIn('其他鏡頭及全片時間',markdown(r.data));self.assertGreater(whole({'panel':p['panel']})['issue_count'],200)

    def test_exact_row_shape_unicode_and_full_panel_limits(self):
        for row in [True,False,0,-1,1.5,121,None,'100',float('inf'),float('nan')]:
            p=partial();p['row']=row
            with self.assertRaises(ValueError):review(p)
        for mutate in [lambda p:p.update(extra=''),lambda p:p.pop('row'),lambda p:p['panel']['shots'].append({'wrong':''}),lambda p:p['panel']['shots'][0].update(visual='\ud800')]:
            p=partial();mutate(p)
            with self.assertRaises(ValueError):review(p)
        p=partial(1000);p['row']=1000;self.assertEqual(review(p)['row'],1000)
        p=partial(1000);p['panel']['shots'].append(p['panel']['shots'][0])
        with self.assertRaises(ValueError):review(p)
        p=partial();p['row']=100.0;self.assertEqual(review(p)['row'],100)

    def test_python_js_complete_report_and_markdown_agree(self):
        rows=[partial(1),partial(),partial(1000)]
        p=json.loads((ROOT/'examples/unfinished-storyboard-review.json').read_text(encoding='utf-8'))
        rows.extend({**copy.deepcopy(p),'row':row} for row in range(1,5))
        p=partial();p['panel']['shots'][99]['screen_direction']=' left ';p['panel']['shots'][99]['motif_id']='motif-999';rows.append(p)
        code="const fs=require('fs'),S=require('./web/storyboard-shot-review.js');process.stdout.write(JSON.stringify(JSON.parse(fs.readFileSync(0,'utf8')).map(p=>{const d=S.report(p);return {data:d,markdown:S.markdown(d)};})));"
        out=subprocess.run(['node','-e',code],cwd=ROOT,input=json.dumps(rows,ensure_ascii=False),capture_output=True,text=True,encoding='utf-8',timeout=15)
        self.assertEqual(out.returncode,0,out.stderr);self.assertEqual(json.loads(out.stdout),[{'data':review(p),'markdown':markdown(review(p))} for p in rows])

    def test_discovery_adds_one_strict_readonly_operation(self):
        c=capabilities();self.assertEqual(len(c['operations']),19);self.assertIn('storyboard_shot_review',c['operations'])
        self.assertEqual(len(tool_list()),19);self.assertTrue(c['storyboard_shot_review']['read_only'])
        self.assertEqual(payload_schema('storyboard_shot_review')['required'],['panel','row'])
        schema=output_schema('storyboard_shot_review');self.assertFalse(schema['properties']['data']['additionalProperties'])
        self.assertTrue(schema['properties']['meta']['properties']['needs_review']['const'])

    def test_files_are_checked_report_and_markdown_with_original_row(self):
        p=partial();r=build('storyboard_shot_review',p)
        self.assertEqual(set(r.files),{'storyboard-shot-review.json','storyboard-shot-review.md'})
        self.assertEqual(json.loads(r.files['storyboard-shot-review.json']),r.data)
        self.assertEqual(r.files['storyboard-shot-review.md'],markdown(r.data))

    def test_export_capacity_is_bounded_without_dropping_selected_source(self):
        p=partial();p['panel']['shots'][99]['visual']='a'*(256*1024);before=copy.deepcopy(p)
        with self.assertRaises(ValueError):build('storyboard_shot_review',p)
        self.assertEqual(p,before)
        p['panel']['shots'][99]['visual']='';p['panel']['shots'][0]['visual']='a'*(256*1024)
        self.assertEqual(build('storyboard_shot_review',p).data['row'],100)
