// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
 function createAdapter(document,{events=root,url=root.URL,BlobType=root.Blob,schedule=root.setTimeout,cancel=root.clearTimeout}={}){
  const pending=new Map();let disposed=false;
  const release=key=>{if(!pending.has(key))return;const timer=pending.get(key);pending.delete(key);if(timer!==null)cancel(timer);url.revokeObjectURL(key);};
  function sendPrepared(prepared){
   if(disposed)throw Error('此頁下載已關閉，請重新開啟工作台');
   if(pending.size>=2)throw Error('下載正在送出，請稍候再試');
   let key=null,anchor=null;
   try{
    key=url.createObjectURL(new BlobType([prepared.bytes],{type:'application/octet-stream'}));pending.set(key,null);
    anchor=document.createElement('a');anchor.href=key;anchor.download=prepared.name;anchor.hidden=true;document.body.append(anchor);anchor.click();
    pending.set(key,schedule(()=>release(key),1000));return true;
   }catch(error){if(key!==null)release(key);throw error;}
   finally{anchor?.remove();}
  }
  const send=(name,content)=>sendPrepared(root.MusicTextDownload.prepare({name,content}));
  function bind(form,options){const controller=root.MusicTextDownload.createController({...options,send:sendPrepared});form.onsubmit=event=>{event.preventDefault();return controller.download();};return controller;}
  function pageHide(){for(const key of [...pending.keys()])release(key);}
  function dispose(){pageHide();disposed=true;events.removeEventListener('pagehide',pageHide);}
  events.addEventListener('pagehide',pageHide);
  return {send,bind,dispose,pending:()=>pending.size};
 }
 root.MusicTextDownloadDom={createAdapter};
})(typeof globalThis==='object'?globalThis:this);
