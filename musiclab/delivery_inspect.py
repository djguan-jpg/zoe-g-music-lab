# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
"""Read a bounded canonical text delivery ZIP without extracting any paths."""
import hashlib
import io
import struct
import zipfile
from dataclasses import dataclass
from pathlib import Path
from .delivery_package import MAX_ARCHIVE_BYTES, MAX_FILES, MAX_SOURCE_BYTES, MANIFEST_NAME, prepare
from .json_document import decode_json
MAX_MANIFEST_BYTES=32768
MAX_INLINE_FILES_BYTES=512*1024
SUPPORTED_TOOL_VERSIONS=('0.38.0','0.39.0')
INSPECTION_SCHEMA_VERSION=1

def descriptor():
 return {'schema_version':1,'supported_package_schema_versions':[1],
         'supported_tool_versions':list(SUPPORTED_TOOL_VERSIONS),'max_archive_bytes':MAX_ARCHIVE_BYTES,
         'max_manifest_bytes':MAX_MANIFEST_BYTES,'max_inline_files_bytes':MAX_INLINE_FILES_BYTES,
         'extracts_paths':False,'content_validation':'not_performed'}

def _source(source):
 if source is None:raise ValueError('請明確選定交付ZIP；Agent啟動時使用 --delivery-zip，JSON不能選路徑')
 if hasattr(source,'read'):
  source.seek(0);raw=source.read(MAX_ARCHIVE_BYTES+1)
 else:
  with Path(source).open('rb') as selected:raw=selected.read(MAX_ARCHIVE_BYTES+1)
 if not isinstance(raw,bytes) or not 0<len(raw)<=MAX_ARCHIVE_BYTES:raise ValueError('交付ZIP為空或超過容量')
 return raw

def _directory(raw):
 # Bound directory parsing before ZipFile allocates any entry objects.
 if len(raw)<22 or raw[-22:-18]!=b'PK\x05\x06' or not raw.startswith(b'PK\x03\x04'):raise ValueError('不是無註解的標準交付ZIP')
 _,disk,central_disk,disk_count,count,size,offset,comment=struct.unpack_from('<4s4H2LH',raw,len(raw)-22)
 if disk or central_disk or disk_count!=count or not 2<=count<=MAX_FILES+1 or size>32768 or offset+size!=len(raw)-22 or comment:
  raise ValueError('交付ZIP目錄不支援或超過容量；沒有解壓')
 return count

@dataclass(frozen=True)
class InspectedDelivery:
 files:dict
 data:dict

def read(source):
 raw=_source(source);count=_directory(raw)
 try:
  with zipfile.ZipFile(io.BytesIO(raw)) as archive:
   entries=archive.infolist()
   if len(entries)!=count or len({e.filename for e in entries})!=count or entries[-1].filename!=MANIFEST_NAME:raise ValueError('交付ZIP檔案或清單位置不符')
   expanded=0
   for entry in entries:
    if entry.is_dir() or entry.compress_type!=zipfile.ZIP_STORED or entry.flag_bits or entry.extra or entry.comment or entry.create_system!=3 or entry.external_attr!=0o100644<<16 or entry.date_time!=(1980,1,1,0,0,0):raise ValueError('只接受本工具的單層標準文字ZIP')
    if entry.file_size<0 or entry.file_size!=entry.compress_size:raise ValueError('ZIP檔案大小不符')
    expanded+=entry.file_size
   if entries[-1].file_size>MAX_MANIFEST_BYTES or expanded>MAX_SOURCE_BYTES+MAX_MANIFEST_BYTES:raise ValueError('交付清單或文字成果超過容量')
   manifest=decode_json(archive.read(entries[-1]),max_bytes=MAX_MANIFEST_BYTES,allow_bom=False)
   if not isinstance(manifest,dict) or type(manifest.get('schema_version')) is not int or manifest['schema_version']!=1 or manifest.get('tool_version') not in SUPPORTED_TOOL_VERSIONS:raise ValueError('交付清單版本不支援；沒有遷移')
   files={entry.filename:archive.read(entry).decode('utf-8') for entry in entries[:-1]}
   expected=prepare({'scope':manifest.get('scope'),'label':manifest.get('label'),'files':files},tool_version=manifest['tool_version'])
   # Exact producer bytes reject hidden local records, trailing data, altered CRC,
   # inconsistent local/central headers and even silently reformatted manifests.
   if expected.archive!=raw:raise ValueError('交付ZIP內容、清單雜湊或標準封裝不符')
 except (zipfile.BadZipFile,UnicodeError,NotImplementedError,RuntimeError,struct.error):raise ValueError('交付ZIP內容損壞或編碼不支援；目前成果保留') from None
 return InspectedDelivery(files,{'format':'zoe-delivery-inspection','schema_version':1,
   'archive_bytes':len(raw),'archive_sha256':hashlib.sha256(raw).hexdigest(),'manifest':expected.manifest})
