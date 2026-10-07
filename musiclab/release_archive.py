# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
"""Fixed release archive profiles and bounded immutable Git tree metadata.

No subprocesses, file access or configurable commands in this layer. Legacy
manifest1 keeps its original Git behavior; manifest2 explicitly pins raw blobs.
"""
import re
import hashlib
from pathlib import PurePosixPath

RAW_PROFILE = 'git-raw-blobs-v1'
PREFIX = 'zoe-g-music-lab/'
MAX_TREE_BYTES = 2 * 1024 * 1024
MAX_SOURCE_FILES = 2000
MAX_SOURCE_BYTES = 256 * 1024 * 1024


def blob_digest(size):
    if type(size) is not int or not 0 <= size <= MAX_SOURCE_BYTES:
        raise ValueError('Invalid bounded source blob size')
    # This is Git object identity, not a new signature or authorship assertion.
    return hashlib.sha1(b'blob '+str(size).encode('ascii')+b'\0', usedforsecurity=False)


def source_path(name):
    path = PurePosixPath(name)
    return (bool(name) and '\x00' not in name and not path.is_absolute()
            and '\\' not in name and ':' not in name and '..' not in path.parts
            and name == path.as_posix()
            and all(not part.startswith(('.env', '.dev.vars'))
                    and part not in ('.git', 'outputs', '__pycache__') for part in path.parts))


def manifest_profile(data):
    if not isinstance(data, dict) or type(data.get('schema_version')) is not int:
        raise ValueError('Unsupported package manifest version')
    if data['schema_version'] == 1 and 'archive_profile' not in data:
        return None
    if data['schema_version'] == 2 and data.get('archive_profile') == RAW_PROFILE:
        return RAW_PROFILE
    raise ValueError('Unsupported package manifest version or archive profile')


def archive_args(commit, destination, profile):
    if not isinstance(commit, str) or not re.fullmatch('[0-9a-f]{40}', commit):
        raise ValueError('Invalid immutable source commit')
    if profile is None:
        config = []
    elif profile == RAW_PROFILE:
        # A repository/info attribute may still transform bytes; callers must
        # compare every archived blob with source_tree before issuing success.
        config = ['-c', 'core.autocrlf=false', '-c', 'core.eol=lf',
                  '-c', 'core.attributesFile=']
    else:
        raise ValueError('Unsupported archive profile')
    return [*config, 'archive', '--format=zip', '--prefix='+PREFIX,
            '--output='+str(destination), commit]


def source_tree(raw):
    if not isinstance(raw, bytes) or not raw or len(raw) > MAX_TREE_BYTES or not raw.endswith(b'\0'):
        raise ValueError('Invalid bounded source tree')
    entries = raw.split(b'\0')[:-1]
    if not 1 <= len(entries) <= MAX_SOURCE_FILES:
        raise ValueError('Source file count exceeds release budget')
    result = {};total = 0
    for entry in entries:
        fields, separator, name_raw = entry.partition(b'\t')
        parts = fields.split()
        if not separator or len(parts) != 4 or parts[0] not in (b'100644', b'100755') or parts[1] != b'blob' or not re.fullmatch(b'[0-9a-f]{40}', parts[2]) or not re.fullmatch(b'0|[1-9][0-9]{0,8}', parts[3]):
            raise ValueError('Unsupported source tree entry')
        try:
            name = name_raw.decode('utf-8', errors='strict')
        except UnicodeDecodeError as error:
            raise ValueError('Source tree path is not strict UTF-8') from error
        size = int(parts[3]);total += size
        if not source_path(name) or name in result or total > MAX_SOURCE_BYTES:
            raise ValueError('Unsafe, duplicate or oversized source tree')
        result[name] = {'oid': parts[2].decode('ascii'), 'size': size}
    return result
