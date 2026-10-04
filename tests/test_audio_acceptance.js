// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const model=require('../web/audio-acceptance.js'),audio=require('../web/audio-review.js');
const draft=(fields={})=>({format:model.format,schema_version:1,profile:'video',custom:true,fields:{rates:'48000',bits:'16',channels:'2',...fields}});
const encoded=d=>new TextEncoder().encode(JSON.stringify(d)).buffer;
function controller(){
  let document=draft(),media={},allowed=true,resolve,reject;
  const events=new Map(),states=[],errors=[];let writes=0,changes=0;
  const pending=new Promise((r,j)=>{resolve=r;reject=j;});
  const c=model.createController({capture:()=>document,media:()=>media,allowed:()=>allowed,read:()=>pending,
    replace:d=>{document=d;writes++;},events:{addEventListener:(k,f)=>events.set(k,f),removeEventListener:k=>events.delete(k)},
    onState:s=>states.push(s),onError:e=>errors.push(e.message),onChange:()=>changes++});
  return {c,events,states,errors,get:()=>document,set:d=>document=d,media:()=>media,replaceMedia:()=>media={},busy:()=>allowed=false,
    resolve:d=>resolve(encoded(d)),reject,file:d=>({size:encoded(d).byteLength}),counts:()=>({writes,changes})};
}
test('raw unfinished values roundtrip with isolation and reject only when active analysis is prepared',()=>{
  const d=draft({rates:' 1e\n',bits:'',channels:'０，\r\n'}),checked=model.validate(d);
  assert.deepEqual(checked,d);checked.fields.bits='edited';assert.equal(d.fields.bits,'');assert.throws(()=>model.prepare(d));
  d.custom=false;assert.deepEqual(model.prepare(d).acceptance.rates,[48000]);
});
test('fullwidth decimal inputs and duplicates preserve order without rewriting raw source',()=>{
  const d=draft({rates:'４８０００， 44_100',bits:'16.0, 24',channels:'2, 2, 1'}),before=structuredClone(d);
  assert.deepEqual(model.prepare(d).acceptance,{rates:[48000,44100],bits:[16,24],channels:[2,2,1]});assert.deepEqual(d,before);
});
test('unknown schema, extra path, malformed Unicode and field limits cannot be loaded',()=>{
  for(const change of [d=>d.schema_version=2,d=>d.schema_version=true,d=>d.path='secret',d=>d.custom=1,d=>d.profile='unknown',d=>d.fields.extra='1',d=>d.fields.rates='\ud800',d=>d.fields.bits='x'.repeat(1025)]){
    const d=draft();change(d);assert.throws(()=>model.validate(d));
  }
});
test('active invalid numeric strings refuse instead of guessing empty or units',()=>{
  for(const raw of ['', '0','-1','1.5','NaN','Infinity','48 kHz','1,','1e999','9007199254740992','1.00000000000000000001','9007199254740991.1',Array(65).fill('1').join(',')])assert.throws(()=>model.prepare(draft({rates:raw})));
});
test('strict file decoder verifies actual bytes, UTF8, duplicate keys, BOM and size',()=>{
  const b=encoded(draft());assert.deepEqual(model.decode(b,b.byteLength),draft());assert.throws(()=>model.decode(b,b.byteLength+1));
  const bom=new Uint8Array([239,187,191,...new Uint8Array(b)]);assert.deepEqual(model.decode(bom.buffer,bom.length),draft());
  for(const b of [new Uint8Array([255]).buffer,new TextEncoder().encode('{"x":1,"x":2}').buffer,new Uint8Array(65537).buffer])assert.throws(()=>model.decode(b,b.byteLength));
});
test('preview does not replace current raw conditions until explicit apply; unfinished source stays unchanged',async()=>{
  const a=controller(),d=draft({rates:'未填',bits:''}),before=structuredClone(a.get()),work=a.c.inspect(a.file(d));a.resolve(d);
  assert.equal(await work,true);assert.deepEqual(a.get(),before);assert.equal(a.counts().writes,0);assert.deepEqual(a.c.status().preview,d);
  assert.equal(a.c.apply(),true);assert.deepEqual(a.get(),d);assert.equal(a.c.status().dirty,false);assert.equal(a.c.status().preview,null);
});
test('cancel preserves condition and original file selection',async()=>{
  const a=controller(),d=draft({rates:'44100'}),source=a.media(),work=a.c.inspect(a.file(d));a.resolve(d);await work;a.c.cancel();
  assert.equal(a.c.apply(),false);assert.equal(a.counts().writes,0);assert.equal(a.media(),source);assert.equal(a.get().fields.rates,'48000');
});
test('raw edits, native media identity, newer file and busy state reject late preview',async()=>{
  for(const change of [a=>a.set(draft({rates:'48_000'})),a=>a.replaceMedia(),a=>a.c.cancel(),a=>a.busy()]){
    const a=controller(),d=draft({rates:'44100'}),work=a.c.inspect(a.file(d));change(a);a.resolve(d);
    assert.equal(await work,false);assert.equal(a.counts().writes,0);assert.equal(a.c.status().preview,null);
  }
});
test('apply rechecks target after preview even when no change notification ran',async()=>{
  const a=controller(),d=draft({rates:'44100'}),work=a.c.inspect(a.file(d));a.resolve(d);await work;a.replaceMedia();
  assert.equal(a.c.apply(),false);assert.equal(a.counts().writes,0);assert.equal(a.errors.length,1);
});
test('current file error is actionable; stale error cannot replace edit or state',async()=>{
  const a=controller(),work=a.c.inspect(a.file(draft()));a.reject(Error('current'));assert.equal(await work,false);assert.deepEqual(a.errors,['current']);
  const b=controller(),old=b.c.inspect(b.file(draft()));b.c.cancel();b.reject(Error('late'));assert.equal(await old,false);assert.deepEqual(b.errors,[]);
});
test('download snapshot needs explicit confirmation and later edits remain unsaved',()=>{
  const a=controller();a.set(draft({rates:'未填'}));a.c.changed();assert.equal(a.c.status().dirty,true);assert.ok(a.events.has('beforeunload'));
  assert.deepEqual(JSON.parse(a.c.download()),a.get());assert.equal(a.c.status().mode,'download_unconfirmed');
  a.set(draft({rates:'44100'}));a.c.changed();assert.equal(a.c.status().mode,'changed_after_download');a.c.confirm();assert.equal(a.c.status().dirty,true);
  a.set(draft({rates:'未填'}));a.c.changed();assert.equal(a.c.status().dirty,false);assert.equal(a.events.has('beforeunload'),false);
});
test('beforeunload rechecks actual values and disposal removes only its owned listener',()=>{
  const a=controller();a.set(draft({bits:''}));a.c.changed();let prevented=0;const event={preventDefault:()=>prevented++};
  a.events.get('beforeunload')(event);assert.equal(prevented,1);assert.equal(event.returnValue,'');
  a.set(draft());a.events.get('beforeunload')(event);assert.equal(prevented,1);a.c.dispose();assert.equal(a.events.size,0);
});
test('whole project load deactivates custom mode while retaining unfinished raw inputs',()=>{
  const a=controller();a.set(draft({bits:'16\n unfinished'}));a.c.projectLoaded();
  assert.equal(a.get().custom,false);assert.equal(a.get().fields.bits,'16\n unfinished');assert.equal(a.c.status().dirty,true);
});
function report(d){return {file:'first.wav',profile:d.profile,acceptance_draft:structuredClone(d),sha256:'a'.repeat(64),sample_rate:48000,bit_depth:16,
  channels:2,duration_seconds:1,acceptance:model.prepare(d).acceptance,checks:{sample_rate:true,bit_depth:true,channels:true},warnings:[],status:'technical_checks_passed',
  quiet_regions:{threshold_dbfs:-60,leading_seconds:0,trailing_seconds:0,quiet_frame_ratio:0},stereo_correlation:null,
  source_evidence:{bytes:192044,analysis_source:'copied_bytes',wave_format_tag:1,block_align:4,average_bytes_per_second:192000},
  per_channel:[1,2].map(channel=>({channel,peak_dbfs:-12,rms_dbfs:-20,dc_offset:0,full_scale_samples:0}))};}
