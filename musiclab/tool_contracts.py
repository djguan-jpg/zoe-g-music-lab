# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
"""Discoverable JSON Schema contracts, separate from domain calculations.

Schemas describe JSON shapes; domain modules remain authoritative for timing,
finite numeric strings, continuity and PCM evidence. No SDK or schema engine.
"""
from copy import deepcopy


def text(description, blank=False):
    result = {"type": "string", "description": description}
    if not blank:
        result["pattern"] = r"\S"
    return result


def numeric(description, low=None, high=None, integer=False, positive=False):
    value = {"type": "integer" if integer else "number"}
    if low is not None:
        value["exclusiveMinimum" if positive else "minimum"] = low
    if high is not None:
        value["maximum"] = high
    return {"description": description + "; numeric strings are checked by the domain validator",
            "anyOf": [value, {"type": "string"}]}


def object_schema(properties, required=(), **extra):
    return {"type": "object", "properties": properties, "required": list(required), **extra}


def array_schema(items, minimum=0, maximum=None):
    schema = {"type": "array", "items": items, "minItems": minimum}
    if maximum is not None:
        schema["maxItems"] = maximum
    return schema


def payload_schema(operation):
    if operation == "draft_backup_inspect":
        return object_schema({}, (), additionalProperties=False)
    if operation == "draft_backup_restore":
        return object_schema({"backup_sha256": {"type": "string", "pattern": "^[0-9a-f]{64}$",
            "description": "SHA-256 from preview of the backup selected at process launch"}},
            ("backup_sha256",), additionalProperties=False)
    if operation in ("draft_save", "draft_list", "draft_read"):
        from .draft_contract import draft_schema
        from .draft_library import ID_PATTERN
        identifier = {"type": "string", "pattern": "^" + ID_PATTERN + "$",
                      "description": "Revision ID; retry the same ID only with identical content. Never a path."}
        if operation == "draft_save":
            return object_schema({"id": identifier, "label": {"type": "string", "minLength": 1, "maxLength": 200, "pattern": r"\S"},
                                  "draft": draft_schema()}, ("id", "label", "draft"), additionalProperties=False)
        if operation == "draft_read":
            return object_schema({"id": identifier}, ("id",), additionalProperties=False)
        return object_schema({"limit": {"type": "integer", "minimum": 1, "maximum": 100, "default": 20},
                              "cursor": {"anyOf": [identifier, {"type": "null"}]}}, additionalProperties=False)
    if operation == "music":
        properties = {key: text(label) for key, label in {
            "title": "Song title", "language": "Creative language", "audience": "Intended listeners",
            "theme": "Story core", "style": "Sound and genre", "vocal": "Vocal delivery",
            "memory_hook": "Phrase or image whose meaning develops"}.items()}
        properties.update(existing_lyrics=text("Existing draft, optional", blank=True),
                          bpm=numeric("Constant tempo in BPM", 20, 300),
                          beats_per_bar=numeric("Beats per bar; default 4", 1, 12, integer=True),
                          duration_seconds=numeric("Legacy duration; arrangement recalculates it", 0, 3600, positive=True),
                          structure=array_schema(text("Legacy section name"), 1),
                          avoid=array_schema(text("One avoid item, multiline allowed")),
                          deliverables=array_schema(text("One requested deliverable"), 1))
        section = object_schema({"name": text("Section name"),
                                 "bars": numeric("Bars", 1, 128, integer=True),
                                 "energy": numeric("Energy, restrained 1 to full 5", 1, 5),
                                 "focus": text("Narrative task"), "texture": text("Sound arrangement")},
                                ("name", "bars", "energy", "focus", "texture"))
        properties["arrangement"] = array_schema(section, 1, 40)
        return object_schema(properties, ("title", "language", "audience", "theme", "style", "vocal", "deliverables"),
                             anyOf=[{"required": ["arrangement", "bpm", "memory_hook"]},
                                    {"required": ["duration_seconds", "structure"], "not": {"required": ["arrangement"]}}])
    if operation == "storyboard":
        properties = {key: text(label) for key, label in {
            "title": "MV title", "aspect_ratio": "Frame ratio; UI supports 16:9, 9:16, 1:1, 4:3",
            "visual_style": "Visual direction", "character_anchor": "Character consistency"}.items()}
        properties.update(duration_seconds=numeric("Total covered seconds", 0, 14400, positive=True),
                          fps=numeric("Frame rate", 0, 120, positive=True))
        fields = {key: text(label) for key, label in {
            "section": "Song section", "purpose": "Narrative purpose", "visual": "Visible action",
            "camera": "Camera motion", "transition": "End and transition",
            "motif": "Registered motif name", "motif_state": "Meaning in this shot",
            "character_state": "Character state"}.items()}
        fields.update(start=numeric("Start seconds", 0), end=numeric("Exclusive end seconds", 0, positive=True),
                      screen_direction={"type": "string", "enum": ["left", "right", "neutral"]},
                      change_reason=text("Reason for state or direction change, optional", blank=True))
        properties["shots"] = array_schema(object_schema(fields, ("start", "end", "section", "purpose", "visual", "camera", "transition")), 1)
        properties["motifs"] = array_schema(object_schema({"name": text("Unique motif name"),
                                                            "meaning": text("Initial meaning")}, ("name", "meaning")), 1, 30)
        return object_schema(properties, ("title", "duration_seconds", "fps", "aspect_ratio", "visual_style", "character_anchor", "shots"),
                             allOf=[{"if": {"required": ["motifs"]},
                                     "then": {"properties": {"shots": {"items": {"required": ["motif", "motif_state", "character_state", "screen_direction"]}}}}}])
    if operation == "lyrics":
        cue = object_schema({"start": numeric("Cue start seconds", 0),
                             "end": {"anyOf": [numeric("Explicit cue end seconds", 0, positive=True), {"type": "null"}]},
                             "text": text("Lyric line")}, ("start", "text"))
        return object_schema({"title": text("Title; default 歌詞", blank=True),
                              "cues": array_schema(cue, 1), "content": text("Original LRC/SRT/JSON text"),
                              "suffix": {"type": "string", "pattern": r"^\.([lL][rR][cC]|[sS][rR][tT]|[jJ][sS][oO][nN])$", "description": ".lrc/.srt/.json, case insensitive; default .lrc"},
                              "duration": {"anyOf": [numeric("Confirmed total seconds, optional", 0, positive=True), {"type": "null"}]}},
                             oneOf=[{"required": ["cues"], "not": {"anyOf": [{"required": ["content"]}, {"required": ["suffix"]}]}},
                                    {"required": ["content"], "not": {"required": ["cues"]}}])
    if operation == "audio":
        limits = {"anyOf": [array_schema({"type": "integer", "minimum": 1}, 1), {"type": "null"}],
                  "description": "Accepted positive integers; null uses the profile default. Booleans are rejected."}
        return object_schema({"profile": {"type": "string", "enum": ["distribution", "video"], "default": "distribution"},
                              "rates": deepcopy(limits), "bits": deepcopy(limits), "channels": deepcopy(limits),
                              "display_name": text("Display filename only; does not select media", blank=True)},
                             **{"not": {"anyOf": [{"required": [key]} for key in ("path", "input", "audio_source", "filename")]}})
    raise ValueError("Unknown operation")


def input_schema(operation):
    return object_schema({"payload": payload_schema(operation)}, ("payload",), additionalProperties=False)


def output_schema():
    return object_schema({"files": {"type": "object", "additionalProperties": {"type": "string"},
                                    "description": "Returned text artifacts, not files saved to disk"},
                          "data": {"type": "object", "description": "Domain result; varies by operation"},
                          "meta": object_schema({"version": {"type": "string"},
                                                 "protocol_version": {"type": "integer", "const": 1},
                                                 "needs_review": {"type": "boolean"}},
                                                ("version", "protocol_version", "needs_review"), additionalProperties=False)},
                         ("files", "data", "meta"), additionalProperties=False)
