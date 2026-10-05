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
  const api=Object.freeze({bind});if(typeof module==='object'&&module.exports)module.exports=api;else root.MusicCurrentCueDOM=api;
})(typeof globalThis==='object'?globalThis:this);
