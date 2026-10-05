// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
  const clone=value=>structuredClone(value);
  function fingerprint(value){
    const stable=x=>Array.isArray(x)?x.map(stable):x&&typeof x==='object'?
      Object.fromEntries(Object.keys(x).sort().map(key=>[key,stable(x[key])])):x;
    return JSON.stringify(stable(value.panels));
  }
  function createLibraryController({request,capture,validate,newId,confirmSave,checkRead,checkList,onSaved,onList,onReady,onError,onPending,preview=null}){
    if(typeof confirmSave!=='function')throw Error('保存回讀核對未設定');
    if(typeof checkRead!=='function')throw Error('保存版本來源核對未設定');
    if(typeof checkList!=='function')throw Error('保存清單來源核對未設定');
    let pending=null,saving=false,listToken=0,readToken=0;
    async function send(){
      if(saving||!pending)return false;
      const job=pending;let received=false;saving=true;onPending({pending:true,saving:true});
      try{
        const ack=await request('save',clone(job.payload));received=true;
        if(pending!==job)return false;
        const result=await confirmSave(clone(job.payload),ack);
        if(pending!==job)return false;
        pending=null;
        onSaved({entry:result.entry,reused:result.reused,draft:clone(job.payload.draft),changed:fingerprint(capture())!==job.fingerprint});
        return true;
      }catch(error){
        if(pending===job){
          // After an acknowledgement, every failed readback is an uncertain save.
          // Before it, only a definite 4xx refusal releases the original ID and content.
          if(!received&&error.status>=400&&error.status<500)pending=null;
          onError(error,{retryable:pending!==null});
        }
        return false;
      }finally{saving=false;onPending({pending:pending!==null,saving:false});}
    }
    return {
      async save(label){
        if(pending||saving){onError(Error('上一筆保存尚待確認，請先重試或放棄待重試紀錄'),{retryable:pending!==null});return false;}
        try{
          if(typeof label!=='string'||!label.trim()||label.length>200)throw Error('保存名稱需為 1–200 字元的非空白文字');
          const draft=validate(capture());pending={payload:{id:newId(),label,draft:clone(draft)},fingerprint:fingerprint(draft)};
        }catch(error){onError(error,{retryable:false});return false;}
        return send();
      },retry:send,
      abandon(){if(saving)return false;pending=null;onPending({pending:false,saving:false});return true;},
      async list(cursor=null){const token=++listToken;
        try{const payload={limit:20,cursor},result=await request('list',clone(payload));if(token!==listToken)return false;
          const checked=checkList(payload,result);onList(checked,cursor!==null);return true;}
        catch(error){if(token===listToken)onError(error,{retryable:false});return false;}},
      async read(id,expectedEntry=null){const token=++readToken;let selected;
        try{const pinned=clone(expectedEntry);selected=preview?.begin();const result=await request('read',{id});if(token!==readToken)return false;
          const ready=checkRead(id,result,validate,pinned);
          if(preview&&!preview.accept(selected,ready))return false;onReady(ready);return true;}
        catch(error){if(token===readToken){
          if(preview&&selected!==undefined){try{if(!preview.check(selected))return false;}catch(changed){error=changed;}}
          onError(error,{retryable:false});
        }return false;}},
      cancelRead(){readToken++;preview?.cancel();},
      cancel(){readToken++;listToken++;preview?.cancel();},
      pending:()=>pending?clone(pending.payload):null
    };
  }
  const api={createLibraryController,fingerprint};
  if(typeof module==='object'&&module.exports)module.exports=api;else root.MusicLibrary=api;
})(typeof globalThis==='object'?globalThis:this);
