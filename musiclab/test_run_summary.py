# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
"""Pure bounded Python test-run evidence; no discovery, process or filesystem I/O."""
import json
from .json_document import decode_json, utf8_bytes
from .maintenance import validate_run

FORMAT = 'zoe-python-test-run'
SCHEMA_VERSION = 1
WORKERS = 2
MAX_TESTS = 10000
MAX_EVENTS = 20000
MAX_WORKER_BYTES = 1024 * 1024
MAX_SUMMARY_BYTES = 16384
MAX_SKIPPED_DETAILS = 20


def integer(value, maximum, label, minimum=0):
    if type(value) is not int or not minimum <= value <= maximum:
        raise ValueError('Invalid test-run '+label)
    return value


def identifiers(value, maximum, width):
    if not isinstance(value, list) or len(value) > maximum:
        raise ValueError('Invalid test-run identifiers')
    for item in value:
        if not isinstance(item, str) or not item or len(utf8_bytes(item)) > width or any(c in item for c in '\x00\r\n'):
            raise ValueError('Invalid test-run identifier')
    return list(value)


def registration(value, group, pid):
    if value is None:
        return None
    result = validate_run(value)
    if result['job'] != 'python-tests-'+str(group) or result['identity']['pid'] != pid:
        raise ValueError('Worker registration does not match its original handle')
    return {**result, 'identity': dict(result['identity'])}


def summarize(replies, expected, pids, exit_codes, eofs):
    """Match two complete replies to independently discovered groups and owned handles."""
    for values in (replies, expected, pids, exit_codes, eofs):
        if not isinstance(values, list) or len(values) != WORKERS:
            raise ValueError('Expected two original test worker handles')
    expected = [identifiers(ids, MAX_TESTS, 512) for ids in expected]
    all_ids = [item for ids in expected for item in ids]
    if not all_ids or len(all_ids) > MAX_TESTS or len(set(all_ids)) != len(all_ids):
        raise ValueError('Independent discovery must be nonempty and unique')
    if len(set(integer(pid,2147483647,'PID',1) for pid in pids)) != WORKERS:
        raise ValueError('Original worker handles must refer to different processes')
    rows = []; skipped = []
    for group in range(WORKERS):
        pid = integer(pids[group], 2147483647, 'PID', 1)
        if type(exit_codes[group]) is not int or exit_codes[group] != 0 or eofs[group] is not True:
            raise ValueError('Test worker has not returned successfully through its original handle')
        raw = replies[group]
        if not isinstance(raw, bytes) or len(raw) > MAX_WORKER_BYTES:
            raise ValueError('Test worker reply exceeds its byte budget')
        lines = raw.splitlines()
        if len(lines) != 2:
            raise ValueError('Incomplete test worker startup/result reply')
        start, result = [decode_json(line, max_bytes=MAX_WORKER_BYTES, label='test worker') for line in lines]
        if (not isinstance(start, dict) or set(start) != {'phase', 'group', 'run'} or start['phase'] != 'start'
                or type(start['group']) is not int or start['group'] != group):
            raise ValueError('Unknown test worker startup reply')
        keys = {'phase','group','count','ids','skipped','expected_failures','failures','errors','unexpected_successes','passed'}
        if (not isinstance(result, dict) or set(result) != keys or result['phase'] != 'result'
                or type(result['group']) is not int or result['group'] != group or result['passed'] is not True):
            raise ValueError('Unknown or failed test worker result')
        count = integer(result['count'], MAX_TESTS, 'count')
        ids = identifiers(result['ids'], MAX_TESTS, 512)
        if ids != expected[group] or count != len(ids):
            raise ValueError('Test worker coverage differs from independent discovery')
        for name in ('failures','errors','unexpected_successes'):
            if integer(result[name], MAX_EVENTS, name) != 0:
                raise ValueError('Unsuccessful test worker result')
        events = {}; known=set(ids)
        for name in ('skipped','expected_failures'):
            events[name] = identifiers(result[name], MAX_EVENTS, 1024)
            if any(item not in known and item.partition(' (')[0] not in known for item in events[name]):
                raise ValueError('Test event refers to an undiscovered test')
        record = registration(start['run'], group, pid)
        rows.append({'group':group,'pid':pid,'terminal':'eof','exit_code':0,'tests':count,
                     'skipped':len(events['skipped']),'expected_failures':len(events['expected_failures']),'run':record})
        skipped.extend(events['skipped'])
    report = {'format':FORMAT,'schema_version':SCHEMA_VERSION,'status':'passed','tests':len(all_ids),
              'skipped':sum(row['skipped'] for row in rows),'expected_failures':sum(row['expected_failures'] for row in rows),
              'workers':rows,'worker_identities_verified':all(row['run'] is not None for row in rows),
              'skipped_tests':[],'skipped_details_truncated':bool(skipped)}
    for item in skipped[:MAX_SKIPPED_DETAILS]:
        detail=report['skipped_tests']+[item]
        candidate={**report,'skipped_tests':detail,'skipped_details_truncated':len(detail)<len(skipped)}
        if len(utf8_bytes(json.dumps(candidate,ensure_ascii=False,separators=(',',':')))) > MAX_SUMMARY_BYTES:break
        report=candidate
    report['skipped_details_truncated']=len(report['skipped_tests'])<len(skipped)
    return checked_summary(report)


