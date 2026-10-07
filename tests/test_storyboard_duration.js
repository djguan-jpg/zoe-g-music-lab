// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const D=require('../web/storyboard-duration.js'),Frames=require('../web/storyboard-frames.js');
const Timing=require('../web/storyboard-timing.js'),{execFileSync}=require('node:child_process');
const root=path.join(__dirname,'..');
const source=()=>({duration:'60',fps:'24',shots:[{id:'a',start:'0',end:'6'},{id:'b',start:'6',end:'12'}]});
function controller({write}={}){
  const value=source(),other={visual:'原畫面',music:'原歌曲',media:{native:true}},states=[];
  const c=D.createController({capture:()=>value,apply:v=>{value.duration=write?write(v):v;},onState:v=>states.push(v)});c.refresh();return {value,other,states,c};
}
test('proposal validates original seconds and shared frames without mutating source or rounding',()=>{
  const v=source();v.fps='29.97';v.shots[0].end='6.0004';v.shots[1].start='6.0004';v.shots[1].end='12.0004';const before=structuredClone(v),p=D.proposal(v);
  assert.equal(p.after,'12.0004');assert.equal(p.seconds,12.0004);assert.equal(p.totalFrames,Frames.frameIndex(12.0004,29.97));assert.deepEqual(v,before);
});
test('declared empty invalid matches and differs remain independent of candidate',()=>{
  for(const [duration,status,adopt] of [['','empty',true],['bad','invalid',true],['0','invalid',true],['14401','invalid',true],['12.0','matches',false],['60','differs',true]]){
    const v=source();v.duration=duration;const r=D.compare(v);assert.equal(r.status,status);assert.equal(r.canAdopt,adopt);assert.equal(v.duration,duration);
  }
});
test('incomplete invalid nonfinite hex negative reversed and empty rows cannot offer adoption',()=>{
  const edits=[v=>v.shots=[],v=>v.shots[0].start='',v=>v.shots[1].end='',v=>v.shots[0].start='-0.0001',v=>v.shots[0].end='0',v=>v.shots[1].end='Infinity',v=>v.shots[0].start='0x0',v=>v.shots[0].start='true',v=>v.fps='0',v=>v.fps='121',v=>v.fps='NaN',v=>v.shots[1].end='14401'];
  for(const edit of edits){const v=source();edit(v);const before=structuredClone(v);assert.equal(D.compare(v).canAdopt,false);assert.throws(()=>D.proposal(v));assert.deepEqual(v,before);}
});
test('seconds gap overlap and submillisecond frame boundary errors cannot be adopted',()=>{
  for(const [end,start] of [[6,6.002],[6,5.998],[.06251,.0616],[.06249,.0634]]){
    const v=source();v.shots[0].end=String(end);v.shots[1].start=String(start);assert.throws(()=>D.proposal(v));
  }
  const v=source();v.shots[0].end='.01';v.shots[1].start='.01';assert.throws(()=>D.proposal(v));
});
test('frame-equivalent seconds tolerance stays explicit and does not adjust raw times',()=>{
  const v=source();v.shots[1].start='6.0009';const p=D.proposal(v);assert.equal(p.source.shots[1].start,'6.0009');assert.equal(p.totalFrames,288);
});
test('exact tie-to-even and fractional FPS use the existing frame mapper',()=>{
  for(const fps of ['8','23.976','29.97','59.94','120']){
    const v={duration:'9',fps,shots:[{id:'a',start:'0',end:'.1875'},{id:'b',start:'.1875',end:'.9375'}]};
    const p=D.proposal(v);assert.equal(p.totalFrames,Frames.frameIndex(.9375,Number(fps)));
  }
});
test('source identity and scalar shape are strict with a maximum of 1000 rows',()=>{
  for(const edit of [v=>v.shots[1].id='a',v=>v.shots[0].id='',v=>v.shots[0].start=0,v=>v.fps=24,v=>v.duration=null,v=>v.shots=Array(1001).fill(v.shots[0])]){const v=source();edit(v);assert.throws(()=>D.compare(v));}
  const v={duration:'2000',fps:'24',shots:Array.from({length:1000},(_,i)=>({id:String(i),start:String(i),end:String(i+1)}))};assert.equal(D.proposal(v).seconds,1000);
});
test('explicit adoption and undo preserve raw before, original times and unrelated data',()=>{
  const {value,other,c}=controller();value.duration=' 60.000 ';c.refresh();const times=structuredClone(value.shots),media=other.media;
  c.adopt();assert.equal(value.duration,'12');assert.equal(c.view().canUndo,true);other.visual='後續畫面';c.refresh();c.undo();
  assert.equal(value.duration,' 60.000 ');assert.deepEqual(value.shots,times);assert.equal(other.visual,'後續畫面');assert.equal(other.media,media);assert.equal(c.view().canUndo,false);
});
test('undo records what the injected field actually received',()=>{
  const {value,c}=controller({write:v=>v==='12'?'12.000':v});c.adopt();assert.equal(value.duration,'12.000');assert.equal(c.view().canUndo,true);c.undo();assert.equal(value.duration,'60');
  const wrong=controller({write:v=>v==='12'?'13':v});assert.throws(()=>wrong.c.adopt(),/預期值/);assert.equal(wrong.c.view().canUndo,true);wrong.c.undo();assert.equal(wrong.value.duration,'60');
});
test('post-adoption duration time identity order row-count and FPS edits refuse unsafe undo without writing',()=>{
  for(const edit of [v=>v.duration='13',v=>v.shots[0].start='',v=>v.shots[0].end='6.1',v=>v.shots[0].id='replacement',v=>v.shots.reverse(),v=>v.shots.pop(),v=>v.fps='25']){
    const {value,c}=controller();c.adopt();edit(value);const before=structuredClone(value);c.refresh();assert.equal(c.view().canUndo,false);assert.throws(()=>c.undo(),/已有變更/);assert.deepEqual(value,before);
  }
});
test('a changed unpublished source cannot adopt an unseen duration and recovers after refresh',()=>{
  const {value,c}=controller();value.shots[1].end='15';assert.throws(()=>c.adopt(),/重新核對/);assert.equal(value.duration,'60');c.adopt();assert.equal(value.duration,'15');
});
test('proposal and views are isolated copies; clear cannot undo a previous workbench',()=>{
  const {value,c}=controller(),v=c.view();v.candidate.source.shots[0].end='99';assert.equal(value.shots[0].end,'6');c.adopt();c.clear();assert.equal(c.view().canUndo,false);assert.throws(()=>c.undo());
});
test('same or unavailable duration cannot invoke the writer',()=>{
  const value=source();let writes=0;const c=D.createController({capture:()=>value,apply:()=>writes++,onState:()=>{}});
  value.duration='12';c.refresh();assert.throws(()=>c.adopt());value.shots[0].end='';c.refresh();assert.throws(()=>c.adopt());assert.equal(writes,0);
});
test('actual add-shot handler keeps declared duration and rejects duplicate work while busy',()=>{
  const code=fs.readFileSync(path.join(root,'web/app.js'),'utf8'),start=code.indexOf("$('shot-add').onclick="),end=code.indexOf("$('mv-build').onclick=",start);assert.ok(start>=0&&end>start);
  for(const busy of [false,true]){const controls={'shot-add':{},'mv-duration':{value:'60'}},rows=[{start:'0',end:'24',character_state:'原人物'}],state={busy};let writes=0;
    const context={readValue:control=>control.value,MusicPlanningValues:require('../web/planning-values.js'),$:id=>controls[id],state,rawShots:()=>structuredClone(rows),shotOpenStates:()=>[false],entriesFor:()=>[{id:'a'}],collections:{shots:{limit:1000}},rowSequence:1,renderShots:()=>writes++,markDirty:()=>{},focusEntry:()=>{},say:()=>{},Number};vm.createContext(context);vm.runInContext(code.slice(start,end),context);controls['shot-add'].onclick();assert.equal(controls['mv-duration'].value,'60');assert.equal(writes,busy?0:1);
  }
});
test('actual shot deletion keeps all surviving raw times, declared duration and a restorable record',()=>{
  const code=fs.readFileSync(path.join(root,'web/app.js'),'utf8'),start=code.indexOf('function deleteEntry('),end=code.indexOf('function undoDeletion(',start);
  const rows=[{id:'a',value:{start:'0',end:'6',section:'甲'}},{id:'b',value:{start:'6',end:'12',section:'乙'}},{id:'c',value:{start:'12',end:'18',section:'丙'}}],controls={'mv-duration':{value:'60'}};let written,record;
  const context={readValue:control=>control.value,MusicPlanningValues:require('../web/planning-values.js'),$:id=>controls[id],state:{busy:false},collections:{shots:{scope:'storyboard',label:'鏡頭'}},entriesFor:()=>structuredClone(rows),MusicHistory:require('../web/deletion-history.js'),MusicEditor:require('../web/editor-state.js'),deletionHistory:{push:(_scope,r)=>record=r},writeEntries:(_list,r)=>written=r,refreshDeletionHistory:()=>{},markDirty:()=>{},focusEntry:()=>{},say:()=>{}};
  vm.createContext(context);vm.runInContext(code.slice(start,end),context);context.deleteEntry('shots',1);assert.equal(controls['mv-duration'].value,'60');assert.deepEqual(written,[rows[0],rows[2]]);assert.deepEqual(record.patches,[]);assert.deepEqual(record.fields,{});
  const restored=context.MusicHistory.restore(written,record,{fields:{'mv-duration':'60'}});assert.deepEqual(restored.entries,rows);assert.equal(restored.fields['mv-duration'],'60');
});

