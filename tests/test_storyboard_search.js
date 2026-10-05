// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const P=require('../musiclab/assets/storyboard-search.js'),C=require('../web/storyboard-search-controller.js'),D=require('../web/storyboard-search-dom.js');
const hash=b=>crypto.createHash('sha256').update(b).digest('hex'),search=p=>P.search(p,{hash});
const shot=(patch={})=>({...Object.fromEntries(P.fields.map(k=>[k,''])),...patch});
const wire=d=>({data:d,files:{'storyboard-search.json':JSON.stringify(d),'storyboard-search.md':P.markdown(d)},meta:{version:'0.92.0',protocol_version:1,needs_review:true}});
function harness({defer=false}={}){const s={ids:Array.from({length:45},(_,i)=>'id'+i),shots:Array.from({length:45},()=>shot({visual:'原文 🎵'})),visible:true,busy:false,resultRevision:0},pending=[],reports=[],errors=[],effects=[];const c=C.createController({version:'0.92.0',capture:()=>s,search,request:async p=>{const r=wire(await search(p));return defer?new Promise(resolve=>pending.push(()=>resolve(r))):r;},focusTarget:t=>{effects.push(t);return true;},onReport:(d,f)=>reports.push({d,f}),onError:e=>errors.push(e)});return {s,c,pending,reports,errors,effects};}
test('all declared fields are searchable with exact Unicode first field and UTF8 positions',async()=>{
 for(const field of P.fields){const shots=[shot({[field]:'🎵 A 原文 原文\r\n\x00é e\u0301'}),shot()],before=structuredClone(shots);for(const query of ['原文','🎵','A','a','\r\n','\x00','é','e\u0301','.*']){const d=await search({shots,query}),pos=Buffer.from(shots[0][field]).indexOf(Buffer.from(query));assert.deepEqual(d.matches,pos<0?[]:[{row:1,field,start_byte:pos,end_byte:pos+Buffer.byteLength(query),text:shots[0][field]}]);assert.deepEqual(shots,before);}}
 const d=await search({shots:[shot({visual:'hit',camera:'hit'}),shot({section:'hit',visual:'hit'})],query:'hit'});assert.deepEqual(d.matches.map(h=>h.field),['visual','section']);assert.equal(d.total_matched_rows,2);
});
test('paging retains original rows duplicates pin and end boundary',async()=>{
 const shots=[shot(),...Array.from({length:45},()=>shot({camera:'hit'}))],first=await search({shots,query:'hit'});let d=first,hits=[];while(true){hits.push(...d.matches);if(d.next_row===null)break;d=await search({shots,query:'hit',start_row:d.next_row,source_sha256:first.source_sha256});}assert.deepEqual(hits.map(h=>h.row),Array.from({length:45},(_,i)=>i+2));assert.deepEqual((await search({shots,query:'hit',start_row:47,source_sha256:first.source_sha256})).matches,[]);
 await assert.rejects(search({shots,query:'hit',start_row:2}));shots[0].change_reason='changed';await assert.rejects(search({shots,query:'hit',source_sha256:first.source_sha256}));
});
test('strict shape rejects paths clocks malformed Unicode unknown fields and limits',async()=>{
 const good={shots:[shot({visual:'a'})],query:'a'};for(const patch of [{path:'x'},{panel:{}},{shots:null},{shots:[shot({extra:''})]},{shots:[shot({start:'0'})]},{shots:[shot({visual:'\ud800'})]},{shots:[shot({visual:'a'.repeat(2001)})]},{query:''},{query:'🎵'.repeat(257)},{start_row:true},{start_row:null},{start_row:undefined},{max_results:51},{source_sha256:null},{source_sha256:'a'.repeat(64)+'\n'}])await assert.rejects(search({...good,...patch}));
 assert.throws(()=>P.checkedShots(Array(1001).fill(shot())));assert.throws(()=>P.checkedShots(Array.from({length:132},()=>shot({visual:'🎵'.repeat(2000)}))));assert.equal((await search({shots:[],query:'x'})).source_bytes,2);
});
test('hash isolates nested source and query and ignores input key insertion order',async()=>{
 let resolve;const p={shots:[shot({visual:'a'})],query:'a'},wait=P.search(p,{hash:b=>new Promise(r=>resolve=()=>r(hash(b)))});p.shots[0].visual='b';p.query='b';resolve();const d=await wait;assert.equal(d.matches[0].text,'a');assert.equal(d.query,'a');const reversed=Object.fromEntries(Object.entries(shot({visual:'a'})).reverse());assert.equal((await search({shots:[reversed],query:'a'})).source_sha256,d.source_sha256);
 await assert.rejects(P.search({shots:[],query:'x'},{hash:()=>null}));
});
test('complete reply rejects unknown versions source data files JSON and Markdown mismatches',async()=>{
 const d=await search({shots:[shot({camera:'原文'})],query:'原文'}),r=wire(d);assert.deepEqual(P.checkedReply(r,d,'0.92.0'),d);for(const mutate of [r=>r.meta.version='0.93.0',r=>r.meta.protocol_version=2,r=>r.meta.needs_review=false,r=>r.data.matches[0].field='visual',r=>r.data.extra=true,r=>r.files['storyboard-search.json']='{}',r=>r.files['storyboard-search.json']='{"format":"x","format":"x"}',r=>r.files['storyboard-search.md']+='x',r=>r.files.extra='x']){const bad=structuredClone(r);mutate(bad);assert.throws(()=>P.checkedReply(bad,d,'0.92.0'));}const copy=P.checkedReply(r,d,'0.92.0');copy.matches[0].text='changed';assert.equal(d.matches[0].text,'原文');
});
test('controller next previous and literal field focus use stable source IDs',async()=>{
 const h=harness();h.c.setQuery('原文');assert.equal(await h.c.find(),true);assert.equal(await h.c.next(),true);assert.equal(h.c.view().startRow,21);assert.equal(h.c.focus(0),true);assert.deepEqual(h.effects[0],{id:'id20',index:20,field:'visual',text:'原文 🎵'});assert.equal(await h.c.previous(),true);assert.equal(h.c.view().startRow,1);assert.equal(h.c.focus(-1),false);
});
test('original field order row identity deletion and query changes clear old focus and pager',async()=>{
 for(const mutate of [h=>h.s.shots[0].camera='changed',h=>h.s.ids[0]='new',h=>h.s.ids.reverse(),h=>{h.s.ids.pop();h.s.shots.pop();},h=>h.c.setQuery('🎵'),h=>h.c.clear()]){const h=harness();h.c.setQuery('原文');await h.c.find();mutate(h);h.c.refresh();assert.equal(h.c.view().matches.length,0);assert.equal(h.c.focus(0),false);assert.equal(await h.c.next(),false);}
});
test('late replies do not replace edited source changed query hidden busy or another report',async()=>{
 for(const mutate of [h=>h.s.shots[0].visual='changed',h=>h.c.setQuery('🎵'),h=>h.s.visible=false,h=>h.s.busy=true,h=>h.s.resultRevision++]){const h=harness({defer:true});h.c.setQuery('原文');const p=h.c.find();await new Promise(setImmediate);mutate(h);h.c.refresh();h.pending[0]();assert.equal(await p,false);assert.equal(h.reports.length,0);assert.equal(h.errors.length,0);assert.equal(h.c.view().pending,false);}
});
test('DTO and callback copies do not corrupt retained result or native focus target',async()=>{
 const h=harness();h.c.setQuery('原文');await h.c.find();h.reports[0].d.matches[0].field='camera';h.c.view().matches[0].text='x';assert.equal(h.c.focus(0),true);assert.equal(h.effects[0].field,'visual');assert.equal(h.effects[0].text,'原文 🎵');
});
test('malformed snapshots hidden and busy stop requests and focus',async()=>{
 for(const patch of [{ids:['a','a'],shots:[shot(),shot()]},{ids:['a'],shots:[]},{shots:[{}],ids:['a']},{resultRevision:-1},{extra:1}])assert.throws(()=>C.snapshot({ids:[],shots:[],busy:false,visible:true,resultRevision:0,...patch}));for(const key of ['busy','visible']){const h=harness();h.c.setQuery('原文');await h.c.find();h.s[key]=key==='busy';assert.equal(h.c.focus(0),false);assert.equal(await h.c.find(),false);}
});
test('empty query errors can recover and no match remains explicit',async()=>{
 const h=harness();h.c.setQuery('not found');await h.c.find();assert.match(h.c.view().message,/沒有符合/);assert.equal(h.c.view().canNext,false);h.c.setQuery('');assert.equal(await h.c.find(),false);h.c.setQuery('原文');assert.equal(await h.c.find(),true);
});
test('fixed modules load before app and view controls remain outside drafts with bounded literal labels',()=>{
 const html=require('node:fs').readFileSync('web/index.html','utf8');for(const name of ['storyboard-search.js','storyboard-search-controller.js','storyboard-search-dom.js'])assert.ok(html.indexOf('/'+name)<html.indexOf('/app.js'));assert.match(html,/id="storyboard-search-query"[^>]*data-view-control="true"/);assert.equal(D.caption('<script>\r\n\x00🎵'),'<script>␍↵�🎵');assert.equal(Array.from(D.caption('🎵'.repeat(101))).length,101);
});
