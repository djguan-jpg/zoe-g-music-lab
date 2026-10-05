// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
  const P=typeof module==='object'&&module.exports?require('./editor-order.js'):root.MusicEditorOrder;
  const scopes=Object.freeze({shots:'storyboard',cues:'lyrics'}),labels=Object.freeze({shots:'鏡頭',cues:'歌詞'});
  function bind(document,{busy,capture,apply,focusRow,readCaption=(list,row)=>list==='shots'?row.querySelector('[data-key="section"]')?.value||row.querySelector('[data-key="purpose"]')?.value||'':row.querySelector('.lyric-field')?.value||'',onChanged=()=>{},onError=()=>{}}){
    const get=id=>document.getElementById(id),listeners=[],options=new Map();let disposed=false;
    function caption(list,row,index){return `${index+1} · ${Array.from(readCaption(list,row).replace(/\s+/g,' ').trim()).slice(0,24).join('')||'未填內容'}`;}
    function selectionButtons(list,m,index){const blocked=!m.visible||m.busy;get(list+'-earlier').disabled=blocked||index<=0;get(list+'-later').disabled=blocked||index<0||index>=m.ids.length-1;get(list+'-order-show').disabled=blocked||index<0;}
    function meta(list){const container=get(list),panel=get(scopes[list]);return {ids:[...container.children].map(r=>r.dataset.historyId),visible:container.isConnected&&panel.isConnected&&!panel.hidden,busy:busy()};}
    function allowed(list){const m=meta(list);return m.visible&&!m.busy;}
    const controller=P.createController({allowed,capture:list=>({entries:capture(list),visible:meta(list).visible,busy:busy()}),apply,onError});
    function refresh(){
      if(disposed)return;
      for(const list of P.lists){
        const m=meta(list),view=controller.refresh(list,m),select=get(list+'-order'),selected=select.value,rows=[...get(list).children];
        let saved=options.get(list);
        if(!saved||saved.ids.length!==m.ids.length||saved.ids.some((id,i)=>id!==m.ids[i])){select.replaceChildren();saved={ids:[...m.ids],byId:new Map()};rows.forEach(row=>{const option=document.createElement('option');option.value=row.dataset.historyId;select.append(option);saved.byId.set(option.value,option);});options.set(list,saved);if(!rows.length){const option=document.createElement('option');option.value='';option.textContent='尚無'+labels[list];select.append(option);}}
        rows.forEach((row,i)=>{const option=saved.byId.get(row.dataset.historyId),text=caption(list,row,i);if(option.textContent!==text)option.textContent=text;});
        if(m.ids.includes(selected))select.value=selected;
        const index=m.ids.indexOf(select.value),blocked=!m.visible||m.busy;
        select.disabled=blocked||!rows.length;selectionButtons(list,m,index);get(list+'-order-undo').disabled=!view.canUndo;
        rows.forEach(row=>row.toggleAttribute('data-order-selected',row.dataset.historyId===select.value));
        get(list+'-order-note').textContent=view.stale?'列或順序已改動，先前移動不可撤回；目前編修保留。':view.record?`${labels[list]} ${view.record.from+1} → ${view.record.to+1}；可撤回最近一次移動，後續欄位編修保留。`:'選擇一列再移動；原時間與創作欄位一起保留。';
      }
    }
    function listen(element,type,fn){element.addEventListener(type,fn);listeners.push([element,type,fn]);}
    for(const list of P.lists){
      listen(get(list+'-order'),'change',refresh);for(const type of ['input','change'])listen(get(list),type,event=>{if(disposed)return;const row=event.target?.closest('[data-history-id]'),saved=options.get(list);if(row?.parentElement!==get(list)||!saved)return;const option=saved.byId.get(row.dataset.historyId),index=saved.ids.indexOf(row.dataset.historyId);if(option&&index>=0)option.textContent=caption(list,row,index);});
      for(const [suffix,delta] of [['earlier',-1],['later',1],['order-undo',0]]){
        const button=get(list+'-'+suffix);listen(button,'click',()=>{if(button.disabled||!allowed(list))return;const result=delta?controller.move(list,get(list+'-order').value,delta):controller.undo(list);refresh();if(!result)return;get(list+'-order').value=result.id;refresh();const target=button.disabled?get(list+'-order'):button;if(target.isConnected&&!target.disabled)target.focus();onChanged(list,result,delta===0);});
      }
      const show=get(list+'-order-show');listen(show,'click',()=>{if(show.disabled||!allowed(list))return;const m=meta(list),index=m.ids.indexOf(get(list+'-order').value);if(index>=0)focusRow(list,index);});
    }
    return Object.freeze({refresh,select(list,id){
      if(disposed||!P.lists.includes(list)||!allowed(list))return false;
      const m=meta(list),index=m.ids.indexOf(id);if(index<0)return false;
      const saved=options.get(list);if(!saved||saved.ids.length!==m.ids.length||saved.ids.some((v,i)=>v!==m.ids[i]))refresh();
      const select=get(list+'-order'),old=m.ids.indexOf(select.value),rows=get(list).children;
      select.value=id;if(select.value!==id)return false;
      if(old>=0)rows[old].toggleAttribute('data-order-selected',false);rows[index].toggleAttribute('data-order-selected',true);selectionButtons(list,m,index);return true;
    },clear(list){controller.clear(list);},dispose(){disposed=true;controller.dispose();for(const [element,type,fn] of listeners)element.removeEventListener(type,fn);}});
  }
  const api=Object.freeze({bind});if(typeof module==='object'&&module.exports)module.exports=api;else root.MusicEditorOrderDOM=api;
})(typeof globalThis==='object'?globalThis:this);
