// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {stamp,playableCues}=require('../web/cue-stamp.js'),Editor=require('../web/editor-state.js');
test('blank cue starts at real player position without inventing an end or altering text',()=>{
  const cue={start:'',end:'',text:'  保留  '},before=structuredClone(cue),after=stamp(cue,'start',1.2345,10);
  assert.deepEqual(after,{start:'1.235',end:'',text:'  保留  '});assert.deepEqual(cue,before);
  assert.deepEqual(stamp(after,'end',3.4565,10),{start:'1.235',end:'3.457',text:'  保留  '});
});
test('zero start and actual audio end are allowed, no start at the end',()=>{
  assert.deepEqual(stamp({start:'',end:'',text:'x'},'start',0,10),{start:'0',end:'',text:'x'});
  assert.equal(stamp({start:'0',end:'',text:'x'},'end',10,10).end,'10');assert.throws(()=>stamp({start:'',end:'',text:'x'},'start',10,10));
});
test('end before start missing start and invalid player clocks preserve source',()=>{
  const cue={start:'2',end:'5',text:'x'},before=structuredClone(cue);
  for(const position of [NaN,Infinity,-1,true,null,'',11])assert.throws(()=>stamp(cue,'start',position,10));
  for(const duration of [NaN,Infinity,0,-1,true,null,''])assert.throws(()=>stamp(cue,'start',1,duration));
  assert.throws(()=>stamp(cue,'end',2,10));assert.throws(()=>stamp({start:'',end:'',text:'x'},'end',1,10));
  assert.throws(()=>stamp(cue,'start',5,10));assert.deepEqual(cue,before);
});
test('whole cue movement preserves millisecond length and refuses running past media',()=>{
  const cue={start:'1.235',end:'3.457',text:'原文'};assert.deepEqual(stamp(cue,'move',4.0005,10),{start:'4.001',end:'6.223',text:'原文'});
  assert.throws(()=>stamp(cue,'move',8,10),/超過/);assert.throws(()=>stamp({start:'',end:'',text:'x'},'move',2,10));
  assert.equal(cue.start,'1.235');assert.equal(cue.end,'3.457');
});
test('bad cue or unknown action cannot mutate data',()=>{
  for(const [cue,action] of [[null,'start'],[{text:1},'start'],[{text:'x'},'guess']])assert.throws(()=>stamp(cue,action,0,10));
});
test('completed rows stay playable while other rows remain untimed, invalid or reversed',()=>{
  const rows=[{start:'0',end:'2',text:'已校時'},{start:'',end:'',text:'未校時'},{start:'NaN',end:'4',text:'錯誤'},{start:'4',end:'3',text:'顛倒'}],before=structuredClone(rows);
  const playable=playableCues(rows);assert.equal(Editor.activeCueIndex(playable,1),0);assert.equal(Editor.activeCueIndex(playable,3.5),-1);
  assert.ok(Number.isNaN(playable[1].start));assert.deepEqual(rows,before);
});
