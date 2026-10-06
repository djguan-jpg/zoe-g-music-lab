# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
import copy,hashlib,http.client,json,subprocess,sys,tempfile,threading,unittest
from pathlib import Path
from musiclab.music_search import search,checked_sections,markdown,FIELDS,MAX_SOURCE_BYTES
from musiclab.application import build,capabilities
from musiclab.tool_contracts import input_schema,output_schema
from music_lab_server import WorkbenchServer,WorkbenchHandler
ROOT=Path(__file__).resolve().parents[1]
def part(**values):return dict.fromkeys(FIELDS,'')|values
class MusicSearchTests(unittest.TestCase):
 def test_each_field_literal_utf8_first_match_original_order(self):
  for field in FIELDS:
   sections=[part(**{field:'A🎵\r\n尾\x00e\u0301é hit hit'}),part()]
   for query in ['A','a','🎵','\r\n','\x00','é','e\u0301','hit','.*']:
    before=copy.deepcopy(sections);r=search({'sections':sections,'query':query});p=sections[0][field].encode().find(query.encode())
    expected=[] if p<0 else [{'row':1,'field':field,'start_byte':p,'end_byte':p+len(query.encode()),'text':sections[0][field]}]
    self.assertEqual(r['matches'],expected);self.assertEqual(sections,before)
  r=search({'sections':[part(name='hit',focus='hit'),part(texture='hit')],'query':'hit'})
  self.assertEqual([m['field'] for m in r['matches']],['name','texture']);self.assertEqual(r['total_matched_rows'],2)
 def test_paging_pin_empty_and_source_key_order(self):
  sections=[part()]+[part(focus='hit') for _ in range(39)];p={'sections':sections,'query':'hit'};first=search(p);data=first;hits=[]
  while True:
   hits+=data['matches']
   if data['next_row'] is None:break
   data=search(p|{'start_row':data['next_row'],'source_sha256':first['source_sha256']})
  self.assertEqual([h['row'] for h in hits],list(range(2,41)))
  self.assertEqual(search(p|{'sections':[dict(reversed(list(s.items()))) for s in sections]})['source_sha256'],first['source_sha256'])
  with self.assertRaises(ValueError):search(p|{'start_row':2})
  sections[0]['name']='edited'
  with self.assertRaises(ValueError):search(p|{'source_sha256':first['source_sha256']})
  self.assertEqual(search({'sections':[],'query':'x'})['source_bytes'],2)
 def test_strict_shapes_unicode_capacity_and_no_times_or_paths(self):
  p={'sections':[part(focus='a')],'query':'a'}
  for patch in [{'path':'x'},{'panel':{}},{'sections':None},{'sections':[part(start='0')]},{'sections':[part(focus='\ud800')]},{'sections':[part(focus='a'*2001)]},{'query':''},{'query':'🎵'*257},{'start_row':True},{'start_row':None},{'max_results':0},{'max_results':51},{'source_sha256':None},{'source_sha256':'a'*64+'\n'}]:
   with self.subTest(patch=str(patch)[:80]),self.assertRaises(ValueError):search(p|patch)
  for sections in [[part()]*41,[dict.fromkeys(FIELDS,'\x00'*2000)]*40]:
   with self.assertRaises(ValueError):checked_sections(sections)
 def test_cross_language_original_strings_sha_and_markdown(self):
  vectors=[{'sections':[part(focus='🎵 hit\r\n\x00é e\u0301'),part(texture='hit')],'query':q,'max_results':1} for q in ['hit','\r\n','\x00','é','e\u0301']]+[{'sections':[],'query':'x'}]
  code="const P=require('./musiclab/assets/music-search.js'),c=require('node:crypto');(async()=>{for(const p of JSON.parse(process.argv[1])){const data=await P.search(p,{hash:b=>c.createHash('sha256').update(b).digest('hex')});console.log(JSON.stringify({data,md:P.markdown(data)}))}})()"
  p=subprocess.run(['node','-e',code,json.dumps(vectors,ensure_ascii=True)],cwd=ROOT,capture_output=True,text=True,encoding='utf-8',timeout=10);self.assertEqual(p.returncode,0,p.stderr)
  for vector,line in zip(vectors,p.stdout.splitlines()):self.assertEqual(json.loads(line),{'data':search(vector),'md':markdown(search(vector))})
 def test_maximum_results_remain_within_existing_transport(self):
  p={'sections':[part(focus='🎵'*2000)]*40,'query':'🎵','max_results':50};r=build('music_search',p)
  self.assertLess(len(json.dumps(r.wire(),ensure_ascii=False).encode()),2*1024*1024)
  raw=json.dumps(p['sections'],ensure_ascii=False,separators=(',',':')).encode()
  self.assertEqual(r.data['source_sha256'],hashlib.sha256(b'zoe-music-texts-v1\n'+raw).hexdigest())
 def test_discovery_exact_readonly_schema_and_independent_versions(self):
  c=capabilities();self.assertEqual(len(c['operations']),19);self.assertEqual(c['music_search']['fields'],list(FIELDS));self.assertTrue(c['music_search']['read_only'])
  p=input_schema('music_search')['properties']['payload'];self.assertFalse(p['additionalProperties']);self.assertEqual(p['allOf'][0]['then']['required'],['source_sha256'])
  d=output_schema('music_search')['properties']['data'];self.assertEqual(d['properties']['schema_version']['const'],1);self.assertFalse(d['additionalProperties'])
 def test_actual_cli_agent_mcp_good_bad_good_and_exclusive_outputs(self):
  payload={'sections':[part(focus='原句🎵'),part(texture='未校時原句')],'query':'原句'};expected=build('music_search',payload).wire()
  with tempfile.TemporaryDirectory() as d:
   path=Path(d)/'request.json';path.write_text(json.dumps(payload),encoding='utf-8');out=Path(d)/'out';args=[sys.executable,'-X','utf8',str(ROOT/'music_lab.py'),'music-search','--input',str(path),'--out',str(out)]
   for extra,code in [([],0),([],1),(['--overwrite'],0)]:self.assertEqual(subprocess.run(args+extra,capture_output=True,timeout=10).returncode,code)
   for name,text in expected['files'].items():self.assertEqual((out/name).read_bytes(),text.encode())
   requests=[{'protocol_version':1,'id':str(i),'operation':'music_search','payload':v} for i,v in enumerate([payload,payload|{'path':'x'},payload])]
   p=subprocess.run([sys.executable,'-X','utf8',str(ROOT/'music_lab_agent.py')],input=''.join(json.dumps(v)+'\n' for v in requests),cwd=d,capture_output=True,text=True,encoding='utf-8',timeout=10);self.assertEqual(p.returncode,0,p.stderr);replies=[json.loads(v) for v in p.stdout.splitlines()];self.assertEqual([r['ok'] for r in replies],[True,False,True]);self.assertEqual(replies[0]['result'],expected);self.assertEqual(replies[2]['result'],expected)
   msgs=[{'jsonrpc':'2.0','id':1,'method':'initialize','params':{'protocolVersion':'2025-11-25','capabilities':{},'clientInfo':{'name':'search-test','version':'1'}}},{'jsonrpc':'2.0','method':'notifications/initialized'}]+[{'jsonrpc':'2.0','id':i+2,'method':'tools/call','params':{'name':'music_search','arguments':{'payload':v}}} for i,v in enumerate([payload,payload|{'path':'x'},payload])]
   p=subprocess.run([sys.executable,'-X','utf8',str(ROOT/'music_lab_mcp.py')],input=''.join(json.dumps(v)+'\n' for v in msgs),cwd=d,capture_output=True,text=True,encoding='utf-8',timeout=10);self.assertEqual(p.returncode,0,p.stderr);replies=[json.loads(v) for v in p.stdout.splitlines()][1:];self.assertEqual([r['result']['isError'] for r in replies],[False,True,False]);self.assertEqual(replies[0]['result']['structuredContent'],expected)
 def test_actual_http_fixed_assets_raw_text_and_invalid_recovery(self):
  class Handler(WorkbenchHandler):
   def log_message(self,*args):pass
  with WorkbenchServer(('127.0.0.1',0),Handler) as server:
   t=threading.Thread(target=server.serve_forever);t.start()
   try:
    c=http.client.HTTPConnection('127.0.0.1',server.server_port,timeout=5)
    for name in ['music-search.js','music-search-controller.js','music-search-dom.js']:
     c.request('GET','/'+name);r=c.getresponse();self.assertEqual(r.status,200);self.assertTrue(r.read())
    good={'sections':[part(focus='未校時 🎵')],'query':'🎵'}
    for payload,status in [(good,200),(good|{'path':'x'},400),(good,200)]:
     c.request('POST','/api/music-search',json.dumps(payload).encode(),{'Content-Type':'application/json'});r=c.getresponse();self.assertEqual(r.status,status);data=json.loads(r.read())
     if status==200:self.assertEqual(data,build('music_search',good).wire())
    c.close()
   finally:server.shutdown();t.join(5);self.assertFalse(t.is_alive())
if __name__=='__main__':unittest.main()
