// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),O=require('../web/entry-order.js'),P=require('../web/editor-position.js'),M=require('../web/music-arrangement.js'),E=require('../web/editor-order.js'),C=require('../web/editor-copy.js');
const raw=(ids=['a','b','c','d'],selected='b',position='4')=>({ids,selected,position,visible:true,busy:false});
test('specified insertion covers every source and destination, preserving relative order, isolation and an exact inverse',()=>{
 const ids=['__proto__','constructor','a','b','c'];for(let from=0;from<ids.length;from++)for(let to=0;to<ids.length;to++){const p=O.moveTo(ids,ids[from],to);if(from===to){assert.equal(p,null);continue;}const expected=ids.filter((_,i)=>i!==from);expected.splice(to,0,ids[from]);assert.deepEqual(p.ids,expected);assert.deepEqual(O.restore(p.ids,p.record),ids);p.ids[0]='changed';assert.deepEqual(p.record.after,expected);assert.deepEqual(ids,['__proto__','constructor','a','b','c']);}
 const many=Array.from({length:10000},(_,i)=>'r'+i),p=O.moveTo(many,'r9999',0);assert.equal(p.ids[0],'r9999');assert.deepEqual(O.restore(p.ids,p.record),many);
});
test('insertion refuses invalid indexes IDs and sparse or forged inverse history',()=>{
 for(const i of [-1,4,1.5,'1',true,NaN,Infinity,Number.MAX_SAFE_INTEGER+1])assert.throws(()=>O.moveTo(['a','b','c','d'],'b',i));assert.throws(()=>O.moveTo(['a','b'],'missing',0));
 const p=O.moveTo(['a','b','c','d'],'d',0);for(const edit of [r=>delete r.before[1],r=>delete r.after[2],r=>r.before[1]='foreign',r=>r.from=0,r=>r.to=1,r=>r.after.reverse(),r=>r.before=['d','b','c','a']]){const r=structuredClone(p.record);edit(r);assert.throws(()=>O.restore(p.ids,r));}
});
test('one-based raw position distinguishes blank current valid integers and invalid decimal or out-of-range input',()=>{
 for(const list of P.lists){for(const text of ['', '  '])assert.equal(P.view(list,raw(undefined,'b',text)).status,'blank');for(const text of ['2','0002',' 2 '])assert.equal(P.view(list,raw(undefined,'b',text)).status,'current');for(const text of ['4','0004',' 4 ']){const v=P.view(list,raw(undefined,'b',text));assert.equal(v.index,3);assert.equal(v.canMove,true);}for(const text of ['0','5','-1','1.0','1e0','+1','１','Infinity','1\n2','999999999999999999']){const v=P.view(list,raw(undefined,'b',text));assert.equal(v.invalid,true);assert.equal(v.canMove,false);}}
});
test('position sources enforce exact metadata dense unique IDs capacities and known lists without altering callers',()=>{
 const s=raw(),before=structuredClone(s),p=P.proposal('shots',s);assert.deepEqual(s,before);assert.deepEqual(p.afterIds,['a','c','d','b']);p.afterIds[0]='changed';p.before.ids[0]='changed';assert.deepEqual(s,before);
 for(const value of [null,{},[],{...s,extra:true},{...s,position:1},{...s,position:'1'.repeat(33)},{...s,selected:'gone'},{...s,ids:['a','a']},{...s,ids:new Array(1)},{...s,visible:1},{...s,busy:0}])assert.throws(()=>P.source('shots',value));assert.throws(()=>P.source('unknown',s));
 for(const [list,limit] of [['arrangement',40],['shots',1000],['cues',10000]])assert.throws(()=>P.source(list,raw(Array.from({length:limit+1},(_,i)=>'r'+i),'r0','2')));
});
test('blank empty hidden busy current positions create no movement proposal',()=>{for(const s of [raw([],'','1'),raw(undefined,'','1'),raw(undefined,'b',''),raw(undefined,'b','2'),{...raw(),busy:true},{...raw(),visible:false}])assert.equal(P.proposal('shots',s),null);});
test('position controller checks current metadata and exact actual-after before success notification',()=>{
 let s=raw(),reads=0,writes=0;const events=[],c=P.createController({allowed:()=>true,capture:()=>{reads++;return s;},moveTarget:p=>{writes++;s={...s,ids:[...p.afterIds]};return true;},onMoved:p=>events.push(p)});assert.equal(c.request('shots'),true);assert.equal(reads,3);assert.equal(writes,1);assert.deepEqual(events,[{list:'shots',id:'b',index:3,from:1}]);c.dispose();assert.equal(c.request('shots'),false);assert.equal(reads,3);
});
test('position controller ignores metadata races and gates before reading or writing any source',()=>{
 for(const mode of ['busy','selection','position','order','hidden']){let reads=0,writes=0,s=raw();const c=P.createController({allowed:()=>true,capture:()=>{reads++;if(reads===2){if(mode==='busy')s.busy=true;if(mode==='hidden')s.visible=false;if(mode==='selection')s.selected='a';if(mode==='position')s.position='3';if(mode==='order')s.ids.reverse();}return s;},moveTarget:()=>{writes++;return true;}});assert.equal(c.request('shots'),false);assert.equal(writes,0);}
 let reads=0;const c=P.createController({allowed:()=>false,capture:()=>{reads++;throw Error();},moveTarget:()=>assert.fail()});assert.equal(c.request('cues'),false);assert.equal(c.request('unknown'),false);assert.equal(reads,0);
});
test('wrong writer results or changed destination and selection never emit position success or roll back external changes',()=>{
 for(const mode of ['false','wrong-order','position','selected','busy']){let s=raw(),events=0;const c=P.createController({allowed:()=>true,capture:()=>s,moveTarget:p=>{s={...s,ids:mode==='wrong-order'?p.afterIds.toReversed():[...p.afterIds]};if(mode==='position')s.position='3';if(mode==='selected')s.selected='a';if(mode==='busy')s.busy=true;return mode!=='false';},onMoved:()=>events++});assert.equal(c.request('shots'),false);assert.equal(events,0);assert.notDeepEqual(s.ids,['a','b','c','d']);}
});
const song=()=>Array.from({length:6},(_,i)=>({id:'r'+i,value:Object.fromEntries(['name','bars','energy','focus','texture'].map(k=>[k,' 原文\r\n🎵\t'+k+i]))}));
test('music arbitrary position uses original strings and undo keeps later edits while a no-op keeps the previous record',()=>{
 let rows=song();const original=structuredClone(rows),c=M.createController({capture:()=>rows,apply:v=>rows=v});c.moveTo('r5',0);assert.deepEqual(rows,[original[5],...original.slice(0,5)]);assert.equal(c.moveTo('r5',0),null);assert.equal(c.refresh().canUndo,true);rows[0].value.focus='後來原文\r\n🎵';c.undo();assert.equal(rows[5].value.focus,'後來原文\r\n🎵');assert.deepEqual(rows.slice(0,5),original.slice(0,5));assert.equal(c.refresh().canUndo,false);
});
test('music movement detects complete source races before apply and mismatched writes before recording undo',()=>{
 for(const mode of ['before','after']){let rows=song(),reads=0,writes=0;const c=M.createController({capture:()=>{reads++;if(mode==='before'&&reads===2)rows[1].value.texture='外部新編修';return rows;},apply:v=>{writes++;rows=v;if(mode==='after')rows[1].value.texture='外部新編修';}});assert.throws(()=>c.moveTo('r5',0));assert.equal(writes,mode==='before'?0:1);assert.equal(c.refresh().canUndo,false);assert.equal(rows[1].value.texture,'外部新編修');}
});
test('song undo checks current raw source and actual-after without deleting later external values',()=>{
 let rows=song(),bad=false;const c=M.createController({capture:()=>rows,apply:v=>{rows=v;if(bad)rows[1].value.focus='外部撤回時編修';}});c.moveTo('r5',0);bad=true;assert.throws(()=>c.undo());assert.equal(rows[1].value.focus,'外部撤回時編修');assert.equal(c.refresh().canUndo,false);
});
test('storyboard and cue destination movement share full raw source guards and latest inverse with adjacent movement',()=>{
 for(const list of ['shots','cues']){let entries=Array.from({length:5},(_,i)=>({id:'r'+i,value:Object.fromEntries(C.specs[list].fields.map(k=>[k,k==='open'?i%2===0:' 原文\r\n🎵\t'+k+i]))}));const original=structuredClone(entries);const c=E.createController({allowed:()=>true,capture:()=>({entries,visible:true,busy:false}),apply:(_list,v)=>entries=v,onError:e=>{throw e;}});assert.equal(c.moveTo(list,'r4',0).index,0);assert.deepEqual(entries,[original[4],...original.slice(0,4)]);assert.equal(c.moveTo(list,'r4',0),null);entries[0].value[list==='shots'?'camera':'text']='後來編修🎵';assert.equal(c.undo(list).index,4);assert.equal(entries[4].value[list==='shots'?'camera':'text'],'後來編修🎵');assert.deepEqual(entries.slice(0,4),original.slice(0,4));c.move(list,'r4',-1);assert.equal(c.undo(list).index,4);}
});
test('raw ordering entry guards reject sparse creative arrays before new destination mapping',()=>{
 const rows=song();delete rows[2];assert.throws(()=>M.moveTo(rows,'r5',0));for(const list of ['shots','cues'])assert.throws(()=>C.checkedSource(list,{entries:new Array(1),visible:true,busy:false}));
});
