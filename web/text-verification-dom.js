// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
 const P=typeof module==='object'&&module.exports?require('./text-verification-controller.js'):root.MusicTextVerificationController;
 const F=typeof module==='object'&&module.exports?require('./verification-focus.js'):root.MusicVerificationFocus;
 const G=typeof module==='object'&&module.exports?require('./text-verification-page.js'):root.MusicTextVerificationPage;
 function bind(document,{capture,onReport,onError,events=root,FileType=root.File,maxBytes,ids={file:'text-verify-file',note:'text-verify-note',source:'text-verify-source',cancel:'text-verify-cancel'},emptyText='先建立並選擇一個成果檔案。',sourceLabel='目前成果：'}={}){
  const file=document.getElementById(ids.file),note=document.getElementById(ids.note),source=document.getElementById(ids.source),cancel=ids.cancel?document.getElementById(ids.cancel):null;
  const prefix=typeof ids.note==='string'&&ids.note.endsWith('-verify-note')?ids.note.slice(0,-5):null;
  const context=prefix?document.getElementById(prefix+'-context'):null,expectedContext=prefix?document.getElementById(prefix+'-expected-context'):null,selectedContext=prefix?document.getElementById(prefix+'-selected-context'):null;
  const original=Object.fromEntries(['open','region','first','previous','next','close','note','content'].map(key=>[key,prefix?document.getElementById(prefix+'-original-'+key):null])),hasOriginal=Object.values(original).every(Boolean);let originalCache=null,originalMark=null;
  function clearOriginal(){originalCache=null;originalMark=null;if(original.region)original.region.hidden=true;if(original.content)original.content.textContent='';if(original.note)original.note.textContent='';}
  function renderOriginal(view){
   if(!hasOriginal)return;const current=view.original,page=current.page;original.open.disabled=!view.canReadOriginal;original.first.disabled=!view.canReadOriginal;original.previous.disabled=!current.canPrevious;original.next.disabled=!current.canNext;
   if(!current.canRead||!page){clearOriginal();return;}
   const position=view.report.first_difference_byte,presentation=G.presentation(page,position);
   original.region.hidden=false;original.note.textContent=`目前原文 ${view.expectedName}：bytes ${page.start_byte}–${page.end_byte}／${page.source_bytes}（尾端不含）。這是片段；控制字元以跳脫符號顯示。`+(presentation.atEOF?' 差異位置是目前原文的結尾。':presentation.hasPosition?' 已標出第一個差異的原文字元。':' 差異不在本段；按閱讀差異位置可返回。')+(view.originalMessage?' '+view.originalMessage:'');
   if(originalCache&&originalCache.revision===view.contextRevision&&originalCache.start===page.start_byte&&originalCache.text===page.text&&originalCache.position===position)return;
   originalCache={revision:view.contextRevision,start:page.start_byte,text:page.text,position};originalMark=null;const nodes=[document.createTextNode(presentation.before)];
   if(presentation.marked){originalMark=document.createElement('mark');originalMark.textContent=presentation.marked;originalMark.tabIndex=-1;originalMark.setAttribute('aria-label','第一個差異對應的目前原文字元');nodes.push(originalMark);}nodes.push(document.createTextNode(presentation.after));original.content.replaceChildren(...nodes);
  }
  const clearContext=()=>{if(context)context.hidden=true;if(expectedContext)expectedContext.textContent='';if(selectedContext)selectedContext.textContent='';};
  const describeContext=value=>`bytes ${value.start_byte}–${value.end_byte}（尾端不含），共 ${value.total_bytes} bytes\n差異位置：${value.byte_at_difference===null?'檔案結尾 EOF':'0x'+value.byte_at_difference.toString(16).padStart(2,'0')}\nUTF-8：${value.display_status==='utf8'?value.display:'無效 UTF-8；請看原始 bytes'}\n原始 bytes：${value.hex||'（空）'}`;
  let focusController=null;
  const clearFocus=()=>focusController?.clear();
  const focus=element=>{try{element.focus?.();return document.activeElement===element;}catch{return false;}};
  const focusView=view=>({available:view.available,pending:view.pending,waiting:view.waitingForReads,contextRevision:view.contextRevision});
  if(cancel){if(!note.hasAttribute?.('tabindex'))note.setAttribute?.('tabindex','-1');note.addEventListener?.('blur',clearFocus);}
  const native=value=>{if(!FileType||!(value instanceof FileType))throw Error('請明確選定本機檔案後核對');return value;};
  const controller=P.createController({capture,onReport,onError,maxBytes,describe:value=>{const f=native(value);return {name:f.name,size:f.size};},readFile:async value=>new Uint8Array(await native(value).arrayBuffer()),
   onState:view=>{file.disabled=!view.available||view.pending;if(cancel)cancel.disabled=!view.pending;source.textContent=view.expectedName?`${sourceLabel}${view.expectedName}`:emptyText;note.textContent=(view.selected?`選定：${view.selected.name} · `:'')+view.message+(view.waitingForReads?' 仍有檔案正在讀取，完成後可再選檔。':'');note.dataset.match=view.report===null?'unknown':String(view.report.matched);
    focusController?.refresh(focusView(view));
    clearContext();if(context&&expectedContext&&selectedContext&&view.difference){expectedContext.textContent=describeContext(view.difference.expected);selectedContext.textContent=describeContext(view.difference.selected);context.hidden=false;}
    renderOriginal(view);
   }});
  if(cancel)focusController=F.createController({capture:()=>focusView(controller.view()),noteFocused:()=>document.activeElement===note,focusPicker:()=>focus(file),focusNote:()=>focus(note)});
  if(hasOriginal){const action=method=>{if(controller[method]())focus(originalMark||original.content);};original.open.onclick=()=>action('openOriginal');original.first.onclick=()=>action('firstOriginal');original.previous.onclick=()=>action('previousOriginal');original.next.onclick=()=>action('nextOriginal');original.close.onclick=()=>{controller.closeOriginal();focus(controller.view().canReadOriginal?original.open:note);};}
  file.onchange=()=>{clearFocus();const value=file.files[0];file.value='';if(value){focusController?.selected();void controller.verify(value);}};
  if(cancel)cancel.onclick=()=>{clearFocus();controller.cancel();focusController.cancelled();};
  const leave=()=>{clearFocus();controller.cancel();};events.addEventListener('pagehide',leave);controller.refresh();
  return {refresh:controller.refresh,dispose(){clearContext();clearOriginal();if(hasOriginal)for(const key of ['open','first','previous','next','close']){original[key].onclick=null;original[key].disabled=true;}focusController?.dispose();events.removeEventListener('pagehide',leave);file.onchange=null;if(cancel){cancel.onclick=null;cancel.disabled=true;note.removeEventListener?.('blur',clearFocus);}controller.dispose();}};
 }
 const api=Object.freeze({bind});if(typeof module==='object'&&module.exports)module.exports=api;else root.MusicTextVerificationDOM=api;
})(typeof globalThis==='object'?globalThis:this);
