# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
"""CLI for four original ZOE. G projects. Python standard library only."""
import argparse
import sys
from pathlib import Path
from musiclab.common import read_json, write_bundle
from musiclab.lyrics import read_cues, edits
from musiclab.application import build
from musiclab import __version__


def main(argv=None):
    parser = argparse.ArgumentParser(description=f"ZOE. G Music Lab · 本機 v{__version__}")
    commands = parser.add_subparsers(dest="command", required=True)
    for name in ("music", "storyboard", "lyrics", "audio"):
        sub = commands.add_parser(name)
        sub.add_argument("--out", required=True, help="指定本輪輸出資料夾")
        sub.add_argument("--overwrite", action="store_true", help="明確替換此輸出目錄的同名成果")
        if name in ("music", "storyboard"):
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
    args = parser.parse_args(argv)
    status = 0
    try:
        if args.command in ("music", "storyboard"):
            bundle = build(args.command, read_json(args.brief)).files
        elif args.command == "lyrics":
            path = Path(args.input)
            data = read_cues(path.read_text(encoding="utf-8-sig"), path.suffix)
            cues = edits(data, args.shift, args.set, args.text)
            bundle = build("lyrics", {"cues": cues, "title": args.title, "duration": args.duration}).files
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
    if status == 2:
        print("已完成分析，有需確認項目；詳見 report.md。")
    return status


if __name__ == "__main__":
    for stream in (sys.stdout, sys.stderr):
        if hasattr(stream, "reconfigure"):
            stream.reconfigure(encoding="utf-8")
    raise SystemExit(main())
