// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
  const Editor=typeof module!=='undefined'&&module.exports?require('./editor-state.js'):root.MusicEditor;
  function fingerprint(value){
    if(Array.isArray(value))return '['+value.map(fingerprint).join(',')+']';
    if(value&&typeof value==='object')return '{'+Object.keys(value).sort().map(k=>JSON.stringify(k)+':'+fingerprint(value[k])).join(',')+'}';
    return JSON.stringify(value);
  }
  function createUndo(){
    let record=null;
    return {
      record(before,after,scope=null){
        if(scope!==null&&!['music','storyboard'].includes(scope))throw Error('撤回工作台不支援');
        record={before:Editor.validateDraft(before),after:Editor.validateDraft(after),scope};
      },
      proposal(current){
        if(!record)return null;
        const checked=Editor.validateDraft(current),{before,after,scope}=record;
        const selected=d=>scope?d.panels[scope]:d.panels;
        if(fingerprint(selected(checked))!==fingerprint(selected(after)))
          throw Error('載入後已有編修；已保留目前內容，無法整份撤回。可先下載草稿，再重新載入原檔。');
        const draft=scope?checked:structuredClone(before);
        if(scope){draft.panels[scope]=structuredClone(before.panels[scope]);draft.tab=scope;}
        return {draft,scope};
      },
      clear(){record=null;}
    };
  }
  const api={fingerprint,createUndo};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.MusicDraftUndo=api;
})(typeof window==='undefined'?{}:window);
