// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root,factory){const api=factory(typeof module==='object'&&module.exports?require('./delivery-navigation.js'):root.MusicDeliveryNavigation);if(typeof module==='object'&&module.exports)module.exports=api;else root.MusicDeliveryNavigationDom=api;})(typeof globalThis!=='undefined'?globalThis:this,N=>{
  function createAdapter(document,capture){
    const controls=Object.fromEntries(['music','storyboard','lyrics','audio'].map(scope=>[scope,document.getElementById(scope+'-delivery-view')]));
    const buildIds={music:'music-build',storyboard:'mv-build',lyrics:'lyrics-build',audio:'audio-build'};
    const back=document.getElementById('delivery-back'),output=document.getElementById('output-region'),heading=document.getElementById('output-heading');
    function move(target,block){if(!target||target.disabled)return false;target.scrollIntoView({block,behavior:'auto'});target.focus({preventScroll:true});return true;}
    const controller=N.createController({capture,
      render:model=>{
        for(const [scope,button] of Object.entries(controls)){
          button.disabled=scope!==model.scope||!model.canView;
          if(scope===model.scope){button.textContent=model.button;const note=document.getElementById(scope+'-delivery-status');note.textContent=model.note;note.classList.toggle('error',model.error);}
        }
        back.disabled=!model.canReturn;back.textContent=model.returnLabel;
      },
      goOutput:()=>{output.scrollTop=0;return move(heading,'start');},
      goEditor:scope=>move(document.querySelector?.('[data-delivery-panel="'+(scope==='music'?'storyboard':scope)+'"]')||(controls[scope].disabled?document.getElementById(buildIds[scope]):controls[scope]),'center')
    });
    for(const [scope,button] of Object.entries(controls))button.onclick=()=>controller.show(scope);
    back.onclick=()=>controller.back();controller.refresh();return controller;
  }
  return {createAdapter};
});
