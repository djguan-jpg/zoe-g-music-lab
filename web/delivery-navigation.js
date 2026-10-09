// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.MusicDeliveryNavigation=api;})(typeof globalThis!=='undefined'?globalThis:this,()=>{
  const labels={music:'素材交接',storyboard:'素材交接',lyrics:'字幕交付',audio:'音檔核對'};
  function describe(source){
    if(!source||!Object.hasOwn(labels,source.scope)||!Array.isArray(source.names)||source.names.length>32||source.names.some(n=>typeof n!=='string'||!n)||typeof source.busy!=='boolean'||typeof source.dirty!=='boolean'||typeof source.error!=='boolean'||typeof source.message!=='string')throw Error('成果導覽狀態無效');
    const count=source.names.length;
    const summary=count?`${source.dirty?'上一份':'本輪'}有 ${count} 個成果檔案${source.dirty?'；有修改尚未重新驗證，下載已停用':''}。`:'尚無成果檔案；建立後可在這裡前往查看。';
    return {scope:source.scope,label:labels[source.scope],count,canView:count>0&&!source.busy,busy:source.busy,error:source.error,
      button:`查看${source.dirty?'上一份':'本輪'}成果${count?'（'+count+'）':''}`,
      note:(source.message?source.message+' · ':'')+summary};
  }
  function createController({capture,render,goOutput,goEditor}){
    if([capture,render,goOutput,goEditor].some(f=>typeof f!=='function'))throw Error('成果導覽需要完整 adapter');
    let origin=null;
    function refresh(){
      const model=describe(capture());
      if(origin&&origin.scope!==model.scope)origin=null;
      const view={...model,canReturn:!!origin&&!model.busy,returnLabel:'回到'+model.label};
      render(view);return view;
    }
    function show(scope){
      const view=refresh();if(scope!==view.scope||!view.canView)return false;
      if(!goOutput())return false;
      origin={scope};refresh();return true;
    }
    function back(){
      const view=refresh();if(!view.canReturn)return false;
      return !!goEditor(origin.scope);
    }
    return {refresh,show,back};
  }
  return {describe,createController};
});
