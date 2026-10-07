# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
"""Explicit project filesystem/Git adapter for pure retention policy.

Only the two manifest-named release files are candidates. No recursive removal,
media scanning, process signalling, network calls or Git mutation.
"""
import hashlib
import json
import os
import re
import stat
import subprocess
import tempfile
import time
import uuid
import zipfile
from pathlib import Path, PurePosixPath
from .json_document import decode_json
from .maintenance import retention_plan, prune_token, version_key, validate_run, classify_run, validate_candidate, prune_batch_directories, prune_batch_plan
from .run_identity import observe_process
from .release_archive import RAW_PROFILE, manifest_profile, archive_args, source_tree, blob_digest
from .release_zip import MAX_MANIFEST_BYTES, MAX_ARCHIVE_BYTES
from .release_zip_fs import inspect_archive

PREFIX = 'zoe-g-music-lab/'
# Read-only catalog size is independent of the unchanged recovery write budget.
MAX_RELEASE_ENTRIES = 1024
MAX_RECOVERY_PACKAGES = 128
MAX_JOURNAL_BYTES = 2 * 1024 * 1024


def _unsafe(path):
    if not path.exists() and not path.is_symlink():
        return False
    info = path.lstat()
    return path.is_symlink() or bool(getattr(info, 'st_file_attributes', 0) & getattr(stat, 'FILE_ATTRIBUTE_REPARSE_POINT', 1024))


def safe_path(root, path):
    root, path = Path(root).absolute(), Path(path).absolute()
    if not path.is_relative_to(root) or not path.resolve().is_relative_to(root.resolve()):
        raise ValueError('Path is outside the explicitly selected project')
    for node in (path, *path.parents):
        if _unsafe(node):
            raise ValueError('Symlinks and reparse points are not maintenance targets')
        if node == root:
            return path.resolve()
    raise ValueError('Unverified project path')


def read_document(path, limit=MAX_MANIFEST_BYTES):
    with Path(path).open('rb') as source:
        return decode_json(source.read(limit + 1), max_bytes=limit, label='maintenance document')


def workspace(root):
    root = Path(root).absolute()
    if root == root.parent or root.resolve() != root or _unsafe(root):
        raise ValueError('Use a real named project directory, never a drive root or link')
    marker_path = safe_path(root, root/'projects.json')
    if not marker_path.is_file():
        raise ValueError('Selected directory has no project marker')
    marker = read_document(marker_path)
    if not isinstance(marker, dict) or marker.get('suite') != 'ZOE. G Music Lab':
        raise ValueError('Selected directory is not this project')
    safe_path(root, root/'outputs/releases')
    return root


def write_new(root, path, data):
    path = safe_path(root, path)
    if not path.is_relative_to(root/'outputs'):
        raise ValueError('Maintenance receipts belong in this project outputs')
    path.parent.mkdir(parents=True, exist_ok=True)
    safe_path(root, path)
    raw = json.dumps(data, ensure_ascii=False, indent=2, allow_nan=False).encode('utf-8') + b'\n'
    with path.open('xb') as target:
        target.write(raw)
    return path


def _digest(path):
    value = hashlib.sha256()
    with path.open('rb') as source:
        while block := source.read(1024 * 1024):
            value.update(block)
    return value.hexdigest()


def _git(root, args):
    result = subprocess.run(['git', *args], cwd=root, capture_output=True, timeout=60)
    if result.returncode:
        raise ValueError('Git reconstruction or exact tag verification failed')
    return result.stdout


