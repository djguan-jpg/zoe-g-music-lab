# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
"""Real immutable backups through shared browser byte verification and adapters."""
import base64
import hashlib
import io
import json
import subprocess
import sys
import tempfile
import threading
import unittest
from pathlib import Path
from unittest.mock import Mock
from music_lab_server import WorkbenchServer, WorkbenchHandler
from musiclab.backup_downloads import BackupDownloads
from musiclab.draft_backup import export_backup, read_backup
from musiclab.draft_library import DraftLibrary
from test_draft_backup import ROOT, IDS, populate, contents, run


def node(code, data):
    result = subprocess.run(['node', '-e', code], input=json.dumps(data), cwd=ROOT,
                            capture_output=True, text=True, encoding='utf-8', timeout=15)
    if result.returncode:
        raise AssertionError((result.stdout + result.stderr)[-2000:])
    return json.loads(result.stdout)


class BackupDownloadTests(unittest.TestCase):
    def test_disconnected_header_or_body_closes_response_without_a_second_write(self):
        for error in [BrokenPipeError, ConnectionResetError, ConnectionAbortedError]:
            for boundary in ['headers', 'body']:
                handler = object.__new__(WorkbenchHandler)
                handler.send_response = Mock(); handler.send_header = Mock()
                handler.end_headers = Mock(side_effect=error() if boundary == 'headers' else None)
                handler.wfile = Mock()
                handler.wfile.write.side_effect = error() if boundary == 'body' else None
                handler.close_connection = False
                handler.reply(200, '{}')
                self.assertTrue(handler.close_connection)
                handler.send_response.assert_called_once_with(200)
                self.assertEqual(handler.wfile.write.call_count, 0 if boundary == 'headers' else 1)
        handler.end_headers.side_effect = OSError('disk or unrelated I/O')
        with self.assertRaises(OSError):
            handler.reply(200, '{}')

    def test_actual_all_selected_empty_zip_bytes_and_descriptor_are_checked_before_handoff(self):
        with tempfile.TemporaryDirectory() as folder:
            source = populate(Path(folder)/'source'); before = contents(source.root)
            cache = BackupDownloads(); cases = []
            try:
                for library, ids in [(source, None), (source, [IDS[1]]),
                                     (DraftLibrary(Path(folder)/'missing'), None)]:
                    raw, summary = export_backup(library, ids)
                    descriptor = cache.prepare(raw, summary)
                    self.assertEqual(cache.take(descriptor['download_url'].rsplit('/', 1)[-1]), raw)
                    self.assertEqual(len(read_backup(io.BytesIO(raw))['revisions']), descriptor['entry_count'])
                    cases.append({'descriptor': descriptor, 'base64': base64.b64encode(raw).decode()})
                result = node(r'''
const fs=require('node:fs'),assert=require('node:assert/strict'),M=require('./web/backup-download.js'),F=require('./web/backup-file.js'),D=require('./web/backup-download-dom.js');
(async()=>{const rows=JSON.parse(fs.readFileSync(0,'utf8'));for(const row of rows){
 const d=M.checked(row.descriptor,{selection:row.descriptor.selection}),b=Buffer.from(row.base64,'base64');
 const raw=await D.readArchive(d,{fetch:async()=>new Response(b,{headers:{'Content-Length':String(b.length),'Content-Type':'application/octet-stream'}})});
 const prepared=M.checkedArchive(raw,d,await F.sha256(raw));assert.equal(prepared.name,'zoe-music-lab-backup.zip');assert.deepEqual(Buffer.from(prepared.bytes),b);
 const bad=raw.slice(0);new Uint8Array(bad)[0]^=1;
 assert.throws(()=>M.checked({...d,bytes:d.bytes-1,extra:true},{selection:d.selection}));
 const hash=await F.sha256(bad);assert.throws(()=>M.checkedArchive(bad,d,hash));
}console.log(JSON.stringify({cases:rows.length,counts:rows.map(r=>r.descriptor.entry_count)}));})().catch(e=>{console.error(e);process.exitCode=1;});
''', cases)
                self.assertEqual(result, {'cases': 3, 'counts': [2, 1, 0]})
                self.assertEqual(contents(source.root), before)
                self.assertFalse((Path(folder)/'missing').exists())
            finally:
                cache.close()
            self.assertEqual(cache.paths, set()); self.assertIsNone(cache.root)

    def test_actual_loopback_single_use_stream_and_fixed_assets_use_the_same_contract(self):
        with tempfile.TemporaryDirectory() as folder:
            source = populate(Path(folder)/'source'); before = contents(source.root)
            with WorkbenchServer(('127.0.0.1', 0), WorkbenchHandler) as server:
                server.draft_library = source
                thread = threading.Thread(target=server.serve_forever, daemon=True); thread.start()
                try:
                    result = node(r'''
const fs=require('node:fs'),assert=require('node:assert/strict'),M=require('./web/backup-download.js'),F=require('./web/backup-file.js'),D=require('./web/backup-download-dom.js');
(async()=>{const base=JSON.parse(fs.readFileSync(0,'utf8')).base;
 const response=await fetch(base+'/api/drafts/backup/prepare',{method:'POST',body:'{}'});assert.equal(response.status,200);const d=M.checked(await response.json());
 const raw=await D.readArchive(d,{fetch:(url,options)=>fetch(base+url,options)});M.checkedArchive(raw,d,await F.sha256(raw));
 assert.equal((await fetch(base+d.download_url)).status,400);
 const html=await (await fetch(base+'/')).text();assert.ok(html.indexOf('/text-download-dom.js')<html.indexOf('/backup-download-dom.js'));assert.ok(html.indexOf('/backup-download-dom.js')<html.indexOf('/app.js'));assert.ok(html.includes('id="backup-download-cancel"'));
 for(const path of ['/backup-download.js','/backup-download-dom.js']){const r=await fetch(base+path);assert.equal(r.status,200);assert.equal(await r.text(),fs.readFileSync('./web'+path,'utf8'));}
 console.log(JSON.stringify({bytes:raw.byteLength,sha256:d.backup_sha256,count:d.entry_count,base64:Buffer.from(raw).toString('base64')}));})().catch(e=>{console.error(e);process.exitCode=1;});
''', {'base': f'http://127.0.0.1:{server.server_port}'})
                    raw = base64.b64decode(result.pop('base64'))
                    self.assertEqual(result, {'bytes': len(raw), 'sha256': hashlib.sha256(raw).hexdigest(), 'count': 2})
                    snapshot = read_backup(io.BytesIO(raw))
                    self.assertEqual(len(snapshot['revisions']), 2)
                    self.assertEqual(server.backup_downloads.paths, set())
                    self.assertEqual(contents(source.root), before)
                finally:
                    server.shutdown(); thread.join(timeout=5)
                    self.assertFalse(thread.is_alive())

    def test_actual_cli_backup_remains_agent_inspectable_with_full_browser_hash(self):
        with tempfile.TemporaryDirectory() as folder:
            source = populate(Path(folder)/'source'); before = contents(source.root)
            target = Path(folder)/'portable.zip'
            summary = json.loads(run([sys.executable, '-X', 'utf8', str(ROOT/'music_lab.py'),
                                     'draft', 'backup', '--library', str(source.root), '--out', str(target)], folder))
            request = (json.dumps({'protocol_version': 1, 'id': 'inspect',
                                  'operation': 'draft_backup_inspect', 'payload': {}})+'\n').encode()
            reply = json.loads(run([sys.executable, '-X', 'utf8', str(ROOT/'music_lab_agent.py'),
                                    '--draft-library', str(Path(folder)/'uncreated'),
                                    '--draft-backup', str(target)], folder, request))
            self.assertTrue(reply['ok']); self.assertEqual(reply['result']['data']['backup_sha256'], summary['backup_sha256'])
            cache = BackupDownloads()
            try:
                raw = target.read_bytes(); descriptor = cache.prepare(raw, summary)
                result = node(r'''
const fs=require('node:fs'),M=require('./web/backup-download.js'),F=require('./web/backup-file.js');
(async()=>{const x=JSON.parse(fs.readFileSync(0,'utf8')),b=Buffer.from(x.base64,'base64'),raw=b.buffer.slice(b.byteOffset,b.byteOffset+b.byteLength),d=M.checked(x.descriptor);M.checkedArchive(raw,d,await F.sha256(raw));console.log(JSON.stringify({count:d.entry_count,bytes:d.bytes}));})().catch(e=>{console.error(e);process.exitCode=1;});
''', {'descriptor': descriptor, 'base64': base64.b64encode(raw).decode()})
                self.assertEqual(result, {'count': 2, 'bytes': len(raw)})
            finally:
                cache.close()
            self.assertEqual(contents(source.root), before)
            self.assertFalse((Path(folder)/'uncreated').exists())


if __name__ == '__main__':
    unittest.main()
