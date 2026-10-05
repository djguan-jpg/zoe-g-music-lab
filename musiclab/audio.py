# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
import math
import wave
from pathlib import Path
from .common import json_text
from .audio_report import render as render_report
from . import __version__
from .audio_source import copied_audio
from .loudness import EnergyMeter, measurement, MIN_RATE, MAX_RATE
from .loudness_blocks import EnergyBlocks

from .audio_acceptance import PROFILES, normalize


def dbfs(amplitude):
    return round(20 * math.log10(amplitude), 3) if amplitude > 0 else None


def analyze_wav(path, profile="distribution", rates=None, bits=None, channels=None):
    path = Path(path)
    limits = normalize(profile, rates, bits, channels)
    try:
        with copied_audio(path) as (selected, digest, source_evidence), wave.open(selected, "rb") as wav, EnergyBlocks() as energies:
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
            meter = EnergyMeter(rate, count) if count in (1, 2) and MIN_RATE <= rate <= MAX_RATE else None
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
                        if meter is not None:
                            energy = meter.push(frame_values)
                            if energy is not None:
                                energies.append(energy)
                        frame_values.clear()
                frames += block_frames
            if frames == 0:
                raise ValueError("音檔沒有音訊幀")
            if frames != declared_frames:
                raise ValueError("WAV 內容截斷，實際幀數與標頭不同")
            loudness = measurement(rate, count, frames, lambda: iter(energies))
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
    if count > 2:
        warnings.append("多聲道僅量測樣本；本版不解讀聲道位置，請核對收件要求")
    return {"tool": "ZOE Audio Delivery", "version": __version__, "file": path.name, "sha256": digest,
            "source_evidence": source_evidence,
            "profile": profile, "acceptance": limits, "sample_rate": rate, "bit_depth": width * 8,
            "channels": count, "frames": frames, "duration_seconds": round(frames / rate, 6),
            "per_channel": per_channel, "checks": checks, "warnings": warnings,
            "quiet_regions": quiet, "stereo_correlation": correlation, "loudness": loudness,
            "status": "needs_review" if warnings else "technical_checks_passed",
            "limitations": ["PCM WAV only", "RMS is not LUFS", "sample peak is not true peak",
                            "full-scale samples indicate possible clipping; listening is required"]}


def audio_bundle(report):
    return {"report.json": json_text(report), "report.md": render_report(report)}
