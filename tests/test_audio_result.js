// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const model=require('../web/audio-result.js'),audio=require('../web/audio-review.js'),accept=require('../web/audio-acceptance.js'),fixture=require('./audio_result_fixture.js');
function selection(document=null){return {file:{name:'first.wav',size:192044},profile:'distribution',document,sha256:'a'.repeat(64),acceptance:{rates:[44100,48000],bits:[16,24],channels:[1,2]}};}
function reply(document=null){return fixture.wire({file:'first.wav',profile:'distribution',sha256:'a'.repeat(64),sample_rate:48000,bit_depth:16,channels:2,frames:48000,duration_seconds:1,
 acceptance:{rates:[44100,48000],bits:[16,24],channels:[1,2]},checks:{sample_rate:true,bit_depth:true,channels:true},warnings:[],status:'technical_checks_passed',
 quiet_regions:{threshold_dbfs:-60,leading_seconds:0,trailing_seconds:0,quiet_frame_ratio:0},stereo_correlation:null,
 source_evidence:{bytes:192044,analysis_source:'copied_bytes',wave_format_tag:1,block_align:4,average_bytes_per_second:192000},
 per_channel:[1,2].map(channel=>({channel,peak_dbfs:-12,rms_dbfs:-20,dc_offset:0,full_scale_samples:0})),...(document?{acceptance_draft:document}:{})});}
