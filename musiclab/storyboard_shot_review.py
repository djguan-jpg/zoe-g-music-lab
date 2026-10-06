# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
"""One original storyboard shot, using the whole-board field diagnosis rules."""
import json
from .draft_contract import exact
from .storyboard_review import source, _analyze, LABELS, MAX_SOURCE_BYTES

SCHEMA_VERSION = 1
MAX_REPORT_BYTES = 256 * 1024
NOTES = ['只檢查選定原始鏡號的必填欄位、畫面方向與母題引用；其他鏡頭及全片時間、影格、連戲未在本報告驗證。',
         '原字串、鏡號與母題 ID 保留；沒有補寫創作或呼叫模型，實際音畫與素材授權另行核對。']


def descriptor():
    return {'schema_version': 1, 'input': 'raw_draft3_storyboard_panel_and_original_row',
            'max_shots': 1000, 'max_motifs': 30, 'max_source_bytes': MAX_SOURCE_BYTES,
            'max_issue_details': 32, 'max_report_json_bytes': MAX_REPORT_BYTES, 'read_only': True, 'complete_plan_checked': False,
            'media_generated': False, 'source_rows': 'one_based_original_order'}


def review(payload):
    if not exact(payload, ('panel', 'row')):
        raise ValueError('單鏡檢查只接受 panel 與 row 原始鏡號；不接受路徑或版本覆蓋')
    panel = source(payload['panel'])
    row = payload['row']
    if (isinstance(row, bool) or not isinstance(row, (int, float))
            or not 1 <= row <= len(panel['shots']) or int(row) != row):
        raise ValueError('請選擇目前分鏡中有效的原始鏡號')
    row = int(row)
    checked = _analyze(panel, row)
    assert checked['issue_count'] <= 32 and not checked['details_truncated']
    return {'format': 'zoe-storyboard-shot-review', 'schema_version': 1,
            'status': checked['status'], 'row': row, 'total_shots': len(panel['shots']),
            'source': {'fields': panel['fields'], 'motifs': panel['motifs'], 'shot': panel['shots'][row-1]},
            'issue_count': checked['issue_count'], 'issues': checked['issues'],
            'details_truncated': False, 'review_notes': list(NOTES)}


def markdown(data):
    lines = ['# 選定鏡頭待辦', '', f"鏡頭 {data['row']}／共{data['total_shots']}鏡；待辦{data['issue_count']}項。", '']
    for issue in data['issues']:
        related = f"（母題 {issue['related_row']}）" if issue['related_row'] is not None else ''
        lines.append(f"- 鏡頭 {issue['row']} · {LABELS[issue['field']]}：{issue['message']}{related}")
    if not data['issue_count']:
        lines.append('選定鏡頭欄位沒有待辦；仍須整份分鏡建立與實際音畫驗證。')
    return '\n'.join(lines + ['', *data['review_notes'], ''])


def review_bundle(payload):
    data = review(payload)
    content = json.dumps(data, ensure_ascii=False, indent=2, allow_nan=False)+'\n'
    if len(content.encode('utf-8')) > MAX_REPORT_BYTES:
        raise ValueError('單鏡報告 JSON 最多256 KiB；請縮短選定鏡頭或母題文字，原分鏡保留')
    return {'storyboard-shot-review.json': content,
            'storyboard-shot-review.md': markdown(data)}


def data_schema():
    from .tool_contracts import object_schema, array_schema, payload_schema
    def obj(properties):return object_schema(properties, properties.keys(), additionalProperties=False)
    panel = payload_schema('storyboard_review')['properties']['panel']['properties']
    number = {'type': 'integer', 'minimum': 1, 'maximum': 1000}
    issue = obj({'scope': {'const': 'shots'}, 'row': number, 'field': {'enum': list(panel['shots']['items']['properties'])},
                 'code': {'enum': ['missing_field','invalid_direction','unknown_motif','incomplete_motif','ambiguous_motif']},
                 'message': {'type': 'string'}, 'related_row': {'anyOf': [{'type': 'null'}, {'type': 'integer', 'minimum': 1, 'maximum': 30}]}})
    return obj({'format': {'const': 'zoe-storyboard-shot-review'}, 'schema_version': {'type': 'integer', 'const': 1},
                'status': {'enum': ['needs_correction','fields_checked']}, 'row': number, 'total_shots': number,
                'source': obj({'fields': panel['fields'], 'motifs': panel['motifs'], 'shot': panel['shots']['items']}),
                'issue_count': {'type': 'integer', 'minimum': 0, 'maximum': 32}, 'issues': array_schema(issue, 0, 32),
                'details_truncated': {'const': False}, 'review_notes': {'const': list(NOTES)}})
