// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
 const node=typeof module==='object'&&module.exports;
 const model=node?require('./backup-selection.js'):root.MusicBackupSelection;
 function bind(document,{capture,onError=()=>{},onChange=()=>{},events=root}){
  const add=document.getElementById('backup-selection-add'),clear=document.getElementById('backup-selection-clear'),list=document.getElementById('backup-selection-list'),note=document.getElementById('backup-selection-note');
  let rendered=[],buttons=[],disposed=false,canDownload=null;
  const controller=model.createController({capture,onError,onState:view=>{
   add.disabled=!view.canAdd;clear.disabled=!view.canClear;
   note.textContent=view.count?`已選 ${view.count} 版；可繼續搜尋其他版本加入，下載時固定這份清單。`:'尚未加入版本；從上方保存版本選單選擇，再加入備份清單。';
   const changed=JSON.stringify(rendered)!==JSON.stringify(view.entries),availabilityChanged=canDownload!==view.canDownload;canDownload=view.canDownload;
   if(changed){
    rendered=view.entries.map(e=>({...e}));buttons=[];list.replaceChildren();
    for(const entry of rendered){
     const item=document.createElement('li'),label=document.createElement('span'),remove=document.createElement('button');
     label.textContent=`${entry.label} · ${entry.stored_at} · ${entry.id}`;remove.type='button';remove.className='subtle';remove.textContent='移出清單';remove.setAttribute('aria-label',`移出備份清單：${entry.label} · ${entry.id}`);
     remove.onclick=()=>{const focused=document.activeElement===remove,index=buttons.indexOf(remove);if(controller.remove(entry.id)&&focused)(buttons[Math.min(index,buttons.length-1)]||(!add.disabled?add:list)).focus();};
     item.append(label,remove);list.append(item);buttons.push(remove);
    }
   }
   for(const button of buttons)button.disabled=!view.canClear;
   if(changed||availabilityChanged)onChange();
  }});
  add.onclick=()=>controller.add();clear.onclick=()=>{const focused=document.activeElement===clear;if(controller.clear()&&focused)(!add.disabled?add:list).focus();};controller.refresh();
  function dispose(){if(disposed)return;disposed=true;add.onclick=null;clear.onclick=null;controller.dispose();for(const button of buttons)button.onclick=null;events.removeEventListener('pagehide',dispose);}
  events.addEventListener('pagehide',dispose);
  return {refresh:()=>!disposed&&controller.refresh(),request:()=>disposed?null:controller.request(),dispose};
 }
 const api=Object.freeze({bind});if(node)module.exports=api;else root.MusicBackupSelectionDom=api;
})(typeof globalThis==='object'?globalThis:this);
