// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const statistics=require('../web/audio-statistics.js'),audio=require('../web/audio-review.js');
const fixture=require('./audio_result_fixture.js');
function report(){return {file:'original.wav',profile:'distribution',sha256:'a'.repeat(64),sample_rate:48000,bit_depth:16,channels:1,frames:48000,duration_seconds:1,
 acceptance:{rates:[44100,48000],bits:[16,24],channels:[1,2]},checks:{sample_rate:true,bit_depth:true,channels:true},warnings:[],status:'technical_checks_passed',
 quiet_regions:{threshold_dbfs:-60,leading_seconds:.1,trailing_seconds:.2,quiet_frame_ratio:.3},stereo_correlation:null,
 source_evidence:{bytes:96044,analysis_source:'copied_bytes',wave_format_tag:1,block_align:2,average_bytes_per_second:96000},
 per_channel:[{channel:1,peak_dbfs:-12,rms_dbfs:-20,dc_offset:0,full_scale_samples:0}]};}
test('pure PCM checks accept rounded metrics without changing input or equating RMS and LUFS',()=>{
 const value=report(),before=structuredClone(value);assert.equal(statistics.validate(value),undefined);assert.deepEqual(value,before);
 assert.equal(audio.buildReview(value).channels[0].rms,'-20 dBFS');assert.ok(Object.isFrozen(statistics));
});
test('positive peaks, louder RMS, excessive full-scale counts and impossible DC refuse',()=>{
 for(const change of [r=>r.per_channel[0].peak_dbfs=.001,r=>r.per_channel[0].rms_dbfs=-11.999,
  r=>r.per_channel[0].full_scale_samples=r.frames+1,r=>r.per_channel[0].dc_offset=1.00000001,
  r=>r.per_channel[0].dc_offset=-1.00000001]){const r=report();change(r);assert.throws(()=>audio.buildReview(r),/數值互相矛盾/);}
});
test('digital silence requires both null readings, zero DC and no full-scale samples',()=>{
 const r=report();r.per_channel[0].peak_dbfs=null;r.per_channel[0].rms_dbfs=null;statistics.validate(r);
 for(const change of [r=>r.per_channel[0].rms_dbfs=-200,r=>r.per_channel[0].dc_offset=.00000001,
  r=>r.per_channel[0].full_scale_samples=1]){const bad=structuredClone(r);change(bad);assert.throws(()=>statistics.validate(bad));}
 const bad=report();bad.per_channel[0].rms_dbfs=null;assert.throws(()=>statistics.validate(bad));
});
test('integer PCM boundaries and one-frame entirely quiet files are accepted',()=>{
 for(const rate of [8000,11025,192000]){const r=report();r.sample_rate=rate;r.frames=1;r.duration_seconds=Number((1/rate).toFixed(6));
  r.source_evidence.average_bytes_per_second=rate*2;r.quiet_regions={threshold_dbfs:-60,leading_seconds:r.duration_seconds,trailing_seconds:r.duration_seconds,quiet_frame_ratio:1};
  r.per_channel[0]={channel:1,peak_dbfs:null,rms_dbfs:null,dc_offset:0,full_scale_samples:0};statistics.validate(r);}
 const r=report();Object.assign(r.per_channel[0],{peak_dbfs:0,rms_dbfs:0,dc_offset:-1,full_scale_samples:r.frames});statistics.validate(r);
});
test('quiet edges cannot pass the declared end or overlap except for an entirely quiet file',()=>{
 for(const change of [r=>r.quiet_regions.leading_seconds=1.000001,r=>r.quiet_regions.trailing_seconds=1.000001,
  r=>Object.assign(r.quiet_regions,{leading_seconds:.6,trailing_seconds:.6}),
  r=>Object.assign(r.quiet_regions,{leading_seconds:1,trailing_seconds:1,quiet_frame_ratio:.9})]){
  const r=report();change(r);assert.throws(()=>audio.buildReview(r),/數值互相矛盾/);}
 const r=report();r.quiet_regions.leading_seconds=.499999;r.quiet_regions.trailing_seconds=.500002;statistics.validate(r);
 r.quiet_regions.trailing_seconds=.500003;assert.throws(()=>statistics.validate(r));
});
test('frames, byte bounds, finite metrics and mono correlation remain checked for legacy reports',()=>{
 for(const change of [r=>delete r.frames,r=>r.frames=true,r=>r.frames=48000.5,r=>r.duration_seconds=2,
  r=>r.source_evidence.bytes=100,r=>r.stereo_correlation=.5,r=>r.per_channel[0].peak_dbfs=NaN]){
  const r=report();r.version='0.21.0';change(r);assert.throws(()=>audio.buildReview(r));}
});
test('browser dependency is fixed before review and native module uses the same pure checks',()=>{
 const index=fs.readFileSync('web/index.html','utf8');assert.ok(index.indexOf('/audio-statistics.js')<index.indexOf('/audio-review.js'));
 const context={};vm.runInNewContext(fs.readFileSync('web/audio-statistics.js','utf8'),context);
 context.MusicAudioStatistics.validate(report());const r=report();r.per_channel[0].full_scale_samples=r.frames+1;
 assert.throws(()=>context.MusicAudioStatistics.validate(r),/數值互相矛盾/);
});
test('current contradictory responses preserve original result while late contradictory responses stay cancelled',async()=>{
 for(const late of [false,true]){let current=true,resolve,writes=0;const file={name:'original.wav',size:96044};
  const args={hashFile:fixture.hashFile,selected:()=>({file,profile:'distribution'}),isCurrent:()=>current,request:()=>new Promise(r=>resolve=r),onResult:()=>writes++};
  const pending=audio.inspect(args);await Promise.resolve();const bad=report();bad.per_channel[0].full_scale_samples=48001;current=!late;resolve(fixture.wire(bad));
  if(late)assert.equal(await pending,false);else await assert.rejects(pending,/數值互相矛盾/);assert.equal(writes,0);
 }
});
