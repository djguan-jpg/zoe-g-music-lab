// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root) {
  const node=typeof module==='object'&&module.exports;
  const E=node?require('./editor-state.js'):root.MusicEditor;
  const J=node?require('../musiclab/assets/json-document.js'):root.MusicJsonDocument;
  const V=node?require('./planning-values.js'):root.MusicPlanningValues;
  const limits=Object.freeze({media:64*1024*1024,image:12*1024*1024,images:64,draft:1024*1024,json:92*1024*1024});
  const exact=(v,keys)=>v&&typeof v==='object'&&!Array.isArray(v)&&Object.keys(v).length===keys.length&&keys.every(k=>Object.hasOwn(v,k));
  const fail=message=>{throw Error(message);};
  function name(value) {
    if(typeof value!=='string'||!value||value.length>180||/[\x00-\x1f\x7f/\\:]/.test(value)||value==='.'||value==='..')fail('素材名稱無效');
    J.assertUnicode(value);return value;
  }
  function asset(value,image=false) {
    if(!exact(value,['name','type','size','sha256','base64']))fail('素材欄位不完整');
    name(value.name);
    if(typeof value.type!=='string'||!(image?/^image\/(png|jpeg|webp)$/:/^audio\/[a-z0-9.+-]+$/).test(value.type))fail('素材類型不支援');
    if(!Number.isSafeInteger(value.size)||value.size<1||value.size>(image?limits.image:limits.media))fail('素材超過大小上限');
    if(typeof value.sha256!=='string'||! /^[0-9a-f]{64}$/.test(value.sha256)||typeof value.base64!=='string'||value.base64.length!==4*Math.ceil(value.size/3)||! /^[A-Za-z0-9+/]*={0,2}$/.test(value.base64))fail('素材摘要或編碼無效');
    return value;
  }
  function validate(value) {
    if(!exact(value,['format','schema_version','draft','shot_ids','audio','images'])||value.format!=='zoe-mv-project'||value.schema_version!==1)fail('只接受 MV 素材專案版本 1');
    const draft=E.validateDraft(value.draft);
    if(new TextEncoder().encode(JSON.stringify(draft)).length>limits.draft)fail('企劃超過 1 MiB');
    const ids=value.shot_ids;
    if(!Array.isArray(ids)||ids.length!==draft.panels.storyboard.shots.length||ids.some(id=>typeof id!=='string'||! /^[A-Za-z][A-Za-z0-9-]{0,63}$/.test(id))||new Set(ids).size!==ids.length)fail('鏡頭身分無效或重複');
    let bytes=0;
    if(value.audio!==null)bytes+=asset(value.audio).size;
    if(!Array.isArray(value.images)||value.images.length>limits.images)fail('最多保存 64 張鏡頭圖片');
    const attached=new Set();
    for(const image of value.images) {
      if(!exact(image,['shot_id','asset'])||!ids.includes(image.shot_id)||attached.has(image.shot_id))fail('圖片對應鏡頭無效或重複');
      attached.add(image.shot_id);bytes+=asset(image.asset,true).size;
    }
    if(bytes>limits.media)fail('音檔與圖片合計最多 64 MiB');
    return {...value,draft,shot_ids:[...ids],images:value.images.map(v=>({...v,asset:{...v.asset}})),audio:value.audio&&{...value.audio}};
  }
  function parse(text) {return validate(J.parse(text,{maxBytes:limits.json,label:'MV 素材專案',allowBOM:false}));}
  const hash=async bytes=>Array.from(new Uint8Array(await (node?require('node:crypto').webcrypto:root.crypto).subtle.digest('SHA-256',bytes)),b=>b.toString(16).padStart(2,'0')).join('');
  function encode(bytes) {let text='';for(let i=0;i<bytes.length;i+=8192)text+=String.fromCharCode(...bytes.subarray(i,i+8192));return btoa(text);}
  function decode(value) {
    const text=atob(value.base64),bytes=Uint8Array.from(text,c=>c.charCodeAt(0));
    if(bytes.length!==value.size||encode(bytes)!==value.base64)fail('素材原始 bytes 與宣告不符');
    return bytes;
  }
  async function pack(file,type=file.type) {
    name(file.name);
    if(!Number.isSafeInteger(file.size)||file.size<1||file.size>limits.media)fail('素材超過大小上限');
    const raw=await file.arrayBuffer();if(raw.byteLength!==file.size)fail('讀取大小與選檔不同');
    const bytes=new Uint8Array(raw);
    return asset({name:file.name,type,size:bytes.length,sha256:await hash(bytes),base64:encode(bytes)},type.startsWith('image/'));
  }
  async function materialize(project) {
    const checked=validate(project);
    async function read(a) {const bytes=decode(a);if(await hash(bytes)!==a.sha256)fail('素材 SHA-256 核對失敗');return {name:a.name,type:a.type,bytes};}
    const audio=checked.audio?await read(checked.audio):null,images=[];
    for(const image of checked.images)images.push({shot_id:image.shot_id,...await read(image.asset)});
    return {project:checked,audio,images};
  }
  function seed(current,text,count,duration,title) {
    const draft=E.validateDraft(current),length=Math.round(duration*1000);
    if(typeof text!=='string'||new TextEncoder().encode(text).length>65536||typeof title!=='string'||!V.trim(title))fail('請填作品名稱與 64 KiB 以下的歌詞原文');
    J.assertUnicode(text);J.assertUnicode(title);
    if(!Number.isFinite(duration)||duration<=0||duration>600||!Number.isInteger(count)||count<0||count>limits.images)fail('試播草稿最多 600 秒、64 張圖片');
    const lines=text.split(/\r\n|\n|\r/).filter(line=>V.trim(line)!=='');
    if(lines.length>10000||length<Math.max(lines.length,count,1))fail('句子或圖片過多，無法分配至少 1 ms 的草稿時間');
    const ranges=n=>Array.from({length:n},(_,i)=>({start:String(Math.floor(i*length/n)/1000),end:String(Math.floor((i+1)*length/n)/1000)}));
    draft.panels.lyrics.fields={'lyrics-title':title,'lyrics-source':text,'lyrics-format':'.json','lyrics-duration':String(length/1000)};
    draft.panels.lyrics.cues=ranges(lines.length).map((range,i)=>({...range,text:lines[i]}));
    const total=Math.max(count,1);
    draft.panels.storyboard.shots=ranges(total).map((range,i)=>({...Object.fromEntries(E.draftRows.storyboard.columns.map(k=>[k,''])),...range,section:`試播鏡頭 ${i+1}`,visual:count?'':'歌詞文字卡',screen_direction:'neutral'}));
    draft.panels.storyboard.motifs=[];
    draft.panels.storyboard.fields['mv-title']=title;draft.panels.storyboard.fields['mv-duration']=String(length/1000);
    draft.panels.music.fields['music-title']=title;draft.panels.music.fields['music-lyrics']=text;draft.tab='storyboard';
    return E.validateDraft(draft);
  }
  const api=Object.freeze({limits,validate,parse,pack,materialize,hash,encode,decode,seed});
  if(node)module.exports=api;else root.MusicMVProject=api;
})(typeof globalThis==='object'?globalThis:this);
