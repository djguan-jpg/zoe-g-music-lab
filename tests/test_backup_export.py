# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
import base64
import hashlib
import http.client
import io
import json
import random
import subprocess
import sys
import tempfile
import threading
import unittest
from pathlib import Path
from unittest.mock import Mock, patch
from musiclab.application import build, capabilities
from musiclab.backup_export import checked_request, prepare, descriptor, MAX_INLINE_BYTES
from musiclab.draft_backup import export_backup, read_backup, restore_backup
from musiclab.draft_library import DraftLibrary
from musiclab.tool_contracts import payload_schema, output_schema
from music_lab_mcp import tool_list
from music_lab_server import WorkbenchServer, WorkbenchHandler
from test_draft_backup import ROOT, IDS, populate, contents, run
from test_draft_library import draft


def check_inline(test, wire, library, expected):
    test.assertEqual(set(wire), {'files', 'data', 'meta'}); test.assertEqual(wire['files'], {})
    test.assertTrue(wire['meta']['needs_review']); test.assertEqual(wire['meta']['protocol_version'], 1)
    data = wire['data']; raw = base64.b64decode(data['archive_base64'], validate=True)
    snapshot = read_backup(io.BytesIO(raw))
    test.assertEqual(data['schema_version'], 1); test.assertEqual(data['status'], 'prepared_not_saved')
    test.assertEqual(data['format'], 'zoe-draft-backup-export'); test.assertEqual(data['archive_name'], 'zoe-music-lab-backup.zip')
    test.assertEqual(data['backup']['backup_sha256'], hashlib.sha256(raw).hexdigest())
    test.assertEqual(data['backup']['bytes'], len(raw)); test.assertEqual(data['revision_ids'], sorted(expected))
    test.assertEqual(data['backup']['entry_count'], len(expected))
    test.assertEqual([r[0] for r in snapshot['revisions']], sorted(expected))
    for identifier, record, source, _ in snapshot['revisions']:
        test.assertEqual(library.revision_bytes(identifier)[:2], (record, source))
    return raw


