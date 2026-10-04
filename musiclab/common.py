# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
import json
import math
from pathlib import Path
from .json_document import decode_json, MAX_JSON_BYTES


def number(value, label):
    if isinstance(value, bool):
        raise ValueError(f"{label} 必須是數字")
    try:
        result = float(value)
    except (TypeError, ValueError):
        raise ValueError(f"{label} 必須是數字") from None
    if not math.isfinite(result):
        raise ValueError(f"{label} 必須是有限數字")
    return result


def text(value, label):
    if not isinstance(value, str) or not value.strip():
        raise ValueError(f"{label} 不可空白")
    return value.strip()


def read_json(path):
    with Path(path).open('rb') as source:
        raw = source.read(MAX_JSON_BYTES + 1)
    return decode_json(raw, allow_bom=True)


def json_text(data):
    return json.dumps(data, ensure_ascii=False, indent=2, allow_nan=False) + "\n"


from .text_outputs import write_bundle
