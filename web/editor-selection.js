// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
  const F=typeof module==='object'&&module.exports?require('./editor-focus.js'):root.MusicEditorFocus;
  const O=typeof module==='object'&&module.exports?require('./entry-order.js'):root.MusicEntryOrder;
  const lists=Object.freeze(['arrangement','shots','cues']);
  function source(list,value){if(!lists.includes(list))throw Error('編修選列來源無效');const s=F.checkedSource(list,value);O.checkedIds(s.ids);return s;}
  function proposal(list,value,id){const s=source(list,value);if(!s.visible||s.busy)return null;const index=s.ids.indexOf(id);if(index<0)throw Error('編修列已不存在；選列保持');return {list,id,index};}
  function createController({allowed,capture,selectTarget,onError=()=>{}}){
    let disposed=false;
    return Object.freeze({select(list,id){
      if(disposed)return false;
      try{
        if(!lists.includes(list))throw Error('編修選列來源無效');
        if(!allowed(list))return false;
        const before=source(list,capture(list)),target=proposal(list,before,id);if(!target)return false;
        if(!allowed(list))return false;
        const after=source(list,capture(list));if(!after.visible||after.busy||!O.same(before.ids,after.ids))return false;
        if(selectTarget(target)!==true)return false;
        const current=source(list,capture(list));return current.visible&&!current.busy&&O.same(after.ids,current.ids);
      }catch(error){onError(error);return false;}
    },dispose(){disposed=true;}});
  }
  const api=Object.freeze({lists,source,proposal,createController});if(typeof module==='object'&&module.exports)module.exports=api;else root.MusicEditorSelection=api;
})(typeof globalThis==='object'?globalThis:this);