const reply=d=>{const data=report(d);return {data,files:{'report.json':JSON.stringify(data),'audio-acceptance-draft.json':JSON.stringify(d)}};};
function inspection(){let selection={file:{name:'first.wav',size:192044},profile:'video',acceptanceDraft:draft()},resolve,reject,calls=0;const results=[];
  const pending=new Promise((r,j)=>{resolve=r;reject=j;});return {selection:()=>selection,set:d=>selection.acceptanceDraft=d,resolve,reject,results,calls:()=>calls,
    options:{selected:()=>selection,isCurrent:()=>true,request:()=>{calls++;return pending;},onResult:(r,v)=>results.push(v)}};}
test('exact report conditions, embedded raw source and exported JSON are bound to current selection',async()=>{
  const a=inspection(),work=audio.inspect(a.options);a.resolve(reply(draft()));assert.equal(await work,true);assert.equal(a.results[0].custom,true);
});
test('same-profile wrong numeric conditions, altered raw source, report JSON or file name reject',async()=>{
  for(const change of [r=>r.data.acceptance.rates=[44100,48000],r=>r.data.acceptance_draft.fields.rates='48_000',r=>r.files['audio-acceptance-draft.json']=JSON.stringify(draft({rates:'44100'})),
    r=>r.files['report.json']='{}',r=>r.data.file='wrong.wav']){
    const a=inspection(),work=audio.inspect(a.options),r=reply(draft());change(r);a.resolve(r);await assert.rejects(work);assert.equal(a.results.length,0);
  }
});
test('unfinished values prevent upload and semantically equal raw edits still invalidate late success/error',async()=>{
  const a=inspection();a.set(draft({bits:''}));await assert.rejects(audio.inspect(a.options));assert.equal(a.calls(),0);
  for(const failure of [false,true]){const a=inspection(),work=audio.inspect(a.options);a.set(draft({rates:'48_000'}));
    if(failure)a.reject(Error('late'));else a.resolve(reply(draft()));assert.equal(await work,false);assert.equal(a.results.length,0);}
});
test('preset inspection also rejects returned limits different from preset despite a valid report',async()=>{
  const d={...draft(),custom:false},file={name:'first.wav',size:192044},r=reply(d);r.data.acceptance.rates=[44100,48000];
  await assert.rejects(audio.inspect({selected:()=>({file,profile:'video'}),isCurrent:()=>true,request:async()=>r,onResult:()=>assert.fail('should refuse')}));
});
