// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
 const Cursor=typeof module==='object'&&module.exports?require('./issue-cursor.js'):root.MusicIssueCursor;
 const Summary=typeof module==='object'&&module.exports?require('./issue-summary.js'):root.MusicIssueSummary;
 function bind(document,{labels,visible,busy,onLocate,onCheck=()=>{},onError=()=>{},onReveal=()=>{}}){
  const get=id=>document.getElementById(id);let view={report:null,stale:false,revision:0};
  const attempt=action=>{try{return action();}catch(error){onError(error);return false;}};
  const detail=issue=>({location:`鏡頭 ${issue.row}`,field:labels[issue.field],message:issue.message,relation:issue.related_row?`母題 ${issue.related_row}`:null});
  const cursor=Cursor.createController({capture:()=>({detailCount:view.report?.issues.length||0,hasReport:view.report!==null,revision:view.revision,stale:view.stale,busy:busy(),visible:visible()&&!!get('shots-order').value}),onLocate,
   onState:v=>{get('shot-issue-return').disabled=!v.canReturn;get('shot-issue-previous').disabled=!v.canPrevious;get('shot-issue-next').disabled=!v.canNext;const current=!!view.report&&!view.stale&&view.revision===v.revision&&!busy()&&visible()&&!!get('shots-order').value&&v.index!==null;get('shot-issue-note').textContent=v.message+Summary.present({current,index:v.index,detail:current?detail(view.report.issues[v.index]):null});if(current)attempt(()=>onReveal(view.report.issues[v.index]));}});
  get('shot-issue-return').onclick=()=>attempt(()=>cursor.returnCurrent());get('shot-issue-previous').onclick=()=>attempt(()=>cursor.move(-1));get('shot-issue-next').onclick=()=>attempt(()=>cursor.move(1));
  get('shot-issue-check').onclick=()=>{if(!visible()||busy()||!get('shots-order').value)return false;return attempt(onCheck);};
  function render(next){
   view=next;const d=view.report,blocked=!visible()||busy()||view.stale||!get('shots-order').value;
   get('shot-review-box').classList.toggle('stale',view.stale);
   get('shot-review-status').textContent=!d?'選擇「要調整的鏡頭」後檢查，所有待辦皆保留原始鏡號。':view.stale?'選擇、鏡頭順序或來源已有修改；下方是上一份單鏡待辦，請重查。':`鏡頭 ${d.row}／共${d.total_shots}鏡；${d.issue_count?`待辦 ${d.issue_count} 項，點選可定位。`:'欄位沒有待辦；仍須整份分鏡驗證。'}`;
   const list=get('shot-review-issues');list.replaceChildren();
   if(d)d.issues.forEach((issue,index)=>{const li=document.createElement('li'),button=document.createElement('button'),revision=view.revision;button.type='button';button.className='subtle';button.disabled=blocked;button.textContent=Summary.format(detail(issue));button.onclick=()=>attempt(()=>cursor.locate(index,revision));li.append(button);list.append(li);});
   get('shot-review-check').disabled=!visible()||busy()||!get('shots-order').value;
   get('shot-review-report').disabled=get('shot-review-check').disabled;
   get('shot-issue-check').disabled=get('shot-review-check').disabled;cursor.refresh();
  }
  return Object.freeze({render,refresh(){render(view);}});
 }
 const api=Object.freeze({bind});if(typeof module==='object'&&module.exports)module.exports=api;else root.MusicStoryboardShotReviewDOM=api;
})(typeof globalThis==='object'?globalThis:this);
