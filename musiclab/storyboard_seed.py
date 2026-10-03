# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
"""Bar-aligned timing handoff from a validated song; never invents visuals."""
import json
import math
from .common import json_text, number
from .design import music_plan_bundle

SEED_SCHEMA_VERSION = 1
MAX_SLOTS = 1000


def storyboard_seed_bundle(payload):
    if set(payload) - {'music', 'fps', 'bars_per_shot'} or 'music' not in payload:
        raise ValueError('分鏡起稿只接受 music、fps、bars_per_shot')
    brief = payload['music']
    if not isinstance(brief, dict) or 'arrangement' not in brief:
        raise ValueError('起稿需要包含 arrangement 的歌曲需求，不接受舊版時長或已生成媒體')
    fps = number(payload.get('fps', 24), 'FPS')
    chunk = number(payload.get('bars_per_shot', 4), '每鏡最多小節')
    if not 1 <= fps <= 120:
        raise ValueError('FPS 需介於 1–120')
    if chunk != int(chunk) or not 1 <= chunk <= 128:
        raise ValueError('每鏡最多小節需為 1–128 整數')
    chunk = int(chunk)
    files = music_plan_bundle(brief)
    plan = json.loads(files['music-plan.json'])
    plan['title'] = json.loads(files['brief.json'])['title']
    sections = plan['sections']
    if sum(math.ceil(section['bars'] / chunk) for section in sections) > MAX_SLOTS:
        raise ValueError('起稿超過 1000 鏡；請增加每鏡最多小節')
    seconds_per_bar = plan['beats_per_bar'] * 60 / plan['bpm']
    slots, bar = [], 1
    for section in sections:
        start = section['start']
        for offset in range(0, section['bars'], chunk):
            count = min(chunk, section['bars'] - offset)
            end = (section['end'] if offset + count == section['bars'] else
                   round(section['start'] + (offset + count) * seconds_per_bar, 3))
            first, last = round(start * fps), round(end * fps)
            if end <= start or last <= first:
                raise ValueError('起稿鏡頭不足一影格；請增加 FPS 或每鏡最多小節')
            slots.append({'shot': len(slots) + 1, 'start': start, 'end': end,
                          'start_frame': first, 'end_frame_exclusive': last,
                          'bar_start': bar, 'bar_end': bar + count - 1,
                          'section': section['section'], 'purpose': section['focus']})
            start, bar = end, bar + count
    notes = ['時間依固定 BPM、小節與拍數估算，沒有弱起或自由速度；須用實際音檔校準。',
             '這是未完成的時間起稿；畫面、運鏡、轉場、母題與人物狀態須人工編寫。',
             *plan['review_notes']]
    data = {'format': 'zoe-storyboard-seed', 'schema_version': SEED_SCHEMA_VERSION,
            'status': 'timing_seed_incomplete', 'title': plan['title'],
            'duration_seconds': plan['duration_seconds'], 'fps': fps, 'bars_per_shot': chunk,
            'source': {key: plan[key] for key in ('bpm', 'beats_per_bar', 'timing_assumption', 'sections')},
            'slots': slots, 'review_notes': notes}
    # Lines rather than Markdown table cells preserve multiline source text.
    lines = [f"# {plan['title']}：分鏡時間起稿\n\n",
             f"{len(slots)} 鏡 · {plan['duration_seconds']} 秒 · {fps:g} FPS · 每鏡最多 {chunk} 小節\n\n"]
    lines.extend(f'- {note}\n' for note in notes)
    for slot in slots:
        lines.append(f"\n## 鏡頭 {slot['shot']} · {slot['section']}\n\n"
                     f"{slot['start']}–{slot['end']} 秒 · 小節 {slot['bar_start']}–{slot['bar_end']}\n\n"
                     f"歌曲敘事任務：{slot['purpose']}\n\n畫面／運鏡／轉場／母題／人物狀態：尚未編寫\n")
    return {'storyboard-seed.json': json_text(data), 'storyboard-seed.md': ''.join(lines)}
