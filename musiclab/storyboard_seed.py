# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
"""Bar-aligned timing handoff from a validated song; never invents visuals."""
import json
import math
from copy import deepcopy
from .common import json_text, number
from .design import music_plan_bundle

SEED_SCHEMA_VERSION = 1
MAX_SLOTS = 1000


def storyboard_seed_bundle(payload):
    if 'seed' in payload:
        if set(payload) != {'seed'}:
            raise ValueError('起稿檔 seed 不可混用 music、fps 或 bars_per_shot')
        return seed_files(validate_seed(payload['seed']))
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
    slots = timing_slots(sections, plan['bpm'], plan['beats_per_bar'], fps, chunk)
    notes = ['時間依固定 BPM、小節與拍數估算，沒有弱起或自由速度；須用實際音檔校準。',
             '這是未完成的時間起稿；畫面、運鏡、轉場、母題與人物狀態須人工編寫。',
             *plan['review_notes']]
    data = {'format': 'zoe-storyboard-seed', 'schema_version': SEED_SCHEMA_VERSION,
            'status': 'timing_seed_incomplete', 'title': plan['title'],
            'duration_seconds': plan['duration_seconds'], 'fps': fps, 'bars_per_shot': chunk,
            'source': {key: plan[key] for key in ('bpm', 'beats_per_bar', 'timing_assumption', 'sections')},
            'slots': slots, 'review_notes': notes}
    return seed_files(data)


def seed_files(data):
    slots = data['slots']
    fps, chunk = data['fps'], data['bars_per_shot']
    # Lines rather than Markdown table cells preserve multiline source text.
    lines = [f"# {data['title']}：分鏡時間起稿\n\n",
             f"{len(slots)} 鏡 · {data['duration_seconds']} 秒 · {fps:g} FPS · 每鏡最多 {chunk} 小節\n\n"]
    lines.extend(f'- {note}\n' for note in data['review_notes'])
    for slot in slots:
        lines.append(f"\n## 鏡頭 {slot['shot']} · {slot['section']}\n\n"
                     f"{slot['start']}–{slot['end']} 秒 · 小節 {slot['bar_start']}–{slot['bar_end']}\n\n"
                     f"歌曲敘事任務：{slot['purpose']}\n\n畫面／運鏡／轉場／母題／人物狀態：尚未編寫\n")
    return {'storyboard-seed.json': json_text(data), 'storyboard-seed.md': ''.join(lines)}


def timing_slots(sections, bpm, beats, fps, chunk):
    if sum(math.ceil(section['bars'] / chunk) for section in sections) > MAX_SLOTS:
        raise ValueError('起稿超過 1000 鏡；請增加每鏡最多小節')
    seconds_per_bar = beats * 60 / bpm
    slots, bar = [], 1
    for section in sections:
        start = section['start']
        for offset in range(0, int(section['bars']), chunk):
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
    return slots


def exact_keys(value, keys, label):
    if not isinstance(value, dict) or set(value) != set(keys):
        raise ValueError(f'{label}欄位不完整或包含未知欄位；原起稿保留')


def seed_number(value, label, low, high, integer=False):
    if type(value) not in (int, float) or not math.isfinite(value) or not low <= value <= high or (integer and value != int(value)):
        raise ValueError(f'{label}數值錯誤；起稿需使用有限數字，不接受布林或數字文字')
    return value


def validate_seed(seed):
    exact_keys(seed, ('format','schema_version','status','title','duration_seconds','fps','bars_per_shot','source','slots','review_notes'), '起稿')
    if seed['format'] != 'zoe-storyboard-seed' or type(seed['schema_version']) is not int or seed['schema_version'] != SEED_SCHEMA_VERSION or seed['status'] != 'timing_seed_incomplete':
        raise ValueError('不支援的起稿格式、版本或完成狀態；沒有自動轉換')
    from .common import text
    text(seed['title'], '起稿標題')
    duration = seed_number(seed['duration_seconds'], '起稿時長', .001, 3600)
    fps = seed_number(seed['fps'], 'FPS', 1, 120)
    chunk = int(seed_number(seed['bars_per_shot'], '每鏡最多小節', 1, 128, True))
    source = seed['source']
    exact_keys(source, ('bpm','beats_per_bar','timing_assumption','sections'), '起稿來源')
    if source['timing_assumption'] != 'constant_tempo_no_pickup':
        raise ValueError('不支援的起稿時間假設；須保留固定速度及無弱起標示')
    bpm = seed_number(source['bpm'], 'BPM', 20, 300)
    beats = seed_number(source['beats_per_bar'], '每小節拍數', 1, 12, True)
    sections = source['sections']
    if not isinstance(sections, list) or not 1 <= len(sections) <= 40:
        raise ValueError('起稿需要1–40個來源段落')
    elapsed = 0.0
    for section in sections:
        exact_keys(section, ('section','bars','start','end','energy','focus','texture'), '來源段落')
        for key in ('section','focus','texture'): text(section[key], key)
        bars = seed_number(section['bars'], '來源小節', 1, 128, True)
        seed_number(section['energy'], '來源能量', 1, 5)
        start = seed_number(section['start'], '段落開始', 0, duration)
        end = seed_number(section['end'], '段落結束', .001, duration)
        expected_start = round(elapsed, 3)
        elapsed += bars * beats * 60 / bpm
        if start != expected_start or end != round(elapsed, 3):
            raise ValueError('起稿來源時間與BPM／小節不一致；沒有默默修正')
    if round(elapsed, 3) != duration:
        raise ValueError('起稿總時長與來源小節不一致')
    slots = seed['slots']
    if not isinstance(slots, list) or not 1 <= len(slots) <= MAX_SLOTS:
        raise ValueError('起稿需要1–1000鏡')
    for slot in slots:
        exact_keys(slot, ('shot','start','end','start_frame','end_frame_exclusive','bar_start','bar_end','section','purpose'), '鏡頭')
        for key in ('shot','start_frame','end_frame_exclusive','bar_start','bar_end'):
            seed_number(slot[key], key, 0, 432000, True)
        for key in ('start','end'): seed_number(slot[key], key, 0, duration)
        for key in ('section','purpose'): text(slot[key], key)
    if slots != timing_slots(sections, bpm, beats, fps, chunk):
        raise ValueError('起稿鏡頭與來源小節／時間／影格不一致；原檔保留')
    notes = seed['review_notes']
    if not isinstance(notes, list) or not 1 <= len(notes) <= 100:
        raise ValueError('起稿需保留1–100項人工確認提醒')
    for note in notes: text(note, '起稿提醒')
    return deepcopy(seed)
