// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
  const node=typeof module==='object'&&module.exports;
  const Editor=node?require('./editor-state.js'):root.MusicEditor;
  const J=node?require('../musiclab/assets/json-document.js'):root.MusicJsonDocument;
  const Values=node?require('./planning-values.js'):root.MusicPlanningValues;
  const Checkpoint=node?require('./readiness-state.js'):root.MusicReadinessState;
  const Focus=node?require('./editor-focus.js'):root.MusicEditorFocus;
  const Report=node?require('./readiness-report.js'):root.MusicReadinessReport;
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
  function inspectSource(panel,selectedRow=null){
    const issues=[],blocked=new Set();let issueCount=0;
    function add(scope,row,field,code,message){issueCount++;if(scope==='sections')blocked.add(row);if(issues.length<200)issues.push({scope,row,field,code,message});}
    function required(scope,row,field,value){if(!Values.trim(value)){add(scope,row,field,'missing_field','尚未填寫');return false;}return true;}
    function numeric(scope,row,field,value,min,max,integer=false){
      if(!required(scope,row,field,value))return;
      let n;try{n=Values.number(value);}catch{add(scope,row,field,'invalid_number','請填寫有限十進位數字');return;}
      if(n<min||n>max||integer&&!Number.isInteger(n))add(scope,row,field,'invalid_range',`需為 ${min}–${max}${integer?' 整數':''}`);
    }
    if(selectedRow===null){
    for(const field of fields.filter(k=>!['music-bpm','music-beats','music-lyrics'].includes(k)))required('fields',0,field,panel.fields[field]);
    numeric('fields',0,'music-bpm',panel.fields['music-bpm'],20,300);
    numeric('fields',0,'music-beats',panel.fields['music-beats'],1,12,true);
    if(!panel.sections.length)add('fields',0,'sections','no_sections','尚無段落，請新增');
    }
    panel.sections.forEach((s,i)=>{const row=i+1;if(selectedRow!==null&&row!==selectedRow)return;for(const field of ['name','focus','texture'])required('sections',row,field,s[field]);numeric('sections',row,'bars',s.bars,1,128,true);numeric('sections',row,'energy',s.energy,1,5);});
    if(selectedRow===null){
    if(!panel.deliverables.length)add('fields',0,'deliverables','no_deliverables','至少需要一個交付項目');
    for(const scope of ['avoid','deliverables'])panel[scope].forEach((v,i)=>required(scope,i+1,'text',v));
    }
    return {totalSections:panel.sections.length,filledSections:panel.sections.length-blocked.size,issueCount,issues,truncated:issueCount>issues.length};
  }
  function inspect(panel){return inspectSource(source(panel));}
  function inspectRow(panel,row){
    if(!J.sameValue(panel,panel))throw Error('選定段落來源需為完整 JSON 值；目前內容保留');
    const selected=source(panel);
    if(!Number.isSafeInteger(row)||row<1||row>selected.sections.length)throw Error('請選擇存在的原始段落');
    const data=inspectSource(selected,row);
    return {row,totalSections:selected.sections.length,section:structuredClone(selected.sections[row-1]),issueCount:data.issueCount,issues:data.issues};
  }
  const notes=['只檢查歌曲必填欄位、數值範圍與需求清單；仍須完整建立驗證總時長與資料。','原字串、順序與留白保留；沒有補寫創作或呼叫模型，實唱／實聽及素材授權另行核對。'];
  function report(panel){
    const selected=source(panel),data=inspectSource(selected);
    return {format:'zoe-music-review',schema_version:1,status:data.issueCount?'needs_correction':'fields_checked',source:selected,
      total_sections:data.totalSections,filled_sections:data.filledSections,issue_count:data.issueCount,issues:data.issues,details_truncated:data.truncated,review_notes:[...notes]};
  }
  function markdown(data){
    const lines=['# 歌曲欄位檢查','',`共${data.total_sections}段；段落欄位已填${data.filled_sections}段；待辦${data.issue_count}項。`,''];
    for(const issue of data.issues){const prefix={sections:'段落',avoid:'避免事項',deliverables:'交付項目'}[issue.scope];lines.push(`- ${prefix?`${prefix} ${issue.row} · `:''}${labels[issue.field]}：${issue.message}`);}
    if(data.details_truncated)lines.push('- 明細僅列前200項；全部欄位已檢查，修正後請重查。');
    if(!data.issue_count)lines.push('目前欄位沒有待辦；仍須完整建立與實唱／實聽驗證。');
    return [...lines,'',...data.review_notes,''].join('\n');
  }
  function checkedResult(panel,reply){
    return Report.checkedResult({expected:report(panel),reply,jsonName:'music-review.json',markdownName:'music-review.md',markdown,label:'歌曲待辦報告'});
  }
  function createController({capture,captureIds=null,onState=()=>{}}){
    return Checkpoint.createController({capture:()=>({panel:capture(),ids:captureIds?captureIds():null}),
      source:value=>{const panel=source(value.panel),ids=captureIds?Focus.checkedSource('arrangement',{ids:value.ids,visible:true,busy:false}).ids:null;
        if(ids&&ids.length!==panel.sections.length)throw Error('歌曲段落識別不完整；目前內容保留');
        return {panel,ids};},inspect:value=>inspectSource(value.panel),onState});
  }
  const api={inspect,inspectRow,report,markdown,checkedResult,createController,labels};if(node)module.exports=api;else root.MusicReadiness=api;
})(typeof globalThis==='object'?globalThis:this);
