# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
"""Read-only, ordinal comparison of two complete modern drafts; no file access."""
import hashlib
import json
from .draft_contract import CONTRACT, MAX_DRAFT_BYTES, draft_bytes, exact
from .json_document import decode_json, utf8_bytes

SCHEMA_VERSION = 1
MAX_DETAILS = 200
MAX_DETAIL_BYTES = 128 * 1024
MAX_REPORT_BYTES = 256 * 1024
EXCERPT_BYTES = 128
NOTES = [
    '比對完整草稿 schema3 的原字串；不修剪、正規化、轉換數字或合併內容。未完成創作欄位也可比較。',
    '集合只按原位置1起比較；插入、刪除或換序可能造成後續多列差異，沒有推定移動、作者或穩定列ID。',
    'tool_version、saved_at 與 tab 的變化另列 metadata；作品差異只比較四個 panels。雜湊是完整草稿的 canonical UTF-8，不是原檔排版位元組。',
    '明細保留有界原文摘錄、完整欄位雜湊與UTF-8長度；計數涵蓋全部來源。沒有替換、保存、路徑存取、模型、媒體或作品接受判定。',
]


def descriptor():
    return {'schema_version': SCHEMA_VERSION, 'draft_schema_version': 3,
            'max_draft_bytes': MAX_DRAFT_BYTES, 'max_details': MAX_DETAILS,
            'max_detail_bytes': MAX_DETAIL_BYTES, 'excerpt_bytes': EXCERPT_BYTES,
            'max_report_bytes': MAX_REPORT_BYTES, 'read_only': True,
            'row_alignment': 'one_based_original_position', 'source_hash': 'draft3_canonical_utf8'}


def source(document):
    try:
        raw = draft_bytes(document)
    except UnicodeError:
        raise ValueError('草稿比較來源含無效 Unicode；原內容保留') from None
    return decode_json(raw, max_bytes=MAX_DRAFT_BYTES, label='草稿比較來源'), raw


def value_view(value):
    if value is None:
        return None
    raw = utf8_bytes(value, label='草稿原欄位')
    excerpt = raw[:EXCERPT_BYTES].decode('utf-8', errors='ignore')
    return {'bytes': len(raw), 'sha256': hashlib.sha256(raw).hexdigest(),
            'excerpt': excerpt, 'excerpt_truncated': len(raw) > len(excerpt.encode('utf-8'))}


def compare(payload):
    if not exact(payload, ('baseline', 'current')):
        raise ValueError('草稿比較只接受 baseline 與 current 兩份完整草稿；不能指定路徑或覆蓋來源')
    before, before_raw = source(payload['baseline'])
    after, after_raw = source(payload['current'])
    details, detail_bytes, stopped = [], 0, False

    def retain(scope, collection, row, status, old, new, fields):
        nonlocal detail_bytes, stopped
        if stopped or len(details) == MAX_DETAILS:
            stopped = True
            return
        item = {'scope': scope, 'collection': collection, 'row': row, 'status': status,
                'fields': [{'field': field, 'before': value_view(old.get(field)) if old is not None else None,
                            'after': value_view(new.get(field)) if new is not None else None} for field in fields]}
        encoded = json.dumps(item, ensure_ascii=False, indent=2, allow_nan=False).encode('utf-8')
        size = len(encoded) + 4 * (encoded.count(b'\n') + 1) + 8
        # Reserve indentation and separators in the outer report, not just compact DTO bytes.
        if detail_bytes + size > MAX_DETAIL_BYTES:
            stopped = True
            return
        details.append(item)
        detail_bytes += size

    metadata = [key for key in ('tool_version', 'saved_at', 'tab') if before[key] != after[key]]
    for key in metadata:
        retain('metadata', 'metadata', None, 'changed', before, after, [key])
    panels = {}
    count = len(metadata)
    for scope in CONTRACT['fields']:
        old, new = before['panels'][scope], after['panels'][scope]
        changed_fields = [key for key in CONTRACT['fields'][scope] if old['fields'][key] != new['fields'][key]]
        for key in changed_fields:
            retain(scope, 'fields', None, 'changed', old['fields'], new['fields'], [key])
        summary = {'changed_fields': changed_fields, 'collections': {}, 'change_count': len(changed_fields)}
        collections = []
        if scope in CONTRACT['rows']:
            rule = CONTRACT['rows'][scope]
            collections.append((rule['key'], rule['columns']))
        if scope == 'music':
            collections.extend((key, ['value']) for key in ('avoid', 'deliverables'))
        if scope == 'storyboard':
            collections.append(('motifs', ['id', 'name', 'meaning']))
        for collection, columns in collections:
            left, right = old[collection], new[collection]
            stats = {'baseline_rows': len(left), 'current_rows': len(right),
                     'changed_rows': 0, 'added_rows': max(0, len(right)-len(left)),
                     'removed_rows': max(0, len(left)-len(right))}
            for index in range(max(len(left), len(right))):
                a = left[index] if index < len(left) else None
                b = right[index] if index < len(right) else None
                if collection in ('avoid', 'deliverables'):
                    a = {'value': a} if a is not None else None
                    b = {'value': b} if b is not None else None
                fields = columns if a is None or b is None else [key for key in columns if a[key] != b[key]]
                if not fields:
                    continue
                status = 'added' if a is None else 'removed' if b is None else 'changed'
                if status == 'changed':
                    stats['changed_rows'] += 1
                retain(scope, collection, index+1, status, a, b, fields)
            summary['collections'][collection] = stats
            summary['change_count'] += sum(stats[key] for key in ('changed_rows', 'added_rows', 'removed_rows'))
        panels[scope] = summary
        count += summary['change_count']
    creative_changed = any(panel['change_count'] for panel in panels.values())
    return {'format': 'zoe-draft-comparison', 'schema_version': SCHEMA_VERSION,
            'status': 'different' if count else 'identical', 'creative_changed': creative_changed,
            'metadata_changed': bool(metadata),
            'source': {'encoding': 'draft3_canonical_utf8',
                       'baseline_sha256': hashlib.sha256(before_raw).hexdigest(),
                       'current_sha256': hashlib.sha256(after_raw).hexdigest(),
                       'baseline_bytes': len(before_raw), 'current_bytes': len(after_raw)},
            'metadata': {'changed_fields': metadata}, 'panels': panels, 'change_count': count,
            'details': details, 'details_truncated': len(details) < count, 'review_notes': list(NOTES)}


