// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
 function createAdapter(document,options){
  const $=id=>document.getElementById(id);let controller;
  const names={added:'新增',changed:'變更',removed:'移除',unchanged:'相同'};
  const showContent=()=>{
   const preview=controller.filePreview($('delivery-review-file').value);
   for(const [side,title] of [['before','目前成果'],['incoming','ZIP成果']]){
    const value=preview?.[side];$('delivery-review-'+side).value=value?.text||'';
    const l=value?.lineEndings;
    $('delivery-review-'+side+'-note').textContent=!value?.present?title+'沒有這個檔案':`換行 CRLF ${l.crlf}／LF ${l.lf}／CR ${l.cr}。`+(value.truncated?'內容過長，預覽顯示開頭；載入與下載保留全文。':'完整文字預覽；文字框會統一顯示換行，原文下載保持。');
   }
  };
  const render=s=>{
   $('delivery-import-file').disabled=!!options.capture().busy;
   $('delivery-import-preview').hidden=!s.pending;
   $('delivery-import-cancel').disabled=!s.reading&&!s.pending;
   $('delivery-import-apply').disabled=!s.canApply;$('delivery-import-undo').disabled=!s.canUndo;
   $('delivery-report-json').disabled=!s.canApply;$('delivery-report-md').disabled=!s.canApply;
   if(!s.canApply){$('delivery-report-name').value='';$('delivery-report-content').value='';}
   $('delivery-import-note').textContent=s.reading?'正在核對選定ZIP；目前表單與成果保留。':s.pending?(s.canApply?'雜湊與清單核對通過；確認後只替換本工作台成果。':'目標已有修改，請重新選檔核對。'):'選取本工具交付ZIP，先核對，再明確載入成果；表單與音檔保持。';
   const list=$('delivery-import-files');list.replaceChildren();
   const select=$('delivery-review-file'),old=select.value;select.replaceChildren();select.disabled=!s.comparison;
   $('delivery-review-summary').textContent='';
   if(s.proposal){const d=s.proposal.data,m=d.manifest;$('delivery-import-source').textContent=`${m.scope} · 工具${m.tool_version} · ${m.file_count}個文字檔 · ${d.archive_bytes} bytes\n${m.label}\nZIP SHA-256 ${d.archive_sha256}`;
    for(const f of m.files){const li=document.createElement('li');li.textContent=`${f.name} · ${f.bytes} bytes · SHA-256 ${f.sha256}`;list.append(li);}}
   if(s.comparison){const c=s.comparison.counts;$('delivery-review-summary').textContent=`比較目前成果：新增${c.added}／變更${c.changed}／移除${c.removed}／相同${c.unchanged}。載入會取代本工作台全部成果。`;
    for(const f of s.comparison.files){const option=document.createElement('option');option.value=f.name;option.textContent=`${f.name} · ${names[f.status]}`;select.append(option);}
    select.value=s.comparison.files.some(f=>f.name===old)?old:(s.comparison.files.find(f=>f.status==='changed')||s.comparison.files.find(f=>f.status==='added')||s.comparison.files.find(f=>f.status==='removed')||s.comparison.files[0])?.name||'';
   }
   showContent();
  };
  controller=root.MusicDeliveryImport.createController({...options,onState:render});
  $('delivery-import-file').onchange=event=>{const file=event.target.files[0];event.target.value='';if(file)controller.inspect(file);};
  $('delivery-import-apply').onclick=()=>controller.apply();$('delivery-import-cancel').onclick=()=>controller.cancel();$('delivery-import-undo').onclick=()=>controller.undo();
  $('delivery-review-file').onchange=showContent;
  for(const [id,name] of [['delivery-report-json','delivery-comparison.json'],['delivery-report-md','delivery-comparison.md']]){
   $(id).onclick=()=>{try{const files=controller.report();if(!files)return false;$('delivery-report-name').value=name;$('delivery-report-content').value=JSON.stringify(files[name]);$('delivery-report-form').submit();return true;}catch(error){options.onError?.(error);return false;}};
  }
  controller.refresh();return controller;
 }
 root.MusicDeliveryImportDom={createAdapter};
})(typeof globalThis==='object'?globalThis:this);
