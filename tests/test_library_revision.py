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


def checked(cases):
    script = "const D=require('./web/library-revision.js'),E=require('./web/editor-state.js');let s='';process.stdin.on('data',v=>s+=v);process.stdin.on('end',()=>console.log(JSON.stringify(JSON.parse(s).map(([id,r,e])=>{try{return {ok:true,data:D.checkedRead(id,r,E.validateDraft,e)};}catch(error){return {ok:false};}}))));"
    result = subprocess.run(['node', '-e', script], cwd=ROOT, input=json.dumps(cases, ensure_ascii=False), capture_output=True, text=True, encoding='utf-8', timeout=15)
    if result.returncode:
        raise AssertionError(result.stderr[-1500:])
    return json.loads(result.stdout)


def run(args, *, cwd, requests=None):
    result = subprocess.run(args, cwd=cwd, input=None if requests is None else ''.join(json.dumps(v, ensure_ascii=False) + '\n' for v in requests), capture_output=True, text=True, encoding='utf-8', timeout=20)
    if result.returncode:
        raise AssertionError(result.stderr[-1500:])
    return result.stdout


class LibraryRevisionTests(unittest.TestCase):
    def seeded(self, folder):
        library = DraftLibrary(folder); a, b = draft(), draft()
        a['panels']['music']['fields']['music-title'] = '🎵' * 119 + '甲' + '尾\r\n'
        b['panels']['music']['fields']['music-title'] = '另一版本\r\n'
        first = library.save(a, '原案 🎵', revision_id())['entry']; second = library.save(b, '另一案', revision_id())['entry']
        return library, first, second

    def test_real_list_and_read_revisions_match_exact_selection_and_saved_bytes(self):
        with tempfile.TemporaryDirectory() as folder:
            library, a, b = self.seeded(folder); selected = next(e for e in library.list()['entries'] if e['id'] == a['id'])
            ra, rb = library.read(a['id']), library.read(b['id']); before = copy.deepcopy([selected, ra, rb])
            altered = dict(selected, label='another source')
            result = checked([[a['id'], ra, selected], [a['id'], rb, selected], [a['id'], ra, altered]])
            self.assertEqual([v['ok'] for v in result], [True, False, False]); self.assertEqual(result[0]['data'], {'entry': a, 'draft': ra['draft']})
            self.assertEqual(a['titles']['music'], '🎵' * 119 + '甲'); self.assertEqual([selected, ra, rb], before)
            raw = (library.root / a['id'] / 'draft.json').read_bytes()
            self.assertEqual(len(raw), a['bytes']); self.assertEqual(hashlib.sha256(raw).hexdigest(), a['sha256'])

    def test_fixed_shared_native_asset_and_http_list_read_pin_complete_revision(self):
        class Quiet(WorkbenchHandler):
            def log_message(self, *args):
                pass
        with tempfile.TemporaryDirectory() as folder:
            library, a, b = self.seeded(folder)
            server = ThreadingHTTPServer(('127.0.0.1', 0), Quiet); server.draft_library = library
            thread = threading.Thread(target=server.serve_forever, daemon=True); thread.start()
            def request(path, payload=None):
                c = http.client.HTTPConnection('127.0.0.1', server.server_port, timeout=5)
                try:
                    c.request('GET' if payload is None else 'POST', path, None if payload is None else json.dumps(payload).encode())
                    response = c.getresponse(); self.assertEqual(response.status, 200); return response.read()
                finally:
                    c.close()
            try:
                self.assertEqual(request('/library-revision.js'), (ROOT / 'web/library-revision.js').read_bytes())
                index = request('/').decode(); self.assertLess(index.index('/readiness-report.js'), index.index('/library-revision.js'))
                self.assertLess(index.index('/library-revision.js'), index.index('/library-receipt.js'))
                self.assertLess(index.index('/library-receipt.js'), index.index('/app.js'))
                listing = json.loads(request('/api/drafts/list', {}))['data']; selected = next(e for e in listing['entries'] if e['id'] == a['id'])
                ra = json.loads(request('/api/drafts/read', {'id': a['id']}))['data']; rb = json.loads(request('/api/drafts/read', {'id': b['id']}))['data']
                self.assertEqual([v['ok'] for v in checked([[a['id'], ra, selected], [a['id'], rb, selected]])], [True, False])
            finally:
                server.shutdown(); server.server_close(); thread.join(5); self.assertFalse(thread.is_alive())

    def test_cli_agent_mcp_readonly_data_all_use_the_selected_immutable_revision_contract(self):
        with tempfile.TemporaryDirectory() as folder:
            library, a, b = self.seeded(Path(folder) / 'selected'); path = str(library.root)
            cli = json.loads(run([sys.executable, '-X', 'utf8', str(ROOT / 'music_lab.py'), 'draft', 'read', '--library', path, '--id', a['id']], cwd=folder))['data']
            requests = [{'protocol_version': 1, 'id': str(i), 'operation': 'draft_read', 'payload': {'id': entry['id']}} for i, entry in enumerate([a, b])]
            agent = [json.loads(v) for v in run([sys.executable, '-X', 'utf8', str(ROOT / 'music_lab_agent.py'), '--draft-library', path], cwd=folder, requests=requests).splitlines()]
            self.assertTrue(all(v['ok'] for v in agent)); ar, br = [v['result']['data'] for v in agent]
            requests = [{'jsonrpc': '2.0', 'id': 1, 'method': 'initialize', 'params': {'protocolVersion': '2025-11-25', 'capabilities': {}, 'clientInfo': {'name': 'synthetic-revision', 'version': '1'}}}, {'jsonrpc': '2.0', 'method': 'notifications/initialized'}, {'jsonrpc': '2.0', 'id': 2, 'method': 'tools/list'}]
            requests += [{'jsonrpc': '2.0', 'id': i + 3, 'method': 'tools/call', 'params': {'name': 'draft_read', 'arguments': {'payload': {'id': entry['id']}}}} for i, entry in enumerate([a, b])]
            mcp = [json.loads(v) for v in run([sys.executable, '-X', 'utf8', str(ROOT / 'music_lab_mcp.py'), '--draft-library', path], cwd=folder, requests=requests).splitlines()]
            tools = {v['name']: v for v in mcp[1]['result']['tools']}; self.assertEqual(len(tools), 19); self.assertTrue(tools['draft_read']['annotations']['readOnlyHint'])
            mr, nr = [v['result']['structuredContent']['data'] for v in mcp[2:]]
            results = checked([[a['id'], value, a] for value in [cli, ar, br, mr, nr]])
            self.assertEqual([v['ok'] for v in results], [True, True, False, True, False]); self.assertEqual(cli, ar); self.assertEqual(ar, mr); self.assertEqual(br, nr)


if __name__ == '__main__':
    unittest.main()
