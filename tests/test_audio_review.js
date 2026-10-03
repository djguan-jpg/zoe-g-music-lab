// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const MusicAudio=require('../web/audio-review.js');
function report(){return {file:'first.wav',profile:'distribution',sha256:'a'.repeat(64),sample_rate:48000,bit_depth:16,
  channels:2,duration_seconds:1,acceptance:{rates:[44100,48000],bits:[16,24],channels:[1,2]},
  checks:{sample_rate:true,bit_depth:true,channels:true},warnings:[],status:'technical_checks_passed',
  quiet_regions:{threshold_dbfs:-60,leading_seconds:.1,trailing_seconds:.2,quiet_frame_ratio:.3},stereo_correlation:null,
  source_evidence:{bytes:192044,analysis_source:'copied_bytes',wave_format_tag:1,block_align:4,average_bytes_per_second:192000,declared_riff_bytes:192044},
  per_channel:[1,2].map(channel=>({channel,peak_dbfs:-12,rms_dbfs:-20,dc_offset:.001,full_scale_samples:0}))};}
function setup(){
  let selection={file:{name:'first.wav',size:192044},profile:'distribution'},valid=true;
  let resolve,reject,calls=0;const results=[],pending=new Promise((r,j)=>{resolve=r;reject=j;});
  const options={selected:()=>selection,isCurrent:()=>valid,request:()=>{calls++;return pending;},onResult:(result,review)=>results.push({result,review})};
  return {options,resolve:()=>resolve({data:report(),files:{'report.json':'checked'}}),resolveWith:r=>resolve(r),reject,
    select:value=>selection=value,invalidate:()=>valid=false,selection:()=>selection,results,calls:()=>calls};
}
test('review includes explicit source, acceptance, both quiet edges and every channel without mutating report',()=>{
  const source=report(),before=structuredClone(source),review=MusicAudio.buildReview(source);
  assert.deepEqual(source,before);assert.equal(review.file,'first.wav');assert.equal(review.bytes,192044);
  assert.equal(review.trailing,.2);assert.equal(review.leading,.1);assert.equal(review.channels[0].dc,'0.001');
  assert.equal(review.correlation,'不可測');assert.equal(review.specifications[0].accepted,'44100 / 48000 Hz');
  assert.equal(review.needsReview,false);assert.equal(review.status,'本次技術條件通過');
});
test('warning result and digital silence retain their meaning instead of becoming numeric zero',()=>{
  const source=report();source.warnings=['待實聽'];source.status='needs_review';source.per_channel[0].peak_dbfs=null;source.per_channel[0].rms_dbfs=null;
  const review=MusicAudio.buildReview(source);assert.equal(review.needsReview,true);assert.equal(review.channels[0].peak,'−∞（數位靜音）');
  assert.equal(review.channels[0].rms,'−∞（數位靜音）');review.warnings.push('later');assert.deepEqual(source.warnings,['待實聽']);
});
test('malformed source, inconsistent specifications, nonfinite values and missing channels cannot become success',()=>{
  const mutations=[r=>delete r.source_evidence,r=>r.source_evidence.block_align=1,r=>r.checks.sample_rate=false,
    r=>r.quiet_regions.trailing_seconds=NaN,r=>r.stereo_correlation=2,r=>r.per_channel.pop(),
    r=>r.per_channel[0].dc_offset=Infinity,r=>r.per_channel[0].full_scale_samples=true,
    r=>r.acceptance.rates=[48000.5],r=>r.status='needs_review',r=>r.sha256=['a'.repeat(64)]];
  for(const mutate of mutations){const value=report();mutate(value);assert.throws(()=>MusicAudio.buildReview(value));}
});
test('current inspection applies a fully verified result once',async()=>{
  const a=setup(),before=a.selection(),work=MusicAudio.inspect(a.options);a.resolve();assert.equal(await work,true);
  assert.equal(a.results.length,1);assert.equal(a.results[0].review.sha256,'a'.repeat(64));assert.equal(a.selection(),before);
});
test('same-name replacement file cancels a late result even if revision callback did not change',async()=>{
  const a=setup(),work=MusicAudio.inspect(a.options);a.select({file:{name:'first.wav',size:192044},profile:'distribution'});
  a.resolve();assert.equal(await work,false);assert.equal(a.results.length,0);
});
test('later acceptance or revision change prevents every result write',async()=>{
  for(const change of [a=>a.select({...a.selection(),profile:'video'}),a=>a.invalidate()]){
    const a=setup(),work=MusicAudio.inspect(a.options);change(a);a.resolve();assert.equal(await work,false);assert.equal(a.results.length,0);
  }
});
test('late errors are ignored but current errors remain actionable',async()=>{
  const a=setup(),work=MusicAudio.inspect(a.options);a.invalidate();a.reject(Error('old error'));
  assert.equal(await work,false);assert.equal(a.results.length,0);
  const b=setup(),current=MusicAudio.inspect(b.options);b.reject(Error('current error'));
  await assert.rejects(current,/current error/);assert.equal(b.results.length,0);
});
test('missing file, zero, unknown size and over limit fail before an upload',async()=>{
  for(const file of [null,{size:0},{size:NaN},{size:64*1024*1024+1}]){
    const a=setup();a.select({file,profile:'distribution'});await assert.rejects(MusicAudio.inspect(a.options));assert.equal(a.calls(),0);
  }
});
test('mismatched upload byte count and profile or incomplete report never replace existing output',async()=>{
  for(const change of [r=>r.source_evidence.bytes++,r=>r.profile='video',r=>delete r.quiet_regions]){
    const a=setup(),work=MusicAudio.inspect(a.options),r=report();change(r);a.resolveWith({data:r,files:{'report.json':'bad'}});
    await assert.rejects(work);assert.equal(a.results.length,0);
  }
});
function adapter(){
  const source=fs.readFileSync(path.join(__dirname,'../web/app.js'),'utf8'),start=source.indexOf("$('audio-build').onclick="),end=source.indexOf('const draftTask=',start),
    runStart=source.indexOf('async function run('),runEnd=source.indexOf('function setFiles(',runStart);
  assert.ok(start>=0&&end>start&&runStart>=0&&runEnd>runStart);
  const state={tab:'audio',revisions:{audio:0},busy:false},nodes={'audio-build':{disabled:false},'audio-file':{files:[{name:'first.wav',size:192044}]},'audio-profile':{value:'distribution'}};
  let resolve,reject,rendered=0,files=0;const notices=[];
  const context={state,$:id=>nodes[id],MusicAudio,URLSearchParams,timingControls:()=>{},say:m=>notices.push(m),markDirty:()=>{},
    api:()=>new Promise((r,j)=>{resolve=r;reject=j;}),renderAudioReview:()=>rendered++,setFiles:()=>files++};
  vm.runInNewContext(source.slice(runStart,runEnd),context);vm.runInNewContext(source.slice(start,end),context);
  return {state,nodes,notices,start:()=>nodes['audio-build'].onclick(),resolve:()=>resolve({data:report(),files:{'report.json':'checked'}}),reject:error=>reject(error),
    counts:()=>({rendered,files}),replace:()=>{nodes['audio-file'].files=[{name:'other.wav',size:1000}];state.revisions.audio++;}};
}
test('real run and audio event adapter discard a replaced selection and restore controls',async()=>{
  const a=adapter(),work=a.start();assert.equal(a.state.busy,true);a.replace();a.resolve();await work;
  assert.deepEqual(a.counts(),{rendered:0,files:0});assert.equal(a.state.busy,false);assert.equal(a.nodes['audio-build'].disabled,false);
  assert.match(a.notices.at(-1),/處理期間輸入有修改/);
});
test('real audio event applies a current result and does not show a stale error for replacement',async()=>{
  const a=adapter(),work=a.start();a.resolve();await work;assert.deepEqual(a.counts(),{rendered:1,files:1});
  const b=adapter(),old=b.start();b.replace();b.reject(Error('old failure'));await old;
  assert.deepEqual(b.counts(),{rendered:0,files:0});assert.ok(!b.notices.includes('old failure'));assert.equal(b.state.busy,false);
});
