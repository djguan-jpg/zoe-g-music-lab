# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
"""One original song section, using the whole-song field diagnosis rules."""
import json
from .draft_contract import exact
from .music_review import source, _analyze, LABELS, MAX_SOURCE_BYTES

SCHEMA_VERSION = 1
MAX_REPORT_BYTES = 256 * 1024
NOTES = ['只檢查選定原段落的名稱、小節、能量、敘事任務與聲音配置；其他段落、歌曲全域欄位及總時長未在本報告驗證。',
         '原字串、段落號與順序保留；沒有補寫創作或呼叫模型，實唱／實聽及素材授權另行核對。']


def descriptor():
    return {'schema_version': SCHEMA_VERSION, 'input': 'raw_draft3_music_panel_and_original_row',
            'max_sections': 40, 'max_source_bytes': MAX_SOURCE_BYTES, 'max_issue_details': 5,
            'max_report_json_bytes': MAX_REPORT_BYTES, 'read_only': True,
            'complete_plan_checked': False, 'media_generated': False, 'source_rows': 'one_based_original_order'}


def review(payload):
    if not exact(payload, ('panel', 'row')):
        raise ValueError('單段檢查只接受 panel 與 row 原段落號；不接受路徑或版本覆蓋')
    panel = source(payload['panel'])
    row = payload['row']
    if (isinstance(row, bool) or not isinstance(row, (int, float))
            or not 1 <= row <= len(panel['sections']) or int(row) != row):
        raise ValueError('請選擇目前歌曲中有效的原段落號')
    row = int(row)
    checked = _analyze(panel, row)
    assert checked['issue_count'] <= 5 and not checked['details_truncated']
    return {'format': 'zoe-music-section-review', 'schema_version': SCHEMA_VERSION,
            'status': checked['status'], 'row': row, 'total_sections': len(panel['sections']),
            'source': {'section': dict(panel['sections'][row-1])},
            'issue_count': checked['issue_count'], 'issues': checked['issues'],
            'details_truncated': False, 'review_notes': list(NOTES)}


def markdown(data):
    lines = ['# 選定歌曲段落待辦', '', f"段落 {data['row']}／共{data['total_sections']}段；待辦{data['issue_count']}項。", '']
    for issue in data['issues']:
        lines.append(f"- 段落 {issue['row']} · {LABELS[issue['field']]}：{issue['message']}")
    if not data['issue_count']:
        lines.append('選定段落五個欄位沒有待辦；仍須整首歌曲建立與實唱／實聽驗證。')
    return '\n'.join(lines + ['', *data['review_notes'], ''])


def review_bundle(payload):
    data = review(payload)
    content = json.dumps(data, ensure_ascii=False, indent=2, allow_nan=False)+'\n'
    if len(content.encode('utf-8')) > MAX_REPORT_BYTES:
        raise ValueError('單段報告 JSON 最多256 KiB；請縮短選定段落文字，原歌曲保留')
    return {'music-section-review.json': content, 'music-section-review.md': markdown(data)}


def data_schema():
    from .tool_contracts import object_schema, array_schema, payload_schema
    def obj(properties): return object_schema(properties, properties.keys(), additionalProperties=False)
    section = payload_schema('music_review')['properties']['panel']['properties']['sections']['items']
    number = {'type': 'integer', 'minimum': 1, 'maximum': 40}
    issue = obj({'scope': {'const': 'sections'}, 'row': number, 'field': {'enum': list(section['properties'])},
                 'code': {'enum': ['missing_field', 'invalid_number', 'invalid_range']}, 'message': {'type': 'string'}})
    return obj({'format': {'const': 'zoe-music-section-review'}, 'schema_version': {'type': 'integer', 'const': 1},
                'status': {'enum': ['needs_correction', 'fields_checked']}, 'row': number, 'total_sections': number,
                'source': obj({'section': section}), 'issue_count': {'type': 'integer', 'minimum': 0, 'maximum': 5},
                'issues': array_schema(issue, 0, 5), 'details_truncated': {'const': False}, 'review_notes': {'const': list(NOTES)}})