def _manifest(path):
    data = read_document(path)
    required = {'schema_version', 'commit', 'version', 'license', 'archive', 'sha256', 'bytes', 'files'}
    if not isinstance(data, dict) or not required <= set(data) or set(data) - required - {'checks', 'restore', 'archive_profile'}:
        raise ValueError('Unknown package manifest shape')
    manifest_profile(data)
    version_key(data['version'])
    if not isinstance(data['commit'], str) or not re.fullmatch('[0-9a-f]{40}', data['commit']):
        raise ValueError('Invalid immutable source commit')
    if data['license'] != 'PolyForm-Noncommercial-1.0.0' or data['archive'] != f"zoe-g-music-lab-v{data['version']}.zip":
        raise ValueError('Unsupported license or noncanonical archive name')
    if not isinstance(data['sha256'], str) or not re.fullmatch('[0-9a-f]{64}', data['sha256']) or type(data['bytes']) is not int or not 0 < data['bytes'] <= MAX_ARCHIVE_BYTES:
        raise ValueError('Invalid bounded archive size or digest')
    if not isinstance(data['files'], dict) or not 1 <= len(data['files']) <= 2000:
        raise ValueError('Invalid package file ledger')
    for name, digest in data['files'].items():
        if not isinstance(name, str) or not _source_path(name) or not isinstance(digest, str) or not re.fullmatch('[0-9a-f]{64}', digest):
            raise ValueError('Unsafe or invalid source file ledger')
    return data


def _source_path(name):
    path = PurePosixPath(name)
    return bool(name) and '\x00' not in name and not path.is_absolute() and '\\' not in name and ':' not in name and '..' not in path.parts and all(not part.startswith(('.env', '.dev.vars')) and part not in ('.git', 'outputs', '__pycache__') for part in path.parts)


def _source_metadata(root, commit, version):
    marker = decode_json(_git(root, ['show', commit+':projects.json']))
    if not isinstance(marker, dict) or marker.get('suite') != 'ZOE. G Music Lab' or marker.get('version') != version or marker.get('license') != 'PolyForm-Noncommercial-1.0.0':
        raise ValueError('Immutable source metadata mismatch')
    names = _git(root, ['ls-tree', '-r', '-z', '--name-only', commit])
    if len(names) > MAX_MANIFEST_BYTES or any(not _source_path(name) for name in names.decode('utf-8').split('\0') if name):
        raise ValueError('Source contains out-of-scope paths')


def _zip_budget(archive):
    """Bound actual central entries before ZipFile allocates its entry objects."""
    inspect_archive(archive)


def _zip_ledger(archive, data, objects=None):
    _zip_budget(archive)
    with zipfile.ZipFile(archive) as zipped:
        entries = [entry for entry in zipped.infolist() if not entry.is_dir()]
        if len(entries) != len(data['files']) or sum(entry.file_size for entry in entries) > 256 * 1024 * 1024:
            raise ValueError('Archive ledger or expanded budget mismatch')
        names = [entry.filename for entry in entries]
        if len(set(names)) != len(names) or set(names) != {PREFIX+name for name in data['files']}:
            raise ValueError('Archive paths contradict source ledger')
        if objects is not None and set(data['files']) != set(objects):
            raise ValueError('Archive files contradict immutable source tree')
        for entry in entries:
            digest = hashlib.sha256()
            expected = objects.get(entry.filename[len(PREFIX):]) if objects is not None else None
            if expected is not None and expected['size'] != entry.file_size:
                raise ValueError('Archive size contradicts immutable Git blob')
            blob = blob_digest(entry.file_size) if expected is not None else None
            with zipped.open(entry) as source:
                while block := source.read(1024 * 1024):
                    digest.update(block)
                    if blob is not None:blob.update(block)
            if digest.hexdigest() != data['files'][entry.filename[len(PREFIX):]]:
                raise ValueError('Archive source bytes contradict ledger')
            if expected is not None and blob.hexdigest() != expected['oid']:
                raise ValueError('Archive bytes contradict immutable Git blob')


def _rebuild(root, commit, sha256, size, destination, profile=None):
    _git(root, archive_args(commit, destination, profile))
    if destination.stat().st_size != size or _digest(destination) != sha256:
        raise ValueError('Git archive bytes are not identical; package retained')


def _package_names(directory):
    """Two expected files; a third entry already establishes an excluded target."""
    names = []
    for path in directory.iterdir():
        names.append(path.name)
        if len(names) == 3:
            break
    return set(names)


