import html
import json
import re
from .common import json_text, number

TIMESTAMP = re.compile(r"\[(\d+):(\d{2})(?:\.(\d{1,3}))?\]")


def validate_cues(cues, duration=None):
    if not isinstance(cues, list) or not cues:
        raise ValueError("沒有可匯出的逐句歌詞")
    cleaned = []
    for cue in cues:
        if not isinstance(cue, dict) or not isinstance(cue.get("text"), str):
            raise ValueError("每句歌詞需為含 start、text 的物件")
        start = number(cue.get("start"), "歌詞開始時間")
        start = round(start, 3)
        if start < 0:
            raise ValueError("歌詞不能有負時間")
        end = cue.get("end")
        if end is not None:
            end = round(number(end, "歌詞結束時間"), 3)
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
        duration = cleaned[-1]["end"] or cleaned[-1]["start"] + 3
    duration = round(number(duration, "歌曲時長"), 3)
    if duration <= cleaned[-1]["start"]:
        raise ValueError("歌曲時長必須晚於最後一句開始")
    for index, cue in enumerate(cleaned):
        cue["end"] = cue["end"] if cue["end"] is not None else (
            cleaned[index + 1]["start"] if index + 1 < len(cleaned) else duration)
        if cue["end"] > duration:
            raise ValueError("歌詞結束超過歌曲時長")
    return cleaned, duration, inferred


def parse_lrc(content):
    cues = []
    offsets = re.findall(r"\[offset:([+-]?\d+)\]", content, re.I)
    offset = int(offsets[-1]) / 1000 if offsets else 0
    for line in content.splitlines():
        matches = list(TIMESTAMP.finditer(line))
        if not matches:
            if re.match(r"^\[\d+:", line):
                raise ValueError("LRC 含無法解析的時間標籤")
            continue
        # Metadata-like content after the timing tags is still actual lyric text.
        lyric = line[matches[-1].end():].strip()
        for match in matches:
            minutes, seconds, fractional = match.groups()
            if int(seconds) >= 60:
                raise ValueError("LRC 秒數需小於 60")
            start = int(minutes) * 60 + int(seconds) + int((fractional or "0").ljust(3, "0")) / 1000 + offset
            cues.append({"start": start, "text": lyric})
    return cues


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
        data = json.loads(content)
        return data.get("cues") if isinstance(data, dict) else data
    raise ValueError("歌詞僅支援 .lrc、.srt、.json")


def edits(cues, shift=0, time_changes=(), text_changes=()):
    # Index editing uses sorted original lines and avoids modifying caller input.
    shift = number(shift, "shift")
    output = [dict(cue) for cue in sorted(cues, key=lambda c: number(c.get("start"), "start"))]
    for cue in output:
        cue["start"] = number(cue.get("start"), "start") + shift
        if cue.get("end") is not None:
            cue["end"] = number(cue["end"], "end") + shift
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
                value = number(value, "新開始時間")
                # Preserve source cue length when changing an explicit SRT start.
                if output[index].get("end") is not None:
                    output[index]["end"] += value - output[index]["start"]
            output[index][key] = value
    return output


def timecode(seconds, srt=False):
    total = round(seconds * 1000)
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


def lyrics_bundle(cues, title="歌詞", duration=None):
    cues, duration, inferred = validate_cues(cues, duration)
    data = {"title": title, "duration": duration, "duration_estimated": inferred, "cues": cues}
    encoded = json.dumps(data, ensure_ascii=False).replace("<", "\\u003c").replace("\u2028", "\\u2028").replace("\u2029", "\\u2029")
    preview = PREVIEW.replace("__TITLE__", html.escape(title)).replace("__DATA__", encoded)
    return {"lyrics.json": json_text(data), "lyrics.lrc": lrc_text(cues), "lyrics.srt": srt_text(cues), "preview.html": preview}


