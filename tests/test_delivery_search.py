# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
import io,json,hashlib,struct,subprocess,sys,tempfile,unittest,zipfile
from pathlib import Path
from unittest.mock import patch
from musiclab.delivery_search import search,checked_request
from musiclab.delivery_package import prepare,MAX_SOURCE_BYTES
from musiclab.application import build,capabilities
from musiclab.tool_contracts import input_schema
from test_delivery_selection import request,mcp_lines
ROOT=Path(__file__).resolve().parents[1]
class SearchTests(unittest.TestCase):
 def fixture(self,scope='music',wide=False):
  value='\ufeffHEAD\r\n'+'a'*(MAX_SOURCE_BYTES-400 if wide else 40000)+'\n尾端🎵\r\n'+'hit '*45+'<script>literal</script>\x00e\u0301'
  return {'scope':scope,'label':'search original','files':{'full.txt':value,'empty.txt':'','other.txt':'保留'}}
 def test_exact_literal_case_bom_controls_html_and_no_normalization(self):
  original='\ufeffA🎵\r\nA\nA\r\x00<script>literal</script>é e\u0301'
  for q in ['\ufeff','🎵','\r\n','\n','\r','\x00','<script>literal</script>','é','e\u0301','a','.*']:
   result=search(original,q);raw=original.encode();cursor=0;expected=[]
   while (found:=raw.find(q.encode(),cursor))>=0:cursor=found+len(q.encode());expected.append({'start_byte':found,'end_byte':cursor})
   self.assertEqual(result['matches'],expected)
 def test_nonoverlapping_batches_continuation_empty_eof_and_no_match(self):
  self.assertEqual(search('aaaaa','aa',max_matches=1)['matches'],[{'start_byte':0,'end_byte':2}]);self.assertEqual(search('aaaaa','aa',max_matches=1)['next_byte'],2)
  self.assertIsNone(search('aaaaa','aa',2,1)['next_byte']);self.assertEqual(search('','x')['matches'],[]);self.assertEqual(search('a','a',1)['matches'],[]);self.assertEqual(search('abc','z')['matches'],[])
 def test_invalid_unicode_query_caps_types_and_boundaries(self):
  self.assertEqual(search('a'*1024,'a'*1024)['query_bytes'],1024)
  for q,start,n in [('',0,20),('\ud800',0,20),('🎵'*257,0,20),(None,0,20),('x',True,20),('x',0,True),('x',-1,20),('x',0,0),('x',0,51),('x',0,1.5),('x',9,20),('x',2,20)]:
   with self.assertRaises(ValueError):search('a🎵z',q,start,n)
  with self.assertRaises(ValueError):search('a'*(MAX_SOURCE_BYTES+1),'a')
 def test_requests_and_exclusive_modes_reject_before_archive_io(self):
  good={'file_name':'full.txt','query':'x'}
  for v in [None,{},True,good|{'query':''},good|{'query':None},good|{'query':'🎵'*257},good|{'file_name':'../x'},good|{'file_name':'NUL.txt'},good|{'start_byte':1},good|{'archive_sha256':None},good|{'start_byte':None},good|{'unknown':0}]:
   with patch('musiclab.application.read_delivery',side_effect=AssertionError('no source read')),self.assertRaises(ValueError):build('delivery_inspect',{'text_search':v},delivery_source='absent.zip')
  for extra in [{'text_window':{'file_name':'full.txt'}},{'include_files':True},{'file_names':['full.txt'],'include_files':True},{'baseline':{'scope':'music','files':{}},'include_report':True}]:
   with patch('musiclab.application.read_delivery',side_effect=AssertionError('no source read')),self.assertRaises(ValueError):build('delivery_inspect',{'text_search':good,**extra},delivery_source='absent.zip')
 def test_four_scopes_full_large_original_tail_positions_and_followup_window(self):
  for scope in ['music','storyboard','lyrics','audio']:
   f=self.fixture(scope,True);raw=prepare(f).archive;sha=hashlib.sha256(raw).hexdigest();pos=f['files']['full.txt'].encode().index('尾端🎵'.encode());source=io.BytesIO(raw)
   r=build('delivery_inspect',{'text_search':{'file_name':'full.txt','query':'尾端🎵'}},delivery_source=source);s=r.data['text_search'];self.assertEqual(s['matches'],[{'start_byte':pos,'end_byte':pos+10}]);self.assertGreater(pos,8000000);self.assertEqual(s['archive_sha256'],sha);self.assertEqual(s['format'],'zoe-delivery-text-search');self.assertEqual(r.files,{});self.assertLess(len(json.dumps(r.wire())),16000)
   part=build('delivery_inspect',{'text_window':{'file_name':'full.txt','start_byte':pos,'archive_sha256':sha}},delivery_source=source).data['text_window'];self.assertTrue(part['text'].startswith('尾端🎵'));self.assertEqual(source.getvalue(),raw)
 def test_pinned_batch_read_and_changed_label_refusal(self):
  f=self.fixture();raw=prepare(f).archive;sha=hashlib.sha256(raw).hexdigest();start=0;hits=[]
  while True:
   r=build('delivery_inspect',{'text_search':{'file_name':'full.txt','query':'hit','start_byte':start,'archive_sha256':sha}},delivery_source=io.BytesIO(raw)).data['text_search'];hits+=r['matches']
   if r['next_byte'] is None:break
   start=r['next_byte']
  self.assertEqual(len(hits),45);f['label']='changed';changed=prepare(f).archive
  with self.assertRaises(ValueError):build('delivery_inspect',{'text_search':{'file_name':'full.txt','query':'hit','start_byte':start,'archive_sha256':sha}},delivery_source=io.BytesIO(changed))
 def test_full_unselected_crc_check_and_baseline_comparison(self):
  f=self.fixture();raw=prepare(f).archive
  with zipfile.ZipFile(io.BytesIO(raw)) as z:offset=z.getinfo('other.txt').header_offset
  name,extra=struct.unpack_from('<HH',raw,offset+26);bad=bytearray(raw);bad[offset+30+name+extra]^=1
  with self.assertRaises(ValueError):build('delivery_inspect',{'text_search':{'file_name':'full.txt','query':'hit'}},delivery_source=io.BytesIO(bad))
  r=build('delivery_inspect',{'text_search':{'file_name':'empty.txt','query':'hit'},'baseline':{'scope':'music','files':{'old.txt':'original'}}},delivery_source=io.BytesIO(raw));self.assertEqual(r.data['comparison']['incoming']['file_count'],3);self.assertEqual(r.data['text_search']['source_bytes'],0)
  with self.assertRaises(ValueError):build('delivery_inspect',{'text_search':{'file_name':'missing.txt','query':'hit'}},delivery_source=io.BytesIO(raw))
 def test_capabilities_schema_and_default_contract_remain_independent(self):
  c=capabilities();self.assertEqual(c['delivery_text_search']['schema_version'],1);self.assertEqual(c['protocol_version'],1);s=input_schema('delivery_inspect')['properties']['payload']['properties']['text_search'];self.assertFalse(s['additionalProperties']);self.assertEqual(s['required'],['file_name','query']);self.assertEqual(s['properties']['max_matches']['maximum'],50);self.assertEqual(s['allOf'][0]['then']['required'],['archive_sha256'])
  r=build('delivery_inspect',{},delivery_source=io.BytesIO(prepare(self.fixture()).archive));self.assertNotIn('text_search',r.data)
 def test_actual_agent_mcp_batches_then_window_from_other_cwd_preserve_source(self):
  f=self.fixture();raw=prepare(f).archive;sha=hashlib.sha256(raw).hexdigest();first=search(f['files']['full.txt'],'hit');pos=first['matches'][0]['start_byte'];payloads=[{'text_search':{'file_name':'full.txt','query':'hit','start_byte':n,'archive_sha256':sha}} for n in [0,first['next_byte']]]+[{'text_window':{'file_name':'full.txt','start_byte':pos,'archive_sha256':sha}}]
  with tempfile.TemporaryDirectory() as folder:
   path=Path(folder)/'original.zip';path.write_bytes(raw);expected=[build('delivery_inspect',p,delivery_source=path).wire() for p in payloads]
   p=subprocess.run([sys.executable,'-X','utf8',str(ROOT/'music_lab_agent.py'),'--delivery-zip',str(path)],input=''.join(json.dumps(request(v))+'\n' for v in payloads),capture_output=True,text=True,encoding='utf-8',cwd=folder,timeout=15);self.assertEqual(p.returncode,0,p.stderr);self.assertEqual([json.loads(t)['result'] for t in p.stdout.splitlines()],expected)
   messages=mcp_lines(payloads[0])+[{'jsonrpc':'2.0','id':i+4,'method':'tools/call','params':{'name':'delivery_inspect','arguments':{'payload':v}}} for i,v in enumerate(payloads[1:])]
   p=subprocess.run([sys.executable,'-X','utf8',str(ROOT/'music_lab_mcp.py'),'--delivery-zip',str(path)],input=''.join(json.dumps(t)+'\n' for t in messages),capture_output=True,text=True,encoding='utf-8',cwd=folder,timeout=15);self.assertEqual(p.returncode,0,p.stderr);replies=[json.loads(t) for t in p.stdout.splitlines()];self.assertEqual(len(replies[1]['result']['tools']),14);self.assertEqual([r['result']['structuredContent'] for r in replies[2:]],expected);self.assertEqual(path.read_bytes(),raw);self.assertEqual(len(list(Path(folder).iterdir())),1)
 def test_actual_cli_search_only_metadata_overwrite_and_mixed_flags(self):
  with tempfile.TemporaryDirectory() as folder:
   path=Path(folder)/'original.zip';raw=prepare(self.fixture()).archive;path.write_bytes(raw);out=Path(folder)/'out';base=[sys.executable,'-X','utf8',str(ROOT/'music_lab.py'),'delivery-inspect','--input',str(path)]
   args=base+['--out',str(out),'--text-file','full.txt','--find-text','尾端🎵']
   for extra,code in [([],0),([],1),(['--overwrite'],0)]:
    p=subprocess.run(args+extra,capture_output=True,timeout=15);self.assertEqual(p.returncode,code,p.stderr)
   r=json.loads((out/'delivery-inspection.json').read_bytes());self.assertEqual(len(r['text_search']['matches']),1);self.assertEqual([p.name for p in out.iterdir()],['delivery-inspection.json']);self.assertEqual(path.read_bytes(),raw)
   for i,extra in enumerate([['--find-text','x'],['--max-matches','1'],['--text-file','full.txt','--find-text','x','--window-bytes','4'],['--text-file','full.txt','--max-matches','1'],['--text-file','full.txt','--find-text','x','--comparison-report']]):
    target=Path(folder)/str(i);p=subprocess.run(base+['--out',str(target)]+extra,capture_output=True,timeout=15);self.assertEqual(p.returncode,1,p.stderr);self.assertFalse(target.exists())
if __name__=='__main__':unittest.main()
