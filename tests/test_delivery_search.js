// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),crypto=require('node:crypto'),{execFileSync}=require('node:child_process'),fs=require('node:fs'),vm=require('node:vm');
const search=require('../web/delivery-search.js'),text=require('../web/delivery-text.js'),importer=require('../web/delivery-import.js');
const original='\ufeffA🎵\r\nA\nA\r\x00<script>literal</script>é e\u0301';
const hash=async raw=>crypto.createHash('sha256').update(raw).digest('hex');
test('literal UTF8 positions agree with actual Python including controls and no normalization',()=>{
 const queries=['\ufeff','🎵','\r\n','\n','\r','\x00','<script>literal</script>','é','e\u0301','a','.*'];
 const py=JSON.parse(execFileSync('python',['-X','utf8','-c','import json,sys\nfrom musiclab.delivery_search import search\np=json.loads(sys.argv[1]);print(json.dumps([search(p[0],q) for q in p[1]]))',JSON.stringify([original,queries])],{encoding:'utf8',timeout:10000}));
 assert.deepEqual(queries.map(query=>search.search(original,{query})),py);
});
test('nonoverlapping batches reconstruct all positions and distinct empty EOF no-match',()=>{
 const content='aa'.repeat(51)+'a',all=[];let start_byte=0;
 while(true){const v=search.search(content,{query:'aa',start_byte,max_matches:20});assert.deepEqual(search.checked(v,{query:'aa',start_byte,max_matches:20}),v);all.push(...v.matches);if(v.next_byte===null)break;start_byte=v.next_byte;}
 assert.equal(all.length,51);assert.equal(all[50].start_byte,100);for(const [content,start] of [['',0],['a',1],['abc',0]])assert.equal(search.search(content,{query:'x',start_byte:start}).matches.length,0);
});
test('strict query bytes, Unicode, bounds and unknown request fields refuse without repair',()=>{
 assert.equal(search.search('a'.repeat(1024),{query:'a'.repeat(1024)}).query_bytes,1024);
 for(const request of [null,{},[],{query:''},{query:null},{query:'\ud800'},{query:'🎵'.repeat(257)},{query:'x',start_byte:2},{query:'x',start_byte:7},{query:'x',start_byte:true},{query:'x',max_matches:0},{query:'x',max_matches:51},{query:'x',max_matches:1.5},{query:'x',unknown:0}])assert.throws(()=>search.search('a🎵z',request));
 assert.throws(()=>search.search('a'.repeat(8388609),{query:'a'}));
});
test('8MiB original uses linear matching for a 1024-byte adversarial query and fixed batch',()=>{
 const content='a'.repeat(8388608-4)+'END!',prepared=text.prepare(content),request={query:'a'.repeat(1023)+'b'};
 assert.equal(prepared.search(request).matches.length,0);const v=prepared.search({query:'END!'});assert.equal(v.matches[0].start_byte,8388604);assert.equal(prepared.window(8388604).text,'END!');assert.equal(prepared.search({query:'a'}).matches.length,20);assert.equal(prepared.source_bytes,8388608);assert.deepEqual(Object.keys(prepared),['source_bytes','window','search']);
});
test('malformed or mixed search replies reject mismatched query positions and continuation',()=>{
 const request={query:'aa',max_matches:1},value=search.search('aaaa',request);
 for(const v of [null,{...value,unknown:0},{...value,query:'bb'},{...value,query_bytes:1},{...value,start_byte:1},{...value,source_bytes:1},{...value,max_matches:2},{...value,matches:[{start_byte:0,end_byte:1}]},{...value,matches:[{start_byte:0,end_byte:2},{start_byte:2,end_byte:4}]},{...value,next_byte:3},{...value,next_byte:NaN}])assert.throws(()=>search.checked(v,request));
});
test('search controller retains only one batch and query edits invalidate positions',()=>{
 const source={key:'a',canRead:true},prepared=text.prepare('hit '.repeat(45));let selected=[];const c=search.createSearcher({source:()=>source,read:p=>prepared.search(p),onSelect:start=>{selected.push(start);return true;}});
 c.setQuery('hit');assert.equal(c.find(),true);assert.equal(c.status().batch.matches.length,20);assert.equal(c.select(0),true);assert.deepEqual(selected,[0]);assert.equal(c.more(),true);assert.equal(c.status().offset,20);assert.equal(c.more(),true);assert.equal(c.status().batch.matches.length,5);assert.equal(c.more(),false);assert.equal(c.find(),true);assert.equal(c.status().offset,0);c.setQuery('HIT');assert.equal(c.status().batch,null);assert.equal(c.select(0),false);c.find();assert.equal(c.status().batch.matches.length,0);source.key='b';assert.equal(c.refresh().batch,null);source.canRead=false;assert.equal(c.find(),false);
});
test('search controller refuses aliased source changes query changes and retryable errors',()=>{
 const source={key:'one',canRead:true},prepared=text.prepare('hit hit');let mode='good',errors=[],c;c=search.createSearcher({source:()=>source,read:p=>{if(mode==='key')source.key='two';if(mode==='query')c.setQuery('other');if(mode==='throw')throw Error('refused');return prepared.search(p)},onError:e=>errors.push(e.message)});
 c.setQuery('hit');c.find();mode='throw';assert.equal(c.find(),false);assert.equal(c.status().batch.matches.length,2);mode='key';assert.equal(c.find(),false);assert.equal(c.status().batch,null);mode='query';assert.equal(c.find(),false);assert.equal(c.status().batch,null);assert.deepEqual(errors,['refused']);
});
test('reader seeks to exact byte boundary and rejects split Unicode while preserving page',()=>{
 const prepared=text.prepare('a🎵'+'z'.repeat(40000)),errors=[],r=text.createReader({source:()=>({key:'same',canRead:true}),read:start=>prepared.window(start),onError:e=>errors.push(e.message)});r.first();assert.equal(r.seek(1),true);assert.ok(r.status().page.text.startsWith('🎵'));assert.equal(r.status().canPrevious,false);assert.equal(r.seek(2),false);assert.equal(r.status().page.start_byte,1);assert.equal(errors.length,1);
});

