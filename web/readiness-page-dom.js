// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
 const D=typeof module==='object'&&module.exports?require('./issue-page-dom.js'):root.MusicIssuePageDOM;
 function bind(document,{prefix,visible,busy,renderItem,onLocate,onError=()=>{}}){
  let selected={report:null,stale:false,revision:0};
  const pager=D.bind(document,{prefix,capture:()=>({detailCount:selected.report?.issues.length||0,totalCount:selected.report?.issueCount||0,revision:selected.revision,stale:selected.stale,busy:busy(),visible:visible()}),
   renderItem:(index,locate,disabled)=>renderItem(selected.report.issues[index],locate,disabled),onLocate:index=>onLocate(index,selected.revision),onError});
  return {view:pager.view,refresh:pager.refresh,render(value){
   if(!value||Object.keys(value).length!==3||!['report','stale','revision'].every(k=>Object.hasOwn(value,k))||typeof value.stale!=='boolean'||!Number.isSafeInteger(value.revision)||value.revision<0||value.report!==null&&(!Array.isArray(value.report?.issues)||!Number.isSafeInteger(value.report.issueCount)||value.report.issueCount<value.report.issues.length||value.report.issues.length>200))throw Error('待辦分頁報告狀態無效；目前內容保留');
   const changed=selected.revision!==value.revision;selected=value;return changed?pager.reset():pager.refresh();
  }};
 }
 const api=Object.freeze({bind});if(typeof module==='object'&&module.exports)module.exports=api;else root.MusicReadinessPageDOM=api;
})(typeof globalThis==='object'?globalThis:this);
