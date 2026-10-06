// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
 const P=typeof module==='object'&&module.exports?require('./backup-verification.js'):root.MusicBackupVerification;
 const same=(a,b)=>a.revision===b.revision&&a.proof?.bytes===b.proof?.bytes&&a.proof?.sha256===b.proof?.sha256&&a.proof?.entry_count===b.proof?.entry_count;
 const allowed=s=>!s.busy&&s.proof!==null;
 function createController({capture,describe,readFile,hash,onState=()=>{},onReport=()=>{},onError=()=>{}}){
  if([capture,describe,readFile,hash].some(f=>typeof f!=='function'))throw Error('備份核對讀取與雜湊未設定');
  let token=0,pending=false,before=null,selected=null,report=null,disposed=false,activeWork=0,contextRevision=0,lastContext=null,message='先下載備份 ZIP，再選回本機檔案核對。';
  const read=()=>P.snapshot(capture());
  function view(){let now;try{now=read();}catch{return {available:false,pending:false,waitingForWork:false,contextRevision:0,source:null,selected:null,report:null,message:'備份核對來源暫時無效；原資料保留，請重新操作。'};}if(!lastContext||!same(lastContext,now)){lastContext=now;contextRevision++;}return {available:!disposed&&allowed(now)&&activeWork<2,pending,waitingForWork:!pending&&activeWork>=2,contextRevision,source:now.proof===null?null:{...now.proof},selected:selected?{...selected}:null,report:report?{...report}:null,message};}
  const emit=()=>onState(view());
  function clear(note){token++;pending=false;before=null;selected=null;report=null;message=note;}
  function refresh(){if(disposed)return;try{const now=read();if(before&&(!same(before,now)||!allowed(now)))clear('本輪備份或操作狀態已改變，請重新選回檔案核對。');}catch(error){clear('備份核對來源無效；原資料保留。');onError(error);}emit();}
  return {view,refresh,cancel(){if(disposed)return;clear('已取消備份檔案核對；草稿庫與目前編修保留。');emit();},dispose(){if(disposed)return;clear('此頁備份核對已關閉。');disposed=true;lastContext=null;},
   async verify(file){
    if(disposed)return false;let source;
    try{source=read();}catch(error){clear('備份核對來源無效；原資料保留。');onError(error);emit();return false;}
    if(!allowed(source)||activeWork>=2)return false;
    const job=++token;before=source;pending=true;selected=null;report=null;message='正在讀取本機備份並核對 SHA-256…';emit();let raw=null,ownsWork=false;
    const current=()=>{try{const now=read();return !disposed&&job===token&&allowed(now)&&same(source,now);}catch{return false;}};
    try{
     const info=P.metadata(describe(file));selected=info;emit();
     activeWork++;ownsWork=true;raw=await readFile(file);if(!current())return false;
     const after=P.metadata(describe(file));if(info.name!==after.name||info.size!==after.size||!(raw instanceof ArrayBuffer)||raw.byteLength!==info.size)throw Error('備份讀取不完整或選檔資訊已變更；請重新選檔。');
     const sha=await hash(raw);raw=null;if(!current())return false;
     const last=P.metadata(describe(file));if(info.name!==last.name||info.size!==last.size)throw Error('核對期間選檔資訊已變更；請重新選檔。');
     const checked=P.inspect(source.proof,{bytes:info.size,sha256:sha});if(!current())return false;
     report=checked;message=checked.matched?`選定檔案與本輪備份大小及 SHA-256 相同（${checked.expected_bytes} bytes）；草稿庫與目前編修保留。`:`選定檔案與本輪備份不一致：本輪 ${checked.expected_bytes} bytes，選定 ${checked.selected_bytes} bytes；SHA-256 ${checked.expected_sha256===checked.selected_sha256?'相同':'不同'}。`;
     onReport({...checked});return true;
    }catch(error){if(current()){message=error.message;onError(error);}return false;}
    finally{raw=null;if(ownsWork)activeWork--;if(job===token&&!disposed){pending=false;if(!current())clear('核對期間本輪備份或操作狀態已改變，請重新核對。');emit();}else if(ownsWork&&!disposed)refresh();}
   }};
 }
 const api=Object.freeze({createController});if(typeof module==='object'&&module.exports)module.exports=api;else root.MusicBackupVerificationController=api;
})(typeof globalThis==='object'?globalThis:this);
