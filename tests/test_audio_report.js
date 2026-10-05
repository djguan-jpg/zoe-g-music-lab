// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const markdown=require('../web/audio-report.js'),result=require('../web/audio-result.js'),audio=require('../web/audio-review.js'),fixture=require('./audio_result_fixture.js');
function reply(){return fixture.wire({file:'original.wav',profile:'distribution',sha256:'a'.repeat(64),sample_rate:48000,bit_depth:16,channels:1,frames:48000,duration_seconds:1,
 acceptance:{rates:[44100,48000],bits:[16,24],channels:[1,2]},checks:{sample_rate:true,bit_depth:true,channels:true},warnings:[],status:'technical_checks_passed',
 quiet_regions:{threshold_dbfs:-60,leading_seconds:0,trailing_seconds:0,quiet_frame_ratio:0},stereo_correlation:null,
 source_evidence:{bytes:96044,analysis_source:'copied_bytes',wave_format_tag:1,block_align:2,average_bytes_per_second:96000},
 per_channel:[{channel:1,peak_dbfs:-12,rms_dbfs:-20,dc_offset:-0,full_scale_samples:0}]});}
const selection=()=>({file:{name:'original.wav',size:96044},profile:'distribution',document:null,acceptance:reply().data.acceptance,sha256:'a'.repeat(64)});
test('canonical integer decimal display fixes precision, negative zero and half ties',()=>{
 for(const [value,places,expected] of [[1.25,1,'1.3'],[-1.25,1,'-1.3'],[-0,8,'0.00000000'],[-4e-9,8,'0.00000000'],[-5e-9,8,'-0.00000001'],[1,6,'1.000000'],[-12,3,'-12.000']])assert.equal(markdown.decimal(value,places),expected);
 for(const [v,p] of [[NaN,3],[Infinity,3],[true,3],['1',3],[1e300,8],[1,-1],[1,9],[1,true]])assert.throws(()=>markdown.decimal(v,p));
 assert.ok(Object.isFrozen(markdown));
});
test('renderer preserves literal Unicode and input, labels null without implying measurement',()=>{
 const wire=reply();wire.data.warnings=[' 原文\r\n🎵\t<提醒> '];const before=structuredClone(wire.data),text=markdown.render(wire.data);
 assert.deepEqual(wire.data,before);assert.ok(text.includes('-  原文\r\n🎵\t<提醒> \n'));assert.ok(text.includes('立體聲相關性：不可測'));assert.ok(text.includes('-12.000'));assert.ok(!text.includes('None'));
 for(const change of [r=>r.file='\ud800',r=>r.duration_seconds=NaN,r=>r.loudness.status='unknown',r=>r.checks.channels=1,r=>r.source_evidence.bytes=true]){const r=structuredClone(before);change(r);assert.throws(()=>markdown.render(r));}
});
test('all Markdown text must match checked declared data before results may publish',()=>{
 for(const change of [s=>'# unrelated\n',s=>s.replace('48000 Hz','44100 Hz'),s=>s.replace('a'.repeat(64),'b'.repeat(64)),s=>s+'extra\n',s=>s.replace('RMS 不是 LUFS','RMS 就是 LUFS'),s=>s.replace('-12.000','-6.000')]){
  const wire=reply();wire.files['report.md']=change(wire.files['report.md']);assert.throws(()=>result.checked(wire,selection()),/沒有替換目前結果/);}
});
test('current bad Markdown and late bad Markdown preserve old results; valid retry publishes',async()=>{
 for(const late of [false,true]){let current=true,resolve,writes=0;const s=selection();const pending=audio.inspect({selected:()=>s,isCurrent:()=>current,hashFile:fixture.hashFile,request:()=>new Promise(r=>resolve=r),onResult:()=>writes++});
  await Promise.resolve();current=!late;const wire=reply();wire.files['report.md']='# different\n';resolve(wire);
  if(late)assert.equal(await pending,false);else await assert.rejects(pending,/沒有替換目前結果/);assert.equal(writes,0);
  current=true;assert.equal(await audio.inspect({selected:()=>s,isCurrent:()=>current,hashFile:fixture.hashFile,request:async()=>reply(),onResult:()=>writes++}),true);assert.equal(writes,1);}
});
test('fixed browser formatter precedes checker and matches Node output without DOM or I/O',()=>{
 const index=fs.readFileSync('web/index.html','utf8');assert.ok(index.indexOf('/audio-report.js')<index.indexOf('/audio-result.js'));
 const context={MusicJsonDocument:require('../musiclab/assets/json-document.js'),TextEncoder};vm.runInNewContext(fs.readFileSync('web/audio-report.js','utf8'),context);
 assert.equal(context.MusicAudioReport.render(reply().data),markdown.render(reply().data));
 assert.throws(()=>context.MusicAudioReport.decimal(Infinity,3));
});
