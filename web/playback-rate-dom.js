// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
  const R=typeof module==='object'&&module.exports?require('./playback-rate.js'):root.MusicPlaybackRate;
  function bind({select,note,player,capture,events,onError=()=>{}}){
    let disposed=false;
    const controller=R.createController({capture,setRate:rate=>{player.playbackRate=rate;},
      onView:view=>{select.disabled=!view.enabled;select.value=view.selected;note.textContent=view.text;},onError});
    const refresh=()=>{if(!disposed)controller.refresh();};
    const change=()=>{if(!disposed)controller.choose(select.value);};
    const types=['loadedmetadata','ratechange','emptied','loadstart','durationchange','error'];
    function dispose(){if(disposed)return;disposed=true;controller.dispose();select.disabled=true;select.removeEventListener('change',change);for(const type of types)player.removeEventListener(type,refresh);events?.removeEventListener('pagehide',dispose);}
    select.addEventListener('change',change);for(const type of types)player.addEventListener(type,refresh);events?.addEventListener('pagehide',dispose);refresh();
    return {refresh,dispose};
  }
  const api=Object.freeze({bind});if(typeof module==='object'&&module.exports)module.exports=api;else root.MusicPlaybackRateDOM=api;
})(typeof globalThis==='object'?globalThis:this);
