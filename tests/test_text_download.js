// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const model=require('../web/text-download.js');
test('exact UTF8 preserves BOM, empty files, CR LF CRLF, NUL and non-BMP text',()=>{
 for(const text of ['', '\ufeff🎵繁體\r\nLF\nCR\r\x00<script>literal</script>', 'a'.repeat(8*1024*1024), '\x00'.repeat(8*1024*1024)]){
  const input={name:'original.txt',content:text},r=model.prepare(input);assert.deepEqual(Buffer.from(r.bytes),Buffer.from(text,'utf8'));assert.equal(r.name,input.name);assert.equal(input.content,text);
 }
});
test('UTF8 byte limit includes non-ASCII and refuses lone surrogate instead of silently replacing',()=>{
 assert.equal(model.prepare({name:'x.md',content:'🎵'.repeat(model.maxBytes/4)}).bytes.length,model.maxBytes);
 for(const text of ['a'.repeat(model.maxBytes+1),'🎵'.repeat(model.maxBytes/4)+'a','\ud800','a\udfff'])assert.throws(()=>model.prepare({name:'x.md',content:text}));
});
test('paths, devices, binary types and extra fields cannot request a local file destination',()=>{
 for(const name of ['../x.txt','C:\\x.txt','/x.txt','x.png','NUL.txt','COM1.md','x.txt.','x'.repeat(100)+'.txt','<script>.html'])assert.throws(()=>model.prepare({name,content:'text'}));
 for(const value of [{name:'x.md',content:'text',path:'outside'},{name:'x.md'},null,{name:'x.md',content:3}])assert.throws(()=>model.prepare(value));
});
function setup(failure=''){
 const live=new Map(),timers=new Map(),sent=[],listeners=new Map();let created=0,removed=0,timer=0;
 const document={body:{append:a=>{if(failure==='append')throw Error('append refused');a.appended=true;}},createElement:()=>({click(){if(failure==='click')throw Error('click refused');sent.push({name:this.download,raw:live.get(this.href)});},remove(){removed++;}})};
 const url={createObjectURL:b=>{if(failure==='url')throw Error('url refused');const id='blob:'+ ++created;live.set(id,b.parts[0]);return id;},revokeObjectURL:id=>live.delete(id)};
 const events={addEventListener:(n,f)=>listeners.set(n,f),removeEventListener:(n,f)=>{assert.equal(listeners.get(n),f);listeners.delete(n)}};
 const context={MusicTextDownload:model};vm.runInNewContext(fs.readFileSync('web/text-download-dom.js','utf8'),context);
 const adapter=context.MusicTextDownloadDom.createAdapter(document,{url,events,BlobType:class{constructor(parts){this.parts=parts;}},schedule:f=>{if(failure==='timer')throw Error('timer refused');timers.set(++timer,f);return timer;},cancel:id=>timers.delete(id)});
 const finish=()=>{for(const [id,f] of [...timers]){timers.delete(id);f();}};
 return {adapter,document,live,timers,sent,listeners,finish,removed:()=>removed};
}
test('DOM downloads raw bytes without form transport; bounded URLs are released after handoff',()=>{
 const s=setup(),text='\ufeff中🎵\r\nLF\nCR\r\x00';assert.equal(s.adapter.send('x.txt',text),true);assert.deepEqual(Buffer.from(s.sent[0].raw),Buffer.from(text));assert.equal(s.removed(),1);assert.equal(s.adapter.pending(),1);
 s.adapter.send('second.txt','');assert.throws(()=>s.adapter.send('third.txt','later'));assert.equal(s.live.size,2);s.finish();assert.equal(s.live.size,0);assert.equal(s.adapter.pending(),0);assert.equal(s.timers.size,0);assert.equal(s.adapter.send('third.txt','later'),true);s.adapter.dispose();assert.equal(s.live.size,0);assert.equal(s.listeners.size,0);assert.throws(()=>s.adapter.send('late.txt','late'));
});
test('URL, DOM, click and scheduling failure release owned URLs and never confirm download',()=>{
 for(const failure of ['url','append','click','timer']){const s=setup(failure),errors=[];let confirmed=0;const form={};s.adapter.bind(form,{select:()=>({name:'x.txt',content:'same'}),onSent:()=>confirmed++,onError:e=>errors.push(e.message)});let prevented=0;assert.equal(form.onsubmit({preventDefault:()=>prevented++}),false);assert.equal(prevented,1);assert.equal(confirmed,0);assert.equal(errors.length,1);assert.equal(s.live.size,0);assert.equal(s.adapter.pending(),0);s.adapter.dispose();}
});
test('submit rechecks current source; busy or stale selections do not download or retain',()=>{
 const s=setup(),form={},errors=[];let current={name:'x.txt',content:'first'},allowed=true,confirmed=[];
 s.adapter.bind(form,{select:()=>{if(!allowed)throw Error('stale');return current},onSent:v=>confirmed.push(v.content),onError:e=>errors.push(e.message)});
 current={name:'x.txt',content:'later\r\n'};assert.equal(form.onsubmit({preventDefault(){}}),true);assert.equal(Buffer.from(s.sent[0].raw).toString(),'later\r\n');assert.deepEqual(confirmed,['later\r\n']);s.finish();allowed=false;assert.equal(form.onsubmit({preventDefault(){}}),false);assert.equal(s.sent.length,1);assert.deepEqual(errors,['stale']);s.adapter.dispose();
});
test('pagehide releases only owned URLs and keeps adapter reusable after page restoration',()=>{
 const s=setup();s.adapter.send('x.txt','same');s.listeners.get('pagehide')();assert.equal(s.live.size,0);assert.equal(s.timers.size,0);assert.equal(s.adapter.send('back.txt','back'),true);s.adapter.dispose();
});
test('failed acceptance download preserves the previous pending snapshot and later dirty values',()=>{
 const acceptance=require('../web/audio-acceptance.js');let values={format:acceptance.format,schema_version:1,profile:'distribution',custom:true,fields:{rates:'48000',bits:'16',channels:'2'}};
 const c=acceptance.createController({capture:()=>values,replace:v=>values=v,media:()=>null,read:()=>{},events:{addEventListener(){},removeEventListener(){}},allowed:()=>true});c.changed();assert.throws(()=>c.download(()=>{throw Error('refused')}));assert.equal(c.status().pendingDownload,false);assert.equal(c.confirm(),false);c.download(()=>{});values={...values,fields:{...values.fields,rates:'44100'}};c.changed();assert.throws(()=>c.download(()=>{throw Error('refused')}));assert.equal(c.status().mode,'changed_after_download');c.confirm();assert.equal(c.status().dirty,true);c.dispose();
});
