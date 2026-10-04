// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),{execFileSync}=require('node:child_process'),path=require('node:path');
const R=require('../musiclab/assets/lyrics-export-review.js'),G=require('../web/lyrics-result.js'),C=require('../web/lyrics-export.js');
const source=G.expectedBuild({title:'格式 <b>',cues:[{start:0,end:1,text:'[00:04]字'},{start:2,end:3,text:' \t'},{start:4,end:5,text:'\u2028'}],duration:6});
function domain(payload){return JSON.parse(execFileSync(process.platform==='win32'?'python':'python3',['-X','utf8','-c','import json,sys;from musiclab.application import build;print(json.dumps(build("lyrics_export_review",json.load(sys.stdin)).wire(),ensure_ascii=False))'],{cwd:path.join(__dirname,'..'),input:JSON.stringify(payload),encoding:'utf8',timeout:10000}));}
const reply=domain({package:source});
test('real application report/hash/JSON/Markdown is checked with native crypto',async()=>{const before=structuredClone(source),data=await R.inspect(reply,{package:source});assert.deepEqual(data,reply.data);assert.deepEqual(source,before);assert.equal(data.issue_count,2);assert.deepEqual(data.issues.map(i=>[i.row,i.format]),[[1,'lrc'],[2,'srt']]);assert.equal(data.formats.json.package_metadata_preserved,true);});
test('ASCII blank SRT and shared adjacent LRC grammar avoid Unicode or literal-space false positives',async()=>{
  const texts=['','\t ','\u0085','\u2028','\u2029','\u00a0','[0:01]字','[00:01.1234]字',' [00:01]字','[offset:9]字'],data=G.expectedBuild({title:'語法',cues:texts.map((text,i)=>({start:i*2,end:i*2+1,text})),duration:20});
  const r=await R.review({package:data});assert.deepEqual(r.issues.map(i=>[i.row,i.format]),[[1,'srt'],[2,'srt'],[7,'lrc']]);
});
test('source hash covers all package history and ignores object key order and number representation',async()=>{
  const hash=reply.data.source.sha256,reordered=Object.fromEntries(Object.entries(source).reverse());assert.equal((await R.review({package:reordered})).source.sha256,hash);
  for(const mutate of [p=>p.title='其他',p=>p.review_notes.push('歷史'),p=>p.timing.applied_shift_seconds=-.125,p=>p.cues[2].text='其他']){const p=structuredClone(source);mutate(p);assert.notEqual((await R.review({package:p})).source.sha256,hash);}
});
test('compact report examines all10000 cues while keeping only200 details',async()=>{
  const p=G.expectedBuild({title:'有界',cues:Array.from({length:10000},(_,i)=>({start:i*2,end:i*2+1,text:i%2?'[00:04]字':''})),duration:20000}),r=await R.review({package:p});
  assert.equal(r.issue_count,10000);assert.equal(r.issues.length,200);assert.equal(r.formats.lrc.issue_count,5000);assert.equal(r.details_truncated,true);assert.equal(Object.hasOwn(r.source,'cues'),false);assert.ok(Buffer.byteLength(JSON.stringify(r,null,2)+'\n'+R.markdown(r))<256*1024);
});
test('unknown source/report schema, mixed fields, paths and independent artifact corruption refuse',async()=>{
  for(const payload of [{},{package:source,path:'secret'}, {package:{...source,schema_version:2}}])await assert.rejects(R.review(payload));
  for(const mutate of [r=>r.data.schema_version=2,r=>r.data.source.sha256='0'.repeat(64),r=>r.files['lyrics-export-review.md']+='changed',r=>r.files['lyrics-export-review.json']=r.files['lyrics-export-review.json'].replace('{','{"format":"shadow",'),r=>r.meta.needs_review=false,r=>r.meta.protocol_version=2]){const r=structuredClone(reply);mutate(r);await assert.rejects(R.inspect(r,{package:source}));}
});
test('same issue counts from unrelated text still fail the source hash',async()=>{const p=structuredClone(source);p.cues[2].text='不同但沒有風險';const wrong=domain({package:p});assert.equal(wrong.data.issue_count,reply.data.issue_count);await assert.rejects(R.inspect(wrong,{package:source}),/來源/);});
function deferred(){let resolve,reject;const promise=new Promise((yes,no)=>{resolve=yes;reject=no;});return {promise,resolve,reject};}
function harness(){const snapshot={payload:{package:structuredClone(source)},ids:['sorted-2','sorted-1','sorted-3']},reports=[],errors=[],states=[],jobs=[];
  const c=C.createController({capture:()=>snapshot,request:()=>{const d=deferred();jobs.push(d);return d.promise;},onReport:(data,files,ids)=>reports.push({data,files,ids}),onError:e=>errors.push(e.message),onState:s=>states.push(s)});
  return {snapshot,reports,errors,states,jobs,c};}
