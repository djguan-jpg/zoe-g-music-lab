# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
"""Explicitly selected local library; immutable revisions, no deletion API."""
import hashlib
import json
import os
import re
import tempfile
import threading
import time
import uuid
from contextlib import contextmanager
from datetime import datetime, timezone
from pathlib import Path
from . import __version__
from .draft_contract import MAX_DRAFT_BYTES, draft_bytes, validate_draft

ID_PATTERN = r'draft-[0-9a-f]{32}'
LIBRARY_SCHEMA_VERSION = 1
MAX_ENTRIES = 1000
MAX_METADATA_BYTES = 16 * 1024


def revision_id():
    return 'draft-' + uuid.uuid4().hex


class DraftLibrary:
    def __init__(self, root):
        self.root = Path(root).resolve()
        self.lock = threading.RLock()

    @contextmanager
    def write_lock(self):
        self.root.mkdir(parents=True, exist_ok=True)
        path = self.root / '.write-lock'
        if path.is_symlink() or not path.resolve().parent.samefile(self.root):
            raise ValueError('草稿庫鎖不能指向其他位置')
        with path.open('a+b') as handle:
            if handle.seek(0, os.SEEK_END) == 0:
                handle.write(b'0'); handle.flush()
            def lock(unlock=False):
                handle.seek(0)
                if os.name == 'nt':
                    import msvcrt
                    msvcrt.locking(handle.fileno(), msvcrt.LK_UNLCK if unlock else msvcrt.LK_NBLCK, 1)
                else:
                    import fcntl
                    fcntl.flock(handle.fileno(), fcntl.LOCK_UN if unlock else fcntl.LOCK_EX | fcntl.LOCK_NB)
            deadline = time.monotonic() + 5
            while True:
                try: lock(); break
                except OSError:
                    if time.monotonic() >= deadline:
                        raise ValueError('草稿庫目前有另一筆保存，請稍後以相同 ID 重試')
                    time.sleep(0.05)
            try:
                yield
            finally:
                lock(unlock=True)

    def directory(self, identifier):
        if not isinstance(identifier, str) or not re.fullmatch(ID_PATTERN, identifier):
            raise ValueError('保存版本 ID 格式錯誤；不能指定檔案路徑')
        folder = self.root / identifier
        # Windows may resolve a previously missing path through a different alias.
        # For existing directories compare filesystem identity, not path spelling.
        if folder.is_symlink() or (folder.exists() and not folder.resolve().parent.samefile(self.root)):
            raise ValueError('草稿庫不讀取連結或目錄外的內容')
        return folder

    def bounded_read(self, path, maximum):
        if path.is_symlink() or not path.resolve().parent.parent.samefile(self.root):
            raise ValueError('草稿庫不讀取連結或目錄外的內容')
        with path.open('rb') as source:
            raw = source.read(maximum + 1)
        if len(raw) > maximum:
            raise ValueError('保存版本超過讀取上限')
        return raw

    def metadata(self, identifier):
        folder = self.directory(identifier)
        raw = self.bounded_read(folder / 'record.json', MAX_METADATA_BYTES)
        record = json.loads(raw.decode('utf-8'))
        keys = {'library_schema_version', 'id', 'label', 'stored_at', 'sha256', 'bytes',
                'draft_schema_version', 'created_with', 'titles'}
        if (not isinstance(record, dict) or set(record) != keys or
                type(record['library_schema_version']) is not int or record['library_schema_version'] != LIBRARY_SCHEMA_VERSION or
                record['id'] != identifier or not isinstance(record['label'], str) or not 1 <= len(record['label']) <= 200 or
                not record['label'].strip() or not isinstance(record['stored_at'], str) or
                not isinstance(record['sha256'], str) or not re.fullmatch(r'[0-9a-f]{64}', record['sha256']) or
                type(record['bytes']) is not int or not 0 < record['bytes'] <= MAX_DRAFT_BYTES or
                type(record['draft_schema_version']) is not int or record['draft_schema_version'] != 3 or
                not isinstance(record['created_with'], str) or len(record['created_with']) > 64 or
                not isinstance(record['titles'], dict) or set(record['titles']) != {'music', 'storyboard', 'lyrics'} or
                any(not isinstance(v, str) or len(v) > 120 for v in record['titles'].values())):
            raise ValueError('保存版本資料格式錯誤')
        when = datetime.fromisoformat(record['stored_at'])
        if when.utcoffset() != timezone.utc.utcoffset(when):
            raise ValueError('保存時間格式錯誤')
        return record

    def read(self, identifier):
        record = self.metadata(identifier)
        raw = self.bounded_read(self.directory(identifier) / 'draft.json', MAX_DRAFT_BYTES)
        if len(raw) != record['bytes'] or hashlib.sha256(raw).hexdigest() != record['sha256']:
            raise ValueError('保存版本摘要不一致；保留目前工作台，不載入這份內容')
        draft = validate_draft(json.loads(raw.decode('utf-8')))
        return {'entry': record, 'draft': draft, 'status': 'draft_only_not_validated'}

    def directories(self):
        if not self.root.exists():
            return []
        result = []
        for path in self.root.iterdir():
            if re.fullmatch(ID_PATTERN, path.name):
                result.append(path.name)
                if len(result) > MAX_ENTRIES:
                    raise ValueError('草稿庫超過 1000 個版本，請另選新草稿庫；現有資料保留')
        return result

    def list(self, limit=20, cursor=None):
        if type(limit) is not int or not 1 <= limit <= 100:
            raise ValueError('每頁需為 1–100 個版本')
        after = self.metadata(cursor) if cursor is not None else None
        records, issues = [], []
        for identifier in self.directories():
            try:
                records.append(self.metadata(identifier))
            except (ValueError, OSError, UnicodeError, RecursionError):
                issues.append({'id': identifier, 'error': 'unreadable_revision'})
        records.sort(key=lambda r: (r['stored_at'], r['id']), reverse=True)
        if after:
            records = [r for r in records if (r['stored_at'], r['id']) < (after['stored_at'], after['id'])]
        page = records[:limit]
        return {'entries': page, 'next_cursor': page[-1]['id'] if len(records) > limit else None,
                'issues': issues, 'status': 'metadata_only_checksum_verified_on_read'}

    def save(self, draft, label, identifier):
        if not isinstance(label, str) or not label.strip() or len(label) > 200:
            raise ValueError('保存名稱需為 1–200 字元的非空白文字')
        raw = draft_bytes(draft)
        sha = hashlib.sha256(raw).hexdigest()
        target = self.directory(identifier)
        def existing():
            result = self.read(identifier)
            if result['entry']['sha256'] != sha or result['entry']['label'] != label:
                raise ValueError('此保存 ID 已用於不同內容；請使用新 ID，不覆寫原版本')
            return {'entry': result['entry'], 'reused': True, 'status': 'draft_only_not_validated'}
        with self.lock, self.write_lock():
            if target.exists():
                return existing()
            if len(self.directories()) >= MAX_ENTRIES:
                raise ValueError('草稿庫已達 1000 個版本，請另選新草稿庫；現有資料保留')
            record = {'library_schema_version': LIBRARY_SCHEMA_VERSION, 'id': identifier, 'label': label,
                      'stored_at': datetime.now(timezone.utc).isoformat(), 'sha256': sha, 'bytes': len(raw),
                      'draft_schema_version': 3, 'created_with': __version__, 'titles': {
                          panel: draft['panels'][panel]['fields'][key][:120] for panel, key in
                          [('music', 'music-title'), ('storyboard', 'mv-title'), ('lyrics', 'lyrics-title')]}}
            metadata = (json.dumps(record, ensure_ascii=False, indent=2) + '\n').encode('utf-8')
            temporary = Path(tempfile.mkdtemp(prefix='.pending-', dir=self.root))
            try:
                for name, content in [('draft.json', raw), ('record.json', metadata)]:
                    with (temporary / name).open('xb') as output:
                        output.write(content)
                        output.flush()
                        os.fsync(output.fileno())
                try:
                    temporary.rename(target)
                except OSError:
                    if target.exists():
                        return existing()
                    raise
            finally:
                # Only our two staged files; never recursively clean user directories.
                if temporary.exists() and temporary.resolve().parent.samefile(self.root):
                    for name in ('draft.json', 'record.json'):
                        (temporary / name).unlink(missing_ok=True)
                    temporary.rmdir()
            return {'entry': record, 'reused': False, 'status': 'draft_only_not_validated'}
