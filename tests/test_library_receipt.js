// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const E=require('../web/editor-state.js'),R=require('../web/library-receipt.js');
const {createLibraryController}=require('../web/draft-library.js');
const {createCheckpoint}=require('../web/draft-retention.js'),F=require('./planning_report_fixture.js');
function payload(){const draft=F.draft();draft.panels.music.fields['music-title']=' 原案🎵\r\n';return {id:'draft-'+'1'.repeat(32),label:'合成保存 🎵',draft};}
function ack(p,reused=false){return {entry:{library_schema_version:1,id:p.id,label:p.label,stored_at:'2026-10-05T01:02:03.123456+00:00',sha256:'a'.repeat(64),bytes:1024,draft_schema_version:3,created_with:'0.69.0',titles:Object.fromEntries([['music','music-title'],['storyboard','mv-title'],['lyrics','lyrics-title']].map(([s,k])=>[s,Array.from(p.draft.panels[s].fields[k]).slice(0,120).join('')]))},reused,status:'draft_only_not_validated'};}
const readback=(p,a)=>({entry:structuredClone(a.entry),draft:structuredClone(p.draft),status:'draft_only_not_validated'});
const tick=()=>new Promise(resolve=>setImmediate(resolve));
function harness(){
 let current=F.draft(),sequence=0;const calls=[],saved=[],errors=[],states=[],checkpoint=createCheckpoint();checkpoint.initialize(current);
 current.panels.music.fields['music-title']='原案🎵';checkpoint.refresh(current);
 const request=(action,p)=>new Promise((resolve,reject)=>calls.push({action,payload:structuredClone(p),resolve,reject}));
 const c=createLibraryController({request,capture:()=>structuredClone(current),validate:E.validateDraft,newId:()=> 'draft-'+String(++sequence).padStart(32,'0'),
  confirmSave:R.createVerifier({read:id=>request('read',{id}),validate:E.validateDraft}),
  onSaved:r=>{saved.push(r);checkpoint.retain(r.draft,{kind:'library',label:r.entry.label});},onList:()=>{},onReady:()=>{},
  onError:(e,s)=>errors.push({message:e.message,...s}),onPending:s=>states.push(s)});
 return {c,calls,saved,errors,states,checkpoint,current,sequence:()=>sequence};
}
test('complete acknowledgement and readback preserve raw source and return isolated receipts',()=>{
 const p=payload(),a=ack(p),r=readback(p,a),before=structuredClone([p,a,r]);
 const result=R.checkedReadback(p,a,r,E.validateDraft);result.entry.titles.music='changed';
 assert.deepEqual([p,a,r],before);assert.equal(R.checkedAck(p,a,E.validateDraft).entry.titles.music,' 原案🎵\r\n');
});
test('acknowledgements require exact versions ID label metadata status and strict booleans',()=>{
 const p=payload(),mutations=[a=>a.extra=true,a=>a.reused=1,a=>a.status='complete',a=>a.entry.id='draft-'+'2'.repeat(32),a=>a.entry.label+=' ',a=>a.entry.library_schema_version=2,a=>a.entry.draft_schema_version=4,a=>a.entry.sha256='A'.repeat(64),a=>a.entry.bytes=0,a=>a.entry.bytes=1.5,a=>a.entry.bytes=1048577,a=>a.entry.titles.music='wrong',a=>a.entry.titles.extra='',a=>a.entry.stored_at='2026-10-05T00:00:00+08:00',a=>a.entry.created_with='\ud800'];
 for(const mutate of mutations){const a=ack(p);mutate(a);assert.throws(()=>R.checkedAck(p,a,E.validateDraft));}
});
test('title metadata truncates Unicode codepoints as the Python producer does without normalizing source',()=>{
 const p=payload();p.draft.panels.music.fields['music-title']='🎵'.repeat(119)+'甲'+'🎵尾\r\n';
 const a=ack(p);assert.equal(Array.from(a.entry.titles.music).length,120);assert.equal(a.entry.titles.music,'🎵'.repeat(119)+'甲');
 assert.doesNotThrow(()=>R.checkedReadback(p,a,readback(p,a),E.validateDraft));
 a.entry.titles.music=p.draft.panels.music.fields['music-title'].slice(0,120);assert.throws(()=>R.checkedAck(p,a,E.validateDraft));
});
test('whole readback rejects wrong draft metadata content row ordering and unknown properties',()=>{
 const p=payload();p.draft.panels.music.avoid=['先\r\n','後'];const a=ack(p);
 for(const mutate of [r=>r.draft.saved_at='other',r=>r.draft.tab='music',r=>r.draft.panels.music.fields['music-title']='原案🎵',r=>r.draft.panels.music.avoid.reverse(),r=>r.draft.extra=true,r=>r.entry.sha256='b'.repeat(64),r=>r.status='done',r=>r.extra=true]){
  const r=readback(p,a);mutate(r);assert.throws(()=>R.checkedReadback(p,a,r,E.validateDraft));
 }
});
test('injected verifier refuses malformed acknowledgement before read and isolates both async inputs',async()=>{
 const p=payload(),a=ack(p);let calls=0,resolve;const verifier=R.createVerifier({validate:E.validateDraft,read:id=>{calls++;assert.equal(id,p.id);return new Promise(r=>resolve=r);}});
 await assert.rejects(verifier(p,{...a,reused:0}));assert.equal(calls,0);
 const original=structuredClone(p),originalAck=structuredClone(a),work=verifier(p,a);p.draft.panels.music.fields['music-title']='new';a.entry.label='new';
 resolve(readback(original,originalAck));assert.deepEqual(await work,originalAck);assert.equal(calls,1);
});
test('save remains pending until readback and only then retains the exact click-time checkpoint',async()=>{
 const h=harness(),work=h.c.save('第一案'),p=h.calls[0].payload,a=ack(p);h.calls[0].resolve(a);await tick();
 assert.equal(h.saved.length,0);assert.equal(h.checkpoint.status().dirty,true);assert.deepEqual(h.calls[1].payload,{id:p.id});
 assert.deepEqual(h.states.at(-1),{pending:true,saving:true});assert.equal(h.c.abandon(),false);assert.equal(await h.c.retry(),false);
 h.calls[1].resolve(readback(p,a));assert.equal(await work,true);assert.equal(h.saved.length,1);assert.equal(h.checkpoint.refresh(h.current).dirty,false);assert.equal(h.c.pending(),null);
});
test('later edits during acknowledgement and readback stay dirty after successful original save',async()=>{
 const h=harness(),work=h.c.save('原案'),p=h.calls[0].payload,a=ack(p);h.current.panels.storyboard.fields['mv-title']='後續影片';h.calls[0].resolve(a);await tick();
 h.current.panels.music.fields['music-title']='回讀中另改';h.calls[1].resolve(readback(p,a));await work;
 assert.equal(h.saved[0].changed,true);assert.deepEqual(h.saved[0].draft,p.draft);assert.equal(h.checkpoint.refresh(h.current).dirty,true);
 assert.equal(h.current.panels.storyboard.fields['mv-title'],'後續影片');assert.equal(h.current.panels.music.fields['music-title'],'回讀中另改');
});
test('readback 404 after acknowledgement keeps the same ID and original snapshot for idempotent retry',async()=>{
 const h=harness(),work=h.c.save('原案'),p=structuredClone(h.calls[0].payload),a=ack(p);h.calls[0].resolve(a);await tick();
 const error=Error('readback unavailable');error.status=404;h.calls[1].reject(error);assert.equal(await work,false);
 assert.deepEqual(h.c.pending(),p);assert.equal(h.errors[0].retryable,true);assert.equal(h.saved.length,0);
 h.current.panels.music.fields['music-title']='後續';const retry=h.c.retry();assert.deepEqual(h.calls[2].payload,p);assert.equal(h.sequence(),1);
 const reused=ack(p,true);h.calls[2].resolve(reused);await tick();h.calls[3].resolve(readback(p,reused));assert.equal(await retry,true);
 assert.equal(h.saved[0].reused,true);assert.equal(h.saved[0].changed,true);assert.equal(h.checkpoint.refresh(h.current).dirty,true);
});
test('mismatched readback keeps uncertain pending state without retaining or automatically resending',async()=>{
 const h=harness(),work=h.c.save('原案'),p=h.calls[0].payload,a=ack(p);h.calls[0].resolve(a);await tick();
 const r=readback(p,a);r.draft.panels.lyrics.fields['lyrics-title']='wrong';h.calls[1].resolve(r);assert.equal(await work,false);
 assert.equal(h.saved.length,0);assert.equal(h.calls.length,2);assert.deepEqual(h.c.pending(),p);assert.equal(h.checkpoint.status().dirty,true);
 const copy=h.c.pending();copy.draft.panels.music.fields['music-title']='pollution';assert.deepEqual(h.c.pending(),p);
});
test('invalid acknowledgement never reads or confirms and explicit abandon does not delete saved files',async()=>{
 const h=harness(),work=h.c.save('原案');h.calls[0].resolve({entry:{id:'wrong'},reused:false});assert.equal(await work,false);
 assert.equal(h.calls.length,1);assert.equal(h.saved.length,0);assert.equal(h.errors[0].retryable,true);assert.equal(h.c.abandon(),true);assert.equal(h.c.pending(),null);assert.equal(h.calls.length,1);
});
test('only a definite original save refusal clears pending before any acknowledgement',async()=>{
 const h=harness(),work=h.c.save('原案'),error=Error('invalid input');error.status=400;h.calls[0].reject(error);assert.equal(await work,false);
 assert.equal(h.c.pending(),null);assert.equal(h.errors[0].retryable,false);assert.equal(h.calls.length,1);assert.equal(h.saved.length,0);
});
test('controller and verifier require explicit confirmation and read adapters at construction',()=>{
 assert.throws(()=>createLibraryController({}),/保存回讀核對未設定/);assert.throws(()=>R.createVerifier({validate:E.validateDraft}),/保存回讀核對未設定/);assert.throws(()=>R.createVerifier({read:()=>{}}),/保存回讀核對未設定/);
});
