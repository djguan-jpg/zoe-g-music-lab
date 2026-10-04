# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
"""Deterministic text delivery archive; no paths, media or creative validation."""
import base64
import hashlib
import io
import re
import zipfile
from copy import deepcopy
from dataclasses import dataclass
from . import __version__
from .common import json_text
from .json_document import decode_json

SCHEMA_VERSION = 1
MAX_FILES = 64
MAX_SOURCE_BYTES = 8 * 1024 * 1024
MAX_REQUEST_BYTES = 32 * 1024 * 1024
MAX_ARCHIVE_BYTES = MAX_SOURCE_BYTES + 65536
MAX_INLINE_BYTES = 512 * 1024
MANIFEST_NAME = 'DELIVERY-MANIFEST.json'
ARCHIVE_NAME = 'zoe-delivery.zip'
SCOPES = ('music', 'storyboard', 'lyrics', 'audio')
EXTENSIONS = {'.json', '.md', '.txt', '.csv', '.html', '.js', '.css', '.lrc', '.srt'}
DEVICES = {'CON', 'PRN', 'AUX', 'NUL', *('COM'+str(i) for i in range(1, 10)), *('LPT'+str(i) for i in range(1, 10))}


def descriptor():
    return {'schema_version': SCHEMA_VERSION, 'manifest_format': 'zoe-delivery-manifest',
            'max_files': MAX_FILES, 'max_source_bytes': MAX_SOURCE_BYTES,
            'max_archive_bytes': MAX_ARCHIVE_BYTES, 'max_request_bytes': MAX_REQUEST_BYTES,
            'max_inline_archive_bytes': MAX_INLINE_BYTES, 'zip': 'stored; fixed timestamps; flat portable names',
            'content_validation': 'not_performed', 'media_included': False}


def validate_name(name):
    if not isinstance(name, str) or not re.fullmatch(r'[A-Za-z0-9][A-Za-z0-9_.-]{0,99}', name) or name.endswith('.') or name.upper().split('.')[0] in DEVICES or '.'+name.rsplit('.', 1)[-1].lower() not in EXTENSIONS:
        raise ValueError('成果檔名需為可攜的單層文字檔名；不能含路徑或裝置名稱')
    return name


def validate(payload):
    if not isinstance(payload, dict) or set(payload) - {'scope', 'label', 'files', 'include_archive'} or not {'scope', 'files'} <= set(payload):
        raise ValueError('交付封裝欄位錯誤；不能指定來源或目的路徑')
    if not isinstance(payload['scope'], str) or payload['scope'] not in SCOPES:
        raise ValueError('交付封裝需指定四個工作台之一')
    label = payload.get('label', '')
    if not isinstance(label, str) or len(label) > 200 or type(payload.get('include_archive', False)) is not bool:
        raise ValueError('封裝說明或 include_archive 格式錯誤')
    files = payload['files']
    if not isinstance(files, dict) or not 1 <= len(files) <= MAX_FILES:
        raise ValueError('本輪需有 1–64 個文字成果檔案')
    lowered = set(); selected = {}; total = 0
    for name, content in files.items():
        validate_name(name)
        if name.lower() == MANIFEST_NAME.lower() or name.lower() in lowered:
            raise ValueError('成果檔名重複或占用交付清單名稱')
        if not isinstance(content, str): raise ValueError('成果內容需為文字')
        try: raw = content.encode('utf-8')
        except UnicodeError: raise ValueError('成果含無效 Unicode') from None
        total += len(raw)
        if total > MAX_SOURCE_BYTES: raise ValueError('本輪文字成果總量最多 8 MiB')
        lowered.add(name.lower()); selected[name] = content
    # Validate label Unicode and the external JSON envelope too; no silent repair.
    checked = decode_json(json_text({'scope': payload['scope'], 'label': label, 'files': selected}), max_bytes=MAX_REQUEST_BYTES)
    return {'scope': checked['scope'], 'label': checked['label'], 'files': dict(sorted(checked['files'].items()))}


def decode(raw):
    return decode_json(raw, max_bytes=MAX_REQUEST_BYTES, allow_bom=True)


@dataclass(frozen=True)
class PreparedDelivery:
    archive: bytes
    manifest: dict

    def summary(self, include_archive=False):
        if type(include_archive) is not bool: raise ValueError('include_archive 需為布林值')
        if include_archive and len(self.archive) > MAX_INLINE_BYTES:
            raise ValueError('ZIP 超過 512 KiB inline 上限；請使用 CLI 或工作台下載')
        data = {'format': 'zoe-delivery-package', 'schema_version': SCHEMA_VERSION,
                'archive_name': ARCHIVE_NAME, 'bytes': len(self.archive), 'sha256': hashlib.sha256(self.archive).hexdigest(),
                'manifest': deepcopy(self.manifest)}
        if include_archive: data['archive_base64'] = base64.b64encode(self.archive).decode('ascii')
        return data


def prepare(payload, *, tool_version=None):
    tool_version = __version__ if tool_version is None else tool_version
    if tool_version not in ("0.38.0", "0.39.0", "0.40.0", "0.41.0", "0.42.0", "0.43.0","0.44.0","0.45.0","0.46.0","0.47.0","0.48.0","0.49.0","0.50.0","0.51.0","0.52.0"): raise ValueError("不支援的交付工具版本")
    source = validate(payload)
    records = []; encoded = {}
    for name, content in source['files'].items():
        raw = content.encode('utf-8'); encoded[name] = raw
        records.append({'name': name, 'bytes': len(raw), 'sha256': hashlib.sha256(raw).hexdigest()})
    manifest = {'format': 'zoe-delivery-manifest', 'schema_version': SCHEMA_VERSION, 'tool_version': tool_version,
                'scope': source['scope'], 'label': source['label'], 'source_type': 'provided_text_files',
                'content_validation': 'not_performed', 'file_count': len(records),
                'source_bytes': sum(item['bytes'] for item in records), 'files': records}
    encoded[MANIFEST_NAME] = json_text(manifest).encode('utf-8')
    stream = io.BytesIO()
    with zipfile.ZipFile(stream, 'w', compression=zipfile.ZIP_STORED, allowZip64=False) as archive:
        for name, raw in encoded.items():
            entry = zipfile.ZipInfo(name, date_time=(1980, 1, 1, 0, 0, 0)); entry.create_system = 3
            entry.external_attr = 0o100644 << 16; entry.compress_type = zipfile.ZIP_STORED
            archive.writestr(entry, raw)
    raw = stream.getvalue()
    if len(raw) > MAX_ARCHIVE_BYTES: raise ValueError('交付 ZIP 超過容量')
    return PreparedDelivery(raw, manifest)
