// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),{execFileSync}=require('node:child_process');
const P=require('../musiclab/assets/lyrics-package.js'),I=require('../web/lyrics-import.js'),E=require('../web/editor-state.js'),T=require('../musiclab/assets/lyric-time.js');
const root=path.join(__dirname,'..');
function domain(payload){return JSON.parse(execFileSync(process.platform==='win32'?'python':'python3',['-X','utf8','-c','import json,sys;from musiclab.application import build;print(json.dumps(build("lyrics",json.load(sys.stdin)).wire(),ensure_ascii=False))'],{cwd:root,input:JSON.stringify(payload),encoding:'utf8',timeout:10000}));}
const provided=domain({title:'原創標題 🎵',duration:10,cues:[{start:0,end:2,text:'尾奏之前'}]}),estimated=domain({title:'估計來源',cues:[{start:1,text:'一句'}]}),shifted=domain({title:'移動來源',duration:10,cues:[{start:1,end:2,text:'一句'}],shift_seconds:.5});
const legacy=d=>Object.fromEntries(['title','duration','duration_estimated','cues','timing'].map(k=>[k,structuredClone(d[k])]));
function draft(duration=''){
  const panels={};for(const [name,fields] of Object.entries(E.draftFields)){panels[name]={fields:Object.fromEntries(fields.map(k=>[k,'']))};if(E.draftRows[name])panels[name][E.draftRows[name].key]=[];}
  panels.music.avoid=[];panels.music.deliverables=[];panels.storyboard.motifs=[];panels.audio.fields['audio-profile']='distribution';
  Object.assign(panels.lyrics.fields,{'lyrics-title':'目前標題','lyrics-format':'.lrc','lyrics-source':'目前原文','lyrics-duration':duration});panels.lyrics.cues=[{start:'7',end:'8',text:'目前編修'}];
  return {format:'zoe-music-lab-draft',schema_version:3,tool_version:'0.19.0',saved_at:'2026-10-03',tab:'lyrics',panels};
}
function harness(duration='',request=async(_op,payload)=>domain(payload)){
  const value=draft(duration),views=[],errors=[];
  const c=I.createImport({previewContract:require('./helpers/lyric-preview-contract.js'),capture:()=>value,request,onReady:v=>views.push(v),onClear:()=>{},onError:e=>errors.push(e.message),onState:()=>{}});
  const read=d=>{const raw=new TextEncoder().encode(JSON.stringify(d)).buffer;return c.read({name:'lyrics.json',size:raw.byteLength,arrayBuffer:async()=>raw});};return {value,views,errors,c,read};
}