def package_facts(root, directory, now):
    directory = safe_path(root, directory)
    if directory.parent != root/'outputs/releases' or not directory.is_dir():
        raise ValueError('Only direct release package directories are in scope')
    manifest_path = safe_path(root, directory/'manifest.json')
    if not manifest_path.is_file() or manifest_path.stat().st_size > MAX_MANIFEST_BYTES:
        raise ValueError('No bounded release manifest')
    data = _manifest(manifest_path)
    if directory.name != f"v{data['version']}-{data['commit'][:12]}":
        raise ValueError('Directory does not match its immutable manifest')
    archive = safe_path(root, directory/data['archive'])
    if not archive.is_file() or archive.stat().st_size > MAX_ARCHIVE_BYTES:
        raise ValueError('No bounded release archive')
    names = _package_names(directory)
    reasons = []
    if names != {'manifest.json', data['archive']}:
        reasons.append('extra_files_or_directories_preserved')
    info, manifest_info = archive.stat(), manifest_path.stat()
    archive_sha, manifest_sha = _digest(archive), _digest(manifest_path)
    if archive_sha != data['sha256'] or info.st_size != data['bytes']:
        reasons.append('archive_digest_or_size_mismatch')
    try:
        _zip_ledger(archive, data)
    except (ValueError, OSError, zipfile.BadZipFile, RuntimeError):
        reasons.append('archive_ledger_or_crc_unverified')
    try:
        tag = 'refs/tags/v'+data['version']
        resolved = _git(root, ['rev-parse', '--verify', tag+'^{commit}']).decode().strip()
        _source_metadata(root, data['commit'], data['version'])
        if resolved != data['commit']:
            raise ValueError('Tag source metadata mismatch')
        if manifest_profile(data) == RAW_PROFILE:
            objects = source_tree(_git(root, ['ls-tree', '-r', '-z', '--long', data['commit']]))
            _zip_ledger(archive, data, objects)
    except (ValueError, OSError, subprocess.TimeoutExpired):
        reasons.append('tag_or_source_unverified')
    newest = max(info.st_mtime, manifest_info.st_mtime)
    if not reasons and now - newest > 7 * 86400:
        try:
            with tempfile.TemporaryDirectory(prefix='zoe-rebuild-') as temp:
                selected = Path(temp).resolve();assert selected.parent == Path(tempfile.gettempdir()).resolve()
                _rebuild(root, data['commit'], data['sha256'], data['bytes'], selected/'rebuilt.zip', manifest_profile(data))
        except (ValueError, OSError, subprocess.TimeoutExpired):
            reasons.append('git_bytes_not_reproducible')
    identity = validate_candidate({'directory': directory.relative_to(root).as_posix(), 'version': data['version'],
                'commit': data['commit'], 'archive': data['archive'], 'archive_sha256': archive_sha,
                'manifest_sha256': manifest_sha, 'archive_mtime_ns': info.st_mtime_ns,
                'manifest_mtime_ns': manifest_info.st_mtime_ns, 'archive_bytes': info.st_size})
    return {'directory': identity['directory'], 'version': data['version'], 'newest_mtime': newest,
            'verified': not reasons, 'reasons': reasons, 'identity': identity, 'manifest': data}


def audit(root, run_records=(), now=None):
    root = workspace(root);now = time.time() if now is None else now
    release_root = root/'outputs/releases';packages, excluded, runs = [], [], []
    if release_root.exists():
        children = []
        for path in release_root.iterdir():
            if len(children) == MAX_RELEASE_ENTRIES:
                raise ValueError('Release directory capacity exceeded; no pruning permitted')
            children.append(path)
        for path in sorted(children):
            try:
                fact = package_facts(root, path, now)
                # Keep only policy/identity facts, not every full source file ledger.
                packages.append({key: fact[key] for key in ('directory', 'version', 'newest_mtime', 'verified', 'reasons', 'identity')})
                del fact
            except (ValueError, OSError, subprocess.TimeoutExpired) as error:
                excluded.append({'name': path.name, 'reason': str(error), 'action': 'preserved'})
    if len(run_records) > 32:
        raise ValueError('At most32 explicit run records per audit')
    for path in run_records:
        path = safe_path(root, path)
        if not path.is_relative_to(root/'outputs'):
            raise ValueError('Run record must belong to this project outputs')
        record = validate_run(read_document(path, 4096))
        runs.append(classify_run(record, observe_process(record['identity']['pid'])))
    plan = retention_plan(packages, now)
    decisions = {d['directory']: d for d in plan['decisions']}
    candidates = [p['identity'] for p in packages if decisions[p['directory']]['eligible']]
    return {'format': 'zoe-iteration-audit', 'schema_version': 1, 'scope': 'outputs/releases direct manifest/ZIP pairs and explicitly recorded local Windows runs',
            'excluded_scope': 'Drafts, backups, original media, other outputs, unrelated processes and other projects are preserved',
            'protected_versions': plan['protected_versions'], 'packages': plan['decisions'], 'excluded': excluded,
            'candidates': candidates, 'prune_token': prune_token(candidates), 'runs': runs,
            'running_or_unverified': sum(r['status'] in ('running', 'unverified') for r in runs), 'mutation': 'none'}


