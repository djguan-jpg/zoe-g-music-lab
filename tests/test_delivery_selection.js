// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),crypto=require('node:crypto'),{execFileSync}=require('node:child_process');
const importer=require('../web/delivery-import.js'),pack=require('../web/delivery-package.js');
const hash=async raw=>crypto.createHash('sha256').update(raw).digest('hex');
const rows=JSON.parse(execFileSync('python',['-X','utf8','-c',`import json,io,sys
sys.path.insert(0,'tests')
from test_delivery_selection import fixture
from musiclab.delivery_package import prepare
from musiclab.application import build
rows=[]
for scope in ['music','storyboard','lyrics','audio']:
 s=fixture(scope,True);raw=prepare(s).archive
 metadata=build('delivery_inspect',{},delivery_source=io.BytesIO(raw)).wire()
 selected=build('delivery_inspect',{'include_files':True,'file_names':['selected.txt','empty.txt']},delivery_source=io.BytesIO(raw)).wire()
 rows.append({'scope':scope,'metadata':metadata,'selected':selected,'small':{k:v for k,v in s['files'].items() if k!='full.txt'}})
print(json.dumps(rows,ensure_ascii=False))`],{encoding:'utf8',timeout:10000}));
function setup(row=rows[0],extras={}){
 const source={...row.small,'full.txt':'a'.repeat(pack.maxSource-Object.values(row.small).reduce((n,t)=>n+Buffer.byteLength(t),0))},wire={...row.metadata,files:source},view={scope:row.scope,revision:1,resultRevision:1,bundle:{files:{'removed.txt':'keep old original'},note:'current results',dirty:false},busy:false,media:[{}]},errors=[];
 let replacements=0,restores=0;const options={capture:()=>view,read:async()=>({wire,selected:{bytes:wire.data.archive_bytes,sha256:wire.data.archive_sha256,manifest:wire.data.manifest}}),hash,replace:r=>{replacements++;view.bundle={files:r.files};view.resultRevision++},restore:b=>{restores++;view.bundle=b;view.resultRevision++},onError:e=>errors.push(e.message),...extras};const c=importer.createController(options);
 return {c,view,errors,options,wire,file:{name:'selected.zip',size:wire.data.archive_bytes},counts:()=>({replacements,restores})};
}
test('four scope original selections match Python bytes from fully verified 8MiB/64-file ZIP',async()=>{
 for(const row of rows){const s=setup(row),before=structuredClone(s.view.bundle),media=s.view.media[0];await s.c.inspect(s.file);for(const name of ['selected.txt','empty.txt'])assert.deepEqual(s.c.originalFile(name),{name,content:row.selected.files[name]});assert.deepEqual(s.view.bundle,before);assert.equal(s.view.media[0],media);assert.deepEqual(s.counts(),{replacements:0,restores:0});assert.equal(s.c.status().canApply,true);assert.equal(s.wire.data.manifest.file_count,64);assert.equal(s.wire.data.manifest.source_bytes,pack.maxSource);s.c.cancel();}
});
test('download uses all original text while comparison preview stays bounded',async()=>{
 const s=setup();await s.c.inspect(s.file);const before=s.c.filePreview('full.txt');assert.equal(before.incoming.truncated,true);assert.equal(before.incoming.text.length,32768);assert.equal(s.c.originalFile('full.txt').content.length,s.wire.files['full.txt'].length);assert.ok(s.c.originalFile('full.txt').content.length>8*1024*1024-100);s.c.cancel();
});
test('removed, unknown and path names cannot select another original, empty remains distinct',async()=>{
 const s=setup();await s.c.inspect(s.file);assert.deepEqual(s.c.originalFile('empty.txt'),{name:'empty.txt',content:''});for(const name of ['removed.txt','../selected.txt','SELECTED.TXT','not-present.txt'])assert.equal(s.c.originalFile(name),null);assert.equal(s.c.status().canApply,true);assert.equal(s.counts().replacements,0);s.c.cancel();
});
test('form, result, media, scope and busy changes reject original download without replacing state',async()=>{
 for(const mutate of [v=>v.revision++,v=>v.resultRevision++,v=>v.bundle.files['later.txt']='later',v=>v.media=[{}],v=>v.scope='audio',v=>v.busy=true]){const s=setup();await s.c.inspect(s.file);mutate(s.view);const before=structuredClone(s.view.bundle);assert.equal(s.c.originalFile('selected.txt'),null);assert.deepEqual(s.view.bundle,before);assert.equal(s.counts().replacements,0);assert.equal(s.errors.length,1);s.c.cancel();}
});
test('reading, cancelled, applied and replaced previews do not expose stale original text',async()=>{
 let release;const hold=new Promise(r=>release=r),s=setup(rows[0]);const read=s.options.read;s.options.read=async()=>{await hold;return read()};const c=importer.createController(s.options),work=c.inspect(s.file);assert.equal(c.originalFile('selected.txt'),null);c.cancel();release();assert.equal(await work,false);assert.equal(c.originalFile('selected.txt'),null);await s.c.inspect(s.file);s.c.apply();assert.equal(s.c.originalFile('selected.txt'),null);assert.equal(s.c.undo(),true);assert.equal(s.c.originalFile('selected.txt'),null);
});
function dom(s,fail=false){
 const ids=['delivery-import-file','delivery-import-preview','delivery-import-apply','delivery-import-undo','delivery-import-note','delivery-import-files','delivery-import-source','delivery-import-cancel','delivery-review-file','delivery-review-summary','delivery-review-before','delivery-review-incoming','delivery-review-before-note','delivery-review-incoming-note','delivery-reader','delivery-reader-side','delivery-reader-content','delivery-reader-note','delivery-reader-first','delivery-reader-previous','delivery-reader-next','delivery-original-download','delivery-original-note','delivery-report-json','delivery-report-md'],nodes={},sent=[];
 for(const id of ids)nodes[id]={value:'',replaceChildren(){this.children=[];this.value=''},append(v){(this.children||=[]).push(v)}};
 let refused=fail;const context={MusicDeliveryImport:importer};vm.runInNewContext(fs.readFileSync('web/delivery-text-dom.js','utf8'),Object.assign(context,{MusicDeliveryText:require('../web/delivery-text.js')}));vm.runInNewContext(fs.readFileSync('web/delivery-import-dom.js','utf8'),context);const c=context.MusicDeliveryImportDom.createAdapter({getElementById:id=>nodes[id],createElement:()=>({})},{...s.options,downloadText:(name,content)=>{if(refused)throw Error('synthetic native refusal');sent.push({name,content});return true}});
 return {nodes,c,sent,allow:()=>refused=false};
}
test('DOM switches original/removed/empty selection literally and downloads without applying',async()=>{
 const s=setup(),d=dom(s),before=structuredClone(s.view.bundle);assert.equal(d.nodes['delivery-original-download'].disabled,true);await d.c.inspect(s.file);d.nodes['delivery-review-file'].value='removed.txt';d.nodes['delivery-review-file'].onchange();assert.equal(d.nodes['delivery-original-download'].disabled,true);assert.match(d.nodes['delivery-original-note'].textContent,/ZIP沒有/);d.nodes['delivery-review-file'].value='empty.txt';d.nodes['delivery-review-file'].onchange();assert.equal(d.nodes['delivery-original-download'].disabled,false);assert.equal(d.nodes['delivery-original-download'].onclick(),true);assert.deepEqual(d.sent,[{name:'empty.txt',content:''}]);assert.match(d.nodes['delivery-original-note'].textContent,/已送出/);assert.deepEqual(s.view.bundle,before);assert.equal(s.counts().replacements,0);assert.equal(d.c.status().canApply,true);d.c.cancel();assert.equal(d.nodes['delivery-original-download'].disabled,true);
});
test('native download failure retains preview and current results and allows explicit retry',async()=>{
 const s=setup(),d=dom(s,true),before=structuredClone(s.view.bundle);await d.c.inspect(s.file);d.nodes['delivery-review-file'].value='selected.txt';d.nodes['delivery-review-file'].onchange();assert.equal(d.nodes['delivery-original-download'].onclick(),false);assert.deepEqual(s.view.bundle,before);assert.equal(d.c.status().canApply,true);assert.equal(s.errors.length,1);d.allow();assert.equal(d.nodes['delivery-original-download'].onclick(),true);assert.equal(d.sent[0].content,s.wire.files['selected.txt']);s.view.revision++;d.c.refresh();assert.equal(d.nodes['delivery-original-download'].disabled,true);assert.equal(d.nodes['delivery-original-download'].onclick(),false);assert.equal(d.sent.length,1);d.c.cancel();
});
