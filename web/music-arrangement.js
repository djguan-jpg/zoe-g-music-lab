// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
  const O=typeof module==='object'&&module.exports?require('./entry-order.js'):root.MusicEntryOrder;
  const clone=value=>structuredClone(value),keys=['name','bars','energy','focus','texture'];
  function checked(entries){
    if(!Array.isArray(entries)||entries.length>40||entries.some(e=>!e||typeof e.id!=='string'||!e.id||
      !e.value||Object.keys(e.value).length!==keys.length||keys.some(k=>typeof e.value[k]!=='string'))||
      new Set(entries.map(e=>e.id)).size!==entries.length)throw Error('段落列識別或內容錯誤；未移動');
    return clone(entries);
  }
  const ids=entries=>entries.map(e=>e.id);
  const same=(a,b)=>a.length===b.length&&a.every((id,i)=>id===b[i]);
  function move(entries,id,delta){
    const current=checked(entries),order=O.move(ids(current),id,delta),byId=new Map(current.map(e=>[e.id,e]));
    return {entries:order.ids.map(id=>byId.get(id)),record:order.record};
  }
  function restore(entries,record){
    const current=checked(entries),order=O.restore(ids(current),record),byId=new Map(current.map(e=>[e.id,e]));
    return order.map(id=>byId.get(id));
  }
  function createController({capture,apply,onState=()=>{}}){
    let record=null,stale=false;
    function refresh(){
      let current;try{current=checked(capture());}catch(e){record=null;stale=true;return publish([]);}
      if(record&&!same(ids(current),record.after)){record=null;stale=true;}
      return publish(current);
    }
    function publish(current){const view={count:current.length,ids:ids(current),canUndo:!!record,stale,record:clone(record)};onState(clone(view));return view;}
    return {
      refresh,
      move(id,delta){
        const plan=move(capture(),id,delta);
        // Only the order is kept. Later field edits are read again at undo time.
        record=null;stale=false;apply(plan.entries);record=clone(plan.record);return refresh();
      },
      undo(){
        refresh();if(!record)throw Error('沒有可撤回的段落移動；目前內容保留');
        const saved=clone(record),entries=restore(capture(),saved);
        record=null;stale=false;apply(entries);refresh();return saved;
      },
      clear(){record=null;stale=false;return refresh();}
    };
  }
  const api={move,restore,createController};if(typeof module==='object'&&module.exports)module.exports=api;else root.MusicArrangement=api;
})(typeof globalThis==='object'?globalThis:this);
