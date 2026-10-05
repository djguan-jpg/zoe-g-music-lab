// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const B=require('../web/backup-result.js'),F=require('../web/backup-file.js'),C=require('../web/backup-transfer.js'),V=require('../musiclab/assets/delivery-versions.js');
const sha='a'.repeat(64),id=n=>'draft-'+String(n).repeat(32),proof=()=>({bytes:3,sha256:sha});
const plan=()=>({backup_sha256:sha,backup_schema_version:1,bytes:3,entry_count:2,selection:'all',new_count:1,reused_count:1,conflicts:[],capacity_ok:true,can_restore:true,new_ids:[id(1)],entries:[1,2].map(n=>({id:id(n),label:'原文\r\n🎵 '+n,stored_at:'2026-10-05T00:00:00+00:00'})),status:'backup_validated_not_restored'});
const restored=(added=1)=>({backup_sha256:sha,added_count:added,reused_count:2-added,entry_count:2,status:'restored_drafts_need_creative_validation'});
const wire=data=>({files:{},data,meta:{version:V.current,protocol_version:1,needs_review:true}});
const deferred=()=>{let resolve,reject;const promise=new Promise((a,b)=>{resolve=a;reject=b;});return {promise,resolve,reject};};
function setup(request,other={}){
 const seen={preview:[],restored:[],error:[],state:[]},controller=C.createBackupController({request,hashFile:async()=>proof(),checkPlan:B.checkedInspect,checkRestore:B.checkedRestore,onPreview:(...v)=>seen.preview.push(v),onRestored:r=>seen.restored.push(r),onError:(...v)=>seen.error.push(v),onState:s=>seen.state.push(s),...other});return {controller,seen};
}
test('native ZIP hash matches actual File bytes and known SHA without parsing archive contents',async()=>{
 const file=new File(['abc'],'same.zip'),p=await F.inspect(file);assert.deepEqual(p,{bytes:3,sha256:'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad'});
 const different=await F.inspect(new File(['abd'],'same.zip'));assert.notEqual(p.sha256,different.sha256);assert.equal(file.size,3);
});
test('native ZIP hash bounds file, reader, digest and unavailable WebCrypto',async()=>{
 for(const file of [null,new File(['x'],'wrong.txt'),new File([],'empty.zip'),{name:'a.zip',size:F.maxBytes+1,arrayBuffer:async()=>new ArrayBuffer(1)}])await assert.rejects(F.inspect(file));
 const file=new File(['abc'],'a.ZIP');await assert.rejects(F.inspect(file,{read:async()=>new ArrayBuffer(2)}));await assert.rejects(F.inspect(file,{read:async()=>new Uint8Array(3)}));await assert.rejects(F.inspect(file,{digest:async()=>new ArrayBuffer(31)}));
 const source=fs.readFileSync('web/backup-file.js','utf8'),context={ArrayBuffer,Uint8Array,Number,Error,Object,globalThis:{}};vm.runInNewContext(source,context);await assert.rejects(context.globalThis.MusicBackupFile.inspect(file));
 const boundary=new File([new Uint8Array(F.maxBytes)],'boundary.zip');const p=await F.inspect(boundary);assert.equal(p.bytes,F.maxBytes);assert.match(p.sha256,/^[a-f0-9]{64}$/);
});
test('full preview isolates exact metadata and accepts empty, reused and conflict plans',()=>{
 const w=wire(plan()),before=structuredClone(w),got=B.checkedInspect(w,proof());got.entries[0].label='mutated';got.new_ids.length=0;assert.deepEqual(w,before);
 for(const p of [plan(),{...plan(),new_count:0,new_ids:[],reused_count:2},{...plan(),new_count:0,new_ids:[],reused_count:1,conflicts:[id(1)],can_restore:false},{...plan(),capacity_ok:false,can_restore:false},{...plan(),entry_count:0,new_count:0,new_ids:[],reused_count:0,entries:[]}])assert.deepEqual(B.checkedInspect(wire(p),proof()),p);
});
test('complete wire rejects unknown product/protocol, extra files, non-review and shape changes',()=>{
 const changes=[w=>w.meta.version='99.0.0',w=>w.meta.protocol_version=2,w=>w.meta.needs_review=false,w=>w.meta.needs_review=1,w=>w.meta.extra=true,w=>w.files['unexpected.txt']='x',w=>w.extra={},w=>delete w.meta,w=>w.data.extra=true];
 for(const mutate of changes){const w=wire(plan());mutate(w);assert.throws(()=>B.checkedInspect(w,proof()));}
 for(const p of [{bytes:3,sha256:'b'.repeat(64)},{bytes:4,sha256:sha},{bytes:3,sha256:sha,extra:1},{bytes:0,sha256:sha}])assert.throws(()=>B.checkedInspect(wire(plan()),p));
});
test('preview rejects wrong ZIP source and contradictory counts, ID sets, labels, dates or versions',()=>{
 const mutations=[p=>p.backup_sha256='b'.repeat(64),p=>p.bytes=4,p=>p.backup_schema_version=2,p=>p.entry_count=3,p=>p.entry_count=true,p=>p.new_count=-1,p=>p.new_count=0,p=>p.reused_count=0,p=>p.new_ids=[id(9)],p=>p.new_ids=[id(1),id(1)],p=>p.entries[1].id=id(1),p=>p.conflicts=[id(1)],p=>p.can_restore=false,p=>p.capacity_ok=false,p=>p.selection='arbitrary',p=>p.status='restored',p=>p.entries[0].label=' ',p=>p.entries[0].label='🎵'.repeat(201),p=>p.entries[0].label='\ud800',p=>p.entries[0].stored_at='2026-10-05T00:00:00+08:00',p=>p.entries[0].extra='x'];
 for(const mutate of mutations){const p=plan();mutate(p);assert.throws(()=>B.checkedInspect(wire(p),proof()));}
 const conflict={...plan(),new_count:0,new_ids:[],reused_count:0,conflicts:[id(1),id(1)],can_restore:false};assert.throws(()=>B.checkedInspect(wire(conflict),proof()));
});
test('restore confirms reviewed hash and total while allowing changed added/reused distribution on retry',()=>{
 for(const added of [0,1,2]){const w=wire(restored(added)),before=structuredClone(w);assert.deepEqual(B.checkedRestore(w,proof(),plan()),w.data);assert.deepEqual(w,before);}
 const mutations=[r=>r.backup_sha256='b'.repeat(64),r=>r.entry_count=3,r=>r.added_count=3,r=>r.reused_count=-1,r=>r.reused_count=0,r=>r.status='anything',r=>r.extra='x'];
 for(const mutate of mutations){const r=restored();mutate(r);assert.throws(()=>B.checkedRestore(wire(r),proof(),plan()));}
 assert.throws(()=>B.checkedRestore(wire(restored()),proof(),{...plan(),can_restore:false}));
});
test('controller refuses malformed preview before restore without touching selected File',async()=>{
 const file=new File(['abc'],'source.zip'),calls=[],{controller,seen}=setup(async op=>{calls.push(op);return wire({...plan(),entry_count:999});});
 assert.equal(await controller.inspect(file),false);assert.equal(await controller.restore(),false);assert.deepEqual(calls,['inspect']);assert.equal(seen.preview.length,0);assert.equal(seen.state.at(-1).ready,false);assert.equal(file.size,3);
});
test('selection or cancellation during hash does not upload stale ZIP or publish late failures',async()=>{
 const old=deferred(),fresh=deferred(),calls=[],{controller,seen}=setup(async(op,f)=>{calls.push(f.name);return wire(plan());},{hashFile:f=>f.name==='old.zip'?old.promise:fresh.promise});
 const a=controller.inspect(new File(['abc'],'old.zip')),b=controller.inspect(new File(['abc'],'fresh.zip'));fresh.resolve(proof());assert.equal(await b,true);old.reject(Error('late hash'));assert.equal(await a,false);assert.deepEqual(calls,['fresh.zip']);assert.equal(seen.error.length,0);
 const late=deferred(),next=setup(async()=>{throw Error('must not upload');},{hashFile:()=>late.promise});const work=next.controller.inspect(new File(['abc'],'cancel.zip'));next.controller.cancel();late.resolve(proof());assert.equal(await work,false);assert.equal(next.seen.preview.length,0);assert.equal(next.seen.error.length,0);
});
test('cancel after upload rejects stale success while selected raw file stays unchanged',async()=>{
 const reply=deferred(),uploaded=deferred(),file=new File(['abc'],'source.zip'),{controller,seen}=setup(async()=>{uploaded.resolve();return reply.promise;});const work=controller.inspect(file);await uploaded.promise;controller.cancel();reply.resolve(wire(plan()));assert.equal(await work,false);assert.equal(seen.preview.length,0);assert.equal(await file.text(),'abc');
});
test('unverified restore response keeps the exact ZIP and reviewed hash for explicit idempotent retry',async()=>{
 const file=new File(['abc'],'source.zip'),calls=[];let attempts=0;const {controller,seen}=setup(async(...args)=>{calls.push(args);if(args[0]==='inspect')return wire(plan());return attempts++===0?wire({...restored(),backup_sha256:'b'.repeat(64)}):wire(restored(0));});
 assert.equal(await controller.inspect(file),true);seen.preview[0][0].backup_sha256='f'.repeat(64);assert.equal(await controller.restore(),false);assert.equal(seen.restored.length,0);assert.equal(seen.error.at(-1)[1].retryable,true);assert.equal(seen.state.at(-1).ready,true);assert.equal(await controller.restore(),true);assert.equal(calls.length,3);assert.equal(calls[1][1],file);assert.equal(calls[1][1],calls[2][1]);assert.equal(calls[1][2],sha);assert.equal(calls[2][2],sha);assert.equal(seen.restored[0].added_count,0);assert.equal(seen.restored[0].reused_count,2);
});
test('required file/plan/restore verification cannot be omitted',()=>{
 const supplied={request:()=>{},hashFile:()=>{},checkPlan:()=>{},checkRestore:()=>{}};for(const key of ['hashFile','checkPlan','checkRestore']){const missing={...supplied};delete missing[key];assert.throws(()=>C.createBackupController(missing));}
});
test('actual app backup transport returns the complete wire and preserves native File/hash request',async()=>{
 const app=fs.readFileSync('web/app.js','utf8'),start=app.indexOf('async function backupRequest('),end=app.indexOf('\nconst backupController=',start),file=new File(['abc'],'source.zip'),calls=[],w=wire(plan());
 const context={fetch:async(...args)=>{calls.push(args);return {ok:true,json:async()=>w};},encodeURIComponent,Error};vm.runInNewContext(app.slice(start,end),context);
 assert.equal(await context.backupRequest('inspect',file),w);assert.equal(calls[0][0],'/api/drafts/backup/inspect');assert.equal(calls[0][1].body,file);assert.equal(await context.backupRequest('restore',file,sha),w);assert.equal(calls[1][0],'/api/drafts/backup/restore?sha256='+sha);assert.equal(calls[1][1].body,file);
 context.fetch=async()=>({ok:false,status:400,json:async()=>({error:'conflict'})});await assert.rejects(context.backupRequest('restore',file,sha),e=>e.status===400);
 assert.match(app,/hashFile:MusicBackupFile\.inspect,checkPlan:MusicBackupResult\.checkedInspect,checkRestore:MusicBackupResult\.checkedRestore/);
});
