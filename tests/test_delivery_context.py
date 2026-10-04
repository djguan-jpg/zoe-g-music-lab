# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
import unittest,io,json,sys,subprocess,tempfile,hashlib,struct,zipfile
from pathlib import Path
from unittest.mock import patch
from musiclab.delivery_context import contexts
from musiclab.delivery_search import search
from musiclab.delivery_package import prepare
from musiclab.application import build,capabilities
from musiclab.tool_contracts import input_schema
from test_delivery_selection import request,mcp_lines
ROOT=Path(__file__).resolve().parents[1]
class ContextTests(unittest.TestCase):
 def fixture(self,scope='music'):
  return {'scope':scope,'label':'context original','files':{'full.txt':'\ufeff甲🎵\r\n'+('🎵'*25+'記憶點'+'乙'*30+'\x00<script>literal</script>\r\n')*45,'empty.txt':'','other.txt':'preserve'}}
 def test_exact_context_unicode_boundaries_bom_controls_and_original_slices(self):
  original='\ufeff甲🎵\r\n'+'🎵'*25+'記憶點'+'乙'*30+'\x00<script>literal</script>\r\n';raw=original.encode();result=search(original,'記憶點',include_context=True);item=result['context']['items'][0];match=result['matches'][0]
  self.assertEqual(item['text'].encode(),raw[item['start_byte']:item['end_byte']]);self.assertEqual(raw[item['match_start_byte']:item['match_end_byte']],'記憶點'.encode());self.assertLessEqual(match['start_byte']-item['start_byte'],64);self.assertLessEqual(item['end_byte']-match['end_byte'],64);self.assertEqual(result['context']['schema_version'],1)
  for q in ['\ufeff','\r\n','\x00','<script>literal</script>','🎵']:
   r=search(original,q,include_context=True)
   for v in r['context']['items']:self.assertEqual(v['text'].encode(),raw[v['start_byte']:v['end_byte']])
 def test_beginning_eof_empty_no_match_and_exact_64_byte_flanks(self):
  self.assertEqual(search('hit','hit',include_context=True)['context']['items'][0]['text'],'hit')
  s=search('a'*100+'hit'+'b'*100,'hit',include_context=True);v=s['context']['items'][0];self.assertEqual(v['text'],'a'*64+'hit'+'b'*64);self.assertEqual(v['start_byte'],36);self.assertEqual(v['end_byte'],167)
  for value,q in [('', 'x'),('x','missing')]:self.assertEqual(search(value,q,include_context=True)['context']['items'],[])
 def test_default_position_reply_is_identical_and_context_bool_is_strict_before_io(self):
  original=self.fixture()['files']['full.txt'];default=search(original,'記憶點');self.assertNotIn('context',default);self.assertEqual(default,search(original,'記憶點',include_context=False));enabled=search(original,'記憶點',include_context=True);enabled.pop('context');self.assertEqual(enabled,default)
  for value in [None,0,1,'true',{},[]]:
   with patch('musiclab.application.read_delivery',side_effect=AssertionError('no read')),self.assertRaises(ValueError):build('delivery_inspect',{'text_search':{'file_name':'full.txt','query':'記憶點','include_context':value}},delivery_source='absent.zip')
 def test_four_scopes_contexts_pin_positions_batches_and_full_source_preserved(self):
  for scope in ['music','storyboard','lyrics','audio']:
   f=self.fixture(scope);raw=prepare(f).archive;sha=hashlib.sha256(raw).hexdigest();s=io.BytesIO(raw);q={'file_name':'full.txt','query':'記憶點','include_context':True};first=build('delivery_inspect',{'text_search':q},delivery_source=s);r=first.data['text_search'];self.assertEqual(len(r['context']['items']),20);self.assertEqual(first.files,{})
   second=build('delivery_inspect',{'text_search':q|{'start_byte':r['next_byte'],'archive_sha256':sha}},delivery_source=s).data['text_search'];self.assertGreater(second['matches'][0]['start_byte'],r['matches'][-1]['end_byte']);self.assertEqual(s.getvalue(),raw)
 def test_unselected_corruption_changed_archive_and_missing_still_refuse(self):
  f=self.fixture();raw=prepare(f).archive;q={'file_name':'full.txt','query':'記憶點','include_context':True}
  with zipfile.ZipFile(io.BytesIO(raw)) as z:offset=z.getinfo('other.txt').header_offset
  name,extra=struct.unpack_from('<HH',raw,offset+26);bad=bytearray(raw);bad[offset+30+name+extra]^=1
  with self.assertRaises(ValueError):build('delivery_inspect',{'text_search':q},delivery_source=io.BytesIO(bad))
  f['label']='changed'
  with self.assertRaises(ValueError):build('delivery_inspect',{'text_search':q|{'archive_sha256':hashlib.sha256(raw).hexdigest()}},delivery_source=io.BytesIO(prepare(f).archive))
  with self.assertRaises(ValueError):build('delivery_inspect',{'text_search':q|{'file_name':'missing.txt'}},delivery_source=io.BytesIO(raw))
 def test_max_query_50_matches_and_8mib_tail_have_bounded_original_context(self):
  query='\x00'*1024;original=('a'*70+query+'b'*70)*50;value=search(original,query,max_matches=50,include_context=True);self.assertEqual(len(value['context']['items']),50);self.assertTrue(all(len(v['text'].encode())==1152 for v in value['context']['items']));self.assertLess(len(json.dumps(value).encode()),400000)
  original='a'*(8388608-10)+'尾端🎵';r=search(original,'尾端🎵',include_context=True);self.assertEqual(r['source_bytes'],8388608);self.assertEqual(r['context']['items'][0]['end_byte'],8388608);self.assertEqual(len(r['context']['items'][0]['text'].encode()),74)
 def test_context_schema_caps_and_invalid_direct_model_positions(self):
  desc=capabilities()['delivery_text_search']['optional_context'];self.assertEqual(desc['schema_version'],1);self.assertEqual(desc['max_item_bytes'],1152);self.assertFalse(input_schema('delivery_inspect')['properties']['payload']['properties']['text_search']['properties']['include_context']['default'])
  for raw,m in [(b'x', [{'start_byte':False,'end_byte':1}]),('x',[]),('a🎵z'.encode(),[{'start_byte':2,'end_byte':5}]),(b'x'*1025,[{'start_byte':0,'end_byte':1025}]),(b'a',[{'start_byte':0,'end_byte':1}]*51)]:
   with self.assertRaises(ValueError):contexts(raw,m)
 def test_actual_agent_mcp_and_cli_contexts_from_other_cwd_no_source_or_auto_writes(self):
  f=self.fixture();raw=prepare(f).archive;payload={'text_search':{'file_name':'full.txt','query':'記憶點','include_context':True}}
  with tempfile.TemporaryDirectory() as folder:
   path=Path(folder)/'original.zip';path.write_bytes(raw);expected=build('delivery_inspect',payload,delivery_source=path).wire()
   for command,messages in [('music_lab_agent.py',[request(payload)]),('music_lab_mcp.py',mcp_lines(payload))]:
    p=subprocess.run([sys.executable,'-X','utf8',str(ROOT/command),'--delivery-zip',str(path)],input=''.join(json.dumps(v)+'\n' for v in messages),capture_output=True,text=True,encoding='utf-8',cwd=folder,timeout=15);self.assertEqual(p.returncode,0,p.stderr);replies=[json.loads(t) for t in p.stdout.splitlines()];actual=replies[-1]['result'] if command=='music_lab_agent.py' else replies[-1]['result']['structuredContent'];self.assertEqual(actual,expected)
   self.assertEqual(len(list(Path(folder).iterdir())),1)
   out=Path(folder)/'out';base=[sys.executable,'-X','utf8',str(ROOT/'music_lab.py'),'delivery-inspect','--input',str(path),'--out',str(out),'--text-file','full.txt','--find-text','記憶點','--match-context'];p=subprocess.run(base,capture_output=True,timeout=15);self.assertEqual(p.returncode,0,p.stderr);self.assertEqual(json.loads((out/'delivery-inspection.json').read_bytes())['text_search'],expected['data']['text_search']);self.assertEqual(path.read_bytes(),raw)
   target=Path(folder)/'invalid';p=subprocess.run([sys.executable,'-X','utf8',str(ROOT/'music_lab.py'),'delivery-inspect','--input',str(path),'--out',str(target),'--match-context'],capture_output=True,timeout=15);self.assertEqual(p.returncode,1);self.assertFalse(target.exists())
if __name__=='__main__':unittest.main()
