// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const L=require('../web/library-search.js'),V=require('../musiclab/assets/delivery-versions.js'),F=require('./library_revision_fixture.js');
const entry=n=>({...F.revision().entry,id:'draft-'+n.toString(16).padStart(32,'0'),label:' 案🎵  '+n});
const payload=(query='案🎵',cursor=null,limit=20)=>({query,cursor,limit});
function wire(entries=[entry(3),entry(2)],options={}){
 const data={format:'zoe-draft-library-search',schema_version:1,query:'案🎵',search_sha256:'a'.repeat(64),record_count:entries.length,match_count:entries.length,start_index:0,entries,issues:[],next_cursor:null,status:'metadata_only_checksum_verified_on_read',...options};
 return {files:{},data,meta:{version:V.current,protocol_version:1,needs_review:false}};
}
const later=()=>{let resolve,reject;const promise=new Promise((a,b)=>{resolve=a;reject=b;});return {promise,resolve,reject};};
function harness(){let query='案🎵';const calls=[],ready=[],errors=[],states=[],draft={title:'後續編修'},media={name:'kept.wav'};
 const c=L.createController({capture:()=>query,request:p=>{const call={payload:p,...later()};calls.push(call);return call.promise;},onReady:(r,append)=>ready.push({r,append}),onError:e=>errors.push(e.message),onState:s=>states.push(s)});
 return {c,calls,ready,errors,states,draft,media,set:q=>query=q};
}
test('literal query codepoints Unicode whitespace and cursor are bounded and isolated',()=>{
 for(const query of ['  ','🎵'.repeat(200),'A\r\n甲'])assert.equal(L.checkedRequest(payload(query)).query,query);
 for(const value of [payload(''),payload('🎵'.repeat(201)),payload('\ud800'),payload('a',{}),payload('a',null,true),{...payload(),path:'x'}])assert.throws(()=>L.checkedRequest(value));
 const c={start_index:1,search_sha256:'a'.repeat(64)},p=payload('a',c);L.checkedRequest(p).cursor.start_index=2;assert.equal(c.start_index,1);
});
test('complete current envelope and independent schema refuse unknown fields versions files and review flags',()=>{
 assert.deepEqual(L.checkedResult(payload(),wire()),wire().data);
 for(const change of [w=>w.meta.version='99.0.0',w=>w.meta.protocol_version=2,w=>w.meta.needs_review=true,w=>w.files={'x':'y'},w=>w.extra=1,w=>w.data.schema_version=true,w=>w.data.schema_version=2,w=>w.data.status='okay',w=>w.data.extra=1,w=>w.data.search_sha256+='\n',w=>w.data.query='案']){
  const w=wire();change(w);assert.throws(()=>L.checkedResult(payload(),w));
 }
});
test('full metadata each literal match order duplicates issues and exact page counts checked',()=>{
 for(const change of [w=>w.data.entries.reverse(),w=>w.data.entries[1]=w.data.entries[0],w=>w.data.entries[0].titles.music='\udfff',w=>w.data.entries[0].library_schema_version=2,w=>w.data.record_count=1,w=>w.data.match_count=1,w=>w.data.next_cursor={start_index:1,search_sha256:'a'.repeat(64)},w=>w.data.issues=[{id:w.data.entries[0].id,error:'unreadable_revision'}],w=>w.data.issues=[{id:entry(4).id,error:'okay'}]]){
  const w=wire();change(w);assert.throws(()=>L.checkedResult(payload(),w));
 }
 const wrong=entry(3);wrong.label='wrong';wrong.titles={music:'wrong',storyboard:'wrong',lyrics:'wrong'};assert.throws(()=>L.checkedResult(payload(),wire([wrong])));
 const w=wire();const accepted=L.checkedResult(payload(),w);accepted.entries[0].titles.music='changed';assert.notEqual(w.data.entries[0].titles.music,'changed');
});
test('all four name fields match but case and whitespace are literal',()=>{
 for(const field of ['label','music','storyboard','lyrics']){
  const e=entry(1);e.label='other';e.titles={music:'other',storyboard:'other',lyrics:'other'};if(field==='label')e.label=' A 🎵 ';else e.titles[field]=' A 🎵 ';
  assert.equal(L.checkedResult(payload(' A 🎵 '),wire([e],{query:' A 🎵 '})).entries.length,1);
  for(const q of [' a 🎵 ',' A 🎵  '])assert.throws(()=>L.checkedResult(payload(q),wire([e],{query:q})));
 }
});
test('continuation pins query full observed SHA counts issues and original last boundary',()=>{
 const next={start_index:2,search_sha256:'a'.repeat(64)},first=L.checkedResult(payload('案🎵',null,2),wire([entry(4),entry(3)],{record_count:3,match_count:3,next_cursor:next}));
 const p=payload('案🎵',next,2),second=wire([entry(2)],{record_count:3,match_count:3,start_index:2});assert.equal(L.checkedResult(p,second,first).entries[0].id,entry(2).id);
 for(const change of [w=>w.data.search_sha256='b'.repeat(64),w=>w.data.record_count=4,w=>w.data.match_count=4,w=>w.data.start_index=0,w=>w.data.entries=[entry(4)],w=>w.data.issues=[{id:entry(9).id,error:'unreadable_revision'}]]){const w=structuredClone(second);change(w);assert.throws(()=>L.checkedResult(p,w,first));}
 assert.throws(()=>L.checkedResult(p,second,null));assert.throws(()=>L.checkedResult(payload('案',next,2),second,first));
});
test('empty results distinguish no matches from unreadable metadata without an empty cursor',()=>{
 const e=wire([],{record_count:4,issues:[{id:entry(8).id,error:'unreadable_revision'}]});assert.equal(L.checkedResult(payload(),e).match_count,0);
 const e2=wire([],{record_count:0});assert.equal(L.checkedResult(payload(),e2).record_count,0);
});
test('controller current error retains accepted page and same cursor healthy retry',async()=>{
 const h=harness(),entries=Array.from({length:20},(_,i)=>entry(23-i)),next={start_index:20,search_sha256:'a'.repeat(64)};
 let pending=h.c.search();h.calls[0].resolve(wire(entries,{record_count:23,match_count:23,next_cursor:next}));assert.equal(await pending,true);
 pending=h.c.search(true);assert.deepEqual(h.calls[1].payload.cursor,next);h.calls[1].resolve(wire([]));assert.equal(await pending,false);assert.equal(h.ready.length,1);assert.equal(h.c.status().canContinue,true);
 pending=h.c.search(true);assert.deepEqual(h.calls[2].payload.cursor,next);h.calls[2].resolve(wire([entry(3),entry(2),entry(1)],{record_count:23,match_count:23,start_index:20}));assert.equal(await pending,true);assert.equal(h.ready[1].append,true);assert.equal(h.c.status().canContinue,false);assert.deepEqual(h.draft,{title:'後續編修'});assert.equal(h.media.name,'kept.wav');
});
test('query edits invalidate pending success error and continuation without clearing previous results',async()=>{
 const h=harness();let pending=h.c.search();h.set('changed');h.c.invalidate();h.calls[0].resolve(wire());assert.equal(await pending,false);assert.equal(h.ready.length,0);assert.equal(h.errors.length,0);
 h.set('案🎵');pending=h.c.search();h.calls[1].resolve(wire());await pending;h.set('other');h.c.invalidate();assert.equal(h.c.status().stale,true);assert.equal(await h.c.search(true),false);assert.equal(h.ready.length,1);
 pending=h.c.search();h.set('again');h.c.invalidate();h.calls[2].reject(Error('late'));await pending;assert.equal(h.errors.length,1);
});
test('controller refuses a previous page ID even when a false reply shifts its timestamp earlier',async()=>{
 const h=harness(),entries=Array.from({length:20},(_,i)=>entry(23-i)),next={start_index:20,search_sha256:'a'.repeat(64)};
 let pending=h.c.search();h.calls[0].resolve(wire(entries,{record_count:23,match_count:23,next_cursor:next}));await pending;
 const duplicate=entry(23);duplicate.stored_at='2026-10-04T01:02:03+00:00';pending=h.c.search(true);
 h.calls[1].resolve(wire([entry(3),entry(2),duplicate],{record_count:23,match_count:23,start_index:20}));assert.equal(await pending,false);assert.equal(h.ready.length,1);assert.equal(h.errors.length,1);assert.equal(h.c.status().canContinue,true);
});
test('latest generation and cancel suppress late wrong data before validation and preserve accepted source',async()=>{
 const h=harness(),old=h.c.search(),fresh=h.c.search();h.calls[1].resolve(wire());await fresh;h.calls[0].resolve({bad:true});assert.equal(await old,false);assert.equal(h.errors.length,0);assert.equal(h.ready.length,1);
 const canceled=h.c.search();h.c.cancel();h.calls[2].reject(Error('late'));await canceled;assert.equal(h.errors.length,0);assert.equal(h.c.status().pending,false);assert.equal(h.ready.length,1);
});
test('injected app requests fixed route literal query and publishes checked page without draft replacement',async()=>{
 const source=fs.readFileSync('web/app.js','utf8'),start=source.indexOf('const librarySearch='),end=source.indexOf('const libraryController=',start);let options;const requests=[],published=[],nodes=new Map();
 const node=id=>{if(!nodes.has(id))nodes.set(id,{value:id==='library-search-query'?'案🎵':'',textContent:''});return nodes.get(id);};
 const ctx={MusicLibrarySearch:{createController:v=>(options=v)},$:node,api:(path,p)=>{requests.push({path,p});return Promise.resolve(wire());},libraryControls:()=>{},publishLibraryRecords:(r,a)=>published.push({r,a}),librarySay:()=>{},libraryRecords:[entry(3),entry(2)],libraryMode:'all'};
 vm.createContext(ctx);vm.runInContext(source.slice(start,end),ctx);assert.equal(options.capture(),'案🎵');await options.request(payload());assert.equal(requests[0].path,'/api/drafts/search');options.onReady(wire().data,false);assert.equal(ctx.libraryMode,'search');assert.equal(published.length,1);assert.match(node('library-search-status').textContent,/找到 2／2/);
 assert.ok(source.includes("libraryController.cancelList();librarySearch.search()"));assert.ok(source.includes("librarySearch.invalidate()"));assert.ok(source.includes("librarySearch.cancel();"));
});
test('search HTML script dependency fixed bounded hints and narrow literal wrapping',()=>{
 const html=fs.readFileSync('web/index.html','utf8'),css=fs.readFileSync('web/style.css','utf8');assert.ok(html.indexOf('/library-revision.js')<html.indexOf('/library-search.js'));assert.ok(html.indexOf('/library-search.js')<html.indexOf('/app.js'));
 for(const id of ['library-search-form','library-search-query','library-search','library-search-cancel','library-search-status'])assert.ok(html.includes(`id="${id}"`));assert.match(html,/aria-describedby="library-search-hint"/);assert.match(css,/#library-search-status,#library-search-hint\{overflow-wrap:anywhere;min-width:0\}/);
});
