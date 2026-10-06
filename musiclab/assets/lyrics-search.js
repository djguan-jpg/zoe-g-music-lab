// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
 const J=typeof module==='object'&&module.exports?require('./json-document.js'):root.MusicJsonDocument;
 const S=typeof module==='object'&&module.exports?require('../../web/delivery-search.js'):root.MusicDeliverySearch;
 const notes=['只查找原文字，不修改歌詞或時間；不代表校時或實聽通過。','每句列出第一個字面命中；句號依原順序，UTF-8 byte位置未正規化。'];
 const encoder=new TextEncoder(),maxRows=10000,maxSourceBytes=2*1024*1024;
 function checkedTexts(texts){
  if(!Array.isArray(texts)||texts.length>maxRows)throw Error('原句搜尋最多10000列文字');
  let size=2;const parts=[];
  for(const value of texts){if(typeof value!=='string'||Array.from(value).length>2000)throw Error('每句需為文字，最多2000字');J.assertUnicode(value,'搜尋原文');const part=encoder.encode(JSON.stringify(value));size+=part.length+(parts.length?1:0);if(size>maxSourceBytes)throw Error('原句搜尋來源最多2 MiB UTF-8 JSON');parts.push(part);}
  const raw=new Uint8Array(size);raw[0]=91;let offset=1;parts.forEach((part,i)=>{if(i)raw[offset++]=44;raw.set(part,offset);offset+=part.length;});raw[offset]=93;
  return {texts:[...texts],raw};
 }
 function checkedRequest(payload){
  if(!payload||typeof payload!=='object'||Array.isArray(payload)||!['texts','query'].every(k=>Object.hasOwn(payload,k))||Object.keys(payload).some(k=>!['texts','query','start_row','max_results','source_sha256'].includes(k)))throw Error('原句搜尋欄位不支援');
  const source=checkedTexts(payload.texts),options=S.options({query:payload.query,max_matches:1});
  const start=Object.hasOwn(payload,'start_row')?payload.start_row:1,limit=Object.hasOwn(payload,'max_results')?payload.max_results:20,pin=payload.source_sha256;
  if(!Number.isSafeInteger(start)||start<1||start>source.texts.length+1||!Number.isSafeInteger(limit)||limit<1||limit>50)throw Error('搜尋原句起點或筆數無效');
  if(Object.hasOwn(payload,'source_sha256')&&(typeof pin!=='string'||pin.length!==64||!/^[0-9a-f]{64}$/.test(pin)))throw Error('搜尋來源SHA需為64字元小寫十六進位');
  if(start>1&&pin===undefined)throw Error('接續搜尋需前次來源SHA');
  return {...source,options,start,limit,pin};
 }
 async function digest(bytes){if(!root.crypto?.subtle)throw Error('目前環境無法核對搜尋來源SHA');return [...new Uint8Array(await root.crypto.subtle.digest('SHA-256',bytes))].map(v=>v.toString(16).padStart(2,'0')).join('');}
 async function search(payload,{hash=digest}={}){
  const {texts,raw,options,start,limit,pin}=checkedRequest(payload),prefix=encoder.encode('zoe-lyrics-texts-v1\n'),bytes=new Uint8Array(prefix.length+raw.length);bytes.set(prefix);bytes.set(raw,prefix.length);
  const sha=await hash(bytes);if(typeof sha!=='string'||sha.length!==64||!/^[0-9a-f]{64}$/.test(sha))throw Error('搜尋來源SHA回覆無效');if(pin!==undefined&&pin!==sha)throw Error('逐句原文已變更，請重新搜尋；不能接續舊來源');
  let count=0,next_row=null;const matches=[];
  for(let i=0;i<texts.length;i++){const hit=S.searchBytes(encoder.encode(texts[i]),{query:options.query,max_matches:1}).matches[0];if(!hit)continue;count++;if(i+1<start)continue;if(matches.length<limit)matches.push({row:i+1,start_byte:hit.start_byte,end_byte:hit.end_byte,text:texts[i]});else if(next_row===null)next_row=matches[matches.length-1].row+1;}
  return {format:'zoe-lyrics-search',schema_version:1,query:options.query,query_bytes:options.pattern.length,source_sha256:sha,source_bytes:raw.length,total_rows:texts.length,total_matched_rows:count,start_row:start,max_results:limit,matches,next_row,review_notes:[...notes]};
 }
 function markdown(data){const lines=['# 原句搜尋','',`全部${data.total_rows}句；命中${data.total_matched_rows}句；此批${data.matches.length}句。`,`查詢${data.query_bytes} UTF-8 bytes；來源SHA-256：${data.source_sha256}。`,''];for(const hit of data.matches)lines.push(`- 第${hit.row}句：第一個命中UTF-8 bytes ${hit.start_byte}–${hit.end_byte}。`);if(data.next_row!==null)lines.push(`- 接續從原句${data.next_row}開始，需同一来源SHA。`);return [...lines,'',...data.review_notes,''].join('\n');}

 const equal=J.sameValue;
 function checkedReply(reply,expected,version){
  const exact=(v,keys)=>v&&typeof v==='object'&&!Array.isArray(v)&&Object.keys(v).length===keys.length&&keys.every(k=>Object.hasOwn(v,k));
  if(!exact(reply,['files','data','meta'])||!exact(reply.meta,['version','protocol_version','needs_review'])||reply.meta.version!==version||reply.meta.protocol_version!==1||reply.meta.needs_review!==true||!equal(reply.data,expected)||!exact(reply.files,['lyrics-search.json','lyrics-search.md'])||typeof reply.files['lyrics-search.md']!=='string'||!equal(J.parse(reply.files['lyrics-search.json'],{maxBytes:1024*1024,label:'原句搜尋報告'}),expected)||reply.files['lyrics-search.md']!==markdown(expected))throw Error('搜尋回覆與本次原文或版本不符；原句保持');
  return structuredClone(expected);
 }
 const api=Object.freeze({checkedTexts,checkedRequest,search,markdown,checkedReply,maxRows,maxSourceBytes});if(typeof module==='object'&&module.exports)module.exports=api;else root.MusicLyricsSearch=api;
})(typeof globalThis==='object'?globalThis:this);
