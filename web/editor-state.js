// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
// Pure state rules, shared by the browser adapter and dependency-free Node tests.
(function(root) {
  const contract=typeof module!=='undefined'&&module.exports?require('../contracts/draft-v3.json'):root.MusicDraftContract;
  if(!contract||contract.version!==3)throw Error('草稿契約未載入或版本不支援');
  const draftFields=contract.fields,draftRows=contract.rows;
  function exactKeys(value, keys) {
    return value && typeof value==='object' && !Array.isArray(value) &&
      Object.keys(value).length===keys.length && keys.every(key=>Object.hasOwn(value,key));
  }
  function validateShape(draft, version) {
    const panels=Object.keys(draftFields);
    if(!exactKeys(draft,['format','schema_version','tool_version','saved_at','tab','panels']) ||
        draft.format!==contract.format || draft.schema_version!==version || !panels.includes(draft.tab) ||
        typeof draft.tool_version!=='string' || typeof draft.saved_at!=='string' || !exactKeys(draft.panels,panels))
      throw Error('不是支援的 Music Lab 草稿；目前內容未替換');
    panels.forEach(panel=>{
      const rows=draftRows[panel], source=draft.panels[panel];
      const fields=panel==='storyboard'&&version===1?[...draftFields.storyboard,'mv-motif','mv-meaning']:
        panel==='music'&&version<3?draftFields.music.filter(key=>key!=='music-language'):draftFields[panel];
      const keys=rows?['fields',rows.key]:['fields'];
      if(panel==='storyboard'&&version>=2)keys.push('motifs');
      if(panel==='music'&&version===3)keys.push('avoid','deliverables');
      if(!exactKeys(source,keys) || !exactKeys(source.fields,fields) ||
          Object.values(source.fields).some(value=>typeof value!=='string'))throw Error('草稿欄位不完整；目前內容未替換');
      if(rows && (!Array.isArray(source[rows.key]) || source[rows.key].length>rows.limit ||
          source[rows.key].some(row=>!exactKeys(row,version===1?rows.columns.filter(key=>key!=='motif_id'):rows.columns)||Object.values(row).some(value=>typeof value!=='string'))))
        throw Error('草稿列資料錯誤；目前內容未替換');
      if(panel==='music'&&version===3&&['avoid','deliverables'].some(key=>!Array.isArray(source[key])||
          source[key].length>contract.limits.requirements||source[key].some(item=>typeof item!=='string')))
        throw Error('草稿需求清單錯誤；目前內容未替換');
    });
    if(!contract.options['lyrics-format'].includes(draft.panels.lyrics.fields['lyrics-format']) ||
        !contract.options['audio-profile'].includes(draft.panels.audio.fields['audio-profile']) ||
        draft.panels.storyboard.shots.some(shot=>!contract.options.screen_direction.includes(shot.screen_direction)))
      throw Error('草稿選項不支援；目前內容未替換');
    return draft;
  }
  function validateMotifs(panel) {
    const {motifs,shots}=panel;
    if(!Array.isArray(motifs)||motifs.length>contract.limits.motifs||motifs.some(m=>!exactKeys(m,['id','name','meaning'])||
        Object.values(m).some(v=>typeof v!=='string')||!/^motif-[1-9][0-9]*$/.test(m.id)))
      throw Error('草稿母題資料錯誤；目前內容未替換');
    const ids=new Set(motifs.map(m=>m.id));
    if(ids.size!==motifs.length||shots.some(s=>s.motif_id!==''&&!ids.has(s.motif_id)))
      throw Error('草稿母題對應錯誤；目前內容未替換');
  }
  function validateDraft(draft) {
    validateShape(draft,3);
    validateMotifs(draft.panels.storyboard);
    return structuredClone(draft);
  }
  // Called only after an explicit user conversion action; no implicit migration.
  function convertLegacyDraft(draft) {
    if(![1,2].includes(draft?.schema_version))throw Error('不是支援的舊版草稿');
    validateShape(draft,draft.schema_version);
    const converted=structuredClone(draft), panel=converted.panels.storyboard;
    if(draft.schema_version===1){
      panel.motifs=[{id:'motif-1',name:panel.fields['mv-motif'],meaning:panel.fields['mv-meaning']}];
      delete panel.fields['mv-motif'];delete panel.fields['mv-meaning'];
      panel.shots.forEach(shot=>shot.motif_id='motif-1');
    }
    converted.panels.music.fields['music-language']='繁體中文';
    converted.panels.music.avoid=['用空泛口號取代動作'];
    converted.panels.music.deliverables=['完整歌詞','兩種副歌方案','分段編曲指令','實唱待驗證清單'];
    converted.schema_version=3;
    return validateDraft(converted);
  }
  function inspectDraft(draft) {
    if([1,2].includes(draft?.schema_version)){
      validateShape(draft,draft.schema_version);
      if(draft.schema_version===2)validateMotifs(draft.panels.storyboard);
      return {legacy:true,draft:structuredClone(draft)};
    }
    return {legacy:false,draft:validateDraft(draft)};
  }
  function nextMotifId(motifs) {
    const ids=new Set(motifs.map(m=>m.id));let index=1;
    while(ids.has(`motif-${index}`))index++;
    return `motif-${index}`;
  }
  function compactShotTimes(shots) {
    if(shots.some(s=>!s.start.trim()||!s.end.trim()||!Number.isFinite(Number(s.start))||
        !Number.isFinite(Number(s.end))||Number(s.end)<=Number(s.start)))return null;
    let cursor=0;
    return shots.map(s=>{const duration=Number(s.end)-Number(s.start),start=cursor;
      cursor=Math.round((cursor+duration)*1000)/1000;
      return {...s,start:String(start),end:String(cursor)};});
  }
  function createLatestTask() {
    let revision = 0;
    return {begin: () => ++revision, isCurrent: token => token === revision};
  }
  function createLyricsFileImport({apply,onError}) {
    const task=createLatestTask();
    return {cancel:()=>task.begin(),async read(file){
      const token=task.begin();if(!file)return false;
      try{
        if(!Number.isSafeInteger(file.size)||file.size<0||file.size>2*1024*1024)throw Error('歌詞檔需小於或等於 2 MiB');
        const suffix='.'+file.name.split('.').at(-1).toLowerCase();
        if(!['.lrc','.srt','.json'].includes(suffix))throw Error('請選擇 LRC／SRT／JSON');
        const content=await file.text();
        if(!task.isCurrent(token))return false;
        apply({content,suffix});return true;
      }catch(error){if(task.isCurrent(token))onError(error);return false;}
    }};
  }
  function shotOverview(shots,motifs) {
    const names=new Map(motifs.map(m=>[m.id,m.name]));
    return shots.map((shot,index)=>{
      const start=Number(shot.start),end=Number(shot.end);
      const valid=Boolean(String(shot.start).trim()&&String(shot.end).trim()&&Number.isFinite(start)&&
        Number.isFinite(end)&&start>=0&&end>start);
      const time=valid?`${start}–${end} 秒`:'時間未完成';
      return {index,valid,time,label:`${time} · ${shot.section||'未填段落'} · ${names.get(shot.motif_id)||'未選母題'}`};
    });
  }
  function activeCueIndex(cues, time) {
    let active = -1;
    cues.forEach((cue, index) => {
      if (Number.isFinite(cue.start) && Number.isFinite(cue.end) && cue.start >= 0 &&
          cue.end > cue.start && time >= cue.start && time < cue.end) active = index;
    });
    return active;
  }
  function lyricsImportNotice(data) {
    if(data.timing?.inferred_end_count)return `歌詞已讀取；${data.timing.inferred_end_count} 句結束依時間邊界補齊，請逐句校正`;
    if(data.duration_estimated)return '歌詞已讀取；保留原檔的結束時間，歌曲總時長尚未由音檔確認';
    return '歌詞已讀取，可逐句校正';
  }
  const api = {createLatestTask, activeCueIndex, draftFields, draftRows, validateDraft,
    inspectDraft,convertLegacyDraft,nextMotifId,compactShotTimes,createLyricsFileImport,shotOverview,lyricsImportNotice};
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.MusicEditor = api;
})(typeof window === 'undefined' ? {} : window);
