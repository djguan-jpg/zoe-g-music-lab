// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
  const Frames=typeof module==='object'&&module.exports?require('./storyboard-frames.js'):root.MusicStoryboardFrames;
  const object=value=>value&&typeof value==='object'&&!Array.isArray(value);
  const text=value=>typeof value==='string'&&Boolean(value.trim());
  const finite=value=>typeof value==='number'&&Number.isFinite(value);
  const integer=value=>Number.isSafeInteger(value)&&value>0;
  const close=(a,b)=>Math.abs(a-b)<=.001000001;
  function buildReview(operation,result){
    const invalid=()=>{throw Error('設計回應不完整，目前成果未替換');};
    const d=result?.data,files=result?.files,meta=result?.meta;
    if(!['music','storyboard'].includes(operation)||!object(d)||!object(files)||!object(meta)||
      !text(d.title)||!finite(d.duration_seconds)||d.duration_seconds<=0||!Array.isArray(d.review_notes)||
      typeof meta.needs_review!=='boolean'||meta.needs_review!==Boolean(d.review_notes.length)||
      meta.protocol_version!==1||!text(meta.version)||Object.values(files).some(v=>typeof v!=='string'))invalid();
    const required=operation==='music'?['brief.json','task.md','music-plan.json','music-plan.md']:
      ['mv-brief.json','storyboard.json','storyboard.csv','prompts.md','continuity.md'];
    if(required.some(name=>!Object.hasOwn(files,name)||!text(files[name])))invalid();
    const base={operation,title:d.title,duration:d.duration_seconds,notes:structuredClone(d.review_notes),
      needsReview:meta.needs_review,status:'設計資料已建立',fileCount:Object.keys(files).length};
    if(operation==='music'){
      if(d.status!=='design_only_not_generated'||d.timing_assumption!=='constant_tempo_no_pickup'||
        !text(d.memory_hook)||!finite(d.bpm)||d.bpm<20||d.bpm>300||!integer(d.beats_per_bar)||
        d.beats_per_bar>12||!Array.isArray(d.sections)||!d.sections.length||d.sections.length>40||
        d.review_notes.some(n=>!text(n)))invalid();
      let end=0;
      const sections=d.sections.map(s=>{
        if(!object(s)||!text(s.section)||!integer(s.bars)||s.bars>128||!finite(s.energy)||
          s.energy<1||s.energy>5||!finite(s.start)||!finite(s.end)||s.start<0||s.end<=s.start||
          !close(s.start,end)||!text(s.focus)||!text(s.texture))invalid();
        end=s.end;return structuredClone(s);
      });
      if(!close(end,d.duration_seconds))invalid();
      return {...base,bpm:d.bpm,beats:d.beats_per_bar,hook:d.memory_hook,sections,
        bars:sections.reduce((sum,s)=>sum+s.bars,0)};
    }
    if(d.status!=='storyboard_only_not_rendered'||!finite(d.fps)||d.fps<=0||d.fps>120||
      !text(d.aspect_ratio)||!object(d.motifs)||!Object.keys(d.motifs).length||Object.keys(d.motifs).length>30||
      Object.entries(d.motifs).some(([name,meaning])=>!text(name)||!text(meaning))||
      !Array.isArray(d.shots)||!d.shots.length||d.shots.length>1000||
      !Array.isArray(d.continuity)||d.continuity.length!==d.shots.length)invalid();
    let end=0;
    const shots=d.shots.map((s,i)=>{
      const c=d.continuity[i];
      if(!object(s)||s.shot!==i+1||!finite(s.start)||!finite(s.end)||s.start<0||s.end<=s.start||
        !close(s.start,end)||s.end>d.duration_seconds+.001000001||!text(s.section)||!text(s.purpose)||
        !object(c)||c.shot!==s.shot||!text(c.motif)||!Object.hasOwn(d.motifs,c.motif)||!text(c.motif_state)||
        !['left','right','neutral'].includes(c.screen_direction)||!text(c.character_state)||typeof c.change_reason!=='string')invalid();
      end=s.end;return {...structuredClone(s),...structuredClone(c)};
    });
    if(!close(end,d.duration_seconds)||d.review_notes.some(n=>!object(n)||!text(n.message)||
      !(n.shot===null||integer(n.shot)&&n.shot<=shots.length)))invalid();
    const version=meta.version.split('.').map(Number);
    if(!/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.test(meta.version)||!version.every(Number.isSafeInteger))invalid();
    const frames=Frames.validateTimeline(d,{requireDeclaration:version[0]>0||version[1]>=23});
    return {...base,fps:d.fps,ratio:d.aspect_ratio,shots,frames,
      motifs:Object.entries(d.motifs).map(([name,meaning])=>({name,meaning,shots:shots.filter(s=>s.motif===name).map(s=>s.shot)}))};
  }
  async function inspect({operation,brief,isCurrent,request,onResult}){
    const selected=structuredClone(brief);
    const result=await request(operation,selected);
    if(!isCurrent())return false;
    const review=buildReview(operation,result);
    if(review.title!==selected.title.trim())throw Error('設計回應與這次需求不一致，目前成果未替換');
    onResult(result,review);return true;
  }
  const api={buildReview,inspect};
  if(typeof module==='object'&&module.exports)module.exports=api;else root.MusicPlanReview=api;
})(typeof globalThis==='object'?globalThis:this);