test('raw declaration categories agree with the Python application and shared timing diagnostics',()=>{
  const whitespace=['','\t','\n','\r','\u001c','\u001d','\u001e','\u001f','\u0085','\u00a0','\u1680','\u2000','\u2001','\u2002','\u2003','\u2004','\u2005','\u2006','\u2007','\u2008','\u2009','\u200a','\u2028','\u2029','\u202f','\u205f','\u3000'];
  const invalid=['\ufeff',' \ufeff ','\u200b','\u0085\ufeff\u001c','\ufeff12\ufeff','\u001c12\u001c','NaN','-1e-999','0'];
  const durations=[...whitespace,...invalid,'\u008512.0\u0085','１２','1_2','60'];
  const panels=durations.map(duration=>({fields:{'mv-duration':duration,'mv-fps':'24'},shots:[{start:'0',end:'6'},{start:'6',end:'12'}]}));
  const native=JSON.parse(execFileSync('python',['-X','utf8','-c','import json,sys;from musiclab.application import build;print(json.dumps([build("storyboard_timing_review",{"panel":p}).data for p in json.load(sys.stdin)]))'],{cwd:root,input:JSON.stringify(panels),encoding:'utf8',timeout:10000}));
  for(const [i,duration] of durations.entries()){
    const v=source();v.duration=duration;const before=structuredClone(v),result=D.compare(v),diagnostic=Timing.report(panels[i]);
    assert.deepEqual(diagnostic,native[i]);assert.deepEqual(v,before);
    if(i<whitespace.length){assert.equal(result.status,'empty');assert.equal(result.declaredText,'尚未宣告');assert.equal(diagnostic.issues.find(issue=>issue.field==='mv-duration').code,'missing_clock');}
    else if(i<whitespace.length+invalid.length){assert.equal(result.status,'invalid');assert.equal(result.declaredText,'請核對宣告');assert.ok(diagnostic.issues.some(issue=>issue.field==='mv-duration'));}
    else{assert.equal(result.status,duration==='60'?'differs':'matches');assert.equal(result.declaredText,duration==='60'?'60 秒':'12 秒');}
  }
});

