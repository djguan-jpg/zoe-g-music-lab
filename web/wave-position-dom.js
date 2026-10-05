// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
  const P=typeof module==='object'&&module.exports?require('./wave-position.js'):root.MusicWavePosition;
  function bind({canvas,readout,capture,setPosition,onSeek=()=>{},onError=()=>{}}){
    const controller=P.createController({capture,setPosition,onError,onView:view=>{
      canvas.setAttribute('aria-valuemin',String(view.minimum));canvas.setAttribute('aria-valuemax',String(view.maximum));
      canvas.setAttribute('aria-valuenow',String(view.value));canvas.setAttribute('aria-valuetext',view.readout);
      canvas.setAttribute('aria-disabled',String(!view.available));canvas.tabIndex=view.available?0:-1;
      canvas.dataset.waveAvailable=String(view.available);readout.textContent=view.readout;
    }});
    const click=event=>{const r=canvas.getBoundingClientRect();if(controller.pointer(event.clientX,r.left,r.width)){canvas.focus();onSeek();}};
    const key=event=>{if(controller.key(event.key,{shift:event.shiftKey,alt:event.altKey,control:event.ctrlKey,meta:event.metaKey})){event.preventDefault();onSeek();}};
    canvas.addEventListener('click',click);canvas.addEventListener('keydown',key);controller.refresh();
    return {refresh:controller.refresh,dispose(){canvas.removeEventListener('click',click);canvas.removeEventListener('keydown',key);controller.dispose();}};
  }
  const api=Object.freeze({bind});if(typeof module==='object'&&module.exports)module.exports=api;else root.MusicWavePositionDOM=api;
})(typeof globalThis==='object'?globalThis:this);
