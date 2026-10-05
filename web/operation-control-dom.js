// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
  function createAdapter(document,{capture,cancel}){
    const button=document.getElementById('operation-cancel'),note=document.getElementById('operation-note');let focusPending=false;
    function refresh(){
      const view=capture();
      if(view.busy)focusPending=false;else if(document.activeElement===button)focusPending=true;
      button.disabled=!view.canCancel;button.hidden=!view.busy;note.hidden=!view.busy;
      note.textContent=view.cancelling?'正在取消等待；目前編修與上一份成果保留。':'取消等待會保留目前編修與上一份成果；完成後可重新建立。';
      return view;
    }
    button.onclick=()=>{if(refresh().canCancel)cancel();};
    function finishFocus(target){
      const wanted=focusPending;focusPending=false;
      if(!wanted||!target?.isConnected||target.disabled||target.closest('[hidden]')||document.activeElement!==document.body&&document.activeElement!==button)return false;
      target.focus({preventScroll:true});return document.activeElement===target;
    }
    refresh();return {refresh,finishFocus};
  }
  root.MusicOperationControlDOM={createAdapter};
})(typeof globalThis==='object'?globalThis:this);
