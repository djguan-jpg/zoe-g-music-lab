# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
"""Deterministic comparison evidence files; no original text, paths or media."""
import copy,re
from . import __version__
from .common import json_text
from .delivery_package import SCOPES,MAX_ARCHIVE_BYTES,MAX_SOURCE_BYTES,validate
from .delivery_inspect import SUPPORTED_TOOL_VERSIONS
MAX_REPORT_BYTES=256*1024
def descriptor():
    return {'schema_version':1,'format':'zoe-delivery-comparison-report','max_report_bytes':MAX_REPORT_BYTES,
            'contains_original_text':False,'needs_review':True,'files':['delivery-comparison.json','delivery-comparison.md']}
def exact(value,keys):return isinstance(value,dict) and set(value)==set(keys)
def integer(value,limit):return type(value) is int and 0<=value<=limit
def sha(value):return isinstance(value,str) and re.fullmatch('[0-9a-f]{64}',value) is not None
def record(value):return exact(value,('bytes','sha256')) and integer(value['bytes'],MAX_SOURCE_BYTES) and sha(value['sha256'])
def report(source,comparison):
    if not exact(source,('format','schema_version','archive_bytes','archive_sha256','manifest')) or source['format']!='zoe-delivery-inspection' or type(source['schema_version']) is not int or source['schema_version']!=1 or not integer(source['archive_bytes'],MAX_ARCHIVE_BYTES) or source['archive_bytes']==0 or not sha(source['archive_sha256']):
        raise ValueError('比較報告來源摘要無效')
    m=source['manifest']
    if not exact(m,('format','schema_version','tool_version','scope','label','source_type','content_validation','file_count','source_bytes','files')) or m['format']!='zoe-delivery-manifest' or type(m['schema_version']) is not int or m['schema_version']!=1 or m['tool_version'] not in SUPPORTED_TOOL_VERSIONS or m['source_type']!='provided_text_files' or m['content_validation']!='not_performed' or not isinstance(m['files'],list) or not 1<=len(m['files'])<=64:
        raise ValueError('比較報告交付清單不支援')
    incoming={}
    for f in m['files']:
        if not exact(f,('name','bytes','sha256')) or not isinstance(f['name'],str) or f['name'] in incoming or not record({'bytes':f['bytes'],'sha256':f['sha256']}):raise ValueError('比較報告清單檔案無效')
        incoming[f['name']]={'bytes':f['bytes'],'sha256':f['sha256']}
    validate({'scope':m['scope'],'label':m['label'],'files':dict.fromkeys(incoming,'')})
    if list(incoming)!=sorted(incoming) or type(m['file_count']) is not int or m['file_count']!=len(incoming) or type(m['source_bytes']) is not int or m['source_bytes']!=sum(f['bytes'] for f in incoming.values()) or m['source_bytes']>MAX_SOURCE_BYTES:raise ValueError('比較報告清單合計不符')
    if not exact(comparison,('format','schema_version','scope','baseline','incoming','counts','files')) or comparison['format']!='zoe-delivery-comparison' or type(comparison['schema_version']) is not int or comparison['schema_version']!=1 or comparison['scope']!=m['scope'] or not isinstance(comparison['files'],list) or not 1<=len(comparison['files'])<=128:raise ValueError('比較報告比較版本或工作台不符')
    before={};after={};names=[];counts=dict.fromkeys(('added','changed','removed','unchanged'),0)
    for f in comparison['files']:
        if not exact(f,('name','status','before','incoming')) or not isinstance(f['name'],str):raise ValueError('比較報告檔案欄位無效')
        names.append(f['name']);a=f['before'];b=f['incoming']
        if (a is not None and not record(a)) or (b is not None and not record(b)) or (a is None and b is None):raise ValueError('比較報告原文摘要無效')
        status='added' if a is None else 'removed' if b is None else 'unchanged' if a==b else 'changed'
        if f['status']!=status:raise ValueError('比較報告變更狀態不符')
        counts[status]+=1
        if a is not None:before[f['name']]=a
        if b is not None:after[f['name']]=b
    if names!=sorted(set(names)) or after!=incoming or len(before)>64:raise ValueError('比較報告來源或順序不符')
    if before:validate({'scope':m['scope'],'files':dict.fromkeys(before,'')})
    for key,files in [('baseline',before),('incoming',after)]:
        value=comparison[key];total=sum(f['bytes'] for f in files.values())
        if not exact(value,('file_count','source_bytes')) or type(value['file_count']) is not int or value['file_count']!=len(files) or type(value['source_bytes']) is not int or value['source_bytes']!=total or total>MAX_SOURCE_BYTES:raise ValueError('比較報告合計不符')
    if not exact(comparison['counts'],counts) or any(type(comparison['counts'][k]) is not int or comparison['counts'][k]!=v for k,v in counts.items()):raise ValueError('比較報告計數不符')
    return {'format':'zoe-delivery-comparison-report','schema_version':1,'tool_version':__version__,
            'source':copy.deepcopy(source),'comparison':copy.deepcopy(comparison),'needs_review':True}
def literal(value):
    out=[]
    for char in value:
        if ord(char)<32 or ord(char)==127:out.append({'\n':'\\n','\r':'\\r','\t':'\\t'}.get(char,'\\u'+format(ord(char),'04x')))
        elif char=='&':out.append('&amp;')
        elif char=='<':out.append('&lt;')
        elif char=='>':out.append('&gt;')
        elif char in '\\`*_{}[]()#!|':out.append('\\'+char)
        else:out.append(char)
    return ''.join(out)
def files(source,comparison):
    data=report(source,comparison);m=source['manifest'];c=comparison['counts'];labels={'added':'新增','changed':'變更','removed':'移除','unchanged':'相同'}
    lines=['# 交付差異審閱報告','',f"工作台：{m['scope']}",f"來源工具：{m['tool_version']}",f"來源說明：{literal(m['label'])}",f"ZIP bytes：{source['archive_bytes']}",f"ZIP SHA-256：{source['archive_sha256']}",'',f"新增 {c['added']}／變更 {c['changed']}／移除 {c['removed']}／相同 {c['unchanged']}",'','| 檔案 | 狀態 | 原 bytes | 原 SHA-256 | 新 bytes | 新 SHA-256 |','| --- | --- | ---: | --- | ---: | --- |']
    for f in comparison['files']:
        a=f['before'];b=f['incoming'];lines.append(f"| `{f['name']}` | {labels[f['status']]} | {a['bytes'] if a is not None else '不存在'} | {a['sha256'] if a is not None else '—'} | {b['bytes'] if b is not None else '不存在'} | {b['sha256'] if b is not None else '—'} |")
    lines+=['','依原始UTF-8位元組與精確檔名比較；載入會取代全部成果，不合併。','只保存來源與差異摘要；原文、音檔、路徑及時間戳不包含。','雜湊與差異不驗證作者、素材權利、創作品質或媒體接受；仍需人工審閱。','']
    result={'delivery-comparison.json':json_text(data),'delivery-comparison.md':'\n'.join(lines)}
    if sum(len(value.encode('utf-8')) for value in result.values())>MAX_REPORT_BYTES:raise ValueError('比較報告超過256KiB')
    return result
