# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
"""Pure partial-clock diagnostics using the complete planner's numeric/frame rules.

Never sort, fill, round or modify source seconds. Missing endpoints stop only
the checks that depend on them; every original row still contributes counts.
"""
from .common import number, is_negative_number
from .storyboard_frames import frame_index, SECONDS_TOLERANCE

MAX_ISSUES = 200


def diagnose(duration_source, fps_source, shots):
    issues, count = [], 0

    def add(scope, row, field, code, message, related_row=None):
        nonlocal count
        count += 1
        if len(issues) < MAX_ISSUES:
            issues.append(dict(scope=scope, row=row, field=field, code=code,
                               message=message, related_row=related_row))

    def clock(value, scope, row, field):
        if isinstance(value, str) and not value.strip():
            add(scope, row, field, 'missing_clock', '尚未填寫時間數值')
            return None
        try:
            return number(value, field)
        except (ValueError, OverflowError):
            add(scope, row, field, 'invalid_number', '請填寫有限十進位數字')
            return None

    duration, fps = clock(duration_source, 'fields', 0, 'mv-duration'), clock(fps_source, 'fields', 0, 'mv-fps')
    if duration is not None and not 0 < duration <= 14400:
        add('fields', 0, 'mv-duration', 'invalid_range', '作品總長需大於0且不超過14400秒')
        duration = None
    if fps is not None and not 0 < fps <= 120:
        add('fields', 0, 'mv-fps', 'invalid_range', 'FPS需大於0且不超過120')
        fps = None
    total = frame_index(duration, fps) if duration is not None and fps is not None else None
    if total is not None and total < 1:
        add('fields', 0, 'mv-duration', 'short_declaration', '作品宣告短於一影格；請核對總長與FPS')
    if not shots:
        add('fields', 0, 'shots', 'no_shots', '尚無鏡頭，請新增或接續分鏡起稿')
    rows = []
    for row, shot in enumerate(shots, 1):
        start, end = clock(shot['start'], 'shots', row, 'start'), clock(shot['end'], 'shots', row, 'end')
        valid = start is not None and end is not None
        for field, value in [('start', start), ('end', end)]:
            if value is not None and (is_negative_number(shot[field], field) or not 0 <= value <= 14400 + SECONDS_TOLERANCE):
                add('shots', row, field, 'invalid_range', '時間需為非負且不超過14400秒的容差範圍')
                valid = False
        if valid and end <= start:
            add('shots', row, 'end', 'nonpositive_duration', '結束需晚於開始')
            valid = False
        if valid and duration is not None and end > duration + SECONDS_TOLERANCE:
            add('shots', row, 'end', 'beyond_declaration', '鏡尾超出作品宣告時長的容差範圍')
            valid = False
        previous = rows[-1] if rows else None
        if valid:
            if row == 1 or previous['valid']:
                boundary = 0 if row == 1 else previous['end']
                if abs(start - boundary) > SECONDS_TOLERANCE:
                    code = 'seconds_overlap' if start < boundary else 'seconds_gap'
                    add('shots', row, 'start', code, '秒數接點有重疊' if start < boundary else '秒數接點有空缺', row-1 if row > 1 else None)
            if fps is not None:
                first, last = frame_index(start, fps), frame_index(end, fps)
                if last <= first:
                    add('shots', row, 'end', 'short_frame', '鏡頭短於一影格；請核對秒數與FPS')
                if row == 1 or previous['valid']:
                    boundary = 0 if row == 1 else frame_index(previous['end'], fps)
                    if first != boundary:
                        code = 'frames_overlap' if first < boundary else 'frames_gap'
                        add('shots', row, 'start', code, '影格接點有重疊' if first < boundary else '影格接點有空缺', row-1 if row > 1 else None)
        rows.append(dict(start=start, end=end, valid=valid))
    if rows and rows[-1]['valid'] and duration is not None:
        row, end = len(rows), rows[-1]['end']
        if abs(end - duration) > SECONDS_TOLERANCE:
            add('shots', row, 'end', 'tail_seconds', '尾鏡與作品宣告的秒數不符')
        if total is not None and frame_index(end, fps) != total:
            add('shots', row, 'end', 'tail_frames', '尾鏡與作品宣告的結束影格不符；結束影格不含')
    return dict(total_shots=len(shots), timed_shots=sum(row['valid'] for row in rows),
                total_frames=total, issue_count=count, issues=issues, details_truncated=count > len(issues))
