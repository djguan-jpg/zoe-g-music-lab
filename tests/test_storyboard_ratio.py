# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
import json,subprocess,sys,unittest
from pathlib import Path
from musiclab.application import build
from musiclab.draft_contract import validate_draft
ROOT=Path(__file__).resolve().parents[1]
def node(code,value):
 r=subprocess.run(['node','-e',code],cwd=ROOT,input=json.dumps(value,ensure_ascii=True),capture_output=True,text=True,encoding='utf-8',timeout=15)
 if r.returncode:raise AssertionError(r.stderr[-1500:])
 return json.loads(r.stdout)
class StoryboardRatioTests(unittest.TestCase):
 def test_actual_agent_completed_custom_ratio_matches_browser_full_source_checks(self):
  rows=[]
  for ratio in ['3:2','2.39:1',' 2.39:1 ','原值\r\n🎵',' ９：１６ ']:
   brief=json.loads((ROOT/'examples/first-light-mv.json').read_text(encoding='utf-8'));brief['aspect_ratio']=ratio
   request={'protocol_version':1,'id':'ratio','operation':'storyboard','payload':brief}
   r=subprocess.run([sys.executable,'-X','utf8','music_lab_agent.py'],cwd=ROOT,input=json.dumps(request)+'\n',capture_output=True,text=True,encoding='utf-8',timeout=15)
   self.assertEqual(r.returncode,0,r.stderr);reply=json.loads(r.stdout);self.assertTrue(reply['ok']);self.assertEqual(reply['result'],build('storyboard',brief).wire())
   rows.append({'brief':brief,'wire':reply['result']})
  code="const fs=require('fs'),p=require('./web/planning-import.js'),r=require('./web/planning-review.js'),f=require('./tests/planning_report_fixture.js');console.log(JSON.stringify(JSON.parse(fs.readFileSync(0,'utf8')).map(x=>{const d=p.planningDraft(f.draft(),'storyboard',x.brief);r.checkedBrief('storyboard',x.brief,x.wire);return {draft:d,returned:p.planningBrief(d,'storyboard')};})));"
  out=node(code,rows)
  for original,selected in zip(rows,out):
   self.assertEqual(selected['returned']['aspect_ratio'],original['brief']['aspect_ratio']);self.assertEqual(validate_draft(selected['draft']),selected['draft'])
   self.assertEqual(selected['returned']['shots'],[dict(s,start=str(s['start']),end=str(s['end'])) for s in original['brief']['shots']])
 def test_raw_ratio_report_and_draft_keep_blank_and_custom_values_without_claiming_complete_plan(self):
  values=['','\t','2.39:1','需求待定',' 原值\r\n🎵 ']
  code="const fs=require('fs'),p=require('./web/planning-import.js'),r=require('./web/storyboard-readiness.js'),i=require('./web/planning-report-input.js'),f=require('./tests/planning_report_fixture.js');console.log(JSON.stringify(JSON.parse(fs.readFileSync(0,'utf8')).map(ratio=>{const source=f.panel('storyboard');source.fields['mv-ratio']=ratio;const report=r.report(source);return {report,draft:p.panelDraft(f.draft(),'storyboard',i.inspect('storyboard',report).panel)};})));"
  rows=node(code,values)
  for value,row in zip(values,rows):
   validated=validate_draft(row['draft']);self.assertEqual(validated['panels']['storyboard']['fields']['mv-ratio'],value)
   expected=build('storyboard_review',{'panel':validated['panels']['storyboard']}).data;self.assertEqual(row['report'],expected)
   self.assertEqual(expected['status'],'needs_correction');self.assertGreater(expected['issue_count'],0)
