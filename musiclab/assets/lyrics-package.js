// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
  const T=typeof module==='object'&&module.exports?require('./lyric-time.js'):root.LyricTime;
  const format='zoe-lyrics-package',schemaVersion=1,maxBytes=2*1024*1024;
  const base=['title','duration','duration_estimated','cues','timing'],keys=[...base,'format','schema_version','review_notes'];
  const exact=(v,names)=>v&&typeof v==='object'&&!Array.isArray(v)&&Object.keys(v).length===names.length&&names.every(k=>Object.hasOwn(v,k));
  const blank=s=>/^[\t\n\v\f\r \u001c-\u001f\u0085\u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000]*$/u.test(s);
  const sameCues=(a,b)=>a.length===b.length&&a.every((c,i)=>['start','end','text'].every(k=>c[k]===b[i][k]));
  const fail=()=>{throw Error('歌詞包不完整、時間來源矛盾或版本不支援；目前內容保留');};
  const isLegacy=v=>exact(v,base);
  function parseDocument(content){
    if(typeof content!=='string'||new TextEncoder().encode(content).length>maxBytes)throw Error('歌詞JSON最多2 MiB');
    let position=0;
    const space=()=>{while(/[ \t\r\n]/.test(content[position]||'x'))position++;};
    const syntax=()=>{throw Error('歌詞 JSON 格式錯誤');};
    function string(){
      const start=position++;while(position<content.length){const char=content[position++];if(char==='\\'){position++;continue;}if(char==='"')return JSON.parse(content.slice(start,position));}syntax();
    }
    function value(depth){
      if(depth>64)throw Error('歌詞JSON結構過深');space();const char=content[position];
      if(char==='{'||char==='['){
        const object=char==='{',end=object?'}':']',seen=new Set();position++;space();if(content[position]===end){position++;return;}
        while(position<content.length){
          if(object){if(content[position]!=='"')syntax();const key=string();if(seen.has(key))throw Error('歌詞 JSON 含重複欄位');seen.add(key);space();if(content[position++]!==':')syntax();}
          value(depth+1);space();if(content[position]===end){position++;return;}if(content[position++]!==',')syntax();space();
        }syntax();
      }
      if(char==='"'){string();return;}
      const start=position;while(position<content.length&&!/[ \t\r\n,\]}]/.test(content[position]))position++;
      if(position===start)syntax();const scalar=JSON.parse(content.slice(start,position));if(typeof scalar==='number'&&!Number.isFinite(scalar))throw Error('歌詞JSON不接受非有限數字');
    }
    value(0);space();if(position!==content.length)syntax();return JSON.parse(content);
  }
  function validate(document){
    if(!exact(document,keys)||document.format!==format||document.schema_version!==schemaVersion||
        typeof document.title!=='string'||blank(document.title)||Array.from(document.title).length>200||
        typeof document.duration_estimated!=='boolean'||typeof document.duration!=='number'||
        !Array.isArray(document.cues)||!document.cues.length||document.cues.length>10000||
        document.cues.some(c=>!exact(c,['start','end','text'])||typeof c.start!=='number'||typeof c.end!=='number'))fail();
    const normalized=T.normalizeCues(document.cues,document.duration);
    if(!sameCues(normalized.cues,document.cues)||normalized.duration!==document.duration)fail();
    const t=document.timing,names=['duration_source','inferred_end_count','tail_end_inferred'];
    if(!exact(t,[...names,...(Object.hasOwn(t||{},'applied_shift_seconds')?['applied_shift_seconds']:[])])||
        !Number.isSafeInteger(t.inferred_end_count)||t.inferred_end_count<0||t.inferred_end_count>document.cues.length-(t.tail_end_inferred?0:1)||
        typeof t.tail_end_inferred!=='boolean'||t.tail_end_inferred&&!t.inferred_end_count||
        t.duration_source!==(!document.duration_estimated?'provided':t.tail_end_inferred?'last_start_plus_three':'last_cue_end'))fail();
    const last=document.cues.at(-1);
    if(document.duration_estimated&&(document.duration!==last.end||t.tail_end_inferred&&T.milliseconds(document.duration)!==T.milliseconds(last.start)+3000))fail();
    if(Object.hasOwn(t,'applied_shift_seconds')&&(typeof t.applied_shift_seconds!=='number'||T.normalize(t.applied_shift_seconds)!==t.applied_shift_seconds))fail();
    if(!Array.isArray(document.review_notes)||document.review_notes.length>20||document.review_notes.some(n=>typeof n!=='string'||blank(n)||Array.from(n).length>400)||
        new TextEncoder().encode(JSON.stringify(document,null,2)+'\n').length>maxBytes)fail();
    return structuredClone(document);
  }
  function fromLegacy(document){
    if(!isLegacy(document))fail();
    return validate({...structuredClone(document),format,schema_version:schemaVersion,review_notes:[]});
  }
  const needsReview=data=>!!(data.duration_estimated||data.timing.inferred_end_count||data.timing.applied_shift_seconds||data.review_notes.length);
  function notice(data){
    data=validate(data);
    return T.notice(data)+(data.timing.inferred_end_count?` 來源有${data.timing.inferred_end_count}句結束依時間邊界補齊；請逐句校正。`:'')+
      (data.timing.applied_shift_seconds?` 來源記錄整批調整${data.timing.applied_shift_seconds}秒；仍需實聽核對。`:'')+
      (data.review_notes.length?' 待確認：'+data.review_notes.join('；'):'');
  }
  function revise(document,cues,duration=undefined,title=undefined){
    const original=validate(document),chosen=duration===undefined?(original.duration_estimated?null:original.duration):duration;
    const normalized=T.normalizeCues(cues,chosen),same=sameCues(normalized.cues,original.cues);
    const data={...original,title:title===undefined?original.title:title};
    if(same&&duration===undefined)return validate(data);
    if(same&&duration!==null){
      data.duration=normalized.duration;data.duration_estimated=false;data.timing={...original.timing,duration_source:'provided'};
      if(data.duration!==original.duration)addNote(data,'歌曲總長已更改；逐句結束與聲音仍需實聽核對。');
    }else{
      Object.assign(data,normalized);addNote(data,'逐句時間或文字已編修；資料驗證不能替代實聽核對。');
    }
    return validate(data);
  }
  function addNote(data,note){if(!data.review_notes.includes(note))data.review_notes.push(note);}
  function buildRequest({title,cues,duration,content,suffix}){
    if(suffix==='.json'){
      let source;try{source=parseDocument(content);}catch(error){if(/"format"\s*:\s*"zoe-lyrics-package"/.test(content))throw error;source=null;}
      if(source?.format===format){
        const original=validate(source),chosen=duration===null&&original.duration_estimated?undefined:duration;
        return {package:revise(original,cues,chosen,title)};
      }
      if(source&&Object.hasOwn(source,'format')&&source.format!=='zoe-lyrics-seed')fail();
    }
    return {title,cues,duration};
  }
  const api={format,schemaVersion,maxBytes,parseDocument,validate,isLegacy,fromLegacy,needsReview,notice,revise,buildRequest};
  if(typeof module==='object'&&module.exports)module.exports=api;else root.MusicLyricsPackage=api;
})(typeof globalThis==='object'?globalThis:this);
