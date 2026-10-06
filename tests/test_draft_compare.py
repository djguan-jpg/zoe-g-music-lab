# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
import copy
import hashlib
import http.client
import json
from pathlib import Path
import subprocess
import sys
import tempfile
import threading
import unittest
from unittest.mock import patch

from musiclab.application import build, capabilities
from musiclab.draft_contract import CONTRACT, MAX_DRAFT_BYTES, draft_bytes
from musiclab.draft_compare import compare, bundle, MAX_REPORT_BYTES, MAX_DETAILS, EXCERPT_BYTES
from musiclab.tool_contracts import payload_schema, output_schema
from music_lab_mcp import tool_list
from music_lab_server import WorkbenchHandler, WorkbenchServer

ROOT = Path(__file__).resolve().parents[1]


def draft():
    panels = {name: {'fields': dict.fromkeys(fields, '')} for name, fields in CONTRACT['fields'].items()}
    for name, rule in CONTRACT['rows'].items():
        panels[name][rule['key']] = []
    panels['music'].update(avoid=[], deliverables=[])
    panels['storyboard']['motifs'] = []
    panels['lyrics']['fields']['lyrics-format'] = '.lrc'
    panels['audio']['fields']['audio-profile'] = 'distribution'
    return {'format': CONTRACT['format'], 'schema_version': 3, 'tool_version': '0.8.0',
            'saved_at': '2026-10-01T00:00:00Z', 'tab': 'music', 'panels': panels}


def changed():
    a = draft(); b = copy.deepcopy(a)
    b['panels']['music']['fields']['music-title'] = ' 原創\r\n🎵 '
    b['panels']['lyrics']['cues'] = [{'start': '', 'end': '03.00', 'text': ''}]
    return {'baseline': a, 'current': b}


