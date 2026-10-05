# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
"""Bounded explicit file handoff; original draft and complete review stay separate."""
from .audio_acceptance import FORMAT as DRAFT_FORMAT, validate, MAX_BYTES
from .audio_acceptance_review import FORMAT as REVIEW_FORMAT, validate_report
from .json_document import decode_json


def descriptor():
    return {'contract_version': 1, 'max_input_bytes': MAX_BYTES,
            'accepted_formats': [{'format': DRAFT_FORMAT, 'schema_version': 1},
                                 {'format': REVIEW_FORMAT, 'schema_version': 1}],
            'report_validation': 'complete source-derived report before extraction',
            'media_access': False}


def inspect(document):
    if isinstance(document, dict) and document.get('format') == REVIEW_FORMAT:
        return {'document': validate_report(document)['source'], 'kind': 'review'}
    return {'document': validate(document), 'kind': 'draft'}


def decode(raw):
    return inspect(decode_json(raw, max_bytes=MAX_BYTES, allow_bom=True))
