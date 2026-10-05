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
from .draft_contract import MAX_DRAFT_BYTES, draft_bytes
from .library_contract import (ID_PATTERN, LIBRARY_SCHEMA_VERSION, MAX_ENTRIES,
                               MAX_METADATA_BYTES, strict_json, validate_record, validate_revision)



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
        raw = self.bounded_read(self.directory(identifier) / 'record.json', MAX_METADATA_BYTES)
        return validate_record(strict_json(raw), identifier)

    def revision_bytes(self, identifier):
        folder = self.directory(identifier)
        record_raw = self.bounded_read(folder / 'record.json', MAX_METADATA_BYTES)
        draft_raw = self.bounded_read(folder / 'draft.json', MAX_DRAFT_BYTES)
        record, draft = validate_revision(identifier, record_raw, draft_raw)
        return record_raw, draft_raw, record, draft

    def read(self, identifier):
        _, _, record, draft = self.revision_bytes(identifier)
        return {'entry': record, 'draft': draft, 'status': 'draft_only_not_validated'}

    def _publish(self, identifier, record_raw, draft_raw):
        # Caller holds this library's process lock and has validated the complete request.
        validate_revision(identifier, record_raw, draft_raw)
        target = self.directory(identifier)
        if target.exists():
            raise ValueError('此保存 ID 已存在，不覆寫原版本')
        temporary = Path(tempfile.mkdtemp(prefix='.pending-', dir=self.root))
        try:
            for name, content in [('draft.json', draft_raw), ('record.json', record_raw)]:
                with (temporary / name).open('xb') as output:
                    output.write(content); output.flush(); os.fsync(output.fileno())
            temporary.rename(target)
        finally:
            if temporary.exists() and temporary.resolve().parent.samefile(self.root):
                for name in ('draft.json', 'record.json'):
                    (temporary / name).unlink(missing_ok=True)
                temporary.rmdir()

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

    def metadata_snapshot(self):
        """One bounded observed metadata scan; body checks remain in revision reads."""
        records, issues = [], []
        for identifier in self.directories():
            try:
                records.append(self.metadata(identifier))
            except (ValueError, OSError, UnicodeError, RecursionError):
                issues.append({'id': identifier, 'error': 'unreadable_revision'})
        records.sort(key=lambda r: (r['stored_at'], r['id']), reverse=True)
        return records, issues

    def list(self, limit=20, cursor=None):
        if type(limit) is not int or not 1 <= limit <= 100:
            raise ValueError('每頁需為 1–100 個版本')
        after = self.metadata(cursor) if cursor is not None else None
        records, issues = self.metadata_snapshot()
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
            self._publish(identifier, metadata, raw)
            return {'entry': record, 'reused': False, 'status': 'draft_only_not_validated'}
