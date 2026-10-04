# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
"""Explicit CLI destination, no overwrite unless --overwrite was selected."""
import os
import tempfile
from pathlib import Path
from .delivery_package import ARCHIVE_NAME


def write_archive(directory, prepared, overwrite=False):
    directory = Path(directory).resolve()
    target = directory / ARCHIVE_NAME
    if target.is_symlink() or target.exists() and not overwrite:
        raise ValueError('交付 ZIP 已存在；請換目錄或明確使用 --overwrite')
    directory.mkdir(parents=True, exist_ok=True)
    temporary = None
    try:
        with tempfile.NamedTemporaryFile(prefix='.zoe-delivery-', dir=directory, delete=False) as output:
            temporary = Path(output.name); output.write(prepared.archive); output.flush(); os.fsync(output.fileno())
        if overwrite:
            if target.is_symlink(): raise ValueError('交付 ZIP 不能覆寫連結')
            os.replace(temporary, target); temporary = None
        else:
            os.link(temporary, target)  # Atomic exclusive publication, including a racing destination.
    finally:
        if temporary is not None: temporary.unlink(missing_ok=True)
    return target
