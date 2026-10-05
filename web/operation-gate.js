// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
  function createGate({createAbort}){
    if(typeof createAbort!=='function')throw Error('缺少操作取消控制');
    let owned=null;
    return {
      begin(){
        if(owned)throw Error('目前操作尚未完成，請稍候');
        const aborter=createAbort();
        if(!aborter||typeof aborter.abort!=='function'||!aborter.signal)throw Error('無法建立操作取消控制');
        const job=Object.freeze({signal:aborter.signal});owned={job,aborter,cancelled:false};return job;
      },
      current(job){return owned!==null&&owned.job===job&&!owned.cancelled;},
      cancelled(job){return owned!==null&&owned.job===job&&owned.cancelled;},
      cancel(){if(!owned||owned.cancelled)return false;owned.cancelled=true;owned.aborter.abort();return true;},
      finish(job){if(!owned||owned.job!==job)return false;owned=null;return true;},
      view(){return {busy:owned!==null,cancelling:!!owned?.cancelled,canCancel:owned!==null&&!owned.cancelled};}
    };
  }
  const api={createGate};if(typeof module==='object'&&module.exports)module.exports=api;else root.MusicOperationGate=api;
})(typeof globalThis==='object'?globalThis:this);
