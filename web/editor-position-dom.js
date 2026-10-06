// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
  const P=typeof module==='object'&&module.exports?require('./editor-position.js'):root.MusicEditorPosition;
  const specs=Object.freeze({arrangement:{scope:'music',prefix:'section'},shots:{scope:'storyboard',prefix:'shots'},cues:{scope:'lyrics',prefix:'cues'}});
  function bind(document,{busy,onMove,onError=()=>{}}){
    const get=id=>document.getElementById(id),listeners=[];let disposed=false,active=null;
    function controls(list){const p=specs[list].prefix;return {select:get(p+'-order'),input:get(p+'-position'),button:get(p+'-position-move'),note:get(p+'-position-note')};}
    function allowed(list){const panel=get(specs[list]?.scope),container=get(list);return !disposed&&!!panel&&!!container&&panel.isConnected&&container.isConnected&&!panel.hidden&&!busy();}
    function capture(list){const c=controls(list);return {ids:[...get(list).children].map(r=>r.dataset.historyId),selected:c.select.value,position:c.input.value,visible:allowed(list),busy:busy()};}
    function refresh(){
      if(disposed)return;
      for(const list of P.lists){
        const c=controls(list);try{const v=P.view(list,capture(list));c.input.disabled=!allowed(list)||!v.count;c.button.disabled=!allowed(list)||!v.canMove;c.input.setAttribute('aria-invalid',String(v.invalid));c.note.textContent=v.message;}catch(error){c.button.disabled=true;c.input.setAttribute('aria-invalid','true');c.note.textContent=error.message;}
      }
    }
    function owned(list,target){const c=controls(list);return !!target&&target===document.activeElement&&target.isConnected&&!target.disabled&&!target.hidden&&allowed(list)&&(target===c.button||target===c.input&&!target.readOnly);}
    const controller=P.createController({allowed,capture,moveTarget:plan=>owned(plan.list,active)&&onMove(plan.list,plan.id,plan.index)===true,
      onMoved:plan=>{refresh();const c=controls(plan.list);if(allowed(plan.list)&&c.select.isConnected&&!c.select.disabled&&c.select.value===plan.id&&(document.activeElement===active||document.activeElement===document.body))c.select.focus();},onError});
    function listen(e,type,fn){e.addEventListener(type,fn);listeners.push([e,type,fn]);}
    for(const list of P.lists){const c=controls(list);listen(c.input,'input',refresh);listen(c.select,'change',refresh);listen(c.button,'click',()=>{if(c.button.disabled||!allowed(list))return;active=c.button;try{controller.request(list);}finally{active=null;refresh();}});
      listen(c.input,'keydown',event=>{
        if(event.defaultPrevented||event.target!==c.input||!owned(list,c.input))return;
        const gesture=Object.fromEntries(['key','altKey','ctrlKey','metaKey','shiftKey','repeat','isComposing','keyCode'].map(k=>[k,event[k]]));
        active=c.input;try{controller.enter(list,gesture,()=>{if(!owned(list,active)||event.defaultPrevented)return false;event.preventDefault();return event.defaultPrevented;});}finally{active=null;refresh();}
      });
    }
    return Object.freeze({refresh,dispose(){disposed=true;active=null;controller.dispose();for(const [e,type,fn] of listeners)e.removeEventListener(type,fn);}});
  }
  const api=Object.freeze({bind});if(typeof module==='object'&&module.exports)module.exports=api;else root.MusicEditorPositionDOM=api;
})(typeof globalThis==='object'?globalThis:this);
