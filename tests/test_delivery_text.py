# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
import io,json,hashlib,struct,subprocess,sys,tempfile,unittest,zipfile
from pathlib import Path
from unittest.mock import patch
from musiclab.delivery_text import window,checked_request,MAX_WINDOW_BYTES
from musiclab.delivery_package import prepare,MAX_SOURCE_BYTES
from musiclab.application import build,capabilities
from musiclab.common import json_text
from musiclab.tool_contracts import input_schema
from test_delivery_selection import fixture,request,mcp_lines
ROOT=Path(__file__).resolve().parents[1]

class TextWindowTests(unittest.TestCase):
 def test_windows_reconstruct_original_bom_emoji_mixed_newlines_controls_and_literal_html(self):
  text=('\ufeff原文🎵\r\nLF\nCR\r\x00<script>literal</script>'*1100)
  for limit in [4,7,16384]:
   pieces=[];start=0
   while True:
    part=window(text,start,limit);self.assertEqual(part['start_byte'],start);self.assertLessEqual(len(part['text'].encode()),limit);pieces.append(part['text'])
    if part['next_byte'] is None:break
    self.assertGreater(part['next_byte'],start);start=part['next_byte']
   self.assertEqual(''.join(pieces),text)
 def test_empty_eof_exact_limit_and_multibyte_boundary_are_distinct(self):
  self.assertEqual(window('')['next_byte'],None);self.assertEqual(window('')['source_bytes'],0)
  self.assertEqual(window('a'*16384)['next_byte'],None);self.assertEqual(window('a'*16385)['next_byte'],16384)
  self.assertEqual(window('a🎵z',0,4)['text'],'a');self.assertEqual(window('a🎵z',1,4)['text'],'🎵');self.assertEqual(window('a🎵z',6)['text'],'')
  for start in [2,3,4,7]:
   with self.assertRaises(ValueError):window('a🎵z',start)
 def test_invalid_window_values_unicode_and_source_capacity_never_silently_repair(self):
  for text,start,size in [('\ud800',0,4),(None,0,4),('x',True,4),('x',0,True),('x',-1,4),('x',0,3),('x',0,16385),('x',1.0,4),('x'* (MAX_SOURCE_BYTES+1),0,4)]:
   with self.assertRaises(ValueError):window(text,start,size)
 def test_request_shape_pinning_and_exclusive_modes_reject_before_source_io(self):
  bad=[None,{},True,{'file_name':'../x.txt'},{'file_name':'NUL.txt'},{'file_name':'DELIVERY-MANIFEST.json'},{'file_name':'x.txt','path':'other'},{'file_name':'x.txt','start_byte':1},{'file_name':'x.txt','archive_sha256':None},{'file_name':'x.txt','archive_sha256':'A'*64},{'file_name':'x.txt','max_bytes':0},{'file_name':'x.txt','start_byte':True}]
  for value in bad:
   with patch('musiclab.application.read_delivery',side_effect=AssertionError('must not read')),self.assertRaises(ValueError):build('delivery_inspect',{'text_window':value},delivery_source='not-read.zip')
  for extra in [{'include_files':True},{'include_files':True,'file_names':['x.txt']},{'include_report':True,'baseline':{'scope':'music','files':{}}}]:
   with patch('musiclab.application.read_delivery',side_effect=AssertionError('must not read')),self.assertRaises(ValueError):build('delivery_inspect',{'text_window':{'file_name':'x.txt'},**extra},delivery_source='not-read.zip')
 def test_four_scopes_large_64_file_archive_returns_labeled_bounded_original_with_full_metadata(self):
  for scope in ['music','storyboard','lyrics','audio']:
   raw=prepare(fixture(scope,True)).archive;sha=hashlib.sha256(raw).hexdigest();source=io.BytesIO(raw)
   result=build('delivery_inspect',{'text_window':{'file_name':'full.txt'}},delivery_source=source);part=result.data['text_window'];self.assertEqual(result.files,{});self.assertEqual(part['text'],'a'*16384);self.assertEqual(part['archive_sha256'],sha);self.assertEqual(part['schema_version'],1);self.assertEqual(result.data['manifest']['source_bytes'],MAX_SOURCE_BYTES);self.assertEqual(result.data['manifest']['file_count'],64);self.assertTrue(result.needs_review)
   next_=build('delivery_inspect',{'text_window':{'file_name':'full.txt','start_byte':part['next_byte'],'archive_sha256':sha}},delivery_source=source).data['text_window'];self.assertEqual(next_['start_byte'],16384);self.assertEqual(next_['file_sha256'],part['file_sha256']);self.assertEqual(source.getvalue(),raw)
   last=build('delivery_inspect',{'text_window':{'file_name':'full.txt','start_byte':part['source_bytes']-10,'archive_sha256':sha}},delivery_source=source).data['text_window'];self.assertEqual(last['text'],'a'*10);self.assertIsNone(last['next_byte']);self.assertLess(len(json_text(result.wire()).encode()),128*1024)
 def test_changed_canonical_zip_even_with_same_text_cannot_continue_previous_position(self):
  source=fixture();one=prepare(source).archive;sha=hashlib.sha256(one).hexdigest();source['label']='new label';two=prepare(source).archive
  for start in [0,3]:
   with self.assertRaises(ValueError):build('delivery_inspect',{'text_window':{'file_name':'selected.txt','start_byte':start,'archive_sha256':sha}},delivery_source=io.BytesIO(two))
  with self.assertRaises(ValueError):build('delivery_inspect',{'text_window':{'file_name':'missing.txt'}},delivery_source=io.BytesIO(one))
 def test_corrupt_unselected_file_rejects_and_whole_baseline_comparison_remains_complete(self):
  raw=prepare(fixture(wide=True)).archive
  with zipfile.ZipFile(io.BytesIO(raw)) as archive:offset=archive.getinfo('full.txt').header_offset
  name,extra=struct.unpack_from('<HH',raw,offset+26);bad=bytearray(raw);bad[offset+30+name+extra]^=1
  with self.assertRaises(ValueError):build('delivery_inspect',{'text_window':{'file_name':'empty.txt'}},delivery_source=io.BytesIO(bad))
  result=build('delivery_inspect',{'text_window':{'file_name':'empty.txt'},'baseline':{'scope':'lyrics','files':{'old.txt':'original'}}},delivery_source=io.BytesIO(raw));self.assertEqual(result.data['comparison']['incoming']['file_count'],64);self.assertEqual(result.data['text_window']['text'],'')
 def test_default_shapes_cap_and_independent_schema_are_preserved(self):
  raw=prepare(fixture()).archive;normal=build('delivery_inspect',{},delivery_source=io.BytesIO(raw));self.assertNotIn('text_window',normal.data);self.assertEqual(capabilities()['delivery_text_window']['schema_version'],1);self.assertEqual(capabilities()['protocol_version'],1)
  schema=input_schema('delivery_inspect')['properties']['payload']['properties']['text_window'];self.assertFalse(schema['additionalProperties']);self.assertEqual(schema['properties']['max_bytes']['maximum'],16384);self.assertEqual(schema['allOf'][0]['then']['required'],['archive_sha256'])
  raw=prepare({'scope':'audio','files':{'controls.txt':'\x00'*(MAX_SOURCE_BYTES//2),'full.txt':'a'*(MAX_SOURCE_BYTES//2)}}).archive;result=build('delivery_inspect',{'text_window':{'file_name':'controls.txt'}},delivery_source=io.BytesIO(raw));self.assertEqual(len(result.data['text_window']['text']),16384);self.assertLess(len(json_text(result.wire()).encode()),128*1024)
 def test_real_agent_and_mcp_two_windows_from_different_cwd_do_not_write_or_change_source(self):
  raw=prepare(fixture(wide=True)).archive;sha=hashlib.sha256(raw).hexdigest();payloads=[{'text_window':{'file_name':'full.txt','start_byte':n,'archive_sha256':sha}} for n in [0,16384]]
  with tempfile.TemporaryDirectory() as folder:
   path=Path(folder)/'source.zip';path.write_bytes(raw);expected=[build('delivery_inspect',p,delivery_source=path).wire() for p in payloads]
   p=subprocess.run([sys.executable,'-X','utf8',str(ROOT/'music_lab_agent.py'),'--delivery-zip',str(path)],input=''.join(json.dumps(request(v))+'\n' for v in payloads),capture_output=True,text=True,encoding='utf-8',cwd=folder,timeout=15);self.assertEqual(p.returncode,0,p.stderr);self.assertEqual([json.loads(t)['result'] for t in p.stdout.splitlines()],expected)
   messages=mcp_lines(payloads[0])+[{'jsonrpc':'2.0','id':4,'method':'tools/call','params':{'name':'delivery_inspect','arguments':{'payload':payloads[1]}}}]
   p=subprocess.run([sys.executable,'-X','utf8',str(ROOT/'music_lab_mcp.py'),'--delivery-zip',str(path)],input=''.join(json.dumps(t)+'\n' for t in messages),capture_output=True,text=True,encoding='utf-8',cwd=folder,timeout=15);self.assertEqual(p.returncode,0,p.stderr);replies=[json.loads(t) for t in p.stdout.splitlines()];self.assertEqual(len(replies[1]['result']['tools']),12);self.assertEqual([r['result']['structuredContent'] for r in replies[2:]],expected);self.assertEqual(path.read_bytes(),raw);self.assertEqual([t.name for t in Path(folder).iterdir()],['source.zip'])
 def test_cli_explicit_window_metadata_refuses_overwrite_and_invalid_mixed_settings(self):
  raw=prepare(fixture(wide=True)).archive;sha=hashlib.sha256(raw).hexdigest()
  with tempfile.TemporaryDirectory() as folder:
   path=Path(folder)/'source.zip';path.write_bytes(raw);out=Path(folder)/'out';base=[sys.executable,'-X','utf8',str(ROOT/'music_lab.py'),'delivery-inspect','--input',str(path)]
   args=base+['--out',str(out),'--text-file','full.txt','--start-byte','16384','--archive-sha256',sha]
   for extra,code in [([],0),([],1),(['--overwrite'],0)]:
    p=subprocess.run(args+extra,capture_output=True,timeout=15);self.assertEqual(p.returncode,code,p.stderr)
   result=json.loads((out/'delivery-inspection.json').read_bytes());self.assertEqual(result['text_window']['start_byte'],16384);self.assertEqual(result['text_window']['text'],'a'*16384);self.assertEqual([t.name for t in out.iterdir()],['delivery-inspection.json']);self.assertEqual(path.read_bytes(),raw)
   for index,extra in enumerate([['--start-byte','0'],['--text-file','full.txt','--start-byte','16384'],['--text-file','full.txt','--file-name','empty.txt'],['--text-file','full.txt','--comparison-report']]):
    target=Path(folder)/('bad'+str(index));p=subprocess.run(base+['--out',str(target)]+extra,capture_output=True,timeout=15);self.assertEqual(p.returncode,1,p.stderr);self.assertFalse(target.exists())

if __name__=='__main__':unittest.main()
