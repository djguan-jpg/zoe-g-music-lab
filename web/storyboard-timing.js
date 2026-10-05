// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
  const node=typeof module==='object'&&module.exports;
  const V=node?require('./planning-values.js'):root.MusicPlanningValues;
  const F=node?require('./storyboard-frames.js'):root.MusicStoryboardFrames;
  const J=node?require('../musiclab/assets/json-document.js'):root.MusicJsonDocument;
  const Checkpoint=node?require('./readiness-state.js'):root.MusicReadinessState;
  const Report=node?require('./readiness-report.js'):root.MusicReadinessReport;
  const fields=['mv-duration','mv-fps'],labels={'mv-duration':'作品總長','mv-fps':'FPS',shots:'鏡頭清單',start:'開始',end:'結束'};
  const notes=['只檢查原秒數、FPS與影格覆蓋；局部有效秒數列不代表整份時間通過。','原字串、鏡號與順序保留；不排序、補時間、調整FPS或裁切。零待辦仍須完整創作／連戲與實際音畫驗證。'];
  const exact=(v,keys)=>v&&typeof v==='object'&&!Array.isArray(v)&&Object.keys(v).length===keys.length&&keys.every(k=>Object.hasOwn(v,k));
  const strings=(v,keys)=>exact(v,keys)&&keys.every(k=>typeof v[k]==='string');
  function source(panel){
    if(!exact(panel,['fields','shots'])||!strings(panel.fields,fields)||!Array.isArray(panel.shots)||panel.shots.length>1000||
        panel.shots.some(s=>!strings(s,['start','end'])))throw Error('分鏡時間來源格式或容量不支援；目前內容保留');
    const selected={fields:Object.fromEntries(fields.map(k=>[k,panel.fields[k]])),shots:panel.shots.map(s=>({start:s.start,end:s.end}))};
    return J.parse(JSON.stringify(selected),{maxBytes:8*1024*1024,label:'分鏡時間來源'});
  }
  function timingPanel(panel){return source({fields:Object.fromEntries(fields.map(k=>[k,panel.fields[k]])),shots:panel.shots.map(s=>({start:s.start,end:s.end}))});}
  function inspectSource(panel){
    const issues=[],rows=[];let count=0;
    function add(scope,row,field,code,message,relatedRow=null){count++;if(issues.length<200)issues.push({scope,row,field,code,message,relatedRow});}
    function clock(value,scope,row,field){
      if(!V.trim(value)){add(scope,row,field,'missing_clock','尚未填寫時間數值');return null;}
      try{return V.number(value,field);}catch{add(scope,row,field,'invalid_number','請填寫有限十進位數字');return null;}
    }
    let duration=clock(panel.fields['mv-duration'],'fields',0,'mv-duration'),fps=clock(panel.fields['mv-fps'],'fields',0,'mv-fps');
    if(duration!==null&&!(duration>0&&duration<=14400)){add('fields',0,'mv-duration','invalid_range','作品總長需大於0且不超過14400秒');duration=null;}
    if(fps!==null&&!(fps>0&&fps<=120)){add('fields',0,'mv-fps','invalid_range','FPS需大於0且不超過120');fps=null;}
    const total=duration!==null&&fps!==null?F.frameIndex(duration,fps):null;
    if(total!==null&&total<1)add('fields',0,'mv-duration','short_declaration','作品宣告短於一影格；請核對總長與FPS');
    if(!panel.shots.length)add('fields',0,'shots','no_shots','尚無鏡頭，請新增或接續分鏡起稿');
    panel.shots.forEach((shot,i)=>{
      const row=i+1,start=clock(shot.start,'shots',row,'start'),end=clock(shot.end,'shots',row,'end');let valid=start!==null&&end!==null;
      for(const [field,value] of [['start',start],['end',end]])if(value!==null&&(V.isNegative(shot[field])||!(value>=0&&value<=14400+F.secondsTolerance))){add('shots',row,field,'invalid_range','時間需為非負且不超過14400秒的容差範圍');valid=false;}
      if(valid&&end<=start){add('shots',row,'end','nonpositive_duration','結束需晚於開始');valid=false;}
      if(valid&&duration!==null&&end>duration+F.secondsTolerance){add('shots',row,'end','beyond_declaration','鏡尾超出作品宣告時長的容差範圍');valid=false;}
      const previous=rows.at(-1);
      if(valid){
        if(row===1||previous.valid){
          const boundary=row===1?0:previous.end;
          if(Math.abs(start-boundary)>F.secondsTolerance)add('shots',row,'start',start<boundary?'seconds_overlap':'seconds_gap',start<boundary?'秒數接點有重疊':'秒數接點有空缺',row>1?row-1:null);
        }
        if(fps!==null){
          const first=F.frameIndex(start,fps),last=F.frameIndex(end,fps);
          if(last<=first)add('shots',row,'end','short_frame','鏡頭短於一影格；請核對秒數與FPS');
          if(row===1||previous.valid){
            const boundary=row===1?0:F.frameIndex(previous.end,fps);
            if(first!==boundary)add('shots',row,'start',first<boundary?'frames_overlap':'frames_gap',first<boundary?'影格接點有重疊':'影格接點有空缺',row>1?row-1:null);
          }
        }
      }
      rows.push({start,end,valid});
    });
    if(rows.length&&rows.at(-1).valid&&duration!==null){
      const row=rows.length,end=rows.at(-1).end;
      if(Math.abs(end-duration)>F.secondsTolerance)add('shots',row,'end','tail_seconds','尾鏡與作品宣告的秒數不符');
      if(total!==null&&F.frameIndex(end,fps)!==total)add('shots',row,'end','tail_frames','尾鏡與作品宣告的結束影格不符；結束影格不含');
    }
    return {totalShots:rows.length,timedShots:rows.filter(r=>r.valid).length,totalFrames:total,issueCount:count,issues,truncated:count>issues.length};
  }
  function inspect(panel){return inspectSource(source(panel));}
  function report(panel){
    const selected=source(panel),data=inspectSource(selected);
    return {format:'zoe-storyboard-timing-review',schema_version:1,status:data.issueCount?'needs_correction':'timing_checked',source:selected,
      total_shots:data.totalShots,timed_shots:data.timedShots,total_frames:data.totalFrames,issue_count:data.issueCount,
      issues:data.issues.map(({relatedRow,...issue})=>({...issue,related_row:relatedRow})),details_truncated:data.truncated,review_notes:[...notes]};
  }
  function markdown(data){
    const frames=data.total_frames===null?'尚無可用宣告影格數':`宣告${data.total_frames}幀（結束不含）`;
    const lines=['# 分鏡時間檢查','',`共${data.total_shots}鏡；局部有效秒數${data.timed_shots}鏡；${frames}；待辦${data.issue_count}項。`,''];
    for(const issue of data.issues)lines.push(`- ${issue.scope==='shots'?`鏡頭 ${issue.row} · `:''}${labels[issue.field]}：${issue.message}${issue.related_row!==null?`（前鏡 ${issue.related_row}）`:''}`);
    if(data.details_truncated)lines.push('- 明細僅列前200項；全部鏡頭已檢查，修正後請重查。');
    if(!data.issue_count)lines.push('目前時間沒有待辦；仍須完整創作與實際音畫驗證。');
    return [...lines,'',...data.review_notes,''].join('\n');
  }
  function checkedResult(panel,reply){return Report.checkedResult({expected:report(panel),reply,jsonName:'storyboard-timing-review.json',markdownName:'storyboard-timing-review.md',markdown,label:'分鏡時間報告'});}
  function createController({capture,onState=()=>{}}){
    function checkpoint(value){
      const panel=source(value.panel),ids=value.ids;
      if(!Array.isArray(ids)||ids.length!==panel.shots.length||ids.some(id=>typeof id!=='string'||!id)||new Set(ids).size!==ids.length)throw Error('分鏡時間列來源不完整');
      return {panel,ids:[...ids]};
    }
    return Checkpoint.createController({capture,source:checkpoint,inspect:value=>inspectSource(value.panel),onState});
  }
  const api={source,timingPanel,inspect,report,markdown,checkedResult,createController,labels};
  if(node)module.exports=api;else root.MusicStoryboardTiming=api;
})(typeof globalThis==='object'?globalThis:this);
