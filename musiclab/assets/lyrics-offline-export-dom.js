// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
  function createPresenter(document,locate){
    const box=document.getElementById('lyrics-export-box'),summary=document.getElementById('lyrics-export-status'),list=document.getElementById('lyrics-export-issues'),notes=document.getElementById('lyrics-export-notes');
    function render(view){
      box.dataset.stale=String(view.stale);list.replaceChildren();notes.replaceChildren();
      summary.textContent=view.stale?'目前表格已編修；套用編修後更新格式提醒，舊定位已停用。':`共 ${view.cue_count} 句 · 格式提醒 ${view.issue_count} 項。完整 JSON 保存全部歌詞包資料。`;
      view.issues.forEach((issue,i)=>{const item=document.createElement('li'),button=document.createElement('button');button.type='button';button.textContent=`第 ${issue.row} 句 · ${issue.format.toUpperCase()}：${issue.message}`;button.disabled=view.stale;button.onclick=()=>locate(i,view.revision);item.append(button);list.append(item);});
      if(view.details_truncated){const item=document.createElement('li');item.textContent='畫面只列前 20 項；全部句子已檢查。';list.append(item);}
      for(const text of view.review_notes){const item=document.createElement('li');item.textContent=text;notes.append(item);}
    }
    return {render};
  }
  const api={createPresenter};if(typeof module==='object'&&module.exports)module.exports=api;else root.MusicLyricsOfflineExportDom=api;
})(typeof globalThis==='object'?globalThis:this);
