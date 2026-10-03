# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
"""Portable, bounded backups. Validate all entries before immutable restoration."""
import hashlib
import io
import re
import struct
import zipfile
import zlib
from datetime import datetime, timezone
from pathlib import Path
from . import __version__
from .common import json_text
from .draft_contract import MAX_DRAFT_BYTES
from .library_contract import (ID_PATTERN, LIBRARY_SCHEMA_VERSION, MAX_ENTRIES,
                               MAX_METADATA_BYTES, strict_json, validate_revision)

BACKUP_FORMAT = 'zoe-music-lab-backup'
BACKUP_SCHEMA_VERSION = 1
MAX_BACKUP_BYTES = 32 * 1024 * 1024
MAX_EXPANDED_BYTES = 64 * 1024 * 1024
MAX_MANIFEST_BYTES = 512 * 1024


def digest(raw):
    return hashlib.sha256(raw).hexdigest()


def export_backup(library, identifiers=None):
    if identifiers is None:
        identifiers = sorted(library.directories()); selection = 'all'
    else:
        if (not isinstance(identifiers, list) or not 1 <= len(identifiers) <= MAX_ENTRIES or
                any(not isinstance(v, str) or not re.fullmatch(ID_PATTERN, v) for v in identifiers) or
                len(set(identifiers)) != len(identifiers)):
            raise ValueError('備份選擇需為不重複的保存版本 ID 清單')
        identifiers = sorted(identifiers); selection = 'selected'
    revisions, contents, expanded = [], [], 0
    for identifier in identifiers:
        record_raw, draft_raw, _, _ = library.revision_bytes(identifier)
        expanded += len(record_raw) + len(draft_raw)
        if expanded > MAX_EXPANDED_BYTES:
            raise ValueError('備份展開上限為 64 MiB；請明確分批選擇版本，原資料保留')
        revisions.append({'id': identifier, 'draft_sha256': digest(draft_raw), 'draft_bytes': len(draft_raw),
                          'record_sha256': digest(record_raw), 'record_bytes': len(record_raw)})
        contents.extend([(identifier+'/record.json', record_raw), (identifier+'/draft.json', draft_raw)])
    manifest = {'format': BACKUP_FORMAT, 'backup_schema_version': BACKUP_SCHEMA_VERSION,
                'library_schema_version': LIBRARY_SCHEMA_VERSION, 'draft_schema_version': 3,
                'created_at': datetime.now(timezone.utc).isoformat(), 'created_with': __version__,
                'selection': selection, 'revisions': revisions}
    manifest_raw = json_text(manifest).encode('utf-8')
    if len(manifest_raw) > MAX_MANIFEST_BYTES or expanded + len(manifest_raw) > MAX_EXPANDED_BYTES:
        raise ValueError('備份超過容量，請明確分批選擇版本；原資料保留')
    output = io.BytesIO()
    with zipfile.ZipFile(output, 'w', compression=zipfile.ZIP_DEFLATED, allowZip64=False) as archive:
        for name, raw in [('manifest.json', manifest_raw), *contents]:
            info = zipfile.ZipInfo(name); info.compress_type = zipfile.ZIP_DEFLATED
            info.external_attr = 0o100600 << 16
            archive.writestr(info, raw)
            if output.tell() > MAX_BACKUP_BYTES:
                raise ValueError('ZIP 上限為 32 MiB；請明確分批選擇版本，原資料保留')
    raw = output.getvalue()
    if len(raw) > MAX_BACKUP_BYTES:
        raise ValueError('ZIP 上限為 32 MiB；請明確分批選擇版本，原資料保留')
    return raw, {'backup_schema_version': BACKUP_SCHEMA_VERSION, 'backup_sha256': digest(raw),
                 'bytes': len(raw), 'entry_count': len(revisions), 'selection': selection}


