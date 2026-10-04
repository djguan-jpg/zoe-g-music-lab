# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
"""Strict, bounded local CIM reply decoding; no process or filesystem I/O."""
from .json_document import decode_json
from .maintenance import validate_identity, CIM_SOURCE, CIM_CREATION_MARGIN

FORMAT = 'zoe-windows-process-probe'
SCHEMA_VERSION = 1
MAX_REPLY_BYTES = 2048


def checked_pid(pid):
    if type(pid) is not int or not 0 < pid <= 2147483647:
        raise ValueError('Run PID must be a positive bounded integer')
    return pid


def checked_reply(pid, raw):
    checked_pid(pid)
    value = decode_json(raw, max_bytes=MAX_REPLY_BYTES, label='Local process probe')
    if not isinstance(value, dict) or set(value) != {'format', 'schema_version', 'pid', 'record'}:
        raise ValueError('Unknown local process probe shape')
    if value['format'] != FORMAT or type(value['schema_version']) is not int or value['schema_version'] != SCHEMA_VERSION:
        raise ValueError('Unsupported local process probe version')
    if type(value['pid']) is not int or value['pid'] != pid:
        raise ValueError('Local process probe returned a different PID')
    if value['record'] is None:
        return {'pid': pid, 'state': 'absent', 'source': CIM_SOURCE}
    identity = validate_identity(value['record'])
    if identity['pid'] != pid or int(identity['creation_ticks']) % 10:
        raise ValueError('Local CIM identity or microsecond precision is invalid')
    return {'pid': pid, 'state': 'limited', 'source': CIM_SOURCE,
            'identity': identity, 'creation_margin_ticks': CIM_CREATION_MARGIN}