class DraftComparisonTests(unittest.TestCase):
    def test_identical_incomplete_drafts_have_complete_canonical_sources(self):
        a = draft(); p = {'baseline': a, 'current': copy.deepcopy(a)}; before = copy.deepcopy(p)
        with patch('pathlib.Path.open', side_effect=AssertionError('Pure comparison opened a path')):
            d = compare(p)
        self.assertEqual(d['status'], 'identical'); self.assertEqual(d['change_count'], 0)
        self.assertFalse(d['creative_changed']); self.assertFalse(d['metadata_changed'])
        self.assertEqual(d['details'], []); self.assertFalse(d['details_truncated'])
        self.assertEqual(d['source']['baseline_sha256'], hashlib.sha256(draft_bytes(a)).hexdigest())
        self.assertEqual(d['source']['baseline_sha256'], d['source']['current_sha256']); self.assertEqual(p, before)

    def test_metadata_only_is_distinct_from_creative_changes(self):
        a = draft(); b = copy.deepcopy(a); b.update(saved_at='另存時間', tool_version='future-product', tab='lyrics')
        d = compare({'baseline': a, 'current': b})
        self.assertEqual(d['change_count'], 3); self.assertFalse(d['creative_changed']); self.assertTrue(d['metadata_changed'])
        self.assertEqual(d['metadata']['changed_fields'], ['tool_version', 'saved_at', 'tab'])
        self.assertTrue(all(x['scope'] == 'metadata' for x in d['details']))
        self.assertTrue(all(not x['change_count'] for x in d['panels'].values()))

    def test_all_panels_collections_and_empty_added_removed_values_are_distinct(self):
        p = changed(); a, b = p.values()
        a['panels']['music']['avoid'] = ['']
        b['panels']['music']['deliverables'] = ['']
        a['panels']['storyboard']['motifs'] = [{'id': 'motif-1', 'name': '', 'meaning': ''}]
        b['panels']['storyboard']['fields']['mv-title'] = '分鏡'
        b['panels']['audio']['fields']['audio-profile'] = 'video'
        d = compare(p)
        self.assertEqual(d['change_count'], 7)
        values = {(x['scope'], x['collection']): x for x in d['details']}
        added = values['music', 'deliverables']['fields'][0]
        removed = values['music', 'avoid']['fields'][0]
        self.assertIsNone(added['before']); self.assertEqual(added['after']['bytes'], 0)
        self.assertIsNone(removed['after']); self.assertEqual(removed['before']['excerpt'], '')
        self.assertEqual(values['lyrics', 'cues']['row'], 1)
        self.assertEqual(values['storyboard', 'motifs']['status'], 'removed')
        self.assertEqual(d['panels']['audio']['change_count'], 1)

    def test_original_string_numeric_spelling_line_endings_and_unicode_are_preserved(self):
        a = draft(); b = copy.deepcopy(a)
        a['panels']['music']['sections'] = [dict(zip(CONTRACT['rows']['music']['columns'], ['同名', '8', '3', '原文\r\n🎵', 'e\u0301']))]
        b['panels']['music']['sections'] = [dict(zip(CONTRACT['rows']['music']['columns'], ['同名', '08.0', '3', '原文\n🎵', 'é']))]
        d = compare({'baseline': a, 'current': b})
        self.assertEqual(d['change_count'], 1)
        fields = {x['field']: x for x in d['details'][0]['fields']}
        self.assertEqual(set(fields), {'bars', 'focus', 'texture'})
        self.assertEqual(fields['bars']['before']['excerpt'], '8'); self.assertEqual(fields['bars']['after']['excerpt'], '08.0')
        self.assertEqual(fields['focus']['before']['excerpt'], '原文\r\n🎵')
        self.assertNotEqual(fields['texture']['before']['sha256'], fields['texture']['after']['sha256'])

    def test_insertion_and_duplicate_text_align_by_position_without_guessing_moves(self):
        a = draft(); b = copy.deepcopy(a)
        a['panels']['lyrics']['cues'] = [{'start': '', 'end': '', 'text': x} for x in ['重複', '第二句', '重複']]
        b['panels']['lyrics']['cues'] = [{'start': '', 'end': '', 'text': x} for x in ['插入', '重複', '第二句', '重複']]
        d = compare({'baseline': a, 'current': b})
        self.assertEqual(d['panels']['lyrics']['collections']['cues'], {'baseline_rows': 3, 'current_rows': 4, 'changed_rows': 3, 'added_rows': 1, 'removed_rows': 0})
        self.assertEqual([x['row'] for x in d['details']], [1, 2, 3, 4])

    def test_report_is_isolated_and_result_files_match_complete_data(self):
        p = changed(); before = copy.deepcopy(p); r = build('draft_compare', p)
        self.assertTrue(r.needs_review); self.assertEqual(set(r.files), {'draft-comparison.json', 'draft-comparison.md'})
        self.assertEqual(json.loads(r.files['draft-comparison.json']), r.data)
        r.data['details'][0]['fields'][0]['after']['excerpt'] = '另改'; self.assertEqual(p, before)

    def test_detail_cap_keeps_all_10000_original_rows_counted(self):
        a = draft(); b = copy.deepcopy(a)
        a['panels']['lyrics']['cues'] = [{'start': '', 'end': '', 'text': 'a'} for _ in range(10000)]
        b['panels']['lyrics']['cues'] = [{'start': '', 'end': '', 'text': 'b'} for _ in range(10000)]
        d = compare({'baseline': a, 'current': b})
        self.assertEqual(d['change_count'], 10000); self.assertEqual(len(d['details']), MAX_DETAILS)
        self.assertTrue(d['details_truncated']); self.assertEqual(d['details'][-1]['row'], MAX_DETAILS)
        self.assertEqual(d['panels']['lyrics']['collections']['cues']['changed_rows'], 10000)

    def test_byte_cap_control_text_and_utf8_excerpts_do_not_drop_counts_or_split_characters(self):
        a = draft(); b = copy.deepcopy(a)
        for d, text in [(a, '\x00'*128), (b, '\x01'*128)]:
            shot = dict.fromkeys(CONTRACT['rows']['storyboard']['columns'], text)
            shot.update(screen_direction='neutral', motif_id='')
            d['panels']['storyboard']['shots'] = [dict(shot) for _ in range(80)]
        files = bundle({'baseline': a, 'current': b}); d = json.loads(files['draft-comparison.json'])
        self.assertEqual(d['change_count'], 80); self.assertLess(len(d['details']), 80); self.assertTrue(d['details_truncated'])
        self.assertLessEqual(sum(len(x.encode('utf-8')) for x in files.values()), MAX_REPORT_BYTES)
        p = changed(); text = 'a'*127+'🎵尾'; p['current']['panels']['music']['fields']['music-title'] = text
        view = compare(p)['details'][0]['fields'][0]['after']
        self.assertEqual(view['excerpt'], 'a'*127); self.assertTrue(view['excerpt_truncated'])
        self.assertEqual(view['sha256'], hashlib.sha256(text.encode('utf-8')).hexdigest())
        self.assertLessEqual(len(view['excerpt'].encode('utf-8')), EXCERPT_BYTES)

    def test_unknown_legacy_shape_motif_corruption_and_path_requests_are_rejected(self):
        mutations = [lambda p: p.update(path='private.json'), lambda p: p.pop('current'),
                     lambda p: p['current'].update(schema_version=2), lambda p: p['current'].update(extra=''),
                     lambda p: p['current']['panels']['lyrics']['fields'].pop('lyrics-source'),
                     lambda p: p['current']['panels']['storyboard'].update(motifs=[{'id': 'unknown', 'name': '', 'meaning': ''}])]
        for mutate in mutations:
            p = changed(); mutate(p); before = copy.deepcopy(p)
            with self.assertRaises(ValueError): compare(p)
            self.assertEqual(p, before)

    def test_invalid_unicode_and_canonical_capacity_reject_without_partial_result(self):
        for location in ('metadata', 'field', 'row'):
            p = changed()
            if location == 'metadata': p['current']['saved_at'] = '\ud800'
            elif location == 'field': p['current']['panels']['lyrics']['fields']['lyrics-source'] = '\udfff'
            else: p['current']['panels']['lyrics']['cues'][0]['text'] = '\ud800'
            with self.assertRaisesRegex(ValueError, 'Unicode'): build('draft_compare', p)
        p = changed(); p['current']['panels']['music']['fields']['music-title'] = 'a'*MAX_DRAFT_BYTES
        with self.assertRaisesRegex(ValueError, '1 MiB'): compare(p)

    def test_discovery_exposes_exact_readonly_tool_and_independent_schema(self):
        c = capabilities(); self.assertEqual(len(c['operations']), 21); self.assertTrue(c['draft_comparison']['read_only'])
        t = next(x for x in tool_list() if x['name'] == 'draft_compare')
        self.assertTrue(t['annotations']['readOnlyHint']); self.assertFalse(t['annotations']['destructiveHint']); self.assertFalse(t['annotations']['openWorldHint'])
        self.assertEqual(payload_schema('draft_compare')['required'], ['baseline', 'current'])
        self.assertFalse(payload_schema('draft_compare')['additionalProperties'])
        self.assertEqual(output_schema('draft_compare')['properties']['data']['properties']['schema_version']['const'], 1)
        self.assertTrue(output_schema('draft_compare')['properties']['meta']['properties']['needs_review']['const'])

    def test_real_agent_and_mcp_good_bad_good_have_identical_full_reply_and_no_writes(self):
        p = changed(); expected = build('draft_compare', p).wire(); bad = dict(p, output_path='forbidden')
        with tempfile.TemporaryDirectory() as folder:
            messages = [{'protocol_version': 1, 'id': str(i), 'operation': 'draft_compare', 'payload': x} for i, x in enumerate([p, bad, p])]
            run = subprocess.run([sys.executable, '-X', 'utf8', str(ROOT/'music_lab_agent.py')], cwd=folder,
                                 input=''.join(json.dumps(x)+'\n' for x in messages), capture_output=True, text=True, encoding='utf-8', timeout=10)
            self.assertEqual(run.returncode, 0, run.stderr); replies = list(map(json.loads, run.stdout.splitlines()))
            self.assertEqual([x['ok'] for x in replies], [True, False, True])
            self.assertEqual(replies[0]['result'], expected); self.assertEqual(replies[2]['result'], expected)
            calls = [{'jsonrpc': '2.0', 'id': 1, 'method': 'initialize', 'params': {'protocolVersion': '2025-11-25', 'capabilities': {}, 'clientInfo': {'name': 'compare-qa', 'version': '1'}}},
                     {'jsonrpc': '2.0', 'method': 'notifications/initialized'}]
            calls += [{'jsonrpc': '2.0', 'id': i+2, 'method': 'tools/call', 'params': {'name': 'draft_compare', 'arguments': {'payload': x}}} for i, x in enumerate([p, bad, p])]
            run = subprocess.run([sys.executable, '-X', 'utf8', str(ROOT/'music_lab_mcp.py')], cwd=folder,
                                 input=''.join(json.dumps(x)+'\n' for x in calls), capture_output=True, text=True, encoding='utf-8', timeout=10)
            self.assertEqual(run.returncode, 0, run.stderr); replies = list(map(json.loads, run.stdout.splitlines()))[1:]
            self.assertEqual([x['result']['isError'] for x in replies], [False, True, False])
            for x in [replies[0], replies[2]]:
                self.assertEqual(x['result']['structuredContent'], expected); self.assertEqual(json.loads(x['result']['content'][0]['text']), expected)
            self.assertEqual(list(Path(folder).iterdir()), [])

    def test_loopback_http_full_reply_recovers_after_invalid_source_and_stops_owned_thread(self):
        p = changed(); expected = build('draft_compare', p).wire()
        class Quiet(WorkbenchHandler):
            def log_message(self, *_): pass
        with WorkbenchServer(('127.0.0.1', 0), Quiet) as server:
            thread = threading.Thread(target=server.serve_forever); thread.start()
            try:
                for payload, status in [(p, 200), (dict(p, path='forbidden'), 400), (p, 200)]:
                    connection = http.client.HTTPConnection('127.0.0.1', server.server_port, timeout=3)
                    try:
                        connection.request('POST', '/api/draft-compare', json.dumps(payload), {'Content-Type': 'application/json'})
                        reply = connection.getresponse(); self.assertEqual(reply.status, status); data = json.loads(reply.read())
                        if status == 200: self.assertEqual(data, expected)
                    finally: connection.close()
            finally: server.shutdown(); thread.join(timeout=3)
        self.assertFalse(thread.is_alive())

    def test_cli_explicit_sources_status_and_exclusive_outputs_preserve_source_bytes(self):
        p = changed()
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder); a = root/'baseline.json'; b = root/'current.json'; out = root/'reports'
            a.write_bytes(b'\xef\xbb\xbf'+draft_bytes(p['baseline'])); b.write_bytes(draft_bytes(p['current']))
            before = (a.read_bytes(), b.read_bytes())
            args = [sys.executable, '-X', 'utf8', str(ROOT/'music_lab.py'), 'draft-compare', '--baseline', str(a), '--current', str(b), '--out', str(out)]
            run = subprocess.run(args, cwd=root, capture_output=True, text=True, encoding='utf-8', timeout=10)
            self.assertEqual(run.returncode, 2, run.stderr)
            expected = build('draft_compare', p).files
            self.assertEqual({x.name: x.read_text(encoding='utf-8') for x in out.iterdir()}, expected)
            original = {x.name: x.read_bytes() for x in out.iterdir()}
            self.assertEqual(subprocess.run(args, cwd=root, capture_output=True, timeout=10).returncode, 1)
            self.assertEqual({x.name: x.read_bytes() for x in out.iterdir()}, original)
            self.assertEqual(subprocess.run(args+['--overwrite'], cwd=root, capture_output=True, timeout=10).returncode, 2)
            args[args.index(str(b))] = str(a); args[args.index(str(out))] = str(root/'identical')
            self.assertEqual(subprocess.run(args, cwd=root, capture_output=True, timeout=10).returncode, 0)
            self.assertEqual((a.read_bytes(), b.read_bytes()), before)

    def test_cli_strict_duplicate_invalid_utf8_and_oversize_input_never_write_report(self):
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder); a = root/'baseline.json'; b = root/'current.json'; a.write_bytes(draft_bytes(draft()))
            for index, raw in enumerate([b'{"schema_version":3,"schema_version":3}', b'\xff', b' '* (MAX_DRAFT_BYTES+4)]):
                b.write_bytes(raw); out = root/f'bad-{index}'
                args = [sys.executable, '-X', 'utf8', str(ROOT/'music_lab.py'), 'draft-compare', '--baseline', str(a), '--current', str(b), '--out', str(out)]
                run = subprocess.run(args, cwd=root, capture_output=True, text=True, encoding='utf-8', timeout=10)
                self.assertEqual(run.returncode, 1); self.assertNotIn('Traceback', run.stderr); self.assertFalse(out.exists()); self.assertEqual(b.read_bytes(), raw)
