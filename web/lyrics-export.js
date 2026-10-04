// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
  const node=typeof module==='object'&&module.exports,R=node?require('../musiclab/assets/lyrics-export-review.js'):root.MusicLyricsExportReview;
  const key=value=>JSON.stringify(value);
  function createController({capture,request,onReport,onError,onState}){
    let sequence=0,pending=false;const state=()=>onState({pending});
    function invalidate(){sequence++;pending=false;state();}
    return {invalidate,async check(isCurrent=()=>true){
      const id=++sequence;pending=true;state();let before;
      const active=()=>id===sequence&&isCurrent();
      try{
        before=structuredClone(capture());const reply=await request(structuredClone(before.payload));
        if(!active())return false;
        if(key(capture())!==key(before))throw Error('格式檢查期間來源或句子位置有修改；請重新檢查');
        const data=await R.inspect(reply,before.payload);
        if(!active())return false;
        if(key(capture())!==key(before))throw Error('格式檢查期間來源或句子位置有修改；請重新檢查');
        onReport(data,structuredClone(reply.files),structuredClone(before.ids));return true;
      }catch(error){if(active())onError(error);return false;}finally{if(id===sequence){pending=false;state();}}
    }};
  }
  const api={createController};if(node)module.exports=api;else root.MusicLyricsExport=api;
})(typeof window==='undefined'?{}:window);
