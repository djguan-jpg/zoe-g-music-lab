// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
 const P=typeof module==='object'&&module.exports?require('./lyrics-search-controller.js'):root.MusicLyricsSearchController;
 const E=typeof module==='object'&&module.exports?require('./search-excerpt.js'):root.MusicSearchExcerpt;
 const ED=typeof module==='object'&&module.exports?require('./search-excerpt-dom.js'):root.MusicSearchExcerptDOM;
 const caption=E.prefix;
 function bind(document,options){
  const get=id=>document.getElementById('lyrics-search-'+id),query=get('query'),find=get('find'),previous=get('previous'),next=get('next'),list=get('matches'),note=get('note'),cancel=get('cancel');
  let controller;
  function render(view){const excerpts=view.matches.map(hit=>E.present({text:hit.text,start_byte:hit.start_byte,end_byte:hit.end_byte},view.query));cancel.hidden=!view.pending;cancel.disabled=!view.canCancel;note.textContent=view.message;find.disabled=!view.available||view.pending;previous.disabled=!view.canPrevious;next.disabled=!view.canNext;list.replaceChildren();view.matches.forEach((hit,i)=>{const li=document.createElement('li'),button=document.createElement('button');button.type='button';button.className='subtle search-match';ED.append(document,button,`第 ${hit.row} 句`,excerpts[i]);button.disabled=!view.canFocus;button.onclick=()=>controller.focus(i);li.append(button);list.append(li);});}
  controller=P.createController({...options,onState:render});query.oninput=()=>controller.setQuery(query.value);query.onkeydown=event=>{if(event.key==='Enter'){event.preventDefault();void controller.find();}};find.onclick=()=>{void controller.find();};previous.onclick=()=>{void controller.previous();};next.onclick=()=>{void controller.next();};cancel.onclick=()=>{const owned=document.activeElement===cancel;if(controller.cancel()&&owned&&query.isConnected&&!query.disabled)query.focus();};document.defaultView?.addEventListener('pagehide',()=>controller.cancel());controller.refresh();return controller;
 }
 const api=Object.freeze({caption,bind});if(typeof module==='object'&&module.exports)module.exports=api;else root.MusicLyricsSearchDOM=api;
})(typeof globalThis==='object'?globalThis:this);
