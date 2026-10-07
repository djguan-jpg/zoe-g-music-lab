# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
"""Pure explicit maintenance action selection, before filesystem/process reads."""
import re
from .maintenance import prune_batch_directories, validate_job


def choose_action(*, prune=False, restore=False, record_job=None, space=False, runs_only=False,
                  expected_token=None, has_records=False, package_directories=None):
    if any(type(value) is not bool for value in (prune, restore, space, runs_only, has_records)):
        raise ValueError('Maintenance action flags must be explicit booleans')
    selected = [name for name, present in (
        ('prune', prune), ('restore', restore), ('record', record_job is not None),
        ('space', space), ('runs', runs_only)) if present]
    if len(selected) > 1:
        raise ValueError('Maintenance actions are mutually exclusive')
    action = selected[0] if selected else 'audit'
    if expected_token is not None and action != 'prune':
        raise ValueError('--expected-token is only valid with --prune')
    if action == 'prune' and (type(expected_token) is not str or not re.fullmatch('[0-9a-f]{64}', expected_token)):
        raise ValueError('--prune requires the exact preview --expected-token')
    if action == 'runs' and not has_records:
        raise ValueError('--runs-only requires at least one --run-record')
    if has_records and action not in ('audit', 'prune', 'runs'):
        raise ValueError('Run records are only used by audit, runs-only and pruning')
    if package_directories is not None:
        if action not in ('audit', 'prune'):
            raise ValueError('--package-directory is only valid with audit or pruning')
        prune_batch_directories(package_directories)
    if action == 'record':
        validate_job(record_job)
    return action
