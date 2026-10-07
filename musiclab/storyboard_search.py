# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
"""Read-only literal search of original narrative shot fields; no time or I/O."""
from . import digests as hashlib
import json
import re
from .json_document import utf8_bytes
from .delivery_search import checked_options
from .common import json_text

SCHEMA_VERSION = 1
FIELDS = ('section', 'purpose', 'visual', 'camera', 'transition', 'motif_state', 'character_state', 'change_reason')
LABELS = dict(zip(FIELDS, ('歌曲段落', '敘事用途', '畫面動作', '鏡頭運動', '尾鏡與轉場', '母題狀態', '人物狀態', '變化理由')))
MAX_ROWS = 1000
MAX_TEXT_CHARACTERS = 2000
MAX_SOURCE_BYTES = 1024 * 1024
MAX_RESULTS = 50
PREFIX = b'zoe-storyboard-texts-v1\n'
NOTES = ['只查找八個原敘事欄位，不修改分鏡或時間；不代表創作、連戲或媒體通過。',
         '每鏡依固定欄位順序列第一個字面命中；原鏡號與UTF-8 byte位置保留。']

def descriptor():
    return {'format': 'zoe-storyboard-search', 'schema_version': 1, 'fields': list(FIELDS),
            'max_rows': MAX_ROWS, 'max_text_characters': MAX_TEXT_CHARACTERS, 'max_source_bytes': MAX_SOURCE_BYTES,
            'max_query_bytes': 1024, 'max_results': MAX_RESULTS, 'default_results': 20,
            'matching': 'exact case-sensitive literal UTF-8; first matching field and occurrence per original shot',
            'source_hash': 'SHA256 of zoe-storyboard-texts-v1 LF plus compact UTF-8 JSON shot array in declared field order',
            'continuation': 'start_row greater than1 requires source_sha256', 'read_only': True, 'media_generated': False}

def checked_shots(shots):
    if not isinstance(shots, list) or len(shots) > MAX_ROWS:
        raise ValueError('分鏡搜尋最多1000鏡')
    parts, selected, size = [], [], 2
    for shot in shots:
        if not isinstance(shot, dict) or set(shot) != set(FIELDS):
            raise ValueError('分鏡搜尋只接受八個原敘事欄位；不接受時間或路徑')
        current = {}
        for field in FIELDS:
            value = shot[field]
            if not isinstance(value, str) or len(value) > MAX_TEXT_CHARACTERS:
                raise ValueError('每個搜尋欄位需為文字，最多2000字')
            utf8_bytes(value, label='分鏡搜尋原文');current[field] = value
        part = utf8_bytes(json.dumps(current, ensure_ascii=False, separators=(',', ':')), label='分鏡搜尋原文')
        size += len(part) + (1 if parts else 0)
        if size > MAX_SOURCE_BYTES:
            raise ValueError('分鏡搜尋來源最多1 MiB UTF-8 JSON')
        parts.append(part);selected.append(current)
    return selected, b'[' + b','.join(parts) + b']'

def checked_request(payload):
    if not isinstance(payload, dict) or not {'shots', 'query'} <= set(payload) or set(payload) - {'shots', 'query', 'start_row', 'max_results', 'source_sha256'}:
        raise ValueError('分鏡搜尋只接受 shots／query／start_row／max_results／source_sha256')
    shots, raw = checked_shots(payload['shots']);pattern = checked_options(payload['query'], 0, 1)
    start, limit, pin = payload.get('start_row', 1), payload.get('max_results', 20), payload.get('source_sha256')
    if type(start) is not int or not 1 <= start <= len(shots) + 1 or type(limit) is not int or not 1 <= limit <= MAX_RESULTS:
        raise ValueError('搜尋鏡號或筆數無效；需原鏡1起與1–50筆')
    if 'source_sha256' in payload and (not isinstance(pin, str) or not re.fullmatch('[0-9a-f]{64}', pin)):
        raise ValueError('搜尋來源SHA需為64字元小寫十六進位')
    if start > 1 and pin is None:raise ValueError('接續搜尋需前次來源SHA')
    return shots, raw, pattern, start, limit, pin

def search(payload):
    shots, raw, pattern, start, limit, pin = checked_request(payload)
    sha = hashlib.sha256(PREFIX + raw).hexdigest()
    if pin is not None and pin != sha:raise ValueError('分鏡原文已變更，請重新搜尋；不能接續舊來源')
    count, matches, next_row = 0, [], None
    for row, shot in enumerate(shots, 1):
        for field in FIELDS:
            found = utf8_bytes(shot[field], label='分鏡搜尋原文').find(pattern)
            if found < 0:continue
            count += 1
            if row >= start:
                if len(matches) < limit:matches.append({'row': row, 'field': field, 'start_byte': found, 'end_byte': found + len(pattern), 'text': shot[field]})
                elif next_row is None:next_row = matches[-1]['row'] + 1
            break
    return {'format': 'zoe-storyboard-search', 'schema_version': 1, 'query': payload['query'], 'query_bytes': len(pattern),
            'source_sha256': sha, 'source_bytes': len(raw), 'total_rows': len(shots), 'total_matched_rows': count,
            'start_row': start, 'max_results': limit, 'matches': matches, 'next_row': next_row, 'review_notes': list(NOTES)}

def markdown(data):
    lines = ['# 分鏡原文搜尋', '', f"全部{data['total_rows']}鏡；命中{data['total_matched_rows']}鏡；此批{len(data['matches'])}鏡。",
             f"查詢{data['query_bytes']} UTF-8 bytes；來源SHA-256：{data['source_sha256']}。", '']
    for hit in data['matches']:lines.append(f"- 鏡頭{hit['row']} · {LABELS[hit['field']]}：第一個命中UTF-8 bytes {hit['start_byte']}–{hit['end_byte']}。")
    if data['next_row'] is not None:lines.append(f"- 接續從原鏡{data['next_row']}開始，需同一來源SHA。")
    return '\n'.join(lines + ['', *data['review_notes'], ''])

def bundle(payload):
    data = search(payload)
    return {'storyboard-search.json': json_text(data), 'storyboard-search.md': markdown(data)}

def data_schema():
    from .tool_contracts import object_schema, array_schema
    integer = lambda minimum, maximum: {'type': 'integer', 'minimum': minimum, 'maximum': maximum}
    fields = {'format': {'const': 'zoe-storyboard-search'}, 'schema_version': {'type': 'integer', 'const': 1},
              'query': {'type': 'string', 'minLength': 1, 'maxLength': 1024}, 'query_bytes': integer(1, 1024),
              'source_sha256': {'type': 'string', 'pattern': '^[0-9a-f]{64}$'}, 'source_bytes': integer(2, MAX_SOURCE_BYTES),
              'total_rows': integer(0, MAX_ROWS), 'total_matched_rows': integer(0, MAX_ROWS), 'start_row': integer(1, MAX_ROWS + 1), 'max_results': integer(1, MAX_RESULTS),
              'matches': array_schema(object_schema({'row': integer(1, MAX_ROWS), 'field': {'enum': list(FIELDS)}, 'start_byte': integer(0, 8000), 'end_byte': integer(1, 8000), 'text': {'type': 'string', 'maxLength': MAX_TEXT_CHARACTERS}}, ('row', 'field', 'start_byte', 'end_byte', 'text'), additionalProperties=False), 0, MAX_RESULTS),
              'next_row': {'anyOf': [integer(2, MAX_ROWS + 1), {'type': 'null'}]}, 'review_notes': {'const': list(NOTES)}}
    return object_schema(fields, tuple(fields), additionalProperties=False)
