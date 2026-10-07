// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
 const T=typeof module==='object'&&module.exports?require('./text-download.js'):root.MusicTextDownload;
 const W=typeof module==='object'&&module.exports?require('./delivery-text.js'):root.MusicDeliveryText;
 const continuation=b=>b>=0x80&&b<=0xbf;
 function index(value,total){if(!Number.isSafeInteger(value)||value<0||value>total)throw Error('差異位置不在目前原文內');return value;}
 function prepare(expected){
  const raw=T.prepare(expected).bytes;
  return {source_bytes:raw.length,window:start=>W.sliceBytes(raw,start,W.maxBytes),differenceStart(value){index(value,raw.length);let start=Math.max(0,value-W.maxBytes/2);while(start>0&&continuation(raw[start]))start--;return start;}};
 }
 const visible=s=>s.replace(/[\u0000-\u0009\u000b-\u001f\u007f-\u009f\u200b-\u200f\u202a-\u202e\u2060-\u206f\ufeff]/g,c=>{if(c==='\r')return '\\r';if(c==='\t')return '\\t';return '\\u'+c.charCodeAt(0).toString(16).padStart(4,'0');});
 function presentation(value,difference){
  const page=W.checked(value);index(difference,page.source_bytes);
  if(difference===page.source_bytes&&page.end_byte===page.source_bytes)return {before:visible(page.text),marked:'',after:'',atEOF:true,hasPosition:true};
  if(difference<page.start_byte||difference>=page.end_byte)return {before:visible(page.text),marked:'',after:'',atEOF:false,hasPosition:false};
  const raw=T.prepare({name:'position.txt',content:page.text}).bytes;let begin=difference-page.start_byte,end=begin+1;
  while(begin>0&&continuation(raw[begin]))begin--;while(end<raw.length&&continuation(raw[end]))end++;
  const decode=part=>new TextDecoder('utf-8',{fatal:true,ignoreBOM:true}).decode(part);
  return {before:visible(decode(raw.subarray(0,begin))),marked:visible(decode(raw.subarray(begin,end))),after:visible(decode(raw.subarray(end))),atEOF:false,hasPosition:true};
 }
 const api=Object.freeze({prepare,presentation,maxBytes:W.maxBytes});if(typeof module==='object'&&module.exports)module.exports=api;else root.MusicTextVerificationPage=api;
})(typeof globalThis==='object'?globalThis:this);
