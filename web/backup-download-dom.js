// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
 const node=typeof module==='object'&&module.exports;
 const model=node?require('./backup-download.js'):root.MusicBackupDownload;
 const source=node?require('./backup-file.js'):root.MusicBackupFile;
 const downloads=node?require('./text-download-dom.js'):root.MusicTextDownloadDom;
 async function readArchive(descriptor,{fetch=root.fetch,signal,isCurrent=()=>true}={}){
  descriptor=model.checked(descriptor,{selection:descriptor.selection});if(!isCurrent())return null;
  const response=await fetch(descriptor.download_url,{method:'GET',redirect:'error',cache:'no-store',signal});
  if(!isCurrent()){try{await response.body?.cancel();}catch{}return null;}
  const length=response.headers.get('Content-Length'),kind=response.headers.get('Content-Type');
  if(!response.ok||typeof length!=='string'||!/^[1-9][0-9]*$/.test(length)||Number(length)!==descriptor.bytes||
    typeof kind!=='string'||kind.split(';')[0].trim().toLowerCase()!=='application/octet-stream'||typeof response.body?.getReader!=='function'){
   try{await response.body?.cancel();}catch{}throw Error('備份下載回應不完整；沒有送出檔案');
  }
  const raw=new ArrayBuffer(descriptor.bytes),bytes=new Uint8Array(raw),reader=response.body.getReader();let offset=0,chunks=0,complete=false;
  try{
   while(true){
    const part=await reader.read();if(!isCurrent())return null;
    if(part.done)break;
    if(++chunks>65536||!(part.value instanceof Uint8Array)||!part.value.byteLength||offset+part.value.byteLength>bytes.length)throw Error('備份下載超過宣告位元組或串流不完整；沒有送出檔案');
    bytes.set(part.value,offset);offset+=part.value.byteLength;
   }
   if(offset!==bytes.length)throw Error('備份下載長度與摘要不同；沒有送出檔案');
   complete=true;return raw;
  }finally{if(!complete){try{await reader.cancel();}catch{}}reader.releaseLock();}
 }
 function createAdapter(document,{prepare,maximum,allowed,say,onState=()=>{},events=root,fetch=root.fetch,hash=source.sha256,AbortType=root.AbortController,byteOptions={}}){
  const form=document.getElementById('backup-download'),cancelButton=document.getElementById('backup-download-cancel'),bytes=downloads.createByteSender(document,{...byteOptions,events});let active=null,disposed=false;
  const controller=model.createController({
   prepare:()=>{active=new AbortType();return prepare(active.signal);},maximum,hash,send:bytes.send,
   read:(descriptor,current)=>readArchive(descriptor,{fetch,signal:active?.signal,isCurrent:current}),
   onState:state=>{if(!state.busy)active=null;cancelButton.disabled=!state.busy;onState(state);},
   onSent:descriptor=>say(`備份 ZIP 已核對 ${descriptor.entry_count} 版並送出下載；請核對本機檔案。未保存編修、音檔與成果另存。`),
   onError:error=>say(error.message+'；目前工作台與音檔保留。',true)
  });
  form.onsubmit=event=>{event.preventDefault();if(disposed||!allowed()||controller.status().busy)return false;say('正在核對保存版本與備份 ZIP；完成後送出下載，工作台保留。');return controller.download();};
  function pageHide(){const previous=active;controller.cancel();previous?.abort();}
  cancelButton.disabled=true;cancelButton.onclick=()=>{if(disposed||!controller.status().busy)return;pageHide();say('已取消備份下載；草稿庫與目前編修保留。');};
  function dispose(){if(disposed)return;const previous=active;disposed=true;controller.dispose();previous?.abort();bytes.dispose();events.removeEventListener('pagehide',pageHide);}
  events.addEventListener('pagehide',pageHide);
  return {dispose,controller,pending:bytes.pending};
 }
 const api={readArchive,createAdapter};if(node)module.exports=api;else root.MusicBackupDownloadDom=api;
})(typeof globalThis==='object'?globalThis:this);
