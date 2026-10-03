# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
"""Print this checkout's exact stdio launch settings; never install or run a host."""
import argparse
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def launch_config(draft_library=None):
    return {"command": Path(sys.executable).as_posix(),
            "args": [(ROOT / "music_lab_mcp.py").as_posix()] +
                    (["--draft-library", Path(draft_library).resolve().as_posix()] if draft_library else []),
            "startup_timeout_sec": 10, "tool_timeout_sec": 60}


def codex_toml(config):
    return "\n".join(["[mcp_servers.zoe_music_lab]", *(
        f"{key} = {json.dumps(value, ensure_ascii=False)}" for key, value in config.items())]) + "\n"


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--format", choices=("json", "codex"), default="json")
    parser.add_argument("--draft-library", help="Explicit local directory to enable draft save/read/list")
    args = parser.parse_args()
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    config = launch_config(args.draft_library)
    print(codex_toml(config) if args.format == "codex" else json.dumps(config, ensure_ascii=False, indent=2),
          end="" if args.format == "codex" else "\n")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
