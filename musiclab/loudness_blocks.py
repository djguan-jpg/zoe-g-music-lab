# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
"""Owned bounded-memory storage for repeatable loudness gating passes."""
import math
import struct
import tempfile

MAX_MEMORY_BYTES = 64 * 1024


class EnergyBlocks:
    def __init__(self, max_memory_bytes=MAX_MEMORY_BYTES):
        if type(max_memory_bytes) is not int or max_memory_bytes < 8:
            raise ValueError("區塊記憶體上限需至少 8 bytes")
        self.file = tempfile.SpooledTemporaryFile(max_size=max_memory_bytes, mode='w+b')
        self.count = 0
        self.reading = False

    def __enter__(self):
        return self

    def __exit__(self, *args):
        self.file.close()

    def append(self, energy):
        if self.reading:
            raise ValueError("響度門檻計算開始後不能追加區塊")
        if type(energy) not in (int, float) or not math.isfinite(energy) or energy < 0:
            raise ValueError("響度區塊能量無效")
        self.file.write(struct.pack('<d', energy))
        self.count += 1

    def __iter__(self):
        self.reading = True
        self.file.seek(0)
        observed = 0
        while True:
            raw = self.file.read(8192)
            if not raw:
                break
            if len(raw) % 8:
                raise ValueError("響度區塊副本截斷")
            for (energy,) in struct.iter_unpack('<d', raw):
                observed += 1
                yield energy
        if observed != self.count:
            raise ValueError("響度區塊副本不完整")
