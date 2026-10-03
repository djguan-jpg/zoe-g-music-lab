// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
const $ = id => document.getElementById(id);
const state = {tab:'music', examples:null, files:{}, bundles:{}, revisions:{}, music:[], shots:[], cues:[], audioUrl:null, audioContext:null, waveform:null, busy:false, undoDraft:null};
const waveTask = MusicEditor.createLatestTask();
function say(message,error=false){$('status').textContent=message;$('status').className=error?'error':'';}
function esc(value){return String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function field(value,label,type='text',wide=false){return `<input type="${type}" value="${esc(value)}" aria-label="${esc(label)}" class="${wide?'wide':''}" ${type==='number'?'step="0.001"':''}>`;}
async function api(route,data,binary=false){const response=await fetch(route,{method:'POST',headers:{'Content-Type':binary?'application/octet-stream':'application/json'},body:binary?data:JSON.stringify(data)});const result=await response.json();if(!response.ok)throw Error(result.error||'操作未完成');return result;}
async function run(button,task){if(state.busy)return;const tab=state.tab,revision=state.revisions[tab]||0;say('處理中，請稍候');state.busy=true;button.disabled=true;try{await task();if((state.revisions[tab]||0)!==revision){markDirty(tab);say('處理期間輸入有修改，請重新建立成果');}}catch(error){say(error.message,true);}finally{state.busy=false;button.disabled=false;}}
function setFiles(files,note,dirty=false){state.files=files;state.bundles[state.tab]={files,note,dirty};const select=$('output-file');select.replaceChildren();Object.keys(files).forEach(name=>{const option=document.createElement('option');option.value=name;option.textContent=name;select.append(option);});select.disabled=false;$('download').disabled=dirty;$('output-note').textContent=note+(dirty?'（有修改尚未重新驗證）':'');previewOutput();}
function markDirty(tab){state.revisions[tab]=(state.revisions[tab]||0)+1;const saved=state.bundles[tab];if(!saved)return;saved.dirty=true;if(state.tab===tab){$('download').disabled=true;$('output-note').textContent=saved.note+'（有修改尚未重新驗證）';}}
document.querySelector('.editor').addEventListener('input',event=>{const panel=event.target.closest('.panel');if(panel){markDirty(panel.id);if(panel.id==='lyrics'&&event.target.closest('#cues'))tick();}});
function clearOutput(){state.files={};$('output-file').replaceChildren(new Option('尚無檔案',''));$('output-file').disabled=true;$('download').disabled=true;$('output-content').value='';$('output-note').textContent='建立工作包後，實際成果會出現在這裡。';}
function previewOutput(){const name=$('output-file').value;$('output-content').value=state.files[name]??'';$('export-name').value=name;$('export-content').value=state.files[name]??'';}
$('output-file').onchange=previewOutput;
$('export-form').onsubmit=()=>{say('已送出本機下載，請確認瀏覽器保存的檔案。');};
document.querySelectorAll('[data-tab]').forEach(button=>button.onclick=()=>{if(state.busy){say('目前操作尚未完成，請稍候');return;}state.tab=button.dataset.tab;document.querySelectorAll('.panel').forEach(section=>section.hidden=section.id!==state.tab);document.querySelectorAll('[data-tab]').forEach(b=>{b.classList.toggle('active',b===button);if(b===button)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current');});const saved=state.bundles[state.tab];if(saved)setFiles(saved.files,saved.note,saved.dirty);else clearOutput();say(saved?.dirty?'有修改尚未重新驗證，請重新建立成果':'準備開始');});
function getMusicSections(){return [...$('arrangement').children].map(row=>{const x=row.querySelectorAll('input');if(!x[1].value.trim()||!x[2].value.trim())throw Error('小節與能量不可空白');return {name:x[0].value,bars:Number(x[1].value),energy:Number(x[2].value),focus:x[3].value,texture:x[4].value};});}
function renderSections(sections){$('arrangement').innerHTML=sections.map((s,i)=>`<tr><td>${field(s.name,`段落 ${i+1} 名稱`)}</td><td>${field(s.bars,`段落 ${i+1} 小節`,'number')}</td><td>${field(s.energy,`段落 ${i+1} 能量`,'number')}</td><td>${field(s.focus,`段落 ${i+1} 任務`,'text',true)}</td><td>${field(s.texture,`段落 ${i+1} 聲音`,'text',true)}</td><td><button type="button" data-remove-section="${i}" aria-label="刪除段落 ${i+1}">刪除</button></td></tr>`).join('');$('arrangement').querySelectorAll('[data-remove-section]').forEach(b=>b.onclick=()=>{b.closest('tr').remove();markDirty('music');say('已刪除段落；重新建立設計包以更新時間');});}
function loadMusic(){const b=structuredClone(state.examples.music);[['music-title',b.title],['music-hook',b.memory_hook],['music-theme',b.theme],['music-style',b.style],['music-vocal',b.vocal],['music-audience',b.audience],['music-bpm',b.bpm],['music-beats',b.beats_per_bar],['music-lyrics',b.existing_lyrics]].forEach(([id,value])=>$(id).value=value);renderSections(b.arrangement);$('music-visual').hidden=true;}
$('music-example').onclick=()=>{loadMusic();markDirty('music');say('已載入本次原創合成範例，可直接修改');};
$('section-add').onclick=()=>{try{const sections=getMusicSections();sections.push({name:'新段落',bars:8,energy:3,focus:'',texture:''});renderSections(sections);markDirty('music');}catch(e){say(e.message,true);}};
$('music-form').onsubmit=event=>{event.preventDefault();run(event.submitter,async()=>{const brief={title:$('music-title').value,memory_hook:$('music-hook').value,theme:$('music-theme').value,style:$('music-style').value,vocal:$('music-vocal').value,audience:$('music-audience').value,bpm:$('music-bpm').value,beats_per_bar:$('music-beats').value,existing_lyrics:$('music-lyrics').value,language:'繁體中文',arrangement:getMusicSections(),avoid:['用空泛口號取代動作'],deliverables:['完整歌詞','兩種副歌方案','分段編曲指令','實唱待驗證清單']};const result=await api('/api/music',brief);setFiles(result.files,`歌曲設計 · ${result.data.duration_seconds} 秒 · ${result.data.sections.length} 段`);const box=$('music-visual');box.replaceChildren();const title=document.createElement('h3');title.textContent='段落能量曲線';box.append(title);result.data.sections.forEach(s=>{const row=document.createElement('div');row.className='timeline-item';const name=document.createElement('span');name.textContent=s.section;const track=document.createElement('div');track.className='energy-track';const fill=document.createElement('div');fill.className='energy-fill';fill.style.width=`${s.energy*20}%`;track.append(fill);const time=document.createElement('span');time.className='timeline-time';time.textContent=`${s.start}–${s.end}s`;row.append(name,track,time);box.append(row);});appendNotes(box,result.data.review_notes);box.hidden=false;say('歌曲設計包已建立；可檢視與下載 4 個檔案');});};
function appendNotes(box,notes){const ul=document.createElement('ul');ul.className='review-list';notes.forEach(note=>{const li=document.createElement('li');li.textContent=typeof note==='string'?note:`${note.shot?'鏡頭 '+note.shot+'：':''}${note.message}`;ul.append(li);});box.append(ul);}
const shotFields=[['section','歌曲段落'],['purpose','敘事用途'],['visual','畫面動作'],['camera','鏡頭運動'],['transition','尾鏡與轉場'],['motif_state','母題狀態'],['character_state','人物狀態'],['change_reason','變化理由']];
function getMotifs(){return [...$('motifs').children].map(row=>({id:row.dataset.motifId,name:row.querySelector('[data-motif="name"]').value,meaning:row.querySelector('[data-motif="meaning"]').value}));}
function rawShots(){return [...$('shots').children].map(article=>Object.fromEntries([...article.querySelectorAll('[data-key]')].map(input=>[input.dataset.key,input.value])));}
function motifOptions(motifs,selected){return '<option value="">請選擇母題</option>'+motifs.map((m,i)=>`<option value="${esc(m.id)}" ${m.id===selected?'selected':''}>${esc(m.name||'未命名母題 '+(i+1))}</option>`).join('');}
function refreshMotifChoices(){const motifs=getMotifs();$('shots').querySelectorAll('[data-key="motif_id"]').forEach(select=>{const selected=select.value;select.innerHTML=motifOptions(motifs,selected);});}
function renderMotifs(motifs){
  $('motifs').innerHTML=motifs.map((m,i)=>`<article class="motif" data-motif-id="${esc(m.id)}"><div class="shot-header"><h3>母題 ${i+1}</h3><button class="subtle" data-remove-motif="${esc(m.id)}" aria-label="刪除母題 ${i+1}">刪除</button></div><div class="fields"><label>母題名稱<input data-motif="name" aria-label="母題 ${i+1} 名稱" value="${esc(m.name)}"></label><label>初始意義<input data-motif="meaning" aria-label="母題 ${i+1} 初始意義" value="${esc(m.meaning)}"></label></div></article>`).join('');
  $('motifs').querySelectorAll('[data-remove-motif]').forEach(button=>button.onclick=()=>{
    const id=button.dataset.removeMotif,used=rawShots().flatMap((s,i)=>s.motif_id===id?[i+1]:[]);
    if(used.length){say(`母題仍用於鏡頭 ${used.join('、')}，請先替這些鏡頭選擇其他母題`,true);return;}
    renderMotifs(getMotifs().filter(m=>m.id!==id));refreshMotifChoices();markDirty('storyboard');say('已刪除未使用的母題');
  });
}
$('motifs').addEventListener('input',refreshMotifChoices);
$('motif-add').onclick=()=>{const motifs=getMotifs();if(motifs.length>=30){say('最多可規劃 30 個母題',true);return;}motifs.push({id:MusicEditor.nextMotifId(motifs),name:'',meaning:''});renderMotifs(motifs);refreshMotifChoices();markDirty('storyboard');$('motifs').lastElementChild.querySelector('input').focus();say('已新增母題，填入意義後可在鏡頭中選擇');};
function renderShots(shots){
  const motifs=getMotifs();
  $('shots').innerHTML=shots.map((s,i)=>`<article class="shot"><div class="shot-header"><h3>鏡頭 ${i+1}</h3><button class="subtle" data-remove-shot="${i}" aria-label="刪除鏡頭 ${i+1}">刪除</button></div><div class="fields">${['start','end'].map((key,j)=>`<label>${j?'結束':'開始'}（秒）<input data-key="${key}" type="number" min="0" step="0.001" value="${esc(s[key])}" aria-label="鏡頭 ${i+1} ${j?'結束':'開始'}"></label>`).join('')}</div><label>使用母題<select data-key="motif_id" aria-label="鏡頭 ${i+1} 使用母題">${motifOptions(motifs,s.motif_id)}</select></label>${shotFields.map(([key,label])=>`<label>${label}<textarea data-key="${key}" rows="2" aria-label="鏡頭 ${i+1} ${label}">${esc(s[key])}</textarea></label>`).join('')}<label>畫面方向<select data-key="screen_direction" aria-label="鏡頭 ${i+1} 畫面方向">${[['left','向左'],['right','向右'],['neutral','正面／中性']].map(([value,label])=>`<option value="${value}" ${value===s.screen_direction?'selected':''}>${label}</option>`).join('')}</select></label></article>`).join('');
  $('shots').querySelectorAll('[data-remove-shot]').forEach(button=>button.onclick=()=>{
    const shots=rawShots();shots.splice(Number(button.dataset.removeShot),1);
    const compact=MusicEditor.compactShotTimes(shots);
    if(compact)$('mv-duration').value=compact.length?compact.at(-1).end:'0';
    renderShots(compact||shots);markDirty('storyboard');
    say(compact?'已刪除鏡頭，後續時間已接續':'已刪除鏡頭；其他鏡頭時間尚未填完，請修正後重新檢查');
  });
}
function getShots(){
  const motifs=new Map(getMotifs().map(m=>[m.id,m.name]));
  return rawShots().map((s,i)=>{if(!s.start.trim()||!s.end.trim())throw Error(`鏡頭 ${i+1} 時間不可空白`);if(!s.motif_id||!motifs.has(s.motif_id))throw Error(`鏡頭 ${i+1} 請先選擇母題`);const {motif_id,...shot}=s;return {...shot,start:Number(s.start),end:Number(s.end),motif:motifs.get(motif_id)};});
}
function loadMv(){
  const brief=structuredClone(state.examples.storyboard);
  [['mv-title',brief.title],['mv-duration',brief.duration_seconds],['mv-fps',brief.fps],['mv-ratio',brief.aspect_ratio],['mv-style',brief.visual_style],['mv-anchor',brief.character_anchor]].forEach(([id,value])=>$(id).value=value);
  const motifs=brief.motifs.map((m,i)=>({...m,id:`motif-${i+1}`}));renderMotifs(motifs);
  renderShots(brief.shots.map(s=>({...s,motif_id:motifs.find(m=>m.name===s.motif)?.id||''})));$('mv-visual').hidden=true;
}
$('mv-example').onclick=()=>{loadMv();markDirty('storyboard');say('已載入本次原創合成分鏡');};
$('shot-add').onclick=()=>{const shots=rawShots(),last=shots.at(-1),start=last?.end?.trim()?Number(last.end):0;if(!Number.isFinite(start)){say('最後一鏡結束時間需為數字',true);return;}shots.push({start:String(start),end:String(start+6),section:'',purpose:'',visual:'',camera:'',transition:'',motif_id:'',motif_state:'',character_state:last?.character_state||'',change_reason:'',screen_direction:'neutral'});$('mv-duration').value=start+6;renderShots(shots);markDirty('storyboard');say('已新增鏡頭，請選擇母題並填入動作與敘事任務');};
$('mv-build').onclick=()=>run($('mv-build'),async()=>{
  const brief={title:$('mv-title').value,duration_seconds:$('mv-duration').value,fps:$('mv-fps').value,aspect_ratio:$('mv-ratio').value,visual_style:$('mv-style').value,character_anchor:$('mv-anchor').value,motifs:getMotifs().map(({name,meaning})=>({name,meaning})),shots:getShots()};
  const result=await api('/api/storyboard',brief);setFiles(result.files,`母題分鏡 · ${result.data.shots.length} 鏡 · ${result.data.duration_seconds} 秒`);
  const box=$('mv-visual');box.replaceChildren();const heading=document.createElement('h3');heading.textContent='母題的變化';box.append(heading);
  appendNotes(box,result.data.continuity.map(s=>`鏡頭 ${s.shot} · ${s.motif} · ${s.motif_state}`));appendNotes(box,result.data.review_notes);box.hidden=false;
  say(result.data.review_notes.length?`分鏡包已建立；有 ${result.data.review_notes.length} 個待審查項目`:'分鏡包已建立；時間與資料連戲檢查通過');
});
function cueValues(){return [...$('cues').children].map(row=>{const x=row.querySelectorAll('input');if(!x[0].value.trim()||!x[1].value.trim())throw Error('歌詞開始與結束不可空白');return {start:Number(x[0].value),end:Number(x[1].value),text:x[2].value};});}
function renderCues(cues){state.cues=cues;$('cues').innerHTML=cues.map((c,i)=>`<tr><td>${i+1}</td><td>${field(c.start,`歌詞 ${i+1} 開始`,'number')}</td><td>${field(c.end,`歌詞 ${i+1} 結束`,'number')}</td><td><input class="lyric-field" value="${esc(c.text)}" aria-label="歌詞 ${i+1} 文字"></td><td><div class="actions"><button data-stamp="${i}" aria-label="填入第 ${i+1} 句播放位置">記下時間</button><button data-delete-cue="${i}" aria-label="刪除第 ${i+1} 句">刪除</button></div></td></tr>`).join('');$('cues').querySelectorAll('[data-stamp]').forEach(b=>b.onclick=()=>{if(!$('lyrics-player').src){say('先載入音檔，再記下播放位置',true);return;}const row=b.closest('tr'),x=row.querySelectorAll('input');if(!x[0].value.trim()||!x[1].value.trim()){say('先填入有效的開始與結束時間',true);return;}const length=Math.max(.001,Number(x[1].value)-Number(x[0].value));x[0].value=$('lyrics-player').currentTime.toFixed(3);x[1].value=(Number(x[0].value)+length).toFixed(3);markDirty('lyrics');tick();say('已填入播放位置；驗證後才更新成果');});$('cues').querySelectorAll('[data-delete-cue]').forEach(b=>b.onclick=()=>{b.closest('tr').remove();markDirty('lyrics');tick();say('已刪除此句；請重新驗證');});}
$('lyrics-file').onchange=async event=>{try{const file=event.target.files[0];if(!file)return;if(file.size>2*1024*1024)throw Error('歌詞檔需小於 2 MiB');const suffix='.'+file.name.split('.').at(-1).toLowerCase();if(!['.lrc','.srt','.json'].includes(suffix))throw Error('請選擇 LRC／SRT／JSON');$('lyrics-format').value=suffix;$('lyrics-source').value=await file.text();say('已讀入原文，按「讀取歌詞」建立逐句表格');}catch(e){say(e.message,true);}};
function lyricDuration(){const value=$('lyrics-duration').value;return value.trim()?Number(value):null;}
$('lyrics-import').onclick=()=>run($('lyrics-import'),async()=>{const result=await api('/api/lyrics',{title:$('lyrics-title').value,content:$('lyrics-source').value,suffix:$('lyrics-format').value,duration:lyricDuration()});renderCues(result.data.cues);setFiles(result.files,`歌詞匯入 · ${result.data.cues.length} 句`);say(result.data.duration_estimated?'歌詞已讀取；尾句時間為估計，請載入音檔校正':'歌詞已讀取，可逐句校正');tick();});
$('cue-add').onclick=()=>{try{const cues=cueValues(),start=cues.length?cues.at(-1).end:0;cues.push({start,end:start+3,text:''});renderCues(cues);markDirty('lyrics');}catch(e){say(e.message,true);}};
$('lyrics-build').onclick=()=>run($('lyrics-build'),async()=>{const result=await api('/api/lyrics',{title:$('lyrics-title').value,cues:cueValues(),duration:lyricDuration()});renderCues(result.data.cues);setFiles(result.files,`已驗證歌詞 · ${result.data.cues.length} 句`);say('歌詞時間驗證通過，LRC／SRT／JSON 已建立');tick();});
function drawWave(){const canvas=$('waveform'),ctx=canvas.getContext('2d'),w=canvas.width,h=canvas.height;ctx.clearRect(0,0,w,h);ctx.fillStyle='#e7ecdf';ctx.fillRect(0,0,w,h);ctx.strokeStyle='#b5c4ad';ctx.beginPath();ctx.moveTo(0,h/2);ctx.lineTo(w,h/2);ctx.stroke();if(state.waveform){ctx.strokeStyle='#4b745d';ctx.lineWidth=1;state.waveform.forEach((amplitude,i)=>{const x=(i+.5)*w/state.waveform.length;ctx.beginPath();ctx.moveTo(x,h/2-amplitude*52);ctx.lineTo(x,h/2+amplitude*52);ctx.stroke();});}const player=$('lyrics-player');if(Number.isFinite(player.duration)){const x=player.currentTime/player.duration*w;ctx.strokeStyle='#c94b29';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,h);ctx.stroke();canvas.setAttribute('aria-valuemax',player.duration.toFixed(3));canvas.setAttribute('aria-valuenow',player.currentTime.toFixed(3));}}
function tick(){
  let cues=[];
  try{cues=cueValues();}catch(_){/* Incomplete edits have no playable cue. */}
  const active=MusicEditor.activeCueIndex(cues,$('lyrics-player').currentTime);
  $('current-lyric').textContent=active>=0?cues[active].text:'…';
  [...$('cues').children].forEach((row,i)=>row.classList.toggle('playing',active===i));
  drawWave();
}
function resetAudio(){
  waveTask.begin();
  const player=$('lyrics-player');player.pause();player.removeAttribute('src');player.load();player.hidden=true;
  if(state.audioUrl)URL.revokeObjectURL(state.audioUrl);
  state.audioUrl=null;state.waveform=null;
  if(state.audioContext){state.audioContext.close().catch(()=>{});state.audioContext=null;}
  $('lyrics-audio').value='';$('wave-note').textContent='音檔需另行選擇；草稿不包含音訊。';drawWave();
}
$('lyrics-audio').onchange=async event=>{
  const file=event.target.files[0];if(!file)return;
  const token=waveTask.begin(),player=$('lyrics-player');player.pause();
  if(state.audioUrl)URL.revokeObjectURL(state.audioUrl);
  if(state.audioContext)state.audioContext.close().catch(()=>{});
  state.audioContext=null;state.waveform=null;state.audioUrl=URL.createObjectURL(file);
  player.src=state.audioUrl;player.hidden=false;markDirty('lyrics');drawWave();
  $('wave-note').textContent='正在讀取波形…';
  let context=null;
  try{
    if(file.size>64*1024*1024)throw Error('音檔超過 64 MiB，保留播放功能並略過波形');
    context=new AudioContext();state.audioContext=context;
    const bytes=await file.arrayBuffer();if(!waveTask.isCurrent(token))return;
    const decoded=await context.decodeAudioData(bytes);if(!waveTask.isCurrent(token))return;
    const points=600,bucket=Math.max(1,Math.ceil(decoded.length/points)),samples=decoded.getChannelData(0);
    state.waveform=Array.from({length:Math.ceil(samples.length/bucket)},(_,i)=>{
      let peak=0;for(let j=i*bucket;j<Math.min((i+1)*bucket,samples.length);j++)peak=Math.max(peak,Math.abs(samples[j]));return peak;
    });
    $('wave-note').textContent='波形已載入（第一聲道）；點擊定位，左右鍵微調 0.5 秒。';drawWave();
  }catch(error){if(waveTask.isCurrent(token))$('wave-note').textContent='波形未完成：'+error.message;}
  finally{if(context&&context.state!=='closed')await context.close().catch(()=>{});if(state.audioContext===context)state.audioContext=null;}
};
window.addEventListener('pagehide',()=>{waveTask.begin();if(state.audioUrl)URL.revokeObjectURL(state.audioUrl);if(state.audioContext)state.audioContext.close().catch(()=>{});});
$('lyrics-player').onloadedmetadata=()=>{if(!Number.isFinite($('lyrics-player').duration))return;$('lyrics-duration').value=$('lyrics-player').duration.toFixed(3);markDirty('lyrics');tick();};$('lyrics-player').ontimeupdate=tick;$('lyrics-player').onseeked=tick;$('lyrics-player').onerror=()=>say('此音檔無法在瀏覽器播放，請改用支援的格式',true);
function seek(seconds){const p=$('lyrics-player');if(!Number.isFinite(p.duration))return;p.currentTime=Math.max(0,Math.min(p.duration,seconds));tick();}
$('waveform').onclick=event=>{const r=event.currentTarget.getBoundingClientRect();seek((event.clientX-r.left)/r.width*$('lyrics-player').duration);};$('waveform').onkeydown=event=>{if(['ArrowLeft','ArrowRight','Home','End'].includes(event.key)){event.preventDefault();seek(event.key==='Home'?0:event.key==='End'?$('lyrics-player').duration:$('lyrics-player').currentTime+(event.key==='ArrowRight'?.5:-.5));}};
$('audio-build').onclick=()=>run($('audio-build'),async()=>{const file=$('audio-file').files[0];if(!file)throw Error('先選擇 PCM WAV');if(file.size>64*1024*1024)throw Error('本機檢查上限為 64 MiB');const result=await api('/api/audio?'+new URLSearchParams({name:file.name,profile:$('audio-profile').value}),file,true);setFiles(result.files,result.data.warnings.length?'音檔檢查 · 有待確認項目':'音檔檢查 · 本次技術條件通過');const d=result.data,box=$('audio-visual');box.innerHTML=`<h3>檢查摘要</h3><div class="facts"><div class="fact"><strong>${d.sample_rate/1000} kHz</strong><span>${d.bit_depth} bit · ${d.channels} 聲道</span></div><div class="fact"><strong>${d.duration_seconds}s</strong><span>音檔時長</span></div><div class="fact"><strong>${d.quiet_regions.leading_seconds}s</strong><span>頭部安靜段，門檻 -60 dBFS</span></div><div class="fact"><strong>${d.stereo_correlation??'不可測'}</strong><span>立體聲相關性</span></div></div><div class="table-wrap"><table><thead><tr><th>聲道</th><th>Peak dBFS</th><th>RMS dBFS</th><th>滿刻度樣本</th></tr></thead><tbody>${d.per_channel.map(c=>`<tr><td>${c.channel}</td><td>${c.peak_dbfs??'靜音'}</td><td>${c.rms_dbfs??'靜音'}</td><td>${c.full_scale_samples}</td></tr>`).join('')}</tbody></table></div><p class="hash">SHA-256 ${esc(d.sha256)}</p>`;appendNotes(box,d.warnings);box.hidden=false;say(d.warnings.length?`檢查已完成，有 ${d.warnings.length} 項需確認`:'本次技術條件通過；報告已建立');});
const draftTask=MusicEditor.createLatestTask();
let pendingLegacyDraft=null;
function clearConversion(){pendingLegacyDraft=null;$('draft-conversion').hidden=true;}
function loadDraft(draft){const previous=captureDraft();applyDraft(draft);state.undoDraft=previous;$('draft-undo').disabled=false;clearConversion();}
function captureDraft(){
  const panels={};
  Object.entries(MusicEditor.draftFields).forEach(([panel,ids])=>{
    panels[panel]={fields:Object.fromEntries(ids.map(id=>[id,$(id).value]))};
  });
  panels.music.sections=[...$('arrangement').children].map(row=>Object.fromEntries(
    MusicEditor.draftRows.music.columns.map((key,i)=>[key,row.querySelectorAll('input')[i].value])));
  panels.storyboard.motifs=getMotifs();
  panels.storyboard.shots=[...$('shots').children].map(article=>Object.fromEntries(
    [...article.querySelectorAll('[data-key]')].map(input=>[input.dataset.key,input.value])));
  panels.lyrics.cues=[...$('cues').children].map(row=>Object.fromEntries(
    MusicEditor.draftRows.lyrics.columns.map((key,i)=>[key,row.querySelectorAll('input')[i].value])));
  return {format:'zoe-music-lab-draft',schema_version:2,tool_version:'0.4.0',saved_at:new Date().toISOString(),tab:state.tab,panels};
}
function applyDraft(draft){
  Object.values(draft.panels).forEach(panel=>Object.entries(panel.fields).forEach(([id,value])=>$(id).value=value));
  renderSections(draft.panels.music.sections);renderMotifs(draft.panels.storyboard.motifs);renderShots(draft.panels.storyboard.shots);renderCues(draft.panels.lyrics.cues);
  resetAudio();$('audio-file').value='';state.bundles={};state.files={};
  Object.keys(MusicEditor.draftFields).forEach(markDirty);
  ['music-visual','mv-visual','audio-visual'].forEach(id=>$(id).hidden=true);
  document.querySelector(`[data-tab="${draft.tab}"]`).click();clearOutput();tick();
}
$('draft-export').onsubmit=event=>{
  try{
    if(state.busy)throw Error('目前操作尚未完成，請稍候再保存');
    const draft=MusicEditor.validateDraft(captureDraft());
    const content=JSON.stringify(draft,null,2)+'\n';
    if(new TextEncoder().encode(content).length>1024*1024)throw Error('草稿超過 1 MiB，請減少內容再保存');
    $('draft-content').value=content;say('已送出草稿下載；重新載入後需重新建立成果，音檔另存。');
  }catch(error){event.preventDefault();say(error.message,true);}
};
$('draft-open').onchange=async event=>{
  const file=event.target.files[0];if(!file)return;
  const token=draftTask.begin();clearConversion();
  try{
    if(state.busy)throw Error('目前操作尚未完成，請稍候再載入');
    if(file.size>1024*1024)throw Error('草稿上限為 1 MiB');
    const text=await file.text();if(!draftTask.isCurrent(token))return;
    const inspected=MusicEditor.inspectDraft(JSON.parse(text));
    if(state.busy)throw Error('目前操作尚未完成，請稍候再載入');
    if(inspected.legacy){pendingLegacyDraft=inspected.draft;$('draft-conversion-note').textContent=`這是草稿 v1：${inspected.draft.panels.storyboard.shots.length} 鏡，母題「${inspected.draft.panels.storyboard.fields['mv-motif']||'未命名'}」。轉換成 v2 後，每鏡先沿用這個母題；目前表單尚未替換。`;$('draft-conversion').hidden=false;say('舊版草稿已檢查，選擇轉換後才會載入');return;}
    loadDraft(inspected.draft);say('專案草稿已載入；請重新建立成果，校時與交付音檔需另選。');
  }catch(error){if(draftTask.isCurrent(token))say(error.message,true);}
  finally{if(draftTask.isCurrent(token))event.target.value='';}
};
$('draft-convert').onclick=()=>{if(state.busy){say('目前操作尚未完成，請稍候');return;}if(!pendingLegacyDraft)return;try{loadDraft(MusicEditor.convertLegacyDraft(pendingLegacyDraft));say('草稿已明確轉換為 v2 並載入；原檔保留，可撤回本次載入');}catch(error){say(error.message,true);}};
$('draft-cancel').onclick=()=>{clearConversion();say('已取消轉換，目前表單保留');};
$('draft-undo').onclick=()=>{
  if(state.busy){say('目前操作尚未完成，請稍候');return;}
  if(!state.undoDraft)return;
  draftTask.begin();clearConversion();applyDraft(state.undoDraft);state.undoDraft=null;$('draft-undo').disabled=true;
  say('已撤回草稿載入並還原表單；請重新建立成果，音檔需另選。');
};
async function initialize(){try{const response=await fetch('/api/examples');if(!response.ok)throw Error('範例讀取失敗');state.examples=await response.json();loadMusic();loadMv();$('lyrics-source').value='[00:00.000]空房剩一圈淡色的牆\n[00:04.000]紙箱裡裝不下那句話\n[00:08.000]我把聲音留在樓梯上\n[00:12.000]這次換我回答';drawWave();say('已載入本次原創合成範例，修改後開始');}catch(e){say(e.message,true);}}
initialize();
