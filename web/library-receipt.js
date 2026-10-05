// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
  const node=typeof module==='object'&&module.exports;
  const R=node?require('./readiness-report.js'):root.MusicReadinessReport;
  const D=node?require('./library-revision.js'):root.MusicLibraryRevision;
  const V=node?require('./planning-values.js'):root.MusicPlanningValues;
  const exact=(v,keys)=>v&&typeof v==='object'&&!Array.isArray(v)&&Object.keys(v).length===keys.length&&keys.every(k=>Object.hasOwn(v,k));
  const fail=()=>{throw Error('保存回應或回讀與點擊時草稿不一致；保存結果尚未確認');};
  function checkedAck(payload,result,validate){
    if(!exact(payload,['id','label','draft'])||typeof payload.id!=='string'||!/^draft-[0-9a-f]{32}$/.test(payload.id)||
        typeof payload.label!=='string'||!V.trim(payload.label)||Array.from(payload.label).length>200||
        !exact(result,['entry','reused','status'])||typeof result.reused!=='boolean'||result.status!=='draft_only_not_validated')fail();
    const draft=validate(payload.draft),entry=D.checkedEntry(payload.id,result.entry,draft);
    if(entry.label!==payload.label)fail();
    return structuredClone(result);
  }
  function checkedReadback(payload,ack,readback,validate){
    const receipt=checkedAck(payload,ack,validate);
    const revision=D.checkedRead(payload.id,readback,validate,receipt.entry);
    R.checkedDocument({expected:validate(payload.draft),document:revision.draft,label:'點擊時草稿回讀'});
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
