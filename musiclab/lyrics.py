# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
import re
from .common import number
from .lyric_timing import milliseconds, normalized_seconds, seconds_from_milliseconds
from .lyrics_package import (PACKAGE_FORMAT, PACKAGE_SCHEMA_VERSION, decode_document, package_files)
from .lyrics_lrc import parse_lrc


def validate_cues(cues, duration=None):
    if not isinstance(cues, list) or not cues:
        raise ValueError("沒有可匯出的逐句歌詞")
    cleaned = []
    for cue in cues:
        if not isinstance(cue, dict) or not isinstance(cue.get("text"), str):
            raise ValueError("每句歌詞需為含 start、text 的物件")
        start = normalized_seconds(cue.get("start"), "歌詞開始時間", nonnegative=True)
        end = cue.get("end")
        if end is not None:
            end = normalized_seconds(end, "歌詞結束時間", nonnegative=True)
            if end <= start:
                raise ValueError("結束時間必須晚於開始")
        if "\n" in cue["text"] or "\r" in cue["text"]:
            raise ValueError("每個 cue 只接受一行歌詞；請拆為多句")
        cleaned.append({"start": start, "end": end, "text": cue["text"]})
    cleaned.sort(key=lambda cue: cue["start"])
    for previous, current in zip(cleaned, cleaned[1:]):
        if current["start"] <= previous["start"]:
            raise ValueError("逐句歌詞的開始時間不可重複")
        if previous["end"] is not None and previous["end"] > current["start"]:
            raise ValueError("逐句歌詞的結束與下一句重疊")
    inferred = duration is None
    if duration is None:
        duration = cleaned[-1]["end"] or seconds_from_milliseconds(milliseconds(cleaned[-1]["start"]) + 3000)
    duration = normalized_seconds(duration, "歌曲時長", nonnegative=True)
    if duration <= cleaned[-1]["start"]:
        raise ValueError("歌曲時長必須晚於最後一句開始")
    for index, cue in enumerate(cleaned):
        cue["end"] = cue["end"] if cue["end"] is not None else (
            cleaned[index + 1]["start"] if index + 1 < len(cleaned) else duration)
        if cue["end"] > duration:
            raise ValueError("歌詞結束超過歌曲時長")
    return cleaned, duration, inferred


def parse_srt(content):
    cues = []
    timing = re.compile(r"(\d{2,}):(\d{2}):(\d{2})[,.](\d{3})")
    def seconds(value):
        match = timing.fullmatch(value.strip())
        if not match:
            raise ValueError("SRT 時間格式錯誤")
        h, m, s, ms = map(int, match.groups())
        if m >= 60 or s >= 60:
            raise ValueError("SRT 分鐘／秒數需小於 60")
        return h * 3600 + m * 60 + s + ms / 1000
    for block in re.split(r"\n\s*\n", content.strip().replace("\r\n", "\n")):
        lines = block.splitlines()
        if lines and lines[0].strip().isdigit():
            lines.pop(0)
        if len(lines) < 2 or " --> " not in lines[0]:
            raise ValueError("SRT 段落缺少時間或文字")
        start, end = lines[0].split(" --> ", 1)
        cues.append({"start": seconds(start), "end": seconds(end), "text": " / ".join(lines[1:])})
    return cues


def read_cues(content, suffix):
    if suffix.lower() == ".lrc":
        return parse_lrc(content)
    if suffix.lower() == ".srt":
        return parse_srt(content)
    if suffix.lower() == ".json":
        data = decode_document(content)
        if isinstance(data, dict) and set(data) != {'cues'}:
            raise ValueError('完整歌詞 JSON 請使用歌詞包檢查；不可忽略名稱、總長或版本')
        return data.get("cues") if isinstance(data, dict) else data
    raise ValueError("歌詞僅支援 .lrc、.srt、.json")


def edits(cues, shift=0, time_changes=(), text_changes=()):
    # Index editing uses sorted original lines and avoids modifying caller input.
    if not isinstance(cues, list) or not cues or any(not isinstance(c, dict) or not isinstance(c.get('text'), str) for c in cues):
        raise ValueError('每句歌詞需為含 start、text 的物件')
    if any(not isinstance(v, (list, tuple)) for v in (time_changes, text_changes)):
        raise ValueError('編修清單需為句號=內容的字串清單')
    shift = milliseconds(shift, '整批調整秒數')
    output = [dict(cue) for cue in sorted(cues, key=lambda c: number(c.get("start"), "start"))]
    for cue in output:
        start = normalized_seconds(cue.get('start'), '歌詞開始時間', nonnegative=True)
        cue["start"] = seconds_from_milliseconds(milliseconds(start) + shift)
        if cue.get("end") is not None:
            end = normalized_seconds(cue['end'], '歌詞結束時間', nonnegative=True)
            cue["end"] = seconds_from_milliseconds(milliseconds(end) + shift)
    for changes, key in ((time_changes, "start"), (text_changes, "text")):
        for change in changes:
            try:
                index, value = change.split("=", 1)
                index = int(index) - 1
            except (ValueError, AttributeError):
                raise ValueError("編修格式需為 句號=內容，例如 2=14.5") from None
            if not 0 <= index < len(output):
                raise ValueError("編修句號超出範圍")
            if key == "start":
                value = normalized_seconds(value, "新開始時間", nonnegative=True)
                # Preserve source cue length when changing an explicit SRT start.
                if output[index].get("end") is not None:
                    output[index]["end"] = seconds_from_milliseconds(milliseconds(output[index]['end']) + milliseconds(value) - milliseconds(output[index]['start']))
            output[index][key] = value
    return output


def timecode(seconds, srt=False):
    if number(seconds, '時間') < 0:
        raise ValueError('時間不能有負時間')
    total = milliseconds(seconds)
    minutes, rest = divmod(total, 60000)
    sec, ms = divmod(rest, 1000)
    if srt:
        hours, minute = divmod(minutes, 60)
        return f"{hours:02}:{minute:02}:{sec:02},{ms:03}"
    return f"{minutes:02}:{sec:02}.{ms:03}"


def lrc_text(cues):
    return "\n".join(f"[{timecode(c['start'])}]{c['text']}" for c in cues) + "\n"


def srt_text(cues):
    return "\n\n".join(f"{i}\n{timecode(c['start'], True)} --> {timecode(c['end'], True)}\n{c['text']}"
                       for i, c in enumerate(cues, 1)) + "\n"


def lyrics_bundle(cues, title="歌詞", duration=None, *, applied_shift=None, review_notes=()):
    cleaned, duration, inferred = validate_cues(cues, duration)
    tail = max(cues, key=lambda cue: number(cue.get('start'), '歌詞開始時間'))
    timing = {"duration_source": ("provided" if not inferred else
                                 "last_cue_end" if tail.get("end") is not None else "last_start_plus_three"),
              "inferred_end_count": sum(cue.get("end") is None for cue in cues),
              "tail_end_inferred": tail.get("end") is None}
    if applied_shift is not None:
        timing['applied_shift_seconds'] = normalized_seconds(applied_shift, '整批調整秒數')
    cues = cleaned
    data = {"format": PACKAGE_FORMAT, "schema_version": PACKAGE_SCHEMA_VERSION, "title": title,
            "duration": duration, "duration_estimated": inferred, "cues": cues, "timing": timing,
            "review_notes": list(review_notes)}
    return package_files(data)
