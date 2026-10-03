# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
"""Read-only diagnostics for incomplete lyric tables, preserving source row numbers."""
import copy
import json
import math
from .lyric_timing import normalized_seconds

SCHEMA_VERSION = 1
MAX_ROWS = 10000
MAX_ISSUES = 200
MESSAGES = {
    'missing_time': '時間尚未標記', 'invalid_time': '時間需為非負、有限且可保留毫秒的十進位數字',
    'invalid_end': '結束需晚於開始', 'multiline_text': '每句需為單行歌詞',
    'duplicate_start': '開始時間與另一句相同', 'overlap': '時間與另一句重疊',
    'past_duration': '時間超過作品宣告總長', 'invalid_duration': '作品宣告需為正數且可保留毫秒',
    'no_cues': '尚無逐句內容，請先接續歌詞',
}
NOTES = ['只檢查資料時間，不表示已實聽同步或完成辨識。',
         '原始列順序與文字保留；未填時間不猜測，不裁切或移動句子。']


def descriptor():
    return {'schema_version': SCHEMA_VERSION, 'max_rows': MAX_ROWS, 'max_issue_details': MAX_ISSUES,
            'max_field_budget_bytes': 2*1024*1024, 'field_budget': 'UTF8 JSON string bytes or32 per scalar',
            'read_only': True, 'source_rows': 'one_based_original_order', 'media_generated': False}


def review(payload):
    if not isinstance(payload, dict) or 'cues' not in payload or set(payload) - {'title', 'duration', 'cues'}:
        raise ValueError('校時檢查需含 cues；只接受 title／duration／cues，不接受路徑或版本覆蓋')
    title = payload.get('title', '歌詞校時檢查')
    cues = payload['cues']
    if not isinstance(title, str) or not title.strip() or len(title) > 200:
        raise ValueError('校時檢查名稱需為1–200字')
    if not isinstance(cues, list) or len(cues) > MAX_ROWS:
        raise ValueError('校時檢查最多10000列')
    def scalar(value):
        if value is None or isinstance(value, (str, bool)): return True
        try: return type(value) in (int, float) and math.isfinite(float(value))
        except OverflowError: return False
    duration = payload.get('duration')
    if not scalar(duration): raise ValueError('宣告時長需為文字、有限數字或空值')
    for cue in cues:
        if not isinstance(cue, dict) or set(cue) != {'start', 'end', 'text'} or not isinstance(cue['text'], str) or \
                len(cue['text']) > 2000 or not all(scalar(cue[k]) for k in ('start', 'end')):
            raise ValueError('每列需含 start／end／text；文字最多2000字、時間不可含物件或非有限數字')
    source = {'title': title, 'duration': copy.deepcopy(duration), 'cues': copy.deepcopy(cues)}
    values = [title, duration, *[c[k] for c in cues for k in ('start','end','text')]]
    budget = sum(len(json.dumps(v, ensure_ascii=False).encode('utf-8')) if isinstance(v, str) else 32 for v in values)
    if budget > 2*1024*1024: raise ValueError('校時檢查欄位容量最多2 MiB')
    issues, blocked, count = [], set(), 0
    def add(row, field, code, related=None):
        nonlocal count
        count += 1
        if row: blocked.add(row)
        if len(issues) < MAX_ISSUES:
            issues.append({'row': row, 'field': field, 'code': code, 'related_row': related,
                           'message': MESSAGES[code]})
    def empty(value): return value is None or isinstance(value, str) and not value.strip()
    total = None
    declared = not empty(duration)
    if declared:
        try:
            total = normalized_seconds(duration, '作品宣告', nonnegative=True)
            if total <= 0: raise ValueError()
        except ValueError: total = None; add(0, 'duration', 'invalid_duration')
    if not cues: add(0, 'cues', 'no_cues')
    parsed, timed = [], 0
    for i, cue in enumerate(cues, 1):
        times = {}
        for field in ('start', 'end'):
            if empty(cue[field]): add(i, field, 'missing_time'); times[field] = None
            else:
                try: times[field] = normalized_seconds(cue[field], field, nonnegative=True)
                except ValueError: add(i, field, 'invalid_time'); times[field] = None
        start, end = times['start'], times['end']
        single = '\r' not in cue['text'] and '\n' not in cue['text']
        if not single: add(i, 'text', 'multiline_text')
        if start is not None and end is not None:
            if end <= start: add(i, 'end', 'invalid_end')
            elif single: timed += 1
        if total is not None:
            if start is not None and start >= total: add(i, 'start', 'past_duration')
            if end is not None and end > total: add(i, 'end', 'past_duration')
        parsed.append({'row': i, 'start': start, 'end': end})
    ordered = sorted((c for c in parsed if c['start'] is not None), key=lambda c: c['start'])
    first, duplicate_marked, horizon = {}, set(), None
    for cue in ordered:
        start, row = cue['start'], cue['row']
        if start in first:
            other = first[start]
            if other not in duplicate_marked:
                add(other, 'start', 'duplicate_start', row); duplicate_marked.add(other)
            add(row, 'start', 'duplicate_start', other)
        else: first[start] = row
        if horizon is not None and horizon['end'] > start:
            add(horizon['row'], 'end', 'overlap', row); add(row, 'start', 'overlap', horizon['row'])
        if cue['end'] is not None and cue['end'] > start and (horizon is None or cue['end'] > horizon['end']):
            horizon = cue
    return {'format': 'zoe-lyrics-review', 'schema_version': SCHEMA_VERSION,
            'status': 'needs_correction' if count else 'timing_checked', 'source': source,
            'total_rows': len(cues), 'timed_rows': timed, 'blocking_rows': len(blocked),
            'issue_count': count, 'issues': issues, 'details_truncated': count > len(issues),
            'duration_declared': declared, 'review_notes': list(NOTES)}


def markdown(data):
    lines = ['# 歌詞校時檢查', '', f"共{data['total_rows']}句；局部時間已填{data['timed_rows']}句；需修正{data['blocking_rows']}句；問題{data['issue_count']}項。", '']
    for issue in data['issues']:
        location = f"第{issue['row']}句 {issue['field']}" if issue['row'] else issue['field']
        related = f"（與第{issue['related_row']}句）" if issue['related_row'] else ''
        lines.append(f"- {location}：{issue['message']}{related}")
    if data['details_truncated']: lines.append(f'- 明細僅列前{MAX_ISSUES}項；全部句子已檢查，修正後請重查。')
    if not data['issue_count']: lines.append('時間資料可再驗證建立歌詞包；仍需實聽核對。')
    return '\n'.join(lines + ['', *data['review_notes'], ''])


def review_bundle(payload):
    data = review(payload)
    return {'lyrics-review.json': json.dumps(data, ensure_ascii=False, indent=2, allow_nan=False)+'\n',
            'lyrics-review.md': markdown(data)}
