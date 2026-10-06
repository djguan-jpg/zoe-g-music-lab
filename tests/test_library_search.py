# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
import copy, hashlib, http.client, json, subprocess, sys, tempfile, threading, unittest
from pathlib import Path
from unittest.mock import Mock
from musiclab.application import build, capabilities
from musiclab.draft_library import DraftLibrary
from musiclab.library_search import checked_request, cli_cursor, prepare, descriptor, request_schema, data_schema
from musiclab.tool_contracts import output_schema
from music_lab_server import WorkbenchHandler, WorkbenchServer
from test_draft_library import draft

ROOT = Path(__file__).resolve().parents[1]


def seed(folder, count=23):
    library = DraftLibrary(folder)
    for n in range(count):
        value = draft()
        for panel, key, title in [('music', 'music-title', '歌曲甲'), ('storyboard', 'mv-title', '分鏡乙'), ('lyrics', 'lyrics-title', '歌詞丙')]:
            value['panels'][panel]['fields'][key] = title + '🎵'
        value['panels']['music']['fields']['music-theme'] = '正文唯一不可搜尋'
        library.save(value, ' 案🎵  ' + str(n), 'draft-' + f'{n+1:032x}')
    return library


def run(command, folder, requests=None):
    data = None if requests is None else ''.join(json.dumps(v, ensure_ascii=False) + '\n' for v in requests)
    r = subprocess.run(command, cwd=folder, input=data, capture_output=True, text=True, encoding='utf-8', timeout=20)
    if r.returncode: raise AssertionError(r.stderr[-1000:])
    return r.stdout


def browser_check(cases):
    js = "const L=require('./web/library-search.js');let s='';process.stdin.on('data',v=>s+=v);process.stdin.on('end',()=>console.log(JSON.stringify(JSON.parse(s).map(c=>{try{return {ok:true,data:L.checkedResult(c.payload,c.wire,c.previous||null)}}catch(e){return {ok:false}}}))));"
    r = subprocess.run(['node', '-e', js], cwd=ROOT, input=json.dumps(cases, ensure_ascii=False), capture_output=True, text=True, encoding='utf-8', timeout=10)
    if r.returncode: raise AssertionError(r.stderr[-1000:])
    return json.loads(r.stdout)


