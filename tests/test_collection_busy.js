// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const H=require('../web/deletion-history.js'),Editor=require('../web/editor-state.js');
const app=fs.readFileSync('web/app.js','utf8');
function block(a,b){const i=app.indexOf(a),j=app.indexOf(b,i+1);assert.ok(i>=0&&j>i);return app.slice(i,j);}
function line(prefix){const lines=app.split('\n').filter(s=>s.startsWith(prefix));assert.equal(lines.length,1);return lines[0];}
const specs={arrangement:['section-add','[data-remove-section]','music',40],'music-avoid':['avoid-add','button','music',100],'music-deliverables':['deliverable-add','button','music',100],motifs:['motif-add','[data-remove-motif]','storyboard',30],shots:['shot-add','[data-remove-shot]','storyboard',1000],cues:['cue-add','[data-delete-cue]','lyrics',10000]};
const fixture=list=>list.startsWith('music-')?' 原需求\r\n🎵 ':list==='arrangement'?{name:'同名段落',bars:'08',energy:'3',focus:' 原用途 ',texture:'音色\r\n'}:list==='motifs'?{id:'motif-1',name:'原母題',meaning:'原意義'}:list==='cues'?{start:' 00.1000 ',end:'2.0000',text:'原句\r\n🎵'}:{start:' 0012.000 ',end:'18.0004',motif_id:'motif-1',section:'原段',purpose:'原用途',visual:'原畫面\r\n',camera:'固定',transition:'切',motif_state:'保持',character_state:'原衣',change_reason:'',screen_direction:'neutral',open:false};
function setup(){
 const nodes={},live=Object.fromEntries(Object.keys(specs).map(list=>[list,[{id:list==='motifs'?'motif-1':'original-'+list,value:fixture(list)}]])),history=H.createHistory(20),events=[];let reads=0,writes=0;
 for(const [list,[add,selector]] of Object.entries(specs)){
  const remove={disabled:false},extra={disabled:true};nodes[add]={disabled:false};nodes[list]={remove,extra,querySelectorAll:q=>{assert.equal(q,selector);return[remove];}};
 }
 for(const scope of ['music','storyboard','lyrics']){nodes[scope+'-delete-select']={value:'0',disabled:true};nodes[scope+'-delete-undo']={disabled:true,textContent:''};}
 nodes['section-order']={value:'original-arrangement'};
 function read(list){reads++;return structuredClone(live[list]);}
 function write(list,rows){writes++;live[list]=structuredClone(rows);events.push(['write',list]);}
 const state={busy:false,tab:'music',revisions:{},files:{prior:'原成果'},audioUrl:'owned-blob',media:{position:1.25,paused:true},duration:' 0030.000 '};
 const context={state,editorCopy:null,editorOrder:null,editorSelection:null,MusicEditor:Editor,MusicPlanningValues:require('../web/planning-values.js'),LyricTime:require('../musiclab/assets/lyric-time.js'),rowSequence:10,deletionHistory:history,$:id=>{assert.ok(nodes[id],id);return nodes[id];},
  entriesFor:read,writeEntries:write,requirementValues:list=>read(list).map(e=>e.value),getMotifs:()=>read('motifs').map(e=>e.value),rawShots:()=>read('shots').map(e=>e.value),shotOpenStates:()=>live.shots.map(e=>e.value.open),
  renderRequirements:(list,values,_label,ids)=>write(list,values.map((value,i)=>({id:ids[i],value}))),renderMotifs:values=>write('motifs',values.map(value=>({id:value.id,value}))),refreshMotifChoices:()=>events.push(['motif-choices']),
  renderShots:(values,opens,ids)=>write('shots',values.map((value,i)=>({id:ids[i],value:{...value,open:opens[i]}}))),markDirty:scope=>events.push(['dirty',scope]),focusEntry:(...args)=>events.push(['focus',...args]),say:(...args)=>events.push(['say',...args])};
 vm.createContext(context);vm.runInContext(block('const collections=','const editorFocus='),context);
 vm.runInContext(block('function refreshDeletionButton(','function clearDeletionHistory(')+block('function refreshCollectionControls(','function deleteEntry(')+block('function addRequirement(',"$('avoid-add').onclick=")+line("$('avoid-add').onclick=")+line("$('deliverable-add').onclick=")+block("$('section-add').onclick=",'function musicIssueTarget(')+line("$('motif-add').onclick=")+line("$('shot-add').onclick=")+line("$('cue-add').onclick="),context);
 return{context,state,nodes,live,history,events,get reads(){return reads},get writes(){return writes},add:list=>nodes[specs[list][0]].onclick(),refresh:()=>context.refreshCollectionControls()};
}
test('every additive adapter refuses a busy action before source reads, IDs, renders, focus, dirty or history changes',()=>{
 for(const list of Object.keys(specs)){const s=setup();s.history.push('music',{list:'music-avoid',label:'原刪除',entry:{id:'deleted',value:'原字'}});const before=structuredClone(s.live),record=s.history.entries('music'),state=structuredClone(s.state);s.state.busy=true;s.add(list);
  assert.deepEqual(s.live,before);assert.deepEqual(s.history.entries('music'),record);assert.equal(s.reads,0);assert.equal(s.writes,0);assert.equal(s.context.rowSequence,10);assert.deepEqual(s.events,[['say','目前操作尚未完成，請稍候']]);assert.deepEqual(s.state,{...state,busy:true});}
});
test('after busy ends the same six actions append once, retaining raw source, stable IDs and other collections',()=>{
 for(const list of Object.keys(specs)){const s=setup(),before=structuredClone(s.live),other=structuredClone(s.state);s.state.busy=true;s.add(list);s.state.busy=false;s.add(list);assert.equal(s.live[list].length,2);assert.deepEqual(s.live[list][0],before[list][0]);assert.notEqual(s.live[list][1].id,before[list][0].id);for(const key of Object.keys(specs).filter(k=>k!==list))assert.deepEqual(s.live[key],before[key]);assert.deepEqual(s.state,other);assert.equal(s.writes,1);assert.equal(s.events.filter(x=>x[0]==='dirty').length,1);assert.equal(s.events.filter(x=>x[0]==='focus').length,1);}
});
test('busy motif attempt reserves no new ID and idle retry avoids IDs reserved by deletion history',()=>{
 const s=setup();s.history.push('storyboard',{list:'motifs',label:'舊母題',entry:{id:'motif-2',value:{id:'motif-2',name:'舊',meaning:'待還原'}}});s.state.busy=true;s.add('motifs');s.state.busy=false;s.add('motifs');assert.equal(s.live.motifs[1].id,'motif-3');assert.equal(s.history.size('storyboard'),1);assert.equal(s.history.peek('storyboard').entry.value.name,'舊');
});
test('capacity refusal after busy ends leaves complete source and identity sequence unchanged',()=>{
 for(const [list,[,,,limit]] of Object.entries(specs)){const s=setup();s.live[list]=Array.from({length:limit},(_,i)=>({id:list==='motifs'?'motif-'+(i+1):'row-'+i,value:list==='motifs'?{...fixture(list),id:'motif-'+(i+1)}:fixture(list)}));const before=structuredClone(s.live[list]);s.state.busy=true;s.add(list);s.state.busy=false;s.add(list);assert.deepEqual(s.live[list],before);assert.equal(s.writes,0);assert.equal(s.context.rowSequence,10);assert.match(s.events.at(-1)[1],/最多/);}
});
test('shared controls disable six adds, only their delete buttons and all history selectors without touching values',()=>{
 const s=setup(),before=structuredClone(s.live);for(const scope of ['music','storyboard'])s.history.push(scope,{list:scope==='music'?'arrangement':'shots',label:'原選擇',entry:{id:'deleted-'+scope,value:{}}});s.refresh();s.state.busy=true;s.refresh();
 for(const [list,[add]] of Object.entries(specs)){assert.equal(s.nodes[add].disabled,true);assert.equal(s.nodes[list].remove.disabled,true);assert.equal(s.nodes[list].extra.disabled,true);}
 for(const scope of ['music','storyboard','lyrics']){assert.equal(s.nodes[scope+'-delete-select'].disabled,true);assert.equal(s.nodes[scope+'-delete-undo'].disabled,true);}
 assert.deepEqual(s.live,before);assert.equal(s.reads,0);assert.equal(s.writes,0);assert.equal(s.context.rowSequence,10);
});
test('control refresh restores each history availability and keeps an explicitly selected older deletion',()=>{
 const s=setup();for(const label of ['較早','最近'])s.history.push('music',{list:'music-avoid',label,entry:{id:label,value:'原'}});s.nodes['music-delete-select'].value='0';s.state.busy=true;s.refresh();s.state.busy=false;s.refresh();assert.equal(s.nodes['music-delete-select'].value,'0');assert.equal(s.nodes['music-delete-select'].disabled,false);assert.equal(s.nodes['music-delete-undo'].textContent,'還原：較早');assert.equal(s.nodes['music-delete-undo'].disabled,false);assert.equal(s.nodes['storyboard-delete-undo'].disabled,true);assert.equal(s.nodes['lyrics-delete-select'].disabled,true);assert.equal(s.history.size('music'),2);for(const [list,[add]] of Object.entries(specs)){assert.equal(s.nodes[add].disabled,false);assert.equal(s.nodes[list].remove.disabled,false);}
});
function runSetup(){const s=setup();s.context.operationGate=require('../web/operation-gate.js').createGate({createAbort:()=>new AbortController()});s.context.cueStampEdit=null;s.context.timingControls=s.refresh;s.context.markDirty=scope=>{s.events.push(['dirty',scope]);s.state.revisions[scope]=(s.state.revisions[scope]||0)+1;};vm.runInContext(block('async function run(','function setFiles('),s.context);return s;}
test('actual successful async run blocks structural controls throughout the request and restores them on completion',async()=>{
 const s=runSetup(),before=structuredClone(s.live),button={disabled:false};let resolve;const pending=new Promise(r=>resolve=r);const work=s.context.run(button,async current=>{await pending;if(current())s.state.files={report:'已核對來源'};});assert.equal(s.state.busy,true);for(const [list,[add]] of Object.entries(specs)){assert.equal(s.nodes[add].disabled,true);s.add(list);}assert.deepEqual(s.live,before);assert.equal(s.reads,0);assert.equal(s.writes,0);resolve();await work;assert.equal(s.state.busy,false);assert.equal(button.disabled,false);assert.equal(s.state.files.report,'已核對來源');for(const [, [add]] of Object.entries(specs))assert.equal(s.nodes[add].disabled,false);
});
test('actual rejected async run releases controls while preserving raw rows, previous result and selected history',async()=>{
 const s=runSetup(),before=structuredClone(s.live);s.history.push('music',{list:'music-avoid',label:'保留刪除',entry:{id:'removed',value:'原字'}});s.nodes['music-delete-select'].value='0';const button={disabled:false};await s.context.run(button,()=>Promise.reject(Error('合成讀取失敗')));assert.deepEqual(s.live,before);assert.deepEqual(s.state.files,{prior:'原成果'});assert.equal(s.state.busy,false);assert.equal(s.nodes['music-delete-select'].disabled,false);assert.equal(s.nodes['music-delete-undo'].textContent,'還原：保留刪除');assert.equal(s.history.size('music'),1);assert.equal(s.writes,0);assert.ok(s.events.some(x=>x[0]==='say'&&x[1]==='合成讀取失敗'&&x[2]===true));
});
test('raw field edits remain possible during a request and stale replies preserve later values with controls released',async()=>{
 const s=runSetup(),button={disabled:false};let resolve;const pending=new Promise(r=>resolve=r);const work=s.context.run(button,async current=>{await pending;if(current())s.state.files={report:'不能提交舊來源'};});s.live.arrangement[0].value.name='處理期間人工編修';s.state.revisions.music=1;resolve();await work;assert.equal(s.live.arrangement[0].value.name,'處理期間人工編修');assert.deepEqual(s.state.files,{prior:'原成果'});assert.equal(s.state.busy,false);assert.equal(s.nodes['section-add'].disabled,false);assert.equal(s.writes,0);assert.ok(s.events.some(x=>x[0]==='say'&&x[1]==='處理期間輸入有修改，請重新建立成果'));
});
test('an already busy run starts no second task, control changes or source reads',async()=>{
 const s=runSetup();s.state.busy=true;const before=structuredClone(s.live),button={disabled:false};await s.context.run(button,()=>assert.fail('duplicate request'));assert.deepEqual(s.live,before);assert.equal(s.events.length,0);assert.equal(s.reads,0);assert.equal(s.writes,0);assert.equal(button.disabled,false);assert.equal(s.state.busy,true);
});
