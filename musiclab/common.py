import json
import math
from pathlib import Path


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
    return json.loads(Path(path).read_text(encoding="utf-8-sig"))


def json_text(data):
    return json.dumps(data, ensure_ascii=False, indent=2, allow_nan=False) + "\n"


def write_bundle(directory, files, overwrite=False):
    directory = Path(directory)
    # Check all targets first, so refusal cannot leave a partially updated bundle.
    for name in files:
        target = directory / name
        if target.exists() and not overwrite:
            raise ValueError(f"輸出已存在：{target}；請換目錄或明確使用 --overwrite")
    directory.mkdir(parents=True, exist_ok=True)
    for name, content in files.items():
        (directory / name).write_text(content, encoding="utf-8", newline="\n")
    return [str(directory / name) for name in files]
