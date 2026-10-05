# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
"""Pure saved-name literal matching and nonoverlapping Unicode codepoint spans."""
import json
from .json_document import utf8_bytes
from .library_contract import MAX_METADATA_BYTES, validate_record

MAX_QUERY_CHARS = 200
MAX_QUERY_BYTES = 800
FIELDS = (('label', '保存名稱'), ('titles.music', '歌曲名'),
          ('titles.storyboard', '分鏡名'), ('titles.lyrics', '歌詞名'))


def checked_query(query):
    if not isinstance(query, str) or not 1 <= len(query) <= MAX_QUERY_CHARS or len(utf8_bytes(query)) > MAX_QUERY_BYTES:
        raise ValueError('搜尋文字需為 1–200 字元、最多 800 UTF-8 bytes；保留大小寫與空白')
    return query


def checked_fields(record):
    if not isinstance(record, dict): raise ValueError('保存名稱來源需為完整摘要')
    validate_record(record, record.get('id'))
    if len(utf8_bytes(json.dumps(record, ensure_ascii=False, separators=(',', ':'))))>MAX_METADATA_BYTES:
        raise ValueError('保存名稱摘要超過上限')
    fields = []
    for field, name in FIELDS:
        text = record['label'] if field == 'label' else record['titles'][field.split('.')[1]]
        utf8_bytes(text)
        fields.append((field, name, text))
    return fields


def has_match(record, query):
    query = checked_query(query)
    return any(query in text for _, _, text in checked_fields(record))


def matched_fields(record, query):
    query = checked_query(query)
    result = []
    for field, name, text in checked_fields(record):
        spans, start = [], 0
        while (position := text.find(query, start)) >= 0:
            start = position + len(query); spans.append([position, start])
        if spans: result.append({'field': field, 'name': name, 'text': text, 'spans': spans})
    return result
