// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
 const P=typeof module==='object'&&module.exports?require('./text-verification-controller.js'):root.MusicTextVerificationController;
 const F=typeof module==='object'&&module.exports?require('./verification-focus.js'):root.MusicVerificationFocus;
 function bind(document,{capture,onReport,onError,events=root,FileType=root.File,maxBytes,ids={file:'text-verify-file',note:'text-verify-note',source:'text-verify-source',cancel:'text-verify-cancel'},emptyText='先建立並選擇一個成果檔案。',sourceLabel='目前成果：'}={}){
  const file=document.getElementById(ids.file),note=document.getElementById(ids.note),source=document.getElementById(ids.source),cancel=ids.cancel?document.getElementById(ids.cancel):null;
  let focusController=null;
  const clearFocus=()=>focusController?.clear();
  const focus=element=>{try{element.focus?.();return document.activeElement===element;}catch{return false;}};
  const focusView=view=>({available:view.available,pending:view.pending,waiting:view.waitingForReads,contextRevision:view.contextRevision});
  if(cancel){if(!note.hasAttribute?.('tabindex'))note.setAttribute?.('tabindex','-1');note.addEventListener?.('blur',clearFocus);}
  const native=value=>{if(!FileType||!(value instanceof FileType))throw Error('請明確選定本機檔案後核對');return value;};
  const controller=P.createController({capture,onReport,onError,maxBytes,describe:value=>{const f=native(value);return {name:f.name,size:f.size};},readFile:async value=>new Uint8Array(await native(value).arrayBuffer()),
   onState:view=>{file.disabled=!view.available||view.pending;if(cancel)cancel.disabled=!view.pending;source.textContent=view.expectedName?`${sourceLabel}${view.expectedName}`:emptyText;note.textContent=(view.selected?`選定：${view.selected.name} · `:'')+view.message+(view.waitingForReads?' 仍有檔案正在讀取，完成後可再選檔。':'');note.dataset.match=view.report===null?'unknown':String(view.report.matched);
    focusController?.refresh(focusView(view));
   }});
  if(cancel)focusController=F.createController({capture:()=>focusView(controller.view()),noteFocused:()=>document.activeElement===note,focusPicker:()=>focus(file),focusNote:()=>focus(note)});
  file.onchange=()=>{clearFocus();const value=file.files[0];file.value='';if(value){focusController?.selected();void controller.verify(value);}};
  if(cancel)cancel.onclick=()=>{clearFocus();controller.cancel();focusController.cancelled();};
  const leave=()=>{clearFocus();controller.cancel();};events.addEventListener('pagehide',leave);controller.refresh();
  return {refresh:controller.refresh,dispose(){focusController?.dispose();events.removeEventListener('pagehide',leave);file.onchange=null;if(cancel){cancel.onclick=null;cancel.disabled=true;note.removeEventListener?.('blur',clearFocus);}controller.dispose();}};
 }
 const api=Object.freeze({bind});if(typeof module==='object'&&module.exports)module.exports=api;else root.MusicTextVerificationDOM=api;
})(typeof globalThis==='object'?globalThis:this);
