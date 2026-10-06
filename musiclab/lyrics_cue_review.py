# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
"""One original lyric row, retaining whole-source timing relationships."""
import json
from .draft_contract import exact
from .lyrics_review import _source, _analyze, MAX_ROWS, MAX_ISSUES, MESSAGES

SCHEMA_VERSION = 1
MAX_REPORT_BYTES = 256 * 1024
NOTES = ['只列選定原句與作品時長的待辦；重複開始與重疊仍核對全部原句，其他句子的自身待辦不在本報告列出。',
         '原文字、時間、句號與順序保留；沒有猜測時間或呼叫模型，零待辦仍須完整歌詞包與實聽核對。']


def descriptor():
    return {'schema_version': 1, 'max_rows': MAX_ROWS, 'max_issue_details': MAX_ISSUES,
            'max_field_budget_bytes': 2*1024*1024, 'max_report_json_bytes': MAX_REPORT_BYTES,
            'read_only': True, 'complete_table_accepted': False, 'media_generated': False,
            'source_rows': 'one_based_original_order', 'relationships': 'whole_source_original_order'}


def review(payload):
    if not exact(payload, ('lyrics', 'row')):raise ValueError('單句檢查只接受 lyrics 與 row 原句號；不接受路徑或版本覆蓋')
    source = _source(payload['lyrics']);row = payload['row']
    if isinstance(row, bool) or not isinstance(row, (int, float)) or not 1 <= row <= len(source['cues']) or int(row) != row:
        raise ValueError('請選擇目前歌詞中有效的原句號')
    row = int(row);checked = _analyze(source, row)
    return {'format': 'zoe-lyrics-cue-review', 'schema_version': 1, 'status': checked['status'],
            'row': row, 'total_rows': len(source['cues']),
            'source': {'title': source['title'], 'duration': source['duration'], 'cue': source['cues'][row-1]},
            'issue_count': checked['issue_count'], 'issues': checked['issues'],
            'details_truncated': checked['details_truncated'], 'duration_declared': checked['duration_declared'],
            'review_notes': list(NOTES)}


def markdown(data):
    labels={'start':'開始','end':'結束','text':'文字','duration':'作品宣告'}
    lines=['# 選定歌詞校時待辦','',f"原句 {data['row']}／共{data['total_rows']}句；待辦{data['issue_count']}項。",'']
    for issue in data['issues']:
        location=f"第{issue['row']}句" if issue['row'] else '作品'
        related=f"（與第{issue['related_row']}句）" if issue['related_row'] else ''
        lines.append(f"- {location} · {labels[issue['field']]}：{issue['message']}{related}")
    if data['details_truncated']:lines.append(f'- 明細僅列前{MAX_ISSUES}項；選定句子的全部關係已檢查，修正後請重查。')
    if not data['issue_count']:lines.append('選定原句時間資料沒有待辦；仍須完整歌詞包與實聽核對。')
    return '\n'.join(lines+['',*data['review_notes'],''])


def review_bundle(payload):
    data=review(payload);content=json.dumps(data,ensure_ascii=False,indent=2,allow_nan=False)+'\n'
    if len(content.encode('utf-8'))>MAX_REPORT_BYTES:raise ValueError('單句報告 JSON 最多256 KiB；原歌詞保留')
    return {'lyrics-cue-review.json':content,'lyrics-cue-review.md':markdown(data)}


def data_schema():
    from .tool_contracts import object_schema,array_schema,payload_schema
    def obj(properties):return object_schema(properties,properties.keys(),additionalProperties=False)
    raw=payload_schema('lyrics_review')['properties'];number={'type':'integer','minimum':1,'maximum':MAX_ROWS}
    issue=obj({'row':{'type':'integer','minimum':0,'maximum':MAX_ROWS},'field':{'enum':['start','end','text','duration']},
               'code':{'enum':[k for k in MESSAGES if k!='no_cues']},'related_row':{'anyOf':[{'type':'null'},number]},'message':{'type':'string'}})
    return obj({'format':{'const':'zoe-lyrics-cue-review'},'schema_version':{'type':'integer','const':1},
                'status':{'enum':['needs_correction','timing_checked']},'row':number,'total_rows':number,
                'source':obj({'title':raw['title'],'duration':raw['duration'],'cue':raw['cues']['items']}),
                'issue_count':{'type':'integer','minimum':0},'issues':array_schema(issue,0,MAX_ISSUES),
                'details_truncated':{'type':'boolean'},'duration_declared':{'type':'boolean'},'review_notes':{'const':list(NOTES)}})
