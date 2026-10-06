// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
 const node=typeof module==='object'&&module.exports;
 const model=node?require('./backup-selection.js'):root.MusicBackupSelection;
 function bind(document,{capture,onError=()=>{},onChange=()=>{},events=root}){
  const add=document.getElementById('backup-selection-add'),clear=document.getElementById('backup-selection-clear'),list=document.getElementById('backup-selection-list'),note=document.getElementById('backup-selection-note');
  const bulk=document.getElementById('backup-selection-add-displayed'),bulkNote=document.getElementById('backup-selection-displayed-note');
  let rendered=[],buttons=[],disposed=false,canDownload=null;
  const controller=model.createController({capture,onError,onState:view=>{
   add.disabled=!view.canAdd;clear.disabled=!view.canClear;
   if(bulk){bulk.disabled=!view.canAddDisplayed;bulk.textContent=`加入目前顯示版本（${view.displayedCount} 版）`;}
   if(bulkNote)bulkNote.textContent=view.displayedProblem||`只加入上方選單已載入的 ${view.displayedCount} 版，其中 ${view.newDisplayedCount} 版尚未加入；不包含尚未讀取的搜尋結果或更早版本。需要其他版本時，先在上方讀取其他版本再加入。`;
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
  function focusAfter(control,changed){if(changed&&document.activeElement===control&&control.disabled){const batch=document.getElementById('backup-save-batch');(bulk&&!bulk.disabled?bulk:batch&&!batch.disabled?batch:!clear.disabled?clear:!add.disabled?add:list).focus();}return changed;}
  add.onclick=()=>focusAfter(add,controller.add());if(bulk)bulk.onclick=()=>focusAfter(bulk,controller.addDisplayed());clear.onclick=()=>{const focused=document.activeElement===clear;if(controller.clear()&&focused)(!add.disabled?add:list).focus();};controller.refresh();
  function dispose(){if(disposed)return;disposed=true;add.onclick=null;if(bulk)bulk.onclick=null;clear.onclick=null;controller.dispose();for(const button of buttons)button.onclick=null;events.removeEventListener('pagehide',dispose);}
  events.addEventListener('pagehide',dispose);
  return {refresh:()=>!disposed&&controller.refresh(),request:()=>disposed?null:controller.request(),dispose};
 }
 const api=Object.freeze({bind});if(node)module.exports=api;else root.MusicBackupSelectionDom=api;
})(typeof globalThis==='object'?globalThis:this);
