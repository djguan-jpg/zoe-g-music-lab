# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
"""Compact, source-pinned diagnostics for the existing lyric export grammars."""
import hashlib,json,re
from .lyrics_package import validate_package
from .lyrics_lrc import TIMESTAMP
from .lyric_timing import milliseconds

SCHEMA_VERSION=1
MAX_ISSUES=200
MESSAGES={'leading_time_tag':'歌詞以時間標籤開頭，LRC回讀會解讀為額外時間或拒絕；請以完整JSON保存。',
          'blank_srt_line':'這句只有空白或tab，SRT回讀無法保留；請以完整JSON保存。'}
NOTES=['LRC只保存開始與文字，結束時間回讀時會重新推估。',
       'LRC／SRT不保存名稱、作品總長或校時歷史；完整JSON保存全部歌詞包資料。',
       '只核對本工具的格式表達，不保證其他播放器、實聽、作者或版權。']

def descriptor():
    return {'schema_version':1,'max_cues':10000,'max_issue_details':MAX_ISSUES,'max_package_bytes':2*1024*1024,
            'read_only':True,'source_hash':'SHA256 canonical UTF8 JSON with integer milliseconds; export-source1','media_generated':False}

def checked_source(payload):
    if not isinstance(payload,dict) or set(payload)!={'package'}:
        raise ValueError('格式檢查只接受完整package；不接受路徑、原文或額外欄位')
    return validate_package(payload['package'])

def source_bytes(data):
    timing={k:data['timing'][k] for k in ('duration_source','inferred_end_count','tail_end_inferred')}
    if 'applied_shift_seconds' in data['timing']:timing['applied_shift_ms']=milliseconds(data['timing']['applied_shift_seconds'])
    canonical={'format':'zoe-lyrics-export-source','schema_version':1,'package_schema_version':1,'title':data['title'],
               'duration_ms':milliseconds(data['duration']),'duration_estimated':data['duration_estimated'],
               'cues':[{'start_ms':milliseconds(c['start']),'end_ms':milliseconds(c['end']),'text':c['text']} for c in data['cues']],
               'timing':timing,'review_notes':data['review_notes']}
    try:return json.dumps(canonical,ensure_ascii=False,separators=(',',':'),allow_nan=False).encode('utf-8')
    except UnicodeError:raise ValueError('格式檢查來源含無效Unicode') from None

def review(payload):
    data=checked_source(payload);digest=hashlib.sha256(source_bytes(data)).hexdigest()
    counts={'lrc':0,'srt':0};issues=[]
    for row,cue in enumerate(data['cues'],1):
        for ext,code,risk in [('lrc','leading_time_tag',bool(TIMESTAMP.match(cue['text']))),('srt','blank_srt_line',bool(re.fullmatch(r'[ \t]*',cue['text'])))]:
            if risk:
                counts[ext]+=1
                if len(issues)<MAX_ISSUES:issues.append({'row':row,'format':ext,'code':code,'message':MESSAGES[code]})
    total=sum(counts.values())
    formats={ext:{'checked_cue_fields':fields,'checked_cue_fields_preserved':counts.get(ext,0)==0,
                  'end_times_encoded':ext!='lrc','package_metadata_preserved':ext=='json','issue_count':counts.get(ext,0)}
             for ext,fields in [('json',['start','end','text']),('lrc',['start','text']),('srt',['start','end','text'])]}
    return {'format':'zoe-lyrics-export-review','schema_version':1,'status':'needs_attention' if total else 'checked_cue_fields',
            'source':{'title':data['title'],'duration_ms':milliseconds(data['duration']),'duration_estimated':data['duration_estimated'],
                      'cue_count':len(data['cues']),'sha256':digest},'formats':formats,'issue_count':total,'issues':issues,
            'details_truncated':total>len(issues),'recommended_preservation':'lyrics.json','review_notes':list(NOTES)}

def markdown(data):
    lines=['# 歌詞匯出格式檢查','',f"共{data['source']['cue_count']}句；格式提醒{data['issue_count']}項。",
           f"來源SHA-256：{data['source']['sha256']}",'','建議保存完整lyrics.json；以下格式檢查不改寫原資料。','']
    for issue in data['issues']:lines.append(f"- 第{issue['row']}句 · {issue['format'].upper()}：{issue['message']}")
    if data['details_truncated']:lines.append(f'- 明細僅列前{MAX_ISSUES}項；全部句子已檢查。')
    return '\n'.join(lines+['',*data['review_notes'],''])

def review_bundle(payload):
    data=review(payload)
    return {'lyrics-export-review.json':json.dumps(data,ensure_ascii=False,indent=2,allow_nan=False)+'\n','lyrics-export-review.md':markdown(data)}
