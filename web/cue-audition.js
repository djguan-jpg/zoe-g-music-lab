// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
  const node=typeof module==='object'&&module.exports;
  const W=node?require('./wave-position.js'):root.MusicWavePosition,C=node?require('./cue-position.js'):root.MusicCuePosition,T=node?require('../musiclab/assets/lyric-time.js'):root.LyricTime;
  const exact=(v,keys)=>v&&typeof v==='object'&&!Array.isArray(v)&&Object.keys(v).length===keys.length&&keys.every(k=>Object.hasOwn(v,k));
  function checked(value){
    if(!exact(value,['row','media','playing','visible','busy'])||typeof value.playing!=='boolean'||typeof value.visible!=='boolean'||typeof value.busy!=='boolean')throw Error('單句試聽來源不完整');
    W.present(value.media);
    if(value.row!==null&&(!exact(value.row,['id','start','end','text'])||typeof value.row.id!=='string'||!value.row.id||value.row.id.length>64||!['start','end','text'].every(k=>typeof value.row[k]==='string')||value.row.start.length>4096||value.row.end.length>4096))throw Error('單句試聽的原列不完整');
    return {...value,row:value.row===null?null:{...value.row},media:{...value.media}};
  }
  function range(value){
    const s=checked(value);if(!s.visible||s.busy||s.row===null||!W.present(s.media).available)return null;
    const start=C.target(s.row,s.media).position,end=T.normalize(s.row.end,'試聽結束',true);
    if(end<=start||end>s.media.duration)throw Error('試聽需要有效開始與結束，且不能超過音檔；原時間保留');
    return {id:s.row.id,start,end};
  }
  const sameMedia=(a,b)=>['source','current_source','duration'].every(k=>a.media[k]===b.media[k]);
  const sameRow=(a,b)=>a.row!==null&&b.row!==null&&['id','start','end','text'].every(k=>a.row[k]===b.row[k]);
  function createController({capture,setPosition,play,pause,onView=()=>{},onError=()=>{}}){
    let current=null,disposed=false,writing=false,generation=0,message='選定有效時間的句子，再試聽；歌詞與成果保留。';
    function emit(snapshot){
      if(disposed)return null;let proposal=null;try{proposal=range(snapshot||capture());}catch{}
      const view={phase:current?.phase||'idle',canStart:!writing&&!current&&proposal!==null,canStop:!writing&&current!==null,
        text:current?`${current.phase==='pending'?'正在啟動':'正在試聽'} ${current.target.start}–${current.target.end} 秒；依瀏覽器事件停止，可能略越過句尾。`:message};
      onView({...view});return view;
    }
    function release(text){current=null;generation++;message=text;}
    function stop(reason='manual'){
      if(disposed||writing||!current)return false;
      const job=current;
      try{
        const before=checked(capture());if(disposed||current!==job)return false;
        if(!sameMedia(before,job.source)){release('音檔已切換，原試聽已解除；目前播放器保留。');emit(before);return true;}
        writing=true;const accepted=pause({...job.source.media});if(disposed)return false;
        const after=checked(capture());if(disposed)return false;
        if(accepted===false||!sameMedia(after,job.source)||after.playing)throw Error('停止試聽尚未確認；請核對播放器並重試');
        release(reason==='end'?'已停止本句試聽；請實聽核對句尾，這不是精準裁切。':reason==='source'?'句子或狀態已有修改，已停止本句試聽。':'已停止本句試聽；原時間、文字與成果保留。');writing=false;emit(after);return true;
      }catch(error){if(!disposed){writing=false;onError(error);emit();}return false;}
      finally{writing=false;}
    }
    function refresh(){
      if(disposed||writing)return null;
      try{
        const now=checked(capture());if(disposed)return null;
        if(current){
          if(!sameMedia(now,current.source)){release('音檔已切換，原試聽已解除；目前播放器保留。');}
          else if(!now.visible||now.busy||!W.present(now.media).available||!sameRow(now,current.source)){stop('source');return disposed?null:emit();}
          else if(now.media.position>=current.target.end){stop('end');return disposed?null:emit();}
          else if(current.phase==='playing'&&!now.playing){release('播放器已暫停，本句試聽已解除。');}
        }
        return emit(now);
      }catch(error){if(current)stop('source');return emit();}
    }
    async function start(){
      if(disposed||writing||current)return false;let job=null;writing=true;
      try{
        const before=checked(capture()),target=range(before);if(disposed)return false;if(!target)throw Error('先選定已校時句子與可播放音檔，再試聽');
        const now=checked(capture());if(disposed)return false;
        if(!range(now)||!sameRow(before,now)||!sameMedia(before,now))throw Error('句子或音檔已改變；請依目前來源再試聽');
        writing=true;const accepted=setPosition(target.start,{...now.media});if(disposed)return false;
        const positioned=checked(capture());if(disposed)return false;
        if(accepted===false||!range(positioned)||!sameRow(now,positioned)||!sameMedia(now,positioned)||Math.abs(positioned.media.position-target.start)>.001)throw Error('試聽句首定位未確認；原歌詞保留');
        job={token:++generation,source:positioned,target,phase:'pending'};current=job;writing=false;emit(positioned);
        if(disposed||current!==job)return false;
        const played=await play({...job.source.media});if(disposed||current!==job||job.token!==generation)return false;
        const actual=checked(capture());if(disposed||current!==job)return false;
        if(played===false||!range(actual)||!sameRow(job.source,actual)||!sameMedia(job.source,actual)||!actual.playing)throw Error('播放器尚未接受本句試聽；請核對後再試');
        job.phase='playing';refresh();return !disposed&&current===job;
      }catch(error){if(disposed||job&&current!==job)return false;writing=false;if(job)stop('failed');if(!disposed){onError(error);emit();}return false;}
      finally{writing=false;}
    }
    return {start,stop,refresh,dispose(){if(disposed)return true;const confirmed=!current||stop('dispose');disposed=true;generation++;current=null;return confirmed;}};
  }
  const api=Object.freeze({range,createController});if(node)module.exports=api;else root.MusicCueAudition=api;
})(typeof globalThis==='object'?globalThis:this);
