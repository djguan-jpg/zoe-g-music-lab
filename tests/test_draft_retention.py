# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
"""Real HTTP assets and native attachment responses used by retention-aware downloads."""
import http.client
import json
import threading
import unittest
import urllib.parse
from music_lab_server import WorkbenchServer, WorkbenchHandler
from musiclab import __version__


class RetentionHttpTests(unittest.TestCase):
    def setUp(self):
        self.server = WorkbenchServer(('127.0.0.1', 0), WorkbenchHandler)
        self.server.draft_library = None
        self.thread = threading.Thread(target=self.server.serve_forever, daemon=True)
        self.thread.start()
        self.connection = http.client.HTTPConnection(*self.server.server_address, timeout=5)

    def tearDown(self):
        self.connection.close()
        self.server.shutdown()
        self.thread.join(timeout=5)
        self.server.server_close()

    def test_real_retention_asset_and_workbench_module_order(self):
        self.connection.request('GET', '/draft-retention.js')
        reply = self.connection.getresponse()
        content = reply.read().decode('utf-8')
        self.assertEqual(reply.status, 200)
        self.assertIn('text/javascript', reply.getheader('Content-Type'))
        self.assertIn('function createGuard', content)
        self.connection.request('GET', '/')
        reply = self.connection.getresponse()
        html = reply.read().decode('utf-8')
        self.assertEqual(reply.status, 200)
        self.assertLess(html.index('/draft-library.js'), html.index('/draft-retention.js'))
        self.assertLess(html.index('/draft-retention.js'), html.index('/app.js'))

    def test_native_export_keeps_exact_content_and_errors_remain_recoverable(self):
        text = '原創內容\n"完整字面" 🎵\n'
        raw = urllib.parse.urlencode({'name': 'draft.json', 'content': text}).encode('utf-8')
        self.connection.request('POST', '/api/export', raw, {'Content-Type': 'application/x-www-form-urlencoded'})
        reply = self.connection.getresponse()
        self.assertEqual(reply.read(), text.encode('utf-8'))
        self.assertEqual(reply.status, 200)
        self.assertIn('attachment', reply.getheader('Content-Disposition'))
        raw = urllib.parse.urlencode({'name': '../invalid.json', 'content': text}).encode('utf-8')
        self.connection.request('POST', '/api/export', raw, {'Content-Type': 'application/x-www-form-urlencoded'})
        reply = self.connection.getresponse()
        reply.read()
        self.assertEqual(reply.status, 400)
        self.connection.request('GET', '/api/capabilities')
        reply = self.connection.getresponse()
        self.assertEqual(reply.status, 200)
        self.assertEqual(json.loads(reply.read())['version'], __version__)


if __name__ == '__main__':
    unittest.main()
