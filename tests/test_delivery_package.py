# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
import base64, copy, hashlib, http.client, io, json, os, subprocess, sys, tempfile, threading, unittest, zipfile
from pathlib import Path
from unittest.mock import patch
from musiclab.delivery_package import prepare, decode, MAX_SOURCE_BYTES, MAX_INLINE_BYTES, MAX_REQUEST_BYTES, MANIFEST_NAME
from musiclab.delivery_files import write_archive
from musiclab.application import build, capabilities
from musiclab.backup_downloads import BackupDownloads
from music_lab_agent import response
from music_lab_mcp import Session, MCP_VERSION, tool_list
from music_lab_server import WorkbenchServer, WorkbenchHandler, delivery_downloads
ROOT=Path(__file__).resolve().parents[1]
def payload(): return {'scope':'music','label':'原創\n交付','files':{'task.md':'甲\n乙','brief.json':'{}\n','empty.txt':''}}
class DeliveryTests(unittest.TestCase):
 def test_deterministic_bytes_manifest_and_preserved_input(self):
  p=payload(); old=copy.deepcopy(p); a=prepare(p); b=prepare({**p,'files':dict(reversed(list(p['files'].items())))})
  self.assertEqual(a.archive,b.archive);self.assertEqual(p,old)
  with zipfile.ZipFile(io.BytesIO(a.archive)) as z:
   self.assertIsNone(z.testzip());self.assertEqual(z.namelist(),sorted(p['files'])+[MANIFEST_NAME])
   self.assertEqual(json.loads(z.read(MANIFEST_NAME)),a.manifest)
   for record in a.manifest['files']:
    raw=z.read(record['name']);self.assertEqual(raw,p['files'][record['name']].encode());self.assertEqual(len(raw),record['bytes']);self.assertEqual(hashlib.sha256(raw).hexdigest(),record['sha256'])
   for i in z.infolist():self.assertEqual(i.date_time,(1980,1,1,0,0,0));self.assertEqual(i.compress_type,zipfile.ZIP_STORED)
  self.assertEqual(a.manifest['content_validation'],'not_performed')
 def test_invalid_names_and_media_are_rejected(self):
  for name in ['../a.md','a/b.md','a\\b.md','CON.txt','lPt9.json','x.wav','x.mp4','x','x.txt.','é.md','DELIVERY-MANIFEST.json','delivery-manifest.JSON']:
   with self.subTest(name=name),self.assertRaises(ValueError):prepare({'scope':'audio','files':{name:'x'}})
 def test_case_collisions_and_non_text_rejected(self):
  for files in [{'a.md':'x','A.MD':'y'},{'a.md':b'bytes'}, {}, {'a.md':'\ud800'}, {f'a{i}.md':'' for i in range(65)}]:
   with self.assertRaises(ValueError):prepare({'scope':'music','files':files})
 def test_extra_paths_unknown_scope_and_wrong_types_rejected(self):
  for change in [{'output':'x'},{'scope':'foreign'},{'label':'a'*201},{'label':'\ud800'},{'include_archive':1},{'files':[]},{'scope':True}]:
   with self.assertRaises(ValueError):prepare({**payload(),**change})
 def test_utf8_budget_and_json_envelope_are_independent(self):
  with self.assertRaises(ValueError):prepare({'scope':'music','files':{'a.md':'界'*(MAX_SOURCE_BYTES//3+1)}})
  with self.assertRaises(ValueError):prepare({'scope':'music','files':{'a.md':'\x00'*MAX_SOURCE_BYTES}})
  a=prepare({'scope':'audio','files':{'a.txt':'a'*MAX_SOURCE_BYTES}});self.assertEqual(a.manifest['source_bytes'],MAX_SOURCE_BYTES)
 def test_strict_decoder_duplicate_unicode_and_capacity(self):
  self.assertEqual(decode(b'\xef\xbb\xbf'+json.dumps(payload(),ensure_ascii=False).encode()),payload())
  for raw in [b'{"scope":"music","scope":"audio","files":{}}',b'{"a":"\\ud800"}',b'{}'+b' '*(MAX_REQUEST_BYTES-1)]:
   with self.assertRaises(ValueError):decode(raw)
 def test_explicit_small_inline_only_and_summary_copy(self):
  a=prepare(payload());summary=a.summary();self.assertNotIn('archive_base64',summary)
  self.assertEqual(base64.b64decode(a.summary(True)['archive_base64']),a.archive)
  summary['manifest']['files'].clear();self.assertEqual(len(a.manifest['files']),3)
  big=prepare({'scope':'music','files':{'a.md':'x'*MAX_INLINE_BYTES}})
  self.assertNotIn('archive_base64',big.summary())
  with self.assertRaises(ValueError):big.summary(True)
 def test_cli_writer_exclusive_overwrite_and_cleanup(self):
  with tempfile.TemporaryDirectory() as folder:
   a=prepare(payload());target=write_archive(folder,a);self.assertEqual(target.read_bytes(),a.archive)
   with self.assertRaises(ValueError):write_archive(folder,prepare({'scope':'audio','files':{'a.md':'other'}}))
   self.assertEqual(target.read_bytes(),a.archive);self.assertEqual(list(Path(folder).iterdir()),[target])
   b=prepare({'scope':'audio','files':{'a.md':'other'}});write_archive(folder,b,overwrite=True);self.assertEqual(target.read_bytes(),b.archive)
 def test_racing_destination_is_preserved(self):
  with tempfile.TemporaryDirectory() as folder:
   target=Path(folder)/'zoe-delivery.zip';real=os.link
   def race(src,dst):target.write_bytes(b'preserve');return real(src,dst)
   with patch('musiclab.delivery_files.os.link',side_effect=race),self.assertRaises(FileExistsError):write_archive(folder,prepare(payload()))
   self.assertEqual(target.read_bytes(),b'preserve');self.assertEqual(list(Path(folder).iterdir()),[target])
 def test_cli_real_process_writes_only_selected_zip(self):
  with tempfile.TemporaryDirectory() as folder:
   selected=Path(folder)/'input.json';selected.write_text(json.dumps(payload(),ensure_ascii=False),encoding='utf-8');before=selected.read_bytes();out=Path(folder)/'out'
   args=[sys.executable,'-X','utf8',str(ROOT/'music_lab.py'),'delivery-package','--input',str(selected),'--out',str(out)]
   for expected in [0,1]:
    r=subprocess.run(args,capture_output=True,timeout=20);self.assertEqual(r.returncode,expected,r.stderr[-1000:])
   self.assertEqual(selected.read_bytes(),before);self.assertEqual([p.name for p in out.iterdir()],['zoe-delivery.zip'])
 def test_agent_and_initialized_mcp_share_metadata_inline_and_no_write(self):
  p=payload();wire=build('delivery_package',p).wire();self.assertEqual(wire['files'],{});self.assertTrue(wire['meta']['needs_review'])
  for inline in [False,True]:
   args={**p,'include_archive':inline};agent=response(json.dumps({'protocol_version':1,'id':'delivery','operation':'delivery_package','payload':args}))
   self.assertTrue(agent['ok']);session=Session();session.response(json.dumps({'jsonrpc':'2.0','id':1,'method':'initialize','params':{'protocolVersion':MCP_VERSION,'capabilities':{},'clientInfo':{'name':'synthetic','version':'1'}}}))
   session.response('{"jsonrpc":"2.0","method":"notifications/initialized"}')
   mcp=session.response(json.dumps({'jsonrpc':'2.0','id':2,'method':'tools/call','params':{'name':'delivery_package','arguments':{'payload':args}}}))
   self.assertEqual(mcp['result']['structuredContent'],agent['result']);self.assertEqual(agent['result'],build('delivery_package',args).wire())
  self.assertEqual(len(capabilities()['operations']),19);t=next(t for t in tool_list() if t['name']=='delivery_package');self.assertTrue(t['annotations']['readOnlyHint']);self.assertFalse(t['annotations']['openWorldHint'])
 def test_download_staging_take_once_cancel_expiry_and_owned_cleanup(self):
  cache=BackupDownloads(max_bytes=1024*1024,prefix='zoe-delivery-test-',download_path='/api/delivery-package/download/',hash_key='sha256',label='交付');a=prepare(payload())
  try:
   x=cache.prepare(a.archive,a.summary());y=cache.prepare(a.archive,a.summary());root=cache.root
   with self.assertRaises(ValueError):cache.prepare(a.archive,a.summary())
   self.assertTrue(cache.discard(x['download_url'].split('/')[-1]));self.assertFalse(cache.discard(x['download_url'].split('/')[-1]));self.assertEqual(cache.take(y['download_url'].split('/')[-1]),a.archive)
   self.assertFalse(root.exists())
   z=cache.prepare(a.archive,a.summary());root=cache.root
   with patch('musiclab.backup_downloads.time.monotonic',return_value=10**20),self.assertRaises(ValueError):cache.take(z['download_url'].split('/')[-1])
   self.assertFalse(root.exists())
  finally:cache.close()
 def test_tampered_staged_archive_refuses_and_removes_only_own_file(self):
  cache=BackupDownloads(hash_key='sha256',label='交付');a=prepare(payload())
  try:
   reply=cache.prepare(a.archive,a.summary());identifier=reply['download_url'].split('/')[-1];root=cache.root;stranger=root/'preserve.txt';stranger.write_text('private',encoding='utf-8');cache.records[identifier]['path'].write_bytes(b'changed')
   with self.assertRaises(ValueError):cache.take(identifier)
   cache.close();self.assertEqual(stranger.read_text(encoding='utf-8'),'private');stranger.unlink();root.rmdir()
  finally:cache.close()
class DeliveryHTTPTests(unittest.TestCase):
 def setUp(self):
  self.server=WorkbenchServer(('127.0.0.1',0),WorkbenchHandler);self.thread=threading.Thread(target=self.server.serve_forever);self.thread.start()
 def tearDown(self):self.server.shutdown();self.thread.join(5);self.server.server_close();self.assertFalse(self.thread.is_alive())
 def request(self,path,p=None,headers=None,method=None):
  c=http.client.HTTPConnection('127.0.0.1',self.server.server_port,timeout=5);raw=None if p is None else json.dumps(p,ensure_ascii=False).encode();c.request(method or ('GET' if p is None else 'POST'),path,body=raw,headers=headers or {});r=c.getresponse();status=r.status;data=r.read();h=dict(r.getheaders());c.close();return status,data,h
 def test_prepare_download_all_exact_bytes_and_take_once(self):
  status,data,_=self.request('/api/delivery-package/prepare',payload());self.assertEqual(status,200);reply=json.loads(data)
  status,raw,headers=self.request(reply['download_url']);self.assertEqual(status,200);self.assertEqual(raw,prepare(payload()).archive);self.assertEqual(hashlib.sha256(raw).hexdigest(),reply['sha256']);self.assertIn('zoe-delivery.zip',headers['Content-Disposition']);self.assertEqual(self.request(reply['download_url'])[0],400)
 def test_discard_and_server_close_remove_staging(self):
  replies=[json.loads(self.request('/api/delivery-package/prepare',payload())[1]) for _ in range(2)];root=delivery_downloads(self.server).root
  status,data,_=self.request('/api/delivery-package/discard',{'id':replies[0]['download_url'].split('/')[-1]});self.assertEqual(status,200);self.assertTrue(json.loads(data)['discarded']);self.assertEqual(self.request(replies[0]['download_url'])[0],400)
  self.server.shutdown();self.thread.join(5);self.server.server_close();self.assertFalse(root.exists())
 def test_wrong_origin_shape_and_query_are_refused(self):
  for path,p in [('/api/delivery-package/prepare?path=x',payload()),('/api/delivery-package/prepare',{**payload(),'include_archive':False}),('/api/delivery-package/prepare',{**payload(),'path':'private'}),('/api/delivery-package/discard',{'id':'../x'})]:self.assertEqual(self.request(path,p)[0],400)
  # Keep actual POST/403 assertions, with no unread body when rejected early.
  self.assertEqual(self.request('/api/delivery-package/prepare',headers={'Origin':'https://foreign.example'},method='POST')[0],403)
  self.assertEqual(self.request('/api/delivery-package/prepare',headers={'Host':'foreign.example'},method='POST')[0],403)
if __name__=='__main__':unittest.main()
