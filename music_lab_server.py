# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
"""Loopback-only workbench; stdlib, allowlisted assets, no user path access."""
import argparse
import json
import io
import re
import tempfile
import threading
import urllib.parse
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from musiclab.common import json_text
from musiclab.application import build, capabilities, load_request, MAX_REQUEST_BYTES, export_library_backup, prepare_delivery, inspect_delivery
from musiclab.draft_backup import MAX_BACKUP_BYTES, selected_ids
from musiclab.backup_downloads import BackupDownloads
from musiclab.delivery_package import MAX_ARCHIVE_BYTES as MAX_DELIVERY_ARCHIVE, MAX_REQUEST_BYTES as MAX_DELIVERY_REQUEST, decode as decode_delivery
from musiclab.draft_contract import browser_contract
from musiclab.draft_library import DraftLibrary

ROOT = Path(__file__).resolve().parent
DOWNLOAD_INIT_LOCK = threading.Lock()


def backup_downloads(server):
    with DOWNLOAD_INIT_LOCK:
        if not hasattr(server,'backup_downloads'):
            server.backup_downloads=BackupDownloads()
        return server.backup_downloads


def delivery_downloads(server):
    with DOWNLOAD_INIT_LOCK:
        if not hasattr(server,'delivery_downloads'):
            server.delivery_downloads=BackupDownloads(max_bytes=MAX_DELIVERY_ARCHIVE,prefix='zoe-delivery-download-',download_path='/api/delivery-package/download/',hash_key='sha256',label='交付')
        return server.delivery_downloads


class WorkbenchServer(ThreadingHTTPServer):
    def server_close(self):
        try:super().server_close()
        finally:
            try:
                if hasattr(self,'backup_downloads'):self.backup_downloads.close()
            finally:
                if hasattr(self,'delivery_downloads'):self.delivery_downloads.close()
