# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
"""Pure literal metadata search with a complete observed-index continuation pin."""
import copy
import hashlib
import json
import re
from .json_document import utf8_bytes
from .library_contract import ID_PATTERN, MAX_ENTRIES, MAX_METADATA_BYTES, validate_record

FORMAT = 'zoe-draft-library-search'
SCHEMA_VERSION = 1
STATUS = 'metadata_only_checksum_verified_on_read'
MAX_QUERY_CHARS = 200
MAX_QUERY_BYTES = 800


def checked_request(payload):
    if not isinstance(payload, dict) or 'query' not in payload or set(payload) - {'query', 'limit', 'cursor'}:
        raise ValueError('搜尋需明確 query；不能指定路徑或其他欄位')
    query, limit, cursor = payload['query'], payload.get('limit', 20), payload.get('cursor')
    if not isinstance(query, str) or not 1 <= len(query) <= MAX_QUERY_CHARS or len(utf8_bytes(query)) > MAX_QUERY_BYTES:
        raise ValueError('搜尋文字需為 1–200 字元、最多 800 UTF-8 bytes；保留大小寫與空白')
    if type(limit) is not int or not 1 <= limit <= 100:
        raise ValueError('每頁需為 1–100 個版本')
    if cursor is not None and (not isinstance(cursor, dict) or set(cursor) != {'start_index', 'search_sha256'} or
                              type(cursor['start_index']) is not int or not 1 <= cursor['start_index'] <= MAX_ENTRIES or
                              not isinstance(cursor['search_sha256'], str) or not re.fullmatch(r'[0-9a-f]{64}', cursor['search_sha256'])):
        raise ValueError('搜尋接續需為前次 start_index 與 search_sha256')
    return copy.deepcopy({'query': query, 'limit': limit, 'cursor': cursor})


def cli_cursor(value):
    if value is None:
        return None
    if not isinstance(value, str) or not re.fullmatch(r'[1-9][0-9]{0,3}:[0-9a-f]{64}', value):
        raise ValueError('搜尋 --cursor 需為前次 INDEX:SHA256')
    index, sha = value.split(':')
    return checked_request({'query': 'cursor', 'cursor': {'start_index': int(index), 'search_sha256': sha}})['cursor']


def prepare(payload, records, issues):
    request = checked_request(payload)
    if not isinstance(records, list) or not isinstance(issues, list) or len(records) + len(issues) > MAX_ENTRIES:
        raise ValueError('搜尋來源需為最多 1000 個版本的完整摘要')
    seen, checked, unreadable = set(), [], []
    for record in records:
        if not isinstance(record, dict):
            raise ValueError('搜尋保存摘要格式錯誤')
        validate_record(record, record.get('id'))
        raw = utf8_bytes(json.dumps(record, ensure_ascii=False, sort_keys=True, separators=(',', ':')))
        if len(raw) > MAX_METADATA_BYTES or record['id'] in seen:
            raise ValueError('搜尋保存摘要重複或超過上限')
        seen.add(record['id']); checked.append(copy.deepcopy(record))
    for issue in issues:
        if (not isinstance(issue, dict) or set(issue) != {'id', 'error'} or
                not isinstance(issue['id'], str) or not re.fullmatch(ID_PATTERN, issue['id']) or
                issue['error'] != 'unreadable_revision' or issue['id'] in seen):
            raise ValueError('搜尋不可讀版本摘要格式錯誤')
        seen.add(issue['id']); unreadable.append(dict(issue))
    checked.sort(key=lambda record: (record['stored_at'], record['id']), reverse=True)
    unreadable.sort(key=lambda issue: issue['id'])
    query = request['query']
    encoded = json.dumps([FORMAT, SCHEMA_VERSION, query, checked, unreadable],
                         ensure_ascii=True, sort_keys=True, separators=(',', ':')).encode('ascii')
    sha = hashlib.sha256(encoded).hexdigest()
    matches = [record for record in checked if any(query in text for text in [record['label'], *record['titles'].values()])]
    cursor = request['cursor']; start = cursor['start_index'] if cursor else 0
    if cursor and (cursor['search_sha256'] != sha or start >= len(matches)):
        raise ValueError('搜尋文字或保存版本來源已變更；請重新搜尋，原版本保留')
    page = matches[start:start + request['limit']]
    next_index = start + len(page)
    return {'format': FORMAT, 'schema_version': SCHEMA_VERSION, 'query': query, 'search_sha256': sha,
            'record_count': len(checked), 'match_count': len(matches), 'start_index': start,
            'entries': page, 'issues': unreadable,
            'next_cursor': {'start_index': next_index, 'search_sha256': sha} if next_index < len(matches) else None,
            'status': STATUS}


