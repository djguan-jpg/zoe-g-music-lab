// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const C=require('../web/current-cue.js'),D=require('../web/current-cue-dom.js');
const media=(extra={})=>({source:'blob:a',current_source:'blob:a',duration:6,position:.5,ready:true,error:false,...extra});
const rows=()=>[{id:'blank',start:'',end:'',text:'未校時'},{id:'one',start:'00.200',end:'1.200',text:'原句🎵'},{id:'two',start:'2',end:'4',text:'後句'}];
function setup(){let context={media:media(),visible:true,busy:false},source=rows(),reads=0,contexts=0,views=[],targets=[];
 const c=C.createPlaybackController({captureContext:()=>{contexts++;return structuredClone(context)},captureRows:()=>{reads++;return source},focusTarget:(id,row)=>{targets.push({id,row});return true},onView:v=>views.push(v)});
 return {c,context,source,views,targets,reads:()=>reads,contexts:()=>contexts,setSource:v=>source=v};}

test('prepared playback retains original row order, partial rows, gaps, exclusive ends and last overlapping match',()=>{
 const h=setup();h.source.push({id:'overlap',start:'.4',end:'1',text:'重疊後列'});const before=structuredClone(h.source);
 for(const position of [0,.199,.2,.399,.4,.999,1,1.199,1.2,2,3.999,4,6]){h.context.media.position=position;assert.deepEqual(h.c.refresh(),C.present({...h.context,rows:h.source}));}
 assert.equal(h.reads(),1);assert.deepEqual(h.source,before);
});

test('120 position-only updates read and parse a 10000-row source once while media is read each time',()=>{
 const h=setup();h.setSource(Array.from({length:10000},(_,i)=>({id:'row-'+i,start:String(i/1000),end:String(i/1000+.002),text:'原句 '+i})));
 h.context.media.duration=12;for(let i=0;i<120;i++){h.context.media.position=i/100;h.c.refresh();}
 assert.equal(h.reads(),1);assert.equal(h.contexts(),121);assert.equal(h.views.length,120);assert.equal(h.views.at(-1).id,'row-1190');
});

test('explicit invalidation rebuilds edited text and time without exposing or mutating its captured source',()=>{
 const h=setup();h.c.refresh();h.source[1].text='<img src=x> 後續🎵';h.source[1].end='.4';
 assert.equal(h.c.refresh().text,'原句🎵');h.c.invalidate();assert.equal(h.c.refresh().id,null);
 h.source[1].end='1.2';h.c.invalidate();assert.equal(h.c.refresh().text,'<img src=x> 後續🎵');assert.equal(h.reads(),3);
 h.views.at(-1).text='foreign';assert.equal(h.c.refresh().text,'<img src=x> 後續🎵');
});

test('hidden or unavailable media avoids row reads; every ready/source/busy change uses the current context',()=>{
 const h=setup();h.context.visible=false;assert.equal(h.c.refresh().id,null);assert.equal(h.reads(),0);
 h.context.visible=true;h.context.media.ready=false;h.c.refresh();assert.equal(h.reads(),0);
 h.context.media=media();assert.equal(h.c.refresh().id,'one');h.context.busy=true;assert.equal(h.c.refresh().canFocus,false);
 for(const extra of [{source:null},{current_source:'blob:old'},{error:true},{duration:0},{position:NaN},{position:7}]){h.context.media=media(extra);assert.equal(h.c.refresh().id,null);}
 h.context.media=media({source:'blob:b',current_source:'blob:b'});h.context.busy=false;assert.equal(h.c.refresh().id,'one');assert.equal(h.reads(),1);
});

test('malformed rows are not reparsed on every tick and recover only after a new invalidation or explicit focus',()=>{
 const h=setup();h.source.push({...h.source[1]});for(let i=0;i<4;i++)assert.equal(h.c.refresh().id,null);assert.equal(h.reads(),1);
 h.source.pop();h.c.invalidate();assert.equal(h.c.refresh().id,'one');assert.equal(h.reads(),2);
 h.context.extra=1;assert.equal(h.c.refresh().id,null);delete h.context.extra;assert.equal(h.c.refresh().id,'one');
});

test('an invalidation during capture refuses the old prepared rows and the next refresh captures fresh data',()=>{
 let c,read=0,value=rows();c=C.createPlaybackController({captureContext:()=>({media:media(),visible:true,busy:false}),captureRows:()=>{read++;if(read===1){c.invalidate();return value;}return [{...value[1],text:'新來源'}]},focusTarget:()=>true});
 assert.equal(c.refresh().id,null);assert.equal(c.refresh().text,'新來源');assert.equal(read,2);
});

test('explicit focus bypasses a stale display cache and double-checks the current full row and source',()=>{
 const h=setup();h.c.refresh();h.source[1].text='未發事件的原欄位';h.source.shift();assert.equal(h.c.focus(),true);
 assert.deepEqual(h.targets,[{id:'one',row:{id:'one',start:'00.200',end:'1.200',text:'未發事件的原欄位'}}]);assert.equal(h.views.at(-1).index,0);
 assert.equal(h.reads(),4);assert.equal(h.c.refresh().text,'未發事件的原欄位');assert.equal(h.reads(),5);
});

