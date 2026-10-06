// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
  const D=typeof module==='object'&&module.exports?require('../contracts/draft-v3.json'):root.MusicDraftContract;
  if(D?.version!==3)throw Error('不支援的編修草稿版本');
  const specs=Object.freeze(Object.fromEntries([['arrangement','music'],['shots','storyboard'],['cues','lyrics']].map(([list,scope])=>
    [list,Object.freeze({scope,limit:D.rows[scope].limit,fields:Object.freeze([...D.rows[scope].columns,...(list==='shots'?['open']:[])])})])));
  function exact(value,keys){return !!value&&typeof value==='object'&&!Array.isArray(value)&&Object.keys(value).length===keys.length&&keys.every(k=>Object.hasOwn(value,k));}
  function checkedSource(list,source){
    const spec=specs[list];
    if(!Object.hasOwn(specs,list)||!exact(source,['entries','visible','busy'])||typeof source.visible!=='boolean'||typeof source.busy!=='boolean'||!Array.isArray(source.entries)||source.entries.length>spec.limit)throw Error('複製來源無效；原編修保留');
    const entries=[...source.entries].map(entry=>{
      if(!exact(entry,['id','value'])||typeof entry.id!=='string'||!entry.id||entry.id.length>64||!exact(entry.value,spec.fields))throw Error('複製列無效；原編修保留');
      const value=Object.fromEntries(spec.fields.map(key=>{const v=entry.value[key];if(typeof v!==(key==='open'?'boolean':'string'))throw Error('複製欄位無效；原編修保留');return [key,v];}));
      return {id:entry.id,value};
    });
    if(new Set(entries.map(e=>e.id)).size!==entries.length)throw Error('複製列識別重複；原編修保留');
    return {entries,visible:source.visible,busy:source.busy};
  }
  function equal(list,a,b){
    return a.visible===b.visible&&a.busy===b.busy&&a.entries.length===b.entries.length&&a.entries.every((e,i)=>e.id===b.entries[i].id&&specs[list].fields.every(k=>e.value[k]===b.entries[i].value[k]));
  }
  function proposal(list,source,id,newId){
    const s=checkedSource(list,source);
    if(!s.visible||s.busy||s.entries.length>=specs[list].limit)return null;
    const index=s.entries.findIndex(e=>e.id===id);
    if(index<0)throw Error('要複製的列已不存在；原編修保留');
    if(typeof newId!=='string'||!newId||newId.length>64||s.entries.some(e=>e.id===newId))throw Error('新列識別無效；原編修保留');
    const value={...s.entries[index].value};
    if(list!=='arrangement'){value.start='';value.end='';}
    if(list==='shots')value.open=true;
    s.entries.splice(index+1,0,{id:newId,value});
    return {entries:s.entries,index:index+1,id:newId};
  }
  function checkpoint(list,source,sourceId,copiedId){
    const s=checkedSource(list,source),index=s.entries.findIndex(e=>e.id===copiedId);
    if(index<1||s.entries[index-1].id!==sourceId)throw Error('複製紀錄無效；目前編修保留');
    return {list,ids:s.entries.map(e=>e.id),sourceId,copiedId,value:{...s.entries[index].value}};
  }
  function undoProposal(list,source,record){
    const s=checkedSource(list,source);
    if(!s.visible||s.busy)return null;
    if(!exact(record,['list','ids','sourceId','copiedId','value'])||record.list!==list||!Array.isArray(record.ids)||record.ids.length!==s.entries.length||!record.ids.every((id,i)=>id===s.entries[i].id))throw Error('複製後列數或順序已改變；目前編修保留');
    const copied=checkedSource(list,{entries:[{id:record.copiedId,value:record.value}],visible:true,busy:false}).entries[0];
    const index=s.entries.findIndex(e=>e.id===copied.id),sourceIndex=s.entries.findIndex(e=>e.id===record.sourceId);
    if(index<0||sourceIndex<0||index===sourceIndex||!specs[list].fields.filter(k=>k!=='open').every(k=>s.entries[index].value[k]===copied.value[k]))throw Error('複製列已有修改；目前編修保留');
    s.entries.splice(index,1);
    return {entries:s.entries,id:record.sourceId,index:sourceIndex-(sourceIndex>index?1:0)};
  }
  function createController({allowed,allowedUndo=allowed,capture,newId,apply,onCopied=()=>{},onUndone=()=>{},onError=()=>{}}){
    let disposed=false;const records=new Map();
    return Object.freeze({copy(list,id){
      if(disposed)return false;
      try{
        if(!Object.hasOwn(specs,list))throw Error('複製來源無效；原編修保留');
        if(!allowed(list))return false;
        const before=checkedSource(list,capture(list));
        if(!before.visible||before.busy||before.entries.length>=specs[list].limit)return false;
        if(!before.entries.some(e=>e.id===id))throw Error('要複製的列已不存在；原編修保留');
        if(!allowed(list)||!equal(list,before,checkedSource(list,capture(list))))return false;
        const result=proposal(list,before,id,newId(list));
        if(!result||!allowed(list)||!equal(list,before,checkedSource(list,capture(list))))return false;
        const expected=checkedSource(list,{entries:result.entries,visible:true,busy:false});
        apply(list,result.entries);
        const after=checkedSource(list,capture(list));
        if(!equal(list,expected,after))throw Error('複製後內容已改變；請核對目前編修');
        records.set(list,checkpoint(list,after,id,result.id));
        onCopied(list,{index:result.index,id:result.id});return true;
      }catch(error){onError(error);return false;}
    },undo(list){
      if(disposed||!records.has(list))return false;
      try{
        if(!allowedUndo(list))return false;
        const before=checkedSource(list,capture(list)),result=undoProposal(list,before,records.get(list));
        if(!result||!allowedUndo(list)||!equal(list,before,checkedSource(list,capture(list))))return false;
        const expected=checkedSource(list,{entries:result.entries,visible:true,busy:false});
        apply(list,result.entries);
        if(!equal(list,expected,checkedSource(list,capture(list))))throw Error('撤回後內容已改變；請核對目前編修');
        records.delete(list);onUndone(list,{index:result.index,id:result.id});return true;
      }catch(error){onError(error);return false;}
    },view(list){return {canUndo:!disposed&&records.has(list)&&!!allowedUndo(list)};},
    clear(list){if(list===undefined)records.clear();else records.delete(list);},
    dispose(){disposed=true;records.clear();}});
  }
  const api=Object.freeze({specs,checkedSource,sameSource:equal,proposal,checkpoint,undoProposal,createController});
  if(typeof module==='object'&&module.exports)module.exports=api;else root.MusicEditorCopy=api;
})(typeof globalThis==='object'?globalThis:this);
