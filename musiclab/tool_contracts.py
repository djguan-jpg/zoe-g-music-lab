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


def lyrics_package_schema(legacy=False):
    def exact(properties): return object_schema(properties, properties.keys(), additionalProperties=False)
    moment = {'type': 'number', 'minimum': 0}
    timing = {'duration_source': {'enum': ['provided', 'last_cue_end', 'last_start_plus_three']},
              'inferred_end_count': {'type': 'integer', 'minimum': 0, 'maximum': 10000},
              'tail_end_inferred': {'type': 'boolean'}, 'applied_shift_seconds': {'type': 'number'}}
    fields = {'title': {'type': 'string', 'minLength': 1, 'maxLength': 200},
              'duration': {'type': 'number', 'exclusiveMinimum': 0}, 'duration_estimated': {'type': 'boolean'},
              'cues': array_schema(exact({'start': moment, 'end': moment, 'text': {'type': 'string'}}), 1, 10000),
              'timing': object_schema(timing, ['duration_source', 'inferred_end_count', 'tail_end_inferred'], additionalProperties=False)}
    if not legacy:
        fields.update(format={'const': 'zoe-lyrics-package'}, schema_version={'type': 'integer', 'const': 1},
                      review_notes=array_schema({'type': 'string', 'minLength': 1, 'maxLength': 400}, 0, 20))
    return exact(fields)


def seed_schema():
    def exact(properties): return object_schema(properties, properties.keys(), additionalProperties=False)
    def value(low, high, integer=False):
        return {'type':'integer' if integer else 'number','minimum':low,'maximum':high}
    section = exact({'section':text('Source section'),'bars':value(1,128,True),
                     'start':value(0,3600),'end':value(.001,3600),'energy':value(1,5),
                     'focus':text('Source task'),'texture':text('Source arrangement')})
    slot = exact({'shot':value(1,1000,True),'start':value(0,3600),'end':value(.001,3600),
                  'start_frame':value(0,432000,True),'end_frame_exclusive':value(1,432000,True),
                  'bar_start':value(1,5120,True),'bar_end':value(1,5120,True),
                  'section':text('Source section'),'purpose':text('Source task')})
    return exact({'format':{'const':'zoe-storyboard-seed'},'schema_version':{'type':'integer','const':1},
                  'status':{'const':'timing_seed_incomplete'},'title':text('Seed title'),
                  'duration_seconds':value(.001,3600),'fps':value(1,120),'bars_per_shot':value(1,128,True),
                  'source':exact({'bpm':value(20,300),'beats_per_bar':value(1,12,True),
                                  'timing_assumption':{'const':'constant_tempo_no_pickup'},
                                  'sections':array_schema(section,1,40)}),
                  'slots':array_schema(slot,1,1000),'review_notes':array_schema(text('Human review note'),1,100)})


