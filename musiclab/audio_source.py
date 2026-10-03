# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
"""Owned byte copy and PCM fmt preflight; never alter the selected source."""
from contextlib import contextmanager
import hashlib
import struct
import tempfile
from pathlib import Path


def pcm_header(source, size):
    source.seek(0)
    header = source.read(12)
    if len(header) != 12 or header[:4] != b'RIFF' or header[8:] != b'WAVE':
        raise ValueError('本版只分析 RIFF/WAVE 整數 PCM（format tag 1）')
    declared = struct.unpack('<I', header[4:8])[0] + 8
    if not 12 <= declared <= size:
        raise ValueError('WAV RIFF 長度截斷或不合法')
    offset = 12
    while offset + 8 <= declared:
        source.seek(offset)
        kind, length = struct.unpack('<4sI', source.read(8))
        end = offset + 8 + length
        if end > declared:
            raise ValueError('WAV chunk 超出 RIFF 宣告長度')
        if kind == b'data':
            raise ValueError('WAV data 前缺少 fmt 標頭')
        if kind == b'fmt ':
            if length < 16:
                raise ValueError('WAV fmt 標頭不完整')
            tag, channels, rate, byte_rate, align, bits = struct.unpack('<HHIIHH', source.read(16))
            if tag != 1 or bits not in (8, 16, 24, 32) or not 1 <= channels <= 32 or rate <= 0:
                raise ValueError('只接受 format tag 1、8/16/24/32 bit、1–32 聲道的整數 PCM')
            expected_align = channels * (bits // 8)
            if align != expected_align:
                raise ValueError('WAV block align 與聲道／位元深度不一致')
            if byte_rate != rate * expected_align:
                raise ValueError('WAV byte rate 與取樣率／block align 不一致')
            return {'bytes': size, 'analysis_source': 'copied_bytes', 'wave_format_tag': tag,
                    'block_align': align, 'average_bytes_per_second': byte_rate,
                    'declared_riff_bytes': declared}
        # Metadata is not decoded; advance over its WORD padding in constant memory.
        offset = end + (length % 2)
    raise ValueError('WAV 缺少 fmt 標頭')


@contextmanager
def copied_audio(path):
    """Hash exactly the bytes later analyzed. Spool after 1 MiB; close on every exit.

    The copy is consistent with its hash, not an atomic filesystem snapshot of a
    concurrently edited source. No temporary path enters the report.
    """
    with tempfile.SpooledTemporaryFile(max_size=1024 * 1024, mode='w+b') as selected:
        sha = hashlib.sha256()
        size = 0
        with Path(path).open('rb') as raw:
            while True:
                block = raw.read(1024 * 1024)
                if not block:
                    break
                selected.write(block)
                sha.update(block)
                size += len(block)
        evidence = pcm_header(selected, size)
        selected.seek(0)
        yield selected, sha.hexdigest(), evidence
