// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
  const secondsTolerance=.001+1e-12;
  const descriptor={format:'zoe-storyboard-frames',schema_version:1,rounding:'nearest_ties_to_even',end_semantics:'exclusive'};
  function frameIndex(seconds,fps){
    if(typeof seconds!=='number'||!Number.isFinite(seconds)||seconds<0||seconds>14400+secondsTolerance||
      typeof fps!=='number'||!Number.isFinite(fps)||fps<=0||fps>120)throw Error('影格時間與 FPS 無效');
    const value=seconds*fps,lower=Math.floor(value),part=value-lower;
    return part<.5?lower:part>.5?lower+1:lower%2===0?lower:lower+1;
  }
  function validateTimeline(data,{requireDeclaration=false}={}){
    const fail=()=>{throw Error('分鏡影格不連續、宣告不一致或版本不支援；目前成果保留');};
    if(!data||!Array.isArray(data.shots)||!data.shots.length||!Number.isFinite(data.duration_seconds)||data.duration_seconds<=0||data.duration_seconds>14400)fail();
    const total=frameIndex(data.duration_seconds,data.fps),declared=data.frame_timeline;
    if(total<1)fail();
    if(declared===undefined){if(requireDeclaration)fail();}
    else if(!declared||typeof declared!=='object'||Array.isArray(declared)||
      Object.keys(declared).length!==5||Object.entries(descriptor).some(([k,v])=>declared[k]!==v)||declared.total_frames!==total)fail();
    let cursor=0;
    for(const shot of data.shots){
      if(!shot||!Number.isSafeInteger(shot.start_frame)||!Number.isSafeInteger(shot.end_frame_exclusive)||
        shot.start_frame!==frameIndex(shot.start,data.fps)||shot.end_frame_exclusive!==frameIndex(shot.end,data.fps)||
        shot.start_frame!==cursor||shot.end_frame_exclusive<=cursor)fail();
      cursor=shot.end_frame_exclusive;
    }
    if(cursor!==total)fail();
    return {totalFrames:total,endSemantics:'exclusive',rounding:'nearest_ties_to_even',declared:declared!==undefined};
  }
  const api={frameIndex,validateTimeline,secondsTolerance};
  if(typeof module==='object'&&module.exports)module.exports=api;else root.MusicStoryboardFrames=api;
})(typeof globalThis==='object'?globalThis:this);
