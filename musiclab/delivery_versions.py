# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
"""Fixed explicit delivery-version policy; independent of domains and transports."""
import json
import re
from dataclasses import dataclass
from pathlib import Path
from .json_document import decode_json

MAX_CONTRACT_BYTES = 8192
MAX_SUPPORTED_VERSIONS = 128
MAX_COMPONENT = 2147483647
_VERSION = re.compile(r'(0|[1-9][0-9]{0,9})\.(0|[1-9][0-9]{0,9})\.(0|[1-9][0-9]{0,9})', re.ASCII)


def _parts(value):
    match = _VERSION.fullmatch(value) if isinstance(value, str) else None
    if match is None:
        raise ValueError('交付版本需為明確的三段整數版本')
    parts = tuple(int(part) for part in match.groups())
    if any(part > MAX_COMPONENT for part in parts):
        raise ValueError('交付版本整數超過上限')
    return parts


@dataclass(frozen=True)
class DeliveryVersions:
    current: str
    supported: tuple

    def supports_version(self, value):
        return isinstance(value, str) and value in self.supported

    def descriptor(self):
        return {'format': 'zoe-delivery-versions', 'schema_version': 1,
                'current': self.current, 'supported': list(self.supported)}


def create_policy(contract):
    if (not isinstance(contract, dict) or set(contract) != {'format', 'schema_version', 'current', 'supported'}
            or contract['format'] != 'zoe-delivery-versions'
            or type(contract['schema_version']) is not int or contract['schema_version'] != 1):
        raise ValueError('交付版本契約不支援；沒有推測或遷移')
    _parts(contract['current'])
    supported = contract['supported']
    if not isinstance(supported, list) or not 1 <= len(supported) <= MAX_SUPPORTED_VERSIONS:
        raise ValueError('交付版本清單需有 1–128 個明確版本')
    previous = None
    for value in supported:
        parts = _parts(value)
        if previous is not None and parts <= previous:
            raise ValueError('交付版本清單需為不重複的遞增版本')
        previous = parts
    if contract['current'] != supported[-1]:
        raise ValueError('目前交付版本需為清單最後一版')
    return DeliveryVersions(contract['current'], tuple(supported))


def decode_policy(raw):
    return create_policy(decode_json(raw, max_bytes=MAX_CONTRACT_BYTES, label='交付版本契約'))


def _load_fixed_policy():
    with (Path(__file__).parent / 'assets' / 'delivery-versions.json').open('rb') as source:
        return decode_policy(source.read(MAX_CONTRACT_BYTES + 1))


POLICY = _load_fixed_policy()
CURRENT_VERSION = POLICY.current
SUPPORTED_TOOL_VERSIONS = POLICY.supported


def contract_script():
    return 'globalThis.MusicDeliveryVersionsContract=' + json.dumps(POLICY.descriptor(), ensure_ascii=True, separators=(',', ':')) + ';\n'
