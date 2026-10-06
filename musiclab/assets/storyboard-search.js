// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
 const J=typeof module==='object'&&module.exports?require('./json-document.js'):root.MusicJsonDocument;
 const S=typeof module==='object'&&module.exports?require('../../web/delivery-search.js'):root.MusicDeliverySearch;
 const fields=Object.freeze(['section','purpose','visual','camera','transition','motif_state','character_state','change_reason']),labels=Object.freeze(Object.fromEntries(fields.map((k,i)=>[k,['歌曲段落','敘事用途','畫面動作','鏡頭運動','尾鏡與轉場','母題狀態','人物狀態','變化理由'][i]])));
 const notes=["只查找八個原敘事欄位，不修改分鏡或時間；不代表創作、連戲或媒體通過。", "每鏡依固定欄位順序列第一個字面命中；原鏡號與UTF-8 byte位置保留。"];
 const encoder=new TextEncoder(),maxRows=1000,maxSourceBytes=1024*1024;
 function checkedShots(shots){
  if(!Array.isArray(shots)||shots.length>maxRows)throw Error('分鏡搜尋最多1000鏡');
  let size=2;const parts=[],selected=[];
  for(const shot of shots){
   if(!shot||typeof shot!=='object'||Array.isArray(shot)||Object.keys(shot).length!==fields.length||!fields.every(k=>Object.hasOwn(shot,k)))throw Error('分鏡搜尋只接受八個原敘事欄位');
   const current={};for(const field of fields){const value=shot[field];if(typeof value!=='string'||Array.from(value).length>2000)throw Error('每個搜尋欄位需為文字，最多2000字');J.assertUnicode(value,'分鏡搜尋原文');current[field]=value;}
   const part=encoder.encode(JSON.stringify(current));size+=part.length+(parts.length?1:0);if(size>maxSourceBytes)throw Error('分鏡搜尋來源最多1 MiB UTF-8 JSON');parts.push(part);selected.push(current);
  }
  const raw=new Uint8Array(size);raw[0]=91;let offset=1;parts.forEach((part,i)=>{if(i)raw[offset++]=44;raw.set(part,offset);offset+=part.length;});raw[offset]=93;
  return {shots:selected,raw};
 }
 function checkedRequest(payload){
  if(!payload||typeof payload!=='object'||Array.isArray(payload)||!['shots','query'].every(k=>Object.hasOwn(payload,k))||Object.keys(payload).some(k=>!['shots','query','start_row','max_results','source_sha256'].includes(k)))throw Error('分鏡原文搜尋欄位不支援');
  const source=checkedShots(payload.shots),options=S.options({query:payload.query,max_matches:1});
  const start=Object.hasOwn(payload,'start_row')?payload.start_row:1,limit=Object.hasOwn(payload,'max_results')?payload.max_results:20,pin=payload.source_sha256;
  if(!Number.isSafeInteger(start)||start<1||start>source.shots.length+1||!Number.isSafeInteger(limit)||limit<1||limit>50)throw Error('搜尋分鏡原文起點或筆數無效');
  if(Object.hasOwn(payload,'source_sha256')&&(typeof pin!=='string'||pin.length!==64||!/^[0-9a-f]{64}$/.test(pin)))throw Error('搜尋來源SHA需為64字元小寫十六進位');
  if(start>1&&pin===undefined)throw Error('接續搜尋需前次來源SHA');
  return {...source,options,start,limit,pin};
 }
 async function digest(bytes){if(!root.crypto?.subtle)throw Error('目前環境無法核對搜尋來源SHA');return [...new Uint8Array(await root.crypto.subtle.digest('SHA-256',bytes))].map(v=>v.toString(16).padStart(2,'0')).join('');}
 async function search(payload,{hash=digest}={}){
  const {shots,raw,options,start,limit,pin}=checkedRequest(payload),prefix=encoder.encode('zoe-storyboard-texts-v1\n'),bytes=new Uint8Array(prefix.length+raw.length);bytes.set(prefix);bytes.set(raw,prefix.length);
  const sha=await hash(bytes);if(typeof sha!=='string'||sha.length!==64||!/^[0-9a-f]{64}$/.test(sha))throw Error('搜尋來源SHA回覆無效');if(pin!==undefined&&pin!==sha)throw Error('分鏡原文已變更，請重新搜尋；不能接續舊來源');
  let count=0,next_row=null;const matches=[];
  for(let i=0;i<shots.length;i++){for(const field of fields){const text=shots[i][field],hit=S.searchBytes(encoder.encode(text),{query:options.query,max_matches:1}).matches[0];if(!hit)continue;count++;if(i+1>=start){if(matches.length<limit)matches.push({row:i+1,field,start_byte:hit.start_byte,end_byte:hit.end_byte,text});else if(next_row===null)next_row=matches[matches.length-1].row+1;}break;}}

  return {format:'zoe-storyboard-search',schema_version:1,query:options.query,query_bytes:options.pattern.length,source_sha256:sha,source_bytes:raw.length,total_rows:shots.length,total_matched_rows:count,start_row:start,max_results:limit,matches,next_row,review_notes:[...notes]};
 }
 function markdown(data){const lines=['# 分鏡原文搜尋','',`全部${data.total_rows}鏡；命中${data.total_matched_rows}鏡；此批${data.matches.length}鏡。`,`查詢${data.query_bytes} UTF-8 bytes；來源SHA-256：${data.source_sha256}。`,''];for(const hit of data.matches)lines.push(`- 鏡頭${hit.row} · ${labels[hit.field]}：第一個命中UTF-8 bytes ${hit.start_byte}–${hit.end_byte}。`);if(data.next_row!==null)lines.push(`- 接續從原鏡${data.next_row}開始，需同一來源SHA。`);return [...lines,'',...notes,''].join('\n');}

 const equal=J.sameValue;
 function checkedReply(reply,expected,version){
  const exact=(v,keys)=>v&&typeof v==='object'&&!Array.isArray(v)&&Object.keys(v).length===keys.length&&keys.every(k=>Object.hasOwn(v,k));
  if(!exact(reply,['files','data','meta'])||!exact(reply.meta,['version','protocol_version','needs_review'])||reply.meta.version!==version||reply.meta.protocol_version!==1||reply.meta.needs_review!==true||!equal(reply.data,expected)||!exact(reply.files,['storyboard-search.json','storyboard-search.md'])||typeof reply.files['storyboard-search.md']!=='string'||!equal(J.parse(reply.files['storyboard-search.json'],{maxBytes:1024*1024,label:'分鏡原文搜尋報告'}),expected)||reply.files['storyboard-search.md']!==markdown(expected))throw Error('搜尋回覆與本次原文或版本不符；分鏡原文保持');
  return structuredClone(expected);
 }
 const api=Object.freeze({fields,labels,checkedShots,checkedRequest,search,markdown,checkedReply,maxRows,maxSourceBytes});if(typeof module==='object'&&module.exports)module.exports=api;else root.MusicStoryboardSearch=api;
})(typeof globalThis==='object'?globalThis:this);
