// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const P=require('../web/text-verification.js'),C=require('../web/text-verification-controller.js'),D=require('../web/text-verification-dom.js');
const bytes=text=>new TextEncoder().encode(text),expected=content=>({name:'original.txt',content});
const source=content=>({scope:'music',revision:1,busy:false,dirty:false,visible:true,source:expected(content)});
test('whole original bytes preserve empty BOM CR LF CRLF NUL Unicode and literal HTML',()=>{
 for(const text of ['','\ufeff中🎵\r\nLF\nCR\r\x00<script>literal</script>','é e\u0301']){const input=expected(text),b=bytes(text),report=P.inspect(input,b);assert.equal(report.matched,true);assert.equal(report.first_difference_byte,null);assert.equal(report.expected_bytes,b.length);assert.equal(report.selected_bytes,b.length);assert.equal(input.content,text);assert.equal(JSON.stringify(report).includes(text)&&!!text&&text.length>20,false);}
});
test('same size changed bytes and longer or shorter inputs report the first byte difference from zero',()=>{
 for(const [old,selected,offset] of [['abc','axc',1],['abc','ab',2],['ab','abc',2],['','x',0],['x','',0],['🎵','🎶',3],['x\r\n','x\n',1],['é','e\u0301',0]]){const r=P.inspect(expected(old),bytes(selected));assert.equal(r.matched,false);assert.equal(r.first_difference_byte,offset);}
});
test('8 MiB complete tail verification is bounded and byte views source paths invalid Unicode refuse',()=>{
 const raw='a'.repeat(P.maxBytes),candidate=bytes(raw);assert.equal(P.inspect(expected(raw),candidate).matched,true);candidate[candidate.length-1]=98;assert.equal(P.inspect(expected(raw),candidate).first_difference_byte,P.maxBytes-1);
 for(const input of [{name:'../x.txt',content:'x'},{name:'NUL.txt',content:'x'},expected('\ud800'),{...expected('x'),path:'other'},expected('🎵'.repeat(P.maxBytes/4)+'x')])assert.throws(()=>P.inspect(input,bytes('x')));
 for(const value of [null,[],new Uint16Array(1),new Uint8Array(P.maxBytes+1)])assert.throws(()=>P.inspect(expected('x'),value));
});
test('chosen basename may be renamed without pretending to select a destination path',()=>{
 assert.deepEqual(P.metadata({name:'我的原文 (1).json',size:0}),{name:'我的原文 (1).json',size:0});
 for(const value of [{name:'x',size:true},{name:'x',size:-1},{name:'x',size:1.5},{name:'x',size:P.maxBytes+1},{name:'x',size:0,path:'other'},{name:'../x',size:0},{name:'C:\\x',size:0},{name:'\ud800',size:0},{name:'🎵'.repeat(257),size:0},null])assert.throws(()=>P.metadata(value));
});
function harness(){let s=source('original\r\n🎵'),reads=0,reports=[],errors=[],views=[];
 const c=C.createController({capture:()=>s,describe:f=>({name:f.name,size:f.size}),readFile:async f=>{reads++;return f.read?await f.read():bytes(f.text)},onReport:(r,m)=>reports.push({r,m}),onError:e=>errors.push(e.message),onState:v=>views.push(v)});
 return {c,get s(){return s},set s(v){s=v},get reads(){return reads},reports,errors,views,file(text=s.source.content,name='saved (1).txt'){return {name,size:bytes(text).length,text}}};
}
test('matched and mismatched chosen originals never change results source draft or metadata',async()=>{
 const h=harness(),before=structuredClone(h.s);assert.equal(await h.c.verify(h.file()),true);assert.equal(h.c.view().report.matched,true);assert.equal(h.c.view().selected.name,'saved (1).txt');assert.equal(await h.c.verify(h.file('other')),true);assert.equal(h.c.view().report.matched,false);assert.deepEqual(h.s,before);assert.equal(h.reports.length,2);
});
test('busy dirty hidden and absent results prevent reads, then state refresh invalidates prior proof',async()=>{
 for(const patch of [{busy:true},{dirty:true},{visible:false},{source:null}]){const h=harness();await h.c.verify(h.file());h.s={...h.s,...patch};h.c.refresh();assert.equal(h.c.view().available,false);assert.equal(h.c.view().report,null);assert.equal(await h.c.verify(h.file('x')),false);assert.equal(h.reads,1);}
});
test('file selection reads immutable source and refuses edited replaced same-name revision or switched panel',async()=>{
 for(const mutate of [h=>h.s.source.content='modified',h=>h.s.source.name='other.txt',h=>h.s.revision++,h=>h.s.scope='lyrics',h=>h.s.busy=true,h=>h.s.dirty=true,h=>h.s.visible=false]){const h=harness();let resolve;const file=h.file();file.read=()=>new Promise(r=>resolve=r);const p=h.c.verify(file);mutate(h);resolve(bytes(file.text));assert.equal(await p,false);assert.equal(h.reports.length,0);assert.equal(h.errors.length,0);assert.equal(h.c.view().report,null);assert.equal(h.c.view().pending,false);}
});
test('old success or old error after a newer chosen file cannot replace the latest verification',async()=>{
 for(const fail of [false,true]){const h=harness();let finish;const file=h.file();file.read=()=>new Promise((resolve,reject)=>finish=()=>fail?reject(Error('late error')):resolve(bytes(file.text)));const old=h.c.verify(file);assert.equal(await h.c.verify(h.file('different','new.txt')),true);finish();assert.equal(await old,false);assert.equal(h.reports.length,1);assert.equal(h.errors.length,0);assert.equal(h.c.view().selected.name,'new.txt');assert.equal(h.c.view().report.matched,false);}
});
test('size and name drift incomplete reads invalid view or read failure reject and good retry works',async()=>{
 for(const bad of ['large','short','type','drift','name','io']){const h=harness(),file=h.file();if(bad==='large')file.size=P.maxBytes+1;file.read=async()=>{if(bad==='short')return bytes('x');if(bad==='type')return {byteLength:file.size};if(bad==='drift')file.size++;if(bad==='name')file.name='changed.txt';if(bad==='io')throw Error('cannot read');return bytes(file.text);};assert.equal(await h.c.verify(file),false);assert.equal(h.c.view().report,null);assert.equal(h.errors.length,1);if(bad==='large')assert.equal(h.reads,0);assert.equal(await h.c.verify(h.file()),true);}
});
test('cancel and dispose refuse late read and dispose prevents new captures or effects',async()=>{
 for(const method of ['cancel','dispose']){const h=harness();let resolve;const file=h.file();file.read=()=>new Promise(r=>resolve=r);const p=h.c.verify(file);h.c[method]();resolve(bytes(file.text));assert.equal(await p,false);assert.equal(h.reports.length,0);assert.equal(h.errors.length,0);if(method==='dispose'){assert.equal(await h.c.verify(h.file()),false);assert.equal(h.reads,1);}else assert.equal(await h.c.verify(h.file()),true);}
});
test('returned DTOs and callback copies cannot alter retained byte proof',async()=>{
 const h=harness();await h.c.verify(h.file());h.reports[0].r.matched=false;h.reports[0].m.name='other';const view=h.c.view();view.report.matched=false;view.selected.name='other';assert.equal(h.c.view().report.matched,true);assert.equal(h.c.view().selected.name,'saved (1).txt');assert.equal(Object.hasOwn(h.c.view().report,'content'),false);
});
test('capture metadata strict shape and selected-file identity are independent from draft or media',()=>{
 for(const patch of [{extra:1},{revision:-1},{busy:0},{scope:'other'},{source:{name:'x'}},{source:{name:'x',content:'x',path:'x'}}])assert.throws(()=>C.snapshot({...source('x'),...patch}));const original=source('x'),copy=C.snapshot(original);original.source.content='y';assert.equal(copy.source.content,'x');assert.equal(Object.hasOwn(copy,'media'),false);
});
function domHarness(){let state=source('original\r\n🎵'),reads=0;const nodes={'text-verify-file':{files:[],value:'',disabled:true},'text-verify-note':{textContent:'',dataset:{}},'text-verify-source':{textContent:''}},listeners=new Map(),errors=[],reports=[];
 class File {constructor(name,text){this.name=name;this.text=text;this.size=bytes(text).length}async arrayBuffer(){reads++;return bytes(this.text).buffer;}}
 const adapter=D.bind({getElementById:id=>nodes[id]},{capture:()=>state,FileType:File,events:{addEventListener:(n,f)=>listeners.set(n,f),removeEventListener:(n,f)=>{assert.equal(listeners.get(n),f);listeners.delete(n)}},onReport:r=>reports.push(r),onError:e=>errors.push(e.message)});
 return {nodes,listeners,errors,reports,adapter,File,get reads(){return reads},get state(){return state}};
}
test('DOM adapter reads chosen native File, resets picker, presents literal basename and matching bytes',async()=>{
 const h=domHarness(),file=h.nodes['text-verify-file'];file.files=[new h.File('<script>🎵.json','original\r\n🎵')];file.value='selected';file.onchange();await new Promise(setImmediate);assert.equal(file.value,'');assert.equal(h.reads,1);assert.equal(h.nodes['text-verify-note'].dataset.match,'true');assert.match(h.nodes['text-verify-note'].textContent,/<script>🎵.json/);assert.equal(h.reports[0].matched,true);h.adapter.dispose();assert.equal(h.listeners.size,0);assert.equal(file.onchange,null);
});
test('DOM rejects an arbitrary object instead of native File and keeps canonical values unchanged',async()=>{
 const h=domHarness(),before=structuredClone(h.state);h.nodes['text-verify-file'].files=[{name:'other',size:2,arrayBuffer:()=>assert.fail('non-native read')}];h.nodes['text-verify-file'].onchange();await new Promise(setImmediate);assert.equal(h.errors.length,1);assert.equal(h.reads,0);assert.deepEqual(h.state,before);h.adapter.dispose();
});
test('pagehide cancels proof and picker reflects dirty state without claiming persistence',async()=>{
 const h=domHarness(),file=h.nodes['text-verify-file'];file.files=[new h.File('same','original\r\n🎵')];file.onchange();await new Promise(setImmediate);h.listeners.get('pagehide')();assert.equal(h.nodes['text-verify-note'].dataset.match,'unknown');h.state.dirty=true;h.adapter.refresh();assert.equal(file.disabled,true);assert.match(h.nodes['text-verify-note'].textContent,/取消/);h.adapter.dispose();
});
test('canonical result integration does not compare textarea excerpts or grant new operations',()=>{
 const fs=require('node:fs'),html=fs.readFileSync('web/index.html','utf8'),app=fs.readFileSync('web/app.js','utf8'),start=app.indexOf('state.textVerification=MusicTextVerificationDOM.bind'),end=app.indexOf("document.querySelectorAll('[data-tab]')",start),integration=app.slice(start,end);assert.match(integration,/content:state.files\[name\]/);assert.doesNotMatch(integration,/output-content|confirmDownload|markDirty|setFiles|\/api\//);for(const name of ['text-verification.js','text-verification-controller.js','text-verification-dom.js']){assert.ok(html.indexOf('/'+name)<html.indexOf('/app.js'));assert.ok(html.indexOf('/'+name)>html.indexOf('/text-download.js'));}
});
