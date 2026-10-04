// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
 const json=typeof module==='object'&&module.exports?require('../musiclab/assets/json-document.js'):root.MusicJsonDocument;
 const maxArchive=8*1024*1024+65536,maxManifest=32768;
 function manifest(raw){
  const bytes=raw instanceof Uint8Array?raw:new Uint8Array(raw);
  if(bytes.length<22||bytes.length>maxArchive)throw Error('ZIP大小不支援');
  const view=new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength),u16=p=>view.getUint16(p,true),u32=p=>view.getUint32(p,true),end=bytes.length-22;
  if(u32(0)!==0x04034b50||u32(end)!==0x06054b50||u16(end+4)||u16(end+6)||u16(end+8)!==u16(end+10)||u16(end+20))throw Error('不是標準文字交付ZIP');
  const count=u16(end+10),size=u32(end+12),offset=u32(end+16);
  if(count<2||count>65||size>32768||offset+size!==end)throw Error('ZIP目錄超限或不完整');
  let cursor=offset,last=null;
  for(let i=0;i<count;i++){
   if(cursor+46>end||u32(cursor)!==0x02014b50)throw Error('ZIP目錄不完整');
   const names=u16(cursor+28),extra=u16(cursor+30),comment=u16(cursor+32),next=cursor+46+names+extra+comment;
   if(names<1||names>100||extra||comment||next>end||u16(cursor+8)||u16(cursor+10)!==0||u32(cursor+20)!==u32(cursor+24))throw Error('ZIP目錄格式不支援');
   const name=new TextDecoder('utf-8',{fatal:true,ignoreBOM:true}).decode(bytes.subarray(cursor+46,cursor+46+names));
   last={name,length:u32(cursor+24),local:u32(cursor+42)};cursor=next;
  }
  if(cursor!==end||last.name!=='DELIVERY-MANIFEST.json'||last.length>maxManifest||last.local+30>offset)throw Error('ZIP原始清單缺漏或超限');
  const local=last.local;
  if(u32(local)!==0x04034b50||u16(local+6)||u16(local+8)!==0||u32(local+18)!==last.length||u32(local+22)!==last.length||u16(local+28))throw Error('ZIP清單header不符');
  const names=u16(local+26),start=local+30+names;
  if(names!==22||start+last.length!==offset||new TextDecoder('utf-8',{fatal:true,ignoreBOM:true}).decode(bytes.subarray(local+30,start))!==last.name)throw Error('ZIP清單位置不符');
  const text=new TextDecoder('utf-8',{fatal:true,ignoreBOM:true}).decode(bytes.subarray(start,offset));
  return json.parse(text,{maxBytes:maxManifest,label:'ZIP原始清單',allowBOM:false});
 }
 const api={manifest,maxArchive,maxManifest};if(typeof module==='object'&&module.exports)module.exports=api;else root.MusicDeliveryArchive=api;
})(typeof globalThis==='object'?globalThis:this);
