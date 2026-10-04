// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const source=require('../web/delivery-source.js'),importer=require('../web/delivery-import.js'),pack=require('../web/delivery-package.js'),review=require('../web/delivery-review.js');
const hash=async bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
const content='\ufeff原文🎵\r\n\x00<script>literal</script>'+'a'.repeat(100000)+'尾端🎵';
async function setup(onState){
 const files={'full.txt':content,'empty.txt':''},manifest=await pack.manifest({scope:'music',label:'original',files},hash),wire={files,data:{format:'zoe-delivery-inspection',schema_version:1,archive_bytes:2000,archive_sha256:'a'.repeat(64),manifest},meta:{version:pack.version,protocol_version:1,needs_review:true}};
 const state={scope:'music',revision:1,resultRevision:1,bundle:{files:{...files},note:'original',dirty:false,inputIndependent:true,deliveryLabel:'original'},media:[{}],busy:false},views=[];
 const controller=importer.createController({capture:()=>state,read:async()=>({wire,selected:{bytes:2000,sha256:'a'.repeat(64),manifest}}),hash,onView:v=>views.push(v),onState,replace:proposal=>{state.bundle={files:proposal.files,note:'imported',dirty:false};state.resultRevision++;},restore:bundle=>{state.bundle=bundle;state.resultRevision++;}});
 assert.equal(await controller.inspect({name:'fixture.zip',size:2000}),true);
 return {state,controller,views,wire};
}
test('plain snapshot isolates mutable containers, original strings and native media identity remain',()=>{
 const media={},state={scope:'music',revision:1,resultRevision:2,bundle:{files:{'__proto__':'x','full.txt':content},nested:[{name:'exact'}],note:'literal'},media:[media],busy:false},before=source.snapshot(state);
 assert.notEqual(before.bundle,state.bundle);assert.notEqual(before.bundle.files,state.bundle.files);assert.equal(before.bundle.files['full.txt'],content);assert.equal(before.media[0],media);
 state.bundle.nested[0].name='later';assert.equal(before.bundle.nested[0].name,'exact');assert.equal(source.current(state,before),false);
 const reserved=source.copy(JSON.parse('{"__proto__":{"literal":"kept"}}'));assert.ok(Object.hasOwn(reserved,'__proto__'));assert.equal(Object.getPrototypeOf(reserved),Object.prototype);
});
test('equal preserves key order, exact original strings, arrays and empty versus missing values',()=>{
 for(const [a,b] of [[{a:'\r\n'},{a:'\n'}],[{a:'\ufeffx'},{a:'x'}],[{a:''},{}],[{a:1,b:2},{b:2,a:1}],[['x'],{0:'x'}],[new Array(2),[]]])assert.equal(source.equal(a,b),false);
 assert.equal(source.equal({files:{'a.txt':content},nested:[null,1,true]},source.copy({files:{'a.txt':content},nested:[null,1,true]})),true);
});
test('lightweight view contains isolated metadata without full source strings; full status remains opt-in',async()=>{
 const {controller,views,wire}=await setup(),v=controller.view();assert.deepEqual(Object.keys(v),['reading','pending','canApply','canUndo','source','comparison']);assert.equal(v.canApply,true);assert.equal(Object.hasOwn(v,'proposal'),false);assert.equal(Object.hasOwn(v,'files'),false);assert.ok(JSON.stringify(v).length<5000);
 v.source.manifest.files[0].sha256='changed';v.comparison.counts.added=99;views.at(-1).source.manifest.label='changed';assert.deepEqual(controller.view().source,wire.data);
 const full=controller.status();assert.deepEqual(full.proposal,wire);full.proposal.files['full.txt']='changed';assert.equal(controller.originalFile('full.txt').content,content);
});
test('legacy onState and refresh retain full isolated proposal behavior',async()=>{
 const states=[],{controller}=await setup(s=>states.push(s));assert.equal(states.at(-1).proposal.files['full.txt'],content);states.at(-1).proposal.files['full.txt']='changed';assert.equal(controller.refresh().proposal.files['full.txt'],content);
});
for(const [name,change] of Object.entries({file:s=>s.bundle.files['full.txt']='later',added:s=>s.bundle.files['new.txt']='later',removed:s=>delete s.bundle.files['empty.txt'],note:s=>s.bundle.note='later',dirty:s=>s.bundle.dirty=true,label:s=>s.bundle.deliveryLabel='later',media:s=>s.media[0]={},revision:s=>s.revision++,result:s=>s.resultRevision++,scope:s=>s.scope='lyrics',busy:s=>s.busy=true}))test('lightweight current refuses '+name+' changes without relying on revision alone',async()=>{
 const {controller,state}=await setup();controller.textWindow('full.txt','incoming');const original=state.bundle;change(state);assert.equal(controller.refreshView().canApply,false);assert.equal(controller.textWindow('full.txt','incoming'),null);assert.equal(controller.originalFile('full.txt'),null);assert.equal(controller.report(),null);assert.equal(controller.apply(),false);assert.equal(state.bundle,original);
});
test('preview caches one bounded pair and invalidates on another file, cancel and new ZIP',async()=>{
 const {controller}=await setup(),native=review.lineEndings;let scans=0;review.lineEndings=text=>{scans++;return native(text)};
 try{const a=controller.filePreview('full.txt');assert.equal(scans,2);a.incoming.text='mutated';assert.equal(controller.filePreview('full.txt').incoming.text,content.slice(0,32768));assert.equal(scans,2);assert.equal(controller.filePreview('empty.txt').incoming.present,true);assert.equal(scans,4);controller.filePreview('full.txt');assert.equal(scans,6);controller.cancel();assert.equal(controller.filePreview('full.txt'),null);await controller.inspect({name:'again.zip',size:2000});controller.filePreview('full.txt');assert.equal(scans,8);}finally{review.lineEndings=native;}
});
test('8MiB read and lightweight refresh never clone or serialize full source; undo preserves original',async()=>{
 const {controller,state}=await setup();controller.cancel();const long='x'.repeat(8*1024*1024-8)+'尾端';state.bundle.files={'large.txt':long};const old=source.snapshot(state),nativeClone=global.structuredClone,nativeStringify=JSON.stringify;
 // Incoming remains small; baseline is the maximum-size source. Detect the
 // eliminated whole-source operations directly, without a timing threshold.
 await controller.inspect({name:'again.zip',size:2000});controller.textWindow('large.txt','before');
 global.structuredClone=value=>{assert.ok(!value?.files?.['large.txt']);return nativeClone(value)};JSON.stringify=()=>assert.fail('read/refresh serialized source');
 try{for(let i=0;i<30;i++){assert.equal(controller.textWindow('large.txt','before',i*16384).text.length,16384);assert.equal(controller.refreshView().canApply,true);}}finally{global.structuredClone=nativeClone;JSON.stringify=nativeStringify;}
 assert.equal(controller.apply(),true);state.revision++;state.input='later edit';const media={};state.media=[media];assert.equal(controller.undo(),true);assert.deepEqual(state.bundle,old.bundle);assert.equal(state.input,'later edit');assert.equal(state.media[0],media);
});
