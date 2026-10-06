// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
 const node=typeof module==='object'&&module.exports;
 const Model=node?require('./draft-compare.js'):root.MusicDraftCompare;
 const Json=node?require('../musiclab/assets/json-document.js'):root.MusicJsonDocument;
 const Contract=node?require('../contracts/draft-v3.json'):root.MusicDraftContract;
 const collections={music:{sections:Contract.rows.music.columns,avoid:['value'],deliverables:['value']},storyboard:{shots:Contract.rows.storyboard.columns,motifs:['id','name','meaning']},lyrics:{cues:Contract.rows.lyrics.columns}};
 const notes=[
  '核對兩份完整草稿 schema3 後，只查看指定集合的原位置1起；不依賴整份比較的前200筆保留明細。',
  '每欄保留最多128 UTF-8 bytes原文摘錄、完整欄位雜湊與長度；空字串和不存在的列分開，未變更欄位也列出。',
  '插入、刪除或換序可能改變後續原位置；沒有推定移動、穩定列ID、作者或權利。來源雜湊是完整草稿canonical UTF-8，不是原檔排版。',
  '此報告唯讀，不替換、合併、保存草稿或判定作品接受；沒有來源路徑、模型、媒體或外網能力。'
 ];
 const exact=(v,keys)=>v&&typeof v==='object'&&!Array.isArray(v)&&Object.keys(v).length===keys.length&&keys.every(k=>Object.hasOwn(v,k));
 function selection(v){
  if(!Json.sameValue(v,v)||!exact(v,['scope','collection','row'])||!Object.hasOwn(collections,v.scope)||!Object.hasOwn(collections[v.scope],v.collection)||!Number.isSafeInteger(v.row)||v.row<1||v.row>10000)throw Error('請明確選擇受支援的集合及原列1起整數；不能指定路徑');
  return structuredClone(v);
 }
 function prepare(payload){
  if(!Json.sameValue(payload,payload)||!exact(payload,['baseline','current','selection']))throw Error('原列比較需要兩份完整草稿及selection；不能指定路徑或覆蓋來源');
  const chosen=selection(payload.selection),pair=Model.prepare({baseline:payload.baseline,current:payload.current});
  if(chosen.row>Math.max(pair.baseline.panels[chosen.scope][chosen.collection].length,pair.current.panels[chosen.scope][chosen.collection].length))throw Error('指定原列在兩份草稿都不存在；請依原集合列數選擇，原內容保留');
  return {...pair,selection:chosen};
 }
 async function compare(payload,{sha256=async raw=>Array.from(new Uint8Array(await globalThis.crypto.subtle.digest('SHA-256',raw)),v=>v.toString(16).padStart(2,'0')).join('')}={}){
  const p=prepare(payload),s=p.selection,left=Model.source(p.baseline),right=Model.source(p.current),aRows=left.draft.panels[s.scope][s.collection],bRows=right.draft.panels[s.scope][s.collection];
  let a=aRows[s.row-1]??null,b=bRows[s.row-1]??null;
  if(['avoid','deliverables'].includes(s.collection)){a=a===null?null:{value:a};b=b===null?null:{value:b};}
  async function digest(raw){const result=await sha256(raw);if(typeof result!=='string'||!/^[0-9a-f]{64}$/.test(result))throw Error('草稿比較雜湊未完成');return result;}
  async function value(v){
   if(v===null)return null;Json.assertUnicode(v);const raw=new TextEncoder().encode(v);let end=Math.min(128,raw.length);
   while(end>0&&end<raw.length&&(raw[end]&192)===128)end--;
   return {bytes:raw.length,sha256:await digest(raw),excerpt:new TextDecoder('utf-8',{fatal:true}).decode(raw.subarray(0,end)),excerpt_truncated:raw.length>end};
  }
  const source={encoding:'draft3_canonical_utf8',baseline_sha256:await digest(left.raw),current_sha256:await digest(right.raw),baseline_bytes:left.raw.length,current_bytes:right.raw.length},fields=[];
  for(const field of collections[s.scope][s.collection])fields.push({field,changed:a===null||b===null||a[field]!==b[field],before:await value(a===null?null:a[field]),after:await value(b===null?null:b[field])});
  const report={format:'zoe-draft-row-comparison',schema_version:1,selection:s,status:a===null?'added':b===null?'removed':fields.some(f=>f.changed)?'changed':'unchanged',baseline_rows:aRows.length,current_rows:bRows.length,source,fields,review_notes:[...notes]};
  if(new TextEncoder().encode(JSON.stringify(report,null,2)+'\n'+markdown(report)).length>65536)throw Error('原列比較報告最多64 KiB；原內容保留');
  return report;
 }
 function markdown(data){const s=data.selection,lines=['# 草稿指定原列比較','',`原位置：${s.scope}.${s.collection}[${s.row}] · ${data.status}`,`集合列數：${data.baseline_rows} → ${data.current_rows}`,`基準 SHA-256：${data.source.baseline_sha256}`,`目前 SHA-256：${data.source.current_sha256}`,'','## 欄位',''];for(const f of data.fields)lines.push(`- ${f.field}：${f.changed?'有變動':'未變更'}；原文摘錄與完整欄位SHA／bytes見JSON。`);return [...lines,'',...data.review_notes,''].join('\n');}
 function fullValues(payload){
  const p=prepare(payload),s=p.selection,aRows=p.baseline.panels[s.scope][s.collection],bRows=p.current.panels[s.scope][s.collection];
  let a=aRows[s.row-1]??null,b=bRows[s.row-1]??null;
  if(['avoid','deliverables'].includes(s.collection)){a=a===null?null:{value:a};b=b===null?null:{value:b};}
  return {selection:s,fields:collections[s.scope][s.collection].map(field=>({field,before:a===null?null:a[field],after:b===null?null:b[field]}))};
 }
 function navigation(payload){
  const p=prepare(payload),s=p.selection,a=p.baseline.panels[s.scope][s.collection],b=p.current.panels[s.scope][s.collection],rows=Math.max(a.length,b.length),strings=['avoid','deliverables'].includes(s.collection);
  let changes=0,ordinal=null,previous=null,next=null;
  for(let i=0;i<rows;i++){
   const left=a[i]??null,right=b[i]??null,changed=left===null||right===null||(strings?left!==right:collections[s.scope][s.collection].some(key=>left[key]!==right[key]));
   if(!changed)continue;
   changes++;const position=i+1;if(position<s.row)previous=position;else if(position===s.row)ordinal=changes;else if(next===null)next=position;
  }
  return {selection:s,rows,changes,ordinal,previous,next};
 }
 const api={prepare,selection,compare,canonical:Model.canonical,markdown,fullValues,navigation};if(node)module.exports=api;else root.MusicDraftCompareRow=api;
})(typeof globalThis==='object'?globalThis:this);
