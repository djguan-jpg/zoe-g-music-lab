// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const {createTimingController}=require('../web/lyrics-timing.js');
function setup(){
 const current={duration:' 0010.000 ',entries:[{id:'b',value:{start:'04.000',end:'05.000',text:' 第二句 🎵 '}},{id:'a',value:{start:'01.000',end:'02.000',text:'第一句'}}]};
 const seen={applied:[],undone:0,errors:[],states:[],writes:0,requests:0},h={current,seen,writer:null,c:null};
 h.write=values=>{const byId=new Map(values.map(e=>[e.id,e.value]));for(const e of current.entries){const value=byId.get(e.id);if(value){e.value.start=value.start;e.value.end=value.end;}}h.c.invalidate();};
 h.writer=h.write;
 h.c=createTimingController({snapshot:()=>structuredClone(current),request:async p=>{seen.requests++;return {cues:p.cues.map(c=>({...c,start:c.start+p.shift_seconds,end:c.end+p.shift_seconds}))};},
  applyTimes:values=>{seen.writes++;return h.writer(values);},onPreview:()=>{},onApplied:s=>seen.applied.push(s),onUndone:()=>seen.undone++,onError:e=>seen.errors.push(e.message),onState:s=>seen.states.push(s)});
 return h;
}
async function applied(){const h=setup();assert.equal(await h.c.preview(.5),true);assert.equal(h.c.apply(),true);return h;}
test('a refused or no-action apply never claims success or creates an undo',async()=>{
 for(const writer of [()=>false,()=>undefined]){const h=setup(),before=structuredClone(h.current);await h.c.preview(.5);h.writer=writer;assert.equal(h.c.apply(),false);assert.deepEqual(h.current,before);assert.deepEqual(h.seen.applied,[]);assert.equal(h.seen.states.at(-1).canUndo,false);assert.equal(h.seen.states.at(-1).ready,false);assert.ok(h.seen.errors.length);}
});
test('partial apply keeps actual partial bytes but reports no full application or automatic rollback',async()=>{
 const h=setup(),before=structuredClone(h.current);await h.c.preview(.5);h.writer=values=>h.write(values.slice(0,1));assert.equal(h.c.apply(),false);assert.equal(h.seen.writes,1);assert.equal(h.current.entries[1].value.start,'1.5');assert.equal(h.current.entries[0].value.start,before.entries[0].value.start);assert.deepEqual(h.seen.applied,[]);assert.equal(h.seen.states.at(-1).canUndo,false);
});
test('an explicit false after full apply is still refused and keeps the actual table',async()=>{
 const h=setup();await h.c.preview(.5);h.writer=values=>{h.write(values);return false;};assert.equal(h.c.apply(),false);assert.equal(h.current.entries[0].value.start,'4.5');assert.deepEqual(h.seen.applied,[]);assert.equal(h.seen.states.at(-1).canUndo,false);
});
test('apply requires exact times and preserves current order text duration and row identity in the same post snapshot',async()=>{
 for(const change of [h=>{h.current.entries[0].value.start='4.500';},h=>{h.current.entries.reverse();},h=>{h.current.entries[0].value.text='寫入期間新文字';},h=>{h.current.duration='11';},h=>{h.current.entries[0].id='replacement';},h=>{h.current.entries.pop();}]){
  const h=setup();await h.c.preview(.5);h.writer=values=>{h.write(values);change(h);};assert.equal(h.c.apply(),false);assert.deepEqual(h.seen.applied,[]);assert.equal(h.seen.states.at(-1).canUndo,false);assert.equal(h.seen.writes,1);
 }
});
test('a failed later apply preserves an earlier undo which can still restore exact source strings',async()=>{
 const h=await applied();await h.c.preview(.5);h.writer=()=>{throw Error('合成寫入失敗');};assert.equal(h.c.apply(),false);assert.deepEqual(h.seen.applied,[.5]);assert.equal(h.seen.states.at(-1).canUndo,true);h.writer=h.write;assert.equal(h.c.undo(),true);assert.equal(h.current.entries[0].value.start,'04.000');assert.equal(h.seen.undone,1);
});
test('undo refusal or no-action retains its record and can retry with a genuine void writer',async()=>{
 for(const writer of [()=>false,()=>undefined]){const h=await applied();h.current.entries.reverse();h.current.entries[0].value.text='後續文字 🎵';h.current.duration=' 20.000 ';const before=structuredClone(h.current);h.writer=writer;assert.equal(h.c.undo(),false);assert.deepEqual(h.current,before);assert.equal(h.seen.undone,0);assert.equal(h.seen.states.at(-1).canUndo,true);h.writer=h.write;assert.equal(h.c.undo(),true);assert.equal(h.current.entries[0].value.start,'01.000');assert.equal(h.current.entries[0].value.text,'後續文字 🎵');assert.equal(h.current.duration,' 20.000 ');assert.equal(h.seen.undone,1);assert.equal(h.seen.states.at(-1).canUndo,false);}
});
test('partial undo keeps the record and refuses another write until applied times are explicitly repaired',async()=>{
 const h=await applied(),after=structuredClone(h.current);h.writer=values=>h.write(values.slice(0,1));assert.equal(h.c.undo(),false);assert.equal(h.current.entries[0].value.start,'04.000');assert.equal(h.current.entries[1].value.start,'1.5');assert.equal(h.seen.undone,0);assert.equal(h.seen.states.at(-1).canUndo,true);const writes=h.seen.writes;h.writer=h.write;assert.equal(h.c.undo(),false);assert.equal(h.seen.writes,writes);h.current.entries=after.entries;assert.equal(h.c.undo(),true);assert.equal(h.current.entries[1].value.start,'01.000');
});
test('false after an actual undo does not announce success or clear the pending record',async()=>{
 const h=await applied();h.writer=values=>{h.write(values);return false;};assert.equal(h.c.undo(),false);assert.equal(h.current.entries[0].value.start,'04.000');assert.equal(h.seen.undone,0);assert.equal(h.seen.states.at(-1).canUndo,true);const writes=h.seen.writes;assert.equal(h.c.undo(),false);assert.equal(h.seen.writes,writes);
});
test('undo requires exact original strings and a stable current text order duration and identity after writing',async()=>{
 for(const change of [h=>{h.current.entries[0].value.start='4';},h=>{h.current.entries.reverse();},h=>{h.current.entries[0].value.text='寫入期間新文字';},h=>{h.current.duration='11';},h=>{h.current.entries[0].id='replacement';},h=>{h.current.entries.pop();}]){
  const h=await applied();h.writer=values=>{h.write(values);change(h);};assert.equal(h.c.undo(),false);assert.equal(h.seen.undone,0);assert.equal(h.seen.states.at(-1).canUndo,true);assert.equal(h.seen.writes,2);
 }
});
test('reset or explicit cancel during apply cannot create an accepted record or announce application',async()=>{
 for(const method of ['reset','cancel']){const h=setup();await h.c.preview(.5);h.writer=values=>{h.write(values);h.c[method]();};assert.equal(h.c.apply(),false);assert.deepEqual(h.seen.applied,[]);assert.equal(h.seen.states.at(-1).canUndo,false);}
});
test('reset during undo is respected and the cleared record is never resurrected',async()=>{
 const h=await applied();h.writer=values=>{h.write(values);h.c.reset();};assert.equal(h.c.undo(),false);assert.equal(h.seen.undone,0);assert.equal(h.seen.states.at(-1).canUndo,false);assert.equal(h.c.undo(),false);
});
test('nested preview apply and undo during one writer start no competing request or write',async()=>{
 const h=setup();await h.c.preview(.5);let nested,entered=false;h.writer=values=>{if(entered)return false;entered=true;assert.equal(h.c.apply(),false);assert.equal(h.c.undo(),false);nested=h.c.preview(.5);h.write(values);};assert.equal(h.c.apply(),true);assert.equal(await nested,false);assert.equal(h.seen.requests,1);assert.equal(h.seen.writes,1);assert.deepEqual(h.seen.applied,[.5]);
});
