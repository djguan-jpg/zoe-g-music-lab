// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const Gate=require('../web/operation-gate.js'),Review=require('../musiclab/assets/lyrics-review.js');
const app=fs.readFileSync('web/app.js','utf8');
function block(a,b){const i=app.indexOf(a),j=app.indexOf(b,i+1);assert.ok(i>=0&&j>i);return app.slice(i,j);}
const gate=()=>Gate.createGate({createAbort:()=>new AbortController()});
function deferred(){let resolve,reject;const promise=new Promise((r,j)=>{resolve=r;reject=j;});return{promise,resolve,reject};}
test('gate owns exactly one context and cancellation invalidates it before native abort listeners run',()=>{
 const g=gate(),job=g.begin();assert.deepEqual(g.view(),{busy:true,cancelling:false,canCancel:true});let current;job.signal.addEventListener('abort',()=>{current=g.current(job);},{once:true});assert.equal(g.cancel(),true);assert.equal(current,false);assert.equal(job.signal.aborted,true);assert.deepEqual(g.view(),{busy:true,cancelling:true,canCancel:false});assert.equal(g.cancel(),false);assert.equal(g.finish(job),true);assert.deepEqual(g.view(),{busy:false,cancelling:false,canCancel:false});
});
test('foreign and finished contexts cannot release or become current for a newer operation',()=>{
 const g=gate(),old=g.begin();assert.equal(g.finish({signal:old.signal}),false);assert.throws(()=>g.begin(),/尚未完成/);g.finish(old);const fresh=g.begin();assert.notEqual(fresh.signal,old.signal);assert.equal(g.finish(old),false);assert.equal(g.current(old),false);assert.equal(g.current(fresh),true);assert.equal(g.cancelled(old),false);g.finish(fresh);
});
test('cancelling idle gate is a no-op and invalid abort factories allocate no owned job',()=>{
 assert.equal(gate().cancel(),false);assert.throws(()=>Gate.createGate({}),/缺少/);for(const createAbort of [()=>null,()=>({abort(){}}),()=>{throw Error('factory failure');}]){const g=Gate.createGate({createAbort});assert.throws(()=>g.begin());assert.equal(g.view().busy,false);}
});
function setup(){
 const state={busy:false,tab:'music',revisions:{music:0},files:{previous:'原成果'},raw:{title:' 原歌名 🎵 ',hook:'原記憶點'},history:['較早刪除','最近刪除'],media:{id:'原音檔',position:3.2,paused:false}},g=gate(),events=[];
 const context={state,operationGate:g,cueStampEdit:null,say:(...args)=>events.push(['say',...args]),markDirty:scope=>{state.revisions[scope]++;events.push(['dirty',scope]);},timingControls:()=>events.push(['controls',g.view()])};vm.createContext(context);vm.runInContext(block('async function run(','function setFiles('),context);
 return{state,g,events,context,button:{disabled:false},run:task=>context.run({disabled:false},task),cancel:()=>context.cancelRun()};
}
test('actual shared run aborts its owned fetch context without dirtying unchanged source or replacing previous results',async()=>{
 const s=setup(),before=structuredClone(s.state);let signal;const work=s.context.run(s.button,current=>{signal=current.signal;return new Promise((resolve,reject)=>signal.addEventListener('abort',()=>reject(Error('native abort')),{once:true}));});assert.equal(s.state.busy,true);s.cancel();await work;assert.equal(signal.aborted,true);assert.deepEqual(s.state,{...before,busy:false});assert.equal(s.button.disabled,false);assert.equal(s.g.view().busy,false);assert.equal(s.events.filter(x=>x[0]==='dirty').length,0);assert.ok(s.events.at(-1)[1].startsWith('已取消本次等待'));assert.ok(!s.events.some(x=>x[1]==='native abort'));
});
test('non-abortable local phase stays busy until settled, refuses duplicates and suppresses late success before release',async()=>{
 const s=setup(),d=deferred();let commits=0;const work=s.context.run(s.button,async current=>{await d.promise;if(current())commits++;});s.cancel();assert.equal(s.state.busy,true);assert.equal(s.g.view().cancelling,true);await s.run(()=>assert.fail('duplicate'));d.resolve();await work;assert.equal(commits,0);assert.equal(s.state.busy,false);assert.equal(s.events.filter(x=>x[0]==='dirty').length,0);assert.deepEqual(s.state.files,{previous:'原成果'});
});
test('manual edits during a cancelled request remain intact without additional synthetic revisions',async()=>{
 const s=setup(),d=deferred(),work=s.run(async current=>{await d.promise;if(current())s.state.files={wrong:'舊來源'};});s.state.raw.hook='處理期間自寫';s.context.markDirty('music');s.cancel();d.resolve();await work;assert.equal(s.state.raw.hook,'處理期間自寫');assert.equal(s.state.revisions.music,1);assert.deepEqual(s.state.files,{previous:'原成果'});assert.deepEqual(s.state.history,['較早刪除','最近刪除']);
});
test('cancelled late error is quiet and an explicit retry gets a fresh signal and commits normally',async()=>{
 const s=setup(),d=deferred();let oldSignal,newSignal;const old=s.run(current=>{oldSignal=current.signal;return d.promise;});s.cancel();d.reject(Error('late error'));await old;await s.run(async current=>{newSignal=current.signal;assert.equal(current(),true);s.state.files={new:'明確重試結果'};});assert.notEqual(newSignal,oldSignal);assert.equal(newSignal.aborted,false);assert.deepEqual(s.state.files,{new:'明確重試結果'});assert.ok(!s.events.some(x=>x[1]==='late error'));
});
test('ordinary current failures and source-stale successes keep existing run behavior',async()=>{
 const s=setup();await s.run(()=>Promise.reject(Error('current failure')));assert.ok(s.events.some(x=>x[1]==='current failure'&&x[2]));const d=deferred(),work=s.run(async current=>{await d.promise;if(current())assert.fail('stale commit');});s.state.revisions.music++;d.resolve();await work;assert.ok(s.events.some(x=>x[1]==='處理期間輸入有修改，請重新建立成果'));assert.equal(s.state.busy,false);
});
function dom(){
 const body={},doc={body,activeElement:body},button={disabled:true,textContent:'取消等待'},note={hidden:true,textContent:''};let hidden=true;
 Object.defineProperty(button,'hidden',{get:()=>hidden,set:value=>{hidden=value;if(value&&doc.activeElement===button)doc.activeElement=body;}});doc.getElementById=id=>id==='operation-cancel'?button:note;
 let view={busy:false,cancelling:false,canCancel:false},calls=0;const ctx={};vm.runInNewContext(fs.readFileSync('web/operation-control-dom.js','utf8'),ctx);const adapter=ctx.MusicOperationControlDOM.createAdapter(doc,{capture:()=>view,cancel:()=>calls++});return{doc,button,note,adapter,set:value=>view=value,get calls(){return calls;}};
}
test('DOM adapter keeps idle control hidden and only a live cancellable click invokes cancellation',()=>{
 const s=dom();s.button.onclick();assert.equal(s.calls,0);assert.equal(s.button.hidden,true);s.set({busy:true,cancelling:false,canCancel:true});s.adapter.refresh();assert.equal(s.button.hidden,false);assert.equal(s.button.disabled,false);s.button.onclick();assert.equal(s.calls,1);s.set({busy:true,cancelling:true,canCancel:false});s.adapter.refresh();s.button.onclick();assert.equal(s.calls,1);assert.equal(s.button.disabled,true);assert.match(s.note.textContent,/正在取消/);
});
test('DOM completion restores only an owned cancel focus to the initiating usable control, across repeated refreshes',()=>{
 const s=dom();s.set({busy:true,cancelling:false,canCancel:true});s.adapter.refresh();s.doc.activeElement=s.button;s.set({busy:false,cancelling:false,canCancel:false});s.adapter.refresh();s.adapter.refresh();const target={isConnected:true,disabled:false,closest:()=>null,focus:()=>s.doc.activeElement=target};assert.equal(s.adapter.finishFocus(target),true);assert.equal(s.doc.activeElement,target);assert.equal(s.adapter.finishFocus(target),false);
});
test('DOM completion never steals later input focus or focuses disabled, hidden or detached initiators',()=>{
 for(const kind of ['input','disabled','hidden','detached']){const s=dom();s.set({busy:true,cancelling:false,canCancel:true});s.adapter.refresh();s.doc.activeElement=s.button;s.set({busy:false,cancelling:false,canCancel:false});s.adapter.refresh();if(kind==='input')s.doc.activeElement={input:true};const target={isConnected:kind!=='detached',disabled:kind==='disabled',closest:()=>kind==='hidden'?{}:null,focus:()=>assert.fail('unexpected focus')};assert.equal(s.adapter.finishFocus(target),false);}
});
function reviewHarness(){
 const payload={title:'原創',duration:null,cues:[{start:'0',end:'1',text:'原句🎵'}]},events=[],pending=[],controller=Review.createController({capture:()=>payload,request:(p,current)=>{const d=deferred();pending.push({p,current,...d});return d.promise;},onReport:()=>events.push('report'),onError:error=>events.push(error.message),onState:view=>events.push(view.pending)});return{payload,events,pending,controller};
}
test('lyrics review forwards the optional current context and rejects cancelled late success before source validation or reporting',async()=>{
 const s=reviewHarness(),g=gate(),job=g.begin(),current=()=>g.current(job);current.signal=job.signal;const work=s.controller.check(current);assert.equal(s.pending[0].current,current);g.cancel();s.pending[0].resolve({untrusted:'late result'});assert.equal(await work,false);assert.ok(!s.events.includes('report'));assert.deepEqual(s.events,[true,false]);g.finish(job);
});
test('lyrics review suppresses cancelled errors and remains backward compatible with default checks and explicit retry',async()=>{
 const s=reviewHarness(),g=gate(),job=g.begin(),work=s.controller.check(()=>g.current(job));g.cancel();s.pending[0].reject(Error('late refused'));await work;assert.deepEqual(s.events,[true,false]);g.finish(job);const retry=s.controller.check(),data=Review.review(s.payload);s.pending[1].resolve({data,files:{'lyrics-review.json':JSON.stringify(data),'lyrics-review.md':Review.markdown(data)},meta:{version:'0.90.0',protocol_version:1,needs_review:true}});assert.equal(await retry,true);assert.ok(s.events.includes('report'));
});
test('native request adapter attaches only the explicitly passed signal and preserves JSON and binary transport shape',async()=>{
 const calls=[],context={fetch:async(route,options)=>{calls.push({route,options});return{ok:true,json:async()=>({ok:true})};}};vm.createContext(context);vm.runInContext(block('async function api(','async function run('),context);const signal=new AbortController().signal;await context.api('/api/read',{literal:'🎵'});await context.api('/api/read',{literal:'🎵'},false,signal);const bytes=new Uint8Array([1,2]);await context.api('/api/binary',bytes,true,signal);assert.equal(Object.hasOwn(calls[0].options,'signal'),false);assert.equal(calls[1].options.signal,signal);assert.equal(calls[1].options.body,calls[0].options.body);assert.equal(calls[2].options.body,bytes);assert.equal(calls[2].options.headers['Content-Type'],'application/octet-stream');
});
test('native adapter rejects an aborted body read and keeps the existing HTTP error status and message',async()=>{
 const signal=new AbortController().signal,context={fetch:async()=>({ok:true,json:async()=>{throw Error('body aborted');}})};vm.createContext(context);vm.runInContext(block('async function api(','async function run('),context);await assert.rejects(context.api('/api/read',{},false,signal),/body aborted/);context.fetch=async()=>({ok:false,status:500,json:async()=>({error:'server refused'})});await assert.rejects(context.api('/api/read',{}),error=>error.status===500&&error.message==='server refused');
});
