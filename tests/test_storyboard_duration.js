// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const D=require('../web/storyboard-duration.js'),Frames=require('../web/storyboard-frames.js');
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
    const context={readValue:control=>control.value,MusicPlanningValues:require('../web/planning-values.js'),$:id=>controls[id],state,rawShots:()=>structuredClone(rows),shotOpenStates:()=>[false],entriesFor:()=>[{id:'a'}],collections:{shots:{limit:1000}},rowSequence:1,renderShots:()=>writes++,markDirty:()=>{},focusShot:()=>{},say:()=>{},Number};vm.createContext(context);vm.runInContext(code.slice(start,end),context);controls['shot-add'].onclick();assert.equal(controls['mv-duration'].value,'60');assert.equal(writes,busy?0:1);
  }
});
test('actual shot deletion compacts time but keeps declared duration and a restorable record',()=>{
  const code=fs.readFileSync(path.join(root,'web/app.js'),'utf8'),start=code.indexOf('function deleteEntry('),end=code.indexOf('function undoDeletion(',start);
  const rows=[{id:'a',value:{start:'0',end:'6',section:'甲'}},{id:'b',value:{start:'6',end:'12',section:'乙'}},{id:'c',value:{start:'12',end:'18',section:'丙'}}],controls={'mv-duration':{value:'60'}};let written,record;
  const context={readValue:control=>control.value,MusicPlanningValues:require('../web/planning-values.js'),$:id=>controls[id],state:{busy:false},collections:{shots:{scope:'storyboard',label:'鏡頭'}},entriesFor:()=>structuredClone(rows),MusicHistory:require('../web/deletion-history.js'),MusicEditor:require('../web/editor-state.js'),deletionHistory:{push:(_scope,r)=>record=r},writeEntries:(_list,r)=>written=r,refreshDeletionHistory:()=>{},markDirty:()=>{},focusEntry:()=>{},say:()=>{}};
  vm.createContext(context);vm.runInContext(code.slice(start,end),context);context.deleteEntry('shots',1);assert.equal(controls['mv-duration'].value,'60');assert.equal(written[1].value.end,'12');
  const restored=context.MusicHistory.restore(written,record,{fields:{'mv-duration':'60'}});assert.deepEqual(restored.entries,rows);assert.equal(restored.fields['mv-duration'],'60');
});
