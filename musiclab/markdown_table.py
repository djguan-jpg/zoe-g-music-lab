# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
"""Literal text for GFM table cells; authoritative source stays in JSON."""
from .markdown_text import inline


def cell(value):
    """Keep source punctuation literal and line endings inside one table row.

    Numeric references cannot form Markdown structure. Only our own fixed
    <br> tags are inserted. Rendering may collapse whitespace; this is a
    presentation format, not a lossless replacement for the source JSON.
    """
    if not isinstance(value, str):
        raise ValueError("表格欄位需為文字")
    return inline(value)
