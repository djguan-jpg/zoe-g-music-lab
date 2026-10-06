// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
 const node=typeof module==='object'&&module.exports;
 const R=node?require('./music-readiness.js'):root.MusicReadiness;
 const F=node?require('./editor-focus.js'):root.MusicEditorFocus;
 const C=node?require('./readiness-state.js'):root.MusicReadinessState;
 const J=node?require('../musiclab/assets/json-document.js'):root.MusicJsonDocument;
 const V=node?require('../musiclab/assets/delivery-versions.js'):root.MusicDeliveryVersions;
 const notes=['只檢查選定原段落的名稱、小節、能量、敘事任務與聲音配置；其他段落、歌曲全域欄位及總時長未在本報告驗證。','原字串、段落號與順序保留；沒有補寫創作或呼叫模型，實唱／實聽及素材授權另行核對。'];
 const maxReportBytes=256*1024;
 function report(payload){
  if(!payload||!J.sameValue(payload,payload)||!J.sameValue(Object.keys(payload).sort(),['panel','row']))throw Error('單段檢查只接受 panel 與 row 原段落號');
  const d=R.inspectRow(payload.panel,payload.row);
  const data={format:'zoe-music-section-review',schema_version:1,status:d.issueCount?'needs_correction':'fields_checked',row:d.row,total_sections:d.totalSections,source:{section:d.section},issue_count:d.issueCount,issues:d.issues,details_truncated:false,review_notes:[...notes]};
  if(new TextEncoder().encode(JSON.stringify(data,null,2)+'\n').length>maxReportBytes)throw Error('單段報告 JSON 最多256 KiB；請縮短選定段落文字，原歌曲保留');
  return data;
 }
 function markdown(data){
  const lines=['# 選定歌曲段落待辦','',`段落 ${data.row}／共${data.total_sections}段；待辦${data.issue_count}項。`,''];
  for(const issue of data.issues)lines.push(`- 段落 ${issue.row} · ${R.labels[issue.field]}：${issue.message}`);
  if(!data.issue_count)lines.push('選定段落五個欄位沒有待辦；仍須整首歌曲建立與實唱／實聽驗證。');
  return [...lines,'',...data.review_notes,''].join('\n');
 }
 function checkedResult(payload,reply){
  const expected=report(payload),names=['music-section-review.json','music-section-review.md'];
  const invalid=()=>{throw Error('單段待辦報告與目前來源不符；原內容與成果保留');};
  if(!reply||!J.sameValue(reply,reply)||!J.sameValue(Object.keys(reply).sort(),['data','files','meta'])||!J.sameValue(reply.meta,{version:V.current,protocol_version:1,needs_review:true})||!J.sameValue(reply.data,expected)||!reply.files||!J.sameValue(Object.keys(reply.files).sort(),names)||typeof reply.files[names[0]]!=='string'||typeof reply.files[names[1]]!=='string')invalid();
  const data=J.parse(reply.files[names[0]],{maxBytes:maxReportBytes,label:'單段待辦報告'});
  if(!J.sameValue(data,expected)||reply.files[names[1]]!==markdown(expected))invalid();
  return {data:structuredClone(expected),files:{[names[0]]:reply.files[names[0]],[names[1]]:reply.files[names[1]]}};
 }
 function source(value){
  if(!value||!J.sameValue(value,value)||!J.sameValue(Object.keys(value).sort(),['ids','panel','selectedId']))throw Error('選定段落來源格式不支援');
  const ids=F.checkedSource('arrangement',{ids:value.ids,visible:true,busy:false}).ids;
  if(ids.length!==value.panel.sections?.length)throw Error('歌曲段落識別不完整；目前內容保留');
  const row=ids.indexOf(value.selectedId)+1,selected=R.inspectRow(value.panel,row);
  return {ids,selectedId:value.selectedId,...selected};
 }
 function createController({capture,onState=()=>{}}){
  const proofs=new WeakMap(),controller=C.createController({capture,source,inspect:({ids,selectedId,...selected})=>selected,onState});
  return {...controller,payload(){const value=capture(),selected=source(value),payload={panel:structuredClone(value.panel),row:selected.row};report(payload);proofs.set(payload,selected);return payload;},isCurrent(payload){try{const selected=source(capture()),expected=report(payload);return proofs.has(payload)&&J.sameValue(selected,proofs.get(payload))&&expected.row===selected.row&&expected.total_sections===selected.totalSections&&J.sameValue(expected.source,{section:selected.section});}catch{return false;}}};
 }
 const api=Object.freeze({createController,report,markdown,checkedResult});if(node)module.exports=api;else root.MusicSectionReview=api;
})(typeof globalThis==='object'?globalThis:this);
