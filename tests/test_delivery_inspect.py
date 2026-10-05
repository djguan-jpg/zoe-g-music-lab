# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
import copy, hashlib, http.client, io, json, struct, subprocess, sys, tempfile, threading, unittest, zipfile
from pathlib import Path
from unittest.mock import patch
from musiclab.delivery_package import prepare, MAX_ARCHIVE_BYTES, MANIFEST_NAME
from musiclab.delivery_inspect import read, MAX_MANIFEST_BYTES
from musiclab.application import build
from music_lab_agent import response
from music_lab_mcp import Session,MCP_VERSION
from music_lab_server import WorkbenchServer,WorkbenchHandler
ROOT=Path(__file__).resolve().parents[1]
def source(scope='music'):
 return {'scope':scope,'label':'合成來源<literal>\n原文','files':{'empty.txt':'','source.md':'甲\n乙','view.html':'<script>neverExecute()</script>'}}
def altered(raw,change):
 with zipfile.ZipFile(io.BytesIO(raw)) as old:rows=[(i.filename,old.read(i)) for i in old.infolist()]
 stream=io.BytesIO()
 with zipfile.ZipFile(stream,'w') as z:
  for name,data in change(rows):
   e=zipfile.ZipInfo(name,(1980,1,1,0,0,0));e.create_system=3;e.external_attr=0o100644<<16;z.writestr(e,data)
 return stream.getvalue()
