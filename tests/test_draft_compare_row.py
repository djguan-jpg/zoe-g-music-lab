# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
import copy,hashlib,http.client,json,subprocess,sys,tempfile,threading,unittest
from pathlib import Path
from musiclab.application import build,capabilities
from musiclab.draft_contract import CONTRACT,draft_bytes,MAX_DRAFT_BYTES
from musiclab.draft_compare import compare as full_compare
from musiclab.draft_compare_row import compare,bundle,COLLECTIONS,MAX_REPORT_BYTES
from musiclab.tool_contracts import payload_schema,output_schema
from music_lab_mcp import tool_list
from music_lab_server import WorkbenchServer,WorkbenchHandler

ROOT=Path(__file__).resolve().parents[1]
def draft():return json.loads((ROOT/'examples/draft-comparison-baseline.json').read_text(encoding='utf-8'))
def payload(scope='lyrics',collection='cues',row=1):
 a=draft();b=copy.deepcopy(a);a['panels']['lyrics']['cues']=[{'start':'','end':'','text':'前原文\r\n🎵'}];b['panels']['lyrics']['cues']=[{'start':'','end':'','text':'後原文\n🎵'}]
 return {'baseline':a,'current':b,'selection':{'scope':scope,'collection':collection,'row':row}}

class DraftCompareRowTests(unittest.TestCase):
 def test_row_501_is_read_after_full_comparison_truncation_without_changing_sources(self):
  p=payload(row=501)
  for name,text in [('baseline','前'),('current','後')]:p[name]['panels']['lyrics']['cues']=[{'start':'','end':'','text':text+str(i)} for i in range(1,1001)]
  before=copy.deepcopy(p);whole=full_compare({k:p[k] for k in ['baseline','current']});self.assertTrue(whole['details_truncated']);self.assertFalse(any(x['row']==501 for x in whole['details']))
  d=compare(p);self.assertEqual(d['status'],'changed');self.assertEqual(d['fields'][2]['before']['excerpt'],'前501');self.assertEqual(d['fields'][2]['after']['excerpt'],'後501');self.assertEqual(d['source'],whole['source']);self.assertEqual(p,before)
 def test_all_six_collections_keep_all_fields_including_unchanged(self):
  for scope,collections in COLLECTIONS.items():
   for collection,columns in collections.items():
    with self.subTest(scope=scope,collection=collection):
     p=payload(scope,collection);a=p['baseline']['panels'][scope];b=p['current']['panels'][scope]
     row='' if collection in ('avoid','deliverables') else dict.fromkeys(columns,'')
     if collection=='motifs':row['id']='motif-1'
     if collection=='shots':row['screen_direction']='neutral'
     a[collection]=[row];b[collection]=[copy.deepcopy(row)]
     d=compare(p);self.assertEqual(d['status'],'unchanged');self.assertEqual([x['field'] for x in d['fields']],columns);self.assertTrue(all(not f['changed'] for f in d['fields']))
     if isinstance(row,str):b[collection][0]='後'
     else:b[collection][0][next(k for k in columns if k not in ('id','screen_direction','motif_id'))]='後'
     self.assertEqual(compare(p)['status'],'changed')
 def test_added_removed_and_empty_are_distinct_and_missing_both_refuses(self):
  p=payload();p['baseline']['panels']['lyrics']['cues']=[];p['current']['panels']['lyrics']['cues'][0]['text']=''
  d=compare(p);self.assertEqual(d['status'],'added');self.assertIsNone(d['fields'][2]['before']);self.assertEqual(d['fields'][2]['after']['bytes'],0)
  p['baseline'],p['current']=p['current'],p['baseline'];d=compare(p);self.assertEqual(d['status'],'removed');self.assertIsNone(d['fields'][2]['after']);self.assertEqual(d['fields'][2]['before']['excerpt'],'')
  p['selection']['row']=2
  with self.assertRaisesRegex(ValueError,'都不存在'):compare(p)
 def test_selection_strict_numbers_pairs_and_unknown_fields_refuse(self):
  for row in [True,False,1.0,'1',0,-1,10001,None]:
   p=payload();p['selection']['row']=row
   with self.subTest(row=row),self.assertRaises(ValueError):compare(p)
  for selected in [{'scope':'audio','collection':'fields','row':1},{'scope':'lyrics','collection':'shots','row':1},{'scope':'lyrics','collection':'cues','row':1,'path':'no'},{'scope':{},'collection':'cues','row':1}]:
   p=payload();p['selection']=selected
   with self.assertRaises(ValueError):compare(p)
 def test_complete_unselected_panel_legacy_and_extra_payload_are_validated(self):
  mutations=[lambda p:p.update(path='no'),lambda p:p['current'].update(schema_version=2),lambda p:p['current']['panels']['audio']['fields'].update(extra='no'),lambda p:p['current']['panels']['storyboard'].update(motifs=[{'id':'unknown','name':'','meaning':''}])]
  for mutate in mutations:
   p=payload();mutate(p);before=copy.deepcopy(p)
   with self.assertRaises(ValueError):compare(p)
   self.assertEqual(p,before)
 def test_invalid_unicode_outside_selected_row_and_full_draft_capacity_refuse(self):
  for mutate in [lambda p:p['baseline'].update(saved_at='\ud800'),lambda p:p['current']['panels']['audio']['fields'].update({'audio-profile':'\udfff'}),lambda p:p['current']['panels']['music']['fields'].update({'music-lyrics':'\ud800'})]:
   p=payload();mutate(p)
   with self.assertRaises(ValueError):compare(p)
  p=payload();p['current']['panels']['music']['fields']['music-lyrics']='a'*MAX_DRAFT_BYTES
  with self.assertRaisesRegex(ValueError,'1 MiB'):compare(p)
 def test_original_unicode_clock_spelling_hash_and_utf8_prefix_are_preserved(self):
  p=payload();a=p['baseline']['panels']['lyrics']['cues'][0];b=p['current']['panels']['lyrics']['cues'][0];a.update(start='01.0',text='e\u0301\r\n\0');b.update(start='1',text='a'*127+'🎵尾')
  d=compare(p);self.assertEqual(d['fields'][0]['before']['excerpt'],'01.0');self.assertEqual(d['fields'][2]['before']['excerpt'],a['text']);v=d['fields'][2]['after'];self.assertEqual(v['excerpt'],'a'*127);self.assertTrue(v['excerpt_truncated']);self.assertEqual(v['sha256'],hashlib.sha256(b['text'].encode()).hexdigest())
 def test_report_is_isolated_and_control_heavy_twelve_fields_stay_bounded(self):
  p=payload('storyboard','shots');cols=COLLECTIONS['storyboard']['shots'];p['baseline']['panels']['storyboard']['shots']=[{k:'neutral' if k=='screen_direction' else '' if k=='motif_id' else '\0'*1000 for k in cols}];p['current']['panels']['storyboard']['shots']=copy.deepcopy(p['baseline']['panels']['storyboard']['shots'])
  files=bundle(p);self.assertLessEqual(sum(len(v.encode()) for v in files.values()),MAX_REPORT_BYTES);d=compare(p);d['selection']['row']=999;d['fields'][0]['before']['excerpt']='changed';self.assertEqual(p['selection']['row'],1);self.assertEqual(compare(p)['fields'][0]['before']['excerpt'],'\0'*128)
 def test_inserted_duplicate_text_still_compares_original_ordinal(self):
  p=payload(row=2);a=[{'start':'','end':'','text':t} for t in ['重複','第二句','重複']];p['baseline']['panels']['lyrics']['cues']=a;p['current']['panels']['lyrics']['cues']=[{'start':'','end':'','text':'插入'},*copy.deepcopy(a)]
  d=compare(p);self.assertEqual(d['fields'][2]['before']['excerpt'],'第二句');self.assertEqual(d['fields'][2]['after']['excerpt'],'重複');self.assertNotIn('id',d['selection'])
 def test_discovery_exposes_one_readonly_tool_with_independent_schema(self):
  c=capabilities();self.assertEqual(len(c['operations']),22);self.assertTrue(c['draft_row_comparison']['read_only']);t=next(t for t in tool_list() if t['name']=='draft_compare_row');self.assertTrue(t['annotations']['readOnlyHint']);self.assertFalse(t['annotations']['openWorldHint']);self.assertEqual(len(tool_list()),22)
  self.assertEqual(payload_schema('draft_compare_row')['required'],['baseline','current','selection']);self.assertFalse(payload_schema('draft_compare_row')['additionalProperties']);self.assertEqual(output_schema('draft_compare_row')['properties']['data']['properties']['schema_version']['const'],1)
 def test_browser_full_report_and_markdown_match_python_for_all_collections_and_statuses(self):
  cases=[]
  for scope,collections in COLLECTIONS.items():
   for collection,columns in collections.items():
    p=payload(scope,collection);row='' if collection in ('avoid','deliverables') else {k:'motif-1' if k=='id' else 'neutral' if k=='screen_direction' else '' for k in columns};p['baseline']['panels'][scope][collection]=[row];p['current']['panels'][scope][collection]=[copy.deepcopy(row)];cases.append(p)
    for side in ['baseline','current']:
     candidate=copy.deepcopy(p);candidate[side]['panels'][scope][collection]=[];cases.append(candidate)
  p=payload(row=10000)
  for side,text in [('baseline','前'),('current','a'*127+'🎵尾')]:p[side]['panels']['lyrics']['cues']=[{'start':'00.00','end':'','text':text if i==9999 else ''} for i in range(10000)]
  cases.append(p)
  script="const M=require('./web/draft-compare-row.js');let s='';process.stdin.setEncoding('utf8');process.stdin.on('data',x=>s+=x);process.stdin.on('end',async()=>{const out=[];for(const p of JSON.parse(s)){const d=await M.compare(p);out.push({data:d,markdown:M.markdown(d)});}process.stdout.write(JSON.stringify(out));});"
  run=subprocess.run(['node','-e',script],cwd=ROOT,input=json.dumps(cases,ensure_ascii=False),capture_output=True,text=True,encoding='utf-8',timeout=20);self.assertEqual(run.returncode,0,run.stderr)
  for p,got in zip(cases,json.loads(run.stdout)):
   self.assertEqual(got['data'],compare(p));self.assertEqual(got['markdown'],bundle(p)['draft-row-comparison.md'])
 def test_real_agent_and_mcp_good_bad_good_full_wire_and_no_writes(self):
  p=payload();bad=dict(p,path='forbidden');expected=build('draft_compare_row',p).wire()
  with tempfile.TemporaryDirectory() as folder:
   requests=[{'protocol_version':1,'id':str(i),'operation':'draft_compare_row','payload':v} for i,v in enumerate([p,bad,p])]
   run=subprocess.run([sys.executable,'-X','utf8',str(ROOT/'music_lab_agent.py')],cwd=folder,input=''.join(json.dumps(x)+'\n' for x in requests),capture_output=True,text=True,encoding='utf-8',timeout=10);self.assertEqual(run.returncode,0,run.stderr);rows=list(map(json.loads,run.stdout.splitlines()));self.assertEqual([v['ok'] for v in rows],[True,False,True]);self.assertEqual(rows[0]['result'],expected);self.assertEqual(rows[2]['result'],expected)
   calls=[{'jsonrpc':'2.0','id':1,'method':'initialize','params':{'protocolVersion':'2025-11-25','capabilities':{},'clientInfo':{'name':'row-check','version':'1'}}},{'jsonrpc':'2.0','method':'notifications/initialized'}]+[{'jsonrpc':'2.0','id':i+2,'method':'tools/call','params':{'name':'draft_compare_row','arguments':{'payload':v}}} for i,v in enumerate([p,bad,p])]
   run=subprocess.run([sys.executable,'-X','utf8',str(ROOT/'music_lab_mcp.py')],cwd=folder,input=''.join(json.dumps(x)+'\n' for x in calls),capture_output=True,text=True,encoding='utf-8',timeout=10);self.assertEqual(run.returncode,0,run.stderr);rows=list(map(json.loads,run.stdout.splitlines()))[1:];self.assertEqual([v['result']['isError'] for v in rows],[False,True,False])
   for v in [rows[0],rows[2]]:self.assertEqual(v['result']['structuredContent'],expected);self.assertEqual(json.loads(v['result']['content'][0]['text']),expected)
   self.assertEqual(list(Path(folder).iterdir()),[])
 def test_loopback_http_full_wire_recovers_and_closes_owned_thread(self):
  p=payload();expected=build('draft_compare_row',p).wire()
  class Quiet(WorkbenchHandler):
   def log_message(self,*_):pass
  with WorkbenchServer(('127.0.0.1',0),Quiet) as server:
   t=threading.Thread(target=server.serve_forever);t.start()
   try:
    for v,status in [(p,200),(dict(p,selection={'scope':'lyrics','collection':'cues','row':True}),400),(p,200)]:
     c=http.client.HTTPConnection('127.0.0.1',server.server_port,timeout=3)
     try:
      c.request('POST','/api/draft-compare-row',json.dumps(v),{'Content-Type':'application/json'});reply=c.getresponse();self.assertEqual(reply.status,status);data=json.loads(reply.read())
      if status==200:self.assertEqual(data,expected)
     finally:c.close()
   finally:server.shutdown();t.join(timeout=3)
  self.assertFalse(t.is_alive())
 def test_cli_status_exclusive_outputs_and_original_bytes(self):
  p=payload()
  with tempfile.TemporaryDirectory() as folder:
   r=Path(folder);a=r/'a.json';b=r/'b.json';a.write_bytes(b'\xef\xbb\xbf'+draft_bytes(p['baseline']));b.write_bytes(draft_bytes(p['current']));before=[a.read_bytes(),b.read_bytes()]
   args=[sys.executable,'-X','utf8',str(ROOT/'music_lab.py'),'draft-compare-row','--baseline',str(a),'--current',str(b),'--scope','lyrics','--collection','cues','--row','1','--out',str(r/'reports')]
   def run(args):return subprocess.run(args,cwd=r,capture_output=True,text=True,encoding='utf-8',timeout=10)
   self.assertEqual(run(args).returncode,2);self.assertEqual({x.name:x.read_text(encoding='utf-8') for x in (r/'reports').iterdir()},bundle(p));saved={x.name:x.read_bytes() for x in (r/'reports').iterdir()};self.assertEqual(run(args).returncode,1);self.assertEqual({x.name:x.read_bytes() for x in (r/'reports').iterdir()},saved);self.assertEqual(run(args+['--overwrite']).returncode,2)
   same=list(args);same[same.index(str(b))]=str(a);same[same.index(str(r/'reports'))]=str(r/'same');self.assertEqual(run(same).returncode,0);self.assertEqual([a.read_bytes(),b.read_bytes()],before)
 def test_cli_invalid_json_selector_and_missing_rows_never_write(self):
  with tempfile.TemporaryDirectory() as folder:
   r=Path(folder);a=r/'a.json';b=r/'b.json';a.write_bytes(draft_bytes(payload()['baseline']))
   for i,raw in enumerate([b'{"schema_version":3,"schema_version":3}',b'\xff',b' '*(MAX_DRAFT_BYTES+4),draft_bytes(payload()['current'])]):
    b.write_bytes(raw);out=r/str(i);args=[sys.executable,'-X','utf8',str(ROOT/'music_lab.py'),'draft-compare-row','--baseline',str(a),'--current',str(b),'--scope','lyrics','--collection','cues','--row','2','--out',str(out)];run=subprocess.run(args,cwd=r,capture_output=True,text=True,encoding='utf-8',timeout=10);self.assertEqual(run.returncode,1);self.assertNotIn('Traceback',run.stderr);self.assertFalse(out.exists());self.assertEqual(b.read_bytes(),raw)

if __name__=='__main__':unittest.main()
