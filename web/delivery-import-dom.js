// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
 function createAdapter(document,options){
  const $=id=>document.getElementById(id);let controller,reader=null,searcher=null;
  let originalState={pending:false,canApply:false,names:new Set(),records:new Map(),sha:''};
  const names={added:'新增',changed:'變更',removed:'移除',unchanged:'相同'};
  const showContent=()=>{
   const selected=$('delivery-review-file').value,preview=controller.filePreview(selected);
   const present=originalState.names.has(selected);
   $('delivery-original-download').disabled=!originalState.canApply||!present;
   $('delivery-original-note').textContent=!originalState.pending?'核對ZIP後可下載選定原文，保留目前成果與表單。':!originalState.canApply?'來源已有修改或尚在處理，請重新核對ZIP。':!present?'ZIP沒有這個檔案；不能下載目前成果中的已移除檔。':'下載ZIP中的完整原文，包含預覽未顯示的部分；不載入或取代目前成果。';
   for(const [side,title] of [['before','目前成果'],['incoming','ZIP成果']]){
    const value=preview?.[side];$('delivery-review-'+side).value=value?.text||'';
    const l=value?.lineEndings;
    $('delivery-review-'+side+'-note').textContent=!value?.present?title+'沒有這個檔案':`換行 CRLF ${l.crlf}／LF ${l.lf}／CR ${l.cr}。`+(value.truncated?'內容過長，預覽顯示開頭；載入與下載保留全文。':'完整文字預覽；文字框會統一顯示換行，原文下載保持。');
   }
   reader?.refresh();searcher?.refresh();
  };
  const render=s=>{
   originalState={pending:s.pending,canApply:s.canApply,names:new Set((s.source?.manifest.files||[]).map(f=>f.name)),records:new Map((s.comparison?.files||[]).map(f=>[f.name,f])),sha:s.source?.archive_sha256||''};
   $('delivery-import-file').disabled=!!options.capture().busy;
   $('delivery-import-preview').hidden=!s.pending;
   $('delivery-import-cancel').disabled=!s.reading&&!s.pending&&!s.failure;
   $('delivery-import-cancel').textContent=s.failure?'清除核對訊息':'取消成果匯入';
   $('delivery-import-apply').disabled=!s.canApply;$('delivery-import-undo').disabled=!s.canUndo;
   $('delivery-report-json').disabled=!s.canApply;$('delivery-report-md').disabled=!s.canApply;
   const note=s.failure?`ZIP核對未完成：${s.failure.message}\n目前成果與表單保留。修正後重新選檔核對，或清除這則訊息。`:s.reading?'正在核對選定ZIP；目前表單與成果保留。':s.pending?(s.canApply?'雜湊與清單核對通過；確認後只替換本工作台成果。':'目標已有修改，請重新選檔核對。'):'選取本工具交付ZIP，先核對，再明確載入成果；表單與音檔保持。';
   const noteClass=s.failure?'hint error':'hint';
   if($('delivery-import-note').textContent!==note)$('delivery-import-note').textContent=note;
   if($('delivery-import-note').className!==noteClass)$('delivery-import-note').className=noteClass;
   const list=$('delivery-import-files');list.replaceChildren();
   const select=$('delivery-review-file'),old=select.value;select.replaceChildren();select.disabled=!s.comparison;
   $('delivery-review-summary').textContent='';
   if(s.source){const d=s.source,m=d.manifest;$('delivery-import-source').textContent=`${m.scope} · 工具${m.tool_version} · ${m.file_count}個文字檔 · ${d.archive_bytes} bytes\n${m.label}\nZIP SHA-256 ${d.archive_sha256}`;
    for(const f of m.files){const li=document.createElement('li');li.textContent=`${f.name} · ${f.bytes} bytes · SHA-256 ${f.sha256}`;list.append(li);}}
   if(s.comparison){const c=s.comparison.counts;$('delivery-review-summary').textContent=`比較目前成果：新增${c.added}／變更${c.changed}／移除${c.removed}／相同${c.unchanged}。載入會取代本工作台全部成果。`;
    for(const f of s.comparison.files){const option=document.createElement('option');option.value=f.name;option.textContent=`${f.name} · ${names[f.status]}`;select.append(option);}
    select.value=s.comparison.files.some(f=>f.name===old)?old:(s.comparison.files.find(f=>f.status==='changed')||s.comparison.files.find(f=>f.status==='added')||s.comparison.files.find(f=>f.status==='removed')||s.comparison.files[0])?.name||'';
   }
   showContent();
  };
  controller=root.MusicDeliveryImport.createController({...options,onState:undefined,onView:render});
  const originalSource=()=>{const name=$('delivery-review-file').value,side=$('delivery-reader-side').value,record=originalState.records.get(name)?.[side];return {key:[originalState.sha,name,side,record?.sha256||''].join('|'),canRead:originalState.canApply&&!!record,pending:originalState.pending,message:!originalState.pending?'核對ZIP後可逐段閱讀原文。':!originalState.canApply?'來源已有修改，請重新核對ZIP。':'所選來源沒有這個檔案；空檔會另行標示。'};};
  reader=root.MusicDeliveryTextDom.createAdapter(document,{source:originalSource,
   read:start=>controller.textWindow($('delivery-review-file').value,$('delivery-reader-side').value,start),onError:options.onError,onReset:()=>controller.clearTextWindow()
  });
  searcher=root.MusicDeliverySearchDom.createAdapter(document,{source:originalSource,
   read:request=>controller.textSearch($('delivery-review-file').value,$('delivery-reader-side').value,request),
   onSelect:start=>reader.controller.seek(start),onError:options.onError
  });
  $('delivery-reader-side').onchange=()=>{reader.refresh();searcher.refresh();};
  $('delivery-import-file').onchange=event=>{const file=event.target.files[0];event.target.value='';if(file)controller.inspect(file);};
  $('delivery-import-apply').onclick=()=>controller.apply();$('delivery-import-cancel').onclick=()=>controller.cancel();$('delivery-import-undo').onclick=()=>controller.undo();
  $('delivery-review-file').onchange=showContent;
  $('delivery-original-download').onclick=()=>{try{const file=controller.originalFile($('delivery-review-file').value);if(!file)return false;if(options.downloadText(file.name,file.content)!==true)throw Error('原文下載未送出');$('delivery-original-note').textContent='已送出ZIP原文下載，請核對保存的檔案；目前成果與表單保持。';return true;}catch(error){options.onError?.(error);return false;}};
  for(const [id,name] of [['delivery-report-json','delivery-comparison.json'],['delivery-report-md','delivery-comparison.md']]){
   $(id).onclick=()=>{try{const files=controller.report();if(!files)return false;if(options.downloadText(name,files[name])!==true)throw Error('報告下載未送出');return true;}catch(error){options.onError?.(error);return false;}};
  }
  controller.refreshView();return {...controller,refresh:controller.refreshView};
 }
 root.MusicDeliveryImportDom={createAdapter};
})(typeof globalThis==='object'?globalThis:this);