def _source_bytes(source):
    if source is None:
        raise ValueError('備份來源未選定；請在啟動時指定 --draft-backup 或選取本機 ZIP')
    if hasattr(source, 'read'):
        source.seek(0); raw = source.read(MAX_BACKUP_BYTES + 1)
    else:
        with Path(source).open('rb') as handle:
            raw = handle.read(MAX_BACKUP_BYTES + 1)
    if not isinstance(raw, bytes) or not 0 < len(raw) <= MAX_BACKUP_BYTES:
        raise ValueError('備份 ZIP 需介於 1 byte 與 32 MiB')
    return raw


def _check_directory(raw):
    # Bound central-directory allocations before ZipFile parses untrusted filenames.
    position = raw.rfind(b'PK\x05\x06', max(0, len(raw)-65557))
    if position < 0 or len(raw)-position < 22:
        raise ValueError('不是完整的備份 ZIP')
    _, disk, directory_disk, disk_count, count, size, offset, comment = struct.unpack_from('<4s4H2LH', raw, position)
    if (disk or directory_disk or disk_count != count or not 1 <= count <= 2*MAX_ENTRIES+1 or
            size > 1024*1024 or offset+size != position or position+22+comment != len(raw) or
            not raw.startswith(b'PK\x03\x04')):
        raise ValueError('備份 ZIP 目錄不支援或超過容量；不解壓內容')
    return count


def read_backup(source):
    raw = _source_bytes(source); count = _check_directory(raw)
    try:
        with zipfile.ZipFile(io.BytesIO(raw)) as archive:
            infos = archive.infolist(); names = [i.filename for i in infos]
            if len(infos) != count or len(set(names)) != len(names) or 'manifest.json' not in names:
                raise ValueError('備份 ZIP 含重複或缺少的檔案')
            expanded = 0
            for info in infos:
                mode = (info.external_attr >> 16) & 0o170000
                if (info.is_dir() or info.flag_bits & 1 or mode not in (0, 0o100000) or
                        info.compress_type not in (zipfile.ZIP_STORED, zipfile.ZIP_DEFLATED)):
                    raise ValueError('備份不接受連結、目錄、加密或未知壓縮格式')
                allowed = info.filename == 'manifest.json' or re.fullmatch(ID_PATTERN+r'/(draft|record)\.json', info.filename)
                maximum = MAX_MANIFEST_BYTES if info.filename == 'manifest.json' else (
                    MAX_METADATA_BYTES if info.filename.endswith('/record.json') else MAX_DRAFT_BYTES)
                expanded += info.file_size
                if not allowed or not 0 < info.file_size <= maximum or expanded > MAX_EXPANDED_BYTES:
                    raise ValueError('備份檔名或展開容量不支援；不解壓內容')
            manifest = strict_json(archive.read('manifest.json'))
            keys = {'format', 'backup_schema_version', 'library_schema_version', 'draft_schema_version',
                    'created_at', 'created_with', 'selection', 'revisions'}
            if (not isinstance(manifest, dict) or set(manifest) != keys or manifest['format'] != BACKUP_FORMAT or
                    any(type(manifest[k]) is not int or manifest[k] != v for k,v in
                        [('backup_schema_version', BACKUP_SCHEMA_VERSION), ('library_schema_version', LIBRARY_SCHEMA_VERSION), ('draft_schema_version', 3)]) or
                    not isinstance(manifest['created_at'], str) or not isinstance(manifest['created_with'], str) or
                    len(manifest['created_with']) > 64 or manifest['selection'] not in ('all','selected') or
                    not isinstance(manifest['revisions'], list) or len(manifest['revisions']) > MAX_ENTRIES):
                raise ValueError('備份版本或資料格式不支援；不遷移、不恢復')
            when = datetime.fromisoformat(manifest['created_at'])
            if when.utcoffset() != timezone.utc.utcoffset(when):
                raise ValueError('備份時間格式錯誤')
            expected, seen, revisions = {'manifest.json'}, set(), []
            for entry in manifest['revisions']:
                if (not isinstance(entry, dict) or set(entry) != {'id','draft_sha256','draft_bytes','record_sha256','record_bytes'} or
                        not isinstance(entry['id'], str) or not re.fullmatch(ID_PATTERN, entry['id']) or entry['id'] in seen or
                        any(not isinstance(entry[k], str) or not re.fullmatch(r'[0-9a-f]{64}', entry[k]) for k in ('draft_sha256','record_sha256')) or
                        any(type(entry[k]) is not int or not 0 < entry[k] <= maximum for k,maximum in
                            [('draft_bytes',MAX_DRAFT_BYTES),('record_bytes',MAX_METADATA_BYTES)])):
                    raise ValueError('備份版本索引錯誤')
                identifier = entry['id']; seen.add(identifier)
                record_name, draft_name = identifier+'/record.json', identifier+'/draft.json'
                expected.update((record_name,draft_name))
                record_raw, draft_raw = archive.read(record_name), archive.read(draft_name)
                if (len(record_raw) != entry['record_bytes'] or len(draft_raw) != entry['draft_bytes'] or
                        digest(record_raw) != entry['record_sha256'] or digest(draft_raw) != entry['draft_sha256']):
                    raise ValueError('備份摘要或位元組數不一致；不恢復任何版本')
                record, _ = validate_revision(identifier, record_raw, draft_raw)
                revisions.append((identifier, record_raw, draft_raw, record))
            if set(names) != expected:
                raise ValueError('備份包含索引以外的檔案；不解壓內容')
    except (zipfile.BadZipFile, zlib.error, EOFError, KeyError, RuntimeError, NotImplementedError, struct.error) as error:
        raise ValueError('備份 ZIP 不完整或無法讀取；不恢復任何版本') from error
    return {'sha256':digest(raw), 'bytes':len(raw), 'manifest':manifest, 'revisions':revisions}


