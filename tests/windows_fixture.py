# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
"""Create only a junction inside one explicitly owned synthetic temp fixture."""
import ctypes
from ctypes import wintypes
import os
from pathlib import Path
import stat
import struct
import sys
import tempfile


def create_junction(link, target, fixture_root):
    if sys.platform != 'win32':
        raise OSError('Synthetic junction fixture requires Windows')
    root, link, target = map(lambda path: Path(path).absolute(), (fixture_root, link, target))
    if (root.resolve() != root or root.parent != Path(tempfile.gettempdir()).resolve()
            or not root.name.startswith('zoe-junction-') or root == root.parent
            or not link.is_relative_to(root) or not target.is_relative_to(root)
            or link == root or not target.is_dir() or os.path.lexists(link)):
        raise ValueError('Junction fixture must use a new leaf and owned temp paths')
    for path in (link.parent, target):
        for node in (path, *path.parents):
            info = node.lstat()
            if node.is_symlink() or info.st_file_attributes & stat.FILE_ATTRIBUTE_REPARSE_POINT:
                raise ValueError('Junction fixture cannot cross an existing reparse point')
            if node == root:
                break
    substitute = ('\\??\\'+str(target)).encode('utf-16-le')
    display = str(target).encode('utf-16-le')
    names = substitute+b'\0\0'+display+b'\0\0'
    payload = struct.pack('<IHHHHHH', 0xA0000003, 8+len(names), 0,
                          0, len(substitute), len(substitute)+2, len(display))+names
    if len(payload) > 16384:
        raise ValueError('Junction fixture reparse buffer exceeds the Windows limit')
    kernel = ctypes.WinDLL('kernel32', use_last_error=True)
    kernel.CreateFileW.argtypes = (wintypes.LPCWSTR, wintypes.DWORD, wintypes.DWORD,
                                  ctypes.c_void_p, wintypes.DWORD, wintypes.DWORD, wintypes.HANDLE)
    kernel.CreateFileW.restype = wintypes.HANDLE
    kernel.DeviceIoControl.argtypes = (wintypes.HANDLE, wintypes.DWORD, ctypes.c_void_p,
                                      wintypes.DWORD, ctypes.c_void_p, wintypes.DWORD,
                                      ctypes.POINTER(wintypes.DWORD), ctypes.c_void_p)
    kernel.DeviceIoControl.restype = wintypes.BOOL
    kernel.CloseHandle.argtypes = (wintypes.HANDLE,)
    kernel.CloseHandle.restype = wintypes.BOOL
    link.mkdir()
    handle = kernel.CreateFileW(str(link), 0x40000000, 0, None, 3,
                                0x00200000 | 0x02000000, None)
    if handle == wintypes.HANDLE(-1).value:
        raise ctypes.WinError(ctypes.get_last_error())
    try:
        buffer = ctypes.create_string_buffer(payload)
        returned = wintypes.DWORD()
        if not kernel.DeviceIoControl(handle, 0x000900A4, buffer, len(payload),
                                      None, 0, ctypes.byref(returned), None):
            raise ctypes.WinError(ctypes.get_last_error())
    finally:
        kernel.CloseHandle(handle)
    if not link.lstat().st_file_attributes & stat.FILE_ATTRIBUTE_REPARSE_POINT or link.resolve() != target:
        raise ValueError('Synthetic junction did not preserve its exact target')
