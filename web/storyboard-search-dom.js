// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
 const M=typeof module==='object'&&module.exports?require('../musiclab/assets/storyboard-search.js'):root.MusicStoryboardSearch;
 const P=typeof module==='object'&&module.exports?require('./storyboard-search-controller.js'):root.MusicStoryboardSearchController;
 const E=typeof module==='object'&&module.exports?require('./search-excerpt.js'):root.MusicSearchExcerpt;
 const ED=typeof module==='object'&&module.exports?require('./search-excerpt-dom.js'):root.MusicSearchExcerptDOM;
 const K=typeof module==='object'&&module.exports?require('./search-input.js'):root.MusicSearchInput;
 const caption=E.prefix;
 function bind(document,options){
  const get=id=>document.getElementById('storyboard-search-'+id),query=get('query'),find=get('find'),previous=get('previous'),next=get('next'),list=get('matches'),note=get('note'),cancel=get('cancel');
  let controller;
  function render(view){const excerpts=view.matches.map(hit=>E.present({text:hit.text,start_byte:hit.start_byte,end_byte:hit.end_byte},view.query));cancel.hidden=!view.pending;cancel.disabled=!view.canCancel;note.textContent=view.message;find.disabled=!view.available||view.pending;previous.disabled=!view.canPrevious;next.disabled=!view.canNext;list.replaceChildren();view.matches.forEach((hit,i)=>{const li=document.createElement('li'),button=document.createElement('button');button.type='button';button.className='subtle search-match';ED.append(document,button,`鏡頭 ${hit.row} · ${M.labels[hit.field]}`,excerpts[i]);button.disabled=!view.canFocus;button.onclick=()=>controller.focus(i);li.append(button);list.append(li);});}
  controller=P.createController({...options,onState:render});query.oninput=()=>controller.setQuery(query.value);query.onkeydown=event=>{if(K.shouldFind({key:event.key,isComposing:event.isComposing??false,keyCode:event.keyCode??0})){event.preventDefault();void controller.find();}};find.onclick=()=>{void controller.find();};previous.onclick=()=>{void controller.previous();};next.onclick=()=>{void controller.next();};cancel.onclick=()=>{const owned=document.activeElement===cancel;if(controller.cancel()&&owned&&query.isConnected&&!query.disabled)query.focus();};document.defaultView?.addEventListener('pagehide',()=>controller.cancel());controller.refresh();return controller;
 }
 const api=Object.freeze({caption,bind});if(typeof module==='object'&&module.exports)module.exports=api;else root.MusicStoryboardSearchDOM=api;
})(typeof globalThis==='object'?globalThis:this);
