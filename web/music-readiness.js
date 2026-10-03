// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
  const node=typeof module==='object'&&module.exports;
  const Editor=node?require('./editor-state.js'):root.MusicEditor;
  const J=node?require('../musiclab/assets/json-document.js'):root.MusicJsonDocument;
  const Values=node?require('./planning-values.js'):root.MusicPlanningValues;
  const Checkpoint=node?require('./readiness-state.js'):root.MusicReadinessState;
  const fields=Editor.draftFields.music,columns=Editor.draftRows.music.columns;
  const labels={'music-title':'歌名','music-hook':'記憶點','music-theme':'故事核心','music-style':'曲風與聲音','music-vocal':'人聲表現','music-audience':'聽眾','music-bpm':'BPM','music-beats':'每小節拍數','music-language':'創作語言',sections:'段落清單',deliverables:'交付清單',name:'名稱',bars:'小節',energy:'能量',focus:'敘事任務',texture:'聲音配置',text:'內容'};
  const exact=(v,keys)=>v&&typeof v==='object'&&!Array.isArray(v)&&Object.keys(v).length===keys.length&&keys.every(k=>Object.hasOwn(v,k));
  const strings=(v,keys)=>exact(v,keys)&&keys.every(k=>typeof v[k]==='string');
  function source(panel){
    if(!exact(panel,['fields','sections','avoid','deliverables'])||!strings(panel.fields,fields)||!Array.isArray(panel.sections)||panel.sections.length>40||panel.sections.some(s=>!strings(s,columns))||
      ['avoid','deliverables'].some(k=>!Array.isArray(panel[k])||panel[k].length>100||panel[k].some(v=>typeof v!=='string')))throw Error('歌曲待辦來源格式或容量不支援；目前內容保留');
    const ordered={fields:Object.fromEntries(fields.map(k=>[k,panel.fields[k]])),sections:panel.sections.map(s=>Object.fromEntries(columns.map(k=>[k,s[k]]))),avoid:[...panel.avoid],deliverables:[...panel.deliverables]};
    return J.parse(JSON.stringify(ordered),{maxBytes:8*1024*1024,label:'歌曲待辦來源'});
  }
  function inspectSource(panel){
    const issues=[],blocked=new Set();let issueCount=0;
    function add(scope,row,field,code,message){issueCount++;if(scope==='sections')blocked.add(row);if(issues.length<200)issues.push({scope,row,field,code,message});}
    function required(scope,row,field,value){if(!Values.trim(value)){add(scope,row,field,'missing_field','尚未填寫');return false;}return true;}
    function numeric(scope,row,field,value,min,max,integer=false){
      if(!required(scope,row,field,value))return;
      let n;try{n=Values.number(value);}catch{add(scope,row,field,'invalid_number','請填寫有限十進位數字');return;}
      if(n<min||n>max||integer&&!Number.isInteger(n))add(scope,row,field,'invalid_range',`需為 ${min}–${max}${integer?' 整數':''}`);
    }
    for(const field of fields.filter(k=>!['music-bpm','music-beats','music-lyrics'].includes(k)))required('fields',0,field,panel.fields[field]);
    numeric('fields',0,'music-bpm',panel.fields['music-bpm'],20,300);
    numeric('fields',0,'music-beats',panel.fields['music-beats'],1,12,true);
    if(!panel.sections.length)add('fields',0,'sections','no_sections','尚無段落，請新增');
    panel.sections.forEach((s,i)=>{const row=i+1;for(const field of ['name','focus','texture'])required('sections',row,field,s[field]);numeric('sections',row,'bars',s.bars,1,128,true);numeric('sections',row,'energy',s.energy,1,5);});
    if(!panel.deliverables.length)add('fields',0,'deliverables','no_deliverables','至少需要一個交付項目');
    for(const scope of ['avoid','deliverables'])panel[scope].forEach((v,i)=>required(scope,i+1,'text',v));
    return {totalSections:panel.sections.length,filledSections:panel.sections.length-blocked.size,issueCount,issues,truncated:issueCount>issues.length};
  }
  function inspect(panel){return inspectSource(source(panel));}
  function createController({capture,captureIds=null,onState=()=>{}}){
    return Checkpoint.createController({capture:()=>({panel:capture(),ids:captureIds?captureIds():null}),
      source:value=>{const panel=source(value.panel),ids=value.ids;
        if(captureIds&&(!Array.isArray(ids)||ids.length!==panel.sections.length||ids.some(id=>typeof id!=='string'||!id)||new Set(ids).size!==ids.length))throw Error('歌曲段落識別不完整；目前內容保留');
        return {panel,ids:ids?[...ids]:null};},inspect:value=>inspectSource(value.panel),onState});
  }
  const api={inspect,createController,labels};if(node)module.exports=api;else root.MusicReadiness=api;
})(typeof globalThis==='object'?globalThis:this);
