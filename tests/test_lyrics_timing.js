// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const time=require('../musiclab/assets/lyric-time.js');
const {orderedEntries,createTimingController}=require('../web/lyrics-timing.js');
const entries=()=>[{id:'b',value:{start:'4.000',end:'5.000',text:'原創二'}},{id:'a',value:{start:'01.000',end:'2.000',text:'原創一'}}];
const reply=()=>({cues:[{start:1.5,end:2.5,text:'原創一'},{start:4.5,end:5.5,text:'原創二'}]});
const later=()=>{let resolve,reject;const promise=new Promise((a,b)=>{resolve=a;reject=b;});return {promise,resolve,reject};};
function setup(request=async()=>reply()){
  let current={entries:entries(),duration:'10'},controller;
  const seen={preview:[],applied:[],undone:[],errors:[],states:[],writes:0};
  controller=createTimingController({request,snapshot:()=>structuredClone(current),
    applyTimes:values=>{const byId=new Map(values.map(e=>[e.id,e.value]));current.entries.forEach(e=>{const value=byId.get(e.id);e.value.start=value.start;e.value.end=value.end;});seen.writes++;controller.invalidate();},
    onPreview:plan=>seen.preview.push(plan),onApplied:value=>seen.applied.push(value),onUndone:()=>seen.undone.push(true),
    onError:e=>seen.errors.push(e.message),onState:s=>seen.states.push(s)});
  return {controller,seen,current};
}

