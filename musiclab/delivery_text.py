# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
"""Bounded UTF-8 windows of original text; byte positions never guessed."""
import re
from .delivery_package import validate_name, MANIFEST_NAME, MAX_SOURCE_BYTES

SCHEMA_VERSION = 1
MAX_WINDOW_BYTES = 16384


def descriptor():
    return {'format': 'zoe-delivery-text-window', 'schema_version': SCHEMA_VERSION,
            'max_window_bytes': MAX_WINDOW_BYTES, 'positions': 'UTF-8 byte boundaries',
            'continuation': 'nonzero start requires the verified archive SHA-256',
            'whole_archive_verification': 'required before every window', 'writes_files': False}


def checked_request(value):
    if not isinstance(value, dict) or set(value)-{'file_name', 'start_byte', 'max_bytes', 'archive_sha256'} or 'file_name' not in value:
        raise ValueError('text_window需為明確原檔名與UTF-8位置；不能含路徑或未知欄位')
    name=validate_name(value['file_name'])
    if name.lower()==MANIFEST_NAME.lower():raise ValueError('交付清單不是可選原文')
    start=value.get('start_byte',0);limit=value.get('max_bytes',MAX_WINDOW_BYTES)
    if type(start) is not int or not 0<=start<=MAX_SOURCE_BYTES or type(limit) is not int or not 4<=limit<=MAX_WINDOW_BYTES:
        raise ValueError('原文起點需為非負整數，單段容量需為4–16384 bytes')
    pinned=value.get('archive_sha256')
    if ('archive_sha256' in value and (not isinstance(pinned,str) or not re.fullmatch('[0-9a-f]{64}',pinned))) or (start and pinned is None):
        raise ValueError('接續原文需提供前次核對的archive_sha256，不能混用變更來源')
    return {'file_name':name,'start_byte':start,'max_bytes':limit,**({'archive_sha256':pinned} if pinned is not None else {})}


def window(text,start_byte=0,max_bytes=MAX_WINDOW_BYTES):
    if not isinstance(text,str) or len(text)>MAX_SOURCE_BYTES:raise ValueError('原文需為最多8MiB的有效文字')
    if type(start_byte) is not int or type(max_bytes) is not int or not 0<=start_byte<=MAX_SOURCE_BYTES or not 4<=max_bytes<=MAX_WINDOW_BYTES:
        raise ValueError('原文分段位置或容量無效')
    try:raw=text.encode('utf-8')
    except UnicodeError:raise ValueError('原文含無效Unicode，沒有替換') from None
    total=len(raw)
    if total>MAX_SOURCE_BYTES or start_byte>total:raise ValueError('原文分段位置或來源超過容量')
    if start_byte<total and raw[start_byte]&0xc0==0x80:raise ValueError('原文起點不是UTF-8字元邊界，沒有調整位置')
    end=min(start_byte+max_bytes,total)
    while end<total and raw[end]&0xc0==0x80:end-=1
    return {'text':raw[start_byte:end].decode('utf-8'),'start_byte':start_byte,'end_byte':end,
            'source_bytes':total,'max_bytes':max_bytes,'next_byte':end if end<total else None}


def select(inspected,request):
    request=checked_request(request);data=inspected.data;name=request['file_name']
    if request.get('archive_sha256',data['archive_sha256'])!=data['archive_sha256']:
        raise ValueError('交付ZIP已變更，原文位置不能接續；請從新來源重新核對')
    if name not in inspected.files:raise ValueError('ZIP沒有選定原文檔案，沒有部分回傳')
    record=next(item for item in data['manifest']['files'] if item['name']==name)
    part=window(inspected.files[name],request['start_byte'],request['max_bytes'])
    return {'format':'zoe-delivery-text-window','schema_version':SCHEMA_VERSION,'file_name':name,
            'archive_sha256':data['archive_sha256'],'file_sha256':record['sha256'],**part}
