# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
"""Bounded, exact-name text comparison; never edits or merges source files."""
from . import digests as hashlib
from .delivery_package import validate, SCOPES, MAX_FILES, MAX_SOURCE_BYTES

def descriptor():
    return {'schema_version':1,'max_baseline_files':MAX_FILES,'max_comparison_files':MAX_FILES*2,
            'max_baseline_bytes':MAX_SOURCE_BYTES,'comparison':'exact names and UTF-8 bytes',
            'merges_files':False,'content_validation':'not_performed'}

def baseline(value):
    if not isinstance(value,dict) or set(value)!={'scope','files'} or value['scope'] not in SCOPES:
        raise ValueError('比較基準只能含工作台scope與原文字files；不能指定路徑')
    if type(value['files']) is dict and not value['files']:
        return {'scope':value['scope'],'files':{}}
    checked=validate({'scope':value['scope'],'files':value['files']})
    return {'scope':checked['scope'],'files':checked['files']}

def compare(previous,incoming):
    old=baseline(previous);new=baseline(incoming)
    if old['scope']!=new['scope']:raise ValueError('比較基準與交付ZIP必須屬於同一工作台')
    def records(files):
        return {name:{'bytes':len(text.encode('utf-8')),'sha256':hashlib.sha256(text.encode('utf-8')).hexdigest()}
                for name,text in files.items()}
    before=records(old['files']);after=records(new['files']);counts=dict.fromkeys(('added','changed','removed','unchanged'),0);files=[]
    for name in sorted(set(before)|set(after)):
        status='added' if name not in before else 'removed' if name not in after else 'unchanged' if old['files'][name]==new['files'][name] else 'changed'
        counts[status]+=1;files.append({'name':name,'status':status,'before':before.get(name),'incoming':after.get(name)})
    return {'format':'zoe-delivery-comparison','schema_version':1,'scope':old['scope'],
            'baseline':{'file_count':len(before),'source_bytes':sum(x['bytes'] for x in before.values())},
            'incoming':{'file_count':len(after),'source_bytes':sum(x['bytes'] for x in after.values())},
            'counts':counts,'files':files}
