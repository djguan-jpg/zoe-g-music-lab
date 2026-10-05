# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
"""Read-only diagnostics for all raw acceptance fields; never inspect media."""
from .audio_acceptance import validate, field_values, PROFILES, MAX_BYTES
from .common import json_text

FORMAT = 'zoe-audio-acceptance-review'
SCHEMA_VERSION = 1
KEYS = ('rates', 'bits', 'channels')
LABELS = {'rates': '取樣率（Hz）', 'bits': '位元深度（bit）', 'channels': '聲道數'}
MESSAGES = {'missing_value': '尚未填寫接受值', 'too_many_values': '最多 64 個接受值',
            'invalid_value': '需為正整數，以逗號分隔；不捨入小數'}
NOTES = ['只檢查條件原值；不補填、不轉檔、不調整聲音。',
         '條件可解析不代表音檔通過；仍須分析音檔、實聽及確認交付需求。']


def descriptor():
    return {'format': FORMAT, 'schema_version': SCHEMA_VERSION, 'max_source_bytes': MAX_BYTES,
            'max_issues': 3, 'read_only': True, 'media_generated': False}


def review(payload):
    if not isinstance(payload, dict) or set(payload) != {'document'}:
        raise ValueError('條件檢查只接受 document；不能指定音檔或路徑')
    source = validate(payload['document'])
    fields, issues, acceptance = [], [], {}
    for key in KEYS:
        raw = source['fields'][key]
        if not source['custom']:
            fields.append({'field': key, 'status': 'inactive', 'value_count': 0})
            continue
        try:
            values = field_values(key, raw)
        except ValueError:
            code = ('missing_value' if not raw.strip() else
                    'too_many_values' if len(raw.replace('，', ',').split(',')) > 64 else 'invalid_value')
            issues.append({'field': key, 'code': code, 'message': MESSAGES[code]})
            fields.append({'field': key, 'status': 'invalid', 'value_count': 0})
        else:
            acceptance[key] = values
            fields.append({'field': key, 'status': 'valid', 'value_count': len(values)})
    if not source['custom']:
        acceptance = {key: list(value) for key, value in PROFILES[source['profile']].items()}
    return {'format': FORMAT, 'schema_version': SCHEMA_VERSION, 'source': source,
            'status': 'preset_active' if not source['custom'] else 'needs_correction' if issues else 'fields_checked',
            'fields': fields, 'issue_count': len(issues), 'issues': issues,
            'analysis_ready': not bool(issues), 'effective_acceptance': None if issues else acceptance,
            'review_notes': list(NOTES)}


def markdown(data):
    lines = ['# 音檔接受條件檢查', '', f"待辦 {data['issue_count']} 項。", '']
    if data['status'] == 'preset_active':
        lines.append('示範條件已啟用；自訂原值保留，未套用。')
    elif not data['issues']:
        lines.append('三欄條件可解析；請接續音檔分析與實聽。')
    for issue in data['issues']:
        lines.append(f"- {LABELS[issue['field']]}：{issue['message']}")
    return '\n'.join(lines + ['', *data['review_notes'], ''])


def _same(expected, actual):
    """JSON semantic equality, without bool/number coercion or unknown keys."""
    if isinstance(expected, dict):
        return isinstance(actual, dict) and set(expected) == set(actual) and all(
            _same(value, actual[key]) for key, value in expected.items())
    if isinstance(expected, list):
        return isinstance(actual, list) and len(expected) == len(actual) and all(
            _same(a, b) for a, b in zip(expected, actual))
    if type(expected) is int:
        return type(actual) in (int, float) and expected == actual
    return type(expected) is type(actual) and expected == actual


def validate_report(document):
    if not isinstance(document, dict) or 'source' not in document:
        raise ValueError('條件檢查報告需包含完整原始條件')
    expected = review({'document': document['source']})
    if not _same(expected, document):
        raise ValueError('條件檢查報告與原始條件不一致或版本不支援')
    return expected


def review_bundle(payload):
    data = review(payload)
    return {'audio-acceptance-review.json': json_text(data), 'audio-acceptance-review.md': markdown(data)}
