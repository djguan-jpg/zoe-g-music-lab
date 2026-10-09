// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root) {
  const node=typeof module==='object'&&module.exports;
  const P=node?require('./mv-project.js'):root.MusicMVProject;
  const T=node?require('../musiclab/assets/lyric-time.js'):root.LyricTime;
  const limits=Object.freeze({text:4*1024*1024,archive:68*1024*1024+65536,files:69});
  const readme='剪輯交接包\n\n解開 ZIP，再把 audio-source 音檔與 image-XXXX 圖片匯入原剪輯工具；在字幕匯入入口選 subtitles.srt。圖片名稱對應清單中的鏡頭 ID，沒有自動排列圖片或建立剪輯時間軸。\n\nmusic-video.plan.json 是保留原文的 Agent 企劃，不能直接當作剪輯軟體專案。回到本工具接續素材需另存 .zoemv.json。\n\nSRT 使用目前明確句首與句尾，按開始時間排列；沒有語音辨識或自動校時。含樣式標記的文字可能由剪輯工具解讀；先預覽字幕與實聽，原文另保留在企劃 JSON。\n\nHANDOFF-MANIFEST.json 記錄每檔大小、SHA-256、原素材名稱與鏡頭對應。音檔與圖片不轉檔；.bin 表示未辨識副檔名，請先核對檔案格式。\n';
  const exact=(v,keys)=>v&&typeof v==='object'&&!Array.isArray(v)&&Object.keys(v).length===keys.length&&keys.every(k=>Object.hasOwn(v,k));
  const fail=message=>{throw Error(message);};
  const json=value=>JSON.stringify(value,null,2)+'\n';
  const encode=text=>new TextEncoder().encode(text);
  const table=Uint32Array.from({length:256},(_,n)=>{for(let j=0;j<8;j++)n=n&1?0xedb88320^(n>>>1):n>>>1;return n>>>0;});
  function crc(bytes){let n=0xffffffff;for(const byte of bytes)n=table[(n^byte)&255]^(n>>>8);return (n^0xffffffff)>>>0;}
  function zip(entries) {
    if(entries.length>limits.files)fail('交接檔案數量超過上限');
    const names=entries.map(e=>encode(e.name)),centralSize=names.reduce((n,b)=>n+46+b.length,0);
    const localSize=entries.reduce((n,e,i)=>n+30+names[i].length+e.bytes.length,0),size=localSize+centralSize+22;
    if(size>limits.archive)fail('剪輯交接 ZIP 超過大小上限');
    const bytes=new Uint8Array(size),view=new DataView(bytes.buffer);let local=0,central=localSize;
    for(let i=0;i<entries.length;i++) {
      const entry=entries[i],name=names[i],checksum=crc(entry.bytes),length=entry.bytes.length;
      view.setUint32(local,0x04034b50,true);view.setUint16(local+4,20,true);view.setUint16(local+12,33,true);
      view.setUint32(local+14,checksum,true);view.setUint32(local+18,length,true);view.setUint32(local+22,length,true);view.setUint16(local+26,name.length,true);
      bytes.set(name,local+30);bytes.set(entry.bytes,local+30+name.length);
      view.setUint32(central,0x02014b50,true);view.setUint16(central+4,0x0314,true);view.setUint16(central+6,20,true);view.setUint16(central+14,33,true);
      view.setUint32(central+16,checksum,true);view.setUint32(central+20,length,true);view.setUint32(central+24,length,true);view.setUint16(central+28,name.length,true);
      view.setUint32(central+38,0o100644*65536,true);view.setUint32(central+42,local,true);bytes.set(name,central+46);
      local+=30+name.length+length;central+=46+name.length;
    }
    view.setUint32(central,0x06054b50,true);view.setUint16(central+8,entries.length,true);view.setUint16(central+10,entries.length,true);
    view.setUint32(central+12,centralSize,true);view.setUint32(central+16,localSize,true);
    return bytes;
  }
  function media(value,image=false) {
    if(!exact(value,['name','type','bytes']))fail('交接素材欄位錯誤');
    P.name(value.name);
    if(typeof value.type!=='string'||!(image?/^image\/(png|jpeg|webp)$/:/^audio\/[a-z0-9.+-]+$/).test(value.type))fail('交接素材類型不支援');
    if(!(value.bytes instanceof Uint8Array)||value.bytes.length<1||value.bytes.length>(image?P.limits.image:P.limits.media))fail('交接素材超過大小上限');
  }
  function audioName(value) {
    const extension=value.name.split('.').at(-1).toLowerCase();
    return 'audio-source.'+(['wav','mp3','m4a','flac','ogg','aac','webm','opus','aiff','aif','wma','mp4'].includes(extension)?extension:'bin');
  }
  async function prepare(source) {
    if(!exact(source,['draft','shot_ids','audio','images']))fail('交接來源欄位錯誤');
    const shell=P.validate({format:'zoe-mv-project',schema_version:1,draft:source.draft,shot_ids:source.shot_ids,audio:null,images:[]});
    media(source.audio);
    if(!Array.isArray(source.images)||source.images.length>P.limits.images)fail('最多交接 64 張圖片');
    let total=source.audio.bytes.length;const attached=new Set();
    for(const image of source.images) {
      if(!exact(image,['shot_id','asset'])||!shell.shot_ids.includes(image.shot_id)||attached.has(image.shot_id))fail('交接圖片與鏡頭對應錯誤');
      attached.add(image.shot_id);media(image.asset,true);total+=image.asset.bytes.length;
      if(total>P.limits.media)fail('音檔與圖片合計最多 64 MiB');
    }
    const original=shell.draft.panels.lyrics.cues;
    if(original.some(c=>!T.trim(c.end)))fail('請先提供每句結束時間，再建立剪輯交接包');
    if(original.some(c=>!T.trim(c.text)||/[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/.test(c.text)))fail('字幕有空句或控制字元，請在原工具修正後重匯入');
    const declared=shell.draft.panels.lyrics.fields['lyrics-duration'];
    const timed=T.normalizeCues(original,T.trim(declared)?declared:null);
    const srt=timed.cues.map((c,i)=>`${i+1}\n${T.timecode(c.start,true)} --> ${T.timecode(c.end,true)}\n${c.text}`).join('\n\n')+'\n';
    const entries=[{name:'subtitles.srt',bytes:encode(srt),role:'subtitles'},
      {name:'music-video.plan.json',bytes:encode(json({draft:shell.draft,shot_ids:shell.shot_ids})),role:'agent_plan'},
      {name:'README.md',bytes:encode(readme),role:'instructions'}];
    if(entries.reduce((n,e)=>n+e.bytes.length,0)>limits.text)fail('交接文字合計最多 4 MiB');
    // Copy every native buffer before the first asynchronous digest. Never package a later mutation.
    entries.push({name:audioName(source.audio),bytes:new Uint8Array(source.audio.bytes),role:'audio',original_name:source.audio.name});
    for(let i=0;i<shell.shot_ids.length;i++) {
      const image=source.images.find(e=>e.shot_id===shell.shot_ids[i]);if(!image)continue;
      const extension={"image/png":'png',"image/jpeg":'jpg',"image/webp":'webp'}[image.asset.type];
      entries.push({name:`image-${String(i+1).padStart(4,'0')}.${extension}`,bytes:new Uint8Array(image.asset.bytes),role:'image',original_name:image.asset.name,shot_id:image.shot_id});
    }
    const records=[];
    for(const entry of entries) {
      const record={name:entry.name,bytes:entry.bytes.length,sha256:await P.hash(entry.bytes),role:entry.role};
      if(entry.original_name!==undefined)record.original_name=entry.original_name;
      if(entry.shot_id!==undefined)record.shot_id=entry.shot_id;
      records.push(record);
    }
    const manifest={format:'zoe-media-handoff',schema_version:1,tool_version:shell.draft.tool_version,
      subtitle_cue_count:timed.cues.length,subtitle_order:'start_time',subtitle_time_source:'current_explicit_cue_boundaries',
      media_transcoded:false,creative_acceptance:false,listed_file_count:records.length,
      total_source_bytes:records.reduce((n,e)=>n+e.bytes,0),files:records};
    entries.push({name:'HANDOFF-MANIFEST.json',bytes:encode(json(manifest))});
    const bytes=zip(entries);
    return {name:'music-handoff.zip',bytes,sha256:await P.hash(bytes),manifest};
  }
  const api=Object.freeze({limits,readme,prepare});
  if(node)module.exports=api;else root.MusicMVHandoff=api;
})(typeof globalThis==='object'?globalThis:this);
