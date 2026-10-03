// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const {execFileSync}=require('node:child_process');
const Review=require('../web/planning-review.js');
const root=path.join(__dirname,'..');
// Exercise the pure presentation model against actual shared application results.
const fixtures=JSON.parse(execFileSync(process.platform==='win32'?'python':'python3',['-X','utf8','-c',
  "import json;from pathlib import Path;from musiclab.application import build;print(json.dumps({op:build(op,json.loads((Path('examples')/name).read_text(encoding='utf-8'))).wire() for op,name in [('music','first-light-music.json'),('storyboard','first-light-mv.json')]},ensure_ascii=False))"],{cwd:root,encoding:'utf8',timeout:10000}));
const response=op=>structuredClone(fixtures[op]);
test('real application music maps source title, memory hook, bars, timing and design energy without mutation',()=>{
  const r=response('music'),before=structuredClone(r),model=Review.buildReview('music',r);
  assert.deepEqual(r,before);assert.equal(model.title,r.data.title);assert.equal(model.bars,68);
  assert.equal(model.duration,136);assert.equal(model.hook,r.data.memory_hook);assert.equal(model.sections[5].energy,5);
  assert.equal(model.status,'設計資料已建立');assert.equal(model.fileCount,4);model.sections[0].focus='after';assert.deepEqual(r,before);
});
test('real application storyboard maps motif use and matching shot identities without mutation',()=>{
  const r=response('storyboard'),before=structuredClone(r),model=Review.buildReview('storyboard',r);
  assert.deepEqual(r,before);assert.equal(model.shots.length,4);assert.equal(model.fileCount,5);
  assert.deepEqual(model.motifs[0].shots,[1,2,3,4]);assert.equal(model.shots[1].purpose,r.data.shots[1].purpose);
  assert.equal(model.shots[1].motif_state,r.data.continuity[1].motif_state);model.notes.push('later');assert.deepEqual(r,before);
});
test('music malformed timing, nonfinite energy, files and contradictory review metadata refuse a new summary',()=>{
  for(const change of [r=>r.data.sections[0].energy=Infinity,r=>r.data.sections[1].start=100,
    r=>r.data.duration_seconds++,r=>r.data.sections[0].bars=1.5,r=>delete r.files['task.md'],
    r=>r.meta.needs_review=true,r=>r.meta.protocol_version=2,r=>r.data.status='music_generated']){
    const r=response('music');change(r);assert.throws(()=>Review.buildReview('music',r));
  }
});
test('storyboard missing motif, wrong shot identity and invalid review reference refuse',()=>{
  for(const change of [r=>r.data.continuity[0].motif='missing',r=>r.data.continuity[1].shot=99,
    r=>r.data.shots[0].end=NaN,r=>r.data.shots[1].start=1,r=>r.data.continuity.pop(),
    r=>{r.data.review_notes=[{shot:99,message:'bad'}];r.meta.needs_review=true;},r=>delete r.files['continuity.md']]){
    const r=response('storyboard');change(r);assert.throws(()=>Review.buildReview('storyboard',r));
  }
});
test('scoped and general storyboard reminders retain references and design-only status',()=>{
  const r=response('storyboard');r.data.review_notes=[{shot:2,message:'方向改變'},{shot:null,message:'未使用母題'}];r.meta.needs_review=true;
  const m=Review.buildReview('storyboard',r);assert.equal(m.needsReview,true);assert.deepEqual(m.notes,r.data.review_notes);
  assert.equal(m.status,'設計資料已建立');
});
function pending(op){
  let resolve,current=true;const results=[],brief={title:fixtures[op].data.title,context:{keep:'original'}};
  const task=Review.inspect({operation:op,brief,isCurrent:()=>current,request:(_operation,selected)=>{assert.equal(selected.context.keep,'original');return new Promise(r=>resolve=r);},onResult:(result,review)=>results.push(review)});
  return {task,brief,results,invalidate:()=>current=false,resolve:(r=response(op))=>resolve(r)};
}
test('current planning result commits once and source request is copied before asynchronous work',async()=>{
  const p=pending('music');p.brief.title='later';p.brief.context.keep='modified';p.resolve();assert.equal(await p.task,true);
  assert.equal(p.results.length,1);assert.equal(p.results[0].title,fixtures.music.data.title);
});
test('late music and storyboard responses are discarded before validation or any output write',async()=>{
  for(const op of ['music','storyboard']){const p=pending(op);p.invalidate();p.resolve({garbage:true});assert.equal(await p.task,false);assert.equal(p.results.length,0);}
});
test('wrong source title or malformed current result never commits output',async()=>{
  for(const op of ['music','storyboard']){const p=pending(op),r=response(op);r.data.title='other request';p.resolve(r);await assert.rejects(p.task,/這次需求/);assert.equal(p.results.length,0);}
  const p=pending('music');p.resolve({});await assert.rejects(p.task,/不完整/);assert.equal(p.results.length,0);
});
function runAdapter(scope){
  const source=fs.readFileSync(path.join(root,'web/app.js'),'utf8'),a=source.indexOf('async function run('),b=source.indexOf('function setFiles(',a);
  const state={tab:scope,revisions:{[scope]:0},busy:false},button={disabled:false},notices=[];
  let resolve,reject,commits=0,dirty=0;const work=new Promise((r,j)=>{resolve=r;reject=j;});
  const context={state,say:m=>notices.push(m),timingControls:()=>{},markDirty:()=>dirty++};vm.runInNewContext(source.slice(a,b),context);
  return {state,button,notices,resolve,reject,counts:()=>({commits,dirty}),
    start:()=>context.run(button,async isCurrent=>{await work;if(isCurrent())commits++;}),
    edit:()=>state.revisions[scope]++,retry:()=>context.run(button,async()=>{commits++;}),guarded:()=>context.run(button,isCurrent=>Review.inspect({operation:scope,brief:{title:fixtures[scope].data.title},isCurrent,request:()=>work,onResult:()=>commits++}))};
}
test('actual common run discards late errors for every workbench and restores busy controls',async()=>{
  for(const scope of ['music','storyboard','lyrics','audio']){const a=runAdapter(scope),work=a.start();a.edit();a.reject(Error('old failure'));await work;
    assert.ok(!a.notices.includes('old failure'));assert.match(a.notices.at(-1),/處理期間輸入有修改/);
    assert.equal(a.state.busy,false);assert.equal(a.button.disabled,false);assert.deepEqual(a.counts(),{commits:0,dirty:1});}
});
test('actual common run surfaces current failures and permits the next task',async()=>{
  const a=runAdapter('music'),work=a.start();a.reject(Error('current failure'));await work;
  assert.equal(a.notices.at(-1),'current failure');assert.deepEqual(a.counts(),{commits:0,dirty:0});
  assert.equal(a.state.busy,false);assert.equal(a.button.disabled,false);await a.retry();assert.deepEqual(a.counts(),{commits:1,dirty:0});
});
test('actual common run and planning inspect prevent stale music and storyboard commits',async()=>{
  for(const scope of ['music','storyboard']){const a=runAdapter(scope),work=a.guarded();a.edit();a.resolve(response(scope));await work;assert.deepEqual(a.counts(),{commits:0,dirty:1});}
});
test('actual common run accepts current planning after an unrelated panel revision',async()=>{
  for(const scope of ['music','storyboard']){const a=runAdapter(scope),work=a.guarded();a.state.revisions.audio=1;a.resolve(response(scope));await work;assert.deepEqual(a.counts(),{commits:1,dirty:0});}
});
test('common run does not start duplicate work while busy',async()=>{
  const a=runAdapter('music'),work=a.start(),next=a.start();await next;a.resolve();await work;
  assert.deepEqual(a.counts(),{commits:1,dirty:0});assert.equal(a.state.busy,false);
});
