// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
 const node=typeof module==='object'&&module.exports;
 const Model=node?require('./draft-compare-row.js'):root.MusicDraftCompareRow;
 const Controller=node?require('./draft-compare-controller.js'):root.MusicDraftCompareController;
 const names={'lyrics.cues':'歌詞句','storyboard.shots':'分鏡鏡頭','storyboard.motifs':'分鏡母題','music.sections':'歌曲段落','music.avoid':'避免事項','music.deliverables':'交付項目'};
 const labels={name:'名稱',bars:'小節',energy:'能量',focus:'敘事任務',texture:'音色',start:'開始',end:'結束',text:'歌詞原文',value:'內容',id:'母題 ID',meaning:'母題意義',section:'段落',purpose:'鏡頭目的',visual:'畫面',camera:'運鏡',transition:'轉場',motif_state:'母題狀態',character_state:'人物狀態',change_reason:'變化原因',screen_direction:'畫面方向',motif_id:'母題 ID'};
 function bind(document,{prefix,capture,gate,onError=()=>{}}){
  const get=s=>document.getElementById(prefix+'-compare-row-'+s),collection=get('collection'),row=get('number'),start=get('start'),cancel=get('cancel'),status=get('status'),result=get('result'),full=get('full'),previous=get('previous'),next=get('next'),navigationNote=get('navigation');
  let disposed=false,fullMode=false,navigation=null,usable=false,intent=0;
  function navigationControls(){previous.disabled=!usable||navigation?.previous==null;next.disabled=!usable||navigation?.next==null;}
  function navigationText(){navigationNote.textContent=navigation?`完整集合共 ${navigation.rows} 列，${navigation.changes} 列有變動；${navigation.ordinal===null?'目前原列未變更':`目前為第 ${navigation.ordinal} 個變動原列`}。箭頭略過未變更列；按原位置比較，不推定移動。`:'';navigationControls();}
  function resetNavigation(){navigation=null;navigationText();}
  function element(tag,text,cls){const e=document.createElement(tag);if(text!==undefined)e.textContent=text;if(cls)e.className=cls;return e;}
  function mode(value){fullMode=value;full.textContent=value?'回到原文摘錄':'閱讀這一列完整原文';full.setAttribute('aria-pressed',String(value));}
  function paint(report,values){
   result.replaceChildren();const s=report.selection;
   status.textContent=`${names[s.scope+'.'+s.collection]} 原第 ${s.row} 列 · ${{unchanged:'未變更',changed:'變更',added:'新增',removed:'移除'}[report.status]}；集合 ${report.baseline_rows} → ${report.current_rows} 列。${values?'完整原文':'每欄最多128 UTF-8 bytes摘錄'}；尚未套用。`;
   status.classList.remove('error');
   for(const [index,f] of report.fields.entries()){
    const label=labels[f.field]||f.field,group=element('div',undefined,'draft-compare-field');group.append(element('strong',`${label} · ${f.changed?'有變動':'未變更'}`));const sides=element('div',undefined,'draft-compare-sides');
    for(const [key,title] of [['before','目前工作台'],['after','將載入的草稿']]){
     const v=f[key],literal=values?values.fields[index][key]:v?.excerpt,side=element('div',undefined,'draft-compare-side');side.append(element('span',title,'hint'));
     const text=element('pre',v===null?'這個位置沒有資料':literal===''?'空字串':literal);text.tabIndex=0;text.setAttribute('aria-label',`${label}，${title}${values?'，完整原文':''}`);side.append(text);
     side.append(element('small',v===null?'缺值':`${v.bytes} UTF-8 bytes${values?' · 完整原文':v.excerpt_truncated?' · 原文摘錄，尚有後續文字':''}`,'hint'));sides.append(side);
    }group.append(sides);result.append(group);
   }
  }
  function selected(){
   if(typeof row.value!=='string'||!/^[1-9][0-9]{0,4}$/.test(row.value))throw Error('原列請輸入1起整數，不會自動修正');
   const [scope,key,...rest]=collection.value.split('.');if(rest.length)throw Error('請選擇受支援的集合');
   return Model.selection({scope,collection:key,row:Number(row.value)});
  }
  const controller=Controller.create({model:Model,capture:()=>({...capture(),selection:selected()}),gate,onError:error=>{status.textContent=error.message;status.classList.add('error');onError(error);},onState:v=>{
   usable=v.ready&&v.available&&!v.busy;
   start.disabled=!v.available||v.busy;collection.disabled=row.disabled=!v.available||v.busy;cancel.hidden=!v.busy;full.disabled=!v.ready||!v.available||v.busy;
   if(v.busy||v.stale||!v.ready)resetNavigation();else navigationControls();
   if(v.busy){mode(false);result.replaceChildren();status.textContent='正在核對完整來源及指定原列；原草稿保持。';status.classList.remove('error');}
   if(v.stale){mode(false);result.replaceChildren();status.textContent='來源或選列已有變更；請重新查看指定原列。';}
  },onReady:report=>{
   navigation=Model.navigation(controller.readPayload());navigationText();mode(false);paint(report);
  }});
  const navigate=async direction=>{
   if(disposed||!usable)return false;
   try{
    const fresh=Model.navigation(controller.readPayload()),target=fresh[direction],button=direction==='previous'?previous:next;
    navigation=fresh;navigationText();if(target===null)return false;
    const selectedIntent=++intent,wantedFocus=document.activeElement===button;row.value=String(target);
    const success=await controller.run();
    if(success&&!disposed&&usable&&intent===selectedIntent&&wantedFocus&&(document.activeElement===button||document.activeElement===document.body||!document.activeElement))row.focus({preventScroll:true});
    return success;
   }catch(error){status.textContent=error.message;status.classList.add('error');onError(error);return false;}
  };
  const toggle=()=>{if(disposed)return false;try{const report=controller.read(),value=!fullMode,values=value?Model.fullValues(controller.readPayload()):null;paint(report,values);mode(value);return true;}catch(error){status.textContent=error.message;status.classList.add('error');onError(error);return false;}};
  const run=()=>{intent++;return controller.run();},change=()=>{intent++;controller.invalidate();},stop=()=>{intent++;controller.cancel();status.textContent='已取消原列查看；原草稿保持。';start.focus({preventScroll:true});},goPrevious=()=>navigate('previous'),goNext=()=>navigate('next');
  mode(false);full.disabled=true;resetNavigation();start.addEventListener('click',run);collection.addEventListener('change',change);row.addEventListener('input',change);cancel.addEventListener('click',stop);full.addEventListener('click',toggle);previous.addEventListener('click',goPrevious);next.addEventListener('click',goNext);
  return {refresh:()=>controller.refresh(),clear(){intent++;controller.clear();mode(false);resetNavigation();result.replaceChildren();status.classList.remove('error');status.textContent='選集合與原列，可查看前200筆之外的位置；箭頭略過未變更列，可明確閱讀完整原文。';},dispose(){if(disposed)return;intent++;disposed=true;controller.dispose();usable=false;mode(false);resetNavigation();full.disabled=true;start.removeEventListener('click',run);collection.removeEventListener('change',change);row.removeEventListener('input',change);cancel.removeEventListener('click',stop);full.removeEventListener('click',toggle);previous.removeEventListener('click',goPrevious);next.removeEventListener('click',goNext);result.replaceChildren();}};
 }
 const api={bind};if(node)module.exports=api;else root.MusicDraftCompareRowDom=api;
})(typeof globalThis==='object'?globalThis:this);
