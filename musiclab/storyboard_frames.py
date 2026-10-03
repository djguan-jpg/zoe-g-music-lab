# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
"""Pure frame boundaries and coverage, shared by completed plans and seeds.

Retain the existing nearest-frame, ties-to-even rule. Never alter seconds,
invent shots, change FPS or silently repair a source timeline.
"""
import math

SCHEMA_VERSION = 1
FORMAT = 'zoe-storyboard-frames'


def frame_index(seconds, fps):
    # Match the existing inclusive 1 ms shot tolerance at the four-hour cap.
    if (type(seconds) not in (int, float) or not math.isfinite(seconds) or not 0 <= seconds <= 14400 + .001 + 1e-12 or
            type(fps) not in (int, float) or not math.isfinite(fps) or not 0 < fps <= 120):
        raise ValueError('影格時間與 FPS 需為範圍內的有限數字')
    return round(seconds * fps)


def frame_timeline(shots, duration, fps):
    if type(duration) not in (int, float) or not 0 < duration <= 14400:
        raise ValueError('分鏡宣告時長需介於 0 到 14400 秒')
    total = frame_index(duration, fps)
    if total < 1 or not isinstance(shots, list) or not shots:
        raise ValueError('分鏡需至少一鏡，宣告時長需至少一影格')
    previous = 0
    for index, shot in enumerate(shots, 1):
        if not isinstance(shot, dict):
            raise ValueError(f'鏡頭 {index} 影格資料不完整')
        first, last = frame_index(shot.get('start'), fps), frame_index(shot.get('end'), fps)
        if (type(shot.get('start_frame')) is not int or type(shot.get('end_frame_exclusive')) is not int or
                shot['start_frame'] != first or shot['end_frame_exclusive'] != last):
            raise ValueError(f'鏡頭 {index} 影格與秒數／FPS 不一致')
        if last <= first:
            raise ValueError(f'鏡頭 {index} 短於一影格')
        if first != previous:
            difference = '重疊' if first < previous else '空缺'
            raise ValueError(f'鏡頭 {index} 影格{difference}；需從第 {previous} 幀開始，目前為第 {first} 幀。請核對秒數與 FPS')
        previous = last
    if previous != total:
        raise ValueError(f'尾鏡結束影格與宣告總長不符；需結束於第 {total} 幀（不含），目前為第 {previous} 幀。請核對尾鏡秒數與 FPS')
    return {**descriptor(), 'total_frames': total}


def descriptor():
    return {'format': FORMAT, 'schema_version': SCHEMA_VERSION,
            'rounding': 'nearest_ties_to_even', 'end_semantics': 'exclusive'}
