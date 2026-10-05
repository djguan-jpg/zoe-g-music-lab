// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
  // Request ownership is released on invalidation. Local hashing may settle later.
  function createLifecycle({createAbort}){
    if(typeof createAbort!=='function')throw Error('缺少搜尋請求取消控制');
    let owned=null;
    return {
      begin(){
        if(owned)throw Error('搜尋請求尚未完成');
        const aborter=createAbort();
        if(!aborter||typeof aborter.abort!=='function'||!aborter.signal)throw Error('無法建立搜尋請求取消控制');
        const job=Object.freeze({signal:aborter.signal});owned={job,aborter};return job;
      },
      current(job){return owned!==null&&owned.job===job;},
      invalidate(){
        if(!owned)return false;
        const previous=owned;owned=null;previous.aborter.abort();return true;
      },
      finish(job){if(!owned||owned.job!==job)return false;owned=null;return true;}
    };
  }
  const api=Object.freeze({createLifecycle});if(typeof module==='object'&&module.exports)module.exports=api;else root.MusicSearchRequest=api;
})(typeof globalThis==='object'?globalThis:this);
