// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
  const P=typeof module==='object'&&module.exports?require('./editor-copy.js'):root.MusicEditorCopy;
  const O=typeof module==='object'&&module.exports?require('./entry-order.js'):root.MusicEntryOrder;
  const lists=Object.freeze(['shots','cues']);
  function known(list){if(!lists.includes(list))throw Error('不支援的列順序；原編修保留');}
  function source(list,value){known(list);return P.checkedSource(list,value);}
  function move(list,value,id,delta){
    const s=source(list,value);if(!s.visible||s.busy)return null;
    const order=O.move(s.entries.map(e=>e.id),id,delta),byId=new Map(s.entries.map(e=>[e.id,e]));
    return {entries:order.ids.map(id=>byId.get(id)),record:order.record};
  }
  function moveTo(list,value,id,index){
    const s=source(list,value);if(!s.visible||s.busy)return null;
    const order=O.moveTo(s.entries.map(e=>e.id),id,index);if(!order)return null;
    const byId=new Map(s.entries.map(e=>[e.id,e]));return {entries:order.ids.map(id=>byId.get(id)),record:order.record};
  }
  function restore(list,value,record){
    const s=source(list,value);if(!s.visible||s.busy)return null;
    const ids=O.restore(s.entries.map(e=>e.id),record),byId=new Map(s.entries.map(e=>[e.id,e]));return ids.map(id=>byId.get(id));
  }
  function metadata(list,value){
    known(list);
    if(!value||typeof value!=='object'||Array.isArray(value)||Object.keys(value).length!==3||!['ids','visible','busy'].every(k=>Object.hasOwn(value,k))||typeof value.visible!=='boolean'||typeof value.busy!=='boolean')throw Error('列順序狀態無效');
    const ids=O.checkedIds(value.ids);if(ids.length>P.specs[list].limit)throw Error('列順序超過容量');return {ids,visible:value.visible,busy:value.busy};
  }
  function createController({allowed,capture,apply,onError=()=>{}}){
    const records=new Map(),stale=new Set();let disposed=false;
    function refresh(list,value){
      const m=metadata(list,value),r=records.get(list);
      if(r&&!O.same(m.ids,r.after)){records.delete(list);stale.add(list);}
      const current=records.get(list);return {canUndo:!!current&&m.visible&&!m.busy,stale:stale.has(list),record:current?{id:current.id,from:current.from,to:current.to}:null};
    }
    function commit(list,before,entries,record){
      if(!allowed(list)||!P.sameSource(list,before,source(list,capture(list))))return null;
      const expected=source(list,{entries,visible:true,busy:false});records.delete(list);stale.delete(list);apply(list,entries);
      if(!P.sameSource(list,expected,source(list,capture(list))))throw Error('移動後內容已改變；請核對目前編修');
      if(record)records.set(list,structuredClone(record));return true;
    }
    return Object.freeze({refresh,move(list,id,delta){
      if(disposed)return null;
      try{known(list);if(!allowed(list))return null;const before=source(list,capture(list)),plan=move(list,before,id,delta);if(!plan||!commit(list,before,plan.entries,plan.record))return null;return {id,index:plan.record.to,from:plan.record.from,to:plan.record.to};}catch(error){onError(error);return null;}
    },moveTo(list,id,index){
      if(disposed)return null;
      try{known(list);if(!allowed(list))return null;const before=source(list,capture(list)),plan=moveTo(list,before,id,index);if(!plan||!commit(list,before,plan.entries,plan.record))return null;return {id,index:plan.record.to,from:plan.record.from,to:plan.record.to};}catch(error){onError(error);return null;}
    },undo(list){
      if(disposed)return null;
      try{known(list);if(!allowed(list))return null;const before=source(list,capture(list));refresh(list,{ids:before.entries.map(e=>e.id),visible:before.visible,busy:before.busy});const saved=records.get(list);if(!saved)throw Error('沒有可撤回的列移動；目前編修保留');const record=structuredClone(saved),entries=restore(list,before,record);if(!entries||!commit(list,before,entries,null))return null;return {id:record.id,index:record.from,from:record.to,to:record.from};}catch(error){onError(error);return null;}
    },clear(list){known(list);records.delete(list);stale.delete(list);},dispose(){disposed=true;records.clear();stale.clear();}});
  }
  const api=Object.freeze({lists,move,moveTo,restore,metadata,createController});if(typeof module==='object'&&module.exports)module.exports=api;else root.MusicEditorOrder=api;
})(typeof globalThis==='object'?globalThis:this);