def cursor_schema():
    return {'type': 'object', 'additionalProperties': False, 'required': ['start_index', 'search_sha256'],
            'properties': {'start_index': {'type': 'integer', 'minimum': 1, 'maximum': MAX_ENTRIES},
                           'search_sha256': {'type': 'string', 'pattern': '^[0-9a-f]{64}$', 'minLength': 64, 'maxLength': 64}}}


def request_schema():
    return {'type': 'object', 'additionalProperties': False, 'required': ['query'], 'properties': {
        'query': {'type': 'string', 'minLength': 1, 'maxLength': MAX_QUERY_CHARS,
                  'description': 'Literal case-sensitive metadata substring, <=800 UTF-8 bytes; preserve whitespace and Unicode; no body search'},
        'limit': {'type': 'integer', 'minimum': 1, 'maximum': 100, 'default': 20},
        'cursor': {'anyOf': [cursor_schema(), {'type': 'null'}]}}}


def data_schema():
    identifier = {'type': 'string', 'pattern': '^' + ID_PATTERN + '$', 'minLength': 38, 'maxLength': 38}
    integer = lambda maximum: {'type': 'integer', 'minimum': 0, 'maximum': maximum}
    record = {'type': 'object', 'additionalProperties': False, 'required': [
        'library_schema_version', 'id', 'label', 'stored_at', 'sha256', 'bytes', 'draft_schema_version', 'created_with', 'titles'],
        'properties': {'library_schema_version': {'type': 'integer', 'const': 1}, 'id': identifier,
                       'label': {'type': 'string', 'minLength': 1, 'maxLength': 200}, 'stored_at': {'type': 'string'},
                       'sha256': {'type': 'string', 'pattern': '^[0-9a-f]{64}$', 'minLength': 64, 'maxLength': 64},
                       'bytes': {'type': 'integer', 'minimum': 1, 'maximum': 1048576},
                       'draft_schema_version': {'type': 'integer', 'const': 3},
                       'created_with': {'type': 'string', 'maxLength': 64},
                       'titles': {'type': 'object', 'additionalProperties': False, 'required': ['music', 'storyboard', 'lyrics'],
                                  'properties': {key: {'type': 'string', 'maxLength': 120} for key in ('music', 'storyboard', 'lyrics')}}}}
    props = {'format': {'const': FORMAT}, 'schema_version': {'type': 'integer', 'const': SCHEMA_VERSION},
             'query': request_schema()['properties']['query'], 'search_sha256': cursor_schema()['properties']['search_sha256'],
             'record_count': integer(MAX_ENTRIES), 'match_count': integer(MAX_ENTRIES), 'start_index': integer(MAX_ENTRIES),
             'entries': {'type': 'array', 'maxItems': 100, 'items': record},
             'issues': {'type': 'array', 'maxItems': MAX_ENTRIES, 'items': {
                 'type': 'object', 'additionalProperties': False, 'required': ['id', 'error'],
                 'properties': {'id': identifier, 'error': {'const': 'unreadable_revision'}}}},
             'next_cursor': {'anyOf': [cursor_schema(), {'type': 'null'}]}, 'status': {'const': STATUS}}
    return {'type': 'object', 'additionalProperties': False, 'required': list(props), 'properties': props}


def descriptor():
    return {'format': FORMAT, 'schema_version': SCHEMA_VERSION, 'max_query_characters': MAX_QUERY_CHARS,
            'max_query_bytes': MAX_QUERY_BYTES, 'max_revisions': MAX_ENTRIES, 'default_page_size': 20,
            'fields': ['label', 'titles.music', 'titles.storyboard', 'titles.lyrics'],
            'continuation': 'query_and_complete_observed_metadata_and_unreadable_ids_sha256',
            'data_schema': data_schema(), 'status': 'read_only_metadata_no_body_media_or_atomic_snapshot'}
