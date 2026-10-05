// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
 const P=typeof module==='object'&&module.exports?require('./text-verification-controller.js'):root.MusicTextVerificationController;
 function bind(document,{capture,onReport,onError,events=root,FileType=root.File}={}){
  const file=document.getElementById('text-verify-file'),note=document.getElementById('text-verify-note'),source=document.getElementById('text-verify-source');
  const native=value=>{if(!FileType||!(value instanceof FileType))throw Error('請明確選定本機檔案後核對');return value;};
  const controller=P.createController({capture,onReport,onError,describe:value=>{const f=native(value);return {name:f.name,size:f.size};},readFile:async value=>new Uint8Array(await native(value).arrayBuffer()),
   onState:view=>{file.disabled=!view.available||view.pending;source.textContent=view.expectedName?`目前成果：${view.expectedName}`:'先建立並選擇一個成果檔案。';note.textContent=(view.selected?`選定：${view.selected.name} · `:'')+view.message;note.dataset.match=view.report===null?'unknown':String(view.report.matched);}});
  file.onchange=()=>{const value=file.files[0];file.value='';if(value)void controller.verify(value);};
  const leave=()=>controller.cancel();events.addEventListener('pagehide',leave);controller.refresh();
  return {refresh:controller.refresh,dispose(){events.removeEventListener('pagehide',leave);file.onchange=null;controller.dispose();}};
 }
 const api=Object.freeze({bind});if(typeof module==='object'&&module.exports)module.exports=api;else root.MusicTextVerificationDOM=api;
})(typeof globalThis==='object'?globalThis:this);
