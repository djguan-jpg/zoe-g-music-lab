// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),P=require('../web/mv-project.js'),R=require('../web/mv-render.js'),C=require('../contracts/draft-v3.json');
function draft() {
  const panels=Object.fromEntries(Object.entries(C.fields).map(([p,fields])=>[p,{fields:Object.fromEntries(fields.map(f=>[f,'']))}]));
  for(const [p,row] of Object.entries(C.rows))panels[p][row.key]=[];
  panels.music.avoid=[];panels.music.deliverables=[];panels.storyboard.motifs=[];
  panels.audio.fields['audio-profile']='video';panels.lyrics.fields['lyrics-format']='.json';
  return {format:C.format,schema_version:3,tool_version:'0.171.0',saved_at:'2026-10-09T00:00:00Z',tab:'storyboard',panels};
}
test('movie plans require complete sequential coverage and all lyric times within the actual media',()=>{
  const d=P.seed(draft(),'a\nb',2,4,'title'),shots=d.panels.storyboard.shots.map((value,i)=>({id:'s'+i,value})),cues=d.panels.lyrics.cues.map((value,i)=>({id:'c'+i,value})),before=structuredClone(shots);
  const plan=R.plan(shots,cues,4);assert.equal(R.frame(plan,2).shot.id,'s1');assert.equal(R.frame(plan,4).shot.id,'s1');assert.equal(R.frame(plan,2).text,'b');assert.deepEqual(shots,before);
  for(const change of [s=>s[0].value.start='.1',s=>s[1].value.start='1',s=>s[1].value.end='3',s=>s[1].value.end='4.1']){const s=structuredClone(shots);change(s);assert.throws(()=>R.plan(s,cues,4));}
  assert.throws(()=>R.plan(shots,[{value:{start:'',end:'3',text:'a'}}],4));assert.throws(()=>R.plan(shots,cues,601));
  assert.deepEqual(R.dimensions('9:16'),{width:540,height:960});
});
function recorder(overrides={}) {
  const source={key:'original',allowed:true},errors=[],calls=[];let resolve;
  const native={stop:ok=>{calls.push(ok);resolve(ok?{size:100}:null);},done:new Promise(r=>resolve=r)};
  const c=R.createRecorder({capture:()=>({...source}),prepare:async()=>({}),start:async()=>native,draw:()=>{},position:()=>1,onError:e=>errors.push(e.message),...overrides});
  return {c,source,errors,calls,native,resolve};
}
test('recording needs explicit start and refuses duplicate startup; complete native output is required',async()=>{
  const a=recorder();assert.equal(a.c.state().phase,'idle');const work=a.c.begin();assert.equal(await a.c.begin(),false);await new Promise(r=>setImmediate(r));assert.equal(a.c.state().phase,'recording');a.native.stop(true);assert.equal(await work,true);assert.equal(a.c.state().result.size,100);
  a.source.key='edited';a.c.refresh();assert.equal(a.c.state().result,null);
});
test('recording cancels owned work on source or gates changing and never presents a partial artifact',async()=>{
  for(const mutate of [s=>s.key='changed',s=>s.allowed=false]){const a=recorder(),work=a.c.begin();await new Promise(r=>setImmediate(r));mutate(a.source);a.c.refresh();assert.equal(await work,false);assert.deepEqual(a.calls,[false]);assert.equal(a.c.state().result,null);}
});
test('preparation cancellation and late startup cannot resurrect results or allow a duplicate physical startup',async()=>{
  let release;const a=recorder({prepare:()=>new Promise(r=>release=r)}),work=a.c.begin();a.c.cancel();assert.equal(await a.c.begin(),false);release({});assert.equal(await work,false);assert.equal(a.c.state().phase,'idle');assert.deepEqual(a.calls,[]);
  let start;const b=recorder({start:()=>new Promise(r=>start=r)}),second=b.c.begin();await new Promise(r=>setImmediate(r));b.c.cancel();start(b.native);assert.equal(await second,false);assert.deepEqual(b.calls,[false]);assert.equal(b.c.state().result,null);
});
test('native refusals empty output output caps and drawing failure never report ready',async()=>{
  for(const size of [0,128*1024*1024+1]){const a=recorder(),work=a.c.begin();await new Promise(r=>setImmediate(r));a.resolve({size});assert.equal(await work,false);assert.equal(a.c.state().phase,'failed');}
  const a=recorder({draw:()=>{throw Error('canvas failed');}}),work=a.c.begin();await new Promise(r=>setImmediate(r));a.c.refresh();assert.equal(await work,false);assert.deepEqual(a.calls,[false]);
  const b=recorder({start:async()=>{throw Error('denied');}});assert.equal(await b.c.begin(),false);assert.equal(b.c.state().result,null);
});

test('streaming WebM duration adds metadata while preserving codec payload and refusing indexed layouts',()=>{
  const raw=Uint8Array.from([0x1a,0x45,0xdf,0xa3,0x80,0x18,0x53,0x80,0x67,0x01,255,255,255,255,255,255,255,0x15,0x49,0xa9,0x66,0x87,0x2a,0xd7,0xb1,0x83,0x0f,0x42,0x40,0x16,0x54,0xae,0x6b,0x80,0x1f,0x43,0xb6,0x75,0x83,1,2,3]);
  const original=raw.slice(),complete=R.withDuration(raw,4090);
  assert.equal(complete.length,raw.length+11);assert.deepEqual(raw,original);assert.deepEqual(complete.slice(-12),raw.slice(-12));assert.equal(new DataView(complete.buffer).getFloat64(32,false),4090);
  const twice=R.withDuration(complete,4100);assert.equal(twice.length,complete.length);assert.equal(new DataView(twice.buffer).getFloat64(32,false),4100);
  for(const ms of [0,NaN,615001])assert.throws(()=>R.withDuration(raw,ms));
  const indexed=raw.slice();indexed.set([0x11,0x4d,0x9b,0x74],29);assert.throws(()=>R.withDuration(indexed,4000));
  assert.throws(()=>R.withDuration(raw.slice(0,-1),4000));
});

test('movie text exceeding canvas capacity is refused before recording rather than silently truncated',()=>{
 const ctx={measureText:t=>({width:t.length*10})},canvas={width:100,height:60},p={cues:[{text:'long '.repeat(20)}],shots:[]};
 assert.throws(()=>R.checkCanvas(ctx,canvas,p,new Map()));
 const textcards={cues:[],shots:[{id:'s',value:{visual:'long '.repeat(30)}}]};assert.throws(()=>R.checkCanvas(ctx,canvas,textcards,new Map()));
 assert.doesNotThrow(()=>R.checkCanvas(ctx,canvas,textcards,new Map([['s',{}]])));
 assert.throws(()=>R.plan([{id:'s',value:{start:'0',end:'4'}}],[{value:{start:'0',end:'3',text:'a'}},{value:{start:'2',end:'4',text:'b'}}],4));
});