test('real Python package validates in JS and retains title total duration tail music and declared provenance',()=>{
  for(const r of [provided,estimated,shifted]){assert.deepEqual(P.validate(r.data),r.data);assert.equal(P.needsReview(r.data),r.meta.needs_review);}
  assert.equal(provided.data.duration,10);assert.equal(provided.data.cues[0].end,2);
});
test('validation clones nested cues timing notes and preserves Unicode codepoint limits',()=>{
  const data=structuredClone(provided.data),copy=P.validate(data);copy.cues[0].text='changed';copy.timing.duration_source='changed';copy.review_notes.push('changed');assert.deepEqual(data,provided.data);
  data.title='🎵'.repeat(200);assert.equal(P.validate(data).title,data.title);data.title+='🎵';assert.throws(()=>P.validate(data));
  for(const title of ['\u0085','\u001c','\u2003'])assert.throws(()=>P.validate({...provided.data,title}));
  assert.equal(P.validate({...provided.data,title:'\ufeff'}).title,'\ufeff');
});
test('unknown versions fields timing types order precision overlap and inference contradictions refuse',()=>{
  const mutations=[d=>d.schema_version=2,d=>d.schema_version=true,d=>d.extra=1,d=>d.cues[0].extra=1,d=>d.timing.extra=true,
    d=>d.cues[0].start='0',d=>d.cues[0].start=true,d=>d.cues[0].start=.0004,d=>d.cues[0].end=null,d=>d.duration=1,
    d=>d.duration_estimated=1,d=>d.timing.duration_source='last_cue_end',d=>d.timing.inferred_end_count=true,
    d=>d.timing.inferred_end_count=2,d=>d.timing.tail_end_inferred=true,d=>d.timing.applied_shift_seconds=.0004,
    d=>d.timing.applied_shift_seconds=Infinity,d=>d.review_notes=[''],d=>d.review_notes=['a'.repeat(401)],d=>d.review_notes=Array(21).fill('note')];
  for(const mutate of mutations){const data=structuredClone(provided.data);mutate(data);assert.throws(()=>P.validate(data));}
  const data=structuredClone(estimated.data);data.duration=5;data.cues[0].end=5;assert.throws(()=>P.validate(data));
});
test('legacy is an exact complete shape and only explicit conversion keeps old metadata without mutating it',()=>{
  const data=legacy(provided.data),before=structuredClone(data);assert.equal(P.isLegacy(data),true);assert.throws(()=>P.validate(data));assert.deepEqual(P.fromLegacy(data),provided.data);assert.deepEqual(data,before);
  assert.equal(P.isLegacy({...data,extra:true}),false);assert.throws(()=>P.fromLegacy({...data,extra:true}));
});
test('JSON document parsing refuses duplicate escaped keys nonfinite tokens and malformed syntax without rejecting lyric strings',()=>{
  for(const raw of ['{"cues":[],"cues":[{}]}','{"title":"first","ti\\u0074le":"second"}','[NaN]','[1e999]','{"a":1,}','[1,]'])assert.throws(()=>P.parseDocument(raw));
  const data={...provided.data,cues:[{start:0,end:2,text:'"a":1,"a":2 \\ </script> 🎵'}]};assert.deepEqual(P.parseDocument(JSON.stringify(data)),data);
  const duplicate=JSON.stringify(provided.data).replace('"schema_version":1','"schema_version":2,"schema_version":1');assert.throws(()=>I.sourceRequest(duplicate,'.json',draft().panels.lyrics.fields));
  assert.throws(()=>P.buildRequest({title:'test',cues:data.cues,duration:10,content:duplicate,suffix:'.json'}));
});
test('unchanged standalone apply preserves provided duration after tail and original guessed ending warning',()=>{
  for(const r of [provided,estimated,shifted])assert.deepEqual(P.revise(r.data,r.data.cues.map(c=>({...c,start:String(c.start),end:String(c.end)}))),r.data);
  assert.equal(P.revise(estimated.data,estimated.data.cues).timing.tail_end_inferred,true);
});
test('confirmed player duration updates declaration while keeping origin inferred endings and shift',()=>{
  const data=P.revise(estimated.data,estimated.data.cues,10);assert.equal(data.duration,10);assert.equal(data.duration_estimated,false);assert.equal(data.cues[0].end,4);assert.equal(data.timing.inferred_end_count,1);assert.equal(data.timing.tail_end_inferred,true);assert.match(data.review_notes[0],/總長已更改/);assert.equal(P.needsReview(data),true);
  const shift=P.revise(shifted.data,shifted.data.cues,10);assert.equal(shift.timing.applied_shift_seconds,.5);assert.deepEqual(shift,shifted.data);
  assert.match(P.notice(data),/來源有1句結束.*補齊/);assert.match(P.notice(data),/待確認/);assert.match(P.notice(shift),/調整0.5秒/);
});
test('manual cue edit recomputes current explicit times and retains honest review warning',()=>{
  const data=P.revise(estimated.data,[{start:1,end:3,text:'新句'}]);assert.equal(data.cues[0].end,3);assert.equal(data.duration_estimated,true);assert.equal(data.timing.duration_source,'last_cue_end');assert.equal(data.timing.inferred_end_count,0);assert.match(data.review_notes[0],/逐句時間或文字已編修/);
  assert.throws(()=>P.revise(provided.data,[{start:1,end:11,text:'超過'}]));
  const notes={...provided.data,review_notes:Array.from({length:20},(_,i)=>'保留'+i)};assert.throws(()=>P.revise(notes,[{start:0,end:2,text:'新句'}]));assert.equal(notes.review_notes.length,20);
});
test('workbench build uses matching source package and keeps warnings rather than regenerating guesses as explicit source',()=>{
  const source=estimated.data,request=P.buildRequest({title:source.title,cues:source.cues,duration:null,content:JSON.stringify(source),suffix:'.json'});assert.deepEqual(request,{package:source});
  const confirmed=P.buildRequest({title:source.title,cues:source.cues,duration:10,content:JSON.stringify(source),suffix:'.json'});assert.equal(confirmed.package.timing.inferred_end_count,1);assert.equal(confirmed.package.duration,10);
  const edited=P.buildRequest({title:'改名',cues:[{start:1,end:3,text:'新句'}],duration:10,content:JSON.stringify(source),suffix:'.json'});assert.equal(edited.package.title,'改名');assert.match(edited.package.review_notes[0],/編修/);
});
test('ordinary cue inputs remain separate and unknown package cannot silently fall back',()=>{
  const input={title:'作品',cues:provided.data.cues,duration:10,content:'[00:00.000]原文',suffix:'.lrc'};assert.deepEqual(P.buildRequest(input),{title:input.title,cues:input.cues,duration:10});
  assert.throws(()=>P.buildRequest({...input,suffix:'.json',content:JSON.stringify({...provided.data,schema_version:2})}));
  assert.deepEqual(P.buildRequest({...input,suffix:'.json',content:'{"format":"zoe-lyrics-seed"}'}),{title:input.title,cues:input.cues,duration:10});
});
test('canonical package importer only previews and fills a missing declared duration on explicit proposal',async()=>{
  const h=harness(),before=structuredClone(h.value);assert.equal(await h.read(provided.data),true);assert.deepEqual(h.value,before);assert.equal(h.views[0].packageImport,true);assert.match(h.views[0].durationText,/10秒.*來源已宣告/);
  const proposal=h.c.proposal();assert.equal(proposal.draft.panels.lyrics.fields['lyrics-title'],provided.data.title);assert.equal(proposal.draft.panels.lyrics.fields['lyrics-duration'],'10');assert.equal(proposal.draft.panels.lyrics.cues[0].end,'2');assert.deepEqual(proposal.draft.panels.music,before.panels.music);
});
test('canonical provided duration conflict refuses preview and leaves current audio duration and cue table',async()=>{
  const h=harness('20'),before=structuredClone(h.value);assert.equal(await h.read(provided.data),false);assert.deepEqual(h.value,before);assert.equal(h.c.proposal(),null);assert.match(h.errors[0],/總長與目前時長不同/);
  h.value.panels.lyrics.fields['lyrics-duration']='10.000';assert.equal(await h.read(provided.data),true);assert.equal(h.c.proposal().draft.panels.lyrics.fields['lyrics-duration'],'10.000');
});
test('estimated package keeps current confirmed duration field while file data provenance stays inspectable',async()=>{
  const h=harness('10.000');assert.equal(await h.read(estimated.data),true);assert.equal(h.c.proposal().draft.panels.lyrics.fields['lyrics-duration'],'10.000');assert.equal(JSON.parse(h.c.proposal().files['lyrics.json']).duration,4);assert.match(h.views[0].durationText,/來源估計/);
});
test('explicit legacy preview converts draft source to versioned JSON while preserving all declared metadata',async()=>{
  const old=legacy(provided.data),h=harness();assert.equal(await h.read(old),true);assert.equal(h.views[0].legacyTimed,true);assert.deepEqual(JSON.parse(h.c.proposal().draft.panels.lyrics.fields['lyrics-source']),provided.data);assert.equal(old.format,undefined);
});
test('source package response metadata or files contradiction refuses and clone cannot corrupt pending proposal',async()=>{
  const h=harness('',async(_op,payload)=>{const r=domain(payload);r.data.title='wrong';r.files['lyrics.json']=JSON.stringify(r.data);return r;});assert.equal(await h.read(provided.data),false);assert.equal(h.c.proposal(),null);
  const good=harness();assert.equal(await good.read(provided.data),true);const proposal=good.c.proposal();proposal.draft.panels.lyrics.cues[0].text='bad';assert.equal(good.c.proposal().draft.panels.lyrics.cues[0].text,provided.data.cues[0].text);
});
test('target edit during inspection and after preview both reject replacing title duration or cues',async()=>{
  let reply;const h=harness('',async()=>new Promise(resolve=>reply=resolve));const pending=h.read(provided.data);await Promise.resolve();h.value.panels.lyrics.cues[0].text='較晚編修';reply(provided);assert.equal(await pending,false);assert.equal(h.c.proposal(),null);assert.equal(h.value.panels.lyrics.cues[0].text,'較晚編修');
  const good=harness();await good.read(provided.data);good.value.panels.lyrics.fields['lyrics-duration']='11';assert.throws(()=>good.c.proposal());
});
test('actual production standalone apply delegates to shared package revision and preserves pending data on invalid edit',()=>{
  const preview=domain({package:estimated.data}).files['preview.html'];const start=preview.indexOf('function apply(){'),end=preview.indexOf('function tick()',start);assert.ok(start>0&&end>start);
  let values=estimated.data.cues,rendered=null;const note={textContent:''},context={data:structuredClone(estimated.data),durationField:{value:''},player:{duration:NaN},MusicLyricsPackage:P,LyricTime:T,collect:()=>values,render:v=>rendered=v,tick:()=>{},message:()=>{},document:{getElementById:()=>note}};
  context.media=require('../musiclab/assets/lyrics-media.js').createController({capture:()=>context.durationField.value,apply:value=>context.durationField.value=value,onState:()=>{}});
  vm.runInNewContext(preview.slice(start,end),context);context.apply();assert.deepEqual(context.data,estimated.data);assert.match(note.textContent,/推估/);
  values=[{start:1,end:3,text:'手動新句'}];context.apply();assert.equal(context.data.cues[0].end,3);assert.match(context.data.review_notes[0],/編修/);const before=structuredClone(context.data);context.durationField.value='2';assert.throws(()=>context.apply());assert.deepEqual(context.data,before);assert.equal(rendered[0].end,3);
});
