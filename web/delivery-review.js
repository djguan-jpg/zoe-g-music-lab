// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
 const pack=typeof module==='object'&&module.exports?require('./delivery-package.js'):root.MusicDeliveryPackage;
 function baseline(value){
  if(!value||typeof value!=='object'||Array.isArray(value)||Object.keys(value).length!==2||!Object.hasOwn(value,'scope')||!Object.hasOwn(value,'files')||!['music','storyboard','lyrics','audio'].includes(value.scope)||!value.files||typeof value.files!=='object'||Array.isArray(value.files))throw Error('比較基準只能含工作台scope與原文字files');
  if(!Object.keys(value.files).length)return{scope:value.scope,files:{}};
  const s=pack.source({...value,label:''});return{scope:s.scope,files:s.files};
 }
 async function compare(previous,incoming,hash=pack.digest){
  const old=baseline(previous),next=baseline(incoming);if(old.scope!==next.scope)throw Error('比較基準與交付ZIP必須屬於同一工作台');
  async function records(files){const entries=[];for(const name of Object.keys(files).sort()){const raw=new TextEncoder().encode(files[name]);entries.push([name,{bytes:raw.length,sha256:await hash(raw)}]);}return Object.fromEntries(entries);}
  const before=await records(old.files),after=await records(next.files),counts={added:0,changed:0,removed:0,unchanged:0},files=[];
  for(const name of [...new Set([...Object.keys(before),...Object.keys(after)])].sort()){
   const status=!Object.hasOwn(before,name)?'added':!Object.hasOwn(after,name)?'removed':old.files[name]===next.files[name]?'unchanged':'changed';
   counts[status]++;files.push({name,status,before:before[name]??null,incoming:after[name]??null});
  }
  const totals=files=>({file_count:Object.keys(files).length,source_bytes:Object.values(files).reduce((sum,f)=>sum+f.bytes,0)});
  return{format:'zoe-delivery-comparison',schema_version:1,scope:old.scope,baseline:totals(before),incoming:totals(after),counts,files};
 }
 function excerpt(text,limit=32768){
  if(text===null)return{text:'',present:false,truncated:false};
  if(typeof text!=='string'||!Number.isSafeInteger(limit)||limit<1)throw Error('文字預覽來源或容量無效');
  let end=Math.min(limit,text.length);if(end<text.length&&/[\uD800-\uDBFF]/.test(text[end-1]))end--;
  return{text:text.slice(0,end),present:true,truncated:end<text.length};
 }
 function lineEndings(text){
  if(text===null)return null;if(typeof text!=='string')throw Error('換行來源需為文字');
  const counts={crlf:0,lf:0,cr:0};for(let i=0;i<text.length;i++){if(text[i]==='\r'){if(text[i+1]==='\n'){counts.crlf++;i++;}else counts.cr++;}else if(text[i]==='\n')counts.lf++;}return counts;
 }
 const api={baseline,compare,excerpt,lineEndings};if(typeof module==='object'&&module.exports)module.exports=api;else root.MusicDeliveryReview=api;
})(typeof globalThis==='object'?globalThis:this);
