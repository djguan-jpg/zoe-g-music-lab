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
    const entries=source.entries.map(entry=>{
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
  function createController({allowed,capture,newId,apply,onCopied=()=>{},onError=()=>{}}){
    let disposed=false;
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
        onCopied(list,{index:result.index,id:result.id});return true;
      }catch(error){onError(error);return false;}
    },dispose(){disposed=true;}});
  }
  const api=Object.freeze({specs,checkedSource,sameSource:equal,proposal,createController});
  if(typeof module==='object'&&module.exports)module.exports=api;else root.MusicEditorCopy=api;
})(typeof globalThis==='object'?globalThis:this);
