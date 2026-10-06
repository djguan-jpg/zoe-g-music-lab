// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
  const library=typeof module==='object'&&module.exports?require('./draft-library.js'):root.MusicLibrary;
  if(!library)throw Error('草稿內容比較未載入');
  const kinds=['file','library','download'];
  const keys=draft=>Object.fromEntries(Object.entries(draft.panels).map(([name,panel])=>
    [name,library.fingerprint({panels:{[name]:panel}})]));
  const equal=(a,b)=>a&&b&&Object.keys(a).length===Object.keys(b).length&&
    Object.keys(a).every(name=>a[name]===b[name]);
  // Only semantic panel content is tracked. No media, results, paths or persisted schema.
  function createCheckpoint(){
    let initial=null,current=null,pending=null,sequence=0;
    const retained=new Map();
    function status(){
      if(!initial)return {ready:false,dirty:false,mode:'loading',pendingDownload:false,atInitial:false,difference:{reference:null,panels:[]}};
      const found=[...retained.values()].filter(item=>equal(current,item.keys)).sort((a,b)=>b.sequence-a.sequence)[0];
      const atInitial=equal(current,initial),dirty=!atInitial&&!found;
      const latest=[...retained.values()].sort((a,b)=>b.sequence-a.sequence)[0];
      const reference=latest?.keys||initial;
      const difference=dirty?{reference:latest?.kind||'initial',panels:Object.keys(initial).filter(name=>current[name]!==reference[name])}:{reference:null,panels:[]};
      return {ready:true,dirty,atInitial,mode:found?found.kind:atInitial?'initial':
        pending?(equal(current,pending)?'download_unconfirmed':'changed_after_download'):'unretained',
        label:found?.label||'',pendingDownload:pending!==null,difference};
    }
    function remember(value,kind,label=''){
      if(!kinds.includes(kind)||typeof label!=='string')throw Error('不支援的草稿另存確認');
      retained.set(kind,{keys:value,kind,label,sequence:++sequence});
    }
    return {
      initialize(draft){initial=keys(draft);current={...initial};pending=null;retained.clear();return status();},
      refresh(draft){if(initial)current=keys(draft);return status();},
      updatePanel(name,panel){
        if(initial){if(!Object.hasOwn(initial,name))throw Error('未知草稿工作台');
          current[name]=library.fingerprint({panels:{[name]:panel}});}
        return status();
      },
      retain(draft,{kind,label=''}){if(!initial)throw Error('草稿尚未初始化');remember(keys(draft),kind,label);return status();},
      requestDownload(draft){if(!initial)throw Error('草稿尚未初始化');pending=keys(draft);return status();},
      confirmDownload(){if(!pending)return false;remember(pending,'download');pending=null;return status();},
      status
    };
  }
  // Event registration is injected; only a dirty draft has a beforeunload listener.
  function createGuard({capture,capturePanel,events,onState}){
    const checkpoint=createCheckpoint();let listening=false;
    function beforeLeave(event){
      let dirty=true;
      try{dirty=checkpoint.refresh(capture()).dirty;}catch(_){/* Keep the warning if capture fails. */}
      if(dirty){event.preventDefault();event.returnValue='';}
    }
    function publish(){
      const value=checkpoint.status();
      if(value.dirty&&!listening){events.addEventListener('beforeunload',beforeLeave);listening=true;}
      if(!value.dirty&&listening){events.removeEventListener('beforeunload',beforeLeave);listening=false;}
      onState(value);return value;
    }
    function refresh(scope){
      if(checkpoint.status().ready){if(scope)checkpoint.updatePanel(scope,capturePanel(scope));else checkpoint.refresh(capture());}
      return publish();
    }
    return {
      initialize(draft){checkpoint.initialize(draft);return publish();},refresh,
      retain(draft,source){checkpoint.retain(draft,source);return refresh();},
      requestDownload(draft){checkpoint.requestDownload(draft);return refresh();},
      confirmDownload(){const result=checkpoint.confirmDownload();if(result)refresh();return result;},
      status:checkpoint.status,
      dispose(){if(listening)events.removeEventListener('beforeunload',beforeLeave);listening=false;}
    };
  }
  const api={createCheckpoint,createGuard};
  if(typeof module==='object'&&module.exports)module.exports=api;else root.MusicDraftRetention=api;
})(typeof globalThis==='object'?globalThis:this);
