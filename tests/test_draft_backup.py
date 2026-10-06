# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
import copy
import hashlib
import http.client
import io
import json
import os
import struct
import subprocess
import sys
import tempfile
import threading
import unittest
import warnings
import zipfile
from pathlib import Path
from unittest.mock import patch
from http.server import ThreadingHTTPServer
from musiclab.application import build, capabilities, export_library_backup
from musiclab.backup_files import write_backup
from musiclab.backup_downloads import BackupDownloads
from musiclab.draft_backup import export_backup, read_backup, inspect_backup, restore_backup
from musiclab.draft_library import DraftLibrary
from music_lab_server import WorkbenchHandler, WorkbenchServer
from test_draft_library import draft

ROOT = Path(__file__).resolve().parents[1]
IDS = ['draft-'+f'{n:032x}' for n in (1,2,3)]


def contents(folder):
    return {p.relative_to(folder).as_posix():p.read_bytes() for p in folder.rglob('*') if p.is_file()}


def populate(root, count=2):
    library = DraftLibrary(root)
    for i in range(count):
        item=draft();item['panels']['music']['fields']['music-title']=f'備份原創 🎵 {i}'
        library.save(item,f'第 {i+1} 個構思',IDS[i])
    return library


def alter(raw, callback):
    with zipfile.ZipFile(io.BytesIO(raw)) as source:
        files=[(info.filename,source.read(info)) for info in source.infolist()]
    files=callback(files)
    output=io.BytesIO()
    with warnings.catch_warnings():
        warnings.simplefilter('ignore',UserWarning)
        with zipfile.ZipFile(output,'w',zipfile.ZIP_DEFLATED) as archive:
            for name,data in files:archive.writestr(name,data)
    return output.getvalue()


def change_manifest(raw, callback):
    def change(files):
        for i,(name,data) in enumerate(files):
            if name=='manifest.json':
                value=json.loads(data);callback(value);files[i]=(name,json.dumps(value).encode())
        return files
    return alter(raw,change)


def run(args,cwd=ROOT,input=None):
    result=subprocess.run(args,cwd=cwd,input=input,capture_output=True,timeout=20)
    if result.returncode:raise AssertionError(result.stderr.decode('utf-8',errors='replace')[-1000:])
    return result.stdout


