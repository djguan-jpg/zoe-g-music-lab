// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
  const P=typeof module==='object'&&module.exports?require('./editor-focus.js'):root.MusicEditorFocus;
  const specs=Object.freeze({arrangement:{panel:'music',add:'section-add'},'music-avoid':{panel:'music',add:'avoid-add'},
    'music-deliverables':{panel:'music',add:'deliverable-add'},motifs:{panel:'storyboard',add:'motif-add'},
    shots:{panel:'storyboard',add:'shot-add'},cues:{panel:'lyrics',add:'cue-add'}});
  function createAdapter(document,{busy=()=>false,onError=()=>{}}={}){
    const get=id=>document.getElementById(id);
    function available(list){const spec=specs[list],panel=spec&&get(spec.panel),container=spec&&get(list);return !!panel&&!!container&&panel.isConnected&&container.isConnected&&!panel.hidden;}
    return P.createController({onError,capture:list=>({ids:[...(get(list)?.children||[])].map(row=>row.dataset.historyId),visible:available(list),busy:busy()}),
      focusTarget:({list,id,mode})=>{
        if(!available(list)||busy())return false;
        const container=get(list),row=id===null?null:[...container.children].find(r=>r.dataset.historyId===id);
        if(id!==null&&!row)return false;
        const target=mode==='add'?get(specs[list].add):list==='shots'?row.querySelector(mode==='new'?'[data-key="motif_id"]':'summary'):
          list==='cues'&&mode==='new'?row.querySelector('.lyric-field'):row.querySelector('input,textarea');
        if(!target||!target.isConnected||target.disabled||target.hidden||(mode==='add'?!get(specs[list].panel).contains(target):!row.contains(target)))return false;
        if(list==='shots'&&row){const details=row.querySelector('details');if(!details)return false;details.open=true;}
        target.focus();return document.activeElement===target;
      }});
  }
  const api=Object.freeze({createAdapter});if(typeof module==='object'&&module.exports)module.exports=api;else root.MusicEditorFocusDOM=api;
})(typeof globalThis==='object'?globalThis:this);
