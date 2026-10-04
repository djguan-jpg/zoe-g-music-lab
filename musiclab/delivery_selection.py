# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
"""Pure explicit selection of text from an already fully verified archive."""
from .common import json_text
from .delivery_package import validate_name, MAX_FILES, MAX_SOURCE_BYTES, MANIFEST_NAME

SCHEMA_VERSION=1
MAX_INLINE_FILES_BYTES=512*1024

def descriptor():
    return {'format':'zoe-delivery-file-selection','schema_version':SCHEMA_VERSION,
            'max_files':MAX_FILES,'max_inline_files_bytes':MAX_INLINE_FILES_BYTES,
            'names':'explicit portable original filenames; case-sensitive; no paths',
            'whole_archive_verification':'required before selection','writes_files':False}

def checked_names(names):
    if not isinstance(names,list) or not 1<=len(names)<=MAX_FILES:
        raise ValueError('file_names需為1–64個明確原檔名的清單')
    lowered=set()
    for name in names:
        validate_name(name)
        if name.lower()==MANIFEST_NAME.lower() or name.lower() in lowered:
            raise ValueError('選定原檔名不可重複或指定交付清單')
        lowered.add(name.lower())
    return sorted(names)

def select(files,names):
    names=checked_names(names)
    if not isinstance(files,dict) or not 1<=len(files)<=MAX_FILES:
        raise ValueError('選取需要已核對的完整文字成果')
    if any(name not in files for name in names):
        raise ValueError('ZIP沒有全部選定原檔名；請先核對清單，沒有部分回傳')
    selected={name:files[name] for name in names}
    if any(not isinstance(value,str) for value in selected.values()):
        raise ValueError('選定成果需為原文字')
    try:total=sum(len(text.encode('utf-8')) for text in selected.values())
    except UnicodeError:raise ValueError('選定原文含無效Unicode') from None
    if total>MAX_SOURCE_BYTES:raise ValueError('選定原文超過8MiB')
    summary={'format':'zoe-delivery-file-selection','schema_version':SCHEMA_VERSION,
             'names':names,'file_count':len(names),'source_bytes':total,
             'json_bytes':len(json_text(selected).encode('utf-8'))}
    return selected,summary
