// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const C=require('../web/text-verification-controller.js'),D=require('../web/text-verification-dom.js');
const bytes=s=>new TextEncoder().encode(s),flush=()=>new Promise(setImmediate);
function harness({scope='music',withCancel=true}={}){
 const state={scope,revision:1,busy:false,dirty:false,visible:true,source:{name:'original.txt',content:'原文\r\n🎵'}};
 const nodes={file:{files:[],value:'',disabled:true},note:{textContent:'',dataset:{}},source:{textContent:''},cancel:{disabled:true,onclick:null}};
 const reports=[],errors=[],listeners=new Map();let active=0,peak=0,reads=0;
 class File{constructor(text=state.source.content){this.text=text;this.name='saved.txt';this.size=bytes(text).length;this.end=null;this.fail=null;}
  arrayBuffer(){reads++;active++;peak=Math.max(peak,active);return new Promise((resolve,reject)=>{this.end=()=>{active--;resolve(bytes(this.text).buffer);};this.fail=()=>{active--;reject(Error('late file failure'));};});}}
 const adapter=D.bind({getElementById:id=>nodes[id]},{capture:()=>state,FileType:File,ids:{file:'file',note:'note',source:'source',...(withCancel?{cancel:'cancel'}:{})},events:{addEventListener:(n,f)=>listeners.set(n,f),removeEventListener:(n,f)=>{assert.equal(listeners.get(n),f);listeners.delete(n);}},onReport:r=>reports.push(r),onError:e=>errors.push(e.message)});
 const choose=f=>{nodes.file.files=[f];nodes.file.value='selected';nodes.file.onchange();};
 return {state,nodes,reports,errors,listeners,File,adapter,choose,get reads(){return reads},get active(){return active},get peak(){return peak}};
}
test('pending native-file adapter exposes cancellation, preserves source and ignores cancelled success',async()=>{
 const h=harness(),before=structuredClone(h.state),file=new h.File();assert.equal(h.nodes.cancel.disabled,true);h.choose(file);
 assert.equal(h.nodes.file.disabled,true);assert.equal(h.nodes.cancel.disabled,false);assert.equal(h.nodes.file.value,'');h.nodes.cancel.onclick();
 assert.equal(h.nodes.cancel.disabled,true);assert.equal(h.nodes.file.disabled,false);assert.equal(h.nodes.note.dataset.match,'unknown');assert.match(h.nodes.note.textContent,/取消/);
 file.end();await flush();assert.equal(h.reports.length,0);assert.equal(h.errors.length,0);assert.deepEqual(h.state,before);assert.equal(h.active,0);h.adapter.dispose();
});
test('cancelled read error cannot show an error or confirm a new successful retry',async()=>{
 const h=harness(),old=new h.File();h.choose(old);h.nodes.cancel.onclick();const next=new h.File();h.choose(next);next.end();await flush();
 assert.equal(h.nodes.note.dataset.match,'true');const note=h.nodes.note.textContent;old.fail();await flush();assert.equal(h.nodes.note.textContent,note);assert.equal(h.reports.length,1);assert.equal(h.errors.length,0);assert.equal(h.peak,2);h.adapter.dispose();
});
test('two cancelled unfinished reads prevent another file read and a settled slot restores the picker',async()=>{
 const h=harness(),first=new h.File(),second=new h.File(),third=new h.File();h.choose(first);h.nodes.cancel.onclick();h.choose(second);h.nodes.cancel.onclick();
 assert.equal(h.nodes.file.disabled,true);assert.equal(h.nodes.cancel.disabled,true);assert.match(h.nodes.note.textContent,/完成後可再選檔/);h.choose(third);
 assert.equal(h.reads,2);assert.equal(third.end,null);assert.equal(h.peak,2);first.end();await flush();assert.equal(h.nodes.file.disabled,false);
 h.choose(third);third.end();await flush();assert.equal(h.nodes.note.dataset.match,'true');const note=h.nodes.note.textContent;second.end();await flush();assert.equal(h.nodes.note.textContent,note);assert.equal(h.reports.length,1);assert.equal(h.active,0);h.adapter.dispose();
});
test('rapid repeated cancellation remains bounded without modifying source or leaking late reports',async()=>{
 const h=harness(),before=structuredClone(h.state),files=[];
 for(let i=0;i<30;i++){const f=new h.File();files.push(f);h.choose(f);if(!h.nodes.cancel.disabled)h.nodes.cancel.onclick();}
 assert.equal(h.reads,2);assert.equal(h.peak,2);assert.equal(h.active,2);for(const f of files)if(f.end)f.end();await flush();assert.equal(h.active,0);assert.equal(h.nodes.file.disabled,false);assert.equal(h.reports.length,0);assert.equal(h.errors.length,0);assert.deepEqual(h.state,before);h.adapter.dispose();
});
test('source change invalidates pending proof while unfinished read slots remain occupied',async()=>{
 const h=harness(),old=new h.File();h.choose(old);h.state.revision++;h.state.source.content='後續原文';h.adapter.refresh();assert.equal(h.nodes.cancel.disabled,true);
 const next=new h.File();h.choose(next);h.nodes.cancel.onclick();assert.equal(h.nodes.file.disabled,true);old.end();await flush();assert.equal(h.nodes.file.disabled,false);next.fail();await flush();assert.equal(h.reports.length,0);assert.equal(h.errors.length,0);assert.equal(h.state.source.content,'後續原文');h.adapter.dispose();
});
test('metadata failures consume no reader slot and read failures release their slot for a retry',async()=>{
 const h=harness(),oversized=new h.File();oversized.size=8*1024*1024+1;h.choose(oversized);await flush();assert.equal(h.reads,0);assert.equal(h.nodes.cancel.disabled,true);
 const failed=new h.File();h.choose(failed);failed.fail();await flush();assert.equal(h.active,0);assert.equal(h.nodes.file.disabled,false);const good=new h.File();h.choose(good);good.end();await flush();assert.equal(h.reports.length,1);assert.equal(h.nodes.note.dataset.match,'true');assert.equal(h.errors.length,2);h.adapter.dispose();
});
test('dispose removes only its cancel handler and pagehide cancellation refuses late proof in every shared scope',async()=>{
 for(const scope of ['music','draft','audio']){const h=harness({scope}),f=new h.File();h.choose(f);h.listeners.get('pagehide')();f.end();await flush();assert.equal(h.reports.length,0);assert.equal(h.errors.length,0);h.adapter.dispose();assert.equal(h.nodes.cancel.onclick,null);assert.equal(h.nodes.cancel.disabled,true);assert.equal(h.listeners.size,0);}
 const legacy=harness({withCancel:false}),f=new legacy.File();legacy.choose(f);f.end();await flush();assert.equal(legacy.reports.length,1);legacy.adapter.dispose();
});
test('three explicit controls target the corresponding live note and shared adapter without new operations',()=>{
 const html=fs.readFileSync('web/index.html','utf8'),app=fs.readFileSync('web/app.js','utf8'),audio=fs.readFileSync('web/audio-acceptance-dom.js','utf8');
 for(const prefix of ['text','draft','audio-accept']){const id=prefix+'-verify-cancel',tag=html.match(new RegExp('<button id="'+id+'"[^>]*>'))?.[0];assert.ok(tag);assert.match(tag,/type="button"/);assert.ok(tag.includes('aria-controls="'+prefix+'-verify-note"'));assert.ok(tag.includes('aria-describedby="'+prefix+'-verify-note"'));assert.match(tag,/disabled/);}
 assert.match(app,/cancel:'draft-verify-cancel'/);assert.match(audio,/cancel:'audio-accept-verify-cancel'/);assert.match(html.match(/<button id="audio-accept-verify-cancel"[^>]*>/)[0],/data-view-control="verification"/);
 const dom=fs.readFileSync('web/text-verification-dom.js','utf8');assert.match(dom,/cancel\.onclick=/);assert.doesNotMatch(dom,/fetch\(|\/api\/|localStorage|sessionStorage|setFiles|markDirty|confirmDownload/);
});
