// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
  const E=typeof module==='object'&&module.exports?require('./cue-stamp-edit.js'):root.MusicCueStampEdit;
  const labels={start:'記下開始',end:'記下結束',move:'整句移動'};
  function bind({button,note,readRow,writeTimes,captureMedia,position,busy=()=>false,onChanged=()=>{},onError=()=>{}}){
    const controller=E.createController({readRow,writeTimes,captureMedia,onError,onState:view=>{
      button.disabled=busy()||!view.canUndo;
      const index=view.id===null?null:position(view.id);
      note.textContent=view.reason?`${view.reason}；舊標記撤回已停用，原編修保留。`:view.canUndo?
        `可撤回第 ${index} 句${labels[view.action]}；只還原該句開始與結束，文字與其他編修保留。`:'只撤回最近一次逐句標記；載入新歌詞後清除，不包含整批校時。';
    }});
    function change(call){if(busy())return false;const result=call();if(result&&result.changed)onChanged({...result});return result;}
    const undo=()=>change(()=>controller.undo());button.addEventListener('click',undo);
    controller.refresh();return {stamp:(id,action)=>change(()=>controller.stamp(id,action)),refresh:controller.refresh,clear:controller.clear,
      dispose(){button.removeEventListener('click',undo);controller.dispose();}};
  }
  const api=Object.freeze({bind});if(typeof module==='object'&&module.exports)module.exports=api;else root.MusicCueStampEditDOM=api;
})(typeof globalThis==='object'?globalThis:this);
