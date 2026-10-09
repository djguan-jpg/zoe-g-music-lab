// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),S=require('../web/mv-seed.js');
function fixture(overrides={}) {
  const source={key:'original',allowed:true,title:'原文',text:'  歌詞 🎵  ',textcard:false,files:[{}]},calls=[],errors=[],views=[];
  const c=S.create({capture:()=>({...source}),prepare:async s=>({title:s.title}),replace:async(...args)=>{calls.push(args);return {written:true};},accept:async()=>true,onView:v=>views.push(v),onError:e=>errors.push(e.message),...overrides});
  return {c,source,calls,errors,views};
}
test('seed preview makes no writes and requires an explicit accepted replacement',async()=>{
  const a=fixture();assert.equal(await a.c.apply(),false);assert.equal(await a.c.preview(),true);assert.deepEqual(a.calls,[]);assert.equal(a.c.state().phase,'preview');assert.equal(await a.c.apply(),true);assert.equal(a.calls.length,1);assert.equal(a.c.state().pending,false);assert.equal(a.views.filter(v=>v.accepted).length,1);
});
test('every original source input and exact picked file identity invalidate a stale seed preview',async()=>{
  for(const mutate of [s=>s.key='edited',s=>s.title='new',s=>s.text='changed',s=>s.textcard=true,s=>s.files=[{}],s=>s.allowed=false]) {
    const a=fixture();await a.c.preview();mutate(a.source);assert.equal(await a.c.apply(),false);assert.equal(a.calls.length,0);assert.equal(a.c.state().phase,'idle');assert.equal(a.errors.length,1);
  }
});
test('preparing cancellation waits for owned preparation and never revives a cancelled proposal',async()=>{
  let release;const a=fixture({prepare:()=>new Promise(r=>release=r)}),work=a.c.preview();assert.equal(await a.c.preview(),false);a.c.cancel();assert.equal(await a.c.preview(),false);release({});assert.equal(await work,false);assert.equal(a.c.state().proposal,null);assert.equal(a.c.state().pending,false);assert.equal(a.calls.length,0);
});
test('source changed during preparation is rejected before proposing any replacement',async()=>{
  let release;const a=fixture({prepare:()=>new Promise(r=>release=r)}),work=a.c.preview();a.source.key='edited';release({});assert.equal(await work,false);assert.equal(a.c.state().proposal,null);assert.equal(a.calls.length,0);
});
test('replacement refusal or failed actual readback never announces accepted creation or retries',async()=>{
  for(const overrides of [{replace:async()=>false},{accept:async()=>false},{accept:async()=>{throw Error('read failed');}}]) {
    const a=fixture(overrides);await a.c.preview();assert.equal(await a.c.apply(),false);assert.equal(a.views.some(v=>v.accepted),false);assert.equal(a.c.state().proposal,null);assert.equal(await a.c.apply(),false);
  }
});
test('cancellation and disposal during replacement prevent late success and duplicate writes',async()=>{
  for(const action of ['cancel','dispose']){
    let release;const a=fixture({replace:()=>new Promise(r=>release=r)});await a.c.preview();const work=a.c.apply();assert.equal(await a.c.apply(),false);a.c[action]();release({});assert.equal(await work,false);assert.equal(a.views.some(v=>v.accepted),false);
  }
});
test('refresh invalidates only a stale preview and preserving whitespace leaves a valid proposal',async()=>{
  const a=fixture();await a.c.preview();assert.equal(a.c.refresh().phase,'preview');a.source.text='歌詞 🎵';assert.equal(a.c.refresh().phase,'idle');assert.equal(await a.c.apply(),false);assert.equal(a.calls.length,0);
});
