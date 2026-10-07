// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
  const time=typeof module==='object'&&module.exports?require('../musiclab/assets/lyric-time.js'):root.LyricTime;
  function orderedEntries(entries){
    if(!Array.isArray(entries)||!entries.length)throw Error('請先讀取逐句歌詞');
    const ids=new Set();
    return structuredClone(entries).map(entry=>{
      if(!entry||typeof entry.id!=='string'||ids.has(entry.id)||!entry.value||typeof entry.value.text!=='string')throw Error('歌詞列識別不完整');
      ids.add(entry.id);time.normalize(entry.value.start,'歌詞開始時間',true);time.normalize(entry.value.end,'歌詞結束時間',true);return entry;
    }).sort((a,b)=>time.number(a.value.start)-time.number(b.value.start));
  }
  function nextCue(lastEnd){
    const blank=lastEnd===undefined||typeof lastEnd==='string'&&!time.trim(lastEnd);
    const start=blank?0:time.normalize(lastEnd,'最後一句結束',true);
    const end=time.seconds(time.milliseconds(start,'新句開始')+3000);
    return {start:String(start),end:String(end),text:''};
  }
  function fingerprint(snapshot){
    return JSON.stringify({duration:snapshot.duration,entries:snapshot.entries.map(e=>[e.id,e.value.start,e.value.end])});
  }
  function sameTimes(entries,expected){
    if(entries.length!==expected.length)return false;
    const byId=new Map(entries.map(e=>[e.id,e.value]));if(byId.size!==entries.length)return false;
    return expected.every(e=>{
      const actual=byId.get(e.id);if(!actual)return false;
      try{return ['start','end'].every(key=>{
        time.normalize(actual[key],'歌詞時間',true);
        return time.number(actual[key])===time.number(e.value[key]);
      });}
      catch(_){return false;}
    });
  }
  function sameWrittenSnapshot(actual,before,values){
    try{
      if(actual.duration!==before.duration||actual.entries.length!==before.entries.length)return false;
      const targets=new Map(values.map(e=>[e.id,e.value]));
      if(targets.size!==before.entries.length)return false;
      return actual.entries.every((row,index)=>{
        const original=before.entries[index],target=targets.get(original.id);
        return !!target&&row.id===original.id&&row.value.text===original.value.text&&
          row.value.start===target.start&&row.value.end===target.end;
      });
    }catch{return false;}
  }
  function createTimingController({request,snapshot,applyTimes,onPreview,onApplied,onUndone,onError,onState}){
    let token=0,reading=false,pending=null,undo=null,writing=false,intent=0;
    const state=()=>onState({reading,ready:!!pending&&!writing,canUndo:!!undo&&!writing});
    const invalidate=()=>{token++;reading=false;pending=null;state();};
    return {
      async preview(shift){
        if(writing)return false;
        const current=++token;pending=null;reading=true;state();
        try{
          shift=time.normalize(shift,'整批調整秒數');if(shift===0)throw Error('調整量需至少 0.001 秒；正數延後，負數提前');
          const before=structuredClone(snapshot()),sorted=orderedEntries(before.entries),duration=before.duration;
          const payload={cues:sorted.map(e=>({start:time.number(e.value.start),end:time.number(e.value.end),text:e.value.text})),
            duration:duration===null||duration===undefined||typeof duration==='string'&&!time.trim(duration)?null:time.number(duration),shift_seconds:shift};
          const result=await request(payload);
          if(current!==token)return false;
          if(fingerprint(snapshot())!==fingerprint(before))throw Error('校時預覽期間時間或句子有修改，請重新預覽');
          if(!result||!Array.isArray(result.cues)||result.cues.length!==sorted.length)throw Error('校時預覽回應不完整');
          time.normalizeCues(result.cues,payload.duration);
          const after=sorted.map((entry,i)=>{
            const cue=result.cues[i],expectedStart=time.milliseconds(entry.value.start)+time.milliseconds(shift),
              expectedEnd=time.milliseconds(entry.value.end)+time.milliseconds(shift);
            if(!cue||cue.text!==entry.value.text||time.milliseconds(cue.start)!==expectedStart||time.milliseconds(cue.end)!==expectedEnd)
              throw Error('校時回應與選定句子不一致');
            return {id:entry.id,value:{start:String(cue.start),end:String(cue.end)}};
          });
          pending={before,after,shift};onPreview({shift,count:after.length,before:structuredClone(sorted),after:structuredClone(after)});return true;
        }catch(error){if(current===token)onError(error);return false;}
        finally{if(current===token){reading=false;state();}}
      },
      apply(){
        if(writing||reading||!pending)return false;
        try{
          const job=pending,before=structuredClone(snapshot()),expectedIntent=intent;
          if(fingerprint(before)!==fingerprint(job.before))throw Error('時間或句子在預覽後已修改，請重新預覽');
          writing=true;const result=applyTimes(structuredClone(job.after)),after=structuredClone(snapshot());
          if(result===false||intent!==expectedIntent||!sameWrittenSnapshot(after,before,job.after))throw Error('整批校時未完整寫入；請核對目前表格並重新預覽');
          undo={before:job.before.entries,after:job.after};pending=null;writing=false;onApplied(job.shift);state();return true;
        }catch(error){writing=false;invalidate();onError(error);return false;}
      },
      undo(){
        if(writing||!undo)return false;
        try{
          const old=undo,before=structuredClone(snapshot()),expectedIntent=intent;
          if(!sameTimes(before.entries,old.after))throw Error('句子或時間在套用後已修改；撤回會覆蓋編修，因此未撤回');
          writing=true;const result=applyTimes(structuredClone(old.before)),after=structuredClone(snapshot());
          if(result===false||undo!==old||intent!==expectedIntent||!sameWrittenSnapshot(after,before,old.before))throw Error('整批校時未完整撤回；目前表格與仍存在的撤回紀錄保留');
          undo=null;writing=false;invalidate();onUndone();return true;
        }catch(error){writing=false;state();onError(error);return false;}
      },
      invalidate,
      reset(){intent++;undo=null;invalidate();},
      cancel(){intent++;invalidate();return true;}
    };
  }
  const api={orderedEntries,nextCue,createTimingController};
  if(typeof module==='object'&&module.exports)module.exports=api;else root.MusicTiming=api;
})(typeof globalThis==='object'?globalThis:this);
