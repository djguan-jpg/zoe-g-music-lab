# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
"""CLI destination adapter: publish a complete backup without replacement."""
import os
import re
import tempfile
from pathlib import Path
from .library_contract import ID_PATTERN


def write_backup(destination, raw, library):
    named = Path(destination).absolute()
    if named.exists() or named.is_symlink():
        raise ValueError('備份輸出已存在；請選新檔名，不覆寫備份')
    target = named.resolve()
    if target.suffix.lower() != '.zip':
        raise ValueError('備份輸出需為 .zip 檔案')
    try:
        relative = target.relative_to(library.root)
    except ValueError:
        relative = None
    if relative and any(re.fullmatch(ID_PATTERN, part) for part in relative.parts[:-1]):
        raise ValueError('備份不能寫入保存版本目錄；請另選目的地')
    if target.exists():
        raise ValueError('備份輸出已存在；請選新檔名，不覆寫備份')
    target.parent.mkdir(parents=True, exist_ok=True)
    temporary = None
    try:
        with tempfile.NamedTemporaryFile(prefix='.zoe-backup-', dir=target.parent, delete=False) as output:
            temporary = Path(output.name)
            output.write(raw); output.flush(); os.fsync(output.fileno())
        # Exclusive, atomic publication; unlike rename this cannot replace a racing target on POSIX.
        os.link(temporary, target)
    finally:
        if temporary is not None:
            temporary.unlink(missing_ok=True)
    return target
