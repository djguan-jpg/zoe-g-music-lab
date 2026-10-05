// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
 const node=typeof module==='object'&&module.exports;
 const J=node?require('../musiclab/assets/json-document.js'):root.MusicJsonDocument;
 const C=node?require('./delivery-context.js'):root.MusicDeliveryContext;
 const exact=(v,keys)=>v&&typeof v==='object'&&!Array.isArray(v)&&Object.keys(v).length===keys.length&&keys.every(k=>Object.hasOwn(v,k));
 const size=s=>Array.from(s).length,decode=b=>new TextDecoder('utf-8',{fatal:true,ignoreBOM:true}).decode(b);
 const tokens=s=>Array.from(s,c=>c==='\r'?'␍':c==='\n'?'↵':c==='\t'?'⇥':c==='\ufeff'?'[BOM]':/[\u0000-\u001f\u007f]/.test(c)?'\\u'+c.charCodeAt(0).toString(16).padStart(4,'0'):c);
 function take(values,budget,tail=false){let used=0,out=[];for(const v of tail?[...values].reverse():values){const n=size(v);if(used+n>budget)break;used+=n;out.push(v);}if(tail)out.reverse();return {text:out.join(''),cut:out.length<values.length};}
 function checkedView(v){
  if(!exact(v,['before','match','after','leading','trailing','matchShortened'])||['leading','trailing','matchShortened'].some(k=>typeof v[k]!=='boolean')||['before','match','after'].some(k=>typeof v[k]!=='string')||!v.match||size(v.before)>48||size(v.match)>96||size(v.after)>48)throw Error('搜尋摘錄顯示來源無效');
  for(const k of ['before','match','after'])J.assertUnicode(v[k]);return {...v};
 }
 function present(hit,query){
  if(!exact(hit,['text','start_byte','end_byte'])||typeof hit.text!=='string'||size(hit.text)>2000||typeof query!=='string')throw Error('搜尋摘錄原文無效');
  J.assertUnicode(hit.text);J.assertUnicode(query);
  const raw=new TextEncoder().encode(hit.text),context=C.contexts(raw,[hit]);C.checked(context,[hit],raw.length,query);const item=context.items[0];
  const before=take(tokens(decode(raw.subarray(item.start_byte,hit.start_byte))),48,true),after=take(tokens(decode(raw.subarray(hit.end_byte,item.end_byte))),48),matched=tokens(query),shortened=matched.reduce((n,t)=>n+size(t),0)>96;
  const match=shortened?take(matched,71).text+'…'+take(matched,24,true).text:matched.join('');
  return checkedView({before:before.text,match,after:after.text,leading:item.start_byte>0||before.cut,trailing:item.end_byte<raw.length||after.cut,matchShortened:shortened});
 }
 // Keep the earlier caption helper's display contract; live results use present.
 function prefix(text){const chars=Array.from(text.replace(/[\u0000-\u001f\u007f]/g,c=>c==='\n'?'↵':c==='\r'?'␍':c==='\t'?'⇥':'�'));return chars.slice(0,100).join('')+(chars.length>100?'…':'');}
 const api=Object.freeze({present,checkedView,prefix});if(node)module.exports=api;else root.MusicSearchExcerpt=api;
})(typeof globalThis==='object'?globalThis:this);
