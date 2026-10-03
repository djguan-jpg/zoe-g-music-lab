// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
// Pure state rules, shared by the browser adapter and dependency-free Node tests.
(function(root) {
  const draftFields = {
    music: ['music-title','music-hook','music-theme','music-style','music-vocal','music-audience','music-bpm','music-beats','music-lyrics'],
    storyboard: ['mv-title','mv-duration','mv-fps','mv-ratio','mv-style','mv-anchor'],
    lyrics: ['lyrics-title','lyrics-source','lyrics-format','lyrics-duration'],
    audio: ['audio-profile']
  };
  const draftRows = {
    music: {key:'sections',columns:['name','bars','energy','focus','texture'],limit:40},
    storyboard: {key:'shots',columns:['start','end','section','purpose','visual','camera','transition','motif_state','character_state','change_reason','screen_direction','motif_id'],limit:1000},
    lyrics: {key:'cues',columns:['start','end','text'],limit:10000}
  };
  function exactKeys(value, keys) {
    return value && typeof value==='object' && !Array.isArray(value) &&
      Object.keys(value).length===keys.length && keys.every(key=>Object.hasOwn(value,key));
  }
  function validateShape(draft, version) {
    const panels=Object.keys(draftFields);
    if(!exactKeys(draft,['format','schema_version','tool_version','saved_at','tab','panels']) ||
        draft.format!=='zoe-music-lab-draft' || draft.schema_version!==version || !panels.includes(draft.tab) ||
        typeof draft.tool_version!=='string' || typeof draft.saved_at!=='string' || !exactKeys(draft.panels,panels))
      throw Error('不是支援的 Music Lab 草稿；目前內容未替換');
    panels.forEach(panel=>{
      const rows=draftRows[panel], source=draft.panels[panel];
      const fields=panel==='storyboard'&&version===1?[...draftFields.storyboard,'mv-motif','mv-meaning']:draftFields[panel];
      const keys=rows?['fields',rows.key]:['fields'];
      if(panel==='storyboard'&&version===2)keys.push('motifs');
      if(!exactKeys(source,keys) || !exactKeys(source.fields,fields) ||
          Object.values(source.fields).some(value=>typeof value!=='string'))throw Error('草稿欄位不完整；目前內容未替換');
      if(rows && (!Array.isArray(source[rows.key]) || source[rows.key].length>rows.limit ||
          source[rows.key].some(row=>!exactKeys(row,version===1?rows.columns.filter(key=>key!=='motif_id'):rows.columns)||Object.values(row).some(value=>typeof value!=='string'))))
        throw Error('草稿列資料錯誤；目前內容未替換');
    });
    if(!['.lrc','.srt','.json'].includes(draft.panels.lyrics.fields['lyrics-format']) ||
        !['distribution','video'].includes(draft.panels.audio.fields['audio-profile']) ||
        draft.panels.storyboard.shots.some(shot=>!['left','right','neutral'].includes(shot.screen_direction)))
      throw Error('草稿選項不支援；目前內容未替換');
    return draft;
  }
  function validateDraft(draft) {
    validateShape(draft,2);
    const {motifs,shots}=draft.panels.storyboard;
    if(!Array.isArray(motifs)||motifs.length>30||motifs.some(m=>!exactKeys(m,['id','name','meaning'])||
        Object.values(m).some(v=>typeof v!=='string')||!/^motif-[1-9][0-9]*$/.test(m.id)))
      throw Error('草稿母題資料錯誤；目前內容未替換');
    const ids=new Set(motifs.map(m=>m.id));
    if(ids.size!==motifs.length||shots.some(s=>s.motif_id!==''&&!ids.has(s.motif_id)))
      throw Error('草稿母題對應錯誤；目前內容未替換');
    return structuredClone(draft);
  }
  // Called only after an explicit user conversion action; no implicit migration.
  function convertLegacyDraft(draft) {
    validateShape(draft,1);
    const converted=structuredClone(draft), panel=converted.panels.storyboard;
    panel.motifs=[{id:'motif-1',name:panel.fields['mv-motif'],meaning:panel.fields['mv-meaning']}];
    delete panel.fields['mv-motif'];delete panel.fields['mv-meaning'];
    panel.shots.forEach(shot=>shot.motif_id='motif-1');
    converted.schema_version=2;
    return validateDraft(converted);
  }
  function inspectDraft(draft) {
    if(draft?.schema_version===1){validateShape(draft,1);return {legacy:true,draft:structuredClone(draft)};}
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
  function activeCueIndex(cues, time) {
    let active = -1;
    cues.forEach((cue, index) => {
      if (Number.isFinite(cue.start) && Number.isFinite(cue.end) && cue.start >= 0 &&
          cue.end > cue.start && time >= cue.start && time < cue.end) active = index;
    });
    return active;
  }
  const api = {createLatestTask, activeCueIndex, draftFields, draftRows, validateDraft,
    inspectDraft,convertLegacyDraft,nextMotifId,compactShotTimes};
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.MusicEditor = api;
})(typeof window === 'undefined' ? {} : window);
