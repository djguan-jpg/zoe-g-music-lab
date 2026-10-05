// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
  const limits=Object.freeze({arrangement:40,'music-avoid':100,'music-deliverables':100,motifs:30,shots:1000,cues:10000});
  function checkedSource(list,source){
    if(!Object.hasOwn(limits,list)||!source||typeof source!=='object'||Array.isArray(source)||
      Object.keys(source).length!==3||!['ids','visible','busy'].every(k=>Object.hasOwn(source,k))||
      typeof source.visible!=='boolean'||typeof source.busy!=='boolean'||!Array.isArray(source.ids)||
      source.ids.length>limits[list])throw Error('編修定位來源無效');
    const ids=source.ids.map(id=>{if(typeof id!=='string'||!id||id.length>64)throw Error('編修列識別無效');return id;});
    if(new Set(ids).size!==ids.length)throw Error('編修列識別重複');
    return {ids,visible:source.visible,busy:source.busy};
  }
  function proposal(list,source,index,mode='entry'){
    const s=checkedSource(list,source);
    if(!Number.isSafeInteger(index)||index<0||!['entry','new'].includes(mode))throw Error('編修定位請求無效');
    if(!s.visible||s.busy)return null;
    if(!s.ids.length){if(index!==0)throw Error('編修目標列已不存在');return {list,id:null,mode:'add'};}
    if(index>=s.ids.length)throw Error('編修目標列已不存在');
    return {list,id:s.ids[index],mode};
  }
  function createController({capture,focusTarget,onError=()=>{}}){
    let disposed=false;
    return Object.freeze({focus(list,index,mode='entry'){
      if(disposed)return false;
      try{
        if(!Object.hasOwn(limits,list))throw Error('編修定位來源無效');
        const before=checkedSource(list,capture(list)),target=proposal(list,before,index,mode);
        if(!target)return false;
        const after=checkedSource(list,capture(list));
        if(!after.visible||after.busy||before.ids.length!==after.ids.length||before.ids.some((id,i)=>id!==after.ids[i]))return false;
        return focusTarget(target)===true;
      }catch(error){onError(error);return false;}
    },dispose(){disposed=true;}});
  }
  const api=Object.freeze({limits,checkedSource,proposal,createController});
  if(typeof module==='object'&&module.exports)module.exports=api;else root.MusicEditorFocus=api;
})(typeof globalThis==='object'?globalThis:this);
