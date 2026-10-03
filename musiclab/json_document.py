# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
"""Strict external JSON decoding, independent of domain schemas and adapters."""
import json
import math
from itertools import chain

MAX_JSON_BYTES = 2 * 1024 * 1024
MAX_JSON_DEPTH = 64


def decode_json(content, *, max_bytes=MAX_JSON_BYTES, label='JSON', allow_bom=False):
    if isinstance(content, bytes):
        if len(content) > max_bytes:
            raise ValueError(f'{label} 超過讀取上限')
        try:
            content = content.decode('utf-8')
        except UnicodeError:
            raise ValueError(f'{label} 不是有效的 UTF-8；原檔與目前內容保留') from None
    if not isinstance(content, str):
        raise ValueError(f'{label} 需為 UTF-8 JSON 文字')
    try:
        if len(content.encode('utf-8')) > max_bytes:
            raise ValueError(f'{label} 超過讀取上限')
    except UnicodeError:
        raise ValueError(f'{label} 含無效 Unicode 文字') from None
    if allow_bom and content.startswith('\ufeff'):
        content = content[1:]

    def pairs(items):
        result = {}
        for key, value in items:
            if key in result:
                raise ValueError(f'{label} 含重複欄位')
            result[key] = value
        return result

    def constant(_):
        raise ValueError(f'{label} 不接受 NaN 或 Infinity')

    def floating(value):
        result = float(value)
        if not math.isfinite(result):
            raise ValueError(f'{label} 不接受非有限數字')
        return result

    try:
        data = json.loads(content, object_pairs_hook=pairs, parse_constant=constant, parse_float=floating)
    except json.JSONDecodeError:
        raise ValueError(f'{label} 格式錯誤；原檔與目前內容保留') from None
    except RecursionError:
        raise ValueError(f'{label} 結構過深，最多64層') from None
    # Iterator frames bound traversal memory by depth instead of the number of values.
    pending = [(iter([data]), 0)]
    while pending:
        values, depth = pending[-1]
        try:
            value = next(values)
        except StopIteration:
            pending.pop()
            continue
        if depth > MAX_JSON_DEPTH:
            raise ValueError(f'{label} 結構過深，最多64層')
        if isinstance(value, dict):
            pending.append((iter(chain(value.keys(), value.values())), depth + 1))
        elif isinstance(value, list):
            pending.append((iter(value), depth + 1))
        elif isinstance(value, str):
            try:
                value.encode('utf-8')
            except UnicodeError:
                raise ValueError(f'{label} 含無效 Unicode 文字') from None
    return data