test('focus source drift or changed matching raw text refuses navigation rather than trusting the playback cache',()=>{
 for(const change of [ctx=>ctx.media.duration=7,ctx=>ctx.media.current_source='blob:other',ctx=>ctx.busy=true,ctx=>ctx.visible=false,ctx=>ctx.media.position=2.5]){
  let context={media:media(),visible:true,busy:false},count=0,effects=0;
  const c=C.createPlaybackController({captureContext:()=>structuredClone(context),captureRows:()=>{if(++count===2)change(context);return rows();},focusTarget:()=>{effects++;return true}});
  // Read 1 is the display cache. Focus reads 2 and 3 against fresh contexts.
  c.refresh();assert.equal(c.focus(),false);assert.equal(effects,0);
 }
});

test('blocked focus and disposed playback stop full row reads, late effects and false success',()=>{
 const h=setup();h.c.refresh();h.context.busy=true;assert.equal(h.c.focus(),false);assert.equal(h.reads(),1);
 h.c.dispose();const captured=h.contexts();h.c.invalidate();assert.equal(h.c.refresh(),null);assert.equal(h.c.focus(),false);assert.equal(h.contexts(),captured);assert.deepEqual(h.targets,[]);
 let errors=0,focused=0;const c=C.createPlaybackController({captureContext:()=>({media:media(),visible:true,busy:false}),captureRows:rows,focusTarget:()=>false,onFocused:()=>focused++,onError:()=>errors++});assert.equal(c.focus(),false);assert.equal(errors,1);assert.equal(focused,0);
});

function row(id){let marks=new Set(),writes=[];return {dataset:{historyId:id},isConnected:true,writes,classList:{contains:k=>marks.has(k),add:k=>{marks.add(k);writes.push('add')},remove:k=>{marks.delete(k);writes.push('remove')}}};}
test('stable highlighter touches only old/new rows and re-resolves a detached same-ID replacement',()=>{
 let a=row('a'),b=row('b'),calls=[];const resolveRow=id=>{calls.push(id);return id==='a'?a:id==='b'?b:null},m=D.createHighlight({resolveRow});
 for(let i=0;i<120;i++)m.update('a');assert.deepEqual(calls,['a']);assert.deepEqual(a.writes,['add']);
 m.update('b');assert.deepEqual(a.writes,['add','remove']);assert.deepEqual(b.writes,['add']);
 const old=b;old.isConnected=false;b=row('b');m.update('b');assert.deepEqual(old.writes,['add','remove']);assert.deepEqual(b.writes,['add']);
 m.update(null);m.update(null);assert.deepEqual(b.writes,['add','remove']);m.dispose();const before=calls.length;m.update('a');assert.equal(calls.length,before);
});

test('playback DOM owns click/input listeners and invalidates literal edits while preserving focus and field values',()=>{
 const source=rows(),context={media:media(),visible:true,busy:false},buttonListeners={},inputListeners={},button={disabled:true,addEventListener:(k,v)=>buttonListeners[k]=v,removeEventListener:(k,v)=>{if(buttonListeners[k]===v)delete buttonListeners[k]}},container={addEventListener:(k,v)=>inputListeners[k]=v,removeEventListener:(k,v)=>{if(inputListeners[k]===v)delete inputListeners[k]}},note={textContent:''},lyric={textContent:''};
 let focus=0;const nodes=new Map(source.map(r=>[r.id,row(r.id)]));const c=D.bindPlayback({button,note,lyric,container,captureContext:()=>context,captureRows:()=>source,resolveRow:id=>nodes.get(id)||null,focusTarget:()=>{focus++;return true}});
 source[1].text='<img src=x>🎵';inputListeners.input();assert.equal(lyric.textContent,'<img src=x>🎵');assert.equal(focus,0);assert.equal(source[1].start,'00.200');buttonListeners.click();assert.equal(focus,1);
 source[1].text='';inputListeners.input();assert.equal(lyric.textContent,'（這句文字留白）');context.media.ready=false;c.refresh();assert.equal(button.disabled,true);assert.equal(lyric.textContent,'等待歌詞與音檔');
 c.dispose();assert.deepEqual(buttonListeners,{});assert.deepEqual(inputListeners,{});assert.equal(c.focus(),false);
});

test('actual batch-time adapter invalidates playback and rechecks cue-start buttons after programmatic writes',()=>{
 const fs=require('node:fs'),vm=require('node:vm'),app=fs.readFileSync(require.resolve('../web/app.js'),'utf8');
 const start=app.indexOf('function applyCueTimes('),end=app.indexOf('timingController=MusicTiming',start),fields=[{value:'1.5'},{value:'1.6'}];let invalidated=0,forced=0,ticks=0;
 const context={$:()=>({children:[{dataset:{historyId:'one'},querySelectorAll:()=>fields}]}),writeValue:(f,v)=>f.value=v,markDirty:()=>{},tick:()=>ticks++,state:{currentCue:{invalidate:()=>invalidated++},cuePosition:{refresh:options=>{assert.equal(options.force,true);forced++}}}};
 vm.runInNewContext(app.slice(start,end),context);context.applyCueTimes([{id:'one',value:{start:'2.5',end:'2.6'}}]);assert.deepEqual(fields.map(f=>f.value),['2.5','2.6']);assert.equal(invalidated,1);assert.equal(forced,1);assert.equal(ticks,1);
 const path=app.slice(app.indexOf('state.currentCue=MusicCurrentCueDOM'),app.indexOf('function drawWave(){'));assert.doesNotMatch(path,/\.forEach|markDirty|\.play\(|\.pause\(|setInterval|setTimeout/);
});
