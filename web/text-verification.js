// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
 const P=typeof module==='object'&&module.exports?require('./text-download.js'):root.MusicTextDownload;
 const C=typeof module==='object'&&module.exports?require('./text-byte-context.js'):root.MusicTextByteContext;
 function metadata(value){
  if(!value||Object.keys(value).length!==2||!Object.hasOwn(value,'name')||!Object.hasOwn(value,'size')||typeof value.name!=='string'||!value.name||Array.from(value.name).length>512||new TextEncoder().encode(value.name).length>1024||/[\u0000-\u001f/\\]/.test(value.name)||!Number.isSafeInteger(value.size)||value.size<0||value.size>P.maxBytes)throw Error('選定檔案需有有效名稱與最多8 MiB的大小');
  for(const char of value.name){const code=char.codePointAt(0);if(code>=0xd800&&code<=0xdfff)throw Error('選定檔案名稱含無效 Unicode');}
  return {name:value.name,size:value.size};
 }
 function checked(expected,candidate,includeContext){
  const prepared=P.prepare(expected);
  if(!ArrayBuffer.isView(candidate)||Object.prototype.toString.call(candidate)!=='[object Uint8Array]'||candidate.byteLength>P.maxBytes)throw Error('核對需為最多8 MiB的原始檔案 bytes');
  const bytes=new Uint8Array(candidate),comparison=C.compare(prepared.bytes,bytes,includeContext),first=comparison.first_difference_byte;
  return {report:{format:'zoe-text-byte-verification',schema_version:1,expected_name:prepared.name,expected_bytes:prepared.bytes.length,selected_bytes:bytes.length,matched:first===null,first_difference_byte:first},context:comparison.context};
 }
 const inspect=(expected,candidate)=>checked(expected,candidate,false).report;
 const inspectWithContext=(expected,candidate)=>checked(expected,candidate,true);
 const api=Object.freeze({metadata,inspect,inspectWithContext,maxBytes:P.maxBytes});if(typeof module==='object'&&module.exports)module.exports=api;else root.MusicTextVerification=api;
})(typeof globalThis==='object'?globalThis:this);
