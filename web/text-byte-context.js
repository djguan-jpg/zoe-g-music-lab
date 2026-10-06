// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
 const maxBytes=8*1024*1024,radius=16;
 const continuation=b=>b>=0x80&&b<=0xbf;
 function validate(bytes){if(!ArrayBuffer.isView(bytes)||Object.prototype.toString.call(bytes)!=='[object Uint8Array]'||bytes.byteLength>maxBytes)throw Error('核對需為最多8 MiB的原始檔案 bytes');}
 function window(bytes,index){
  let start=Math.max(0,index-radius),end=Math.min(bytes.length,index+radius+1);
  for(let i=0;i<3&&start>0&&continuation(bytes[start]);i++)start--;
  for(let i=0;i<3&&end<bytes.length&&continuation(bytes[end]);i++)end++;
  const part=bytes.subarray(start,end),hex=Array.from(part,b=>b.toString(16).padStart(2,'0')).join(' ');
  let display=null,display_status='invalid_utf8';
  try{const text=new TextDecoder('utf-8',{fatal:true,ignoreBOM:true}).decode(part);display=JSON.stringify(text).replace(/[\u007f-\u009f\u200b-\u200f\u202a-\u202e\u2060-\u206f\ufeff]/g,c=>'\\u'+c.charCodeAt(0).toString(16).padStart(4,'0'));display_status='utf8';}catch{}
  return {start_byte:start,end_byte:end,total_bytes:bytes.length,byte_at_difference:index<bytes.length?bytes[index]:null,hex,display,display_status};
 }
 function compare(expected,selected,includeContext=false){
  if(typeof includeContext!=='boolean')throw Error('前後文選項需為布林值');validate(expected);validate(selected);
  const length=Math.min(expected.length,selected.length);let first=null;
  for(let i=0;i<length;i++)if(expected[i]!==selected[i]){first=i;break;}
  if(first===null&&expected.length!==selected.length)first=length;
  return {first_difference_byte:first,context:includeContext&&first!==null?{format:'zoe-text-byte-context',schema_version:1,first_difference_byte:first,radius,expected:window(expected,first),selected:window(selected,first)}:null};
 }
 const api=Object.freeze({compare,maxBytes,radius});if(typeof module==='object'&&module.exports)module.exports=api;else root.MusicTextByteContext=api;
})(typeof globalThis==='object'?globalThis:this);
