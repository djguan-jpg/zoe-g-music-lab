// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
 const maxBytes=32*1024*1024,maxEntries=1000;
 const exact=(v,keys)=>v&&typeof v==='object'&&!Array.isArray(v)&&Object.keys(v).length===keys.length&&keys.every(k=>Object.hasOwn(v,k));
 const fail=()=>{throw Error('備份下載的版本、摘要或位元組不一致；沒有送出檔案，原草稿庫保留');};
 function checked(reply,{maximum=maxBytes,selection='all'}={}){
  if(!Number.isSafeInteger(maximum)||maximum<1||maximum>maxBytes||!['all','selected'].includes(selection)||
    !exact(reply,['backup_schema_version','backup_sha256','bytes','entry_count','selection','download_url'])||reply.backup_schema_version!==1||
    typeof reply.backup_sha256!=='string'||!/^[0-9a-f]{64}$/.test(reply.backup_sha256)||!Number.isSafeInteger(reply.bytes)||reply.bytes<1||reply.bytes>maximum||
    !Number.isSafeInteger(reply.entry_count)||reply.entry_count<0||reply.entry_count>maxEntries||reply.selection!==selection||
    typeof reply.download_url!=='string'||!/^\/api\/drafts\/backup\/download\/[0-9a-f]{32}$/.test(reply.download_url))fail();
  return structuredClone(reply);
 }
 function checkedArchive(raw,descriptor,sha256){
  checked(descriptor,{selection:descriptor.selection});
  if(!(raw instanceof ArrayBuffer)||raw.byteLength!==descriptor.bytes||typeof sha256!=='string'||sha256!==descriptor.backup_sha256)fail();
  return {name:'zoe-music-lab-backup.zip',bytes:raw};
 }
 function createController({prepare,read,hash,send,maximum=()=>maxBytes,onState=()=>{},onSent=()=>{},onError=()=>{}}){
  if([prepare,read,hash,send].some(f=>typeof f!=='function'))throw Error('備份下載來源與核對未設定');
  let token=0,busy=false,disposed=false,phase='idle';
  const state=()=>onState({busy,phase});
  return {
   async download(){
    if(disposed||busy)return false;
    const job=++token,current=()=>!disposed&&job===token;busy=true;phase='preparing';state();let raw=null;
    try{
     const reply=await prepare();if(!current())return false;
     const descriptor=checked(reply,{maximum:maximum()});phase='reading';state();
     raw=await read(descriptor,current);if(!current())return false;
     if(!(raw instanceof ArrayBuffer)||raw.byteLength!==descriptor.bytes)fail();
     phase='hashing';state();const sha=await hash(raw);if(!current())return false;
     const prepared=checkedArchive(raw,descriptor,sha);if(!current())return false;
     if(send(prepared)!==true)throw Error('備份尚未送出下載；原草稿庫保留');
     onSent(structuredClone(descriptor));return true;
    }catch(error){if(current())onError(error);return false;}
    finally{raw=null;if(current()){busy=false;phase='idle';state();}}
   },
   cancel(){token++;busy=false;phase='idle';state();},
   dispose(){disposed=true;token++;busy=false;phase='idle';state();},
   status:()=>({busy,phase,disposed})
  };
 }
 const api={checked,checkedArchive,createController,maxBytes,maxEntries};
 if(typeof module==='object'&&module.exports)module.exports=api;else root.MusicBackupDownload=api;
})(typeof globalThis==='object'?globalThis:this);
