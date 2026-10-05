// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const P=require('../musiclab/assets/lyrics-search.js'),C=require('../web/lyrics-search-controller.js'),D=require('../web/lyrics-search-dom.js');
const hash=b=>crypto.createHash('sha256').update(b).digest('hex'),search=p=>P.search(p,{hash});
const wire=d=>({data:d,files:{'lyrics-search.json':JSON.stringify(d),'lyrics-search.md':P.markdown(d)},meta:{version:'0.85.0',protocol_version:1,needs_review:true}});
test('raw Unicode controls duplicates and first occurrences retain original rows and byte positions',async()=>{
 const texts=['a🎵 原句',' 原句','a🎵 原句','','A é e\u0301\r\n\x00'],before=[...texts];
 for(const query of ['原句','🎵','a','A','aA','é','e\u0301','\r\n','\x00','.*']){const d=await search({texts,query}),expected=[];texts.forEach((text,i)=>{const raw=Buffer.from(text),start=raw.indexOf(Buffer.from(query));if(start>=0)expected.push({row:i+1,start_byte:start,end_byte:start+Buffer.byteLength(query),text});});assert.deepEqual(d.matches,expected);assert.equal(d.total_matched_rows,expected.length);assert.deepEqual(texts,before);}
 const d=await search({texts:texts.slice(0,3),query:'原句',max_results:1});assert.equal(d.source_sha256,'19903f4d2da95a18c1b46c94b1405da1776cc45c69797b19bfd7be020aa4278c');assert.equal(d.next_row,2);
});
test('source pin is mandatory for continuation and text/order changes refuse it',async()=>{
 const payload={texts:[''].concat(Array(45).fill('hit')),query:'hit'},first=await search(payload);let d=first,hits=[];
 while(true){assert.equal(d.total_matched_rows,45);hits.push(...d.matches);if(d.next_row===null)break;d=await search({...payload,start_row:d.next_row,source_sha256:first.source_sha256});}
 assert.deepEqual(hits.map(h=>h.row),Array.from({length:45},(_,i)=>i+2));await assert.rejects(search({...payload,start_row:2}));await assert.rejects(search({...payload,texts:['different',...payload.texts.slice(1)],source_sha256:first.source_sha256}));assert.deepEqual((await search({texts:[],query:'x'})).matches,[]);
});
test('strict request bounds do not accept null booleans path clocks invalid Unicode or implicit migration',async()=>{
 const good={texts:['a'],query:'a'};
 for(const patch of [{path:'x'},{cues:[]},{texts:null},{texts:['\ud800']},{texts:['x'.repeat(2001)]},{query:''},{query:'🎵'.repeat(257)},{query:null},{start_row:true},{start_row:null},{start_row:undefined},{start_row:0},{start_row:3},{max_results:null},{max_results:true},{max_results:51},{source_sha256:null},{source_sha256:'a'.repeat(64)+'\n'}])await assert.rejects(search({...good,...patch}));
 assert.equal((await search({texts:['🎵'.repeat(2000)],query:'🎵'.repeat(256)})).query_bytes,1024);assert.throws(()=>P.checkedTexts(Array(10001).fill('a')));assert.throws(()=>P.checkedTexts(Array(263).fill('🎵'.repeat(2000))));
});
test('source request isolates text and query before async hash and rejects bad digest',async()=>{
 let resolve;const payload={texts:['a'],query:'a'},p=P.search(payload,{hash:()=>new Promise(r=>resolve=r)});payload.texts[0]='b';payload.query='b';resolve(hash(Buffer.from('zoe-lyrics-texts-v1\n["a"]')));const d=await p;assert.equal(d.query,'a');assert.equal(d.matches[0].text,'a');
 for(const value of [null,'x','a'.repeat(64)+'\n'])await assert.rejects(P.search({texts:['a'],query:'a'},{hash:()=>value}));
});
test('reply validates complete data JSON Markdown version protocol and bounded large control report',async()=>{
 const d=await search({texts:Array(50).fill('\x00'.repeat(2000)),query:'\x00',max_results:50}),r=wire(d);assert.ok(Buffer.byteLength(r.files['lyrics-search.json'])>512*1024);assert.deepEqual(P.checkedReply(r,d,'0.85.0'),d);
 for(const mutate of [r=>r.data.schema_version=2,r=>r.data.matches[0].row=2,r=>r.data.matches[0].text='wrong',r=>r.data.source_sha256='0'.repeat(64),r=>r.data.total_matched_rows=49,r=>r.meta.version='0.84.0',r=>r.meta.protocol_version=2,r=>r.meta.needs_review=false,r=>r.files['lyrics-search.md']+='x',r=>r.files['lyrics-search.json']='{"format":1,"format":1}',r=>r.files.extra='x',r=>r.extra=1]){const bad=structuredClone(r);mutate(bad);assert.throws(()=>P.checkedReply(bad,d,'0.85.0'));}
 const copy=P.checkedReply(r,d,'0.85.0');copy.matches[0].text='changed';assert.notEqual(copy.matches[0].text,d.matches[0].text);
});
function harness({defer=false}={}){let s={ids:Array.from({length:45},(_,i)=>'id'+i),texts:Array(45).fill('原句 🎵'),visible:true,busy:false,resultRevision:0},reports=[],errors=[],effects=[],views=[],pending=[];
 const c=C.createController({version:'0.85.0',capture:()=>s,search,request:async p=>{const r=wire(await search(p));if(defer)return new Promise(resolve=>pending.push(()=>resolve(r)));return r;},focusTarget:t=>{effects.push(t);return true;},onState:v=>views.push(v),onReport:(d,f)=>{reports.push({d,f});s.resultRevision++;},onError:e=>errors.push(e.message)});
 return {c,reports,errors,effects,views,pending,get s(){return s},set s(v){s=v}};
}
test('controller find next previous and focus use current stable IDs without changing text or time',async()=>{
 const h=harness();h.c.setQuery('原句');assert.equal(await h.c.find(),true);assert.equal(h.c.view().totalMatched,45);assert.equal(h.c.focus(19),true);assert.equal(h.effects[0].id,'id19');assert.equal(await h.c.next(),true);assert.equal(h.c.view().matches[0].row,21);assert.equal(await h.c.previous(),true);assert.equal(h.c.view().matches[0].row,1);assert.equal(h.c.view().canPrevious,false);assert.equal(h.s.texts[0],'原句 🎵');assert.equal(h.reports.length,3);
});
test('query text row order replacement and deletion invalidate result focus and paging',async()=>{
 for(const mutate of [h=>h.c.setQuery('🎵'),h=>h.s.texts[0]='changed',h=>h.s.ids[0]='new',h=>h.s.ids.reverse(),h=>{h.s.ids.pop();h.s.texts.pop();},h=>h.c.clear()]){const h=harness();h.c.setQuery('原句');await h.c.find();mutate(h);h.c.refresh();assert.equal(h.c.view().matches.length,0);assert.equal(h.c.focus(0),false);assert.equal(h.effects.length,0);assert.equal(await h.c.next(),false);}
});
test('hidden busy and malformed capture refuse focus and new requests',async()=>{
 for(const key of ['busy','visible']){const h=harness();h.c.setQuery('原句');await h.c.find();h.s[key]=key==='busy';h.c.refresh();assert.equal(h.c.focus(0),false);assert.equal(await h.c.find(),false);assert.equal(h.effects.length,0);}
 for(const patch of [{ids:['a','a'],texts:['a','a']},{ids:['a'],texts:[]},{resultRevision:-1},{visible:1},{extra:1}])assert.throws(()=>C.snapshot({ids:[],texts:[],busy:false,visible:true,resultRevision:0,...patch}));
});
test('late reply after query edit source edit navigation busy or another result never commits report',async()=>{
 for(const mutate of [h=>h.c.setQuery('🎵'),h=>h.s.texts[0]='changed',h=>h.s.visible=false,h=>h.s.busy=true,h=>h.s.resultRevision++]){const h=harness({defer:true});h.c.setQuery('原句');const p=h.c.find();await new Promise(setImmediate);assert.equal(h.pending.length,1);mutate(h);h.c.refresh();h.pending[0]();assert.equal(await p,false);assert.equal(h.reports.length,0);assert.equal(h.errors.length,0);assert.equal(h.c.view().pending,false);}
});
test('hash awaiting source edits and overlapping query generations discard before HTTP',async()=>{
 let resolve,requests=0,s={ids:['a'],texts:['原句'],visible:true,busy:false,resultRevision:0};const c=C.createController({version:'0.85.0',capture:()=>s,search:p=>new Promise(r=>resolve=async()=>r(await search(p))),request:()=>{requests++;assert.fail('late hash request')},focusTarget:()=>true});c.setQuery('原句');const p=c.find();s.texts[0]='changed';c.refresh();await resolve();assert.equal(await p,false);assert.equal(requests,0);
});
test('report callback and emitted DTO cannot mutate retained paging or focus state',async()=>{
 const h=harness();h.c.setQuery('原句');await h.c.find();h.reports[0].d.matches[0].text='changed';const v=h.c.view();v.matches[0].row=45;assert.equal(h.c.focus(0),true);assert.equal(h.effects[0].text,'原句 🎵');assert.equal(h.effects[0].id,'id0');
});
test('zero matches has an explicit readable empty state and current failure can retry',async()=>{
 const h=harness();h.c.setQuery('not found');assert.equal(await h.c.find(),true);assert.match(h.c.view().message,/沒有符合的原句/);assert.equal(h.c.view().canNext,false);assert.equal(h.c.view().matches.length,0);h.c.setQuery('');assert.equal(await h.c.find(),false);assert.equal(h.errors.length,1);h.c.setQuery('原句');assert.equal(await h.c.find(),true);
});
test('a late failed request cannot replace a new successful query generation',async()=>{
 let s={ids:['a'],texts:['a b'],visible:true,busy:false,resultRevision:0},reject,attempts=0,reports=0,errors=0;
 const c=C.createController({version:'0.85.0',capture:()=>s,search,request:async p=>{if(++attempts===1)return new Promise((_,r)=>reject=r);return wire(await search(p));},focusTarget:()=>true,onReport:()=>reports++,onError:()=>errors++});c.setQuery('a');const old=c.find();await new Promise(setImmediate);c.setQuery('b');assert.equal(await c.find(),true);reject(Error('late'));assert.equal(await old,false);assert.equal(reports,1);assert.equal(errors,0);assert.equal(c.view().matches[0].text,'a b');assert.equal(c.view().query,'b');
});
test('untrusted literal labels have bounded Unicode/control display and fixed native modules load before app',()=>{
 assert.equal(D.caption('<script>\r\n\t\x00🎵'),'<script>␍↵⇥�🎵');assert.equal(Array.from(D.caption('🎵'.repeat(101))).length,101);const fs=require('node:fs'),html=fs.readFileSync('web/index.html','utf8');for(const name of ['lyrics-search.js','lyrics-search-controller.js','lyrics-search-dom.js']){assert.ok(html.indexOf('/'+name)<html.indexOf('/app.js'));assert.ok(html.indexOf('/'+name)>html.indexOf('/delivery-search.js'));}assert.match(html,/id="lyrics-search-query"[^>]*data-view-control="true"/);
});
