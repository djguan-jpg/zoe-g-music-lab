// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
 const P=typeof module==='object'&&module.exports?require('./text-verification.js'):root.MusicTextVerification;
 function snapshot(value){
  if(!value||Object.keys(value).length!==6||!['scope','revision','busy','dirty','visible','source'].every(k=>Object.hasOwn(value,k))||!['music','storyboard','lyrics','audio','draft'].includes(value.scope)||!Number.isSafeInteger(value.revision)||value.revision<0||['busy','dirty','visible'].some(k=>typeof value[k]!=='boolean')||value.source!==null&&(!value.source||Array.isArray(value.source)||Object.keys(value.source).length!==2||!['name','content'].every(k=>Object.hasOwn(value.source,k))||typeof value.source.name!=='string'||typeof value.source.content!=='string'))throw Error('原文核對來源狀態無效');
  return {...value,source:value.source===null?null:{name:value.source.name,content:value.source.content}};
 }
 const same=(a,b)=>a.scope===b.scope&&a.revision===b.revision&&a.source?.name===b.source?.name&&a.source?.content===b.source?.content;
 const allowed=s=>s.visible&&!s.busy&&!s.dirty&&s.source!==null;
 function createController({capture,describe,readFile,onState=()=>{},onReport=()=>{},onError=()=>{},maxBytes=P.maxBytes}){
  if(!Number.isSafeInteger(maxBytes)||maxBytes<1||maxBytes>P.maxBytes)throw Error('原文核對容量無效');
  let sequence=0,pending=false,before=null,selected=null,report=null,difference=null,disposed=false,activeReads=0,contextRevision=0,lastContext=null,message='選回已保存的檔案，核對完整原文；目前成果與編修保留。';
  const read=()=>snapshot(capture());
  function view(){const now=read();if(!lastContext||!same(lastContext,now)){lastContext=now;contextRevision++;}return {available:!disposed&&allowed(now)&&activeReads<2,pending,waitingForReads:!pending&&activeReads>=2,contextRevision,expectedName:now.source?.name||null,selected:selected?{...selected}:null,report:report?{...report}:null,difference:difference?{...difference,expected:{...difference.expected},selected:{...difference.selected}}:null,message};}
  const emit=()=>onState(view());
  function clear(note){sequence++;pending=false;before=null;selected=null;report=null;difference=null;message=note;}
  function refresh(){if(disposed)return;const now=read();if(before&&(!same(before,now)||!allowed(now)))clear('核對來源或操作狀態已改變，請選回檔案重新核對。');emit();}
  return {view,refresh,cancel(){if(disposed)return;clear('已取消原文核對；目前成果與編修保留。');emit();},dispose(){if(disposed)return;clear('此頁核對已關閉。');disposed=true;lastContext=null;},
   async verify(file){if(disposed)return false;const source=read();if(!allowed(source)||activeReads>=2)return false;const token=++sequence;let ownsRead=false;before=source;pending=true;selected=null;report=null;difference=null;message='正在讀取選定原文並核對…';emit();
    const current=()=>{const now=read();return !disposed&&token===sequence&&allowed(now)&&same(source,now);};
    try{
     const info=P.metadata(describe(file));if(info.size>maxBytes)throw Error(`選定檔案超過本次核對上限 ${maxBytes} bytes；原內容保留。`);selected=info;emit();
     activeReads++;ownsRead=true;const bytes=await readFile(file);if(!current())return false;
     const after=P.metadata(describe(file));if(info.name!==after.name||info.size!==after.size||!ArrayBuffer.isView(bytes)||bytes.byteLength!==info.size)throw Error('選定檔案讀取不完整或已變更；請重新選檔。');
     const result=P.inspectWithContext(source.source,bytes);if(!current())return false;const checked=result.report;
     report=checked;difference=result.context;message=checked.matched?`選定檔案與 ${checked.expected_name} 原文位元組完全一致（${checked.expected_bytes} bytes）。請繼續保留這份檔案。`:`選定檔案與 ${checked.expected_name} 不一致；第一個差異在 byte ${checked.first_difference_byte}（從0起）。目前 ${checked.expected_bytes} bytes，選定 ${checked.selected_bytes} bytes。`;
     onReport({...checked},{...info});return true;
    }catch(error){if(current()){message=error.message;onError(error);}return false;}
    finally{if(ownsRead)activeReads--;if(token===sequence&&!disposed){pending=false;if(!current())clear('核對期間核對來源或操作狀態已改變，請重新核對。');emit();}else if(ownsRead&&!disposed)refresh();}
   }};
 }
 const api=Object.freeze({snapshot,createController});if(typeof module==='object'&&module.exports)module.exports=api;else root.MusicTextVerificationController=api;
})(typeof globalThis==='object'?globalThis:this);
