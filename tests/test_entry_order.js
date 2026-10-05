// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),O=require('../web/entry-order.js');
test('ID kernel handles every adjacent move and inverse without aliasing caller or record',()=>{
 const ids=['__proto__','constructor','a','b'];for(let i=0;i<ids.length;i++)for(const d of [-1,1])if(i+d>=0&&i+d<ids.length){const plan=O.move(ids,ids[i],d);assert.deepEqual(O.restore(plan.ids,plan.record),ids);plan.ids[0]='mutated';assert.deepEqual(plan.record.after,O.move(ids,ids[i],d).ids);assert.deepEqual(ids,['__proto__','constructor','a','b']);}
});
test('bounded kernel rejects duplicate empty invalid IDs and illegal movement',()=>{
 for(const ids of [null,{},[1],[''],['a','a'],new Array(1),Array(10001).fill('a')])assert.throws(()=>O.checkedIds(ids));for(const [id,d] of [['a',-1],['b',1],['x',1],['a',0],['a','1'],['a',1.5]])assert.throws(()=>O.move(['a','b'],id,d));assert.deepEqual(O.checkedIds([]),[]);
});
test('restore verifies an actual adjacent permutation rather than trusting supplied history',()=>{
 const p=O.move(['a','b','c'],'b',1);for(const edit of [r=>r.id='a',r=>r.from=0,r=>r.to=20,r=>r.before.reverse(),r=>r.before[0]='x',r=>r.after.reverse()]){const record=structuredClone(p.record);edit(record);assert.throws(()=>O.restore(p.ids,record));}assert.throws(()=>O.restore(['c','b','a'],p.record));
});
test('ten thousand unique IDs preserve capacity and inverse membership',()=>{const ids=Array.from({length:10000},(_,i)=>'r'+i),p=O.move(ids,'r9999',-1);assert.deepEqual(O.restore(p.ids,p.record),ids);});
