// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
 const D=typeof module==='object'&&module.exports?require('./readiness-page-dom.js'):root.MusicReadinessPageDOM;
 const C=typeof module==='object'&&module.exports?require('./issue-cursor.js'):root.MusicIssueCursor;
 const Summary=typeof module==='object'&&module.exports?require('./issue-summary.js'):root.MusicIssueSummary;
 function bind(document,{visible,busy,onCheck,onLocate,onError=()=>{},onReveal=()=>{}}){
  const get=id=>document.getElementById(id);let view={report:null,stale:false,revision:0};
  const allowed=()=>visible()&&!busy()&&!!get('cues-order').value;
  const attempt=action=>{try{return action();}catch(error){onError(error);return false;}};
  const labels={start:'開始',end:'結束',text:'文字',duration:'作品宣告'};
  const detail=issue=>({location:issue.row?`第${issue.row}句`:'作品',field:labels[issue.field],message:issue.message,relation:issue.related_row?`第${issue.related_row}句`:null});
  let pager;
  const cursor=C.createController({maxDetails:200,capture:()=>({detailCount:view.report?.issues.length||0,hasReport:view.report!==null,revision:view.revision,stale:view.stale,busy:busy(),visible:visible()&&!!get('cues-order').value}),
   messages:{missing:'先檢查選定歌詞待辦，再逐項定位。',stale:'選定來源已有修改，請重查這一句。',empty:'這一句沒有校時待辦；仍須完整歌詞包與實聽。',progress:'這一句保留待辦'},
   onLocate:(index,revision)=>onLocate(index,revision)===true&&pager.reveal(index,revision),
   onState:v=>{get('cue-issue-return').disabled=!v.canReturn;get('cue-issue-previous').disabled=!v.canPrevious;get('cue-issue-next').disabled=!v.canNext;const current=!!view.report&&!view.stale&&view.revision===v.revision&&!busy()&&visible()&&!!get('cues-order').value&&v.index!==null;get('cue-issue-note').textContent=v.message+(view.report?.issue_count>v.detailCount?` 全部 ${view.report.issue_count} 項；此導覽只走保留的前 ${v.detailCount} 項。`:'')+Summary.present({current,index:v.index,detail:current?detail(view.report.issues[v.index]):null});if(current)attempt(()=>onReveal(view.report.issues[v.index]));}});
  get('cue-issue-return').onclick=()=>attempt(()=>cursor.returnCurrent());get('cue-issue-previous').onclick=()=>attempt(()=>cursor.move(-1));get('cue-issue-next').onclick=()=>attempt(()=>cursor.move(1));
  get('cue-issue-check').onclick=()=>allowed()?attempt(onCheck):false;
  pager=D.bind(document,{prefix:'cue-review',visible:()=>visible()&&!!get('cues-order').value,busy,onLocate:(index,revision)=>cursor.locate(index,revision),onError,
   renderItem:(issue,locate,disabled)=>{const li=document.createElement('li'),button=document.createElement('button');button.type='button';button.className='subtle';button.disabled=disabled;
    button.textContent=Summary.format(detail(issue));button.onclick=locate;li.append(button);return li;}});
  get('cue-review-check').onclick=()=>allowed()?attempt(onCheck):false;
  function render(next){
   view=next;const d=view.report;get('cue-review-box').classList.toggle('stale',view.stale);
   get('cue-review-check').disabled=!allowed();get('cue-review-report').disabled=!allowed();get('cue-issue-check').disabled=!allowed();
   get('cue-review-status').textContent=!d?'選擇「要調整的歌詞」再檢查；未填時間也可檢查。':view.stale?'選擇、原句順序、文字或時間來源已有修改；請重新檢查選定歌詞。':`原句 ${d.row}／共${d.total_rows}句；${d.issue_count?`待辦 ${d.issue_count} 項，點選可定位。`:'時間資料沒有待辦；仍須完整歌詞包與實聽。'}`;
   pager.render({...view,report:d?{issues:d.issues,issueCount:d.issue_count}:null});
   cursor.refresh();
  }
  return Object.freeze({render,refresh(){render(view);},page:pager.view});
 }
 const api=Object.freeze({bind});if(typeof module==='object'&&module.exports)module.exports=api;else root.MusicLyricsCueReviewDOM=api;
})(typeof globalThis==='object'?globalThis:this);
