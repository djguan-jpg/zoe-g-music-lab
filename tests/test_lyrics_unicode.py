# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
import copy,json,subprocess,unittest
from pathlib import Path
from musiclab.application import build
from musiclab.json_document import utf8_bytes
from musiclab.lyrics_package import validate_package,decode_document
ROOT=Path(__file__).resolve().parents[1]
SOURCE=build('lyrics',{'title':'合成🎵','cues':[{'start':1.125,'end':2.5,'text':'原文\t  🎵'}],'duration':10}).data
SOURCE['timing']['applied_shift_seconds']=-.125;SOURCE['review_notes']=[' 原來歷史\t 🎵 ']
FIELDS={'title':'歌詞包名稱','cue':'歌詞包歌詞','note':'歌詞包待確認說明'}
def changed(field,value):
 p=copy.deepcopy(SOURCE)
 if field=='title':p['title']=value
 elif field=='cue':p['cues'][0]['text']=value
 else:p['review_notes']=[value]
 return p
class LyricsUnicodeTests(unittest.TestCase):
 def test_shared_utf8_boundary_preserves_all_valid_values_and_refuses_replacement(self):
  for text in ['', '繁體\u0085\u2028\u2029\t  <b>🎵\x00\ufeff','\ufffd','🎵'*200]:self.assertEqual(utf8_bytes(text),text.encode('utf-8'))
  for text in ['\ud800','\udfff','前\ud800後','前\udfff🎵']:
   with self.assertRaisesRegex(ValueError,'名稱 含無效 Unicode 文字'):utf8_bytes(text,label='名稱')
  for value in [None,1,[],b'text']:
   with self.assertRaisesRegex(ValueError,'需為文字'):utf8_bytes(value)
 def test_complete_package_refuses_each_invalid_text_field_before_late_encode_error(self):
  for field,label in FIELDS.items():
   for value in ['前\ud800後','前\udfff後','\ud800x\udfff']:
    p=changed(field,value);before=copy.deepcopy(p)
    with self.assertRaisesRegex(ValueError,label+' 含無效 Unicode 文字') as caught:validate_package(p)
    self.assertNotIsInstance(caught.exception,UnicodeError);self.assertEqual(p,before)
 def test_application_lyrics_and_export_review_share_field_errors_and_keep_input(self):
  for operation in ['lyrics','lyrics_export_review']:
   for field,label in FIELDS.items():
    p=changed(field,'字\ud800');payload={'package':p};before=copy.deepcopy(payload)
    with self.assertRaisesRegex(ValueError,label+' 含無效 Unicode 文字'):build(operation,payload)
    self.assertEqual(payload,before)
 def test_valid_unicode_packages_and_downloads_roundtrip_across_python_and_native(self):
  p=copy.deepcopy(SOURCE);p['title']='🎵'*200;p['cues'][0]['text']='繁體\u0085\u2028\u2029\t  <b>🎵\x00\ufeff';p['review_notes']=['🎵'*400,' 原文\t  \ufffd ']
  r=build('lyrics',{'package':p});self.assertEqual(r.data,p);self.assertEqual(decode_document(r.files['lyrics.json']),p)
  code="const fs=require('fs'),P=require('./musiclab/assets/lyrics-package.js'),L=require('./musiclab/assets/lyrics-download.js'),D=require('./web/text-download.js'),r=JSON.parse(fs.readFileSync(0,'utf8'));const p=P.validate(r.data),s=L.select(p,'json');if(JSON.stringify(P.parseDocument(s.content))!==JSON.stringify(p))throw Error('roundtrip mismatch');for(const ext of ['lrc','srt'])if(L.select(p,ext).content!==r.files['lyrics.'+ext])throw Error('export mismatch');D.prepare(s);console.log(JSON.stringify(p));"
  result=subprocess.run(['node','-e',code],cwd=ROOT,input=json.dumps(r.wire(),ensure_ascii=False),capture_output=True,text=True,encoding='utf-8',timeout=15);self.assertEqual(result.returncode,0,result.stderr);self.assertEqual(json.loads(result.stdout),p)
 def test_actual_agent_stream_preserves_good_sources_and_survives_bad_unicode_request(self):
  bad=changed('cue','字\ud800');requests=[{'protocol_version':1,'id':name,'operation':'lyrics','payload':{'package':p}} for name,p in [('good',SOURCE),('bad',bad),('again',SOURCE)]]
  run=subprocess.run([__import__('sys').executable,'-X','utf8','music_lab_agent.py'],cwd=ROOT,input=''.join(json.dumps(r)+'\n' for r in requests),capture_output=True,text=True,encoding='utf-8',timeout=15);self.assertEqual(run.returncode,0,run.stderr)
  rows=[json.loads(line) for line in run.stdout.splitlines()];self.assertEqual(len(rows),3);self.assertTrue(rows[0]['ok']);self.assertEqual(rows[0]['result']['data'],SOURCE);self.assertFalse(rows[1]['ok']);self.assertEqual(rows[1]['error']['code'],'invalid_request');self.assertTrue(rows[2]['ok']);self.assertEqual(rows[2]['result']['data'],SOURCE)
