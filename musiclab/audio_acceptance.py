# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
"""Portable raw acceptance draft, independent of project drafts and media paths."""
from decimal import Decimal, InvalidOperation
from .common import number, json_text
from .json_document import decode_json

FORMAT = 'zoe-audio-acceptance-draft'
SCHEMA_VERSION = 1
MAX_BYTES = 64 * 1024
MAX_FIELD = 1024
MAX_VALUES = 64
MAX_INTEGER = 2 ** 53 - 1
PROFILES = {
    'distribution': {'rates': [44100, 48000], 'bits': [16, 24], 'channels': [1, 2]},
    'video': {'rates': [48000], 'bits': [16, 24], 'channels': [1, 2]},
}


def descriptor():
    return {'format': FORMAT, 'schema_version': SCHEMA_VERSION, 'max_bytes': MAX_BYTES,
            'max_field_characters': MAX_FIELD, 'max_values_per_field': MAX_VALUES,
            'max_integer': MAX_INTEGER, 'unfinished_fields': 'preserved; analysis requires valid active values'}


def validate(document):
    if not isinstance(document, dict) or set(document) != {'format', 'schema_version', 'profile', 'custom', 'fields'}:
        raise ValueError('接受條件草稿欄位錯誤')
    if document['format'] != FORMAT or type(document['schema_version']) is not int or document['schema_version'] != SCHEMA_VERSION:
        raise ValueError('接受條件草稿版本不支援')
    if not isinstance(document['profile'], str) or document['profile'] not in PROFILES or type(document['custom']) is not bool:
        raise ValueError('接受條件草稿的示範條件或自訂選項錯誤')
    fields = document['fields']
    if not isinstance(fields, dict) or set(fields) != {'rates', 'bits', 'channels'} or any(
            not isinstance(value, str) or len(value) > MAX_FIELD for value in fields.values()):
        raise ValueError('接受條件原欄位需為最多 1024 字元的文字')
    # Enforce the same Unicode/finite/size contract for embedded documents too.
    checked = decode_json(json_text(document), max_bytes=MAX_BYTES)
    return {**checked, 'fields': dict(checked['fields'])}


def decode(raw):
    return validate(decode_json(raw, max_bytes=MAX_BYTES, allow_bom=True))


def field_values(key, raw):
    parts = raw.replace('，', ',').split(',')
    if not 1 <= len(parts) <= MAX_VALUES:
        raise ValueError(f'{key} 最多 64 個接受值')
    # Check finite numeric grammar first, then exact decimal integrality.
    # A long fractional string must not become an integer by float rounding.
    for part in parts: number(part, key)
    try:
        values = [Decimal(part) for part in parts]
    except InvalidOperation:
        raise ValueError(f'{key} 需填正整數，以逗號分隔') from None
    if any(value != value.to_integral_value() or not 1 <= value <= MAX_INTEGER for value in values):
        raise ValueError(f'{key} 需填正整數，以逗號分隔')
    return [int(value) for value in values]


def prepare(document):
    draft = validate(document)
    limits = {key: list(value) for key, value in PROFILES[draft['profile']].items()}
    if draft['custom']:
        for key, raw in draft['fields'].items():
            limits[key] = field_values(key, raw)
    return draft['profile'], limits


def normalize(profile='distribution', rates=None, bits=None, channels=None):
    """Preserve the existing direct CLI/Agent positive-integer list contract."""
    if not isinstance(profile, str) or profile not in PROFILES:
        raise ValueError('profile 需為 distribution 或 video')
    limits = {key: list(value) for key, value in PROFILES[profile].items()}
    for key, values in (('rates', rates), ('bits', bits), ('channels', channels)):
        if values is not None:
            if not isinstance(values, list) or not values or any(
                    type(value) not in (int, float) or value <= 0 or
                    isinstance(value, float) and not value.is_integer() for value in values):
                raise ValueError(f'{key} 接受條件需為正整數')
            limits[key] = [int(value) for value in values]
    return limits