test('controller is read-only and retains stable row IDs with valid application reply',async()=>{const h=harness(),before=structuredClone(h.snapshot),work=h.c.check();h.jobs[0].resolve(reply);assert.equal(await work,true);assert.deepEqual(h.snapshot,before);assert.deepEqual(h.reports[0].ids,before.ids);assert.equal(h.states.at(-1).pending,false);h.reports[0].files['lyrics-export-review.md']='later';assert.notEqual(reply.files['lyrics-export-review.md'],'later');});
test('changed cue text or row ID order before reply preserves content and refuses stale report',async()=>{
  for(const change of [h=>h.snapshot.payload.package.cues[2].text='後續',h=>h.snapshot.ids.reverse()]){const h=harness(),work=h.c.check();change(h);h.jobs[0].resolve(reply);assert.equal(await work,false);assert.equal(h.reports.length,0);assert.match(h.errors.at(-1),/來源或句子位置/);}
});
test('cancel and newer generation suppress old success and errors',async()=>{for(const failed of [false,true]){const h=harness(),old=h.c.check();h.c.invalidate();const current=h.c.check();h.jobs[1].resolve(reply);assert.equal(await current,true);if(failed)h.jobs[0].reject(Error('obsolete'));else h.jobs[0].resolve(reply);assert.equal(await old,false);assert.equal(h.reports.length,1);assert.deepEqual(h.errors,[]);}});
test('scope change is checked before reply decoding and transport failure remains retryable',async()=>{
  const h=harness();let current=true;const work=h.c.check(()=>current);current=false;h.jobs[0].resolve(null);assert.equal(await work,false);assert.equal(h.reports.length,0);assert.deepEqual(h.errors,[]);
  const bad=h.c.check();h.jobs[1].reject(Error('transport'));assert.equal(await bad,false);const retry=h.c.check();h.jobs[2].resolve(reply);assert.equal(await retry,true);assert.equal(h.reports.length,1);
});

test('actual DOM adapter labels and focuses the original unsorted table row, and stale report cannot focus',()=>{
  const fs=require('node:fs'),vm=require('node:vm'),source=fs.readFileSync(path.join(__dirname,'../web/app.js'),'utf8');
  const start=source.indexOf('function renderLyricsExportReview('),end=source.indexOf('lyricsExportController=MusicLyricsExport.createController(',start);
  assert.ok(start>=0&&end>start);
  const node=()=>({dataset:{},children:[],append(child){this.children.push(child);},replaceChildren(){this.children=[];}}),box=node(),list=node(),status=node();
  let focused=null;const rows=['tag','blank','ordinary'],inputs=rows.map(id=>[{},{},{focus(){focused=id;}}]);
  const nodes={'lyrics-export-box':box,'lyrics-export-issues':list,'lyrics-export-status':status,cues:{children:inputs.map(a=>({querySelectorAll:()=>a}))}};
  const context={state:{busy:false},$:id=>nodes[id],entriesFor:()=>rows.map(id=>({id})),document:{createElement:node}};
  vm.createContext(context);vm.runInContext(source.slice(start,end),context);
  context.renderLyricsExportReview(reply.data,['tag','blank','ordinary']);
  assert.match(list.children[0].children[0].textContent,/表格第 1 句 · LRC/);
  const sorted=structuredClone(reply.data);sorted.issues=[{...sorted.issues[0],row:3}];
  context.renderLyricsExportReview(sorted,['blank','ordinary','tag']);
  const button=list.children[0].children[0];assert.match(button.textContent,/表格第 1 句 · LRC/);button.onclick();assert.equal(focused,'tag');
  focused=null;box.dataset.stale='true';button.onclick();assert.equal(focused,null);
});
