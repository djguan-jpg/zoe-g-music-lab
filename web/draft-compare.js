// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
 const node=typeof module==='object'&&module.exports;
 const Editor=node?require('./editor-state.js'):root.MusicEditor;
 const Json=node?require('../musiclab/assets/json-document.js'):root.MusicJsonDocument;
 const Contract=node?require('../contracts/draft-v3.json'):root.MusicDraftContract;
 const maxDraft=1048576,maxDetails=200,maxDetailBytes=131072,maxReportBytes=262144,excerptBytes=128;
 const notes=[
  '比對完整草稿 schema3 的原字串；不修剪、正規化、轉換數字或合併內容。未完成創作欄位也可比較。',
  '集合只按原位置1起比較；插入、刪除或換序可能造成後續多列差異，沒有推定移動、作者或穩定列ID。',
  'tool_version、saved_at 與 tab 的變化另列 metadata；作品差異只比較四個 panels。雜湊是完整草稿的 canonical UTF-8，不是原檔排版位元組。',
  '明細保留有界原文摘錄、完整欄位雜湊與UTF-8長度；計數涵蓋全部來源。沒有替換、保存、路徑存取、模型、媒體或作品接受判定。'
 ];
 const encode=s=>{Json.assertUnicode(s);return new TextEncoder().encode(s);};
 const exact=(v,keys)=>v&&typeof v==='object'&&!Array.isArray(v)&&Object.keys(v).length===keys.length&&keys.every(k=>Object.hasOwn(v,k));
 function sorted(value){
  if(Array.isArray(value))return value.map(sorted);
  if(value&&typeof value==='object')return Object.fromEntries(Object.keys(value).sort().map(k=>[k,sorted(value[k])]));
  return value;
 }
 const canonical=draft=>JSON.stringify(sorted(draft),null,2)+'\n';
 function source(document){
  if(!Json.sameValue(document,document))throw Error('草稿比較來源不是完整字面 JSON 或含無效 Unicode；目前內容保留');
  const draft=Editor.validateDraft(document),raw=encode(canonical(draft));
  if(raw.length>maxDraft)throw Error('完整草稿比較每份最多1 MiB；請減少內容');
  return {draft,raw};
 }
 function prepare(payload){
  if(!Json.sameValue(payload,payload)||!exact(payload,['baseline','current']))throw Error('比較需要兩份完整 v3 草稿，不能指定路徑');
  return {baseline:source(payload.baseline).draft,current:source(payload.current).draft};
 }
 async function hash(raw){
  const bytes=new Uint8Array(await globalThis.crypto.subtle.digest('SHA-256',raw));
  return Array.from(bytes,v=>v.toString(16).padStart(2,'0')).join('');
 }
 async function compare(payload,{sha256=hash}={}){
  const received=prepare(payload),left=source(received.baseline),right=source(received.current);
  const before=left.draft,after=right.draft,details=[];let detailBytes=0,stopped=false;
  async function digest(raw){const value=await sha256(raw);if(typeof value!=='string'||!/^\w{64}$/.test(value)||!/^[0-9a-f]+$/.test(value))throw Error('草稿比較雜湊未完成');return value;}
  const baselineHash=await digest(left.raw),currentHash=await digest(right.raw);
  const views=new Map();
  async function valueView(value){
   if(value===null)return null;
   if(views.has(value))return structuredClone(views.get(value));
   const raw=encode(value);let end=Math.min(excerptBytes,raw.length);
   while(end>0&&end<raw.length&&(raw[end]&192)===128)end--;
   const excerpt=new TextDecoder('utf-8',{fatal:true}).decode(raw.subarray(0,end));
   const view={bytes:raw.length,sha256:await digest(raw),excerpt,excerpt_truncated:raw.length>end};
   views.set(value,view);return structuredClone(view);
  }
  async function retain(scope,collection,row,status,old,newValue,fields){
   if(stopped||details.length===maxDetails){stopped=true;return;}
   const changes=[];
   for(const field of fields)changes.push({field,before:await valueView(old===null?null:old[field]),after:await valueView(newValue===null?null:newValue[field])});
   const item={scope,collection,row,status,fields:changes},encoded=JSON.stringify(item,null,2);
   const size=encode(encoded).length+4*(encoded.split('\n').length)+8;
   if(detailBytes+size>maxDetailBytes){stopped=true;return;}
   details.push(item);detailBytes+=size;
  }
  const metadata=['tool_version','saved_at','tab'].filter(k=>before[k]!==after[k]);
  for(const key of metadata)await retain('metadata','metadata',null,'changed',before,after,[key]);
  const panels={};let count=metadata.length;
  for(const [scope,fields] of Object.entries(Contract.fields)){
   const old=before.panels[scope],current=after.panels[scope],changed=fields.filter(k=>old.fields[k]!==current.fields[k]);
   for(const key of changed)await retain(scope,'fields',null,'changed',old.fields,current.fields,[key]);
   const summary={changed_fields:changed,collections:{},change_count:changed.length},collections=[];
   if(Contract.rows[scope])collections.push([Contract.rows[scope].key,Contract.rows[scope].columns]);
   if(scope==='music')collections.push(['avoid',['value']],['deliverables',['value']]);
   if(scope==='storyboard')collections.push(['motifs',['id','name','meaning']]);
   for(const [collection,columns] of collections){
    const a=old[collection],b=current[collection];
    const stats={baseline_rows:a.length,current_rows:b.length,changed_rows:0,added_rows:Math.max(0,b.length-a.length),removed_rows:Math.max(0,a.length-b.length)};
    for(let i=0;i<Math.max(a.length,b.length);i++){
     let previous=i<a.length?a[i]:null,next=i<b.length?b[i]:null;
     if(['avoid','deliverables'].includes(collection)){if(previous!==null)previous={value:previous};if(next!==null)next={value:next};}
     const keys=previous===null||next===null?columns:columns.filter(k=>previous[k]!==next[k]);if(!keys.length)continue;
     const status=previous===null?'added':next===null?'removed':'changed';if(status==='changed')stats.changed_rows++;
     await retain(scope,collection,i+1,status,previous,next,keys);
    }
    summary.collections[collection]=stats;summary.change_count+=stats.changed_rows+stats.added_rows+stats.removed_rows;
   }
   panels[scope]=summary;count+=summary.change_count;
  }
  const report={format:'zoe-draft-comparison',schema_version:1,status:count?'different':'identical',creative_changed:Object.values(panels).some(v=>v.change_count>0),metadata_changed:metadata.length>0,
   source:{encoding:'draft3_canonical_utf8',baseline_sha256:baselineHash,current_sha256:currentHash,baseline_bytes:left.raw.length,current_bytes:right.raw.length},
   metadata:{changed_fields:metadata},panels,change_count:count,details,details_truncated:details.length<count,review_notes:[...notes]};
  if(encode(JSON.stringify(report,null,2)+'\n').length+encode(markdown(report)).length>maxReportBytes)throw Error('比較報告超過256 KiB；原草稿保持');
  return report;
 }
 function markdown(data){
  const lines=['# 完整草稿原值比較','',`差異 ${data.change_count} 項；保留明細 ${data.details.length} 項。`,
   `作品內容有差異：${data.creative_changed?'是':'否'}；metadata 有差異：${data.metadata_changed?'是':'否'}。`,'',
   `基準 SHA-256：${data.source.baseline_sha256}`,`目前 SHA-256：${data.source.current_sha256}`,''];
  for(const [scope,s] of Object.entries(data.panels)){
   lines.push(`- ${scope}：${s.change_count} 項；原欄位 ${s.changed_fields.length} 項。`);
   for(const [name,v] of Object.entries(s.collections))lines.push(`  - ${name}：${v.baseline_rows} → ${v.current_rows} 列；變更 ${v.changed_rows}、新增 ${v.added_rows}、移除 ${v.removed_rows}。`);
  }
  lines.push('','## 原位置明細','');
  for(const d of data.details)lines.push(`- ${d.scope}.${d.collection}${d.row===null?'':`[${d.row}]`} · ${d.status}：${d.fields.map(f=>f.field).join(', ')}`);
  if(data.details_truncated)lines.push('明細已達容量限制；完整計數保留，原文摘錄及欄位雜湊請讀取 JSON。');
  return [...lines,'',...data.review_notes,''].join('\n');
 }
 const api={source,prepare,compare,canonical,markdown,maxDraft,maxDetails,maxDetailBytes,maxReportBytes,excerptBytes};
 if(node)module.exports=api;else root.MusicDraftCompare=api;
})(typeof globalThis==='object'?globalThis:this);
