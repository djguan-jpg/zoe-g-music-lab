# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
import copy,hashlib,io,json,struct,subprocess,sys,tempfile,unittest,zipfile
from pathlib import Path
from unittest.mock import patch
from musiclab.application import build,inspect_delivery,capabilities
from musiclab.common import json_text
from musiclab.delivery_package import prepare,MAX_SOURCE_BYTES
from musiclab.delivery_selection import select,checked_names,MAX_INLINE_FILES_BYTES
from musiclab.tool_contracts import input_schema
from music_lab_agent import response
from music_lab_mcp import Session,MCP_VERSION
ROOT=Path(__file__).resolve().parents[1]

def fixture(scope='lyrics',wide=False):
    files={'selected.txt':'\ufeff原創🎵\r\nLF\nCR\r\x00<script>literal</script>','empty.txt':'','view.html':'<script>must_remain_literal()</script>\n'}
    if wide:
        for i in range(60):files[f'empty{i:02}.txt']=''
        files['full.txt']='a'*(MAX_SOURCE_BYTES-sum(len(t.encode()) for t in files.values()))
    return {'scope':scope,'label':'原創合成文字','files':files}

def request(payload):return {'protocol_version':1,'id':'selection-check','operation':'delivery_inspect','payload':payload}
def mcp_lines(payload):return [
 {'jsonrpc':'2.0','id':1,'method':'initialize','params':{'protocolVersion':MCP_VERSION,'capabilities':{},'clientInfo':{'name':'selection-check','version':'1'}}},
 {'jsonrpc':'2.0','method':'notifications/initialized'},
 {'jsonrpc':'2.0','id':2,'method':'tools/list'},
 {'jsonrpc':'2.0','id':3,'method':'tools/call','params':{'name':'delivery_inspect','arguments':{'payload':payload}}}]

