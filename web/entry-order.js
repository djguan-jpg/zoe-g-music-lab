// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
  function checkedIds(ids){
    if(!Array.isArray(ids)||ids.length>10000||[...ids].some(id=>typeof id!=='string'||!id)||new Set(ids).size!==ids.length)throw Error('列順序識別無效；原編修保留');
    return [...ids];
  }
  const same=(a,b)=>a.length===b.length&&a.every((id,i)=>id===b[i]);
  function move(ids,id,delta){
    const before=checkedIds(ids),after=[...before],from=after.indexOf(id),to=from+delta;
    if(![-1,1].includes(delta)||from<0||to<0||to>=after.length)throw Error('無法往這個方向移動');
    after.splice(to,0,after.splice(from,1)[0]);
    return {ids:after,record:{id,from,to,before,after:[...after]}};
  }
  function restore(ids,record){
    const current=checkedIds(ids);
    const members=new Set(current);
    if(!record||!Array.isArray(record.before)||!Array.isArray(record.after)||!same(current,record.after)||record.before.length!==current.length||
      new Set(record.before).size!==current.length||record.before.some(id=>!members.has(id))||!Number.isInteger(record.from)||!Number.isInteger(record.to)||
      Math.abs(record.from-record.to)!==1||record.before[record.from]!==record.id||record.after[record.to]!==record.id)throw Error('列或順序已改動；未撤回移動');
    const expected=[...record.before];expected.splice(record.to,0,expected.splice(record.from,1)[0]);
    if(!same(expected,record.after))throw Error('移動紀錄不完整；未撤回');
    return [...record.before];
  }
  const api=Object.freeze({checkedIds,same,move,restore});if(typeof module==='object'&&module.exports)module.exports=api;else root.MusicEntryOrder=api;
})(typeof globalThis==='object'?globalThis:this);
