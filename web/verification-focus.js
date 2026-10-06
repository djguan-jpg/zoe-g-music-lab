// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
 function createController({capture,noteFocused,focusPicker,focusNote}){
  if([capture,noteFocused,focusPicker,focusNote].some(f=>typeof f!=='function'))throw Error('核對焦點介面未設定');
  let invitation=null,disposed=false;
  const clear=()=>{invitation=null;};
  function checked(view){return view&&['available','pending','waiting'].every(k=>typeof view[k]==='boolean')&&Number.isSafeInteger(view.contextRevision)&&view.contextRevision>0?{available:view.available,pending:view.pending,waiting:view.waiting,contextRevision:view.contextRevision}:null;}
  const attempt=fn=>{try{return fn()===true;}catch{return false;}};
  function refresh(view){
   if(disposed)return;const now=checked(view);
   if(!now||invitation!==null&&(now.contextRevision!==invitation||!attempt(noteFocused)||now.pending||!now.available&&!now.waiting))clear();
   if(invitation!==null&&now.available&&!now.pending){clear();attempt(focusPicker);}
  }
  function cancelled(){
   clear();if(disposed)return;let now;try{now=checked(capture());}catch{return;}if(!now||now.pending)return;
   if(now.available){if(!attempt(focusPicker))attempt(focusNote);}
   else if(attempt(focusNote)&&now.waiting)invitation=now.contextRevision;
  }
  function selected(){
   clear();if(disposed)return;let now;try{now=checked(capture());}catch{return;}if(!now||now.pending||!now.available)return;
   attempt(focusNote);
  }
  return {clear,refresh,cancelled,selected,dispose(){clear();disposed=true;}};
 }
 const api=Object.freeze({createController});if(typeof module==='object'&&module.exports)module.exports=api;else root.MusicVerificationFocus=api;
})(typeof globalThis==='object'?globalThis:this);
