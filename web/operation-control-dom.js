// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
  function createAdapter(document,{capture,cancel}){
    const button=document.getElementById('operation-cancel'),note=document.getElementById('operation-note'),bar=document.getElementById('operation-bar'),title=document.getElementById('operation-title'),model=root.MusicOperationPresentation;let focusPending=false,selected=null;
    function begin(value){selected=model.context(value);}
    function refresh(){
      const view=capture();
      if(view.busy)focusPending=false;else if(document.activeElement===button)focusPending=true;
      const display=model.describe(view,selected);button.disabled=!display.canCancel;button.hidden=!display.visible;note.hidden=!display.visible;
      bar.hidden=!display.visible;title.textContent=display.title;note.textContent=display.note;if(!view.busy)selected=null;
      return view;
    }
    button.onclick=()=>{if(refresh().canCancel)cancel();};
    function finishFocus(target){
      const wanted=focusPending;focusPending=false;
      if(!wanted||!target?.isConnected||target.disabled||target.closest('[hidden]')||document.activeElement!==document.body&&document.activeElement!==button)return false;
      target.focus({preventScroll:true});return document.activeElement===target;
    }
    refresh();return {begin,refresh,finishFocus};
  }
  root.MusicOperationControlDOM={createAdapter};
})(typeof globalThis==='object'?globalThis:this);
