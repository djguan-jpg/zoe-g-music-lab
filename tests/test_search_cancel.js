// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const R=require('../web/search-request.js'),hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const profiles=['lyrics','storyboard','music'].map(kind=>({kind,P:require('../musiclab/assets/'+kind+'-search.js'),C:require('../web/'+kind+'-search-controller.js'),D:require('../web/'+kind+'-search-dom.js')}));
function harness(profile,{defer=false,ignoreAbort=false,localHash=false}={}){
 const {kind,P,C}=profile,length=kind==='music'?40:45,s={ids:Array.from({length},(_,i)=>'id'+i),visible:true,busy:false,resultRevision:0},calls=[],signals=[],reports=[],errors=[],hashes=[],effects=[];
 if(kind==='lyrics')s.texts=Array.from({length:45},(_,i)=>'a b 原文 '+i);else if(kind==='music')s.sections=Array.from({length},(_,i)=>Object.fromEntries(P.fields.map(k=>[k,k==='focus'?'a b 原文 '+i:''])));else s.shots=Array.from({length:45},(_,i)=>Object.fromEntries(P.fields.map(k=>[k,k==='visual'?'a b 原文 '+i:''])));
 const search=p=>P.search(p,{hash}),wire=d=>({data:d,files:{[kind+'-search.json']:JSON.stringify(d),[kind+'-search.md']:P.markdown(d)},meta:{version:'0.93.0',protocol_version:1,needs_review:true}});
 const options={version:'0.93.0',capture:()=>s,createAbort:()=>{const a=new AbortController();signals.push(a.signal);return a;},search:localHash?p=>new Promise(r=>hashes.push(async()=>r(await search(p)))):search,
  request:async(p,{signal})=>{const reply=wire(await search(p));if(!defer)return reply;return new Promise((resolve,reject)=>{const call={payload:p,signal,resolve:()=>resolve(reply),reject};calls.push(call);if(!ignoreAbort)signal.addEventListener('abort',()=>reject(Object.assign(Error('aborted'),{name:'AbortError'})),{once:true});});},
  focusTarget:t=>{effects.push(t);return true;},onReport:(d,f)=>reports.push({d,f}),onError:e=>errors.push(e)};
 const c=C.createController(options);return {s,c,options,calls,signals,reports,errors,hashes,effects,search,wire};
}
const settle=()=>new Promise(setImmediate);
test('request ownership invalidates before abort and late finish cannot release a newer job',()=>{
 let job,lifecycle,observed,aborts=0;lifecycle=R.createLifecycle({createAbort:()=>({signal:{},abort(){aborts++;observed=lifecycle.current(job);}})});job=lifecycle.begin();assert.ok(Object.isFrozen(job));assert.equal(lifecycle.current(job),true);assert.throws(()=>lifecycle.begin());assert.equal(lifecycle.invalidate(),true);assert.equal(observed,false);assert.equal(aborts,1);const next=lifecycle.begin();assert.equal(lifecycle.finish(job),false);assert.equal(lifecycle.current(next),true);assert.equal(lifecycle.finish(next),true);assert.equal(lifecycle.invalidate(),false);
});
test('bad abort factories fail before ownership and normal completion does not signal abort',()=>{
 assert.throws(()=>R.createLifecycle({}));for(const value of [null,{}, {signal:{}},{signal:null,abort(){}}]){const r=R.createLifecycle({createAbort:()=>value});assert.throws(()=>r.begin());assert.equal(r.invalidate(),false);}
 const a=new AbortController(),r=R.createLifecycle({createAbort:()=>a}),job=r.begin();assert.equal(r.finish(job),true);assert.equal(a.signal.aborted,false);
});
for(const profile of profiles){
 const {kind}=profile;
 test(kind+' inactive cancellation does not read sources create a job or emit a view',()=>{
  const c=profile.C.createController({capture:()=>assert.fail('idle source read'),request:()=>assert.fail('idle request'),focusTarget:()=>false,version:'0.93.0',createAbort:()=>assert.fail('idle abort factory'),onState:()=>assert.fail('idle render')});assert.equal(c.cancel(),false);
 });
 test(kind+' explicit cancellation retains the previous batch report source paging and focus',async()=>{
  const h=harness(profile,{defer:true});h.c.setQuery('a');let p=h.c.find();await settle();h.calls[0].resolve();assert.equal(await p,true);const original=structuredClone(h.s),before=h.c.view(),count=h.reports.length;
  p=h.c.next();await settle();assert.equal(h.c.view().canCancel,true);assert.equal(h.c.cancel(),true);assert.equal(h.calls[1].signal.aborted,true);assert.equal(await p,false);assert.equal(h.c.view().pending,false);assert.equal(h.c.view().canNext,true);assert.deepEqual(h.c.view().matches,before.matches);assert.equal(h.c.focus(0),true);assert.deepEqual(h.s,original);assert.equal(h.reports.length,count);assert.equal(h.errors.length,0);assert.equal(h.c.cancel(),false);
  p=h.c.next();await settle();h.calls[2].resolve();assert.equal(await p,true);assert.equal(h.c.view().startRow,21);assert.equal(h.signals[2].aborted,false);
 });
 test(kind+' query source ID navigation busy and clear abort only the owned old transport',async()=>{
  for(const change of [h=>h.c.setQuery('b'),h=>{if(kind==='lyrics')h.s.texts[0]='changed';else if(kind==='music')h.s.sections[0].texture='changed';else h.s.shots[0].camera='changed';h.c.refresh();},h=>{h.s.ids[0]='new';h.c.refresh();},h=>{h.s.visible=false;h.c.refresh();},h=>{h.s.busy=true;h.c.refresh();},h=>h.c.clear()]){
   const h=harness(profile,{defer:true});h.c.setQuery('a');const p=h.c.find();await settle();change(h);assert.equal(h.calls[0].signal.aborted,true);assert.equal(await p,false);assert.equal(h.reports.length,0);assert.equal(h.errors.length,0);assert.equal(h.c.view().pending,false);
  }
 });
 test(kind+' cancelled local hash settles without sending HTTP or replacing edited source',async()=>{
  const h=harness(profile,{defer:true,localHash:true});h.c.setQuery('a');const p=h.c.find();assert.equal(h.c.cancel(),true);assert.equal(h.signals[0].aborted,true);await h.hashes[0]();assert.equal(await p,false);assert.equal(h.calls.length,0);assert.equal(h.reports.length,0);assert.equal(h.errors.length,0);
 });
 test(kind+' late success or error after cancellation cannot clear a new pending job',async()=>{
  for(const fail of [false,true]){const h=harness(profile,{defer:true,ignoreAbort:true});h.c.setQuery('a');const old=h.c.find();await settle();h.c.cancel();h.c.setQuery('b');const next=h.c.find();await settle();if(fail)h.calls[0].reject(Error('late'));else h.calls[0].resolve();assert.equal(await old,false);assert.equal(h.c.view().pending,true);assert.equal(h.calls[1].signal.aborted,false);h.calls[1].resolve();assert.equal(await next,true);assert.equal(h.reports.length,1);assert.equal(h.errors.length,0);assert.equal(h.c.view().query,'b');}
 });
 test(kind+' current request errors and invalid factories can retry without leaking a job',async()=>{
  const h=harness(profile,{defer:true});h.c.setQuery('a');let p=h.c.find();await settle();h.calls[0].reject(Error('current failure'));assert.equal(await p,false);assert.equal(h.errors.length,1);p=h.c.find();await settle();h.calls[1].resolve();assert.equal(await p,true);
  let attempts=0;const c=profile.C.createController({...h.options,request:async p=>h.wire(await h.search(p)),createAbort:()=>++attempts===1?null:new AbortController()});c.setQuery('a');assert.equal(await c.find(),false);assert.equal(await c.find(),true);
 });
 test(kind+' fixed DOM cancel returns only its owned focus and pagehide cancels waiting',async()=>{
  const h=harness(profile,{defer:true}),nodes=new Map(),events=new Map();const document={activeElement:null,defaultView:{addEventListener:(name,fn)=>events.set(name,fn)},getElementById:id=>nodes.get(id),createElement:tag=>make(tag)};
  function make(tag){return {tag,isConnected:true,disabled:false,hidden:false,textContent:'',children:[],focus(){document.activeElement=this;},replaceChildren(){this.children=[];},append(child){this.children.push(child);}};}
  for(const id of ['query','find','previous','next','matches','note','cancel'])nodes.set(kind+'-search-'+id,make('button'));
  const c=profile.D.bind(document,h.options),query=nodes.get(kind+'-search-query'),cancel=nodes.get(kind+'-search-cancel');assert.equal(cancel.hidden,true);c.setQuery('a');let p=c.find();await settle();assert.equal(cancel.hidden,false);cancel.focus();cancel.onclick();assert.equal(await p,false);assert.equal(document.activeElement,query);assert.equal(cancel.hidden,true);
  p=c.find();await settle();const external=make('textarea');external.focus();cancel.onclick();assert.equal(await p,false);assert.equal(document.activeElement,external);
  p=c.find();await settle();events.get('pagehide')();assert.equal(await p,false);assert.equal(h.calls.at(-1).signal.aborted,true);assert.equal(h.errors.length,0);
 });
}
test('both fixed adapters forward only their explicitly owned signal and load the shared asset first',()=>{
 const fs=require('node:fs'),html=fs.readFileSync('web/index.html','utf8'),app=fs.readFileSync('web/app.js','utf8');for(const kind of ['lyrics','storyboard','music']){assert.ok(html.indexOf('/search-request.js')<html.indexOf('/'+kind+'-search-controller.js'));assert.match(html,new RegExp('id="'+kind+'-search-cancel"[^>]*hidden disabled'));assert.ok(app.includes("request:(payload,{signal})=>api('/api/"+kind+"-search',payload,false,signal)"));}
});