PREVIEW = r'''<!doctype html>
<html lang="zh-Hant"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>__TITLE__ · ZOE Lyrics Sync</title><style>
:root{font-family:system-ui,"Microsoft JhengHei",sans-serif;color:#192d39;background:#f5f7fa;line-height:1.6}*{box-sizing:border-box}
body{margin:0}main{max-width:1100px;margin:auto;padding:40px 24px}header{display:flex;justify-content:space-between;gap:24px;align-items:start}
h1{font-size:32px;line-height:1.3;margin:0 0 12px}p{margin:0 0 20px;color:#526571}button,input{font:inherit}
button{padding:8px 14px;border:1px solid #c2cfd9;background:white;color:#223d4d;border-radius:6px;cursor:pointer}button:hover{background:#e9f1f5}
button.primary{background:#176d83;color:white;border-color:#176d83}button:focus-visible,input:focus-visible{outline:3px solid #d2993b;outline-offset:2px}
.player{margin:24px 0;padding:24px;background:#fff;border-top:3px solid #176d83}audio{width:100%;margin-top:16px}.line{font-size:26px;font-weight:600;min-height:48px;margin:18px 0 0}
.tools{display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin:20px 0}.table-wrap{overflow:auto}table{border-collapse:collapse;width:100%;background:white}
th,td{text-align:left;padding:12px;border-bottom:1px solid #e3e9ef}th{background:#eaf0f4;font-weight:600}input[type=number]{width:90px}input[type=text]{width:100%;min-width:190px}
input{padding:7px 8px;border:1px solid #b6c7d2;border-radius:4px}tr.active{background:#e1f4ed}.row-actions{display:flex;gap:6px;white-space:nowrap}
#status{min-height:28px;color:#176d83}#status.error{color:#a83132}footer{color:#526571;margin-top:24px;font-size:14px}
@media(max-width:600px){main{padding:24px 14px}header{display:block}h1{font-size:25px}.player{padding:16px}.line{font-size:22px}th,td{padding:8px}}
</style></head><body><main><header><div><h1>__TITLE__</h1><p>選擇音檔，逐句調整時間，匯出同步歌詞。</p></div><span>ZOE Lyrics Sync</span></header>
<section class="player" aria-label="音檔與播放預覽"><label for="audio-file">選擇本機音檔</label> <input id="audio-file" type="file" accept="audio/*">
<audio id="player" controls hidden></audio><div id="current-line" class="line" aria-live="off">準備播放</div></section>
<div class="tools"><button id="add">新增一句</button><button id="apply" class="primary">套用編修</button><button id="lrc">下載 LRC</button><button id="srt">下載 SRT</button><button id="json">下載 JSON</button></div>
<p id="status" role="status">尚未選擇音檔。時間單位為秒；編修後請套用。</p>
<div class="table-wrap"><table aria-label="逐句歌詞"><thead><tr><th>句</th><th>開始</th><th>結束</th><th>歌詞</th><th>操作</th></tr></thead><tbody id="rows"></tbody></table></div>
<footer>ZOE. G · 音檔由瀏覽器在本機讀取。未提供實際歌曲時長時，最後一句結束為估計。</footer></main>
<script id="initial" type="application/json">__DATA__</script><script>
'use strict';
let data=JSON.parse(document.getElementById('initial').textContent), url=null;
const rows=document.getElementById('rows'), player=document.getElementById('player'), status=document.getElementById('status');
function message(text,error=false){status.textContent=text;status.className=error?'error':'';}
function input(value,type,label){const x=document.createElement('input');x.type=type;x.value=value;x.setAttribute('aria-label',label);if(type==='number'){x.min='0';x.step='0.001';}return x;}
function render(cues){rows.replaceChildren();cues.forEach((c,i)=>{const tr=document.createElement('tr'), n=document.createElement('td');n.textContent=i+1;tr.append(n);
 ['start','end','text'].forEach((key,j)=>{const td=document.createElement('td');td.append(input(c[key],key==='text'?'text':'number',`第 ${i+1} 句${['開始','結束','歌詞'][j]}`));tr.append(td);});
 const actions=document.createElement('td'), wrap=document.createElement('div');wrap.className='row-actions';
 const stamp=document.createElement('button');stamp.textContent='使用播放位置';stamp.onclick=()=>{const fields=tr.querySelectorAll('input');const old=Number(fields[0].value), end=Number(fields[1].value);fields[0].value=player.currentTime.toFixed(3);fields[1].value=(player.currentTime+Math.max(.001,end-old)).toFixed(3);message('已填入播放位置，請套用編修。');};
 const remove=document.createElement('button');remove.textContent='刪除';remove.onclick=()=>{tr.remove();message('已移除此句，請套用編修。');};wrap.append(stamp,remove);actions.append(wrap);tr.append(actions);rows.append(tr);});}
function collect(){const result=[...rows.children].map(tr=>{const x=tr.querySelectorAll('input');if(!x[0].value.trim()||!x[1].value.trim())throw Error('開始與結束時間不可空白');return {start:Number(x[0].value),end:Number(x[1].value),text:x[2].value};});
 if(!result.length)throw Error('至少保留一句歌詞');result.sort((a,b)=>a.start-b.start);
 result.forEach((c,i)=>{if(!Number.isFinite(c.start)||!Number.isFinite(c.end)||c.start<0||c.end<=c.start)throw Error('開始需非負，結束需晚於開始');if(/[\r\n]/.test(c.text))throw Error('每句歌詞只接受一行');if(i&&c.start<result[i-1].end)throw Error('逐句時間不可重疊');if(Number.isFinite(player.duration)&&c.end>player.duration+.001)throw Error('歌詞結束超過音檔時長');});return result;}
function apply(){data.cues=collect();if(Number.isFinite(player.duration)){data.duration=player.duration;data.duration_estimated=false;}else{data.duration=Math.max(data.duration,data.cues.at(-1).end);}
 render(data.cues);tick();message(`已套用 ${data.cues.length} 句，可下載匯出。`);}
function tick(){let current=-1;data.cues.forEach((c,i)=>{if(player.currentTime>=c.start&&player.currentTime<c.end)current=i;});document.getElementById('current-line').textContent=current>=0?data.cues[current].text:'…';[...rows.children].forEach((tr,i)=>tr.classList.toggle('active',i===current));}
function tc(s,srt){let ms=Math.round(s*1000),m=Math.floor(ms/60000),sec=Math.floor(ms%60000/1000),fraction=ms%1000;const pad=(n,d=2)=>String(n).padStart(d,'0');return srt?`${pad(Math.floor(m/60))}:${pad(m%60)}:${pad(sec)},${pad(fraction,3)}`:`${pad(m)}:${pad(sec)}.${pad(fraction,3)}`;}
function download(ext){try{apply();let content;if(ext==='lrc')content=data.cues.map(c=>`[${tc(c.start,false)}]${c.text}`).join('\n')+'\n';else if(ext==='srt')content=data.cues.map((c,i)=>`${i+1}\n${tc(c.start,true)} --> ${tc(c.end,true)}\n${c.text}`).join('\n\n')+'\n';else content=JSON.stringify(data,null,2);
 const link=document.createElement('a'), blob=URL.createObjectURL(new Blob([content],{type:'text/plain;charset=utf-8'}));link.href=blob;link.download=(data.title.replace(/[\\/:*?"<>|]/g,'-')||'lyrics')+'.'+ext;document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(blob),1000);message(`已匯出 ${ext.toUpperCase()}。`);}catch(e){message(e.message,true);}}
document.getElementById('audio-file').onchange=e=>{const file=e.target.files[0];if(!file)return;if(url)URL.revokeObjectURL(url);url=URL.createObjectURL(file);player.src=url;player.hidden=false;message('已選擇 '+file.name+'；檔案在本機讀取。');};
document.getElementById('apply').onclick=()=>{try{apply();}catch(e){message(e.message,true);}};
document.getElementById('add').onclick=()=>{try{const cues=collect(), start=cues.at(-1).end;cues.push({start,end:start+3,text:''});render(cues);message('已新增一句，請編修後套用。');}catch(e){message(e.message,true);}};
['lrc','srt','json'].forEach(ext=>document.getElementById(ext).onclick=()=>download(ext));player.ontimeupdate=tick;player.onseeked=tick;player.onerror=()=>message('瀏覽器無法播放此音檔，請選擇支援的音訊格式。',true);
render(data.cues);
</script></body></html>'''
