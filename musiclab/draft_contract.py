# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
"""Draft shape only; unfinished creative inputs are valid saved drafts."""
import copy
import json
import re
from pathlib import Path

CONTRACT = json.loads((Path(__file__).resolve().parents[1] / 'contracts/draft-v3.json').read_text(encoding='utf-8'))
MAX_DRAFT_BYTES = 1024 * 1024


def exact(value, keys):
    return isinstance(value, dict) and set(value) == set(keys)


def validate_draft(draft):
    fields, rows = CONTRACT['fields'], CONTRACT['rows']
    if (not exact(draft, ('format', 'schema_version', 'tool_version', 'saved_at', 'tab', 'panels'))
            or draft['format'] != CONTRACT['format'] or type(draft['schema_version']) is not int
            or draft['schema_version'] != CONTRACT['version'] or not isinstance(draft['tab'], str) or draft['tab'] not in fields
            or not isinstance(draft['tool_version'], str) or not isinstance(draft['saved_at'], str)
            or not exact(draft['panels'], fields)):
        raise ValueError('只接受草稿 schema 3；舊版請先由工作台明確轉換，未保存或替換內容')
    for name, expected in fields.items():
        panel = draft['panels'][name]
        keys = ['fields'] + ([rows[name]['key']] if name in rows else [])
        if name == 'music':
            keys += ['avoid', 'deliverables']
        if name == 'storyboard':
            keys += ['motifs']
        if not exact(panel, keys) or not exact(panel['fields'], expected) or any(
                not isinstance(v, str) for v in panel['fields'].values()):
            raise ValueError('草稿欄位不完整或不是文字；未保存內容')
        if name in rows:
            rule = rows[name]
            values = panel[rule['key']]
            if not isinstance(values, list) or len(values) > rule['limit'] or any(
                    not exact(row, rule['columns']) or any(not isinstance(v, str) for v in row.values()) for row in values):
                raise ValueError('草稿列資料錯誤或超過容量；未保存內容')
        if name == 'music' and any(not isinstance(panel[key], list) or
                len(panel[key]) > CONTRACT['limits']['requirements'] or
                any(not isinstance(v, str) for v in panel[key]) for key in ('avoid', 'deliverables')):
            raise ValueError('草稿需求清單錯誤；未保存內容')
    storyboard = draft['panels']['storyboard']
    motifs = storyboard['motifs']
    if not isinstance(motifs, list) or len(motifs) > CONTRACT['limits']['motifs'] or any(
            not exact(m, ('id', 'name', 'meaning')) or any(not isinstance(v, str) for v in m.values()) or
            not re.fullmatch(r'motif-[1-9][0-9]*', m['id']) for m in motifs):
        raise ValueError('草稿母題格式錯誤；未保存內容')
    ids = {m['id'] for m in motifs}
    if len(ids) != len(motifs) or any(s['motif_id'] and s['motif_id'] not in ids for s in storyboard['shots']):
        raise ValueError('草稿母題對應錯誤；未保存內容')
    for key, allowed in CONTRACT['options'].items():
        values = [s[key] for s in storyboard['shots']] if key == 'screen_direction' else [
            draft['panels']['lyrics' if key == 'lyrics-format' else 'audio']['fields'][key]]
        if any(value not in allowed for value in values):
            raise ValueError('草稿選項不支援；未保存內容')
    return copy.deepcopy(draft)


def draft_bytes(draft):
    data = validate_draft(draft)
    raw = (json.dumps(data, ensure_ascii=False, allow_nan=False, sort_keys=True, indent=2) + '\n').encode('utf-8')
    if len(raw) > MAX_DRAFT_BYTES:
        raise ValueError('草稿保存上限為 1 MiB，請減少內容')
    return raw


def browser_contract():
    return 'globalThis.MusicDraftContract = ' + json.dumps(CONTRACT, ensure_ascii=False) + ';\n'


def draft_schema():
    def obj(properties):
        return {'type': 'object', 'properties': properties, 'required': list(properties), 'additionalProperties': False}
    def strings(keys):
        return obj({key: {'type': 'string'} for key in keys})
    def array(items, limit):
        return {'type': 'array', 'items': items, 'maxItems': limit}
    panels = {}
    for name, fields in CONTRACT['fields'].items():
        properties = {'fields': strings(fields)}
        if name in CONTRACT['rows']:
            rule = CONTRACT['rows'][name]
            properties[rule['key']] = array(strings(rule['columns']), rule['limit'])
        if name == 'music':
            properties.update({key: array({'type': 'string'}, CONTRACT['limits']['requirements']) for key in ('avoid', 'deliverables')})
        if name == 'storyboard':
            motif = strings(('id', 'name', 'meaning'))
            motif['properties']['id']['pattern'] = r'^motif-[1-9][0-9]*$'
            properties['motifs'] = array(motif, CONTRACT['limits']['motifs'])
            properties['shots']['items']['properties']['screen_direction']['enum'] = CONTRACT['options']['screen_direction']
        for key in fields:
            if key in CONTRACT['options']:
                properties['fields']['properties'][key]['enum'] = CONTRACT['options'][key]
        panels[name] = obj(properties)
    return obj({'format': {'type': 'string', 'const': CONTRACT['format']},
                'schema_version': {'type': 'integer', 'const': CONTRACT['version']},
                'tool_version': {'type': 'string'}, 'saved_at': {'type': 'string'},
                'tab': {'type': 'string', 'enum': list(panels)}, 'panels': obj(panels)})
