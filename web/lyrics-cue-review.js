// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
 const node=typeof module==='object'&&module.exports;
 const R=node?require('../musiclab/assets/lyrics-review.js'):root.MusicLyricsReview;
 const J=node?require('../musiclab/assets/json-document.js'):root.MusicJsonDocument;
 const V=node?require('../musiclab/assets/delivery-versions.js'):root.MusicDeliveryVersions;
 const F=node?require('./editor-focus.js'):root.MusicEditorFocus;
 const C=node?require('./readiness-state.js'):root.MusicReadinessState;
 const report=R.cueReview,markdown=R.cueMarkdown,maxReportBytes=256*1024;
 function checkedResult(payload,reply){
  const expected=report(payload),names=['lyrics-cue-review.json','lyrics-cue-review.md'];
  if(!reply||!J.sameValue(reply,reply)||!J.sameValue(Object.keys(reply).sort(),['data','files','meta'])||!J.sameValue(reply.meta,{version:V.current,protocol_version:1,needs_review:true})||!J.sameValue(reply.data,expected)||!reply.files||!J.sameValue(Object.keys(reply.files).sort(),names)||!J.sameValue(J.parse(reply.files[names[0]],{maxBytes:maxReportBytes,label:'單句待辦報告'}),expected)||reply.files[names[1]]!==markdown(expected))throw Error('單句報告與目前來源或版本不符；原內容與成果保留');
  return {data:expected,files:{[names[0]]:reply.files[names[0]],[names[1]]:reply.files[names[1]]}};
 }
 function source(value){
  if(!value||!J.sameValue(value,value)||!J.sameValue(Object.keys(value).sort(),['ids','lyrics','selectedId']))throw Error('選定歌詞來源格式不支援');
  R.checkedSource(value.lyrics);
  const ids=F.checkedSource('cues',{ids:value.ids,visible:true,busy:false}).ids;
  if(ids.length!==value.lyrics.cues.length)throw Error('歌詞識別與原列數不一致；目前內容保留');
  const row=ids.indexOf(value.selectedId)+1;if(!row)throw Error('請選擇目前歌詞中有效的原句號');
  return {lyrics:structuredClone(value.lyrics),ids,selectedId:value.selectedId,row};
 }
 function createController({capture,onState=()=>{}}){
  const proofs=new WeakMap(),controller=C.createController({capture,source,inspect:selected=>report({lyrics:selected.lyrics,row:selected.row}),onState});
  return {...controller,payload(){const selected=source(capture()),payload={lyrics:structuredClone(selected.lyrics),row:selected.row};report(payload);proofs.set(payload,selected);return payload;},
   isCurrent(payload){try{const proof=proofs.get(payload);return !!proof&&J.sameValue(source(capture()),proof)&&J.sameValue(payload,{lyrics:proof.lyrics,row:proof.row});}catch{return false;}}};
 }
 const api=Object.freeze({report,markdown,checkedResult,createController});if(node)module.exports=api;else root.MusicLyricsCueReview=api;
})(typeof globalThis==='object'?globalThis:this);
