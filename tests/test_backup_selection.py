# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
"""Existing selected-ID export contract through the browser's bounded binary route."""
import io,json,threading,tempfile,unittest,http.client
from pathlib import Path
from unittest.mock import patch
from music_lab_server import WorkbenchServer,WorkbenchHandler
from musiclab.draft_backup import read_backup
from test_draft_backup import populate,IDS,contents
class Quiet(WorkbenchHandler):
 def log_message(self,*args):pass
class BackupSelectionTests(unittest.TestCase):
 def serve(self,check):
  with tempfile.TemporaryDirectory() as folder:
   library=populate(Path(folder)/'source');before=contents(library.root)
   with WorkbenchServer(('127.0.0.1',0),Quiet) as server:
    server.draft_library=library;t=threading.Thread(target=server.serve_forever);t.start()
    def call(method,path,payload=None,origin=None):
     c=http.client.HTTPConnection('127.0.0.1',server.server_port,timeout=5)
     try:
      c.request(method,path,json.dumps(payload) if payload is not None else None,{'Origin':origin or f'http://127.0.0.1:{server.server_port}'})
      reply=c.getresponse();return reply.status,reply.read(32*1024*1024+1)
     finally:c.close()
    try:check(library,server,call);self.assertEqual(contents(library.root),before)
    finally:server.shutdown();t.join(5);self.assertFalse(t.is_alive())
 def test_actual_selected_and_all_downloads_keep_exact_requested_ids_and_single_use(self):
  def check(library,server,call):
   available=sorted(library.directories())
   for payload,ids,selection in [({'ids':[IDS[1]]},[IDS[1]],'selected'),({},available,'all'),({'ids':list(reversed(available))},available,'selected')]:
    status,body=call('POST','/api/drafts/backup/prepare',payload);self.assertEqual(status,200);d=json.loads(body);self.assertEqual(d['selection'],selection);self.assertEqual(d['entry_count'],len(ids))
    status,raw=call('GET',d['download_url']);self.assertEqual(status,200);snapshot=read_backup(io.BytesIO(raw));self.assertEqual(snapshot['sha256'],d['backup_sha256']);self.assertEqual(len(raw),d['bytes']);self.assertEqual([v[0] for v in snapshot['revisions']],ids);self.assertEqual(call('GET',d['download_url'])[0],400)
  self.serve(check)
 def test_invalid_ids_unknown_fields_query_and_origin_reject_before_preparing_archive(self):
  def check(library,server,call):
   with patch('music_lab_server.export_library_backup',side_effect=AssertionError('archive must not be prepared')):
    for payload in [{'ids':[]},{'ids':None},{'ids':['../x']},{'ids':[IDS[0],IDS[0]]},{'ids':[IDS[0]],'path':'x'},{'include_archive':True}]:self.assertEqual(call('POST','/api/drafts/backup/prepare',payload)[0],400)
    self.assertEqual(call('POST','/api/drafts/backup/prepare?path=x',{'ids':[IDS[0]]})[0],400)
    self.assertEqual(call('POST','/api/drafts/backup/prepare',{'ids':[IDS[0]]},'https://outside.invalid')[0],403)
  self.serve(check)
 def test_selected_healthy_revision_can_be_backed_up_without_reading_unselected_revision(self):
  def check(library,server,call):
   original=library.revision_bytes
   with patch.object(library,'revision_bytes',side_effect=lambda ident:original(ident) if ident==IDS[0] else (_ for _ in ()).throw(ValueError('controlled unavailable other revision'))):
    self.assertEqual(call('POST','/api/drafts/backup/prepare',{})[0],400)
    status,body=call('POST','/api/drafts/backup/prepare',{'ids':[IDS[0]]});self.assertEqual(status,200);d=json.loads(body);status,raw=call('GET',d['download_url']);self.assertEqual(status,200);self.assertEqual([v[0] for v in read_backup(io.BytesIO(raw))['revisions']],[IDS[0]])
   self.assertEqual(call('POST','/api/drafts/backup/prepare',{'ids':['draft-'+'f'*32]})[0],500)
  self.serve(check)
if __name__=='__main__':unittest.main()
