// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const C=require('../web/current-cue.js'),DOM=require('../web/current-cue-dom.js');
const media=(extra={})=>({source:'blob:a',current_source:'blob:a',duration:6,position:.5,ready:true,error:false,...extra});
const source=(extra={})=>({media:media(),rows:[{id:'raw',start:'',end:'',text:'未校時'},{id:'one',start:'00.200',end:'01.200',text:'  原句🎵  '},{id:'two',start:'2',end:'4',text:'第二句'}],visible:true,busy:false,...extra});
test('current view uses original stable row identity while partial or invalid rows remain unchanged',()=>{
 const value=source(),before=structuredClone(value),view=C.present(value);
 assert.deepEqual(view,{index:1,id:'one',text:'  原句🎵  ',canFocus:true,note:'目前第 2 句；按「前往目前這句」到歌詞欄位。'});assert.deepEqual(value,before);
});
test('unavailable media clears current text and target rather than trusting stale native position',()=>{
 for(const extra of [{source:null},{current_source:'blob:old'},{ready:false},{error:true},{duration:NaN},{duration:0},{position:-1},{position:7},{position:Infinity}]){
  const view=C.present(source({media:media(extra)}));assert.equal(view.id,null);assert.equal(view.index,-1);assert.equal(view.canFocus,false);assert.equal(view.text,'等待歌詞與音檔');
 }
 assert.equal(C.present(source({visible:false})).id,null);
});
test('exclusive ends, gaps and existing last-match overlap semantics are preserved without accepting full lyrics',()=>{
 assert.equal(C.present(source({media:media({position:1.2})})).id,null);assert.equal(C.present(source({media:media({position:4})})).id,null);
 const value=source();value.rows.push({id:'overlap',start:'.4',end:'1',text:'重疊後列'});assert.equal(C.present(value).id,'overlap');
 value.rows.at(-1).end='.1';assert.equal(C.present(value).id,'one');
});
test('busy disables navigation but does not erase the current read-only cue',()=>{
 const view=C.present(source({busy:true}));assert.equal(view.id,'one');assert.equal(view.canFocus,false);assert.equal(view.text,'  原句🎵  ');
});
test('unknown snapshots, duplicate IDs and bounded raw time or row limits fail without repair',()=>{
 for(const value of [null,{}, {...source(),extra:true},source({busy:1}),source({rows:[...source().rows,source().rows[1]]}),source({rows:Array(10001).fill(source().rows[1])}),source({rows:[{...source().rows[1],start:' '.repeat(4097)}]}),source({rows:[{...source().rows[1],id:''}]}),source({rows:[{...source().rows[1],extra:1}]})])assert.throws(()=>C.present(value));
});
function setup(capture){let value=source(),reads=0,targets=[],views=[],errors=[],focused=[];
 const c=C.createController({capture:()=>{reads++;return capture?capture(reads,value):structuredClone(value);},focusTarget:(id,row)=>{targets.push({id,row});return true;},onView:v=>views.push(v),onError:e=>errors.push(e.message),onFocused:v=>focused.push(v)});
 return {c,targets,views,errors,focused,get value(){return value;},set value(v){value=v;},reads:()=>reads};}
test('explicit navigation reads current text and focuses only the matching stable target without changing inputs',()=>{
 const s=setup();s.value.rows[1].text='後續編修';const before=structuredClone(s.value);assert.equal(s.c.focus(),true);
 assert.deepEqual(s.targets,[{id:'one',row:before.rows[1]}]);assert.deepEqual(s.focused,[{id:'one',index:1}]);assert.deepEqual(s.value,before);
});
test('source, duration, readiness, busy and currently matching row changes before focus prevent old navigation',()=>{
 for(const change of [v=>v.media=media({source:'blob:b',current_source:'blob:b'}),v=>v.media.duration=7,v=>v.media.ready=false,v=>v.busy=true,v=>v.visible=false,v=>v.media.position=2.5,v=>v.rows[1].text='new',v=>v.rows[1].start='.3',v=>v.rows.splice(1,1)]){
  const s=setup((read,v)=>{if(read===2)change(v);return structuredClone(v);});assert.equal(s.c.focus(),false);assert.deepEqual(s.targets,[]);
 }
});
test('natural playback progression and unrelated edits preserve the still-current target',()=>{
 const s=setup((read,v)=>{if(read===2){v.media.position=.6;v.rows[0].text='其他句後續內容';}return structuredClone(v);});assert.equal(s.c.focus(),true);assert.equal(s.targets[0].id,'one');
});
test('removing an unrelated earlier untimed row keeps the target identity and updates its visible row number',()=>{
 const s=setup((read,v)=>{if(read===2)v.rows.shift();return structuredClone(v);});assert.equal(s.c.focus(),true);assert.deepEqual(s.focused,[{id:'one',index:0}]);assert.equal(s.targets[0].row.start,'00.200');
});
test('malformed captures clear stale display and a refused focus is never reported as success',()=>{
 let value=source(),views=[],focused=0,errors=[];const c=C.createController({capture:()=>value,focusTarget:()=>false,onView:v=>views.push(v),onFocused:()=>focused++,onError:e=>errors.push(e.message)});
 c.refresh();value={};assert.equal(c.refresh().id,null);value=source();assert.equal(c.focus(),false);assert.equal(focused,0);assert.match(errors[0],/無法定位/);
});
test('disposed controller stops captures and focus effects',()=>{
 const s=setup();s.c.refresh();s.c.dispose();const reads=s.reads();assert.equal(s.c.refresh(),null);assert.equal(s.c.focus(),false);assert.equal(s.reads(),reads);assert.deepEqual(s.targets,[]);
});
test('DOM uses literal cue text, updates status only on change and owns only its click listener',()=>{
 let value=source(),listeners={},marks=[],focus=[],noteWrites=0,noteText='';const note={get textContent(){return noteText;},set textContent(v){noteText=v;noteWrites++;}},lyric={textContent:''},button={disabled:true,addEventListener:(k,v)=>listeners[k]=v,removeEventListener:(k,v)=>{if(listeners[k]===v)delete listeners[k];}};
 value.rows[1].text='<img src=x>🎵';const c=DOM.bind({button,note,lyric,capture:()=>structuredClone(value),highlight:id=>marks.push(id),focusTarget:id=>{focus.push(id);return true;}});
 assert.equal(lyric.textContent,'<img src=x>🎵');assert.equal(button.disabled,false);const writes=noteWrites;c.refresh();assert.equal(noteWrites,writes);listeners.click();assert.deepEqual(focus,['one']);
 value.media.ready=false;c.refresh();assert.equal(button.disabled,true);assert.equal(lyric.textContent,'等待歌詞與音檔');assert.equal(marks.at(-1),null);
 c.dispose();assert.deepEqual(listeners,{});assert.equal(c.focus(),false);
});
test('blank active lyric gets a display-only caption and refresh never triggers navigation',()=>{
 let value=source(),focus=0,lyric={textContent:''};value.rows[1].text='';const c=DOM.bind({button:{addEventListener(){},removeEventListener(){}},note:{textContent:''},lyric,capture:()=>value,highlight:()=>{},focusTarget:()=>{focus++;return true;}});
 assert.equal(lyric.textContent,'（這句文字留白）');assert.equal(value.rows[1].text,'');assert.equal(focus,0);c.refresh();assert.equal(focus,0);
});
