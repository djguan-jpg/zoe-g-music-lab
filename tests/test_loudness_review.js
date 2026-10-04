// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const MusicAudio=require('../web/audio-review.js');
const fixture=require('./audio_result_fixture.js');
function report(){return {version:'0.22.0',file:'original.wav',profile:'distribution',sha256:'a'.repeat(64),
  sample_rate:48000,bit_depth:16,channels:1,frames:48000,duration_seconds:1,
  acceptance:{rates:[44100,48000],bits:[16,24],channels:[1,2]},checks:{sample_rate:true,bit_depth:true,channels:true},
  warnings:[],status:'technical_checks_passed',quiet_regions:{threshold_dbfs:-60,leading_seconds:0,trailing_seconds:0,quiet_frame_ratio:0},
  stereo_correlation:null,source_evidence:{bytes:96044,analysis_source:'copied_bytes',wave_format_tag:1,block_align:2,average_bytes_per_second:96000},
  per_channel:[{channel:1,peak_dbfs:-20,rms_dbfs:-23.01,dc_offset:0,full_scale_samples:0}],
  loudness:{format:'zoe-loudness-measurement',schema_version:1,algorithm:'ITU-R BS.1770-5 Annex 1 integrated loudness',unit:'LUFS',
    integrated_lufs:-23.003518,status:'measured',absolute_gate_lufs:-70,relative_gate_lu:-10,relative_gate_lufs:-33.003518,
    block_ms:400,hop_ms:100,complete_block_count:7,absolute_gate_block_count:7,gated_block_count:7,channel_weights:[1],window_frames:19200,tail_frames:0}};}

