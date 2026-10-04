# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
import json,re,subprocess,unittest
from pathlib import Path
from musiclab.application import build
from musiclab.lyric_preview import preview_contract
ROOT=Path(__file__).resolve().parents[1]
class LyricsDownloadTests(unittest.TestCase):
 def test_generated_standalone_embeds_fixed_shared_download_modules_and_original_source(self):
  r=build('lyrics',{'title':'CON <b> __TITLE__','duration':10,'cues':[{'start':1,'end':2,'text':'原文\t  🎵'}]});preview=r.files['preview.html']
  for path in ['musiclab/assets/lyrics-download.js','web/text-download.js','web/text-download-dom.js']:self.assertIn((ROOT/path).read_text(encoding='utf-8'),preview)
  self.assertIn('已交給瀏覽器下載',preview);self.assertNotIn('已匯出 ${ext.toUpperCase()}',preview);self.assertIn('lyrics.json；作品名稱',preview)
  self.assertEqual(json.loads(re.search(r'<script id="initial" type="application/json">(.*?)</script>',preview,re.S)[1]),r.data)
  self.assertEqual(set(r.files),{'lyrics.json','lyrics.lrc','lyrics.srt','preview.html'});self.assertLess(len(json.dumps(preview_contract(),ensure_ascii=False).encode()),256*1024)
 def test_actual_full_envelope_guard_refuses_changed_formatter_adapter_and_download_status(self):
  code="const fs=require('fs'),C=require('./tests/helpers/lyric-preview-contract.js'),G=require('./web/lyrics-result.js').createChecker(C),r=JSON.parse(fs.readFileSync(0,'utf8'));G.checkedResult(r.data,r);for(const [a,b] of [['name:\\'lyrics.\\'','name:\\'wrong.\\''],['pending.size>=2','pending.size>=3'],['已交給瀏覽器下載','已保存到本機']]){const bad=structuredClone(r);bad.files['preview.html']=bad.files['preview.html'].replace(a,b);if(bad.files['preview.html']===r.files['preview.html'])throw Error('no corruption');let rejected=false;try{G.checkedResult(r.data,bad);}catch(e){rejected=true;}if(!rejected)throw Error('changed envelope accepted');}"
  r=build('lyrics',{'title':'合成','cues':[{'start':1,'end':2,'text':'</script> __DATA__\t  '}],'duration':10});p=subprocess.run(['node','-e',code],cwd=ROOT,input=json.dumps(r.wire(),ensure_ascii=False),capture_output=True,text=True,encoding='utf-8',timeout=15);self.assertEqual(p.returncode,0,p.stderr)
