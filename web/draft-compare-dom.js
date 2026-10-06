// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
 const node=typeof module==='object'&&module.exports;
 const Controller=node?require('./draft-compare-controller.js'):root.MusicDraftCompareController;
 const Download=node?require('./draft-compare-download.js'):root.MusicDraftCompareDownload;
 const scopes={music:'歌曲設計',storyboard:'MV 分鏡',lyrics:'歌詞校時',audio:'音檔交付',metadata:'版本與頁籤資料'};
 const collections={fields:'欄位',sections:'段落',avoid:'避免事項',deliverables:'交付項目',shots:'鏡頭',motifs:'母題',cues:'歌詞句',metadata:'資料'};
 function bind(document,{prefix,capture,gate,downloads,onError=()=>{}}){
  const get=s=>document.getElementById(prefix+'-compare-'+s),button=get('start'),cancel=get('cancel'),status=get('status'),box=get('report'),list=get('list'),filter=get('scope'),previous=get('previous'),next=get('next'),pageNote=get('page');
  let page=0,disposed=false,ready=false;
  const jsonButton=get('download-json'),markdownButton=get('download-markdown'),downloadStatus=get('download-status');
  const label=key=>document.querySelector(`[id="${key}"]`)?.closest('label')?.childNodes[0]?.textContent?.trim()||({name:'名稱',bars:'小節',energy:'能量',focus:'敘事任務',texture:'音色',start:'開始',end:'結束',text:'歌詞原文',value:'內容',id:'母題 ID',saved_at:'保存時間',tool_version:'工具版本',tab:'頁籤'}[key]||key);
  function element(tag,text,cls){const el=document.createElement(tag);if(text!==undefined)el.textContent=text;if(cls)el.className=cls;return el;}
  function render(){
   try{
    const report=controller.read(),items=report.details.filter(d=>filter.value==='all'||d.scope===filter.value),pages=Math.max(1,Math.ceil(items.length/10));page=Math.min(page,pages-1);list.replaceChildren();
    for(const d of items.slice(page*10,page*10+10)){
     const entry=element('details',undefined,'draft-compare-entry');entry.append(element('summary',`${scopes[d.scope]} · ${collections[d.collection]}${d.row===null?'':`第 ${d.row} 列`} · ${{changed:'變更',added:'新增',removed:'移除'}[d.status]}（${d.fields.length} 欄）`));
     for(const f of d.fields){const group=element('div',undefined,'draft-compare-field');group.append(element('strong',label(f.field)));const sides=element('div',undefined,'draft-compare-sides');
      for(const [key,title] of [['before','目前工作台'],['after','將載入的草稿']]){
       const v=f[key],side=element('div',undefined,'draft-compare-side');side.append(element('span',title,'hint'));
       const text=element('pre',v===null?'這個位置沒有資料':v.excerpt===''?'空字串':v.excerpt);text.tabIndex=0;text.setAttribute('aria-label',`${label(f.field)}，${title}`);side.append(text);
       side.append(element('small',v===null?'缺值':`${v.bytes} UTF-8 bytes${v.excerpt_truncated?' · 原文摘錄，尚有後續文字':''}`,'hint'));sides.append(side);
      }group.append(sides);entry.append(group);
     }list.append(entry);
    }
    if(!items.length)list.append(element('p','這個範圍沒有保留的差異明細。','hint'));
    const focused=document.activeElement;
    previous.disabled=page===0;next.disabled=page+1>=pages;pageNote.textContent=`第 ${page+1} / ${pages} 頁 · 此範圍 ${items.length} 筆保留明細${report.details_truncated?'；完整計數包含未顯示明細':''}`;
    if(focused===previous&&previous.disabled||focused===next&&next.disabled)(!previous.disabled?previous:!next.disabled?next:filter).focus({preventScroll:true});
   }catch(error){box.hidden=true;onError(error);}
  }
  const controller=Controller.create({capture,gate,onError:error=>{status.textContent=error.message;status.classList.add('error');onError(error);},onState:v=>{
   ready=v.ready;button.disabled=!v.available||v.busy;cancel.hidden=!v.busy;filter.disabled=!v.ready;previous.disabled=!v.ready||previous.disabled;next.disabled=!v.ready||next.disabled;
   jsonButton.disabled=markdownButton.disabled=!v.ready||!v.available||v.busy;
   if(v.busy){status.textContent='正在核對兩份完整草稿；目前内容保留。';status.classList.remove('error');box.hidden=true;}
   else if(v.stale){status.textContent='工作台或預覽已有變更；此份比較已過期，請重新預覽後比較。';box.hidden=true;}
  },onReady:report=>{
   status.classList.remove('error');status.textContent=`作品差異 ${Object.values(report.panels).reduce((n,p)=>n+p.change_count,0)} 項：${Object.entries(report.panels).map(([s,p])=>`${scopes[s]} ${p.change_count}`).join('、')}。版本與頁籤資料 ${report.metadata.changed_fields.length} 項。${report.details_truncated?'只保留有界明細，完整計數已核對。':''}尚未套用。`;
   box.hidden=false;filter.value='all';page=0;
   // publish marks ready after this callback; read already has the completed source.
   render();
  }});
  const start=()=>controller.run(),stop=()=>{controller.cancel();status.textContent='已取消比較等待；目前內容與預覽保持。';button.focus({preventScroll:true});},change=()=>{if(!ready)return;page=0;render();},back=()=>{if(!ready)return;page=Math.max(0,page-1);render();},forward=()=>{if(!ready)return;page++;render();};
  const makeDownload=format=>downloads.createController({select:()=>Download.select(controller.read(),format),onSent:value=>{downloadStatus.textContent=`已送出 ${value.name}；請確認瀏覽器下載檔案。此下載不會另存工作台草稿。`;downloadStatus.classList.remove('error');},onError:error=>{downloadStatus.textContent=error.message;downloadStatus.classList.add('error');onError(error);}});
  const jsonDownload=makeDownload('json'),markdownDownload=makeDownload('markdown'),downloadJson=()=>jsonDownload.download(),downloadMarkdown=()=>markdownDownload.download();
  button.addEventListener('click',start);cancel.addEventListener('click',stop);filter.addEventListener('change',change);previous.addEventListener('click',back);next.addEventListener('click',forward);
  jsonButton.addEventListener('click',downloadJson);markdownButton.addEventListener('click',downloadMarkdown);
  const hide=()=>{if(disposed)return;disposed=true;controller.dispose();button.removeEventListener('click',start);cancel.removeEventListener('click',stop);filter.removeEventListener('change',change);previous.removeEventListener('click',back);next.removeEventListener('click',forward);jsonButton.removeEventListener('click',downloadJson);markdownButton.removeEventListener('click',downloadMarkdown);root.removeEventListener?.('pagehide',hide);};root.addEventListener?.('pagehide',hide);
  return {refresh:()=>controller.refresh(),invalidate:()=>controller.invalidate(),clear(){controller.clear();box.hidden=true;list.replaceChildren();downloadStatus.textContent='';status.textContent='先比較目前工作台與預覽草稿，再決定是否載入。';status.classList.remove('error');},dispose:hide};
 }
 const api={bind};if(node)module.exports=api;else root.MusicDraftCompareDom=api;
})(typeof globalThis==='object'?globalThis:this);
