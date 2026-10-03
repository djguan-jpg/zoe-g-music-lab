# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
"""Untimed lyric handoff. No estimated timestamps, recognition or model calls."""
import re
from copy import deepcopy
from .common import json_text, text

LYRICS_SEED_SCHEMA_VERSION = 1
MAX_SOURCE_BYTES = 64 * 1024
MAX_LINES = 1000
SPACE_CHARS = ' \t\n\v\f\r\u0085\u00a0\u1680' + ''.join(chr(i) for i in range(0x2000,0x200b)) + '\u2028\u2029\u202f\u205f\u3000'


def source_lines(source):
    if not isinstance(source, str) or not source.strip(SPACE_CHARS):
        raise ValueError('請先填入非空白的歌詞文字')
    if len(source.encode('utf-8')) > MAX_SOURCE_BYTES:
        raise ValueError('純歌詞文字最多64 KiB')
    lines = [{'line': i, 'text': value} for i, value in enumerate(re.split(r'\r\n|\n|\r', source), 1) if value.strip(SPACE_CHARS)]
    if not 1 <= len(lines) <= MAX_LINES:
        raise ValueError('未校時起稿需要1–1000個非空白行')
    return lines


def exact(value, keys):
    if not isinstance(value, dict) or set(value) != set(keys):
        raise ValueError('歌詞起稿欄位不完整或含未知欄位；沒有丟棄原資料')


def validate_seed(seed):
    exact(seed, ('format','schema_version','status','title','source_text','lines','review_notes'))
    if seed['format'] != 'zoe-lyrics-seed' or type(seed['schema_version']) is not int or seed['schema_version'] != 1 or seed['status'] != 'untimed':
        raise ValueError('歌詞起稿格式、版本或狀態不支援；沒有自動轉換')
    text(seed['title'], '作品名稱')
    if len(seed['title']) > 200:
        raise ValueError('作品名稱最多200字元')
    expected = source_lines(seed['source_text'])
    if not isinstance(seed['lines'], list) or not 1 <= len(seed['lines']) <= MAX_LINES:
        raise ValueError('歌詞起稿需要1–1000行')
    for line in seed['lines']:
        exact(line, ('line','text'))
        if type(line['line']) is not int or not isinstance(line['text'], str):
            raise ValueError('歌詞來源行號／文字錯誤')
    if seed['lines'] != expected:
        raise ValueError('起稿句子與原始文字不一致；不修剪、去重或重排')
    notes = seed['review_notes']
    if not isinstance(notes, list) or not 1 <= len(notes) <= 20 or any(not isinstance(n,str) or not n.strip() or len(n)>2000 for n in notes):
        raise ValueError('歌詞起稿需保留1–20項人工確認提醒')
    return deepcopy(seed)


def lyrics_seed_bundle(payload):
    if 'seed' in payload:
        exact(payload, ('seed',));data = validate_seed(payload['seed'])
    else:
        exact(payload, ('title','text'));title = text(payload['title'], '作品名稱')
        if len(payload['title']) > 200: raise ValueError('作品名稱最多200字元')
        data = {'format':'zoe-lyrics-seed','schema_version':1,'status':'untimed','title':title,
                'source_text':payload['text'],'lines':source_lines(payload['text']),
                'review_notes':['這是未校時歌詞，沒有猜測開始、結束或歌曲時長；須依實際音檔標記。',
                                '每個非空白行作為一句，重複句、前後空白及原始行號保留；空白行仍留在原文。',
                                '段落標籤也會列為句子，請人工刪除或調整；不是ASR或已完成字幕。']}
    markdown = f"# {data['title']}：未校時歌詞\n\n{len(data['lines'])}句，時間尚未標記。\n\n"
    markdown += ''.join('- '+note+'\n' for note in data['review_notes'])
    markdown += ''.join(f"\n來源第{line['line']}行：{line['text']}\n開始／結束：尚未標記\n" for line in data['lines'])
    return {'lyrics-seed.json':json_text(data),'lyrics-seed.md':markdown}
