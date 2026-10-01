"""CLI for four original ZOE. G projects. Python standard library only."""
import argparse
import sys
from pathlib import Path
from musiclab.common import read_json, write_bundle
from musiclab.creative import music_bundle, storyboard_bundle
from musiclab.lyrics import read_cues, edits, lyrics_bundle
from musiclab.audio import analyze_wav, audio_bundle
from musiclab.design import music_plan_bundle, motif_bundle


def main(argv=None):
    parser = argparse.ArgumentParser(description="ZOE. G Music Lab · 本機 v0.2")
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
        if args.command == "music":
            brief = read_json(args.brief)
            bundle = music_plan_bundle(brief) if "arrangement" in brief else music_bundle(brief)
        elif args.command == "storyboard":
            brief = read_json(args.brief)
            bundle = motif_bundle(brief) if "motifs" in brief else storyboard_bundle(brief)
        elif args.command == "lyrics":
            path = Path(args.input)
            data = read_cues(path.read_text(encoding="utf-8-sig"), path.suffix)
            cues = edits(data, args.shift, args.set, args.text)
            bundle = lyrics_bundle(cues, args.title, args.duration)
        else:
            report = analyze_wav(args.input, args.profile, args.rates, args.bits, args.channels)
            bundle = audio_bundle(report)
            status = 2 if report["warnings"] else 0
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
