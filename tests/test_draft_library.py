# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
import copy
import hashlib
import http.client
import json
import os
import subprocess
import sys
import tempfile
import threading
import unittest
from concurrent.futures import ThreadPoolExecutor
from http.server import ThreadingHTTPServer
from pathlib import Path
from unittest.mock import patch

from musiclab.application import build, capabilities
from musiclab.draft_contract import CONTRACT, MAX_DRAFT_BYTES, draft_bytes, validate_draft
from musiclab.draft_library import DraftLibrary, revision_id
from music_lab_server import WorkbenchHandler

ROOT = Path(__file__).resolve().parents[1]


def draft():
    panels = {name: {'fields': {key: '' for key in fields}} for name, fields in CONTRACT['fields'].items()}
    for name, rule in CONTRACT['rows'].items():
        panels[name][rule['key']] = []
    panels['music'].update(avoid=['多行\n原文', ''], deliverables=[])
    panels['music']['sections'] = [{key: '' for key in CONTRACT['rows']['music']['columns']}]
    panels['music']['sections'][0]['name'] = '尚未完成的小節'
    panels['storyboard']['motifs'] = [{'id': 'motif-1', 'name': '合成紙箱', 'meaning': ''}]
    shot = {key: '' for key in CONTRACT['rows']['storyboard']['columns']}
    shot.update(motif_id='motif-1', screen_direction='neutral', visual='兩行\n畫面')
    panels['storyboard']['shots'] = [shot]
    panels['lyrics']['fields']['lyrics-format'] = '.lrc'
    panels['lyrics']['cues'] = [{'start': '', 'end': '03', 'text': '人工未校時'}]
    panels['audio']['fields']['audio-profile'] = 'distribution'
    return {'format': CONTRACT['format'], 'schema_version': 3, 'tool_version': '0.8.0',
            'saved_at': '2026-10-03T00:00:00Z', 'tab': 'music', 'panels': panels}


def command(args, cwd=ROOT, input=None):
    result = subprocess.run(args, cwd=cwd, input=input, capture_output=True, encoding='utf-8', timeout=20)
    if result.returncode:
        raise AssertionError(result.stderr[-2000:])
    return result


class DraftContractTests(unittest.TestCase):
    def test_raw_incomplete_unicode_and_source_preservation(self):
        source = draft(); original = copy.deepcopy(source)
        validated = validate_draft(source); validated['panels']['lyrics']['cues'][0]['text'] = '另改'
        self.assertEqual(source, original)
        saved = json.loads(draft_bytes(source).decode())
        self.assertEqual(saved, source)
        self.assertEqual(saved['panels']['lyrics']['cues'][0]['end'], '03')
        self.assertEqual(saved['panels']['music']['sections'][0]['bars'], '')

    def test_browser_and_python_acceptance_agree_on_same_contract(self):
        cases = [draft(), None, [], True]
        for value in (1, 2, 4, True, '3'):
            item = draft(); item['schema_version'] = value; cases.append(item)
        for value in ([], None, 'unknown'):
            item = draft(); item['tab'] = value; cases.append(item)
        for change in ('unknown_field', 'missing_panel', 'wrong_row_type', 'duplicate_motif', 'orphan', 'bad_option', 'too_many'):
            item = draft()
            if change == 'unknown_field': item['path'] = 'not_a_permission'
            if change == 'missing_panel': del item['panels']['lyrics']
            if change == 'wrong_row_type': item['panels']['lyrics']['cues'][0]['start'] = 0
            if change == 'duplicate_motif': item['panels']['storyboard']['motifs'] *= 2
            if change == 'orphan': item['panels']['storyboard']['shots'][0]['motif_id'] = 'motif-2'
            if change == 'bad_option': item['panels']['audio']['fields']['audio-profile'] = 'anything'
            if change == 'too_many': item['panels']['music']['avoid'] = [''] * 101
            cases.append(item)
        expected = []
        for case in cases:
            try: validate_draft(case); expected.append(True)
            except ValueError: expected.append(False)
        script = "const e=require('./web/editor-state.js');let raw='';process.stdin.on('data',s=>raw+=s);process.stdin.on('end',()=>console.log(JSON.stringify(JSON.parse(raw).map(d=>{try{e.validateDraft(d);return true;}catch(_){return false;}}))));"
        result = command(['node', '-e', script], input=json.dumps(cases))
        self.assertEqual(json.loads(result.stdout), expected)


