// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
 function createAdapter(document,options){
  const $=id=>document.getElementById(id);let controller;
  const render=s=>{
   $('delivery-import-file').disabled=!!options.capture().busy;
   $('delivery-import-preview').hidden=!s.pending;
   $('delivery-import-cancel').disabled=!s.reading&&!s.pending;
   $('delivery-import-apply').disabled=!s.canApply;$('delivery-import-undo').disabled=!s.canUndo;
   $('delivery-import-note').textContent=s.reading?'正在核對選定ZIP；目前表單與成果保留。':s.pending?(s.canApply?'雜湊與清單核對通過；確認後只替換本工作台成果。':'目標已有修改，請重新選檔核對。'):'選取本工具交付ZIP，先核對，再明確載入成果；表單與音檔保持。';
   const list=$('delivery-import-files');list.replaceChildren();
   if(s.proposal){const d=s.proposal.data,m=d.manifest;$('delivery-import-source').textContent=`${m.scope} · 工具${m.tool_version} · ${m.file_count}個文字檔 · ${d.archive_bytes} bytes\n${m.label}\nZIP SHA-256 ${d.archive_sha256}`;
    for(const f of m.files){const li=document.createElement('li');li.textContent=`${f.name} · ${f.bytes} bytes · SHA-256 ${f.sha256}`;list.append(li);}}
  };
  controller=root.MusicDeliveryImport.createController({...options,onState:render});
  $('delivery-import-file').onchange=event=>{const file=event.target.files[0];event.target.value='';if(file)controller.inspect(file);};
  $('delivery-import-apply').onclick=()=>controller.apply();$('delivery-import-cancel').onclick=()=>controller.cancel();$('delivery-import-undo').onclick=()=>controller.undo();
  controller.refresh();return controller;
 }
 root.MusicDeliveryImportDom={createAdapter};
})(typeof globalThis==='object'?globalThis:this);
