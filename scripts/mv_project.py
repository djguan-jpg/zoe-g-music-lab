# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
"""Agent-friendly local bridge; each mutation writes a new, exclusive file."""
import argparse
import hashlib
import json
import os
from pathlib import Path
import stat
import sys

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from musiclab import mv_project as P
from musiclab.draft_contract import MAX_DRAFT_BYTES, validate_draft
from musiclab.json_document import decode_json


def check_path(path):
    path = Path(path).absolute()
    for parent in (path, *path.parents):
        if not parent.exists():
            continue
        info = parent.lstat()
        if stat.S_ISLNK(info.st_mode) or getattr(info, 'st_file_attributes', 0) & 0x400:
            raise ValueError('不接受 symlink 或 reparse 路徑')
    if path.name.lower().startswith(('.env', '.dev.vars')):
        raise ValueError('不接受秘密設定檔作為素材')
    return path


def read(path, limit):
    path = check_path(path)
    before = path.stat()
    if not stat.S_ISREG(before.st_mode) or not 0 < before.st_size <= limit:
        raise ValueError('來源不是一般檔案或超過大小上限')
    with path.open('rb') as stream:
        identity = os.fstat(stream.fileno())
        if (before.st_dev, before.st_ino, before.st_size, before.st_mtime_ns) != (
                identity.st_dev, identity.st_ino, identity.st_size, identity.st_mtime_ns):
            raise ValueError('來源在開啟期間改變')
        raw = stream.read(limit + 1)
        after = os.fstat(stream.fileno())
    if len(raw) != before.st_size or (identity.st_size, identity.st_mtime_ns) != (after.st_size, after.st_mtime_ns):
        raise ValueError('來源在讀取期間改變')
    return raw


def write(path, raw):
    path = check_path(path)
    # No directories are created; no original plan or project is overwritten.
    with path.open('xb') as stream:
        stream.write(raw)
        stream.flush()
        os.fsync(stream.fileno())
    saved = read(path, len(raw))
    if saved != raw:
        raise ValueError('輸出回讀不符，請核對輸出檔案')
    return {'bytes': len(raw), 'sha256': hashlib.sha256(raw).hexdigest()}


def main(argv=None):
    parser = argparse.ArgumentParser(description='MV 素材專案：Agent 讀取／修訂，素材保留，另存新版')
    commands = parser.add_subparsers(dest='command', required=True)
    inspect = commands.add_parser('inspect')
    inspect.add_argument('--input', required=True)
    inspect.add_argument('--plan-out', required=True)
    change = commands.add_parser('revise')
    change.add_argument('--input', required=True)
    change.add_argument('--expect-sha256', required=True)
    change.add_argument('--plan', required=True)
    change.add_argument('--out', required=True)
    create = commands.add_parser('create')
    create.add_argument('--draft', required=True)
    create.add_argument('--audio')
    create.add_argument('--image', action='append', default=[], help='shot-1=明確圖片路徑；最多64張')
    create.add_argument('--out', required=True)
    args = parser.parse_args(argv)
    if args.command in ('inspect', 'revise'):
        raw = read(args.input, P.MAX_JSON)
        project = P.decode(raw)
        sha = hashlib.sha256(raw).hexdigest()
        if args.command == 'inspect':
            plan = {'draft': project['draft'], 'shot_ids': project['shot_ids']}
            receipt = write(args.plan_out, (json.dumps(plan, ensure_ascii=False, separators=(',', ':')) + '\n').encode('utf-8'))
            print(json.dumps({'source_sha256': sha, 'plan': receipt, 'audio': project['audio'] and {
                k: project['audio'][k] for k in ('name', 'size', 'sha256')}, 'images': [{
                'shot_id': image['shot_id'], **{k: image['asset'][k] for k in ('name', 'size', 'sha256')}}
                for image in project['images']]}, ensure_ascii=False))
            return
        if args.expect_sha256 != sha:
            raise ValueError('專案來源 SHA-256 已改變；沒有寫入')
        plan = decode_json(read(args.plan, MAX_DRAFT_BYTES + 65536), max_bytes=MAX_DRAFT_BYTES + 65536,
                           allow_bom=False, label='Agent 企劃')
        project = P.revise(project, plan)
    else:
        draft = validate_draft(decode_json(read(args.draft, MAX_DRAFT_BYTES), max_bytes=MAX_DRAFT_BYTES,
                                           allow_bom=False, label='企劃草稿'))
        project = {'format': 'zoe-mv-project', 'schema_version': 1, 'draft': draft,
                   'shot_ids': ['shot-' + str(i + 1) for i in range(len(draft['panels']['storyboard']['shots']))],
                   'audio': None, 'images': []}
        audio_types = {'.wav': 'audio/wav', '.mp3': 'audio/mpeg', '.ogg': 'audio/ogg', '.flac': 'audio/flac',
                       '.m4a': 'audio/mp4', '.aac': 'audio/aac', '.webm': 'audio/webm'}
        image_types = {'.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp'}
        if len(args.image) > 64:
            raise ValueError('最多保存64張圖片')
        # Bound total memory before reading even the first selected media file.
        selected_paths = ([args.audio] if args.audio else []) + [item.split('=', 1)[1] for item in args.image if '=' in item]
        if sum(check_path(path).stat().st_size for path in selected_paths) > P.MAX_MEDIA:
            raise ValueError('音檔與圖片合計最多64 MiB')
        if args.audio:
            path = Path(args.audio)
            mime = audio_types.get(path.suffix.lower())
            if mime is None:
                raise ValueError('音訊副檔名不支援')
            project['audio'] = P.pack(path.name, mime, read(path, P.MAX_MEDIA))
        if len(args.image) > 64:
            raise ValueError('最多保存64張圖片')
        for selection in args.image:
            if '=' not in selection:
                raise ValueError('圖片參數需為 shot-ID=檔案路徑')
            shot, filename = selection.split('=', 1)
            path = Path(filename)
            mime = image_types.get(path.suffix.lower())
            if mime is None:
                raise ValueError('圖片副檔名不支援')
            project['images'].append({'shot_id': shot, 'asset': P.pack(path.name, mime, read(path, P.MAX_IMAGE))})
    receipt = write(args.out, P.encode(project))
    print(json.dumps({'saved': True, **receipt, 'audio_preserved': args.command == 'revise',
                      'images': len(project['images']), 'shots': len(project['shot_ids'])}, ensure_ascii=False))


if __name__ == '__main__':
    try:
        main()
    except (ValueError, OSError, UnicodeError) as error:
        print(str(error), file=sys.stderr)
        sys.exit(1)