def request(payload={}):return {'protocol_version':1,'id':'synthetic-inspection','operation':'delivery_inspect','payload':payload}
class InspectionTests(unittest.TestCase):
 def test_four_scopes_both_versions_preserve_exact_text_and_selected_bytes(self):
  for scope in ['music','storyboard','lyrics','audio']:
   for version in ['0.38.0','0.39.0','0.40.0','0.41.0','0.42.0','0.43.0','0.44.0','0.45.0','0.46.0','0.47.0','0.48.0','0.49.0','0.50.0','0.51.0','0.52.0','0.53.0','0.54.0','0.55.0','0.56.0','0.57.0','0.58.0','0.59.0','0.60.0','0.61.0','0.62.0','0.63.0','0.64.0','0.65.0','0.66.0','0.67.0','0.68.0','0.69.0','0.99.0']:
    p=source(scope);before=copy.deepcopy(p);prepared=prepare(p,tool_version=version);selected=io.BytesIO(prepared.archive);selected.seek(1);result=read(selected)
    self.assertEqual(result.files,p['files']);self.assertEqual(result.data['manifest'],prepared.manifest);self.assertEqual(result.data['archive_sha256'],hashlib.sha256(prepared.archive).hexdigest());self.assertEqual(p,before);self.assertEqual(selected.getvalue(),prepared.archive)
 def test_no_source_size_empty_and_directory_bound_before_zip_allocations(self):
  raw=prepare(source()).archive
  for data in [b'',b'not zip',raw+b'trailer',raw*(MAX_ARCHIVE_BYTES//len(raw)+1)]:
   with self.assertRaises(ValueError):read(io.BytesIO(data))
  with self.assertRaises(ValueError):read(None)
  for index,value in [(8,66),(10,66),(12,32769),(4,1)]:
   bad=bytearray(raw);pos=len(raw)-22;struct.pack_into('<H' if index in [4,8,10] else '<L',bad,pos+index,value)
   with patch('musiclab.delivery_inspect.zipfile.ZipFile',side_effect=AssertionError('should not parse')),self.assertRaises(ValueError):read(io.BytesIO(bad))
 def test_tampered_text_even_with_valid_crc_is_rejected(self):
  raw=prepare(source()).archive;bad=altered(raw,lambda rows:[(n,b'different' if n=='source.md' else b) for n,b in rows])
  with self.assertRaises(ValueError):read(io.BytesIO(bad))
 def test_manifest_unknown_extra_boolean_wrong_hash_and_reformat_refuse(self):
  raw=prepare(source()).archive
  for edit in [lambda m:m.update(schema_version=2),lambda m:m.update(schema_version=True),lambda m:m.update(tool_version='99.0.0'),lambda m:m.update(path='private'),lambda m:m['files'][0].update(sha256='0'*64),lambda m:m.update(file_count=0),lambda m:m.update(scope='foreign')]:
   def change(rows):
    out=[]
    for n,b in rows:
     if n==MANIFEST_NAME:m=json.loads(b);edit(m);b=(json.dumps(m,ensure_ascii=False,indent=2)+'\n').encode()
     out.append((n,b))
    return out
   with self.assertRaises(ValueError):read(io.BytesIO(altered(raw,change)))
  with self.assertRaises(ValueError):read(io.BytesIO(altered(raw,lambda rows:[(n,json.dumps(json.loads(b)).encode() if n==MANIFEST_NAME else b) for n,b in rows])))
 def test_hidden_missing_reordered_path_media_and_duplicate_entries_refuse(self):
  raw=prepare(source()).archive
  for change in [lambda r:r+[('hidden.txt',b'x')],lambda r:r[:-1],lambda r:list(reversed(r)),lambda r:[('../x.md',r[0][1])]+r[1:],lambda r:[('song.wav',r[0][1])]+r[1:],lambda r:r+[r[0]]]:
   with self.assertRaises(ValueError):read(io.BytesIO(altered(raw,change)))
 def test_compression_symlink_comment_bad_crc_and_invalid_unicode_refuse(self):
  raw=prepare(source()).archive
  def zip_variant(compression,attrs,comment):
   result=io.BytesIO()
   with zipfile.ZipFile(io.BytesIO(raw)) as old,zipfile.ZipFile(result,'w') as z:
    z.comment=comment
    for i in old.infolist():
     data=old.read(i);i=copy.copy(i);i.compress_type=compression;i.external_attr=attrs;z.writestr(i,data)
   return result.getvalue()
  for bad in [zip_variant(zipfile.ZIP_DEFLATED,0o100644<<16,b''),zip_variant(zipfile.ZIP_STORED,0o120777<<16,b''),zip_variant(zipfile.ZIP_STORED,0o100644<<16,b'comment'),altered(raw,lambda r:[(n,b'\xff' if n=='source.md' else b) for n,b in r])]:
   with self.assertRaises(ValueError):read(io.BytesIO(bad))
  with zipfile.ZipFile(io.BytesIO(raw)) as z:offset=z.getinfo('source.md').header_offset
  bad=bytearray(raw);name_length,extra=struct.unpack_from('<HH',bad,offset+26);bad[offset+30+name_length+extra]^=1
  with self.assertRaises(ValueError):read(io.BytesIO(bad))
 def test_declared_oversized_manifest_refuses_before_read(self):
  raw=prepare(source()).archive;entries=[]
  real=zipfile.ZipFile
  class Fake:
   def __init__(self,*args):self.z=real(*args)
   def __enter__(self):return self
   def __exit__(self,*args):self.z.close()
   def infolist(self):
    rows=self.z.infolist();rows[-1].file_size=rows[-1].compress_size=MAX_MANIFEST_BYTES+1;return rows
   def read(self,*args):raise AssertionError('should not read oversized manifest')
  with patch('musiclab.delivery_inspect.zipfile.ZipFile',Fake),self.assertRaises(ValueError):read(io.BytesIO(raw))
 def test_application_default_metadata_bounded_opt_in_and_no_json_paths(self):
  archive=prepare(source()).archive
  summary=build('delivery_inspect',{},delivery_source=io.BytesIO(archive));self.assertEqual(summary.files,{});self.assertTrue(summary.needs_review)
  full=build('delivery_inspect',{'include_files':True},delivery_source=io.BytesIO(archive));self.assertEqual(full.files,source()['files']);self.assertEqual(summary.data,full.data)
  for p in [{'path':'outside'},{'include_files':1},{'archive_base64':'x'}]:
   with self.assertRaises(ValueError):build('delivery_inspect',p,delivery_source=io.BytesIO(archive))
  large=prepare({'scope':'music','files':{'literal.txt':'\x00'*100000}}).archive
  self.assertEqual(build('delivery_inspect',{},delivery_source=io.BytesIO(large)).files,{})
  with self.assertRaises(ValueError):build('delivery_inspect',{'include_files':True},delivery_source=io.BytesIO(large))
 def test_agent_real_selected_process_default_and_opt_in_preserve_source(self):
  with tempfile.TemporaryDirectory() as folder:
   f=Path(folder)/'selected.zip';raw=prepare(source()).archive;f.write_bytes(raw)
   for args in [{},{'include_files':True}]:
    p=subprocess.run([sys.executable,'-X','utf8',str(ROOT/'music_lab_agent.py'),'--delivery-zip',str(f)],input=json.dumps(request(args))+'\n',capture_output=True,text=True,encoding='utf-8',cwd=folder,timeout=10);self.assertEqual(p.returncode,0,p.stderr);self.assertEqual(json.loads(p.stdout)['result'],build('delivery_inspect',args,delivery_source=f).wire())
   self.assertEqual(f.read_bytes(),raw);self.assertEqual([x.name for x in Path(folder).iterdir()],['selected.zip']);self.assertFalse(response(json.dumps(request()))['ok'])
 def test_cli_readonly_report_refuses_overwrite(self):
  with tempfile.TemporaryDirectory() as folder:
   f=Path(folder)/'selected.zip';raw=prepare(source(),tool_version='0.38.0').archive;f.write_bytes(raw);out=Path(folder)/'report';args=[sys.executable,'-X','utf8',str(ROOT/'music_lab.py'),'delivery-inspect','--input',str(f),'--out',str(out)]
   for expected in [0,1]:p=subprocess.run(args,capture_output=True,timeout=15);self.assertEqual(p.returncode,expected,p.stderr)
   self.assertEqual(f.read_bytes(),raw);self.assertEqual([x.name for x in out.iterdir()],['delivery-inspection.json']);self.assertEqual(json.loads((out/'delivery-inspection.json').read_text())['manifest']['tool_version'],'0.38.0')
class InspectionHTTPTests(unittest.TestCase):
 def setUp(self):self.server=WorkbenchServer(('127.0.0.1',0),WorkbenchHandler);self.thread=threading.Thread(target=self.server.serve_forever);self.thread.start()
 def tearDown(self):self.server.shutdown();self.thread.join(5);self.server.server_close()
 def call(self,raw,path='/api/delivery-inspect',headers={}):
  c=http.client.HTTPConnection('127.0.0.1',self.server.server_port,timeout=5);c.request('POST',path,body=raw,headers=headers);r=c.getresponse();status=r.status;data=r.read();c.close();return status,data
 def test_http_shared_inspection_all_text_and_old_version_without_staging(self):
  for scope in ['music','storyboard','lyrics','audio']:
   raw=prepare(source(scope),tool_version='0.38.0').archive;status,data=self.call(raw);self.assertEqual(status,200);result=json.loads(data);self.assertEqual(result['files'],source(scope)['files']);self.assertEqual(result['data'],read(io.BytesIO(raw)).data)
  self.assertFalse(hasattr(self.server,'delivery_downloads'))
 def test_http_invalid_source_queries_and_origin_refuse(self):
  raw=prepare(source()).archive
  self.assertEqual(self.call(raw,'/api/delivery-inspect?path=x')[0],400)
  # Test early origin rejection without the Windows unread-body reset race.
  self.assertEqual(self.call(b'',headers={'Origin':'https://foreign.example'})[0],403);self.assertEqual(self.call(b'{}')[0],400)
if __name__=='__main__':unittest.main()