const draft=()=>({format:accept.format,schema_version:1,profile:'distribution',custom:false,fields:{rates:'48000',bits:'16',channels:'2'}});
test('preset and raw-draft replies obey the same full envelope without input mutation',()=>{
 for(const doc of [null,draft()]){const wire=reply(doc),before=structuredClone(wire);assert.equal(model.checked(wire,selection(doc)),wire.data);assert.deepEqual(wire,before);}
 const r=reply();r.data.warnings=['實聽待確認'];r.data.status='needs_review';r.meta.needs_review=true;r.files['report.json']=JSON.stringify(r.data);r.files['report.md']=require('../web/audio-report.js').render(r.data);model.checked(r,selection());
});
test('unknown, stale or mismatched product/protocol/tool and false review metadata refuse',()=>{
 const changes=[r=>delete r.meta,r=>r.meta.protocol_version=2,r=>r.meta.protocol_version=true,r=>r.meta.extra=true,
  r=>r.meta.version='99.0.0',r=>r.meta.version='0.61.0',r=>r.data.version='99.0.0',r=>r.data.tool='Other analyzer',
  r=>r.meta.needs_review=true,r=>r.meta.needs_review=0,r=>delete r.data.limitations,r=>r.data.limitations[1]='RMS is LUFS',
  r=>r.extra=true,r=>r.data.extra=true,r=>r.data=[],r=>r.files=[]];
 for(const change of changes){const r=reply();change(r);assert.throws(()=>model.checked(r,selection()),/回覆版本、來源或交付檔案/);}
});
test('preset replies verify selected name/size/hash, effective limits and exact raw report JSON',()=>{
 for(const change of [r=>r.data.file='other.wav',r=>r.data.source_evidence.bytes++,r=>r.data.sha256='b'.repeat(64),r=>r.data.profile='video',
  r=>r.data.acceptance.rates=[48000],r=>r.files['report.json']='{}']){const r=reply();change(r);assert.throws(()=>model.checked(r,selection()));}
 const r=reply();r.files['report.json']=JSON.stringify(Object.fromEntries(Object.entries(r.data).reverse()),null,4);model.checked(r,selection());
});
test('files are exact, nonempty bounded scalar text and report JSON remains strict',()=>{
 for(const change of [r=>delete r.files['report.md'],r=>r.files['extra.txt']='unexpected',r=>r.files['report.md']='',
  r=>r.files['report.md']='\ud800',r=>r.files['report.md']='x'.repeat(model.maxTextBytes+1),r=>r.files['report.json']='\ufeff'+r.files['report.json'],
  r=>r.files['report.json']='{"tool":1,"tool":2}',r=>r.files['report.json']='{"value":NaN}']){const r=reply();change(r);assert.throws(()=>model.checked(r,selection()));}
});
test('raw draft echoes remain exact even when edited text has equal effective numbers',()=>{
 const doc=draft();for(const change of [r=>r.data.acceptance_draft.fields.rates='48_000',r=>r.files['audio-acceptance-draft.json']=JSON.stringify({...doc,fields:{...doc.fields,rates:'48_000'}}),
  r=>delete r.files['audio-acceptance-draft.json'],r=>r.files['audio-acceptance-draft.json']='x'.repeat(accept.maxBytes+1)]){
  const r=reply(doc);change(r);assert.throws(()=>model.checked(r,selection(doc)));}
 assert.throws(()=>model.checked(reply(doc),selection()));
});
test('display name uses a bounded Unicode basename and keeps literal valid text',()=>{
 assert.equal(model.displayName('folder\\first.wav'),'first.wav');assert.equal(model.displayName('../first.wav/'),'first.wav');
 assert.equal(model.displayName(''),'selected.wav');assert.equal(model.displayName('🎵'.repeat(201)), '🎵'.repeat(200));
 assert.equal(model.displayName('<original>.wav'),'<original>.wav');assert.throws(()=>model.displayName('\ud800'));
});
test('current wrong-source reply never replaces results and late reply/error stays cancelled',async()=>{
 for(const late of [false,true]){let current=true,resolve,writes=0;const selected=selection(),pendingReply=new Promise(r=>resolve=r);
  const pending=audio.inspect({selected:()=>({file:selected.file,profile:selected.profile}),isCurrent:()=>current,hashFile:fixture.hashFile,
   request:()=>pendingReply,onResult:()=>writes++});await Promise.resolve();current=!late;const wrong=reply();wrong.data.sha256='b'.repeat(64);wrong.files['report.json']=JSON.stringify(wrong.data);resolve(wrong);
  if(late)assert.equal(await pending,false);else await assert.rejects(pending,/回覆版本、來源/);assert.equal(writes,0);
 }
});
test('changes or failures while source hashing prevent upload and preserve current selection',async()=>{
 for(const fail of [false,true]){let selected=selection(),resolve,reject,requests=0,writes=0;const original=selected.file;
  const hashing=new Promise((r,j)=>{resolve=r;reject=j});const pending=audio.inspect({selected:()=>({file:selected.file,profile:selected.profile}),isCurrent:()=>true,
   hashFile:()=>hashing,request:()=>{requests++;return reply()},onResult:()=>writes++});selected={...selected,file:{...original}};
  if(fail)reject(Error('old hash failed'));else resolve('a'.repeat(64));assert.equal(await pending,false);assert.equal(requests,0);assert.equal(writes,0);assert.notEqual(selected.file,original);
 }
 const selected=selection();let requests=0;await assert.rejects(audio.inspect({selected:()=>({file:selected.file,profile:selected.profile}),isCurrent:()=>true,
  hashFile:async()=>{throw Error('current hash failed')},request:()=>requests++,onResult:()=>assert.fail()}),/current hash failed/);assert.equal(requests,0);
});
test('browser fixed dependencies precede review and use the same isolated reply checker',()=>{
 const index=fs.readFileSync('web/index.html','utf8');for(const script of ['audio-file','audio-result'])assert.ok(index.indexOf('/'+script+'.js')<index.indexOf('/audio-review.js'));
 const context={MusicJsonDocument:require('../musiclab/assets/json-document.js'),MusicAudioReport:require('../web/audio-report.js'),MusicAudioAcceptance:accept,MusicDeliveryVersions:require('../musiclab/assets/delivery-versions.js'),TextEncoder};
 vm.runInNewContext(fs.readFileSync('web/audio-result.js','utf8'),context);context.MusicAudioResult.checked(reply(),selection());
 const r=reply();r.meta.protocol_version=99;assert.throws(()=>context.MusicAudioResult.checked(r,selection()));
});
