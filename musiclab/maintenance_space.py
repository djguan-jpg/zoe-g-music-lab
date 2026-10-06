# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
"""Pure, bounded outputs metadata accounting; never evaluates deletion safety."""
import math
import re

MAX_FILES = 50000
MAX_DIRECTORIES = 20000
MAX_ENTRIES = 75000
MAX_DEPTH = 64
MAX_ITERATIONS = 1024
MAX_TOTAL_BYTES = 2**63 - 1
TOP_ITERATIONS = 20
SEVEN_DAYS = 7 * 86400
CATEGORIES = ('release_area', 'iteration_area', 'other_area')
_ITERATION = re.compile(r'v(0|[1-9][0-9]{0,5})-qa', re.ASCII)


def _timestamp(value):
    if type(value) not in (int, float) or abs(value) > 2**53 - 1 or not math.isfinite(value):
        raise ValueError('Invalid outputs metadata timestamp')
    return value


def _totals():
    return dict(files=0, bytes=0, older_than_seven_days_files=0,
                older_than_seven_days_bytes=0)


class SpaceAccumulator:
    """Accept internal relative metadata only; output never contains arbitrary names."""

    def __init__(self, now, *, outputs_exists):
        self.now = _timestamp(now)
        if type(outputs_exists) is not bool:
            raise ValueError('Invalid outputs existence flag')
        self.exists = outputs_exists
        self.files = self.directories = self.links = self.other = self.future = 0
        self.categories = {name: _totals() for name in CATEGORIES}
        self.iterations = {}

    def add(self, parts, kind, *, size=0, mtime=None):
        if (type(parts) is not tuple or not 1 <= len(parts) <= MAX_DEPTH
                or any(type(p) is not str or not p or p in ('.', '..')
                       or any(c in p for c in '/\\\x00') for p in parts)):
            raise ValueError('Invalid bounded relative metadata location')
        if not self.exists or kind not in ('file', 'directory', 'link', 'other'):
            raise ValueError('Invalid outputs metadata entry')
        if type(size) is not int or not 0 <= size <= MAX_TOTAL_BYTES:
            raise ValueError('Invalid outputs metadata size')
        if kind != 'file' and (size != 0 or mtime is not None):
            raise ValueError('Only regular files carry size and timestamp')
        if self.files + self.directories + self.links + self.other >= MAX_ENTRIES:
            raise ValueError('Outputs entry budget exceeded')
        if kind == 'directory':
            if self.directories >= MAX_DIRECTORIES:
                raise ValueError('Outputs directory budget exceeded')
            self.directories += 1
            return
        if kind in ('link', 'other'):
            if kind == 'link':
                self.links += 1
            else:
                self.other += 1
            return
        stamp = _timestamp(mtime)
        if self.files >= MAX_FILES:
            raise ValueError('Outputs file budget exceeded')
        if sum(row['bytes'] for row in self.categories.values()) + size > MAX_TOTAL_BYTES:
            raise ValueError('Outputs byte budget exceeded')
        # These are placement categories, not assertions of ownership or file type.
        match = _ITERATION.fullmatch(parts[0]) if len(parts) > 1 else None
        version = int(match.group(1)) if match else None
        category = ('release_area' if len(parts) > 1 and parts[0] == 'releases'
                    else 'iteration_area' if match else 'other_area')
        if version is not None and version not in self.iterations and len(self.iterations) >= MAX_ITERATIONS:
            raise ValueError('Outputs iteration group budget exceeded')
        old = self.now - stamp > SEVEN_DAYS
        self.files += 1
        self.future += stamp > self.now
        rows = [self.categories[category]]
        if version is not None:
            rows.append(self.iterations.setdefault(version, _totals()))
        for row in rows:
            row['files'] += 1
            row['bytes'] += size
            row['older_than_seven_days_files'] += old
            row['older_than_seven_days_bytes'] += size if old else 0

    def report(self):
        totals = {key: sum(row[key] for row in self.categories.values()) for key in _totals()}
        largest = sorted(self.iterations.items(), key=lambda item: (-item[1]['bytes'], item[0]))[:TOP_ITERATIONS]
        return {
            'format': 'zoe-outputs-space-report', 'schema_version': 1,
            'source': 'outputs_metadata', 'complete': True,
            'outputs_exists': self.exists, 'observed_at': self.now,
            'mutation': 'none', 'deletion_candidates_evaluated': False,
            **totals, 'directories': self.directories,
            'skipped_links': self.links, 'skipped_other': self.other,
            'future_timestamp_files': self.future,
            'categories': [{'category': name, **self.categories[name]} for name in CATEGORIES],
            'iterations_count': len(self.iterations),
            'largest_iterations': [{'iteration': f'v{version}-qa', **row} for version, row in largest],
            'limits': {'files': MAX_FILES, 'directories': MAX_DIRECTORIES,
                       'entries': MAX_ENTRIES, 'depth': MAX_DEPTH,
                       'iteration_groups': MAX_ITERATIONS, 'top_iterations': TOP_ITERATIONS},
            'notes': [
                'Logical file sizes; hard links count once per observed filename, not allocated disk space.',
                'Metadata traversal is not an atomic snapshot; skipped links are not traversed.',
                'Folder placement and age do not establish ownership, reconstruction or deletion eligibility.',
                'No file contents or arbitrary filenames are included. Existing audit/prune policy remains required.',
            ],
        }
