// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
  function checkedIds(ids){
    if(!Array.isArray(ids)||ids.length>10000||[...ids].some(id=>typeof id!=='string'||!id)||new Set(ids).size!==ids.length)throw Error('列順序識別無效；原編修保留');
    return [...ids];
  }
  const same=(a,b)=>a.length===b.length&&a.every((id,i)=>id===b[i]);
  function move(ids,id,delta){
    const before=checkedIds(ids),from=before.indexOf(id);
    if(![-1,1].includes(delta)||from<0||from+delta<0||from+delta>=before.length)throw Error('無法往這個方向移動');
    return moveTo(before,id,from+delta);
  }
  function moveTo(ids,id,to){
    const before=checkedIds(ids),after=[...before],from=after.indexOf(id);
    if(from<0||!Number.isSafeInteger(to)||to<0||to>=after.length)throw Error('指定列位置無效；原編修保留');
    if(from===to)return null;
    after.splice(to,0,after.splice(from,1)[0]);
    return {ids:after,record:{id,from,to,before,after:[...after]}};
  }
  function restore(ids,record){
    const current=checkedIds(ids);
    const before=checkedIds(record?.before),after=checkedIds(record?.after);
    const members=new Set(current);
    if(!same(current,after)||before.length!==current.length||before.some(id=>!members.has(id))||!Number.isInteger(record.from)||!Number.isInteger(record.to)||
      record.from<0||record.to<0||record.from>=current.length||record.to>=current.length||record.from===record.to||before[record.from]!==record.id||after[record.to]!==record.id)throw Error('列或順序已改動；未撤回移動');
    const expected=[...before];expected.splice(record.to,0,expected.splice(record.from,1)[0]);
    if(!same(expected,after))throw Error('移動紀錄不完整；未撤回');
    return before;
  }
  const api=Object.freeze({checkedIds,same,move,moveTo,restore});if(typeof module==='object'&&module.exports)module.exports=api;else root.MusicEntryOrder=api;
})(typeof globalThis==='object'?globalThis:this);
