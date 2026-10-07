# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
"""Pure buffers and fixed commands for bounded release Git-tree reads."""
import re
from .release_archive import MAX_TREE_BYTES

STDOUT_BYTES = MAX_TREE_BYTES
STDERR_BYTES = 4096
READ_BYTES = 65536


def tree_args(commit, names_only=False):
    if not isinstance(commit,str) or not re.fullmatch('[0-9a-f]{40}',commit) or type(names_only) is not bool:
        raise ValueError('Invalid fixed Git tree request')
    return ['git','ls-tree','-r','-z','--name-only' if names_only else '--long',commit]


class CaptureBuffer:
    """Retain at most the budget plus one sentinel; reject rather than truncate."""
    def __init__(self, limit):
        if type(limit) is not int or not 1 <= limit <= STDOUT_BYTES:
            raise ValueError('Invalid capture byte budget')
        self.limit=limit
        self._data=bytearray()
        self.overflow=False

    def feed(self, block):
        if type(block) is not bytes or len(block)>READ_BYTES:
            raise ValueError('Invalid bounded capture block')
        remaining=self.limit+1-len(self._data)
        if remaining>0:self._data.extend(block[:remaining])
        self.overflow=len(self._data)>self.limit
        return self.overflow

    def value(self):
        if self.overflow:raise ValueError('Git source tree capture byte budget exceeded')
        return bytes(self._data)
