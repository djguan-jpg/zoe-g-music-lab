// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
  const Editor=typeof module!=='undefined'&&module.exports?require('./editor-state.js'):root.MusicEditor;
  function fingerprint(value){
    if(Array.isArray(value))return '['+value.map(fingerprint).join(',')+']';
    if(value&&typeof value==='object')return '{'+Object.keys(value).sort().map(k=>JSON.stringify(k)+':'+fingerprint(value[k])).join(',')+'}';
    return JSON.stringify(value);
  }
  function createValueUndo(validate,message='套用後已有編修；目前內容保留，無法撤回。'){
    if(typeof validate!=='function')throw Error('撤回需要明確的內容驗證');
    let record=null;
    const checked=value=>structuredClone(validate(value));
    return {
      record(before,after){const previous=checked(before),received=checked(after);record={before:previous,after:received};},
      proposal(current){
        if(!record)return null;
        if(fingerprint(checked(current))!==fingerprint(record.after))throw Error(message);
        return checked(record.before);
      },
      available:()=>record!==null,
      clear(){record=null;}
    };
  }
  function createUndo(){
    let record=null;
    return {
      record(before,after,scope=null){
        if(scope!==null&&!['music','storyboard','lyrics'].includes(scope))throw Error('撤回工作台不支援');
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
  const api={fingerprint,createUndo,createValueUndo};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.MusicDraftUndo=api;
})(typeof window==='undefined'?{}:window);
