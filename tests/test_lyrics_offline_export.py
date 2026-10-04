# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
import json,re,subprocess,unittest
from pathlib import Path
from musiclab.application import build
from musiclab.lyric_preview import preview_contract
ROOT=Path(__file__).resolve().parents[1]
class OfflineExportTests(unittest.TestCase):
 def test_generated_standalone_is_self_contained_and_uses_same_rules_controller_and_presenter(self):
  r=build('lyrics',{'title':'<b> __TITLE__','cues':[{'start':2,'end':3,'text':'[00:04] 原文'},{'start':4,'end':5,'text':' \t'}],'duration':10});preview=r.files['preview.html']
  for name in ['lyrics-lrc.js','lyrics-export-review.js','lyrics-offline-export.js','lyrics-offline-export-dom.js']:self.assertIn((ROOT/'musiclab/assets'/name).read_text(encoding='utf-8'),preview)
  self.assertIn('aria-label="格式保留提醒"',preview);self.assertNotRegex(preview,r'<script[^>]+src=');self.assertIn('exportController.accept(data)',preview);self.assertIn('exportController.invalidate()',preview)
  embedded=json.loads(re.search(r'<script id="initial" type="application/json">(.*?)</script>',preview,re.S)[1]);self.assertEqual(embedded,r.data)
  self.assertEqual(set(r.files),{'lyrics.json','lyrics.lrc','lyrics.srt','preview.html'});self.assertLess(len(json.dumps(preview_contract(),ensure_ascii=False).encode()),256*1024)
 def test_complete_new_preview_is_accepted_and_changed_offline_module_is_refused_by_real_guard(self):
  code="const G=require('./web/lyrics-result.js'),C=require('./tests/helpers/lyric-preview-contract.js'),fs=require('fs'),r=JSON.parse(fs.readFileSync(0,'utf8')),g=G.createChecker(C);g.checkedResult(r.data,r);const bad=structuredClone(r);bad.files['preview.html']=bad.files['preview.html'].replace('const maxVisible=20','const maxVisible=19');let rejected=false;try{g.checkedResult(r.data,bad);}catch(e){rejected=true;}if(!rejected)throw Error('modified standalone code accepted');"
  r=build('lyrics',{'title':'合成','cues':[{'start':1,'end':2,'text':'</script> __DATA__\t  '}],'duration':10});p=subprocess.run(['node','-e',code],cwd=ROOT,input=json.dumps(r.wire(),ensure_ascii=False),capture_output=True,text=True,encoding='utf-8',timeout=15);self.assertEqual(p.returncode,0,p.stderr)
