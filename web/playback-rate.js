// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
  const P=typeof module==='object'&&module.exports?require('./wave-position.js'):root.MusicWavePosition;
  const choices=Object.freeze(['0.5','0.75','1','1.25','1.5','2']);
  const exact=(v,keys)=>v&&typeof v==='object'&&!Array.isArray(v)&&Object.keys(v).length===keys.length&&keys.every(k=>Object.hasOwn(v,k));
  function checked(value){
    if(!exact(value,['media','rate','busy','visible'])||typeof value.rate!=='number'||typeof value.busy!=='boolean'||typeof value.visible!=='boolean')throw Error('播放速度來源不完整');
    P.present(value.media);return {...value,media:{...value.media}};
  }
  function present(value){
    const s=checked(value),available=P.present(s.media).available&&Number.isFinite(s.rate)&&s.rate>0;
    return {enabled:available&&!s.busy&&s.visible,selected:available&&choices.includes(String(s.rate))?String(s.rate):'',
      text:!available?'先載入可定位的音檔，再選擇播放速度。':`目前播放速度 ${s.rate} 倍；標記仍使用音檔實際秒數。`};
  }
  const sameSource=(a,b)=>['source','current_source','duration'].every(k=>a.media[k]===b.media[k]);
  function createController({capture,setRate,onView=()=>{},onError=()=>{}}){
    let disposed=false,writing=false;
    function refresh(){if(disposed)return null;const view=present(capture());if(disposed)return null;onView({...view,enabled:view.enabled&&!writing});return view;}
    function choose(value){
      if(disposed||writing)return false;
      try{
        if(!choices.includes(value))throw Error('請選擇清單中的播放速度');
        const before=checked(capture());if(disposed||!present(before).enabled){refresh();return false;}
        const now=checked(capture());
        if(disposed)return false;
        if(!present(now).enabled||!sameSource(before,now)||before.rate!==now.rate)throw Error('音檔或播放速度已變更；請依目前音檔再選擇');
        const target=Number(value);if(now.rate===target){refresh();return {changed:false,rate:target};}
        writing=true;const accepted=setRate(target,{...now.media});
        if(disposed)return false;
        const after=checked(capture());if(disposed)return false;
        if(accepted===false||!present(after).enabled||!sameSource(now,after)||after.rate!==target)throw Error('播放速度未接受或未核對到本次選擇；請核對播放器後再試');
        writing=false;onView(present(after));return disposed?false:{changed:true,rate:after.rate};
      }catch(error){if(disposed)return false;writing=false;try{refresh();}catch{}if(!disposed)onError(error);return false;}
      finally{writing=false;}
    }
    return {refresh,choose,dispose(){disposed=true;}};
  }
  const api=Object.freeze({choices,present,createController});
  if(typeof module==='object'&&module.exports)module.exports=api;else root.MusicPlaybackRate=api;
})(typeof globalThis==='object'?globalThis:this);
