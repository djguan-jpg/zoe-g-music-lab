# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
"""Finite, millisecond-precise lyric times. Half milliseconds round away from zero."""
from decimal import Decimal, ROUND_HALF_UP
import re
from .common import number

MAX_MILLISECONDS = 2**53 - 1


def decimal_number(value, label):
    if isinstance(value, str) and not re.fullmatch(r'[+-]?(?:[0-9]+(?:\.[0-9]*)?|\.[0-9]+)(?:[eE][+-]?[0-9]+)?', value.strip()):
        raise ValueError(f'{label} 必須是十進位數字')
    return number(value, label)


def milliseconds(value, label='時間'):
    value = decimal_number(value, label)
    result = int(Decimal(str(value)).scaleb(3).to_integral_value(rounding=ROUND_HALF_UP))
    if abs(result) > MAX_MILLISECONDS:
        raise ValueError(f'{label} 超過毫秒整數精度範圍')
    return result


def seconds_from_milliseconds(value):
    if abs(value) > MAX_MILLISECONDS:
        raise ValueError('時間超過毫秒整數精度範圍')
    result = value / 1000
    if milliseconds(result) != value:
        raise ValueError('時間無法以秒數保留毫秒精度')
    return result


def normalized_seconds(value, label='時間', nonnegative=False):
    value = decimal_number(value, label)
    if nonnegative and value < 0:
        raise ValueError(f'{label} 不能有負時間')
    return seconds_from_milliseconds(milliseconds(value, label))
