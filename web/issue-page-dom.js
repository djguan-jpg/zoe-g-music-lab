// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
 const P=typeof module==='object'&&module.exports?require('./issue-page.js'):root.MusicIssuePage;
 function bind(document,{prefix,capture,renderItem,onLocate,onError=()=>{}}){
  const get=s=>document.getElementById(prefix+'-'+s),previous=get('previous'),next=get('next'),note=get('page-note'),navigation=get('pages'),list=get('issues');
  let controller;
  const attempt=action=>{try{return action();}catch(error){onError(error);return false;}};
  function render(v){
   navigation.hidden=v.detailCount===0;previous.disabled=!v.canPrevious;next.disabled=!v.canNext;note.textContent=v.message;list.replaceChildren();
   for(const index of v.indices){const locate=()=>attempt(()=>{const selected=controller.locate(index,v.revision);return selected?onLocate(selected.index)===true:false;});list.append(renderItem(index,locate,!v.canLocate));}
  }
  function move(direction,button,fallback){const owned=document.activeElement===button;return attempt(()=>{const changed=controller.move(direction);if(changed&&owned&&button.disabled&&fallback.isConnected&&!fallback.disabled&&!navigation.hidden)fallback.focus();return changed;});}
  controller=P.createController({capture,onState:render});previous.onclick=()=>move(-1,previous,next);next.onclick=()=>move(1,next,previous);controller.refresh();return controller;
 }
 const api=Object.freeze({bind});if(typeof module==='object'&&module.exports)module.exports=api;else root.MusicIssuePageDOM=api;
})(typeof globalThis==='object'?globalThis:this);
