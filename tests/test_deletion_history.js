// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {remove,effects,restore,createHistory}=require('../web/deletion-history.js');
const {compactShotTimes,nextMotifId}=require('../web/editor-state.js');
const entry=(id,value)=>({id,value});

test('deleted raw row returns between stable neighbours while subsequent edits and additions survive',()=>{
  const before=[entry('a',{name:'一',bars:''}),entry('b',{name:'二\n原文',bars:'08'}),entry('c',{name:'三',bars:'4'})];
  const original=structuredClone(before),{remaining,record}=remove(before,1);
  remaining[1].value.name='三的後續編修';remaining.push(entry('d',{name:'新增',bars:''}));
  const result=restore(remaining,record);
  assert.deepEqual(before,original);assert.deepEqual(result.entries.map(e=>e.id),['a','b','c','d']);
  assert.deepEqual(result.entries[1].value,{name:'二\n原文',bars:'08'});
  assert.equal(result.entries[2].value.name,'三的後續編修');assert.equal(result.entries[3].value.bars,'');
  result.entries[1].value.name='修改還原結果';assert.equal(record.entry.value.name,'二\n原文');
});

test('duplicate text rows and blank requirement strings retain separate identities',()=>{
  const {remaining,record}=remove([entry('a','同文'),entry('b',''),entry('c','同文')],1);
  remaining[0].value='後續修改';
  assert.deepEqual(restore(remaining,record).entries,[entry('a','後續修改'),entry('b',''),entry('c','同文')]);
});

test('boundary deletions, empty lists and missing anchors have deterministic insertion',()=>{
  for(const index of [0,1,2]){
    const rows=[entry('a','A'),entry('b','B'),entry('c','C')],{remaining,record}=remove(rows,index);
    assert.deepEqual(restore(remaining,record).entries,rows);
  }
  const {record}=remove([entry('a','A')],0);
  assert.deepEqual(restore([],record).entries,[entry('a','A')]);
  const middle=remove([entry('a','A'),entry('b','B'),entry('c','C')],1).record;
  assert.deepEqual(restore([entry('x','X')],middle).entries,[entry('x','X'),entry('b','B')]);
});

test('shot automatic time changes and total undo exactly without reverting later text or open state',()=>{
  const before=[entry('a',{start:'0',end:'6',visual:'甲',open:true}),entry('b',{start:'6',end:'12',visual:'乙',open:false}),entry('c',{start:'12',end:'18',visual:'丙',open:false})];
  const removed=remove(before,1),compact=compactShotTimes(removed.remaining.map(e=>e.value));
  const after=removed.remaining.map((e,i)=>({...e,value:compact[i]}));
  const record=effects(removed.record,before,after,['start','end'],{duration:'18'},{duration:'12'});
  after[1].value.visual='新的畫面';after[1].value.open=true;
  const restored=restore(after,record,{fields:{duration:'12'}});
  assert.deepEqual(restored.entries.map(e=>[e.value.start,e.value.end]),[['0','6'],['6','12'],['12','18']]);
  assert.equal(restored.entries[2].value.visual,'新的畫面');assert.equal(restored.entries[2].value.open,true);
  assert.equal(restored.entries[1].value.open,false);assert.equal(restored.fields.duration,'18');assert.deepEqual(restored.kept,[]);
});

test('manual time changes including intentional blanks survive automatic-time undo',()=>{
  const before=[entry('a',{start:'0',end:'6'}),entry('b',{start:'6',end:'12'}),entry('c',{start:'12',end:'18'})];
  const removed=remove(before,1),after=removed.remaining.map((e,i)=>({...e,value:compactShotTimes(removed.remaining.map(x=>x.value))[i]}));
  const record=effects(removed.record,before,after,['start','end'],{duration:'18'},{duration:'12'});
  after[1].value.start='';after[1].value.end='25';after.push(entry('d',{start:'25',end:'30'}));
  const result=restore(after,record,{fields:{duration:'30'}});
  assert.deepEqual(result.entries[2].value,{start:'',end:'25'});assert.equal(result.fields.duration,'30');
  assert.deepEqual(result.entries[3],entry('d',{start:'25',end:'30'}));assert.equal(result.kept.length,3);
});

