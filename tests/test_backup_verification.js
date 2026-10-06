// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),crypto=require('node:crypto'),fs=require('node:fs'),vm=require('node:vm');
const P=require('../web/backup-verification.js'),C=require('../web/backup-verification-controller.js'),D=require('../web/backup-verification-dom.js'),Download=require('../web/backup-download-dom.js');
const raw=t=>new TextEncoder().encode(t).buffer,sha=b=>crypto.createHash('sha256').update(new Uint8Array(b)).digest('hex');
const proof=(t='ZIP🎵\r\n')=>({bytes:raw(t).byteLength,sha256:sha(raw(t)),entry_count:2});
const state=()=>({revision:1,busy:false,proof:proof()});
const later=()=>{let resolve,reject;const promise=new Promise((a,b)=>{resolve=a;reject=b;});return {promise,resolve,reject};};
function harness(){let s=state(),reads=0,hashes=0;const reports=[],errors=[],views=[];
 const c=C.createController({capture:()=>s,describe:f=>({name:f.name,size:f.size}),readFile:async f=>{reads++;return f.read?await f.read():raw(f.text);},hash:async b=>{hashes++;return sha(b);},onState:v=>views.push(v),onReport:r=>reports.push(r),onError:e=>errors.push(e.message)});
 return {c,reports,errors,views,get s(){return s;},set s(v){s=v;},get reads(){return reads;},get hashes(){return hashes;},file(t='ZIP🎵\r\n',name='saved-backup.zip'){return {name,size:raw(t).byteLength,text:t};}};
}
test('metadata-only source snapshot rejects extra hidden symbol and accessor fields without reading getters',()=>{
 for(const kind of ['extra','hidden','symbol','accessor']){let touched=0;const p=proof();if(kind==='extra')p.download_url='/private';if(kind==='hidden')Object.defineProperty(p,'extra',{value:1});if(kind==='symbol')p[Symbol('private')]=1;if(kind==='accessor')Object.defineProperty(p,'sha256',{enumerable:true,get(){touched++;return proof().sha256;}});assert.throws(()=>P.proof(p));assert.equal(touched,0);}
 const original=state(),copy=P.snapshot(original);original.proof.sha256='f'.repeat(64);assert.notEqual(copy.proof.sha256,original.proof.sha256);assert.deepEqual(Object.keys(copy.proof),['bytes','sha256','entry_count']);
});
test('source schema exact bounds preserve empty library and reject unknown fields invalid hash flags and versions',()=>{
 assert.equal(P.proof({...proof(),entry_count:0}).entry_count,0);
 for(const patch of [{bytes:0},{bytes:P.maxBytes+1},{bytes:true},{bytes:1.5},{sha256:'F'.repeat(64)},{entry_count:-1},{entry_count:1001},{entry_count:true},{schema_version:2}])assert.throws(()=>P.proof({...proof(),...patch}));
 for(const patch of [{revision:-1},{revision:1.1},{busy:1},{proof:{}},{path:'other'}])assert.throws(()=>P.snapshot({...state(),...patch}));
});
test('selected filenames remain literal may be renamed and cannot select a filesystem path',()=>{
 assert.deepEqual(P.metadata({name:'<tag>備份🎵 (2).zip',size:1}),{name:'<tag>備份🎵 (2).zip',size:1});
 for(const name of ['','../backup.zip','C:\\backup.zip','\ud800','x\n.zip','🎵'.repeat(257)])assert.throws(()=>P.metadata({name,size:1}));
 for(const size of [0,-1,1.1,true,P.maxBytes+1])assert.throws(()=>P.metadata({name:'file.zip',size}));
});
test('pure report compares both complete size and digest and isolates all returned primitive values',()=>{
 const p=proof(),same=P.inspect(p,{bytes:p.bytes,sha256:p.sha256});assert.equal(same.matched,true);
 assert.equal(P.inspect(p,{bytes:p.bytes+1,sha256:p.sha256}).matched,false);assert.equal(P.inspect(p,{bytes:p.bytes,sha256:'f'.repeat(64)}).matched,false);
 assert.throws(()=>P.inspect(p,{bytes:p.bytes,sha256:p.sha256,content:'ZIP'}));assert.equal(Object.hasOwn(same,'entry_count'),false);
});
test('complete actual bytes including Unicode and tail changes distinguish same-size wrong backup without source writes',async()=>{
 const h=harness(),before=structuredClone(h.s);assert.equal(await h.c.verify(h.file()),true);assert.equal(h.c.view().report.matched,true);
 assert.equal(await h.c.verify(h.file('ZIP🎶\r\n')),true);assert.equal(h.c.view().report.matched,false);assert.deepEqual(h.s,before);assert.equal(h.reads,2);assert.equal(h.hashes,2);
});
test('maximum 32 MiB is hashed fully and oversized metadata refuses before file read',async()=>{
 const bytes=new Uint8Array(P.maxBytes);bytes[bytes.length-1]=1;const p={bytes:bytes.length,sha256:sha(bytes.buffer),entry_count:1000};let reads=0;
 const c=C.createController({capture:()=>({revision:0,busy:false,proof:p}),describe:f=>({name:f.name,size:f.size}),readFile:async()=>{reads++;return bytes.buffer;},hash:async b=>sha(b)});
 assert.equal(await c.verify({name:'max.zip',size:P.maxBytes}),true);assert.equal(c.view().report.matched,true);assert.equal(await c.verify({name:'too-big.zip',size:P.maxBytes+1}),false);assert.equal(reads,1);assert.equal(c.view().pending,false);
});
test('no sent proof and busy source prevent selected-file reads and invalidate previous reports',async()=>{
 for(const patch of [{proof:null},{busy:true}]){const h=harness();await h.c.verify(h.file());h.s={...h.s,...patch};h.c.refresh();assert.equal(h.c.view().report,null);assert.equal(h.c.view().available,false);assert.equal(await h.c.verify(h.file()),false);assert.equal(h.reads,1);}
});
test('new send including identical digest revision and same size different source refuse a late file read',async()=>{
 for(const change of [h=>h.s.revision++,h=>h.s.proof.sha256='f'.repeat(64),h=>h.s.proof.entry_count++,h=>h.s.busy=true]){const h=harness(),pending=later(),f=h.file();f.read=()=>pending.promise;const work=h.c.verify(f);change(h);pending.resolve(raw(f.text));assert.equal(await work,false);assert.equal(h.reports.length,0);assert.equal(h.c.view().pending,false);assert.equal(h.hashes,0);}
});
test('old success and old error cannot replace latest chosen file proof',async()=>{
 for(const fail of [false,true]){const h=harness(),pending=later(),f=h.file();f.read=()=>pending.promise;const old=h.c.verify(f);assert.equal(await h.c.verify(h.file('WRONG🎵\r\n','new.zip')),true);fail?pending.reject(Error('late error')):pending.resolve(raw(f.text));assert.equal(await old,false);assert.equal(h.c.view().selected.name,'new.zip');assert.equal(h.c.view().report.matched,false);assert.equal(h.errors.length,0);}
});
test('cancel and disposal suppress in-flight read or hash completions and release pending metadata',async()=>{
 for(const method of ['cancel','dispose']){const h=harness(),pending=later(),f=h.file();f.read=()=>pending.promise;const old=h.c.verify(f);h.c[method]();pending.resolve(raw(f.text));assert.equal(await old,false);assert.equal(h.reports.length,0);assert.equal(h.c.view().pending,false);assert.equal(h.c.view().selected,null);if(method==='dispose')assert.equal(await h.c.verify(h.file()),false);else assert.equal(await h.c.verify(h.file()),true);}
 const pending=later(),entered=later(),h=harness();const c=C.createController({capture:()=>h.s,describe:f=>({name:f.name,size:f.size}),readFile:f=>raw(f.text),hash:()=>{entered.resolve();return pending.promise;}});const old=c.verify(h.file());await entered.promise;c.cancel();pending.resolve(proof().sha256);assert.equal(await old,false);assert.equal(c.view().report,null);
});
test('short non-buffer name-size drift and I/O errors refuse confirmation then permit good retry',async()=>{
 for(const kind of ['short','view','size','name','io']){const h=harness(),f=h.file();f.read=async()=>{if(kind==='short')return raw('x');if(kind==='view')return new Uint8Array(raw(f.text));if(kind==='size')f.size++;if(kind==='name')f.name='new.zip';if(kind==='io')throw Error('read refused');return raw(f.text);};assert.equal(await h.c.verify(f),false);assert.equal(h.reports.length,0);assert.equal(h.errors.length,1);assert.equal(await h.c.verify(h.file()),true);}
});
test('invalid capture never strands pending state or old proof and valid capture can retry',async()=>{
 const h=harness(),pending=later(),f=h.file();f.read=()=>pending.promise;const old=h.c.verify(f);h.s={wrong:true};pending.resolve(raw(f.text));assert.equal(await old,false);assert.equal(h.c.view().available,false);assert.equal(h.c.view().pending,false);assert.equal(h.c.view().report,null);assert.equal(await h.c.verify(h.file()),false);h.s=state();assert.equal(await h.c.verify(h.file()),true);
});
test('callback and view mutation cannot alter retained proof and no bytes File paths or draft enter reports',async()=>{
 const h=harness();await h.c.verify(h.file());h.reports[0].matched=false;const v=h.c.view();v.source.sha256='f'.repeat(64);v.selected.name='other';v.report.matched=false;assert.equal(h.c.view().report.matched,true);assert.equal(h.c.view().selected.name,'saved-backup.zip');assert.equal(h.c.view().source.sha256,proof().sha256);assert.deepEqual(Object.keys(v.report),['format','schema_version','expected_bytes','expected_sha256','selected_bytes','selected_sha256','matched']);
});
function domSetup(){const nodes=Object.fromEntries(['backup-verify-file','backup-verify-source','backup-verify-note','backup-verify-cancel'].map(id=>[id,{files:[],value:'',dataset:{},textContent:'',disabled:false}])),listeners=new Map(),errors=[];let s=state(),reads=0;
 class File{constructor(name,text){this.name=name;this.text=text;this.size=raw(text).byteLength;}async arrayBuffer(){reads++;return raw(this.text);}}
 const adapter=D.bind({getElementById:id=>nodes[id]},{capture:()=>s,FileType:File,hash:async b=>sha(b),events:{addEventListener:(n,f)=>listeners.set(n,f),removeEventListener:(n,f)=>{assert.equal(listeners.get(n),f);listeners.delete(n);}},onError:e=>errors.push(e.message)});
 return {nodes,errors,listeners,adapter,File,get reads(){return reads;},get s(){return s;}};
}
test('native DOM picker uses literal metadata resets selection and pagehide disposes only owned handlers',async()=>{
 const h=domSetup(),file=h.nodes['backup-verify-file'];file.files=[new h.File('<tag>🎵.zip','ZIP🎵\r\n')];file.value='chosen';file.onchange();await new Promise(setImmediate);assert.equal(h.reads,1);assert.equal(file.value,'');assert.equal(h.nodes['backup-verify-note'].dataset.match,'true');assert.match(h.nodes['backup-verify-note'].textContent,/<tag>🎵.zip/);assert.match(h.nodes['backup-verify-source'].textContent,/2 版/);h.listeners.get('pagehide')();assert.equal(h.nodes['backup-verify-note'].dataset.match,'unknown');h.adapter.dispose();assert.equal(h.listeners.size,0);assert.equal(file.onchange,null);assert.equal(h.nodes['backup-verify-cancel'].onclick,null);
});
test('native adapter refuses File lookalikes and retains no restore or source-writing operation',async()=>{
 const h=domSetup();h.nodes['backup-verify-file'].files=[{name:'same.zip',size:proof().bytes,arrayBuffer:()=>assert.fail('fake File read')}];h.nodes['backup-verify-file'].onchange();await new Promise(setImmediate);assert.equal(h.errors.length,1);assert.equal(h.reads,0);assert.equal(h.nodes['backup-verify-note'].dataset.match,'unknown');h.adapter.dispose();const js=fs.readFileSync('web/backup-verification-dom.js','utf8');assert.doesNotMatch(js,/fetch\(|restore\(|captureDraft|confirmDownload|writeValue|localStorage/);
});
test('download integration establishes only successful sent proof and failed next send keeps prior source',async()=>{
 const nodes=Object.fromEntries(['backup-download','backup-download-cancel','backup-verify-file','backup-verify-source','backup-verify-note','backup-verify-cancel'].map(id=>[id,{files:[],value:'',dataset:{},textContent:'',disabled:false}])),events={addEventListener(){},removeEventListener(){}},timers=[],notes=[];let payload='first',failure=false;
 class File{constructor(text){this.name='renamed.zip';this.text=text;this.size=raw(text).byteLength;}arrayBuffer(){return Promise.resolve(raw(this.text));}}
 const document={getElementById:id=>nodes[id],body:{append(){}},createElement:()=>({click(){if(failure)throw Error('click refused');},remove(){}})};
 const adapter=Download.createAdapter(document,{prepare:async()=>({backup_schema_version:1,backup_sha256:sha(raw(payload)),bytes:raw(payload).byteLength,entry_count:1,selection:'all',download_url:'/api/drafts/backup/download/'+'1'.repeat(32)}),maximum:()=>P.maxBytes,allowed:()=>true,verificationAllowed:()=>true,say:(...v)=>notes.push(v),events,hash:async b=>sha(b),fetch:async()=>new Response(raw(payload),{headers:{'Content-Length':String(raw(payload).byteLength),'Content-Type':'application/octet-stream'}}),verificationOptions:{FileType:File},byteOptions:{url:{createObjectURL:()=>Math.random().toString(),revokeObjectURL(){}},BlobType:Blob,schedule:f=>{timers.push(f);return timers.length;},cancel(){}}});
 const send=()=>nodes['backup-download'].onsubmit({preventDefault(){}}),choose=async t=>{nodes['backup-verify-file'].files=[new File(t)];nodes['backup-verify-file'].onchange();await new Promise(setImmediate);};
 assert.equal(nodes['backup-verify-file'].disabled,true);assert.equal(await send(),true);assert.equal(nodes['backup-verify-file'].disabled,false);await choose('first');assert.equal(nodes['backup-verify-note'].dataset.match,'true');payload='other';failure=true;assert.equal(await send(),false);await choose('first');assert.equal(nodes['backup-verify-note'].dataset.match,'true');failure=false;assert.equal(await send(),true);await choose('first');assert.equal(nodes['backup-verify-note'].dataset.match,'false');await choose('other');assert.equal(nodes['backup-verify-note'].dataset.match,'true');adapter.dispose();
});
test('app injects side-effect-free availability and static modules precede adapter without changing transport',()=>{
 const app=fs.readFileSync('web/app.js','utf8'),html=fs.readFileSync('web/index.html','utf8'),server=fs.readFileSync('music_lab_server.py','utf8'),start=app.indexOf('state.backupDownload='),end=app.indexOf('\nasync function setupLibrary()',start);let calls=0;const state={busy:false},seen={};const context={state,document:{},backupMaximum:P.maxBytes,libraryEnabled:true,backupRestoring:false,libraryAllowed:()=>{calls++;return true;},backupSay(){},backupControls(){},MusicBackupDownloadDom:{createAdapter:(d,o)=>{seen.options=o;return o;}}};vm.runInNewContext(app.slice(start,end),context);assert.equal(seen.options.verificationAllowed(),true);state.busy=true;assert.equal(seen.options.verificationAllowed(),false);assert.equal(calls,0);
 for(const name of ['backup-verification.js','backup-verification-controller.js','backup-verification-dom.js']){assert.ok(html.indexOf('/'+name)<html.indexOf('/backup-download-dom.js'));assert.ok(server.includes('"/'+name+'"'));}assert.match(html,/id="backup-verify-file" data-view-control="verification"/);
});
