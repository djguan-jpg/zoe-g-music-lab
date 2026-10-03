// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const A=require('../web/music-arrangement.js'),History=require('../web/deletion-history.js');
function rows(n=4){return Array.from({length:n},(_,i)=>({id:'row-'+i,value:{name:i%2?'同名':'',bars:'08',energy:'03',focus:' 原文\n保留 ',texture:''}}));}
function setup(n=4){let entries=rows(n),writes=0;const states=[];const c=A.createController({capture:()=>entries,apply:e=>{entries=e;writes++;},onState:s=>states.push(s)});return {c,states,get entries(){return entries;},set entries(e){entries=e;},get writes(){return writes;}};}
test('stable identity moves adjacent rows with duplicate names blank raw fields and no mutation',()=>{
  const r=rows(),before=structuredClone(r),p=A.move(r,'row-2',-1);assert.deepEqual(p.entries.map(e=>e.id),['row-0','row-2','row-1','row-3']);assert.deepEqual(r,before);
  assert.deepEqual(p.entries[1].value,before[2].value);p.entries[1].value.name='later';assert.equal(r[2].value.name,'');assert.deepEqual(p.record.before,r.map(e=>e.id));
});
test('every adjacent move and inverse keeps all forty rows and raw values',()=>{
  const r=rows(40);for(let i=0;i<r.length;i++)for(const d of [-1,1])if(i+d>=0&&i+d<r.length){const p=A.move(r,r[i].id,d);assert.equal(p.entries.length,40);assert.deepEqual(A.restore(p.entries,p.record),r);}
});
test('empty single-row boundaries invalid direction and unknown identity cannot write',()=>{
  for(const [n,id,d] of [[0,'row-0',1],[1,'row-0',1],[1,'row-0',-1],[4,'row-0',-1],[4,'row-3',1],[4,'missing',-1],[4,'row-1',0],[4,'row-1',1.1],[4,'row-1','1']]){
    const s=setup(n),before=structuredClone(s.entries);assert.throws(()=>s.c.move(id,d));assert.deepEqual(s.entries,before);assert.equal(s.writes,0);
  }
});
test('bad identity shape and over-limit rows are refused before reordering',()=>{
  for(const edit of [r=>r.push({...r[0]}),r=>r[0].id='',r=>r[0].value=null,r=>r[0].value.bars=8,r=>r[0].value.extra='',r=>r[0].value=[],r=>r.push(...rows(40))]){const r=rows();edit(r);assert.throws(()=>A.move(r,'row-1',-1));}
});
test('object-looking identities are ordinary Map keys',()=>{
  const r=rows(2);r[0].id='__proto__';r[1].id='constructor';const p=A.move(r,'__proto__',1);assert.deepEqual(A.restore(p.entries,p.record),r);
});
test('undo reads current values and preserves edits to moved and displaced rows',()=>{
  const s=setup();s.c.move('row-2',-1);s.entries[1].value.focus='後續編修';s.entries[2].value.bars='016';s.entries[0].value.texture='新的聲音';assert.equal(s.c.refresh().canUndo,true);s.c.undo();
  assert.deepEqual(s.entries.map(e=>e.id),rows().map(e=>e.id));assert.equal(s.entries[2].value.focus,'後續編修');assert.equal(s.entries[1].value.bars,'016');assert.equal(s.entries[0].value.texture,'新的聲音');assert.equal(s.c.refresh().canUndo,false);
});
test('only the latest move is undoable and previous field edits remain',()=>{
  const s=setup();s.c.move('row-2',-1);const first=s.entries.map(e=>e.id);s.c.move('row-2',-1);s.c.undo();assert.deepEqual(s.entries.map(e=>e.id),first);assert.throws(()=>s.c.undo());
});
test('silent structural changes are checked again by undo and invalidate old order permanently',()=>{
  for(const edit of [r=>r.reverse(),r=>r.pop(),r=>r.push(rows(1)[0]),r=>r[0].id='new-identity']){
    const s=setup();s.c.move('row-2',-1);edit(s.entries);const before=structuredClone(s.entries);assert.throws(()=>s.c.undo());assert.deepEqual(s.entries,before);assert.equal(s.writes,1);assert.equal(s.states.at(-1).stale,true);
  }
  const s=setup();s.c.move('row-2',-1);const after=structuredClone(s.entries);s.entries.pop();s.c.refresh();s.entries=after;assert.equal(s.c.refresh().canUndo,false);
});
test('deletion restoration stays independent and later structural restoration cancels move undo',()=>{
  const s=setup(),deleted=History.remove(s.entries,1);s.entries=deleted.remaining;s.c.move('row-2',-1);s.entries[0].value.texture='保留';s.entries=History.restore(s.entries,deleted.record,{limit:40}).entries;
  assert.equal(s.c.refresh().canUndo,false);assert.equal(s.entries.find(e=>e.id==='row-2').value.texture,'保留');assert.equal(s.entries.find(e=>e.id==='row-1').value.name,'同名');
});
test('clear discards transient undo without changing current ordered values',()=>{
  const s=setup();s.c.move('row-2',-1);const before=structuredClone(s.entries);s.c.clear();assert.deepEqual(s.entries,before);assert.equal(s.c.refresh().canUndo,false);assert.equal(s.c.refresh().stale,false);
});
test('published state cannot modify controller history and unrelated fields do not invalidate it',()=>{
  const s=setup(),v=s.c.move('row-2',-1);v.record.before.reverse();v.ids.reverse();s.states.at(-1).record.after.reverse();const unrelated={musicTitle:'later',media:{id:1},storyboard:['unchanged']};s.c.undo();assert.deepEqual(s.entries,rows());assert.equal(unrelated.media.id,1);
});
test('forged move records cannot replace the original order',()=>{
  const p=A.move(rows(),'row-2',-1);for(const edit of [r=>r.before.reverse(),r=>r.before.push('bad'),r=>r.from=0,r=>r.to=99,r=>r.id='bad',r=>r.after.reverse()]){const r=structuredClone(p.record);edit(r);assert.throws(()=>A.restore(p.entries,r));}
});
test('actual DOM move handler refuses busy work and marks only music dirty while retaining selection focus',()=>{
  const source=fs.readFileSync('web/app.js','utf8'),start=source.indexOf('function moveMusicSection('),end=source.indexOf("$('section-order').onchange",start);const s=setup(),events=[],elements={'section-order':{value:'row-2',focus:()=>events.push('select')},'section-earlier':{disabled:false,focus:()=>events.push('earlier')}};
  const ctx={state:{busy:true},$:id=>elements[id],arrangementController:s.c,markDirty:scope=>events.push(scope),say:text=>events.push(text)};vm.createContext(ctx);vm.runInContext(source.slice(start,end),ctx);ctx.moveMusicSection(-1);assert.equal(s.writes,0);assert.match(events.pop(),/尚未完成/);
  ctx.state.busy=false;ctx.moveMusicSection(-1);assert.equal(s.writes,1);assert.equal(elements['section-order'].value,'row-2');assert.ok(events.includes('music'));assert.equal(events.at(-1),'earlier');
});
test('actual add handler protects busy work and selects and focuses the new identity',()=>{
  const source=fs.readFileSync('web/app.js','utf8'),start=source.indexOf("$('section-add').onclick="),end=source.indexOf("$('music-form').onsubmit",start),s=setup(),button={},select={value:''},events=[];
  const ctx={$:id=>id==='section-add'?button:select,state:{busy:true},rowSequence:4,collections:{arrangement:{limit:40}},entriesFor:()=>s.entries,writeEntries:(_l,e)=>s.entries=e,markDirty:scope=>events.push(scope),focusEntry:(l,i)=>events.push([l,i]),say:t=>events.push(t)};
  vm.createContext(ctx);vm.runInContext(source.slice(start,end),ctx);button.onclick();assert.equal(s.entries.length,4);ctx.state.busy=false;button.onclick();assert.equal(s.entries.length,5);assert.equal(select.value,'row-5');assert.deepEqual(events.at(-1),['arrangement',4]);assert.equal(s.entries.at(-1).value.focus,'');
});
