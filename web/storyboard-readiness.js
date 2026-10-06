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
  const fields=Editor.draftFields.storyboard,columns=Editor.draftRows.storyboard.columns;
  const labels={'mv-title':'片名','mv-duration':'作品總長','mv-fps':'FPS','mv-ratio':'畫幅','mv-style':'視覺基調','mv-anchor':'人物一致性',name:'母題名稱',meaning:'初始意義',start:'開始',end:'結束',section:'歌曲段落',purpose:'敘事用途',visual:'畫面動作',camera:'鏡頭運動',transition:'尾鏡與轉場',motif_id:'使用母題',motif_state:'母題狀態',character_state:'人物狀態',screen_direction:'畫面方向',motifs:'母題清單',shots:'鏡頭清單'};
  const trim=Values.trim;
  const exact=(v,keys)=>v&&typeof v==='object'&&!Array.isArray(v)&&Object.keys(v).length===keys.length&&keys.every(k=>Object.hasOwn(v,k));
  const strings=(v,keys)=>exact(v,keys)&&keys.every(k=>typeof v[k]==='string');
  function source(panel){
    if(!exact(panel,['fields','motifs','shots'])||!strings(panel.fields,fields)||!Array.isArray(panel.motifs)||panel.motifs.length>30||
        panel.motifs.some(m=>!strings(m,['id','name','meaning'])||!/^motif-[1-9][0-9]*$/.test(m.id))||
        new Set(panel.motifs.map(m=>m.id)).size!==panel.motifs.length||!Array.isArray(panel.shots)||panel.shots.length>1000||
        panel.shots.some(s=>!strings(s,columns)))throw Error('分鏡待辦來源格式或容量不支援；目前內容保留');
    const ordered={fields:Object.fromEntries(fields.map(k=>[k,panel.fields[k]])),motifs:panel.motifs.map(m=>({id:m.id,name:m.name,meaning:m.meaning})),shots:panel.shots.map(s=>Object.fromEntries(columns.map(k=>[k,s[k]])))};
    return J.parse(JSON.stringify(ordered),{maxBytes:8*1024*1024,label:'分鏡待辦來源'});
  }
  function inspectSource(panel,selectedRow=null){
    const issues=[],names=new Map(),motifs=new Map(),blocked=new Set();let issueCount=0;
    function add(scope,row,field,code,message,relatedRow=null){
      if(selectedRow!==null&&(scope!=='shots'||row!==selectedRow))return;
      issueCount++;if(scope==='shots')blocked.add(row);
      if(issues.length<200)issues.push({scope,row,field,code,message,relatedRow});
    }
    const missing=(scope,row,field)=>add(scope,row,field,'missing_field','尚未填寫');
    for(const field of fields)if(!trim(panel.fields[field]))missing('fields',0,field);
    if(!panel.motifs.length)add('fields',0,'motifs','no_motifs','尚無母題，請先建立母題');
    panel.motifs.forEach((m,i)=>{
      const name=trim(m.name),meaning=trim(m.meaning),row=i+1;
      if(!name)missing('motifs',row,'name');if(!meaning)missing('motifs',row,'meaning');
      motifs.set(m.id,{row,name,meaning});
      if(name){if(!names.has(name))names.set(name,[]);names.get(name).push(row);}
    });
    for(const rows of names.values())if(rows.length>1)for(const row of rows)add('motifs',row,'name','duplicate_motif_name','母題名稱重複；請明確區分引用',rows.find(r=>r!==row));
    if(!panel.shots.length)add('fields',0,'shots','no_shots','尚無鏡頭，請新增或接續分鏡起稿');
    panel.shots.forEach((s,i)=>{
      const row=i+1;if(selectedRow!==null&&row!==selectedRow)return;
      for(const field of columns.filter(k=>!['motif_id','change_reason'].includes(k)))if(!trim(s[field]))missing('shots',row,field);
      if(trim(s.screen_direction)&&!['left','right','neutral'].includes(s.screen_direction))add('shots',row,'screen_direction','invalid_direction','畫面方向需選向左、向右或正面／中性');
      const motif=motifs.get(s.motif_id);
      if(!s.motif_id)missing('shots',row,'motif_id');
      else if(!motif)add('shots',row,'motif_id','unknown_motif','引用的母題已不在清單，請重新選擇');
      else if(!motif.name||!motif.meaning)add('shots',row,'motif_id','incomplete_motif','所選母題尚未補齊名稱或初始意義',motif.row);
      else if(names.get(motif.name).length>1)add('shots',row,'motif_id','ambiguous_motif','所選母題名稱重複，請先區分母題',motif.row);
    });
    return {totalShots:panel.shots.length,filledShots:panel.shots.length-blocked.size,totalMotifs:panel.motifs.length,issueCount,issues,truncated:issueCount>issues.length};
  }
  function inspect(panel){return inspectSource(source(panel));}
  const notes=['只檢查分鏡必填欄位、畫面方向與母題引用；時間、影格與連戲仍須完整建立驗證。','原字串、鏡號、母題 ID 與順序保留；沒有補寫創作或呼叫模型，實際音畫與素材授權另行核對。'];
  function report(panel){
    const selected=source(panel),data=inspectSource(selected);
    return {format:'zoe-storyboard-review',schema_version:1,status:data.issueCount?'needs_correction':'fields_checked',source:selected,
      total_shots:data.totalShots,filled_shots:data.filledShots,total_motifs:data.totalMotifs,issue_count:data.issueCount,
      issues:data.issues.map(({relatedRow,...issue})=>({...issue,related_row:relatedRow})),details_truncated:data.truncated,review_notes:[...notes]};
  }
  function markdown(data){
    const lines=['# 分鏡欄位檢查','',`共${data.total_shots}鏡；單鏡欄位已填${data.filled_shots}鏡；共${data.total_motifs}個母題；待辦${data.issue_count}項。`,''];
    for(const issue of data.issues){const prefix={shots:'鏡頭',motifs:'母題'}[issue.scope];lines.push(`- ${prefix?`${prefix} ${issue.row} · `:''}${labels[issue.field]}：${issue.message}${issue.related_row!==null?`（母題 ${issue.related_row}）`:''}`);}
    if(data.details_truncated)lines.push('- 明細僅列前200項；全部鏡頭與母題已檢查，修正後請重查。');
    if(!data.issue_count)lines.push('目前欄位沒有待辦；仍須完整建立與實際音畫驗證。');
    return [...lines,'',...data.review_notes,''].join('\n');
  }
  function checkedResult(panel,reply){
    return Report.checkedResult({expected:report(panel),reply,jsonName:'storyboard-review.json',markdownName:'storyboard-review.md',markdown,label:'分鏡待辦報告'});
  }
  function createController({capture,captureIds=null,onState=()=>{}}){
    return Checkpoint.createController({capture:()=>({panel:capture(),ids:captureIds?captureIds():null}),
      source:value=>{const panel=source(value.panel),ids=captureIds?Focus.checkedSource('shots',{ids:value.ids,visible:true,busy:false}).ids:null;
        if(ids&&ids.length!==panel.shots.length)throw Error('分鏡鏡頭識別不完整；目前內容保留');
        return {panel,ids};},inspect:value=>inspectSource(value.panel),onState});
  }
  function inspectRow(panel,row){
    const selected=source(panel);if(!Number.isSafeInteger(row)||row<1||row>selected.shots.length)throw Error('請選擇目前分鏡中有效的原始鏡號');
    return {source:{fields:selected.fields,motifs:selected.motifs,shot:selected.shots[row-1]},row,totalShots:selected.shots.length,...inspectSource(selected,row)};
  }
  const api={inspect,inspectRow,report,markdown,checkedResult,createController,labels};
  if(node)module.exports=api;else root.MusicStoryboardReadiness=api;
})(typeof window==='object'?window:{});