test('unavailable tail still reports the raw declaration category without offering a write',()=>{
  for(const [duration,label] of [['\ufeff','請核對宣告'],['\u0085','尚未宣告'],['\u001c','尚未宣告']]){
    const value=source();value.duration=duration;value.shots[1].end='';let writes=0;
    const c=D.createController({capture:()=>value,apply:()=>writes++,onState:()=>{}}),before=structuredClone(value),v=c.refresh();
    assert.equal(v.status,'unavailable');assert.equal(v.declaredText,label);assert.equal(v.canAdopt,false);assert.throws(()=>c.adopt());assert.equal(writes,0);assert.deepEqual(value,before);
  }
});

test('explicit adoption and undo restore BOM and Python whitespace byte for byte and retain later creative text',()=>{
  for(const raw of ['\ufeff',' \ufeff ','\u0085','\u001c\u0085\u3000']){
    const {value,other,c}=controller();value.duration=raw;value.shots[1].end='\u008512.000\u0085';c.refresh();
    const times=structuredClone(value.shots),media=other.media;c.adopt();assert.equal(value.duration,'\u008512.000\u0085');assert.equal(c.view().canUndo,true);
    other.visual='後續原畫面 🎵  ';c.refresh();c.undo();assert.equal(value.duration,raw);assert.deepEqual(value.shots,times);assert.equal(other.visual,'後續原畫面 🎵  ');assert.equal(other.media,media);assert.equal(c.view().canUndo,false);
  }
});

