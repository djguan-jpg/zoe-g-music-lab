# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
import copy
import hashlib
import http.client
import json
import subprocess
import sys
import tempfile
import threading
import unittest
from http.server import ThreadingHTTPServer
from pathlib import Path

from musiclab.application import build
from musiclab.draft_library import DraftLibrary, revision_id
from music_lab_server import WorkbenchHandler
from test_draft_library import draft

ROOT = Path(__file__).resolve().parents[1]


def check(payload, ack, readback):
    script = "const R=require('./web/library-receipt.js'),E=require('./web/editor-state.js');let s='';process.stdin.on('data',v=>s+=v);process.stdin.on('end',()=>{const [p,a,r]=JSON.parse(s);console.log(JSON.stringify(R.checkedReadback(p,a,r,E.validateDraft)));});"
    result = subprocess.run(['node', '-e', script], cwd=ROOT, input=json.dumps([payload, ack, readback], ensure_ascii=False),
                            capture_output=True, text=True, encoding='utf-8', timeout=15)
    if result.returncode:
        raise AssertionError(result.stderr[-1500:])
    return json.loads(result.stdout)


class LibraryReceiptTests(unittest.TestCase):
    def source(self):
        source = draft()
        source['panels']['music']['fields']['music-title'] = '🎵' * 119 + '甲' + '尾\r\n'
        source['panels']['storyboard']['fields']['mv-title'] = ' 影片\r\n🎵 '
        return {'id': revision_id(), 'label': '原文保存 🎵', 'draft': source}

    def test_actual_saved_bytes_hash_unicode_and_same_id_retry_match_browser_receipt(self):
        with tempfile.TemporaryDirectory() as folder:
            library = DraftLibrary(folder); p = self.source(); original = copy.deepcopy(p)
            a = build('draft_save', p, draft_library=library).data
            r = build('draft_read', {'id': p['id']}, draft_library=library).data
            self.assertEqual(check(p, a, r), a)
            raw = (library.root / p['id'] / 'draft.json').read_bytes()
            self.assertEqual(a['entry']['sha256'], hashlib.sha256(raw).hexdigest())
            self.assertEqual(a['entry']['bytes'], len(raw)); self.assertEqual(json.loads(raw), p['draft'])
            self.assertEqual(a['entry']['titles']['music'], '🎵' * 119 + '甲')
            retry = build('draft_save', p, draft_library=library).data
            self.assertTrue(check(p, retry, r)['reused']); self.assertEqual(retry['entry'], a['entry'])
            self.assertEqual((library.root / p['id'] / 'draft.json').read_bytes(), raw)
            self.assertEqual([v.name for v in library.root.iterdir() if v.is_dir()], [p['id']]); self.assertEqual(p, original)

    def test_fixed_native_asset_and_real_http_save_read_flow_use_same_complete_contract(self):
        class Quiet(WorkbenchHandler):
            def log_message(self, *args):
                pass
        with tempfile.TemporaryDirectory() as folder:
            server = ThreadingHTTPServer(('127.0.0.1', 0), Quiet); server.draft_library = DraftLibrary(folder)
            thread = threading.Thread(target=server.serve_forever, daemon=True); thread.start()
            def request(path, payload=None):
                connection = http.client.HTTPConnection('127.0.0.1', server.server_port, timeout=5)
                try:
                    connection.request('GET' if payload is None else 'POST', path, None if payload is None else json.dumps(payload).encode())
                    response = connection.getresponse(); self.assertEqual(response.status, 200); return response.read()
                finally:
                    connection.close()
            try:
                self.assertEqual(request('/library-receipt.js'), (ROOT / 'web/library-receipt.js').read_bytes())
                index = request('/').decode()
                self.assertLess(index.index('/readiness-report.js'), index.index('/library-receipt.js'))
                self.assertLess(index.index('/library-receipt.js'), index.index('/app.js'))
                p = self.source(); a = json.loads(request('/api/drafts/save', p)); r = json.loads(request('/api/drafts/read', {'id': p['id']}))
                self.assertEqual(check(p, a['data'], r['data']), a['data']); self.assertTrue(a['meta']['needs_review'])
            finally:
                server.shutdown(); server.server_close(); thread.join(5)
                self.assertFalse(thread.is_alive())

    def test_real_agent_and_mcp_save_read_data_agree_without_new_operations_or_path_permissions(self):
        with tempfile.TemporaryDirectory() as folder:
            p = self.source(); library = str(Path(folder) / 'selected')
            requests = [{'protocol_version': 1, 'id': str(i), 'operation': op, 'payload': value}
                        for i, (op, value) in enumerate([('draft_save', p), ('draft_read', {'id': p['id']})])]
            result = subprocess.run([sys.executable, '-X', 'utf8', str(ROOT / 'music_lab_agent.py'), '--draft-library', library],
                                    cwd=folder, input=''.join(json.dumps(r, ensure_ascii=False) + '\n' for r in requests), capture_output=True, text=True, encoding='utf-8', timeout=20)
            self.assertEqual(result.returncode, 0, result.stderr[-1000:]); replies = [json.loads(v) for v in result.stdout.splitlines()]
            self.assertTrue(all(v['ok'] for v in replies)); a, r = [v['result']['data'] for v in replies]
            self.assertEqual(check(p, a, r), a)
            calls = [{'jsonrpc': '2.0', 'id': 1, 'method': 'initialize', 'params': {'protocolVersion': '2025-11-25', 'capabilities': {}, 'clientInfo': {'name': 'synthetic-receipt', 'version': '1'}}}, {'jsonrpc': '2.0', 'method': 'notifications/initialized'}]
            calls += [{'jsonrpc': '2.0', 'id': i + 2, 'method': 'tools/call', 'params': {'name': op, 'arguments': {'payload': value}}}
                      for i, (op, value) in enumerate([('draft_save', p), ('draft_read', {'id': p['id']})])]
            result = subprocess.run([sys.executable, '-X', 'utf8', str(ROOT / 'music_lab_mcp.py'), '--draft-library', library],
                                    cwd=folder, input=''.join(json.dumps(v, ensure_ascii=False) + '\n' for v in calls), capture_output=True, text=True, encoding='utf-8', timeout=20)
            self.assertEqual(result.returncode, 0, result.stderr[-1000:]); replies = [json.loads(v) for v in result.stdout.splitlines()]
            ma, mr = [v['result']['structuredContent']['data'] for v in replies[1:]]
            self.assertTrue(check(p, ma, mr)['reused']); self.assertEqual(ma['entry'], a['entry']); self.assertEqual(mr, r)


if __name__ == '__main__':
    unittest.main()
