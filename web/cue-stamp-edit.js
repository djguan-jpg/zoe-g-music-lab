// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
  const node=typeof module==='object'&&module.exports;
  const C=node?require('./cue-stamp.js'):root.MusicCueStamp,P=node?require('./wave-position.js'):root.MusicWavePosition;
  const exact=(v,keys)=>v&&typeof v==='object'&&!Array.isArray(v)&&Object.keys(v).length===keys.length&&keys.every(k=>Object.hasOwn(v,k));
  const idValid=v=>typeof v==='string'&&v.length>0&&v.length<=64;
  function checkedRow(id,row){
    if(!idValid(id)||!exact(row,['id','start','end','text'])||row.id!==id||![row.start,row.end,row.text].every(v=>typeof v==='string'))throw Error('目標歌詞句已不存在或內容不完整');
    if(row.start.length>4096||row.end.length>4096)throw Error('時間欄位過長，請先縮短；原內容保留');
    return {...row};
  }
  const times=row=>({start:row.start,end:row.end});
  const sameTimes=(a,b)=>a.start===b.start&&a.end===b.end;
  const sameRow=(a,b)=>a.id===b.id&&sameTimes(a,b)&&a.text===b.text;
  function createController({readRow,writeTimes,captureMedia,onState=()=>{},onError=()=>{}}){
    let record=null,disposed=false;
    function status(){
      if(record&&!record.stale){
        try{if(!sameTimes(checkedRow(record.id,readRow(record.id)),record.after))record.stale='目標句時間已修改';}
        catch{record.stale='目標句已不存在或內容不完整';}
      }
      return {hasRecord:!!record,canUndo:!disposed&&!!record&&!record.stale,id:record?.id??null,action:record?.action??null,reason:record?.stale??null};
    }
    function refresh(){if(disposed)return null;const view=status();onState({...view});return view;}
    function fail(error){refresh();onError(error);return false;}
    function actual(id,expected){const row=checkedRow(id,readRow(id));if(!sameRow(row,expected))throw Error('標記時間未完整套用；請核對目前表格');return row;}
    return {refresh,
      stamp(id,action){
        if(disposed)return false;
        try{
          refresh();const row=checkedRow(id,readRow(id)),media=captureMedia();if(!P.present(media).available)throw Error('先載入可定位的音檔，再記下播放位置');
          const proposed=C.stamp({start:row.start,end:row.end,text:row.text},action,media.position,media.duration);
          const current=checkedRow(id,readRow(id)),now=captureMedia();
          if(!sameRow(row,current)||!P.present(now).available||['source','current_source','duration'].some(k=>now[k]!==media[k]))throw Error('歌詞句或音檔來源已變更；請重新標記');
          if(sameTimes(row,proposed))return {id,action,changed:false,undone:false};
          writeTimes(id,times(proposed));actual(id,{id,...proposed});
          record={id,action,before:times(row),after:times(proposed),stale:null};refresh();return {id,action,changed:true,undone:false};
        }catch(error){return fail(error);}
      },
      undo(){
        if(disposed)return false;
        try{
          const view=status();if(!view.canUndo)throw Error(view.reason||'尚無逐句標記可撤回');
          const saved=record,row=checkedRow(saved.id,readRow(saved.id)),again=checkedRow(saved.id,readRow(saved.id));
          if(!sameRow(row,again)||!sameTimes(row,saved.after))throw Error('目標句已有編修；目前內容保留');
          writeTimes(saved.id,{...saved.before});actual(saved.id,{...row,...saved.before});record=null;refresh();
          return {id:saved.id,action:saved.action,changed:true,undone:true};
        }catch(error){return fail(error);}
      },
      clear(){record=null;return refresh();},dispose(){record=null;disposed=true;}
    };
  }
  const api=Object.freeze({checkedRow,createController});if(node)module.exports=api;else root.MusicCueStampEdit=api;
})(typeof globalThis==='object'?globalThis:this);
