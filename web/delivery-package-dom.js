// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
  function createAdapter(document,{capture,run,request,discard,say}){
    const $=id=>document.getElementById(id),model=root.MusicDeliveryPackage,button=$('delivery-package-download'),form=$('delivery-package-form');
    function refresh(){const state=model.describe(capture());button.disabled=!state.canExport;button.textContent=state.label;$('delivery-package-note').textContent=state.note;return state;}
    button.onclick=()=>{if(!refresh().canExport)return;return run(button,isCurrent=>model.inspect({selected:capture,isCurrent,request,discard,
      onDownload:reply=>{form.action=reply.download_url;form.submit();say(`本輪 ${reply.manifest.file_count} 個文字檔的 ZIP 已送出下載；請核對本機檔案與清單。`);}}));};
    refresh();return {refresh};
  }
  root.MusicDeliveryPackageDom={createAdapter};
})(typeof globalThis==='object'?globalThis:this);