test('decimal half milliseconds and carry match the declared precision rule',()=>{
  assert.equal(time.normalize(1.2345),1.235);assert.equal(time.normalize(1.0015),1.002);
  assert.equal(time.normalize(-0.0005),-0.001);assert.equal(time.timecode(59.9995),'01:00.000');
  assert.equal(time.timecode(3599.9995,true),'01:00:00,000');assert.throws(()=>time.timecode(-0.0001));
});
test('invalid and unsafe values cannot become valid zero times',()=>{
  for(const value of [true,null,undefined,'','1_0','0x10',NaN,Infinity,1e100])assert.throws(()=>time.normalize(value));
  assert.throws(()=>time.normalize(-0.0001,'開始',true));
  assert.throws(()=>time.normalizeCues([{start:1.23451,text:'a'},{start:1.2346,text:'b'}]));
});
test('normalization preserves source, explicit ends and timing provenance',()=>{
  const source=[{start:4,end:5,text:'二'},{start:1,end:2,text:'一'}],before=structuredClone(source);
  const result=time.normalizeCues(source);assert.deepEqual(source,before);assert.equal(result.duration,5);
  assert.deepEqual(result.timing,{duration_source:'last_cue_end',inferred_end_count:0,tail_end_inferred:false});
  assert.match(time.notice(result),/保留目前結束時間/);
  assert.equal(time.normalizeCues(source,10).timing.duration_source,'provided');
});
test('missing ends are inferred separately from confirmed total duration',()=>{
  const source=[{start:1,text:'一'},{start:4,text:'二'}];const result=time.normalizeCues(source,10);
  assert.equal(result.cues[1].end,10);assert.equal(result.timing.inferred_end_count,2);assert.equal(result.duration_estimated,false);
  assert.match(time.notice(time.normalizeCues(source)),/尾句結束是推估/);
});
test('overlap, negative values, line breaks and outside-duration ends refuse the whole cue set',()=>{
  const cases=[[{start:-0.0001,end:1,text:'a'}],[{start:0,end:2,text:'a'},{start:1,end:3,text:'b'}],
    [{start:0,end:0,text:'a'}],[{start:0,end:1,text:'多\n行'}]];
  for(const cues of cases)assert.throws(()=>time.normalizeCues(cues));
  assert.throws(()=>time.normalizeCues([{start:0,end:2,text:'a'}],1));
});
test('preview uses sorted original identities and changes no raw fields',async()=>{
  const calls=[],{controller,seen,current}=setup(async payload=>{calls.push(payload);return reply();}),before=structuredClone(current);
  assert.equal(await controller.preview('0.5'),true);assert.deepEqual(current,before);assert.equal(seen.writes,0);
  assert.deepEqual(calls[0].cues.map(c=>c.text),['原創一','原創二']);assert.deepEqual(seen.preview[0].after.map(e=>e.id),['a','b']);
  seen.preview[0].after[0].value.start='999';assert.equal(controller.apply(),true);
  assert.equal(current.entries[1].value.start,'1.5');assert.equal(seen.states.at(-1).canUndo,true);
});
test('apply and undo preserve later words, row order and exact original time strings',async()=>{
  const {controller,current,seen}=setup();await controller.preview(0.5);controller.apply();
  current.entries.reverse();current.entries[0].value.text='後來的文字';current.entries[0].value.start='1.500';
  assert.equal(controller.undo(),true);assert.equal(current.entries[0].value.start,'01.000');
  assert.equal(current.entries[0].value.end,'2.000');assert.equal(current.entries[0].value.text,'後來的文字');
  assert.equal(seen.states.at(-1).canUndo,false);
});
test('one later time edit or row change prevents every undo write',async()=>{
  const {controller,current,seen}=setup();await controller.preview(0.5);controller.apply();
  current.entries[0].value.end='5.5001';let before=structuredClone(current);assert.equal(controller.undo(),false);
  assert.deepEqual(current,before);assert.equal(seen.writes,1);assert.match(seen.errors.at(-1),/未撤回/);
  current.entries[0].value.end='5.5';current.entries.pop();before=structuredClone(current);
  assert.equal(controller.undo(),false);assert.deepEqual(current,before);assert.equal(seen.writes,1);
});
test('late old previews and canceled requests never display or apply',async()=>{
  const old=later(),fresh=later();let calls=0;const {controller,seen}=setup(()=>++calls===1?old.promise:fresh.promise);
  const a=controller.preview(.5),b=controller.preview(.5);fresh.resolve(reply());assert.equal(await b,true);
  old.reject(Error('old failed'));assert.equal(await a,false);assert.equal(seen.preview.length,1);assert.equal(seen.errors.length,0);
  controller.cancel();assert.equal(controller.apply(),false);
});
test('time changes during an outstanding preview invalidate its result',async()=>{
  const pending=later(),{controller,current,seen}=setup(()=>pending.promise);const work=controller.preview(.5);
  current.duration='4';pending.resolve(reply());assert.equal(await work,false);assert.equal(controller.apply(),false);assert.equal(seen.writes,0);
});
test('editing after preview prevents apply without overriding any field',async()=>{
  const {controller,current,seen}=setup();await controller.preview(.5);current.entries[0].value.end='6';
  const before=structuredClone(current);assert.equal(controller.apply(),false);assert.deepEqual(current,before);assert.equal(seen.writes,0);
});
test('bad server replies and failed checks do not replace the current table',async()=>{
  for(const response of [{cues:[]},{cues:[{start:-1,end:2,text:'原創一'},{start:4.5,end:5.5,text:'原創二'}]},
      {cues:[{start:1.5,end:2.5,text:'不同文字'},{start:4.5,end:5.5,text:'原創二'}]}]){
    const {controller,current,seen}=setup(async()=>response),before=structuredClone(current);
    assert.equal(await controller.preview(.5),false);assert.equal(controller.apply(),false);assert.deepEqual(current,before);assert.equal(seen.writes,0);
  }
  const {controller,seen}=setup(async()=>{throw Error('HTTP 400 超時');});assert.equal(await controller.preview(.5),false);assert.equal(seen.writes,0);
});
test('zero or invalid adjustment refuses before a request and reset clears only controller history',async()=>{
  let count=0;const {controller,current,seen}=setup(async()=>{count++;return reply();}),before=structuredClone(current);
  for(const amount of ['',0,0.0001,true,'bad'])assert.equal(await controller.preview(amount),false);
  assert.equal(count,0);await controller.preview(.5);controller.apply();controller.reset();
  assert.equal(controller.undo(),false);assert.notDeepEqual(current,before);assert.equal(seen.writes,1);
});
test('sorting rejects missing or duplicate identities without modifying source',()=>{
  const original=entries(),before=structuredClone(original);assert.deepEqual(orderedEntries(original).map(e=>e.id),['a','b']);assert.deepEqual(original,before);
  assert.throws(()=>orderedEntries([original[0],original[0]]));assert.throws(()=>orderedEntries([{id:'a',value:{start:'',end:'2',text:'x'}}]));
});
