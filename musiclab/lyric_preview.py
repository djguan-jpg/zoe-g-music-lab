# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
"""Standalone lyric editor presentation; embed the same native timing module as the workbench."""
import html
import json
import re
from pathlib import Path


def render_preview(data, title):
    encoded = json.dumps(data, ensure_ascii=False).replace('<', '\\u003c').replace('\u2028', '\\u2028').replace('\u2029', '\\u2029')
    timing = (Path(__file__).parent / 'assets/lyric-time.js').read_text(encoding='utf-8')
    document = (Path(__file__).parent / 'assets/json-document.js').read_text(encoding='utf-8')
    package = (Path(__file__).parent / 'assets/lyrics-package.js').read_text(encoding='utf-8')
    parts = {'TITLE': html.escape(title), 'DATA': encoded, 'TIMING_JS': timing, 'PACKAGE_JS': document + '\n' + package}
    # Substitute template markers once; user text containing a marker stays text.
    return re.sub(r'__(TITLE|DATA|TIMING_JS|PACKAGE_JS)__', lambda match: parts[match[1]], PREVIEW)


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
<footer>ZOE. G · 音檔由瀏覽器在本機讀取。<span id="timing-note"></span></footer></main>
<script>__TIMING_JS__</script>
<script>__PACKAGE_JS__</script>
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
function collect(){return [...rows.children].map(tr=>{const x=tr.querySelectorAll('input');if(!x[0].value.trim()||!x[1].value.trim())throw Error('開始與結束時間不可空白');return {start:x[0].value,end:x[1].value,text:x[2].value};});}
function apply(){const duration=Number.isFinite(player.duration)?player.duration:undefined;
 data=MusicLyricsPackage.revise(data,collect(),duration);render(data.cues);tick();
 document.getElementById('timing-note').textContent=MusicLyricsPackage.notice(data);message(`已套用 ${data.cues.length} 句，可下載匯出。`);}
function tick(){let current=-1;data.cues.forEach((c,i)=>{if(player.currentTime>=c.start&&player.currentTime<c.end)current=i;});document.getElementById('current-line').textContent=current>=0?data.cues[current].text:'…';[...rows.children].forEach((tr,i)=>tr.classList.toggle('active',i===current));}
function tc(s,srt){return LyricTime.timecode(s,srt);}
function download(ext){try{apply();let content;if(ext==='lrc')content=data.cues.map(c=>`[${tc(c.start,false)}]${c.text}`).join('\n')+'\n';else if(ext==='srt')content=data.cues.map((c,i)=>`${i+1}\n${tc(c.start,true)} --> ${tc(c.end,true)}\n${c.text}`).join('\n\n')+'\n';else content=JSON.stringify(data,null,2);
 const link=document.createElement('a'), blob=URL.createObjectURL(new Blob([content],{type:'text/plain;charset=utf-8'}));link.href=blob;link.download=(data.title.replace(/[\\/:*?"<>|]/g,'-')||'lyrics')+'.'+ext;document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(blob),1000);message(`已匯出 ${ext.toUpperCase()}。`);}catch(e){message(e.message,true);}}
document.getElementById('audio-file').onchange=e=>{const file=e.target.files[0];if(!file)return;if(url)URL.revokeObjectURL(url);url=URL.createObjectURL(file);player.src=url;player.hidden=false;message('已選擇 '+file.name+'；檔案在本機讀取。');};
document.getElementById('apply').onclick=()=>{try{apply();}catch(e){message(e.message,true);}};
document.getElementById('add').onclick=()=>{try{const cues=LyricTime.normalizeCues(collect()).cues, start=cues.at(-1).end;cues.push({start,end:start+3,text:''});render(cues);message('已新增一句，請編修後套用。');}catch(e){message(e.message,true);}};
['lrc','srt','json'].forEach(ext=>document.getElementById(ext).onclick=()=>download(ext));player.ontimeupdate=tick;player.onseeked=tick;player.onerror=()=>message('瀏覽器無法播放此音檔，請選擇支援的音訊格式。',true);
render(data.cues);document.getElementById('timing-note').textContent=MusicLyricsPackage.notice(data);
</script></body></html>'''
