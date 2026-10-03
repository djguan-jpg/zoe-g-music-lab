# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
"""CLI for four original ZOE. G projects. Python standard library only."""
import argparse
import json
import sys
from pathlib import Path
from musiclab.common import read_json, write_bundle
from musiclab.lyrics import read_cues
from musiclab.application import build, export_library_backup
from musiclab.backup_files import write_backup
from musiclab import __version__
from musiclab.draft_library import DraftLibrary, revision_id


def main(argv=None):
    parser = argparse.ArgumentParser(description=f"ZOE. G Music Lab · 本機 v{__version__}")
    commands = parser.add_subparsers(dest="command", required=True)
    for name in ("music", "storyboard", "lyrics", "audio", "storyboard-seed", "lyrics-seed"):
        sub = commands.add_parser(name)
        sub.add_argument("--out", required=True, help="指定本輪輸出資料夾")
        sub.add_argument("--overwrite", action="store_true", help="明確替換此輸出目錄的同名成果")
        if name == 'lyrics-seed':
            source_group = sub.add_mutually_exclusive_group(required=True)
            source_group.add_argument('--text', help='明確選定UTF-8純文字檔，不猜測時間')
            source_group.add_argument('--seed', help='未校時歌詞起稿JSON，核對後輸出')
            sub.add_argument('--title', help='--text需要作品名稱；--seed不可覆蓋名稱')
        elif name == "storyboard-seed":
            source_group = sub.add_mutually_exclusive_group(required=True)
            source_group.add_argument("--brief")
            source_group.add_argument("--seed", help="已產生的起稿 JSON，先核對再輸出")
        elif name in ("music", "storyboard"):
            sub.add_argument("--brief", required=True)
        else:
            sub.add_argument("--input", required=True)
        if name == "lyrics":
            sub.add_argument("--title", default="歌詞")
            sub.add_argument("--duration", type=float)
            sub.add_argument("--shift", type=float, default=0)
            sub.add_argument("--set", action="append", default=[])
            sub.add_argument("--text", action="append", default=[])
        if name == "audio":
            sub.add_argument("--profile", choices=["distribution", "video"], default="distribution")
            for setting in ("rates", "bits", "channels"):
                sub.add_argument(f"--{setting}", type=int, nargs="+")
        if name == 'storyboard-seed':
            sub.add_argument('--fps', type=float)
            sub.add_argument('--bars-per-shot', type=int)
    drafts = commands.add_parser("draft", help="明確選定本機草稿庫；保存版本不覆寫")
    actions = drafts.add_subparsers(dest="draft_action", required=True)
    for action in ("save", "list", "read", "backup", "inspect", "restore"):
        sub = actions.add_parser(action)
        sub.add_argument("--library", required=True, help="明確選定草稿庫目錄")
        if action == "save":
            sub.add_argument("--input", required=True, help="已轉換的 schema 3 草稿 JSON")
            sub.add_argument("--label", required=True)
            sub.add_argument("--id", help="相同內容重試用相同 ID，不同內容用新 ID")
        elif action == "read":
            sub.add_argument("--id", required=True)
        elif action == "backup":
            sub.add_argument("--out", required=True, help="新備份 ZIP 路徑，不覆寫")
            sub.add_argument("--ids", nargs="+", help="可選：只備份明確選定的保存 ID")
        elif action in ("inspect", "restore"):
            sub.add_argument("--input", required=True, help="明確選定的備份 ZIP")
            if action == "restore":
                sub.add_argument("--sha256", required=True, help="inspect 預覽的備份摘要")
        else:
            sub.add_argument("--limit", type=int, default=20)
            sub.add_argument("--cursor")
    args = parser.parse_args(argv)
    status = 0
    try:
        if args.command == "draft":
            if hasattr(sys.stdout, "reconfigure"):
                sys.stdout.reconfigure(encoding="utf-8")
            library = DraftLibrary(args.library)
            if args.draft_action == "backup":
                raw, result = export_library_backup(library, args.ids)
                write_backup(args.out, raw, library)
            elif args.draft_action in ("inspect", "restore"):
                payload = {"backup_sha256": args.sha256} if args.draft_action == "restore" else {}
                result = build("draft_backup_"+args.draft_action, payload, draft_library=library, backup_source=args.input).wire()
            else:
                payload = ({"draft": read_json(args.input), "label": args.label, "id": args.id or revision_id()} if args.draft_action == "save" else
                       {"id": args.id} if args.draft_action == "read" else {"limit": args.limit, "cursor": args.cursor})
                result = build("draft_" + args.draft_action, payload, draft_library=library).wire()
            print(json.dumps(result, ensure_ascii=False, allow_nan=False))
            return 0
        if args.command == 'lyrics-seed':
            if args.seed:
                if args.title is not None: raise ValueError('--seed 不接受 --title 覆蓋')
                payload = {'seed':read_json(args.seed)}
            else:
                path=Path(args.text)
                if path.stat().st_size>64*1024+3: raise ValueError('純歌詞文字最多64 KiB')
                payload = {'title':args.title,'text':path.read_bytes().decode('utf-8-sig')}
            bundle=build('lyrics_seed',payload).files
        elif args.command == 'storyboard-seed':
            if args.seed:
                if args.fps is not None or args.bars_per_shot is not None:
                    raise ValueError('--seed 不接受 --fps／--bars-per-shot 覆蓋；請保留原起稿設定')
                payload = {'seed': read_json(args.seed)}
            else:
                payload = {'music': read_json(args.brief), 'fps': args.fps if args.fps is not None else 24,
                           'bars_per_shot': args.bars_per_shot if args.bars_per_shot is not None else 4}
            bundle = build('storyboard_seed', payload).files
        elif args.command in ("music", "storyboard"):
            bundle = build(args.command, read_json(args.brief)).files
        elif args.command == "lyrics":
            path = Path(args.input)
            data = read_cues(path.read_text(encoding="utf-8-sig"), path.suffix)
            bundle = build("lyrics", {"cues": data, "title": args.title, "duration": args.duration,
                "shift_seconds": args.shift, "time_changes": args.set, "text_changes": args.text}).files
        else:
            options = {name: getattr(args, name) for name in ("profile", "rates", "bits", "channels")}
            result = build("audio", options, audio_source=args.input)
            bundle = result.files
            status = 2 if result.needs_review else 0
        paths = write_bundle(args.out, bundle, args.overwrite)
    except (ValueError, OSError, TypeError, KeyError) as error:
        print(f"錯誤：{error}", file=sys.stderr)
        return 1
    print(f"{args.command} 完成，輸出 {len(paths)} 個檔案：{Path(args.out).resolve()}")
    if args.command == 'storyboard-seed':
        print('時間起稿尚未完成分鏡；請依實際音檔校準，並人工編寫畫面、運鏡、轉場與人物狀態。')
    if args.command == 'lyrics-seed':
        print('未校時歌詞起稿已建立；沒有猜測時間，請依實際音檔標記開始與結束。')
    if status == 2:
        print("已完成分析，有需確認項目；詳見 report.md。")
    return status


if __name__ == "__main__":
    for stream in (sys.stdout, sys.stderr):
        if hasattr(stream, "reconfigure"):
            stream.reconfigure(encoding="utf-8")
    raise SystemExit(main())
