// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
  const S=typeof module==='object'&&module.exports?require('./editor-selection.js'):root.MusicEditorSelection;
  const O=typeof module==='object'&&module.exports?require('./entry-order.js'):root.MusicEntryOrder;
  const gestureKeys=Object.freeze(['key','altKey','ctrlKey','metaKey','shiftKey','repeat','isComposing','keyCode']);
  function enterIntent(value){
    if(!value||typeof value!=='object'||Array.isArray(value)||Object.keys(value).length!==gestureKeys.length||!gestureKeys.every(k=>Object.hasOwn(value,k))||typeof value.key!=='string'||gestureKeys.slice(1,-1).some(k=>typeof value[k]!=='boolean')||!Number.isSafeInteger(value.keyCode)||value.keyCode<0||value.keyCode>255)throw Error('指定位置按鍵狀態無效');
    if(value.key!=='Enter'||value.altKey||value.ctrlKey||value.metaKey||value.shiftKey||value.isComposing||value.keyCode===229)return 'none';
    return value.repeat?'hold':'move';
  }
  function source(list,value){
    if(!value||typeof value!=='object'||Array.isArray(value)||Object.keys(value).length!==5||!['ids','selected','position','visible','busy'].every(k=>Object.hasOwn(value,k))||typeof value.selected!=='string'||typeof value.position!=='string'||value.position.length>32)throw Error('指定位置來源無效；原編修保留');
    const s=S.source(list,{ids:value.ids,visible:value.visible,busy:value.busy});
    if(value.selected!==''&&!s.ids.includes(value.selected))throw Error('選定列已不存在；原編修保留');
    return {...s,selected:value.selected,position:value.position};
  }
  function view(list,value){
    const s=source(list,value),count=s.ids.length,from=s.ids.indexOf(s.selected),text=s.position.trim();
    const base={count,from,canMove:false,invalid:false,status:'blank',message:count?`輸入位置 1–${count}，按 Enter 或「移至指定位置」；只移動選定列，其他列保持相對順序。`:'目前沒有可移動的列。'};
    if(!s.visible||s.busy)return {...base,status:'blocked',message:s.busy?'目前操作尚未完成，請稍候。':base.message};
    if(!text||!count||from<0)return base;
    const position=/^[0-9]+$/.test(text)?Number(text):NaN;
    if(!Number.isSafeInteger(position)||position<1||position>count)return {...base,invalid:true,status:'invalid',message:`請輸入 1–${count} 的整數位置；原編修保留。`};
    if(position-1===from)return {...base,status:'current',message:`選定列已在第 ${position} 列。`};
    return {...base,index:position-1,canMove:true,status:'ready',message:`將選定列從第 ${from+1} 列移至第 ${position} 列；按 Enter 或「移至指定位置」，原時間與文字保留。`};
  }
  function proposal(list,value){const s=source(list,value),v=view(list,s);if(!v.canMove)return null;const p=O.moveTo(s.ids,s.selected,v.index);return {list,id:s.selected,index:v.index,from:v.from,before:s,afterIds:p.ids};}
  const same=(a,b)=>O.same(a.ids,b.ids)&&['selected','position','visible','busy'].every(k=>a[k]===b[k]);
  function createController({allowed,capture,moveTarget,onMoved=()=>{},onError=()=>{}}){
    let disposed=false;
    function current(list,before){return allowed(list)&&same(before,source(list,capture(list)));}
    function finish(list,before,plan){
      // Writer-owned metadata must not replace the expected actual-after source.
      if(moveTarget({...plan,before:{...plan.before,ids:[...plan.before.ids]},afterIds:[...plan.afterIds]})!==true)return false;
      const after=source(list,capture(list));
      if(!allowed(list)||!after.visible||after.busy||after.selected!==plan.id||after.position!==before.position||!O.same(plan.afterIds,after.ids))return false;
      onMoved({list,id:plan.id,index:plan.index,from:plan.from});return true;
    }
    return Object.freeze({request(list){
      if(disposed)return false;
      try{
        if(!S.lists.includes(list))throw Error('指定位置來源無效；原編修保留');
        if(!allowed(list))return false;
        const before=source(list,capture(list)),plan=proposal(list,before);if(!plan)return false;
        if(!current(list,before))return false;
        return finish(list,before,plan);
      }catch(error){onError(error);return false;}
    },enter(list,gesture,consume){
      if(disposed)return false;
      try{
        const intent=enterIntent(gesture);if(intent==='none')return false;
        if(!S.lists.includes(list))throw Error('指定位置來源無效；原編修保留');
        if(!allowed(list))return false;
        const before=source(list,capture(list)),plan=proposal(list,before);
        if(!before.visible||before.busy)return false;
        if(!current(list,before)||consume()!==true||!current(list,before))return false;
        // A plain owned Enter must not submit the surrounding music form.
        if(intent==='hold'||!plan)return true;
        return finish(list,before,plan);
      }catch(error){onError(error);return false;}
    },dispose(){disposed=true;}});
  }
  const api=Object.freeze({lists:S.lists,enterIntent,source,view,proposal,createController});if(typeof module==='object'&&module.exports)module.exports=api;else root.MusicEditorPosition=api;
})(typeof globalThis==='object'?globalThis:this);
