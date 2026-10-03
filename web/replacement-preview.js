// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
  const node=typeof module!=='undefined'&&module.exports;
  const Editor=node?require('./editor-state.js'):root.MusicEditor;
  const Undo=node?require('./draft-undo.js'):root.MusicDraftUndo;
  // File handles stay in this page. They are compared by identity, never serialized.
  function createPreview({capture}){
    let sequence=0,job=null,pending=null;
    function snapshot(scope){
      const value=capture(),draft=Editor.validateDraft(value.draft);
      return {key:Undo.fingerprint(scope?draft.panels[scope]:draft.panels),
        media:scope?[]:[...(value.media||[])]};
    }
    function check(token){
      if(!job||token!==job.token)return false;
      const now=snapshot(job.scope);
      if(now.key!==job.before.key||now.media.length!==job.before.media.length||
          now.media.some((file,i)=>file!==job.before.media[i]))
        throw Error(job.scope?'讀取或預覽後，目標工作台已有修改；目前內容保留，請重新選檔預覽。':
          '讀取或預覽後，草稿或音檔選擇已有修改；目前內容保留，請重新預覽。');
      return true;
    }
    return {
      begin(scope=null){
        if(scope!==null&&!['music','storyboard'].includes(scope))throw Error('不支援的載入範圍');
        pending=null;job={token:++sequence,scope,before:snapshot(scope)};return job.token;
      },
      check,
      accept(token,payload){if(!check(token))return false;pending=structuredClone(payload);return true;},
      proposal(){if(!pending||!job)return null;check(job.token);return structuredClone(pending);},
      cancel(){sequence++;job=null;pending=null;}
    };
  }
  const api={createPreview};
  if(node)module.exports=api;else root.MusicReplacement=api;
})(typeof window==='undefined'?{}:window);