test('incomplete shot deleted before compaction returns raw blanks and originals',()=>{
  const before=[entry('a',{start:'',end:'',visual:'尚未校時'}),entry('b',{start:'10',end:'15',visual:'保留'})];
  const removed=remove(before,0),after=[entry('b',compactShotTimes(removed.remaining.map(e=>e.value))[0])];
  const record=effects(removed.record,before,after,['start','end'],{duration:'15'},{duration:'5'});
  assert.deepEqual(restore(after,record,{fields:{duration:'5'}}).entries,before);
});

test('history is bounded, isolated, immutable and clearing a replaced panel preserves others',()=>{
  const history=createHistory(2),make=(id,list)=>({...remove([entry(id,{text:id})],0).record,list});
  const first=make('a','motifs');history.push('storyboard',first);first.entry.value.text='污染';
  assert.equal(history.peek('storyboard').entry.value.text,'a');
  history.push('music',make('m','arrangement'));history.push('storyboard',make('b','shots'));history.push('storyboard',make('c','motifs'));
  assert.equal(history.size('storyboard'),2);assert.deepEqual(history.reserved('storyboard','motifs'),['c']);
  const copy=history.peek('storyboard');copy.entry.value.text='污染';assert.equal(history.pop('storyboard').entry.value.text,'c');
  assert.equal(history.peek('storyboard').entry.id,'b');history.clear('storyboard');
  assert.equal(history.size('storyboard'),0);assert.equal(history.size('music'),1);
});

test('deleted motif IDs are reserved so new motifs cannot capture the old shot reference',()=>{
  const history=createHistory(),record={...remove([entry('motif-2',{id:'motif-2',name:'舊物',meaning:'原意'})],0).record,list:'motifs'};
  history.push('storyboard',record);
  const active=[{id:'motif-1'}],next=nextMotifId([...active,...history.reserved('storyboard','motifs').map(id=>({id}))]);
  assert.equal(next,'motif-3');
  assert.equal(restore([entry('motif-1',active[0]),entry(next,{id:next})],record).entries.filter(e=>e.id==='motif-2').length,1);
});

test('capacity and identity refusal leave live rows and pending history untouched',()=>{
  const history=createHistory(),{record}=remove([entry('a','A')],0);history.push('music',record);
  const live=[entry('b','B')],original=structuredClone(live);
  assert.throws(()=>restore(live,history.peek('music'),{limit:1}),/上限/);
  assert.deepEqual(live,original);assert.equal(history.size('music'),1);
  assert.throws(()=>restore([entry('a','新的 A')],record),/已存在/);
  assert.throws(()=>remove([entry('a',0),entry('a',1)],0),/識別/);
  assert.throws(()=>remove(live,-1),/找不到/);
});

test('sequential deletions undo in reverse order and preserve edits to surviving rows',()=>{
  const history=createHistory(),original=[entry('a','A'),entry('b','B'),entry('c','C'),entry('d','D')];
  let live=original;
  for(const index of [1,1,0]){const deleted=remove(live,index);history.push('music',deleted.record);live=deleted.remaining;}
  live[0].value='D 後續編修';
  while(history.size('music')){live=restore(live,history.peek('music')).entries;history.pop('music');}
  assert.deepEqual(live,[entry('a','A'),entry('b','B'),entry('c','C'),entry('d','D 後續編修')]);
});

test('at capacity an older chosen deletion can return after another row is removed',()=>{
  const history=createHistory(),first=remove([entry('a','A'),entry('b','B')],0);
  history.push('music',first.record);
  let live=[...first.remaining,entry('c','新 C')];
  assert.throws(()=>restore(live,history.at('music',0),{limit:2}),/上限/);
  const second=remove(live,1);history.push('music',second.record);live=second.remaining;
  live=restore(live,history.at('music',0),{limit:2}).entries;history.drop('music',0);
  assert.deepEqual(live,[entry('a','A'),entry('b','B')]);assert.equal(history.size('music'),1);
  assert.equal(history.at('music',0).entry.value,'新 C');
  const snapshot=history.entries('music');snapshot[0].entry.value='污染';
  assert.equal(history.at('music',0).entry.value,'新 C');
});
