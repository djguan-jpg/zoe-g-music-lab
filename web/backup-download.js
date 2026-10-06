// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
 const maxBytes=32*1024*1024,maxEntries=1000;
 const exact=(v,keys)=>v&&typeof v==='object'&&!Array.isArray(v)&&Object.keys(v).length===keys.length&&keys.every(k=>Object.hasOwn(v,k));
 const fail=()=>{throw Error('備份下載的版本、摘要或位元組不一致；沒有送出檔案，原草稿庫保留');};
 function request(value={}){
  if(!value||typeof value!=='object'||Array.isArray(value))fail();
  const keys=Reflect.ownKeys(value);if(keys.length>1||keys.some(k=>k!=='ids'))fail();
  if(!keys.length)return {};
  const field=Object.getOwnPropertyDescriptor(value,'ids');if(!field?.enumerable||!Object.hasOwn(field,'value'))fail();
  const ids=field.value;if(!Array.isArray(ids)||ids.length<1||ids.length>maxEntries)fail();
  const copy=[];for(let i=0;i<ids.length;i++){const d=Object.getOwnPropertyDescriptor(ids,String(i));if(!d?.enumerable||!Object.hasOwn(d,'value')||typeof d.value!=='string'||!/^draft-[0-9a-f]{32}$/.test(d.value))fail();copy.push(d.value);}
  if(Reflect.ownKeys(ids).length!==ids.length+1||new Set(copy).size!==copy.length)fail();
  return {ids:copy.sort()};
 }
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
   async download(payload={}){
    if(disposed||busy)return false;
    let wanted;try{wanted=request(payload);}catch(error){onError(error);return false;}
    const job=++token,current=()=>!disposed&&job===token;busy=true;phase='preparing';state();let raw=null;
    try{
     const reply=await prepare(structuredClone(wanted));if(!current())return false;
     const descriptor=checked(reply,{maximum:maximum(),selection:wanted.ids?'selected':'all'});if(wanted.ids&&descriptor.entry_count!==wanted.ids.length)fail();phase='reading';state();
     raw=await read(descriptor,current);if(!current())return false;
     if(!(raw instanceof ArrayBuffer)||raw.byteLength!==descriptor.bytes)fail();
     phase='hashing';state();const sha=await hash(raw);if(!current())return false;
     const prepared=checkedArchive(raw,descriptor,sha);if(!current())return false;
     if(send(prepared)!==true)throw Error('備份尚未送出下載；原草稿庫保留');
     onSent(structuredClone(descriptor),structuredClone(wanted));return true;
    }catch(error){if(current())onError(error);return false;}
    finally{raw=null;if(current()){busy=false;phase='idle';state();}}
   },
   cancel(){token++;busy=false;phase='idle';state();},
   dispose(){disposed=true;token++;busy=false;phase='idle';state();},
   status:()=>({busy,phase,disposed})
  };
 }
 const api={request,checked,checkedArchive,createController,maxBytes,maxEntries};
 if(typeof module==='object'&&module.exports)module.exports=api;else root.MusicBackupDownload=api;
})(typeof globalThis==='object'?globalThis:this);