class LibrarySearchTests(unittest.TestCase):
    def test_invalid_query_cursor_and_extra_fields_refuse_before_metadata_io(self):
        library = Mock()
        bad = [{}, {'query': ''}, {'query': True}, {'query': '🎵'*201}, {'query': '\ud800'},
               {'query': 'a', 'limit': True}, {'query': 'a', 'limit': 101}, {'query': 'a', 'path': 'x'},
               {'query': 'a', 'cursor': {}}, {'query': 'a', 'cursor': {'start_index': 0, 'search_sha256': 'a'*64}},
               {'query': 'a', 'cursor': {'start_index': True, 'search_sha256': 'a'*64}},
               {'query': 'a', 'cursor': {'start_index': 1, 'search_sha256': 'a'*64+'\n'}}]
        for payload in bad:
            with self.assertRaises(ValueError): build('draft_search', payload, draft_library=library)
        library.metadata_snapshot.assert_not_called()
        self.assertEqual(checked_request({'query': '🎵'*200})['query'], '🎵'*200)
        self.assertEqual(checked_request({'query': '  '})['query'], '  ')
        cursor = {'start_index': 2, 'search_sha256': 'a'*64}
        self.assertEqual(cli_cursor('2:'+'a'*64), cursor); self.assertIsNone(cli_cursor(None))
        for value in ['02:'+'a'*64, '1001:'+'a'*64, '../x', '1:'+'a'*64+'\n']:
            with self.assertRaises(ValueError): cli_cursor(value)
        p = {'query': 'a', 'cursor': cursor}; result = checked_request(p); result['cursor']['start_index'] = 9
        self.assertEqual(p['cursor']['start_index'], 2)

    def test_full_metadata_literal_fields_body_exclusion_immutable_isolation_and_pin(self):
        with tempfile.TemporaryDirectory() as folder:
            library = seed(Path(folder)/'source', 4); records, issues = library.metadata_snapshot()
            before = copy.deepcopy(records)
            for query, count in [('案🎵', 4), ('  ', 4), ('歌曲甲', 4), ('分鏡乙', 4), ('歌詞丙', 4), ('正文唯一不可搜尋', 0), ('歌曲甲🎵 ', 0)]:
                data = prepare({'query': query, 'limit': 2}, records, issues)
                self.assertEqual(data['match_count'], count)
                self.assertEqual(data['record_count'], 4)
            self.assertEqual(prepare({'query': 'DRAFT'}, records, issues)['match_count'], 0)
            p = {'query': '案🎵', 'limit': 2}; first = prepare(p, records, issues)
            encoded = json.dumps(['zoe-draft-library-search', 1, p['query'], records, issues], ensure_ascii=True, sort_keys=True, separators=(',', ':')).encode('ascii')
            self.assertEqual(first['search_sha256'], hashlib.sha256(encoded).hexdigest())
            second = prepare({**p, 'cursor': first['next_cursor']}, list(reversed(records)), issues)
            self.assertIsNone(second['next_cursor']); self.assertEqual(second['start_index'], 2)
            self.assertEqual(len({v['id'] for v in first['entries']+second['entries']}), 4)
            first['entries'][0]['titles']['music'] = 'mutated'; self.assertEqual(records, before)
            for source, problem, query in [(records[:-1], issues, '案🎵'), (records, issues, '案'),
                                           (records, [{'id': 'draft-'+'f'*32, 'error': 'unreadable_revision'}], '案🎵')]:
                with self.assertRaisesRegex(ValueError, '變更'): prepare({'query': query, 'cursor': second['next_cursor'] or {'start_index': 2, 'search_sha256': second['search_sha256']}}, source, problem)

    def test_complete_index_validation_corrupt_metadata_issues_and_missing_library_no_creation(self):
        with tempfile.TemporaryDirectory() as folder:
            library = seed(Path(folder)/'source', 2); records, _ = library.metadata_snapshot()
            (library.root/records[1]['id']/'record.json').write_bytes(b'{invalid}')
            data = build('draft_search', {'query': '案'}, draft_library=library).data
            self.assertEqual(data['record_count'], 1); self.assertEqual(data['issues'], [{'id': records[1]['id'], 'error': 'unreadable_revision'}])
            bad_record = copy.deepcopy(records[0]); bad_record['titles']['lyrics'] = '\udfff'
            for entries, issues in [([records[0], records[0]], []), ([bad_record], []), ([records[0]], [{'id': records[0]['id'], 'error': 'unreadable_revision'}]), (records*501, [])]:
                with self.assertRaises(ValueError): prepare({'query': '案'}, entries, issues)
            missing = DraftLibrary(Path(folder)/'missing')
            result = build('draft_search', {'query': '案'}, draft_library=missing).wire()
            self.assertEqual(result['data']['match_count'], 0); self.assertFalse(missing.root.exists())

    def test_discovery_new_independent_schema_and_read_only_explicit_library(self):
        with tempfile.TemporaryDirectory() as folder:
            self.assertNotIn('draft_search', capabilities()['operations'])
            library = DraftLibrary(Path(folder)/'missing'); enabled = capabilities(library)
            self.assertEqual(len(enabled['operations']),29); self.assertEqual(enabled['draft_search'], descriptor())
            self.assertEqual(output_schema('draft_search')['properties']['data'], data_schema())
            self.assertFalse(output_schema('draft_search')['properties']['meta']['properties']['needs_review']['const'])
            shape = request_schema(); shape['properties']['limit']['maximum'] = 0
            self.assertEqual(request_schema()['properties']['limit']['maximum'], 100)
            self.assertEqual(enabled['protocol_version'], 1); self.assertFalse(library.root.exists())
            with self.assertRaises(ValueError): build('draft_search', {'query': '案'})

    def test_actual_four_adapters_share_full_source_search_cursor_and_browser_validator(self):
        class Quiet(WorkbenchHandler):
            def log_message(self, *args): pass
        with tempfile.TemporaryDirectory() as folder:
            library = seed(Path(folder)/'source'); path = str(library.root)
            original = {p.relative_to(library.root).as_posix(): p.read_bytes() for p in library.root.rglob('*') if p.is_file()}
            p = {'query': '案🎵', 'limit': 20, 'cursor': None}; first = build('draft_search', p, draft_library=library).wire()
            next_payload = {**p, 'cursor': first['data']['next_cursor']}; cursor = next_payload['cursor']
            prefix = [sys.executable, '-X', 'utf8']
            cli = json.loads(run([*prefix, str(ROOT/'music_lab.py'), 'draft', 'search', '--library', path, '--query', p['query'], '--cursor', str(cursor['start_index'])+':'+cursor['search_sha256']], folder))
            payloads = [p, {'query': '案', 'path': 'x'}, next_payload]
            agent = [json.loads(v) for v in run([*prefix, str(ROOT/'music_lab_agent.py'), '--draft-library', path], folder, [{'protocol_version': 1, 'id': str(i), 'operation': 'draft_search', 'payload': value} for i, value in enumerate(payloads)]).splitlines()]
            self.assertEqual([v['ok'] for v in agent], [True, False, True]); self.assertEqual(agent[0]['result'], first); self.assertEqual(agent[2]['result'], cli)
            requests = [{'jsonrpc': '2.0', 'id': 1, 'method': 'initialize', 'params': {'protocolVersion': '2025-11-25', 'capabilities': {}, 'clientInfo': {'name': 'library-search-qa', 'version': '1'}}}, {'jsonrpc': '2.0', 'method': 'notifications/initialized'}, {'jsonrpc': '2.0', 'id': 2, 'method': 'tools/list'}, *[{'jsonrpc': '2.0', 'id': i+3, 'method': 'tools/call', 'params': {'name': 'draft_search', 'arguments': {'payload': value}}} for i, value in enumerate(payloads)]]
            mcp = [json.loads(v) for v in run([*prefix, str(ROOT/'music_lab_mcp.py'), '--draft-library', path], folder, requests).splitlines()]
            tools = {v['name']: v for v in mcp[1]['result']['tools']}; self.assertEqual(len(tools),29)
            self.assertTrue(tools['draft_search']['annotations']['readOnlyHint']); self.assertFalse(tools['draft_search']['annotations']['destructiveHint']); self.assertFalse(tools['draft_search']['annotations']['openWorldHint'])
            self.assertEqual(mcp[2]['result']['structuredContent'], first); self.assertTrue(mcp[3]['result']['isError']); self.assertEqual(mcp[4]['result']['structuredContent'], cli)
            cases = [{'payload': p, 'wire': first}, {'payload': next_payload, 'wire': cli, 'previous': first['data']}]
            server = WorkbenchServer(('127.0.0.1', 0), Quiet); server.draft_library = library
            thread = threading.Thread(target=server.serve_forever); thread.start()
            def request_http(route, payload=None, headers=None):
                c = http.client.HTTPConnection('127.0.0.1', server.server_port, timeout=5)
                try:
                    c.request('GET' if payload is None else 'POST', route, None if payload is None else json.dumps(payload).encode(), headers or {})
                    r = c.getresponse(); return r.status, r.read()
                finally: c.close()
            try:
                status, raw = request_http('/api/drafts/search', p); self.assertEqual(status, 200); self.assertEqual(json.loads(raw), first)
                self.assertEqual(request_http('/api/drafts/search', p, {'Origin': 'https://outside.invalid'})[0], 403)
                self.assertEqual(request_http('/api/drafts/search', {'query': '案', 'path': '../x'})[0], 400)
                self.assertEqual(request_http('/library-search.js')[1], (ROOT/'web/library-search.js').read_bytes())
                page = request_http('/')[1].decode(); self.assertLess(page.index('/library-search.js'), page.index('/app.js')); self.assertIn('id="library-search-form"', page)
                self.assertFalse(hasattr(server, 'backup_downloads')); self.assertFalse(hasattr(server, 'delivery_downloads'))
                self.assertEqual(original, {p.relative_to(library.root).as_posix(): p.read_bytes() for p in library.root.rglob('*') if p.is_file()})
                library.save(draft(), '新案🎵', 'draft-'+'f'*32)
                self.assertEqual(request_http('/api/drafts/search', next_payload)[0], 400)
                status, raw = request_http('/api/drafts/search', p); self.assertEqual(status, 200); fresh = json.loads(raw); self.assertEqual(fresh['data']['match_count'], 24)
                server.draft_library = None; self.assertEqual(request_http('/api/drafts/search', p)[0], 400)
            finally: server.shutdown(); thread.join(5); server.server_close()
            for mutate in [lambda v: v['meta'].update(version='99.0.0'), lambda v: v['data'].update(query='wrong'), lambda v: v['data'].update(schema_version=2), lambda v: v['data']['entries'][0]['titles'].update(music='wrong')]:
                wrong = copy.deepcopy(first); mutate(wrong)
                # The last case still matches the unchanged label; pin it as a continuation with changed source SHA instead.
                if wrong['data']['entries'][0]['titles']['music'] == 'wrong': wrong['data']['entries'][0]['label'] = 'wrong'; wrong['data']['entries'][0]['titles'] = dict.fromkeys(['music','storyboard','lyrics'], 'wrong')
                cases.append({'payload': p, 'wire': wrong})
            cases.append({'payload': next_payload, 'wire': fresh, 'previous': first['data']})
            self.assertEqual([v['ok'] for v in browser_check(cases)], [True, True, False, False, False, False, False])
            self.assertFalse(thread.is_alive())


if __name__ == '__main__': unittest.main()