MAX_AUDIO = 64 * 1024 * 1024
MAX_TEXT = MAX_REQUEST_BYTES
ASSETS = {**{path: ("web"+path,"text/javascript") for path in ("/draft-compare-row.js","/draft-compare-row-dom.js","/draft-compare.js","/draft-compare-controller.js","/draft-compare-dom.js","/draft-compare-view.js","/draft-compare-download.js")},"/issue-summary.js": ("web/issue-summary.js", "text/javascript"), "/lyrics-cue-review.js": ("web/lyrics-cue-review.js", "text/javascript"), "/lyrics-cue-review-dom.js": ("web/lyrics-cue-review-dom.js", "text/javascript"), "/editor-field-position.js": ("web/editor-field-position.js", "text/javascript"), "/readiness-request.js": ("web/readiness-request.js", "text/javascript"), "/music-section-review.js": ("web/music-section-review.js", "text/javascript"), "/music-section-review-dom.js": ("web/music-section-review-dom.js", "text/javascript"), "/storyboard-shot-request.js": ("web/storyboard-shot-request.js", "text/javascript"), "/issue-cursor.js": ("web/issue-cursor.js", "text/javascript"), "/shot-field-position.js": ("web/shot-field-position.js", "text/javascript"), "/storyboard-shot-review.js": ("web/storyboard-shot-review.js", "text/javascript"), "/storyboard-shot-review-dom.js": ("web/storyboard-shot-review-dom.js", "text/javascript"), "/readiness-page-dom.js": ("web/readiness-page-dom.js", "text/javascript"),"/issue-page.js": ("web/issue-page.js", "text/javascript"), "/issue-page-dom.js": ("web/issue-page-dom.js", "text/javascript"),"/operation-presentation.js": ("web/operation-presentation.js", "text/javascript"),"/operation-gate.js": ("web/operation-gate.js", "text/javascript"),"/operation-control-dom.js": ("web/operation-control-dom.js", "text/javascript"),"/delivery-versions.js": ("musiclab/assets/delivery-versions.js","text/javascript"),"/lyrics-preview.js": ("web/lyrics-preview.js","text/javascript"),"/delivery-report.js": ("web/delivery-report.js","text/javascript"),"/delivery-review.js": ("web/delivery-review.js","text/javascript"),"/delivery-archive.js": ("web/delivery-archive.js","text/javascript"),"/delivery-source.js": ("web/delivery-source.js","text/javascript"),"/delivery-import.js": ("web/delivery-import.js","text/javascript"),
          "/delivery-context.js": ("web/delivery-context.js","text/javascript"),"/delivery-search.js": ("web/delivery-search.js","text/javascript"),"/delivery-search-dom.js": ("web/delivery-search-dom.js","text/javascript"),
          "/delivery-text.js": ("web/delivery-text.js","text/javascript"),"/delivery-text-dom.js": ("web/delivery-text-dom.js","text/javascript"),
          "/text-download.js": ("web/text-download.js","text/javascript"),"/text-download-dom.js": ("web/text-download-dom.js","text/javascript"),
          "/delivery-import-dom.js": ("web/delivery-import-dom.js","text/javascript"),"/": ("web/index.html", "text/html"), "/app.js": ("web/app.js", "text/javascript"),
          "/style.css": ("web/style.css", "text/css"),
          "/delivery-package.js": ("web/delivery-package.js", "text/javascript"),
          "/delivery-package-dom.js": ("web/delivery-package-dom.js", "text/javascript"),
          "/delivery-navigation.js": ("web/delivery-navigation.js", "text/javascript"),
          "/delivery-navigation-dom.js": ("web/delivery-navigation-dom.js", "text/javascript"),
          "/editor-state.js": ("web/editor-state.js", "text/javascript"),
          "/text-byte-context.js": ("web/text-byte-context.js", "text/javascript"),
          "/text-verification.js": ("web/text-verification.js", "text/javascript"),
          "/verification-focus.js": ("web/verification-focus.js", "text/javascript"),
          "/text-verification-controller.js": ("web/text-verification-controller.js", "text/javascript"),
          "/text-verification-dom.js": ("web/text-verification-dom.js", "text/javascript"),
          "/editor-focus.js": ("web/editor-focus.js", "text/javascript"),
          "/editor-focus-dom.js": ("web/editor-focus-dom.js", "text/javascript"),
          "/editor-copy.js": ("web/editor-copy.js", "text/javascript"),
          "/editor-copy-dom.js": ("web/editor-copy-dom.js", "text/javascript"),
          "/entry-order.js": ("web/entry-order.js", "text/javascript"),
          "/editor-selection.js": ("web/editor-selection.js", "text/javascript"),
          "/editor-selection-dom.js": ("web/editor-selection-dom.js", "text/javascript"),
          "/editor-keys.js": ("web/editor-keys.js", "text/javascript"),
          "/editor-keys-dom.js": ("web/editor-keys-dom.js", "text/javascript"),
          "/editor-position.js": ("web/editor-position.js", "text/javascript"),
          "/editor-position-dom.js": ("web/editor-position-dom.js", "text/javascript"),
          "/editor-order.js": ("web/editor-order.js", "text/javascript"),
          "/editor-order-dom.js": ("web/editor-order-dom.js", "text/javascript"),
          "/planning-import.js": ("web/planning-import.js", "text/javascript"),
          "/deletion-history.js": ("web/deletion-history.js", "text/javascript"),
          "/draft-library.js": ("web/draft-library.js", "text/javascript"),
          "/library-search.js": ("web/library-search.js", "text/javascript"),
          "/library-match.js": ("web/library-match.js", "text/javascript"),
          "/library-presentation.js": ("web/library-presentation.js", "text/javascript"),
          "/library-presentation-dom.js": ("web/library-presentation-dom.js", "text/javascript"),
          "/library-receipt.js": ("web/library-receipt.js", "text/javascript"),
          "/utc-timestamp.js": ("musiclab/assets/utc-timestamp.js", "text/javascript"),
          "/library-revision.js": ("web/library-revision.js", "text/javascript"),
          "/library-result.js": ("web/library-result.js", "text/javascript"),
          "/draft-retention.js": ("web/draft-retention.js", "text/javascript"),
          "/draft-difference.js": ("web/draft-difference.js", "text/javascript"),
          "/backup-transfer.js": ("web/backup-transfer.js", "text/javascript"),
          "/backup-file.js": ("web/backup-file.js", "text/javascript"),
          "/backup-result.js": ("web/backup-result.js", "text/javascript"),
          "/backup-download.js": ("web/backup-download.js", "text/javascript"),
          "/backup-download-dom.js": ("web/backup-download-dom.js", "text/javascript"),
          "/backup-selection.js": ("web/backup-selection.js", "text/javascript"),
          "/backup-selection-dom.js": ("web/backup-selection-dom.js", "text/javascript"),
          "/backup-verification.js": ("web/backup-verification.js", "text/javascript"),
          "/backup-verification-controller.js": ("web/backup-verification-controller.js", "text/javascript"),
          "/backup-verification-dom.js": ("web/backup-verification-dom.js", "text/javascript"),
          "/lyric-time.js": ("musiclab/assets/lyric-time.js", "text/javascript"),
          "/lyrics-timing.js": ("web/lyrics-timing.js", "text/javascript"),
          "/lyrics-media.js": ("musiclab/assets/lyrics-media.js", "text/javascript"),
          "/lyrics-review.js": ("musiclab/assets/lyrics-review.js", "text/javascript"),
          "/lyrics-export-review.js": ("musiclab/assets/lyrics-export-review.js", "text/javascript"),
          "/music-search.js": ("musiclab/assets/music-search.js", "text/javascript"),
          "/music-search-controller.js": ("web/music-search-controller.js", "text/javascript"),
          "/music-search-dom.js": ("web/music-search-dom.js", "text/javascript"),
          "/storyboard-search.js": ("musiclab/assets/storyboard-search.js", "text/javascript"),
          "/storyboard-search-controller.js": ("web/storyboard-search-controller.js", "text/javascript"),
          "/storyboard-search-dom.js": ("web/storyboard-search-dom.js", "text/javascript"),
          "/search-input.js": ("web/search-input.js", "text/javascript"),
          "/search-excerpt.js": ("web/search-excerpt.js", "text/javascript"),
          "/search-excerpt-dom.js": ("web/search-excerpt-dom.js", "text/javascript"),
          "/search-request.js": ("web/search-request.js", "text/javascript"),
          "/lyrics-search.js": ("musiclab/assets/lyrics-search.js", "text/javascript"),
          "/lyrics-search-controller.js": ("web/lyrics-search-controller.js", "text/javascript"),
          "/lyrics-search-dom.js": ("web/lyrics-search-dom.js", "text/javascript"),
          "/lyrics-export.js": ("web/lyrics-export.js", "text/javascript"),
          "/planning-report-input.js": ("web/planning-report-input.js", "text/javascript"),
          "/audio-acceptance-input.js": ("web/audio-acceptance-input.js", "text/javascript"),
          "/audio-acceptance-review.js": ("web/audio-acceptance-review.js", "text/javascript"),
          "/audio-acceptance-review-dom.js": ("web/audio-acceptance-review-dom.js", "text/javascript"),
          "/audio-acceptance.js": ("web/audio-acceptance.js", "text/javascript"),
          "/audio-acceptance-dom.js": ("web/audio-acceptance-dom.js", "text/javascript"),
          "/audio-review.js": ("web/audio-review.js", "text/javascript"),
          "/audio-statistics.js": ("web/audio-statistics.js", "text/javascript"),
          "/audio-result.js": ("web/audio-result.js", "text/javascript"),
          "/audio-report.js": ("web/audio-report.js", "text/javascript"),
          "/audio-file.js": ("web/audio-file.js", "text/javascript"),
          "/planning-review.js": ("web/planning-review.js", "text/javascript"),
          "/planning-source.js": ("web/planning-source.js", "text/javascript"),
          "/storyboard-timing.js": ("web/storyboard-timing.js", "text/javascript"),
          "/storyboard-duration.js": ("web/storyboard-duration.js", "text/javascript"),
          "/raw-fields.js": ("web/raw-fields.js", "text/javascript"),
          "/raw-fields-dom.js": ("web/raw-fields-dom.js", "text/javascript"),
          "/planning-values.js": ("web/planning-values.js", "text/javascript"),
          "/readiness-state.js": ("web/readiness-state.js", "text/javascript"),
          "/readiness-report.js": ("web/readiness-report.js", "text/javascript"),
          "/music-readiness.js": ("web/music-readiness.js", "text/javascript"),
          "/music-arrangement.js": ("web/music-arrangement.js", "text/javascript"),
          "/storyboard-readiness.js": ("web/storyboard-readiness.js", "text/javascript"),
          "/storyboard-frames.js": ("web/storyboard-frames.js", "text/javascript"),
          "/storyboard-seed.js": ("web/storyboard-seed.js", "text/javascript"),
          "/draft-undo.js": ("web/draft-undo.js", "text/javascript"),
          "/replacement-preview.js": ("web/replacement-preview.js", "text/javascript"),
          "/lyrics-seed.js": ("web/lyrics-seed.js", "text/javascript"),
          "/lyrics-result.js": ("web/lyrics-result.js", "text/javascript"),
          "/lyrics-import.js": ("web/lyrics-import.js", "text/javascript"),
          "/json-document.js": ("musiclab/assets/json-document.js", "text/javascript"),
          "/lyrics-package.js": ("musiclab/assets/lyrics-package.js", "text/javascript"),
          "/lyrics-lrc.js": ("musiclab/assets/lyrics-lrc.js", "text/javascript"),
          "/lyrics-srt.js": ("musiclab/assets/lyrics-srt.js", "text/javascript"),
          "/cue-stamp.js": ("web/cue-stamp.js", "text/javascript"),
          "/cue-stamp-edit.js": ("web/cue-stamp-edit.js", "text/javascript"),
          "/cue-stamp-edit-dom.js": ("web/cue-stamp-edit-dom.js", "text/javascript"),
          "/current-cue.js": ("web/current-cue.js", "text/javascript"),
          "/current-cue-dom.js": ("web/current-cue-dom.js", "text/javascript"),
          "/cue-position.js": ("web/cue-position.js", "text/javascript"),
          "/cue-position-dom.js": ("web/cue-position-dom.js", "text/javascript"),
          "/wave-position.js": ("web/wave-position.js", "text/javascript"),
          "/wave-position-dom.js": ("web/wave-position-dom.js", "text/javascript"),
          "/license": ("LICENSE", "text/plain"), "/notice": ("NOTICE", "text/plain")}


