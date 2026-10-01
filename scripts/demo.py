# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
"""Generate synthetic QA audio and run all four examples locally."""
import math
import struct
import subprocess
import sys
import wave
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def main():
    qa = ROOT / "outputs/qa"
    qa.mkdir(parents=True, exist_ok=True)
    audio = qa / "synthetic-60s.wav"
    if not audio.exists():
        rate = 48000
        second = b"".join(struct.pack("<hh", value, value) for value in (
            round(3276 * math.sin(2 * math.pi * 440 * index / rate)) for index in range(rate)))
        with wave.open(str(audio), "wb") as wav:
            wav.setnchannels(2)
            wav.setsampwidth(2)
            wav.setframerate(rate)
            for _ in range(60):
                wav.writeframesraw(second)
    commands = [
        ["music", "--brief", str(ROOT / "examples/music-brief.json")],
        ["storyboard", "--brief", str(ROOT / "examples/mv-brief.json")],
        ["lyrics", "--input", str(ROOT / "examples/lyrics.lrc"), "--title", "合成案例：雨後折返", "--duration", "60"],
        ["audio", "--input", str(audio)],
    ]
    for command in commands:
        result = subprocess.run([sys.executable, "-X", "utf8", str(ROOT / "music_lab.py"),
                                 *command, "--out", str(ROOT / "outputs" / command[0])], cwd=ROOT)
        if result.returncode:
            return result.returncode
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