def markdown(data):
    lines = ['# 完整草稿原值比較', '', f"差異 {data['change_count']} 項；保留明細 {len(data['details'])} 項。",
             f"作品內容有差異：{'是' if data['creative_changed'] else '否'}；metadata 有差異：{'是' if data['metadata_changed'] else '否'}。", '',
             f"基準 SHA-256：{data['source']['baseline_sha256']}", f"目前 SHA-256：{data['source']['current_sha256']}", '']
    for scope, summary in data['panels'].items():
        lines.append(f"- {scope}：{summary['change_count']} 項；原欄位 {len(summary['changed_fields'])} 項。")
        for name, stats in summary['collections'].items():
            lines.append(f"  - {name}：{stats['baseline_rows']} → {stats['current_rows']} 列；變更 {stats['changed_rows']}、新增 {stats['added_rows']}、移除 {stats['removed_rows']}。")
    lines.extend(['', '## 原位置明細', ''])
    for detail in data['details']:
        row = f"[{detail['row']}]" if detail['row'] is not None else ''
        lines.append(f"- {detail['scope']}.{detail['collection']}{row} · {detail['status']}：{', '.join(field['field'] for field in detail['fields'])}")
    if data['details_truncated']:
        lines.append('明細已達容量限制；完整計數保留，原文摘錄及欄位雜湊請讀取 JSON。')
    return '\n'.join(lines + ['', *data['review_notes'], ''])


def bundle(payload):
    data = compare(payload)
    files = {'draft-comparison.json': json.dumps(data, ensure_ascii=False, indent=2, allow_nan=False)+'\n',
             'draft-comparison.md': markdown(data)}
    if sum(len(utf8_bytes(content)) for content in files.values()) > MAX_REPORT_BYTES:
        raise ValueError('草稿比較報告最多256 KiB；沒有替換或保存內容')
    return files


def data_schema():
    from .tool_contracts import object_schema, array_schema
    def obj(properties):
        return object_schema(properties, list(properties), additionalProperties=False)
    integer = {'type': 'integer', 'minimum': 0, 'maximum': 12000}
    sha = {'type': 'string', 'pattern': '^[0-9a-f]{64}$'}
    view = obj({'bytes': {'type': 'integer', 'minimum': 0, 'maximum': MAX_DRAFT_BYTES}, 'sha256': sha,
                'excerpt': {'type': 'string', 'maxLength': EXCERPT_BYTES}, 'excerpt_truncated': {'type': 'boolean'}})
    optional_view = {'anyOf': [view, {'type': 'null'}]}
    detail = obj({'scope': {'enum': ['metadata', *CONTRACT['fields']]},
                  'collection': {'enum': ['metadata', 'fields', 'sections', 'avoid', 'deliverables', 'shots', 'motifs', 'cues']},
                  'row': {'anyOf': [{'type': 'integer', 'minimum': 1, 'maximum': 10000}, {'type': 'null'}]},
                  'status': {'enum': ['changed', 'added', 'removed']},
                  'fields': array_schema(obj({'field': {'type': 'string'}, 'before': optional_view, 'after': optional_view}), 1, 12)})
    panels = {}
    for scope, fields in CONTRACT['fields'].items():
        collections = ([CONTRACT['rows'][scope]['key']] if scope in CONTRACT['rows'] else [])
        collections += ['avoid', 'deliverables'] if scope == 'music' else ['motifs'] if scope == 'storyboard' else []
        panels[scope] = obj({'changed_fields': array_schema({'enum': fields}, 0, len(fields)),
                             'collections': obj({name: obj({key: integer for key in ('baseline_rows', 'current_rows', 'changed_rows', 'added_rows', 'removed_rows')}) for name in collections}),
                             'change_count': integer})
    return obj({'format': {'const': 'zoe-draft-comparison'}, 'schema_version': {'type': 'integer', 'const': SCHEMA_VERSION},
                'status': {'enum': ['identical', 'different']}, 'creative_changed': {'type': 'boolean'},
                'metadata_changed': {'type': 'boolean'},
                'source': obj({'encoding': {'const': 'draft3_canonical_utf8'}, 'baseline_sha256': sha, 'current_sha256': sha,
                               'baseline_bytes': {'type': 'integer', 'minimum': 1, 'maximum': MAX_DRAFT_BYTES},
                               'current_bytes': {'type': 'integer', 'minimum': 1, 'maximum': MAX_DRAFT_BYTES}}),
                'metadata': obj({'changed_fields': array_schema({'enum': ['tool_version', 'saved_at', 'tab']}, 0, 3)}),
                'panels': obj(panels), 'change_count': integer, 'details': array_schema(detail, 0, MAX_DETAILS),
                'details_truncated': {'type': 'boolean'}, 'review_notes': {'const': list(NOTES)}})
