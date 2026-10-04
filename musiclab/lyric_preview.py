# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
"""Shared standalone template and fixed native modules; no user-selected paths."""
import html,json,re
from pathlib import Path

TEMPLATE_SCHEMA_VERSION=1
ASSETS=Path(__file__).parent/'assets'
PREVIEW=(ASSETS/'lyric-preview.html').read_text(encoding='utf-8')

def preview_contract():
    document=(ASSETS/'json-document.js').read_text(encoding='utf-8')
    package=(ASSETS/'lyrics-package.js').read_text(encoding='utf-8')
    media=(ASSETS/'lyrics-media.js').read_text(encoding='utf-8')
    return {'format':'zoe-lyrics-preview-template','schema_version':TEMPLATE_SCHEMA_VERSION,'template':PREVIEW,
            'timing_js':(ASSETS/'lyric-time.js').read_text(encoding='utf-8'),
            'package_js':'\n'.join([document,package,media,*[(ASSETS/name).read_text(encoding='utf-8') for name in ('lyrics-lrc.js','lyrics-export-review.js','lyrics-offline-export.js','lyrics-offline-export-dom.js','lyrics-download.js')],
                                  *[(ASSETS.parent.parent/'web'/name).read_text(encoding='utf-8') for name in ('text-download.js','text-download-dom.js')]])}

def safe_json(data):
    return json.dumps(data,ensure_ascii=False,allow_nan=False).replace('<','\\u003c').replace('\u2028','\\u2028').replace('\u2029','\\u2029')

def contract_script():
    return 'window.MusicLyricsPreviewContract='+safe_json(preview_contract())+';\n'

def render_preview(data,title):
    contract=preview_contract()
    parts={'TITLE':html.escape(title),'DATA':safe_json(data),'TIMING_JS':contract['timing_js'],'PACKAGE_JS':contract['package_js']}
    return re.sub(r'__(TITLE|DATA|TIMING_JS|PACKAGE_JS)__',lambda match:parts[match[1]],contract['template'])