class DraftLibraryTests(unittest.TestCase):
    def test_cli_json_output_uses_utf8_even_when_terminal_encoding_cannot_encode_title(self):
        with tempfile.TemporaryDirectory() as folder:
            source = draft(); source['panels']['music']['fields']['music-title'] = '原創 🎵'
            path = Path(folder) / 'source.json'; path.write_text(json.dumps(source, ensure_ascii=False), encoding='utf-8')
            result = subprocess.run([sys.executable, str(ROOT/'music_lab.py'), 'draft', 'save',
                '--library', str(Path(folder)/'selected'), '--input', str(path), '--label', '原創 🎵'],
                cwd=folder, env=dict(os.environ, PYTHONIOENCODING='ascii'), capture_output=True, timeout=20)
            self.assertEqual(result.returncode, 0, result.stderr.decode('ascii', errors='replace')[-300:])
            saved = json.loads(result.stdout.decode('utf-8'))
            self.assertEqual(saved['data']['entry']['titles']['music'], '原創 🎵')
            self.assertEqual(saved['data']['entry']['label'], '原創 🎵')

    def test_unknown_library_version_is_rejected_without_migrating_files(self):
        with tempfile.TemporaryDirectory() as folder:
            library = DraftLibrary(folder); identifier = revision_id()
            library.save(draft(), '原始版', identifier)
            record_path = library.root / identifier / 'record.json'
            original = json.loads(record_path.read_bytes())
            for version in (0, 2, True, '1'):
                modified = dict(original, library_schema_version=version)
                record_path.write_text(json.dumps(modified), encoding='utf-8')
                snapshot = {file.name: file.read_bytes() for file in record_path.parent.iterdir()}
                with self.assertRaisesRegex(ValueError, '格式錯誤'): library.read(identifier)
                result = library.list()
                self.assertEqual(result['entries'], [])
                self.assertEqual(result['issues'], [{'id': identifier, 'error': 'unreadable_revision'}])
                self.assertEqual({file.name: file.read_bytes() for file in record_path.parent.iterdir()}, snapshot)

    def test_save_read_idempotent_retry_and_conflict_preserve_original(self):
        with tempfile.TemporaryDirectory() as folder:
            library = DraftLibrary(Path(folder)/'selected'); source = draft(); identifier = revision_id()
            first = library.save(source, '第一版', identifier)
            snapshots = {file.name: file.read_bytes() for file in (library.root/identifier).iterdir()}
            self.assertFalse(first['reused']); self.assertEqual(library.read(identifier)['draft'], source)
            second = library.save(copy.deepcopy(source), '第一版', identifier)
            self.assertTrue(second['reused']); self.assertEqual(first['entry'], second['entry'])
            source['panels']['music']['fields']['music-title'] = '不同內容'
            for label, value in [('第一版', source), ('不同名稱', draft())]:
                with self.assertRaisesRegex(ValueError, '不同內容'): library.save(value, label, identifier)
            self.assertEqual({file.name: file.read_bytes() for file in (library.root/identifier).iterdir()}, snapshots)
            self.assertEqual(library.list()['entries'], [first['entry']])

    def test_invalid_and_oversized_inputs_write_nothing_and_paths_are_not_accepted(self):
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder)/'uncreated'; library = DraftLibrary(root)
            cases = [(dict(draft(), schema_version=2), '有效', revision_id()),
                     (draft(), ' ', revision_id()), (draft(), '有效', '../outside')]
            oversized = draft(); oversized['panels']['music']['fields']['music-title'] = '字' * MAX_DRAFT_BYTES
            cases.append((oversized, '有效', revision_id()))
            for source, label, identifier in cases:
                with self.assertRaises(ValueError): library.save(source, label, identifier)
                self.assertFalse(root.exists())
            with self.assertRaises(ValueError): build('draft_save', {'draft': draft(), 'label': '有效', 'id': revision_id(), 'path': 'outside'}, draft_library=library)
            self.assertFalse(root.exists()); self.assertEqual(library.list()['entries'], [])

    def test_concurrent_instances_publish_one_complete_revision_and_reuse_identical_request(self):
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder)/'selected'; identifier = revision_id()
            with ThreadPoolExecutor(max_workers=4) as pool:
                results = list(pool.map(lambda _: DraftLibrary(root).save(draft(), '並行合成測試', identifier), range(4)))
            self.assertEqual(sum(not result['reused'] for result in results), 1)
            self.assertEqual(len([p for p in root.iterdir() if p.is_dir()]), 1)
            self.assertEqual(DraftLibrary(root).read(identifier)['draft'], draft())

    def test_interrupted_write_does_not_publish_partial_revision_or_remove_other_files(self):
        with tempfile.TemporaryDirectory() as folder:
            library = DraftLibrary(folder); keep = Path(folder)/'keep.txt'; keep.write_text('保留', encoding='utf-8')
            identifier = revision_id()
            with patch('musiclab.draft_library.os.fsync', side_effect=OSError('synthetic failure')):
                with self.assertRaises(OSError): library.save(draft(), '合成失敗', identifier)
            self.assertFalse((Path(folder)/identifier).exists())
            self.assertEqual(sorted(p.name for p in Path(folder).iterdir()), ['.write-lock', 'keep.txt'])

    def test_parallel_processes_respect_capacity_and_release_operating_system_lock(self):
        with tempfile.TemporaryDirectory() as folder:
            library = Path(folder)/'selected'; source = Path(folder)/'input.json'
            source.write_text(json.dumps(draft()), encoding='utf-8')
            script = "import json,sys;from pathlib import Path;import musiclab.draft_library as d;d.MAX_ENTRIES=1\ntry:\n d.DraftLibrary(sys.argv[1]).save(json.loads(Path(sys.argv[3]).read_text()),'process test',sys.argv[2]);print('saved')\nexcept ValueError:print('capacity refused')"
            with ThreadPoolExecutor(max_workers=4) as pool:
                jobs = [pool.submit(command, [sys.executable, '-X', 'utf8', '-c', script, str(library), revision_id(), str(source)]) for _ in range(4)]
                replies = [job.result().stdout.strip() for job in jobs]
            self.assertEqual(replies.count('saved'), 1)
            self.assertEqual(replies.count('capacity refused'), 3)
            self.assertEqual(len(DraftLibrary(library).list()['entries']), 1)
            # A subsequent process/thread can acquire the released lock normally.
            DraftLibrary(library).save(draft(), 'after lock release', revision_id())
            self.assertEqual(len(DraftLibrary(library).list()['entries']), 2)

    def test_hash_tampering_metadata_corruption_and_links_are_rejected_without_replacement(self):
        with tempfile.TemporaryDirectory() as folder:
            library = DraftLibrary(folder); identifier = revision_id(); library.save(draft(), '合成', identifier)
            file = Path(folder)/identifier/'draft.json'; original = file.read_bytes(); file.write_bytes(original+b'\n')
            with self.assertRaisesRegex(ValueError, '摘要'): library.read(identifier)
            self.assertEqual(file.read_bytes(), original+b'\n')
            record = Path(folder)/identifier/'record.json'; record.write_text('{}', encoding='utf-8')
            self.assertEqual(library.list()['issues'], [{'id': identifier, 'error': 'unreadable_revision'}])
            with patch.object(Path, 'is_symlink', return_value=True), patch.object(Path, 'open', side_effect=AssertionError('must not open linked data')):
                with self.assertRaisesRegex(ValueError, '連結'): library.read(identifier)

    def test_pagination_invalid_limits_and_capacity_preserve_versions(self):
        with tempfile.TemporaryDirectory() as folder:
            library = DraftLibrary(folder); identifiers = []
            for i in range(5):
                identifier = revision_id(); identifiers.append(identifier); library.save(draft(), f'合成 {i}', identifier)
            page = library.list(2); all_ids = [entry['id'] for entry in page['entries']]
            while page['next_cursor']:
                page = library.list(2, page['next_cursor']); all_ids += [entry['id'] for entry in page['entries']]
            self.assertEqual(all_ids, identifiers[::-1]); self.assertEqual(len(set(all_ids)), 5)
            for limit in (0, 101, True, 1.5):
                with self.assertRaises(ValueError): library.list(limit)
            with patch('musiclab.draft_library.MAX_ENTRIES', 5):
                with self.assertRaisesRegex(ValueError, '1000'): library.save(draft(), '滿額', revision_id())
            self.assertEqual(len([p for p in Path(folder).iterdir() if p.is_dir()]), 5)


