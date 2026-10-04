# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
import copy,io,json,subprocess,sys,tempfile,unittest
from pathlib import Path
from unittest.mock import patch
from musiclab.delivery_package import prepare,MAX_SOURCE_BYTES
from musiclab.delivery_inspect import read
from musiclab.delivery_review import compare
from musiclab.delivery_report import files,report,MAX_REPORT_BYTES
from musiclab.application import build
from musiclab.common import write_bundle
ROOT=Path(__file__).resolve().parents[1]
def fixture(scope='music'):
 old={'scope':scope,'files':{'changed.md':'舊合成原文\r\n','removed.txt':'這不是報告原文','same.html':'<script>literal()</script>'}}
 new={'scope':scope,'label':'來源<script>[link](https://example.invalid)\n\x00|💡','files':{'changed.md':'新合成原文\n','added.txt':'新原文','same.html':'<script>literal()</script>'}}
 inspected=read(io.BytesIO(prepare(new).archive));return old,new,inspected.data,compare(old,{'scope':scope,'files':new['files']})
class DeliveryReportTests(unittest.TestCase):
 def test_four_scopes_source_reference_deterministic_without_raw_text_or_mutation(self):
  for scope in ['music','storyboard','lyrics','audio']:
   old,new,source,c=fixture(scope);saved=copy.deepcopy([source,c]);result=files(source,c)
   self.assertEqual(result,files(source,c));data=json.loads(result['delivery-comparison.json']);self.assertEqual(data['source'],source);self.assertEqual(data['comparison'],c);self.assertTrue(data['needs_review']);self.assertNotIn('舊合成原文',str(result));self.assertNotIn('新合成原文',str(result));self.assertEqual([source,c],saved);self.assertLessEqual(sum(len(v.encode()) for v in result.values()),MAX_REPORT_BYTES)
 def test_markdown_escapes_html_links_controls_and_preserves_raw_label_in_json(self):
  _,new,source,c=fixture();r=files(source,c);md=r['delivery-comparison.md'];self.assertIn('&lt;script&gt;',md);self.assertNotIn('<script>',md);self.assertIn('\\[link\\]\\(https://example.invalid\\)',md);self.assertIn('\\n\\u0000\\|',md);self.assertEqual(json.loads(r['delivery-comparison.json'])['source']['manifest']['label'],new['label'])
 def test_tampered_version_shape_metadata_counts_order_source_and_status_refuse(self):
  _,_,source,c=fixture()
  changes=[lambda s,d:s.update(path='outside'),lambda s,d:s.update(schema_version=True),lambda s,d:s.update(archive_sha256='bad'),lambda s,d:s['manifest'].update(tool_version='99'),lambda s,d:s['manifest'].update(source_bytes=0),lambda s,d:d.update(schema_version=True),lambda s,d:d.update(scope='audio'),lambda s,d:d['counts'].update(added=True),lambda s,d:d['files'].reverse(),lambda s,d:d['files'][0].update(status='unchanged'),lambda s,d:d['incoming'].update(source_bytes=0),lambda s,d:d['files'][0]['incoming'].update(sha256='0'*64),lambda s,d:d['files'][0].update(name='../outside.txt')]
  for change in changes:
   s=copy.deepcopy(source);d=copy.deepcopy(c);change(s,d)
   with self.assertRaises(ValueError):report(s,d)
 def test_full_128_row_budget_and_empty_baseline_and_empty_files_are_truthful(self):
  old={'scope':'lyrics','files':{f'old{i:02}-'+('a'*80)+'.txt':'old' for i in range(64)}};new={'scope':'lyrics','label':'💡'*200,'files':{f'new{i:02}-'+('b'*80)+'.txt':'' for i in range(64)}}
  source=read(io.BytesIO(prepare(new).archive)).data;c=compare(old,{'scope':'lyrics','files':new['files']});r=files(source,c);self.assertEqual(len(json.loads(r['delivery-comparison.json'])['comparison']['files']),128);self.assertLessEqual(sum(len(v.encode()) for v in r.values()),MAX_REPORT_BYTES)
  empty=compare({'scope':'lyrics','files':{}},{'scope':'lyrics','files':new['files']});self.assertEqual(report(source,empty)['comparison']['baseline']['file_count'],0)
 def test_application_report_opt_in_is_exclusive_and_default_wire_stays_unchanged(self):
  old,new,source,c=fixture();raw=prepare(new).archive
  result=build('delivery_inspect',{'baseline':old,'include_report':True},delivery_source=io.BytesIO(raw));self.assertEqual(result.files,files(source,c));self.assertEqual(result.data['comparison'],c);self.assertTrue(result.needs_review)
  self.assertEqual(build('delivery_inspect',{'baseline':old},delivery_source=io.BytesIO(raw)).files,{})
  for payload in [{'include_report':True},{'baseline':old,'include_report':1},{'baseline':old,'include_report':True,'include_files':True}]:
   with patch('musiclab.application.read_delivery',side_effect=AssertionError('must refuse before reading')),self.assertRaises(ValueError):build('delivery_inspect',payload,delivery_source=io.BytesIO(raw))
 def test_cli_writes_three_reports_and_preserves_source_with_refusal_and_explicit_overwrite(self):
  old,new,source,c=fixture()
  with tempfile.TemporaryDirectory() as folder:
   d=Path(folder);selected=d/'selected.zip';selected.write_bytes(prepare(new).archive);baseline=d/'baseline.json';baseline.write_text(json.dumps(old,ensure_ascii=False),encoding='utf-8');before=selected.read_bytes();out=d/'out'
   args=[sys.executable,'-X','utf8',str(ROOT/'music_lab.py'),'delivery-inspect','--input',str(selected),'--compare-input',str(baseline),'--comparison-report','--out',str(out)]
   def run(extra=[]):return subprocess.run(args+extra,cwd=folder,capture_output=True,text=True,encoding='utf-8',timeout=10)
   self.assertEqual(run().returncode,0);self.assertEqual(sorted(p.name for p in out.iterdir()),['delivery-comparison.json','delivery-comparison.md','delivery-inspection.json']);self.assertEqual(json.loads((out/'delivery-comparison.json').read_text())['source'],source);saved={p.name:p.read_bytes() for p in out.iterdir()};self.assertEqual(run().returncode,1);self.assertEqual({p.name:p.read_bytes() for p in out.iterdir()},saved);self.assertEqual(run(['--overwrite']).returncode,0);self.assertEqual(selected.read_bytes(),before)
 def test_report_names_cannot_replace_original_files_via_combined_flags(self):
  old={'scope':'music','files':{}};new={'scope':'music','files':{'delivery-comparison.json':'保留這份原成果'}};raw=prepare(new).archive
  with self.assertRaises(ValueError):build('delivery_inspect',{'baseline':old,'include_report':True,'include_files':True},delivery_source=io.BytesIO(raw))
  self.assertEqual(build('delivery_inspect',{'include_files':True},delivery_source=io.BytesIO(raw)).files,new['files'])
 def test_default_text_writer_refuses_a_file_that_arrives_after_preflight(self):
  with tempfile.TemporaryDirectory() as folder:
   d=Path(folder)/'out';original=Path.mkdir
   def race(path,*args,**kwargs):
    original(path,*args,**kwargs)
    if path==d:(d/'report.md').write_bytes(b'other writer')
   with patch.object(Path,'mkdir',race),self.assertRaises(ValueError):write_bundle(d,{'report.md':'new content'})
   self.assertEqual((d/'report.md').read_bytes(),b'other writer')
 def test_multi_file_race_preserves_interloper_and_reports_failure_without_fake_atomicity(self):
  with tempfile.TemporaryDirectory() as folder:
   d=Path(folder);original=Path.open
   def race(path,*args,**kwargs):
    if path.name=='second.md' and args and args[0]=='x':
     with original(path,'xb') as stream:stream.write(b'other writer')
    return original(path,*args,**kwargs)
   with patch.object(Path,'open',race),self.assertRaisesRegex(ValueError,'部分新成果'):write_bundle(d,{'first.md':'own first','second.md':'own second'})
   self.assertEqual((d/'first.md').read_text(),'own first');self.assertEqual((d/'second.md').read_bytes(),b'other writer')
