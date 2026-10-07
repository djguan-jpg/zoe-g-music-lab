# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
"""Bounded read-only literal search over original lyric texts; no clocks or I/O."""
from . import digests as hashlib
import json
import re
from .json_document import utf8_bytes
from .delivery_search import checked_options
from .common import json_text

SCHEMA_VERSION = 1
MAX_ROWS = 10000
MAX_TEXT_CHARACTERS = 2000
MAX_SOURCE_BYTES = 2 * 1024 * 1024
MAX_RESULTS = 50
PREFIX = b'zoe-lyrics-texts-v1\n'
NOTES = ['只查找原文字，不修改歌詞或時間；不代表校時或實聽通過。',
         '每句列出第一個字面命中；句號依原順序，UTF-8 byte位置未正規化。']

def descriptor():
    return {'format':'zoe-lyrics-search','schema_version':1,'max_rows':MAX_ROWS,
            'max_text_characters':MAX_TEXT_CHARACTERS,'max_source_bytes':MAX_SOURCE_BYTES,
            'max_query_bytes':1024,'max_results':MAX_RESULTS,'default_results':20,
            'matching':'exact case-sensitive literal UTF-8; first occurrence per original row',
            'source_hash':'SHA256 of zoe-lyrics-texts-v1 LF plus compact UTF-8 JSON text array',
            'continuation':'start_row greater than1 requires source_sha256',
            'read_only':True,'media_generated':False}

def checked_texts(texts):
    if not isinstance(texts,list) or len(texts)>MAX_ROWS:raise ValueError('原句搜尋最多10000列文字')
    parts=[];size=2
    for value in texts:
        if not isinstance(value,str) or len(value)>MAX_TEXT_CHARACTERS:raise ValueError('每句需為文字，最多2000字')
        utf8_bytes(value,label='搜尋原文')
        part=utf8_bytes(json.dumps(value,ensure_ascii=False),label='搜尋原文')
        size+=len(part)+(1 if parts else 0)
        if size>MAX_SOURCE_BYTES:raise ValueError('原句搜尋來源最多2 MiB UTF-8 JSON')
        parts.append(part)
    return list(texts),b'['+b','.join(parts)+b']'

def checked_request(payload):
    if not isinstance(payload,dict) or not {'texts','query'}<=set(payload) or set(payload)-{'texts','query','start_row','max_results','source_sha256'}:
        raise ValueError('原句搜尋只接受 texts／query／start_row／max_results／source_sha256；不接受路徑或時間編修')
    texts,raw=checked_texts(payload['texts']);pattern=checked_options(payload['query'],0,1)
    start=payload.get('start_row',1);limit=payload.get('max_results',20);pin=payload.get('source_sha256')
    if type(start) is not int or not 1<=start<=len(texts)+1 or type(limit) is not int or not 1<=limit<=MAX_RESULTS:
        raise ValueError('搜尋原句起點或筆數無效；需原句1起與1–50筆')
    if 'source_sha256' in payload and (not isinstance(pin,str) or not re.fullmatch('[0-9a-f]{64}',pin)):
        raise ValueError('搜尋來源SHA需為64字元小寫十六進位')
    if start>1 and pin is None:raise ValueError('接續搜尋需前次來源SHA')
    return texts,raw,pattern,start,limit,pin

def search(payload):
    texts,raw,pattern,start,limit,pin=checked_request(payload)
    sha=hashlib.sha256(PREFIX+raw).hexdigest()
    if pin is not None and pin!=sha:raise ValueError('逐句原文已變更，請重新搜尋；不能接續舊來源')
    count=0;matches=[];next_row=None
    for row,value in enumerate(texts,1):
        found=utf8_bytes(value,label='搜尋原文').find(pattern)
        if found<0:continue
        count+=1
        if row<start:continue
        if len(matches)<limit:matches.append({'row':row,'start_byte':found,'end_byte':found+len(pattern),'text':value})
        elif next_row is None:next_row=matches[-1]['row']+1
    return {'format':'zoe-lyrics-search','schema_version':1,'query':payload['query'],'query_bytes':len(pattern),
            'source_sha256':sha,'source_bytes':len(raw),'total_rows':len(texts),'total_matched_rows':count,
            'start_row':start,'max_results':limit,'matches':matches,'next_row':next_row,'review_notes':list(NOTES)}

def markdown(data):
    lines=['# 原句搜尋','',f"全部{data['total_rows']}句；命中{data['total_matched_rows']}句；此批{len(data['matches'])}句。",
           f"查詢{data['query_bytes']} UTF-8 bytes；來源SHA-256：{data['source_sha256']}。",'']
    for hit in data['matches']:lines.append(f"- 第{hit['row']}句：第一個命中UTF-8 bytes {hit['start_byte']}–{hit['end_byte']}。")
    if data['next_row'] is not None:lines.append(f"- 接續從原句{data['next_row']}開始，需同一来源SHA。")
    return '\n'.join(lines+['',*data['review_notes'],''])

def bundle(payload):
    data=search(payload)
    return {'lyrics-search.json':json_text(data),'lyrics-search.md':markdown(data)}

def data_schema():
    from .tool_contracts import object_schema,array_schema
    integer=lambda minimum,maximum:{'type':'integer','minimum':minimum,'maximum':maximum}
    fields={'format':{'const':'zoe-lyrics-search'},'schema_version':{'type':'integer','const':1},
            'query':{'type':'string','minLength':1,'maxLength':1024},'query_bytes':integer(1,1024),
            'source_sha256':{'type':'string','pattern':'^[0-9a-f]{64}$'},'source_bytes':integer(2,MAX_SOURCE_BYTES),
            'total_rows':integer(0,MAX_ROWS),'total_matched_rows':integer(0,MAX_ROWS),
            'start_row':integer(1,MAX_ROWS+1),'max_results':integer(1,MAX_RESULTS),
            'matches':array_schema(object_schema({'row':integer(1,MAX_ROWS),'start_byte':integer(0,8000),'end_byte':integer(1,8000),'text':{'type':'string','maxLength':MAX_TEXT_CHARACTERS}},('row','start_byte','end_byte','text'),additionalProperties=False),0,MAX_RESULTS),
            'next_row':{'anyOf':[integer(2,MAX_ROWS+1),{'type':'null'}]},'review_notes':{'const':list(NOTES)}}
    return object_schema(fields,tuple(fields),additionalProperties=False)
