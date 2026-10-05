// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
  const P=typeof module==='object'&&module.exports?require('./editor-keys.js'):root.MusicEditorKeys;
  const scopes=Object.freeze({arrangement:'music',shots:'storyboard',cues:'lyrics'});
  function bind(document,{busy,onMove,onError=()=>{}}){
    const get=id=>document.getElementById(id),listeners=[];let bookmark=null,disposed=false;
    function allowed(list){const container=get(list),panel=get(scopes[list]);return !disposed&&!!container&&!!panel&&container.isConnected&&panel.isConnected&&!panel.hidden&&!busy();}
    function editable(target){return !!target&&target.isConnected&&!target.disabled&&!target.readOnly&&!target.hidden&&(target.tagName==='TEXTAREA'||target.tagName==='INPUT'&&target.type==='text');}
    const fields=row=>[...row.querySelectorAll('input,textarea')];
    const controller=P.createController({allowed,capture:list=>({ids:[...get(list).children].map(r=>r.dataset.historyId),visible:allowed(list),busy:busy()}),
      moveTarget:plan=>!!bookmark&&bookmark.target===document.activeElement&&editable(bookmark.target)&&onMove(plan.list,plan.id,plan.delta)===true,
      onMoved:plan=>{
        const row=get(plan.list).children[plan.index],target=row&&fields(row)[bookmark.index];
        if(!allowed(plan.list)||row?.dataset.historyId!==plan.id||!editable(target)||target.tagName!==bookmark.tag||target.value!==bookmark.display||(document.activeElement!==document.body&&document.activeElement!==bookmark.target))return;
        target.focus();
        if(document.activeElement===target&&bookmark.selection&&typeof target.setSelectionRange==='function')target.setSelectionRange(...bookmark.selection);
      },onError});
    for(const list of Object.keys(scopes)){
      const container=get(list),listener=event=>{
        if(event.defaultPrevented||!allowed(list))return;
        const gesture=Object.fromEntries(['key','altKey','ctrlKey','metaKey','shiftKey','repeat','isComposing','keyCode'].map(k=>[k,event[k]]));
        try{
          if(!P.delta(gesture))return;const target=event.target,row=target?.closest('[data-history-id]');
          if(!editable(target)||target!==document.activeElement||!row?.isConnected||row.parentElement!==container||!row.contains(target))return;
          const index=fields(row).indexOf(target);if(index<0||index>=16)return;
          const display=target.value;if(typeof display!=='string'||display.length>8*1024*1024)return;
          const start=target.selectionStart,end=target.selectionEnd,direction=target.selectionDirection;
          const selection=Number.isSafeInteger(start)&&Number.isSafeInteger(end)&&start>=0&&end>=start&&end<=display.length&&['forward','backward','none'].includes(direction)?[start,end,direction]:null;
          bookmark={target,index,tag:target.tagName,display,selection};
          try{controller.request(list,row.dataset.historyId,gesture,()=>{event.preventDefault();return event.defaultPrevented===true;});}finally{bookmark=null;}
        }catch(error){onError(error);}
      };
      container.addEventListener('keydown',listener);listeners.push([container,listener]);
    }
    return Object.freeze({dispose(){disposed=true;bookmark=null;controller.dispose();for(const [container,listener] of listeners)container.removeEventListener('keydown',listener);}});
  }
  const api=Object.freeze({bind});if(typeof module==='object'&&module.exports)module.exports=api;else root.MusicEditorKeysDOM=api;
})(typeof globalThis==='object'?globalThis:this);
