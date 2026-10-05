# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
"""Pure expected-release identity; no publication, filesystem or network effects."""
from dataclasses import dataclass
from .delivery_versions import create_policy
from .json_document import decode_json

MAX_PROJECT_METADATA_BYTES = 64 * 1024


@dataclass(frozen=True)
class ReleaseIdentity:
    version: str
    tag: str


def validate_metadata(metadata, policy_contract):
    """Check the selected commit's declaration against its explicit policy."""
    policy = create_policy(policy_contract)
    if not isinstance(metadata, dict):
        raise ValueError('Release metadata must be a JSON object')
    if metadata.get('version') != policy.current:
        raise ValueError('Release metadata version differs from the selected delivery policy')
    if (type(metadata.get('delivery_versions_schema_version')) is not int
            or metadata['delivery_versions_schema_version'] != 1):
        raise ValueError('Release metadata delivery-policy schema must be 1')
    expected_tag = 'v' + policy.current
    if metadata.get('release_version') != expected_tag:
        raise ValueError('Release metadata release_version must be the expected tag ' + expected_tag)
    return ReleaseIdentity(policy.current, expected_tag)


def decode_metadata(raw):
    return decode_json(raw, max_bytes=MAX_PROJECT_METADATA_BYTES, label='Release metadata')
