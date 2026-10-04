// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
 const text=typeof module==='object'&&module.exports?require('./text-download.js'):root.MusicTextDownload;
 const flank=64,format='zoe-delivery-match-context';
 const exact=(v,keys)=>v&&typeof v==='object'&&!Array.isArray(v)&&Object.keys(v).length===keys.length&&keys.every(k=>Object.hasOwn(v,k));
 const decode=raw=>new TextDecoder('utf-8',{fatal:true,ignoreBOM:true}).decode(raw);
 function contexts(raw,matches){
  if(!(raw instanceof Uint8Array)||raw.length>text.maxBytes||!Array.isArray(matches)||matches.length>50)throw Error('前後文來源或筆數超過容量');
  const items=matches.map(m=>{
   const first=m.start_byte,last=m.end_byte;
   if(!Number.isSafeInteger(first)||!Number.isSafeInteger(last)||first<0||last<=first||last-first>1024||last>raw.length||first<raw.length&&(raw[first]&0xc0)===0x80||last<raw.length&&(raw[last]&0xc0)===0x80)throw Error('命中位置不是有效UTF-8字元邊界');
   let start=Math.max(0,first-flank),end=Math.min(raw.length,last+flank);
   while(start<first&&(raw[start]&0xc0)===0x80)start++;while(end<raw.length&&(raw[end]&0xc0)===0x80)end--;
   return {start_byte:start,end_byte:end,match_start_byte:first,match_end_byte:last,text:decode(raw.subarray(start,end))};
  });
  return {format,schema_version:1,flank_bytes:flank,items};
 }
 function checked(value,matches,total,query){
  if(!Array.isArray(matches)||matches.length>50||!Number.isSafeInteger(total)||total<0||total>text.maxBytes||typeof query!=='string')throw Error('命中前後文來源無效');
  if(!exact(value,['format','schema_version','flank_bytes','items'])||value.format!==format||value.schema_version!==1||value.flank_bytes!==flank||!Array.isArray(value.items)||value.items.length!==matches.length)throw Error('命中前後文回覆無效');
  for(const [i,item] of value.items.entries()){
   const m=matches[i];
   if(!exact(item,['start_byte','end_byte','match_start_byte','match_end_byte','text'])||!Number.isSafeInteger(item.start_byte)||!Number.isSafeInteger(item.end_byte)||item.start_byte<0||item.end_byte>total||item.start_byte>m.start_byte||item.end_byte<m.end_byte||m.start_byte-item.start_byte>flank||item.end_byte-m.end_byte>flank||item.match_start_byte!==m.start_byte||item.match_end_byte!==m.end_byte)throw Error('命中前後文位置無效');
   const raw=text.prepare({name:'context.txt',content:item.text}).bytes;
   if(raw.length!==item.end_byte-item.start_byte||raw.length>1152||decode(raw.subarray(m.start_byte-item.start_byte,m.end_byte-item.start_byte))!==query)throw Error('命中前後文原文與搜尋字不符');
  }
  return structuredClone(value);
 }
 function label(item,query,ordinal,total){
  const raw=text.prepare({name:'context.txt',content:item.text}).bytes,before=decode(raw.subarray(0,item.match_start_byte-item.start_byte)),after=decode(raw.subarray(item.match_end_byte-item.start_byte));
  const visible=s=>s.replace(/\r\n|\r|\n/g,'↵').replace(/\t/g,'⇥').replace(/\ufeff/g,'[BOM]').replace(/[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/g,c=>'\\u'+c.charCodeAt(0).toString(16).padStart(4,'0'));
  const flankVisible=s=>visible(s).replace(/ {2,}/g,' ');
  const display=Array.from(flankVisible(before)+'【'+visible(query)+'】'+flankVisible(after));
  return `第${ordinal}筆 · `+(item.start_byte>0?'…':'')+display.slice(0,120).join('')+(display.length>120||item.end_byte<total?'…':'');
 }
 const api={flank,contexts,checked,label};if(typeof module==='object'&&module.exports)module.exports=api;else root.MusicDeliveryContext=api;
})(typeof globalThis==='object'?globalThis:this);
