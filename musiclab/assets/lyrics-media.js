// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
  const Time=typeof module==='object'&&module.exports?require('./lyric-time.js'):root.LyricTime;
  function mediaTime(value){
    if(typeof value!=='number'||!Number.isFinite(value)||value<=0) return null;
    try{const ms=Time.milliseconds(value);return ms>0?Time.seconds(ms):null;}catch(_){return null;}
  }
  function compare(declared,media){
    if(typeof declared!=='string')throw Error('作品時長欄需為文字；目前內容保留');
    const measured=mediaTime(media),empty=!declared.trim();let duration=null;
    if(!empty)try{const value=Time.normalize(declared,'作品時長',true);if(value>0)duration=value;}catch(_){}
    const status=measured===null?'unavailable':empty?'empty':duration===null?'invalid':
      Time.milliseconds(duration)===Time.milliseconds(measured)?'matches':'differs';
    return {status,mediaSeconds:measured,declaredSeconds:duration,
      mediaText:measured===null?'尚無可用時長':measured.toFixed(3)+' 秒',
      declaredText:empty?'尚未宣告':duration===null?'請核對輸入':duration.toFixed(3)+' 秒',
      canAdopt:measured!==null&&status!=='matches'};
  }
  function createController({capture,apply,onState}){
    let selected=null,revision=0,record=null,notice='';
    const current=()=>{const value=capture();if(typeof value!=='string')throw Error('作品時長欄需為文字');return value;};
    function view(){
      const text=current(),result=compare(text,selected?.seconds);
      const value={...result,phase:selected?.phase||'unselected',notice,
        canUndo:!!record&&selected?.source===record.source&&text===record.after};
      value.note=describe(value);return value;
    }
    function publish(){const value=view();onState(value);return value;}
    function refresh({protect=true}={}){if(protect){revision++;notice='';}return publish();}
    function select(source){
      if(typeof source!=='string'||!source)throw Error('選定音檔來源無效');
      selected={source,phase:'loading',seconds:null,before:current(),revision};record=null;notice='';return publish();
    }
    function change(value,message){
      const before=current(),source=selected.source;apply(value);
      // Retain exactly what the field received, without rewriting other data.
      const after=current();record=before===after?null:{source,before,after};notice=message;return publish();
    }
    function loaded(source,seconds){
      if(!selected||selected.source!==source)return false;
      const value=mediaTime(seconds);selected.phase=value===null?'unavailable':'ready';selected.seconds=value;
      if(value!==null&&!selected.before.trim()&&current()===selected.before&&revision===selected.revision){
        change(value.toFixed(3),'已接續原本空白的作品時長；歌詞與實際聲音仍需核對。');
      }else publish();
      return true;
    }
    function fail(source){
      if(!selected||selected.source!==source)return false;
      selected.phase='error';selected.seconds=null;notice='此音檔沒有可用時長；作品宣告與歌詞保留。';publish();return true;
    }
    function adopt(){
      const result=view();if(!result.canAdopt)throw Error('尚無可採用的不同音檔時長；目前內容保留');
      return change(result.mediaSeconds.toFixed(3),'只更改作品時長；逐句時間、原文與音檔保留，仍需實聽核對。');
    }
    function undo(){
      if(!record||selected?.source!==record.source||current()!==record.after)throw Error('作品時長已有編修或音檔已更換；目前內容保留');
      const before=record.before;apply(before);record=null;notice='已撤回這次時長接續；歌詞與音檔保留。';return publish();
    }
    function clear(){selected=null;record=null;notice='';revision++;return publish();}
    return {select,loaded,fail,adopt,undo,clear,refresh,view};
  }
  function describe(view){
    const notes={unavailable:'選定音檔後核對；已有作品時長不會被音檔覆寫。',empty:'作品時長尚未宣告；可採用選定音檔時長，或繼續手動編修。',invalid:'作品時長輸入需核對；已有文字保留，可手動編修或採用音檔時長。',matches:'音檔與作品宣告在毫秒精度內一致；仍需實聽核對逐句。',differs:'音檔與作品宣告不同；已有宣告保留。需要使用這份音檔時長時，再明確採用。'};
    return view.phase==='loading'?'正在讀取選定音檔時長；目前宣告與歌詞保留。':view.notice||notes[view.status];
  }
  const api={mediaTime,compare,createController};
  if(typeof module==='object'&&module.exports)module.exports=api;else root.MusicLyricsMedia=api;
})(typeof globalThis==='object'?globalThis:this);
