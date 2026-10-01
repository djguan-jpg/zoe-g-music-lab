// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
// Pure state rules, shared by the browser adapter and dependency-free Node tests.
(function(root) {
  const draftFields = {
    music: ['music-title','music-hook','music-theme','music-style','music-vocal','music-audience','music-bpm','music-beats','music-lyrics'],
    storyboard: ['mv-title','mv-duration','mv-fps','mv-ratio','mv-style','mv-anchor','mv-motif','mv-meaning'],
    lyrics: ['lyrics-title','lyrics-source','lyrics-format','lyrics-duration'],
    audio: ['audio-profile']
  };
  const draftRows = {
    music: {key:'sections',columns:['name','bars','energy','focus','texture'],limit:40},
    storyboard: {key:'shots',columns:['start','end','section','purpose','visual','camera','transition','motif_state','character_state','change_reason','screen_direction'],limit:1000},
    lyrics: {key:'cues',columns:['start','end','text'],limit:10000}
  };
  function exactKeys(value, keys) {
    return value && typeof value==='object' && !Array.isArray(value) &&
      Object.keys(value).length===keys.length && keys.every(key=>Object.hasOwn(value,key));
  }
  function validateDraft(draft) {
    const panels=Object.keys(draftFields);
    if(!exactKeys(draft,['format','schema_version','tool_version','saved_at','tab','panels']) ||
        draft.format!=='zoe-music-lab-draft' || draft.schema_version!==1 || !panels.includes(draft.tab) ||
        typeof draft.tool_version!=='string' || typeof draft.saved_at!=='string' || !exactKeys(draft.panels,panels))
      throw Error('不是支援的 Music Lab 草稿 v1；目前內容未替換');
    panels.forEach(panel=>{
      const rows=draftRows[panel], source=draft.panels[panel];
      if(!exactKeys(source,rows?['fields',rows.key]:['fields']) || !exactKeys(source.fields,draftFields[panel]) ||
          Object.values(source.fields).some(value=>typeof value!=='string'))throw Error('草稿欄位不完整；目前內容未替換');
      if(rows && (!Array.isArray(source[rows.key]) || source[rows.key].length>rows.limit ||
          source[rows.key].some(row=>!exactKeys(row,rows.columns)||Object.values(row).some(value=>typeof value!=='string'))))
        throw Error('草稿列資料錯誤；目前內容未替換');
    });
    if(!['.lrc','.srt','.json'].includes(draft.panels.lyrics.fields['lyrics-format']) ||
        !['distribution','video'].includes(draft.panels.audio.fields['audio-profile']) ||
        draft.panels.storyboard.shots.some(shot=>!['left','right','neutral'].includes(shot.screen_direction)))
      throw Error('草稿選項不支援；目前內容未替換');
    return structuredClone(draft);
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
  const api = {createLatestTask, activeCueIndex, draftFields, draftRows, validateDraft};
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.MusicEditor = api;
})(typeof window === 'undefined' ? {} : window);
