// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
  const Raw=typeof module==='object'&&module.exports?require('./raw-fields.js'):root.MusicRawFields;
  function createAdapter(document){
    let sequence=0;
    const notes=new WeakMap(),bound=new WeakSet();
    function describe(control,id,add){
      const ids=(control.getAttribute('aria-describedby')||'').split(/\s+/).filter(Boolean).filter(x=>x!==id);
      if(add)ids.push(id);
      if(ids.length)control.setAttribute('aria-describedby',ids.join(' '));else control.removeAttribute('aria-describedby');
    }
    const controller=Raw.createController({read:control=>control.value,write:(control,value)=>{control.value=value;},
      onState:(control,{escaped})=>{
        const old=notes.get(control);if(old){describe(control,old.id,false);old.remove();notes.delete(control);}
        if(escaped){
          const note=document.createElement('span');note.id=`raw-value-note-${++sequence}`;note.className='raw-value-note';
          note.textContent='原值含特殊字元，已完整保留；以可見符號顯示，修改後使用新輸入。';
          control.insertAdjacentElement('afterend',note);describe(control,note.id,true);notes.set(control,note);
        }
      }});
    function write(control,value){
      const source=String(value??'');
      if(control.tagName==='SELECT'){
        control.querySelectorAll('[data-raw-option]').forEach(option=>option.remove());
        if(![...control.options].some(option=>option.value===source)){
          const option=document.createElement('option');option.value=source;option.dataset.rawOption='true';
          option.textContent=source?`原值需核對：${JSON.stringify(source).slice(1,-1)}`:'尚未選擇';control.append(option);
        }
      }
      controller.bind(control,source);
      if(!bound.has(control)){bound.add(control);control.addEventListener('input',()=>controller.edited(control),{capture:true});}
    }
    return {read:control=>controller.capture(control),write};
  }
  if(typeof module==='object'&&module.exports)module.exports={createAdapter};else root.MusicRawFieldsDom={createAdapter};
})(typeof globalThis==='object'?globalThis:this);
