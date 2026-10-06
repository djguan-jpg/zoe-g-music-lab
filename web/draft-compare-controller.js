// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
 const node=typeof module==='object'&&module.exports;
 const Model=node?require('./draft-compare.js'):root.MusicDraftCompare;
 const Json=node?require('../musiclab/assets/json-document.js'):root.MusicJsonDocument;
 function create({capture,gate,model=Model,generate=model.compare,onState=()=>{},onReady=()=>{},onError=()=>{}}){
  let sequence=0,job=null,report=null,stamp=null,stale=false,disposed=false;
  function gateSnapshot(){const v=gate();return {identity:v.identity,revision:[...(v.revision||[])],media:[...(v.media||[])],tab:v.tab,allowed:v.allowed===true,visible:v.visible===true};}
  const sameGate=(a,b)=>a.identity===b.identity&&a.tab===b.tab&&a.revision.length===b.revision.length&&a.revision.every((v,i)=>v===b.revision[i])&&a.media.length===b.media.length&&a.media.every((v,i)=>v===b.media[i]);
  const contentKey=payload=>model.canonical({...payload,baseline:{...payload.baseline,saved_at:''}});
  function publish(){onState({busy:!!job,ready:!!report&&!stale,stale,available:!disposed&&gateSnapshot().allowed&&gateSnapshot().visible});}
  function invalidate(){if(disposed)return;const active=!!job||!!report;sequence++;job=null;if(active)stale=true;publish();}
  function current(selected){const now=gateSnapshot();return !disposed&&selected.token===sequence&&now.allowed&&now.visible&&sameGate(selected.gate,now);}
  const ownsJob=selected=>!disposed&&job===selected&&selected.token===sequence;
  function refresh(){if(disposed)return;const now=gateSnapshot();if(job&&!current(job))invalidate();else if(stamp&&(!now.allowed||!now.visible||!sameGate(stamp.gate,now))){stale=true;publish();}else publish();}
  function checkedCurrent(){
   if(!report||stale||!stamp||!current(stamp)){if(report&&!disposed){stale=true;publish();}throw Error('工作台或預覽已有變更；請重新預覽後比較，原內容保留');}
   let key,payload;
   try{payload=model.prepare(capture());key=contentKey(payload);}catch(error){stale=true;publish();throw error;}
   if(key!==stamp.key){stale=true;publish();throw Error('比較來源已有變更；請重新預覽後比較');}
   return payload;
  }
  async function run(){
   if(disposed||job)return false;
   let selected;
   try{
    const start=gateSnapshot();if(!start.allowed||!start.visible)throw Error('請先預覽完整 v3 草稿，並等待目前操作結束');
    const payload=model.prepare(capture());selected={token:++sequence,gate:start,key:contentKey(payload)};
    job=selected;report=null;stamp=null;stale=false;publish();
    const received=await generate(payload);
    if(!ownsJob(selected))return false;
    if(!current(selected)){stale=true;return false;}
    if(contentKey(model.prepare(capture()))!==selected.key)throw Error('比較期間來源已有編修，原內容保留；請重新預覽');
    report=structuredClone(received);stamp=selected;onReady(structuredClone(report));return true;
   }catch(error){if(!disposed&&(!selected||ownsJob(selected))){if(!selected&&report){stale=true;publish();}if(!selected||current(selected))onError(error);else stale=true;}return false;}
   finally{if(job===selected){job=null;publish();}}
  }
  return {run,refresh,invalidate,cancel:invalidate,clear(){sequence++;job=null;report=null;stamp=null;stale=false;if(!disposed)publish();},
   read(){checkedCurrent();return structuredClone(report);},readPayload(){return structuredClone(checkedCurrent());},dispose(){sequence++;job=null;report=null;stamp=null;disposed=true;}};
 }
 const api={create};if(node)module.exports=api;else root.MusicDraftCompareController=api;
})(typeof globalThis==='object'?globalThis:this);
