# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
"""Portable media and subtitle export, independent of HTTP and filesystem paths."""
import hashlib
import io
import json
import re
import zipfile
from . import mv_project as P
from .lyrics import validate_cues, srt_text

MAX_TEXT = 4 * 1024 * 1024
MAX_ARCHIVE = 68 * 1024 * 1024 + 65536
README = ('剪輯交接包\n\n解開 ZIP，再把 audio-source 音檔與 image-XXXX 圖片匯入原剪輯工具；在字幕匯入入口選 subtitles.srt。圖片名稱對應清單中的鏡頭 ID，沒有自動排列圖片或建立剪輯時間軸。\n\n'
          'music-video.plan.json 是保留原文的 Agent 企劃，不能直接當作剪輯軟體專案。回到本工具接續素材需另存 .zoemv.json。\n\n'
          'SRT 使用目前明確句首與句尾，按開始時間排列；沒有語音辨識或自動校時。含樣式標記的文字可能由剪輯工具解讀；先預覽字幕與實聽，原文另保留在企劃 JSON。\n\n'
          'HANDOFF-MANIFEST.json 記錄每檔大小、SHA-256、原素材名稱與鏡頭對應。音檔與圖片不轉檔；.bin 表示未辨識副檔名，請先核對檔案格式。\n')


def encoded(value):
    return (json.dumps(value, ensure_ascii=False, indent=2, allow_nan=False) + '\n').encode('utf-8')


def prepare(project):
    project = P.validate(project)
    if project['audio'] is None:
        raise ValueError('請先選擇原音檔，再建立剪輯交接包')
    original = project['draft']['panels']['lyrics']['cues']
    if any(not c['end'].strip() for c in original):
        raise ValueError('請先提供每句結束時間，再建立剪輯交接包')
    if any(not c['text'].strip() or re.search(r'[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]', c['text']) for c in original):
        raise ValueError('字幕有空句或控制字元，請在原工具修正後重匯入')
    declared = project['draft']['panels']['lyrics']['fields']['lyrics-duration']
    cues, _, _ = validate_cues(original, declared if declared.strip() else None)
    entries = [dict(name='subtitles.srt', raw=srt_text(cues).encode('utf-8'), role='subtitles'),
               dict(name='music-video.plan.json', raw=encoded({'draft': project['draft'], 'shot_ids': project['shot_ids']}), role='agent_plan'),
               dict(name='README.md', raw=README.encode('utf-8'), role='instructions')]
    if sum(len(e['raw']) for e in entries) > MAX_TEXT:
        raise ValueError('交接文字合計最多 4 MiB')
    audio = project['audio']
    extension = audio['name'].split('.')[-1].lower()
    if extension not in ('wav', 'mp3', 'm4a', 'flac', 'ogg', 'aac', 'webm', 'opus', 'aiff', 'aif', 'wma', 'mp4'):
        extension = 'bin'
    entries.append(dict(name='audio-source.' + extension, raw=P.asset(audio), role='audio', original_name=audio['name']))
    images = {i['shot_id']: i['asset'] for i in project['images']}
    for index, shot in enumerate(project['shot_ids'], 1):
        if shot not in images:
            continue
        image = images[shot]
        extension = {'image/png': 'png', 'image/jpeg': 'jpg', 'image/webp': 'webp'}[image['type']]
        entries.append(dict(name=f'image-{index:04}.{extension}', raw=P.asset(image, True), role='image',
                            original_name=image['name'], shot_id=shot))
    records = []
    for entry in entries:
        record = {'name': entry['name'], 'bytes': len(entry['raw']), 'sha256': hashlib.sha256(entry['raw']).hexdigest(), 'role': entry['role']}
        for field in ('original_name', 'shot_id'):
            if field in entry:
                record[field] = entry[field]
        records.append(record)
    manifest = {'format': 'zoe-media-handoff', 'schema_version': 1, 'tool_version': project['draft']['tool_version'],
                'subtitle_cue_count': len(cues), 'subtitle_order': 'start_time', 'subtitle_time_source': 'current_explicit_cue_boundaries',
                'media_transcoded': False, 'creative_acceptance': False, 'listed_file_count': len(records),
                'total_source_bytes': sum(r['bytes'] for r in records), 'files': records}
    entries.append({'name': 'HANDOFF-MANIFEST.json', 'raw': encoded(manifest)})
    stream = io.BytesIO()
    with zipfile.ZipFile(stream, 'w', compression=zipfile.ZIP_STORED, allowZip64=False) as archive:
        for entry in entries:
            info = zipfile.ZipInfo(entry['name'], date_time=(1980, 1, 1, 0, 0, 0))
            info.create_system = 3
            info.external_attr = 0o100644 << 16
            archive.writestr(info, entry['raw'])
    raw = stream.getvalue()
    if len(raw) > MAX_ARCHIVE:
        raise ValueError('剪輯交接 ZIP 超過大小上限')
    return raw, manifest
