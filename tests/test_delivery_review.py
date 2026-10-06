# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
import copy,hashlib,io,json,subprocess,sys,tempfile,unittest
from pathlib import Path
from musiclab.delivery_review import compare,baseline,descriptor
from musiclab.delivery_package import prepare,MAX_SOURCE_BYTES
from musiclab.application import build,capabilities
from musiclab.tool_contracts import payload_schema
from music_lab_agent import response
from music_lab_mcp import Session,MCP_VERSION
ROOT=Path(__file__).resolve().parents[1]
def examples(scope='music'):
 return {'scope':scope,'files':{'changed.md':'原文\r\n','empty.txt':'','removed.txt':'移除','same.html':'<script>literal()</script>'}},{'scope':scope,'files':{'added.json':'{}','changed.md':'原文\n','empty.txt':'','same.html':'<script>literal()</script>'}}
def request(payload):return json.dumps({'protocol_version':1,'id':'comparison','operation':'delivery_inspect','payload':payload})
class DeliveryReviewTests(unittest.TestCase):
 def test_all_scopes_exact_names_bytes_empty_and_html_preserved(self):
  for scope in ['music','storyboard','lyrics','audio']:
   old,new=examples(scope);saved=copy.deepcopy([old,new]);data=compare(old,new)
   self.assertEqual(data['counts'],{'added':1,'changed':1,'removed':1,'unchanged':2});self.assertEqual(data['scope'],scope);self.assertEqual([old,new],saved)
   entries={x['name']:x for x in data['files']};self.assertEqual(entries['changed.md']['before']['sha256'],hashlib.sha256('原文\r\n'.encode()).hexdigest());self.assertIsNone(entries['removed.txt']['incoming']);self.assertEqual(entries['empty.txt']['incoming']['bytes'],0)
 def test_empty_baseline_and_same_files_do_not_invent_content_or_merge(self):
  old,new=examples();self.assertEqual(compare({'scope':'music','files':{}},new)['counts']['added'],4)
  self.assertEqual(compare(old,old)['counts']['unchanged'],4);self.assertEqual(compare({'scope':'music','files':{}},{'scope':'music','files':{}})['files'],[])
 def test_same_content_renamed_or_different_case_is_add_and_remove(self):
  result=compare({'scope':'music','files':{'A.md':'一樣'}},{'scope':'music','files':{'a.md':'一樣'}})
  self.assertEqual(result['counts'],{'added':1,'changed':0,'removed':1,'unchanged':0})
 def test_bad_shape_scope_name_unicode_and_capacity_refuse(self):
  bad=[None,{},[],{'scope':[],'files':{}},{'scope':'music','files':{},'path':'outside'}, {'scope':'music','files':{'../x.md':'x'}},{'scope':'music','files':{'x.wav':'x'}},{'scope':'music','files':{'x.md':'\ud800'}},{'scope':'music','files':{'x.md':'x'*(MAX_SOURCE_BYTES+1)}},{'scope':'music','files':{f'{i}.txt':'x' for i in range(65)}}]
  for value in bad:
   with self.assertRaises(ValueError):baseline(value)
  with self.assertRaises(ValueError):compare({'scope':'music','files':{}},{'scope':'audio','files':{}})
 def test_union_of_two_full_bounded_versions_keeps_all_128_rows(self):
  old={'scope':'lyrics','files':{f'old{i}.txt':'舊' for i in range(64)}};new={'scope':'lyrics','files':{f'new{i}.txt':'新' for i in range(64)}}
  d=compare(old,new);self.assertEqual(len(d['files']),128);self.assertEqual(d['counts']['removed'],64);self.assertEqual(d['counts']['added'],64)
 def test_application_metadata_optional_baseline_and_inline_independent(self):
  old,new=examples();raw=prepare(new).archive;payload={'baseline':old};saved=copy.deepcopy(payload)
  result=build('delivery_inspect',payload,delivery_source=io.BytesIO(raw));self.assertEqual(result.files,{});self.assertEqual(result.data['comparison'],compare(old,new));self.assertTrue(result.needs_review);self.assertEqual(payload,saved)
  full=build('delivery_inspect',{'baseline':old,'include_files':True},delivery_source=io.BytesIO(raw));self.assertEqual(full.data,result.data);self.assertEqual(full.files,new['files'])
  self.assertNotIn('comparison',build('delivery_inspect',{},delivery_source=io.BytesIO(raw)).data)
  for p in [{'baseline':None},{'baseline':{'scope':'audio','files':{}}},{'baseline':{'scope':'music','files':{},'label':'unknown'}}]:
   with self.assertRaises(ValueError):build('delivery_inspect',p,delivery_source=io.BytesIO(raw))
 def test_cli_comparison_source_unchanged_and_overwrite_requires_choice(self):
  old,new=examples()
  with tempfile.TemporaryDirectory() as folder:
   directory=Path(folder);source=directory/'selected.zip';source.write_bytes(prepare(new).archive);prior=directory/'baseline.json';prior.write_text(json.dumps(old,ensure_ascii=False),encoding='utf-8');before=source.read_bytes();out=directory/'out'
   args=[sys.executable,'-X','utf8',str(ROOT/'music_lab.py'),'delivery-inspect','--input',str(source),'--compare-input',str(prior),'--out',str(out)]
   def run(extra=[]):return subprocess.run(args+extra,cwd=folder,capture_output=True,text=True,encoding='utf-8',timeout=10)
   self.assertEqual(run().returncode,0);report=out/'delivery-inspection.json';self.assertEqual(json.loads(report.read_text())['comparison'],compare(old,new));saved=report.read_bytes();self.assertEqual(run().returncode,1);self.assertEqual(report.read_bytes(),saved);self.assertEqual(run(['--overwrite']).returncode,0);self.assertEqual(source.read_bytes(),before);self.assertEqual(json.loads(prior.read_text()),old)
 def test_actual_agent_and_mcp_compare_same_selected_zip_without_writes(self):
  old,new=examples();payload={'baseline':old}
  with tempfile.TemporaryDirectory() as folder:
   source=Path(folder)/'selected.zip';source.write_bytes(prepare(new).archive);expected=build('delivery_inspect',payload,delivery_source=source).wire()
   self.assertEqual(response(request(payload),delivery_source=source)['result'],expected)
   process=subprocess.run([sys.executable,'-X','utf8',str(ROOT/'music_lab_agent.py'),'--delivery-zip',str(source)],input=request(payload)+'\n',cwd=folder,capture_output=True,text=True,encoding='utf-8',timeout=10);self.assertEqual(process.returncode,0);self.assertEqual(json.loads(process.stdout)['result'],expected)
   messages=[{'jsonrpc':'2.0','id':1,'method':'initialize','params':{'protocolVersion':MCP_VERSION,'capabilities':{},'clientInfo':{'name':'synthetic','version':'1'}}},{'jsonrpc':'2.0','method':'notifications/initialized'},{'jsonrpc':'2.0','id':2,'method':'tools/call','params':{'name':'delivery_inspect','arguments':{'payload':payload}}}]
   process=subprocess.run([sys.executable,'-X','utf8',str(ROOT/'music_lab_mcp.py'),'--delivery-zip',str(source)],input='\n'.join(json.dumps(x) for x in messages)+'\n',cwd=folder,capture_output=True,text=True,encoding='utf-8',timeout=10);self.assertEqual(process.returncode,0,process.stderr);reply=json.loads(process.stdout.splitlines()[-1]);self.assertEqual(reply['result']['structuredContent'],expected);self.assertEqual([x.name for x in Path(folder).iterdir()],['selected.zip'])
 def test_discovery_schema_limits_baseline_and_preserves_tool_count(self):
  schema=payload_schema('delivery_inspect')['properties']['baseline'];self.assertFalse(schema['additionalProperties']);self.assertEqual(schema['required'],['scope','files']);self.assertEqual(schema['properties']['files']['maxProperties'],64)
  d=capabilities();self.assertEqual(d['delivery_comparison'],descriptor());self.assertEqual(len(d['operations']),21)
