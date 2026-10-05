// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
  const node=typeof module==='object'&&module.exports;
  const R=node?require('./readiness-report.js'):root.MusicReadinessReport;
  const J=node?require('../musiclab/assets/json-document.js'):root.MusicJsonDocument;
  const V=node?require('./planning-values.js'):root.MusicPlanningValues;
  const exact=(v,keys)=>v&&typeof v==='object'&&!Array.isArray(v)&&Object.keys(v).length===keys.length&&keys.every(k=>Object.hasOwn(v,k));
  const fail=()=>{throw Error('保存回應或回讀與點擊時草稿不一致；保存結果尚未確認');};
  function checkedAck(payload,result,validate){
    if(!exact(payload,['id','label','draft'])||typeof payload.id!=='string'||!/^draft-[0-9a-f]{32}$/.test(payload.id)||
        typeof payload.label!=='string'||!V.trim(payload.label)||Array.from(payload.label).length>200||
        !exact(result,['entry','reused','status'])||typeof result.reused!=='boolean'||result.status!=='draft_only_not_validated')fail();
    const draft=validate(payload.draft),entry=result.entry;
    if(!exact(entry,['library_schema_version','id','label','stored_at','sha256','bytes','draft_schema_version','created_with','titles'])||
        entry.library_schema_version!==1||entry.draft_schema_version!==3||entry.id!==payload.id||entry.label!==payload.label||
        typeof entry.stored_at!=='string'||entry.stored_at.length>128||!/(?:Z|[+-]00:00)$/.test(entry.stored_at)||!Number.isFinite(Date.parse(entry.stored_at))||
        typeof entry.sha256!=='string'||!/^[0-9a-f]{64}$/.test(entry.sha256)||!Number.isSafeInteger(entry.bytes)||entry.bytes<1||entry.bytes>1024*1024||
        typeof entry.created_with!=='string'||Array.from(entry.created_with).length>64||!exact(entry.titles,['music','storyboard','lyrics']))fail();
    for(const [panel,key] of [['music','music-title'],['storyboard','mv-title'],['lyrics','lyrics-title']])
      if(entry.titles[panel]!==Array.from(draft.panels[panel].fields[key]).slice(0,120).join(''))fail();
    for(const value of [entry.label,entry.created_with,...Object.values(entry.titles)])J.assertUnicode(value,'保存回應');
    return structuredClone(result);
  }
  function checkedReadback(payload,ack,readback,validate){
    const receipt=checkedAck(payload,ack,validate);
    if(!exact(readback,['entry','draft','status'])||readback.status!=='draft_only_not_validated')fail();
    R.checkedDocument({expected:receipt.entry,document:readback.entry,label:'保存版本回讀'});
    R.checkedDocument({expected:validate(payload.draft),document:validate(readback.draft),label:'點擊時草稿回讀'});
    return receipt;
  }
  function createVerifier({read,validate}){
    if(typeof read!=='function'||typeof validate!=='function')throw Error('保存回讀核對未設定');
    return async(payload,result)=>{
      const selected=structuredClone(payload),ack=checkedAck(selected,result,validate),readback=await read(selected.id);
      return checkedReadback(selected,ack,readback,validate);
    };
  }
  const api={checkedAck,checkedReadback,createVerifier};if(node)module.exports=api;else root.MusicLibraryReceipt=api;
})(typeof globalThis==='object'?globalThis:this);
