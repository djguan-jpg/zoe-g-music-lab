// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
  const json=typeof module==='object'&&module.exports?require('../musiclab/assets/json-document.js'):root.MusicJsonDocument;
  const names=Object.freeze({music:'歌曲設計',storyboard:'母題分鏡',lyrics:'波形校時',audio:'交付檢查'});
  function context(value){
    if(!value||typeof value!=='object'||Array.isArray(value)||Object.keys(value).sort().join(',')!=='action,scope'||typeof value.scope!=='string'||!Object.hasOwn(names,value.scope)||typeof value.action!=='string'||[...value.action].length>128)throw Error('處理動作資料不完整');
    json.assertUnicode(value.action);const action=value.action.trim().replace(/\s+/g,' ');if(!action)throw Error('處理動作不可留白');
    return {scope:value.scope,action};
  }
  function describe(view,selected){
    if(!view||typeof view!=='object'||Array.isArray(view)||Object.keys(view).sort().join(',')!=='busy,canCancel,cancelling'||['busy','canCancel','cancelling'].some(key=>typeof view[key]!=='boolean')||view.cancelling&&!view.busy||view.canCancel!==(view.busy&&!view.cancelling))throw Error('處理狀態資料不一致');
    if(!view.busy)return {visible:false,canCancel:false,title:'',note:''};
    const c=context(selected),title=names[c.scope]+'：'+c.action;
    return {visible:true,canCancel:view.canCancel,title:(view.cancelling?'正在取消等待 · ':'處理中 · ')+title,note:view.cancelling?'正在取消本次等待；目前編修與上一份成果保留。':'取消等待會保留編修與上一份成果；後端仍可能完成本次請求。'};
  }
  const api={context,describe};if(typeof module==='object'&&module.exports)module.exports=api;else root.MusicOperationPresentation=api;
})(typeof globalThis==='object'?globalThis:this);
