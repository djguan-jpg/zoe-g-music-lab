// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
 const node=typeof module==='object'&&module.exports;
 const P=node?require('./backup-verification-controller.js'):root.MusicBackupVerificationController;
 const F=node?require('./backup-file.js'):root.MusicBackupFile;
 const Focus=node?require('./verification-focus.js'):root.MusicVerificationFocus;
 function bind(document,{capture,events=root,FileType=root.File,hash=F.sha256,onError=()=>{}}){
  const file=document.getElementById('backup-verify-file'),source=document.getElementById('backup-verify-source'),note=document.getElementById('backup-verify-note'),cancel=document.getElementById('backup-verify-cancel');
  let focusController=null;
  const clearFocus=()=>focusController?.clear(),focus=element=>{try{element.focus?.();return document.activeElement===element;}catch{return false;}};
  const focusView=view=>({available:view.available,pending:view.pending,waiting:view.waitingForWork,contextRevision:view.contextRevision});
  if(!note.hasAttribute?.('tabindex'))note.setAttribute?.('tabindex','-1');note.addEventListener?.('blur',clearFocus);
  const native=value=>{if(!FileType||!(value instanceof FileType))throw Error('請明確選回本機備份檔案後核對');return value;};
  const controller=P.createController({capture,describe:value=>{const f=native(value);return {name:f.name,size:f.size};},readFile:value=>native(value).arrayBuffer(),hash,onError,
   onState:view=>{file.disabled=!view.available||view.pending;cancel.disabled=!view.pending;source.textContent=view.source?`本輪備份：${view.source.entry_count} 版 · ${view.source.bytes} bytes · SHA-256 ${view.source.sha256}`:'尚無已送出的備份 ZIP。';note.textContent=(view.selected?`選定：${view.selected.name} · `:'')+view.message+(view.waitingForWork?' 仍有備份正在讀取或雜湊核對，完成後可再選檔。':'');note.dataset.match=view.report===null?'unknown':String(view.report.matched);focusController?.refresh(focusView(view));}});
  focusController=Focus.createController({capture:()=>focusView(controller.view()),noteFocused:()=>document.activeElement===note,focusPicker:()=>focus(file),focusNote:()=>focus(note)});
  file.onchange=()=>{clearFocus();const selected=file.files[0];file.value='';if(selected){focusController.selected();void controller.verify(selected);}};cancel.onclick=()=>{clearFocus();controller.cancel();focusController.cancelled();};
  const leave=()=>{clearFocus();controller.cancel();};events.addEventListener('pagehide',leave);controller.refresh();
  return {refresh:controller.refresh,dispose(){focusController.dispose();events.removeEventListener('pagehide',leave);note.removeEventListener?.('blur',clearFocus);file.onchange=null;cancel.onclick=null;cancel.disabled=true;controller.dispose();}};
 }
 const api=Object.freeze({bind});if(node)module.exports=api;else root.MusicBackupVerificationDOM=api;
})(typeof globalThis==='object'?globalThis:this);
