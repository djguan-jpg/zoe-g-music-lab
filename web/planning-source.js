// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
  const J=typeof module==='object'&&module.exports?require('../musiclab/assets/json-document.js'):root.MusicJsonDocument;
  const Frames=typeof module==='object'&&module.exports?require('./storyboard-frames.js'):root.MusicStoryboardFrames;
  const maxJsonBytes=8*1024*1024;
  const Values=typeof module==='object'&&module.exports?require('./planning-values.js'):root.MusicPlanningValues;
  const strip=Values.trim;
  const fail=()=>{throw Error('設計回應、需求或 JSON 成果不一致；目前成果與編修保留');};
  const object=v=>v&&typeof v==='object'&&!Array.isArray(v);
  function canonical(v){
    if(Array.isArray(v))return v.map(canonical);
    if(object(v))return Object.fromEntries(Object.keys(v).sort().map(k=>[k,canonical(v[k])]));
    return v;
  }
  const same=(a,b)=>JSON.stringify(canonical(a))===JSON.stringify(canonical(b));
  function text(v,blank=false){if(typeof v!=='string'||!blank&&!strip(v))fail();return strip(v);}
  function number(v){try{return Values.number(v);}catch{fail();}}
  function nonnegative(v){try{return Values.nonnegativeNumber(v);}catch{fail();}}
  function list(v,max,minimum=0){if(!Array.isArray(v)||v.length<minimum||v.length>max)fail();return v;}
  function jsonFile(files,name){if(!object(files)||typeof files[name]!=='string')fail();return J.parse(files[name],{maxBytes:maxJsonBytes,label:'設計 JSON'});}
  function assertSame(a,b){if(!same(a,b))fail();}
  const millisecond=v=>Number.isFinite(v)&&Math.abs(v*1000-Math.round(v*1000))<=1e-7;
  function music(brief,d,files){
    const source=jsonFile(files,'brief.json');assertSame(jsonFile(files,'music-plan.json'),d);
    const bpm=number(brief.bpm),beats=number(brief.beats_per_bar===undefined?4:brief.beats_per_bar),hook=text(brief.memory_hook);
    if(bpm<20||bpm>300||!Number.isInteger(beats)||beats<1||beats>12)fail();
    let elapsed=0;
    const arrangement=list(brief.arrangement,40,1).map((s,i)=>{
      if(!object(s))fail();const bars=number(s.bars),energy=number(s.energy);
      if(!Number.isInteger(bars)||bars<1||bars>128||energy<1||energy>5)fail();
      const row={name:text(s.name),bars,energy,focus:text(s.focus),texture:text(s.texture)};
      const actual=d.sections?.[i],start=elapsed;elapsed+=bars*beats*60/bpm;
      // Both runtimes use binary64; Python rounds to 3 decimals. Check the
      // half-millisecond bound on millisecond-precision values instead of
      // guessing its decimal tie direction.
      if(!actual||!millisecond(actual.start)||!millisecond(actual.end)||
        Math.abs(actual.start-start)>.000500001||Math.abs(actual.end-elapsed)>.000500001)fail();
      assertSame(actual,{section:row.name,bars,start:actual.start,end:actual.end,energy,focus:row.focus,texture:row.texture});
      return row;
    });
    if(d.sections.length!==arrangement.length||!millisecond(d.duration_seconds)||Math.abs(d.duration_seconds-elapsed)>.000500001||d.duration_seconds<=0||d.duration_seconds>3600)fail();
    const expected=Object.fromEntries(['title','language','audience','theme','style','vocal'].map(k=>[k,text(brief[k])]));
    const lyrics=brief.existing_lyrics===undefined?'':brief.existing_lyrics;if(typeof lyrics!=='string')fail();
    Object.assign(expected,{duration_seconds:d.duration_seconds,structure:arrangement.map(s=>s.name),
      avoid:list(brief.avoid===undefined?[]:brief.avoid,100).map(v=>text(v)),deliverables:list(brief.deliverables,100,1).map(v=>text(v)),
      existing_lyrics:lyrics,bpm,beats_per_bar:beats,memory_hook:hook,arrangement});
    assertSame(source,expected);
    const lines=lyrics.split(/\r\n|[\n\r\u000b\u000c\u001c-\u001e\u0085\u2028\u2029]/).map(strip).filter(Boolean);
    const units=lines.map((line,i)=>({line:i+1,text:line,text_units:(line.match(/[\u3400-\u9fff]|[A-Za-z0-9]+/g)||[]).length})),notes=[];
    if(new Set(arrangement.map(s=>s.energy)).size===1)notes.push('所有段落能量相同；請確認是否刻意維持平坦動態');
    if(lines.length&&!lines.some(line=>line.includes(hook)))notes.push('草稿尚未出現指定記憶點；可選擇保留意象而不直接重複文字');
    if(units.some(line=>line.text_units>24))notes.push('部分歌詞超過 24 文字單位；需實唱確認一口氣能否唱完');
    assertSame(d,{title:expected.title,bpm,beats_per_bar:beats,duration_seconds:d.duration_seconds,memory_hook:hook,
      sections:d.sections,lyric_units:units,review_notes:notes,status:'design_only_not_generated',
      timing_assumption:'constant_tempo_no_pickup',unit_note:'中文字元與拉丁文字詞計數，不是實測音節'});
  }
  function storyboard(brief,d,files){
    assertSame(jsonFile(files,'mv-brief.json'),brief);assertSame(jsonFile(files,'storyboard.json'),d);
    const duration=number(brief.duration_seconds),fps=number(brief.fps);
    const motifEntries=list(brief.motifs,30,1).map(m=>{if(!object(m))fail();return [text(m.name),text(m.meaning)];});
    const motifs=Object.fromEntries(motifEntries);
    if(Object.keys(motifs).length!==brief.motifs.length)fail();
    const shots=[],continuity=[],notes=[],states=new Map(motifEntries.map(([name])=>[name,[]]));let previous=null;
    list(brief.shots,1000,1).forEach((s,i)=>{
      if(!object(s))fail();const start=nonnegative(s.start),end=nonnegative(s.end),name=text(s.motif),direction=s.screen_direction;
      if(!Object.hasOwn(motifs,name)||!['left','right','neutral'].includes(direction))fail();
      shots.push({shot:i+1,start,end,start_frame:Frames.frameIndex(start,fps),end_frame_exclusive:Frames.frameIndex(end,fps),
        ...Object.fromEntries(['section','purpose','visual','camera','transition'].map(k=>[k,text(s[k])]))});
      const current={shot:i+1,motif:name,motif_state:text(s.motif_state),screen_direction:direction,
        character_state:text(s.character_state),change_reason:text(s.change_reason===undefined?'':s.change_reason,true)};
      if(previous&&(current.character_state!==previous.character_state||new Set([direction,previous.screen_direction]).size===2&&[direction,previous.screen_direction].every(v=>['left','right'].includes(v)))&&!current.change_reason)
        notes.push({shot:i+1,message:'人物狀態或左右方向改變，尚未填入變化理由'});
      continuity.push(current);states.get(name).push(current.motif_state);previous=current;
    });
    for(const [name,values] of states){
      if(!values.length)notes.push({shot:null,message:`母題「${name}」尚未出現在鏡頭中`});
      else if(new Set(values).size===1)notes.push({shot:null,message:`母題「${name}」只有一種狀態；請確認是否刻意維持意義`});
    }
    const expected={title:text(brief.title),duration_seconds:duration,fps,aspect_ratio:text(brief.aspect_ratio),
      visual_style:text(brief.visual_style),character_anchor:text(brief.character_anchor),shots,
      status:'storyboard_only_not_rendered',motifs,continuity,review_notes:notes};
    if(Object.hasOwn(d,'frame_timeline'))expected.frame_timeline={format:'zoe-storyboard-frames',schema_version:1,rounding:'nearest_ties_to_even',end_semantics:'exclusive',total_frames:Frames.frameIndex(duration,fps)};
    assertSame(d,expected);
  }
  function inspect(operation,brief,result){
    if(!object(brief)||!object(result?.data))fail();
    if(operation==='music')music(brief,result.data,result.files);
    else if(operation==='storyboard')storyboard(brief,result.data,result.files);
    else fail();
    return true;
  }
  const api={inspect,maxJsonBytes};
  if(typeof module==='object'&&module.exports)module.exports=api;else root.MusicPlanningSource=api;
})(typeof globalThis==='object'?globalThis:this);
