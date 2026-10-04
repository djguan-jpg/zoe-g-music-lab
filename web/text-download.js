// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
 const maxBytes=8*1024*1024;
 function prepare(value){
  if(!value||typeof value!=='object'||Array.isArray(value)||Object.keys(value).length!==2||!Object.hasOwn(value,'name')||!Object.hasOwn(value,'content'))throw Error('文字下載來源無效');
  const {name,content}=value;
  if(typeof name!=='string'||!/^[A-Za-z0-9][A-Za-z0-9_.-]{0,99}$/.test(name)||name.endsWith('.')||/^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])(?:\.|$)/i.test(name)||!/\.(json|md|txt|csv|html|js|css|lrc|srt)$/i.test(name))throw Error('下載需為可攜單層文字檔名');
  if(typeof content!=='string')throw Error('下載需有完整文字來源');
  if(content.length>maxBytes)throw Error('文字下載最多 8 MiB');
  for(const char of content){const c=char.codePointAt(0);if(c>=0xd800&&c<=0xdfff)throw Error('文字下載含無效 Unicode；沒有取代原文');}
  const bytes=new TextEncoder().encode(content);
  if(bytes.length>maxBytes)throw Error('文字下載最多 8 MiB');
  return {name,bytes};
 }
 function createController({select,send,onSent=()=>{},onError=()=>{}}){
  function download(){try{const selected=select(),prepared=prepare(selected);if(send(prepared)!==true)throw Error('文字下載未送出，請重試');onSent(selected);return true;}catch(error){onError(error);return false;}}
  return {download};
 }
 const api={maxBytes,prepare,createController};
 if(typeof module==='object'&&module.exports)module.exports=api;else root.MusicTextDownload=api;
})(typeof globalThis==='object'?globalThis:this);
