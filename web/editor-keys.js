// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
  const S=typeof module==='object'&&module.exports?require('./editor-selection.js'):root.MusicEditorSelection;
  const O=typeof module==='object'&&module.exports?require('./entry-order.js'):root.MusicEntryOrder;
  const keys=Object.freeze(['key','altKey','ctrlKey','metaKey','shiftKey','repeat','isComposing','keyCode']);
  function delta(value){
    if(!value||typeof value!=='object'||Array.isArray(value)||Object.keys(value).length!==keys.length||!keys.every(k=>Object.hasOwn(value,k))||typeof value.key!=='string'||keys.slice(1,-1).some(k=>typeof value[k]!=='boolean')||!Number.isSafeInteger(value.keyCode)||value.keyCode<0||value.keyCode>255)throw Error('列移動按鍵狀態無效');
    if(!value.altKey||value.ctrlKey||value.metaKey||value.shiftKey||value.repeat||value.isComposing||value.keyCode===229)return 0;
    return value.key==='ArrowUp'?-1:value.key==='ArrowDown'?1:0;
  }
  function proposal(list,value,id,gesture){
    const direction=delta(gesture);if(!direction)return null;
    const source=S.source(list,value),index=source.ids.indexOf(id);
    if(!source.visible||source.busy)return null;if(index<0)throw Error('編修列已不存在；未移動');
    if(index+direction<0||index+direction>=source.ids.length)return null;
    const order=O.move(source.ids,id,direction);return {list,id,delta:direction,index:order.record.to,before:[...source.ids],after:order.ids};
  }
  function createController({allowed,capture,moveTarget,onMoved=()=>{},onError=()=>{}}){
    let disposed=false;
    function current(list,ids){if(!allowed(list))return false;const s=S.source(list,capture(list));return s.visible&&!s.busy&&O.same(ids,s.ids);}
    return Object.freeze({request(list,id,gesture,consume){
      if(disposed)return false;
      try{
        if(!delta(gesture))return false;if(!S.lists.includes(list))throw Error('列移動來源無效');if(!allowed(list))return false;
        const plan=proposal(list,capture(list),id,gesture);if(!plan||!current(list,plan.before))return false;
        if(consume()!==true||!current(list,plan.before))return false;
        if(moveTarget({...plan,before:[...plan.before],after:[...plan.after]})!==true||!current(list,plan.after))return false;
        onMoved({...plan,before:[...plan.before],after:[...plan.after]});return true;
      }catch(error){onError(error);return false;}
    },dispose(){disposed=true;}});
  }
  const api=Object.freeze({delta,proposal,createController});if(typeof module==='object'&&module.exports)module.exports=api;else root.MusicEditorKeys=api;
})(typeof globalThis==='object'?globalThis:this);