def payload_schema(operation):
    if operation == 'storyboard_timing_review':
        def exact(properties): return object_schema(properties, properties.keys(), additionalProperties=False)
        raw = {'type': 'string', 'description': 'Original clock text, including empty or invalid decimal strings; never guessed'}
        panel = exact({'fields': exact({'mv-duration': deepcopy(raw), 'mv-fps': deepcopy(raw)}),
                       'shots': array_schema(exact({'start': deepcopy(raw), 'end': deepcopy(raw)}), 0, 1000)})
        return exact({'panel': panel})
    if operation == 'storyboard_review':
        from .draft_contract import draft_schema
        panel = draft_schema()['properties']['panels']['properties']['storyboard']
        panel['properties']['shots']['items']['properties']['screen_direction'].pop('enum')
        panel['description'] = 'Raw draft3 storyboard panel; original strings, blank fields and motif IDs; unknown direction is diagnosed; no paths or timing acceptance'
        return object_schema({'panel': panel}, ('panel',), additionalProperties=False)
    if operation == 'music_review':
        from .draft_contract import draft_schema
        panel = draft_schema()['properties']['panels']['properties']['music']
        panel['description'] = 'Raw draft3 music panel; all fields remain strings, including blank or malformed numeric strings; no paths or full-plan claim'
        return object_schema({'panel': panel}, ('panel',), additionalProperties=False)
    if operation == 'lyrics_review':
        clock={'type':['number','string','null','boolean'],'description':'Raw clock field; empty or malformed scalar is reported, never guessed'}
        cue=object_schema({'start':clock,'end':clock,'text':{'type':'string','maxLength':2000}},('start','end','text'),additionalProperties=False)
        return object_schema({'title':{'type':'string','minLength':1,'maxLength':200},'duration':clock,
                              'cues':array_schema(cue,0,10000)},('cues',),additionalProperties=False)
    if operation == 'lyrics_seed':
        def exact(properties): return object_schema(properties, properties.keys(), additionalProperties=False)
        seed = exact({'format':{'const':'zoe-lyrics-seed'},'schema_version':{'type':'integer','const':1},
                      'status':{'const':'untimed'},'title':{'type':'string','minLength':1,'maxLength':200},
                      'source_text':{'type':'string','minLength':1,'maxLength':65536,'description':'Original text, at most64 KiB UTF-8; preserve whitespace and blank lines'},
                      'lines':{'type':'array','minItems':1,'maxItems':1000,'items':exact({'line':{'type':'integer','minimum':1,'maximum':65537},'text':{'type':'string'}})},
                      'review_notes':{'type':'array','minItems':1,'maxItems':20,'items':{'type':'string','minLength':1,'maxLength':2000}}})
        return object_schema({'title':{'type':'string','minLength':1,'maxLength':200},
                              'text':{'type':'string','minLength':1,'maxLength':65536,'description':'Untimed text, at most64 KiB UTF-8; every nonblank line becomes one cue; no guessed times'},
                              'seed':seed}, additionalProperties=False,
                             oneOf=[{'required':['title','text'],'not':{'required':['seed']}},
                                    {'required':['seed'],'not':{'anyOf':[{'required':['title']},{'required':['text']}]}}])
    if operation == 'storyboard_seed':
        music = payload_schema('music')
        music['required'] += ['arrangement', 'bpm', 'memory_hook']
        return object_schema({'music': music, 'seed': seed_schema(),
                              'fps': numeric('Seed frame rate; default 24', 1, 120),
                              'bars_per_shot': numeric('Maximum whole bars per shot; default 4', 1, 128, integer=True)},
                             additionalProperties=False,
                             oneOf=[{'required':['music'], 'not':{'required':['seed']}},
                                    {'required':['seed'], 'not':{'anyOf':[{'required':[key]} for key in ('music','fps','bars_per_shot')]}}])
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
                              "duration": {"anyOf": [numeric("Confirmed total seconds, optional", 0, positive=True), {"type": "null"}]},
                              "shift_seconds": numeric("Optional global offset in seconds; positive delays, negative advances. Round to milliseconds; shift explicit ends too; never clip."),
                              "time_changes": {"type":"array","items":{"type":"string"},"description":"Optional 1-based sorted original cue edits, e.g. 2=14.5; after global shift, explicit end keeps its length."},
                              "text_changes": {"type":"array","items":{"type":"string"},"description":"Optional 1-based sorted original cue text edits, e.g. 2=新歌詞; after global shift."},
                              "package": {'anyOf': [lyrics_package_schema(), lyrics_package_schema(legacy=True)]},
                              "allow_legacy": {'type': 'boolean', 'description': 'Explicit conversion of the complete old unversioned package; inspection preserves all timing metadata.'}},
                             additionalProperties=False,
                             oneOf=[{"required": ["cues"], "not": {"anyOf": [{"required": [key]} for key in ('content', 'suffix', 'package', 'allow_legacy')]}},
                                    {"required": ["content"], "not": {"anyOf": [{"required": [key]} for key in ('cues', 'package', 'allow_legacy')]}},
                                    object_schema({'package': {'anyOf': [lyrics_package_schema(), lyrics_package_schema(legacy=True)]},
                                                   'allow_legacy': {'type': 'boolean'}}, ['package'], additionalProperties=False)])
    if operation == 'delivery_package':
        return object_schema({'scope': {'enum': ['music','storyboard','lyrics','audio']},
                              'label': {'type':'string','maxLength':200},
                              'files': {'type':'object','minProperties':1,'maxProperties':64,
                                        'additionalProperties':{'type':'string'},
                                        'description':'Flat portable text names only, 8 MiB total UTF-8; no paths or media; DELIVERY-MANIFEST.json reserved'},
                              'include_archive': {'type':'boolean','default':False,'description':'Explicit Base64 ZIP only up to 512 KiB; default returns SHA/bytes/manifest without archive bytes'}},
                             ['scope','files'],additionalProperties=False)
    if operation == "audio":
        limits = {"anyOf": [array_schema({"type": "integer", "minimum": 1}, 1), {"type": "null"}],
                  "description": "Accepted positive integers; null uses the profile default. Booleans are rejected."}
        from .audio_acceptance import FORMAT, MAX_FIELD
        fields = {key: {'type': 'string', 'maxLength': MAX_FIELD} for key in ('rates', 'bits', 'channels')}
        draft = object_schema({'format': {'const': FORMAT}, 'schema_version': {'type': 'integer', 'const': 1},
                               'profile': {'enum': ['distribution', 'video']}, 'custom': {'type': 'boolean'},
                               'fields': object_schema(fields, fields.keys(), additionalProperties=False)},
                              ['format', 'schema_version', 'profile', 'custom', 'fields'], additionalProperties=False)
        return object_schema({"profile": {"type": "string", "enum": ["distribution", "video"], "default": "distribution"},
                              "rates": deepcopy(limits), "bits": deepcopy(limits), "channels": deepcopy(limits),
                              'acceptance_draft': draft,
                              "display_name": text("Display filename only; does not select media", blank=True)},
                             additionalProperties=False,
                             **{'not': {'allOf': [{'required': ['acceptance_draft']},
                                        {'anyOf': [{'required': [key]} for key in ('profile', 'rates', 'bits', 'channels')]}]}})
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
