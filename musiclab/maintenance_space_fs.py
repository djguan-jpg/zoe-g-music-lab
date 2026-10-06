# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
"""Read-only outputs traversal for the explicit project, separate from pruning."""
import os
import stat
import time
from pathlib import Path
from .maintenance_fs import safe_path, workspace
from .maintenance_space import SpaceAccumulator, MAX_DEPTH


def _linked(info):
    return stat.S_ISLNK(info.st_mode) or bool(
        getattr(info, 'st_file_attributes', 0) & getattr(stat, 'FILE_ATTRIBUTE_REPARSE_POINT', 1024))


def space_report(root, *, now=None):
    """Never open output files; fail rather than publish partial totals on errors.

    Check directory containment before and after enumeration. These checks do
    not promise atomic no-follow handles during concurrent filesystem changes.
    """
    try:
        root = workspace(root)
        output = safe_path(root, root / 'outputs')
        try:
            info = output.lstat()
        except FileNotFoundError:
            return SpaceAccumulator(time.time() if now is None else now, outputs_exists=False).report()
        if _linked(info) or not stat.S_ISDIR(info.st_mode):
            raise ValueError('Outputs must be a real project directory')
        model = SpaceAccumulator(time.time() if now is None else now, outputs_exists=True)
        pending = [(output, ())]
        while pending:
            directory, parts = pending.pop()
            safe_path(root, directory)
            info = directory.lstat()
            if _linked(info) or not stat.S_ISDIR(info.st_mode):
                raise ValueError('Outputs directory changed during traversal')
            before_key = (info.st_dev, info.st_ino)
            with os.scandir(directory) as entries:
                for entry in entries:
                    relative = (*parts, entry.name)
                    info = entry.stat(follow_symlinks=False)
                    if _linked(info):
                        model.add(relative, 'link')
                    elif stat.S_ISREG(info.st_mode):
                        model.add(relative, 'file', size=info.st_size, mtime=info.st_mtime)
                    elif stat.S_ISDIR(info.st_mode):
                        if len(relative) >= MAX_DEPTH:
                            raise ValueError('Outputs traversal depth budget exceeded')
                        model.add(relative, 'directory')
                        pending.append((Path(entry.path), relative))
                    else:
                        model.add(relative, 'other')
            safe_path(root, directory)
            after = directory.lstat()
            if _linked(after) or not stat.S_ISDIR(after.st_mode) or (after.st_dev, after.st_ino) != before_key:
                raise ValueError('Outputs directory changed during traversal')
        return model.report()
    except OSError:
        raise ValueError('Outputs metadata could not be fully read') from None
