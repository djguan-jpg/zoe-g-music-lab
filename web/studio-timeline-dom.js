// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
  const S=typeof module==='object'&&module.exports?require('./studio-timeline.js'):root.MusicStudioTimeline;
  function bind({document,events,player,capture,writeTimes,stopAudition,onDraw=()=>{},onError=()=>{}}){
    const $=id=>document.getElementById(id),listeners=[],on=(el,type,fn)=>{el.addEventListener(type,fn);listeners.push([el,type,fn]);};
    let disposed=false,drag=null,rowsKey='',imageRevision=0;
    const snapshot=()=>({...capture(),start:$('studio-loop-start').value,end:$('studio-loop-end').value});
    const sameMedia=m=>JSON.stringify(S.identity(capture().media))===JSON.stringify(S.identity(m));
    const playback=S.createPlayback({capture:snapshot,seek:(v,m)=>{if(!sameMedia(m))return false;player.currentTime=v;},play:m=>{if(!sameMedia(m))return false;return player.play();},pause:m=>{if(!sameMedia(m))return false;player.pause();},onError,
      onView:v=>{$('studio-play').disabled=!v.canPlay;$('studio-loop').disabled=!v.canPlay;$('studio-stop').disabled=!v.canStop;$('studio-loop').setAttribute('aria-pressed',String(v.looping));$('studio-play-note').textContent=v.failed?'播放未完成，請核對音檔。':v.pending?'正在等待播放器確認。':v.looping?'正在循環；依播放器事件回到起點，可能超過終點。':'共用波形校時音檔；只由按鈕開始播放。';}});
    const cueCapture=()=>{const s=capture();return {...s,visible:s.visible&&s.cueVisible};};
    const cue=S.createCueEdit({capture:cueCapture,write:writeTimes,onError,onView:v=>{
      $('cue-region-apply').disabled=!v.canApply;$('cue-region-undo').disabled=!v.canUndo;
      for(const id of ['cue-region-start','cue-region-move','cue-region-end'])$(id).disabled=!v.canPropose;
      $('cue-region-note').textContent=v.proposal?`預覽 ${v.proposal.start}–${v.proposal.end} 秒；確認套用後才修改歌詞時間。`:'拖曳兩端改開始／結束，中間平移整句；方向鍵 ±0.1 秒，Shift ±1 秒。Esc 取消，確認後可撤回；原文保持。';
      const s=capture();let range=v.proposal;try{range=range||S.span(s.row.start,s.row.end,s.media.duration);}catch{}
      const track=$('cue-region-track'),ok=!!range&&v.canPropose;track.classList.toggle('unavailable',!ok);
      if(ok){track.style.setProperty('--cue-left',100*range.start/s.media.duration+'%');track.style.setProperty('--cue-width',100*(range.end-range.start)/s.media.duration+'%');for(const [id,key] of [['cue-region-start','start'],['cue-region-end','end']])$(id).setAttribute('aria-valuetext',range[key]+' 秒');$('cue-region-move').setAttribute('aria-valuetext',range.start+' 至 '+range.end+' 秒');}
    }});
    const images=S.createImages({createURL:file=>URL.createObjectURL(file),revokeURL:url=>URL.revokeObjectURL(url),load:url=>new Promise((resolve,reject)=>{const image=new Image();image.onload=()=>resolve({width:image.naturalWidth,height:image.naturalHeight});image.onerror=()=>reject(Error('圖片無法解碼'));image.src=url;})});
    function renderRows(s){
      images.retain(s.shots.map(e=>e.id));const key=JSON.stringify(s.shots.map(e=>[e.id,e.value.section,e.value.visual]));if(key===rowsKey)return;rowsKey=key;
      const rows=$('studio-images');rows.replaceChildren();s.shots.forEach((e,i)=>{
        const row=document.createElement('div'),label=document.createElement('label'),input=document.createElement('input'),remove=document.createElement('button'),note=document.createElement('span');row.className='studio-image-row';label.textContent=`鏡頭 ${i+1} · ${e.value.section||'未命名段落'}`;input.type='file';input.accept='image/png,image/jpeg,image/webp';input.dataset.viewControl='true';input.setAttribute('aria-label',`鏡頭 ${i+1} 圖片`);input.disabled=s.busy;note.dataset.imageId=e.id;note.textContent=images.get(e.id)?.name||'尚無圖片，使用畫面文字卡';remove.textContent='移除圖片';remove.type='button';remove.disabled=s.busy;label.append(input);row.append(label,note,remove);rows.append(row);
        input.onchange=async()=>{const file=input.files[0];input.value='';if(!file||disposed||capture().busy)return;const revision=imageRevision;input.disabled=true;try{const accepted=await images.select(e.id,file,()=>!disposed&&revision===imageRevision&&!capture().busy&&capture().visible&&capture().shots.some(row=>row.id===e.id));if(disposed||revision!==imageRevision)return;if(!capture().shots.some(row=>row.id===e.id)){images.remove(e.id);return;}if(accepted)note.textContent=file.name;}catch(error){if(!disposed)onError(error);}finally{if(!disposed){input.disabled=capture().busy;refresh();}}};
        remove.onclick=()=>{if(capture().busy||disposed)return;images.remove(e.id);note.textContent='尚無圖片，使用畫面文字卡';refresh();};
      });
    }
    function refresh(ended=false){
      if(disposed)return;const s=capture();$('studio-clock').hidden=!s.visible;playback.refresh(ended);cue.refresh();
      $('studio-position').textContent=s.media.ready&&Number.isFinite(s.media.duration)?`${s.media.position.toFixed(3)} ／ ${s.media.duration.toFixed(3)} 秒`:'先在波形校時載入音檔';
      const seek=$('studio-seek');seek.disabled=s.busy||!s.visible||!s.media.ready||!Number.isFinite(s.media.duration);if(!seek.disabled){seek.max=String(s.media.duration);seek.value=String(s.media.position);}
      renderRows(s);for(const control of $('studio-images').querySelectorAll('input,button'))control.disabled=s.busy;
      const duration=s.media.duration,shots=S.active(s.shots,s.media.position,duration),lyrics=S.active(s.entries,s.media.position,duration),image=$('studio-image');
      const shot=shots.matches.length===1?shots.matches[0]:null,art=shot&&images.get(shot.id);image.hidden=!art;if(art){if(image.getAttribute('src')!==art.url)image.src=art.url;image.alt=`鏡頭 ${shot.index+1}：${shot.value.visual||shot.value.section||'分鏡圖片'}`;}else image.removeAttribute('src');
      $('studio-shot').textContent=!s.media.ready?'先載入音檔，再按播放。':shots.status==='overlap'?`鏡頭重疊：${shots.matches.map(e=>e.index+1).join('、')}；請修正時間。`:shot?`鏡頭 ${shot.index+1} · ${shot.value.section||'未命名段落'}`:'此時間沒有鏡頭；請補齊或保留空隙。';
      $('studio-visual').textContent=shot?.value.visual||'';$('studio-lyric').textContent=lyrics.matches.map(e=>e.value.text).join(' ／ ');
      $('studio-time-note').textContent=[shots.invalid.length?'無效鏡頭時間：'+shots.invalid.join('、'):'',lyrics.invalid.length?'無效歌詞時間：'+lyrics.invalid.join('、'):'',lyrics.status==='overlap'?'此時間有多句歌詞重疊':''].filter(Boolean).join('；');
      const bpm=$('studio-bpm').value,offset=$('studio-beat-offset').value;$('studio-beat-note').textContent=!bpm&&!offset?'可手動填 BPM 與第一拍秒數；不會自動偵測節奏。':S.beats(bpm,offset,duration).length?'節拍線依手動固定速度計算；變速歌曲需人工核對。':'請填 BPM 20–400 與音檔範圍內的第一拍；最多顯示 600 拍。';
    }
    on($('studio-play'),'click',()=>{stopAudition();void playback.begin().then(refresh);});on($('studio-loop'),'click',()=>{stopAudition();void playback.begin(true).then(refresh);});on($('studio-stop'),'click',()=>{playback.stop();refresh();});
    on($('studio-seek'),'change',()=>{playback.seek(Number($('studio-seek').value));refresh();});
    for(const id of ['studio-loop-start','studio-loop-end'])on($(id),'input',()=>refresh());
    for(const id of ['studio-bpm','studio-beat-offset'])on($(id),'input',()=>{refresh();onDraw();});
    on($('studio-loop-cue'),'click',()=>{const s=capture();if(s.busy||!s.row)return;try{S.span(s.row.start,s.row.end,s.media.duration);$('studio-loop-start').value=s.row.start;$('studio-loop-end').value=s.row.end;refresh();}catch(e){onError(e);}});
    on($('studio-audio-open'),'click',()=>document.querySelector('[data-tab="lyrics"]').click());
    on($('cue-region-apply'),'click',()=>{cue.apply();refresh();onDraw();});on($('cue-region-undo'),'click',()=>{cue.undo();refresh();onDraw();});on($('cue-region-cancel'),'click',()=>{cue.cancel();refresh();onDraw();});
    function base(){const s=capture(),range=cue.refresh().proposal||S.span(s.row.start,s.row.end,s.media.duration);return {s,range};}
    function propose(mode,range,delta,duration){const ms=Math.round(delta*1000)/1000;let a=range.start,b=range.end;if(mode==='start')a+=ms;else if(mode==='end')b+=ms;else{a+=ms;b+=ms;}a=Math.round(a*1000)/1000;b=Math.round(b*1000)/1000;if(a<0||b>duration||b<=a)return false;const result=cue.propose(a,b);onDraw();return result;}
    for(const mode of ['start','move','end']){
      const handle=$('cue-region-'+mode);
      on(handle,'keydown',e=>{if(e.key==='Escape'){drag=null;cue.cancel();onDraw();e.preventDefault();return;}if(!['ArrowLeft','ArrowRight'].includes(e.key)||e.altKey||e.ctrlKey||e.metaKey)return;try{const {s,range}=base();if(propose(mode,range,(e.key==='ArrowRight'?1:-1)*(e.shiftKey?1:.1),s.media.duration))e.preventDefault();}catch(error){onError(error);}});
      on(handle,'pointerdown',e=>{if(e.button!==0||handle.disabled)return;try{const {s,range}=base(),box=$('cue-region-track').getBoundingClientRect();if(box.width<=0)return;drag={mode,range,s,x:e.clientX,width:box.width,id:e.pointerId,handle};handle.setPointerCapture(e.pointerId);e.preventDefault();}catch(error){onError(error);}});
      on(handle,'pointermove',e=>{if(!drag||drag.handle!==handle||drag.id!==e.pointerId)return;const s=capture();if(s.busy||!s.cueVisible||s.duration!==drag.s.duration||JSON.stringify(s.entries)!==JSON.stringify(drag.s.entries)||JSON.stringify(s.row)!==JSON.stringify(drag.s.row)||!sameMedia(drag.s.media)){drag=null;cue.cancel();onDraw();return;}propose(mode,drag.range,(e.clientX-drag.x)/drag.width*drag.s.media.duration,drag.s.media.duration);});
      on(handle,'pointerup',()=>{drag=null;});on(handle,'pointercancel',()=>{drag=null;cue.cancel();onDraw();});
    }
    for(const type of ['input','change','focusin'])on($('cues'),type,()=>refresh());on($('cues-order'),'change',()=>refresh());
    for(const type of ['timeupdate','seeked','playing','pause','loadstart','loadedmetadata','emptied','durationchange','error'])on(player,type,()=>refresh());on(player,'ended',()=>refresh(true));
    on($('cue-audition-start'),'click',()=>playback.release());on(document,'visibilitychange',()=>refresh());
    function dispose(){if(disposed)return;playback.dispose();cue.dispose();images.dispose();disposed=true;for(const [el,type,fn] of listeners)el.removeEventListener(type,fn);}
    on(events,'pagehide',dispose);refresh();
    return {refresh,dispose,beats:()=>S.beats($('studio-bpm').value,$('studio-beat-offset').value,capture().media.duration),range:()=>{try{return cue.refresh().proposal||S.span(capture().row.start,capture().row.end,capture().media.duration);}catch{return null;}},clearImages:()=>{imageRevision++;images.retain([]);rowsKey='';refresh();}};
  }
  const api=Object.freeze({bind});if(typeof module==='object'&&module.exports)module.exports=api;else root.MusicStudioTimelineDOM=api;
})(typeof globalThis==='object'?globalThis:this);
