# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
"""Pure iteration retention and run-identity policy; no filesystem or process I/O."""
import hashlib
import json
import math
import re

DAY = 86400
KEEP_VERSIONS = 3
MIN_AGE_DAYS = 7


def version_key(value):
    if not isinstance(value, str) or not re.fullmatch(r'[0-9]{1,6}\.[0-9]{1,6}\.[0-9]{1,6}', value):
        raise ValueError('Unsupported package version')
    return tuple(map(int, value.split('.')))


def validate_identity(value):
    if not isinstance(value, dict) or set(value) != {'pid', 'platform', 'creation_ticks', 'image'}:
        raise ValueError('Run identity requires PID, platform, original creation time and image')
    if type(value['pid']) is not int or not 0 < value['pid'] <= 2147483647:
        raise ValueError('Run PID must be a positive bounded integer')
    if value['platform'] != 'windows':
        raise ValueError('This run identity format supports the local Windows host')
    ticks = value['creation_ticks']
    if not isinstance(ticks, str) or not re.fullmatch(r'[1-9][0-9]{0,19}', ticks) or int(ticks) >= 2**64:
        raise ValueError('Invalid original process creation time')
    image = value['image']
    if not isinstance(image, str) or not image.strip() or len(image) > 260 or any(c in image for c in '\x00/\\'):
        raise ValueError('Process image must be a basename, never a path or command line')
    return dict(value)


def validate_run(value):
    if not isinstance(value, dict) or set(value) != {'format', 'schema_version', 'job', 'identity'}:
        raise ValueError('Unknown run record shape; a bare PID cannot establish job ownership')
    if value['format'] != 'zoe-iteration-run' or type(value['schema_version']) is not int or value['schema_version'] != 1:
        raise ValueError('Unsupported run record version')
    if not isinstance(value['job'], str) or not re.fullmatch(r'[a-z0-9][a-z0-9-]{0,79}', value['job']):
        raise ValueError('Use a short non-sensitive job label')
    return {**value, 'identity': validate_identity(value['identity'])}


def classify_run(record, observation):
    record = validate_run(record)
    if not isinstance(observation, dict) or type(observation.get('pid')) is not int or observation.get('pid') != record['identity']['pid']:
        raise ValueError('Process observation must refer to the exact recorded PID')
    state = observation.get('state')
    if state == 'absent':
        status = 'stopped'
    elif state == 'unavailable':
        status = 'unverified'
    elif state == 'running':
        observed = validate_identity(observation.get('identity'))
        expected = record['identity']
        same = observed['pid'] == expected['pid'] and observed['platform'] == expected['platform'] and observed['creation_ticks'] == expected['creation_ticks'] and observed['image'].casefold() == expected['image'].casefold()
        status = 'running' if same else 'pid_reused'
    else:
        raise ValueError('Unknown process observation state')
    return {'job': record['job'], 'pid': record['identity']['pid'], 'status': status,
            'action': 'preserved', 'original_run_terminal': status in ('stopped', 'pid_reused')}


def retention_plan(packages, now):
    """Adapter supplies verified age, tag and byte facts. Policy never deletes."""
    if type(now) not in (float, int) or not math.isfinite(now) or now <= 0:
        raise ValueError('Audit time must be explicit')
    for package in packages:
        if type(package['verified']) is not bool or type(package['newest_mtime']) not in (int, float) or not math.isfinite(package['newest_mtime']) or package['newest_mtime'] < 0:
            raise ValueError('Invalid package verification or age fact')
    versions = sorted({p['version'] for p in packages if p['verified']}, key=version_key, reverse=True)
    protected = versions[:KEEP_VERSIONS]
    decisions = []
    for package in packages:
        version_key(package['version'])
        reasons = list(package['reasons'])
        if package['version'] in protected:
            reasons.append('latest_three_versions')
        if now - package['newest_mtime'] <= MIN_AGE_DAYS * DAY:
            reasons.append('not_older_than_seven_days')
        if not package['verified'] and not reasons:
            reasons.append('unverified_package')
        decisions.append({'directory': package['directory'], 'version': package['version'],
                          'eligible': package['verified'] and not reasons, 'reasons': reasons})
    return {'protected_versions': protected, 'decisions': decisions}


def prune_token(candidates):
    """Time and live observations are excluded; exact candidate identities are bound."""
    body = json.dumps(sorted(candidates, key=lambda p: p['directory']), sort_keys=True, separators=(',', ':'), ensure_ascii=False)
    return hashlib.sha256(body.encode('utf-8')).hexdigest()


def validate_candidate(value):
    keys = {'directory', 'version', 'commit', 'archive', 'archive_sha256', 'manifest_sha256',
            'archive_mtime_ns', 'manifest_mtime_ns', 'archive_bytes'}
    if not isinstance(value, dict) or set(value) != keys:
        raise ValueError('Unknown candidate identity shape')
    version_key(value['version'])
    if not isinstance(value['commit'], str) or not re.fullmatch('[0-9a-f]{40}', value['commit']):
        raise ValueError('Invalid candidate commit')
    if value['directory'] != f"outputs/releases/v{value['version']}-{value['commit'][:12]}" or value['archive'] != f"zoe-g-music-lab-v{value['version']}.zip":
        raise ValueError('Noncanonical candidate target')
    for key in ('archive_sha256', 'manifest_sha256'):
        if not isinstance(value[key], str) or not re.fullmatch('[0-9a-f]{64}', value[key]):
            raise ValueError('Invalid candidate digest')
    for key in ('archive_mtime_ns', 'manifest_mtime_ns'):
        if type(value[key]) is not int or not 0 < value[key] < 2**63:
            raise ValueError('Invalid candidate timestamp')
    if type(value['archive_bytes']) is not int or not 0 < value['archive_bytes'] <= 64 * 1024 * 1024:
        raise ValueError('Invalid candidate size')
    return dict(value)
