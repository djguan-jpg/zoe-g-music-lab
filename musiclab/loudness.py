# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
"""Original streaming K-weighted energy and two-pass integrated gating.

Reference numbers: ITU-R BS.1770-5 Annex 1, Tables 1 and 2 (48 kHz).
Other rates preserve the analog poles/gains through the bilinear transform.
No audio I/O, storage, normalization, target judgement or true-peak estimate.
"""
import math
from collections import deque

SCHEMA_VERSION = 1
FORMAT = "zoe-loudness-measurement"
ALGORITHM = "ITU-R BS.1770-5 Annex 1 integrated loudness"
MIN_RATE, MAX_RATE = 8000, 192000
SHELF = ((1.53512485958697, -2.69169618940638, 1.19839281085285),
         (1.0, -1.69065929318241, 0.73248077421585))
HIGH_PASS = ((1.0, -2.0, 1.0), (1.0, -1.99004745483398, 0.99007225036621))
ABSOLUTE_ENERGY = 10 ** ((-70 + 0.691) / 10)


def coefficients(rate):
    if type(rate) is not int or not MIN_RATE <= rate <= MAX_RATE:
        raise ValueError("響度取樣率需介於 8000 與 192000 Hz")
    if rate == 48000:
        return SHELF, HIGH_PASS
    filters = []
    for index, (b, a) in enumerate((SHELF, HIGH_PASS)):
        denominator = 1 - a[1] + a[2]
        original_k = math.sqrt((1 + a[1] + a[2]) / denominator)
        q = original_k / (2 * (1 - a[2]) / denominator)
        frequency = 48000 * math.atan(original_k) / math.pi
        k = math.tan(math.pi * frequency / rate)
        normal = 1 + k / q + k * k
        new_a = (1.0, 2 * (k * k - 1) / normal, (1 - k / q + k * k) / normal)
        if index == 0:
            original_normal = 1 + original_k / q + original_k * original_k
            high = (b[0] - b[1] + b[2]) * original_normal / 4
            middle = (b[0] - b[2]) * original_normal / (2 * original_k / q)
            low = (b[0] + b[1] + b[2]) * original_normal / (4 * original_k * original_k)
            new_b = ((high + middle * k / q + low * k * k) / normal,
                     2 * (low * k * k - high) / normal,
                     (high - middle * k / q + low * k * k) / normal)
        else:
            new_b = (1.0, -2.0, 1.0)
        filters.append((new_b, new_a))
    return tuple(filters)


def window_frames(rate):
    return (4 * rate + 5) // 10  # 400 ms, nearest sample; ties round up.


def complete_blocks(rate, frames):
    window = window_frames(rate)
    return 0 if frames < window else (10 * (frames - window) + 4) // rate + 1


class EnergyMeter:
    """One normalized PCM frame in; at most one complete block energy out.

    Channel energies are summed, never downmixed. Only mono/stereo are known.
    The frame history is bounded by 400 ms, independent of input duration.
    """
    def __init__(self, rate, channels):
        if type(channels) is not int or channels not in (1, 2):
            raise ValueError("響度量測只支援已知位置的單聲道或立體聲")
        self.filters = coefficients(rate)
        self.rate, self.channels = rate, channels
        self.window = window_frames(rate)
        self.states = [[0.0] * 8 for _ in range(channels)]
        self.history = deque()
        self.total, self.frames, self.block_count = 0.0, 0, 0
        self.next_end = self.window

    def push(self, values):
        if len(values) != self.channels or any(type(v) not in (int, float) or not math.isfinite(v) for v in values):
            raise ValueError("響度量測需要完整且有限的音訊幀")
        energy = 0.0
        (b, a), (c, d) = self.filters
        for sample, state in zip(values, self.states):
            first = b[0] * sample + b[1] * state[0] + b[2] * state[1] - a[1] * state[2] - a[2] * state[3]
            second = c[0] * first + c[1] * state[4] + c[2] * state[5] - d[1] * state[6] - d[2] * state[7]
            state[:] = [sample, state[0], first, state[2], first, state[4], second, state[6]]
            energy += second * second
        self.history.append(energy)
        self.total += energy
        if len(self.history) > self.window:
            self.total -= self.history.popleft()
        self.frames += 1
        if self.frames != self.next_end:
            return None
        self.block_count += 1
        self.next_end = self.window + (self.block_count * self.rate + 5) // 10
        return max(0.0, self.total / self.window)


def measurement(rate, channels, frames, blocks):
    """Build schema 1 using a repeatable block iterator factory, two passes."""
    if any(type(v) is not int or v <= 0 for v in (rate, channels, frames)):
        raise ValueError("響度來源規格無效")
    result = {"format": FORMAT, "schema_version": SCHEMA_VERSION, "algorithm": ALGORITHM, "unit": "LUFS",
              "integrated_lufs": None, "status": None, "absolute_gate_lufs": -70,
              "relative_gate_lu": -10, "relative_gate_lufs": None, "block_ms": 400, "hop_ms": 100,
              "complete_block_count": 0, "absolute_gate_block_count": 0, "gated_block_count": 0,
              "channel_weights": [], "window_frames": None, "tail_frames": frames}
    if channels not in (1, 2):
        result['status'] = 'unsupported_channels'
        return result
    if not MIN_RATE <= rate <= MAX_RATE:
        result['status'] = 'unsupported_sample_rate'
        return result
    window = window_frames(rate)
    count = complete_blocks(rate, frames)
    result.update(channel_weights=[1] * channels, window_frames=window, complete_block_count=count,
                  tail_frames=frames - (window + ((count - 1) * rate + 5) // 10) if count else frames)
    if count == 0:
        result['status'] = 'insufficient_duration'
        return result

    def checked():
        observed = 0
        for energy in blocks():
            if type(energy) not in (int, float) or not math.isfinite(energy) or energy < 0:
                raise ValueError("響度區塊能量無效")
            observed += 1
            if observed > count:
                raise ValueError("響度區塊數與來源不一致")
            yield energy
        if observed != count:
            raise ValueError("響度區塊數與來源不一致")

    absolute_count, absolute_sum = 0, 0.0
    for energy in checked():
        if energy > ABSOLUTE_ENERGY:
            absolute_count += 1
            absolute_sum += energy
    result['absolute_gate_block_count'] = absolute_count
    if not absolute_count:
        result['status'] = 'below_gate'
        return result
    relative = absolute_sum / absolute_count * 0.1
    result['relative_gate_lufs'] = round(-0.691 + 10 * math.log10(relative), 6)
    gated_count, gated_sum = 0, 0.0
    for energy in checked():
        if energy > ABSOLUTE_ENERGY and energy > relative:
            gated_count += 1
            gated_sum += energy
    if not gated_count:
        raise ValueError("響度相對門檻沒有有效區塊")
    result.update(status='measured', gated_block_count=gated_count,
                  integrated_lufs=round(-0.691 + 10 * math.log10(gated_sum / gated_count), 6))
    return result


def descriptor():
    return {"schema_version": SCHEMA_VERSION, "format": FORMAT, "algorithm": ALGORITHM, "unit": "LUFS",
            "sample_rate_range": [MIN_RATE, MAX_RATE], "channels": [1, 2],
            "block_ms": 400, "hop_ms": 100, "absolute_gate_lufs": -70, "relative_gate_lu": -10,
            "true_peak_measured": False, "normalization": False}
