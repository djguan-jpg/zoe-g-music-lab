# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
"""Bounded source-release reads and exclusive manifest writes; no ZIP expansion."""
from pathlib import Path
from .release_zip import archive_size, footer_layout, central_entries, manifest_bytes, MAX_FOOTER_BYTES


def inspect_archive(path):
    path = Path(path)
    size = archive_size(path.stat().st_size)
    with path.open('rb') as source:
        source.seek(max(0, size - MAX_FOOTER_BYTES))
        layout = footer_layout(size, source.read(MAX_FOOTER_BYTES))
        source.seek(layout.central_offset)
        central = source.read(layout.central_bytes)
    return central_entries(layout, central)


def write_manifest(path, data):
    raw = manifest_bytes(data)
    with Path(path).open('xb') as target:
        target.write(raw)
