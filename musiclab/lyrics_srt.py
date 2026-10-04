# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
"""ASCII SRT structure; literal lyric lines flatten with an explicit separator."""
import re
from .lyric_timing import seconds_from_milliseconds

CLOCK = r'([0-9]{2,}):([0-9]{2}):([0-9]{2})[,.]([0-9]{3})'
TIMING = re.compile(r'[ \t]*' + CLOCK + r'[ \t]+-->[ \t]+' + CLOCK + r'[ \t]*')


def clock(groups):
    hours, minutes, seconds, fraction = groups
    significant = hours.lstrip('0') or '0'
    if len(significant) > 16:
        raise ValueError('SRT 時間超過毫秒整數精度範圍')
    if int(minutes) >= 60 or int(seconds) >= 60:
        raise ValueError('SRT 分鐘／秒數需小於 60')
    return seconds_from_milliseconds(int(significant) * 3600000 + int(minutes) * 60000 + int(seconds) * 1000 + int(fraction))


def parse_srt(content):
    if not isinstance(content, str):
        raise ValueError('SRT 原文需為文字')
    blocks, block = [], []
    for line in re.split(r'\r\n|\r|\n', content.removeprefix('\ufeff')):
        if re.fullmatch(r'[ \t]*', line):
            if block:
                blocks.append(block)
                block = []
        else:
            block.append(line)
    if block:
        blocks.append(block)
    if not blocks:
        raise ValueError('SRT 段落缺少時間或文字')
    cues = []
    for lines in blocks:
        if re.fullmatch(r'[ \t]*[0-9]+[ \t]*', lines[0]):
            lines = lines[1:]
        if len(lines) < 2:
            raise ValueError('SRT 段落缺少時間或文字')
        match = TIMING.fullmatch(lines[0])
        if not match:
            raise ValueError('SRT 時間格式錯誤')
        values = match.groups()
        cues.append({'start': clock(values[:4]), 'end': clock(values[4:]), 'text': ' / '.join(lines[1:])})
    return cues
