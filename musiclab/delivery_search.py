# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
"""Literal nonoverlapping search in verified original UTF-8; no regex or writes."""
from .delivery_text import encode_original, checked_request as checked_window
from .delivery_package import MAX_SOURCE_BYTES

SCHEMA_VERSION = 1
MAX_QUERY_BYTES = 1024
MAX_MATCHES = 50
DEFAULT_MATCHES = 20


def descriptor():
    return {'format':'zoe-delivery-text-search','schema_version':SCHEMA_VERSION,
            'max_query_bytes':MAX_QUERY_BYTES,'max_matches':MAX_MATCHES,'default_matches':DEFAULT_MATCHES,
            'matching':'exact literal nonoverlapping UTF-8; no case folding or normalization',
            'continuation':'nonzero start requires verified archive SHA-256',
            'whole_archive_verification':'required before every search','writes_files':False}


def checked_options(query,start_byte=0,max_matches=DEFAULT_MATCHES):
    if not isinstance(query,str) or not 1<=len(query)<=MAX_QUERY_BYTES:
        raise ValueError('搜尋字需為非空原字串，最多1024 UTF-8 bytes')
    try:pattern=query.encode('utf-8')
    except UnicodeError:raise ValueError('搜尋字含無效Unicode，沒有替換') from None
    if len(pattern)>MAX_QUERY_BYTES:raise ValueError('搜尋字超過1024 UTF-8 bytes')
    if type(start_byte) is not int or not 0<=start_byte<=MAX_SOURCE_BYTES or type(max_matches) is not int or not 1<=max_matches<=MAX_MATCHES:
        raise ValueError('搜尋起點或筆數無效；需UTF-8字元邊界與1–50筆')
    return pattern


def checked_request(value):
    if not isinstance(value,dict) or set(value)-{'file_name','query','start_byte','max_matches','archive_sha256'} or not {'file_name','query'}<=set(value):
        raise ValueError('text_search需為明確原檔名與字面搜尋字；不接受未知欄位')
    original=checked_window({k:v for k,v in value.items() if k in {'file_name','start_byte','archive_sha256'}})
    limit=value.get('max_matches',DEFAULT_MATCHES)
    checked_options(value['query'],original['start_byte'],limit)
    return {k:v for k,v in original.items() if k!='max_bytes'}|{'query':value['query'],'max_matches':limit}


def search(text,query,start_byte=0,max_matches=DEFAULT_MATCHES):
    pattern=checked_options(query,start_byte,max_matches);raw=encode_original(text)
    if start_byte>len(raw):raise ValueError('搜尋起點超過原文')
    if start_byte<len(raw) and raw[start_byte]&0xc0==0x80:raise ValueError('搜尋起點不是UTF-8字元邊界，沒有調整')
    matches=[];cursor=start_byte;next_byte=None
    while True:
        found=raw.find(pattern,cursor)
        if found<0:break
        if len(matches)==max_matches:
            next_byte=matches[-1]['end_byte'];break
        cursor=found+len(pattern);matches.append({'start_byte':found,'end_byte':cursor})
    return {'query':query,'query_bytes':len(pattern),'start_byte':start_byte,'source_bytes':len(raw),
            'max_matches':max_matches,'matches':matches,'next_byte':next_byte}


def select(inspected,request):
    request=checked_request(request);data=inspected.data;name=request['file_name']
    if request.get('archive_sha256',data['archive_sha256'])!=data['archive_sha256']:
        raise ValueError('交付ZIP已變更，搜尋不能接續；請重新核對原文')
    if name not in inspected.files:raise ValueError('ZIP沒有選定原文檔案，沒有部分搜尋')
    record=next(item for item in data['manifest']['files'] if item['name']==name)
    found=search(inspected.files[name],request['query'],request['start_byte'],request['max_matches'])
    return {'format':'zoe-delivery-text-search','schema_version':SCHEMA_VERSION,'file_name':name,
            'archive_sha256':data['archive_sha256'],'file_sha256':record['sha256'],**found}
