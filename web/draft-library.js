// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
  const clone=value=>structuredClone(value);
  function fingerprint(value){
    const stable=x=>Array.isArray(x)?x.map(stable):x&&typeof x==='object'?
      Object.fromEntries(Object.keys(x).sort().map(key=>[key,stable(x[key])])):x;
    return JSON.stringify(stable(value.panels));
  }
  function createLibraryController({request,capture,validate,newId,onSaved,onList,onReady,onError,onPending}){
    let pending=null,saving=false,listToken=0,readToken=0;
    async function send(){
      if(saving||!pending)return false;
      const job=pending;saving=true;onPending({pending:true,saving:true});
      try{
        const result=await request('save',clone(job.payload));
        if(pending!==job)return false;
        pending=null;
        onSaved({entry:result.entry,reused:result.reused,changed:fingerprint(capture())!==job.fingerprint});
        return true;
      }catch(error){
        if(pending===job){
          // A transport/5xx failure may follow a successful disk commit. Keep ID and content.
          if(error.status>=400&&error.status<500)pending=null;
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
        try{const result=await request('list',{limit:20,cursor});if(token!==listToken)return false;onList(result,cursor!==null);return true;}
        catch(error){if(token===listToken)onError(error,{retryable:false});return false;}},
      async read(id){const token=++readToken;
        try{const result=await request('read',{id});if(token!==readToken)return false;
          const draft=validate(result.draft);onReady({entry:clone(result.entry),draft});return true;}
        catch(error){if(token===readToken)onError(error,{retryable:false});return false;}},
      cancelRead:()=>++readToken,
      cancel(){readToken++;listToken++;},
      pending:()=>pending?clone(pending.payload):null
    };
  }
  const api={createLibraryController,fingerprint};
  if(typeof module==='object'&&module.exports)module.exports=api;else root.MusicLibrary=api;
})(typeof globalThis==='object'?globalThis:this);
