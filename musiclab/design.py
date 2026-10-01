"""Original planning models: musical memory and visual motif continuity."""
import json
import re
from .common import json_text, number, text
from .creative import music_bundle, storyboard_bundle


def music_plan_bundle(brief):
    bpm = number(brief.get("bpm"), "BPM")
    beats = number(brief.get("beats_per_bar", 4), "每小節拍數")
    if not 20 <= bpm <= 300 or beats != int(beats) or not 1 <= beats <= 12:
        raise ValueError("BPM 需介於 20–300；每小節拍數需為 1–12 整數")
    sections = brief.get("arrangement")
    if not isinstance(sections, list) or not 1 <= len(sections) <= 40:
        raise ValueError("歌曲需要 1–40 個段落")
    plan, elapsed = [], 0.0
    for index, section in enumerate(sections, 1):
        if not isinstance(section, dict):
            raise ValueError("歌曲段落需為物件")
        bars = number(section.get("bars"), f"段落 {index} 小節")
        energy = number(section.get("energy"), f"段落 {index} 能量")
        if bars != int(bars) or not 1 <= bars <= 128 or not 1 <= energy <= 5:
            raise ValueError("小節需為 1–128 整數；能量需介於 1–5")
        end = elapsed + bars * beats * 60 / bpm
        plan.append({"section": text(section.get("name"), "段落名稱"), "bars": int(bars),
                     "start": round(elapsed, 3), "end": round(end, 3), "energy": energy,
                     "focus": text(section.get("focus"), "段落敘事任務"),
                     "texture": text(section.get("texture"), "段落聲音配置")})
        elapsed = end
    source = dict(brief, duration_seconds=round(elapsed, 3), structure=[s["section"] for s in plan])
    files = music_bundle(source)
    hook = text(brief.get("memory_hook"), "記憶點")
    saved = json.loads(files["brief.json"])
    saved.update(bpm=bpm, beats_per_bar=int(beats), memory_hook=hook,
                 arrangement=[{"name": s["section"], "bars": s["bars"], "energy": s["energy"],
                               "focus": s["focus"], "texture": s["texture"]} for s in plan])
    files["brief.json"] = json_text(saved)
    lines = [line.strip() for line in brief.get("existing_lyrics", "").splitlines() if line.strip()]
    lyric_counts = [{"line": i, "text": line,
                     "text_units": len(re.findall(r"[\u3400-\u9fff]|[A-Za-z0-9]+", line))}
                    for i, line in enumerate(lines, 1)]
    warnings = []
    if len({s["energy"] for s in plan}) == 1:
        warnings.append("所有段落能量相同；請確認是否刻意維持平坦動態")
    if lines and not any(hook in line for line in lines):
        warnings.append("草稿尚未出現指定記憶點；可選擇保留意象而不直接重複文字")
    if any(line["text_units"] > 24 for line in lyric_counts):
        warnings.append("部分歌詞超過 24 文字單位；需實唱確認一口氣能否唱完")
    data = {"title": source["title"], "bpm": bpm, "beats_per_bar": int(beats),
            "duration_seconds": round(elapsed, 3), "memory_hook": hook, "sections": plan,
            "lyric_units": lyric_counts, "review_notes": warnings,
            "status": "design_only_not_generated", "timing_assumption": "constant_tempo_no_pickup",
            "unit_note": "中文字元與拉丁文字詞計數，不是實測音節"}
    markdown = [f"# {source['title']}：歌曲設計\n\n",
                f"{bpm:g} BPM · 每小節 {beats:g} 拍 · 約 {elapsed:.3f} 秒\n\n記憶點：{hook}\n\n",
                "| 段落 | 起訖秒 | 小節 | 能量 1–5 | 敘事任務 | 聲音配置 |\n|---|---|---|---|---|---|\n"]
    for s in plan:
        markdown.append(f"| {s['section']} | {s['start']}–{s['end']} | {s['bars']} | {s['energy']} | {s['focus']} | {s['texture']} |\n")
    markdown.append("\n## 三條可由 AI 發展的創作路徑\n\n"
                    f"- 動作路徑：讓「{hook}」在主歌是逃避動作，在末副歌成為主動選擇。\n"
                    f"- 對話路徑：同一句「{hook}」先對別人說，最後改成對自己說。\n"
                    f"- 空間路徑：圍繞「{hook}」設計三個空間，每次回到同一聲音時讓位置改變。\n"
                    "\n以上是構思框架，尚未生成歌詞或音樂。時間假設固定速度、沒有弱起或自由速度。\n")
    markdown.extend(f"\n- 待聆聽確認：{note}\n" for note in warnings)
    files.update({"music-plan.json": json_text(data), "music-plan.md": "".join(markdown)})
    files["task.md"] += "\n## 設計台補充\n\n依 music-plan.json 的段落任務與能量曲線完成創作。保留記憶點，但讓其前後意義改變；列出實唱與實聽仍需驗證的項目。\n"
    return files


