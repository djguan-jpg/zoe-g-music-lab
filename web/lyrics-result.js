// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
  const node=typeof module==='object'&&module.exports;
  const T=node?require('../musiclab/assets/lyric-time.js'):root.LyricTime;
  const P=node?require('../musiclab/assets/lyrics-package.js'):root.MusicLyricsPackage;
  const exact=(value,keys)=>value&&typeof value==='object'&&!Array.isArray(value)&&Object.keys(value).length===keys.length&&keys.every(key=>Object.hasOwn(value,key));
  function same(a,b){
    if(a===b)return true;
    if(Array.isArray(a))return Array.isArray(b)&&a.length===b.length&&a.every((value,i)=>same(value,b[i]));
    if(!a||!b||typeof a!=='object'||typeof b!=='object'||Array.isArray(b))return false;
    const keys=Object.keys(a);return exact(b,keys)&&keys.every(key=>same(a[key],b[key]));
  }
  const fail=()=>{throw Error('歌詞回應與本次來源不一致或不完整；目前成果與編修保留');};
  function expectedBuild(payload){
    if(exact(payload,['package']))return P.validate(payload.package);
    if(!exact(payload,['title','cues','duration']))fail();
    return P.validate({format:P.format,schema_version:P.schemaVersion,title:payload.title,
      ...T.normalizeCues(payload.cues,payload.duration),review_notes:[]});
  }
  function textFiles(cues){
    return {'lyrics.lrc':cues.map(c=>`[${T.timecode(c.start)}]${c.text}`).join('\n')+'\n',
      'lyrics.srt':cues.map((c,i)=>`${i+1}\n${T.timecode(c.start,true)} --> ${T.timecode(c.end,true)}\n${c.text}`).join('\n\n')+'\n'};
  }
  function checkedResult(expected,reply){
    expected=P.validate(expected);
    const names=['lyrics.json','lyrics.lrc','lyrics.srt','preview.html'];
    if(!exact(reply,['data','files','meta'])||!exact(reply.meta,['version','protocol_version','needs_review'])||
        typeof reply.meta.version!=='string'||!reply.meta.version||reply.meta.protocol_version!==1||
        reply.meta.needs_review!==P.needsReview(expected)||!exact(reply.files,names)||names.some(name=>typeof reply.files[name]!=='string'))fail();
    if(!same(P.validate(reply.data),expected)||!same(P.parseDocument(reply.files['lyrics.json']),expected))fail();
    const text=textFiles(expected.cues);
    if(reply.files['lyrics.lrc']!==text['lyrics.lrc']||reply.files['lyrics.srt']!==text['lyrics.srt'])fail();
    // HTML is an opaque artifact here; no execution or full semantic validation.
    return structuredClone(reply);
  }
  const api={expectedBuild,textFiles,checkedResult};
  if(node)module.exports=api;else root.MusicLyricsResult=api;
})(typeof window==='undefined'?{}:window);
