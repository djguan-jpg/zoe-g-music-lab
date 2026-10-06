# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
import copy,hashlib,http.client,json,subprocess,sys,tempfile,threading,unittest
from pathlib import Path
from musiclab.lyrics_search import search,checked_texts,markdown,MAX_SOURCE_BYTES
from musiclab.application import build,capabilities
from musiclab.tool_contracts import input_schema,output_schema
from music_lab_server import WorkbenchServer,WorkbenchHandler
ROOT=Path(__file__).resolve().parents[1]
class LyricsSearchTests(unittest.TestCase):
 def test_literal_raw_unicode_first_occurrence_original_rows(self):
  texts=['A🎵\r\n尾\x00e\u0301é','', '原句 原句','原句 原句']
  for q in ['A','a','🎵','\r\n','\x00','e\u0301','é','原句','.*']:
   before=copy.deepcopy(texts);r=search({'texts':texts,'query':q});expected=[]
   for i,t in enumerate(texts):
    p=t.encode().find(q.encode())
    if p>=0:expected.append({'row':i+1,'start_byte':p,'end_byte':p+len(q.encode()),'text':t})
   self.assertEqual(r['matches'],expected);self.assertEqual(r['total_matched_rows'],len(expected));self.assertEqual(texts,before)
  self.assertNotIn('原句',markdown(search({'texts':texts,'query':'原句'})).split('全部')[1])
 def test_pin_and_complete_counts_across_batches(self):
  texts=['']+['hit']*45;payload={'texts':texts,'query':'hit','max_results':20};first=search(payload);self.assertEqual(first['next_row'],22);hits=[];r=first
  while True:
   self.assertEqual(r['total_matched_rows'],45);hits+=r['matches']
   if r['next_row'] is None:break
   r=search(payload|{'start_row':r['next_row'],'source_sha256':first['source_sha256']})
  self.assertEqual([x['row'] for x in hits],list(range(2,47)))
  with self.assertRaises(ValueError):search(payload|{'start_row':2})
  with self.assertRaises(ValueError):search(payload|{'texts':['changed']+texts[1:],'source_sha256':first['source_sha256']})
  self.assertEqual(search({'texts':[],'query':'x'})['matches'],[])
 def test_strict_shape_unicode_integer_and_bounds(self):
  good={'texts':['a'],'query':'a'}
  for patch in [{'path':'x'},{'cues':[]},{'texts':None},{'texts':['\ud800']},{'texts':['x'*2001]},{'query':''},{'query':'🎵'*257},{'query':None},{'start_row':True},{'start_row':None},{'start_row':0},{'start_row':3},{'max_results':None},{'max_results':True},{'max_results':51},{'source_sha256':None},{'source_sha256':'a'*64+'\n'}]:
   with self.subTest(patch=repr(patch)[:80]),self.assertRaises(ValueError):search(good|patch)
  self.assertEqual(search({'texts':['🎵'*2000],'query':'🎵'*256})['query_bytes'],1024)
  self.assertEqual(search({'texts':['a']*10000,'query':'a','max_results':50})['total_rows'],10000)
  with self.assertRaises(ValueError):checked_texts(['a']*10001)
  with self.assertRaises(ValueError):checked_texts(['🎵'*2000]*263)
 def test_control_escape_report_budget_and_source_hash(self):
  payload={'texts':['\x00'*2000]*50,'query':'\x00','max_results':50};r=build('lyrics_search',payload);raw=json.dumps(payload['texts'],ensure_ascii=False,separators=(',',':')).encode();self.assertEqual(r.data['source_sha256'],hashlib.sha256(b'zoe-lyrics-texts-v1\n'+raw).hexdigest());self.assertEqual(r.data['source_bytes'],len(raw));self.assertGreater(len(r.files['lyrics-search.json'].encode()),512*1024);self.assertLess(len(json.dumps(r.wire()).encode()),2*1024*1024)
 def test_cross_language_raw_string_hash_and_report(self):
  vectors=[{'texts':['a🎵 原句',' 原句','a🎵 原句'],'query':'原句','max_results':1},{'texts':['\x00\r\n"\\\ufeffé e\u0301\u2028'],'query':'e\u0301'},{'texts':[],'query':'x'}]
  code="const P=require('./musiclab/assets/lyrics-search.js'),c=require('node:crypto');(async()=>{for(const p of JSON.parse(process.argv[1])){const r=await P.search(p,{hash:b=>c.createHash('sha256').update(b).digest('hex')});console.log(JSON.stringify({data:r,md:P.markdown(r)}))}})()"
  p=subprocess.run(['node','-e',code,json.dumps(vectors,ensure_ascii=True)],cwd=ROOT,capture_output=True,text=True,encoding='utf-8',timeout=10);self.assertEqual(p.returncode,0,p.stderr)
  for vector,line in zip(vectors,p.stdout.strip().split("\n")):
   r=search(vector);self.assertEqual(json.loads(line),{'data':r,'md':markdown(r)})
 def test_metadata_and_schema_is_read_only_no_path(self):
  c=capabilities();self.assertEqual(c['lyrics_search']['schema_version'],1);self.assertEqual(len(c['operations']),22);s=input_schema('lyrics_search')['properties']['payload'];self.assertFalse(s['additionalProperties']);self.assertEqual(s['allOf'][0]['then']['required'],['source_sha256']);self.assertEqual(output_schema('lyrics_search')['properties']['data']['properties']['schema_version']['const'],1)
 def test_actual_cli_agent_mcp_good_bad_good_and_exclusive_outputs(self):
  payload={'texts':['原句🎵','未校時原句'],'query':'原句'};expected=build('lyrics_search',payload).wire()
  with tempfile.TemporaryDirectory() as d:
   path=Path(d)/'request.json';path.write_text(json.dumps(payload),encoding='utf-8');out=Path(d)/'out';args=[sys.executable,'-X','utf8',str(ROOT/'music_lab.py'),'lyrics-search','--input',str(path),'--out',str(out)]
   for extra,code in [([],0),([],1),(['--overwrite'],0)]:self.assertEqual(subprocess.run(args+extra,capture_output=True,timeout=10).returncode,code)
   for name,text in expected['files'].items():self.assertEqual((out/name).read_bytes(),text.encode())
   requests=[{'protocol_version':1,'id':str(i),'operation':'lyrics_search','payload':v} for i,v in enumerate([payload,payload|{'path':'x'},payload])]
   p=subprocess.run([sys.executable,'-X','utf8',str(ROOT/'music_lab_agent.py')],input=''.join(json.dumps(v)+'\n' for v in requests),cwd=d,capture_output=True,text=True,encoding='utf-8',timeout=10);self.assertEqual(p.returncode,0,p.stderr);replies=[json.loads(v) for v in p.stdout.splitlines()];self.assertEqual([r['ok'] for r in replies],[True,False,True]);self.assertEqual(replies[0]['result'],expected);self.assertEqual(replies[2]['result'],expected)
   msgs=[{'jsonrpc':'2.0','id':1,'method':'initialize','params':{'protocolVersion':'2025-11-25','capabilities':{},'clientInfo':{'name':'search-test','version':'1'}}},{'jsonrpc':'2.0','method':'notifications/initialized'}]+[{'jsonrpc':'2.0','id':i+2,'method':'tools/call','params':{'name':'lyrics_search','arguments':{'payload':v}}} for i,v in enumerate([payload,payload|{'path':'x'},payload])]
   p=subprocess.run([sys.executable,'-X','utf8',str(ROOT/'music_lab_mcp.py')],input=''.join(json.dumps(v)+'\n' for v in msgs),cwd=d,capture_output=True,text=True,encoding='utf-8',timeout=10);self.assertEqual(p.returncode,0,p.stderr);replies=[json.loads(v) for v in p.stdout.splitlines()][1:];self.assertEqual([r['result']['isError'] for r in replies],[False,True,False]);self.assertEqual(replies[0]['result']['structuredContent'],expected)
 def test_actual_http_fixed_assets_raw_text_and_invalid_recovery(self):
  class Handler(WorkbenchHandler):
   def log_message(self,*args):pass
  with WorkbenchServer(('127.0.0.1',0),Handler) as server:
   t=threading.Thread(target=server.serve_forever);t.start()
   try:
    c=http.client.HTTPConnection('127.0.0.1',server.server_port,timeout=5)
    for name in ['lyrics-search.js','lyrics-search-controller.js','lyrics-search-dom.js']:
     c.request('GET','/'+name);r=c.getresponse();self.assertEqual(r.status,200);self.assertTrue(r.read())
    good={'texts':['未校時 🎵'],'query':'🎵'}
    for payload,status in [(good,200),(good|{'path':'x'},400),(good,200)]:
     c.request('POST','/api/lyrics-search',json.dumps(payload).encode(),{'Content-Type':'application/json'});r=c.getresponse();self.assertEqual(r.status,status);data=json.loads(r.read())
     if status==200:self.assertEqual(data,build('lyrics_search',good).wire())
    c.close()
   finally:server.shutdown();t.join(5);self.assertFalse(t.is_alive())
if __name__=='__main__':unittest.main()
