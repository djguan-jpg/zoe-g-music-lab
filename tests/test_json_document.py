# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
import json
from pathlib import Path
import subprocess
import sys
import tempfile
import threading
import unittest
import urllib.error
import urllib.request
from musiclab.json_document import decode_json
from musiclab.common import read_json
from musiclab.application import capabilities, load_request
from musiclab.library_contract import strict_json
from musiclab.lyrics_package import decode_document
from music_lab_server import WorkbenchHandler, WorkbenchServer

ROOT = Path(__file__).resolve().parents[1]


class JsonDocumentTests(unittest.TestCase):
    def test_preserves_unicode_numbers_strings_and_literal_key_text(self):
        data = {'title': '原創🎵', 'line': 'literal "schema_version":999\r\n', 'a': [None, True, 2.5]}
        self.assertEqual(decode_json(json.dumps(data, ensure_ascii=False)), data)

    def test_rejects_duplicate_keys_at_all_depths_including_escaped_aliases(self):
        for raw in ['{"a":1,"a":2}', '{"payload":{"version":999,"version":1}}',
                    '{"v":0,"\\u0076":1}', '{"__proto__":{},"__proto__":{}}']:
            with self.subTest(raw=raw), self.assertRaisesRegex(ValueError, '重複'):
                decode_json(raw)

    def test_nonfinite_literals_and_exponents_refuse_before_domain(self):
        for raw in ['NaN', 'Infinity', '-Infinity', '1e999', '-1e999', '{"a":[1e999]}']:
            with self.subTest(raw=raw), self.assertRaises(ValueError):
                decode_json(raw)

    def test_malformed_json_and_non_scalar_unicode_refuse(self):
        for raw in ['{"a":1,}', '{} {}', '[]x', '{"a":"\\ud800"}', '{"\\udfff":1}', '"\ud800"']:
            with self.subTest(raw=repr(raw)), self.assertRaises(ValueError):
                decode_json(raw)
        self.assertEqual(decode_json('"\\ud83c\\udfb5"'), '🎵')

    def test_utf8_bom_is_explicit_single_and_byte_limit_includes_it(self):
        self.assertEqual(decode_json(b'\xef\xbb\xbf{}', allow_bom=True, max_bytes=5), {})
        for raw, options in [(b'\xef\xbb\xbf{}', {}), (b'\xef\xbb\xbf\xef\xbb\xbf{}', {'allow_bom': True}),
                             (b'\xff{}', {}), (b'\xef\xbb\xbf{}', {'allow_bom': True, 'max_bytes': 4})]:
            with self.subTest(raw=raw), self.assertRaises(ValueError):
                decode_json(raw, **options)

    def test_depth_bound_and_size_bound(self):
        decode_json('[' * 64 + '0' + ']' * 64)
        with self.assertRaisesRegex(ValueError, '過深'):
            decode_json('[' * 65 + '0' + ']' * 65)
        with self.assertRaisesRegex(ValueError, '上限'):
            decode_json('"原創"', max_bytes=3)

    def test_external_reader_caps_without_modifying_original(self):
        with tempfile.TemporaryDirectory() as folder:
            p = Path(folder) / 'source.json'; original = b'\xef\xbb\xbf{"title":"ok"}'
            p.write_bytes(original); self.assertEqual(read_json(p), {'title': 'ok'})
            self.assertEqual(p.read_bytes(), original)
            p.write_bytes(b'{"v":999,"v":1}')
            with self.assertRaisesRegex(ValueError, '重複'):
                read_json(p)
            p.write_bytes(b' ' * (2 * 1024 * 1024 + 1))
            with self.assertRaisesRegex(ValueError, '上限'):
                read_json(p)

    def test_request_library_and_lyrics_wrappers_share_decoder(self):
        self.assertEqual(capabilities()['json_document'], {'encoding': 'UTF-8', 'max_depth': 64,
                          'duplicate_keys': 'reject', 'nonfinite_numbers': 'reject'})
        for decoder in [load_request, strict_json, decode_document]:
            for raw in ['{"version":999,"version":1}', '{"x":1e999}', '{"x":"\\ud800"}']:
                with self.subTest(decoder=decoder.__name__), self.assertRaises(ValueError):
                    decoder(raw.encode() if decoder is strict_json else raw)

    def test_cli_duplicate_brief_fails_then_good_bom_succeeds_without_overwrite(self):
        brief = json.loads((ROOT / 'examples/first-light-music.json').read_text(encoding='utf-8'))
        raw = json.dumps(brief, ensure_ascii=False).encode()
        with tempfile.TemporaryDirectory() as folder:
            source = Path(folder) / 'brief.json'; out = Path(folder) / 'out'
            source.write_bytes(b'{"title":"discarded",' + raw[1:])
            args = [sys.executable, '-X', 'utf8', str(ROOT / 'music_lab.py'), 'music', '--brief', str(source), '--out', str(out)]
            bad = subprocess.run(args, cwd=folder, capture_output=True, timeout=20)
            self.assertNotEqual(bad.returncode, 0); self.assertFalse(out.exists())
            source.write_bytes(b'\xef\xbb\xbf' + raw)
            good = subprocess.run(args, cwd=folder, capture_output=True, timeout=20)
            self.assertEqual(good.returncode, 0, good.stderr[-300:])
            self.assertEqual(source.read_bytes(), b'\xef\xbb\xbf' + raw)
            self.assertNotEqual(subprocess.run(args, cwd=folder, capture_output=True, timeout=20).returncode, 0)

    def test_real_json_lines_bad_then_good_keeps_stream_usable(self):
        payload = {'title': '原創', 'text': '同一份文字'}
        good = json.dumps({'protocol_version': 1, 'id': 'good', 'operation': 'lyrics_seed', 'payload': payload}, ensure_ascii=False)
        bad = '{"protocol_version":999,' + good[1:]
        p = subprocess.run([sys.executable, '-X', 'utf8', str(ROOT / 'music_lab_agent.py')],
                           input=(bad + '\n' + good + '\n').encode(), capture_output=True, timeout=20)
        self.assertEqual(p.returncode, 0)
        replies = [json.loads(line) for line in p.stdout.decode().splitlines()]
        self.assertEqual(replies[0]['error']['code'], 'invalid_request')
        self.assertTrue(replies[1]['ok']); self.assertEqual(replies[1]['result']['data']['title'], '原創')

    def test_real_mcp_bad_envelope_then_handshake_and_call(self):
        messages = [b'{"jsonrpc":"2.0","id":1,"method":"initialize","params":{},"method":"tools/list"}',
                    json.dumps({'jsonrpc': '2.0', 'id': 2, 'method': 'initialize', 'params': {'protocolVersion': '2025-11-25', 'capabilities': {}, 'clientInfo': {'name': 'synthetic', 'version': '1'}}}).encode(),
                    b'{"jsonrpc":"2.0","method":"notifications/initialized"}',
                    b'{"jsonrpc":"2.0","id":3,"method":"tools/list"}',
                    b'{"jsonrpc":"2.0","id":4,"method":"tools/call","params":{"name":"lyrics_seed","arguments":{"payload":{"title":"Synthetic","text":"one"}}}}']
        p = subprocess.run([sys.executable, '-X', 'utf8', str(ROOT / 'music_lab_mcp.py')], input=b'\n'.join(messages) + b'\n', capture_output=True, timeout=20)
        self.assertEqual(p.returncode, 0)
        replies = [json.loads(line) for line in p.stdout.decode().splitlines()]
        self.assertEqual(replies[0]['error']['code'], -32700)
        self.assertEqual(len(replies[2]['result']['tools']),16)
        self.assertFalse(replies[3]['result']['isError'])

    def test_real_http_rejects_duplicate_and_invalid_utf8_then_valid_request(self):
        with WorkbenchServer(('127.0.0.1', 0), WorkbenchHandler) as server:
            server.draft_library = None
            thread = threading.Thread(target=server.serve_forever); thread.start()
            url = f'http://127.0.0.1:{server.server_port}'
            try:
                for raw in [b'{"title":"first","title":"second","text":"one"}', b'{"title":"\xff","text":"one"}', b'{"x":1e999}']:
                    with self.assertRaises(urllib.error.HTTPError) as error:
                        urllib.request.urlopen(urllib.request.Request(url + '/api/lyrics-seed', data=raw, headers={'Content-Type': 'application/json'}))
                    self.assertEqual(error.exception.code, 400)
                raw = json.dumps({'title': '原創', 'text': '一句'}, ensure_ascii=False).encode()
                result = json.load(urllib.request.urlopen(urllib.request.Request(url + '/api/lyrics-seed', data=raw)))
                self.assertEqual(result['data']['title'], '原創')
                self.assertIn(b'MusicJsonDocument', urllib.request.urlopen(url + '/json-document.js').read())
            finally:
                server.shutdown(); thread.join(5)
