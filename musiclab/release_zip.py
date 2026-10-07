# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
"""Pure capacity checks for source releases, before ZIP entry allocation.

This bounded classic-ZIP layout check does not replace CRC, source or ledger
validation, and does not establish a complete ZIP conformance claim.
"""
from dataclasses import dataclass
import json
import struct

MAX_ARCHIVE_BYTES = 64 * 1024 * 1024
MAX_CENTRAL_BYTES = 2 * 1024 * 1024
MAX_CENTRAL_ENTRIES = 4096
MAX_MANIFEST_BYTES = 2 * 1024 * 1024
MAX_FOOTER_BYTES = 22 + 65535


@dataclass(frozen=True)
class ZipLayout:
    entries: int
    central_bytes: int
    central_offset: int


def archive_size(size):
    if type(size) is not int or not 0 < size <= MAX_ARCHIVE_BYTES:
        raise ValueError('ZIP archive byte budget exceeded or invalid')
    return size


def footer_layout(size, tail):
    archive_size(size)
    if type(tail) is not bytes or len(tail) != min(size, MAX_FOOTER_BYTES):
        raise ValueError('Incomplete bounded ZIP footer read')
    start = max(0, size - MAX_FOOTER_BYTES)
    index = tail.rfind(b'PK\x05\x06')
    if index < 0 or len(tail) - index < 22:
        raise ValueError('No bounded standard ZIP footer')
    footer = struct.unpack_from('<4s4H2LH', tail, index)
    count, central_size, central_offset, comment_size = footer[4:]
    if (footer[1] or footer[2] or footer[3] != count
            or not 1 <= count <= MAX_CENTRAL_ENTRIES
            or central_size > MAX_CENTRAL_BYTES
            or central_offset + central_size != start + index
            or start + index + 22 + comment_size != size):
        raise ValueError('ZIP central directory budget or layout unsupported')
    return ZipLayout(count, central_size, central_offset)


def central_entries(layout, central):
    if (type(layout) is not ZipLayout or type(central) is not bytes
            or type(layout.entries) is not int or not 1 <= layout.entries <= MAX_CENTRAL_ENTRIES
            or type(layout.central_bytes) is not int or not 0 <= layout.central_bytes <= MAX_CENTRAL_BYTES
            or len(central) != layout.central_bytes):
        raise ValueError('Incomplete or unbounded ZIP central read')
    position = entries = 0
    while position < len(central):
        if len(central) - position < 46 or central[position:position+4] != b'PK\x01\x02':
            raise ValueError('Invalid ZIP central entry')
        header = struct.unpack_from('<4s6H3L5H2L', central, position)
        position += 46 + sum(header[10:13])
        entries += 1
        if entries > MAX_CENTRAL_ENTRIES or position > len(central):
            raise ValueError('ZIP central entry budget exceeded')
    if entries != layout.entries:
        raise ValueError('ZIP central entry count mismatch')
    return layout


def manifest_bytes(data):
    """Encode the new producer's UTF-8 JSON and LF within the reader's budget."""
    result = bytearray()
    encoder = json.JSONEncoder(ensure_ascii=False, indent=2, allow_nan=False)
    for text in encoder.iterencode(data):
        try:
            block = text.encode('utf-8')
        except UnicodeEncodeError as error:
            raise ValueError('Invalid release manifest Unicode') from error
        if len(result) + len(block) + 1 > MAX_MANIFEST_BYTES:
            raise ValueError('Release manifest byte budget exceeded')
        result.extend(block)
    result.extend(b'\n')
    return bytes(result)
