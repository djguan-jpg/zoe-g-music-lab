// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
  const A=typeof module==='object'&&module.exports?require('./cue-audition.js'):root.MusicCueAudition;
  function bind({start,stop,note,selection,container,player,capture,events,onError=()=>{}}){
    let disposed=false;
    const sameSource=expected=>{const now=capture().media;return ['source','current_source','duration'].every(k=>now[k]===expected[k]);};
    const controller=A.createController({capture,
      setPosition:(seconds,expected)=>{if(!sameSource(expected))return false;player.currentTime=seconds;},
      play:expected=>{if(!sameSource(expected))return false;return player.play();},
      pause:expected=>{if(!sameSource(expected))return false;player.pause();},
      onView:view=>{start.disabled=!view.canStart;stop.disabled=!view.canStop;note.textContent=view.text;},onError});
    const refresh=()=>{if(!disposed)controller.refresh();},begin=()=>{if(!disposed)void controller.start();},end=()=>{if(!disposed)controller.stop();};
    const types=['timeupdate','seeked','pause','playing','loadedmetadata','loadstart','emptied','durationchange','error'];
    function dispose(){if(disposed)return true;const confirmed=controller.dispose();disposed=true;start.disabled=stop.disabled=true;start.removeEventListener('click',begin);stop.removeEventListener('click',end);selection.removeEventListener('change',refresh);for(const type of ['input','focusin'])container.removeEventListener(type,refresh);for(const type of types)player.removeEventListener(type,refresh);events?.removeEventListener('pagehide',dispose);return confirmed;}
    start.addEventListener('click',begin);stop.addEventListener('click',end);selection.addEventListener('change',refresh);for(const type of ['input','focusin'])container.addEventListener(type,refresh);for(const type of types)player.addEventListener(type,refresh);events?.addEventListener('pagehide',dispose);refresh();
    return {refresh,dispose};
  }
  const api=Object.freeze({bind});if(typeof module==='object'&&module.exports)module.exports=api;else root.MusicCueAuditionDOM=api;
})(typeof globalThis==='object'?globalThis:this);
