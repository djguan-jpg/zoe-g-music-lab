// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
  const node=typeof module!=='undefined'&&module.exports;
  const Editor=node?require('./editor-state.js'):root.MusicEditor;
  const Planning=node?require('./planning-import.js'):root.MusicPlanning;
  const Undo=node?require('./draft-undo.js'):root.MusicDraftUndo;
  const fail=()=>{throw Error('分鏡起稿回應不完整或版本不支援；目前分鏡保留');};
  const finite=(n,low,high)=>typeof n==='number'&&Number.isFinite(n)&&n>=low&&n<=high;
  const text=s=>typeof s==='string'&&s.trim().length>0;
  function validateSeed(data){
    if(!data||data.format!=='zoe-storyboard-seed'||data.schema_version!==1||data.status!=='timing_seed_incomplete'||
        !text(data.title)||!finite(data.duration_seconds,0.001,3600)||!finite(data.fps,1,120)||
        !Number.isInteger(data.bars_per_shot)||!finite(data.bars_per_shot,1,128)||
        !data.source||data.source.timing_assumption!=='constant_tempo_no_pickup'||!finite(data.source.bpm,20,300)||
        !Number.isInteger(data.source.beats_per_bar)||!finite(data.source.beats_per_bar,1,12)||
        !Array.isArray(data.source.sections)||!data.source.sections.length||data.source.sections.length>40||
        !Array.isArray(data.slots)||!data.slots.length||data.slots.length>1000||
        !Array.isArray(data.review_notes)||!data.review_notes.length||data.review_notes.some(s=>!text(s)))fail();
    let cursor=0,bar=1,index=0;
    for(const section of data.source.sections){
      if(!text(section.section)||!text(section.focus)||!text(section.texture)||!Number.isInteger(section.bars)||
          !finite(section.bars,1,128)||!finite(section.energy,1,5)||section.start!==cursor||
          !finite(section.end,cursor+0.001,data.duration_seconds)||
          Math.abs(section.end-section.start-section.bars*data.source.beats_per_bar*60/data.source.bpm)>0.001001)fail();
      for(let offset=0;offset<section.bars;offset+=data.bars_per_shot){
        const slot=data.slots[index],count=Math.min(data.bars_per_shot,section.bars-offset);
        if(!slot||slot.shot!==index+1||slot.start!==cursor||!finite(slot.end,cursor+0.001,section.end)||
            Math.abs(slot.end-slot.start-count*data.source.beats_per_bar*60/data.source.bpm)>0.001001||
            slot.section!==section.section||slot.purpose!==section.focus||slot.bar_start!==bar||slot.bar_end!==bar+count-1||
            !Number.isInteger(slot.start_frame)||!Number.isInteger(slot.end_frame_exclusive)||slot.start_frame<0||
            slot.end_frame_exclusive<=slot.start_frame||Math.abs(slot.start_frame-slot.start*data.fps)>0.500001||
            Math.abs(slot.end_frame_exclusive-slot.end*data.fps)>0.500001)fail();
        cursor=slot.end;bar+=count;index++;
      }
      if(cursor!==section.end)fail();
    }
    if(cursor!==data.duration_seconds||index!==data.slots.length)fail();
    return structuredClone(data);
  }
  function seedDraft(current,data){
    const draft=Editor.validateDraft(current),seed=validateSeed(data),panel=draft.panels.storyboard;
    panel.fields['mv-title']=seed.title;panel.fields['mv-duration']=String(seed.duration_seconds);panel.fields['mv-fps']=String(seed.fps);
    panel.shots=seed.slots.map(slot=>Object.fromEntries(Editor.draftRows.storyboard.columns.map(key=>[key,
      ['start','end'].includes(key)?String(slot[key]):['section','purpose'].includes(key)?slot[key]:key==='screen_direction'?'neutral':''])));
    draft.tab='storyboard';
    return Editor.validateDraft(draft);
  }
  function sourceMatches(seed,payload){
    const music=payload.music;
    if(seed.title!==music.title.trim()||seed.fps!==Number(payload.fps)||seed.bars_per_shot!==Number(payload.bars_per_shot)||
        seed.source.bpm!==Number(music.bpm)||seed.source.beats_per_bar!==Number(music.beats_per_bar)||
        seed.source.sections.length!==music.arrangement.length)fail();
    seed.source.sections.forEach((s,i)=>{const row=music.arrangement[i];
      if(s.section!==row.name.trim()||s.bars!==Number(row.bars)||s.energy!==Number(row.energy)||
          s.focus!==row.focus.trim()||s.texture!==row.texture.trim())fail();});
  }
  function createPreview({capture,request,onReady,onClear}){
    const task=Editor.createLatestTask();let pending=null;
    const snapshot=()=>{const value=capture(),draft=Editor.validateDraft(value.draft);
      return {draft,fps:value.fps,bars_per_shot:value.bars_per_shot};};
    const key=value=>Undo.fingerprint({music:value.draft.panels.music,storyboard:value.draft.panels.storyboard,
      fps:value.fps,bars_per_shot:value.bars_per_shot});
    return {
      cancel(){task.begin();pending=null;onClear();},
      async inspect(isCurrent=()=>true){
        const token=task.begin(),selected=snapshot(),before=key(selected);pending=null;onClear();
        const current=()=>task.isCurrent(token)&&isCurrent()&&key(snapshot())===before;
        try{
          const payload={music:Planning.planningBrief(selected.draft,'music'),fps:selected.fps,bars_per_shot:selected.bars_per_shot};
          const result=await request(structuredClone(payload));
          if(!current())return false;
          const seed=validateSeed(result?.data);sourceMatches(seed,payload);
          if(result.meta?.protocol_version!==1||result.meta.needs_review!==true||!text(result.meta.version)||
              typeof result.files?.['storyboard-seed.json']!=='string'||typeof result.files?.['storyboard-seed.md']!=='string'||
              Undo.fingerprint(JSON.parse(result.files['storyboard-seed.json']))!==Undo.fingerprint(seed))fail();
          pending={before,seed};onReady(seed,structuredClone(result.files));return true;
        }catch(error){if(current())throw error;return false;}
      },
      proposal(){
        if(!pending)return null;
        const now=snapshot();
        if(key(now)!==pending.before)throw Error('預覽後歌曲、分鏡或起稿設定已有修改；目前內容保留，請重新預覽。');
        return seedDraft(now.draft,pending.seed);
      }
    };
  }
  const api={validateSeed,seedDraft,createPreview};
  if(node)module.exports=api;else root.MusicSeed=api;
})(typeof window==='undefined'?{}:window);