class BackupExportTests(unittest.TestCase):
    def test_request_isolated_strict_selection_and_invalid_request_precedes_library_read(self):
        original = {'ids': [IDS[1], IDS[0]], 'include_archive': True}
        request = checked_request(original); self.assertEqual(request['ids'], [IDS[0], IDS[1]])
        request['ids'].clear(); self.assertEqual(original['ids'], [IDS[1], IDS[0]])
        self.assertEqual(checked_request({}), {'ids': None, 'include_archive': False})
        bad = [{'ids': None}, {'ids': []}, {'ids': [IDS[0], IDS[0]]}, {'ids': ['../x']},
               {'ids': True}, {'ids': [True]}, {'include_archive': 1}, {'include_archive': 'true'},
               {'schema_version': 2}, {'path': 'x'}, {'out': 'x'}, {'overwrite': True}]
        library = Mock()
        for payload in bad:
            with self.assertRaises(ValueError): build('draft_backup_export', payload, draft_library=library)
        library.directories.assert_not_called(); library.revision_bytes.assert_not_called()
        with self.assertRaises(ValueError): checked_request({'ids': [f'draft-{i:032x}' for i in range(1001)]})

    def test_real_metadata_all_selected_empty_is_isolated_and_has_no_archive_or_source_content(self):
        with tempfile.TemporaryDirectory() as folder:
            library = populate(Path(folder)/'source'); before = contents(library.root)
            for payload, ids, selection in [({}, IDS[:2], 'all'), ({'ids': [IDS[1]]}, [IDS[1]], 'selected')]:
                wire = build('draft_backup_export', payload, draft_library=library).wire(); data = wire['data']
                self.assertNotIn('archive_base64', data); self.assertEqual(data['revision_ids'], ids)
                self.assertEqual(data['backup']['selection'], selection); self.assertEqual(data['backup']['entry_count'], len(ids))
                self.assertNotIn(str(library.root), json.dumps(wire)); self.assertNotIn('備份原創', json.dumps(wire, ensure_ascii=False))
            raw, summary = export_backup(library); p = prepare(raw, summary)
            first = p.summary(); first['backup']['bytes'] = 0; first['revision_ids'].clear()
            self.assertEqual(p.summary()['backup'], summary); self.assertEqual(p.summary()['revision_ids'], IDS[:2])
            missing = DraftLibrary(Path(folder)/'missing'); empty = build('draft_backup_export', {'include_archive': True}, draft_library=missing).wire()
            check_inline(self, empty, missing, []); self.assertFalse(missing.root.exists())
            self.assertEqual(contents(library.root), before)

    def test_complete_zip_source_selection_counts_versions_and_crc_are_checked(self):
        with tempfile.TemporaryDirectory() as folder:
            library = populate(Path(folder)/'source'); raw, summary = export_backup(library)
            for key, value in [('bytes', summary['bytes']-1), ('entry_count', 1), ('backup_schema_version', True),
                               ('backup_schema_version', 2), ('backup_sha256', 'f'*64), ('selection', 'selected')]:
                bad = {**summary, key: value}
                with self.assertRaises(ValueError): prepare(raw, bad)
            with self.assertRaises(ValueError): prepare(raw, {**summary, 'path': 'x'})
            with self.assertRaises(ValueError): prepare(raw, summary, [IDS[0]])
            selected, selected_summary = export_backup(library, [IDS[0]])
            with self.assertRaises(ValueError): prepare(selected, selected_summary, [IDS[1]])
            with self.assertRaises(ValueError): prepare(selected, selected_summary)
            changed = bytearray(raw); changed[-1] ^= 1
            with self.assertRaises(ValueError): prepare(bytes(changed), summary)
            for invalid in [b'', bytearray(raw), 'zip']:
                with self.assertRaises(ValueError): prepare(invalid, summary)

    def test_real_large_backup_metadata_remains_available_but_inline_refuses_before_encoding(self):
        with tempfile.TemporaryDirectory() as folder:
            library = populate(Path(folder)/'source', 1); value = draft()
            value['panels']['music']['fields']['music-theme'] = ''.join(random.Random(73).choices('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', k=740000))
            library.save(value, '大型合成草稿', IDS[1]); before = contents(library.root)
            raw, summary = export_backup(library); self.assertGreater(len(raw), MAX_INLINE_BYTES)
            p = prepare(raw, summary); self.assertNotIn('archive_base64', p.summary())
            with patch('musiclab.backup_export.base64.b64encode', side_effect=AssertionError('must not encode')):
                with self.assertRaisesRegex(ValueError, '512 KiB'): p.summary(True)
            small = build('draft_backup_export', {'ids': [IDS[0]], 'include_archive': True}, draft_library=library).wire()
            check_inline(self, small, library, [IDS[0]])
            self.assertEqual(contents(library.root), before); self.assertEqual(MAX_INLINE_BYTES, 512*1024)
            raw, summary = export_backup(library, [IDS[0]]); p = prepare(raw, summary, [IDS[0]])
            with patch('musiclab.backup_export.MAX_INLINE_BYTES', len(raw)): self.assertIn('archive_base64', p.summary(True))
            with patch('musiclab.backup_export.MAX_INLINE_BYTES', len(raw)-1):
                with self.assertRaises(ValueError): p.summary(True)

    def test_corrupt_or_missing_selected_revision_refuses_and_healthy_subset_preserves_source(self):
        with tempfile.TemporaryDirectory() as folder:
            library = populate(Path(folder)/'source'); file = library.root/IDS[1]/'draft.json'
            file.write_bytes(file.read_bytes()+b'\n'); before = contents(library.root)
            for payload in [{}, {'ids': [IDS[1]]}]:
                with self.assertRaises(ValueError): build('draft_backup_export', payload, draft_library=library)
            with self.assertRaises(OSError): build('draft_backup_export', {'ids': [IDS[2]]}, draft_library=library)
            wire = build('draft_backup_export', {'ids': [IDS[0]], 'include_archive': True}, draft_library=library).wire()
            check_inline(self, wire, library, [IDS[0]]); self.assertEqual(contents(library.root), before)

    def test_inline_bytes_restore_original_ids_time_and_draft_and_record_without_export_writes(self):
        with tempfile.TemporaryDirectory() as folder:
            library = populate(Path(folder)/'source'); before = contents(library.root)
            wire = build('draft_backup_export', {'include_archive': True}, draft_library=library).wire()
            raw = check_inline(self, wire, library, IDS[:2]); target = DraftLibrary(Path(folder)/'restored')
            result = restore_backup(target, io.BytesIO(raw), wire['data']['backup']['backup_sha256'])
            self.assertEqual(result['added_count'], 2); self.assertEqual(contents(target.root), before)
            self.assertEqual(restore_backup(target, io.BytesIO(raw), wire['data']['backup']['backup_sha256'])['reused_count'], 2)
            self.assertEqual(contents(library.root), before); self.assertEqual(list(Path(folder).glob('*.zip')), [])

    def test_cli_actual_other_cwd_metadata_inline_and_rejection_without_file_output(self):
        with tempfile.TemporaryDirectory() as folder:
            library = populate(Path(folder)/'source'); before = contents(library.root)
            prefix = [sys.executable, '-X', 'utf8', str(ROOT/'music_lab.py'), 'draft', 'backup-export', '--library', str(library.root)]
            wire = json.loads(run(prefix, folder)); self.assertNotIn('archive_base64', wire['data'])
            wire = json.loads(run([*prefix, '--ids', IDS[1], '--include-archive'], folder)); check_inline(self, wire, library, [IDS[1]])
            target = Path(folder)/'should-not-exist.zip'
            result = subprocess.run([*prefix, '--out', str(target)], cwd=folder, capture_output=True, timeout=10)
            self.assertEqual(result.returncode, 2); self.assertFalse(target.exists()); self.assertEqual(contents(library.root), before)

    def test_agent_actual_good_bad_good_requests_and_disabled_library_no_source_zip_required(self):
        with tempfile.TemporaryDirectory() as folder:
            library = populate(Path(folder)/'source'); before = contents(library.root)
            payloads = [{}, {'ids': [IDS[0]], 'include_archive': True}, {'path': '../x'}, {'ids': [IDS[2]]}, {'ids': [IDS[1]], 'include_archive': True}]
            requests = ''.join(json.dumps({'protocol_version': 1, 'id': str(i), 'operation': 'draft_backup_export', 'payload': p})+'\n' for i, p in enumerate(payloads)).encode()
            command = [sys.executable, '-X', 'utf8', str(ROOT/'music_lab_agent.py')]
            replies = [json.loads(line) for line in run([*command, '--draft-library', str(library.root)], folder, requests).splitlines()]
            self.assertEqual([r['ok'] for r in replies], [True, True, False, False, True]); self.assertNotIn('archive_base64', replies[0]['result']['data'])
            self.assertEqual(replies[3]['error']['code'], 'io_error'); self.assertNotIn(str(library.root), replies[3]['error']['message'])
            check_inline(self, replies[1]['result'], library, [IDS[0]]); check_inline(self, replies[4]['result'], library, [IDS[1]])
            disabled = json.loads(run(command, folder, requests.splitlines()[0]+b'\n')); self.assertFalse(disabled['ok'])
            self.assertEqual(contents(library.root), before); self.assertEqual(list(Path(folder).glob('*.zip')), [])

    def test_mcp_actual_discovery_annotations_metadata_and_inline_share_complete_source(self):
        with tempfile.TemporaryDirectory() as folder:
            library = populate(Path(folder)/'source'); before = contents(library.root)
            requests = [{'jsonrpc': '2.0', 'id': 1, 'method': 'initialize', 'params': {'protocolVersion': '2025-11-25', 'capabilities': {}, 'clientInfo': {'name': 'backup-export-qa', 'version': '1'}}},
                        {'jsonrpc': '2.0', 'method': 'notifications/initialized'}, {'jsonrpc': '2.0', 'id': 2, 'method': 'tools/list'},
                        *[{'jsonrpc': '2.0', 'id': i+3, 'method': 'tools/call', 'params': {'name': 'draft_backup_export', 'arguments': {'payload': p}}} for i, p in enumerate([{}, {'include_archive': True, 'ids': [IDS[1]]}, {'include_archive': 'true'}])]]
            output = run([sys.executable, '-X', 'utf8', str(ROOT/'music_lab_mcp.py'), '--draft-library', str(library.root)], folder, ('\n'.join(json.dumps(v) for v in requests)+'\n').encode())
            replies = [json.loads(line) for line in output.splitlines()]; tools = {v['name']: v for v in replies[1]['result']['tools']}
            self.assertEqual(len(tools), 20); self.assertTrue(tools['draft_backup_export']['annotations']['readOnlyHint'])
            self.assertFalse(tools['draft_backup_export']['annotations']['destructiveHint']); self.assertFalse(tools['draft_backup_export']['annotations']['openWorldHint'])
            shape = tools['draft_backup_export']['outputSchema']['properties']
            self.assertEqual(shape['files']['maxProperties'], 0); self.assertTrue(shape['meta']['properties']['needs_review']['const'])
            self.assertEqual(shape['data']['properties']['schema_version']['const'], 1)
            self.assertNotIn('archive_base64', shape['data']['required'])
            self.assertNotIn('archive_base64', replies[2]['result']['structuredContent']['data'])
            check_inline(self, replies[3]['result']['structuredContent'], library, [IDS[1]]); self.assertTrue(replies[4]['result']['isError'])
            self.assertEqual(contents(library.root), before)

    def test_http_actual_origin_library_boundaries_and_existing_prepare_wire_remain(self):
        with tempfile.TemporaryDirectory() as folder:
            library = populate(Path(folder)/'source'); before = contents(library.root)
            with WorkbenchServer(('127.0.0.1', 0), WorkbenchHandler) as server:
                server.draft_library = library; thread = threading.Thread(target=server.serve_forever, daemon=True); thread.start()
                def request(path, payload, headers=None):
                    connection = http.client.HTTPConnection('127.0.0.1', server.server_port, timeout=5)
                    connection.request('POST', path, json.dumps(payload).encode(), headers or {})
                    response = connection.getresponse(); result = response.status, json.loads(response.read()); connection.close(); return result
                try:
                    route = '/api/drafts/backup/export'
                    status, wire = request(route, {}); self.assertEqual(status, 200); self.assertNotIn('archive_base64', wire['data'])
                    status, wire = request(route, {'ids': [IDS[1]], 'include_archive': True}); self.assertEqual(status, 200); check_inline(self, wire, library, [IDS[1]])
                    self.assertEqual(request(route, {}, {'Origin': 'https://outside.invalid'})[0], 403)
                    self.assertEqual(request(route, {'out': 'x'})[0], 400)
                    status, descriptor = request('/api/drafts/backup/prepare', {}); self.assertEqual(status, 200)
                    self.assertEqual(set(descriptor), {'backup_schema_version', 'backup_sha256', 'bytes', 'entry_count', 'selection', 'download_url'})
                    server.draft_library = None; self.assertEqual(request(route, {})[0], 400)
                    self.assertEqual(contents(library.root), before)
                finally: server.shutdown(); thread.join(timeout=5)
            self.assertFalse(thread.is_alive())

    def test_discovery_independent_schema_and_library_tools_require_explicit_launch_selection(self):
        with tempfile.TemporaryDirectory() as folder:
            missing = DraftLibrary(Path(folder)/'uncreated')
            self.assertNotIn('draft_backup_export', capabilities()['operations']); self.assertEqual(len(tool_list()), 14)
            enabled = capabilities(missing); self.assertIn('draft_backup_export', enabled['operations']); self.assertEqual(len(tool_list(missing)), 20)
            self.assertEqual(enabled['draft_backup_export'], descriptor()); self.assertEqual(descriptor()['schema_version'], 1)
            shape = output_schema('draft_backup_export'); shape['properties']['data']['properties']['schema_version']['const'] = 99
            self.assertEqual(output_schema('draft_backup_export')['properties']['data']['properties']['schema_version']['const'], 1)
            self.assertNotIn('maxProperties', output_schema()['properties']['files'])
            self.assertEqual(descriptor()['data_schema']['properties']['archive_base64']['maxLength'], 699052)
            schema = payload_schema('draft_backup_export'); self.assertFalse(schema['additionalProperties'])
            self.assertEqual(set(schema['properties']), {'ids', 'include_archive'}); self.assertTrue(schema['properties']['ids']['uniqueItems'])
            self.assertEqual(schema['properties']['include_archive']['default'], False)
            schema['properties']['ids']['maxItems'] = 0; self.assertEqual(payload_schema('draft_backup_export')['properties']['ids']['maxItems'], 1000)
            with self.assertRaises(ValueError): build('draft_backup_export', {})
            self.assertFalse(missing.root.exists())


if __name__ == '__main__': unittest.main()
