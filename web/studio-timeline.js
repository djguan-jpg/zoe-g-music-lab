// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
  const T=typeof module==='object'&&module.exports?require('../musiclab/assets/lyric-time.js'):root.LyricTime;
  const W=typeof module==='object'&&module.exports?require('./wave-position.js'):root.MusicWavePosition;
  const clone=value=>structuredClone(value),same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
  function span(start,end,duration){
    const a=T.normalize(start,'開始秒數',true),b=T.normalize(end,'結束秒數',true);
    if(!Number.isFinite(duration)||duration<=0||!(b>a)||b>duration)throw Error('需符合 0 ≤ 開始 < 結束 ≤ 音檔長度');
    return {start:a,end:b};
  }
  function active(entries,position,duration){
    const matches=[],invalid=[];
    entries.forEach((e,index)=>{try{const s=span(e.value.start,e.value.end,duration);if(position>=s.start&&position<s.end)matches.push({...clone(e),index});}catch{invalid.push(index+1);}});
    return {matches,invalid,status:matches.length>1?'overlap':matches.length?'active':'gap'};
  }
  function beats(bpm,offset,duration,limit=600){
    let b,o;try{b=T.normalize(bpm,'BPM',true);o=T.normalize(offset,'第一拍秒數',true);}catch{return [];}
    if(typeof bpm!=='string'||!bpm.trim()||typeof offset!=='string'||!offset.trim()||!Number.isFinite(b)||b<20||b>400||!Number.isFinite(o)||o<0||o>duration)return [];
    const step=60/b,count=Math.floor((duration-o)/step)+1;
    if(count>limit)return [];return Array.from({length:count},(_,i)=>o+i*step);
  }
  function identity(media){return {source:media.source,current_source:media.current_source,duration:media.duration};}
  function available(s){return s.busy===false&&s.visible===true&&W.present(s.media).available;}
  function createPlayback({capture,seek,play,pause,onView=()=>{},onError=()=>{}}){
    let owner=null,pending=false,disposed=false,epoch=0,failed=false;
    const current=s=>owner&&same(owner.media,identity(s.media));
    function release(stop=true){const s=capture(),was=!!owner,owned=current(s);epoch++;owner=null;if(stop&&owned&&s.playing){try{if(pause(s.media)===false||capture().playing)throw Error('播放器未確認停止');}catch(e){onError(e);failed=true;}}return was;}
    function view(){const s=capture(),v={canPlay:!disposed&&!pending&&available(s),canStop:!disposed&&!!owner,looping:!!owner?.loop,pending,failed};onView(v);return v;}
    function position(value,s){if(seek(value,s.media)===false)throw Error('定位被拒絕');const post=capture();if(!same(identity(s.media),identity(post.media))||!available(post)||Math.abs(post.media.position-value)>.001)throw Error('定位未通過回讀');}
    async function begin(loop=false){
      if(disposed||pending)return false;const s=capture();if(!available(s))return false;
      let range;try{range=loop?span(s.start,s.end,s.media.duration):null;}catch(e){onError(e);return false;}
      release();failed=false;owner={media:identity(s.media),loop,range,raw:[s.start,s.end]};const token=epoch,original=identity(s.media);pending=true;view();
      try{const before=capture();if(!available(before)||!current(before))throw Error('音檔來源已改變');if(loop)position(range.start,before);const result=await play(before.media);const post=capture();if(disposed||token!==epoch){if(same(original,identity(post.media))&&post.playing&&!owner){try{pause(post.media);}catch(e){onError(e);}}return false;}if(result===false||!current(post)||!available(post)||!post.playing)throw Error('未確認開始播放');return true;}
      catch(e){if(token===epoch){release();failed=true;onError(e);}return false;}
      finally{pending=false;view();}
    }
    function refresh(ended=false){
      if(disposed)return view();const s=capture();
      if(owner){
        if(!current(s)){release(false);}
        else if(!available(s)||owner.loop&&!same(owner.raw,[s.start,s.end]))release();
        else if(!pending&&owner.loop&&s.media.position>=owner.range.end&&(s.playing||ended)){
          try{position(owner.range.start,s);if(ended)void begin(true);}catch(e){release();failed=true;onError(e);}
        }else if(!pending&&!s.playing)release(false);
      }
      return view();
    }
    return {begin,refresh,stop:()=>{const r=release();view();return r;},release:()=>{release(false);view();},seek:value=>{try{const s=capture();if(!available(s)||!Number.isFinite(value)||value<0||value>s.media.duration)return false;release();position(value,s);refresh();return true;}catch(e){onError(e);return false;}},dispose:()=>{if(disposed)return true;release();disposed=true;view();return !failed;}};
  }
  function createCueEdit({capture,write,onView=()=>{},onError=()=>{}}){
    let proposal=null,undo=null,writing=false,disposed=false;
    const valid=s=>{if(disposed||!available(s)||!s.row||!Array.isArray(s.entries)||!s.entries.length||s.entries.length>10000)return false;const ids=new Set();for(const e of s.entries){if(!e||typeof e.id!=='string'||!e.id||ids.has(e.id)||!e.value||!['start','end','text'].every(k=>typeof e.value[k]==='string'))return false;ids.add(e.id);}const e=s.entries.find(e=>e.id===s.row.id);return !!e&&['start','end','text'].every(k=>s.row[k]===e.value[k]);};
    const core=s=>({entries:s.entries,duration:s.duration,row:s.row,media:identity(s.media)});
    const v=()=>{const s=capture(),view={canPropose:valid(s),proposal:clone(proposal?.range||null),canApply:!!proposal&&!writing,canUndo:!!undo&&!writing&&valid(s)&&same(core(s),undo.after)};onView(view);return view;};
    function refresh(){if(!writing&&proposal&&(!valid(capture())||!same(proposal.before,core(capture()))))proposal=null;return v();}
    function propose(start,end){if(writing||disposed)return false;try{const s=capture();if(!valid(s))throw Error('請先選擇歌詞句與可用音檔');const range=span(String(start),String(end),s.media.duration);proposal={before:clone(core(s)),range};v();return true;}catch(e){proposal=null;v();onError(e);return false;}}
    function commit(record,restoring){
      if(writing||disposed||!record)return false;const s=capture();
      const before=restoring?record.after:record.before,after=restoring?record.before:record.after;
      if(!valid(s)||!same(core(s),before)){onError(Error('歌詞或音檔已改變，請重新確認'));return false;}
      writing=true;
      try{if(write(s.row.id,after.row.start,after.row.end)===false||!same(core(capture()),after)||!valid(capture()))throw Error('時間寫入未通過回讀，請人工核對');if(restoring)undo=null;else undo=record;proposal=null;return true;}
      catch(e){onError(e);return false;}finally{writing=false;v();}
    }
    return {refresh,propose,cancel:()=>{if(writing)return false;proposal=null;v();return true;},apply:()=>{if(!proposal)return false;const before=proposal.before,after=clone(before),r=proposal.range;after.row.start=String(r.start);after.row.end=String(r.end);const e=after.entries.find(e=>e.id===after.row.id);e.value.start=after.row.start;e.value.end=after.row.end;return commit({before,after},false);},undo:()=>commit(undo,true),dispose:()=>{disposed=true;proposal=undo=null;v();}};
  }
  function createImages({createURL,revokeURL,load}){
    const images=new Map(),pending=new Map(),revoked=new Set();let serial=0,disposed=false;
    const revoke=url=>{if(!revoked.has(url)){revoked.add(url);revokeURL(url);}};
    function remove(id){const wait=pending.get(id);if(wait)revoke(wait.url);pending.delete(id);const old=images.get(id);if(old)revoke(old.url);images.delete(id);}
    return {get:id=>images.get(id)||null,async select(id,file,allowed=()=>true){if(disposed||typeof id!=='string'||!file||!/^image\/(png|jpeg|webp)$/.test(file.type)||file.size>12*1024*1024)throw Error('請選擇 12 MiB 以下的 PNG、JPEG 或 WebP');const token=++serial,url=createURL(file),oldPending=pending.get(id);if(oldPending)revoke(oldPending.url);pending.set(id,{token,url});try{const size=await load(url);if(!Number.isSafeInteger(size.width)||!Number.isSafeInteger(size.height)||size.width<=0||size.height<=0||size.width*size.height>40000000)throw Error('圖片尺寸無效或超過四千萬像素');if(disposed||pending.get(id)?.token!==token||!allowed()){revoke(url);return false;}pending.delete(id);const old=images.get(id);if(old)revoke(old.url);images.set(id,{url,name:file.name,file});return true;}catch(e){revoke(url);if(pending.get(id)?.token===token)pending.delete(id);throw e;}},remove,retain:ids=>{const keep=new Set(ids);for(const id of new Set([...images.keys(),...pending.keys()]))if(!keep.has(id))remove(id);},dispose:()=>{disposed=true;for(const id of new Set([...images.keys(),...pending.keys()]))remove(id);}};
  }
  const api=Object.freeze({span,active,beats,identity,createPlayback,createCueEdit,createImages});if(typeof module==='object'&&module.exports)module.exports=api;else root.MusicStudioTimeline=api;
})(typeof globalThis==='object'?globalThis:this);
