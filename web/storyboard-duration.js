// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
  const Frames=typeof module==='object'&&module.exports?require('./storyboard-frames.js'):root.MusicStoryboardFrames;
  const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
  function clock(value,label){
    if(typeof value!=='string'||!value.trim()||!/^[+-]?(?:[0-9]+(?:\.[0-9]*)?|\.[0-9]+)(?:e[+-]?[0-9]+)?$/i.test(value.trim()))throw Error(label+'需為十進位數字');
    const result=Number(value);if(!Number.isFinite(result))throw Error(label+'需為有限數字');return result;
  }
  function snapshot(value){
    if(!value||typeof value.duration!=='string'||typeof value.fps!=='string'||!Array.isArray(value.shots)||value.shots.length>1000)throw Error('分鏡總長來源不完整；目前內容保留');
    const ids=new Set();
    const shots=value.shots.map(s=>{
      if(!s||typeof s.id!=='string'||!s.id||ids.has(s.id)||typeof s.start!=='string'||typeof s.end!=='string')throw Error('分鏡時間來源不完整；目前內容保留');
      ids.add(s.id);return {id:s.id,start:s.start,end:s.end};
    });
    return {duration:value.duration,fps:value.fps,shots};
  }
  function proposal(value){
    const selected=snapshot(value);
    if(!selected.shots.length)throw Error('尚無鏡頭；先完成分鏡時間。');
    const fps=clock(selected.fps,'FPS'),endText=selected.shots.at(-1).end,duration=clock(endText,'最後一鏡結束');
    if(duration<=0||duration>14400||fps<=0||fps>120)throw Error('鏡尾需為0–14400秒內的正時長，FPS需為0–120內的正數。');
    let previous=0;
    const shots=selected.shots.map((s,i)=>{
      const start=clock(s.start,`鏡頭${i+1}開始`),end=clock(s.end,`鏡頭${i+1}結束`);
      if(start<0||end<=start||end>duration+.001+1e-12||Math.abs(start-previous)>.001+1e-12)throw Error(`鏡頭${i+1}時間有重疊、空缺或超出鏡尾；先核對時間。`);
      previous=end;return {start,end,start_frame:Frames.frameIndex(start,fps),end_frame_exclusive:Frames.frameIndex(end,fps)};
    });
    const frames=Frames.validateTimeline({duration_seconds:duration,fps,shots});
    return {source:{fps:selected.fps,shots:selected.shots},before:selected.duration,after:endText,seconds:duration,totalFrames:frames.totalFrames};
  }
  function compare(value){
    const selected=snapshot(value);let declared=null,candidate=null,error='';
    try{declared=clock(selected.duration,'作品總長');if(declared<=0||declared>14400)declared=null;}catch(_){}
    try{candidate=proposal(selected);}catch(e){error=e.message;}
    const status=!candidate?'unavailable':!selected.duration.trim()?'empty':declared===null?'invalid':declared===candidate.seconds?'matches':'differs';
    return {status,declaredText:!selected.duration.trim()?'尚未宣告':declared===null?'請核對宣告':declared+' 秒',
      candidateText:candidate?candidate.seconds+' 秒 · '+candidate.totalFrames+' 幀':'尚無可接續鏡尾',
      canAdopt:!!candidate&&status!=='matches',candidate,error};
  }
  function createController({capture,apply,onState}){
    let record=null,offer=null,notice='';
    const current=()=>snapshot(capture());
    function describe(selected){
      const result=compare(selected),source={fps:selected.fps,shots:selected.shots};
      const canUndo=!!record&&same(source,record.source)&&selected.duration===record.after;
      const notes={empty:'作品總長留白；核對鏡尾後可明確採用。',invalid:'目前總長需核對；原值保留，可手動編修或採用鏡尾。',matches:'宣告與鏡尾相同；仍需完整建立驗證與實際音畫核對。',differs:'宣告與鏡尾不同；新增或刪除鏡頭保留宣告，確認後再採用。'};
      return {...result,canUndo,note:notice||(result.status==='unavailable'?result.error:notes[result.status])};
    }
    const view=()=>describe(current());
    function publish(){offer=current();const value=describe(offer);onState(value);return value;}
    function refresh(){notice='';return publish();}
    function adopt(){
      const selected=current();
      if(!offer||!same(selected,offer)){notice='';publish();throw Error('分鏡來源已有變更；目前總長保留，請重新核對。');}
      const result=compare(selected);if(!result.canAdopt)throw Error(result.error||'尚無可採用的不同鏡尾；目前總長保留');
      const candidate=result.candidate;apply(candidate.after);
      const after=current();
      if(!same({fps:after.fps,shots:after.shots},candidate.source))throw Error('採用期間分鏡時間來源有變更；請核對目前內容。');
      record=selected.duration===after.duration?null:{source:candidate.source,before:selected.duration,after:after.duration};
      if(clock(after.duration,'接續後總長')!==candidate.seconds){notice='';publish();throw Error('總長欄未接續預期值；請核對，仍可撤回本次寫入。');}
      notice='只接續作品總長；原始秒數、段落、母題與音檔保留，仍需完整建立驗證。';return publish();
    }
    function undo(){
      const selected=current();
      if(!record||!same({fps:selected.fps,shots:selected.shots},record.source)||selected.duration!==record.after)throw Error('總長、鏡頭時間、列來源或 FPS 已有變更；目前內容保留。');
      const before=record.before;apply(before);record=null;notice='已撤回本次總長接續；後續創作文字與音檔保留。';return publish();
    }
    function clear(){record=null;notice='';return publish();}
    return {refresh,view,adopt,undo,clear};
  }
  const api={proposal,compare,createController};
  if(typeof module==='object'&&module.exports)module.exports=api;else root.MusicStoryboardDuration=api;
})(typeof globalThis==='object'?globalThis:this);
