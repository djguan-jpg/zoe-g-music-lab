// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
 function bind(document,{labels,visible,busy,onLocate}){
  const get=id=>document.getElementById(id);let view={report:null,stale:false,revision:0};
  function render(next){
   view=next;const d=view.report,blocked=!visible()||busy()||view.stale;
   get('shot-review-box').classList.toggle('stale',view.stale);
   get('shot-review-status').textContent=!d?'選擇「要調整的鏡頭」後檢查，所有待辦皆保留原始鏡號。':view.stale?'選擇、鏡頭順序或來源已有修改；下方是上一份單鏡待辦，請重查。':`鏡頭 ${d.row}／共${d.total_shots}鏡；${d.issue_count?`待辦 ${d.issue_count} 項，點選可定位。`:'欄位沒有待辦；仍須整份分鏡驗證。'}`;
   const list=get('shot-review-issues');list.replaceChildren();
   if(d)d.issues.forEach((issue,index)=>{const li=document.createElement('li'),button=document.createElement('button'),revision=view.revision;button.type='button';button.className='subtle';button.disabled=blocked;button.textContent=`鏡頭 ${issue.row} · ${labels[issue.field]}：${issue.message}${issue.related_row?`（母題 ${issue.related_row}）`:''}`;button.onclick=()=>onLocate(index,revision);li.append(button);list.append(li);});
   get('shot-review-check').disabled=!visible()||busy()||!get('shots-order').value;
   get('shot-review-report').disabled=get('shot-review-check').disabled;
  }
  return Object.freeze({render,refresh(){render(view);}});
 }
 const api=Object.freeze({bind});if(typeof module==='object'&&module.exports)module.exports=api;else root.MusicStoryboardShotReviewDOM=api;
})(typeof globalThis==='object'?globalThis:this);
