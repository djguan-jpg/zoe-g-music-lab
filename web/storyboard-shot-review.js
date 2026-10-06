// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
 const node=typeof module==='object'&&module.exports;
 const S=node?require('./storyboard-readiness.js'):root.MusicStoryboardReadiness;
 const J=node?require('../musiclab/assets/json-document.js'):root.MusicJsonDocument;
 const V=node?require('../musiclab/assets/delivery-versions.js'):root.MusicDeliveryVersions;
 const Focus=node?require('./editor-focus.js'):root.MusicEditorFocus;
 const Checkpoint=node?require('./readiness-state.js'):root.MusicReadinessState;
 const notes=['只檢查選定原始鏡號的必填欄位、畫面方向與母題引用；其他鏡頭及全片時間、影格、連戲未在本報告驗證。','原字串、鏡號與母題 ID 保留；沒有補寫創作或呼叫模型，實際音畫與素材授權另行核對。'];
 function report(payload){
  if(!payload||!J.sameValue(payload,payload)||!J.sameValue(Object.keys(payload).sort(),['panel','row']))throw Error('單鏡檢查只接受 panel 與 row 原始鏡號');
  const d=S.inspectRow(payload.panel,payload.row);
  return {format:'zoe-storyboard-shot-review',schema_version:1,status:d.issueCount?'needs_correction':'fields_checked',row:d.row,total_shots:d.totalShots,source:d.source,
   issue_count:d.issueCount,issues:d.issues.map(({relatedRow,...issue})=>({...issue,related_row:relatedRow})),details_truncated:false,review_notes:[...notes]};
 }
 function markdown(data){
  const lines=['# 選定鏡頭待辦','',`鏡頭 ${data.row}／共${data.total_shots}鏡；待辦${data.issue_count}項。`,''];
  for(const i of data.issues)lines.push(`- 鏡頭 ${i.row} · ${S.labels[i.field]}：${i.message}${i.related_row!==null?`（母題 ${i.related_row}）`:''}`);
  if(!data.issue_count)lines.push('選定鏡頭欄位沒有待辦；仍須整份分鏡建立與實際音畫驗證。');
  return [...lines,'',...data.review_notes,''].join('\n');
 }
 function checkedResult(payload,reply){
  const expected=report(payload),names=['storyboard-shot-review.json','storyboard-shot-review.md'];
  const invalid=()=>{throw Error('單鏡待辦報告與目前來源不符；原內容與成果保留');};
  if(!reply||!J.sameValue(Object.keys(reply).sort(),['data','files','meta'])||!J.sameValue(reply.meta,{version:V.current,protocol_version:1,needs_review:true})||!J.sameValue(reply.data,expected)||!reply.files||!J.sameValue(Object.keys(reply.files).sort(),names)||typeof reply.files[names[0]]!=='string'||typeof reply.files[names[1]]!=='string')invalid();
  const data=J.parse(reply.files[names[0]],{maxBytes:256*1024,label:'單鏡待辦報告'});
  if(!J.sameValue(data,expected)||reply.files[names[1]]!==markdown(expected))invalid();
  return {data:structuredClone(expected),files:{[names[0]]:reply.files[names[0]],[names[1]]:reply.files[names[1]]}};
 }
 function source(value){
  const ids=Focus.checkedSource('shots',{ids:value.ids,visible:true,busy:false}).ids;
  if(ids.length!==value.panel.shots.length)throw Error('分鏡鏡頭識別不完整；目前內容保留');
  const row=ids.indexOf(value.selectedId)+1,data=report({panel:value.panel,row});
  return {ids,selectedId:value.selectedId,row,total_shots:data.total_shots,source:data.source};
 }
 function createController({capture,onState=()=>{}}){
  const proofs=new WeakMap();
  const controller=Checkpoint.createController({capture,source,inspect:value=>{
   const data=report({panel:{fields:value.source.fields,motifs:value.source.motifs,shots:[value.source.shot]},row:1});
   data.row=value.row;data.total_shots=value.total_shots;data.issues.forEach(i=>i.row=value.row);return data;
  },onState});
  return {...controller,payload(){const value=capture(),selected=source(value),payload={panel:structuredClone(value.panel),row:selected.row};proofs.set(payload,selected);return payload;},isCurrent(payload){try{const selected=source(capture()),expected=report(payload);return proofs.has(payload)&&J.sameValue(selected,proofs.get(payload))&&selected.row===expected.row&&selected.total_shots===expected.total_shots&&J.sameValue(selected.source,expected.source);}catch{return false;}}};
 }
 const api=Object.freeze({report,markdown,checkedResult,createController,labels:S.labels});
 if(node)module.exports=api;else root.MusicStoryboardShotReview=api;
})(typeof window==='object'?window:{});
