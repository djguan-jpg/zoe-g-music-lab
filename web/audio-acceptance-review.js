// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
  const node=typeof module==='object'&&module.exports;
  const drafts=node?require('./audio-acceptance.js'):root.MusicAudioAcceptance;
  const values=node?require('./planning-values.js'):root.MusicPlanningValues;
  const versions=node?require('../musiclab/assets/delivery-versions.js'):root.MusicDeliveryVersions;
  const json=node?require('../musiclab/assets/json-document.js'):root.MusicJsonDocument;
  const replies=node?require('./readiness-report.js'):root.MusicReadinessReport;
  const state=node?require('./readiness-state.js'):root.MusicReadinessState;
  const keys=['rates','bits','channels'],labels={rates:'取樣率（Hz）',bits:'位元深度（bit）',channels:'聲道數'};
  const messages={missing_value:'尚未填寫接受值',too_many_values:'最多 64 個接受值',invalid_value:'需為正整數，以逗號分隔；不捨入小數'};
  const notes=['只檢查條件原值；不補填、不轉檔、不調整聲音。','條件可解析不代表音檔通過；仍須分析音檔、實聽及確認交付需求。'];
  function review(document){
    const source=drafts.validate(document),fields=[],issues=[],acceptance={};
    for(const key of keys){
      const raw=source.fields[key];
      if(!source.custom){fields.push({field:key,status:'inactive',value_count:0});continue;}
      try{const list=drafts.fieldValues(key,raw);acceptance[key]=list;fields.push({field:key,status:'valid',value_count:list.length});}
      catch{const code=!values.trim(raw)?'missing_value':raw.replaceAll('，',',').split(',').length>64?'too_many_values':'invalid_value';
        issues.push({field:key,code,message:messages[code]});fields.push({field:key,status:'invalid',value_count:0});}
    }
    return {format:'zoe-audio-acceptance-review',schema_version:1,source,
      status:!source.custom?'preset_active':issues.length?'needs_correction':'fields_checked',fields,issue_count:issues.length,issues,
      analysis_ready:!issues.length,effective_acceptance:issues.length?null:source.custom?acceptance:drafts.prepare(source).acceptance,review_notes:[...notes]};
  }
  function markdown(data){
    const lines=['# 音檔接受條件檢查','',`待辦 ${data.issue_count} 項。`,''];
    if(data.status==='preset_active')lines.push('示範條件已啟用；自訂原值保留，未套用。');
    else if(!data.issues.length)lines.push('三欄條件可解析；請接續音檔分析與實聽。');
    for(const issue of data.issues)lines.push(`- ${labels[issue.field]}：${issue.message}`);
    return [...lines,'',...data.review_notes,''].join('\n');
  }
  function checkedResult(document,reply){
    if(reply?.meta?.version!==versions.current)throw Error('條件檢查報告版本不符；目前成果與編修保留');
    for(const name of ['audio-acceptance-review.json','audio-acceptance-review.md']){
      const text=reply?.files?.[name];json.assertUnicode(text,'條件檢查報告');
      if(new TextEncoder().encode(text).length>256*1024)throw Error('條件檢查報告超過256 KiB');
    }
    return replies.checkedResult({expected:review(document),reply,jsonName:'audio-acceptance-review.json',
      markdownName:'audio-acceptance-review.md',markdown,label:'條件檢查報告'});
  }
  function createController(options){return state.createController({...options,source:drafts.validate,inspect:review});}
  const api={review,markdown,checkedResult,createController,labels};if(node)module.exports=api;else root.MusicAudioAcceptanceReview=api;
})(typeof globalThis==='object'?globalThis:this);
