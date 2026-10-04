# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
import json,threading,urllib.error,urllib.parse,urllib.request,unittest
from music_lab_server import WorkbenchServer,WorkbenchHandler

class ReportDownloadTests(unittest.TestCase):
 @classmethod
 def setUpClass(cls):
  cls.server=WorkbenchServer(('127.0.0.1',0),WorkbenchHandler);cls.server.draft_library=None;cls.thread=threading.Thread(target=cls.server.serve_forever);cls.thread.start();cls.url='http://127.0.0.1:'+str(cls.server.server_port)
 @classmethod
 def tearDownClass(cls):
  cls.server.shutdown();cls.thread.join(10);cls.server.server_close()
 def post(self,fields):
  raw=urllib.parse.urlencode(fields).encode();request=urllib.request.Request(self.url+'/api/export',data=raw,method='POST')
  try:
   with urllib.request.urlopen(request,timeout=10) as response:return response.status,response.read()
  except urllib.error.HTTPError as error:return error.code,error.read()
 def test_json_string_transport_preserves_original_lf_crlf_controls_and_unicode(self):
  for text in ['line one\nline two\n','CRLF\r\nLF\nCR\r\x00💡繁體中文','']:
   encoded=json.dumps(text,ensure_ascii=False);self.assertNotIn('\n',encoded);status,raw=self.post({'name':'delivery-comparison.md','content':encoded,'encoding':'json-string'});self.assertEqual(status,200);self.assertEqual(raw,text.encode('utf-8'))
 def test_encoded_export_refuses_unknown_encoding_shape_duplicates_and_nontext(self):
  for fields in [{'name':'x.md','content':'"ok"','encoding':'unknown'},{'name':'x.md','content':'{}','encoding':'json-string'},{'name':'x.md','content':'"ok"','encoding':'json-string','path':'outside'},[('name','x.md'),('content','"first"'),('content','"second"'),('encoding','json-string')],{'name':'x.md','content':r'"\ud800"','encoding':'json-string'}]:
   self.assertEqual(self.post(fields)[0],400)
 def test_legacy_export_remains_literal_and_report_asset_is_allowlisted(self):
  text='literal "quoted"\r\n';self.assertEqual(self.post({'name':'old.md','content':text}),(200,text.encode()))
  for name,marker in [('delivery-report.js',b'MusicDeliveryReport'),('text-download.js',b'MusicTextDownload'),('text-download-dom.js',b'MusicTextDownloadDom')]:
   with urllib.request.urlopen(self.url+'/'+name,timeout=10) as response:self.assertEqual(response.status,200);self.assertIn(marker,response.read())
