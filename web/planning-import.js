// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
  const Editor=typeof module!=='undefined'&&module.exports?require('./editor-state.js'):root.MusicEditor;
  const musicSources={
    'music-title':'title','music-hook':'memory_hook','music-theme':'theme','music-style':'style',
    'music-vocal':'vocal','music-audience':'audience','music-bpm':'bpm','music-beats':'beats_per_bar',
    'music-lyrics':'existing_lyrics','music-language':'language'
  };
  const mvSources={'mv-title':'title','mv-duration':'duration_seconds','mv-fps':'fps',
    'mv-ratio':'aspect_ratio','mv-style':'visual_style','mv-anchor':'character_anchor'};
  function object(value,label){if(!value||typeof value!=='object'||Array.isArray(value))throw Error(`${label}需為物件`);}
  function known(value,keys,label){object(value,label);if(Object.keys(value).some(key=>!keys.includes(key)))
    throw Error(`${label}含工作台未支援的欄位；目前內容未替換`);}
  function string(value,label){if(typeof value!=='string')throw Error(`${label}需為文字`);return value;}
  function numeric(value,label){if(typeof value==='string'||typeof value==='number'&&Number.isFinite(value))return String(value);
    throw Error(`${label}需為數字或數字文字`);}
  function list(value,label,limit){if(!Array.isArray(value)||value.length>limit)throw Error(`${label}需為不超過 ${limit} 項的清單`);return value;}
  function strings(value,label){return list(value,label,100).map(item=>string(item,label));}
  function planningDraft(current,operation,brief){
    const draft=Editor.validateDraft(current);
    if(!['music','storyboard'].includes(operation))throw Error('只支援歌曲或分鏡需求');
    if(operation==='music'){
      known(brief,[...Object.values(musicSources),'arrangement','structure','duration_seconds','avoid','deliverables','example_type'],'歌曲需求');
      const panel=draft.panels.music;
      Object.entries(musicSources).forEach(([field,key])=>{
        const value=brief[key]??(key==='beats_per_bar'?4:key==='existing_lyrics'?'':undefined);
        panel.fields[field]=['bpm','beats_per_bar'].includes(key)?numeric(value,key):string(value,key);
      });
      panel.sections=list(brief.arrangement,'歌曲段落',40).map(row=>{
        known(row,Editor.draftRows.music.columns,'歌曲段落');
        return Object.fromEntries(Editor.draftRows.music.columns.map(key=>[key,
          ['bars','energy'].includes(key)?numeric(row[key],key):string(row[key],key)]));
      });
      panel.avoid=strings(brief.avoid??[],'避免事項');panel.deliverables=strings(brief.deliverables,'交付項目');
    }else{
      known(brief,[...Object.values(mvSources),'motifs','shots','example_type'],'分鏡需求');
      const panel=draft.panels.storyboard;
      Object.entries(mvSources).forEach(([field,key])=>panel.fields[field]=
        ['duration_seconds','fps'].includes(key)?numeric(brief[key],key):string(brief[key],key));
      if(!['16:9','9:16','1:1','4:3'].includes(brief.aspect_ratio))throw Error('目前工作台不支援此畫幅，請保留原需求以 CLI 使用');
      const ids=new Map();
      panel.motifs=list(brief.motifs,'母題',30).map((motif,index)=>{
        known(motif,['name','meaning'],'母題');
        const name=string(motif.name,'母題名稱'),id=`motif-${index+1}`;
        if(!name.trim()||ids.has(name.trim()))throw Error('母題名稱不可空白或重複');
        ids.set(name.trim(),id);return {id,name,meaning:string(motif.meaning,'母題意義')};
      });
      panel.shots=list(brief.shots,'鏡頭',1000).map(row=>{
        known(row,[...Editor.draftRows.storyboard.columns.filter(key=>key!=='motif_id'),'motif'],'鏡頭');
        const motif=string(row.motif,'鏡頭母題'),motif_id=ids.get(motif.trim());
        if(!motif_id)throw Error('鏡頭引用未登記母題');
        return Object.fromEntries(Editor.draftRows.storyboard.columns.map(key=>[key,key==='motif_id'?motif_id:
          ['start','end'].includes(key)?numeric(row[key],key):string(row[key]??(key==='change_reason'?'':undefined),key)]));
      });
    }
    draft.tab=operation;
    return Editor.validateDraft(draft);
  }
  function createBriefImport({validate,onReady,onError}){
    const task=Editor.createLatestTask();
    return {cancel:()=>task.begin(),async read(file,operation){
      const token=task.begin();if(!file)return false;
      try{
        if(!['music','storyboard'].includes(operation))throw Error('請選擇歌曲或分鏡需求');
        if(!Number.isSafeInteger(file.size)||file.size<1||file.size>1024*1024)throw Error('需求檔需介於 1 byte 與 1 MiB');
        if(!file.name.toLowerCase().endsWith('.json'))throw Error('請選擇需求 JSON');
        const content=await file.text();if(!task.isCurrent(token))return false;
        const brief=JSON.parse(content.replace(/^\uFEFF/,''));object(brief,'需求');
        const checked=await validate(operation,brief);if(!task.isCurrent(token))return false;
        onReady({operation,result:checked});return true;
      }catch(error){if(task.isCurrent(token))onError(error);return false;}
    }};
  }
  function planningBrief(current,operation){
    const draft=Editor.validateDraft(current),panel=draft.panels[operation];
    if(!['music','storyboard'].includes(operation))throw Error('只支援歌曲或分鏡需求');
    const sources=operation==='music'?musicSources:mvSources;
    const brief=Object.fromEntries(Object.entries(sources).map(([field,key])=>[key,panel.fields[field]]));
    if(operation==='music'){
      if(!panel.deliverables.length)throw Error('至少需要一個交付項目');
      for(const [key,label] of [['avoid','避免事項'],['deliverables','交付項目']]){
        const blank=panel[key].findIndex(item=>!item.trim());if(blank>=0)throw Error(`${label} ${blank+1} 不可空白`);
      }
      return {...brief,arrangement:structuredClone(panel.sections),avoid:[...panel.avoid],deliverables:[...panel.deliverables]};
    }
    const names=new Map(panel.motifs.map(m=>[m.id,m.name]));
    return {...brief,motifs:panel.motifs.map(({name,meaning})=>({name,meaning})),shots:panel.shots.map(row=>{
      const {motif_id,...shot}=row;if(!names.has(motif_id))throw Error('鏡頭請先選擇母題');
      return {...shot,motif:names.get(motif_id)};
    })};
  }
  const api={planningDraft,planningBrief,createBriefImport};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.MusicPlanning=api;
})(typeof window==='undefined'?{}:window);
