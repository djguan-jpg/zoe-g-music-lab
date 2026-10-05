# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
import http.client
import json
import subprocess
import sys
import tempfile
import threading
import unittest
import urllib.parse
from pathlib import Path
from musiclab.audio_acceptance import validate, prepare, decode, descriptor
from musiclab.application import build, capabilities
from music_lab_server import WorkbenchServer, WorkbenchHandler
from test_audio_evidence import wav_bytes

ROOT = Path(__file__).resolve().parents[1]


def draft(**fields):
    return {'format': 'zoe-audio-acceptance-draft', 'schema_version': 1, 'profile': 'video', 'custom': True,
            'fields': {'rates': '４８０００， 44_100', 'bits': '16.0, 24', 'channels': '2', **fields}}


class AcceptanceTests(unittest.TestCase):
    def test_shape_preserves_unfinished_raw_and_isolated_copy(self):
        d = draft(rates=' 1e\n', bits='', channels='０，\r\n')
        checked = validate(d)
        self.assertEqual(checked, d)
        checked['fields']['bits'] = 'changed'
        self.assertEqual(d['fields']['bits'], '')
        with self.assertRaises(ValueError): prepare(d)

    def test_fullwidth_decimal_order_duplicates_and_preset(self):
        d = draft(channels='2, 2, 1')
        profile, limits = prepare(d)
        self.assertEqual(profile, 'video')
        self.assertEqual(limits, {'rates': [48000, 44100], 'bits': [16, 24], 'channels': [2, 2, 1]})
        d['custom'] = False; d['fields']['rates'] = 'unfinished'
        self.assertEqual(prepare(d)[1]['rates'], [48000])

    def test_unknown_shape_types_and_unicode_refuse(self):
        mutations = [lambda d: d.update(schema_version=True), lambda d: d.update(schema_version=2),
                     lambda d: d.update(path='secret.wav'), lambda d: d.update(profile='unknown'),
                     lambda d: d.update(custom=1), lambda d: d['fields'].update(extra='1'),
                     lambda d: d['fields'].update(bits=16), lambda d: d['fields'].update(bits='x'*1025),
                     lambda d: d['fields'].update(bits='\ud800')]
        for mutate in mutations:
            d = draft(); mutate(d)
            with self.subTest(d=repr(d)[:100]), self.assertRaises(ValueError): validate(d)

    def test_active_invalid_values_refuse(self):
        for value in ('', '0', '-1', '1.5', 'NaN', 'Infinity', '0x10', '1,', '1e999', '9007199254740992', '1.00000000000000000001', '9007199254740991.1', ','.join(['1']*65)):
            with self.subTest(value=value[:30]), self.assertRaises(ValueError): prepare(draft(rates=value))

    def test_decode_duplicate_invalid_utf8_bom_and_size(self):
        raw = json.dumps(draft(), ensure_ascii=False).encode()
        self.assertEqual(decode(b'\xef\xbb\xbf'+raw), draft())
        for raw in (b'{"schema_version":1,"schema_version":1}', b'\xff', b' '*65537):
            with self.assertRaises(ValueError): decode(raw)

    def test_discovery_independent_version_and_no_extra_tools(self):
        info = capabilities()
        self.assertEqual(info['audio_acceptance_draft'], descriptor())
        self.assertEqual(len(info['operations']),14)
        schema = info['input_schemas']['audio']
        self.assertFalse(schema['additionalProperties'])
        self.assertEqual(schema['properties']['acceptance_draft']['properties']['schema_version']['const'], 1)

    def test_application_echo_source_and_exact_conditions(self):
        with tempfile.TemporaryDirectory() as folder:
            path = Path(folder)/'own.wav'; raw = wav_bytes(frames=60); path.write_bytes(raw)
            d = draft()
            result = build('audio', {'acceptance_draft': d, 'display_name': 'folder\\own.wav'}, audio_source=path)
            self.assertEqual(result.data['acceptance'], prepare(d)[1])
            self.assertEqual(result.data['acceptance_draft'], d)
            self.assertEqual(json.loads(result.files['audio-acceptance-draft.json']), d)
            self.assertEqual(json.loads(result.files['report.json']), result.data)
            self.assertEqual(result.data['file'], 'own.wav')
            self.assertEqual(path.read_bytes(), raw)
            self.assertEqual(len(build('audio', {}, audio_source=path).files), 2)

    def test_payload_conflicts_and_paths_refuse_before_audio_access(self):
        for key in ('profile', 'rates', 'bits', 'channels', 'input', 'path', 'unknown'):
            with self.assertRaises(ValueError): build('audio', {'acceptance_draft': draft(), key: None}, audio_source='missing.wav')
        with self.assertRaises(ValueError): build('audio', {'acceptance_draft': draft()})
        with self.assertRaises(ValueError): build('audio', {'acceptance_draft': draft(rates='')}, audio_source='missing.wav')

    def test_cli_selected_file_no_overwrite_and_conflicting_options(self):
        with tempfile.TemporaryDirectory() as folder:
            f = Path(folder); audio = f/'own.wav'; audio.write_bytes(wav_bytes())
            config = f/'conditions.json'; config.write_text(json.dumps(draft()), encoding='utf-8')
            args = [sys.executable, '-X', 'utf8', 'music_lab.py', 'audio', '--input', str(audio), '--acceptance-draft', str(config), '--out', str(f/'out')]
            r = subprocess.run(args, cwd=ROOT, capture_output=True, timeout=20)
            self.assertEqual(r.returncode, 2, r.stderr)
            before = (f/'out/report.json').read_bytes()
            r = subprocess.run(args, cwd=ROOT, capture_output=True, timeout=20)
            self.assertEqual(r.returncode, 1)
            self.assertEqual((f/'out/report.json').read_bytes(), before)
            r = subprocess.run(args+['--profile', 'video'], cwd=ROOT, capture_output=True, timeout=20)
            self.assertEqual(r.returncode, 1)

    def test_agent_and_mcp_use_embedded_document_and_launch_selected_media(self):
        with tempfile.TemporaryDirectory() as folder:
            path = Path(folder)/'own.wav'; path.write_bytes(wav_bytes())
            expected = build('audio', {'acceptance_draft': draft()}, audio_source=path).wire()
            requests = [('music_lab_agent.py', {'protocol_version': 1, 'id': 'conditions', 'operation': 'audio', 'payload': {'acceptance_draft': draft()}}),
                        ('music_lab_mcp.py', {'jsonrpc': '2.0', 'id': 1, 'method': 'tools/call', 'params': {'name': 'audio_report', 'arguments': {'payload': {'acceptance_draft': draft()}}}})]
            for script, request in requests:
                messages = [request] if script.endswith('agent.py') else [
                    {'jsonrpc':'2.0','id':0,'method':'initialize','params':{'protocolVersion':'2025-11-25','capabilities':{},'clientInfo':{'name':'qa','version':'1'}}},
                    {'jsonrpc':'2.0','method':'notifications/initialized'}, request]
                p = subprocess.run([sys.executable, '-X', 'utf8', script, '--audio', str(path)], cwd=ROOT,
                                   input=(''.join(json.dumps(m)+'\n' for m in messages)).encode(), capture_output=True, timeout=20)
                self.assertEqual(p.returncode, 0, p.stderr)
                reply = json.loads(p.stdout.splitlines()[-1])
                if script.endswith('agent.py'):
                    self.assertTrue(reply['ok']); actual = reply['result']
                else:
                    self.assertFalse(reply['result'].get('isError', False))
                    actual = json.loads(reply['result']['content'][0]['text'])
                self.assertEqual(actual, expected)

    def test_http_binary_conditions_and_invalid_queries(self):
        server = WorkbenchServer(('127.0.0.1', 0), WorkbenchHandler)
        thread = threading.Thread(target=server.serve_forever); thread.start()
        try:
            for query, status in [({'name': 'own.wav', 'acceptance_draft': json.dumps(draft())}, 200),
                                  ({'name': 'own.wav', 'acceptance_draft': json.dumps({**draft(), 'custom': False, 'fields': {k: '\U0001f3b5'*1024 for k in ('rates','bits','channels')}}, ensure_ascii=False)}, 200),
                                  ({'acceptance_draft': json.dumps(draft(rates='1.00000000000000000001'))}, 400),
                                  ({'acceptance_draft': json.dumps(draft(rates=''))}, 400),
                                  ({'acceptance_draft': json.dumps(draft()), 'profile': 'video'}, 400),
                                  ({'path': 'secret.wav'}, 400)]:
                connection = http.client.HTTPConnection(*server.server_address, timeout=10)
                connection.request('POST', '/api/audio?'+urllib.parse.urlencode(query), wav_bytes(), {'Content-Type': 'application/octet-stream'})
                response = connection.getresponse(); payload = json.loads(response.read()); connection.close()
                self.assertEqual(response.status, status)
                if status == 200:
                    expected = json.loads(query['acceptance_draft'])
                    self.assertEqual(payload['data']['acceptance_draft'], expected)
                    self.assertEqual(payload['data']['acceptance'], prepare(expected)[1])
            connection = http.client.HTTPConnection(*server.server_address, timeout=10)
            connection.request('POST', '/api/audio?profile=video&profile=distribution', wav_bytes())
            response = connection.getresponse(); response.read(); connection.close(); self.assertEqual(response.status, 400)
        finally: server.shutdown(); thread.join(); server.server_close()

    def test_python_javascript_shape_and_numeric_parity(self):
        documents = [draft(rates='1.00000000000000000001'), draft(rates='9007199254740991.1'), draft(), draft(rates=''), draft(rates='1e309'), draft(rates='\u001c48000'), draft(rates='1,1'), draft(rates='９００７１９９２５４７４０９９１')]
        documents.append({**draft(rates=''), 'custom': False})
        program = "const m=require('./web/audio-acceptance.js');let s='';process.stdin.on('data',b=>s+=b);process.stdin.on('end',()=>console.log(JSON.stringify(JSON.parse(s).map(d=>{try{return m.prepare(d)}catch{return null}}))));"
        r = subprocess.run(['node', '-e', program], input=json.dumps(documents).encode(), cwd=ROOT, capture_output=True, timeout=10)
        self.assertEqual(r.returncode, 0, r.stderr)
        expected = []
        for d in documents:
            try:
                profile, acceptance = prepare(d); expected.append({'profile': profile, 'acceptance': acceptance})
            except ValueError: expected.append(None)
        self.assertEqual(json.loads(r.stdout), expected)