def motif_bundle(brief):
    files = storyboard_bundle(brief)
    data = json.loads(files["storyboard.json"])
    motifs = brief.get("motifs")
    if not isinstance(motifs, list) or not 1 <= len(motifs) <= 30:
        raise ValueError("需要 1–30 個母題")
    registry = {}
    for motif in motifs:
        if not isinstance(motif, dict):
            raise ValueError("母題需為物件")
        name = text(motif.get("name"), "母題名稱")
        if name in registry:
            raise ValueError("母題名稱不可重複")
        registry[name] = text(motif.get("meaning"), "母題意義")
    warnings, states = [], {name: [] for name in registry}
    previous = None
    continuity = []
    for index, source in enumerate(brief["shots"], 1):
        name = text(source.get("motif"), f"鏡頭 {index} 母題")
        if name not in registry:
            raise ValueError(f"鏡頭 {index} 引用未登記母題")
        state = text(source.get("motif_state"), f"鏡頭 {index} 母題狀態")
        direction = source.get("screen_direction")
        if direction not in ("left", "right", "neutral"):
            raise ValueError("畫面方向只能為 left、right、neutral")
        character = text(source.get("character_state"), f"鏡頭 {index} 人物狀態")
        reason = source.get("change_reason", "")
        if not isinstance(reason, str):
            raise ValueError("變化理由需為文字")
        reason = reason.strip()
        changed = previous and (character != previous["character_state"] or
                                {direction, previous["screen_direction"]} == {"left", "right"})
        if changed and not reason:
            warnings.append({"shot": index, "message": "人物狀態或左右方向改變，尚未填入變化理由"})
        current = {"shot": index, "motif": name, "motif_state": state,
                   "screen_direction": direction, "character_state": character, "change_reason": reason}
        states[name].append({"shot": index, "state": state})
        continuity.append(current)
        previous = current
    for name, occurrences in states.items():
        if not occurrences:
            warnings.append({"shot": None, "message": f"母題「{name}」尚未出現在鏡頭中"})
        elif len({entry["state"] for entry in occurrences}) == 1:
            warnings.append({"shot": None, "message": f"母題「{name}」只有一種狀態；請確認是否刻意維持意義"})
    data.update(motifs=registry, continuity=continuity, review_notes=warnings)
    files["storyboard.json"] = json_text(data)
    notes = [f"# {data['title']}：母題與連戲\n\n這是資料一致性檢查，不是自動導演評分。\n\n"]
    for name, meaning in registry.items():
        notes.append(f"## {name}\n\n原始意義：{meaning}\n\n")
        notes.extend(f"- 鏡頭 {entry['shot']}：{entry['state']}\n" for entry in states[name])
    notes.append("\n## 待審查\n\n")
    notes.extend(f"- {note['message']}" + (f"（鏡頭 {note['shot']}）" if note['shot'] else "") + "\n" for note in warnings)
    if not warnings:
        notes.append("本次資料未發現未說明的狀態／方向變化；仍需人工審查實際畫面。\n")
    files["continuity.md"] = "".join(notes)
    files["mv-brief.json"] = json_text(brief)
    return files
