# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
import copy,json,subprocess,unittest
from pathlib import Path
from musiclab.draft_compare import compare,bundle
from musiclab.draft_contract import CONTRACT

ROOT=Path(__file__).resolve().parents[1]
def draft():return json.loads((ROOT/'examples/draft-comparison-baseline.json').read_text(encoding='utf-8'))
class BrowserDraftComparisonTests(unittest.TestCase):
 def checked(self,payload):
  script="const M=require('./web/draft-compare.js');let t='';process.stdin.setEncoding('utf8');process.stdin.on('data',x=>t+=x);process.stdin.on('end',async()=>{try{const d=await M.compare(JSON.parse(t));process.stdout.write(JSON.stringify({data:d,markdown:M.markdown(d)}));}catch(e){process.stderr.write(e.message);process.exitCode=1;}});"
  p=subprocess.run(['node','-e',script],cwd=ROOT,input=json.dumps(payload,ensure_ascii=False),capture_output=True,text=True,encoding='utf-8',timeout=20)
  self.assertEqual(p.returncode,0,p.stderr);self.assertLessEqual(len(p.stdout.encode('utf-8')),512*1024)
  got=json.loads(p.stdout);self.assertEqual(got['data'],compare(payload));self.assertEqual(got['markdown'],bundle(payload)['draft-comparison.md'])
 def test_identical_and_metadata_only_full_reports_match_python(self):
  a=draft();self.checked({'baseline':a,'current':copy.deepcopy(a)});b=copy.deepcopy(a);b.update(saved_at=' 時間\r\n🎵',tab='audio',tool_version='future');self.checked({'baseline':a,'current':b})
 def test_all_panels_and_literal_unicode_control_text_match_python(self):
  a=draft();b=copy.deepcopy(a)
  for scope,fields in CONTRACT['fields'].items():
   for key in fields:
    if key not in ('lyrics-format','audio-profile'):b['panels'][scope]['fields'][key]='原文\r\n\0\t🎵\u2028 '+key
  b['panels']['lyrics']['cues']=[{'start':'00.0','end':'','text':'a'*127+'🎵尾'}];b['panels']['music']['avoid']=[''];b['panels']['music']['deliverables']=[]
  self.checked({'baseline':a,'current':b})
 def test_large_cues_complete_counts_and_detail_limit_match_python(self):
  a=draft();b=copy.deepcopy(a);a['panels']['lyrics']['cues']=[{'start':'','end':'','text':'a'} for _ in range(10000)];b['panels']['lyrics']['cues']=[{'start':'','end':'','text':'b'} for _ in range(10000)];self.checked({'baseline':a,'current':b})
 def test_whole_row_detail_byte_limit_matches_python(self):
  a=draft();b=copy.deepcopy(a);a['panels']['storyboard']['shots']=[{k:'neutral' if k=='screen_direction' else '' if k=='motif_id' else 'x' for k in CONTRACT['rows']['storyboard']['columns']} for _ in range(80)];b['panels']['storyboard']['shots']=[{k:v if k in ('screen_direction','motif_id') else '\0'*100 for k,v in row.items()} for row in a['panels']['storyboard']['shots']];self.checked({'baseline':a,'current':b})

if __name__=='__main__':unittest.main()
