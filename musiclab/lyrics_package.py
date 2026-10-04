# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
"""Versioned timed lyrics and declared timing provenance; never infer on inspect."""
import copy
from .common import json_text
from .json_document import decode_json, utf8_bytes
from .lyric_timing import normalized_seconds, milliseconds

PACKAGE_FORMAT = 'zoe-lyrics-package'
PACKAGE_SCHEMA_VERSION = 1
MAX_PACKAGE_BYTES = 2 * 1024 * 1024
MAX_CUES = 10000
LEGACY_KEYS = {'title', 'duration', 'duration_estimated', 'cues', 'timing'}
PACKAGE_KEYS = LEGACY_KEYS | {'format', 'schema_version', 'review_notes'}


def decode_document(content):
    return decode_json(content, max_bytes=MAX_PACKAGE_BYTES, label='歌詞 JSON')


def is_legacy(document):
    return isinstance(document, dict) and set(document) == LEGACY_KEYS


def needs_review(document):
    return bool(document['duration_estimated'] or document['timing']['inferred_end_count'] or
                document['review_notes'] or document['timing'].get('applied_shift_seconds', 0))


def validate_package(document, *, allow_legacy=False):
    if type(allow_legacy) is not bool:
        raise ValueError('allow_legacy 需為布林值')
    if is_legacy(document):
        if not allow_legacy:
            raise ValueError('舊歌詞包需明確選擇轉換；CLI使用 --legacy-json，Agent使用 allow_legacy:true')
        document = {**copy.deepcopy(document), 'format': PACKAGE_FORMAT,
                    'schema_version': PACKAGE_SCHEMA_VERSION, 'review_notes': []}
    if not isinstance(document, dict) or set(document) != PACKAGE_KEYS or document.get('format') != PACKAGE_FORMAT or \
            type(document.get('schema_version')) is not int or document['schema_version'] != PACKAGE_SCHEMA_VERSION:
        raise ValueError('歌詞包格式不完整或版本不支援；目前內容保留')
    data = copy.deepcopy(document)
    title = data['title']
    if not isinstance(title, str) or not title.strip() or len(title) > 200:
        raise ValueError('歌詞包名稱需為1–200字的非空白文字')
    if type(data['duration_estimated']) is not bool:
        raise ValueError('歌詞包 duration_estimated 需為布林值')
    cues = data['cues']
    if not isinstance(cues, list) or not 1 <= len(cues) <= MAX_CUES or any(
            not isinstance(c, dict) or set(c) != {'start', 'end', 'text'} or
            type(c['start']) not in (int, float) or type(c['end']) not in (int, float) for c in cues):
        raise ValueError('歌詞包需有1–10000句完整的數字開始／結束與文字')
    if type(data['duration']) not in (int, float):
        raise ValueError('歌詞包總長需為數字')
    # Deferred import keeps the package/presentation layer from a module-load cycle.
    from .lyrics import validate_cues
    normalized, duration, _ = validate_cues(cues, data['duration'])
    if normalized != cues or duration != data['duration']:
        raise ValueError('歌詞包時間需已排序並精確到毫秒；不自動修正')
    timing = data['timing']
    keys = {'duration_source', 'inferred_end_count', 'tail_end_inferred'}
    if not isinstance(timing, dict) or not keys <= set(timing) or set(timing) - keys - {'applied_shift_seconds'} or \
            type(timing['inferred_end_count']) is not int or not 0 <= timing['inferred_end_count'] <= len(cues) or \
            type(timing['tail_end_inferred']) is not bool or \
            timing['inferred_end_count'] > len(cues) - (not timing['tail_end_inferred']):
        raise ValueError('歌詞包時間來源資料矛盾')
    expected = 'provided' if not data['duration_estimated'] else \
        'last_start_plus_three' if timing['tail_end_inferred'] else 'last_cue_end'
    if timing['duration_source'] != expected or timing['tail_end_inferred'] and not timing['inferred_end_count']:
        raise ValueError('歌詞包總長與來源標記矛盾')
    if data['duration_estimated'] and (data['duration'] != cues[-1]['end'] or
            timing['tail_end_inferred'] and milliseconds(data['duration']) != milliseconds(cues[-1]['start']) + 3000):
        raise ValueError('歌詞包估計總長與末句時間矛盾')
    if 'applied_shift_seconds' in timing:
        value = timing['applied_shift_seconds']
        if type(value) not in (int, float) or normalized_seconds(value) != value:
            raise ValueError('歌詞包調整量需為精確毫秒的數字')
    notes = data['review_notes']
    if not isinstance(notes, list) or len(notes) > 20 or any(
            not isinstance(n, str) or not n.strip() or len(n) > 400 for n in notes):
        raise ValueError('歌詞包待確認說明需為最多20項、每項1–400字')
    utf8_bytes(title, label='歌詞包名稱')
    for cue in cues:
        utf8_bytes(cue['text'], label='歌詞包歌詞')
    for note in notes:
        utf8_bytes(note, label='歌詞包待確認說明')
    if len(json_text(data).encode('utf-8')) > MAX_PACKAGE_BYTES:
        raise ValueError('歌詞包最多2 MiB')
    return data


def package_files(document):
    data = validate_package(document)
    from .lyrics import lrc_text, srt_text
    from .lyric_preview import render_preview
    return {'lyrics.json': json_text(data), 'lyrics.lrc': lrc_text(data['cues']),
            'lyrics.srt': srt_text(data['cues']), 'preview.html': render_preview(data, data['title'])}
