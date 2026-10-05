# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
"""Pure portable saved/backup UTC clock validation; never normalize source text."""
import re
from .json_document import utf8_bytes

# Preserve the existing extended calendar/hour/minute/second ISO forms and one
# Unicode separator. Z is the explicit zero-offset alias. Fraction precision is
# fixed to the existing millisecond/microsecond forms, independent of runtime.
PATTERN = re.compile(r'([0-9]{4})-([0-9]{2})-([0-9]{2})[\s\S]([0-9]{2})(?::([0-9]{2})(?::([0-9]{2})(?:\.[0-9]{3}(?:[0-9]{3})?)?)?)?(?:Z|[+-]00:00(?::00(?:\.000(?:000)?)?)?)')


def checked_utc_timestamp(value):
    if not isinstance(value, str) or len(value) > 128:
        raise ValueError('保存或備份時間需為有效 UTC 日期；原時間字串保留')
    utf8_bytes(value)
    matched = PATTERN.fullmatch(value)
    if matched is None:
        raise ValueError('保存或備份時間需為有效 UTC 日期；原時間字串保留')
    year, month, day, hour, minute, second = [int(v) if v is not None else 0 for v in matched.groups()]
    leap = year % 4 == 0 and (year % 100 != 0 or year % 400 == 0)
    days = (31, 29 if leap else 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31)
    if not (1 <= year <= 9999 and 1 <= month <= 12 and 1 <= day <= days[month-1] and
            0 <= hour <= 23 and 0 <= minute <= 59 and 0 <= second <= 59):
        raise ValueError('保存或備份時間需為有效 UTC 日期；原時間字串保留')
    return value