test('raw declaration changes invalidate an offered adoption even when both values are whitespace',()=>{
  const {value,c}=controller();value.duration='\u0085';c.refresh();value.duration='\u001c';const before=structuredClone(value);
  assert.throws(()=>c.adopt(),/重新核對/);assert.deepEqual(value,before);assert.equal(c.view().status,'empty');
  c.adopt();assert.equal(value.duration,'12');c.undo();assert.equal(value.duration,'\u001c');
});

test('refused and no-op undo writers never report success or discard a safe retry',()=>{
  for(const refusal of ['false','void']){
    const value=source(),states=[];let mode='write',writes=0;
    const c=D.createController({capture:()=>value,apply:v=>{writes++;if(mode==='refuse')return refusal==='false'?false:undefined;value.duration=v;},onState:v=>states.push(v)});
    c.refresh();c.adopt();mode='refuse';assert.throws(()=>c.undo(),/拒絕|未還原/);assert.equal(value.duration,'12');assert.equal(c.view().canUndo,true);
    assert.ok(states.every(v=>!v.note.includes('已撤回')));assert.equal(writes,2);mode='write';c.undo();assert.equal(value.duration,'60');assert.equal(writes,3);assert.equal(c.view().canUndo,false);
  }
});

test('undo requires the exact prior raw string rather than numerical equivalence',()=>{
  const value=source();value.duration='\u0085 60.00 \u0085';let normalize=false;
  const c=D.createController({capture:()=>value,apply:v=>{value.duration=normalize?v.trim().replaceAll('\u0085','').trim():v;},onState:()=>{}});
  c.refresh();c.adopt();normalize=true;assert.throws(()=>c.undo(),/原字串/);assert.equal(value.duration,'60.00');assert.equal(c.view().canUndo,false);
  value.duration='12';normalize=false;c.undo();assert.equal(value.duration,'\u0085 60.00 \u0085');assert.equal(c.view().canUndo,false);
});

test('source changes during undo refuse success and preserve the original scoped retry',()=>{
  for(const edit of [v=>v.fps='25',v=>v.shots[0].id='new',v=>v.shots[0].end='7',v=>v.shots.reverse(),v=>v.shots.pop()]){
    const value=source(),original=structuredClone(value);let change=false;
    const c=D.createController({capture:()=>value,apply:v=>{value.duration=v;if(change)edit(value);},onState:()=>{}});
    c.refresh();c.adopt();change=true;const expected=structuredClone(original);edit(expected);assert.throws(()=>c.undo(),/來源/);assert.equal(c.view().canUndo,false);assert.deepEqual(value,expected);
    value.duration='12';value.fps=original.fps;value.shots=structuredClone(original.shots);change=false;assert.equal(c.view().canUndo,true);c.undo();assert.deepEqual(value,original);
  }
});

