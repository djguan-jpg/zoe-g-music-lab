# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
"""Pure complete test-ID partition; no discovery, timing or process control."""
from .test_run_summary import MAX_TESTS, WORKERS, identifiers


def partition(ids):
    """Spread methods across two workers, preserving each worker's source order."""
    source = identifiers(ids, MAX_TESTS, 512)
    if not source or len(set(source)) != len(source):
        raise ValueError('Independent discovery must be nonempty and unique')
    groups = [[] for _ in range(WORKERS)]
    for index, identifier in enumerate(source):
        groups[index % WORKERS].append(identifier)
    return groups
