# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
"""Read-only raw storyboard field and motif-reference diagnostics; no timing edits."""
import copy
import json
import re
from .draft_contract import CONTRACT, exact

SCHEMA_VERSION = 1
MAX_SOURCE_BYTES = 8 * 1024 * 1024
MAX_ISSUES = 200
FIELDS = CONTRACT['fields']['storyboard']
COLUMNS = CONTRACT['rows']['storyboard']['columns']
LABELS = {'mv-title': '片名', 'mv-duration': '作品總長', 'mv-fps': 'FPS', 'mv-ratio': '畫幅',
          'mv-style': '視覺基調', 'mv-anchor': '人物一致性', 'name': '母題名稱', 'meaning': '初始意義',
          'start': '開始', 'end': '結束', 'section': '歌曲段落', 'purpose': '敘事用途',
          'visual': '畫面動作', 'camera': '鏡頭運動', 'transition': '尾鏡與轉場', 'motif_id': '使用母題',
          'motif_state': '母題狀態', 'character_state': '人物狀態', 'screen_direction': '畫面方向',
          'motifs': '母題清單', 'shots': '鏡頭清單'}
NOTES = ['只檢查分鏡必填欄位、畫面方向與母題引用；時間、影格與連戲仍須完整建立驗證。',
         '原字串、鏡號、母題 ID 與順序保留；沒有補寫創作或呼叫模型，實際音畫與素材授權另行核對。']


def descriptor():
    return {'schema_version': SCHEMA_VERSION, 'input': 'raw_draft3_storyboard_panel',
            'max_shots': 1000, 'max_motifs': 30, 'max_source_bytes': MAX_SOURCE_BYTES,
            'max_issue_details': MAX_ISSUES, 'read_only': True,
            'source_rows': 'one_based_original_order_global_zero',
            'complete_plan_checked': False, 'media_generated': False}


def source(panel):
    def strings(value, keys):
        return exact(value, keys) and all(isinstance(value[k], str) for k in keys)
    if (not exact(panel, ('fields', 'motifs', 'shots')) or not strings(panel['fields'], FIELDS)
            or not isinstance(panel['motifs'], list) or len(panel['motifs']) > 30
            or any(not strings(m, ('id', 'name', 'meaning'))
                   or not re.fullmatch(r'motif-[1-9][0-9]*', m['id']) for m in panel['motifs'])
            or len({m['id'] for m in panel['motifs']}) != len(panel['motifs'])
            or not isinstance(panel['shots'], list) or len(panel['shots']) > 1000
            or any(not strings(s, COLUMNS) for s in panel['shots'])):
        raise ValueError('分鏡待辦來源格式或容量不支援；目前內容保留')
    selected = {'fields': {k: panel['fields'][k] for k in FIELDS},
                'motifs': [{k: m[k] for k in ('id', 'name', 'meaning')} for m in panel['motifs']],
                'shots': [{k: s[k] for k in COLUMNS} for s in panel['shots']]}
    raw = json.dumps(selected, ensure_ascii=False, separators=(',', ':'), allow_nan=False).encode('utf-8')
    if len(raw) > MAX_SOURCE_BYTES:
        raise ValueError('分鏡待辦來源最多8 MiB')
    return selected


def review(payload):
    if not exact(payload, ('panel',)):
        raise ValueError('分鏡欄位檢查只接受 panel 原始分鏡欄位；不接受路徑或版本覆蓋')
    panel = source(payload['panel'])
    issues, names, motifs, blocked, count = [], {}, {}, set(), 0

    def add(scope, row, field, code, message, related_row=None):
        nonlocal count
        count += 1
        if scope == 'shots': blocked.add(row)
        if len(issues) < MAX_ISSUES:
            issues.append({'scope': scope, 'row': row, 'field': field, 'code': code,
                           'message': message, 'related_row': related_row})

    def missing(scope, row, field):
        add(scope, row, field, 'missing_field', '尚未填寫')

    for field in FIELDS:
        if not panel['fields'][field].strip(): missing('fields', 0, field)
    if not panel['motifs']:
        add('fields', 0, 'motifs', 'no_motifs', '尚無母題，請先建立母題')
    for row, motif in enumerate(panel['motifs'], 1):
        name, meaning = motif['name'].strip(), motif['meaning'].strip()
        if not name: missing('motifs', row, 'name')
        if not meaning: missing('motifs', row, 'meaning')
        motifs[motif['id']] = {'row': row, 'name': name, 'meaning': meaning}
        if name: names.setdefault(name, []).append(row)
    for rows in names.values():
        if len(rows) > 1:
            for row in rows:
                add('motifs', row, 'name', 'duplicate_motif_name', '母題名稱重複；請明確區分引用',
                    next(r for r in rows if r != row))
    if not panel['shots']:
        add('fields', 0, 'shots', 'no_shots', '尚無鏡頭，請新增或接續分鏡起稿')
    for row, shot in enumerate(panel['shots'], 1):
        for field in COLUMNS:
            if field not in ('motif_id', 'change_reason') and not shot[field].strip():
                missing('shots', row, field)
        if shot['screen_direction'].strip() and shot['screen_direction'] not in ('left', 'right', 'neutral'):
            add('shots', row, 'screen_direction', 'invalid_direction', '畫面方向需選向左、向右或正面／中性')
        motif = motifs.get(shot['motif_id'])
        if not shot['motif_id']: missing('shots', row, 'motif_id')
        elif motif is None:
            add('shots', row, 'motif_id', 'unknown_motif', '引用的母題已不在清單，請重新選擇')
        elif not motif['name'] or not motif['meaning']:
            add('shots', row, 'motif_id', 'incomplete_motif', '所選母題尚未補齊名稱或初始意義', motif['row'])
        elif len(names[motif['name']]) > 1:
            add('shots', row, 'motif_id', 'ambiguous_motif', '所選母題名稱重複，請先區分母題', motif['row'])
    return {'format': 'zoe-storyboard-review', 'schema_version': SCHEMA_VERSION,
            'status': 'needs_correction' if count else 'fields_checked', 'source': copy.deepcopy(panel),
            'total_shots': len(panel['shots']), 'filled_shots': len(panel['shots']) - len(blocked),
            'total_motifs': len(panel['motifs']), 'issue_count': count, 'issues': issues,
            'details_truncated': count > len(issues), 'review_notes': list(NOTES)}


def markdown(data):
    lines = ['# 分鏡欄位檢查', '',
             f"共{data['total_shots']}鏡；單鏡欄位已填{data['filled_shots']}鏡；共{data['total_motifs']}個母題；待辦{data['issue_count']}項。", '']
    for issue in data['issues']:
        prefix = {'shots': '鏡頭', 'motifs': '母題'}.get(issue['scope'])
        location = (f"{prefix} {issue['row']} · " if prefix else '') + LABELS[issue['field']]
        related = f"（母題 {issue['related_row']}）" if issue['related_row'] is not None else ''
        lines.append(f"- {location}：{issue['message']}{related}")
    if data['details_truncated']:
        lines.append(f'- 明細僅列前{MAX_ISSUES}項；全部鏡頭與母題已檢查，修正後請重查。')
    if not data['issue_count']:
        lines.append('目前欄位沒有待辦；仍須完整建立與實際音畫驗證。')
    return '\n'.join(lines + ['', *data['review_notes'], ''])


def review_bundle(payload):
    data = review(payload)
    return {'storyboard-review.json': json.dumps(data, ensure_ascii=False, indent=2, allow_nan=False) + '\n',
            'storyboard-review.md': markdown(data)}
