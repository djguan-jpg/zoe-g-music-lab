# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
import http.client,threading,unittest
from pathlib import Path
from music_lab_server import ASSETS,WorkbenchHandler,WorkbenchServer
from musiclab.application import capabilities
ROOT=Path(__file__).resolve().parents[1]
class TextVerificationTests(unittest.TestCase):
 def test_static_assets_remain_fixed_local_files_and_basic_tools_unchanged(self):
  for name in ['text-verification.js','text-verification-controller.js','text-verification-dom.js']:
   self.assertEqual(ASSETS['/'+name],('web/'+name,'text/javascript'))
  self.assertEqual(len(capabilities()['operations']),16)
  self.assertNotIn('text_verification',capabilities()['operations'])
 def test_actual_loopback_serves_same_bytes_without_file_read_post_or_path_permission(self):
  class Handler(WorkbenchHandler):
   def log_message(self,*args):pass
  with WorkbenchServer(('127.0.0.1',0),Handler) as server:
   thread=threading.Thread(target=server.serve_forever);thread.start()
   try:
    connection=http.client.HTTPConnection('127.0.0.1',server.server_port,timeout=5)
    for name in ['text-verification.js','text-verification-controller.js','text-verification-dom.js']:
     connection.request('GET','/'+name);reply=connection.getresponse();self.assertEqual(reply.status,200);self.assertEqual(reply.read(),(ROOT/'web'/name).read_bytes())
    connection.request('POST','/api/text-verification',b'{"path":"unselected.txt"}',{'Content-Type':'application/json'});reply=connection.getresponse();self.assertEqual(reply.status,404);reply.read();connection.close()
   finally:server.shutdown();thread.join(5);self.assertFalse(thread.is_alive())
if __name__=='__main__':unittest.main()