test('previous batches reread exact cursors and restore ordinal while clearing old selection',()=>{
 const p=text.prepare('🎵hit\r\n'.repeat(45)),requests=[],c=search.createSearcher({source:()=>({key:'same',canRead:true}),read:r=>{requests.push(r);return p.search(r)},includeContext:true});c.setQuery('hit');c.find();const first=c.status().batch;c.more();const second=c.status().batch;c.more();assert.equal(c.status().offset,40);assert.equal(c.status().batch.matches.length,5);c.select(0);assert.equal(c.previous(),true);assert.equal(c.status().offset,20);assert.equal(c.status().selected,-1);assert.deepEqual(c.status().batch,second);assert.equal(requests.at(-1).start_byte,second.start_byte);assert.equal(c.previous(),true);assert.deepEqual(c.status().batch,first);assert.equal(c.status().canPrevious,false);assert.equal(c.previous(),false);assert.equal(c.more(),true);assert.deepEqual(c.status().batch,second);c.find();assert.equal(c.status().canPrevious,false);assert.equal(c.status().historyLimited,false);
});
test('history holds only latest512 cursors, forward remains available and find returns to origin',()=>{
 const p=text.prepare('x '.repeat(20*520+1)),c=search.createSearcher({source:()=>({key:'same',canRead:true}),read:r=>p.search(r)});c.setQuery('x');c.find();for(let i=0;i<520;i++)assert.equal(c.more(),true);assert.equal(c.status().offset,10400);assert.equal(c.status().historyLimited,true);assert.equal(Object.hasOwn(c.status(),'back'),false);for(let i=0;i<512;i++)assert.equal(c.previous(),true);assert.equal(c.status().offset,160);assert.equal(c.status().canPrevious,false);assert.equal(c.previous(),false);assert.equal(c.more(),true);assert.equal(c.status().offset,180);c.find();assert.equal(c.status().offset,0);assert.equal(c.status().historyLimited,false);
});
test('failed previous preserves batch selection and cursor until a successful retry',()=>{
 const p=text.prepare('hit '.repeat(45));let fail=false;const errors=[],c=search.createSearcher({source:()=>({key:'same',canRead:true}),read:r=>{if(fail)throw Error('retry');return p.search(r)},onError:e=>errors.push(e.message)});c.setQuery('hit');c.find();c.more();c.select(2);const prior=c.status();fail=true;assert.equal(c.previous(),false);assert.deepEqual(c.status(),prior);fail=false;assert.equal(c.previous(),true);assert.equal(c.status().offset,0);assert.equal(c.status().canPrevious,false);assert.deepEqual(errors,['retry']);
});
test('source query availability and same-query reset invalidate cursor history',()=>{
 const p=text.prepare('hit '.repeat(45));for(const change of ['key','availability','query','find']){const s={key:'one',canRead:true},c=search.createSearcher({source:()=>s,read:r=>p.search(r)});c.setQuery('hit');c.find();c.more();if(change==='key')s.key='two';else if(change==='availability')s.canRead=false;else if(change==='query')c.setQuery('other');else c.find();c.refresh();assert.equal(c.status().canPrevious,false);assert.equal(c.previous(),false);assert.equal(c.status().historyLimited,false);}
});
test('select callback changing batch never submits old selection to the next batch',()=>{
 const p=text.prepare('hit '.repeat(41));let c;c=search.createSearcher({source:()=>({key:'same',canRead:true}),read:r=>p.search(r),onSelect:()=>{c.more();return true}});c.setQuery('hit');c.find();assert.equal(c.select(19),false);assert.equal(c.status().offset,20);assert.equal(c.status().selected,-1);assert.equal(c.status().canPrevious,true);
});
test('select callback query-change-back and source invalidation reject stale selection',()=>{
 const p=text.prepare('hit '.repeat(41));for(const mode of ['query','key','disabled','throw']){let c;const s={key:'same',canRead:true},errors=[];c=search.createSearcher({source:()=>s,read:r=>p.search(r),onSelect:()=>{if(mode==='query'){c.setQuery('other');c.setQuery('hit');}else if(mode==='key')s.key='new';else if(mode==='disabled')s.canRead=false;else throw Error('select failed');return true},onError:e=>errors.push(e.message)});c.setQuery('hit');c.find();assert.equal(c.select(0),false);assert.equal(c.status().selected,-1);assert.deepEqual(errors,mode==='throw'?['select failed']:[]);}
});
test('nested read operation wins and stale errors cannot overwrite its newer batch',()=>{
 const p=text.prepare('hit '.repeat(45));let c,nest=false,throwStale=false;const errors=[];c=search.createSearcher({source:()=>({key:'same',canRead:true}),read:r=>{if(nest){nest=false;c.find();if(throwStale)throw Error('stale error');}return p.search(r)},onError:e=>errors.push(e.message)});c.setQuery('hit');c.find();c.more();nest=true;assert.equal(c.more(),false);assert.equal(c.status().offset,0);assert.equal(c.status().canPrevious,false);c.more();nest=true;throwStale=true;assert.equal(c.more(),false);assert.equal(c.status().offset,0);assert.deepEqual(errors,[]);
});
const canonical=JSON.parse(execFileSync('python',['-X','utf8','-c',`import io,json
from musiclab.delivery_package import prepare
from musiclab.application import inspect_delivery
text='\\ufeffstart\\r\\n'+'a'*40000+'尾端🎵\\r\\n'+'hit '*45+'<script>literal</script>'
print(json.dumps([inspect_delivery(io.BytesIO(prepare({'scope':s,'files':{'full.txt':text,'empty.txt':''}}).archive),True).wire() for s in ['music','storyboard','lyrics','audio']]))`],{encoding:'utf8',timeout:10000}));
function setup(scope='music'){
 const wire=structuredClone(canonical.find(w=>w.data.manifest.scope===scope)),d=wire.data,view={scope,revision:1,resultRevision:1,bundle:{files:{'full.txt':'before 🎵 original','removed.txt':'retained'},dirty:false},media:[{}],busy:false},errors=[];
 const options={capture:()=>view,read:async()=>({wire,selected:{bytes:d.archive_bytes,sha256:d.archive_sha256,manifest:d.manifest}}),hash,onError:e=>errors.push(e.message),replace:r=>{view.bundle={files:r.files};view.resultRevision++;},restore:b=>{view.bundle=b;view.resultRevision++;}};
 return {wire,view,errors,options,file:{name:'original.zip',size:d.archive_bytes}};
}
test('all four verified import sources search both original sides and share a single encoded cache',async()=>{
 const saved=text.prepare;let prepared=0;text.prepare=v=>{prepared++;return saved(v)};
 try{for(const scope of ['music','storyboard','lyrics','audio']){const s=setup(scope),c=importer.createController(s.options),bundle=structuredClone(s.view.bundle),media=s.view.media[0];await c.inspect(s.file);const n=prepared,v=c.textSearch('full.txt','incoming',{query:'尾端🎵'});assert.equal(v.matches.length,1);assert.equal(c.textWindow('full.txt','incoming',v.matches[0].start_byte).text.startsWith('尾端🎵'),true);c.textSearch('full.txt','incoming',{query:'hit'});assert.equal(prepared,n+1);assert.equal(c.textSearch('full.txt','before',{query:'🎵'}).matches[0].start_byte,7);assert.equal(c.textSearch('empty.txt','incoming',{query:'x'}).source_bytes,0);assert.equal(c.textSearch('removed.txt','incoming',{query:'x'}),null);assert.deepEqual(s.view.bundle,bundle);assert.equal(s.view.media[0],media);assert.equal(c.originalFile('full.txt').content,s.wire.files['full.txt']);c.cancel();assert.equal(c.textSearch('full.txt','incoming',{query:'hit'}),null);}}
 finally{text.prepare=saved;}
});
test('edits media busy apply undo and new source invalidate search cache without automatic writes',async()=>{
 for(const change of [v=>v.revision++,v=>v.resultRevision++,v=>v.bundle.files['full.txt']='changed',v=>v.media=[{}],v=>v.busy=true,v=>v.scope='audio']){const s=setup(),c=importer.createController(s.options);await c.inspect(s.file);c.textSearch('full.txt','incoming',{query:'hit'});change(s.view);c.refresh();assert.equal(c.textSearch('full.txt','incoming',{query:'hit'}),null);}
 const s=setup(),c=importer.createController(s.options),before=structuredClone(s.view.bundle);await c.inspect(s.file);c.textSearch('full.txt','incoming',{query:'hit'});assert.equal(c.apply(),true);assert.equal(c.textSearch('full.txt','incoming',{query:'hit'}),null);assert.equal(c.undo(),true);assert.deepEqual(s.view.bundle,before);await c.inspect(s.file);assert.equal(c.textSearch('full.txt','incoming',{query:'hit'}).matches.length,20);c.cancel();
});
function dom(s){
 const html=fs.readFileSync('web/index.html','utf8'),ids=[...html.matchAll(/id="(delivery-[^"]+)"/g)].map(m=>m[1]),nodes={};for(const id of ids)nodes[id]={value:'',open:false,replaceChildren(){this.children=[];this.value=''},append(v){(this.children||=[]).push(v)}};nodes['delivery-reader-side'].value='incoming';
 const context={MusicDeliveryText:text,MusicDeliveryContext:require('../web/delivery-context.js'),MusicDeliverySearch:search,MusicDeliveryImport:importer};for(const file of ['delivery-text-dom.js','delivery-search-dom.js','delivery-import-dom.js'])vm.runInNewContext(fs.readFileSync('web/'+file,'utf8'),context);
 const c=context.MusicDeliveryImportDom.createAdapter({getElementById:id=>nodes[id],createElement:()=>({})},{...s.options,downloadText:()=>true});return {c,nodes};
}

