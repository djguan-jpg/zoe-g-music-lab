// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const input=require('../web/planning-report-input.js'),planning=require('../web/planning-import.js'),preview=require('../web/replacement-preview.js');
const models={music:require('../web/music-readiness.js'),storyboard:require('../web/storyboard-readiness.js')},f=require('./planning_report_fixture.js');
const bytes=d=>new TextEncoder().encode(JSON.stringify(d)).buffer;
test('complete report and completed brief stay distinct, source raw values and opaque IDs are isolated',()=>{
 for(const operation of ['music','storyboard']){
  const source=f.panel(operation),report=models[operation].report(source),saved=structuredClone(report),selected=input.inspect(operation,report);
  assert.equal(selected.kind,'review');assert.deepEqual(selected.panel,source);assert.equal(selected.issueCount,report.issue_count);
  selected.panel.fields[Object.keys(source.fields)[0]]='external change';assert.deepEqual(report,saved);
  const brief={title:'ordinary brief'};assert.deepEqual(input.inspect(operation,brief),{kind:'brief',brief});
  const renamed=structuredClone(report);renamed.source.fields[Object.keys(source.fields)[0]]='changed title';
  assert.deepEqual(input.inspect(operation,renamed).panel,renamed.source); // A consistent standalone report is not proof of authorship.
  assert.throws(()=>input.inspect(operation,models[operation==='music'?'storyboard':'music'].report(f.panel(operation==='music'?'storyboard':'music'))));
 }
 assert.throws(()=>input.inspect('audio',{}));assert.throws(()=>input.inspect('music',{format:'future-report'}));
});
test('all complete report fields are checked and malformed source or invisible unknown properties refuse',()=>{
 for(const operation of ['music','storyboard']){
  const changes=[d=>d.schema_version=2,d=>d.schema_version=true,d=>d.issue_count=false,d=>d.issue_count++,d=>d.details_truncated=true,
   d=>d.review_notes.push('extra'),d=>d.issues[0].message='altered',d=>d.status='fields_checked',d=>d.extra=()=>1,
   d=>d.source.fields[operation==='music'?'music-bpm':'mv-duration']='120',d=>d.issues[0].extra=undefined];
  for(const change of changes){const report=models[operation].report(f.panel(operation));change(report);assert.throws(()=>input.inspect(operation,report));}
  const report=models[operation].report(f.panel(operation));assert.throws(()=>input.inspect(operation,{data:report,format:report.format}));
 }
});
test('native decoding enforces actual bytes, strict UTF8/JSON/Unicode and original one MiB input limit',()=>{
 const report=models.music.report(f.panel('music')),b=bytes(report);assert.deepEqual(input.decode('music',b,b.byteLength).panel,f.panel('music'));
 const bom=new Uint8Array([239,187,191,...new Uint8Array(b)]);assert.equal(input.decode('music',bom.buffer,bom.length).kind,'review');
 assert.throws(()=>input.decode('music',b,b.byteLength+1));
 for(const bad of [new Uint8Array([255]).buffer,new Uint8Array(input.maxBytes+1).buffer,...['{"x":1,"x":2}','{"x":Infinity}','{"x":"\\ud800"}'].map(s=>new TextEncoder().encode(s).buffer)])assert.throws(()=>input.decode('music',bad,bad.byteLength));
});
test('scoped raw panel proposal preserves other panels and refuses unsupported representation without dropping input',()=>{
 for(const operation of ['music','storyboard']){
  const current=f.draft(),before=structuredClone(current),source=f.panel(operation),out=planning.panelDraft(current,operation,source);
  assert.deepEqual(out.panels[operation],source);assert.deepEqual(current,before);
  for(const name of Object.keys(current.panels).filter(k=>k!==operation))assert.deepEqual(out.panels[name],current.panels[name]);
  out.panels[operation].fields[Object.keys(source.fields)[0]]='proposal changed';assert.notDeepEqual(out.panels[operation],source);
 }
 for(const mutate of [p=>p.fields['mv-ratio']='2.39:1',p=>p.shots[0].motif_id='motif-999',p=>p.shots[0].screen_direction='']){
  const source=f.panel('storyboard');mutate(source);const checked=input.inspect('storyboard',models.storyboard.report(source));
  assert.throws(()=>planning.panelDraft(f.draft(),'storyboard',checked.panel));assert.deepEqual(checked.panel,source);
 }
});
test('existing read controller previews only, target changes and cancellation reject late report while other panels stay independent',async()=>{
 for(const operation of ['music','storyboard']){
  let current=f.draft(),resolve,ready=[],errors=[];const guard=preview.createPreview({capture:()=>({draft:current,media:[{}]})});
  const c=planning.createBriefImport({preview:guard,validate:async(op,document)=>input.inspect(op,document),onReady:r=>ready.push(r),onError:e=>errors.push(e.message)});
  const report=models[operation].report(f.panel(operation)),b=bytes(report),file={name:'review.json',size:b.byteLength,arrayBuffer:()=>new Promise(r=>resolve=r)};
  const work=c.read(file,operation);current.panels.audio.fields['audio-profile']='distribution';resolve(b);assert.equal(await work,true);
  assert.equal(ready[0].result.kind,'review');assert.deepEqual(current.panels[operation],f.draft().panels[operation]);assert.equal(guard.proposal().result.kind,'review');
  current.panels[operation].fields[Object.keys(current.panels[operation].fields)[0]]='later edit';assert.throws(()=>guard.proposal());
  const stale=c.read(file,operation);c.cancel();resolve(b);assert.equal(await stale,false);assert.equal(ready.length,1);
  const late=c.read(file,operation);current.panels[operation].fields[Object.keys(current.panels[operation].fields)[0]]='newer edit';resolve(b);
  assert.equal(await late,false);assert.equal(ready.length,1);assert.match(errors[0],/已有修改/);
 }
});
test('shared complete reply checks reject extra function/undefined keys while valid music and storyboard wires remain exact',()=>{
 for(const operation of ['music','storyboard']){
  const panel=f.panel(operation),data=models[operation].report(panel),wire={data,files:{[operation+'-review.json']:JSON.stringify(data),[operation+'-review.md']:models[operation].markdown(data)},meta:{version:'0.67.0',protocol_version:1,needs_review:true}};
  assert.deepEqual(models[operation].checkedResult(panel,wire),wire);wire.data.extra=()=>1;assert.throws(()=>models[operation].checkedResult(panel,wire));
 }
});
