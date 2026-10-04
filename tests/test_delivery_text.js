// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),crypto=require('node:crypto'),{execFileSync}=require('node:child_process'),fs=require('node:fs'),vm=require('node:vm');
const text=require('../web/delivery-text.js'),importer=require('../web/delivery-import.js'),pack=require('../web/delivery-package.js');
const hash=async raw=>crypto.createHash('sha256').update(raw).digest('hex');
const edge='\ufeff原文🎵\r\nLF\nCR\r\x00<script>literal</script>';
const python=JSON.parse(execFileSync('python',['-X','utf8','-c',`import json
from musiclab.delivery_text import window
text='\\ufeff原文🎵\\r\\nLF\\nCR\\r\\x00<script>literal</script>'
print(json.dumps([window(text,0,4),window(text,3,7),window(text,0,16384),window('',0,4)],ensure_ascii=False))`],{encoding:'utf8',timeout:10000}));
const canonical=JSON.parse(execFileSync('python',['-X','utf8','-c',`import json,io
from musiclab.application import build
from musiclab.delivery_package import prepare
edge='\\ufeff原文🎵\\r\\nLF\\nCR\\r\\x00<script>literal</script>'
rows=[]
for scope in ['music','storyboard','lyrics','audio']:
 files={'full.txt':edge+'a'*32768+'v44 tail original','empty.txt':'','literal.html':'<script>must_stay_literal()</script>'}
 raw=prepare({'scope':scope,'label':'v44 original window','files':files}).archive
 rows.append(build('delivery_inspect',{'include_files':True},delivery_source=io.BytesIO(raw)).wire())
print(json.dumps(rows,ensure_ascii=False))`],{encoding:'utf8',timeout:10000}));
test('Python and browser window bytes agree including preserved BOM and controls',()=>{
 for(const [index,content,start,limit] of [[0,edge,0,4],[1,edge,3,7],[2,edge,0,16384],[3,'',0,4]])assert.deepEqual(text.window(content,start,limit),python[index]);
 assert.ok(text.window(edge).text.startsWith('\ufeff'));assert.equal(text.checked(text.window(edge)).text,edge);
});
test('prepared UTF8 source reconstructs full 8MiB through bounded windows without exposing mutable bytes',()=>{
 const content='甲🎵\r\n'.repeat(Math.floor(pack.maxSource/9))+'a'.repeat(pack.maxSource%9),source=text.prepare(content);assert.equal(source.source_bytes,pack.maxSource);assert.equal(Object.isFrozen(source),true);assert.equal(Object.hasOwn(source,'bytes'),false);
 let start=0,pieces=[],count=0;while(true){const p=source.window(start);assert.ok(Buffer.byteLength(p.text)<=16384);pieces.push(p.text);count++;if(p.next_byte===null)break;assert.ok(p.next_byte>start);start=p.next_byte;}assert.equal(pieces.join(''),content);assert.ok(count<=513);
});
test('invalid byte boundaries, type, limits and Unicode fail instead of repair',()=>{
 for(const args of [['a🎵z',2,4],['x',true,4],['x',0,true],['x',0,3],['x',0,16385],['x',-1,4],['x',2,4],['\ud800',0,4],['x'.repeat(pack.maxSource+1),0,4]])assert.throws(()=>text.window(...args));
 const valid=text.window('abc');for(const changed of [{...valid,text:'ab'},{...valid,next_byte:0},{...valid,start_byte:-1},{...valid,extra:true},{...valid,end_byte:4}])assert.throws(()=>text.checked(changed));
});
test('reader next previous and first retain bounded pages and reset on source change',()=>{
 let origin={key:'one',canRead:true},content='a'.repeat(16384)+'🎵'+'z'.repeat(17000),errors=[],states=[];const prepared=text.prepare(content),r=text.createReader({source:()=>origin,read:start=>prepared.window(start),onError:e=>errors.push(e.message),onState:s=>states.push(s)});
 assert.equal(r.first(),true);assert.equal(r.status().page.start_byte,0);assert.equal(r.next(),true);assert.equal(r.status().page.start_byte,16384);assert.ok(r.status().page.text.startsWith('🎵'));assert.equal(r.next(),true);assert.equal(r.status().canNext,false);assert.equal(r.previous(),true);assert.equal(r.status().page.start_byte,16384);assert.equal(r.first(),true);assert.equal(r.status().canPrevious,false);
 origin={key:'two',canRead:true};assert.equal(r.refresh().page,null);assert.equal(r.next(),false);assert.equal(r.first(),true);origin.canRead=false;assert.equal(r.refresh().page,null);assert.equal(r.first(),false);assert.deepEqual(errors,[]);assert.ok(states.length>0);
});
test('reader rejects incorrect or changing reply, preserves current page on retryable failure',()=>{
 let origin={key:'same',canRead:true},mode='good',errors=[];const source=text.prepare('a'.repeat(40000)),r=text.createReader({source:()=>origin,read:start=>{if(mode==='throw')throw Error('synthetic refusal');if(mode==='change')origin.key='new';const p=source.window(start);return mode==='bad'?{...p,start_byte:0}:p;},onError:e=>errors.push(e.message)});
 r.first();mode='throw';assert.equal(r.next(),false);assert.equal(r.status().page.start_byte,0);mode='bad';assert.equal(r.next(),false);assert.equal(r.status().page.start_byte,0);mode='good';assert.equal(r.next(),true);mode='change';assert.equal(r.next(),false);assert.equal(r.status().page,null);assert.equal(errors.length,2);
 const other=text.createReader({source:()=>({key:'other',canRead:true}),read:start=>source.window(start,4),onError:()=>{}});assert.equal(other.first(),false);assert.equal(other.status().page,null);
});
async function setup(scope='lyrics'){
 const wire=structuredClone(canonical.find(w=>w.data.manifest.scope===scope)),d=wire.data,view={scope,revision:1,resultRevision:1,bundle:{files:{'removed.txt':'before\r\n🎵','full.txt':'before '+edge+'b'.repeat(40000)},dirty:false},media:[{}],busy:false},errors=[];let replaced=0;
 const options={capture:()=>view,read:async()=>({wire,selected:{bytes:d.archive_bytes,sha256:d.archive_sha256,manifest:d.manifest}}),hash,onError:e=>errors.push(e.message),replace:r=>{replaced++;view.bundle={files:r.files};view.resultRevision++;},restore:b=>{view.bundle=b;view.resultRevision++;}};
 return {wire,view,errors,options,file:{name:'original.zip',size:d.archive_bytes},replaced:()=>replaced};
}
test('four-scope pending reader shows both complete original sides and keeps results media and downloads',async()=>{
 for(const scope of ['music','storyboard','lyrics','audio']){const s=await setup(scope),c=importer.createController(s.options),before=structuredClone(s.view.bundle),media=s.view.media[0];await c.inspect(s.file);
  for(const side of ['before','incoming']){let start=0,pieces=[];while(true){const p=c.textWindow('full.txt',side,start);pieces.push(p.text);if(p.next_byte===null)break;start=p.next_byte;}assert.equal(pieces.join(''),side==='before'?before.files['full.txt']:s.wire.files['full.txt']);}
  assert.equal(c.textWindow('removed.txt','incoming'),null);assert.equal(c.textWindow('removed.txt','before').text,'before\r\n🎵');assert.equal(c.textWindow('empty.txt','incoming').source_bytes,0);assert.equal(c.originalFile('full.txt').content,s.wire.files['full.txt']);assert.deepEqual(s.view.bundle,before);assert.equal(s.view.media[0],media);assert.equal(s.replaced(),0);assert.equal(c.status().canApply,true);c.cancel();assert.equal(c.textWindow('full.txt','incoming'),null);
 }
});
test('cached reader is invalidated by form result bundle media scope busy apply undo and a new preview',async()=>{
 for(const change of [v=>v.revision++,v=>v.resultRevision++,v=>v.bundle.files['full.txt']='later',v=>v.media=[{}],v=>v.scope='music',v=>v.busy=true]){const s=await setup(),c=importer.createController(s.options);await c.inspect(s.file);c.textWindow('full.txt','incoming');change(s.view);c.refresh();assert.equal(c.textWindow('full.txt','incoming',16384),null);assert.equal(s.replaced(),0);}
 const s=await setup(),c=importer.createController(s.options);await c.inspect(s.file);c.textWindow('full.txt','incoming');c.apply();assert.equal(c.textWindow('full.txt','incoming'),null);c.undo();assert.equal(c.textWindow('full.txt','incoming'),null);await c.inspect(s.file);assert.equal(c.textWindow('full.txt','incoming').text,text.window(s.wire.files['full.txt']).text);c.cancel();
});
function dom(s){
 const ids=['delivery-import-file','delivery-import-preview','delivery-import-apply','delivery-import-undo','delivery-import-note','delivery-import-files','delivery-import-source','delivery-import-cancel','delivery-review-file','delivery-review-summary','delivery-review-before','delivery-review-incoming','delivery-review-before-note','delivery-review-incoming-note','delivery-original-download','delivery-original-note','delivery-report-json','delivery-report-md','delivery-reader','delivery-reader-side','delivery-reader-content','delivery-reader-note','delivery-reader-first','delivery-reader-previous','delivery-reader-next','delivery-search-query','delivery-search-find','delivery-search-more','delivery-search-match','delivery-search-note'],nodes={},sent=[];
 for(const id of ids)nodes[id]={value:'',open:false,replaceChildren(){this.children=[];this.value=''},append(v){(this.children||=[]).push(v)}};nodes['delivery-reader-side'].value='incoming';
 const context={MusicDeliveryText:text,MusicDeliverySearch:require('../web/delivery-search.js'),MusicDeliveryImport:importer};for(const file of ['web/delivery-text-dom.js','web/delivery-search-dom.js','web/delivery-import-dom.js'])vm.runInNewContext(fs.readFileSync(file,'utf8'),context);
 const c=context.MusicDeliveryImportDom.createAdapter({getElementById:id=>nodes[id],createElement:()=>({})},{...s.options,downloadText:(name,content)=>{sent.push({name,content});return true}});return {c,nodes,sent};
}
test('DOM pages literal originals, switches missing versus empty and retains subsequent explicit apply undo',async()=>{
 const s=await setup(),d=dom(s),n=d.nodes,before=structuredClone(s.view.bundle);await d.c.inspect(s.file);n['delivery-review-file'].value='full.txt';n['delivery-review-file'].onchange();n['delivery-reader'].open=true;n['delivery-reader'].ontoggle();assert.match(n['delivery-reader-note'].textContent,/0–16384／32831/);assert.equal(n['delivery-reader-previous'].disabled,true);assert.equal(n['delivery-reader-next'].onclick(),true);assert.equal(n['delivery-reader-previous'].onclick(),true);assert.equal(n['delivery-reader-next'].onclick(),true);assert.equal(n['delivery-reader-first'].onclick(),true);assert.equal(n['delivery-reader-content'].value,text.window(s.wire.files['full.txt']).text);
 n['delivery-reader-side'].value='before';n['delivery-reader-side'].onchange();assert.ok(n['delivery-reader-content'].value.startsWith('before '));n['delivery-review-file'].value='removed.txt';n['delivery-review-file'].onchange();assert.equal(n['delivery-reader-content'].value,'before\n🎵'.replace('\n','\r\n'));n['delivery-reader-side'].value='incoming';n['delivery-reader-side'].onchange();assert.match(n['delivery-reader-note'].textContent,/沒有這個檔案/);assert.equal(n['delivery-reader-next'].disabled,true);
 n['delivery-review-file'].value='empty.txt';n['delivery-review-file'].onchange();assert.match(n['delivery-reader-note'].textContent,/有效的空檔/);n['delivery-review-file'].value='literal.html';n['delivery-review-file'].onchange();assert.equal(n['delivery-reader-content'].value,s.wire.files['literal.html']);assert.equal(n['delivery-original-download'].onclick(),true);assert.deepEqual(d.sent,[{name:'literal.html',content:s.wire.files['literal.html']}]);assert.deepEqual(s.view.bundle,before);assert.equal(s.replaced(),0);assert.equal(d.c.apply(),true);assert.equal(n['delivery-reader-content'].value,'');assert.equal(d.c.undo(),true);assert.deepEqual(s.view.bundle,before);
});
test('DOM clears stale pages and controls after edits cancellation and new file selection',async()=>{
 const s=await setup(),d=dom(s),n=d.nodes;await d.c.inspect(s.file);n['delivery-review-file'].value='full.txt';n['delivery-review-file'].onchange();n['delivery-reader'].open=true;n['delivery-reader'].ontoggle();n['delivery-reader-next'].onclick();s.view.revision++;d.c.refresh();assert.equal(n['delivery-reader-content'].value,'');assert.equal(n['delivery-reader-next'].disabled,true);assert.match(n['delivery-reader-note'].textContent,/修改/);d.c.cancel();assert.equal(n['delivery-reader-side'].disabled,true);await d.c.inspect(s.file);n['delivery-review-file'].value='empty.txt';n['delivery-review-file'].onchange();assert.equal(n['delivery-reader-content'].value,'');assert.equal(n['delivery-reader-next'].disabled,true);assert.match(n['delivery-reader-note'].textContent,/空檔/);d.c.cancel();
});
test('DOM reset releases previous encoded source even when switching to a missing file',async()=>{
 const s=await setup(),original=text.prepare;let prepared=0;text.prepare=value=>{prepared++;return original(value);};
 try{const d=dom(s),n=d.nodes;await d.c.inspect(s.file);n['delivery-review-file'].value='full.txt';n['delivery-review-file'].onchange();n['delivery-reader'].open=true;n['delivery-reader'].ontoggle();assert.equal(prepared,1);n['delivery-reader-next'].onclick();assert.equal(prepared,1);
  n['delivery-review-file'].value='removed.txt';n['delivery-review-file'].onchange();assert.equal(n['delivery-reader-content'].value,'');assert.equal(prepared,1);n['delivery-review-file'].value='full.txt';n['delivery-review-file'].onchange();assert.equal(prepared,2);d.c.cancel();await d.c.inspect(s.file);n['delivery-review-file'].value='full.txt';n['delivery-review-file'].onchange();assert.equal(prepared,3);d.c.cancel();
 }finally{text.prepare=original;}
});
