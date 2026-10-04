// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
 function createAdapter(document,options){
  const $=id=>document.getElementById(id);
  const render=s=>{
   $('delivery-search-query').disabled=!s.canRead;$('delivery-search-find').disabled=!s.canRead;
   $('delivery-search-more').disabled=!s.canRead||!s.batch||s.batch.next_byte===null;
   const select=$('delivery-search-match');select.replaceChildren();select.disabled=!s.canRead||!s.batch?.matches.length;
   const prompt=document.createElement('option');prompt.value='';prompt.textContent='選擇命中位置';select.append(prompt);
   for(const [i,m] of (s.batch?.matches||[]).entries()){const option=document.createElement('option');option.value=String(i);option.textContent=`第${s.offset+i+1}筆 · UTF-8 bytes ${m.start_byte}–${m.end_byte}`;select.append(option);}
   select.value=s.selected<0?'':String(s.selected);
   $('delivery-search-note').textContent=!s.canRead?(options.source().message||'請先核對原文。'):!s.batch?'輸入原文中的字，按尋找；完全比對大小寫，不使用正規表示式。':s.batch.source_bytes===0?'這是有效的空檔，沒有搜尋結果。':!s.batch.matches.length?'沒有找到這段文字。':`本批${s.batch.matches.length}筆，選擇結果即可跳到原文。`+(s.batch.next_byte===null?'已搜尋到全文結尾。':'還有結果，可讀下一批。');
  };
  const controller=root.MusicDeliverySearch.createSearcher({...options,onState:render});
  $('delivery-search-query').oninput=e=>controller.setQuery(e.target.value);
  $('delivery-search-query').onkeydown=e=>{if(e.key==='Enter'&&!e.isComposing){e.preventDefault();controller.setQuery(e.target.value);controller.find();}};
  $('delivery-search-find').onclick=()=>{controller.setQuery($('delivery-search-query').value);return controller.find();};
  $('delivery-search-more').onclick=()=>controller.more();
  $('delivery-search-match').onchange=e=>e.target.value===''?false:controller.select(Number(e.target.value));
  controller.refresh();return {controller,refresh:()=>controller.refresh()};
 }
 root.MusicDeliverySearchDom={createAdapter};
})(typeof globalThis==='object'?globalThis:this);
