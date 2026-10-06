// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
 const J=typeof module==='object'&&module.exports?require('../musiclab/assets/json-document.js'):root.MusicJsonDocument;
 const keys=['busy','detailCount','hasReport','revision','stale','visible'];
 const defaultMessages={missing:'先檢查選定鏡頭待辦，再逐項定位。',stale:'選定來源已有修改，請重查這一鏡。',empty:'這一鏡沒有欄位待辦；仍須整份分鏡驗證。',progress:'這一鏡待辦'};
 function checkedMessages(value){
  if(!value||!J.sameValue(value,value)||!J.sameValue(Object.keys(value).sort(),['empty','missing','progress','stale'])||!Object.values(value).every(v=>typeof v==='string'&&v.length>0&&v.length<=1024))throw Error('待辦定位訊息無效；原內容保留');
  return {...value};
 }
 function checked(value){
  if(!value||!J.sameValue(value,value)||!J.sameValue(Object.keys(value).sort(),keys)||!Number.isSafeInteger(value.detailCount)||value.detailCount<0||value.detailCount>32||!Number.isSafeInteger(value.revision)||value.revision<0||!['hasReport','stale','busy','visible'].every(k=>typeof value[k]==='boolean')||!value.hasReport&&value.detailCount!==0)throw Error('單鏡待辦定位狀態無效；原內容保留');
  return {...value};
 }
 function createController({capture,onLocate,onState=()=>{},messages=defaultMessages}){
  const text=checkedMessages(messages);
  let index=null,revision=null,count=null;
  function read(){const source=checked(capture());if(source.revision!==revision||source.detailCount!==count){index=null;revision=source.revision;count=source.detailCount;}return source;}
  const allowed=s=>s.hasReport&&!s.stale&&!s.busy&&s.visible&&s.detailCount>0;
  function publish(s){
   const ready=allowed(s),view={index,revision:s.revision,detailCount:s.detailCount,canPrevious:ready&&index!==null&&index>0,canNext:ready&&(index===null||index<s.detailCount-1),
    message:!s.hasReport?text.missing:s.stale?text.stale:s.detailCount===0?text.empty:`${text.progress} ${index===null?'尚未定位':`${index+1}／${s.detailCount}`}；上一項／下一項只定位原欄位。`};
   onState({...view});return view;
  }
  function locate(target,expectedRevision){
   const before=read();if(!allowed(before)||expectedRevision!==undefined&&expectedRevision!==before.revision||!Number.isSafeInteger(target)||target<0||target>=before.detailCount){publish(before);return false;}
   const moved=onLocate(target,before.revision)===true,after=read();
   if(moved&&allowed(after)&&after.revision===before.revision&&after.detailCount===before.detailCount){index=target;publish(after);return true;}
   publish(after);return false;
  }
  return Object.freeze({refresh(){return publish(read());},locate,move(direction){if(direction!==1&&direction!==-1)return false;const s=read();return locate(index===null?(direction===1?0:-1):index+direction,s.revision);}});
 }
 const api=Object.freeze({createController});if(typeof module==='object'&&module.exports)module.exports=api;else root.MusicIssueCursor=api;
})(typeof globalThis==='object'?globalThis:this);
