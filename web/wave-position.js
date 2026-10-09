// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
  const exact=(v,keys)=>v&&typeof v==='object'&&!Array.isArray(v)&&Object.keys(v).length===keys.length&&keys.every(k=>Object.hasOwn(v,k));
  const fields=['source','current_source','duration','position','ready','error'];
  function checked(value){
    if(!exact(value,fields)||![value.source,value.current_source].every(v=>v===null||typeof v==='string')||
       typeof value.duration!=='number'||typeof value.position!=='number'||typeof value.ready!=='boolean'||typeof value.error!=='boolean')throw Error('音檔定位來源不完整');
    return {...value};
  }
  function clock(seconds){
    const ms=Math.round(seconds*1000),pad=(v,n=2)=>String(v).padStart(n,'0');
    const hours=Math.floor(ms/3600000),minutes=Math.floor(ms/60000)%60,second=Math.floor(ms/1000)%60;
    return `${hours?pad(hours)+':':''}${pad(minutes)}:${pad(second)}.${pad(ms%1000,3)}`;
  }
  function present(value){
    const s=checked(value),available=!!s.source&&s.current_source===s.source&&s.ready&&!s.error&&
      Number.isFinite(s.duration)&&s.duration>0&&s.duration<=Number.MAX_SAFE_INTEGER/1000&&
      Number.isFinite(s.position)&&s.position>=0&&s.position<=s.duration;
    const readout=available?`播放位置 ${clock(s.position)} ／ ${clock(s.duration)}`:'尚無可定位音檔';
    return {available,minimum:0,maximum:available?s.duration:0,value:available?s.position:0,ratio:available?s.position/s.duration:0,readout};
  }
  function keyboard(value,key,modifiers={shift:false,alt:false,control:false,meta:false}){
    if(!exact(modifiers,['shift','alt','control','meta'])||!Object.values(modifiers).every(v=>typeof v==='boolean'))throw Error('定位按鍵來源不完整');
    const view=present(value);if(!view.available||modifiers.alt||modifiers.control||modifiers.meta)return null;
    const step=modifiers.shift ? 0.05 : 0.5;
    const target=key==='Home'?0:key==='End'?view.maximum:['ArrowRight','ArrowUp'].includes(key)?view.value+step:
      ['ArrowLeft','ArrowDown'].includes(key)?view.value-step:null;
    return target===null?null:Math.max(0,Math.min(view.maximum,target));
  }
  function pointer(value,x,left,width){
    const view=present(value);if(!view.available||![x,left,width].every(Number.isFinite)||width<=0)return null;
    const ratio=(x-left)/width;if(!Number.isFinite(ratio))return null;
    return Math.max(0,Math.min(1,ratio))*view.maximum;
  }
  function createController({capture,setPosition,onView=()=>{},onError=()=>{}}){
    let disposed=false;
    function refresh(){if(disposed)return null;const view=present(capture());onView({...view});return view;}
    function apply(propose){
      if(disposed)return false;
      try{
        const before=checked(capture());if(disposed)return false;
        const target=propose(before);if(target===null){refresh();return false;}
        const current=checked(capture());
        if(disposed||!present(current).available||['source','current_source','duration'].some(k=>current[k]!==before[k])){refresh();return false;}
        const accepted=setPosition(target);
        if(disposed)return false;
        if(accepted===false)throw Error('播放位置未接受本次定位；請依目前音檔再試');
        const actual=checked(capture());if(disposed)return false;
        const actualView=present(actual);
        if(!actualView.available||['source','current_source','duration'].some(k=>actual[k]!==current[k])||
           Math.abs(actual.position-target)>.001)throw Error('播放位置未核對到本次定位；請依目前音檔再試');
        onView({...actualView});return !disposed;
      }catch(error){if(disposed)return false;try{refresh();}catch{}if(!disposed)onError(error);return false;}
    }
    return {refresh,key:(key,modifiers)=>apply(s=>keyboard(s,key,modifiers)),pointer:(x,left,width)=>apply(s=>pointer(s,x,left,width)),dispose(){disposed=true;}};
  }
  const api=Object.freeze({present,keyboard,pointer,createController});
  if(typeof module==='object'&&module.exports)module.exports=api;else root.MusicWavePosition=api;
})(typeof globalThis==='object'?globalThis:this);
