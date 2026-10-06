// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
 const node=typeof module==='object'&&module.exports;
 const R=node?require('./music-readiness.js'):root.MusicReadiness;
 const F=node?require('./editor-focus.js'):root.MusicEditorFocus;
 const C=node?require('./readiness-state.js'):root.MusicReadinessState;
 const J=node?require('../musiclab/assets/json-document.js'):root.MusicJsonDocument;
 function source(value){
  if(!value||!J.sameValue(value,value)||!J.sameValue(Object.keys(value).sort(),['ids','panel','selectedId']))throw Error('選定段落來源格式不支援');
  const ids=F.checkedSource('arrangement',{ids:value.ids,visible:true,busy:false}).ids;
  if(ids.length!==value.panel.sections?.length)throw Error('歌曲段落識別不完整；目前內容保留');
  const row=ids.indexOf(value.selectedId)+1,selected=R.inspectRow(value.panel,row);
  return {ids,selectedId:value.selectedId,...selected};
 }
 function createController({capture,onState=()=>{}}){
  return C.createController({capture,source,inspect:({ids,selectedId,...selected})=>selected,onState});
 }
 const api=Object.freeze({createController});if(node)module.exports=api;else root.MusicSectionReview=api;
})(typeof globalThis==='object'?globalThis:this);
