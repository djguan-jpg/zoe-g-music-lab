// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),crypto=require('node:crypto');
const importer=require('../web/delivery-import.js'),pack=require('../web/delivery-package.js');
const hash=async bytes=>crypto.createHash('sha256').update(bytes).digest('hex'),file={name:'selected.zip',size:1000};
const deferred=()=>{let resolve,reject;const promise=new Promise((a,b)=>{resolve=a;reject=b});return {promise,resolve,reject}};
async function wire(){const s={scope:'music',label:'合成来源',files:{'new.txt':'新原文\r\n🎵'}},manifest=await pack.manifest(s,hash);return {wire:{files:s.files,data:{format:'zoe-delivery-inspection',schema_version:1,archive_bytes:1000,archive_sha256:'a'.repeat(64),manifest},meta:{version:pack.version,protocol_version:1,needs_review:true}},selected:{bytes:1000,sha256:'a'.repeat(64),manifest}};}
function setup(read){const state={scope:'music',revision:1,resultRevision:1,bundle:{files:{'old.txt':'原成果\r\n🎵'},note:'合成原成果'},media:[{}],busy:false},errors=[],views=[],writes=[];let c;
 c=importer.createController({capture:()=>state,read,hash,onView:v=>views.push(v),onError:e=>{errors.push(e);c.refreshView()},replace:r=>{writes.push('replace');state.bundle={files:r.files};state.resultRevision++},restore:b=>{writes.push('restore');state.bundle=b;state.resultRevision++}});return {c,state,errors,views,writes};}
