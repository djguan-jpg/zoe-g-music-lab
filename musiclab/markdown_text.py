# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
"""Literal GFM text for fixed headings, paragraphs, lists and table cells."""
import string

_PUNCTUATION = frozenset(string.punctuation)


def inline(value):
    """Display source text without introducing Markdown or raw HTML structure.

    The caller supplies document structure. Source line endings become our
    fixed breaks; JSON remains authoritative for exact text and whitespace.
    """
    if not isinstance(value, str):
        raise ValueError("Markdown 欄位需為文字")
    normalized = value.replace("\r\n", "\n").replace("\r", "\n")
    return "".join("<br>" if char == "\n" else
                   f"&#{ord(char)};" if char in _PUNCTUATION else char
                   for char in normalized)
