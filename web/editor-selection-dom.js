// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
  const P=typeof module==='object'&&module.exports?require('./editor-selection.js'):root.MusicEditorSelection;
  const scopes=Object.freeze({arrangement:'music',shots:'storyboard',cues:'lyrics'}),selects=Object.freeze({arrangement:'section-order',shots:'shots-order',cues:'cues-order'});
  function bind(document,{busy,onSelection,onError=()=>{}}){
    const get=id=>document.getElementById(id),listeners=[];let active=null;
    function allowed(list){const panel=get(scopes[list]),container=get(list);return !!panel&&!!container&&panel.isConnected&&container.isConnected&&!panel.hidden&&!busy();}
    const controller=P.createController({allowed,onError,capture:list=>({ids:[...get(list).children].map(r=>r.dataset.historyId),visible:allowed(list),busy:busy()}),selectTarget:target=>{
      const container=get(target.list),row=container.children[target.index];
      if(!allowed(target.list)||!active||active!==document.activeElement||!active.isConnected||active.disabled||active.hidden||row?.dataset.historyId!==target.id||!row.contains(active))return false;
      if(onSelection(target.list,target.id,target.index)!==true)return false;
      return get(selects[target.list]).value===target.id;
    }});
    function sync(list,target){
      const container=get(list),row=target?.closest('[data-history-id]');
      if(!P.lists.includes(list)||!allowed(list)||!row||row.parentElement!==container||!row.isConnected||!target.isConnected||target.disabled||target.hidden||target!==document.activeElement||!row.contains(target))return false;
      active=target;try{return controller.select(list,row.dataset.historyId);}finally{active=null;}
    }
    for(const list of P.lists){const container=get(list),listener=event=>sync(list,event.target);container.addEventListener('focusin',listener);listeners.push([container,listener]);}
    return Object.freeze({refresh(){const target=document.activeElement,row=target?.closest('[data-history-id]'),list=row?.parentElement?.id;return P.lists.includes(list)?sync(list,target):false;},dispose(){controller.dispose();active=null;for(const [container,listener] of listeners)container.removeEventListener('focusin',listener);}});
  }
  const api=Object.freeze({bind});if(typeof module==='object'&&module.exports)module.exports=api;else root.MusicEditorSelectionDOM=api;
})(typeof globalThis==='object'?globalThis:this);
