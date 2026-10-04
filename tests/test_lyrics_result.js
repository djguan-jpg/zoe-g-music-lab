// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),{execFileSync}=require('node:child_process'),path=require('node:path');
const G=require('../web/lyrics-result.js').createChecker(require('./helpers/lyric-preview-contract.js')),P=require('../musiclab/assets/lyrics-package.js');
const root=path.join(__dirname,'..'),payload={title:' 原名 <b> ',cues:[{start:4.125,end:5.875,text:'字\u0085後\u2028尾\u2029終\t  '},{start:1.125,end:2.5,text:'  原文 [00:02] [offset:999]\t '},{start:3,end:4,text:''}],duration:null};
function domain(value){return JSON.parse(execFileSync(process.platform==='win32'?'python':'python3',['-X','utf8','-c','import json,sys;from musiclab.application import build;print(json.dumps(build("lyrics",json.load(sys.stdin)).wire(),ensure_ascii=False))'],{cwd:root,input:JSON.stringify(value),encoding:'utf8',timeout:10000}));}
const actual=domain(payload),expected=G.expectedBuild(payload);
test('real application reply matches original literal cues, sorted times, blank text and duration provenance',()=>{
  const before=structuredClone(payload),accepted=G.checkedResult(expected,actual);assert.deepEqual(accepted.data,actual.data);assert.deepEqual(payload,before);
  assert.equal(accepted.data.title,payload.title);assert.equal(accepted.data.cues[0].text,payload.cues[1].text);assert.equal(accepted.data.cues[1].text,'');assert.equal(accepted.data.duration,5.875);
  assert.equal(accepted.data.timing.duration_source,'last_cue_end');assert.deepEqual(G.textFiles(actual.data.cues),{'lyrics.lrc':actual.files['lyrics.lrc'],'lyrics.srt':actual.files['lyrics.srt']});
});
test('explicit complete package retains provided time, prior shift and review notes',()=>{
  const original=P.revise(actual.data,actual.data.cues,10);original.timing.applied_shift_seconds=.125;original.review_notes.push(' 保留原說明 ');
  const request={package:original},reply=domain(request);assert.deepEqual(G.checkedResult(G.expectedBuild(request),reply).data,original);assert.equal(reply.meta.needs_review,true);
});
for(const [label,change] of Object.entries({text:p=>p.cues[0].text='其他句',title:p=>p.title='其他名',clock:p=>p.cues[0].start=4.5,duration:p=>p.duration=10})){
  test(`self-consistent unrelated ${label} is refused against original request`,()=>{const wrong=structuredClone(payload);change(wrong);assert.throws(()=>G.checkedResult(expected,domain(wrong)),/來源/);});
}
test('self-consistent extra historical notes and inference cannot replace generated build provenance',()=>{
  const changed=structuredClone(actual.data);changed.review_notes=['未送出的說明'];assert.throws(()=>G.checkedResult(expected,domain({package:changed})),/來源/);
  changed.review_notes=[];changed.timing.inferred_end_count=1;assert.throws(()=>G.checkedResult(expected,domain({package:changed})),/來源/);
});
test('independent LRC and SRT substitutions, missing files and metadata corruption are refused',()=>{
  for(const mutate of [r=>r.files['lyrics.lrc']+='改字',r=>r.files['lyrics.srt']=r.files['lyrics.srt'].replace('原文','其他'),r=>delete r.files['preview.html'],r=>r.files['extra.txt']='x',r=>r.meta.protocol_version=2,r=>r.meta.needs_review=false,r=>r.meta.version='',r=>r.meta.extra=true,r=>r.files['preview.html']=null]){
    const wrong=structuredClone(actual);mutate(wrong);assert.throws(()=>G.checkedResult(expected,wrong));
  }
});
test('JSON file is strict, bounded and complete: duplicate keys, changed data and unknown schemas refused',()=>{
  for(const mutate of [r=>r.files['lyrics.json']=r.files['lyrics.json'].replace('{','{"title":"shadow",'),r=>r.files['lyrics.json']=' '.repeat(2*1024*1024)+r.files['lyrics.json'],r=>r.files['lyrics.json']=JSON.stringify({...r.data,title:'替代'}),r=>r.data.schema_version=2]){
    const wrong=structuredClone(actual);mutate(wrong);assert.throws(()=>G.checkedResult(expected,wrong));
  }
});
test('source and checked reply isolate mutations and object key order does not alter semantics',()=>{
  const original=structuredClone(actual),data=Object.fromEntries(Object.entries(actual.data).reverse()),reply={...actual,data};
  const accepted=G.checkedResult(expected,reply);accepted.data.cues[0].text='later';accepted.files['lyrics.lrc']='later';assert.deepEqual(actual,original);
  assert.equal(expected.cues[0].text,payload.cues[1].text);
});
test('explicit build request rejects mixed package/cues, unknown fields and missing source',()=>{
  for(const wrong of [{...payload,shift_seconds:0},{package:actual.data,cues:payload.cues},{title:'name',duration:10},null])assert.throws(()=>G.expectedBuild(wrong));
});
test('inferred end and supplied duration agree with real application at millisecond boundaries',()=>{
  for(const duration of [null,10]){
    const request={title:'推估',cues:[{start:1.1254,text:' 尾句\t '}],duration},reply=domain(request);assert.deepEqual(G.checkedResult(G.expectedBuild(request),reply).data,reply.data);
    assert.equal(reply.data.timing.inferred_end_count,1);assert.equal(reply.data.timing.tail_end_inferred,true);
  }
});
