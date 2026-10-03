# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
import hashlib
import math
import wave
from pathlib import Path
from .common import json_text
from . import __version__

PROFILES = {
    "distribution": {"rates": [44100, 48000], "bits": [16, 24], "channels": [1, 2]},
    "video": {"rates": [48000], "bits": [16, 24], "channels": [1, 2]},
}


def dbfs(amplitude):
    return round(20 * math.log10(amplitude), 3) if amplitude > 0 else None


def analyze_wav(path, profile="distribution", rates=None, bits=None, channels=None):
    path = Path(path)
    if not isinstance(profile, str) or profile not in PROFILES:
        raise ValueError("profile 需為 distribution 或 video")
    limits = {key: list(value) for key, value in PROFILES[profile].items()}
    for key, values in (("rates", rates), ("bits", bits), ("channels", channels)):
        if values is not None:
            if not isinstance(values, list) or not values or any(
                    type(value) not in (int, float) or value <= 0 or
                    isinstance(value, float) and not value.is_integer() for value in values):
                raise ValueError(f"{key} 接受條件需為正整數")
            # JSON Schema integers include 1.0; normalize exact integer values.
            limits[key] = [int(value) for value in values]
    sha = hashlib.sha256()
    with path.open("rb") as raw:
        for chunk in iter(lambda: raw.read(1024 * 1024), b""):
            sha.update(chunk)
    try:
        with wave.open(str(path), "rb") as wav:
            if wav.getcomptype() != "NONE":
                raise ValueError("本版只分析未壓縮 PCM WAV")
            count, width, rate, declared_frames = wav.getnchannels(), wav.getsampwidth(), wav.getframerate(), wav.getnframes()
            if width not in (1, 2, 3, 4) or not 1 <= count <= 32 or rate <= 0:
                raise ValueError("WAV 位元深度、聲道或取樣率不支援")
            scale = 2 ** (width * 8 - 1)
            stats = [{"peak": 0.0, "sum": 0.0, "squares": 0.0, "full_scale_samples": 0} for _ in range(count)]
            frames = 0
            first_active, last_active, quiet_frames, stereo_product = None, None, 0, 0.0
            quiet_threshold = 10 ** (-60 / 20)
            while True:
                block = wav.readframes(8192)
                if not block:
                    break
                if len(block) % (width * count):
                    raise ValueError("WAV 資料不是完整音訊幀")
                block_frames = len(block) // (width * count)
                frame_values = []
                for index in range(0, len(block), width):
                    channel = (index // width) % count
                    sample = block[index] - 128 if width == 1 else int.from_bytes(block[index:index + width], "little", signed=True)
                    normalized = sample / scale
                    frame_values.append(normalized)
                    state = stats[channel]
                    state["peak"] = max(state["peak"], abs(normalized))
                    state["sum"] += normalized
                    state["squares"] += normalized ** 2
                    if sample in (-scale, scale - 1):
                        state["full_scale_samples"] += 1
                    if channel == count - 1:
                        frame_index = frames + index // (width * count)
                        if any(abs(value) > quiet_threshold for value in frame_values):
                            if first_active is None:
                                first_active = frame_index
                            last_active = frame_index
                        else:
                            quiet_frames += 1
                        if count == 2:
                            stereo_product += frame_values[0] * frame_values[1]
                        frame_values.clear()
                frames += block_frames
            if frames == 0:
                raise ValueError("音檔沒有音訊幀")
            if frames != declared_frames:
                raise ValueError("WAV 內容截斷，實際幀數與標頭不同")
    except (wave.Error, EOFError) as error:
        raise ValueError(f"無法分析為 PCM WAV：{error}") from None
    per_channel = []
    for index, state in enumerate(stats, 1):
        rms = math.sqrt(state["squares"] / frames)
        per_channel.append({"channel": index, "peak_dbfs": dbfs(state["peak"]), "rms_dbfs": dbfs(rms),
                            "dc_offset": round(state["sum"] / frames, 8),
                            "full_scale_samples": state["full_scale_samples"]})
    checks = {"sample_rate": rate in limits["rates"], "bit_depth": width * 8 in limits["bits"],
              "channels": count in limits["channels"]}
    warnings = []
    for label, passed in checks.items():
        if not passed:
            warnings.append(f"{label} 未符合本次接受條件")
    full_scale = sum(state["full_scale_samples"] for state in stats)
    if full_scale:
        warnings.append(f"發現 {full_scale} 個滿刻度樣本，請聆聽確認可能削波")
    if all(state["peak"] == 0 for state in stats):
        warnings.append("所有聲道為數位靜音")
    if any(abs(state["sum"] / frames) > 0.01 for state in stats):
        warnings.append("DC offset 絕對值超過 0.01，請確認來源")
    quiet = {"threshold_dbfs": -60, "leading_seconds": round((first_active if first_active is not None else frames) / rate, 6),
             "trailing_seconds": round((frames - last_active - 1 if last_active is not None else frames) / rate, 6),
             "quiet_frame_ratio": round(quiet_frames / frames, 6)}
    correlation = None
    if count == 2:
        a, b = stats
        variance_a = max(0, a["squares"] - a["sum"] ** 2 / frames)
        variance_b = max(0, b["squares"] - b["sum"] ** 2 / frames)
        if variance_a > 1e-15 and variance_b > 1e-15:
            correlation = round(max(-1, min(1, (stereo_product - a["sum"] * b["sum"] / frames) /
                                              math.sqrt(variance_a * variance_b))), 6)
    if quiet["leading_seconds"] > 2 or quiet["trailing_seconds"] > 2:
        warnings.append("頭尾低於 -60 dBFS 的安靜段超過 2 秒；請確認是否刻意保留")
    if correlation is not None and correlation < -0.5:
        warnings.append("立體聲相關性低於 -0.5；請聆聽確認轉單聲道時的相消")
    return {"tool": "ZOE Audio Delivery", "version": __version__, "file": path.name, "sha256": sha.hexdigest(),
            "profile": profile, "acceptance": limits, "sample_rate": rate, "bit_depth": width * 8,
            "channels": count, "frames": frames, "duration_seconds": round(frames / rate, 6),
            "per_channel": per_channel, "checks": checks, "warnings": warnings,
            "quiet_regions": quiet, "stereo_correlation": correlation,
            "status": "needs_review" if warnings else "technical_checks_passed",
            "limitations": ["PCM WAV only", "RMS is not LUFS", "sample peak is not true peak",
                            "full-scale samples indicate possible clipping; listening is required"]}


def audio_bundle(report):
    lines = [f"# {report['file']}：音檔交付檢查\n", f"結果：{report['status']}\n",
             f"{report['sample_rate']} Hz · {report['bit_depth']}-bit · {report['channels']} 聲道 · {report['duration_seconds']:g} 秒\n",
             "\n| 聲道 | Sample peak dBFS | RMS dBFS | DC offset | 滿刻度樣本 |\n|---|---|---|---|---|\n"]
    for state in report["per_channel"]:
        peak = "-∞（靜音）" if state["peak_dbfs"] is None else state["peak_dbfs"]
        rms = "-∞（靜音）" if state["rms_dbfs"] is None else state["rms_dbfs"]
        lines.append(f"| {state['channel']} | {peak} | {rms} | {state['dc_offset']} | {state['full_scale_samples']} |\n")
    lines.append("\n## 需確認項目\n\n")
    lines.extend(f"- {item}\n" for item in report["warnings"])
    if not report["warnings"]:
        lines.append("本次技術條件沒有提醒項目。\n")
    lines.append("\n本工具預設不是平台通用交付標準。RMS 不是 LUFS，sample peak 不是 true peak。滿刻度樣本需聆聽確認；沒有評估音樂品質或授權。\n")
    lines.append(f"\n來源 SHA-256：`{report['sha256']}`\n")
    if "quiet_regions" in report:
        quiet = report["quiet_regions"]
        lines.append(f"\n安靜段（門檻 {quiet['threshold_dbfs']} dBFS）：頭 {quiet['leading_seconds']} 秒，尾 {quiet['trailing_seconds']} 秒。\n")
        lines.append(f"\n立體聲相關性：{report['stereo_correlation']}（靜音／單聲道等不可測情況為 null；不是音樂品質評分）。\n")
    return {"report.json": json_text(report), "report.md": "".join(lines)}
