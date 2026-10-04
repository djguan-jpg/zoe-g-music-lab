// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
 function createAdapter(document,options){
  const $=id=>document.getElementById(id);
  const render=s=>{
   $('delivery-search-query').disabled=!s.canRead;$('delivery-search-find').disabled=!s.canRead;
   $('delivery-search-more').disabled=!s.canRead||!s.batch||s.batch.next_byte===null;
   $('delivery-search-previous').disabled=!s.canPrevious;
   const select=$('delivery-search-match');select.replaceChildren();select.disabled=!s.canRead||!s.batch?.matches.length;
   const prompt=document.createElement('option');prompt.value='';prompt.textContent='選擇命中位置';select.append(prompt);
   for(const [i,m] of (s.batch?.matches||[]).entries()){const option=document.createElement('option');option.value=String(i);option.textContent=root.MusicDeliveryContext.label(s.batch.context.items[i],s.query,s.offset+i+1,s.batch.source_bytes);select.append(option);}
   select.value=s.selected<0?'':String(s.selected);
   const selected=s.batch?.context.items[s.selected];$('delivery-search-context-box').hidden=!selected;
   $('delivery-search-context').value=selected?.text||'';
   $('delivery-search-note').textContent=!s.canRead?(options.source().message||'請先核對原文。'):!s.batch?'輸入原文中的字，按尋找；完全比對大小寫，不使用正規表示式。':s.batch.source_bytes===0?'這是有效的空檔，沒有搜尋結果。':!s.batch.matches.length?'沒有找到這段文字。':`第${s.offset+1}–${s.offset+s.batch.matches.length}筆（本批${s.batch.matches.length}筆），選擇結果即可跳到原文。`+(s.batch.next_byte===null?'已搜尋到全文結尾。':'還有結果，可讀下一批。')+(s.historyLimited?'只保留最近512批返回位置；重新尋找可回全文開頭。':'');
  };
  const controller=root.MusicDeliverySearch.createSearcher({...options,includeContext:true,onState:render});
  $('delivery-search-query').oninput=e=>controller.setQuery(e.target.value);
  $('delivery-search-query').onkeydown=e=>{if(e.key==='Enter'&&!e.isComposing){e.preventDefault();controller.setQuery(e.target.value);controller.find();}};
  $('delivery-search-find').onclick=()=>{controller.setQuery($('delivery-search-query').value);return controller.find();};
  const move=(action,id,other)=>{const ok=action();if(ok&&$(id).disabled&&!$(other).disabled)$(other).focus?.();return ok;};
  $('delivery-search-more').onclick=()=>move(()=>controller.more(),'delivery-search-more','delivery-search-previous');
  $('delivery-search-previous').onclick=()=>move(()=>controller.previous(),'delivery-search-previous','delivery-search-more');
  $('delivery-search-match').onchange=e=>e.target.value===''?false:controller.select(Number(e.target.value));
  controller.refresh();return {controller,refresh:()=>controller.refresh()};
 }
 root.MusicDeliverySearchDom={createAdapter};
})(typeof globalThis==='object'?globalThis:this);
