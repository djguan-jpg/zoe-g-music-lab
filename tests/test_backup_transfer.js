// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
const {test}=require('node:test');const assert=require('node:assert/strict');
const {createBackupController}=require('../web/backup-transfer.js');
const result=require('../web/backup-result.js'),versions=require('../musiclab/assets/delivery-versions.js');
const sha='a'.repeat(64);
const id='draft-'+'1'.repeat(32);
const plan=()=>({backup_schema_version:1,backup_sha256:sha,bytes:20,entry_count:1,selection:'all',new_count:1,reused_count:0,conflicts:[],capacity_ok:true,can_restore:true,new_ids:[id],entries:[{id,label:'合成',stored_at:'2026-10-05T00:00:00Z'}],status:'backup_validated_not_restored'});
const restored=(added=1)=>({backup_sha256:sha,added_count:added,reused_count:1-added,entry_count:1,status:'restored_drafts_need_creative_validation'});
const wire=data=>({files:{},data,meta:{version:versions.current,protocol_version:1,needs_review:true}});
const file=name=>({name,size:20});
const later=()=>{let resolve,reject;const promise=new Promise((a,b)=>{resolve=a;reject=b;});return{promise,resolve,reject};};
function setup(request,overrides={}){
  const seen={preview:[],restored:[],errors:[],states:[]};
  const controller=createBackupController({request:async(...args)=>wire(await request(...args)),hashFile:async f=>({bytes:f.size,sha256:sha}),checkPlan:result.checkedInspect,checkRestore:result.checkedRestore,onPreview:(...v)=>seen.preview.push(v),onRestored:v=>seen.restored.push(v),
    onError:(...v)=>seen.errors.push(v),onState:v=>seen.states.push(v),...overrides});return{controller,seen};
}
test('latest backup selection ignores late older preview and errors',async()=>{
  const old=later(),fresh=later(),started=later();const {controller,seen}=setup((op,f)=>{if(f.name==='old.zip'){started.resolve();return old.promise;}return fresh.promise;});
  const a=controller.inspect(file('old.zip'));await started.promise;const b=controller.inspect(file('fresh.zip'));
  fresh.resolve(plan());assert.equal(await b,true);old.reject(Error('late failure'));assert.equal(await a,false);
  assert.equal(seen.preview.length,1);assert.equal(seen.preview[0][1],'fresh.zip');assert.equal(seen.errors.length,0);
});
test('cancelled preview cannot become ready or cause a restore',async()=>{
  const deferred=later();const {controller,seen}=setup(()=>deferred.promise);
  const work=controller.inspect(file('selected.zip'));assert.equal(controller.cancel(),true);deferred.resolve(plan());
  assert.equal(await work,false);assert.equal(await controller.restore(),false);assert.equal(seen.preview.length,0);
});
test('restore uses the original selected File and reviewed hash after callback mutation',async()=>{
  const calls=[],selected=file('source.zip');const {controller,seen}=setup(async(...args)=>{calls.push(args);return args[0]==='inspect'?plan():restored();});
  await controller.inspect(selected);seen.preview[0][0].backup_sha256='b'.repeat(64);
  assert.equal(await controller.restore(),true);assert.equal(calls[1][1],selected);assert.equal(calls[1][2],sha);assert.equal(seen.restored.length,1);
});
test('uncertain restore failure retains same archive/hash for safe retry',async()=>{
  const calls=[];let attempts=0;const {controller,seen}=setup(async(...args)=>{
    calls.push(args);if(args[0]==='inspect')return plan();if(attempts++===0)throw Object.assign(Error('reply lost'),{status:500});return restored(0);});
  const selected=file('source.zip');await controller.inspect(selected);assert.equal(await controller.restore(),false);
  assert.equal(seen.errors[0][1].retryable,true);assert.equal(await controller.restore(),true);
  assert.equal(calls[1][1],calls[2][1]);assert.equal(calls[1][2],calls[2][2]);assert.equal(seen.restored[0].reused_count,1);
});
test('known conflict failure clears stale preview and requires new inspection',async()=>{
  const {controller,seen}=setup(async op=>{if(op==='inspect')return plan();throw Object.assign(Error('library changed'),{status:400});});
  await controller.inspect(file('source.zip'));assert.equal(await controller.restore(),false);assert.equal(await controller.restore(),false);
  assert.equal(seen.errors[0][1].retryable,false);assert.equal(seen.states.at(-1).ready,false);
});
test('preview with conflicts never submits restore',async()=>{
  const calls=[];const {controller}=setup(async op=>{calls.push(op);return{...plan(),conflicts:[id],new_ids:[],new_count:0,can_restore:false};});
  await controller.inspect(file('conflict.zip'));assert.equal(await controller.restore(),false);assert.deepEqual(calls,['inspect']);
});
test('invalid file size/name or unsupported preview version stays unready',async()=>{
  let calls=0;const {controller,seen}=setup(async()=>{calls++;return{...plan(),backup_schema_version:2};});
  for(const f of [file('not-json.txt'),{name:'a.zip',size:0},{name:'large.zip',size:32*1024*1024+1}])assert.equal(await controller.inspect(f),false);
  assert.equal(calls,0);assert.equal(await controller.inspect(file('real.zip')),false);assert.equal(await controller.restore(),false);assert.equal(seen.preview.length,0);
});
test('running restore blocks replacement, cancellation and duplicate submission',async()=>{
  const deferred=later();const {controller,seen}=setup(async op=>op==='inspect'?plan():deferred.promise);
  await controller.inspect(file('source.zip'));const work=controller.restore();assert.equal(controller.cancel(),false);
  assert.equal(await controller.inspect(file('another.zip')),false);assert.equal(await controller.restore(),false);
  deferred.resolve(restored());assert.equal(await work,true);assert.equal(seen.restored.length,1);assert.equal(seen.states.at(-1).restoring,false);
});
