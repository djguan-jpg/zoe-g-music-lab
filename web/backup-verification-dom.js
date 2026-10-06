// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
 const node=typeof module==='object'&&module.exports;
 const P=node?require('./backup-verification-controller.js'):root.MusicBackupVerificationController;
 const F=node?require('./backup-file.js'):root.MusicBackupFile;
 function bind(document,{capture,events=root,FileType=root.File,hash=F.sha256,onError=()=>{}}){
  const file=document.getElementById('backup-verify-file'),source=document.getElementById('backup-verify-source'),note=document.getElementById('backup-verify-note'),cancel=document.getElementById('backup-verify-cancel');
  const native=value=>{if(!FileType||!(value instanceof FileType))throw Error('請明確選回本機備份檔案後核對');return value;};
  const controller=P.createController({capture,describe:value=>{const f=native(value);return {name:f.name,size:f.size};},readFile:value=>native(value).arrayBuffer(),hash,onError,
   onState:view=>{file.disabled=!view.available||view.pending;cancel.disabled=!view.pending;source.textContent=view.source?`本輪備份：${view.source.entry_count} 版 · ${view.source.bytes} bytes · SHA-256 ${view.source.sha256}`:'尚無已送出的備份 ZIP。';note.textContent=(view.selected?`選定：${view.selected.name} · `:'')+view.message;note.dataset.match=view.report===null?'unknown':String(view.report.matched);}});
  file.onchange=()=>{const selected=file.files[0];file.value='';if(selected)void controller.verify(selected);};cancel.onclick=()=>controller.cancel();
  const leave=()=>controller.cancel();events.addEventListener('pagehide',leave);controller.refresh();
  return {refresh:controller.refresh,dispose(){events.removeEventListener('pagehide',leave);file.onchange=null;cancel.onclick=null;controller.dispose();}};
 }
 const api=Object.freeze({bind});if(node)module.exports=api;else root.MusicBackupVerificationDOM=api;
})(typeof globalThis==='object'?globalThis:this);
