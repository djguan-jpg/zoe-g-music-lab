// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
 const Cursor=typeof module==='object'&&module.exports?require('./issue-cursor.js'):root.MusicIssueCursor;
 const Summary=typeof module==='object'&&module.exports?require('./issue-summary.js'):root.MusicIssueSummary;
 function bind(document,{labels,visible,busy,onCheck,onLocate,onError=()=>{},onReveal=()=>{}}){
  const get=id=>document.getElementById(id);let view={report:null,stale:false,revision:0};
  const allowed=()=>visible()&&!busy()&&!!get('section-order').value;
  const attempt=action=>{try{return action();}catch(error){onError(error);return false;}};
  const detail=issue=>({location:`段落 ${issue.row}`,field:labels[issue.field],message:issue.message,relation:null});
  const cursor=Cursor.createController({capture:()=>({detailCount:view.report?.issues.length||0,hasReport:view.report!==null,revision:view.revision,stale:view.stale,busy:busy(),visible:visible()&&!!get('section-order').value}),onLocate,
   messages:{missing:'先檢查選定段落待辦，再逐項定位。',stale:'選定來源已有修改，請重查這一段。',empty:'這一段沒有欄位待辦；仍須整首歌曲驗證。',progress:'這一段待辦'},
   onState:v=>{get('section-issue-previous').disabled=!v.canPrevious;get('section-issue-next').disabled=!v.canNext;const current=!!view.report&&!view.stale&&view.revision===v.revision&&!busy()&&visible()&&!!get('section-order').value&&v.index!==null;get('section-issue-note').textContent=v.message+Summary.present({current,index:v.index,detail:current?detail(view.report.issues[v.index]):null});if(current)attempt(()=>onReveal(view.report.issues[v.index]));}});
  get('section-issue-previous').onclick=()=>attempt(()=>cursor.move(-1));get('section-issue-next').onclick=()=>attempt(()=>cursor.move(1));
  get('section-issue-check').onclick=()=>allowed()?attempt(onCheck):false;
  get('section-review-check').onclick=()=>allowed()?attempt(onCheck):false;
  function render(next){
   view=next;const d=view.report,blocked=!allowed()||view.stale;
   get('section-review-box').classList.toggle('stale',view.stale);
   get('section-review-check').disabled=!allowed();
   get('section-review-report').disabled=!allowed();
   get('section-issue-check').disabled=!allowed();
   get('section-review-status').textContent=!d?'選擇「要調整的段落」再檢查；五個編曲欄位沿用整份待辦規則。':view.stale?'選擇、段落順序或選定欄位已有修改；請重新檢查這一段。':`段落 ${d.row}／共${d.totalSections}段；${d.issueCount?`待辦 ${d.issueCount} 項，點選可定位。`:'五個欄位沒有待辦；仍須整首歌曲驗證。'}`;
   const list=get('section-review-issues');list.replaceChildren();
   if(d)d.issues.forEach((issue,index)=>{const li=document.createElement('li'),button=document.createElement('button'),revision=view.revision;
    button.type='button';button.className='subtle';button.disabled=blocked;button.textContent=Summary.format(detail(issue));
    button.onclick=()=>attempt(()=>cursor.locate(index,revision));
    li.append(button);list.append(li);
   });
   cursor.refresh();
  }
  return Object.freeze({render,refresh(){render(view);}});
 }
 const api=Object.freeze({bind});if(typeof module==='object'&&module.exports)module.exports=api;else root.MusicSectionReviewDOM=api;
})(typeof globalThis==='object'?globalThis:this);
