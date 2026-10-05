# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
"""Pure request and complete ZIP export codec; no paths or filesystem writes."""
import base64
import io
from dataclasses import dataclass
from .draft_backup import read_backup, selected_ids, BACKUP_SCHEMA_VERSION, MAX_BACKUP_BYTES
from .library_contract import ID_PATTERN, MAX_ENTRIES

FORMAT = 'zoe-draft-backup-export'
SCHEMA_VERSION = 1
ARCHIVE_NAME = 'zoe-music-lab-backup.zip'
MAX_INLINE_BYTES = 512 * 1024


def checked_request(payload):
    if not isinstance(payload, dict) or set(payload) - {'ids', 'include_archive'}:
        raise ValueError('備份匯出只接受保存 ID 與 include_archive；不能指定來源或目的路徑')
    include = payload.get('include_archive', False)
    if type(include) is not bool:
        raise ValueError('include_archive 需為布林值')
    ids = selected_ids(payload['ids']) if 'ids' in payload else None
    return {'ids': ids, 'include_archive': include}


@dataclass(frozen=True)
class PreparedBackupExport:
    archive: bytes
    sha256: str
    selection: str
    revision_ids: tuple

    def summary(self, include_archive=False):
        if type(include_archive) is not bool:
            raise ValueError('include_archive 需為布林值')
        if include_archive and len(self.archive) > MAX_INLINE_BYTES:
            raise ValueError('備份 ZIP 超過 512 KiB inline 上限；請回傳摘要、明確分批選 ID 或用 CLI draft backup 另存')
        backup = {'backup_schema_version': BACKUP_SCHEMA_VERSION, 'backup_sha256': self.sha256,
                  'bytes': len(self.archive), 'entry_count': len(self.revision_ids), 'selection': self.selection}
        result = {'format': FORMAT, 'schema_version': SCHEMA_VERSION,
                  'archive_name': ARCHIVE_NAME, 'backup': backup,
                  'revision_ids': list(self.revision_ids), 'status': 'prepared_not_saved'}
        if include_archive:
            result['archive_base64'] = base64.b64encode(self.archive).decode('ascii')
        return result


def prepare(raw, summary, identifiers=None):
    if not isinstance(raw, bytes) or not 0 < len(raw) <= MAX_BACKUP_BYTES:
        raise ValueError('備份 ZIP 容量無效')
    requested = selected_ids(identifiers) if identifiers is not None else None
    snapshot = read_backup(io.BytesIO(raw))
    ids = tuple(row[0] for row in snapshot['revisions'])
    expected = {'backup_schema_version': BACKUP_SCHEMA_VERSION,
                'backup_sha256': snapshot['sha256'], 'bytes': len(raw),
                'entry_count': len(ids), 'selection': 'all' if requested is None else 'selected'}
    if (not isinstance(summary, dict) or set(summary) != set(expected) or
            any(type(summary[k]) is not type(v) or summary[k] != v for k, v in expected.items()) or
            snapshot['manifest']['selection'] != expected['selection'] or
            requested is not None and list(ids) != requested):
        raise ValueError('備份匯出來源、版本或保存 ID 與完整 ZIP 不一致')
    return PreparedBackupExport(raw, snapshot['sha256'], expected['selection'], ids)


def data_schema():
    """Discovery shape; full ZIP/hash and ID relationships remain domain checks."""
    backup = {'backup_schema_version': {'type': 'integer', 'const': BACKUP_SCHEMA_VERSION},
              'backup_sha256': {'type': 'string', 'pattern': '^[0-9a-f]{64}$'},
              'bytes': {'type': 'integer', 'minimum': 1, 'maximum': MAX_BACKUP_BYTES},
              'entry_count': {'type': 'integer', 'minimum': 0, 'maximum': MAX_ENTRIES},
              'selection': {'enum': ['all', 'selected']}}
    fields = {'format': {'const': FORMAT}, 'schema_version': {'type': 'integer', 'const': SCHEMA_VERSION},
              'archive_name': {'const': ARCHIVE_NAME},
              'backup': {'type': 'object', 'properties': backup, 'required': list(backup), 'additionalProperties': False},
              'revision_ids': {'type': 'array', 'uniqueItems': True, 'minItems': 0, 'maxItems': MAX_ENTRIES,
                               'items': {'type': 'string', 'pattern': '^'+ID_PATTERN+'$'}},
              'status': {'const': 'prepared_not_saved'}}
    required = list(fields)
    fields['archive_base64'] = {'type': 'string', 'contentEncoding': 'base64', 'minLength': 4,
                                'maxLength': ((MAX_INLINE_BYTES+2)//3)*4,
                                'description': 'Present only on explicit include_archive; complete ZIP bytes, not a saved-file proof'}
    return {'type': 'object', 'properties': fields, 'required': required, 'additionalProperties': False}


def descriptor():
    return {'format': FORMAT, 'schema_version': SCHEMA_VERSION,
            'max_inline_archive_bytes': MAX_INLINE_BYTES, 'max_archive_bytes': MAX_BACKUP_BYTES,
            'max_revisions': MAX_ENTRIES, 'default': 'metadata',
            'archive': 'explicit include_archive=true only', 'writes_files': False, 'data_schema': data_schema()}