def restore_plan(library, snapshot):
    new, reused, conflicts = [], [], []
    for identifier, record_raw, draft_raw, record in snapshot['revisions']:
        if not library.directory(identifier).exists():
            new.append(identifier)
        else:
            try:
                existing_record, existing_draft, _, _ = library.revision_bytes(identifier)
                if existing_record != record_raw or existing_draft != draft_raw:
                    conflicts.append(identifier)
                else:
                    reused.append(identifier)
            except (ValueError, OSError, UnicodeError, RecursionError):
                conflicts.append(identifier)
    capacity_ok = len(library.directories()) + len(new) <= MAX_ENTRIES
    return {'backup_sha256':snapshot['sha256'], 'backup_schema_version':BACKUP_SCHEMA_VERSION,
            'bytes':snapshot['bytes'], 'entry_count':len(snapshot['revisions']), 'selection':snapshot['manifest']['selection'],
            'new_count':len(new), 'reused_count':len(reused), 'conflicts':conflicts, 'capacity_ok':capacity_ok,
            'can_restore':not conflicts and capacity_ok, 'new_ids':new,
            'entries':[{'id':r[0],'label':r[3]['label'],'stored_at':r[3]['stored_at']} for r in snapshot['revisions']],
            'status':'backup_validated_not_restored'}


def inspect_backup(library, source):
    return restore_plan(library, read_backup(source))


def restore_backup(library, source, expected_sha256):
    if not isinstance(expected_sha256,str) or not re.fullmatch(r'[0-9a-f]{64}',expected_sha256):
        raise ValueError('恢復需使用預覽確認的備份 SHA-256')
    snapshot = read_backup(source)
    if snapshot['sha256'] != expected_sha256:
        raise ValueError('選定備份已改變；請重新預覽，不恢復')
    plan = restore_plan(library, snapshot)
    if not plan['can_restore']:
        raise ValueError('備份與現有 ID 衝突或超過容量；現有版本保留，不恢復')
    with library.lock, library.write_lock():
        plan = restore_plan(library, snapshot)
        if not plan['can_restore']:
            raise ValueError('草稿庫在預覽後已改變，請重新預覽；不覆寫現有版本')
        new = set(plan['new_ids'])
        for identifier, record_raw, draft_raw, _ in snapshot['revisions']:
            if identifier in new:
                library._publish(identifier, record_raw, draft_raw)
    return {'backup_sha256':snapshot['sha256'], 'added_count':len(new), 'reused_count':plan['reused_count'],
            'entry_count':plan['entry_count'], 'status':'restored_drafts_need_creative_validation'}
