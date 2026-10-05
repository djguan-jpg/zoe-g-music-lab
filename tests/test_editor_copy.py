# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
import http.client, threading, unittest
from pathlib import Path
from music_lab_server import WorkbenchServer, WorkbenchHandler

ROOT=Path(__file__).resolve().parents[1]
class EditorCopyAssetsTests(unittest.TestCase):
    def setUp(self):
        self.server=WorkbenchServer(('127.0.0.1',0),WorkbenchHandler)
        self.thread=threading.Thread(target=self.server.serve_forever);self.thread.start()
    def tearDown(self):
        self.server.shutdown();self.thread.join(5);self.server.server_close()
    def get(self,path,headers=None):
        connection=http.client.HTTPConnection('127.0.0.1',self.server.server_port,timeout=5)
        try:
            connection.request('GET',path,headers=headers or {});reply=connection.getresponse()
            return reply.status,dict(reply.getheaders()),reply.read()
        finally:connection.close()
    def test_fixed_copy_assets_match_installation_and_load_after_draft_before_app(self):
        page=self.get('/')[2].decode()
        scripts=['draft-contract.js','editor-copy.js','editor-copy-dom.js','app.js']
        self.assertEqual([page.index('src="/'+name+'"') for name in scripts],sorted(page.index('src="/'+name+'"') for name in scripts))
        for name in scripts[1:3]:
            status,headers,raw=self.get('/'+name)
            self.assertEqual(status,200);self.assertEqual(raw,(ROOT/'web'/name).read_bytes())
            self.assertEqual(headers['Cache-Control'],'no-store');self.assertIn("script-src 'self'",headers['Content-Security-Policy'])
        for name in ['section-copy-note','shot-copy-note','cue-copy-note']:self.assertIn('id="'+name+'"',page)
        self.assertFalse(hasattr(self.server,'delivery_downloads'))
    def test_copy_assets_keep_host_origin_gates_and_cannot_select_user_paths(self):
        for route in ['/editor-copy.js','/editor-copy-dom.js']:
            for headers in [{'Host':'foreign.example'},{'Origin':'https://foreign.example'}]:self.assertEqual(self.get(route,headers)[0],403)
            self.assertEqual(self.get(route+'/extra')[0],404)
            self.assertEqual(self.get(route+'?path=outside')[2],(ROOT/'web'/route[1:]).read_bytes())
        self.assertEqual(self.get('/api/editor-copy')[0],404)

if __name__=='__main__':unittest.main()