test('failed import retains isolated local reason through callback refresh and input changes without modifying originals',async()=>{
 const error=Error('交付清單版本不支援；沒有遷移'),s=setup(async()=>{throw error}),before=structuredClone(s.state.bundle),media=s.state.media[0];
 assert.equal(await s.c.inspect(file),false);assert.equal(s.errors[0],error);assert.equal(s.c.view().failure.message,error.message);assert.equal(s.c.view().failure.code,'delivery_import_failed');assert.equal(s.c.view().failure.truncated,false);
 const v=s.c.view();v.failure.message='changed';assert.equal(s.c.status().failure.message,error.message);s.state.revision++;s.c.refreshView();assert.equal(s.c.view().failure.message,error.message);
 assert.deepEqual(s.state.bundle,before);assert.equal(s.state.media[0],media);assert.equal(s.writes.length,0);assert.equal(s.c.view().canApply,false);assert.equal(s.c.view().pending,false);
});
test('invalid and busy selections produce local feedback without reads and clear only that feedback',async()=>{
 let reads=0;const s=setup(async()=>{reads++;return wire()});const before=structuredClone(s.state.bundle);
 for(const f of [null,{name:'bad.txt',size:1},{name:'empty.zip',size:0},{name:'huge.zip',size:pack.maxArchive+1}]){assert.equal(await s.c.inspect(f),false);assert.match(s.c.view().failure.message,/有效/);s.c.cancel();assert.equal(s.c.view().failure,null);}
 s.state.busy=true;assert.equal(await s.c.inspect(file),false);assert.match(s.c.view().failure.message,/尚未完成/);s.state.busy=false;s.c.cancel();assert.equal(s.c.view().failure,null);assert.equal(reads,0);assert.deepEqual(s.state.bundle,before);
});
test('new read clears prior failure immediately and retry still requires verified preview before apply',async()=>{
 const result=await wire(),hold=deferred();let count=0;const s=setup(()=>count++===0?Promise.reject(Error('first failure')):hold.promise);
 await s.c.inspect(file);assert.ok(s.c.view().failure);const retry=s.c.inspect(file);assert.equal(s.c.view().failure,null);assert.equal(s.c.view().reading,true);assert.equal(s.c.apply(),false);assert.equal(s.writes.length,0);
 hold.resolve(result);assert.equal(await retry,true);assert.equal(s.c.view().failure,null);assert.equal(s.c.view().canApply,true);assert.equal(s.c.apply(),true);assert.equal(s.c.undo(),true);
});
test('failure dismissal preserves a previous scoped undo, later user input and native media identity',async()=>{
 const result=await wire();let bad=false;const s=setup(async()=>{if(bad)throw Error('new read failed');return result});const before=structuredClone(s.state.bundle);
 await s.c.inspect(file);s.c.apply();bad=true;s.state.revision++;s.state.raw='未完成 0.000';const media={};s.state.media=[media];await s.c.inspect(file);assert.ok(s.c.view().failure);assert.equal(s.c.view().canUndo,true);
 s.c.cancel();assert.equal(s.c.view().failure,null);assert.equal(s.c.view().canUndo,true);assert.equal(s.c.undo(),true);assert.deepEqual(s.state.bundle,before);assert.equal(s.state.raw,'未完成 0.000');assert.equal(s.state.media[0],media);assert.deepEqual(s.writes,['replace','restore']);
});
test('late failure after latest success or cancellation cannot revive a message, and scope refresh clears old feedback',async()=>{
 const a=deferred(),b=deferred(),result=await wire(),s=setup(f=>f.name==='old.zip'?a.promise:b.promise);
 const old=s.c.inspect({...file,name:'old.zip'}),current=s.c.inspect(file);b.resolve(result);assert.equal(await current,true);a.reject(Error('late failed'));assert.equal(await old,false);assert.equal(s.c.view().failure,null);assert.equal(s.errors.length,0);
 const late=deferred(),t=setup(()=>late.promise),pending=t.c.inspect(file);t.c.cancel();late.reject(Error('cancelled late error'));assert.equal(await pending,false);assert.equal(t.c.view().failure,null);assert.equal(t.errors.length,0);
 const u=setup(async()=>{throw Error('music-only failure')});await u.c.inspect(file);u.state.scope='lyrics';u.c.refreshView();assert.equal(u.c.view().failure,null);u.state.scope='music';assert.equal(u.c.view().failure,null);
});
function dom(read){const ids=[...fs.readFileSync('web/index.html','utf8').matchAll(/id="(delivery-[^"]+)"/g)].map(x=>x[1]),nodes={},events={writes:0};
 for(const id of ids){nodes[id]={value:'',replaceChildren(){this.children=[];this.value=''},append(v){(this.children||=[]).push(v)}};Object.defineProperty(nodes[id],'innerHTML',{set(){assert.fail('literal status must never write HTML')}});}
 let note='';Object.defineProperty(nodes['delivery-import-note'],'textContent',{get:()=>note,set:v=>{events.writes++;note=v}});
 const state={scope:'music',revision:1,resultRevision:1,bundle:{files:{'old.txt':'原成果'}},media:[{}],busy:false},errors=[],ctx={MusicDeliveryImport:importer,MusicDeliveryText:require('../web/delivery-text.js'),MusicDeliveryContext:require('../web/delivery-context.js'),MusicDeliverySearch:require('../web/delivery-search.js')};
 for(const name of ['delivery-text-dom.js','delivery-search-dom.js','delivery-import-dom.js'])vm.runInNewContext(fs.readFileSync('web/'+name,'utf8'),ctx);let c;
 c=ctx.MusicDeliveryImportDom.createAdapter({getElementById:id=>nodes[id],createElement:()=>({})},{capture:()=>state,read,hash,onError:e=>{errors.push(e);c.refresh()},replace:()=>assert.fail('not implicitly applying'),restore:()=>assert.fail('not implicitly restoring')});return {c,state,nodes,events,errors};
}
test('actual DOM local error is literal, persists without repeated live writes, and clear action resets only the message',async()=>{
 const error=Error('<script>literal</script> ZIP版本不支援'),s=dom(async()=>{throw error}),before=structuredClone(s.state.bundle);await s.c.inspect(file);
 assert.match(s.nodes['delivery-import-note'].textContent,/<script>literal<\/script>/);assert.match(s.nodes['delivery-import-note'].textContent,/目前成果與表單保留/);assert.equal(s.nodes['delivery-import-note'].className,'hint error');assert.equal(s.nodes['delivery-import-cancel'].disabled,false);assert.equal(s.nodes['delivery-import-cancel'].textContent,'清除核對訊息');assert.equal(s.nodes['delivery-import-apply'].disabled,true);
 const writes=s.events.writes;for(let i=0;i<30;i++)s.c.refresh();assert.equal(s.events.writes,writes);s.nodes['delivery-import-cancel'].onclick();assert.equal(s.c.view().failure,null);assert.equal(s.nodes['delivery-import-cancel'].disabled,true);assert.equal(s.nodes['delivery-import-cancel'].textContent,'取消成果匯入');assert.equal(s.nodes['delivery-import-note'].className,'hint');assert.deepEqual(s.state.bundle,before);
});
test('long Unicode failure is bounded without splitting emoji or copying full results into view',async()=>{
 const long='🎵'.repeat(300000),s=setup(async()=>{throw Error(long)});s.state.bundle.files['large.txt']='x'.repeat(8*1024*1024-20);await s.c.inspect(file);
 const v=s.c.view();assert.equal(v.failure.message,'🎵'.repeat(240)+'…');assert.equal(v.failure.truncated,true);assert.equal(Array.from(v.failure.message).length,241);assert.ok(JSON.stringify(v).length<1000);assert.equal(Object.hasOwn(v,'files'),false);assert.equal(Object.hasOwn(v,'proposal'),false);assert.equal(s.state.bundle.files['large.txt'].length,8*1024*1024-20);
});
