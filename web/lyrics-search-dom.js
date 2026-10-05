// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
 const P=typeof module==='object'&&module.exports?require('./lyrics-search-controller.js'):root.MusicLyricsSearchController;
 function caption(text){const chars=Array.from(text.replace(/[\u0000-\u001f\u007f]/g,c=>c==='\n'?'↵':c==='\r'?'␍':c==='\t'?'⇥':'�'));return chars.slice(0,100).join('')+(chars.length>100?'…':'');}
 function bind(document,options){
  const get=id=>document.getElementById('lyrics-search-'+id),query=get('query'),find=get('find'),previous=get('previous'),next=get('next'),list=get('matches'),note=get('note');
  let controller;
  function render(view){note.textContent=view.message;find.disabled=!view.available||view.pending;previous.disabled=!view.canPrevious;next.disabled=!view.canNext;list.replaceChildren();view.matches.forEach((hit,i)=>{const li=document.createElement('li'),button=document.createElement('button');button.type='button';button.className='subtle';button.textContent=`第 ${hit.row} 句 · ${caption(hit.text)}`;button.disabled=!view.canFocus;button.onclick=()=>controller.focus(i);li.append(button);list.append(li);});}
  controller=P.createController({...options,onState:render});query.oninput=()=>controller.setQuery(query.value);query.onkeydown=event=>{if(event.key==='Enter'){event.preventDefault();void controller.find();}};find.onclick=()=>{void controller.find();};previous.onclick=()=>{void controller.previous();};next.onclick=()=>{void controller.next();};controller.refresh();return controller;
 }
 const api=Object.freeze({caption,bind});if(typeof module==='object'&&module.exports)module.exports=api;else root.MusicLyricsSearchDOM=api;
})(typeof globalThis==='object'?globalThis:this);
