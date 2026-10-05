// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
 const P=typeof module==='object'&&module.exports?require('./text-download.js'):root.MusicTextDownload;
 function metadata(value){
  if(!value||Object.keys(value).length!==2||!Object.hasOwn(value,'name')||!Object.hasOwn(value,'size')||typeof value.name!=='string'||!value.name||Array.from(value.name).length>512||new TextEncoder().encode(value.name).length>1024||/[\u0000-\u001f/\\]/.test(value.name)||!Number.isSafeInteger(value.size)||value.size<0||value.size>P.maxBytes)throw Error('選定檔案需有有效名稱與最多8 MiB的大小');
  for(const char of value.name){const code=char.codePointAt(0);if(code>=0xd800&&code<=0xdfff)throw Error('選定檔案名稱含無效 Unicode');}
  return {name:value.name,size:value.size};
 }
 function inspect(expected,candidate){
  const prepared=P.prepare(expected);
  if(!ArrayBuffer.isView(candidate)||Object.prototype.toString.call(candidate)!=='[object Uint8Array]'||candidate.byteLength>P.maxBytes)throw Error('核對需為最多8 MiB的原始檔案 bytes');
  const bytes=new Uint8Array(candidate),length=Math.min(prepared.bytes.length,bytes.length);let first=null;
  for(let i=0;i<length;i++)if(prepared.bytes[i]!==bytes[i]){first=i;break;}
  if(first===null&&prepared.bytes.length!==bytes.length)first=length;
  return {format:'zoe-text-byte-verification',schema_version:1,expected_name:prepared.name,expected_bytes:prepared.bytes.length,selected_bytes:bytes.length,matched:first===null,first_difference_byte:first};
 }
 const api=Object.freeze({metadata,inspect,maxBytes:P.maxBytes});if(typeof module==='object'&&module.exports)module.exports=api;else root.MusicTextVerification=api;
})(typeof globalThis==='object'?globalThis:this);
