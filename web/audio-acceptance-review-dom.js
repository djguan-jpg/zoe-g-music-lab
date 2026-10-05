// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
  function createAdapter(document,{capture,allowed=()=>true,onError=()=>{}}){
    const model=root.MusicAudioAcceptanceReview,$=id=>document.getElementById(id);
    let controller;
    const clearMarks=()=>{for(const key of Object.keys(model.labels)){const input=$('audio-accept-'+key);if(input.dataset.acceptReadyInvalid){delete input.dataset.acceptReadyInvalid;input.removeAttribute('aria-invalid');}}};
    function locate(index){if(!allowed())return;const issue=controller.locate(index);if(issue)$('audio-accept-'+issue.field).focus();}
    function render({report,stale}){
      clearMarks();$('audio-accept-ready-box').classList.toggle('stale',stale);
      const list=$('audio-accept-ready-issues');list.replaceChildren();
      $('audio-accept-ready-check').disabled=!allowed();$('audio-accept-ready-report').disabled=!allowed();
      $('audio-accept-ready-status').textContent=!report?'未填完整也能檢查；點選待辦可回到原欄位。':stale?'條件已編修；請重新檢查後再定位。':
        report.status==='preset_active'?'示範條件已啟用；自訂原值保留，未套用。':report.issue_count?`${report.issue_count} 項待辦；點選可定位原欄位。`:'三欄條件可解析；請接續音檔分析與實聽。';
      report?.issues.forEach((issue,index)=>{
        const li=document.createElement('li'),button=document.createElement('button');button.type='button';button.className='subtle';
        button.textContent=model.labels[issue.field]+'：'+issue.message;button.disabled=stale||!allowed();button.onclick=()=>locate(index);li.append(button);list.append(li);
        if(!stale){const input=$('audio-accept-'+issue.field);input.dataset.acceptReadyInvalid='true';input.setAttribute('aria-invalid','true');}
      });
    }
    controller=model.createController({capture,onState:render});
    function check(focus=false){if(!allowed())return false;const view=controller.check();if(focus&&view.report.issue_count)locate(0);return view.report.analysis_ready;}
    $('audio-accept-ready-check').onclick=()=>{try{check(true);}catch(error){onError(error.message);}};
    controller.refresh();return {...controller,check};
  }
  root.MusicAudioAcceptanceReviewDom={createAdapter};
})(typeof globalThis==='object'?globalThis:this);
