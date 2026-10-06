// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const Model=require('../web/draft-compare.js'),Controller=require('../web/draft-compare-controller.js'),Dom=require('../web/draft-compare-dom.js'),Download=require('../web/text-download.js'),Select=require('../web/draft-compare-download.js');
function payload(){const baseline=JSON.parse(fs.readFileSync(require.resolve('../examples/draft-comparison-baseline.json'),'utf8')),current=structuredClone(baseline);current.panels.music.fields['music-title']='目前原文\r\n🎵';return {baseline,current};}
function deferred(){let resolve,reject;const promise=new Promise((a,b)=>{resolve=a;reject=b;});return {promise,resolve,reject};}
function fixture(){const source=payload(),gate={identity:{},revision:[0],media:[{}],tab:'music',allowed:true,visible:true},jobs=[],states=[],ready=[],errors=[];let reads=0,gates=0;
 const controller=Controller.create({capture:()=>{reads++;return source;},gate:()=>{gates++;return gate;},generate:p=>{const d=deferred();jobs.push({...d,source:p});return d.promise;},onState:s=>states.push(s),onReady:r=>ready.push(r),onError:e=>errors.push(e.message)});
 return {source,gate,jobs,states,ready,errors,controller,get reads(){return reads;},get gates(){return gates;}};
}
for(const fail of [false,true])for(const pending of [false,true])test(`superseded ${fail?'error':'success'} cannot invalidate a newer ${pending?'pending':'completed'} comparison`,async()=>{
 for(const action of ['cancel','clear','invalidate']){
  const s=fixture(),original=structuredClone(s.source),first=s.controller.run();s.controller[action]();const second=s.controller.run(),expected=await Model.compare(s.jobs[1].source);
  if(!pending){s.jobs[1].resolve(expected);assert.equal(await second,true);assert.deepEqual(s.controller.read(),expected);}
  const readCount=s.reads,gateCount=s.gates,stateCount=s.states.length,readyCount=s.ready.length;
  if(fail)s.jobs[0].reject(Error('cancelled old failure'));else s.jobs[0].resolve(await Model.compare(s.jobs[0].source));
  assert.equal(await first,false);assert.equal(s.reads,readCount);assert.equal(s.gates,gateCount);assert.equal(s.states.length,stateCount);assert.equal(s.ready.length,readyCount);assert.deepEqual(s.errors,[]);
  if(pending){assert.equal(s.states.at(-1).busy,true);assert.equal(s.states.at(-1).stale,false);s.jobs[1].resolve(expected);assert.equal(await second,true);}
  assert.equal(s.states.at(-1).ready,true);assert.deepEqual(s.controller.read(),expected);assert.deepEqual(Select.select(s.controller.read(),'json'),Select.select(expected,'json'));assert.deepEqual(Select.select(s.controller.read(),'markdown'),Select.select(expected,'markdown'));assert.deepEqual(s.source,original);
 }
});
for(const fail of [false,true])test(`clear remains empty and non-stale after a cancelled late ${fail?'error':'success'}`,async()=>{
 const s=fixture(),first=s.controller.run();s.controller.clear();const states=s.states.length;
 if(fail)s.jobs[0].reject(Error('cleared'));else s.jobs[0].resolve(await Model.compare(s.jobs[0].source));assert.equal(await first,false);s.controller.refresh();assert.equal(s.states.length,states+1);assert.deepEqual(s.states.at(-1),{busy:false,ready:false,stale:false,available:true});assert.deepEqual(s.ready,[]);assert.deepEqual(s.errors,[]);assert.throws(()=>s.controller.read());
});
test('several cancelled generations preserve the newest report for both settlement orders and later reads',async()=>{
 for(const order of [[0,1],[1,0]]){
  const s=fixture(),runs=[];for(let i=0;i<3;i++){if(i)s.controller.cancel();s.source.current.panels.music.fields['music-title']=`目前第${i}份🎵`;runs.push(s.controller.run());}
  const expected=await Model.compare(s.jobs[2].source);s.jobs[2].resolve(expected);assert.equal(await runs[2],true);s.ready[0].details.length=0;
  for(const i of order){if(i)s.jobs[i].reject(Error('old'));else s.jobs[i].resolve(await Model.compare(s.jobs[i].source));assert.equal(await runs[i],false);assert.deepEqual(s.controller.read(),expected);}
  s.controller.refresh();assert.equal(s.states.at(-1).ready,true);assert.deepEqual(s.errors,[]);assert.equal(s.ready.length,1);
 }
});
class Element{
 constructor(tag='div'){this.tagName=tag;this.children=[];this.listeners=new Map();this.hidden=false;this.disabled=false;this.value='';this.textContent='';const classes=new Set();this.classList={add:v=>classes.add(v),remove:v=>classes.delete(v),contains:v=>classes.has(v)};}
 append(...v){this.children.push(...v);}replaceChildren(...v){this.children=[...v];}setAttribute(){}addEventListener(k,f){this.listeners.set(k,f);}removeEventListener(k,f){if(this.listeners.get(k)===f)this.listeners.delete(k);}emit(k){return this.listeners.get(k)?.();}focus(){}
}
function dom(prefix,send){const elements={};for(const s of ['start','cancel','status','report','list','scope','previous','next','page','expand','collapse','open-note','kind','kind-note','row-collection','row-number','row-start','row-cancel','row-status','row-result','row-full','row-previous','row-next','row-navigation','download-json','download-markdown','download-status'])elements[s]=new Element();elements.scope.value='all';const source=payload(),gate={identity:{},revision:[0],media:[],tab:'music',allowed:true,visible:true},errors=[];
 const document={getElementById:id=>elements[id.slice((prefix+'-compare-').length)],createElement:t=>new Element(t),querySelector:()=>null};const adapter=Dom.bind(document,{prefix,capture:()=>source,gate:()=>gate,downloads:{createController:o=>Download.createController({...o,send})},onError:e=>errors.push(e.message)});return {elements,source,gate,errors,adapter};
}
test('both preview surfaces clear a prior sent notice only when the next report completes',async()=>{
 for(const prefix of ['draft','library']){const s=dom(prefix,()=>true);await s.elements.start.emit('click');await s.elements['download-json'].emit('click');assert.match(s.elements['download-status'].textContent,/已送出/);const note=s.elements['download-status'].textContent;s.adapter.refresh();assert.equal(s.elements['download-status'].textContent,note);const next=s.elements.start.emit('click');assert.equal(s.elements['download-status'].textContent,note);await next;assert.equal(s.elements['download-status'].textContent,'');assert.equal(s.elements['download-status'].classList.contains('error'),false);assert.equal(s.elements['download-json'].disabled,false);s.adapter.dispose();}
});
test('both preview surfaces clear previous send errors on successful comparison and explicit clear',async()=>{
 for(const prefix of ['draft','library']){const s=dom(prefix,()=>{throw Error('send failed');});await s.elements.start.emit('click');await s.elements['download-markdown'].emit('click');assert.match(s.elements['download-status'].textContent,/send failed/);assert.equal(s.elements['download-status'].classList.contains('error'),true);await s.elements.start.emit('click');assert.equal(s.elements['download-status'].textContent,'');assert.equal(s.elements['download-status'].classList.contains('error'),false);await s.elements['download-json'].emit('click');s.adapter.clear();assert.equal(s.elements['download-status'].textContent,'');assert.equal(s.elements['download-status'].classList.contains('error'),false);assert.equal(s.elements.report.hidden,true);s.adapter.dispose();}
});
