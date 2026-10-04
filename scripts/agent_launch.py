# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
"""Print this checkout's exact stdio launch settings; never install or run a host."""
import argparse
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def launch_config(draft_library=None, draft_backup=None, *, audio=None, delivery_zip=None):
    if draft_backup and not draft_library:
        raise ValueError("--draft-backup requires --draft-library")
    selected=[]
    for flag,value,suffix in [('--audio',audio,'.wav'),('--delivery-zip',delivery_zip,'.zip')]:
        if value is not None:
            path=Path(value)
            if path.suffix.lower()!=suffix:raise ValueError(flag+'只接受'+suffix+'來源')
            selected.extend([flag,path.resolve().as_posix()])
    return {"command": Path(sys.executable).as_posix(),
            "args": [(ROOT / "music_lab_mcp.py").as_posix()] +
                    (["--draft-library", Path(draft_library).resolve().as_posix()] if draft_library else []) +
                    (["--draft-backup", Path(draft_backup).resolve().as_posix()] if draft_backup else [])+selected,
            "startup_timeout_sec": 10, "tool_timeout_sec": 60}


def codex_toml(config):
    return "\n".join(["[mcp_servers.zoe_music_lab]", *(
        f"{key} = {json.dumps(value, ensure_ascii=False)}" for key, value in config.items())]) + "\n"


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--format", choices=("json", "codex"), default="json")
    parser.add_argument("--draft-library", help="Explicit local directory to enable draft save/read/list")
    parser.add_argument("--draft-backup", help="Explicit backup ZIP selected for inspect/restore")
    parser.add_argument('--audio',help='Explicit selected WAV; only prints launch settings')
    parser.add_argument('--delivery-zip',help='Explicit selected delivery ZIP; only prints launch settings')
    args = parser.parse_args()
    if args.draft_backup and not args.draft_library:
        parser.error("--draft-backup requires --draft-library")
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    try:config=launch_config(args.draft_library,args.draft_backup,audio=args.audio,delivery_zip=args.delivery_zip)
    except ValueError as error:parser.error(str(error))
    print(codex_toml(config) if args.format == "codex" else json.dumps(config, ensure_ascii=False, indent=2),
          end="" if args.format == "codex" else "\n")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
