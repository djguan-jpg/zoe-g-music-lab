// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
 function createAdapter(document,{source,read,onError,onReset}){
  const $=id=>document.getElementById(id);
  const render=s=>{
   $('delivery-reader-content').value=s.page?.text||'';
   $('delivery-reader-first').disabled=!s.canRead||!s.page||s.page.start_byte===0;
   $('delivery-reader-previous').disabled=!s.canPrevious;$('delivery-reader-next').disabled=!s.canNext;
   $('delivery-reader-side').disabled=!source().pending;
   $('delivery-reader-note').textContent=!s.canRead?(source().message||'請先核對選定來源。'):!s.page?'展開後可逐段閱讀原文，下載仍保留全文。':s.page.source_bytes===0?'這是有效的空檔。':`原文 UTF-8 bytes ${s.page.start_byte}–${s.page.end_byte}／${s.page.source_bytes}。`+(s.page.next_byte===null?'已到全文結尾。':'還有後續內容；下一段可接續閱讀。');
  };
  const controller=root.MusicDeliveryText.createReader({source,read,onState:render,onError,onReset});
  function refresh(){const s=controller.refresh();if($('delivery-reader').open&&s.canRead&&!s.page)controller.first();}
  $('delivery-reader').ontoggle=()=>{if($('delivery-reader').open)refresh();};
  $('delivery-reader-side').onchange=refresh;
  $('delivery-reader-first').onclick=()=>controller.first();$('delivery-reader-previous').onclick=()=>controller.previous();$('delivery-reader-next').onclick=()=>controller.next();
  refresh();return {refresh,controller};
 }
 root.MusicDeliveryTextDom={createAdapter};
})(typeof globalThis==='object'?globalThis:this);
