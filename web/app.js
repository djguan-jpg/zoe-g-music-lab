// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
const $ = id => document.getElementById(id);
$('product-version').textContent='v'+MusicDeliveryVersions.current;
const textDownloader=MusicTextDownloadDom.createAdapter(document,{events:window});
const state = {tab:'music', examples:null, files:{}, bundles:{}, revisions:{}, music:[], shots:[], cues:[], audioUrl:null, audioContext:null, waveform:null, busy:false,resultRevisions:{},deliveryImport:null,deliveryPackage:null,deliveryNavigation:null,audioAcceptance:null};
const operationGate=MusicOperationGate.createGate({createAbort:()=>new AbortController()});
const rawFields=MusicRawFieldsDom.createAdapter(document);
const readValue=control=>rawFields.read(control);
const writeValue=(control,value)=>rawFields.write(control,value);
Object.values(MusicEditor.draftFields).flat().forEach(id=>writeValue($(id),$(id).value));
const draftUndo=MusicDraftUndo.createUndo();
const draftRetention=MusicDraftRetention.createGuard({capture:captureDraft,capturePanel,events:window,onState:renderRetention});
let seedController=null,lyricsSeedController=null,lyricsImportController=null,storyboardDurationController=null,storyboardReadyController=null;
let timingController=null,timingReading=false,timingReady=false,timingCanUndo=false;
let lyricsMediaController=null,lyricsReviewController=null,lyricsReviewData=null,lyricsReviewStale=false;
let lyricsExportController=null,cueStampEdit=null,lyricsSearchController=null,storyboardSearchController=null;
const deletionHistory=MusicHistory.createHistory(20);
let arrangementController=null,musicReadyController=null;
let storyboardTimingController=null;
let rowSequence=0;
const rowIds=(items,ids)=>ids||items.map(()=>`row-${++rowSequence}`);
const collections={
  arrangement:{scope:'music',label:'段落',limit:MusicEditor.draftRows.music.limit,add:'section-add',remove:'[data-remove-section]'},
  'music-avoid':{scope:'music',label:'避免事項',limit:100,add:'avoid-add',remove:'button'},
  'music-deliverables':{scope:'music',label:'交付項目',limit:100,add:'deliverable-add',remove:'button'},
  motifs:{scope:'storyboard',label:'母題',limit:30,add:'motif-add',remove:'[data-remove-motif]'},
  shots:{scope:'storyboard',label:'鏡頭',limit:MusicEditor.draftRows.storyboard.limit,add:'shot-add',remove:'[data-remove-shot]'},
  cues:{scope:'lyrics',label:'歌詞句',limit:10000,add:'cue-add',remove:'[data-delete-cue]'}
};
const editorFocus=MusicEditorFocusDOM.createAdapter(document,{busy:()=>state.busy,onError:error=>say(error.message,true)});
function entriesFor(list){
  return [...$(list).children].map(row=>{
    let value;
    if(list==='arrangement')value=Object.fromEntries(['name','bars','energy','focus','texture'].map((key,i)=>[key,readValue(row.querySelectorAll('input')[i])]));
    else if(list==='cues')value=Object.fromEntries(['start','end','text'].map((key,i)=>[key,readValue(row.querySelectorAll('input')[i])]));
    else if(list==='shots')value={...Object.fromEntries([...row.querySelectorAll('[data-key]')].map(x=>[x.dataset.key,readValue(x)])),open:row.querySelector('details').open};
    else if(list==='motifs')value={id:row.dataset.motifId,name:readValue(row.querySelector('[data-motif="name"]')),meaning:readValue(row.querySelector('[data-motif="meaning"]'))};
    else value=readValue(row.querySelector('textarea'));
    return {id:row.dataset.historyId,value};
  });
}
function writeEntries(list,entries){
  const values=entries.map(e=>e.value),ids=entries.map(e=>e.id);
  if(list==='arrangement')renderSections(values,ids);
  else if(list==='cues'){renderCues(values,ids);tick();}
  else if(list==='shots')renderShots(values,values.map(s=>s.open),ids);
  else if(list==='motifs'){renderMotifs(values);refreshMotifChoices();}
  else renderRequirements(list,values,collections[list].label,ids);
}
function refreshDeletionHistory(scope){
  const records=deletionHistory.entries(scope),record=records.at(-1),select=$(scope+'-delete-select');
  select.replaceChildren();records.forEach((r,i)=>select.append(new Option(`${i+1} · ${r.label}`,String(i))));
  select.disabled=state.busy||!record;if(record)select.value=String(records.length-1);
  refreshDeletionButton(scope);
  $(scope+'-delete-note').textContent=record?`本工作台可還原 ${deletionHistory.size(scope)} 次刪除；其他內容的編修保留。`:'本頁最多保留 20 次刪除；載入新內容會清除此工作台紀錄。';
}
function refreshDeletionButton(scope){
  const record=deletionHistory.at(scope,Number($(scope+'-delete-select').value)),button=$(scope+'-delete-undo');
  button.disabled=state.busy||!record;button.textContent=record?`還原：${record.label}`:'還原最近刪除';
}
function clearDeletionHistory(scope){deletionHistory.clear(scope);refreshDeletionHistory(scope);if(scope==='music'){arrangementController?.clear();musicReadyController?.clear();}if(scope==='storyboard')storyboardTimingController?.clear();}
function focusEntry(list,index,mode='entry'){return editorFocus.focus(list,index,mode);}
function refreshCollectionControls(){
  for(const [list,spec] of Object.entries(collections)){
    $(spec.add).disabled=state.busy;
    $(list).querySelectorAll(spec.remove).forEach(button=>button.disabled=state.busy);
  }
  for(const scope of ['music','storyboard','lyrics']){
    $(scope+'-delete-select').disabled=state.busy||!deletionHistory.size(scope);
    refreshDeletionButton(scope);
  }
}
function deleteEntry(list,index){
  if(state.busy){say('目前操作尚未完成，請稍候');return;}
  const spec=collections[list],before=entriesFor(list),removed=MusicHistory.remove(before,index);
  const {remaining,record}=removed;
  const value=record.entry.value,summary=String(typeof value==='string'?value:
    value.name||value.text||value.section||'').replace(/\s+/g,' ').trim();
  const caption=Array.from(summary);
  record.list=list;record.label=`${spec.label} ${index+1}${summary?' · '+caption.slice(0,24).join('')+(caption.length>24?'…':''):''}`;
  writeEntries(list,remaining);deletionHistory.push(spec.scope,record);refreshDeletionHistory(spec.scope);
  markDirty(spec.scope);focusEntry(list,Math.max(0,Math.min(index,remaining.length-1)));
  say(`已刪除${record.label}，可還原；${list==='shots'?'其他鏡頭原時間與總長保留，請檢查時間待辦':'重新建立成果後更新'}`);
}
function undoDeletion(scope){
  if(state.busy){say('目前操作尚未完成，請稍候');return;}
  const index=Number($(scope+'-delete-select').value),record=deletionHistory.at(scope,index);if(!record)return;
  try{
    const spec=collections[record.list],fields=record.list==='shots'?{'mv-duration':readValue($('mv-duration'))}:{};
    const result=MusicHistory.restore(entriesFor(record.list),record,{limit:spec.limit,fields});
    Object.entries(result.fields).forEach(([id,value])=>writeValue($(id),value));
    writeEntries(record.list,result.entries);deletionHistory.drop(scope,index);refreshDeletionHistory(scope);
    markDirty(scope);focusEntry(record.list,result.index);
    say(`已還原${record.label}；${record.list==='shots'?`後來編修的時間保留${result.kept.length?'（'+result.kept.length+' 欄）':''}，請重新檢查分鏡時間`:'其他編修保留，請重新建立成果'}`);
  }catch(error){say(error.message,true);}
}
['music','storyboard','lyrics'].forEach(scope=>{
  $(scope+'-delete-undo').onclick=()=>undoDeletion(scope);
  $(scope+'-delete-select').onchange=()=>refreshDeletionButton(scope);
});
const waveTask = MusicEditor.createLatestTask();
function say(message,error=false){$('status').textContent=message;$('status').className=error?'error':'';state.deliveryNavigation?.refresh();state.audioAcceptance?.refresh();state.audioAcceptanceReview?.refresh();state.deliveryPackage?.refresh();state.deliveryImport?.refresh();state.textVerification?.refresh();if(state.tab==='storyboard'){$('shot-status').textContent=message;$('shot-status').classList.toggle('error',error);}}
function esc(value){return String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function field(value,label,type='text',wide=false){return `<input type="text" value="${esc(value)}" aria-label="${esc(label)}" class="${wide?'wide':''}" ${type==='number'?'inputmode="decimal" data-raw-number="true"':''}>`;}
async function api(route,data,binary=false,signal){const response=await fetch(route,{method:'POST',headers:{'Content-Type':binary?'application/octet-stream':'application/json'},body:binary?data:JSON.stringify(data),...(signal?{signal}:{})});const result=await response.json();if(!response.ok){const error=Error(result.error||'操作未完成');error.status=response.status;throw error;}return result;}
async function run(button,task,scope=state.tab){
  if(state.busy)return;
  state.operationControl?.begin({scope,action:button.textContent||'建立成果'});
  const job=operationGate.begin(),tab=state.tab,revision=state.revisions[scope]||0,current=()=>operationGate.current(job)&&state.tab===tab&&(state.revisions[scope]||0)===revision;
  current.signal=job.signal;
  say('處理中，請稍候');state.busy=true;button.disabled=true;timingControls();cueStampEdit?.refresh();state.currentCue?.refresh();state.cuePosition?.refresh();state.deliveryNavigation?.refresh();state.audioAcceptance?.refresh();state.audioAcceptanceReview?.refresh();state.deliveryPackage?.refresh();state.deliveryImport?.refresh();state.textVerification?.refresh();
  try{await task(current);}catch(error){if(current())say(error.message,true);}
  finally{const cancelled=operationGate.cancelled(job);if(!cancelled&&!current()){markDirty(scope);say('處理期間輸入有修改，請重新建立成果');}operationGate.finish(job);state.busy=false;button.disabled=false;timingControls();cueStampEdit?.refresh();state.currentCue?.refresh();state.cuePosition?.refresh();state.deliveryNavigation?.refresh();state.audioAcceptance?.refresh();state.audioAcceptanceReview?.refresh();state.deliveryPackage?.refresh();state.deliveryImport?.refresh();state.textVerification?.refresh();if(cancelled)say('已取消本次等待；目前編修與上一份成果保留，可重新建立。');state.operationControl?.finishFocus(button);}
}
function cancelRun(){if(!operationGate.cancel())return;say('正在取消等待；目前編修與上一份成果保留。');timingControls();}
function setFiles(files,note,dirty=false,inputIndependent=false,deliveryLabel=null){state.resultRevisions[state.tab]=(state.resultRevisions[state.tab]||0)+1;state.files=files;state.bundles[state.tab]={files,note,dirty,inputIndependent,...(deliveryLabel===null?{}:{deliveryLabel})};const select=$('output-file');select.replaceChildren();Object.keys(files).forEach(name=>{const option=document.createElement('option');option.value=name;option.textContent=name;select.append(option);});select.disabled=false;$('download').disabled=dirty;$('output-note').textContent=note+(dirty?'（有修改尚未重新驗證）':'');previewOutput();state.deliveryNavigation?.refresh();state.audioAcceptance?.refresh();state.audioAcceptanceReview?.refresh();state.deliveryPackage?.refresh();state.deliveryImport?.refresh();state.textVerification?.refresh();}
function markDirty(tab){draftRetention.refresh(tab);if(tab==='music'){arrangementController?.refresh();musicReadyController?.refresh();}if(tab==='storyboard'){storyboardSearchController?.refresh();storyboardDurationController?.refresh();storyboardReadyController?.refresh();storyboardTimingController?.refresh();}if(['music','storyboard'].includes(tab))stalePlanningReview(tab);if(tab==='audio'){staleAudioReview();state.audioAcceptanceReview?.refresh();}if(tab==='lyrics'){cueStampEdit?.refresh();lyricsSearchController?.refresh();storyboardSearchController?.refresh();staleLyricsExportReview();lyricsExportController?.invalidate();staleLyricsReview();lyricsReviewController?.invalidate();lyricsMediaController?.refresh();const pending=timingReading||timingReady;timingController?.invalidate();if(pending)timingSay('歌詞有修改，請重新預覽整批校時。');}state.revisions[tab]=(state.revisions[tab]||0)+1;const saved=state.bundles[tab];if(!saved||saved.inputIndependent){state.deliveryNavigation?.refresh();state.audioAcceptance?.refresh();state.audioAcceptanceReview?.refresh();state.deliveryPackage?.refresh();state.deliveryImport?.refresh();state.textVerification?.refresh();return;}saved.dirty=true;if(state.tab===tab){$('download').disabled=true;$('output-note').textContent=saved.note+'（有修改尚未重新驗證）';}state.deliveryNavigation?.refresh();state.audioAcceptance?.refresh();state.audioAcceptanceReview?.refresh();state.deliveryPackage?.refresh();state.deliveryImport?.refresh();state.textVerification?.refresh();}
document.querySelector('.editor').addEventListener('input',event=>{
  if(event.target.dataset.viewControl||event.target.id==='lyrics-file')return;
  const panel=event.target.closest('.panel');if(!panel)return;
  markDirty(panel.id);
  if(panel.id==='storyboard')refreshShotOverview();
  if(['lyrics-source','lyrics-format'].includes(event.target.id))lyricsImportController?.cancel();
  if(panel.id==='lyrics'&&event.target.closest('#cues'))tick();
});
function clearOutput(){state.resultRevisions[state.tab]=(state.resultRevisions[state.tab]||0)+1;state.files={};$('output-file').replaceChildren(new Option('尚無檔案',''));$('output-file').disabled=true;$('download').disabled=true;$('output-content').value='';$('output-preview-note').textContent='';$('output-note').textContent='建立工作包後，實際成果會出現在這裡。';state.deliveryNavigation?.refresh();state.audioAcceptance?.refresh();state.audioAcceptanceReview?.refresh();state.deliveryPackage?.refresh();state.deliveryImport?.refresh();state.textVerification?.refresh();}
function previewOutput(){const name=$('output-file').value,preview=MusicDeliveryReview.excerpt(Object.hasOwn(state.files,name)?state.files[name]:null);$('output-content').value=preview.text;$('output-preview-note').textContent=!preview.present?'尚無選定檔案':preview.truncated?'內容過長，預覽只顯示開頭；原文下載與 ZIP 保留全文。':'完整文字預覽；文字框只供閱讀，原文下載保持換行。';}
$('output-file').onchange=()=>{previewOutput();state.textVerification?.refresh();};
textDownloader.bind($('export-form'),{select:()=>{const name=$('output-file').value;if(state.busy)throw Error('目前操作尚未完成，請稍候');if(state.bundles[state.tab]?.dirty)throw Error('輸入有修改，請重新建立成果後下載');if(!Object.hasOwn(state.files,name))throw Error('請先選擇本輪成果檔案');return {name,content:state.files[name]};},onSent:()=>say('已送出原文下載，請確認瀏覽器保存的檔案。'),onError:error=>say(error.message,true)});
state.textVerification=MusicTextVerificationDOM.bind(document,{capture:()=>{const name=$('output-file').value;return {scope:state.tab,revision:state.resultRevisions[state.tab]||0,busy:state.busy,dirty:!!state.bundles[state.tab]?.dirty,visible:!$('output-region').hidden&&$('output-region').isConnected,source:Object.hasOwn(state.files,name)?{name,content:state.files[name]}:null};},
  onReport:report=>say(report.matched?'已核對選定檔案與目前原文完全一致；請保留這份檔案。':'選定檔案與目前原文有差異；成果與編修保留。',!report.matched),
  onError:error=>say(error.message+'；目前成果與編修保留',true)});
document.querySelectorAll('[data-tab]').forEach(button=>button.onclick=()=>{if(state.busy){say('目前操作尚未完成，請稍候');return;}state.tab=button.dataset.tab;document.querySelectorAll('.panel').forEach(section=>section.hidden=section.id!==state.tab);document.querySelectorAll('[data-tab]').forEach(b=>{b.classList.toggle('active',b===button);if(b===button)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current');});const saved=state.bundles[state.tab];if(saved)setFiles(saved.files,saved.note,saved.dirty,saved.inputIndependent,saved.deliveryLabel);else clearOutput();say(saved?.dirty?'有修改尚未重新驗證，請重新建立成果':'準備開始');state.currentCue?.refresh();state.cuePosition?.refresh();lyricsSearchController?.refresh();storyboardSearchController?.refresh();});
function renderSections(sections,ids){const keys=rowIds(sections,ids);$('arrangement').innerHTML=sections.map((s,i)=>`<tr data-history-id="${esc(keys[i])}"><td>${field(s.name,`段落 ${i+1} 名稱`)}</td><td>${field(s.bars,`段落 ${i+1} 小節`,'number')}</td><td>${field(s.energy,`段落 ${i+1} 能量`,'number')}</td><td>${field(s.focus,`段落 ${i+1} 任務`,'text',true)}</td><td>${field(s.texture,`段落 ${i+1} 聲音`,'text',true)}</td><td><button type="button" data-remove-section="${i}" aria-label="刪除段落 ${i+1}">刪除</button></td></tr>`).join('');[...$('arrangement').children].forEach((row,i)=>['name','bars','energy','focus','texture'].forEach((key,j)=>writeValue(row.querySelectorAll('input')[j],sections[i][key])));$('arrangement').querySelectorAll('[data-remove-section]').forEach((b,i)=>b.onclick=()=>deleteEntry('arrangement',i));arrangementController?.refresh();}
function requirementValues(id){return [...$(id).querySelectorAll('textarea')].map(input=>readValue(input));}
function clearRequirementError(id){
  $(id+'-error').hidden=true;$(id+'-error').textContent='';
  $(id).querySelectorAll('.requirement-error').forEach(note=>{note.hidden=true;note.textContent='';});
  $(id).querySelectorAll('textarea').forEach(input=>{input.removeAttribute('aria-invalid');const ids=(input.getAttribute('aria-describedby')||'').split(/\s+/).filter(x=>x.startsWith('raw-value-note-'));if(ids.length)input.setAttribute('aria-describedby',ids.join(' '));else input.removeAttribute('aria-describedby');});
  if(id==='music-deliverables')$('deliverable-add').removeAttribute('aria-describedby');
}
function showRequirementIssue(issue){
  const id=issue.key==='avoid'?'music-avoid':'music-deliverables';
  const input=issue.index===null?$('deliverable-add'):$(id).querySelectorAll('textarea')[issue.index];
  const note=issue.index===null?$(id+'-error'):input.closest('.requirement-item').querySelector('.requirement-error');
  note.textContent=issue.message;note.hidden=false;
  if(input.tagName==='TEXTAREA')input.setAttribute('aria-invalid','true');
  input.setAttribute('aria-describedby',[(input.getAttribute('aria-describedby')||''),note.id].filter(Boolean).join(' '));input.focus();say(issue.message,true);
}
function renderRequirements(id,items,label,ids){
  const keys=rowIds(items,ids);
  clearRequirementError(id);
  $(id).innerHTML=items.map((item,index)=>`<div class="requirement-item" data-history-id="${esc(keys[index])}"><label>${label} ${index+1}<textarea rows="2" aria-label="${label} ${index+1}">${esc(item)}</textarea></label><p id="${id}-item-error-${index+1}" class="requirement-error" role="status" aria-live="polite" hidden></p><button type="button" class="subtle" aria-label="刪除${label} ${index+1}">刪除</button></div>`).join('');
  $(id).querySelectorAll('textarea').forEach((control,i)=>writeValue(control,items[i]));
  $(id).querySelectorAll('button').forEach((button,index)=>button.onclick=()=>{
    deleteEntry(id,index);
  });
}
function addRequirement(id,label){if(state.busy){say('目前操作尚未完成，請稍候');return;}const items=requirementValues(id);if(items.length>=100){say(`${label}最多 100 項`,true);return;}
  const ids=entriesFor(id).map(e=>e.id);items.push('');ids.push(`row-${++rowSequence}`);renderRequirements(id,items,label,ids);markDirty('music');focusEntry(id,items.length-1,'new');}
$('avoid-add').onclick=()=>addRequirement('music-avoid','避免事項');
$('deliverable-add').onclick=()=>addRequirement('music-deliverables','交付項目');
['music-avoid','music-deliverables'].forEach(id=>$(id).addEventListener('input',()=>clearRequirementError(id)));
function loadMusic(){clearDeletionHistory('music');const b=structuredClone(state.examples.music);[['music-title',b.title],['music-hook',b.memory_hook],['music-theme',b.theme],['music-style',b.style],['music-vocal',b.vocal],['music-audience',b.audience],['music-bpm',b.bpm],['music-beats',b.beats_per_bar],['music-lyrics',b.existing_lyrics],['music-language',b.language]].forEach(([id,value])=>writeValue($(id),value));renderSections(b.arrangement);renderRequirements('music-avoid',b.avoid,'避免事項');renderRequirements('music-deliverables',b.deliverables,'交付項目');$('music-visual').hidden=true;}
function refreshExampleControls(){
  for(const id of ['music-example','mv-example'])$(id).disabled=state.busy||state.examples===null;
}
function exampleAllowed(){
  if(state.busy){say('目前操作尚未完成，請稍候');return false;}
  if(state.examples===null){say('範例尚未讀取完成；請稍候，讀取失敗時可重新載入頁面。',true);return false;}
  return true;
}
$('music-example').onclick=()=>{if(!exampleAllowed())return;loadMusic();markDirty('music');say('已載入本次原創合成範例，可直接修改');};
function renderMusicOrder(view){
  const select=$('section-order'),selected=select.value,entries=entriesFor('arrangement');
  select.replaceChildren();entries.forEach((e,i)=>select.append(new Option(`${i+1} · ${e.value.name||'未命名段落'}`,e.id)));
  if(entries.some(e=>e.id===selected))select.value=selected;
  if(!entries.length)select.append(new Option('尚無段落',''));
  select.disabled=state.busy||!entries.length;
  const index=entries.findIndex(e=>e.id===select.value);
  $('section-earlier').disabled=state.busy||index<=0;
  $('section-later').disabled=state.busy||index<0||index>=entries.length-1;
  $('section-order-undo').disabled=state.busy||!view.canUndo;
  [...$('arrangement').children].forEach(row=>row.toggleAttribute('data-section-selected',row.dataset.historyId===select.value));
  $('section-order-note').textContent=view.stale?'段落列或順序已改動，先前移動不可撤回；目前編修保留。':view.record?
    `段落 ${view.record.from+1} → ${view.record.to+1}；可撤回最近一次移動，後續欄位編修保留。`:
    '選擇一段再移動；順序依表格由上到下，文字、小節與能量一起保留。';
}
arrangementController=MusicArrangement.createController({capture:()=>entriesFor('arrangement'),apply:entries=>writeEntries('arrangement',entries),onState:renderMusicOrder});
function moveMusicSection(delta){
  if(state.busy){say('目前操作尚未完成，請稍候');return;}
  try{const view=arrangementController.move($('section-order').value,delta);markDirty('music');
    say(`已把段落 ${view.record.from+1} 移至 ${view.record.to+1}；請重新建立歌曲成果與分鏡起稿`);
    const action=$(delta<0?'section-earlier':'section-later');(action.disabled?$('section-order'):action).focus();
  }catch(e){say(e.message,true);}
}
$('section-order').onchange=()=>arrangementController.refresh();
$('section-earlier').onclick=()=>moveMusicSection(-1);
$('section-later').onclick=()=>moveMusicSection(1);
$('section-order-undo').onclick=()=>{
  if(state.busy){say('目前操作尚未完成，請稍候');return;}
  try{const record=arrangementController.undo();$('section-order').value=record.id;markDirty('music');
    $('section-order').focus();say('已撤回最近一次段落移動；後續欄位編修保留，請重新建立成果');
  }catch(e){say(e.message,true);}
};
$('section-add').onclick=()=>{if(state.busy){say('目前操作尚未完成，請稍候');return;}try{
  const entries=entriesFor('arrangement');if(entries.length>=collections.arrangement.limit)throw Error('段落最多 40 列');
  const id=`row-${++rowSequence}`;entries.push({id,value:{name:'新段落',bars:'8',energy:'3',focus:'',texture:''}});
  writeEntries('arrangement',entries);$('section-order').value=id;markDirty('music');focusEntry('arrangement',entries.length-1);
}catch(e){say(e.message,true);}};
function musicIssueTarget(issue){
  if(issue.scope==='fields')return issue.field==='sections'?$('section-add'):issue.field==='deliverables'?$('deliverable-add'):$(issue.field);
  if(issue.scope==='sections')return $('arrangement').children[issue.row-1]?.querySelectorAll('input')[MusicEditor.draftRows.music.columns.indexOf(issue.field)];
  return $(issue.scope==='avoid'?'music-avoid':'music-deliverables').children[issue.row-1]?.querySelector('textarea');
}
function clearMusicReadyMarks(){document.querySelectorAll('[data-music-ready-invalid]').forEach(x=>{x.removeAttribute('data-music-ready-invalid');x.removeAttribute('aria-invalid');});}
function locateMusicIssue(index){
  const issue=musicReadyController.locate(index);if(!issue)return;
  const input=musicIssueTarget(issue);if(!input)return;
  if(issue.scope==='sections'){$('section-order').value=$('arrangement').children[issue.row-1].dataset.historyId;arrangementController.refresh();}
  input.focus();
}
function renderMusicReady({report,stale}){
  clearMusicReadyMarks();const box=$('music-ready-box'),list=$('music-ready-issues'),stats=$('music-ready-stats');
  box.classList.toggle('stale',stale);list.replaceChildren();stats.replaceChildren();stats.hidden=!report;
  $('music-ready-check').disabled=state.busy;
  $('music-ready-report').disabled=state.busy;
  if(!report){$('music-ready-status').textContent='留白段落也能檢查；不補寫創作，不修改表單。';return;}
  for(const text of [`${report.filledSections} / ${report.totalSections} 段欄位已填`,`待辦 ${report.issueCount} 項`]){const p=document.createElement('p');p.textContent=text;stats.append(p);}
  $('music-ready-status').textContent=stale?'歌曲或段落順序已編修；請重新檢查後再定位。':report.issueCount?
    `${report.issueCount} 項待辦；點選可定位原欄位。${report.issueCount>20?' 顯示前20項。':''}`:
    '目前欄位沒有待辦；總時長、完整資料及實唱／實聽仍須建立與驗證。';
  report.issues.slice(0,20).forEach((issue,index)=>{
    const li=document.createElement('li'),button=document.createElement('button');button.type='button';button.className='subtle';
    const prefix=issue.scope==='sections'?`段落 ${issue.row} · `:issue.scope==='avoid'?`避免事項 ${issue.row} · `:issue.scope==='deliverables'?`交付項目 ${issue.row} · `:'';
    button.textContent=prefix+(MusicReadiness.labels[issue.field]||issue.field)+'：'+issue.message;button.disabled=stale||state.busy;
    button.onclick=()=>locateMusicIssue(index);li.append(button);list.append(li);
  });
  if(!stale)report.issues.forEach(issue=>{const input=musicIssueTarget(issue);if(input){input.dataset.musicReadyInvalid='true';input.setAttribute('aria-invalid','true');}});
}
musicReadyController=MusicReadiness.createController({capture:()=>capturePanel('music'),captureIds:()=>entriesFor('arrangement').map(e=>e.id),onState:renderMusicReady});
function checkMusicReady(){const view=musicReadyController.check();if(!view.report.issueCount)return true;locateMusicIssue(0);say(`${view.report.issueCount} 項歌曲欄位待辦，已定位第一項`,true);return false;}
$('music-ready-check').onclick=()=>{if(state.busy)return;try{checkMusicReady();}catch(error){say(error.message,true);}};
$('music-ready-report').onclick=()=>run($('music-ready-report'),async current=>{
  const panel=capturePanel('music');musicReadyController.check();
  const reply=await api('/api/music-review',{panel},false,current.signal);if(!current())return;
  const accepted=MusicReadiness.checkedResult(panel,reply);
  $('music-visual').hidden=true;
  setFiles(accepted.files,`歌曲欄位檢查 · 待辦 ${accepted.data.issue_count} 項`);
  say('歌曲待辦報告已建立；仍須完整建立與實唱／實聽驗證');
});
$('music-form').onsubmit=event=>{event.preventDefault();if(state.busy)return;
  clearRequirementError('music-avoid');clearRequirementError('music-deliverables');
  try{if(!checkMusicReady())return;}catch(error){say(error.message,true);return;}
  run(event.submitter,isCurrent=>MusicPlanReview.inspect({operation:'music',brief:MusicPlanning.planningBrief(captureDraft(),'music'),isCurrent,
    request:(operation,brief)=>api('/api/'+operation,brief,false,isCurrent.signal),onResult:applyPlanningResult}));};
function stalePlanningReview(scope){
  const box=$(scope==='music'?'music-visual':'mv-visual'),note=box.querySelector('[data-plan-stale]');if(!note||box.hidden)return;
  note.hidden=false;box.classList.add('stale');box.querySelector('[data-plan-status]').textContent='上一份設計';
  const source=box.querySelector('.plan-source-note');if(source)source.textContent='已核對上一份需求；本次編修尚未核對。';
}
function planText(tag,text,className){const node=document.createElement(tag);node.textContent=text;if(className)node.className=className;return node;}
function renderPlanningReview(d){
  const box=$(d.operation==='music'?'music-visual':'mv-visual');box.replaceChildren();box.classList.remove('stale');
  const heading=document.createElement('div');heading.className='plan-heading';
  heading.append(planText('h3',d.operation==='music'?'歌曲設計摘要':'分鏡設計摘要'));
  const status=planText('span',d.status,'plan-outcome');status.dataset.planStatus='true';heading.append(status);box.append(heading);
  const stale=planText('p','這是上一份設計，輸入已修改；重新建立後才能代表目前內容。','plan-stale-note');stale.dataset.planStale='true';stale.hidden=true;stale.setAttribute('role','status');box.append(stale);
  box.append(planText('p',d.title,'plan-title'));
  if(d.sourceChecked)box.append(planText('p','已核對本次需求；成果仍需人工審查。','hint plan-source-note'));
  const facts=document.createElement('div');facts.className='facts';
  const values=d.operation==='music'?[[d.duration+' 秒','估計總長'],[d.bars+' 小節',d.bpm+' BPM · 每小節 '+d.beats+' 拍']]:[[d.duration+' 秒','規劃總長'],[d.shots.length+' 鏡',d.fps+' FPS · '+d.ratio],[d.frames.totalFrames+' 幀','完整覆蓋；結束影格不含']];
  for(const [value,label] of values){const fact=document.createElement('div');fact.className='fact';fact.append(planText('strong',value),planText('span',label));facts.append(fact);}box.append(facts);
  box.append(planText('p',d.operation==='music'?'記憶點：'+d.hook:'時間與資料已檢查；尚未渲染畫面。','plan-context'));
  if(d.operation==='storyboard')box.append(planText('p',`影格範圍 [0, ${d.frames.totalFrames})。最近整數影格，正好半幀取偶數；秒數保持輸入，須以實際音檔與畫面核對。${d.frames.declared?'':'舊報告未宣告影格版本；依秒數與 FPS 核對。'}`,'hint plan-frame-note'));
  box.append(planText('h4','待人工審查'));
  box.append(planText('p',d.notes.length?d.notes.length+' 項設計提醒；可以保留為有意識的創作選擇。':'本次沒有資料提醒；仍需'+(d.operation==='music'?'實唱與實聽。':'審查實際畫面。'),'hint'));
  appendNotes(box,d.notes);
  const details=document.createElement('details');details.className='plan-details';
  details.append(planText('summary',d.operation==='music'?'段落能量與任務 · '+d.sections.length+' 段':'逐鏡母題與提醒 · '+d.shots.length+' 鏡'));
  const list=document.createElement('ol');list.className='plan-items';
  for(const item of d.operation==='music'?d.sections:d.shots){
    const li=document.createElement('li');li.append(planText('h4',d.operation==='music'?item.section:'鏡頭 '+item.shot+' · '+item.section));
    li.append(planText('p',item.start+'–'+item.end+' 秒'+(d.operation==='music'?' · '+item.bars+' 小節 · 能量 '+item.energy+' / 5':''),'plan-time'));
    if(d.operation==='music'){
      const track=document.createElement('div');track.className='energy-track';track.setAttribute('role','meter');track.setAttribute('aria-label',item.section+' 設計能量');track.setAttribute('aria-valuemin','1');track.setAttribute('aria-valuemax','5');track.setAttribute('aria-valuenow',String(item.energy));
      const fill=document.createElement('div');fill.className='energy-fill';fill.style.width=(item.energy*20)+'%';track.append(fill);li.append(track);
      li.append(planText('p','敘事任務：'+item.focus),planText('p','聲音配置：'+item.texture));
    }else{
      li.append(planText('p',`影格 [${item.start_frame}, ${item.end_frame_exclusive}) · ${item.end_frame_exclusive-item.start_frame} 幀；結束不含。`,'plan-frame-range'));
      li.append(planText('p','母題：'+item.motif+' · '+item.motif_state),planText('p','敘事用途：'+item.purpose));
      const notes=d.notes.filter(n=>n.shot===item.shot);if(notes.length)appendNotes(li,notes);
    }
    list.append(li);
  }
  details.append(list);box.append(details);
  if(d.operation==='storyboard'){
    const motifs=document.createElement('details');motifs.className='plan-details';motifs.append(planText('summary','母題使用位置 · '+d.motifs.length+' 個'));
    for(const m of d.motifs)motifs.append(planText('p',m.name+'：'+m.meaning+' · '+(m.shots.length?'鏡頭 '+m.shots.join('、'):'尚未使用')));box.append(motifs);
  }
  box.append(planText('p',d.operation==='music'?'時間假設固定速度、沒有弱起或自由速度。能量是設計值，尚未生成音樂。':'母題與連戲為資料提醒，沒有自動導演評分或媒體生成。','hint'));box.hidden=false;
}
function applyPlanningResult(result,review){
  renderPlanningReview(review);setFiles(result.files,(review.operation==='music'?'歌曲設計':'母題分鏡')+' · '+review.title+' · '+review.duration+' 秒');
  say('設計資料已建立，'+review.fileCount+' 個檔案；'+(review.notes.length?review.notes.length+' 項待人工審查':'仍需'+(review.operation==='music'?'實唱與實聽':'審查實際畫面')));
}
function appendNotes(box,notes){const ul=document.createElement('ul');ul.className='review-list';notes.forEach(note=>{const li=document.createElement('li');li.textContent=typeof note==='string'?note:`${note.shot?'鏡頭 '+note.shot+'：':''}${note.message}`;ul.append(li);});box.append(ul);}
const shotFields=[['section','歌曲段落'],['purpose','敘事用途'],['visual','畫面動作'],['camera','鏡頭運動'],['transition','尾鏡與轉場'],['motif_state','母題狀態'],['character_state','人物狀態'],['change_reason','變化理由']];
function getMotifs(){return [...$('motifs').children].map(row=>({id:row.dataset.motifId,name:readValue(row.querySelector('[data-motif="name"]')),meaning:readValue(row.querySelector('[data-motif="meaning"]'))}));}
function rawShots(){return [...$('shots').children].map(article=>Object.fromEntries([...article.querySelectorAll('[data-key]')].map(input=>[input.dataset.key,readValue(input)])));}
function motifOptions(motifs,selected){return '<option value="">請選擇母題</option>'+motifs.map((m,i)=>`<option value="${esc(m.id)}" ${m.id===selected?'selected':''}>${esc(m.name||'未命名母題 '+(i+1))}</option>`).join('');}
function refreshMotifChoices(){const motifs=getMotifs();$('shots').querySelectorAll('[data-key="motif_id"]').forEach(select=>{const selected=select.value;select.innerHTML=motifOptions(motifs,selected);});refreshShotOverview();}
function renderMotifs(motifs){
  $('motifs').innerHTML=motifs.map((m,i)=>`<article class="motif" data-history-id="${esc(m.id)}" data-motif-id="${esc(m.id)}"><div class="shot-header"><h3>母題 ${i+1}</h3><button class="subtle" data-remove-motif="${esc(m.id)}" aria-label="刪除母題 ${i+1}">刪除</button></div><div class="fields"><label>母題名稱<input data-motif="name" aria-label="母題 ${i+1} 名稱" value="${esc(m.name)}"></label><label>初始意義<input data-motif="meaning" aria-label="母題 ${i+1} 初始意義" value="${esc(m.meaning)}"></label></div></article>`).join('');
  [...$('motifs').children].forEach((row,i)=>['name','meaning'].forEach(key=>writeValue(row.querySelector(`[data-motif="${key}"]`),motifs[i][key])));
  $('motifs').querySelectorAll('[data-remove-motif]').forEach(button=>button.onclick=()=>{
    const id=button.dataset.removeMotif,used=rawShots().flatMap((s,i)=>s.motif_id===id?[i+1]:[]);
    if(used.length){say(`母題仍用於鏡頭 ${used.join('、')}，請先替這些鏡頭選擇其他母題`,true);return;}
    deleteEntry('motifs',getMotifs().findIndex(m=>m.id===id));
  });
}
$('motifs').addEventListener('input',refreshMotifChoices);
$('motif-add').onclick=()=>{if(state.busy){say('目前操作尚未完成，請稍候');return;}const motifs=getMotifs();if(motifs.length>=30){say('最多可規劃 30 個母題',true);return;}motifs.push({id:MusicEditor.nextMotifId([...motifs,...deletionHistory.reserved('storyboard','motifs').map(id=>({id}))]),name:'',meaning:''});renderMotifs(motifs);refreshMotifChoices();markDirty('storyboard');focusEntry('motifs',motifs.length-1,'new');say('已新增母題，填入意義後可在鏡頭中選擇');};
function shotOpenStates(){return [...$('shots').querySelectorAll('details')].map(details=>details.open);}
function refreshShotOverview(){
  const overview=MusicEditor.shotOverview(rawShots(),getMotifs()),select=$('shot-jump'),selected=select.value;
  select.replaceChildren();overview.forEach(item=>select.append(new Option(`鏡頭 ${item.index+1} · ${item.label}`,String(item.index))));
  if([...select.options].some(option=>option.value===selected))select.value=selected;
  select.disabled=overview.length===0;$('shot-go').disabled=overview.length===0;
  const incomplete=overview.filter(item=>!item.valid).length;
  $('shot-count').textContent=`${overview.length} 鏡${incomplete?' · '+incomplete+' 鏡時間未完成':''}`;
  [...$('shots').children].forEach((article,i)=>article.querySelector('[data-shot-caption]').textContent=overview[i].label);
  storyboardDurationController?.refresh();
  storyboardReadyController?.refresh();
  storyboardTimingController?.refresh();
}
function focusShot(index,key){
  const article=$('shots').children[index];if(!article)return;
  article.querySelector('details').open=true;
  article.scrollIntoView({block:'start',behavior:'auto'});
  const target=key?article.querySelector(`[data-key="${key}"]`):article.querySelector('summary');
  target.focus({preventScroll:true});
}
$('shots-collapse').onclick=()=>{$('shots').querySelectorAll('details').forEach(d=>d.open=false);say('所有鏡頭已收合；編修欄位與草稿完整保留');};
$('shots-expand').onclick=()=>{$('shots').querySelectorAll('details').forEach(d=>d.open=true);say('所有鏡頭已展開');};
$('shot-go').onclick=()=>{focusShot(Number($('shot-jump').value));say(`已定位鏡頭 ${Number($('shot-jump').value)+1}`);};
function renderShots(shots,openStates=shots.map((_,i)=>i===0),ids){
  const motifs=getMotifs(),keys=rowIds(shots,ids);
  $('shots').innerHTML=shots.map((s,i)=>`<article class="shot" data-history-id="${esc(keys[i])}"><div class="shot-header"><h3>鏡頭 ${i+1}</h3><button class="subtle" data-remove-shot="${i}" aria-label="刪除鏡頭 ${i+1}" aria-describedby="shot-delete-note">刪除</button></div><details ${openStates[i]?'open':''}><summary aria-label="鏡頭 ${i+1} 摘要"><span data-shot-caption></span></summary><div class="shot-editor"><div class="fields">${['start','end'].map((key,j)=>`<label>${j?'結束':'開始'}（秒）<input data-key="${key}" type="text" inputmode="decimal" data-raw-number="true" value="${esc(s[key])}" aria-label="鏡頭 ${i+1} ${j?'結束':'開始'}"></label>`).join('')}</div><label>使用母題<select data-key="motif_id" aria-label="鏡頭 ${i+1} 使用母題">${motifOptions(motifs,s.motif_id)}</select></label>${shotFields.map(([key,label])=>`<label>${label}<textarea data-key="${key}" rows="2" aria-label="鏡頭 ${i+1} ${label}">${esc(s[key])}</textarea></label>`).join('')}<label>畫面方向<select data-key="screen_direction" aria-label="鏡頭 ${i+1} 畫面方向">${[['left','向左'],['right','向右'],['neutral','正面／中性']].map(([value,label])=>`<option value="${value}" ${value===s.screen_direction?'selected':''}>${label}</option>`).join('')}</select></label></div></details></article>`).join('');
  [...$('shots').children].forEach((row,i)=>row.querySelectorAll('[data-key]').forEach(control=>writeValue(control,shots[i][control.dataset.key])));
  storyboardSearchController?.clear();refreshShotOverview();
  $('shots').querySelectorAll('[data-remove-shot]').forEach(button=>button.onclick=()=>{
    deleteEntry('shots',Number(button.dataset.removeShot));
  });
}
function getShots(){
  const motifs=new Map(getMotifs().map(m=>[m.id,m.name]));
  return rawShots().map((s,i)=>{if(!s.start.trim()||!s.end.trim()){focusShot(i,!s.start.trim()?'start':'end');throw Error(`鏡頭 ${i+1} 時間不可空白`);}if(!s.motif_id||!motifs.has(s.motif_id)){focusShot(i,'motif_id');throw Error(`鏡頭 ${i+1} 請先選擇母題`);}const {motif_id,...shot}=s;return {...shot,motif:motifs.get(motif_id)};});
}
function renderStoryboardDuration(view){
  $('mv-duration-declared').textContent=view.declaredText;
  $('mv-duration-tail').textContent=view.candidateText;
  $('mv-duration-note').textContent=view.note;
  $('mv-duration-check').dataset.status=view.status;
  $('mv-duration-adopt').disabled=state.busy||!view.canAdopt;
  $('mv-duration-undo').disabled=state.busy||!view.canUndo;
}
storyboardDurationController=MusicStoryboardDuration.createController({
  capture:()=>({duration:readValue($('mv-duration')),fps:readValue($('mv-fps')),shots:entriesFor('shots').map(e=>({id:e.id,start:e.value.start,end:e.value.end}))}),
  apply:value=>{writeValue($('mv-duration'),value);markDirty('storyboard');},onState:renderStoryboardDuration});
for(const action of ['adopt','undo'])$('mv-duration-'+action).onclick=()=>{
  if(state.busy){say('目前操作尚未完成，請稍候');return;}
  try{const view=storyboardDurationController[action]();say(view.note);}catch(e){say(e.message,true);}
};
function loadMv(){
  storyboardDurationController?.clear();
  storyboardReadyController?.clear();
  clearDeletionHistory('storyboard');
  const brief=structuredClone(state.examples.storyboard);
  [['mv-title',brief.title],['mv-duration',brief.duration_seconds],['mv-fps',brief.fps],['mv-ratio',brief.aspect_ratio],['mv-style',brief.visual_style],['mv-anchor',brief.character_anchor]].forEach(([id,value])=>writeValue($(id),value));
  const motifs=brief.motifs.map((m,i)=>({...m,id:`motif-${i+1}`}));renderMotifs(motifs);
  renderShots(brief.shots.map(s=>({...s,motif_id:motifs.find(m=>m.name===s.motif)?.id||''})));$('mv-visual').hidden=true;
}
$('mv-example').onclick=()=>{if(!exampleAllowed())return;loadMv();markDirty('storyboard');say('已載入本次原創合成分鏡');};
$('shot-add').onclick=()=>{if(state.busy){say('目前操作尚未完成，請稍候');return;}try{const shots=rawShots(),openStates=shotOpenStates(),ids=entriesFor('shots').map(e=>e.id),last=shots.at(-1),start=last?.end?.trim()?MusicPlanningValues.number(last.end,'最後一鏡結束'):0;if(shots.length>=collections.shots.limit){say('鏡頭最多 1000 列',true);return;}if(!Number.isFinite(start)){say('最後一鏡結束時間需為數字',true);return;}shots.push({start:String(start),end:String(start+6),section:'',purpose:'',visual:'',camera:'',transition:'',motif_id:'',motif_state:'',character_state:last?.character_state||'',change_reason:'',screen_direction:'neutral'});openStates.push(true);ids.push(`row-${++rowSequence}`);renderShots(shots,openStates,ids);markDirty('storyboard');focusEntry('shots',shots.length-1,'new');say('已新增鏡頭，作品總長保留；請選擇母題、填入創作，再核對鏡尾。');}catch(error){say(error.message,true);}};
$('mv-build').onclick=()=>run($('mv-build'),isCurrent=>{
  const view=storyboardReadyController.check();
  if(view.report.issueCount){locateStoryboardIssue(0);throw Error('分鏡創作有待辦；已定位第一個欄位，目前內容保留。');}
  if(!checkStoryboardTiming())throw Error('分鏡時間有待辦；已定位第一個欄位，目前內容保留。');
  const brief=MusicPlanning.planningBrief(captureDraft(),'storyboard');brief.shots=getShots();
  return MusicPlanReview.inspect({operation:'storyboard',brief,isCurrent,request:(operation,selected)=>api('/api/'+operation,selected,false,isCurrent.signal),onResult:applyPlanningResult});
});
function storyboardIssueTarget(issue){
  if(issue.scope==='fields')return $(issue.field==='motifs'?'motif-add':issue.field==='shots'?'shot-add':issue.field);
  if(issue.scope==='motifs')return $('motifs').children[issue.row-1]?.querySelector(`[data-motif="${issue.field}"]`);
  return $('shots').children[issue.row-1]?.querySelector(`[data-key="${issue.field}"]`);
}
function clearStoryboardIssueMarks(){
  document.querySelectorAll('[data-storyboard-ready-invalid]').forEach(e=>{e.removeAttribute('data-storyboard-ready-invalid');if(!e.hasAttribute('data-storyboard-timing-invalid'))e.removeAttribute('aria-invalid');});
}
function locateStoryboardIssue(index){
  const issue=storyboardReadyController.locate(index);if(!issue){say('內容已有修改，請重新檢查創作待辦；目前內容保留。');return;}
  const target=storyboardIssueTarget(issue);if(!target)return;
  if(issue.scope==='shots')focusShot(issue.row-1,issue.field);
  else{target.scrollIntoView({block:'nearest'});target.focus({preventScroll:true});}
}
function renderStoryboardReady({report,stale}){
  $('mv-ready-report').disabled=state.busy;
  clearStoryboardIssueMarks();const box=$('mv-ready-box'),list=$('mv-ready-issues'),stats=$('mv-ready-stats');
  box.classList.toggle('stale',stale);list.replaceChildren();stats.replaceChildren();stats.hidden=!report;
  $('mv-ready-status').textContent=!report?'時間起稿或留白鏡頭也能檢查；不補寫創作，不修改表單。':stale?'內容已有修改；下方是上一份待辦，請重新檢查目前分鏡。':report.issueCount?`共${report.issueCount}項創作待辦；補齊後再建立分鏡包。`:'欄位待辦已補齊；請建立分鏡包，繼續檢查時間、影格與連戲。';
  if(!report)return;
  for(const label of [`共${report.totalShots}鏡`,`單鏡待辦已補齊${report.filledShots}鏡`,`共${report.totalMotifs}個母題`]){const p=document.createElement('p');p.textContent=label;stats.append(p);}
  if(!stale)for(const issue of report.issues){const target=storyboardIssueTarget(issue);if(target){target.setAttribute('aria-invalid','true');target.setAttribute('data-storyboard-ready-invalid','true');}}
  report.issues.slice(0,20).forEach((issue,index)=>{
    const li=document.createElement('li'),button=document.createElement('button');button.type='button';button.className='subtle';button.disabled=stale||state.busy;
    button.textContent=(issue.scope==='shots'?`鏡頭 ${issue.row} · `:issue.scope==='motifs'?`母題 ${issue.row} · `:'')+MusicStoryboardReadiness.labels[issue.field]+'：'+issue.message+(issue.relatedRow?`（母題 ${issue.relatedRow}）`:'');
    button.onclick=()=>locateStoryboardIssue(index);li.append(button);list.append(li);
  });
  if(report.issueCount>20){const li=document.createElement('li');li.textContent=`此處列前20項；全部${report.totalShots}鏡與${report.totalMotifs}個母題已檢查。修正後重查；待辦明細最多保留200項。`;list.append(li);}
}
storyboardReadyController=MusicStoryboardReadiness.createController({capture:()=>capturePanel('storyboard'),onState:renderStoryboardReady});
$('mv-ready-check').onclick=()=>{if(state.busy){say('目前操作尚未完成，請稍候');return;}try{const view=storyboardReadyController.check();say(view.report.issueCount?`已列出${view.report.issueCount}項創作待辦；點選可定位欄位。`:'欄位待辦已補齊；仍須完整建立驗證。');}catch(e){say(e.message,true);}};
function captureStoryboardTiming(){
  const entries=entriesFor('shots');
  return {panel:{fields:{'mv-duration':readValue($('mv-duration')),'mv-fps':readValue($('mv-fps'))},shots:entries.map(e=>({start:e.value.start,end:e.value.end}))},ids:entries.map(e=>e.id)};
}
function clearStoryboardTimingMarks(){
  document.querySelectorAll('[data-storyboard-timing-invalid]').forEach(e=>{e.removeAttribute('data-storyboard-timing-invalid');if(!e.hasAttribute('data-storyboard-ready-invalid'))e.removeAttribute('aria-invalid');});
}
function locateStoryboardTiming(index){
  const issue=storyboardTimingController.locate(index);
  if(!issue){say('時間或鏡頭來源已有修改，請重新檢查時間待辦；目前內容保留。');return;}
  const target=storyboardIssueTarget(issue);if(!target)return;
  if(issue.scope==='shots')focusShot(issue.row-1,issue.field);
  else{target.scrollIntoView({block:'nearest'});target.focus({preventScroll:true});}
}
function renderStoryboardTiming({report,stale}){
  clearStoryboardTimingMarks();const box=$('mv-time-box'),list=$('mv-time-issues'),stats=$('mv-time-stats');
  box.classList.toggle('stale',stale);list.replaceChildren();stats.replaceChildren();stats.hidden=!report;
  $('mv-time-status').textContent=!report?'未填完時間也能檢查；原值保留，不補時間。':stale?'時間或鏡頭來源已有修改；下方是上一份待辦，請重新檢查。':report.issueCount?`共${report.issueCount}項時間待辦；點選可定位原欄位。`:'時間資料沒有待辦；仍須完整建立與實際音畫驗證。';
  if(!report)return;
  for(const label of [`共${report.totalShots}鏡`,`局部有效秒數${report.timedShots}鏡`,report.totalFrames===null?'宣告影格數待核對':`宣告${report.totalFrames}幀（結束不含）`]){const p=document.createElement('p');p.textContent=label;stats.append(p);}
  if(!stale)for(const issue of report.issues){const target=storyboardIssueTarget(issue);if(target){target.setAttribute('aria-invalid','true');target.setAttribute('data-storyboard-timing-invalid','true');}}
  report.issues.slice(0,20).forEach((issue,index)=>{
    const li=document.createElement('li'),button=document.createElement('button');button.type='button';button.className='subtle';button.disabled=stale||state.busy;
    button.textContent=(issue.scope==='shots'?`鏡頭 ${issue.row} · `:'')+MusicStoryboardTiming.labels[issue.field]+'：'+issue.message+(issue.relatedRow?`（前鏡 ${issue.relatedRow}）`:'');
    button.onclick=()=>locateStoryboardTiming(index);li.append(button);list.append(li);
  });
  if(report.issueCount>20){const li=document.createElement('li');li.textContent=`此處列前20項；全部${report.totalShots}鏡已檢查。修正後重查；報告最多保留200項明細。`;list.append(li);}
}
function checkStoryboardTiming(){const view=storyboardTimingController.check();if(view.report.issueCount){locateStoryboardTiming(0);return false;}return true;}
storyboardTimingController=MusicStoryboardTiming.createController({capture:captureStoryboardTiming,onState:renderStoryboardTiming});
$('mv-time-check').onclick=()=>{if(state.busy){say('目前操作尚未完成，請稍候');return;}try{const view=storyboardTimingController.check();say(view.report.issueCount?`已列出${view.report.issueCount}項時間待辦；原時間保留。`:'時間資料沒有待辦；仍須完整建立驗證。');}catch(e){say(e.message,true);}};
$('mv-time-report').onclick=()=>run($('mv-time-report'),async current=>{
  const panel=captureStoryboardTiming().panel;storyboardTimingController.check();
  const reply=await api('/api/storyboard-timing-review',{panel},false,current.signal);if(!current())return;
  const accepted=MusicStoryboardTiming.checkedResult(panel,reply);
  $('mv-visual').hidden=true;setFiles(accepted.files,`分鏡時間檢查 · 待辦 ${accepted.data.issue_count} 項`);
  say('分鏡時間報告已建立；原時間保留，仍須完整創作與實際音畫驗證');
});
$('mv-ready-report').onclick=()=>run($('mv-ready-report'),async current=>{
  const panel=capturePanel('storyboard');storyboardReadyController.check();
  const reply=await api('/api/storyboard-review',{panel},false,current.signal);if(!current())return;
  const accepted=MusicStoryboardReadiness.checkedResult(panel,reply);
  $('mv-visual').hidden=true;
  setFiles(accepted.files,`分鏡欄位檢查 · 待辦 ${accepted.data.issue_count} 項`);
  say('分鏡待辦報告已建立；仍須完整建立與實際音畫驗證');
});
function lyricsReviewPayload(){return {title:readValue($('lyrics-title')),duration:readValue($('lyrics-duration')),cues:entriesFor('cues').map(e=>e.value)};}
function clearLyricsIssueMarks(){document.querySelectorAll('#cues input,#lyrics-duration').forEach(e=>e.removeAttribute('aria-invalid'));}
function staleLyricsReview(){
  clearLyricsIssueMarks();if(!lyricsReviewData)return;lyricsReviewStale=true;$('lyrics-review-box').classList.add('stale');
  $('lyrics-review-status').textContent='內容已有修改；下方是上一份檢查，請重新檢查目前表格。';
  $('lyrics-review-issues').querySelectorAll('button').forEach(b=>b.disabled=true);
}
function focusLyricsIssue(issue){
  if(lyricsReviewStale)return;
  const target=issue.row?$('cues').children[issue.row-1]?.querySelectorAll('input')[['start','end','text'].indexOf(issue.field)]:issue.field==='duration'?$('lyrics-duration'):$('cue-add');
  if(target){target.scrollIntoView({block:'nearest'});target.focus({preventScroll:true});}
}
function renderLyricsReview(data){
  lyricsReviewData=data;lyricsReviewStale=false;clearLyricsIssueMarks();$('lyrics-review-box').classList.remove('stale');
  $('lyrics-review-status').textContent=data.issue_count?`共${data.issue_count}項需修正；先完成未標記或衝突時間，再建立歌詞包。`:'時間資料可再驗證建立歌詞包；仍需實聽核對。';
  const stats=$('lyrics-review-stats');stats.replaceChildren();stats.hidden=false;
  for(const label of [`共${data.total_rows}句`,`局部時間已填${data.timed_rows}句`,`需修正${data.blocking_rows}句`]){const p=document.createElement('p');p.textContent=label;stats.append(p);}
  const list=$('lyrics-review-issues');list.replaceChildren();const names={start:'開始',end:'結束',text:'文字',duration:'作品宣告',cues:'逐句內容'};
  for(const issue of data.issues){const target=issue.row?$('cues').children[issue.row-1]?.querySelectorAll('input')[['start','end','text'].indexOf(issue.field)]:issue.field==='duration'?$('lyrics-duration'):null;if(target)target.setAttribute('aria-invalid','true');}
  for(const issue of data.issues.slice(0,20)){const li=document.createElement('li'),button=document.createElement('button');button.type='button';button.className='subtle';button.textContent=(issue.row?`第${issue.row}句 · `:'')+names[issue.field]+'：'+issue.message+(issue.related_row?`（第${issue.related_row}句）`:'');button.onclick=()=>focusLyricsIssue(issue);li.append(button);list.append(li);}
  if(data.issue_count>20){const li=document.createElement('li');li.textContent=`此處列前20項；全部${data.total_rows}句已檢查。修正後重查，報告最多保留前200項明細。`;list.append(li);}
}
function cueValues(){return entriesFor('cues').map(e=>{const c=e.value;if(!c.start.trim()||!c.end.trim())throw Error('歌詞開始與結束不可空白');return {start:LyricTime.normalize(c.start,'歌詞開始',true),end:LyricTime.normalize(c.end,'歌詞結束',true),text:c.text};});}
function renderCues(cues,ids){
  lyricsSearchController?.clear();
  if(!ids){cueStampEdit?.clear();timingController?.reset();timingSay('新的逐句內容已載入；整批校時撤回紀錄已清除。');}
  const keys=rowIds(cues,ids);state.cues=cues;timingControls();
  $('cues').innerHTML=cues.map((c,i)=>`<tr data-history-id="${esc(keys[i])}"><td>${i+1}</td><td>${field(c.start,`歌詞 ${i+1} 開始`,'number')}</td><td>${field(c.end,`歌詞 ${i+1} 結束`,'number')}</td><td><input class="lyric-field" value="${esc(c.text)}" aria-label="歌詞 ${i+1} 文字"></td><td><div class="actions"><button type="button" data-cue-seek="${esc(keys[i])}" aria-label="第 ${i+1} 句定位句首" aria-describedby="cue-position-help" disabled>定位句首</button>${[['start','記下開始'],['end','記下結束'],['move','整句移動']].map(([action,label])=>`<button data-stamp="${i}" data-stamp-action="${action}" aria-label="第 ${i+1} 句${label}">${label}</button>`).join('')}<button data-delete-cue="${i}" aria-label="刪除第 ${i+1} 句">刪除</button></div></td></tr>`).join('');
  [...$('cues').children].forEach((row,i)=>['start','end','text'].forEach((key,j)=>writeValue(row.querySelectorAll('input')[j],cues[i][key])));
  $('cues').querySelectorAll('[data-stamp]').forEach(button=>button.onclick=()=>{
    const result=cueStampEdit.stamp(button.closest('tr').dataset.historyId,button.dataset.stampAction);
    if(result&&!result.changed)say('播放位置與目前時間相同；原編修及撤回紀錄保留。');
  });
  $('cues').querySelectorAll('[data-delete-cue]').forEach(button=>button.onclick=()=>deleteEntry('cues',Number(button.dataset.deleteCue)));
  cueStampEdit?.refresh();state.currentCue?.invalidate();state.currentCue?.refresh();state.cuePosition?.refresh({force:true});
}
storyboardSearchController=MusicStoryboardSearchDOM.bind(document,{version:MusicDeliveryVersions.current,
  capture:()=>{const entries=entriesFor('shots');return {ids:entries.map(e=>e.id),shots:entries.map(e=>Object.fromEntries(MusicStoryboardSearch.fields.map(k=>[k,e.value[k]]))),visible:state.tab==='storyboard'&&!$('storyboard').hidden,busy:state.busy,resultRevision:state.resultRevisions.storyboard||0};},
  createAbort:()=>new AbortController(),
  request:(payload,{signal})=>api('/api/storyboard-search',payload,false,signal),
  focusTarget:target=>{const row=$('shots').children[target.index],field=row?.querySelector(`[data-key="${target.field}"]`);if(state.busy||state.tab!=='storyboard'||!row||row.dataset.historyId!==target.id||!field||!field.isConnected||field.disabled||readValue(field)!==target.text)return false;focusShot(target.index,target.field);return document.activeElement===field;},
  onReport:(data,files)=>{setFiles(files,`分鏡原文搜尋 · 命中 ${data.total_matched_rows} 鏡 · 此批 ${data.matches.length} 鏡`);say('分鏡搜尋完成；選擇結果可展開原欄位，文字與時間保留。');},
  onError:error=>say(error.message+'；分鏡與原成果保留',true)});
lyricsSearchController=MusicLyricsSearchDOM.bind(document,{version:MusicDeliveryVersions.current,
  capture:()=>{const entries=entriesFor('cues');return {ids:entries.map(e=>e.id),texts:entries.map(e=>e.value.text),visible:state.tab==='lyrics'&&!$('lyrics').hidden,busy:state.busy,resultRevision:state.resultRevisions.lyrics||0};},
  createAbort:()=>new AbortController(),
  request:(payload,{signal})=>api('/api/lyrics-search',payload,false,signal),
  focusTarget:target=>{const row=$('cues').children[target.index],field=row?.querySelector('.lyric-field');if(state.busy||state.tab!=='lyrics'||!row||row.dataset.historyId!==target.id||!field||readValue(field)!==target.text)return false;return focusEntry('cues',target.index,'new');},
  onReport:(data,files)=>{setFiles(files,`原句搜尋 · 命中 ${data.total_matched_rows} 句 · 此批 ${data.matches.length} 句`);say('原句搜尋完成；選擇結果可回到文字欄，時間與播放位置保留。');},
  onError:error=>say(error.message+'；歌詞與原成果保留',true)});
function cueStampRow(id){return [...$('cues').children].find(row=>row.dataset.historyId===id)||null;}
function captureLyricPlayer(){const player=$('lyrics-player');return {source:state.audioUrl,current_source:player.currentSrc||null,
  duration:player.duration,position:player.currentTime,ready:player.readyState>=1&&!player.hidden,error:!!player.error};}
cueStampEdit=MusicCueStampEditDOM.bind({button:$('cue-stamp-undo'),note:$('cue-stamp-note'),busy:()=>state.busy,
  position:id=>[...$('cues').children].findIndex(row=>row.dataset.historyId===id)+1,
  readRow:id=>{const row=cueStampRow(id);if(!row)return null;const f=row.querySelectorAll('input');return {id,start:readValue(f[0]),end:readValue(f[1]),text:readValue(f[2])};},
  writeTimes:(id,value)=>{const row=cueStampRow(id);if(!row)throw Error('目標句已不存在');const f=row.querySelectorAll('input');writeValue(f[0],value.start);writeValue(f[1],value.end);},
  captureMedia:captureLyricPlayer,onChanged:value=>{markDirty('lyrics');state.currentCue?.invalidate();state.cuePosition?.refresh({force:true});tick();
    cueStampRow(value.id)?.querySelectorAll('input')[value.undone||value.action!=='end'?0:1]?.focus({preventScroll:true});
    say(value.undone?'已撤回最近逐句標記；文字、其他編修與音檔保留，請重新驗證。':'已記下播放位置，可撤回最近逐句標記；全部驗證後才更新成果。');},onError:error=>say(error.message,true)});
$('lyrics-file').onchange=async event=>{
  const file=event.target.files[0];event.target.value='';if(!file)return;
  if(state.busy){say('目前操作尚未完成，請稍候再選檔',true);return;}
  lyricsSeedController?.cancel();const tab=state.tab;
  await lyricsImportController.read(file,()=>state.tab===tab);
};
function lyricDuration(){const value=readValue($('lyrics-duration'));return value.trim()?LyricTime.normalize(value,'作品宣告時長',true):null;}
$('lyrics-import').onclick=()=>run($('lyrics-import'),async isCurrent=>{
  lyricsSeedController?.cancel();await lyricsImportController.inspectCurrent(isCurrent);
});
$('cue-add').onclick=()=>{if(state.busy){say('目前操作尚未完成，請稍候');return;}try{const entries=entriesFor('cues');if(entries.length>=10000)throw Error('歌詞最多 10000 列');const last=entries.at(-1)?.value,end=last?.end?.trim(),start=end?LyricTime.normalize(end,'最後一句結束',true):0;if(!Number.isFinite(start))throw Error('最後一句結束時間需為數字');entries.push({id:`row-${++rowSequence}`,value:{start:String(start),end:String(start+3),text:''}});writeEntries('cues',entries);markDirty('lyrics');focusEntry('cues',entries.length-1,'new');say('已新增一句，請填入歌詞；作品宣告與音檔保持。');}catch(e){say(e.message,true);}};
function lyricsBuildSource(){
  const sorted=MusicTiming.orderedEntries(entriesFor('cues'));
  const payload=MusicLyricsPackage.buildRequest({title:readValue($('lyrics-title')),cues:sorted.map(e=>({start:LyricTime.normalize(e.value.start,'歌詞開始',true),end:LyricTime.normalize(e.value.end,'歌詞結束',true),text:e.value.text})),duration:lyricDuration(),content:readValue($('lyrics-source')),suffix:readValue($('lyrics-format'))});
  return {sorted,payload,expected:MusicLyricsResult.expectedBuild(payload)};
}
$('lyrics-build').onclick=()=>run($('lyrics-build'),async isCurrent=>{const review=MusicLyricsReview.review(lyricsReviewPayload());renderLyricsReview(review);if(review.issue_count){focusLyricsIssue(review.issues[0]);throw Error('校時有待修正項目；已定位第一個欄位，原文與句子保留。');}
  const source=lyricsBuildSource(),reply=await api('/api/lyrics',source.payload,false,isCurrent.signal);if(!isCurrent())return;
  const result=MusicLyricsResult.checkedResult(source.expected,reply),formats=await MusicLyricsExportReview.review({package:result.data});if(!isCurrent())return;
  const files={...result.files,...MusicLyricsExportReview.files(formats,{package:result.data})};
  timingController.invalidate();renderCues(result.data.cues,source.sorted.map(e=>e.id));renderLyricsExportReview(formats,source.sorted.map(e=>e.id));setFiles(files,`已驗證歌詞與格式報告 · ${result.data.cues.length} 句`);say(`歌詞時間驗證通過；格式提醒 ${formats.issue_count} 項，完整 JSON 與報告已建立，可一起另存。`);tick();});
lyricsReviewController=MusicLyricsReview.createController({capture:lyricsReviewPayload,request:(payload,current)=>api('/api/lyrics-review',payload,false,current?.signal),
  onReport:(data,files)=>{renderLyricsReview(data);setFiles(files,'校時檢查報告 · 資料待辦，仍需實聽');say('已檢查全部逐句資料；選擇待辦可定位，未修改內容');},
  onError:error=>{staleLyricsReview();say(error.message+'；目前句子保留',true);},onState:({pending})=>{$('lyrics-review-check').disabled=state.busy||pending;}});
$('lyrics-review-check').onclick=()=>run($('lyrics-review-check'),current=>lyricsReviewController.check(current));
function staleLyricsExportReview(){
  const box=$('lyrics-export-box');box.dataset.stale='true';
  $('lyrics-export-status').textContent='目前內容已編修；請重新建立或檢查匯出格式。';
  box.querySelectorAll('[data-export-focus]').forEach(button=>button.disabled=true);
}
function renderLyricsExportReview(data,ids){
  const box=$('lyrics-export-box'),list=$('lyrics-export-issues');box.dataset.stale='false';list.replaceChildren();
  $('lyrics-export-status').textContent=`共 ${data.source.cue_count} 句 · LRC 原句提醒 ${data.formats.lrc.issue_count} 項 · SRT 原句提醒 ${data.formats.srt.issue_count} 項。完整 JSON 保留全部歌詞包資料。`;
  data.issues.slice(0,20).forEach(issue=>{
    const li=document.createElement('li'),button=document.createElement('button');button.type='button';button.className='subtle';button.dataset.exportFocus='true';
    const id=ids[issue.row-1],index=entriesFor('cues').findIndex(entry=>entry.id===id);
    button.textContent=`表格第 ${index>=0?index+1:issue.row} 句 · ${issue.format.toUpperCase()}：${issue.message}`;
    button.onclick=()=>{if(state.busy||box.dataset.stale==='true')return;const id=ids[issue.row-1],index=entriesFor('cues').findIndex(entry=>entry.id===id);if(index>=0)$('cues').children[index].querySelectorAll('input')[2]?.focus();};
    li.append(button);list.append(li);
  });
  if(data.issue_count>20){const li=document.createElement('li');li.textContent='畫面只列前20項；報告含前200項與全部計數。';list.append(li);}
}
lyricsExportController=MusicLyricsExport.createController({capture:()=>{const source=lyricsBuildSource();return {payload:{package:source.expected,include_package:true},ids:source.sorted.map(e=>e.id)};},request:(payload,current)=>api('/api/lyrics-export-review',payload,false,current?.signal),
  onReport:(data,files,ids)=>{renderLyricsExportReview(data,ids);setFiles(files,'格式報告與完整歌詞包 · 原內容保留');say('格式報告與對應的完整 JSON 已建立；原歌詞與時間保留，可一起另存。');},
  onError:error=>say(error.message+'；目前歌詞與成果保留',true),onState:({pending})=>{$('lyrics-export-check').disabled=state.busy||pending;}});
$('lyrics-export-check').onclick=()=>run($('lyrics-export-check'),current=>lyricsExportController.check(current));
function timingSay(message,error=false){$('timing-status').textContent=message;$('timing-status').classList.toggle('error',error);}
function timingControls(){
  state.operationControl?.refresh();
  refreshExampleControls();
  refreshCollectionControls();
  lyricsSearchController?.refresh();storyboardSearchController?.refresh();
  arrangementController?.refresh();
  musicReadyController?.refresh();
  $('music-ready-check').disabled=state.busy;
  $('music-ready-report').disabled=state.busy;
  storyboardDurationController?.refresh();
  storyboardReadyController?.refresh();
  $('mv-ready-check').disabled=state.busy;
  $('mv-ready-report').disabled=state.busy;
  storyboardTimingController?.refresh();
  $('mv-time-check').disabled=state.busy;
  $('mv-time-report').disabled=state.busy;
  $('timing-preview').disabled=state.busy||timingReading||!state.cues.length;
  $('timing-apply').disabled=state.busy||timingReading||!timingReady;
  $('timing-undo').disabled=state.busy||timingReading||!timingCanUndo;
  lyricsMediaController?.refresh({protect:false});
  $('lyrics-review-check').disabled=state.busy;
  $('lyrics-export-check').disabled=state.busy;
}
function applyCueTimes(entries){
  const targets=new Map(entries.map(e=>[e.id,e.value]));
  [...$('cues').children].forEach(row=>{const value=targets.get(row.dataset.historyId),fields=row.querySelectorAll('input');writeValue(fields[0],value.start);writeValue(fields[1],value.end);});
  markDirty('lyrics');state.currentCue?.invalidate();state.cuePosition?.refresh({force:true});tick();
}
timingController=MusicTiming.createTimingController({
  request:async payload=>(await api('/api/lyrics',payload)).data,
  snapshot:()=>({entries:entriesFor('cues'),duration:readValue($('lyrics-duration'))}),applyTimes:applyCueTimes,
  onState:({reading,ready,canUndo})=>{timingReading=reading;timingReady=ready;timingCanUndo=canUndo;if(!ready)$('timing-review').hidden=true;timingControls();},
  onPreview:plan=>{
    $('timing-review-note').textContent=`已檢查全部 ${plan.count} 句，整批${plan.shift>0?'延後':'提前'} ${Math.abs(plan.shift)} 秒。每句長度保留，尚未套用。`;
    const after=new Map(plan.after.map(e=>[e.id,e.value]));
    $('timing-review-content').value=plan.before.slice(0,20).map((e,i)=>`${i+1} · ${e.value.start}–${e.value.end} → ${after.get(e.id).start}–${after.get(e.id).end}`).join('\n')+(plan.count>20?'\n… 預覽前 20 句，全部句子已檢查。':'');
    $('timing-review').hidden=false;timingSay('校時預覽完成；確認後套用，目前表格與音檔保留。');
  },
  onApplied:shift=>timingSay(`已整批${shift>0?'延後':'提前'} ${Math.abs(shift)} 秒；請驗證並建立歌詞包，可撤回這次校時。`),
  onUndone:()=>timingSay('已撤回這次時間調整，後來的文字編修與音檔保留；請重新驗證。'),
  onError:error=>timingSay(error.message+'；目前表格保留。',true)
});
$('timing-preview').onclick=()=>{if(!state.busy){timingSay('正在檢查全部句子，尚未套用。');timingController.preview($('lyrics-shift').value);}};
$('timing-apply').onclick=()=>{if(!state.busy)timingController.apply();};
$('timing-undo').onclick=()=>{if(!state.busy)timingController.undo();};
$('timing-cancel').onclick=()=>{timingController.cancel();timingSay('已取消校時預覽，逐句表格保留。');};
$('lyrics-shift').oninput=()=>{timingController.cancel();timingSay('調整量已修改，請重新預覽。');};
timingControls();
let wavePosition=null;
state.currentCue=MusicCurrentCueDOM.bindPlayback({button:$('current-cue-focus'),note:$('current-cue-note'),lyric:$('current-lyric'),container:$('cues'),
  captureContext:()=>({media:captureLyricPlayer(),visible:state.tab==='lyrics',busy:state.busy}),
  captureRows:()=>entriesFor('cues').map(entry=>({id:entry.id,...entry.value})),resolveRow:cueStampRow,
  focusTarget:(id,expected)=>{if(state.tab!=='lyrics'||state.busy)return false;const row=cueStampRow(id);if(!row)return false;
    const fields=row.querySelectorAll('input');if(fields.length!==3||fields[2].disabled||!fields[2].isConnected)return false;
    if(['start','end','text'].some((key,i)=>readValue(fields[i])!==expected[key]))return false;
    row.scrollIntoView({block:'nearest'});fields[2].focus({preventScroll:true});return document.activeElement===fields[2];},
  onFocused:view=>say(`已前往第 ${view.index+1} 句歌詞欄位；原編修與播放位置保留。`),onError:error=>say(error.message,true)});
function drawWave(){
  state.currentCue?.refresh();state.cuePosition?.refresh();
  const canvas=$('waveform'),ctx=canvas.getContext('2d'),w=canvas.width,h=canvas.height;
  ctx.clearRect(0,0,w,h);ctx.fillStyle='#e7ecdf';ctx.fillRect(0,0,w,h);ctx.strokeStyle='#b5c4ad';ctx.beginPath();ctx.moveTo(0,h/2);ctx.lineTo(w,h/2);ctx.stroke();
  if(state.waveform){ctx.strokeStyle='#4b745d';ctx.lineWidth=1;state.waveform.forEach((amplitude,i)=>{const x=(i+.5)*w/state.waveform.length;ctx.beginPath();ctx.moveTo(x,h/2-amplitude*52);ctx.lineTo(x,h/2+amplitude*52);ctx.stroke();});}
  const view=wavePosition?.refresh();
  if(view?.available){const x=view.ratio*w;ctx.strokeStyle='#c94b29';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,h);ctx.stroke();}
}
state.cuePosition=MusicCuePositionDOM.bind({container:$('cues'),
  targets:()=>[...$('cues').children].map(row=>{const f=row.querySelectorAll('input');return {button:row.querySelector('[data-cue-seek]'),row:{id:row.dataset.historyId,start:readValue(f[0]),end:readValue(f[1]),text:readValue(f[2])}};}),
  readRow:id=>{const row=cueStampRow(id);if(!row)return null;const f=row.querySelectorAll('input');return {id,start:readValue(f[0]),end:readValue(f[1]),text:readValue(f[2])};},
  captureMedia:captureLyricPlayer,isAllowed:()=>state.tab==='lyrics'&&!state.busy,
  setPosition:(seconds,expected)=>{const row=cueStampRow(expected.row.id);if(!row)return false;const f=row.querySelectorAll('input'),media=captureLyricPlayer();
    if(state.tab!=='lyrics'||state.busy||!MusicWavePosition.present(media).available||['source','current_source','duration'].some(k=>media[k]!==expected.media[k])||
      ['start','end','text'].some((key,i)=>readValue(f[i])!==expected.row[key]))return false;
    $('lyrics-player').currentTime=seconds;return true;},
  onSeek:()=>{tick();const canvas=$('waveform');canvas.scrollIntoView({block:'nearest'});canvas.focus({preventScroll:true});say('已定位原句首；原時間與文字保留，播放狀態保持。');},onError:error=>say(error.message,true)});
function tick(){drawWave();}
function resetAudio(){
  waveTask.begin();
  const player=$('lyrics-player');player.pause();player.removeAttribute('src');player.load();player.hidden=true;
  if(state.audioUrl)URL.revokeObjectURL(state.audioUrl);
  state.audioUrl=null;state.waveform=null;
  lyricsMediaController?.clear();
  if(state.audioContext){state.audioContext.close().catch(()=>{});state.audioContext=null;}
  $('lyrics-audio').value='';$('wave-note').textContent='音檔需另行選擇；草稿不包含音訊。';drawWave();
}
$('lyrics-audio').onchange=async event=>{
  const file=event.target.files[0];if(!file)return;
  const token=waveTask.begin(),player=$('lyrics-player');player.pause();
  if(state.audioUrl)URL.revokeObjectURL(state.audioUrl);
  if(state.audioContext)state.audioContext.close().catch(()=>{});
  state.audioContext=null;state.waveform=null;state.audioUrl=URL.createObjectURL(file);
  player.src=state.audioUrl;player.hidden=false;markDirty('lyrics');lyricsMediaController.select(state.audioUrl);drawWave();
  $('wave-note').textContent='正在讀取波形…';
  let context=null;
  try{
    if(file.size>64*1024*1024)throw Error('音檔超過 64 MiB，保留播放功能並略過波形');
    context=new AudioContext();state.audioContext=context;
    const bytes=await file.arrayBuffer();if(!waveTask.isCurrent(token))return;
    const decoded=await context.decodeAudioData(bytes);if(!waveTask.isCurrent(token))return;
    const points=600,bucket=Math.max(1,Math.ceil(decoded.length/points)),samples=decoded.getChannelData(0);
    state.waveform=Array.from({length:Math.ceil(samples.length/bucket)},(_,i)=>{
      let peak=0;for(let j=i*bucket;j<Math.min((i+1)*bucket,samples.length);j++)peak=Math.max(peak,Math.abs(samples[j]));return peak;
    });
    $('wave-note').textContent='波形已載入（第一聲道）；播放位置與定位按鍵如下。';drawWave();
  }catch(error){if(waveTask.isCurrent(token))$('wave-note').textContent='波形未完成：'+error.message;}
  finally{if(context&&context.state!=='closed')await context.close().catch(()=>{});if(state.audioContext===context)state.audioContext=null;}
};
window.addEventListener('pagehide',()=>{libraryController.cancel();backupController.cancel();timingController?.cancel();lyricsSeedController?.cancel();briefImporter.cancel();lyricsImportController?.cancel();draftTask.begin();waveTask.begin();if(state.audioUrl)URL.revokeObjectURL(state.audioUrl);if(state.audioContext)state.audioContext.close().catch(()=>{});});
function renderMediaDuration(view){
  $('lyrics-media-audio').textContent=view.phase==='loading'?'讀取中…':view.mediaText;
  $('lyrics-media-declared').textContent=view.declaredText;
  $('lyrics-media-note').textContent=view.note;
  $('lyrics-media-check').classList.toggle('needs-check',['differs','invalid'].includes(view.status)||view.phase==='error');
  $('lyrics-media-adopt').disabled=state.busy||!view.canAdopt;
  $('lyrics-media-undo').disabled=state.busy||!view.canUndo;
}
lyricsMediaController=MusicLyricsMedia.createController({capture:()=>readValue($('lyrics-duration')),
  apply:value=>{writeValue($('lyrics-duration'),value);markDirty('lyrics');tick();},onState:renderMediaDuration});
lyricsMediaController.refresh({protect:false});
$('lyrics-media-adopt').onclick=()=>{if(state.busy)return;try{lyricsMediaController.adopt();}catch(error){say(error.message,true);}};
$('lyrics-media-undo').onclick=()=>{if(state.busy)return;try{lyricsMediaController.undo();}catch(error){say(error.message,true);}};
$('lyrics-player').onloadedmetadata=()=>{const player=$('lyrics-player');if(!state.audioUrl||player.currentSrc!==state.audioUrl)return;lyricsMediaController.loaded(player.currentSrc,player.duration);tick();};
$('lyrics-player').ontimeupdate=tick;$('lyrics-player').onseeked=tick;
$('lyrics-player').onerror=()=>{const player=$('lyrics-player');if(!state.audioUrl||!player.error)return;if(lyricsMediaController.fail(player.currentSrc||player.src))say('此音檔無法在瀏覽器播放，請改用支援的格式',true);};
wavePosition=MusicWavePositionDOM.bind({canvas:$('waveform'),readout:$('wave-position'),
  capture:captureLyricPlayer,
  setPosition:seconds=>{$('lyrics-player').currentTime=seconds;},onSeek:tick,onError:error=>say('音檔定位未完成：'+error.message,true)});
['loadstart','emptied','durationchange','error'].forEach(type=>$('lyrics-player').addEventListener(type,drawWave));
function staleAudioReview(){
  const note=$('audio-review-stale');if(!note)return;
  note.hidden=false;$('audio-visual').classList.add('stale');
  $('audio-visual').querySelector('[data-audio-status]').textContent='上一份報告';
}
function renderAudioReview(d){
  const box=$('audio-visual');box.classList.remove('stale');
  box.innerHTML=`<div class="audio-review-heading"><h3>檢查摘要</h3><span data-audio-status class="audio-outcome ${d.needsReview?'needs-review':'passed'}">${esc(d.status)}</span></div>
    <p id="audio-review-stale" class="audio-stale-note" role="status" hidden>這是上一份報告，輸入已修改；請重新分析，才能代表目前的選擇。</p>
    <p class="audio-source-name">${esc(d.file)}</p><p class="hint">${d.bytes.toLocaleString()} bytes · ${d.custom?'自訂接受值':d.profile==='video'?'影片交付示範':'音樂交付示範'}；請以實際收件需求為準。</p>
    <div class="table-wrap"><table aria-label="本次接受條件"><thead><tr><th>項目</th><th>實際值</th><th>接受值</th><th>結果</th></tr></thead><tbody>${d.specifications.map(s=>`<tr><th scope="row">${esc(s.label)}</th><td>${esc(s.observed)}</td><td>${esc(s.accepted)}</td><td class="${s.passed?'check-pass':'check-fail'}">${s.passed?'符合':'不符'}</td></tr>`).join('')}</tbody></table></div>
    <div class="facts"><div class="fact"><strong>${d.duration}s</strong><span>音檔時長</span></div><div class="fact"><strong>${esc(d.correlation)}</strong><span>立體聲相關性；不可測不是通過</span></div><div class="fact"><strong>${d.leading}s</strong><span>頭部安靜段，門檻 -60 dBFS</span></div><div class="fact"><strong>${d.trailing}s</strong><span>尾部安靜段，門檻 -60 dBFS</span></div></div>
    <div class="table-wrap"><table aria-label="每聲道量測"><thead><tr><th>聲道</th><th>Sample peak</th><th>RMS</th><th>DC offset</th><th>滿刻度樣本</th></tr></thead><tbody>${d.channels.map(c=>`<tr><th scope="row">${c.number}</th><td>${esc(c.peak)}</td><td>${esc(c.rms)}</td><td>${esc(c.dc)}</td><td>${c.fullScale}</td></tr>`).join('')}</tbody></table></div>
    <section class="audio-loudness" aria-labelledby="audio-loudness-heading"><h4 id="audio-loudness-heading">整合響度</h4><p data-loudness-status="${esc(d.loudness.status)}" class="audio-loudness-value">${esc(d.loudness.value)}</p><p class="hint">${esc(d.loudness.note)}</p>${d.loudness.blocks!==null?`<p class="hint">400 ms 區塊／100 ms 步進；${esc(d.loudness.blocks)}。相對門檻 ${esc(d.loudness.relative)}；末尾 ${d.loudness.tailFrames} 幀未形成下一完整區塊。</p>`:''}<p class="hint">響度不可測不影響上方的格式接受結果。尚未量測 true peak；沒有自動調整音量。</p></section>
    <h4>需確認項目</h4><p class="hint">${d.warnings.length?'以下是技術提醒，仍需聆聽與確認收件要求。':'本次沒有技術提醒；仍需聆聽及核對素材授權。'}</p>`;
  appendNotes(box,d.warnings);
  const evidence=document.createElement('details'),summary=document.createElement('summary'),note=document.createElement('p'),hash=document.createElement('p');
  summary.textContent='來源與量測範圍';note.className='hint';note.textContent=`RIFF/WAVE 整數 PCM · block align ${d.blockAlign} bytes · byte rate ${d.byteRate} bytes/s。雜湊與量測來自同一次複製的位元組；不是檔案系統原子快照或著作權證明。RMS 不是 LUFS，sample peak 不是 true peak。`;
  hash.className='hash';hash.textContent='SHA-256 '+d.sha256;evidence.append(summary,note,hash);box.append(evidence);box.hidden=false;
}
$('audio-build').onclick=()=>{if(state.busy)return;try{if(!state.audioAcceptanceReview.check(true)){say('接受條件有待辦；請修正後再分析',true);return;}}catch(error){say(error.message,true);return;}return run($('audio-build'),isCurrent=>MusicAudio.inspect({
  selected:()=>({file:$('audio-file').files[0],profile:readValue($('audio-profile')),acceptanceDraft:state.audioAcceptance?.capture()}),isCurrent,
  request:({file,profile,acceptanceDraft})=>api('/api/audio?'+new URLSearchParams({name:file.name,...(acceptanceDraft?{acceptance_draft:JSON.stringify(acceptanceDraft)}:{profile})}),file,true,isCurrent.signal),
  onResult:(result,review)=>{renderAudioReview(review);setFiles(result.files,'音檔檢查 · '+review.status);say(review.needsReview?`檢查已完成，有 ${review.warnings.length} 項需確認`:'本次技術條件通過；報告已建立');}
}));};
const draftTask=MusicEditor.createLatestTask();
const replacementCapture=()=>({draft:captureDraft(),media:[$('lyrics-audio').files[0]||null,$('audio-file').files[0]||null]});
const draftPreview=MusicReplacement.createPreview({capture:replacementCapture});
const briefPreview=MusicReplacement.createPreview({capture:replacementCapture});
const libraryPreview=MusicReplacement.createPreview({capture:replacementCapture});
function clearConversion(){draftPreview.cancel();$('draft-conversion').hidden=true;$('draft-review-content').value='';}
function loadDraft(draft,source=null){const previous=captureDraft();applyDraft(draft);draftUndo.record(previous,captureDraft());$('draft-undo').disabled=false;clearConversion();if(source)draftRetention.retain(draft,source);}
function renderRetention(value){
  const messages={loading:'正在準備草稿狀態。',initial:'範例內容尚未編修。',
    unretained:'目前編修尚未另存；重新整理或離開前請保存草稿。',
    download_unconfirmed:'草稿下載已送出；請核對檔案後按「已確認草稿檔案」。',
    changed_after_download:'下載後又有編修；目前內容尚未另存。',
    file:'目前草稿與已載入的檔案一致。',library:'目前草稿與本機保存版本一致。',
    download:'已記錄你確認的草稿檔案；目前內容一致。'};
  const note=$('draft-retention-note'),message=messages[value.mode]+(value.mode==='library'&&value.label?' '+value.label:'');
  if(note.textContent!==message)note.textContent=message;
  note.dataset.dirty=String(value.dirty);$('draft-confirm-download').hidden=!value.pendingDownload;
}
function capturePanel(panel){
  const value={fields:Object.fromEntries(MusicEditor.draftFields[panel].map(id=>[id,readValue($(id))]))};
  if(panel==='music'){
    value.sections=[...$('arrangement').children].map(row=>Object.fromEntries(
      MusicEditor.draftRows.music.columns.map((key,i)=>[key,readValue(row.querySelectorAll('input')[i])])));
    value.avoid=requirementValues('music-avoid');value.deliverables=requirementValues('music-deliverables');
  }else if(panel==='storyboard'){
    value.motifs=getMotifs();value.shots=[...$('shots').children].map(article=>Object.fromEntries(
      [...article.querySelectorAll('[data-key]')].map(input=>[input.dataset.key,readValue(input)])));
  }else if(panel==='lyrics')value.cues=[...$('cues').children].map(row=>Object.fromEntries(
    MusicEditor.draftRows.lyrics.columns.map((key,i)=>[key,readValue(row.querySelectorAll('input')[i])])));
  return value;
}
function captureDraft(){
  const panels=Object.fromEntries(Object.keys(MusicEditor.draftFields).map(panel=>[panel,capturePanel(panel)]));
  return {format:'zoe-music-lab-draft',schema_version:3,tool_version:MusicDeliveryVersions.current,saved_at:new Date().toISOString(),tab:state.tab,panels};
}
function applyDraft(draft){
  storyboardDurationController?.clear();
  storyboardReadyController?.clear();
  if(seedController)seedController.cancel();
  lyricsSeedController?.cancel();
  lyricsImportController?.cancel();
  clearLibraryReview();
  ['music','storyboard','lyrics'].forEach(clearDeletionHistory);
  briefImporter.cancel();clearBriefReview();
  lyricsImportController?.cancel();
  $('lyrics-file').value='';
  Object.values(draft.panels).forEach(panel=>Object.entries(panel.fields).forEach(([id,value])=>writeValue($(id),value)));
  renderSections(draft.panels.music.sections);renderRequirements('music-avoid',draft.panels.music.avoid,'避免事項');renderRequirements('music-deliverables',draft.panels.music.deliverables,'交付項目');renderMotifs(draft.panels.storyboard.motifs);renderShots(draft.panels.storyboard.shots);renderCues(draft.panels.lyrics.cues);
  state.audioAcceptance?.projectLoaded();
  resetAudio();$('audio-file').value='';state.bundles={};state.files={};
  Object.keys(MusicEditor.draftFields).forEach(markDirty);
  ['music-visual','mv-visual','audio-visual'].forEach(id=>$(id).hidden=true);
  const tabButton=document.querySelector(`[data-tab="${draft.tab}"]`);
  tabButton.click();clearOutput();tick();tabButton.focus({preventScroll:true});
}
textDownloader.bind($('draft-export'),{select:()=>{
    if(state.busy)throw Error('目前操作尚未完成，請稍候再保存');
    const draft=MusicEditor.validateDraft(captureDraft());
    const content=JSON.stringify(draft,null,2)+'\n';
    if(new TextEncoder().encode(content).length>1024*1024)throw Error('草稿超過 1 MiB，請減少內容再保存');
    return {name:'music-lab-draft.json',content};
  },onSent:selected=>{draftRetention.requestDownload(JSON.parse(selected.content));say('已送出草稿下載；請核對檔案後確認，音檔與成果另存。');},onError:error=>say(error.message,true)});
$('draft-confirm-download').onclick=()=>{if(draftRetention.confirmDownload())say(draftRetention.status().dirty?'已記錄下載確認；下載後的編修仍需另存。':'已記錄你確認的草稿檔案；音檔與成果另存。');};
$('draft-open').onchange=async event=>{
  const file=event.target.files[0];event.target.value='';if(!file)return;
  const token=draftTask.begin();clearConversion();briefImporter.cancel();clearBriefReview();clearLibraryReview();
  try{
    if(state.busy)throw Error('目前操作尚未完成，請稍候再載入');
    const selected=draftPreview.begin();
    if(!Number.isSafeInteger(file.size)||file.size<1||file.size>1024*1024)throw Error('草稿需介於1 byte與1 MiB');
    if(!file.name.toLowerCase().endsWith('.json'))throw Error('請選擇草稿 JSON');
    say('正在讀取草稿，完成後會先預覽；目前內容與音檔保留。');
    const text=await file.arrayBuffer();if(!draftTask.isCurrent(token)||!draftPreview.check(selected))return;
    const inspected=MusicEditor.inspectDraft(MusicJsonDocument.decode(text,{size:file.size,maxBytes:1024*1024,label:'草稿 JSON'}));
    if(state.busy)throw Error('目前操作尚未完成，請稍候再載入');
    const draft=inspected.legacy?MusicEditor.convertLegacyDraft(inspected.draft):inspected.draft;
    const ready={draft,legacy:inspected.legacy};if(!draftPreview.accept(selected,ready))return;
    $('draft-conversion-note').textContent=`「${file.name}」：歌曲「${draft.panels.music.fields['music-title']||'未命名'}」／分鏡「${draft.panels.storyboard.fields['mv-title']||'未命名'}」，${draft.panels.music.sections.length}段／${draft.panels.storyboard.shots.length}鏡／${draft.panels.lyrics.cues.length}句。${inspected.legacy?'舊版v'+inspected.draft.schema_version+'將明確轉換成v3，新增欄位沿用舊工作台預設。':''}載入會替換四個工作台、清除刪除紀錄與音檔選擇；目前內容尚未替換，可取消或載入後撤回。`;
    $('draft-review-content').value=JSON.stringify(draft,null,2);
    $('draft-convert').textContent=inspected.legacy?'轉換並載入舊版草稿':'載入這份草稿';
    $('draft-cancel').textContent='取消草稿預覽';$('draft-conversion').hidden=false;
    say('草稿已檢查，先確認預覽，再選擇載入；目前內容與音檔保留。');
  }catch(error){if(draftTask.isCurrent(token))say(error.message,true);}
};
$('draft-convert').onclick=()=>{
  if(state.busy){say('目前操作尚未完成，請稍候');return;}
  try{const proposal=draftPreview.proposal();if(!proposal)return;loadDraft(proposal.draft,proposal.legacy?null:{kind:'file',label:'選定草稿檔'});
    say(proposal.legacy?'草稿已明確轉換為v3並載入；原檔保留，可撤回本次載入':'專案草稿已載入；可撤回，請重新建立成果，校時與交付音檔需另選。');
  }catch(error){say(error.message,true);}
};
$('draft-cancel').onclick=()=>{draftTask.begin();clearConversion();say('已取消草稿預覽，目前表單與音檔保留');};
$('draft-undo').onclick=()=>{
  if(state.busy){say('目前操作尚未完成，請稍候');return;}
  try{
    const proposal=draftUndo.proposal(captureDraft());if(!proposal)return;
    draftTask.begin();clearConversion();briefImporter.cancel();clearBriefReview();
    if(proposal.scope)applyPlanningPanel(proposal.draft,proposal.scope);else applyDraft(proposal.draft);
    draftUndo.clear();$('draft-undo').disabled=true;
    say(proposal.scope?'已撤回本次載入；其他工作台與音檔保留，請重新建立成果':'已撤回草稿載入；請重新建立成果，音檔需另選。');
  }catch(error){say(error.message,true);}
};
let pendingBrief=null;
function clearBriefReview(){briefPreview.cancel();pendingBrief=null;$('brief-review').hidden=true;$('brief-preview').value='';$('brief-review-notes').replaceChildren();}
function applyPlanningPanel(draft,operation){
  if(seedController)seedController.cancel();
  lyricsSeedController?.cancel();
  lyricsImportController?.cancel();
  const checked=MusicEditor.validateDraft(draft),panel=checked.panels[operation];
  if(!['music','storyboard','lyrics'].includes(operation))throw Error('只支援歌曲、分鏡或歌詞工作台');
  if(operation==='storyboard'){storyboardDurationController?.clear();storyboardReadyController?.clear();}
  clearDeletionHistory(operation);
  Object.entries(panel.fields).forEach(([id,value])=>writeValue($(id),value));
  if(operation==='music'){renderSections(panel.sections);renderRequirements('music-avoid',panel.avoid,'避免事項');
    renderRequirements('music-deliverables',panel.deliverables,'交付項目');$('music-visual').hidden=true;}
  else if(operation==='storyboard'){renderMotifs(panel.motifs);renderShots(panel.shots);$('mv-visual').hidden=true;}
  else{lyricsImportController?.cancel();$('lyrics-file').value='';renderCues(panel.cues);tick();}
  markDirty(operation);const tabButton=document.querySelector(`[data-tab="${operation}"]`);
  tabButton.click();tabButton.focus({preventScroll:true});
}
const briefImporter=MusicPlanning.createBriefImport({
  preview:briefPreview,
  validate:async(operation,brief)=>{
    const selected=MusicPlanningReportInput.inspect(operation,brief);
    if(selected.kind==='review'){
      MusicPlanning.panelDraft(captureDraft(),operation,selected.panel);
      return {...selected,title:selected.panel.fields[operation==='music'?'music-title':'mv-title']};
    }
    MusicPlanning.planningDraft(captureDraft(),operation,brief);
    const result=await api('/api/'+operation,brief);
    return MusicPlanReview.checkedBrief(operation,brief,result);
  },
  onReady:({operation,result})=>{
    const proposal=result.kind==='review'?{operation,kind:'review',panel:result.panel}:{operation,kind:'brief',brief:result.brief};
    pendingBrief=proposal;$('brief-preview').value=JSON.stringify(proposal.kind==='review'?proposal.panel:proposal.brief,null,2);
    $('brief-review-note').textContent=proposal.kind==='review'?`${operation==='music'?'歌曲':'分鏡'}待辦報告已完整核對；待辦 ${result.issueCount} 項。預覽的是原始欄位，留白與未完成值保持。載入只替換選定工作台，其他工作台與音檔保留，仍須完整建立驗證。`:
      `${proposal.operation==='music'?'歌曲':'分鏡'}「${proposal.brief.title}」已檢查${result.notes.length?'；'+result.notes.length+' 個創作項目待人工審查':''}。載入只替換該工作台表單，其他工作台與音檔保留。`;
    $('brief-review-notes').replaceChildren();appendNotes($('brief-review-notes'),result.notes);
    $('brief-review').hidden=false;say('需求已檢查，先看預覽再選擇載入');
  },onError:error=>say(error.message,true)
});
$('brief-file').onchange=async event=>{
  const file=event.target.files[0],operation=$('brief-operation').value;
  event.target.value='';
  clearBriefReview();clearConversion();draftTask.begin();clearLibraryReview();
  if(state.busy){briefImporter.cancel();say('目前操作尚未完成，請稍候再載入',true);return;}
  say('正在檢查需求，完成後會先預覽；目前表單與音檔保留。');
  await briefImporter.read(file,operation);
};
$('brief-operation').onchange=()=>{briefImporter.cancel();clearBriefReview();say('已切換需求類型，請重新選擇檔案');};
$('brief-cancel').onclick=()=>{briefImporter.cancel();clearBriefReview();say('已取消需求載入，目前表單保留');};
$('brief-apply').onclick=()=>{
  if(state.busy){say('目前操作尚未完成，請稍候');return;}if(!pendingBrief)return;
  try{
    const selected=briefPreview.proposal();if(!selected)return;
    const previous=captureDraft(),operation=selected.operation,proposal=selected.result.kind==='review'?MusicPlanning.panelDraft(previous,operation,selected.result.panel):MusicPlanning.planningDraft(previous,operation,selected.result.brief);
    applyPlanningPanel(proposal,operation);draftUndo.record(previous,captureDraft(),operation);
    $('draft-undo').disabled=false;draftTask.begin();briefImporter.cancel();clearBriefReview();clearConversion();
    say('需求已載入，可撤回；其他工作台與音檔保留，請重新建立本工作台成果');
  }catch(error){say(error.message,true);}
};
seedController=MusicSeed.createPreview({
  capture:()=>({draft:captureDraft(),fps:$('seed-fps').value,bars_per_shot:$('seed-bars').value}),
  request:(payload,current)=>api('/api/storyboard-seed',payload,false,current?.signal),
  onClear:()=>{$('seed-review').hidden=true;$('seed-content').value='';},
  onReady:(seed,files,source)=>{
    $('seed-review-note').textContent=`${source.origin==='file'?'已檢查檔案起稿「'+source.label+'」；目前歌曲保留。':'依目前歌曲估算。'}「${seed.title}」約 ${seed.duration_seconds} 秒，${seed.slots.length} 鏡。套用會替換分鏡片名、時長、FPS 及全部鏡頭，保留現有視覺基調、人物設定、母題清單與其他工作台。新鏡頭尚未選母題，畫面與狀態留白。`;
    $('seed-content').value=seed.slots.map(slot=>`${slot.shot}. ${slot.section} · ${slot.start}–${slot.end} 秒 · 小節 ${slot.bar_start}–${slot.bar_end}\n任務：${slot.purpose}`).join('\n\n');
    $('seed-review').hidden=false;setFiles(files,(source.origin==='file'?'已檢查檔案':'分鏡時間')+'起稿 · 尚未完成畫面',false,source.origin==='file');say('時間起稿已預覽；分鏡尚未替換，請確認後套用');
  }
});
$('seed-preview').onclick=()=>run($('seed-preview'),async current=>{
  if(!checkMusicReady())return;
  const accepted=await seedController.inspect(current);
  if(!accepted&&current())say('來源或起稿設定已修改，請重新預覽；目前分鏡保留');
});
$('seed-file').onchange=async event=>{
  const file=event.target.files[0];event.target.value='';if(!file)return;
  if(state.busy){say('目前操作尚未完成，請稍候再選擇起稿檔',true);return;}
  await run($('seed-file'),async current=>{
    const accepted=await seedController.read(file,current);
    if(!accepted&&current())say('起稿選擇已取消或分鏡有修改；目前內容保留，請重新選檔');
  },'storyboard');
};
['seed-fps','seed-bars'].forEach(id=>$(id).oninput=()=>{
  if(state.bundles.music?.files['storyboard-seed.json'])markDirty('music');
});
$('seed-cancel').onclick=()=>{seedController.cancel();say('已取消起稿預覽，目前分鏡保留');};
$('seed-apply').onclick=()=>{
  if(state.busy){say('目前操作尚未完成，請稍候');return;}
  try{
    const proposal=seedController.proposal();if(!proposal)return;
    const previous=captureDraft();applyPlanningPanel(proposal,'storyboard');
    draftUndo.record(previous,captureDraft(),'storyboard');$('draft-undo').disabled=false;
    $('shots-collapse').click();$('mv-heading').scrollIntoView({block:'start'});$('shot-jump').focus();
    say('時間起稿已套用，可撤回；請編寫畫面、運鏡、轉場、母題與人物狀態，再檢查分鏡包');
  }catch(error){say(error.message,true);}
};
lyricsSeedController=MusicLyricsSeed.createPreview({
  capture:captureDraft,request:(payload,current)=>api('/api/lyrics-seed',payload,false,current?.signal),
  onClear:()=>{$('lyrics-seed-review').hidden=true;$('lyrics-seed-content').value='';},
  onReady:(seed,files,origin)=>{
    $('lyrics-seed-note').textContent=`「${seed.title}」共${seed.lines.length}句，時間尚未標記。套用只替換校時名稱、原文與格式、全部逐句內容；保留歌曲／分鏡／交付條件、目前時長與音檔。原始文字及空白行留在起稿資料，開始與結束留白；段落標籤請人工調整。`;
    $('lyrics-seed-content').value=seed.source_text; $('lyrics-seed-review').hidden=false;
    setFiles(files,'未校時歌詞起稿 · '+seed.title,false,origin==='file');say('歌詞起稿已預覽，校時表格尚未替換；確認後套用');
    $('lyrics-seed-review').scrollIntoView({block:'nearest'});$('lyrics-seed-apply').focus({preventScroll:true});
  }
});
$('music-lyrics-seed').onclick=()=>run($('music-lyrics-seed'),async current=>{
  lyricsImportController?.cancel();
  const accepted=await lyricsSeedController.inspect(current);if(!accepted&&current())say('起稿期間來源已有修改；目前內容保留，請重新預覽');
});
$('lyrics-seed-cancel').onclick=()=>{lyricsSeedController.cancel();say('已取消歌詞起稿，校時表格與音檔保留');};
$('lyrics-seed-apply').onclick=()=>{
  if(state.busy){say('目前操作尚未完成，請稍候');return;}
  try{const proposal=lyricsSeedController.proposal();if(!proposal)return;
    const previous=captureDraft();applyPlanningPanel(proposal,'lyrics');draftUndo.record(previous,captureDraft(),'lyrics');$('draft-undo').disabled=false;
    $('cues').querySelector('input')?.focus({preventScroll:true});say('未校時句子已套用，可撤回；請依音檔分別記下開始與結束，再驗證匯出');
  }catch(error){say(error.message,true);}
};
lyricsImportController=MusicLyricsImport.createImport({
  capture:captureDraft,request:(operation,payload,current)=>api('/api/'+operation.replace('_','-'),payload,false,current?.signal),
  onClear:()=>{$('lyrics-import-review').hidden=true;$('lyrics-import-source').value='';$('lyrics-import-rows').replaceChildren();$('lyrics-import-apply').textContent='套用這份歌詞';},
  onState:({reading,ready})=>{
    $('lyrics-import-apply').disabled=reading||!ready;
    if(reading){$('lyrics-import-review').hidden=false;$('lyrics-import-note').textContent='正在讀取與檢查歌詞；目前原文、表格與音檔保留，可取消。';}
    else if(!ready)$('lyrics-import-review').hidden=true;
  },
  onError:error=>say(error.message,true),
  onReady:view=>{
    $('lyrics-import-note').textContent=`${view.name} · 「${view.title}」共${view.count}句。${view.notice} ${view.packageImport?'歌詞包總長'+view.durationText+'；名稱與時間來源保留。'+(view.durationEstimated?'估計值不填入時長欄，目前時長保留。':'未填時長會接續來源的宣告值。'):'目前時長保留。'} 套用會替換校時名稱、原文／格式及全部句子；音檔與其他工作台保留。${view.convertedText?'純文字轉存為保留原文的起稿JSON，時間留白。':''}${view.multilineSrt?' SRT多行以 / 合成單句，每行原字元保留；原排版另存，匯入原文仍保留。':''}${view.legacyTimed?'這是舊格式完整歌詞包；明確轉換後另存版本1 JSON，原檔保留。':''}${view.reviewNotes.length?' 待確認：'+view.reviewNotes.join('；'):''}`;
    $('lyrics-import-apply').textContent=view.legacyTimed?'轉換舊歌詞包並套用':'套用這份歌詞';
    $('lyrics-import-source').value=view.source;$('lyrics-import-count').textContent=`預覽前${view.rows.length}句，共${view.count}句；其餘內容保留，套用不截短。`;
    const body=$('lyrics-import-rows');body.replaceChildren();
    view.rows.forEach(cue=>{const row=document.createElement('tr');[cue.start||'尚未標記',cue.end||'尚未標記',cue.text].forEach(value=>{const cell=document.createElement('td');cell.textContent=value;row.append(cell);});body.append(row);});
    $('lyrics-import-review').hidden=false;$('lyrics-import-apply').disabled=false;
    say('歌詞已檢查並預覽；目前原文與表格尚未替換');$('lyrics-import-review').scrollIntoView({block:'nearest'});$('lyrics-import-apply').focus({preventScroll:true});
  }
});
$('lyrics-import-cancel').onclick=()=>{lyricsImportController.cancel();say('已取消歌詞匯入；原文、表格與音檔保留');};
$('lyrics-import-apply').onclick=()=>{
  if(state.busy){say('目前操作尚未完成，請稍候');return;}
  try{const proposal=lyricsImportController.proposal();if(!proposal)return;
    const previous=captureDraft();applyPlanningPanel(proposal.draft,'lyrics');draftUndo.record(previous,captureDraft(),'lyrics');$('draft-undo').disabled=false;
    setFiles(proposal.files,(proposal.untimed?'匯入歌詞起稿 · ':'已檢查匯入歌詞 · ')+proposal.title,false,proposal.untimed);
    $('cues').querySelector('input')?.focus({preventScroll:true});say(proposal.untimed?'未校時歌詞已套用，可撤回；請依音檔標記開始與結束':proposal.notice+'；已套用，可撤回，請實聽核對');
  }catch(error){say(error.message,true);}
};
let libraryEnabled=false,libraryListJobs=0,libraryReadingId=null,libraryPending=false,librarySaving=false;
let libraryRecords=[],libraryCursor=null,pendingLibraryReview=null,libraryPreferredId=null;
let libraryMode='all',librarySearchState={pending:false,stale:false,canContinue:false};
let librarySearchContext=null,libraryIssueCount=0;
const libraryPresenter=MusicLibraryPresentationDom.createPresenter(document,{
  capture:()=>({enabled:libraryEnabled,mode:libraryMode,displayed_count:libraryRecords.length,
    selected:libraryRecords.find(record=>record.id===$('library-select').value)||null,search:librarySearchContext,
    issue_count:libraryIssueCount,stale:librarySearchState.stale,pending:librarySearchState.pending}),
  onError:error=>librarySay(error.message,true)
});
function librarySay(message,error=false){$('library-status').textContent=message;$('library-status').classList.toggle('error',error);}
function libraryControls(){
  backupControls();
  $('library-save').disabled=!libraryEnabled||libraryPending||librarySaving;
  $('library-refresh').disabled=!libraryEnabled||libraryListJobs>0;
  $('library-search').disabled=!libraryEnabled||librarySearchState.pending;
  $('library-search-query').disabled=!libraryEnabled;
  $('library-search-cancel').hidden=!librarySearchState.pending;
  $('library-more').hidden=!libraryCursor;$('library-more').disabled=libraryListJobs>0||librarySearchState.pending||libraryMode==='search'&&!librarySearchState.canContinue;
  $('library-select').disabled=!libraryRecords.length;
  $('library-preview').disabled=!libraryEnabled||!libraryRecords.length||libraryReadingId===$('library-select').value;
  $('library-retry').hidden=!libraryPending;$('library-retry').disabled=librarySaving;
  $('library-abandon').hidden=!libraryPending;$('library-abandon').disabled=librarySaving;
  libraryPresenter.update();
}
function clearLibraryReview(){libraryController.cancelRead();pendingLibraryReview=null;$('library-review').hidden=true;$('library-review-content').value='';}
function librarySelection(){
  const choice=$('library-select').value;
  if(libraryReadingId&&libraryReadingId!==choice||pendingLibraryReview&&pendingLibraryReview.entry.id!==choice)clearLibraryReview();
  libraryControls();
}
function publishLibraryRecords(result,append){
  const selected=libraryPreferredId||$('library-select').value;
  const records=append?[...libraryRecords,...result.entries]:result.entries;
  libraryRecords=[...new Map(records.map(r=>[r.id,r])).values()];libraryCursor=result.next_cursor;
  $('library-select').replaceChildren();libraryRecords.forEach(r=>$('library-select').append(new Option(`${r.label} · ${r.stored_at}`,r.id)));
  if(libraryRecords.some(r=>r.id===selected))$('library-select').value=selected;
  libraryPreferredId=null;librarySelection();
}
const librarySearch=MusicLibrarySearch.createController({
  capture:()=>$('library-search-query').value,request:payload=>api('/api/drafts/search',payload),
  onState:value=>{librarySearchState=value;libraryControls();},
  onReady:(result,append)=>{
    libraryIssueCount=result.issues.length;librarySearchContext={query:result.query,record_count:result.record_count,match_count:result.match_count,issue_count:libraryIssueCount};
    libraryMode='search';publishLibraryRecords(result,append);
    librarySay('搜尋清單已更新；選定版本後預覽，才會載入。');
  },onError:error=>librarySay(error.message,true)
});
const libraryController=MusicLibrary.createLibraryController({
  preview:libraryPreview,
  request:async(action,payload)=>MusicLibraryResult.checkedEnvelope(action,await api('/api/drafts/'+action,payload)),
  confirmSave:MusicLibraryReceipt.createVerifier({read:async id=>MusicLibraryResult.checkedEnvelope('read',await api('/api/drafts/read',{id})),validate:MusicEditor.validateDraft}),
  checkRead:(id,result,validate,entry)=>{if(!entry)throw Error('請先選定保存版本，再重新預覽');const ready=MusicLibraryRevision.checkedRead(id,result,validate,entry);checkedLibrarySelection(id,ready.entry);return ready;},
  checkList:(payload,result)=>MusicLibraryResult.checkedList(payload,result,payload.cursor===null?null:libraryRecords.find(entry=>entry.id===payload.cursor)),
  capture:captureDraft,validate:MusicEditor.validateDraft,newId:()=> 'draft-'+crypto.randomUUID().replaceAll('-',''),
  onPending:({pending,saving})=>{libraryPending=pending;librarySaving=saving;libraryControls();if(saving)librarySay('正在保存並回讀核對；完成前保留目前編修。');},
  onSaved:({entry,reused,changed,draft})=>{
    draftRetention.retain(draft,{kind:'library',label:entry.label});
    libraryPreferredId=entry.id;
    librarySay(`「${entry.label}」${reused?'已確認為同一筆保存':'已保存為新版本'}；${changed?'按下保存後的修改尚未保存':'可重新開啟本頁後載入'}。音檔與成果另存。`);
    refreshLibrary(false);
  },
  onList:(result,append)=>{
    librarySearchContext=null;libraryIssueCount=result.issues.length;
    libraryMode='all';publishLibraryRecords(result,append);
  },
  onReady:({entry,draft})=>{
    pendingLibraryReview={entry,draft};$('library-review-note').textContent=`「${entry.label}」· ${entry.stored_at} · ${draft.panels.music.sections.length} 段／${draft.panels.storyboard.shots.length} 鏡／${draft.panels.lyrics.cues.length} 句。SHA-256 與草稿 v3 已核對；創作內容尚需重新驗證。`;
    const content=JSON.stringify(draft,null,2)+'\n';$('library-review-content').value=content;
    $('library-review').hidden=false;librarySay('保存版本已預覽，目前工作台與音檔保留。');
  },
  onError:(error,{retryable})=>librarySay(error.message+(retryable?'；結果尚未確認，重試會使用同一 ID 與原內容，也可先重新整理保存版本。':''),true)
});
async function refreshLibrary(report=true,more=false){
  if(!libraryEnabled)return;
  librarySearch.cancel();
  libraryListJobs++;libraryControls();
  try{const ok=await libraryController.list(more?libraryCursor:null);if(ok&&report)librarySay('保存版本清單已更新；預覽後才會載入。');}
  finally{libraryListJobs--;libraryControls();}
}
function libraryAllowed(){if(state.busy){librarySay('目前工作包處理尚未完成，請稍候。',true);return false;}return libraryEnabled;}
$('library-save').onclick=()=>{if(libraryAllowed())libraryController.save($('library-label').value);};
$('library-retry').onclick=()=>{if(libraryAllowed())libraryController.retry();};
$('library-abandon').onclick=()=>{if(libraryController.abandon())librarySay('已放棄待重試紀錄；可能已保存的版本保留。先重新整理確認，再明確建立新版本。');};
$('library-refresh').onclick=()=>refreshLibrary();
$('library-more').onclick=()=>libraryMode==='search'?librarySearch.search(true):refreshLibrary(true,true);
$('library-search-form').onsubmit=event=>{event.preventDefault();if(!libraryAllowed())return;libraryController.cancelList();librarySearch.search();};
$('library-search-query').oninput=()=>librarySearch.invalidate();
$('library-search-cancel').onclick=()=>{librarySearch.cancel();librarySay('已取消搜尋等待；目前清單、草稿與音檔保留。');};
$('library-select').onchange=()=>{clearLibraryReview();librarySelection();librarySay('選定版本已變更，請重新預覽；目前工作台與音檔保留。');};
$('library-preview').onclick=async()=>{
  if(!libraryAllowed())return;const id=$('library-select').value;if(!id||libraryReadingId===id)return;
  clearLibraryReview();draftTask.begin();clearConversion();briefImporter.cancel();clearBriefReview();
  libraryReadingId=id;libraryControls();librarySay('正在讀取選定保存版本，核對後顯示預覽。');
  try{await libraryController.read(id,libraryRecords.find(entry=>entry.id===id));}finally{if(libraryReadingId===id)libraryReadingId=null;libraryControls();}
};
function checkedLibrarySelection(id,entry){
  if(id!==$('library-select').value)throw Error('選定保存版本已有變更，請重新預覽；目前內容保留');
  return MusicLibraryRevision.checkedSelection(id,entry,libraryRecords.find(selected=>selected.id===id));
}
function checkedLibraryReview(){
  if(!pendingLibraryReview)throw Error('請先預覽保存版本');
  checkedLibrarySelection(pendingLibraryReview.entry.id,pendingLibraryReview.entry);return pendingLibraryReview;
}
$('library-apply').onclick=()=>{
  if(!libraryAllowed()||!pendingLibraryReview)return;
  try{checkedLibraryReview();const proposal=libraryPreview.proposal();if(!proposal)return;loadDraft(proposal.draft,{kind:'library',label:proposal.entry.label});
    librarySay(`已載入「${proposal.entry.label}」；可撤回本次載入，請重選音檔並重新建立成果。`);
  }catch(error){librarySay(error.message,true);}
};
$('library-cancel').onclick=()=>{clearLibraryReview();librarySay('已取消版本預覽，目前工作台保留。');};
textDownloader.bind($('library-export'),{select:()=>{if(!libraryAllowed()||!pendingLibraryReview)throw Error('請先預覽保存版本');const selected=checkedLibraryReview();return {name:selected.entry.id+'.json',content:JSON.stringify(selected.draft,null,2)+'\n'};},onSent:()=>librarySay('已送出保存版本的 JSON 下載；原版本保留。'),onError:error=>librarySay(error.message,true)});
let backupReading=false,backupRestoring=false,backupReady=false,backupCanRestore=false,backupMaximum=32*1024*1024,backupDownloading=false;
function backupSay(message,error=false){$('backup-status').textContent=message;$('backup-status').classList.toggle('error',error);}
function backupControls(){
  $('backup-save').disabled=!libraryEnabled||backupRestoring||backupDownloading;
  $('backup-open').disabled=!libraryEnabled||backupRestoring||backupDownloading;
  $('backup-restore').disabled=!libraryEnabled||backupReading||backupRestoring||backupDownloading||!backupReady||!backupCanRestore;
  $('backup-cancel').disabled=backupRestoring;
}
async function backupRequest(operation,file,sha){
  const response=await fetch('/api/drafts/backup/'+operation+(sha?'?sha256='+encodeURIComponent(sha):''),{method:'POST',body:file});
  const result=await response.json();
  if(!response.ok){const error=Error(result.error||'本機備份操作未完成');error.status=response.status;throw error;}
  return result;
}
const backupController=MusicBackup.createBackupController({request:backupRequest,maximum:()=>backupMaximum,
  hashFile:MusicBackupFile.inspect,checkPlan:MusicBackupResult.checkedInspect,checkRestore:MusicBackupResult.checkedRestore,
  onState:({reading,restoring,ready,canRestore})=>{backupReading=reading;backupRestoring=restoring;backupReady=ready;backupCanRestore=canRestore;
    if(!ready)$('backup-review').hidden=true;backupControls();},
  onPreview:(plan,name)=>{
    $('backup-review-note').textContent=`「${name}」已核對：${plan.entry_count} 版，新增 ${plan.new_count}、相同 ${plan.reused_count}、衝突 ${plan.conflicts.length}。${plan.capacity_ok?'容量允許':'目前草稿庫容量不足'}。SHA-256：${plan.backup_sha256}`;
    $('backup-review-content').value=plan.entries.slice(0,20).map(e=>`${e.label} · ${e.stored_at}`).join('\n')+(plan.entries.length>20?'\n… 預覽前 20 版，備份內所有版本已檢查。':'');
    $('backup-review').hidden=false;
    backupSay(plan.can_restore?'備份已預覽，尚未加入草稿庫；目前工作台與音檔保留。':'備份含 ID 衝突或容量不足；請另選草稿庫或處理後重新預覽。',!plan.can_restore);
  },
  onRestored:result=>{backupSay(`恢復完成：加入 ${result.added_count} 版，原有相同 ${result.reused_count} 版保留。工作台與音檔保留，預覽保存版本後才會載入。`);refreshLibrary(false);},
  onError:(error,{retryable})=>backupSay(error.message+(retryable?'；結果尚未確認，保留同一備份再次按下恢復，會略過已恢復的相同版本。':''),true)
});
$('backup-open').onchange=()=>{
  const file=$('backup-open').files[0];$('backup-open').value='';
  if(!file||!libraryAllowed())return;backupSay('正在檢查備份，尚未加入任何版本。');backupController.inspect(file);
};
$('backup-restore').onclick=()=>{if(libraryAllowed())backupController.restore();};
$('backup-cancel').onclick=()=>{if(backupController.cancel())backupSay('已取消恢復預覽；草稿庫與工作台保留。');};
state.backupDownload=MusicBackupDownloadDom.createAdapter(document,{
  prepare:async signal=>{
    const response=await fetch('/api/drafts/backup/prepare',{method:'POST',headers:{'Content-Type':'application/json'},body:'{}',signal});
    const data=await response.json();if(!response.ok)throw Error(data.error||'備份未完成');return data;
  },maximum:()=>backupMaximum,allowed:libraryAllowed,say:backupSay,
  onState:({busy})=>{backupDownloading=busy;backupControls();}
});
async function setupLibrary(){
  try{const response=await fetch('/api/capabilities');if(!response.ok)throw Error('無法確認草稿庫狀態');
    const info=await response.json();libraryEnabled=info.draft_library_enabled===true;backupMaximum=info.draft_backup.max_archive_bytes;
    $('library-note').textContent=libraryEnabled?'本機草稿庫已啟用；保存版本不含音檔、成果或刪除還原紀錄。':'草稿庫未啟用。停止服務後，以 python music_lab_server.py --draft-library outputs/drafts 啟動，即可明確保存到本機；目前仍可下載草稿。';
    libraryControls();if(libraryEnabled)await refreshLibrary(false);
  }catch(error){librarySay(error.message,true);libraryControls();}
}
state.deliveryNavigation=MusicDeliveryNavigationDom.createAdapter(document,()=>({scope:state.tab,names:Object.keys(state.files),busy:state.busy,dirty:!!state.bundles[state.tab]?.dirty,message:$('status').textContent,error:$('status').classList.contains('error')}));
state.operationControl=MusicOperationControlDOM.createAdapter(document,{capture:()=>operationGate.view(),cancel:cancelRun});
state.audioAcceptance=MusicAudioAcceptanceDom.createAdapter(document,{readValue,writeValue,events:window,allowed:()=>!state.busy,downloadText:(name,content)=>textDownloader.send(name,content),onChange:()=>markDirty('audio'),onError:error=>say(error.message,true)});
state.deliveryPackage=MusicDeliveryPackageDom.createAdapter(document,{capture:()=>({scope:state.tab,label:state.bundles[state.tab]?.deliveryLabel??state.bundles[state.tab]?.note??'',files:state.files,busy:state.busy,dirty:!!state.bundles[state.tab]?.dirty}),run,request:(payload,current)=>api('/api/delivery-package/prepare',payload,false,current?.signal),discard:id=>api('/api/delivery-package/discard',{id}),say});
state.deliveryImport=MusicDeliveryImportDom.createAdapter(document,{
  downloadText:(name,content)=>textDownloader.send(name,content),
  capture:()=>({scope:state.tab,revision:state.revisions[state.tab]||0,resultRevision:state.resultRevisions[state.tab]||0,bundle:state.bundles[state.tab]||null,busy:state.busy,media:[$('audio-file').files[0]||null,$('lyrics-audio').files[0]||null]}),
  read:async file=>{const raw=await file.arrayBuffer();if(raw.byteLength!==file.size||raw.byteLength>MusicDeliveryPackage.maxArchive)throw Error('選定ZIP大小不符');const digest=new Uint8Array(await crypto.subtle.digest('SHA-256',raw));const sha256=Array.from(digest,v=>v.toString(16).padStart(2,'0')).join('');return {selected:{bytes:raw.byteLength,sha256,manifest:MusicDeliveryArchive.manifest(raw)},wire:await api('/api/delivery-inspect',raw,true)};},
  replace:wire=>{const m=wire.data.manifest;setFiles(wire.files,`匯入ZIP · ${m.label||m.scope} · 僅核對文字檔案，表單保持`,false,true,m.label);say('已載入ZIP文字成果；表單與音檔保持，創作及媒體尚待驗收。');},
  restore:(bundle,revision)=>{if(bundle)setFiles(bundle.files,bundle.note,bundle.dirty||(!bundle.inputIndependent&&(state.revisions[state.tab]||0)!==revision),bundle.inputIndependent,bundle.deliveryLabel);else{delete state.bundles[state.tab];clearOutput();}say('已撤回成果匯入；後續表單編修與音檔保持。');},
  onError:error=>say(error.message,true),onReady:()=>say('ZIP核對完成；尚未載入，請確認文字成果與來源。')
});
async function initialize(){refreshExampleControls();draftRetention.initialize(captureDraft());try{const response=await fetch('/api/examples');if(!response.ok)throw Error('範例讀取失敗');state.examples=await response.json();
  if(!state.busy&&draftRetention.status().atInitial){loadMusic();loadMv();writeValue($('lyrics-source'),'[00:00.000]空房剩一圈淡色的牆\n[00:04.000]紙箱裡裝不下那句話\n[00:08.000]我把聲音留在樓梯上\n[00:12.000]這次換我回答');draftRetention.initialize(captureDraft());say('已載入本次原創合成範例，修改後開始');}
  else if(!state.busy)say('載入期間的編修已保留；需要範例時可明確按「載入原創範例」。');drawWave();setupLibrary();}catch(e){say(e.message,true);}finally{refreshExampleControls();}}
initialize();

state.audioAcceptanceReview=MusicAudioAcceptanceReviewDom.createAdapter(document,{capture:()=>state.audioAcceptance.capture(),allowed:()=>!state.busy,onError:message=>say(message,true)});
$('audio-accept-ready-report').onclick=()=>{if(state.busy)return;try{state.audioAcceptanceReview.check();}catch(error){say(error.message,true);return;}return run($('audio-accept-ready-report'),async current=>{
  const document=state.audioAcceptance.capture();const reply=await api('/api/audio-acceptance-review',{document},false,current.signal);if(!current())return;
  const accepted=MusicAudioAcceptanceReview.checkedResult(document,reply);$('audio-visual').hidden=true;
  setFiles(accepted.files,`接受條件檢查 · 待辦 ${accepted.data.issue_count} 項`);say('條件檢查報告已建立；請接續音檔分析與實聽');
});};
