// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
 const P=typeof module==='object'&&module.exports?require('./search-excerpt.js'):root.MusicSearchExcerpt;
 function append(document,button,label,value){
  const v=P.checkedView(value);if(typeof label!=='string'||label.length>200)throw Error('搜尋定位標籤無效');
  const location=document.createElement('span'),excerpt=document.createElement('span'),before=document.createElement('span'),mark=document.createElement('mark'),after=document.createElement('span');
  location.className='search-match-location';location.textContent=label;
  excerpt.className='search-match-excerpt';before.textContent=(v.leading?'…':'')+v.before;mark.textContent=v.match;after.textContent=v.after+(v.trailing?'…':'');
  excerpt.append(before);excerpt.append(mark);excerpt.append(after);
  if(v.matchShortened){const note=document.createElement('span');note.textContent='（命中已摘錄）';note.className='search-match-shortened';excerpt.append(note);}
  button.title='命中附近摘錄；完整原文保留在原欄位。';button.append(location);button.append(excerpt);
 }
 const api=Object.freeze({append});if(typeof module==='object'&&module.exports)module.exports=api;else root.MusicSearchExcerptDOM=api;
})(typeof globalThis==='object'?globalThis:this);