def checked_summary(value):
    keys = {'format','schema_version','status','tests','skipped','expected_failures','workers',
            'worker_identities_verified','skipped_tests','skipped_details_truncated'}
    if not isinstance(value, dict) or set(value) != keys or value['format'] != FORMAT or type(value['schema_version']) is not int or value['schema_version'] != SCHEMA_VERSION or value['status'] != 'passed':
        raise ValueError('Unsupported test-run summary')
    integer(value['tests'], MAX_TESTS, 'total', 1)
    for name in ('skipped','expected_failures'):integer(value[name], MAX_EVENTS*WORKERS, name)
    if not isinstance(value['workers'], list) or len(value['workers']) != WORKERS:
        raise ValueError('Expected two worker summaries')
    rows = []
    for group, row in enumerate(value['workers']):
        if not isinstance(row, dict) or set(row) != {'group','pid','terminal','exit_code','tests','skipped','expected_failures','run'} or type(row['group']) is not int or row['group'] != group or row['terminal'] != 'eof' or type(row['exit_code']) is not int or row['exit_code'] != 0:
            raise ValueError('Test worker summary has no successful original-handle completion')
        pid = integer(row['pid'],2147483647,'PID',1)
        integer(row['tests'],MAX_TESTS,'count')
        for name in ('skipped','expected_failures'):integer(row[name],MAX_EVENTS,name)
        rows.append({**row,'run':registration(row['run'],group,pid)})
    for name in ('tests','skipped','expected_failures'):
        if value[name] != sum(row[name] for row in rows):raise ValueError('Contradictory test-run totals')
    if len({row['pid'] for row in rows}) != WORKERS:raise ValueError('Worker summaries refer to the same process')
    if type(value['worker_identities_verified']) is not bool or value['worker_identities_verified'] != all(row['run'] is not None for row in rows):raise ValueError('Contradictory test worker identity evidence')
    skipped = identifiers(value['skipped_tests'], MAX_SKIPPED_DETAILS, 1024)
    if len(skipped) > min(value['skipped'], MAX_SKIPPED_DETAILS) or type(value['skipped_details_truncated']) is not bool or value['skipped_details_truncated'] != (len(skipped)<value['skipped']):raise ValueError('Contradictory skipped-test detail count')
    result = {**value,'workers':rows,'skipped_tests':skipped}
    if len(utf8_bytes(json.dumps(result,ensure_ascii=False,separators=(',',':')))) > MAX_SUMMARY_BYTES:raise ValueError('Test-run summary exceeds its byte budget')
    return result


def decode_summary(raw):
    return checked_summary(decode_json(raw,max_bytes=MAX_SUMMARY_BYTES,label='test-run summary'))
