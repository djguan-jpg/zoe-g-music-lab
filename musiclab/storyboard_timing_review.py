# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
"""Versioned raw timing-source report; adapters and DOM own all I/O."""
import copy
import json
from .draft_contract import exact
from .storyboard_timing import diagnose, MAX_ISSUES

SCHEMA_VERSION = 1
MAX_SOURCE_BYTES = 8 * 1024 * 1024
FIELDS = ('mv-duration', 'mv-fps')
LABELS = {'mv-duration': '作品總長', 'mv-fps': 'FPS', 'shots': '鏡頭清單', 'start': '開始', 'end': '結束'}
NOTES = ['只檢查原秒數、FPS與影格覆蓋；局部有效秒數列不代表整份時間通過。',
         '原字串、鏡號與順序保留；不排序、補時間、調整FPS或裁切。零待辦仍須完整創作／連戲與實際音畫驗證。']


def descriptor():
    return dict(schema_version=SCHEMA_VERSION, input='raw_draft3_storyboard_timing_fields',
                max_shots=1000, max_source_bytes=MAX_SOURCE_BYTES, max_issue_details=MAX_ISSUES,
                read_only=True, source_rows='one_based_original_order_global_zero',
                complete_plan_checked=False, media_generated=False)


def source(panel):
    def strings(value, keys): return exact(value, keys) and all(isinstance(value[k], str) for k in keys)
    if (not exact(panel, ('fields', 'shots')) or not strings(panel['fields'], FIELDS)
            or not isinstance(panel['shots'], list) or len(panel['shots']) > 1000
            or any(not strings(s, ('start', 'end')) for s in panel['shots'])):
        raise ValueError('分鏡時間來源格式或容量不支援；目前內容保留')
    selected = dict(fields={key: panel['fields'][key] for key in FIELDS},
                    shots=[{key: shot[key] for key in ('start', 'end')} for shot in panel['shots']])
    raw = json.dumps(selected, ensure_ascii=False, separators=(',', ':'), allow_nan=False).encode('utf-8')
    if len(raw) > MAX_SOURCE_BYTES: raise ValueError('分鏡時間來源最多8 MiB')
    return selected


def timing_panel(storyboard_panel):
    """Explicit projection after a caller validates the complete draft3 shape."""
    return source(dict(fields={key: storyboard_panel['fields'][key] for key in FIELDS},
                       shots=[{key: shot[key] for key in ('start', 'end')} for shot in storyboard_panel['shots']]))


def review(payload):
    if not exact(payload, ('panel',)):
        raise ValueError('分鏡時間檢查只接受 panel 原時間欄位；不接受路徑或版本覆蓋')
    panel = source(payload['panel'])
    data = diagnose(panel['fields']['mv-duration'], panel['fields']['mv-fps'], panel['shots'])
    return dict(format='zoe-storyboard-timing-review', schema_version=SCHEMA_VERSION,
                status='needs_correction' if data['issue_count'] else 'timing_checked',
                source=copy.deepcopy(panel), **data, review_notes=list(NOTES))


def markdown(data):
    frames = '尚無可用宣告影格數' if data['total_frames'] is None else f"宣告{data['total_frames']}幀（結束不含）"
    lines = ['# 分鏡時間檢查', '', f"共{data['total_shots']}鏡；局部有效秒數{data['timed_shots']}鏡；{frames}；待辦{data['issue_count']}項。", '']
    for issue in data['issues']:
        location = (f"鏡頭 {issue['row']} · " if issue['scope'] == 'shots' else '') + LABELS[issue['field']]
        related = f"（前鏡 {issue['related_row']}）" if issue['related_row'] is not None else ''
        lines.append(f"- {location}：{issue['message']}{related}")
    if data['details_truncated']: lines.append('- 明細僅列前200項；全部鏡頭已檢查，修正後請重查。')
    if not data['issue_count']: lines.append('目前時間沒有待辦；仍須完整創作與實際音畫驗證。')
    return '\n'.join(lines + ['', *data['review_notes'], ''])


def review_bundle(payload):
    data = review(payload)
    return {'storyboard-timing-review.json': json.dumps(data, ensure_ascii=False, indent=2, allow_nan=False)+'\n',
            'storyboard-timing-review.md': markdown(data)}