test('writer exceptions and unreadable post-write snapshots retain an unchanged undo record',()=>{
  for(const failure of ['throw','malformed']){
    const value=source();let undoPhase=false,fail=true,reads=0;
    const c=D.createController({capture:()=>{if(undoPhase&&++reads===2&&fail&&failure==='malformed')return {...value,duration:null};return value;},apply:v=>{if(undoPhase&&fail){if(failure==='throw')throw Error('writer failed');return;}value.duration=v;},onState:()=>{}});
    c.refresh();c.adopt();undoPhase=true;assert.throws(()=>c.undo(),/writer failed|來源不完整/);assert.equal(value.duration,'12');assert.equal(c.view().canUndo,true);
    fail=false;c.undo();assert.equal(value.duration,'60');assert.equal(c.view().canUndo,false);
  }
});

test('successful undo publishes the checked post-write snapshot without another capture',()=>{
  const value=source();let undoPhase=false,reads=0;
  const c=D.createController({capture:()=>{if(undoPhase&&++reads===3)return {...value,duration:'foreign',fps:'25'};return value;},apply:v=>{value.duration=v;},onState:()=>{}});
  c.refresh();c.adopt();undoPhase=true;const result=c.undo();assert.equal(reads,2);assert.equal(result.declaredText,'60 秒');assert.equal(result.canUndo,false);assert.equal(value.duration,'60');
});

test('a cleared record during capture or write cannot be resurrected by undo',()=>{
  for(const at of ['capture','write']){
    const value=source();let undoPhase=false,cleared=false,writes=0,c;
    c=D.createController({capture:()=>{if(undoPhase&&at==='capture'&&!cleared){cleared=true;c.clear();}return value;},apply:v=>{writes++;value.duration=v;if(undoPhase&&at==='write'){cleared=true;c.clear();}},onState:()=>{}});
    c.refresh();c.adopt();undoPhase=true;assert.throws(()=>c.undo(),/已有變更|紀錄有變更/);assert.equal(writes,at==='capture'?1:2);assert.equal(c.view().canUndo,false);assert.equal(value.duration,at==='capture'?'12':'60');
  }
});

test('the actual app undo handler shows refused writes as errors and permits an explicit retry',()=>{
  const code=fs.readFileSync(path.join(root,'web/app.js'),'utf8'),start=code.indexOf("for(const action of ['adopt','undo'])$('mv-duration-"),end=code.indexOf('function loadMv(',start);assert.ok(start>=0&&end>start);
  const value=source(),messages=[];let refuse=false;
  const c=D.createController({capture:()=>value,apply:v=>{if(refuse)return false;value.duration=v;},onState:()=>{}});c.refresh();c.adopt();refuse=true;
  const controls={'mv-duration-adopt':{},'mv-duration-undo':{}},context={$:id=>controls[id],state:{busy:false},storyboardDurationController:c,say:(text,error)=>messages.push({text,error})};
  vm.createContext(context);vm.runInContext(code.slice(start,end),context);controls['mv-duration-undo'].onclick();assert.equal(messages[0].error,true);assert.ok(!messages[0].text.includes('已撤回'));assert.equal(value.duration,'12');assert.equal(c.view().canUndo,true);
  refuse=false;controls['mv-duration-undo'].onclick();assert.equal(value.duration,'60');assert.equal(messages[1].error,undefined);assert.ok(messages[1].text.includes('已撤回'));
});

test('an explicit false after a partial write cannot become an accepted undo or trigger rollback',()=>{
  const value=source(),states=[];let refuse=false,writes=0;
  const c=D.createController({capture:()=>value,apply:v=>{writes++;value.duration=v;if(refuse)return false;},onState:v=>states.push(v)});
  c.refresh();c.adopt();refuse=true;assert.throws(()=>c.undo(),/被拒絕/);assert.equal(value.duration,'60');assert.equal(writes,2);assert.equal(c.view().canUndo,false);assert.ok(states.every(v=>!v.note.includes('已撤回')));
  value.duration='12';refuse=false;c.undo();assert.equal(value.duration,'60');assert.equal(writes,3);assert.equal(c.view().canUndo,false);
});
