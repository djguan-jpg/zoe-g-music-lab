# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
"""Selected text output adapter; default writes never replace a raced-in file."""
from pathlib import Path
def write_bundle(directory,files,overwrite=False):
    if type(overwrite) is not bool:raise ValueError('overwrite需為明確布林值')
    directory=Path(directory)
    for name in files:
        target=directory/name
        if target.is_symlink() or (target.exists() and not overwrite):
            raise ValueError(f'輸出已存在或為連結：{target}；請換目錄或明確使用 --overwrite')
    directory.mkdir(parents=True,exist_ok=True)
    for name,content in files.items():
        target=directory/name
        if target.is_symlink():raise ValueError('指定輸出變成連結；保留現場檔案，請檢查輸出目錄')
        try:
            with target.open('w' if overwrite else 'x',encoding='utf-8',newline='\n') as stream:stream.write(content)
        except FileExistsError:
            raise ValueError('輸出在寫入前出現；保留現場檔案，可能已有部分新成果，請檢查輸出目錄') from None
    return [str(directory/name) for name in files]
