// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
  const C=typeof module==='object'&&module.exports?require('./current-cue.js'):root.MusicCurrentCue;
  function bind({button,note,lyric,capture,focusTarget,highlight,onFocused=()=>{},onError=()=>{}}){
    const controller=C.createController({capture,focusTarget,onFocused,onError,onView:view=>{
      button.disabled=!view.canFocus;
      const text=view.id!==null&&view.text===''?'（這句文字留白）':view.text;
      if(lyric.textContent!==text)lyric.textContent=text;
      if(note.textContent!==view.note)note.textContent=view.note;
      highlight(view.id);
    }});
    const click=()=>controller.focus();button.addEventListener('click',click);controller.refresh();
    return {refresh:controller.refresh,focus:controller.focus,dispose(){button.removeEventListener('click',click);controller.dispose();}};
  }
  function createHighlight({resolveRow}){
    let current=null,disposed=false;
    return {update(id){
      if(disposed)return;
      if(id!==null&&(typeof id!=='string'||!id||id.length>64))throw Error('目前句子的列識別不完整');
      const next=id===null?null:current?.isConnected&&current.dataset.historyId===id?current:resolveRow(id);
      if(current!==next){current?.classList.remove('playing');current=next;}
      if(current&&!current.classList.contains('playing'))current.classList.add('playing');
    },dispose(){current?.classList.remove('playing');current=null;disposed=true;}};
  }
  function bindPlayback({button,note,lyric,container,captureContext,captureRows,resolveRow,focusTarget,onFocused=()=>{},onError=()=>{}}){
    const marker=createHighlight({resolveRow});
    const controller=C.createPlaybackController({captureContext,captureRows,focusTarget,onFocused,onError,onView:view=>{
      button.disabled=!view.canFocus;
      const text=view.id!==null&&view.text===''?'（這句文字留白）':view.text;
      if(lyric.textContent!==text)lyric.textContent=text;
      if(note.textContent!==view.note)note.textContent=view.note;
      marker.update(view.id);
    }});
    const click=()=>controller.focus(),input=()=>{controller.invalidate();controller.refresh();};
    button.addEventListener('click',click);container.addEventListener('input',input);controller.refresh();
    return {refresh:controller.refresh,invalidate:controller.invalidate,focus:controller.focus,dispose(){
      button.removeEventListener('click',click);container.removeEventListener('input',input);controller.dispose();marker.dispose();
    }};
  }
  const api=Object.freeze({bind,bindPlayback,createHighlight});if(typeof module==='object'&&module.exports)module.exports=api;else root.MusicCurrentCueDOM=api;
})(typeof globalThis==='object'?globalThis:this);
