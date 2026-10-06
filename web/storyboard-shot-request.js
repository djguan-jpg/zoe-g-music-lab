// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
 const Review=typeof module==='object'&&module.exports?require('./storyboard-shot-review.js'):root.MusicStoryboardShotReview;
 function createController({source,request,onReport,onError=()=>{},onStale=()=>{},onState=()=>{}}){
  let sequence=0,pending=false;
  const publish=()=>onState({pending});
  function invalidate(){sequence++;pending=false;publish();}
  async function check(isCurrent=()=>true){
   const id=++sequence;pending=true;publish();let payload=null;
   const active=()=>id===sequence&&isCurrent()===true;
   const current=()=>active()&&payload!==null&&source.isCurrent(payload);
   const stale=()=>{if(active())onStale();return false;};
   try{
    payload=source.payload();source.check();if(!current())return stale();
    const reply=await request(structuredClone(payload),isCurrent);
    if(!current())return stale();
    const accepted=Review.checkedResult(payload,reply);
    if(!current())return stale();
    onReport(accepted);return true;
   }catch(error){
    if(active()){
     if(payload!==null&&!source.isCurrent(payload))return stale();
     onError(error);
    }
    return false;
   }finally{if(id===sequence){pending=false;publish();}}
  }
  return Object.freeze({check,invalidate});
 }
 const api=Object.freeze({createController});if(typeof module==='object'&&module.exports)module.exports=api;else root.MusicStoryboardShotRequest=api;
})(typeof globalThis==='object'?globalThis:this);
