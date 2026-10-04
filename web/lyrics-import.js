// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
  const node=typeof module!=='undefined'&&module.exports;
  const E=node?require('./editor-state.js'):root.MusicEditor;
  const R=node?require('./replacement-preview.js'):root.MusicReplacement;
  const S=node?require('./lyrics-seed.js'):root.MusicLyricsSeed;
  const U=node?require('./draft-undo.js'):root.MusicDraftUndo;
  const T=node?require('../musiclab/assets/lyric-time.js'):root.LyricTime;
  const P=node?require('../musiclab/assets/lyrics-package.js'):root.MusicLyricsPackage;
  const L=node?require('../musiclab/assets/lyrics-lrc.js'):root.MusicLyricsLrc;
  const exact=(value,keys)=>value&&typeof value==='object'&&!Array.isArray(value)&&Object.keys(value).length===keys.length&&keys.every(k=>Object.hasOwn(value,k));
  const fail=()=>{throw Error('歌詞檢查回應不完整或與來源不一致；目前內容保留');};
  function sourceRequest(content,suffix,fields){
    if(typeof content!=='string'||!['.lrc','.srt','.json','.txt'].includes(suffix))throw Error('請選擇 UTF-8 TXT／LRC／SRT／JSON');
    if(suffix!=='.lrc')content=content.replace(/^\uFEFF/,'');
    if(new TextEncoder().encode(content).length>(suffix==='.txt'?65536:2*1024*1024))throw Error(suffix==='.txt'?'純歌詞文字最多64 KiB':'歌詞檔需小於或等於2 MiB');
    if(suffix==='.txt')return {operation:'lyrics_seed',payload:{title:fields['lyrics-title'],text:content},content,suffix};
    if(suffix==='.json'){
      const data=P.parseDocument(content);
      if(data?.format==='zoe-lyrics-seed')return {operation:'lyrics_seed',payload:{seed:S.validateSeed(data)},content,suffix};
      if(data?.format===P.format)return {operation:'lyrics',payload:{package:P.validate(data)},content,suffix,packageImport:true};
      if(P.isLegacy(data)){P.fromLegacy(data);return {operation:'lyrics',payload:{package:data,allow_legacy:true},content,suffix,packageImport:true,legacyTimed:true};}
      if(data&&typeof data==='object'&&!Array.isArray(data)&&Object.hasOwn(data,'format'))throw Error('歌詞 JSON 格式不支援；原檔與目前內容保留');
    }
    const raw=fields['lyrics-duration'],duration=raw.trim()?T.normalize(raw,'歌曲時長',true):null;
    return {operation:'lyrics',payload:{title:fields['lyrics-title'],content,suffix,duration},content,suffix};
  }
  function checkedResult(selected,result){
    const seed=selected.operation==='lyrics_seed',names=seed?['lyrics-seed.json','lyrics-seed.md']:['lyrics.json','lyrics.lrc','lyrics.srt','preview.html'];
    if(result?.meta?.protocol_version!==1||typeof result.meta.version!=='string'||!result.meta.version||typeof result.meta.needs_review!=='boolean'||
        !exact(result.files,names)||names.some(name=>typeof result.files[name]!=='string'))fail();
    const data=result.data;
    if(seed){
      S.validateSeed(data);
      if(!result.meta.needs_review||('seed' in selected.payload?U.fingerprint(data)!==U.fingerprint(selected.payload.seed):
          data.source_text!==selected.payload.text||data.title!==S.titleText(selected.payload.title)))fail();
    }else{
      P.validate(data);if(result.meta.needs_review!==P.needsReview(data))fail();
      if(selected.packageImport){
        const expected=selected.legacyTimed?P.fromLegacy(selected.payload.package):P.validate(selected.payload.package);
        if(U.fingerprint(data)!==U.fingerprint(expected))fail();
      }else if(data.title!==selected.payload.title||data.duration_estimated!==(selected.payload.duration===null)||
          selected.payload.duration!==null&&selected.payload.duration!==data.duration)fail();
      if(selected.suffix==='.lrc'){
        const expected=T.normalizeCues(L.parse(selected.content),selected.payload.duration);
        for(const key of ['cues','duration','duration_estimated','timing'])if(U.fingerprint(data[key])!==U.fingerprint(expected[key]))fail();
        if(data.review_notes.length)fail();
        const lrc=expected.cues.map(c=>`[${T.timecode(c.start)}]${c.text}`).join('\n')+'\n';
        const srt=expected.cues.map((c,i)=>`${i+1}\n${T.timecode(c.start,true)} --> ${T.timecode(c.end,true)}\n${c.text}`).join('\n\n')+'\n';
        if(result.files['lyrics.lrc']!==lrc||result.files['lyrics.srt']!==srt)fail();
      }
    }
    if(U.fingerprint(JSON.parse(result.files[seed?'lyrics-seed.json':'lyrics.json']))!==U.fingerprint(data))fail();
    return structuredClone(result);
  }
  function importDraft(current,job){
    if(job.selected.operation==='lyrics_seed')return S.seedDraft(current,job.result.data);
    const draft=E.validateDraft(current),panel=draft.panels.lyrics;
    panel.fields['lyrics-source']=job.selected.content;panel.fields['lyrics-format']=job.selected.suffix;
    panel.fields['lyrics-title']=job.result.data.title;
    if(job.selected.packageImport){
      const data=job.result.data,raw=panel.fields['lyrics-duration'];
      if(!data.duration_estimated){
        if(raw.trim()&&T.normalize(raw,'目前歌曲時長',true)!==data.duration)throw Error('歌詞包宣告總長與目前時長不同；保留音檔與內容，請先確認時長再重新預覽');
        if(!raw.trim())panel.fields['lyrics-duration']=String(data.duration);
      }
      if(job.selected.legacyTimed)panel.fields['lyrics-source']=JSON.stringify(data,null,2)+'\n';
    }
    panel.cues=job.result.data.cues.map(c=>({start:String(c.start),end:String(c.end),text:c.text}));draft.tab='lyrics';return E.validateDraft(draft);
  }
  function review(job){
    const seed=job.selected.operation==='lyrics_seed',data=job.result.data;
    const cues=seed?data.lines.map(line=>({start:'',end:'',text:line.text})):data.cues;
    return {name:job.name,title:data.title,count:cues.length,untimed:seed,
      source:seed?data.source_text:job.selected.content,
      rows:cues.slice(0,6).map(c=>({start:String(c.start),end:String(c.end),text:c.text})),
      notice:seed?'時間留白；請依實際音檔標記，不是辨識結果。':E.lyricsImportNotice(data).replace('歌詞已讀取','歌詞已檢查')+
        (data.duration_estimated&&data.timing.inferred_end_count?'；歌曲總時長尚未由音檔確認'+(data.timing.tail_end_inferred?'，末句結束依最後開始加3秒估計':''):''),
      convertedText:job.selected.suffix==='.txt',multilineSrt:job.selected.suffix==='.srt',
      packageImport:!!job.selected.packageImport,legacyTimed:!!job.selected.legacyTimed,
      durationText:seed?'':`${data.duration}秒（${data.duration_estimated?'來源估計，尚未由音檔確認':'來源已宣告'}）`,
      durationEstimated:seed?null:data.duration_estimated,
      reviewNotes:seed?[]:structuredClone(data.review_notes)};
  }
  function createImport({capture,request,onReady,onClear,onError,onState}){
    const guard=R.createPreview({capture:()=>({draft:capture()})});let sequence=0,reading=false,ready=false;
    const state=()=>onState({reading,ready});
    async function inspect(file,isCurrent=()=>true){
      const id=++sequence,selectedDraft=E.validateDraft(capture()),token=guard.begin('lyrics');ready=false;reading=true;onClear();state();
      const active=()=>id===sequence&&isCurrent();
      try{
        let content,suffix,name;
        if(file){
          suffix='.'+file.name.split('.').at(-1).toLowerCase();name=file.name;
          if(!['.txt','.lrc','.srt','.json'].includes(suffix))throw Error('請選擇 UTF-8 TXT／LRC／SRT／JSON');
          const limit=suffix==='.txt'?65536+3:2*1024*1024;
          if(!Number.isSafeInteger(file.size)||file.size<1||file.size>limit)throw Error(suffix==='.txt'?'純歌詞文字最多64 KiB':'歌詞檔需為1byte–2 MiB');
          const raw=await file.arrayBuffer();if(!active()||!guard.check(token))return false;
          if(!raw||!Number.isSafeInteger(raw.byteLength)||raw.byteLength!==file.size)throw Error('讀取大小與選檔資訊不同；目前內容保留，請重新選檔');
          try{content=new TextDecoder('utf-8',{fatal:true,ignoreBOM:true}).decode(raw);}
          catch{throw Error('歌詞檔不是有效的 UTF-8；請另存 UTF-8，原檔與目前內容保留');}
        }else{
          const fields=selectedDraft.panels.lyrics.fields;content=fields['lyrics-source'];suffix=fields['lyrics-format'];name='目前歌詞原文';
        }
        const selected=sourceRequest(content,suffix,selectedDraft.panels.lyrics.fields);
        const result=await request(selected.operation,structuredClone(selected.payload));
        if(!active()||!guard.check(token))return false;
        const job={name,selected,result:checkedResult(selected,result)};
        importDraft(selectedDraft,job); // Check representability before offering a replacement.
        if(!guard.accept(token,job))return false;
        ready=true;onReady(review(job));return true;
      }catch(error){
        if(active()){
          try{guard.check(token);}catch(changed){error=changed;}
          onError(error);
        }
        return false;
      }finally{if(id===sequence){reading=false;state();}}
    }
    return {read:(file,isCurrent)=>file?inspect(file,isCurrent):Promise.resolve(false),inspectCurrent:isCurrent=>inspect(null,isCurrent),
      proposal(){if(reading||!ready)return null;const job=guard.proposal();return job?{draft:importDraft(capture(),job),files:job.result.files,
        untimed:job.selected.operation==='lyrics_seed',notice:review(job).notice,title:job.result.data.title}:null;},
      cancel(){sequence++;reading=false;ready=false;guard.cancel();onClear();state();}};
  }
  const api={sourceRequest,checkedResult,importDraft,review,createImport};
  if(node)module.exports=api;else root.MusicLyricsImport=api;
})(typeof window==='undefined'?{}:window);