test('integrated loudness is validated, rounded for display, and kept separate from RMS without input mutation',()=>{
  const source=report(),before=structuredClone(source),review=MusicAudio.buildReview(source);
  assert.deepEqual(source,before);assert.equal(review.loudness.value,'-23.004 LUFS');
  assert.equal(review.channels[0].rms,'-23.01 dBFS');assert.equal(review.needsReview,false);
  assert.match(review.loudness.blocks,/完整 7/);assert.equal(review.loudness.relative,'-33.004 LUFS');
});
test('modern missing measurement and unknown schema, algorithm or units cannot become a successful result',()=>{
  const mutations=[r=>delete r.loudness,r=>r.loudness.schema_version=999,r=>r.loudness.schema_version=true,
    r=>r.loudness.format='other',r=>r.loudness.algorithm='RMS',r=>r.loudness.unit='dBFS',
    r=>r.loudness.absolute_gate_lufs=-60,r=>r.loudness.relative_gate_lu=-8,r=>r.loudness.block_ms=200,r=>r.loudness.hop_ms=200];
  for(const change of mutations){const r=report();change(r);assert.throws(()=>MusicAudio.buildReview(r));}
});
test('legacy PCM report remains readable with an explicit unavailable loudness label',()=>{
  const r=report();r.version='0.21.0';delete r.loudness;
  const review=MusicAudio.buildReview(r);assert.equal(review.loudness.status,'legacy_unavailable');
  assert.equal(review.loudness.value,'未提供');assert.match(review.loudness.note,/重新分析/);assert.equal(review.needsReview,false);
});
test('nonfinite measurements, impossible gates, counts and channel weights are refused',()=>{
  const mutations=[r=>r.loudness.integrated_lufs=Infinity,r=>r.loudness.integrated_lufs=NaN,r=>r.loudness.integrated_lufs=null,
    r=>r.loudness.relative_gate_lufs=null,r=>r.loudness.relative_gate_lufs=-81,r=>r.loudness.relative_gate_lufs=-32,
    r=>r.loudness.integrated_lufs=-71,r=>r.loudness.complete_block_count=8,r=>r.loudness.absolute_gate_block_count=8,
    r=>r.loudness.gated_block_count=0,r=>r.loudness.gated_block_count=8,r=>r.loudness.gated_block_count=true,
    r=>r.loudness.channel_weights=[2],r=>r.loudness.channel_weights=[],r=>r.loudness.window_frames=19201,
    r=>r.loudness.tail_frames=-1,r=>r.loudness.tail_frames=1,r=>r.frames=47000,r=>r.duration_seconds=2];
  for(const change of mutations){const r=report();change(r);assert.throws(()=>MusicAudio.buildReview(r));}
});
test('below absolute gate is null and cannot be mistaken for a -70 LUFS or zero reading',()=>{
  const r=report();Object.assign(r.loudness,{status:'below_gate',integrated_lufs:null,relative_gate_lufs:null,absolute_gate_block_count:0,gated_block_count:0});
  const review=MusicAudio.buildReview(r);assert.equal(review.loudness.value,'不可測');assert.equal(review.needsReview,false);
  assert.match(review.loudness.note,/−70/);
  for(const value of [0,-70]){r.loudness.integrated_lufs=value;assert.throws(()=>MusicAudio.buildReview(r));}
});
test('short clip preserves technical acceptance and explains missing complete block',()=>{
  const r=report();r.frames=9600;r.duration_seconds=.2;r.source_evidence.bytes=19244;
  Object.assign(r.loudness,{status:'insufficient_duration',integrated_lufs:null,relative_gate_lufs:null,
    complete_block_count:0,absolute_gate_block_count:0,gated_block_count:0,tail_frames:9600});
  const review=MusicAudio.buildReview(r);assert.equal(review.loudness.value,'不可測');assert.match(review.loudness.note,/400 ms/);
  assert.equal(review.status,'本次技術條件通過');r.loudness.status='below_gate';assert.throws(()=>MusicAudio.buildReview(r));
});
test('unsupported channels and sample rates are explicit while every original PCM channel remains visible',()=>{
  for(const [rate,channels,status] of [[48000,3,'unsupported_channels'],[7999,1,'unsupported_sample_rate']]){
    const r=report();r.sample_rate=rate;r.channels=channels;r.frames=rate;r.source_evidence.bytes=44+rate*channels*2;
    r.source_evidence.block_align=channels*2;r.source_evidence.average_bytes_per_second=rate*channels*2;
    r.acceptance.rates=[rate];r.acceptance.channels=[channels];r.per_channel=Array.from({length:channels},(_,i)=>({...r.per_channel[0],channel:i+1}));
    Object.assign(r.loudness,{status,integrated_lufs:null,relative_gate_lufs:null,complete_block_count:0,
      absolute_gate_block_count:0,gated_block_count:0,channel_weights:[],window_frames:null,tail_frames:rate});
    const review=MusicAudio.buildReview(r);assert.equal(review.loudness.value,'不可測');assert.equal(review.channels.length,channels);
    r.loudness.status='measured';assert.throws(()=>MusicAudio.buildReview(r));
  }
});
test('odd rate nearest-sample window, schedule and trailing samples are validated independently',()=>{
  const r=report();r.sample_rate=11025;r.frames=13337;r.duration_seconds=1.209705;r.source_evidence.bytes=26718;
  r.source_evidence.average_bytes_per_second=22050;r.acceptance.rates=[11025];
  Object.assign(r.loudness,{complete_block_count:9,absolute_gate_block_count:9,gated_block_count:9,window_frames:4410,tail_frames:107});
  const review=MusicAudio.buildReview(r);assert.equal(review.loudness.tailFrames,107);
  r.loudness.tail_frames=108;assert.throws(()=>MusicAudio.buildReview(r));
});
test('inconsistent missing source and unsafe frame count refuse before rendering',()=>{
  for(const change of [r=>delete r.source_evidence,r=>r.frames=Number.MAX_SAFE_INTEGER,r=>r.frames=true,r=>r.frames=48000.5]){
    const r=report();change(r);assert.throws(()=>MusicAudio.buildReview(r));
  }
});
test('invalid late measurement never replaces output, current measurement error remains actionable',async()=>{
  let current=true,resolve,outputs=0;const file={name:'original.wav',size:96044};
  const args={hashFile:fixture.hashFile,selected:()=>({file,profile:'distribution'}),isCurrent:()=>current,
    request:()=>new Promise(r=>{resolve=r;}),onResult:()=>outputs++};
  const stale=MusicAudio.inspect(args);await Promise.resolve();current=false;const bad=report();bad.loudness.schema_version=999;resolve(fixture.wire(bad));
  assert.equal(await stale,false);assert.equal(outputs,0);
  current=true;const active=MusicAudio.inspect(args);await Promise.resolve();resolve(fixture.wire(bad));await assert.rejects(active,/響度報告/);assert.equal(outputs,0);
});