def audit_batch(root, package_directories, run_records=(), now=None):
    """Full read-only audit plus an explicit, independently versioned batch preview."""
    directories = prune_batch_directories(package_directories)
    report = audit(root, run_records, now)
    return {**prune_batch_plan(report['candidates'], directories), 'audit': report, 'mutation': 'none'}


def prune(root, token, run_records=(), *, package_directories=None):
    """Re-audit, journal, move within root, recheck, unlink exact files only."""
    directories = None if package_directories is None else prune_batch_directories(package_directories)
    root = workspace(root);report = audit(root, run_records)
    preview = report if directories is None else {**prune_batch_plan(report['candidates'], directories), 'audit': report}
    if preview['prune_token'] != token:
        raise ValueError('Preview changed; audit again before pruning')
    if report['running_or_unverified']:
        raise ValueError('Recorded run is still active or unverified; no pruning')
    selected = report['candidates'] if directories is None else preview['selected']
    if not selected:
        return {**preview, 'mutation': 'pruned', 'removed': [], 'journal': None}
    if len(selected) > MAX_RECOVERY_PACKAGES:
        raise ValueError('Recovery package capacity exceeded; no pruning')
    facts = [package_facts(root, root/p['directory'], time.time()) for p in selected]
    if [f['identity'] for f in facts] != selected or any(not f['verified'] for f in facts):
        raise ValueError('Candidate bytes or identity changed; no pruning')
    identifier = uuid.uuid4().hex
    entries = []
    for fact in facts:
        raw = (root/fact['directory']/'manifest.json').read_bytes()
        if hashlib.sha256(raw).hexdigest() != fact['identity']['manifest_sha256']:
            raise ValueError('Manifest changed before journaling; no pruning')
        entries.append({'identity': fact['identity'], 'manifest_utf8': raw.decode('utf-8')})
    journal = {'format': 'zoe-iteration-recovery', 'schema_version': 1, 'packages': entries}
    # A recovery receipt must remain readable under the same bounded restore contract.
    raw_journal = json.dumps(journal, ensure_ascii=False, indent=2, allow_nan=False).encode('utf-8') + b'\n'
    if len(raw_journal) > MAX_JOURNAL_BYTES:
        raise ValueError('Recovery journal capacity exceeded; no pruning')
    journal_path = write_new(root, root/'outputs/maintenance'/('prune-'+identifier+'.json'), journal)
    quarantine = safe_path(root, root/'outputs/maintenance'/('prune-'+identifier))
    quarantine.mkdir(exist_ok=False)
    removed = []
    for fact in facts:
        identity = fact['identity'];source = safe_path(root, root/identity['directory']);target = safe_path(root, quarantine/source.name)
        # Recheck immediately before the only directory move; neither path can escape root.
        latest_report = audit(root, run_records)
        latest = package_facts(root, source, time.time())
        if latest['identity'] != identity or not latest['verified'] or identity not in latest_report['candidates'] or latest_report['protected_versions'] != report['protected_versions'] or latest_report['running_or_unverified'] or target.exists():
            raise ValueError('Candidate changed; recovery journal retained')
        source.rename(target)
        archive = safe_path(root, target/identity['archive']);manifest = safe_path(root, target/'manifest.json')
        if _package_names(target) != {archive.name, manifest.name} or _digest(archive) != identity['archive_sha256'] or _digest(manifest) != identity['manifest_sha256']:
            raise ValueError('Moved package changed; quarantined files retained, see journal')
        archive.unlink();manifest.unlink();target.rmdir()
        removed.append(identity['directory'])
    quarantine.rmdir()
    return {**preview, 'mutation': 'pruned', 'removed': removed, 'journal': journal_path.relative_to(root).as_posix()}


