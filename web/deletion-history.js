// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
  const clone=value=>structuredClone(value);
  function checkEntries(entries){
    if(!Array.isArray(entries)||entries.some(e=>typeof e?.id!=='string'||!e.id)||
        new Set(entries.map(e=>e.id)).size!==entries.length)throw Error('編修列識別錯誤；未替換內容');
  }
  function remove(entries,index){
    checkEntries(entries);
    if(!Number.isInteger(index)||index<0||index>=entries.length)throw Error('找不到要刪除的列');
    const remaining=clone(entries),[entry]=remaining.splice(index,1);
    return {remaining,record:{entry,index,left:entries[index-1]?.id||null,
      right:entries[index+1]?.id||null,patches:[],fields:{}}};
  }
  // Record only automatic side effects, never snapshots of unrelated edits.
  function effects(record,before,after,keys,fieldsBefore={},fieldsAfter={}){
    checkEntries(before);checkEntries(after);
    const prior=new Map(before.map(e=>[e.id,e.value]));
    const result=clone(record);
    result.patches=after.flatMap(e=>keys.filter(key=>prior.has(e.id)&&
      prior.get(e.id)[key]!==e.value[key]).map(key=>({id:e.id,key,
      before:prior.get(e.id)[key],after:e.value[key]})));
    result.fields=Object.fromEntries(Object.keys(fieldsAfter).filter(key=>
      fieldsBefore[key]!==fieldsAfter[key]).map(key=>[key,{before:fieldsBefore[key],after:fieldsAfter[key]}]));
    return result;
  }
  function restore(entries,record,{limit=Infinity,fields={}}={}){
    checkEntries(entries);
    if(entries.some(e=>e.id===record.entry.id))throw Error('這一列已存在；未替換內容');
    if(entries.length>=limit)throw Error(`已達 ${limit} 列上限；刪除紀錄保留。先另存草稿、刪除一列，再選擇這筆紀錄還原`);
    const restored=clone(entries),right=restored.findIndex(e=>e.id===record.right),
      left=restored.findIndex(e=>e.id===record.left);
    const index=right>=0?right:left>=0?left+1:Math.min(record.index,restored.length);
    restored.splice(index,0,clone(record.entry));
    const byId=new Map(restored.map(e=>[e.id,e])),restoredFields={...fields},kept=[];
    for(const patch of record.patches){
      const entry=byId.get(patch.id);if(!entry)continue;
      if(entry.value[patch.key]===patch.after)entry.value[patch.key]=patch.before;
      else kept.push({id:patch.id,key:patch.key});
    }
    for(const [key,patch] of Object.entries(record.fields)){
      if(fields[key]===patch.after)restoredFields[key]=patch.before;
      else kept.push({key});
    }
    return {entries:restored,fields:restoredFields,index,kept};
  }
  function createHistory(limit=20){
    if(!Number.isInteger(limit)||limit<1)throw Error('刪除紀錄容量需為正整數');
    const stacks=new Map();
    return {push(scope,record){const stack=stacks.get(scope)||[];stack.push(clone(record));
        if(stack.length>limit)stack.shift();stacks.set(scope,stack);},
      peek:scope=>clone(stacks.get(scope)?.at(-1)||null),
      entries:scope=>clone(stacks.get(scope)||[]),
      at:(scope,index)=>clone(stacks.get(scope)?.[index]||null),
      drop(scope,index){const stack=stacks.get(scope);if(stack&&Number.isInteger(index)&&index>=0&&index<stack.length)stack.splice(index,1);},
      pop:scope=>stacks.get(scope)?.pop(),
      clear:scope=>stacks.delete(scope),
      size:scope=>stacks.get(scope)?.length||0,
      reserved: (scope,list)=>(stacks.get(scope)||[]).filter(r=>r.list===list).map(r=>r.entry.id),limit};
  }
  const api={remove,effects,restore,createHistory};
  if(typeof module==='object'&&module.exports)module.exports=api;
  else root.MusicHistory=api;
})(typeof globalThis==='object'?globalThis:this);
