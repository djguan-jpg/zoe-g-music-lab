// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
const $ = id => document.getElementById(id);
const state = {tab:'music', examples:null, files:{}, bundles:{}, revisions:{}, music:[], shots:[], cues:[], audioUrl:null, audioContext:null, waveform:null, busy:false, undoDraft:null, undoScope:null};
const deletionHistory=MusicHistory.createHistory(20);
let rowSequence=0;
const rowIds=(items,ids)=>ids||items.map(()=>`row-${++rowSequence}`);
const collections={
  arrangement:{scope:'music',label:'段落',limit:MusicEditor.draftRows.music.limit},
  'music-avoid':{scope:'music',label:'避免事項',limit:100},
  'music-deliverables':{scope:'music',label:'交付項目',limit:100},
  motifs:{scope:'storyboard',label:'母題',limit:30},
  shots:{scope:'storyboard',label:'鏡頭',limit:MusicEditor.draftRows.storyboard.limit},
  cues:{scope:'lyrics',label:'歌詞句',limit:10000}
};
function entriesFor(list){
  return [...$(list).children].map(row=>{
    let value;
    if(list==='arrangement')value=Object.fromEntries(['name','bars','energy','focus','texture'].map((key,i)=>[key,row.querySelectorAll('input')[i].value]));
    else if(list==='cues')value=Object.fromEntries(['start','end','text'].map((key,i)=>[key,row.querySelectorAll('input')[i].value]));
    else if(list==='shots')value={...Object.fromEntries([...row.querySelectorAll('[data-key]')].map(x=>[x.dataset.key,x.value])),open:row.querySelector('details').open};
    else if(list==='motifs')value={id:row.dataset.motifId,name:row.querySelector('[data-motif="name"]').value,meaning:row.querySelector('[data-motif="meaning"]').value};
    else value=row.querySelector('textarea').value;
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
  select.disabled=!record;if(record)select.value=String(records.length-1);
  refreshDeletionButton(scope);
  $(scope+'-delete-note').textContent=record?`本工作台可還原 ${deletionHistory.size(scope)} 次刪除；其他內容的編修保留。`:'本頁最多保留 20 次刪除；載入新內容會清除此工作台紀錄。';
}
function refreshDeletionButton(scope){
  const record=deletionHistory.at(scope,Number($(scope+'-delete-select').value)),button=$(scope+'-delete-undo');
  button.disabled=!record;button.textContent=record?`還原：${record.label}`:'還原最近刪除';
}
function clearDeletionHistory(scope){deletionHistory.clear(scope);refreshDeletionHistory(scope);}
function focusEntry(list,index){
  const row=$(list).children[index];if(!row)return;
  if(list==='shots'){focusShot(index);return;}
  row.querySelector('input,textarea')?.focus();
}
function deleteEntry(list,index){
  if(state.busy){say('目前操作尚未完成，請稍候');return;}
  const spec=collections[list],before=entriesFor(list),removed=MusicHistory.remove(before,index);
  let remaining=removed.remaining,record=removed.record;
  if(list==='shots'){
    const duration=$('mv-duration').value,compact=MusicEditor.compactShotTimes(remaining.map(e=>e.value));
    if(compact){remaining=remaining.map((e,i)=>({...e,value:compact[i]}));$('mv-duration').value=compact.length?compact.at(-1).end:'0';}
    record=MusicHistory.effects(record,before,remaining,['start','end'],{'mv-duration':duration},{'mv-duration':$('mv-duration').value});
  }
  const value=record.entry.value,summary=String(typeof value==='string'?value:
    value.name||value.text||value.section||'').replace(/\s+/g,' ').trim();
  const caption=Array.from(summary);
  record.list=list;record.label=`${spec.label} ${index+1}${summary?' · '+caption.slice(0,24).join('')+(caption.length>24?'…':''):''}`;
  writeEntries(list,remaining);deletionHistory.push(spec.scope,record);refreshDeletionHistory(spec.scope);
  markDirty(spec.scope);focusEntry(list,Math.min(index,remaining.length-1));
  say(`已刪除${record.label}，可還原；${list==='shots'?'請重新檢查分鏡時間':'重新建立成果後更新'}`);
}
function undoDeletion(scope){
  if(state.busy){say('目前操作尚未完成，請稍候');return;}
  const index=Number($(scope+'-delete-select').value),record=deletionHistory.at(scope,index);if(!record)return;
  try{
    const spec=collections[record.list],fields=record.list==='shots'?{'mv-duration':$('mv-duration').value}:{};
    const result=MusicHistory.restore(entriesFor(record.list),record,{limit:spec.limit,fields});
    Object.entries(result.fields).forEach(([id,value])=>$(id).value=value);
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
function say(message,error=false){$('status').textContent=message;$('status').className=error?'error':'';if(state.tab==='storyboard'){$('shot-status').textContent=message;$('shot-status').classList.toggle('error',error);}}
function esc(value){return String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function field(value,label,type='text',wide=false){return `<input type="${type}" value="${esc(value)}" aria-label="${esc(label)}" class="${wide?'wide':''}" ${type==='number'?'step="0.001"':''}>`;}
async function api(route,data,binary=false){const response=await fetch(route,{method:'POST',headers:{'Content-Type':binary?'application/octet-stream':'application/json'},body:binary?data:JSON.stringify(data)});const result=await response.json();if(!response.ok){const error=Error(result.error||'操作未完成');error.status=response.status;throw error;}return result;}
async function run(button,task){if(state.busy)return;const tab=state.tab,revision=state.revisions[tab]||0;say('處理中，請稍候');state.busy=true;button.disabled=true;try{await task(()=> (state.revisions[tab]||0)===revision);if((state.revisions[tab]||0)!==revision){markDirty(tab);say('處理期間輸入有修改，請重新建立成果');}}catch(error){say(error.message,true);}finally{state.busy=false;button.disabled=false;}}
function setFiles(files,note,dirty=false){state.files=files;state.bundles[state.tab]={files,note,dirty};const select=$('output-file');select.replaceChildren();Object.keys(files).forEach(name=>{const option=document.createElement('option');option.value=name;option.textContent=name;select.append(option);});select.disabled=false;$('download').disabled=dirty;$('output-note').textContent=note+(dirty?'（有修改尚未重新驗證）':'');previewOutput();}
function markDirty(tab){state.revisions[tab]=(state.revisions[tab]||0)+1;const saved=state.bundles[tab];if(!saved)return;saved.dirty=true;if(state.tab===tab){$('download').disabled=true;$('output-note').textContent=saved.note+'（有修改尚未重新驗證）';}}
document.querySelector('.editor').addEventListener('input',event=>{
  if(event.target.dataset.viewControl||event.target.id==='lyrics-file')return;
  const panel=event.target.closest('.panel');if(!panel)return;
  markDirty(panel.id);
  if(panel.id==='storyboard')refreshShotOverview();
  if(['lyrics-source','lyrics-format'].includes(event.target.id))lyricFileImport.cancel();
  if(panel.id==='lyrics'&&event.target.closest('#cues'))tick();
});
function clearOutput(){state.files={};$('output-file').replaceChildren(new Option('尚無檔案',''));$('output-file').disabled=true;$('download').disabled=true;$('output-content').value='';$('output-note').textContent='建立工作包後，實際成果會出現在這裡。';}
function previewOutput(){const name=$('output-file').value;$('output-content').value=state.files[name]??'';$('export-name').value=name;$('export-content').value=state.files[name]??'';}
$('output-file').onchange=previewOutput;
$('export-form').onsubmit=()=>{say('已送出本機下載，請確認瀏覽器保存的檔案。');};
document.querySelectorAll('[data-tab]').forEach(button=>button.onclick=()=>{if(state.busy){say('目前操作尚未完成，請稍候');return;}state.tab=button.dataset.tab;document.querySelectorAll('.panel').forEach(section=>section.hidden=section.id!==state.tab);document.querySelectorAll('[data-tab]').forEach(b=>{b.classList.toggle('active',b===button);if(b===button)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current');});const saved=state.bundles[state.tab];if(saved)setFiles(saved.files,saved.note,saved.dirty);else clearOutput();say(saved?.dirty?'有修改尚未重新驗證，請重新建立成果':'準備開始');});
function renderSections(sections,ids){const keys=rowIds(sections,ids);$('arrangement').innerHTML=sections.map((s,i)=>`<tr data-history-id="${esc(keys[i])}"><td>${field(s.name,`段落 ${i+1} 名稱`)}</td><td>${field(s.bars,`段落 ${i+1} 小節`,'number')}</td><td>${field(s.energy,`段落 ${i+1} 能量`,'number')}</td><td>${field(s.focus,`段落 ${i+1} 任務`,'text',true)}</td><td>${field(s.texture,`段落 ${i+1} 聲音`,'text',true)}</td><td><button type="button" data-remove-section="${i}" aria-label="刪除段落 ${i+1}">刪除</button></td></tr>`).join('');$('arrangement').querySelectorAll('[data-remove-section]').forEach((b,i)=>b.onclick=()=>deleteEntry('arrangement',i));}
function requirementValues(id){return [...$(id).querySelectorAll('textarea')].map(input=>input.value);}
function clearRequirementError(id){
  $(id+'-error').hidden=true;$(id+'-error').textContent='';
  $(id).querySelectorAll('.requirement-error').forEach(note=>{note.hidden=true;note.textContent='';});
  $(id).querySelectorAll('textarea').forEach(input=>{input.removeAttribute('aria-invalid');input.removeAttribute('aria-describedby');});
  if(id==='music-deliverables')$('deliverable-add').removeAttribute('aria-describedby');
}
function showRequirementIssue(issue){
  const id=issue.key==='avoid'?'music-avoid':'music-deliverables';
  const input=issue.index===null?$('deliverable-add'):$(id).querySelectorAll('textarea')[issue.index];
  const note=issue.index===null?$(id+'-error'):input.closest('.requirement-item').querySelector('.requirement-error');
  note.textContent=issue.message;note.hidden=false;
  if(input.tagName==='TEXTAREA')input.setAttribute('aria-invalid','true');
  input.setAttribute('aria-describedby',note.id);input.focus();say(issue.message,true);
}
function renderRequirements(id,items,label,ids){
  const keys=rowIds(items,ids);
  clearRequirementError(id);
  $(id).innerHTML=items.map((item,index)=>`<div class="requirement-item" data-history-id="${esc(keys[index])}"><label>${label} ${index+1}<textarea rows="2" aria-label="${label} ${index+1}">${esc(item)}</textarea></label><p id="${id}-item-error-${index+1}" class="requirement-error" role="status" aria-live="polite" hidden></p><button type="button" class="subtle" aria-label="刪除${label} ${index+1}">刪除</button></div>`).join('');
  $(id).querySelectorAll('button').forEach((button,index)=>button.onclick=()=>{
    deleteEntry(id,index);
  });
}
function addRequirement(id,label){const items=requirementValues(id);if(items.length>=100){say(`${label}最多 100 項`,true);return;}
  const ids=entriesFor(id).map(e=>e.id);items.push('');ids.push(`row-${++rowSequence}`);renderRequirements(id,items,label,ids);markDirty('music');$(id).lastElementChild.querySelector('textarea').focus();}
$('avoid-add').onclick=()=>addRequirement('music-avoid','避免事項');
$('deliverable-add').onclick=()=>addRequirement('music-deliverables','交付項目');
['music-avoid','music-deliverables'].forEach(id=>$(id).addEventListener('input',()=>clearRequirementError(id)));
function loadMusic(){clearDeletionHistory('music');const b=structuredClone(state.examples.music);[['music-title',b.title],['music-hook',b.memory_hook],['music-theme',b.theme],['music-style',b.style],['music-vocal',b.vocal],['music-audience',b.audience],['music-bpm',b.bpm],['music-beats',b.beats_per_bar],['music-lyrics',b.existing_lyrics],['music-language',b.language]].forEach(([id,value])=>$(id).value=value);renderSections(b.arrangement);renderRequirements('music-avoid',b.avoid,'避免事項');renderRequirements('music-deliverables',b.deliverables,'交付項目');$('music-visual').hidden=true;}
$('music-example').onclick=()=>{loadMusic();markDirty('music');say('已載入本次原創合成範例，可直接修改');};
$('section-add').onclick=()=>{try{const entries=entriesFor('arrangement');if(entries.length>=collections.arrangement.limit)throw Error('段落最多 40 列');entries.push({id:`row-${++rowSequence}`,value:{name:'新段落',bars:'8',energy:'3',focus:'',texture:''}});writeEntries('arrangement',entries);markDirty('music');}catch(e){say(e.message,true);}};
$('music-form').onsubmit=event=>{event.preventDefault();if(state.busy)return;
  clearRequirementError('music-avoid');clearRequirementError('music-deliverables');
  const issue=MusicPlanning.requirementIssue({avoid:requirementValues('music-avoid'),deliverables:requirementValues('music-deliverables')});
  if(issue){showRequirementIssue(issue);return;}
  run(event.submitter,async()=>{const brief=MusicPlanning.planningBrief(captureDraft(),'music');const result=await api('/api/music',brief);setFiles(result.files,`歌曲設計 · ${result.data.duration_seconds} 秒 · ${result.data.sections.length} 段`);const box=$('music-visual');box.replaceChildren();const title=document.createElement('h3');title.textContent='段落能量曲線';box.append(title);result.data.sections.forEach(s=>{const row=document.createElement('div');row.className='timeline-item';const name=document.createElement('span');name.textContent=s.section;const track=document.createElement('div');track.className='energy-track';const fill=document.createElement('div');fill.className='energy-fill';fill.style.width=`${s.energy*20}%`;track.append(fill);const time=document.createElement('span');time.className='timeline-time';time.textContent=`${s.start}–${s.end}s`;row.append(name,track,time);box.append(row);});appendNotes(box,result.data.review_notes);box.hidden=false;say('歌曲設計包已建立；可檢視與下載 4 個檔案');});};
function appendNotes(box,notes){const ul=document.createElement('ul');ul.className='review-list';notes.forEach(note=>{const li=document.createElement('li');li.textContent=typeof note==='string'?note:`${note.shot?'鏡頭 '+note.shot+'：':''}${note.message}`;ul.append(li);});box.append(ul);}
const shotFields=[['section','歌曲段落'],['purpose','敘事用途'],['visual','畫面動作'],['camera','鏡頭運動'],['transition','尾鏡與轉場'],['motif_state','母題狀態'],['character_state','人物狀態'],['change_reason','變化理由']];
function getMotifs(){return [...$('motifs').children].map(row=>({id:row.dataset.motifId,name:row.querySelector('[data-motif="name"]').value,meaning:row.querySelector('[data-motif="meaning"]').value}));}
function rawShots(){return [...$('shots').children].map(article=>Object.fromEntries([...article.querySelectorAll('[data-key]')].map(input=>[input.dataset.key,input.value])));}
function motifOptions(motifs,selected){return '<option value="">請選擇母題</option>'+motifs.map((m,i)=>`<option value="${esc(m.id)}" ${m.id===selected?'selected':''}>${esc(m.name||'未命名母題 '+(i+1))}</option>`).join('');}
function refreshMotifChoices(){const motifs=getMotifs();$('shots').querySelectorAll('[data-key="motif_id"]').forEach(select=>{const selected=select.value;select.innerHTML=motifOptions(motifs,selected);});refreshShotOverview();}
function renderMotifs(motifs){
  $('motifs').innerHTML=motifs.map((m,i)=>`<article class="motif" data-history-id="${esc(m.id)}" data-motif-id="${esc(m.id)}"><div class="shot-header"><h3>母題 ${i+1}</h3><button class="subtle" data-remove-motif="${esc(m.id)}" aria-label="刪除母題 ${i+1}">刪除</button></div><div class="fields"><label>母題名稱<input data-motif="name" aria-label="母題 ${i+1} 名稱" value="${esc(m.name)}"></label><label>初始意義<input data-motif="meaning" aria-label="母題 ${i+1} 初始意義" value="${esc(m.meaning)}"></label></div></article>`).join('');
  $('motifs').querySelectorAll('[data-remove-motif]').forEach(button=>button.onclick=()=>{
    const id=button.dataset.removeMotif,used=rawShots().flatMap((s,i)=>s.motif_id===id?[i+1]:[]);
    if(used.length){say(`母題仍用於鏡頭 ${used.join('、')}，請先替這些鏡頭選擇其他母題`,true);return;}
    deleteEntry('motifs',getMotifs().findIndex(m=>m.id===id));
  });
}
$('motifs').addEventListener('input',refreshMotifChoices);
$('motif-add').onclick=()=>{const motifs=getMotifs();if(motifs.length>=30){say('最多可規劃 30 個母題',true);return;}motifs.push({id:MusicEditor.nextMotifId([...motifs,...deletionHistory.reserved('storyboard','motifs').map(id=>({id}))]),name:'',meaning:''});renderMotifs(motifs);refreshMotifChoices();markDirty('storyboard');$('motifs').lastElementChild.querySelector('input').focus();say('已新增母題，填入意義後可在鏡頭中選擇');};
function shotOpenStates(){return [...$('shots').querySelectorAll('details')].map(details=>details.open);}
function refreshShotOverview(){
  const overview=MusicEditor.shotOverview(rawShots(),getMotifs()),select=$('shot-jump'),selected=select.value;
  select.replaceChildren();overview.forEach(item=>select.append(new Option(`鏡頭 ${item.index+1} · ${item.label}`,String(item.index))));
  if([...select.options].some(option=>option.value===selected))select.value=selected;
  select.disabled=overview.length===0;$('shot-go').disabled=overview.length===0;
  const incomplete=overview.filter(item=>!item.valid).length;
  $('shot-count').textContent=`${overview.length} 鏡${incomplete?' · '+incomplete+' 鏡時間未完成':''}`;
  [...$('shots').children].forEach((article,i)=>article.querySelector('[data-shot-caption]').textContent=overview[i].label);
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
  $('shots').innerHTML=shots.map((s,i)=>`<article class="shot" data-history-id="${esc(keys[i])}"><div class="shot-header"><h3>鏡頭 ${i+1}</h3><button class="subtle" data-remove-shot="${i}" aria-label="刪除鏡頭 ${i+1}">刪除</button></div><details ${openStates[i]?'open':''}><summary aria-label="鏡頭 ${i+1} 摘要"><span data-shot-caption></span></summary><div class="shot-editor"><div class="fields">${['start','end'].map((key,j)=>`<label>${j?'結束':'開始'}（秒）<input data-key="${key}" type="number" min="0" step="0.001" value="${esc(s[key])}" aria-label="鏡頭 ${i+1} ${j?'結束':'開始'}"></label>`).join('')}</div><label>使用母題<select data-key="motif_id" aria-label="鏡頭 ${i+1} 使用母題">${motifOptions(motifs,s.motif_id)}</select></label>${shotFields.map(([key,label])=>`<label>${label}<textarea data-key="${key}" rows="2" aria-label="鏡頭 ${i+1} ${label}">${esc(s[key])}</textarea></label>`).join('')}<label>畫面方向<select data-key="screen_direction" aria-label="鏡頭 ${i+1} 畫面方向">${[['left','向左'],['right','向右'],['neutral','正面／中性']].map(([value,label])=>`<option value="${value}" ${value===s.screen_direction?'selected':''}>${label}</option>`).join('')}</select></label></div></details></article>`).join('');
  refreshShotOverview();
  $('shots').querySelectorAll('[data-remove-shot]').forEach(button=>button.onclick=()=>{
    deleteEntry('shots',Number(button.dataset.removeShot));
  });
}
function getShots(){
  const motifs=new Map(getMotifs().map(m=>[m.id,m.name]));
  return rawShots().map((s,i)=>{if(!s.start.trim()||!s.end.trim()){focusShot(i,!s.start.trim()?'start':'end');throw Error(`鏡頭 ${i+1} 時間不可空白`);}if(!s.motif_id||!motifs.has(s.motif_id)){focusShot(i,'motif_id');throw Error(`鏡頭 ${i+1} 請先選擇母題`);}const {motif_id,...shot}=s;return {...shot,start:Number(s.start),end:Number(s.end),motif:motifs.get(motif_id)};});
}
function loadMv(){
  clearDeletionHistory('storyboard');
  const brief=structuredClone(state.examples.storyboard);
  [['mv-title',brief.title],['mv-duration',brief.duration_seconds],['mv-fps',brief.fps],['mv-ratio',brief.aspect_ratio],['mv-style',brief.visual_style],['mv-anchor',brief.character_anchor]].forEach(([id,value])=>$(id).value=value);
  const motifs=brief.motifs.map((m,i)=>({...m,id:`motif-${i+1}`}));renderMotifs(motifs);
  renderShots(brief.shots.map(s=>({...s,motif_id:motifs.find(m=>m.name===s.motif)?.id||''})));$('mv-visual').hidden=true;
}
$('mv-example').onclick=()=>{loadMv();markDirty('storyboard');say('已載入本次原創合成分鏡');};
$('shot-add').onclick=()=>{const shots=rawShots(),openStates=shotOpenStates(),ids=entriesFor('shots').map(e=>e.id),last=shots.at(-1),start=last?.end?.trim()?Number(last.end):0;if(shots.length>=collections.shots.limit){say('鏡頭最多 1000 列',true);return;}if(!Number.isFinite(start)){say('最後一鏡結束時間需為數字',true);return;}shots.push({start:String(start),end:String(start+6),section:'',purpose:'',visual:'',camera:'',transition:'',motif_id:'',motif_state:'',character_state:last?.character_state||'',change_reason:'',screen_direction:'neutral'});$('mv-duration').value=start+6;openStates.push(true);ids.push(`row-${++rowSequence}`);renderShots(shots,openStates,ids);markDirty('storyboard');focusShot(shots.length-1,'motif_id');say('已新增鏡頭，請選擇母題並填入動作與敘事任務');};
$('mv-build').onclick=()=>run($('mv-build'),async()=>{
  const brief=MusicPlanning.planningBrief(captureDraft(),'storyboard');brief.shots=getShots();
  const result=await api('/api/storyboard',brief);setFiles(result.files,`母題分鏡 · ${result.data.shots.length} 鏡 · ${result.data.duration_seconds} 秒`);
  const box=$('mv-visual');box.replaceChildren();const heading=document.createElement('h3');heading.textContent='母題的變化';box.append(heading);
  appendNotes(box,result.data.continuity.map(s=>`鏡頭 ${s.shot} · ${s.motif} · ${s.motif_state}`));appendNotes(box,result.data.review_notes);box.hidden=false;
  say(result.data.review_notes.length?`分鏡包已建立；有 ${result.data.review_notes.length} 個待審查項目`:'分鏡包已建立；時間與資料連戲檢查通過');
});
function cueValues(){return [...$('cues').children].map(row=>{const x=row.querySelectorAll('input');if(!x[0].value.trim()||!x[1].value.trim())throw Error('歌詞開始與結束不可空白');return {start:Number(x[0].value),end:Number(x[1].value),text:x[2].value};});}
function renderCues(cues,ids){const keys=rowIds(cues,ids);state.cues=cues;$('cues').innerHTML=cues.map((c,i)=>`<tr data-history-id="${esc(keys[i])}"><td>${i+1}</td><td>${field(c.start,`歌詞 ${i+1} 開始`,'number')}</td><td>${field(c.end,`歌詞 ${i+1} 結束`,'number')}</td><td><input class="lyric-field" value="${esc(c.text)}" aria-label="歌詞 ${i+1} 文字"></td><td><div class="actions"><button data-stamp="${i}" aria-label="填入第 ${i+1} 句播放位置">記下時間</button><button data-delete-cue="${i}" aria-label="刪除第 ${i+1} 句">刪除</button></div></td></tr>`).join('');$('cues').querySelectorAll('[data-stamp]').forEach(b=>b.onclick=()=>{if(!$('lyrics-player').src){say('先載入音檔，再記下播放位置',true);return;}const row=b.closest('tr'),x=row.querySelectorAll('input');if(!x[0].value.trim()||!x[1].value.trim()){say('先填入有效的開始與結束時間',true);return;}const length=Math.max(.001,Number(x[1].value)-Number(x[0].value));x[0].value=$('lyrics-player').currentTime.toFixed(3);x[1].value=(Number(x[0].value)+length).toFixed(3);markDirty('lyrics');tick();say('已填入播放位置；驗證後才更新成果');});$('cues').querySelectorAll('[data-delete-cue]').forEach(b=>b.onclick=()=>{deleteEntry('cues',Number(b.dataset.deleteCue));});}
const lyricFileImport=MusicEditor.createLyricsFileImport({
  apply:({content,suffix})=>{$('lyrics-source').value=content;$('lyrics-format').value=suffix;},
  onError:error=>say(error.message,true)
});
$('lyrics-file').onchange=async event=>{
  const loaded=await lyricFileImport.read(event.target.files[0]);
  if(loaded){markDirty('lyrics');say('已讀入原文，按「讀取歌詞」建立逐句表格');}
};
function lyricDuration(){const value=$('lyrics-duration').value;return value.trim()?Number(value):null;}
$('lyrics-import').onclick=()=>run($('lyrics-import'),async isCurrent=>{const result=await api('/api/lyrics',{title:$('lyrics-title').value,content:$('lyrics-source').value,suffix:$('lyrics-format').value,duration:lyricDuration()});if(!isCurrent())return;clearDeletionHistory('lyrics');renderCues(result.data.cues);setFiles(result.files,`歌詞匯入 · ${result.data.cues.length} 句`);say(MusicEditor.lyricsImportNotice(result.data));tick();});
$('cue-add').onclick=()=>{try{const entries=entriesFor('cues');if(entries.length>=10000)throw Error('歌詞最多 10000 列');const last=entries.at(-1)?.value,end=last?.end?.trim(),start=end?Number(end):0;if(!Number.isFinite(start))throw Error('最後一句結束時間需為數字');entries.push({id:`row-${++rowSequence}`,value:{start:String(start),end:String(start+3),text:''}});writeEntries('cues',entries);markDirty('lyrics');}catch(e){say(e.message,true);}};
$('lyrics-build').onclick=()=>run($('lyrics-build'),async isCurrent=>{const result=await api('/api/lyrics',{title:$('lyrics-title').value,cues:cueValues(),duration:lyricDuration()});if(!isCurrent())return;renderCues(result.data.cues,entriesFor('cues').map(e=>e.id));setFiles(result.files,`已驗證歌詞 · ${result.data.cues.length} 句`);say('歌詞時間驗證通過，LRC／SRT／JSON 已建立');tick();});
function drawWave(){const canvas=$('waveform'),ctx=canvas.getContext('2d'),w=canvas.width,h=canvas.height;ctx.clearRect(0,0,w,h);ctx.fillStyle='#e7ecdf';ctx.fillRect(0,0,w,h);ctx.strokeStyle='#b5c4ad';ctx.beginPath();ctx.moveTo(0,h/2);ctx.lineTo(w,h/2);ctx.stroke();if(state.waveform){ctx.strokeStyle='#4b745d';ctx.lineWidth=1;state.waveform.forEach((amplitude,i)=>{const x=(i+.5)*w/state.waveform.length;ctx.beginPath();ctx.moveTo(x,h/2-amplitude*52);ctx.lineTo(x,h/2+amplitude*52);ctx.stroke();});}const player=$('lyrics-player');if(Number.isFinite(player.duration)){const x=player.currentTime/player.duration*w;ctx.strokeStyle='#c94b29';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,h);ctx.stroke();canvas.setAttribute('aria-valuemax',player.duration.toFixed(3));canvas.setAttribute('aria-valuenow',player.currentTime.toFixed(3));}}
function tick(){
  let cues=[];
  try{cues=cueValues();}catch(_){/* Incomplete edits have no playable cue. */}
  const active=MusicEditor.activeCueIndex(cues,$('lyrics-player').currentTime);
  $('current-lyric').textContent=active>=0?cues[active].text:'…';
  [...$('cues').children].forEach((row,i)=>row.classList.toggle('playing',active===i));
  drawWave();
}
function resetAudio(){
  waveTask.begin();
  const player=$('lyrics-player');player.pause();player.removeAttribute('src');player.load();player.hidden=true;
  if(state.audioUrl)URL.revokeObjectURL(state.audioUrl);
  state.audioUrl=null;state.waveform=null;
  if(state.audioContext){state.audioContext.close().catch(()=>{});state.audioContext=null;}
  $('lyrics-audio').value='';$('wave-note').textContent='音檔需另行選擇；草稿不包含音訊。';drawWave();
}
$('lyrics-audio').onchange=async event=>{
  const file=event.target.files[0];if(!file)return;
  const token=waveTask.begin(),player=$('lyrics-player');player.pause();
  if(state.audioUrl)URL.revokeObjectURL(state.audioUrl);
  if(state.audioContext)state.audioContext.close().catch(()=>{});
  state.audioContext=null;state.waveform=null;state.audioUrl=URL.createObjectURL(file);
  player.src=state.audioUrl;player.hidden=false;markDirty('lyrics');drawWave();
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
    $('wave-note').textContent='波形已載入（第一聲道）；點擊定位，左右鍵微調 0.5 秒。';drawWave();
  }catch(error){if(waveTask.isCurrent(token))$('wave-note').textContent='波形未完成：'+error.message;}
  finally{if(context&&context.state!=='closed')await context.close().catch(()=>{});if(state.audioContext===context)state.audioContext=null;}
};
window.addEventListener('pagehide',()=>{libraryController.cancel();briefImporter.cancel();lyricFileImport.cancel();draftTask.begin();waveTask.begin();if(state.audioUrl)URL.revokeObjectURL(state.audioUrl);if(state.audioContext)state.audioContext.close().catch(()=>{});});
$('lyrics-player').onloadedmetadata=()=>{if(!Number.isFinite($('lyrics-player').duration))return;$('lyrics-duration').value=$('lyrics-player').duration.toFixed(3);markDirty('lyrics');tick();};$('lyrics-player').ontimeupdate=tick;$('lyrics-player').onseeked=tick;$('lyrics-player').onerror=()=>say('此音檔無法在瀏覽器播放，請改用支援的格式',true);
function seek(seconds){const p=$('lyrics-player');if(!Number.isFinite(p.duration))return;p.currentTime=Math.max(0,Math.min(p.duration,seconds));tick();}
$('waveform').onclick=event=>{const r=event.currentTarget.getBoundingClientRect();seek((event.clientX-r.left)/r.width*$('lyrics-player').duration);};$('waveform').onkeydown=event=>{if(['ArrowLeft','ArrowRight','Home','End'].includes(event.key)){event.preventDefault();seek(event.key==='Home'?0:event.key==='End'?$('lyrics-player').duration:$('lyrics-player').currentTime+(event.key==='ArrowRight'?.5:-.5));}};
$('audio-build').onclick=()=>run($('audio-build'),async()=>{const file=$('audio-file').files[0];if(!file)throw Error('先選擇 PCM WAV');if(file.size>64*1024*1024)throw Error('本機檢查上限為 64 MiB');const result=await api('/api/audio?'+new URLSearchParams({name:file.name,profile:$('audio-profile').value}),file,true);setFiles(result.files,result.data.warnings.length?'音檔檢查 · 有待確認項目':'音檔檢查 · 本次技術條件通過');const d=result.data,box=$('audio-visual');box.innerHTML=`<h3>檢查摘要</h3><div class="facts"><div class="fact"><strong>${d.sample_rate/1000} kHz</strong><span>${d.bit_depth} bit · ${d.channels} 聲道</span></div><div class="fact"><strong>${d.duration_seconds}s</strong><span>音檔時長</span></div><div class="fact"><strong>${d.quiet_regions.leading_seconds}s</strong><span>頭部安靜段，門檻 -60 dBFS</span></div><div class="fact"><strong>${d.stereo_correlation??'不可測'}</strong><span>立體聲相關性</span></div></div><div class="table-wrap"><table><thead><tr><th>聲道</th><th>Peak dBFS</th><th>RMS dBFS</th><th>滿刻度樣本</th></tr></thead><tbody>${d.per_channel.map(c=>`<tr><td>${c.channel}</td><td>${c.peak_dbfs??'靜音'}</td><td>${c.rms_dbfs??'靜音'}</td><td>${c.full_scale_samples}</td></tr>`).join('')}</tbody></table></div><p class="hash">SHA-256 ${esc(d.sha256)}</p>`;appendNotes(box,d.warnings);box.hidden=false;say(d.warnings.length?`檢查已完成，有 ${d.warnings.length} 項需確認`:'本次技術條件通過；報告已建立');});
const draftTask=MusicEditor.createLatestTask();
let pendingLegacyDraft=null;
function clearConversion(){pendingLegacyDraft=null;$('draft-conversion').hidden=true;}
function loadDraft(draft){const previous=captureDraft();applyDraft(draft);state.undoDraft=previous;state.undoScope=null;$('draft-undo').disabled=false;clearConversion();}
function captureDraft(){
  const panels={};
  Object.entries(MusicEditor.draftFields).forEach(([panel,ids])=>{
    panels[panel]={fields:Object.fromEntries(ids.map(id=>[id,$(id).value]))};
  });
  panels.music.sections=[...$('arrangement').children].map(row=>Object.fromEntries(
    MusicEditor.draftRows.music.columns.map((key,i)=>[key,row.querySelectorAll('input')[i].value])));
  panels.storyboard.motifs=getMotifs();
  panels.storyboard.shots=[...$('shots').children].map(article=>Object.fromEntries(
    [...article.querySelectorAll('[data-key]')].map(input=>[input.dataset.key,input.value])));
  panels.lyrics.cues=[...$('cues').children].map(row=>Object.fromEntries(
    MusicEditor.draftRows.lyrics.columns.map((key,i)=>[key,row.querySelectorAll('input')[i].value])));
  panels.music.avoid=requirementValues('music-avoid');panels.music.deliverables=requirementValues('music-deliverables');
  return {format:'zoe-music-lab-draft',schema_version:3,tool_version:'0.9.0',saved_at:new Date().toISOString(),tab:state.tab,panels};
}
function applyDraft(draft){
  clearLibraryReview();
  ['music','storyboard','lyrics'].forEach(clearDeletionHistory);
  briefImporter.cancel();clearBriefReview();
  lyricFileImport.cancel();
  $('lyrics-file').value='';
  Object.values(draft.panels).forEach(panel=>Object.entries(panel.fields).forEach(([id,value])=>$(id).value=value));
  renderSections(draft.panels.music.sections);renderRequirements('music-avoid',draft.panels.music.avoid,'避免事項');renderRequirements('music-deliverables',draft.panels.music.deliverables,'交付項目');renderMotifs(draft.panels.storyboard.motifs);renderShots(draft.panels.storyboard.shots);renderCues(draft.panels.lyrics.cues);
  resetAudio();$('audio-file').value='';state.bundles={};state.files={};
  Object.keys(MusicEditor.draftFields).forEach(markDirty);
  ['music-visual','mv-visual','audio-visual'].forEach(id=>$(id).hidden=true);
  document.querySelector(`[data-tab="${draft.tab}"]`).click();clearOutput();tick();
}
$('draft-export').onsubmit=event=>{
  try{
    if(state.busy)throw Error('目前操作尚未完成，請稍候再保存');
    const draft=MusicEditor.validateDraft(captureDraft());
    const content=JSON.stringify(draft,null,2)+'\n';
    if(new TextEncoder().encode(content).length>1024*1024)throw Error('草稿超過 1 MiB，請減少內容再保存');
    $('draft-content').value=content;say('已送出草稿下載；重新載入後需重新建立成果，音檔另存。');
  }catch(error){event.preventDefault();say(error.message,true);}
};
$('draft-open').onchange=async event=>{
  const file=event.target.files[0];if(!file)return;
  const token=draftTask.begin();clearConversion();briefImporter.cancel();clearBriefReview();clearLibraryReview();
  try{
    if(state.busy)throw Error('目前操作尚未完成，請稍候再載入');
    if(file.size>1024*1024)throw Error('草稿上限為 1 MiB');
    const text=await file.text();if(!draftTask.isCurrent(token))return;
    const inspected=MusicEditor.inspectDraft(JSON.parse(text));
    if(state.busy)throw Error('目前操作尚未完成，請稍候再載入');
    if(inspected.legacy){pendingLegacyDraft=inspected.draft;$('draft-conversion-note').textContent=`這是草稿 v${inspected.draft.schema_version}：${inspected.draft.panels.storyboard.shots.length} 鏡。轉換成 v3 後保留原有鏡頭，創作語言沿用繁體中文，避免事項與交付項目沿用舊工作台預設；目前表單尚未替換。`;$('draft-conversion').hidden=false;say('舊版草稿已檢查，選擇轉換後才會載入');return;}
    loadDraft(inspected.draft);say('專案草稿已載入；請重新建立成果，校時與交付音檔需另選。');
  }catch(error){if(draftTask.isCurrent(token))say(error.message,true);}
  finally{if(draftTask.isCurrent(token))event.target.value='';}
};
$('draft-convert').onclick=()=>{if(state.busy){say('目前操作尚未完成，請稍候');return;}if(!pendingLegacyDraft)return;try{loadDraft(MusicEditor.convertLegacyDraft(pendingLegacyDraft));say('草稿已明確轉換為 v3 並載入；原檔保留，可撤回本次載入');}catch(error){say(error.message,true);}};
$('draft-cancel').onclick=()=>{clearConversion();say('已取消轉換，目前表單保留');};
$('draft-undo').onclick=()=>{
  if(state.busy){say('目前操作尚未完成，請稍候');return;}
  if(!state.undoDraft)return;
  draftTask.begin();clearConversion();briefImporter.cancel();clearBriefReview();
  const scope=state.undoScope;
  if(scope)applyPlanningPanel(state.undoDraft,scope);else applyDraft(state.undoDraft);
  state.undoDraft=null;state.undoScope=null;$('draft-undo').disabled=true;
  say(scope?'已撤回需求載入；其他工作台與音檔保留，請重新建立本工作台成果':'已撤回草稿載入並還原表單；請重新建立成果，音檔需另選。');
};
let pendingBrief=null;
function clearBriefReview(){pendingBrief=null;$('brief-review').hidden=true;$('brief-preview').value='';$('brief-review-notes').replaceChildren();}
function applyPlanningPanel(draft,operation){
  const checked=MusicEditor.validateDraft(draft),panel=checked.panels[operation];
  if(!['music','storyboard'].includes(operation))throw Error('只支援歌曲或分鏡需求');
  clearDeletionHistory(operation);
  Object.entries(panel.fields).forEach(([id,value])=>$(id).value=value);
  if(operation==='music'){renderSections(panel.sections);renderRequirements('music-avoid',panel.avoid,'避免事項');
    renderRequirements('music-deliverables',panel.deliverables,'交付項目');$('music-visual').hidden=true;}
  else{renderMotifs(panel.motifs);renderShots(panel.shots);$('mv-visual').hidden=true;}
  markDirty(operation);document.querySelector(`[data-tab="${operation}"]`).click();
}
const briefImporter=MusicPlanning.createBriefImport({
  validate:async(operation,brief)=>{
    MusicPlanning.planningDraft(captureDraft(),operation,brief);
    const result=await api('/api/'+operation,brief);
    return {brief:JSON.parse(result.files[operation==='music'?'brief.json':'mv-brief.json']),notes:result.data.review_notes||[]};
  },
  onReady:({operation,result})=>{
    const proposal={operation,brief:result.brief};
    pendingBrief=proposal;$('brief-preview').value=JSON.stringify(proposal.brief,null,2);
    $('brief-review-note').textContent=`${proposal.operation==='music'?'歌曲':'分鏡'}「${proposal.brief.title}」已檢查${result.notes.length?'；'+result.notes.length+' 個創作項目待人工審查':''}。載入只替換該工作台表單，其他工作台與音檔保留。`;
    $('brief-review-notes').replaceChildren();appendNotes($('brief-review-notes'),result.notes);
    $('brief-review').hidden=false;say('需求已檢查，先看預覽再選擇載入');
  },onError:error=>say(error.message,true)
});
$('brief-file').onchange=async event=>{
  const file=event.target.files[0],operation=$('brief-operation').value;
  event.target.value='';
  clearBriefReview();clearConversion();draftTask.begin();clearLibraryReview();
  if(state.busy){briefImporter.cancel();say('目前操作尚未完成，請稍候再載入',true);return;}
  await briefImporter.read(file,operation);
};
$('brief-operation').onchange=()=>{briefImporter.cancel();clearBriefReview();say('已切換需求類型，請重新選擇檔案');};
$('brief-cancel').onclick=()=>{briefImporter.cancel();clearBriefReview();say('已取消需求載入，目前表單保留');};
$('brief-apply').onclick=()=>{
  if(state.busy){say('目前操作尚未完成，請稍候');return;}if(!pendingBrief)return;
  try{
    const previous=captureDraft(),proposal=MusicPlanning.planningDraft(previous,pendingBrief.operation,pendingBrief.brief);
    const operation=pendingBrief.operation;
    applyPlanningPanel(proposal,operation);state.undoDraft=previous;state.undoScope=operation;
    $('draft-undo').disabled=false;draftTask.begin();briefImporter.cancel();clearBriefReview();clearConversion();
    say('需求已載入，可撤回；其他工作台與音檔保留，請重新建立本工作台成果');
  }catch(error){say(error.message,true);}
};
let libraryEnabled=false,libraryListJobs=0,libraryReadingId=null,libraryPending=false,librarySaving=false;
let libraryRecords=[],libraryCursor=null,pendingLibraryReview=null,libraryPreferredId=null;
function librarySay(message,error=false){$('library-status').textContent=message;$('library-status').classList.toggle('error',error);}
function libraryControls(){
  $('library-save').disabled=!libraryEnabled||libraryPending||librarySaving;
  $('library-refresh').disabled=!libraryEnabled||libraryListJobs>0;
  $('library-more').hidden=!libraryCursor;$('library-more').disabled=libraryListJobs>0;
  $('library-select').disabled=!libraryRecords.length;
  $('library-preview').disabled=!libraryEnabled||!libraryRecords.length||libraryReadingId===$('library-select').value;
  $('library-retry').hidden=!libraryPending;$('library-retry').disabled=librarySaving;
  $('library-abandon').hidden=!libraryPending;$('library-abandon').disabled=librarySaving;
}
function clearLibraryReview(){libraryController.cancelRead();pendingLibraryReview=null;$('library-review').hidden=true;$('library-review-content').value='';$('library-export-content').value='';}
function librarySelection(){
  const record=libraryRecords.find(r=>r.id===$('library-select').value);
  $('library-selection-note').textContent=record?`${record.label} · ${record.stored_at} · 歌曲：${record.titles.music||'未命名'}／分鏡：${record.titles.storyboard||'未命名'}／歌詞：${record.titles.lyrics||'未命名'}`:'尚無保存版本；先為目前草稿命名並保存。';
  libraryControls();
}
const libraryController=MusicLibrary.createLibraryController({
  request:async(action,payload)=>(await api('/api/drafts/'+action,payload)).data,
  capture:captureDraft,validate:MusicEditor.validateDraft,newId:()=> 'draft-'+crypto.randomUUID().replaceAll('-',''),
  onPending:({pending,saving})=>{libraryPending=pending;librarySaving=saving;libraryControls();},
  onSaved:({entry,reused,changed})=>{
    libraryPreferredId=entry.id;
    librarySay(`「${entry.label}」${reused?'已確認為同一筆保存':'已保存為新版本'}；${changed?'按下保存後的修改尚未保存':'可重新開啟本頁後載入'}。音檔與成果另存。`);
    refreshLibrary(false);
  },
  onList:(result,append)=>{
    const selected=libraryPreferredId||$('library-select').value;
    const records=append?[...libraryRecords,...result.entries]:result.entries;
    libraryRecords=[...new Map(records.map(r=>[r.id,r])).values()];libraryCursor=result.next_cursor;
    $('library-select').replaceChildren();libraryRecords.forEach(r=>$('library-select').append(new Option(`${r.label} · ${r.stored_at}`,r.id)));
    if(libraryRecords.some(r=>r.id===selected))$('library-select').value=selected;
    libraryPreferredId=null;librarySelection();
    $('library-note').textContent=`本機草稿庫已啟用；已讀取 ${libraryRecords.length} 個版本${result.issues.length?'，另有 '+result.issues.length+' 個版本資料無法讀取':''}。載入時核對摘要；保存不含音檔、成果或刪除還原紀錄。`;
  },
  onReady:({entry,draft})=>{
    pendingLibraryReview={entry,draft};$('library-review-note').textContent=`「${entry.label}」· ${entry.stored_at} · ${draft.panels.music.sections.length} 段／${draft.panels.storyboard.shots.length} 鏡／${draft.panels.lyrics.cues.length} 句。SHA-256 與草稿 v3 已核對；創作內容尚需重新驗證。`;
    const content=JSON.stringify(draft,null,2)+'\n';$('library-review-content').value=content;
    $('library-export-name').value=entry.id+'.json';$('library-export-content').value=content;
    $('library-review').hidden=false;librarySay('保存版本已預覽，目前工作台與音檔保留。');
  },
  onError:(error,{retryable})=>librarySay(error.message+(retryable?'；結果尚未確認，重試會使用同一 ID 與原內容，也可先重新整理保存版本。':''),true)
});
async function refreshLibrary(report=true,more=false){
  if(!libraryEnabled)return;
  libraryListJobs++;libraryControls();
  try{const ok=await libraryController.list(more?libraryCursor:null);if(ok&&report)librarySay('保存版本清單已更新；預覽後才會載入。');}
  finally{libraryListJobs--;libraryControls();}
}
function libraryAllowed(){if(state.busy){librarySay('目前工作包處理尚未完成，請稍候。',true);return false;}return libraryEnabled;}
$('library-save').onclick=()=>{if(libraryAllowed())libraryController.save($('library-label').value);};
$('library-retry').onclick=()=>{if(libraryAllowed())libraryController.retry();};
$('library-abandon').onclick=()=>{if(libraryController.abandon())librarySay('已放棄待重試紀錄；可能已保存的版本保留。先重新整理確認，再明確建立新版本。');};
$('library-refresh').onclick=()=>refreshLibrary();$('library-more').onclick=()=>refreshLibrary(true,true);
$('library-select').onchange=()=>{clearLibraryReview();librarySelection();};
$('library-preview').onclick=async()=>{
  if(!libraryAllowed())return;const id=$('library-select').value;if(!id||libraryReadingId===id)return;
  clearLibraryReview();draftTask.begin();clearConversion();briefImporter.cancel();clearBriefReview();
  libraryReadingId=id;libraryControls();librarySay('正在讀取選定保存版本，核對後顯示預覽。');
  try{await libraryController.read(id);}finally{if(libraryReadingId===id)libraryReadingId=null;libraryControls();}
};
$('library-apply').onclick=()=>{
  if(!libraryAllowed()||!pendingLibraryReview)return;
  const proposal=pendingLibraryReview;loadDraft(proposal.draft);
  librarySay(`已載入「${proposal.entry.label}」；可撤回本次載入，請重選音檔並重新建立成果。`);
};
$('library-cancel').onclick=()=>{clearLibraryReview();librarySay('已取消版本預覽，目前工作台保留。');};
$('library-export').onsubmit=event=>{if(!pendingLibraryReview){event.preventDefault();return;}librarySay('已送出保存版本的 JSON 下載；原版本保留。');};
async function setupLibrary(){
  try{const response=await fetch('/api/capabilities');if(!response.ok)throw Error('無法確認草稿庫狀態');
    const info=await response.json();libraryEnabled=info.draft_library_enabled===true;
    $('library-note').textContent=libraryEnabled?'本機草稿庫已啟用；保存版本不含音檔、成果或刪除還原紀錄。':'草稿庫未啟用。停止服務後，以 python music_lab_server.py --draft-library outputs/drafts 啟動，即可明確保存到本機；目前仍可下載草稿。';
    libraryControls();if(libraryEnabled)await refreshLibrary(false);
  }catch(error){librarySay(error.message,true);libraryControls();}
}
async function initialize(){try{const response=await fetch('/api/examples');if(!response.ok)throw Error('範例讀取失敗');state.examples=await response.json();loadMusic();loadMv();$('lyrics-source').value='[00:00.000]空房剩一圈淡色的牆\n[00:04.000]紙箱裡裝不下那句話\n[00:08.000]我把聲音留在樓梯上\n[00:12.000]這次換我回答';drawWave();say('已載入本次原創合成範例，修改後開始');setupLibrary();}catch(e){say(e.message,true);}}
initialize();