test('DOM previous restores earlier choices and range, clears context, and every scope keeps originals',async()=>{
 for(const scope of ['music','storyboard','lyrics','audio']){const s=setup(scope),{c,nodes:n}=dom(s),old=structuredClone(s.view.bundle),media=s.view.media[0];await c.inspect(s.file);n['delivery-review-file'].value='full.txt';n['delivery-review-file'].onchange();n['delivery-reader'].open=true;n['delivery-reader'].ontoggle();const q=n['delivery-search-query'];q.value='hit';n['delivery-search-find'].onclick();assert.equal(n['delivery-search-previous'].disabled,true);assert.match(n['delivery-search-note'].textContent,/第1–20筆/);n['delivery-search-more'].onclick();assert.equal(n['delivery-search-previous'].disabled,false);assert.match(n['delivery-search-note'].textContent,/第21–40筆/);n['delivery-search-match'].onchange({target:{value:'2'}});assert.ok(n['delivery-search-context'].value);assert.equal(n['delivery-search-previous'].onclick(),true);assert.match(n['delivery-search-match'].children[1].textContent,/第1筆/);assert.equal(n['delivery-search-context'].value,'');assert.equal(n['delivery-search-context-box'].hidden,true);assert.match(n['delivery-search-note'].textContent,/第1–20筆/);assert.equal(n['delivery-search-previous'].disabled,true);assert.deepEqual(s.view.bundle,old);assert.equal(s.view.media[0],media);n['delivery-search-more'].onclick();s.view.revision++;c.refresh();assert.equal(n['delivery-search-previous'].disabled,true);assert.equal(n['delivery-search-match'].disabled,true);c.cancel();}
});
test('DOM previous history clears on query source cancel apply undo and empty source',async()=>{
 const s=setup(),{c,nodes:n}=dom(s);await c.inspect(s.file);n['delivery-review-file'].value='full.txt';n['delivery-review-file'].onchange();const q=n['delivery-search-query'];q.value='hit';n['delivery-search-find'].onclick();n['delivery-search-more'].onclick();q.value='HIT';q.oninput({target:q});assert.equal(n['delivery-search-previous'].disabled,true);q.value='hit';n['delivery-search-find'].onclick();n['delivery-search-more'].onclick();n['delivery-reader-side'].value='before';n['delivery-reader-side'].onchange();assert.equal(n['delivery-search-previous'].disabled,true);n['delivery-reader-side'].value='incoming';n['delivery-reader-side'].onchange();n['delivery-review-file'].value='empty.txt';n['delivery-review-file'].onchange();n['delivery-search-find'].onclick();assert.equal(n['delivery-search-previous'].disabled,true);assert.match(n['delivery-search-note'].textContent,/有效的空檔/);n['delivery-review-file'].value='full.txt';n['delivery-review-file'].onchange();n['delivery-search-find'].onclick();n['delivery-search-more'].onclick();c.apply();assert.equal(n['delivery-search-previous'].disabled,true);c.undo();assert.equal(n['delivery-search-previous'].disabled,true);c.cancel();
});

