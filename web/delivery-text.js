// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
 const text=typeof module==='object'&&module.exports?require('./text-download.js'):root.MusicTextDownload;
 const search=typeof module==='object'&&module.exports?require('./delivery-search.js'):root.MusicDeliverySearch;
 const maxBytes=16384;
 function range(raw,start_byte=0,max_bytes=maxBytes){
  if(!Number.isSafeInteger(start_byte)||start_byte<0||start_byte>text.maxBytes||!Number.isSafeInteger(max_bytes)||max_bytes<4||max_bytes>maxBytes)throw Error('原文分段位置或容量無效');
  const total=raw.length;
  if(start_byte>total)throw Error('原文起點超過全文');
  if(start_byte<total&&(raw[start_byte]&0xc0)===0x80)throw Error('原文起點不是UTF-8字元邊界，沒有調整位置');
  let end=Math.min(start_byte+max_bytes,total);while(end<total&&(raw[end]&0xc0)===0x80)end--;
  return {text:new TextDecoder('utf-8',{fatal:true,ignoreBOM:true}).decode(raw.subarray(start_byte,end)),start_byte,end_byte:end,source_bytes:total,max_bytes,next_byte:end<total?end:null};
 }
 function prepare(content){const raw=text.prepare({name:'window.txt',content}).bytes;return Object.freeze({source_bytes:raw.length,window:(start=0,limit=maxBytes)=>range(raw,start,limit),search:request=>search.searchBytes(raw,request)});}
 function window(content,start_byte=0,max_bytes=maxBytes){return prepare(content).window(start_byte,max_bytes);}
 function checked(value){
  const keys=['text','start_byte','end_byte','source_bytes','max_bytes','next_byte'];
  if(!value||typeof value!=='object'||Object.keys(value).length!==keys.length||!keys.every(k=>Object.hasOwn(value,k)))throw Error('原文分段回覆無效');
  const v=value;if(!Number.isSafeInteger(v.start_byte)||!Number.isSafeInteger(v.end_byte)||!Number.isSafeInteger(v.source_bytes)||v.start_byte<0||v.end_byte<v.start_byte||v.end_byte>v.source_bytes||v.source_bytes>text.maxBytes||!Number.isSafeInteger(v.max_bytes)||v.max_bytes<4||v.max_bytes>maxBytes||v.end_byte-v.start_byte>v.max_bytes||v.next_byte!==(v.end_byte<v.source_bytes?v.end_byte:null)||v.next_byte===v.start_byte)throw Error('原文分段位置或接續回覆無效');
  if(text.prepare({name:'window.txt',content:v.text}).bytes.length!==v.end_byte-v.start_byte)throw Error('原文分段回覆大小不符');
  return structuredClone(v);
 }
 function createReader({source,read,onState=()=>{},onError=()=>{},onReset=()=>{}}){
  let key=null,page=null,back=[];
  function sync(){const s=source();if(!s.canRead||s.key!==key){if(s.key!==key||page||back.length)onReset();key=s.key;page=null;back=[];}return s;}
  function status(){const s=sync();return {canRead:!!s.canRead,page:page?structuredClone(page):null,canPrevious:!!s.canRead&&back.length>0,canNext:!!s.canRead&&page?.next_byte!==null&&!!page};}
  const publish=()=>{const s=status();onState(s);return s;};
  function load(start,history){
   const s=sync();if(!s.canRead){publish();return false;}
   const selectedKey=s.key;
   try{if(history.length>512)throw Error('原文閱讀紀錄超過容量');const result=checked(read(start));if(!source().canRead||source().key!==selectedKey){publish();return false;}if(result.start_byte!==start||result.max_bytes!==maxBytes)throw Error('原文分段起點或容量不符');page=result;back=history;publish();return true;}
   catch(error){onError(error);publish();return false;}
  }
  return {status,refresh:publish,first:()=>load(0,[]),seek:start=>load(start,[]),next(){const s=status();return s.canNext?load(page.next_byte,[...back,page.start_byte]):false;},previous(){const s=status();return s.canPrevious?load(back[back.length-1],back.slice(0,-1)):false;}};
 }
 const api={maxBytes,prepare,window,checked,createReader};if(typeof module==='object'&&module.exports)module.exports=api;else root.MusicDeliveryText=api;
})(typeof globalThis==='object'?globalThis:this);
