# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
"""Pure bounded process-record report, independent of release retention."""
import re
from .maintenance import classify_run, validate_run

MAX_RUN_RECORDS = 32


def check_run_count(count, *, require_records=False):
    if type(require_records) is not bool or type(count) is not int or not 0 <= count <= MAX_RUN_RECORDS:
        raise ValueError('At most 32 explicit run records per audit')
    if require_records and count == 0:
        raise ValueError('--runs-only requires at least one --run-record')


def checked_records(records, *, require_records=False):
    if type(records) not in (list, tuple):
        raise ValueError('Run records must be an explicit bounded sequence')
    check_run_count(len(records), require_records=require_records)
    return [validate_run(record) for record in records]


def build_run_report(records, observations, record_sha256):
    """Preserve request order and pin the same bytes used for identity checks."""
    records = checked_records(records)
    for values in (observations, record_sha256):
        if type(values) not in (list, tuple) or len(values) != len(records):
            raise ValueError('Run observations and source digests must match every record')
    if any(type(value) is not str or not re.fullmatch('[0-9a-f]{64}', value) for value in record_sha256):
        raise ValueError('Run source digest must be an exact SHA-256')
    runs = [classify_run(record, observation) for record, observation in zip(records, observations)]
    return {'format': 'zoe-run-audit', 'schema_version': 1,
            'scope': 'explicitly recorded same-host Windows runs only',
            'record_sha256': list(record_sha256), 'runs': runs,
            'running_or_unverified': sum(row['status'] in ('running', 'unverified') for row in runs),
            'mutation': 'none'}
