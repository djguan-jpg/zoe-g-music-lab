# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
"""Pure immutable revision contract shared by disk reads and portable backups."""
import hashlib
import re
from .json_document import decode_json
from .draft_contract import MAX_DRAFT_BYTES, validate_draft
from .utc_timestamp import checked_utc_timestamp

ID_PATTERN = r'draft-[0-9a-f]{32}'
LIBRARY_SCHEMA_VERSION = 1
MAX_ENTRIES = 1000
MAX_METADATA_BYTES = 16 * 1024


def strict_json(raw):
    return decode_json(raw)


def validate_record(record, identifier):
    keys = {'library_schema_version', 'id', 'label', 'stored_at', 'sha256', 'bytes',
            'draft_schema_version', 'created_with', 'titles'}
    if (not isinstance(identifier, str) or not re.fullmatch(ID_PATTERN, identifier) or
            not isinstance(record, dict) or set(record) != keys or
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
    checked_utc_timestamp(record['stored_at'])
    return record


def validate_revision(identifier, record_raw, draft_raw):
    if len(record_raw) > MAX_METADATA_BYTES or len(draft_raw) > MAX_DRAFT_BYTES:
        raise ValueError('保存版本超過讀取上限')
    record = validate_record(strict_json(record_raw), identifier)
    if len(draft_raw) != record['bytes'] or hashlib.sha256(draft_raw).hexdigest() != record['sha256']:
        raise ValueError('保存版本摘要不一致；保留目前工作台，不載入這份內容')
    return record, validate_draft(strict_json(draft_raw))
