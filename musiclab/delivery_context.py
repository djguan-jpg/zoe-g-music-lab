# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
"""Bounded exact UTF-8 context around already located original matches."""
FLANK_BYTES = 64
SCHEMA_VERSION = 1


def descriptor():
    return {'format':'zoe-delivery-match-context','schema_version':SCHEMA_VERSION,
            'flank_bytes':FLANK_BYTES,'max_item_bytes':1024+2*FLANK_BYTES,
            'original_text':True,'writes_files':False}


def contexts(raw,matches):
    if not isinstance(raw,bytes) or len(raw)>8388608 or not isinstance(matches,list) or len(matches)>50:
        raise ValueError('前後文來源或筆數超過容量')
    items=[]
    for match in matches:
        first,last=match['start_byte'],match['end_byte']
        if type(first) is not int or type(last) is not int or not 0<=first<last<=len(raw) or last-first>1024:
            raise ValueError('命中位置無效，沒有建立前後文')
        if (first<len(raw) and raw[first]&0xc0==0x80) or (last<len(raw) and raw[last]&0xc0==0x80):
            raise ValueError('命中位置不是UTF-8字元邊界')
        start=max(0,first-FLANK_BYTES);end=min(len(raw),last+FLANK_BYTES)
        while start<first and raw[start]&0xc0==0x80:start+=1
        while end<len(raw) and raw[end]&0xc0==0x80:end-=1
        items.append({'start_byte':start,'end_byte':end,'match_start_byte':first,'match_end_byte':last,
                      'text':raw[start:end].decode('utf-8')})
    return {'format':'zoe-delivery-match-context','schema_version':SCHEMA_VERSION,'flank_bytes':FLANK_BYTES,'items':items}