class WorkbenchHandler(BaseHTTPRequestHandler):
    def log_message(self, format, *args):
        pass  # Never log uploaded filenames or draft content.

    def reply(self, status, content, kind="application/json", filename=None):
        raw = content.encode("utf-8") if isinstance(content, str) else content
        self.send_response(status)
        self.send_header("Content-Type", kind + ("; charset=utf-8" if kind != "application/octet-stream" else ""))
        self.send_header("Content-Length", str(len(raw)))
        self.send_header("Cache-Control", "no-store")
        self.send_header("X-Content-Type-Options", "nosniff")
        self.send_header("Content-Security-Policy", "default-src 'self'; script-src 'self'; style-src 'self'; media-src 'self' blob:; connect-src 'self'; img-src 'self' data:; object-src 'none'; base-uri 'none'; frame-ancestors 'none'")
        if filename:
            self.send_header("Content-Disposition", f'attachment; filename="{filename}"')
        try:
            self.end_headers()
            self.wfile.write(raw)
        except ConnectionError:
            # Cancellation may disconnect during headers or body. Do not try
            # another reply on the same broken socket; other I/O errors remain.
            self.close_connection = True

    def allowed(self):
        port = self.server.server_port
        authority = self.headers.get("Host", "")
        if authority not in (f"127.0.0.1:{port}", f"localhost:{port}"):
            return False
        origin = self.headers.get("Origin")
        return not origin or origin == f"http://{authority}"

    def do_GET(self):
        if not self.allowed():
            return self.reply(403, '{"error":"僅接受本機來源"}')
        path = urllib.parse.urlsplit(self.path).path
        if path == "/favicon.ico":
            return self.reply(204, b"", "application/octet-stream")
        if path == '/delivery-versions-contract.js':
            from musiclab.delivery_versions import contract_script
            return self.reply(200,contract_script(),'text/javascript')
        if path == '/lyric-preview-contract.js':
            from musiclab.lyric_preview import contract_script
            return self.reply(200,contract_script(),'text/javascript')
        if path in ASSETS:
            file, kind = ASSETS[path]
            return self.reply(200, (ROOT / file).read_bytes(), kind)
        if path == "/api/capabilities":
            return self.reply(200, json_text(capabilities(getattr(self.server, 'draft_library', None))))
        if path == "/api/drafts/backup":
            try:
                raw, _ = export_library_backup(getattr(self.server, 'draft_library', None))
                return self.reply(200, raw, "application/octet-stream", "zoe-music-lab-backup.zip")
            except (ValueError, UnicodeError, RecursionError) as error:
                return self.reply(400, json_text({"error": str(error)}))
            except OSError:
                return self.reply(500, '{"error":"草稿庫備份未完成；原資料保留"}')
        if path.startswith('/api/drafts/backup/download/'):
            try:
                raw=backup_downloads(self.server).take(path.rsplit('/',1)[-1])
                return self.reply(200,raw,'application/octet-stream','zoe-music-lab-backup.zip')
            except (ValueError,OSError):
                return self.reply(400,'{"error":"下載未完成或已逾時，請重新建立備份"}')
        if path.startswith('/api/delivery-package/download/'):
            if urllib.parse.urlsplit(self.path).query or not re.fullmatch(r'/api/delivery-package/download/[0-9a-f]{32}',path):
                return self.reply(400,'{"error":"交付下載識別格式錯誤"}')
            try:
                raw=delivery_downloads(self.server).take(path.rsplit('/',1)[-1])
                return self.reply(200,raw,'application/octet-stream','zoe-delivery.zip')
            except (ValueError,OSError):
                return self.reply(400,'{"error":"交付下載未完成或逾時；請重新按下載所有檔案"}')
        if path == "/draft-contract.js":
            return self.reply(200, browser_contract(), "text/javascript")
        if path == "/api/examples":
            data = {"music": json.loads((ROOT / "examples/first-light-music.json").read_text(encoding="utf-8")),
                    "storyboard": json.loads((ROOT / "examples/first-light-mv.json").read_text(encoding="utf-8"))}
            return self.reply(200, json_text(data))
        return self.reply(404, '{"error":"找不到此頁面"}')

    def do_POST(self):
        if not self.allowed():
            return self.reply(403, '{"error":"僅接受本機來源"}')
        route = urllib.parse.urlsplit(self.path)
        audio = route.path == "/api/audio"
        backup = route.path in ("/api/drafts/backup/inspect", "/api/drafts/backup/restore")
        maximum = MAX_AUDIO if audio else MAX_BACKUP_BYTES if backup else MAX_DELIVERY_REQUEST if route.path == "/api/delivery-package/prepare" else MAX_DELIVERY_ARCHIVE if route.path == "/api/delivery-inspect" else MAX_TEXT
        try:
            size = int(self.headers.get("Content-Length", "0"))
            if not 0 < size <= maximum:
                return self.reply(413, json_text({"error": f"檔案／內容需介於 1 byte 與 {maximum // 1024 // 1024} MiB"}))
            self.connection.settimeout(30)
            raw = self.rfile.read(size)
            if len(raw) != size:
                raise ValueError("內容未完整傳入")
            if route.path == '/api/delivery-inspect':
                if route.query:raise ValueError('交付核對不接受query或來源路徑')
                return self.reply(200,json_text(inspect_delivery(io.BytesIO(raw),True,limit_files=False).wire()))
            if route.path in ('/api/delivery-package/prepare','/api/delivery-package/discard'):
                if route.query:raise ValueError('交付下載不接受 query 或路徑選擇')
                payload=decode_delivery(raw)
                if route.path.endswith('/discard'):
                    if not isinstance(payload,dict) or set(payload)!={'id'}:raise ValueError('取消只接受本輪下載識別')
                    return self.reply(200,json_text({'discarded':delivery_downloads(self.server).discard(payload['id'])}))
                if not isinstance(payload,dict) or 'include_archive' in payload:raise ValueError('工作台下載不使用 inline ZIP')
                prepared=prepare_delivery(payload)
                return self.reply(200,json_text(delivery_downloads(self.server).prepare(prepared.archive,prepared.summary())))
            if backup:
                query = urllib.parse.parse_qs(route.query, keep_blank_values=True)
                restoring = route.path.endswith('/restore')
                if (restoring and (set(query) != {'sha256'} or len(query['sha256']) != 1)) or (not restoring and query):
                    raise ValueError('備份來源由上傳選定，恢復只接受預覽的 sha256')
                with tempfile.TemporaryFile() as selected:
                    selected.write(raw); selected.seek(0)
                    result = build('draft_backup_restore' if restoring else 'draft_backup_inspect',
                        {'backup_sha256':query['sha256'][0]} if restoring else {},
                        draft_library=getattr(self.server,'draft_library',None), backup_source=selected)
                return self.reply(200,json_text(result.wire()))
            if route.path == "/api/export":
                fields = urllib.parse.parse_qs(raw.decode("utf-8"), keep_blank_values=True)
                name, content = fields.get("name", [""])[0], fields.get("content", [""])[0]
                if 'encoding' in fields:
                    if set(fields)!={'name','content','encoding'} or any(len(v)!=1 for v in fields.values()) or fields['encoding']!=['json-string']:
                        raise ValueError('匯出文字編碼欄位錯誤或重複')
                    content=load_request(content)
                    if not isinstance(content,str):raise ValueError('匯出內容需為JSON字串')
                if not re.fullmatch(r"[A-Za-z0-9][A-Za-z0-9_.-]{0,99}", name):
                    raise ValueError("匯出檔名格式錯誤")
                return self.reply(200, content, "application/octet-stream", name)
            if audio:
                query = urllib.parse.parse_qs(route.query, keep_blank_values=True)
                if set(query) - {'name', 'profile', 'acceptance_draft'} or any(len(values) != 1 for values in query.values()):
                    raise ValueError('音檔接受條件 query 欄位錯誤或重複')
                options = {'display_name': query.get('name', ['selected.wav'])[0]}
                if 'acceptance_draft' in query:
                    if 'profile' in query: raise ValueError('接受條件草稿不能與 profile 混用')
                    from musiclab.audio_acceptance import decode
                    options['acceptance_draft'] = decode(query['acceptance_draft'][0].encode('utf-8'))
                else:
                    options['profile'] = query.get('profile', ['distribution'])[0]
                # Only the explicitly selected bytes are analyzed; no arbitrary path parameter.
                with tempfile.TemporaryDirectory(prefix="zoe-audio-") as folder:
                    path = Path(folder) / "selected.wav"
                    path.write_bytes(raw)
                    result = build("audio", options,
                                   audio_source=path)
                return self.reply(200, json_text(result.wire()))
            data = load_request(raw.decode("utf-8"))
            if not isinstance(data, dict):
                raise ValueError("輸入需為物件")
            if route.path == '/api/drafts/backup/prepare':
                if set(data)-{'ids'} or route.query:raise ValueError('備份下載只接受保存 ID，不接受路徑或額外欄位')
                ids=selected_ids(data['ids']) if 'ids' in data else None
                archive,summary=export_library_backup(getattr(self.server,'draft_library',None),ids)
                return self.reply(200,json_text(backup_downloads(self.server).prepare(archive,summary)))
            operations = {"/api/music": "music", "/api/storyboard": "storyboard", "/api/lyrics": "lyrics",
                          "/api/draft-compare": "draft_compare", "/api/draft-compare-row": "draft_compare_row",
                          "/api/storyboard-seed": "storyboard_seed",
                          "/api/lyrics-seed": "lyrics_seed", "/api/lyrics-review": "lyrics_review", "/api/lyrics-cue-review": "lyrics_cue_review", "/api/lyrics-search": "lyrics_search", "/api/storyboard-search": "storyboard_search", "/api/music-search": "music_search", "/api/lyrics-export-review": "lyrics_export_review", "/api/audio-acceptance-review": "audio_acceptance_review", "/api/music-review": "music_review", "/api/music-section-review": "music_section_review", "/api/storyboard-review": "storyboard_review", "/api/storyboard-shot-review": "storyboard_shot_review", "/api/storyboard-timing-review": "storyboard_timing_review",
                          "/api/drafts/save": "draft_save", "/api/drafts/list": "draft_list", "/api/drafts/read": "draft_read",
                          "/api/drafts/search": "draft_search",
                          "/api/drafts/backup/export": "draft_backup_export"}
            if route.path not in operations:
                return self.reply(404, '{"error":"找不到此操作"}')
            return self.reply(200, json_text(build(operations[route.path], data,
                draft_library=getattr(self.server, 'draft_library', None)).wire()))
        except RecursionError:
            return self.reply(400, '{"error":"JSON 巢狀過深，請減少層數"}')
        except (ValueError, TypeError, KeyError, AttributeError, UnicodeError) as error:
            return self.reply(400, json_text({"error": str(error)}))
        except OSError:
            return self.reply(500, '{"error":"本機讀寫未完成，請重試"}')


def main():
    parser = argparse.ArgumentParser(description="ZOE. G Music Lab 本機工作台")
    parser.add_argument("--port", type=int, default=8875)
    parser.add_argument("--draft-library", help="明確選定本機草稿庫目錄；未指定時不提供保存操作")
    args = parser.parse_args()
    with WorkbenchServer(("127.0.0.1", args.port), WorkbenchHandler) as server:
        server.draft_library = DraftLibrary(args.draft_library) if args.draft_library else None
        print(f"ZOE. G Music Lab：http://127.0.0.1:{server.server_port} · Ctrl+C 停止", flush=True)
        try:
            server.serve_forever()
        except KeyboardInterrupt:
            pass


if __name__ == "__main__":
    import sys
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    main()
