// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
  const node=typeof module!=='undefined'&&module.exports;
  const Editor=node?require('./editor-state.js'):root.MusicEditor;
  const Replacement=node?require('./replacement-preview.js'):root.MusicReplacement;
  const Undo=node?require('./draft-undo.js'):root.MusicDraftUndo;
  const blank=s=>/^[\t\n\v\f\r \u0085\u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000]*$/u.test(s);
  // Match Python str.strip for titles/notes; lyric source uses the explicit blank-line contract above.
  const trimText=s=>s.replace(/^[\t\n\v\f\r \u001c-\u001f\u0085\u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000]+|[\t\n\v\f\r \u001c-\u001f\u0085\u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000]+$/gu,'');
  const exact=(value,keys)=>value&&typeof value==='object'&&!Array.isArray(value)&&Object.keys(value).length===keys.length&&keys.every(k=>Object.hasOwn(value,k));
  const fail=()=>{throw Error('未校時歌詞起稿不完整、來源不一致或版本不支援；目前內容保留');};
  function validateSeed(seed){
    if(!exact(seed,['format','schema_version','status','title','source_text','lines','review_notes'])||seed.format!=='zoe-lyrics-seed'||seed.schema_version!==1||seed.status!=='untimed'||
        typeof seed.title!=='string'||!trimText(seed.title)||Array.from(seed.title).length>200||
        typeof seed.source_text!=='string'||blank(seed.source_text)||new TextEncoder().encode(seed.source_text).length>65536||
        !Array.isArray(seed.lines)||!seed.lines.length||seed.lines.length>1000||!Array.isArray(seed.review_notes)||!seed.review_notes.length||seed.review_notes.length>20||
        seed.review_notes.some(n=>typeof n!=='string'||!trimText(n)||Array.from(n).length>2000))fail();
    const expected=seed.source_text.split(/\r\n|\n|\r/).flatMap((value,i)=>blank(value)?[]:[{line:i+1,text:value}]);
    if(seed.lines.some(line=>!exact(line,['line','text'])||!Number.isSafeInteger(line.line)||typeof line.text!=='string')||Undo.fingerprint(expected)!==Undo.fingerprint(seed.lines))fail();
    return structuredClone(seed);
  }
  function seedDraft(current,data){
    const draft=Editor.validateDraft(current),seed=validateSeed(data),panel=draft.panels.lyrics;
    panel.fields['lyrics-title']=seed.title;panel.fields['lyrics-source']=JSON.stringify(seed,null,2)+'\n';panel.fields['lyrics-format']='.json';
    panel.cues=seed.lines.map(line=>({start:'',end:'',text:line.text}));draft.tab='lyrics';return Editor.validateDraft(draft);
  }
  function createPreview({capture,request,onReady,onClear}){
    const guard=Replacement.createPreview({capture:()=>({draft:capture()})});let pending=null;
    const sourceKey=draft=>Undo.fingerprint(draft.panels.music);
    async function inspect(seed,isCurrent){
      const selected=Editor.validateDraft(capture()),origin=seed?'file':'music',before=sourceKey(selected),token=guard.begin('lyrics');pending=null;onClear();
      const current=()=>isCurrent()&&(origin==='file'||sourceKey(capture())===before)&&guard.check(token);
      try{
        const payload=seed?{seed:validateSeed(seed)}:{title:selected.panels.music.fields['music-title'],text:selected.panels.music.fields['music-lyrics']};
        const result=await request(structuredClone(payload),isCurrent);if(!current())return false;
        const data=validateSeed(result?.data);
        if(origin==='file'?Undo.fingerprint(data)!==Undo.fingerprint(payload.seed):data.title!==trimText(payload.title)||data.source_text!==payload.text)fail();
        if(result.meta?.protocol_version!==1||result.meta.needs_review!==true||typeof result.meta.version!=='string'||!result.meta.version||
            typeof result.files?.['lyrics-seed.json']!=='string'||typeof result.files?.['lyrics-seed.md']!=='string'||
            Undo.fingerprint(JSON.parse(result.files['lyrics-seed.json']))!==Undo.fingerprint(data))fail();
        if(!guard.accept(token,data))return false;pending={origin,before};onReady(data,structuredClone(result.files),origin);return true;
      }catch(error){
        let visible=false;try{visible=isCurrent()&&(origin==='file'||sourceKey(capture())===before)&&guard.check(token);}catch(changed){error=changed;visible=isCurrent();}
        if(visible)throw error;return false;
      }
    }
    return {inspect:isCurrent=>inspect(null,isCurrent||(()=>true)),inspectSeed:(seed,isCurrent)=>inspect(seed,isCurrent||(()=>true)),
      proposal(){if(!pending)return null;if(pending.origin==='music'&&sourceKey(capture())!==pending.before)throw Error('起稿後歌曲已有修改；目前內容保留，請重新預覽。');
        const data=guard.proposal();return data?seedDraft(capture(),data):null;},
      cancel(){guard.cancel();pending=null;onClear();}};
  }
  const api={validateSeed,seedDraft,createPreview,titleText:trimText};
  if(node)module.exports=api;else root.MusicLyricsSeed=api;
})(typeof window==='undefined'?{}:window);
