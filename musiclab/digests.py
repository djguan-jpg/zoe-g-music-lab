# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
"""Fixed standard-library digest constructors, loaded only when requested.

Return the original hashlib objects, including streaming/copy and native
provider policy. No custom algorithm, buffering, fallback or provider choice.
"""


def sha256(*args, **kwargs):
    from hashlib import sha256 as constructor
    return constructor(*args, **kwargs)


def sha1(*args, **kwargs):
    from hashlib import sha1 as constructor
    return constructor(*args, **kwargs)