test('DOM batch boundary moves keyboard focus to the still-enabled navigation control',async()=>{
 const s=setup(),{c,nodes:n}=dom(s);let focused='';n['delivery-search-more'].focus=()=>focused='more';n['delivery-search-previous'].focus=()=>focused='previous';await c.inspect(s.file);n['delivery-review-file'].value='full.txt';n['delivery-review-file'].onchange();n['delivery-search-query'].value='hit';n['delivery-search-find'].onclick();n['delivery-search-more'].onclick();assert.equal(focused,'');n['delivery-search-more'].onclick();assert.equal(focused,'previous');assert.equal(n['delivery-search-more'].disabled,true);focused='';n['delivery-search-previous'].onclick();assert.equal(focused,'');n['delivery-search-previous'].onclick();assert.equal(focused,'more');assert.equal(n['delivery-search-more'].disabled,false);
});
test('DOM Enter finds exact original and selected result seeks; source changes clear positions',async()=>{
 const s=setup(),{c,nodes:n}=dom(s);await c.inspect(s.file);n['delivery-review-file'].value='full.txt';n['delivery-review-file'].onchange();n['delivery-reader'].open=true;n['delivery-reader'].ontoggle();const q=n['delivery-search-query'];q.value='尾端🎵';let prevented=false;q.onkeydown({key:'Enter',isComposing:false,target:q,preventDefault(){prevented=true}});assert.equal(prevented,true);assert.match(n['delivery-search-note'].textContent,/本批1筆/);assert.equal(n['delivery-search-match'].onchange({target:{value:'0'}}),true);assert.ok(n['delivery-reader-content'].value.startsWith('尾端🎵'));
 q.value='hit';q.oninput({target:q});assert.equal(n['delivery-search-match'].disabled,true);assert.equal(n['delivery-search-find'].onclick(),true);assert.equal(n['delivery-search-match'].children.length,21);assert.equal(n['delivery-search-more'].onclick(),true);assert.match(n['delivery-search-match'].children[1].textContent,/第21筆/);
 n['delivery-reader-side'].value='before';n['delivery-reader-side'].onchange();assert.equal(n['delivery-search-match'].disabled,true);q.value='🎵';n['delivery-search-find'].onclick();n['delivery-search-match'].onchange({target:{value:'0'}});assert.ok(n['delivery-reader-content'].value.startsWith('🎵'));s.view.revision++;c.refresh();assert.equal(n['delivery-search-query'].disabled,true);assert.equal(n['delivery-search-match'].disabled,true);assert.equal(n['delivery-reader-content'].value,'');c.cancel();
});
test('DOM distinguishes empty missing and no-match and never executes literal HTML',async()=>{
 const s=setup(),{c,nodes:n}=dom(s);await c.inspect(s.file);n['delivery-reader'].open=true;n['delivery-search-query'].value='x';n['delivery-review-file'].value='empty.txt';n['delivery-review-file'].onchange();n['delivery-search-find'].onclick();assert.match(n['delivery-search-note'].textContent,/有效的空檔/);n['delivery-reader-side'].value='before';n['delivery-reader-side'].onchange();assert.match(n['delivery-search-note'].textContent,/沒有這個檔案/);n['delivery-reader-side'].value='incoming';n['delivery-reader-side'].onchange();n['delivery-review-file'].value='full.txt';n['delivery-review-file'].onchange();n['delivery-search-query'].value='HIT';n['delivery-search-find'].onclick();assert.match(n['delivery-search-note'].textContent,/沒有找到/);n['delivery-search-query'].value='<script>literal</script>';n['delivery-search-find'].onclick();n['delivery-search-match'].onchange({target:{value:'0'}});assert.equal(n['delivery-reader-content'].value,'<script>literal</script>');const before=structuredClone(s.view.bundle);c.apply();c.undo();assert.deepEqual(s.view.bundle,before);assert.equal(n['delivery-search-match'].disabled,true);
});