def restore(root, journal_path):
    """Rebuild exact source ZIP and manifest, never overwrite an existing directory."""
    root = workspace(root);journal_path = safe_path(root, journal_path)
    if not journal_path.is_relative_to(root/'outputs/maintenance'):
        raise ValueError('Recovery journal must be in this project maintenance outputs')
    journal = read_document(journal_path, MAX_JOURNAL_BYTES)
    if not isinstance(journal, dict) or set(journal) != {'format', 'schema_version', 'packages'} or journal['format'] != 'zoe-iteration-recovery' or type(journal['schema_version']) is not int or journal['schema_version'] != 1 or not isinstance(journal['packages'], list) or not 1 <= len(journal['packages']) <= MAX_RECOVERY_PACKAGES:
        raise ValueError('Unknown recovery journal version or shape')
    prepared = [];names = set()
    with tempfile.TemporaryDirectory(prefix='zoe-restore-') as temp:
        staging = Path(temp).resolve();assert staging.parent == Path(tempfile.gettempdir()).resolve()
        for index, entry in enumerate(journal['packages']):
            if not isinstance(entry, dict) or set(entry) != {'identity', 'manifest_utf8'} or not isinstance(entry['manifest_utf8'], str):
                raise ValueError('Invalid recovery package entry')
            # Manifest is revalidated through the same strict reader, never executable text.
            candidate = staging/str(index);candidate.mkdir();manifest = candidate/'manifest.json';manifest.write_bytes(entry['manifest_utf8'].encode('utf-8'))
            data = _manifest(manifest);identity = validate_candidate(entry['identity'])
            directory = f"outputs/releases/v{data['version']}-{data['commit'][:12]}"
            if not isinstance(identity, dict) or identity.get('directory') != directory or identity.get('manifest_sha256') != _digest(manifest) or identity.get('archive_sha256') != data['sha256'] or identity.get('commit') != data['commit'] or identity.get('archive') != data['archive'] or identity.get('version') != data['version'] or identity.get('archive_bytes') != data['bytes'] or directory in names:
                raise ValueError('Recovery source or bytes contradict journal')
            names.add(directory);destination = safe_path(root, root/directory)
            if destination.exists():
                raise ValueError('Recovery refuses an existing package directory')
            _source_metadata(root, data['commit'], data['version'])
            profile = manifest_profile(data)
            archive = candidate/data['archive'];_rebuild(root, data['commit'], data['sha256'], data['bytes'], archive, profile)
            objects = source_tree(_git(root, ['ls-tree', '-r', '-z', '--long', data['commit']])) if profile == RAW_PROFILE else None
            _zip_ledger(archive, data, objects)
            prepared.append((destination, archive, manifest, identity))
        restored = []
        for destination, archive, manifest, identity in prepared:
            safe_path(root, destination);destination.parent.mkdir(parents=True, exist_ok=True);destination.mkdir(exist_ok=False)
            # xb refuses overwrite even if another writer intervenes after mkdir.
            for source, name in [(archive, archive.name), (manifest, 'manifest.json')]:
                with source.open('rb') as original, safe_path(root, destination/name).open('xb') as output:
                    while block := original.read(1024 * 1024):
                        output.write(block)
            os.utime(destination/archive.name, ns=(identity['archive_mtime_ns'], identity['archive_mtime_ns']))
            os.utime(destination/'manifest.json', ns=(identity['manifest_mtime_ns'], identity['manifest_mtime_ns']))
            restored.append(destination.relative_to(root).as_posix())
    return {'format': 'zoe-iteration-restore', 'schema_version': 1, 'restored': restored, 'source': journal_path.relative_to(root).as_posix()}
