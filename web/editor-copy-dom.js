// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
  const P=typeof module==='object'&&module.exports?require('./editor-copy.js'):root.MusicEditorCopy;
  function bind(document,{busy,capture,newId,apply,onCopied,onError}={}){
    const get=id=>document.getElementById(id),listeners=[];
    function visible(list){const container=get(list),panel=get(P.specs[list].scope);return !!container&&!!panel&&container.isConnected&&panel.isConnected&&!panel.hidden;}
    function allowed(list){return visible(list)&&!busy()&&get(list).children.length<P.specs[list].limit;}
    const controller=P.createController({allowed,capture:list=>({entries:capture(list),visible:visible(list),busy:busy()}),newId,apply,onCopied,onError});
    for(const list of Object.keys(P.specs)){
      const container=get(list),listener=event=>{
        const button=event.target?.closest?.('[data-copy-entry]'),row=button?.closest('[data-history-id]');
        if(!button||button.disabled||!button.isConnected||!row||row.parentElement!==container||!row.contains(button))return;
        controller.copy(list,row.dataset.historyId);
      };
      container.addEventListener('click',listener);listeners.push([container,listener]);
    }
    return Object.freeze({refresh(){for(const list of Object.keys(P.specs))get(list).querySelectorAll('[data-copy-entry]').forEach(button=>{button.disabled=!allowed(list);});},
      dispose(){controller.dispose();for(const [container,listener] of listeners)container.removeEventListener('click',listener);}});
  }
  const api=Object.freeze({bind});if(typeof module==='object'&&module.exports)module.exports=api;else root.MusicEditorCopyDOM=api;
})(typeof globalThis==='object'?globalThis:this);
