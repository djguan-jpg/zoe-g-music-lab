// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
 const pack=typeof module==='object'&&module.exports?require('./delivery-package.js'):root.MusicDeliveryPackage;
 const review=typeof module==='object'&&module.exports?require('./delivery-review.js'):root.MusicDeliveryReview;
 const reports=typeof module==='object'&&module.exports?require('./delivery-report.js'):root.MusicDeliveryReport;
 const text=typeof module==='object'&&module.exports?require('./delivery-text.js'):root.MusicDeliveryText;
 const exact=(v,keys)=>v&&typeof v==='object'&&!Array.isArray(v)&&Object.keys(v).length===keys.length&&keys.every(k=>Object.hasOwn(v,k));
 async function checked(wire,selected,hash){
  if(!exact(selected,['bytes','sha256','manifest']))throw Error('選定ZIP摘要未完成');
  if(!exact(wire,['files','data','meta'])||!exact(wire.meta,['version','protocol_version','needs_review'])||wire.meta.version!==pack.version||wire.meta.protocol_version!==1||wire.meta.needs_review!==true)throw Error('交付核對回覆版本不支援');
  const d=wire.data;
  if(!exact(d,['format','schema_version','archive_bytes','archive_sha256','manifest'])||d.format!=='zoe-delivery-inspection'||d.schema_version!==1||!Number.isSafeInteger(d.archive_bytes)||d.archive_bytes<=0||d.archive_bytes>pack.maxArchive||d.archive_bytes!==selected.bytes||typeof d.archive_sha256!=='string'||!/^[0-9a-f]{64}$/.test(d.archive_sha256)||d.archive_sha256!==selected.sha256)throw Error('交付回覆與選定ZIP不符；目前成果保留');
  if(!d.manifest||!['0.38.0','0.39.0','0.40.0','0.41.0','0.42.0','0.43.0','0.44.0','0.45.0'].includes(d.manifest.tool_version))throw Error('來源工具版本不支援；沒有遷移');
  const source={scope:d.manifest.scope,label:d.manifest.label,files:wire.files};
  const expected=await pack.manifest(source,hash,d.manifest.tool_version);
  try{pack.checkedManifest(d.manifest,expected);pack.checkedManifest(selected.manifest,expected);}catch{throw Error('ZIP原始清單、回覆或文字成果不一致；目前成果保留');}
  return structuredClone(wire);
 }
 function createController({capture,read,replace,restore,onState=()=>{},onError=()=>{},onReady=()=>{},hash}){
  let sequence=0,job=null,pending=null,comparison=null,undoState=null,reading=false,applying=false,textSource=null;
  const snapshot=()=>{const c=capture();return {scope:c.scope,revision:c.revision,resultRevision:c.resultRevision,bundle:structuredClone(c.bundle),media:[...(c.media||[])],busy:!!c.busy};};
  const key=s=>JSON.stringify([s.scope,s.revision,s.resultRevision,s.bundle]);
  const same=(a,b)=>key(a)===key(b)&&a.media.length===b.media.length&&a.media.every((file,i)=>file===b.media[i]);
  const current=()=>{if(!job)return false;const c=capture(),b=job.before;if(c.busy||c.scope!==b.scope||c.revision!==b.revision||c.resultRevision!==b.resultRevision)return false;return same(snapshot(),b);};
  const undoCurrent=()=>{if(!undoState)return false;const now=capture();return !now.busy&&now.scope===undoState.after.scope&&now.resultRevision===undoState.after.resultRevision;};
  function status(){return {reading,pending:!!pending,canApply:!!pending&&!reading&&!applying&&current(),canUndo:!reading&&!applying&&undoCurrent(),proposal:pending?structuredClone(pending):null,comparison:pending?structuredClone(comparison):null};}
  const publish=()=>onState(status());
  return {status,
   clearTextWindow(){textSource=null;},
   textWindow(name,side,start_byte=0){
    if(reading||applying||!pending||!current()){textSource=null;onError(Error('原文來源已變更；請重新核對ZIP'));return null;}
    if(!['before','incoming'].includes(side)||!comparison?.files.some(f=>f.name===name)){onError(Error('原文來源或檔名無效'));return null;}
    const files=side==='incoming'?pending.files:job.before.bundle?.files||{};
    if(!Object.hasOwn(files,name))return null;
    if(!textSource||textSource.name!==name||textSource.side!==side)textSource={name,side,value:text.prepare(files[name])};
    const part=textSource.value.window(start_byte);
    if(!current()){textSource=null;onError(Error('原文來源已有修改；沒有提交舊段落'));return null;}
    return part;
   },
   originalFile(name){
    if(reading||applying||!pending||!current()){onError(Error('ZIP來源已變更或尚未完成；請重新選ZIP再下載原文'));return null;}
    if(!Object.hasOwn(pending.files,name)){onError(Error('ZIP沒有這個原文檔案；沒有下載'));return null;}
    return {name,content:pending.files[name]};
   },
   report(){
    if(reading||applying||!pending||!current()){onError(Error('比較來源已變更或尚未完成；請重新選ZIP再下載報告'));return null;}
    const files=reports.files(pending.data,comparison);
    if(!current()){onError(Error('報告來源已有修改；原成果保留'));return null;}
    return files;
   },
   filePreview(name){
    if(!pending||!comparison?.files.some(f=>f.name===name))return null;
    const old=job.before.bundle?.files||{};
    const show=text=>({...review.excerpt(text),lineEndings:review.lineEndings(text)});
    return{before:show(Object.hasOwn(old,name)?old[name]:null),incoming:show(Object.hasOwn(pending.files,name)?pending.files[name]:null)};
   },
   refresh(){if(textSource&&!current())textSource=null;if(undoState&&!applying){const now=capture();if(now.scope!==undoState.after.scope||now.resultRevision!==undoState.after.resultRevision)undoState=null;}publish();return status();},
   cancel(){sequence++;job=null;pending=null;comparison=null;reading=false;textSource=null;publish();},
   async inspect(file){
    const token=++sequence;job=null;pending=null;comparison=null;reading=false;textSource=null;publish();
    if(snapshot().busy){onError(Error('目前操作尚未完成，請稍候再選ZIP'));return false;}
    if(!file||typeof file.name!=='string'||!file.name.toLowerCase().endsWith('.zip')||!Number.isSafeInteger(file.size)||file.size<=0||file.size>pack.maxArchive){onError(Error('請選擇有效的本工具文字交付ZIP'));return false;}
    job={token,before:snapshot()};pending=null;reading=true;publish();
    try{
     const response=await read(file);
     if(job?.token!==token)return false;
     if(!current())throw Error('讀取後工作台、成果或音檔已有修改；請重新選ZIP');
     const accepted=await checked(response.wire,response.selected,hash);
     if(job?.token!==token)return false;
     if(!current())throw Error('核對後目標已有修改；請重新選ZIP');
     if(accepted.data.manifest.scope!==job.before.scope)throw Error('這份ZIP屬於其他工作台；請先切換對應工作台再選檔');
     const candidateComparison=await review.compare({scope:job.before.scope,files:job.before.bundle?.files||{}},{scope:accepted.data.manifest.scope,files:accepted.files},hash);
     if(job?.token!==token)return false;
     if(!current())throw Error('比較後目標已有修改；請重新選ZIP');
     comparison=candidateComparison;pending=accepted;return true;
    }catch(error){if(job?.token===token){pending=null;onError(error);}return false;}
    finally{if(job?.token===token){reading=false;publish();if(pending&&current())onReady();}}
   },
   apply(){
    if(!pending||reading||applying)return false;
    if(!current()){onError(Error('預覽後目標已有修改，原成果保留；請重新選ZIP'));publish();return false;}
    const before=job.before,proposal=structuredClone(pending);applying=true;pending=null;textSource=null;publish();
    try{replace(proposal);const after=capture();undoState={before,after:{scope:after.scope,resultRevision:after.resultRevision}};job=null;return true;}
    finally{applying=false;publish();}
   },
   undo(){
    if(reading||applying||!undoCurrent())return false;
    const old=undoState;undoState=null;job=null;pending=null;textSource=null;applying=true;publish();
    try{restore(structuredClone(old.before.bundle),old.before.revision);return true;}
    finally{applying=false;publish();}
   }
  };
 }
 const api={checked,createController};if(typeof module==='object'&&module.exports)module.exports=api;else root.MusicDeliveryImport=api;
})(typeof globalThis==='object'?globalThis:this);
