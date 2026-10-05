// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
  const node=typeof module==='object'&&module.exports;
  const R=node?require('./readiness-report.js'):root.MusicReadinessReport;
  const J=node?require('../musiclab/assets/json-document.js'):root.MusicJsonDocument;
  const V=node?require('./planning-values.js'):root.MusicPlanningValues;
  const exact=(v,keys)=>v&&typeof v==='object'&&!Array.isArray(v)&&Object.keys(v).length===keys.length&&keys.every(k=>Object.hasOwn(v,k));
  const identifier=id=>typeof id==='string'&&/^draft-[0-9a-f]{32}$/.test(id);
  const fail=()=>{throw Error('保存版本與選定 ID、內容或版本資料不一致；目前工作台保留');};
  function checkedEntry(id,entry,draft){
    if(!identifier(id)||!exact(entry,['library_schema_version','id','label','stored_at','sha256','bytes','draft_schema_version','created_with','titles'])||
        entry.library_schema_version!==1||entry.draft_schema_version!==3||entry.id!==id||typeof entry.label!=='string'||!V.trim(entry.label)||Array.from(entry.label).length>200||
        typeof entry.stored_at!=='string'||entry.stored_at.length>128||!/(?:Z|[+-]00:00)$/.test(entry.stored_at)||!Number.isFinite(Date.parse(entry.stored_at))||
        typeof entry.sha256!=='string'||!/^[0-9a-f]{64}$/.test(entry.sha256)||!Number.isSafeInteger(entry.bytes)||entry.bytes<1||entry.bytes>1024*1024||
        typeof entry.created_with!=='string'||Array.from(entry.created_with).length>64||!exact(entry.titles,['music','storyboard','lyrics']))fail();
    for(const [panel,key] of [['music','music-title'],['storyboard','mv-title'],['lyrics','lyrics-title']])
      if(entry.titles[panel]!==Array.from(draft.panels[panel].fields[key]).slice(0,120).join(''))fail();
    for(const value of [entry.label,entry.created_with,...Object.values(entry.titles)])J.assertUnicode(value,'保存版本');
    return structuredClone(entry);
  }
  function checkedSelection(id,entry,selected){
    if(!identifier(id)||!entry||entry.id!==id||!selected||selected.id!==id)fail();
    return R.checkedDocument({expected:selected,document:entry,label:'選定保存版本資料'});
  }
  function checkedRead(id,result,validate,selected=null){
    if(!exact(result,['entry','draft','status'])||result.status!=='draft_only_not_validated')fail();
    const draft=validate(result.draft),entry=checkedEntry(id,result.entry,draft);
    if(selected!==null)checkedSelection(id,entry,selected);
    return {entry,draft};
  }
  const api={checkedEntry,checkedSelection,checkedRead};if(node)module.exports=api;else root.MusicLibraryRevision=api;
})(typeof globalThis==='object'?globalThis:this);
