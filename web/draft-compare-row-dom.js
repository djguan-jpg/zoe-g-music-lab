// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
 const node=typeof module==='object'&&module.exports;
 const Model=node?require('./draft-compare-row.js'):root.MusicDraftCompareRow;
 const Controller=node?require('./draft-compare-controller.js'):root.MusicDraftCompareController;
 const names={'lyrics.cues':'歌詞句','storyboard.shots':'分鏡鏡頭','storyboard.motifs':'分鏡母題','music.sections':'歌曲段落','music.avoid':'避免事項','music.deliverables':'交付項目'};
 const labels={name:'名稱',bars:'小節',energy:'能量',focus:'敘事任務',texture:'音色',start:'開始',end:'結束',text:'歌詞原文',value:'內容',id:'母題 ID',meaning:'母題意義',section:'段落',purpose:'鏡頭目的',visual:'畫面',camera:'運鏡',transition:'轉場',motif_state:'母題狀態',character_state:'人物狀態',change_reason:'變化原因',screen_direction:'畫面方向',motif_id:'母題 ID'};
 function bind(document,{prefix,capture,gate,onError=()=>{}}){
  const get=s=>document.getElementById(prefix+'-compare-row-'+s),collection=get('collection'),row=get('number'),start=get('start'),cancel=get('cancel'),status=get('status'),result=get('result');
  let disposed=false;
  function element(tag,text,cls){const e=document.createElement(tag);if(text!==undefined)e.textContent=text;if(cls)e.className=cls;return e;}
  function selected(){
   if(typeof row.value!=='string'||!/^[1-9][0-9]{0,4}$/.test(row.value))throw Error('原列請輸入1起整數，不會自動修正');
   const [scope,key,...rest]=collection.value.split('.');if(rest.length)throw Error('請選擇受支援的集合');
   return Model.selection({scope,collection:key,row:Number(row.value)});
  }
  const controller=Controller.create({model:Model,capture:()=>({...capture(),selection:selected()}),gate,onError:error=>{status.textContent=error.message;status.classList.add('error');onError(error);},onState:v=>{
   start.disabled=!v.available||v.busy;collection.disabled=row.disabled=!v.available||v.busy;cancel.hidden=!v.busy;
   if(v.busy){result.replaceChildren();status.textContent='正在核對完整來源及指定原列；原草稿保持。';status.classList.remove('error');}
   if(v.stale){result.replaceChildren();status.textContent='來源或選列已有變更；請重新查看指定原列。';}
  },onReady:report=>{
   result.replaceChildren();const s=report.selection;
   status.textContent=`${names[s.scope+'.'+s.collection]} 原第 ${s.row} 列 · ${{unchanged:'未變更',changed:'變更',added:'新增',removed:'移除'}[report.status]}；集合 ${report.baseline_rows} → ${report.current_rows} 列。尚未套用。`;
   status.classList.remove('error');
   for(const f of report.fields){
    const label=labels[f.field]||f.field,group=element('div',undefined,'draft-compare-field');group.append(element('strong',`${label} · ${f.changed?'有變動':'未變更'}`));const sides=element('div',undefined,'draft-compare-sides');
    for(const [key,title] of [['before','目前工作台'],['after','將載入的草稿']]){
     const v=f[key],side=element('div',undefined,'draft-compare-side');side.append(element('span',title,'hint'));
     const text=element('pre',v===null?'這個位置沒有資料':v.excerpt===''?'空字串':v.excerpt);text.tabIndex=0;text.setAttribute('aria-label',`${label}，${title}`);side.append(text);
     side.append(element('small',v===null?'缺值':`${v.bytes} UTF-8 bytes${v.excerpt_truncated?' · 原文摘錄，尚有後續文字':''}`,'hint'));sides.append(side);
    }group.append(sides);result.append(group);
   }
  }});
  const run=()=>controller.run(),change=()=>controller.invalidate(),stop=()=>{controller.cancel();status.textContent='已取消原列查看；原草稿保持。';start.focus({preventScroll:true});};
  start.addEventListener('click',run);collection.addEventListener('change',change);row.addEventListener('input',change);cancel.addEventListener('click',stop);
  return {refresh:()=>controller.refresh(),clear(){controller.clear();result.replaceChildren();status.classList.remove('error');status.textContent='選集合與原列，可查看前200筆之外的位置；每欄最多128 UTF-8 bytes摘錄。';},dispose(){if(disposed)return;disposed=true;controller.dispose();start.removeEventListener('click',run);collection.removeEventListener('change',change);row.removeEventListener('input',change);cancel.removeEventListener('click',stop);result.replaceChildren();}};
 }
 const api={bind};if(node)module.exports=api;else root.MusicDraftCompareRowDom=api;
})(typeof globalThis==='object'?globalThis:this);