class BackupTests(unittest.TestCase):
    def test_http_download_staging_is_bounded_single_use_and_expires_owned_files(self):
        with tempfile.TemporaryDirectory() as folder:
            raw,summary=export_backup(populate(Path(folder)/'source'));cache=BackupDownloads()
            try:
                with patch('musiclab.backup_downloads.time.monotonic',return_value=100):
                    first=cache.prepare(raw,summary);cache.prepare(raw,summary)
                    with self.assertRaises(ValueError):cache.prepare(raw,summary)
                    identifier=first['download_url'].rsplit('/',1)[-1];self.assertEqual(cache.take(identifier),raw)
                    with self.assertRaises(ValueError):cache.take(identifier)
                with patch('musiclab.backup_downloads.time.monotonic',return_value=161):
                    fresh=cache.prepare(raw,summary);self.assertEqual(len(cache.records),1);self.assertEqual(len(cache.paths),1)
                    root=cache.root
                    self.assertEqual(cache.take(fresh['download_url'].rsplit('/',1)[-1]),raw)
                self.assertFalse(root.exists());self.assertIsNone(cache.root)
                self.assertEqual(len(cache.records),0);self.assertEqual(len(cache.paths),0)
            finally:cache.close()
            self.assertFalse(root.exists())

    def test_download_staging_detects_changed_bytes_and_keeps_unowned_files_on_close(self):
        with tempfile.TemporaryDirectory() as folder:
            raw,summary=export_backup(populate(Path(folder)/'source'));cache=BackupDownloads();ready=cache.prepare(raw,summary)
            identifier=ready['download_url'].rsplit('/',1)[-1];path=cache.records[identifier]['path'];path.write_bytes(b'changed')
            stranger=cache.root/'not-our-file.txt';stranger.write_text('preserve',encoding='utf-8')
            try:
                with self.assertRaises(ValueError):cache.take(identifier)
                self.assertFalse(path.exists());cache.close();self.assertEqual(stranger.read_text(encoding='utf-8'),'preserve')
            finally:
                cache.close();stranger.unlink();cache.root.rmdir()

    def test_invalid_deflate_stream_is_a_validation_error_before_restore(self):
        with tempfile.TemporaryDirectory() as folder:
            raw,_=export_backup(populate(Path(folder)/'source'));bad=bytearray(raw)
            name_len,extra_len=struct.unpack_from('<HH',bad,26)
            bad[30+name_len+extra_len]=0x06  # Invalid DEFLATE block type, preserving ZIP directory.
            target=DraftLibrary(Path(folder)/'uncreated')
            with self.assertRaises(ValueError):inspect_backup(target,io.BytesIO(bytes(bad)))
            self.assertFalse(target.root.exists())

    def test_full_backup_restore_keeps_ids_original_timestamps_and_file_bytes(self):
        with tempfile.TemporaryDirectory() as folder:
            source=populate(Path(folder)/'source');before=contents(source.root)
            raw,summary=export_backup(source);target=DraftLibrary(Path(folder)/'restored')
            plan=inspect_backup(target,io.BytesIO(raw))
            self.assertFalse(target.root.exists());self.assertEqual(plan['new_count'],2);self.assertTrue(plan['can_restore'])
            restored=restore_backup(target,io.BytesIO(raw),summary['backup_sha256'])
            self.assertEqual(restored['added_count'],2);self.assertEqual(contents(target.root),before)
            self.assertEqual(source.list()['entries'],target.list()['entries'])
            again=restore_backup(target,io.BytesIO(raw),summary['backup_sha256'])
            self.assertEqual(again['added_count'],0);self.assertEqual(again['reused_count'],2)
            self.assertEqual(contents(source.root),before);self.assertEqual(contents(target.root),before)

    def test_selected_backup_and_empty_backup_are_explicit(self):
        with tempfile.TemporaryDirectory() as folder:
            source=populate(Path(folder)/'source')
            raw,summary=export_backup(source,[IDS[1]])
            self.assertEqual(summary['selection'],'selected');self.assertEqual(read_backup(io.BytesIO(raw))['revisions'][0][0],IDS[1])
            for ids in ([IDS[0],IDS[0]],[],['../outside'],[True]):
                with self.assertRaises(ValueError):export_backup(source,ids)
            empty=DraftLibrary(Path(folder)/'missing');raw,summary=export_backup(empty)
            self.assertEqual(summary['entry_count'],0);self.assertFalse(empty.root.exists())
            self.assertEqual(inspect_backup(empty,io.BytesIO(raw))['entry_count'],0);self.assertFalse(empty.root.exists())

    def test_unknown_backup_versions_never_create_target_or_migrate_source(self):
        with tempfile.TemporaryDirectory() as folder:
            source=populate(Path(folder)/'source');raw,_=export_backup(source);before=contents(source.root)
            for key,versions in [('backup_schema_version',(0,2,True,'1')),('draft_schema_version',(2,4)),('library_schema_version',(2,))]:
                for version in versions:
                    bad=change_manifest(raw,lambda m,k=key,v=version:m.update({k:v}))
                    target=DraftLibrary(Path(folder)/'uncreated')
                    with self.assertRaises(ValueError):restore_backup(target,io.BytesIO(bad),hashlib.sha256(bad).hexdigest())
                    self.assertFalse(target.root.exists())
            self.assertEqual(contents(source.root),before)

    def test_last_bad_entry_rejects_all_before_any_publication(self):
        with tempfile.TemporaryDirectory() as folder:
            raw,_=export_backup(populate(Path(folder)/'source'))
            for filename in (IDS[1]+'/draft.json',IDS[1]+'/record.json'):
                bad=alter(raw,lambda rows:[(n,d+b'\n' if n==filename else d) for n,d in rows])
                target=DraftLibrary(Path(folder)/'uncreated')
                with self.assertRaisesRegex(ValueError,'摘要'):restore_backup(target,io.BytesIO(bad),hashlib.sha256(bad).hexdigest())
                self.assertFalse(target.root.exists())

    def test_backup_changed_after_preview_refuses_even_if_replacement_is_valid(self):
        with tempfile.TemporaryDirectory() as folder:
            raw,summary=export_backup(populate(Path(folder)/'source'))
            changed=change_manifest(raw,lambda m:m.update(created_with='another-version'))
            target=DraftLibrary(Path(folder)/'uncreated')
            with self.assertRaisesRegex(ValueError,'已改變'):restore_backup(target,io.BytesIO(changed),summary['backup_sha256'])
            self.assertFalse(target.root.exists())

    def test_target_conflict_preserves_both_libraries_and_adds_nothing(self):
        with tempfile.TemporaryDirectory() as folder:
            source=populate(Path(folder)/'source');raw,summary=export_backup(source)
            target=DraftLibrary(Path(folder)/'target');target.save(draft(),'不同內容',IDS[1])
            before=contents(target.root);source_before=contents(source.root)
            plan=inspect_backup(target,io.BytesIO(raw));self.assertEqual(plan['conflicts'],[IDS[1]]);self.assertFalse(plan['can_restore'])
            with self.assertRaisesRegex(ValueError,'衝突'):restore_backup(target,io.BytesIO(raw),summary['backup_sha256'])
            self.assertEqual(contents(target.root),before);self.assertEqual(contents(source.root),source_before)

    def test_capacity_checked_for_whole_restore_before_any_new_revision(self):
        with tempfile.TemporaryDirectory() as folder:
            raw,summary=export_backup(populate(Path(folder)/'source'));target=DraftLibrary(Path(folder)/'target')
            target.save(draft(),'已保存',IDS[2]);before=contents(target.root)
            with patch('musiclab.draft_backup.MAX_ENTRIES',2),patch('musiclab.draft_library.MAX_ENTRIES',2):
                self.assertFalse(inspect_backup(target,io.BytesIO(raw))['capacity_ok'])
                with self.assertRaisesRegex(ValueError,'容量'):restore_backup(target,io.BytesIO(raw),summary['backup_sha256'])
            self.assertEqual(contents(target.root),before)

    def test_disk_interruption_leaves_complete_versions_and_same_archive_retry_finishes(self):
        with tempfile.TemporaryDirectory() as folder:
            source=populate(Path(folder)/'source');raw,summary=export_backup(source);target=DraftLibrary(Path(folder)/'target')
            publish=target._publish;calls=[]
            def interrupt(*args):
                calls.append(args[0])
                if len(calls)==2:raise OSError('controlled disk failure')
                return publish(*args)
            with patch.object(target,'_publish',side_effect=interrupt):
                with self.assertRaises(OSError):restore_backup(target,io.BytesIO(raw),summary['backup_sha256'])
            self.assertEqual(len(target.list()['entries']),1)
            result=restore_backup(target,io.BytesIO(raw),summary['backup_sha256'])
            self.assertEqual((result['added_count'],result['reused_count']),(1,1));self.assertEqual(contents(target.root),contents(source.root))

    def test_three_real_processes_restore_same_archive_once(self):
        with tempfile.TemporaryDirectory() as folder:
            source=populate(Path(folder)/'source');raw,summary=export_backup(source);backup=Path(folder)/'selected.zip';backup.write_bytes(raw)
            target=Path(folder)/'target'
            children=[subprocess.Popen([sys.executable,'-X','utf8',str(ROOT/'music_lab.py'),'draft','restore','--library',str(target),
                '--input',str(backup),'--sha256',summary['backup_sha256']],cwd=folder,stdout=subprocess.PIPE,stderr=subprocess.PIPE) for _ in range(3)]
            counts=[]
            for child in children:
                out,err=child.communicate(timeout=20);self.assertEqual(child.returncode,0,err[-500:]);result=json.loads(out)['data'];counts.append((result['added_count'],result['reused_count']))
            self.assertEqual(sorted(counts),[(0,2),(0,2),(2,0)])
            # The lock file coordinates live processes; its initialization bytes are not backed-up revisions.
            self.assertEqual({k:v for k,v in contents(target).items() if k!='.write-lock'},
                             {k:v for k,v in contents(source.root).items() if k!='.write-lock'})

    def test_zip_paths_duplicates_unlisted_files_and_directories_are_rejected(self):
        with tempfile.TemporaryDirectory() as folder:
            raw,_=export_backup(populate(Path(folder)/'source'))
            for name in ('../outside.txt','C:/outside.txt','/absolute.txt','extra.txt','folder/','manifest.json'):
                bad=alter(raw,lambda rows,n=name:[*rows,(n,b'not instructions')])
                target=DraftLibrary(Path(folder)/'uncreated')
                with self.assertRaises(ValueError):inspect_backup(target,io.BytesIO(bad))
                self.assertFalse(target.root.exists())

    def test_symlink_encrypted_and_unknown_compression_rejected_without_extraction(self):
        with tempfile.TemporaryDirectory() as folder:
            raw,_=export_backup(populate(Path(folder)/'source'))
            for kind in ('symlink','encrypted','compression'):
                with zipfile.ZipFile(io.BytesIO(raw)) as original:
                    output=io.BytesIO()
                    with zipfile.ZipFile(output,'w') as archive:
                        for info in original.infolist():
                            content=original.read(info.filename);info=copy.copy(info)
                            if kind=='symlink' and info.filename=='manifest.json':info.external_attr=0o120777<<16
                            if kind=='compression' and info.filename=='manifest.json':info.compress_type=zipfile.ZIP_BZIP2
                            archive.writestr(info,content)
                bad=bytearray(output.getvalue())
                if kind=='encrypted':
                    local=bad.index(b'PK\x03\x04');central=bad.index(b'PK\x01\x02')
                    struct.pack_into('<H',bad,local+6,1);struct.pack_into('<H',bad,central+8,1)
                with self.assertRaises(ValueError):read_backup(io.BytesIO(bytes(bad)))

    def test_central_directory_and_expanded_bounds_refuse_before_restore(self):
        with tempfile.TemporaryDirectory() as folder:
            raw,_=export_backup(populate(Path(folder)/'source'));target=DraftLibrary(Path(folder)/'uncreated')
            with patch('musiclab.draft_backup.MAX_EXPANDED_BYTES',10):
                with self.assertRaises(ValueError):inspect_backup(target,io.BytesIO(raw))
            bad=bytearray(raw);position=bad.rfind(b'PK\x05\x06');struct.pack_into('<H',bad,position+10,3000)
            with self.assertRaises(ValueError):inspect_backup(target,io.BytesIO(bytes(bad)))
            with patch('musiclab.draft_backup.MAX_BACKUP_BYTES',10):
                with self.assertRaises(ValueError):inspect_backup(target,io.BytesIO(raw))
            self.assertFalse(target.root.exists())

    def test_missing_entries_duplicate_json_or_duplicate_ids_never_restore(self):
        with tempfile.TemporaryDirectory() as folder:
            raw,_=export_backup(populate(Path(folder)/'source'))
            cases=[alter(raw,lambda rows:[r for r in rows if r[0]!=IDS[1]+'/draft.json']),
                   change_manifest(raw,lambda m:m['revisions'].append(copy.deepcopy(m['revisions'][0]))),
                   alter(raw,lambda rows:[(n,d[:-1]+b',"backup_schema_version":1}' if n=='manifest.json' else d) for n,d in rows])]
            for bad in cases:
                with self.assertRaises(ValueError):read_backup(io.BytesIO(bad))

    def test_corrupt_source_backup_refuses_and_selected_healthy_version_remains_available(self):
        with tempfile.TemporaryDirectory() as folder:
            source=populate(Path(folder)/'source');p=source.root/IDS[1]/'draft.json';p.write_bytes(p.read_bytes()+b'\n');before=contents(source.root)
            with self.assertRaisesRegex(ValueError,'摘要'):export_backup(source)
            raw,summary=export_backup(source,[IDS[0]]);self.assertEqual(summary['entry_count'],1)
            self.assertEqual(len(read_backup(io.BytesIO(raw))['revisions']),1);self.assertEqual(contents(source.root),before)

    def test_cli_backup_file_is_complete_exclusive_and_does_not_touch_revision_directory(self):
        with tempfile.TemporaryDirectory() as folder:
            source=populate(Path(folder)/'source');raw,_=export_backup(source);target=Path(folder)/'backup.zip'
            write_backup(target,raw,source);self.assertEqual(target.read_bytes(),raw)
            with self.assertRaises(ValueError):write_backup(target,b'different',source)
            with self.assertRaises(ValueError):write_backup(source.root/IDS[0]/'backup.zip',raw,source)
            failed=Path(folder)/'failed.zip'
            with patch('musiclab.backup_files.os.fsync',side_effect=OSError('controlled')):
                with self.assertRaises(OSError):write_backup(failed,raw,source)
            self.assertFalse(failed.exists());self.assertEqual(list(Path(folder).glob('.zoe-backup-*')),[])

    def test_cli_backup_preview_restore_actual_roundtrip_from_other_cwd(self):
        with tempfile.TemporaryDirectory() as folder:
            source=populate(Path(folder)/'source');before=contents(source.root);backup=Path(folder)/'portable.zip';target=Path(folder)/'new'
            prefix=[sys.executable,'-X','utf8',str(ROOT/'music_lab.py'),'draft']
            summary=json.loads(run([*prefix,'backup','--library',str(source.root),'--out',str(backup)],folder))
            plan=json.loads(run([*prefix,'inspect','--library',str(target),'--input',str(backup)],folder))['data']
            self.assertEqual(plan['backup_sha256'],summary['backup_sha256']);self.assertFalse(target.exists())
            restored=json.loads(run([*prefix,'restore','--library',str(target),'--input',str(backup),'--sha256',plan['backup_sha256']],folder))
            self.assertEqual(restored['data']['added_count'],2);self.assertEqual(contents(target),before);self.assertEqual(contents(source.root),before)

    def test_actual_jsonlines_preview_restore_and_payload_path_refusal(self):
        with tempfile.TemporaryDirectory() as folder:
            source=populate(Path(folder)/'source');raw,summary=export_backup(source);backup=Path(folder)/'selected.zip';backup.write_bytes(raw);target=Path(folder)/'new'
            operations=[('draft_backup_inspect',{}),('draft_backup_restore',{'backup_sha256':summary['backup_sha256']}),('draft_backup_restore',{'backup_sha256':summary['backup_sha256'],'path':'../outside'})]
            requests=''.join(json.dumps({'protocol_version':1,'id':str(i),'operation':op,'payload':payload})+'\n' for i,(op,payload) in enumerate(operations)).encode()
            out=run([sys.executable,'-X','utf8',str(ROOT/'music_lab_agent.py'),'--draft-library',str(target),'--draft-backup',str(backup)],folder,requests)
            replies=[json.loads(line) for line in out.splitlines()]
            self.assertTrue(replies[0]['ok']);self.assertTrue(replies[1]['ok']);self.assertFalse(replies[2]['ok']);self.assertEqual(contents(target),contents(source.root))
            self.assertTrue(capabilities(DraftLibrary(target),backup)['draft_backup']['source_selected'])

    def test_actual_mcp_generated_launch_preview_restore_and_annotations(self):
        with tempfile.TemporaryDirectory() as folder:
            source=populate(Path(folder)/'source');raw,summary=export_backup(source);backup=Path(folder)/'selected.zip';backup.write_bytes(raw);target=Path(folder)/'new'
            config=json.loads(run([sys.executable,'-X','utf8',str(ROOT/'scripts/agent_launch.py'),'--draft-library',str(target),'--draft-backup',str(backup)],folder))
            requests=[{'jsonrpc':'2.0','id':1,'method':'initialize','params':{'protocolVersion':'2025-11-25','capabilities':{},'clientInfo':{'name':'backup-qa','version':'1'}}},
                {'jsonrpc':'2.0','method':'notifications/initialized'},{'jsonrpc':'2.0','id':2,'method':'tools/list'},
                *[{'jsonrpc':'2.0','id':i+3,'method':'tools/call','params':{'name':op,'arguments':{'payload':payload}}} for i,(op,payload) in enumerate([
                    ('draft_backup_inspect',{}),('draft_backup_restore',{'backup_sha256':summary['backup_sha256']})])]]
            replies=[json.loads(line) for line in run([config['command'],*config['args']],folder,('\n'.join(json.dumps(r) for r in requests)+'\n').encode()).splitlines()]
            tools={t['name']:t for t in replies[1]['result']['tools']};self.assertEqual(len(tools),24)
            self.assertTrue(tools['draft_backup_inspect']['annotations']['readOnlyHint']);self.assertFalse(tools['draft_backup_restore']['annotations']['readOnlyHint'])
            self.assertFalse(replies[-1]['result']['isError']);self.assertEqual(contents(target),contents(source.root))

    def test_http_real_zip_download_preview_restore_origin_and_disabled_boundaries(self):
        with tempfile.TemporaryDirectory() as folder:
            source=populate(Path(folder)/'source');raw,summary=export_backup(source);target=DraftLibrary(Path(folder)/'new')
            with WorkbenchServer(('127.0.0.1',0),WorkbenchHandler) as server:
                server.draft_library=target;thread=threading.Thread(target=server.serve_forever,daemon=True);thread.start()
                def request(method,path,body=None,headers=None):
                    connection=http.client.HTTPConnection('127.0.0.1',server.server_port);connection.request(method,path,body,headers or {})
                    response=connection.getresponse();data=response.read();result=(response.status,dict(response.getheaders()),data);connection.close();return result
                try:
                    # The early 403 must precede body validation; no unread ZIP.
                    self.assertEqual(request('POST','/api/drafts/backup/inspect',None,{'Origin':'https://outside.invalid'})[0],403)
                    self.assertFalse(target.root.exists())
                    damaged=bytearray(raw);name_len,extra_len=struct.unpack_from('<HH',damaged,26);damaged[30+name_len+extra_len]=0x06
                    self.assertEqual(request('POST','/api/drafts/backup/inspect',bytes(damaged))[0],400)
                    self.assertFalse(target.root.exists())
                    status,_,body=request('POST','/api/drafts/backup/inspect',raw);self.assertEqual(status,200);plan=json.loads(body)['data']
                    self.assertFalse(target.root.exists());self.assertEqual(plan['new_count'],2)
                    self.assertEqual(request('POST','/api/drafts/backup/restore?sha256='+('0'*64),raw)[0],400);self.assertFalse(target.root.exists())
                    status,_,body=request('POST','/api/drafts/backup/restore?sha256='+summary['backup_sha256'],raw);self.assertEqual(status,200);self.assertEqual(json.loads(body)['data']['added_count'],2)
                    status,headers,download=request('GET','/api/drafts/backup');self.assertEqual(status,200);self.assertIn('attachment',headers['Content-Disposition']);self.assertEqual(len(read_backup(io.BytesIO(download))['revisions']),2)
                    status,_,body=request('POST','/api/drafts/backup/prepare',b'{}');self.assertEqual(status,200);ready=json.loads(body)
                    status,headers,download=request('GET',ready['download_url']);self.assertEqual(status,200);self.assertIn('attachment',headers['Content-Disposition'])
                    self.assertEqual(hashlib.sha256(download).hexdigest(),ready['backup_sha256']);self.assertEqual(request('GET',ready['download_url'])[0],400)
                    self.assertEqual(len(server.backup_downloads.paths),0)
                    server.draft_library=None;self.assertEqual(request('GET','/api/drafts/backup')[0],400);self.assertEqual(request('POST','/api/drafts/backup/inspect',raw)[0],400)
                finally:server.shutdown();thread.join(timeout=5)


if __name__=='__main__':unittest.main()
