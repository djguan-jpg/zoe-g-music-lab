// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
 const D=typeof module==='object'&&module.exports?require('./readiness-page-dom.js'):root.MusicReadinessPageDOM;
 function bind(document,{visible,busy,onCheck,onLocate,onError=()=>{}}){
  const get=id=>document.getElementById(id);let view={report:null,stale:false,revision:0};
  const allowed=()=>visible()&&!busy()&&!!get('cues-order').value;
  const attempt=action=>{try{return action();}catch(error){onError(error);return false;}};
  const labels={start:'開始',end:'結束',text:'文字',duration:'作品宣告'};
  const pager=D.bind(document,{prefix:'cue-review',visible:()=>visible()&&!!get('cues-order').value,busy,onLocate,onError,
   renderItem:(issue,locate,disabled)=>{const li=document.createElement('li'),button=document.createElement('button');button.type='button';button.className='subtle';button.disabled=disabled;
    button.textContent=`${issue.row?`第${issue.row}句`:'作品'} · ${labels[issue.field]}：${issue.message}${issue.related_row?`（第${issue.related_row}句）`:''}`;button.onclick=locate;li.append(button);return li;}});
  get('cue-review-check').onclick=()=>allowed()?attempt(onCheck):false;
  function render(next){
   view=next;const d=view.report;get('cue-review-box').classList.toggle('stale',view.stale);
   get('cue-review-check').disabled=!allowed();get('cue-review-report').disabled=!allowed();
   get('cue-review-status').textContent=!d?'選擇「要調整的歌詞」再檢查；未填時間也可檢查。':view.stale?'選擇、原句順序、文字或時間來源已有修改；請重新檢查選定歌詞。':`原句 ${d.row}／共${d.total_rows}句；${d.issue_count?`待辦 ${d.issue_count} 項，點選可定位。`:'時間資料沒有待辦；仍須完整歌詞包與實聽。'}`;
   pager.render({...view,report:d?{issues:d.issues,issueCount:d.issue_count}:null});
  }
  return Object.freeze({render,refresh(){render(view);},page:pager.view});
 }
 const api=Object.freeze({bind});if(typeof module==='object'&&module.exports)module.exports=api;else root.MusicLyricsCueReviewDOM=api;
})(typeof globalThis==='object'?globalThis:this);
