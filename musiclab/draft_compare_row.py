# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
"""Read one original ordinal from two complete drafts; never read paths or write."""
import hashlib
import json
from .draft_contract import CONTRACT, MAX_DRAFT_BYTES, exact
from .draft_compare import source, value_view
from .json_document import utf8_bytes

SCHEMA_VERSION = 1
MAX_REPORT_BYTES = 64 * 1024
COLLECTIONS = {
    'music': {'sections': CONTRACT['rows']['music']['columns'],
              'avoid': ['value'], 'deliverables': ['value']},
    'storyboard': {'shots': CONTRACT['rows']['storyboard']['columns'],
                   'motifs': ['id', 'name', 'meaning']},
    'lyrics': {'cues': CONTRACT['rows']['lyrics']['columns']},
}
NOTES = [
    '核對兩份完整草稿 schema3 後，只查看指定集合的原位置1起；不依賴整份比較的前200筆保留明細。',
    '每欄保留最多128 UTF-8 bytes原文摘錄、完整欄位雜湊與長度；空字串和不存在的列分開，未變更欄位也列出。',
    '插入、刪除或換序可能改變後續原位置；沒有推定移動、穩定列ID、作者或權利。來源雜湊是完整草稿canonical UTF-8，不是原檔排版。',
    '此報告唯讀，不替換、合併、保存草稿或判定作品接受；沒有來源路徑、模型、媒體或外網能力。',
]


def selection(value):
    if (not exact(value, ('scope', 'collection', 'row'))
            or not isinstance(value['scope'], str) or value['scope'] not in COLLECTIONS
            or not isinstance(value['collection'], str) or value['collection'] not in COLLECTIONS[value['scope']]
            or type(value['row']) is not int or not 1 <= value['row'] <= 10000):
        raise ValueError('請明確選擇受支援的集合及原列1起整數；不能指定路徑')
    return dict(value)


def descriptor():
    return {'schema_version': SCHEMA_VERSION, 'draft_schema_version': 3,
            'max_draft_bytes': MAX_DRAFT_BYTES, 'max_report_bytes': MAX_REPORT_BYTES,
            'excerpt_bytes': 128, 'read_only': True,
            'row_alignment': 'one_based_original_position',
            'collections': {scope: list(values) for scope, values in COLLECTIONS.items()}}


def compare(payload):
    if not exact(payload, ('baseline', 'current', 'selection')):
        raise ValueError('原列比較需要兩份完整草稿及selection；不能指定路徑或覆蓋來源')
    chosen = selection(payload['selection'])
    before, left_raw = source(payload['baseline'])
    after, right_raw = source(payload['current'])
    scope, collection, index = chosen['scope'], chosen['collection'], chosen['row'] - 1
    left, right = before['panels'][scope][collection], after['panels'][scope][collection]
    if index >= max(len(left), len(right)):
        raise ValueError('指定原列在兩份草稿都不存在；請依原集合列數選擇，原內容保留')
    a = left[index] if index < len(left) else None
    b = right[index] if index < len(right) else None
    if collection in ('avoid', 'deliverables'):
        a = {'value': a} if a is not None else None
        b = {'value': b} if b is not None else None
    fields = [{'field': key, 'changed': a is None or b is None or a[key] != b[key],
               'before': value_view(a[key]) if a is not None else None,
               'after': value_view(b[key]) if b is not None else None}
              for key in COLLECTIONS[scope][collection]]
    return {'format': 'zoe-draft-row-comparison', 'schema_version': SCHEMA_VERSION,
            'selection': chosen,
            'status': 'added' if a is None else 'removed' if b is None else
                      'changed' if any(f['changed'] for f in fields) else 'unchanged',
            'baseline_rows': len(left), 'current_rows': len(right),
            'source': {'encoding': 'draft3_canonical_utf8',
                       'baseline_sha256': hashlib.sha256(left_raw).hexdigest(),
                       'current_sha256': hashlib.sha256(right_raw).hexdigest(),
                       'baseline_bytes': len(left_raw), 'current_bytes': len(right_raw)},
            'fields': fields, 'review_notes': list(NOTES)}


def markdown(data):
    s = data['selection']
    lines = ['# 草稿指定原列比較', '',
             f"原位置：{s['scope']}.{s['collection']}[{s['row']}] · {data['status']}",
             f"集合列數：{data['baseline_rows']} → {data['current_rows']}",
             f"基準 SHA-256：{data['source']['baseline_sha256']}",
             f"目前 SHA-256：{data['source']['current_sha256']}", '', '## 欄位', '']
    for field in data['fields']:
        lines.append(f"- {field['field']}：{'有變動' if field['changed'] else '未變更'}；原文摘錄與完整欄位SHA／bytes見JSON。")
    return '\n'.join(lines + ['', *data['review_notes'], ''])


def bundle(payload):
    data = compare(payload)
    files = {'draft-row-comparison.json': json.dumps(data, ensure_ascii=False, indent=2, allow_nan=False) + '\n',
             'draft-row-comparison.md': markdown(data)}
    if sum(len(utf8_bytes(text)) for text in files.values()) > MAX_REPORT_BYTES:
        raise ValueError('原列比較報告最多64 KiB；原內容保留')
    return files


def selection_schema():
    from .tool_contracts import object_schema
    return {'oneOf': [object_schema({'scope': {'const': scope}, 'collection': {'enum': list(collections)},
                                    'row': {'type': 'integer', 'minimum': 1, 'maximum': 10000}},
                                   ('scope', 'collection', 'row'), additionalProperties=False)
                      for scope, collections in COLLECTIONS.items()]}


def data_schema():
    from .tool_contracts import object_schema, array_schema
    def obj(props): return object_schema(props, list(props), additionalProperties=False)
    sha = {'type': 'string', 'pattern': '^[0-9a-f]{64}$'}
    count = {'type': 'integer', 'minimum': 0, 'maximum': 10000}
    view = obj({'bytes': {'type': 'integer', 'minimum': 0, 'maximum': MAX_DRAFT_BYTES}, 'sha256': sha,
                'excerpt': {'type': 'string', 'maxLength': 128}, 'excerpt_truncated': {'type': 'boolean'}})
    optional = {'anyOf': [view, {'type': 'null'}]}
    return obj({'format': {'const': 'zoe-draft-row-comparison'}, 'schema_version': {'type': 'integer', 'const': 1},
                'selection': selection_schema(), 'status': {'enum': ['unchanged', 'changed', 'added', 'removed']},
                'baseline_rows': count, 'current_rows': count,
                'source': obj({'encoding': {'const': 'draft3_canonical_utf8'}, 'baseline_sha256': sha,
                               'current_sha256': sha, 'baseline_bytes': {'type': 'integer', 'minimum': 1, 'maximum': MAX_DRAFT_BYTES},
                               'current_bytes': {'type': 'integer', 'minimum': 1, 'maximum': MAX_DRAFT_BYTES}}),
                'fields': array_schema(obj({'field': {'type': 'string'}, 'changed': {'type': 'boolean'},
                                             'before': optional, 'after': optional}), 1, 12),
                'review_notes': {'const': list(NOTES)}})
