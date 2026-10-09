# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
"""Separate media-project contract. It does not change draft3 or Agent wire1."""
import base64
import copy
import hashlib
import json
import re

from .draft_contract import validate_draft
from .json_document import decode_json

MAX_MEDIA = 64 * 1024 * 1024
MAX_IMAGE = 12 * 1024 * 1024
MAX_JSON = 92 * 1024 * 1024


def exact(value, keys):
    return isinstance(value, dict) and set(value) == set(keys)


def asset(value, image=False):
    if not exact(value, ('name', 'type', 'size', 'sha256', 'base64')):
        raise ValueError('素材欄位不完整')
    name = value['name']
    if (not isinstance(name, str) or not name or len(name.encode('utf-16-le')) // 2 > 180
            or re.search(r'[\x00-\x1f\x7f/\\:]', name) or name in ('.', '..')):
        raise ValueError('素材名稱無效')
    mime = r'image/(png|jpeg|webp)' if image else r'audio/[a-z0-9.+-]+'
    if not isinstance(value['type'], str) or not re.fullmatch(mime, value['type']):
        raise ValueError('素材類型不支援')
    size = value['size']
    if type(size) is not int or not 1 <= size <= (MAX_IMAGE if image else MAX_MEDIA):
        raise ValueError('素材超過大小上限')
    if (not isinstance(value['sha256'], str) or not re.fullmatch('[0-9a-f]{64}', value['sha256'])
            or not isinstance(value['base64'], str) or len(value['base64']) != 4 * ((size + 2) // 3)):
        raise ValueError('素材摘要或編碼無效')
    try:
        raw = base64.b64decode(value['base64'], validate=True)
    except (ValueError, base64.binascii.Error) as error:
        raise ValueError('素材編碼無效') from error
    if (len(raw) != size or base64.b64encode(raw).decode('ascii') != value['base64']
            or hashlib.sha256(raw).hexdigest() != value['sha256']):
        raise ValueError('素材原始 bytes 或 SHA-256 不符')
    return raw


def validate(value):
    if (not exact(value, ('format', 'schema_version', 'draft', 'shot_ids', 'audio', 'images'))
            or value['format'] != 'zoe-mv-project' or type(value['schema_version']) is not int
            or value['schema_version'] != 1):
        raise ValueError('只接受 MV 素材專案版本 1')
    draft = validate_draft(value['draft'])
    if len(json.dumps(draft, ensure_ascii=False, separators=(',', ':'), allow_nan=False).encode('utf-8')) > 1024 * 1024:
        raise ValueError('企劃超過 1 MiB')
    ids = value['shot_ids']
    if (not isinstance(ids, list) or len(ids) != len(draft['panels']['storyboard']['shots'])
            or any(not isinstance(i, str) or not re.fullmatch('[A-Za-z][A-Za-z0-9-]{0,63}', i) for i in ids)
            or len(set(ids)) != len(ids)):
        raise ValueError('鏡頭身分無效或重複')
    total = 0
    images, seen = value['images'], set()
    if not isinstance(images, list) or len(images) > 64:
        raise ValueError('最多保存 64 張鏡頭圖片')
    selected = []
    if value['audio'] is not None:
        selected.append((value['audio'], False))
    for image in images:
        if (not exact(image, ('shot_id', 'asset')) or not isinstance(image['shot_id'], str)
                or image['shot_id'] not in ids or image['shot_id'] in seen):
            raise ValueError('圖片對應鏡頭無效或重複')
        seen.add(image['shot_id'])
        selected.append((image['asset'], True))
    # Reject an aggregate overflow before decoding any of its base64 buffers.
    for entry, _ in selected:
        if not isinstance(entry, dict) or type(entry.get('size')) is not int or entry['size'] < 1:
            raise ValueError('素材大小無效')
        total += entry['size']
        if total > MAX_MEDIA:
            raise ValueError('音檔與圖片合計最多 64 MiB')
    for entry, image in selected:
        asset(entry, image)
    return copy.deepcopy(value)


def decode(raw):
    return validate(decode_json(raw, max_bytes=MAX_JSON, allow_bom=False, label='MV 素材專案'))


def encode(value):
    raw = (json.dumps(validate(value), ensure_ascii=False, allow_nan=False, separators=(',', ':')) + '\n').encode('utf-8')
    if len(raw) > MAX_JSON:
        raise ValueError('素材專案超過大小上限')
    return raw


def pack(name, mime, raw):
    value = {'name': name, 'type': mime, 'size': len(raw), 'sha256': hashlib.sha256(raw).hexdigest(),
             'base64': base64.b64encode(raw).decode('ascii')}
    asset(value, mime.startswith('image/'))
    return value


def revise(project, plan):
    original = validate(project)
    if not exact(plan, ('draft', 'shot_ids')):
        raise ValueError('修訂需包含 draft 與 shot_ids')
    candidate = {**original, **copy.deepcopy(plan)}
    # Images keep stable shot IDs, so a reordered plan cannot silently attach them to another shot.
    return validate(candidate)
