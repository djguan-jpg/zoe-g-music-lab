"""Loopback-only workbench; stdlib, allowlisted assets, no user path access."""
import argparse
import json
import re
import tempfile
import urllib.parse
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from musiclab.common import json_text
from musiclab.design import music_plan_bundle, motif_bundle
from musiclab.lyrics import read_cues, lyrics_bundle
from musiclab.audio import analyze_wav, audio_bundle

ROOT = Path(__file__).resolve().parent
MAX_AUDIO = 64 * 1024 * 1024
MAX_TEXT = 2 * 1024 * 1024
ASSETS = {"/": ("web/index.html", "text/html"), "/app.js": ("web/app.js", "text/javascript"),
          "/style.css": ("web/style.css", "text/css")}


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
        self.end_headers()
        self.wfile.write(raw)

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
        if path in ASSETS:
            file, kind = ASSETS[path]
            return self.reply(200, (ROOT / file).read_bytes(), kind)
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
        maximum = MAX_AUDIO if audio else MAX_TEXT
        try:
            size = int(self.headers.get("Content-Length", "0"))
            if not 0 < size <= maximum:
                return self.reply(413, json_text({"error": f"檔案／內容需介於 1 byte 與 {maximum // 1024 // 1024} MiB"}))
            self.connection.settimeout(30)
            raw = self.rfile.read(size)
            if len(raw) != size:
                raise ValueError("內容未完整傳入")
            if route.path == "/api/export":
                fields = urllib.parse.parse_qs(raw.decode("utf-8"), keep_blank_values=True)
                name, content = fields.get("name", [""])[0], fields.get("content", [""])[0]
                if not re.fullmatch(r"[A-Za-z0-9][A-Za-z0-9_.-]{0,99}", name):
                    raise ValueError("匯出檔名格式錯誤")
                return self.reply(200, content, "application/octet-stream", name)
            if audio:
                query = urllib.parse.parse_qs(route.query)
                profile = query.get("profile", ["distribution"])[0]
                if profile not in ("distribution", "video"):
                    raise ValueError("未知接受條件")
                # Only the explicitly selected bytes are analyzed; no arbitrary path parameter.
                with tempfile.TemporaryDirectory(prefix="zoe-audio-") as folder:
                    path = Path(folder) / "selected.wav"
                    path.write_bytes(raw)
                    report = analyze_wav(path, profile)
                original_name = query.get("name", ["selected.wav"])[0].replace("\\", "/").rsplit("/", 1)[-1]
                report["file"] = original_name[:200] or "selected.wav"
                return self.reply(200, json_text({"files": audio_bundle(report), "data": report}))
            data = json.loads(raw.decode("utf-8"))
            if not isinstance(data, dict):
                raise ValueError("輸入需為物件")
            if route.path == "/api/music":
                files = music_plan_bundle(data)
                result = json.loads(files["music-plan.json"])
            elif route.path == "/api/storyboard":
                files = motif_bundle(data)
                result = json.loads(files["storyboard.json"])
            elif route.path == "/api/lyrics":
                cues = data.get("cues") if "cues" in data else read_cues(data.get("content", ""), data.get("suffix", ".lrc"))
                files = lyrics_bundle(cues, data.get("title", "歌詞"), data.get("duration"))
                result = json.loads(files["lyrics.json"])
            else:
                return self.reply(404, '{"error":"找不到此操作"}')
            return self.reply(200, json_text({"files": files, "data": result}))
        except (ValueError, TypeError, KeyError, AttributeError, UnicodeError) as error:
            return self.reply(400, json_text({"error": str(error)}))
        except OSError:
            return self.reply(500, '{"error":"本機讀寫未完成，請重試"}')


def main():
    parser = argparse.ArgumentParser(description="ZOE. G Music Lab 本機工作台")
    parser.add_argument("--port", type=int, default=8875)
    args = parser.parse_args()
    with ThreadingHTTPServer(("127.0.0.1", args.port), WorkbenchHandler) as server:
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