class DraftAdapterTests(unittest.TestCase):
    def test_default_transports_do_not_offer_or_execute_draft_writes(self):
        self.assertFalse(capabilities()['draft_library_enabled']); self.assertEqual(len(capabilities()['operations']),14)
        with self.assertRaisesRegex(ValueError, '未啟用'): build('draft_save', {'draft': draft(), 'id': revision_id(), 'label': '合成'})
        request = {'protocol_version': 1, 'id': 'disabled', 'operation': 'draft_save', 'payload': {'draft': draft(), 'id': revision_id(), 'label': '合成'}}
        result = command([sys.executable, '-X', 'utf8', 'music_lab_agent.py'], input=json.dumps(request)+'\n')
        self.assertFalse(json.loads(result.stdout)['ok'])

    def test_real_jsonlines_save_list_read_and_cli_share_immutable_library(self):
        with tempfile.TemporaryDirectory() as folder:
            library = Path(folder)/'selected'; identifier = revision_id(); source = Path(folder)/'input.json'
            source.write_text(json.dumps(draft(), ensure_ascii=False), encoding='utf-8'); original = source.read_bytes()
            request = lambda op, payload: {'protocol_version': 1, 'id': op, 'operation': op, 'payload': payload}
            requests = [request('draft_save', {'id': identifier, 'label': '跨介面合成', 'draft': draft()}),
                        request('draft_list', {}), request('draft_read', {'id': identifier})]
            result = command([sys.executable, '-X', 'utf8', str(ROOT/'music_lab_agent.py'), '--draft-library', str(library)], cwd=folder,
                             input=''.join(json.dumps(r, ensure_ascii=False)+'\n' for r in requests))
            replies = [json.loads(line) for line in result.stdout.splitlines()]
            self.assertTrue(all(r['ok'] for r in replies)); self.assertEqual(replies[2]['result']['data']['draft'], draft())
            cli = command([sys.executable, '-X', 'utf8', str(ROOT/'music_lab.py'), 'draft', 'save', '--library', str(library),
                           '--input', str(source), '--label', '跨介面合成', '--id', identifier], cwd=folder)
            self.assertTrue(json.loads(cli.stdout)['data']['reused']); self.assertEqual(source.read_bytes(), original)
            self.assertEqual(len([p for p in library.iterdir() if p.is_dir()]), 1)

    def test_generated_mcp_launch_discovery_and_real_draft_calls(self):
        with tempfile.TemporaryDirectory() as folder:
            library = Path(folder)/'selected'; identifier = revision_id()
            descriptor = command([sys.executable, '-X', 'utf8', str(ROOT/'scripts/agent_launch.py'), '--draft-library', str(library)], cwd=folder)
            config = json.loads(descriptor.stdout)
            requests = [{'jsonrpc': '2.0', 'id': 1, 'method': 'initialize', 'params': {'protocolVersion': '2025-11-25', 'capabilities': {}, 'clientInfo': {'name': 'draft-test', 'version': '1'}}},
                        {'jsonrpc': '2.0', 'method': 'notifications/initialized'},
                        {'jsonrpc': '2.0', 'id': 2, 'method': 'tools/list'}]
            for i, (name, payload) in enumerate([('draft_save', {'id': identifier, 'label': 'MCP 合成', 'draft': draft()}),
                                                ('draft_read', {'id': identifier}), ('draft_list', {})], 3):
                requests.append({'jsonrpc': '2.0', 'id': i, 'method': 'tools/call', 'params': {'name': name, 'arguments': {'payload': payload}}})
            result = command([config['command'], *config['args']], cwd=folder, input=''.join(json.dumps(r, ensure_ascii=False)+'\n' for r in requests))
            replies = [json.loads(line) for line in result.stdout.splitlines()]
            tools = {t['name']: t for t in replies[1]['result']['tools']}
            self.assertEqual(len(tools),20); self.assertFalse(tools['draft_save']['annotations']['readOnlyHint'])
            self.assertTrue(tools['draft_read']['annotations']['readOnlyHint'])
            self.assertEqual(replies[3]['result']['structuredContent']['data']['draft'], draft())
            self.assertFalse(replies[2]['result'].get('isError', False)); self.assertEqual(len([p for p in library.iterdir() if p.is_dir()]), 1)

    def test_http_selected_library_contract_origin_and_disabled_boundary(self):
        with tempfile.TemporaryDirectory() as folder:
            server = ThreadingHTTPServer(('127.0.0.1', 0), WorkbenchHandler); server.draft_library = DraftLibrary(folder)
            thread = threading.Thread(target=server.serve_forever, daemon=True); thread.start()
            def request(path, payload=None, headers=None, method=None):
                connection = http.client.HTTPConnection('127.0.0.1', server.server_port, timeout=5)
                try:
                    connection.request(method or ('GET' if payload is None else 'POST'), path, None if payload is None else json.dumps(payload).encode(), headers or {})
                    response = connection.getresponse(); return response.status, response.read()
                finally: connection.close()
            try:
                status, raw = request('/draft-contract.js'); self.assertEqual(status, 200); self.assertIn(b'MusicDraftContract', raw)
                identifier = revision_id(); payload = {'id': identifier, 'label': 'HTTP 合成', 'draft': draft()}
                # Empty POST verifies the early guard without an unread-body reset.
                self.assertEqual(request('/api/drafts/save', headers={'Origin': 'https://untrusted.invalid'}, method='POST')[0], 403)
                self.assertEqual(list(Path(folder).iterdir()), [])
                status, raw = request('/api/drafts/save', payload); self.assertEqual(status, 200)
                self.assertTrue(json.loads(raw)['meta']['needs_review'])
                status, raw = request('/api/drafts/read', {'id': identifier}); self.assertEqual(json.loads(raw)['data']['draft'], draft())
                self.assertEqual(request('/api/drafts/read', {'id': '../outside'})[0], 400)
                server.draft_library = None
                self.assertEqual(request('/api/drafts/save', dict(payload, id=revision_id()))[0], 400)
                self.assertEqual(len([p for p in Path(folder).iterdir() if p.is_dir()]), 1)
            finally:
                server.shutdown(); server.server_close(); thread.join(5)


if __name__ == '__main__':
    unittest.main()
