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
from musiclab.audio_acceptance import decode as decode_draft
from musiclab.audio_acceptance_input import inspect, decode, descriptor
from musiclab.audio_acceptance_review import review, validate_report
from musiclab.application import build, capabilities
from music_lab_server import WorkbenchServer, WorkbenchHandler
from test_audio_evidence import wav_bytes

ROOT = Path(__file__).resolve().parents[1]


def draft(**fields):
    return {'format': 'zoe-audio-acceptance-draft', 'schema_version': 1, 'profile': 'video', 'custom': True,
            'fields': {'rates': '４８０００，44_100', 'bits': '16.0,24', 'channels': '2,2,1', **fields}}


class AcceptanceInputTests(unittest.TestCase):
    def test_draft_report_handoff_isolated_and_original_raw_preserved(self):
        for source in (draft(), draft(rates='  ', bits='16.5', channels='０'), {**draft(bits='未完成'), 'custom': False}):
            report = review({'document': source}); before = copy.deepcopy(report)
            checked = inspect(report); self.assertEqual(checked, {'kind': 'review', 'document': source})
            checked['document']['fields']['bits'] = 'changed'; self.assertEqual(report, before)
            self.assertEqual(inspect(source), {'kind': 'draft', 'document': source})
            self.assertEqual(decode(json.dumps(report, ensure_ascii=False))['document'], source)
            with self.assertRaises(ValueError): decode_draft(json.dumps(report))

    def test_cross_language_complete_report_matrix_and_original_format(self):
        sources = [draft(**{key: value}) for key in ('rates', 'bits', 'channels') for value in (
            '', '0', '1.000000000000000001', '１，٢', '1e2', ','.join(['1']*64), ','.join(['1']*65), '0e'+'9'*1000)]
        sources += [{**draft(), 'custom': False, 'fields': {k: '\U0001f3b5'*1024 for k in ('rates', 'bits', 'channels')}}]
        documents = sources + [review({'document': d}) for d in sources]
        code = "const m=require('./web/audio-acceptance-input.js');let s='';process.stdin.on('data',x=>s+=x);process.stdin.on('end',()=>console.log(JSON.stringify(JSON.parse(s).map(d=>m.inspect(d)))));"
        process = subprocess.run(['node', '-e', code], cwd=ROOT, input=json.dumps(documents), capture_output=True,
                                 text=True, encoding='utf-8', timeout=20)
        self.assertEqual(process.returncode, 0, process.stderr)
        self.assertEqual(json.loads(process.stdout), [inspect(d) for d in documents])
        for document in documents:
            raw = json.dumps(document, ensure_ascii=False).encode()
            self.assertEqual(decode(b'\xef\xbb\xbf'+raw), inspect(document))

    def test_every_derived_field_unknown_versions_and_strict_file_boundaries(self):
        mutations = [lambda r: r.update(schema_version=2), lambda r: r.update(schema_version=True), lambda r: r.update(extra=1),
            lambda r: r.update(issue_count=False), lambda r: r.update(analysis_ready=False), lambda r: r.update(status='needs_correction'),
            lambda r: r['fields'][0].update(value_count=1), lambda r: r['fields'][0].update(status='inactive'),
            lambda r: r['effective_acceptance']['rates'].append(32000), lambda r: r['review_notes'].append('commercial accepted'),
            lambda r: r['source']['fields'].update(rates=''), lambda r: r['source'].update(schema_version=2),
            lambda r: r['source']['fields'].update(bits='\ud800'), lambda r: r.update(issues=[{'field':'rates','code':'missing_value','message':'x'}])]
        for mutate in mutations:
            report = review({'document': draft()}); mutate(report)
            with self.assertRaises(ValueError): validate_report(report)
        for raw in (b'\xff', b' '*65537, b'{"format":"x","format":"y"}', b'{"x":NaN}', b'{"x":"\\ud800"}'):
            with self.assertRaises(ValueError): decode(raw)
        with self.assertRaises(ValueError): inspect(build('audio_acceptance_review', {'document': draft()}).wire())

    def test_actual_cli_report_handoff_and_exclusive_outputs_preserve_inputs(self):
        with tempfile.TemporaryDirectory() as folder:
            folder = Path(folder); audio = folder/'selected.wav'; audio.write_bytes(wav_bytes())
            source = draft(); raw_report = build('audio_acceptance_review', {'document': source}).files['audio-acceptance-review.json']
            conditions = folder/'report.json'; conditions.write_bytes(raw_report.encode()); before_audio = audio.read_bytes()
            args = [sys.executable, '-X', 'utf8', 'music_lab.py', 'audio', '--input', str(audio), '--acceptance-draft', str(conditions), '--out', str(folder/'audio')]
            process = subprocess.run(args, cwd=ROOT, capture_output=True, timeout=20); self.assertEqual(process.returncode, 2, process.stderr)
            expected = build('audio', {'acceptance_draft': source}, audio_source=audio).files
            for name, content in expected.items(): self.assertEqual((folder/'audio'/name).read_bytes(), content.encode())
            self.assertEqual(subprocess.run(args, cwd=ROOT, capture_output=True, timeout=20).returncode, 1)
            self.assertEqual(subprocess.run(args+['--profile', 'video'], cwd=ROOT, capture_output=True, timeout=20).returncode, 1)
            for index, document in enumerate((source, draft(rates=''))):
                report = build('audio_acceptance_review', {'document': document})
                conditions.write_bytes(report.files['audio-acceptance-review.json'].encode())
                before = conditions.read_bytes()
                args = [sys.executable, '-X', 'utf8', 'music_lab.py', 'audio-acceptance-review', '--input', str(conditions), '--out', str(folder/str(index))]
                process = subprocess.run(args, cwd=ROOT, capture_output=True, timeout=20); self.assertEqual(process.returncode, 0 if index == 0 else 2, process.stderr)
                for name, content in report.files.items(): self.assertEqual((folder/str(index)/name).read_bytes(), content.encode())
                self.assertEqual(conditions.read_bytes(), before)
            bad = review({'document': source}); bad['issue_count'] = 99; conditions.write_text(json.dumps(bad), encoding='utf-8')
            args[-1] = str(folder/'refused')
            self.assertEqual(subprocess.run(args, cwd=ROOT, capture_output=True, timeout=20).returncode, 1)
            self.assertFalse((folder/'refused').exists()); self.assertEqual(audio.read_bytes(), before_audio)

    def test_actual_agent_mcp_wire_stays_draft_only_and_discovery_is_explicit(self):
        source = draft(); report = review({'document': source}); cap = capabilities()
        self.assertEqual(len(cap['operations']),17); self.assertEqual(cap['audio_acceptance_input'], descriptor())
        self.assertEqual(cap['input_schemas']['audio_acceptance_review']['properties']['document']['properties']['format']['const'], source['format'])
        for script in ('music_lab_agent.py', 'music_lab_mcp.py'):
            messages = []
            if script.endswith('mcp.py'):
                messages = [{'jsonrpc':'2.0','id':0,'method':'initialize','params':{'protocolVersion':'2025-11-25','capabilities':{},'clientInfo':{'name':'qa','version':'1'}}},
                            {'jsonrpc':'2.0','method':'notifications/initialized'}]
            for index, document in enumerate((report, inspect(report)['document']), 1):
                payload = {'document': document}
                messages.append({'protocol_version':1,'id':str(index),'operation':'audio_acceptance_review','payload':payload}
                    if script.endswith('agent.py') else {'jsonrpc':'2.0','id':index,'method':'tools/call','params':{'name':'audio_acceptance_review','arguments':{'payload':payload}}})
            process = subprocess.run([sys.executable, '-X', 'utf8', script], cwd=ROOT, input=''.join(json.dumps(m)+'\n' for m in messages),
                                     capture_output=True, text=True, encoding='utf-8', timeout=20)
            self.assertEqual(process.returncode, 0, process.stderr); replies = [json.loads(line) for line in process.stdout.splitlines()]
            if script.endswith('agent.py'):
                self.assertFalse(replies[-2]['ok']); self.assertEqual(replies[-1]['result'], build('audio_acceptance_review', {'document': source}).wire())
            else:
                self.assertTrue(replies[-2]['result']['isError']); self.assertEqual(json.loads(replies[-1]['result']['content'][0]['text']), build('audio_acceptance_review', {'document': source}).wire())

    def test_actual_http_fixed_asset_and_unchanged_json_payload_boundary(self):
        server = WorkbenchServer(('127.0.0.1', 0), WorkbenchHandler); thread = threading.Thread(target=server.serve_forever); thread.start()
        try:
            conn = http.client.HTTPConnection(*server.server_address, timeout=10); conn.request('GET', '/audio-acceptance-input.js')
            response = conn.getresponse(); self.assertEqual(response.status, 200); self.assertEqual(response.read(), (ROOT/'web/audio-acceptance-input.js').read_bytes()); conn.close()
            for document, status in ((review({'document': draft()}), 400), (draft(), 200)):
                conn = http.client.HTTPConnection(*server.server_address, timeout=10); conn.request('POST', '/api/audio-acceptance-review', json.dumps({'document':document}), {'Content-Type':'application/json'})
                response = conn.getresponse(); response.read(); conn.close(); self.assertEqual(response.status, status)
        finally: server.shutdown(); thread.join(); server.server_close()
