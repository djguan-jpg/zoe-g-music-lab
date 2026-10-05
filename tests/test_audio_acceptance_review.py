# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
import copy
import http.client
import json
import subprocess
import sys
import tempfile
import threading
import unittest
from pathlib import Path
from musiclab.audio_acceptance import prepare
from musiclab.audio_acceptance_review import review, markdown, descriptor
from musiclab.application import build, capabilities
from musiclab.draft_library import DraftLibrary
from music_lab_server import WorkbenchServer, WorkbenchHandler
from music_lab_mcp import Session

ROOT = Path(__file__).resolve().parents[1]


def draft(**fields):
    return {'format': 'zoe-audio-acceptance-draft', 'schema_version': 1, 'profile': 'distribution',
            'custom': True, 'fields': {'rates': '４８０００，44_100', 'bits': '16.0,24', 'channels': '2,2,1', **fields}}


class AcceptanceReviewTests(unittest.TestCase):
    def test_three_invalid_fields_and_inactive_values_preserved(self):
        source = draft(rates='  ', bits='16.00000000000000001', channels='0')
        before = copy.deepcopy(source)
        data = review({'document': source})
        self.assertEqual([i['field'] for i in data['issues']], ['rates', 'bits', 'channels'])
        self.assertEqual(data['issue_count'], 3)
        self.assertFalse(data['analysis_ready']); self.assertIsNone(data['effective_acceptance'])
        self.assertEqual(source, before); self.assertEqual(data['source'], before)
        data['source']['fields']['bits'] = 'changed'; self.assertEqual(source, before)
        source['custom'] = False
        data = review({'document': source})
        self.assertEqual(data['status'], 'preset_active'); self.assertEqual(data['issue_count'], 0)
        self.assertTrue(all(f['status'] == 'inactive' for f in data['fields']))
        self.assertEqual(data['effective_acceptance'], prepare(source)[1])
        self.assertIn('未套用', markdown(data))

    def test_cross_language_all_fields_exact_grammar_and_markdown(self):
        values = ['', ' \u0085', '0', '-1', '.5', '1.', '+1', '1e2', '1e-2', '0x10', 'NaN',
                  'Infinity', '1,', '1,,2', '1\ufeff', '1_0', '１，٢', '1.0000000000000000001',
                  '9007199254740991', '9007199254740991.1', '9007199254740992', '1e999',
                  ','.join(['1']*64), ','.join(['1']*65), '\u001c1', '1_0e+0_1', '0e'+'9'*1000, '1e-'+'9'*1000]
        docs = [draft(**{key: value}) for key in ('rates', 'bits', 'channels') for value in values]
        docs += [{**draft(), 'custom': False, 'fields': {k: '\U0001f3b5'*1024 for k in ('rates', 'bits', 'channels')}}]
        code = "const m=require('./web/audio-acceptance-review.js');let s='';process.stdin.on('data',x=>s+=x);process.stdin.on('end',()=>console.log(JSON.stringify(JSON.parse(s).map(d=>{const r=m.review(d);return {data:r,markdown:m.markdown(r)}}))));"
        process = subprocess.run(['node', '-e', code], cwd=ROOT, input=json.dumps(docs), text=True,
                                 encoding='utf-8', capture_output=True, timeout=20)
        self.assertEqual(process.returncode, 0, process.stderr)
        for source, result in zip(docs, json.loads(process.stdout), strict=True):
            data = review({'document': source})
            self.assertEqual(result['data'], data)
            self.assertEqual(result['markdown'].encode(), markdown(data).encode())
            if data['analysis_ready']:
                self.assertEqual(data['effective_acceptance'], prepare(source)[1])
            else:
                with self.assertRaises(ValueError): prepare(source)

    def test_strict_shape_versions_unicode_and_source_isolation(self):
        for mutate in (lambda d: d.update(schema_version=2), lambda d: d.update(schema_version=True),
                       lambda d: d.update(custom=1), lambda d: d.update(path='media.wav'),
                       lambda d: d['fields'].update(bits='x'*1025), lambda d: d['fields'].update(bits='\ud800')):
            source = draft(); mutate(source)
            with self.assertRaises(ValueError): review({'document': source})
        for payload in ({}, {'document': draft(), 'path': 'media.wav'}, {'document': None}):
            with self.assertRaises(ValueError): build('audio_acceptance_review', payload)

    def test_discovery_readonly_without_library_media_or_model(self):
        cap = capabilities()
        self.assertEqual(len(cap['operations']),15); self.assertEqual(cap['audio_acceptance_review'], descriptor())
        schema = cap['input_schemas']['audio_acceptance_review']
        self.assertEqual(schema['required'], ['document']); self.assertFalse(schema['additionalProperties'])
        with tempfile.TemporaryDirectory() as folder:
            self.assertEqual(len(capabilities(DraftLibrary(folder))['operations']),22)
        session = Session()
        session.response(json.dumps({'jsonrpc': '2.0', 'id': 0, 'method': 'initialize', 'params': {
            'protocolVersion': '2025-11-25', 'capabilities': {}, 'clientInfo': {'name': 'qa', 'version': '1'}}}))
        session.response(json.dumps({'jsonrpc': '2.0', 'method': 'notifications/initialized'}))
        listing = session.response(json.dumps({'jsonrpc': '2.0', 'id': 1, 'method': 'tools/list'}))
        tool = next(t for t in listing['result']['tools'] if t['name'] == 'audio_acceptance_review')
        self.assertTrue(tool['annotations']['readOnlyHint']); self.assertFalse(tool['annotations']['openWorldHint'])

    def test_cli_status_and_exclusive_outputs(self):
        with tempfile.TemporaryDirectory() as folder:
            folder = Path(folder); source = folder/'conditions.json'
            for index, document in enumerate((draft(), draft(rates='', bits='0', channels='2.5'))):
                source.write_text(json.dumps(document), encoding='utf-8')
                args = [sys.executable, '-X', 'utf8', 'music_lab.py', 'audio-acceptance-review', '--input', str(source), '--out', str(folder/str(index))]
                result = subprocess.run(args, cwd=ROOT, capture_output=True, timeout=20)
                self.assertEqual(result.returncode, 0 if index == 0 else 2, result.stderr)
                files = build('audio_acceptance_review', {'document': document}).files
                for name, content in files.items(): self.assertEqual((folder/str(index)/name).read_bytes(), content.encode())
                result = subprocess.run(args, cwd=ROOT, capture_output=True, timeout=20)
                self.assertEqual(result.returncode, 1)
                for name, content in files.items(): self.assertEqual((folder/str(index)/name).read_bytes(), content.encode())
            source.write_bytes(b'{"custom":true,"custom":false}')
            self.assertEqual(subprocess.run(args, cwd=ROOT, capture_output=True, timeout=20).returncode, 1)

    def test_actual_agent_and_mcp_bad_then_good_without_media_source(self):
        expected = build('audio_acceptance_review', {'document': draft()}).wire()
        for script in ('music_lab_agent.py', 'music_lab_mcp.py'):
            messages = []
            if script.endswith('mcp.py'):
                messages = [{'jsonrpc': '2.0', 'id': 0, 'method': 'initialize', 'params': {
                    'protocolVersion': '2025-11-25', 'capabilities': {}, 'clientInfo': {'name': 'qa', 'version': '1'}}},
                    {'jsonrpc': '2.0', 'method': 'notifications/initialized'}]
            for index, payload in enumerate(({'document': draft(), 'path': 'foreign.wav'}, {'document': draft()}), 1):
                messages.append({'protocol_version': 1, 'id': str(index), 'operation': 'audio_acceptance_review', 'payload': payload}
                    if script.endswith('agent.py') else {'jsonrpc': '2.0', 'id': index, 'method': 'tools/call', 'params': {
                        'name': 'audio_acceptance_review', 'arguments': {'payload': payload}}})
            result = subprocess.run([sys.executable, '-X', 'utf8', script], cwd=ROOT, input=''.join(json.dumps(m)+'\n' for m in messages),
                                    text=True, encoding='utf-8', capture_output=True, timeout=20)
            self.assertEqual(result.returncode, 0, result.stderr); replies = [json.loads(s) for s in result.stdout.splitlines()]
            if script.endswith('agent.py'):
                self.assertFalse(replies[-2]['ok']); self.assertTrue(replies[-1]['ok']); actual = replies[-1]['result']
            else:
                self.assertTrue(replies[-2]['result']['isError']); actual = json.loads(replies[-1]['result']['content'][0]['text'])
            self.assertEqual(actual, expected); self.assertTrue(actual['meta']['needs_review'])

    def test_actual_http_bad_then_good_and_fixed_assets(self):
        server = WorkbenchServer(('127.0.0.1', 0), WorkbenchHandler)
        thread = threading.Thread(target=server.serve_forever); thread.start()
        try:
            for payload, status in (({'document': draft(), 'path': 'foreign.wav'}, 400), ({'document': draft(rates='')}, 200), ({'document': draft()}, 200)):
                conn = http.client.HTTPConnection(*server.server_address, timeout=10)
                conn.request('POST', '/api/audio-acceptance-review', json.dumps(payload), {'Content-Type': 'application/json'})
                reply = conn.getresponse(); data = json.loads(reply.read()); conn.close(); self.assertEqual(reply.status, status)
                if status == 200: self.assertEqual(data, build('audio_acceptance_review', payload).wire())
            for name in ('audio-acceptance-review.js', 'audio-acceptance-review-dom.js'):
                conn = http.client.HTTPConnection(*server.server_address, timeout=10); conn.request('GET', '/'+name)
                reply = conn.getresponse(); self.assertEqual(reply.status, 200); self.assertEqual(reply.read(), (ROOT/'web'/name).read_bytes()); conn.close()
        finally:
            server.shutdown(); thread.join(); server.server_close()
