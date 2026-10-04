// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
 const text=typeof module==='object'&&module.exports?require('./text-download.js'):root.MusicTextDownload;
 const context=typeof module==='object'&&module.exports?require('./delivery-context.js'):root.MusicDeliveryContext;
 function options(request={}){
  if(!request||typeof request!=='object'||Array.isArray(request)||Object.keys(request).some(k=>!['query','start_byte','max_matches','include_context'].includes(k)))throw Error('搜尋請求欄位無效');
  const {query,start_byte=0,max_matches=20,include_context=false}=request;
  if(typeof include_context!=='boolean')throw Error('include_context需為明確布林值');
  if(typeof query!=='string'||!query.length||query.length>1024)throw Error('請輸入搜尋字，最多1024 UTF-8 bytes');
  const pattern=text.prepare({name:'query.txt',content:query}).bytes;
  if(pattern.length>1024)throw Error('搜尋字超過1024 UTF-8 bytes');
  if(!Number.isSafeInteger(start_byte)||start_byte<0||start_byte>text.maxBytes||!Number.isSafeInteger(max_matches)||max_matches<1||max_matches>50)throw Error('搜尋起點或筆數無效');
  return {query,start_byte,max_matches,pattern,include_context};
 }
 function searchBytes(raw,request){
  const {query,start_byte,max_matches,pattern,include_context}=options(request);
  if(start_byte>raw.length||start_byte<raw.length&&(raw[start_byte]&0xc0)===0x80)throw Error('搜尋起點不是有效UTF-8字元邊界');
  const failure=new Uint32Array(pattern.length),matches=[];
  for(let i=1,j=0;i<pattern.length;i++){while(j&&pattern[i]!==pattern[j])j=failure[j-1];if(pattern[i]===pattern[j])j++;failure[i]=j;}
  let next_byte=null;
  for(let i=start_byte,j=0;i<raw.length;i++){
   while(j&&raw[i]!==pattern[j])j=failure[j-1];if(raw[i]===pattern[j])j++;
   if(j===pattern.length){if(matches.length===max_matches){next_byte=matches[matches.length-1].end_byte;break;}matches.push({start_byte:i+1-j,end_byte:i+1});j=0;}
  }
  return {query,query_bytes:pattern.length,start_byte,source_bytes:raw.length,max_matches,matches,next_byte,...(include_context?{context:context.contexts(raw,matches)}:{})};
 }
 function search(content,request){return searchBytes(text.prepare({name:'search.txt',content}).bytes,request);}
 function checked(value,request){
  const o=options(request),keys=['query','query_bytes','start_byte','source_bytes','max_matches','matches','next_byte'];
  if(o.include_context)keys.push('context');
  if(!value||typeof value!=='object'||Array.isArray(value)||Object.keys(value).length!==keys.length||!keys.every(k=>Object.hasOwn(value,k)))throw Error('搜尋回覆無效');
  const v=value;
  if(v.query!==o.query||v.query_bytes!==o.pattern.length||v.start_byte!==o.start_byte||v.max_matches!==o.max_matches||!Number.isSafeInteger(v.source_bytes)||v.source_bytes<o.start_byte||v.source_bytes>text.maxBytes||!Array.isArray(v.matches)||v.matches.length>o.max_matches)throw Error('搜尋回覆與請求不符');
  let end=o.start_byte;
  for(const m of v.matches){if(!m||Object.keys(m).length!==2||!Number.isSafeInteger(m.start_byte)||!Number.isSafeInteger(m.end_byte)||m.start_byte<end||m.end_byte-m.start_byte!==o.pattern.length||m.end_byte>v.source_bytes)throw Error('搜尋命中位置無效');end=m.end_byte;}
  if(v.next_byte!==null&&(v.matches.length!==o.max_matches||v.next_byte!==end||end>=v.source_bytes))throw Error('搜尋接續位置無效');
  if(o.include_context)context.checked(v.context,v.matches,v.source_bytes,o.query);
  return structuredClone(v);
 }
 function createSearcher({source,read,onSelect=()=>true,onState=()=>{},onError=()=>{},includeContext=false}){
  let key=null,query='',batch=null,selected=-1,offset=0;
  function sync(){const s=source();if(!s.canRead||s.key!==key){key=s.key;batch=null;selected=-1;offset=0;}return s;}
  function status(){const s=sync();return {canRead:!!s.canRead,query,batch:batch?structuredClone(batch):null,selected,offset};}
  const publish=()=>{const s=status();onState(s);return s;};
  function load(start,nextOffset){const s=sync();if(!s.canRead)return false;const selectedKey=s.key,request={query,start_byte:start,max_matches:20,...(includeContext?{include_context:true}:{})};
   try{const result=checked(read(request),request);const now=source();if(!now.canRead||now.key!==selectedKey||query!==request.query){publish();return false;}batch=result;selected=-1;offset=nextOffset;publish();return true;}
   catch(error){onError(error);publish();return false;}
  }
  return {status,refresh:publish,setQuery(value){if(value!==query){query=value;batch=null;selected=-1;offset=0;}publish();},find:()=>load(0,0),more(){const s=status();return s.canRead&&batch?.next_byte!==null&&batch?load(batch.next_byte,offset+batch.matches.length):false;},select(index){const s=status();if(!s.canRead||!batch||!Number.isSafeInteger(index)||index<0||index>=batch.matches.length)return false;const selectedKey=key,start=batch.matches[index].start_byte;if(onSelect(start)!==true)return false;const now=source();if(!now.canRead||now.key!==selectedKey){publish();return false;}selected=index;publish();return true;}};
 }
 const api={options,search,searchBytes,checked,createSearcher};if(typeof module==='object'&&module.exports)module.exports=api;else root.MusicDeliverySearch=api;
})(typeof globalThis==='object'?globalThis:this);