class SelectionTests(unittest.TestCase):
 def test_four_scopes_sorted_explicit_names_keep_full_source_and_exact_utf8(self):
  for scope in ['music','storyboard','lyrics','audio']:
   source=fixture(scope);before=copy.deepcopy(source);files,data=select(source['files'],['selected.txt','empty.txt'])
   self.assertEqual(files,{'empty.txt':'','selected.txt':source['files']['selected.txt']});self.assertEqual(data['names'],['empty.txt','selected.txt']);self.assertEqual(data['source_bytes'],46);self.assertEqual(data['json_bytes'],len(json_text(files).encode()));self.assertEqual(data['schema_version'],1);self.assertEqual(source,before)
 def test_invalid_names_shapes_duplicates_paths_devices_and_missing_names_refuse_whole_selection(self):
  for names in [None,[],True,'selected.txt',[True],['../selected.txt'],['C:\\x.txt'],['NUL.txt'],['delivery-manifest.json'],['song.wav'],['selected.txt','selected.txt'],['selected.txt','SELECTED.TXT'],['x'*101+'.txt'],['x.txt']*65]:
   with self.assertRaises(ValueError):checked_names(names)
  for names in [['absent.txt'],['selected.txt','absent.txt'],['Selected.txt']]:
   with self.assertRaises(ValueError):select(fixture()['files'],names)
 def test_application_shape_rejects_invalid_options_before_reading_source(self):
  for payload in [{'file_names':None,'include_files':True},{'file_names':[],'include_files':True},{'file_names':['selected.txt']},{'file_names':['selected.txt'],'include_files':1},{'file_names':['selected.txt'],'include_files':True,'include_report':True,'baseline':{'scope':'lyrics','files':{}}},{'file_names':['selected.txt'],'include_files':True,'path':'outside'}]:
   with patch('musiclab.application.read_delivery',side_effect=AssertionError('must not read')),self.assertRaises(ValueError):build('delivery_inspect',payload,delivery_source='not-read.zip')
 def test_verified_full_eight_MiB_64_file_archive_returns_small_subset_and_preserves_default_cap(self):
  source=fixture(wide=True);archive=prepare(source).archive;before=hashlib.sha256(archive).hexdigest();payload={'include_files':True,'file_names':['selected.txt','empty.txt']}
  result=build('delivery_inspect',payload,delivery_source=io.BytesIO(archive));self.assertEqual(result.data['manifest']['source_bytes'],MAX_SOURCE_BYTES);self.assertEqual(result.data['manifest']['file_count'],64);self.assertEqual(result.data['archive_sha256'],before);self.assertEqual(set(result.files),{'selected.txt','empty.txt'})
  with self.assertRaises(ValueError):build('delivery_inspect',{'include_files':True},delivery_source=io.BytesIO(archive))
  with self.assertRaises(ValueError):build('delivery_inspect',{'include_files':True,'file_names':['full.txt']},delivery_source=io.BytesIO(archive))
  self.assertEqual(build('delivery_inspect',{},delivery_source=io.BytesIO(archive)).files,{});self.assertEqual(hashlib.sha256(archive).hexdigest(),before)
 def test_serialized_json_budget_exact_boundary_and_control_escape_overflow(self):
  overhead=len(json_text({'boundary.txt':''}).encode());text='a'*(MAX_INLINE_FILES_BYTES-overhead)
  for tail,accepted in [('',True),('a',False)]:
   archive=prepare({'scope':'music','files':{'boundary.txt':text+tail}}).archive
   if accepted:self.assertEqual(build('delivery_inspect',{'include_files':True,'file_names':['boundary.txt']},delivery_source=io.BytesIO(archive)).data['selection']['json_bytes'],MAX_INLINE_FILES_BYTES)
   else:
    with self.assertRaises(ValueError):build('delivery_inspect',{'include_files':True,'file_names':['boundary.txt']},delivery_source=io.BytesIO(archive))
  archive=prepare({'scope':'audio','files':{'controls.txt':'\x00'*100000}}).archive
  with self.assertRaises(ValueError):build('delivery_inspect',{'include_files':True,'file_names':['controls.txt']},delivery_source=io.BytesIO(archive))
 def test_comparison_still_covers_the_entire_archive_when_only_one_file_returned(self):
  source=fixture();archive=prepare(source).archive;baseline={'scope':'lyrics','files':{'old.txt':'old','selected.txt':'before'}}
  result=build('delivery_inspect',{'include_files':True,'file_names':['empty.txt'],'baseline':baseline},delivery_source=io.BytesIO(archive));self.assertEqual(result.files,{'empty.txt':''});self.assertEqual(result.data['comparison']['incoming']['file_count'],3);self.assertEqual(len(result.data['comparison']['files']),4);self.assertEqual(result.data['manifest']['file_count'],3)
 def test_corrupt_unselected_entry_is_rejected_instead_of_partial_trust(self):
  archive=prepare(fixture(wide=True)).archive
  with zipfile.ZipFile(io.BytesIO(archive)) as z:offset=z.getinfo('full.txt').header_offset
  name,extra=struct.unpack_from('<HH',archive,offset+26);bad=bytearray(archive);bad[offset+30+name+extra]^=1
  with self.assertRaises(ValueError):build('delivery_inspect',{'include_files':True,'file_names':['selected.txt']},delivery_source=io.BytesIO(bad))
 def test_default_wire_unchanged_and_selection_schema_is_independent(self):
  archive=prepare(fixture()).archive;summary=build('delivery_inspect',{},delivery_source=io.BytesIO(archive));full=build('delivery_inspect',{'include_files':True},delivery_source=io.BytesIO(archive));self.assertEqual(summary.data,full.data);self.assertNotIn('selection',summary.data)
  schema=input_schema('delivery_inspect')['properties']['payload'];self.assertFalse(schema['additionalProperties']);self.assertEqual(schema['properties']['file_names']['maxItems'],64);self.assertTrue(schema['properties']['file_names']['uniqueItems']);self.assertIn({'const':True},[v['then'].get('properties',{}).get('include_files') for v in schema['allOf']]);c=capabilities();self.assertEqual(c['delivery_file_selection']['schema_version'],1);self.assertEqual(c['protocol_version'],1)
 def test_real_agent_and_mcp_from_other_cwd_share_selected_result_and_leave_source_unchanged(self):
  archive=prepare(fixture(wide=True)).archive;payload={'include_files':True,'file_names':['selected.txt','empty.txt']}
  with tempfile.TemporaryDirectory() as folder:
   source=Path(folder)/'selected.zip';source.write_bytes(archive);expected=build('delivery_inspect',payload,delivery_source=source).wire()
   p=subprocess.run([sys.executable,'-X','utf8',str(ROOT/'music_lab_agent.py'),'--delivery-zip',str(source)],input=json.dumps(request(payload))+'\n',capture_output=True,text=True,encoding='utf-8',cwd=folder,timeout=15);self.assertEqual(p.returncode,0,p.stderr);self.assertEqual(json.loads(p.stdout)['result'],expected)
   p=subprocess.run([sys.executable,'-X','utf8',str(ROOT/'music_lab_mcp.py'),'--delivery-zip',str(source)],input=''.join(json.dumps(r)+'\n' for r in mcp_lines(payload)),capture_output=True,text=True,encoding='utf-8',cwd=folder,timeout=15);self.assertEqual(p.returncode,0,p.stderr);responses=[json.loads(t) for t in p.stdout.splitlines()];self.assertEqual(len(responses[1]['result']['tools']),14);self.assertEqual(responses[2]['result']['structuredContent'],expected);self.assertFalse(responses[2]['result']['isError']);self.assertEqual(source.read_bytes(),archive);self.assertEqual([p.name for p in Path(folder).iterdir()],['selected.zip'])
 def test_missing_selected_zip_messages_are_operation_specific_and_path_free(self):
  missing=Path('synthetic-private-folder/not-found-selected.zip');payload={'include_files':True,'file_names':['selected.txt']}
  r=response(json.dumps(request(payload)),delivery_source=missing);self.assertFalse(r['ok']);self.assertEqual(r['error']['code'],'io_error');self.assertIn('--delivery-zip',r['error']['message']);self.assertNotIn('synthetic-private-folder',json.dumps(r));session=Session(delivery_source=missing)
  replies=[session.response(json.dumps(t)) for t in mcp_lines(payload)];r=replies[-1]['result'];self.assertTrue(r['isError']);self.assertIn('--delivery-zip',r['content'][0]['text']);self.assertNotIn('WAV',r['content'][0]['text']);self.assertNotIn('synthetic-private-folder',json.dumps(r))
 def test_cli_explicit_outputs_include_full_large_text_and_refuse_default_overwrite(self):
  archive=prepare(fixture(wide=True)).archive
  with tempfile.TemporaryDirectory() as folder:
   source=Path(folder)/'selected.zip';source.write_bytes(archive);out=Path(folder)/'out';args=[sys.executable,'-X','utf8',str(ROOT/'music_lab.py'),'delivery-inspect','--input',str(source),'--out',str(out),'--file-name','full.txt','--file-name','selected.txt']
   for extra,code in [([],0),([],1),(['--overwrite'],0)]:
    p=subprocess.run(args+extra,capture_output=True,timeout=15);self.assertEqual(p.returncode,code,p.stderr)
   with zipfile.ZipFile(source) as z:
    for name in ['full.txt','selected.txt']:self.assertEqual((out/name).read_bytes(),z.read(name))
   d=json.loads((out/'delivery-inspection.json').read_bytes());self.assertEqual(d['manifest']['source_bytes'],MAX_SOURCE_BYTES);self.assertGreater(d['selection']['json_bytes'],MAX_INLINE_FILES_BYTES);self.assertEqual(source.read_bytes(),archive);self.assertEqual(set(p.name for p in out.iterdir()),{'full.txt','selected.txt','delivery-inspection.json'})
 def test_cli_name_collision_missing_and_report_mix_fail_before_writing(self):
  with tempfile.TemporaryDirectory() as folder:
   source=Path(folder)/'selected.zip';source.write_bytes(prepare({'scope':'lyrics','files':{'Delivery-Inspection.JSON':'original','selected.txt':'small'}}).archive)
   for index,extras in enumerate([['--file-name','Delivery-Inspection.JSON'],['--file-name','selected.txt','--file-name','missing.txt'],['--file-name','selected.txt','--comparison-report']]):
    out=Path(folder)/str(index);p=subprocess.run([sys.executable,'-X','utf8',str(ROOT/'music_lab.py'),'delivery-inspect','--input',str(source),'--out',str(out),*extras],capture_output=True,timeout=10);self.assertEqual(p.returncode,1,p.stderr);self.assertFalse(out.exists())
if __name__=='__main__':unittest.main()
