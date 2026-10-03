# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
"""Read-only song field diagnostics for raw draft3 music panels; no planning."""
import copy
import json
from .common import number
from .draft_contract import CONTRACT, exact

SCHEMA_VERSION = 1
MAX_SOURCE_BYTES = 8 * 1024 * 1024
MAX_ISSUES = 200
FIELDS = CONTRACT['fields']['music']
COLUMNS = CONTRACT['rows']['music']['columns']
LABELS = {'music-title': '歌名', 'music-hook': '記憶點', 'music-theme': '故事核心',
          'music-style': '曲風與聲音', 'music-vocal': '人聲表現', 'music-audience': '聽眾',
          'music-bpm': 'BPM', 'music-beats': '每小節拍數', 'music-language': '創作語言',
          'sections': '段落清單', 'deliverables': '交付清單', 'name': '名稱', 'bars': '小節',
          'energy': '能量', 'focus': '敘事任務', 'texture': '聲音配置', 'text': '內容'}
NOTES = ['只檢查歌曲必填欄位、數值範圍與需求清單；仍須完整建立驗證總時長與資料。',
         '原字串、順序與留白保留；沒有補寫創作或呼叫模型，實唱／實聽及素材授權另行核對。']


def descriptor():
    return {'schema_version': SCHEMA_VERSION, 'input': 'raw_draft3_music_panel',
            'max_sections': 40, 'max_requirement_items': 100,
            'max_source_bytes': MAX_SOURCE_BYTES, 'max_issue_details': MAX_ISSUES,
            'read_only': True, 'source_rows': 'one_based_original_order_global_zero',
            'complete_plan_checked': False, 'media_generated': False}


def source(panel):
    def strings(value, keys):
        return exact(value, keys) and all(isinstance(value[k], str) for k in keys)
    if (not exact(panel, ('fields', 'sections', 'avoid', 'deliverables'))
            or not strings(panel['fields'], FIELDS)
            or not isinstance(panel['sections'], list) or len(panel['sections']) > 40
            or any(not strings(row, COLUMNS) for row in panel['sections'])
            or any(not isinstance(panel[k], list) or len(panel[k]) > 100
                   or any(not isinstance(v, str) for v in panel[k]) for k in ('avoid', 'deliverables'))):
        raise ValueError('歌曲待辦來源格式或容量不支援；目前內容保留')
    selected = {'fields': {k: panel['fields'][k] for k in FIELDS},
                'sections': [{k: row[k] for k in COLUMNS} for row in panel['sections']],
                'avoid': list(panel['avoid']), 'deliverables': list(panel['deliverables'])}
    raw = json.dumps(selected, ensure_ascii=False, separators=(',', ':'), allow_nan=False).encode('utf-8')
    if len(raw) > MAX_SOURCE_BYTES:
        raise ValueError('歌曲待辦來源最多8 MiB')
    return selected


def review(payload):
    if not exact(payload, ('panel',)):
        raise ValueError('歌曲欄位檢查只接受 panel 原始歌曲欄位；不接受路徑或版本覆蓋')
    panel = source(payload['panel'])
    issues, blocked, count = [], set(), 0

    def add(scope, row, field, code, message):
        nonlocal count
        count += 1
        if scope == 'sections': blocked.add(row)
        if len(issues) < MAX_ISSUES:
            issues.append({'scope': scope, 'row': row, 'field': field, 'code': code, 'message': message})

    def required(scope, row, field, value):
        if not value.strip():
            add(scope, row, field, 'missing_field', '尚未填寫')
            return False
        return True

    def numeric(scope, row, field, value, low, high, integer=False):
        if not required(scope, row, field, value): return
        try: parsed = number(value, field)
        except ValueError:
            add(scope, row, field, 'invalid_number', '請填寫有限十進位數字')
            return
        if not low <= parsed <= high or integer and not parsed.is_integer():
            add(scope, row, field, 'invalid_range', f'需為 {low}–{high}' + (' 整數' if integer else ''))

    for field in FIELDS:
        if field not in ('music-bpm', 'music-beats', 'music-lyrics'):
            required('fields', 0, field, panel['fields'][field])
    numeric('fields', 0, 'music-bpm', panel['fields']['music-bpm'], 20, 300)
    numeric('fields', 0, 'music-beats', panel['fields']['music-beats'], 1, 12, True)
    if not panel['sections']: add('fields', 0, 'sections', 'no_sections', '尚無段落，請新增')
    for row, section in enumerate(panel['sections'], 1):
        for field in ('name', 'focus', 'texture'): required('sections', row, field, section[field])
        numeric('sections', row, 'bars', section['bars'], 1, 128, True)
        numeric('sections', row, 'energy', section['energy'], 1, 5)
    if not panel['deliverables']:
        add('fields', 0, 'deliverables', 'no_deliverables', '至少需要一個交付項目')
    for scope in ('avoid', 'deliverables'):
        for row, value in enumerate(panel[scope], 1): required(scope, row, 'text', value)
    return {'format': 'zoe-music-review', 'schema_version': SCHEMA_VERSION,
            'status': 'needs_correction' if count else 'fields_checked', 'source': copy.deepcopy(panel),
            'total_sections': len(panel['sections']), 'filled_sections': len(panel['sections']) - len(blocked),
            'issue_count': count, 'issues': issues, 'details_truncated': count > len(issues),
            'review_notes': list(NOTES)}


def markdown(data):
    lines = ['# 歌曲欄位檢查', '',
             f"共{data['total_sections']}段；段落欄位已填{data['filled_sections']}段；待辦{data['issue_count']}項。", '']
    for issue in data['issues']:
        prefix = {'sections': '段落', 'avoid': '避免事項', 'deliverables': '交付項目'}.get(issue['scope'])
        location = (f"{prefix} {issue['row']} · " if prefix else '') + LABELS[issue['field']]
        lines.append(f"- {location}：{issue['message']}")
    if data['details_truncated']:
        lines.append(f'- 明細僅列前{MAX_ISSUES}項；全部欄位已檢查，修正後請重查。')
    if not data['issue_count']:
        lines.append('目前欄位沒有待辦；仍須完整建立與實唱／實聽驗證。')
    return '\n'.join(lines + ['', *data['review_notes'], ''])


def review_bundle(payload):
    data = review(payload)
    return {'music-review.json': json.dumps(data, ensure_ascii=False, indent=2, allow_nan=False) + '\n',
            'music-review.md': markdown(data)}
