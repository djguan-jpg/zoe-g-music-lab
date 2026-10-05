// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
  const node=typeof module==='object'&&module.exports;
  const J=node?require('../musiclab/assets/json-document.js'):root.MusicJsonDocument;
  const models={music:node?require('./music-readiness.js'):root.MusicReadiness,
    storyboard:node?require('./storyboard-readiness.js'):root.MusicStoryboardReadiness};
  const reports=node?require('./readiness-report.js'):root.MusicReadinessReport;
  const formats={music:'zoe-music-review',storyboard:'zoe-storyboard-review'},maxBytes=1024*1024;
  function inspect(operation,document){
    if(!Object.hasOwn(models,operation))throw Error('請選擇歌曲或分鏡需求');
    if(!document||typeof document!=='object'||Array.isArray(document))throw Error('需求或待辦報告需為物件');
    if(!Object.hasOwn(document,'format'))return {kind:'brief',brief:structuredClone(document)};
    if(document.format!==formats[operation])throw Error('報告不是所選工作台的支援格式；請核對需求類型，原內容保留');
    const label=operation==='music'?'歌曲待辦報告':'分鏡待辦報告';
    const checked=reports.checkedDocument({expected:models[operation].report(document.source),document,label});
    return {kind:'review',panel:checked.source,issueCount:checked.issue_count,notes:checked.review_notes};
  }
  function decode(operation,raw,size){return inspect(operation,J.decode(raw,{size,maxBytes,label:'需求或待辦報告 JSON'}));}
  const api={inspect,decode,maxBytes};if(node)module.exports=api;else root.MusicPlanningReportInput=api;
})(typeof globalThis==='object'?globalThis:this);
