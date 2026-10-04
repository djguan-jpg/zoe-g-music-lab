# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
"""Leading LRC syntax only; the remaining lyric text is literal."""
import re
from .lyric_timing import MAX_MILLISECONDS, seconds_from_milliseconds

TIMESTAMP = re.compile(r'\[([0-9]+):([0-9]{2})(?:\.([0-9]{1,3}))?\]')
OFFSET = re.compile(r'[ \t]*\[offset:([+-]?[0-9]+)\][ \t]*', re.I)


def integer(value):
    negative = value.startswith('-')
    digits = value.lstrip('+-').lstrip('0') or '0'
    if len(digits) > 16:
        raise ValueError('LRC 時間超過毫秒整數精度範圍')
    result = int(digits) * (-1 if negative else 1)
    if abs(result) > MAX_MILLISECONDS:
        raise ValueError('LRC 時間超過毫秒整數精度範圍')
    return result


def parse_lrc(content):
    if not isinstance(content, str):
        raise ValueError('LRC 原文需為文字')
    lines = re.split(r'\r\n|\r|\n', content.removeprefix('\ufeff'))
    offset = 0
    for line in lines:
        match = OFFSET.fullmatch(line)
        if match:
            offset = integer(match[1])
    cues = []
    for line in lines:
        position = len(line) - len(line.lstrip(' \t'))
        starts = []
        while match := TIMESTAMP.match(line, position):
            minutes, seconds, fraction = match.groups()
            if int(seconds) >= 60:
                raise ValueError('LRC 秒數需小於 60')
            total = integer(minutes) * 60000 + int(seconds) * 1000 + int((fraction or '0').ljust(3, '0')) + offset
            if total < 0:
                raise ValueError('LRC 開始時間不能有負時間')
            starts.append(seconds_from_milliseconds(total))
            position = match.end()
        if not starts:
            if re.match(r'\[[0-9]+:', line[position:]):
                raise ValueError('LRC 含無法解析的時間標籤')
            continue
        # Only adjacent leading tags are syntax. Spaces, tags and separators
        # after this boundary belong to the lyric and must not be trimmed.
        cues.extend({'start': start, 'text': line[position:]} for start in starts)
    return cues
