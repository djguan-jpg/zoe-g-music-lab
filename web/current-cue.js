// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
  const node=typeof module==='object'&&module.exports;
  const P=node?require('./wave-position.js'):root.MusicWavePosition,
    C=node?require('./cue-stamp.js'):root.MusicCueStamp,E=node?require('./editor-state.js'):root.MusicEditor;
  const exact=(v,keys)=>v&&typeof v==='object'&&!Array.isArray(v)&&Object.keys(v).length===keys.length&&keys.every(k=>Object.hasOwn(v,k));
  const neutral=()=>({index:-1,id:null,text:'等待歌詞與音檔',canFocus:false,note:'先載入可定位音檔，再核對目前句子。'});
  function checkedRows(source){
    if(!Array.isArray(source)||source.length>10000)throw Error('目前句子的來源不完整');
    const ids=new Set(),rows=source.map(row=>{
      if(!exact(row,['id','start','end','text'])||typeof row.id!=='string'||!row.id||row.id.length>64||ids.has(row.id)||
        ![row.start,row.end,row.text].every(v=>typeof v==='string')||row.start.length>4096||row.end.length>4096)throw Error('目前句子的來源不完整');
      ids.add(row.id);return {...row};
    });
    return rows;
  }
  function checkedContext(snapshot){
    if(!exact(snapshot,['media','visible','busy'])||typeof snapshot.visible!=='boolean'||typeof snapshot.busy!=='boolean')throw Error('目前句子的來源不完整');
    P.present(snapshot.media);return {media:{...snapshot.media},visible:snapshot.visible,busy:snapshot.busy};
  }
  function checked(snapshot){
    if(!exact(snapshot,['media','rows','visible','busy']))throw Error('目前句子的來源不完整');
    return {...checkedContext({media:snapshot.media,visible:snapshot.visible,busy:snapshot.busy}),rows:checkedRows(snapshot.rows)};
  }
  function view(snapshot){
    if(!snapshot.visible||!P.present(snapshot.media).available)return neutral();
    const index=E.activeCueIndex(snapshot.playable||C.playableCues(snapshot.rows),snapshot.media.position);
    if(index<0)return {...neutral(),text:'…',note:'目前位置沒有已校時句子。'};
    const row=snapshot.rows[index];return {index,id:row.id,text:row.text,canFocus:!snapshot.busy,
      note:`目前第 ${index+1} 句；按「前往目前這句」到歌詞欄位。`};
  }
  function present(snapshot){return view(checked(snapshot));}
  const sameRow=(a,b)=>a.id===b.id&&a.start===b.start&&a.end===b.end&&a.text===b.text;
  function createController({capture,focusTarget,onView=()=>{},onFocused=()=>{},onError=()=>{}}){
    let disposed=false;
    function refresh(){
      if(disposed)return null;
      let result;try{result=present(capture());}catch{result=neutral();}
      onView({...result});return result;
    }
    return {refresh,focus(){
      if(disposed)return false;
      try{
        const before=checked(capture()),first=view(before);if(!first.canFocus){refresh();return false;}
        const after=checked(capture()),current=view(after);
        if(!current.canFocus||current.id!==first.id||!sameRow(before.rows[first.index],after.rows[current.index])||
          ['source','current_source','duration'].some(k=>before.media[k]!==after.media[k])){
          refresh();return false;
        }
        if(focusTarget(current.id,{...after.rows[current.index]})!==true)throw Error('目前句子無法定位；請依現在表格再試');
        refresh();onFocused({id:current.id,index:current.index});return true;
      }catch(error){refresh();onError(error);return false;}
    },dispose(){disposed=true;}};
  }
  function createPlaybackController({captureContext,captureRows,focusTarget,onView=()=>{},onFocused=()=>{},onError=()=>{}}){
    let disposed=false,prepared=null,attempted=false,generation=0;
    const invalidate=()=>{if(!disposed){prepared=null;attempted=false;generation++;}};
    const fresh=createController({capture:()=>({...checkedContext(captureContext()),rows:captureRows()}),focusTarget,onFocused,onError,
      onView:value=>{invalidate();onView(value);}});
    function refresh(){
      if(disposed)return null;
      let result=neutral();
      try{
        let context=checkedContext(captureContext());
        if(context.visible&&P.present(context.media).available){
          if(!attempted){
            const token=generation;attempted=true;
            const rows=checkedRows(captureRows()),candidate={rows,playable:C.playableCues(rows)};
            if(token===generation)prepared=candidate;
            context=checkedContext(captureContext());
          }
          if(prepared)result=view({...context,...prepared});
        }
      }catch{}
      onView({...result});return result;
    }
    return {refresh,invalidate,focus(){
      if(disposed)return false;
      try{const context=checkedContext(captureContext());if(!context.visible||context.busy||!P.present(context.media).available){refresh();return false;}}
      catch{refresh();return false;}
      return fresh.focus();
    },dispose(){disposed=true;prepared=null;fresh.dispose();}};
  }
  const api=Object.freeze({present,createController,createPlaybackController});if(node)module.exports=api;else root.MusicCurrentCue=api;
})(typeof globalThis==='object'?globalThis:this);
