// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
 const pack=typeof module==='object'&&module.exports?require('./delivery-package.js'):root.MusicDeliveryPackage;
 const exact=(v,keys)=>v&&typeof v==='object'&&!Array.isArray(v)&&Object.keys(v).length===keys.length&&keys.every(k=>Object.hasOwn(v,k));
 const integer=(v,max)=>Number.isSafeInteger(v)&&v>=0&&v<=max,sha=v=>typeof v==='string'&&/^[0-9a-f]{64}$/.test(v);
 const record=v=>exact(v,['bytes','sha256'])&&integer(v.bytes,pack.maxSource)&&sha(v.sha256);
 function report(source,comparison){
  if(!exact(source,['format','schema_version','archive_bytes','archive_sha256','manifest'])||source.format!=='zoe-delivery-inspection'||source.schema_version!==1||!integer(source.archive_bytes,pack.maxArchive)||!source.archive_bytes||!sha(source.archive_sha256))throw Error('比較報告來源摘要無效');
  const m=source.manifest;
  if(!exact(m,['format','schema_version','tool_version','scope','label','source_type','content_validation','file_count','source_bytes','files'])||m.format!=='zoe-delivery-manifest'||m.schema_version!==1||!['0.38.0','0.39.0','0.40.0','0.41.0','0.42.0','0.43.0','0.44.0','0.45.0','0.46.0'].includes(m.tool_version)||m.source_type!=='provided_text_files'||m.content_validation!=='not_performed'||!Array.isArray(m.files)||m.files.length<1||m.files.length>64)throw Error('比較報告交付清單不支援');
  const incoming={};for(const f of m.files){if(!exact(f,['name','bytes','sha256'])||typeof f.name!=='string'||Object.hasOwn(incoming,f.name)||!record({bytes:f.bytes,sha256:f.sha256}))throw Error('比較報告清單檔案無效');incoming[f.name]={bytes:f.bytes,sha256:f.sha256};}
  pack.source({scope:m.scope,label:m.label,files:Object.fromEntries(Object.keys(incoming).map(n=>[n,'']))});
  const equal=(a,b)=>JSON.stringify(a)===JSON.stringify(b),total=files=>Object.values(files).reduce((sum,f)=>sum+f.bytes,0);
  if(!equal(Object.keys(incoming),Object.keys(incoming).sort())||m.file_count!==Object.keys(incoming).length||m.source_bytes!==total(incoming)||!integer(m.source_bytes,pack.maxSource))throw Error('比較報告清單合計不符');
  if(!exact(comparison,['format','schema_version','scope','baseline','incoming','counts','files'])||comparison.format!=='zoe-delivery-comparison'||comparison.schema_version!==1||comparison.scope!==m.scope||!Array.isArray(comparison.files)||comparison.files.length<1||comparison.files.length>128)throw Error('比較報告比較版本或工作台不符');
  const before={},after={},names=[],counts={added:0,changed:0,removed:0,unchanged:0};
  for(const f of comparison.files){if(!exact(f,['name','status','before','incoming'])||typeof f.name!=='string')throw Error('比較報告檔案欄位無效');names.push(f.name);const a=f.before,b=f.incoming;
   if((a!==null&&!record(a))||(b!==null&&!record(b))||(a===null&&b===null))throw Error('比較報告原文摘要無效');
   const status=a===null?'added':b===null?'removed':a.bytes===b.bytes&&a.sha256===b.sha256?'unchanged':'changed';if(f.status!==status)throw Error('比較報告變更狀態不符');counts[status]++;
   if(a!==null)before[f.name]=a;if(b!==null)after[f.name]=b;
  }
  if(!equal(names,[...new Set(names)].sort())||Object.keys(after).length!==Object.keys(incoming).length||Object.keys(after).some(n=>!Object.hasOwn(incoming,n)||after[n].bytes!==incoming[n].bytes||after[n].sha256!==incoming[n].sha256)||Object.keys(before).length>64)throw Error('比較報告來源或順序不符');
  if(Object.keys(before).length)pack.source({scope:m.scope,label:'',files:Object.fromEntries(Object.keys(before).map(n=>[n,'']))});
  for(const [key,files] of [['baseline',before],['incoming',after]]){const v=comparison[key];if(!exact(v,['file_count','source_bytes'])||v.file_count!==Object.keys(files).length||v.source_bytes!==total(files)||!integer(v.source_bytes,pack.maxSource))throw Error('比較報告合計不符');}
  if(!exact(comparison.counts,Object.keys(counts))||Object.keys(counts).some(k=>comparison.counts[k]!==counts[k]))throw Error('比較報告計數不符');
  return{format:'zoe-delivery-comparison-report',schema_version:1,tool_version:pack.version,source:structuredClone(source),comparison:structuredClone(comparison),needs_review:true};
 }
 function literal(value){let out='';for(const c of value){const n=c.codePointAt(0);if(n<32||n===127)out+=({'\n':'\\n','\r':'\\r','\t':'\\t'})[c]||'\\u'+n.toString(16).padStart(4,'0');else if(c==='&')out+='&amp;';else if(c==='<')out+='&lt;';else if(c==='>')out+='&gt;';else if('\\`*_{}[]()#!|'.includes(c))out+='\\'+c;else out+=c;}return out;}
 function files(source,comparison){
  const data=report(source,comparison),m=source.manifest,c=comparison.counts,labels={added:'新增',changed:'變更',removed:'移除',unchanged:'相同'};
  const lines=['# 交付差異審閱報告','',`工作台：${m.scope}`,`來源工具：${m.tool_version}`,`來源說明：${literal(m.label)}`,`ZIP bytes：${source.archive_bytes}`,`ZIP SHA-256：${source.archive_sha256}`,'',`新增 ${c.added}／變更 ${c.changed}／移除 ${c.removed}／相同 ${c.unchanged}`,'','| 檔案 | 狀態 | 原 bytes | 原 SHA-256 | 新 bytes | 新 SHA-256 |','| --- | --- | ---: | --- | ---: | --- |'];
  for(const f of comparison.files){const a=f.before,b=f.incoming;lines.push('| `'+f.name+'` | '+labels[f.status]+' | '+(a!==null?a.bytes:'不存在')+' | '+(a!==null?a.sha256:'—')+' | '+(b!==null?b.bytes:'不存在')+' | '+(b!==null?b.sha256:'—')+' |');}
  lines.push('','依原始UTF-8位元組與精確檔名比較；載入會取代全部成果，不合併。','只保存來源與差異摘要；原文、音檔、路徑及時間戳不包含。','雜湊與差異不驗證作者、素材權利、創作品質或媒體接受；仍需人工審閱。','');
  const result={'delivery-comparison.json':JSON.stringify(data,null,2)+'\n','delivery-comparison.md':lines.join('\n')};
  if(Object.values(result).reduce((sum,text)=>sum+new TextEncoder().encode(text).length,0)>256*1024)throw Error('比較報告超過256KiB');return result;
 }
 const api={report,files,literal};if(typeof module==='object'&&module.exports)module.exports=api;else root.MusicDeliveryReport=api;
})(typeof globalThis==='object'?globalThis:this);
