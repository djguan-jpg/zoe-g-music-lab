# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
"""Bounded HTTP download staging. Own files only, no background worker."""
import hashlib
import re
import tempfile
import threading
import time
import uuid
from pathlib import Path
from .draft_backup import MAX_BACKUP_BYTES


class BackupDownloads:
    def __init__(self):
        self.root=None;self.records={};self.paths=set();self.lock=threading.RLock()

    def _remove(self,path):
        if self.root is not None and path.parent.samefile(self.root):
            path.unlink(missing_ok=True);self.paths.discard(path)
            if not self.paths:
                try:self.root.rmdir()
                except OSError:pass  # Preserve unexpected files; never recurse.
                else:self.root=None

    def _expire(self):
        for identifier,record in list(self.records.items()):
            if record['deadline']<=time.monotonic():
                self._remove(record['path']);del self.records[identifier]

    def prepare(self,raw,summary):
        if not isinstance(raw,bytes) or not 0<len(raw)<=MAX_BACKUP_BYTES:
            raise ValueError('備份 ZIP 超過容量')
        if hashlib.sha256(raw).hexdigest()!=summary['backup_sha256']:
            raise ValueError('準備下載時摘要不一致')
        with self.lock:
            self._expire()
            if len(self.records)>=2:
                raise ValueError('已有備份等待下載；請先完成下載或 60 秒後重試')
            if self.root is None:self.root=Path(tempfile.mkdtemp(prefix='zoe-backup-download-')).resolve()
            identifier=uuid.uuid4().hex;path=self.root/(identifier+'.zip');self.paths.add(path)
            try:
                with path.open('xb') as output:output.write(raw)
            except OSError:
                self._remove(path);raise
            self.records[identifier]={'path':path,'sha256':summary['backup_sha256'],'deadline':time.monotonic()+60}
            return {**summary,'download_url':'/api/drafts/backup/download/'+identifier}

    def take(self,identifier):
        if not isinstance(identifier,str) or not re.fullmatch(r'[0-9a-f]{32}',identifier):
            raise ValueError('下載識別格式錯誤')
        with self.lock:
            self._expire();record=self.records.pop(identifier,None)
            if record is None:raise ValueError('備份下載已結束或逾時；請重新建立備份')
            path=record['path']
            try:
                if path.is_symlink() or not path.parent.samefile(self.root):raise ValueError('下載檔案位置錯誤')
                with path.open('rb') as source:raw=source.read(MAX_BACKUP_BYTES+1)
                if len(raw)>MAX_BACKUP_BYTES or hashlib.sha256(raw).hexdigest()!=record['sha256']:
                    raise ValueError('備份下載摘要不一致；請重新建立')
                return raw
            finally:self._remove(path)

    def close(self):
        with self.lock:
            for path in list(self.paths):self._remove(path)
            self.records.clear()
            if self.root is not None:
                try:self.root.rmdir()
                except OSError:pass  # Unexpected files are not ours to delete.
                else:self.root=None
