// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
 const node=typeof module==='object'&&module.exports;
 const Compare=node?require('./draft-compare.js'):root.MusicDraftCompare;
 const Json=node?require('../musiclab/assets/json-document.js'):root.MusicJsonDocument;
 const keys=['format','schema_version','status','creative_changed','metadata_changed','source','metadata','panels','change_count','details','details_truncated','review_notes'];
 function select(report,format){
  if(!['json','markdown'].includes(format))throw Error('請明確選擇比較 JSON 或摘要 Markdown');
  // Only the controller's owned producer result enters here. This is not an external report importer.
  if(!report||typeof report!=='object'||Array.isArray(report)||!Json.sameValue(report,report)||Object.keys(report).length!==keys.length||!keys.every(k=>Object.hasOwn(report,k))||report.format!=='zoe-draft-comparison'||report.schema_version!==1||report.source?.encoding!=='draft3_canonical_utf8')throw Error('比較報告格式無效；請重新比較，原內容保留');
  const files={'draft-comparison.json':JSON.stringify(report,null,2)+'\n','draft-comparison.md':Compare.markdown(report)};
  if(Object.values(files).reduce((n,s)=>n+new TextEncoder().encode(s).length,0)>Compare.maxReportBytes)throw Error('比較報告最多256 KiB；原內容保留');
  const name=format==='json'?'draft-comparison.json':'draft-comparison.md';
  return {name,content:files[name]};
 }
 const api={select};if(node)module.exports=api;else root.MusicDraftCompareDownload=api;
})(typeof globalThis==='object'?globalThis:this);
