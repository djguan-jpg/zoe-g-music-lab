// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
 function bind(document,{labels,visible,busy,onCheck,onLocate,onError=()=>{}}){
  const get=id=>document.getElementById(id);let view={report:null,stale:false,revision:0};
  const allowed=()=>visible()&&!busy()&&!!get('section-order').value;
  const attempt=action=>{try{return action();}catch(error){onError(error);return false;}};
  get('section-review-check').onclick=()=>allowed()?attempt(onCheck):false;
  function render(next){
   view=next;const d=view.report,blocked=!allowed()||view.stale;
   get('section-review-box').classList.toggle('stale',view.stale);
   get('section-review-check').disabled=!allowed();
   get('section-review-report').disabled=!allowed();
   get('section-review-status').textContent=!d?'選擇「要調整的段落」再檢查；五個編曲欄位沿用整份待辦規則。':view.stale?'選擇、段落順序或選定欄位已有修改；請重新檢查這一段。':`段落 ${d.row}／共${d.totalSections}段；${d.issueCount?`待辦 ${d.issueCount} 項，點選可定位。`:'五個欄位沒有待辦；仍須整首歌曲驗證。'}`;
   const list=get('section-review-issues');list.replaceChildren();
   if(d)d.issues.forEach((issue,index)=>{const li=document.createElement('li'),button=document.createElement('button'),revision=view.revision;
    button.type='button';button.className='subtle';button.disabled=blocked;button.textContent=`段落 ${issue.row} · ${labels[issue.field]}：${issue.message}`;
    button.onclick=()=>allowed()&&!view.stale&&view.revision===revision?attempt(()=>onLocate(index,revision)):false;
    li.append(button);list.append(li);
   });
  }
  return Object.freeze({render,refresh(){render(view);}});
 }
 const api=Object.freeze({bind});if(typeof module==='object'&&module.exports)module.exports=api;else root.MusicSectionReviewDOM=api;
})(typeof globalThis==='object'?globalThis:this);
