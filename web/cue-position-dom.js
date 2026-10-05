// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
  const node=typeof module==='object'&&module.exports;
  const C=node?require('./cue-position.js'):root.MusicCuePosition,W=node?require('./wave-position.js'):root.MusicWavePosition;
  function bind({container,targets,readRow,captureMedia,isAllowed,setPosition,onSeek=()=>{},onError=()=>{}}){
    let disposed=false,context=null;
    const controller=C.createController({readRow,captureMedia,isAllowed,setPosition,onSeek,onError});
    function refresh({force=false}={}){
      if(disposed)return;
      let media,allowed,signature;
      try{media={...captureMedia()};allowed=isAllowed()===true;const view=W.present(media);
        signature=[allowed,view.available,...(view.available?[media.source,media.current_source,media.duration]:[])];
      }catch{allowed=false;signature=[false,false];}
      if(!force&&context&&signature.length===context.length&&signature.every((v,i)=>Object.is(v,context[i])))return;
      context=signature;
      for(const {button,row} of targets()){
        let enabled=false;try{enabled=allowed&&C.target(row,media)!==null;}catch{}
        button.disabled=!enabled;
      }
    }
    const click=event=>{const button=event.target.closest('[data-cue-seek]');if(!button||!container.contains(button)||button.disabled)return;
      controller.seek(button.dataset.cueSeek);refresh();};
    const input=()=>refresh({force:true});container.addEventListener('click',click);container.addEventListener('input',input);refresh({force:true});
    return {refresh,seek:controller.seek,dispose(){disposed=true;container.removeEventListener('click',click);container.removeEventListener('input',input);controller.dispose();}};
  }
  const api=Object.freeze({bind});if(node)module.exports=api;else root.MusicCuePositionDOM=api;
})(typeof globalThis==='object'?globalThis:this);
