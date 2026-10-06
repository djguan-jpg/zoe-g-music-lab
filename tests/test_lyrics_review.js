// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),{execFileSync}=require('node:child_process'),path=require('node:path');
const R=require('../musiclab/assets/lyrics-review.js'),V=require('../musiclab/assets/delivery-versions.js');
const partial={title:'原創待辦 🎵',duration:'10',cues:[{start:'',end:'',text:'未標記'},{start:'0',end:'2',text:'  保留原文  '},{start:'3',end:'',text:'缺少句尾'}]};
const wire=p=>({data:R.review(p),files:{'lyrics-review.json':JSON.stringify(R.review(p)),'lyrics-review.md':R.markdown(R.review(p))},meta:{version:V.current,protocol_version:1,needs_review:true}});
function harness(request=async p=>wire(p)){
  let payload=structuredClone(partial);const reports=[],errors=[],states=[];
  const controller=R.createController({capture:()=>payload,request,onReport:(...v)=>reports.push(v),onError:e=>errors.push(e.message),onState:s=>states.push(s)});
  return {controller,reports,errors,states,get payload(){return payload;},set payload(v){payload=v;}};
}
test('partial diagnostics preserve raw empty clocks row order and duplicate text',()=>{
  const before=structuredClone(partial),d=R.review(partial);assert.deepEqual(d.source,before);assert.deepEqual(partial,before);
  assert.deepEqual(d.issues.map(i=>[i.row,i.field]),[[1,'start'],[1,'end'],[3,'end']]);assert.equal(d.timed_rows,1);assert.equal(d.blocking_rows,2);
});
test('empty source is explicitly incomplete and never claims timing checked',()=>{const d=R.review({cues:[]});assert.equal(d.status,'needs_correction');assert.equal(d.issues[0].code,'no_cues');});
test('exclusive boundaries valid unsorted rows preserve original order',()=>{
  const p={cues:[{start:2,end:3,text:'b'},{start:0,end:2,text:'a'}]},d=R.review(p);assert.equal(d.issue_count,0);assert.deepEqual(d.source.cues,p.cues);assert.match(R.markdown(d),/實聽/);
});
test('nested long intervals identify both original rows through the occupied horizon',()=>{
  const d=R.review({cues:[{start:4,end:5,text:'c'},{start:0,end:10,text:'a'},{start:2,end:3,text:'b'}]});assert.deepEqual(d.issues.map(i=>[i.row,i.related_row]),[[2,3],[3,2],[2,1],[1,2]]);
});
test('half-away rounding detects duplicate starts and does not accept negative submillisecond clocks',()=>{
  const d=R.review({cues:[{start:'.0004',end:1,text:'a'},{start:'.00049',end:2,text:'b'}]});assert.deepEqual(d.issues.filter(i=>i.code==='duplicate_start').map(i=>i.row),[1,2]);
  for(const start of ['-.0001',true,'0x10','NaN','Infinity','1e300'])assert.equal(R.review({cues:[{start,end:2,text:'x'}]}).issues[0].code,'invalid_time');
});
test('shared Unicode whitespace preserves raw fields while BOM is not decimal whitespace',()=>{
  const p={duration:'\u0085 10 \u0085',cues:[{start:'\u0085 0 \u0085',end:'2',text:'x'}]};assert.equal(R.review(p).issue_count,0);assert.deepEqual(R.review(p).source,{title:'歌詞校時檢查',...p});
  assert.equal(R.review({cues:[{start:'\ufeff0',end:2,text:'x'}]}).issues[0].code,'invalid_time');
});
test('duration missing invalid and out of bounds remain separate diagnostics',()=>{
  for(const duration of ['',null,'\u0085'])assert.equal(R.review({duration,cues:[{start:0,end:2,text:'x'}]}).duration_declared,false);
  for(const duration of [true,0,'0x10'])assert.equal(R.review({duration,cues:[]}).issues[0].code,'invalid_duration');
  assert.deepEqual(R.review({duration:2,cues:[{start:2,end:3,text:'x'}]}).issues.map(i=>i.field),['start','end']);
});
test('structural paths unknown versions bad shapes and nonfinite values refuse',()=>{
  for(const p of [{},{cues:[],path:'private'},{cues:[],schema_version:999},{cues:[{start:0,text:'x'}]},{cues:[{start:{},end:2,text:'x'}]},{cues:[{start:NaN,end:2,text:'x'}]},{title:'\u0085',cues:[]}])assert.throws(()=>R.review(p));
});
test('ten thousand incomplete rows count all issues but keep only bounded details',()=>{
  const cues=Array.from({length:10000},(_,i)=>({start:'',end:'',text:String(i)})),d=R.review({cues});assert.equal(d.issue_count,20000);assert.equal(d.issues.length,200);assert.equal(d.blocking_rows,10000);assert.equal(d.details_truncated,true);assert.equal(cues[9999].start,'');
});
test('actual Python HTTP-shaped result validates with matching Markdown',()=>{
  const reply=JSON.parse(execFileSync(process.platform==='win32'?'python':'python3',['-X','utf8','-c',"import json;from musiclab.application import build;print(json.dumps(build('lyrics_review',json.loads(input())).wire(),ensure_ascii=False))"],{cwd:path.join(__dirname,'..'),input:JSON.stringify(partial),encoding:'utf8',timeout:10000}));assert.deepEqual(R.inspect(reply,partial),R.review(partial));
});
test('unknown or dishonest report schema counts source status files and protocol refuse',()=>{
  const mutations=[v=>v.data.schema_version=999,v=>v.data.issue_count=0,v=>v.data.status='timing_checked',v=>v.data.source.cues.reverse(),v=>v.data.issues.pop(),v=>v.files['lyrics-review.json']='{}',v=>v.files['lyrics-review.md']='fake',v=>v.meta.needs_review=false,v=>v.meta.protocol_version=2];
  for(const mutate of mutations){const v=wire(partial);mutate(v);assert.throws(()=>R.inspect(v,partial));}
});
test('current checked result does not mutate captured source or write timing fields',async()=>{
  const h=harness(),before=structuredClone(h.payload);assert.equal(await h.controller.check(),true);assert.equal(h.reports.length,1);assert.deepEqual(h.payload,before);assert.equal(h.states.at(-1).pending,false);
});
test('late success after invalidate cannot replace current report',async()=>{
  let resolve;const h=harness(p=>new Promise(r=>resolve=()=>r(wire(p)))),pending=h.controller.check();h.controller.invalidate();resolve();assert.equal(await pending,false);assert.equal(h.reports.length,0);assert.equal(h.errors.length,0);
});
test('late failure from obsolete check is suppressed',async()=>{
  let reject;const h=harness(()=>new Promise((_,r)=>reject=r)),pending=h.controller.check();h.controller.invalidate();reject(Error('late'));assert.equal(await pending,false);assert.equal(h.errors.length,0);
});
test('target edit without invalidation is still detected before publication',async()=>{
  let resolve;const h=harness(p=>new Promise(r=>resolve=()=>r(wire(p)))),pending=h.controller.check();h.payload.cues[0].text='後來的編修';resolve();assert.equal(await pending,false);assert.equal(h.reports.length,0);assert.match(h.errors[0],/內容有修改/);
});
test('new request wins over earlier pending request and capture is isolated',async()=>{
  const resolvers=[];const h=harness(p=>new Promise(r=>resolvers.push(()=>r(wire(p))))),old=h.controller.check();h.payload.cues[0].start='0';const current=h.controller.check();resolvers[1]();assert.equal(await current,true);resolvers[0]();assert.equal(await old,false);assert.equal(h.reports.length,1);assert.equal(h.reports[0][0].source.cues[0].start,'0');
});
