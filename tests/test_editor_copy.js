// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const P=require('../web/editor-copy.js'),H=require('../web/deletion-history.js'),E=require('../web/editor-state.js');
function value(list){return Object.fromEntries(P.specs[list].fields.map(k=>[k,k==='open'?false:k==='start'?' 00.1000 ':k==='end'?'2.0000':k==='bars'?'08':k==='energy'?'3':k==='screen_direction'?'neutral':k==='motif_id'?'motif-1':' '+k+'\r\n🎵<script>\t ']));}
const source=list=>({entries:[{id:'left',value:value(list)},{id:'source',value:value(list)},{id:'right',value:value(list)}],visible:true,busy:false});
function draft(){const panels=Object.fromEntries(Object.entries(E.draftFields).map(([scope,keys])=>[scope,{fields:Object.fromEntries(keys.map(k=>[k,''])),...(E.draftRows[scope]?{[E.draftRows[scope].key]:[]}: {})}]));panels.music.avoid=[];panels.music.deliverables=[];panels.storyboard.motifs=[{id:'motif-1',name:'母題',meaning:'原意義'}];panels.lyrics.fields['lyrics-format']='.json';panels.audio.fields['audio-profile']='distribution';return {format:'zoe-music-lab-draft',schema_version:3,tool_version:'0.97.0',saved_at:'2026-10-06T00:00:00Z',tab:'music',panels};}
function setup(list,{gate=true}={}){
 let live=source(list),reads=0,ids=0,writes=0;const events=[];
 const options={allowed:()=>gate,capture:()=>{reads++;return live;},newId:()=>{ids++;return 'copy-'+ids;},apply:(_list,entries)=>{writes++;live={...live,entries};},onCopied:(...args)=>events.push(['copied',...args]),onError:e=>events.push(['error',e.message])};
 return {options,events,controller:()=>P.createController(options),get live(){return live;},set live(v){live=v;},get reads(){return reads;},get ids(){return ids;},get writes(){return writes;}};
}
test('copy retains all original strings and IDs, inserts after its source, and isolates input and proposal',()=>{
 for(const list of Object.keys(P.specs)){const s=source(list),before=structuredClone(s),r=P.proposal(list,s,'source','new');assert.deepEqual(s,before);assert.equal(r.index,2);assert.deepEqual(r.entries.map(e=>e.id),['left','source','new','right']);assert.deepEqual(r.entries.filter(e=>e.id!=='new'),before.entries);const expected={...before.entries[1].value};if(list!=='arrangement'){expected.start='';expected.end='';}if(list==='shots')expected.open=true;assert.deepEqual(r.entries[2].value,expected);r.entries[0].value[P.specs[list].fields[0]]='later';assert.deepEqual(s,before);}
});
test('repeated song copies retain same names and incomplete numeric spelling without merging or guessing',()=>{
 const s=source('arrangement');s.entries[1].value.bars='';s.entries[1].value.energy='-1e-999';const first=P.proposal('arrangement',s,'source','new1'),next=P.proposal('arrangement',{...s,entries:first.entries},'new1','new2');assert.equal(next.entries.length,5);assert.deepEqual(next.entries[2].value,next.entries[3].value);assert.equal(next.entries[3].value.bars,'');assert.equal(next.entries[3].value.energy,'-1e-999');
});
test('incomplete clock copies are accepted as draft rows and independently deletable/restorable',()=>{
 for(const [list,scope] of [['shots','storyboard'],['cues','lyrics']]){const s=source(list),r=P.proposal(list,s,'source','new');const rows=r.entries.map(e=>Object.fromEntries(E.draftRows[scope].columns.map(k=>[k,e.value[k]])));const d=draft(),key=E.draftRows[scope].key;d.panels[scope][key]=rows;assert.deepEqual(E.validateDraft(d).panels[scope][key],rows);const removed=H.remove(r.entries,2),restored=H.restore(removed.remaining,removed.record,{limit:P.specs[list].limit});assert.deepEqual(restored.entries,r.entries);}
});
test('unknown list, source fields, value types, duplicate IDs and missing source refuse without mutation',()=>{
 for(const list of Object.keys(P.specs)){const fixtures=[{...source(list),extra:true},{...source(list),busy:0},{...source(list),entries:[{id:'same',value:value(list)},{id:'same',value:value(list)}]},{...source(list),entries:[{id:'x',value:{...value(list),extra:''}}]},{...source(list),entries:[{id:'x',value:{...value(list),[P.specs[list].fields[0]]:0}}]}];for(const s of fixtures){const before=structuredClone(s);assert.throws(()=>P.proposal(list,s,'source','new'));assert.deepEqual(s,before);}assert.throws(()=>P.proposal(list,source(list),'missing','new'));assert.throws(()=>P.proposal(list,source(list),'source','right'));}
 assert.throws(()=>P.proposal('motifs',source('shots'),'source','new'));assert.throws(()=>P.proposal('__proto__',source('shots'),'source','new'));
});
test('full capacity, busy and hidden sources refuse copies and preserve complete data',()=>{
 for(const list of Object.keys(P.specs)){for(const flags of [{busy:true},{visible:false}]){const s={...source(list),...flags},before=structuredClone(s);assert.equal(P.proposal(list,s,'source','new'),null);assert.deepEqual(s,before);}const s={...source(list),entries:Array.from({length:P.specs[list].limit},(_,i)=>({id:'r'+i,value:value(list)}))};assert.equal(P.proposal(list,s,'r0','new'),null);assert.throws(()=>P.checkedSource(list,{...s,entries:[...s.entries,{id:'overflow',value:value(list)}]}));}
});
test('controller availability gate prevents source reads, ID allocation, writes and success callbacks',()=>{
 for(const list of Object.keys(P.specs)){const s=setup(list,{gate:false}),before=structuredClone(s.live);assert.equal(s.controller().copy(list,'source'),false);assert.equal(s.reads,0);assert.equal(s.ids,0);assert.equal(s.writes,0);assert.deepEqual(s.events,[]);assert.deepEqual(s.live,before);}
});
test('controller capacity and missing source refuse before ID allocation or writes',()=>{
 for(const list of Object.keys(P.specs)){const s=setup(list);s.live.entries=Array.from({length:P.specs[list].limit},(_,i)=>({id:'r'+i,value:value(list)}));assert.equal(s.controller().copy(list,'r0'),false);assert.equal(s.ids,0);assert.equal(s.writes,0);const missing=setup(list);assert.equal(missing.controller().copy(list,'missing'),false);assert.equal(missing.ids,0);assert.equal(missing.writes,0);assert.match(missing.events[0][1],/不存在/);}
});
test('full source recheck retains intervening edits and refuses write before and after ID allocation',()=>{
 for(const list of Object.keys(P.specs)){const a=setup(list);let calls=0;a.options.capture=()=>{if(++calls===2)a.live.entries[1].value[P.specs[list].fields[0]]='new';return a.live;};assert.equal(a.controller().copy(list,'source'),false);assert.equal(a.ids,0);assert.equal(a.writes,0);assert.equal(a.live.entries[1].value[P.specs[list].fields[0]],'new');const b=setup(list);b.options.newId=()=>{b.live.entries[1].value[P.specs[list].fields[0]]='late';return 'new';};assert.equal(b.controller().copy(list,'source'),false);assert.equal(b.writes,0);assert.equal(b.live.entries[1].value[P.specs[list].fields[0]],'late');}
});
test('successful controller validates actual after and announces only the new stable row',()=>{
 for(const list of Object.keys(P.specs)){const s=setup(list),before=structuredClone(s.live),c=s.controller();assert.equal(c.copy(list,'source'),true);assert.equal(s.writes,1);assert.equal(s.ids,1);assert.deepEqual(s.live.entries.filter(e=>e.id!=='copy-1'),before.entries);assert.deepEqual(s.events,[['copied',list,{index:2,id:'copy-1'}]]);}
});
test('write failure and mismatched actual after never announce or roll back later input; dispose prevents capture',()=>{
 const a=setup('cues');a.options.apply=()=>{throw Error('write failed');};assert.equal(a.controller().copy('cues','source'),false);assert.match(a.events[0][1],/write failed/);const b=setup('shots');b.options.apply=(_l,entries)=>{b.live.entries=entries;b.live.entries[0].value.purpose='intervening';};assert.equal(b.controller().copy('shots','source'),false);assert.equal(b.live.entries[0].value.purpose,'intervening');assert.equal(b.events.some(e=>e[0]==='copied'),false);const d=setup('arrangement'),c=d.controller();c.dispose();assert.equal(c.copy('arrangement','source'),false);assert.equal(d.reads,0);
});
