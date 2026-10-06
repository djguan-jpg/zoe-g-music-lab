// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
  const P=typeof module==='object'&&module.exports?require('./editor-copy.js'):root.MusicEditorCopy;
  function bind(document,{busy,capture,newId,apply,onCopied,onUndone,onError}={}){
    const get=id=>document.getElementById(id),listeners=[];
    function visible(list){const container=get(list),panel=get(P.specs[list].scope);return !!container&&!!panel&&container.isConnected&&panel.isConnected&&!panel.hidden;}
    function allowed(list){return visible(list)&&!busy()&&get(list).children.length<P.specs[list].limit;}
    const prefixes={arrangement:'section',shots:'shot',cues:'cue'};
    function refresh(){for(const list of Object.keys(P.specs)){
      get(list).querySelectorAll('[data-copy-entry]').forEach(button=>{button.disabled=!allowed(list);});
      const button=get(prefixes[list]+'-copy-undo'),note=get(prefixes[list]+'-copy-undo-note'),view=controller.view(list);
      if(button)button.disabled=!view.canUndo;
      if(note)note.textContent=view.canUndo?'可撤回最近複製；其他原列編修保留。撤回前會核對複製列未修改、列數及順序。':'複製後可撤回最近一筆；每個工作台各自保留，載入新內容後清除。';
    }}
    const controller=P.createController({allowed,allowedUndo:list=>visible(list)&&!busy(),capture:list=>({entries:capture(list),visible:visible(list),busy:busy()}),newId,apply,
      onCopied:(...args)=>{onCopied?.(...args);refresh();},onUndone:(...args)=>{onUndone?.(...args);refresh();},onError:error=>{onError?.(error);refresh();}});
    for(const list of Object.keys(P.specs)){
      const container=get(list),listener=event=>{
        const button=event.target?.closest?.('[data-copy-entry]'),row=button?.closest('[data-history-id]');
        if(!button||button.disabled||!button.isConnected||!row||row.parentElement!==container||!row.contains(button))return;
        controller.copy(list,row.dataset.historyId);
      };
      container.addEventListener('click',listener);listeners.push([container,listener]);
      const undo=get(prefixes[list]+'-copy-undo');
      if(undo){const listener=()=>{if(!undo.disabled&&undo.isConnected)controller.undo(list);};undo.addEventListener('click',listener);listeners.push([undo,listener]);}
    }
    return Object.freeze({refresh,clear(scope){for(const [list,spec] of Object.entries(P.specs))if(scope===undefined||scope===spec.scope)controller.clear(list);refresh();},
      dispose(){controller.dispose();for(const [container,listener] of listeners)container.removeEventListener('click',listener);}});
  }
  const api=Object.freeze({bind});if(typeof module==='object'&&module.exports)module.exports=api;else root.MusicEditorCopyDOM=api;
})(typeof globalThis==='object'?globalThis:this);
