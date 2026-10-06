// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const M=require('../web/backup-download.js'),D=require('../web/backup-download-dom.js'),F=require('../web/backup-file.js');
const raw=()=>new TextEncoder().encode('abc').buffer;
const sha='ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad';
const descriptor=()=>({backup_schema_version:1,backup_sha256:sha,bytes:3,entry_count:1,selection:'all',download_url:'/api/drafts/backup/download/'+'1'.repeat(32)});
const later=()=>{let resolve,reject;const promise=new Promise((a,b)=>{resolve=a;reject=b;});return {promise,resolve,reject};};
const response=(body=raw(),headers={})=>new Response(body,{headers:{'Content-Length':'3','Content-Type':'application/octet-stream',...headers}});
function setup(other={}){
 const seen={sent:[],error:[],states:[],prepared:[]},controller=M.createController({prepare:async()=>descriptor(),read:async()=>raw(),hash:F.sha256,send:p=>{seen.prepared.push(p);return true;},onSent:d=>seen.sent.push(d),onError:e=>seen.error.push(e),onState:s=>seen.states.push(s),...other});return {controller,seen};
}
test('complete backup descriptor isolates source and bounds schema, counts, selection, URL and bytes',()=>{
 const d=descriptor(),before=structuredClone(d),got=M.checked(d);got.entry_count=0;assert.deepEqual(d,before);
 for(const mutation of [d=>d.backup_schema_version=2,d=>d.backup_schema_version=true,d=>delete d.backup_sha256,d=>d.backup_sha256='x',d=>d.bytes=-1,d=>d.bytes=NaN,d=>d.bytes=3.5,d=>d.bytes=M.maxBytes+1,d=>d.entry_count=-1,d=>d.entry_count=1001,d=>d.entry_count=true,d=>d.selection='selected',d=>d.download_url='https://outside.invalid/x',d=>d.download_url+='/../extra',d=>d.extra='x']){const d=descriptor();mutation(d);assert.throws(()=>M.checked(d));}
 assert.equal(M.checked({...descriptor(),entry_count:0}).entry_count,0);assert.equal(M.checked({...descriptor(),selection:'selected'},{selection:'selected'}).selection,'selected');for(const maximum of [0,NaN,M.maxBytes+1])assert.throws(()=>M.checked(descriptor(),{maximum}));
});
test('native download reader restricts GET URL, headers and complete streamed bytes',async()=>{
 const calls=[],r=await D.readArchive(descriptor(),{fetch:async(...a)=>{calls.push(a);return response();}});assert.deepEqual(Buffer.from(r),Buffer.from('abc'));assert.equal(calls[0][0],descriptor().download_url);assert.equal(calls[0][1].redirect,'error');assert.equal(calls[0][1].method,'GET');
 for(const headers of [{'Content-Length':'2'},{'Content-Length':'-1'},{'Content-Length':'03'},{'Content-Type':'text/html'}])await assert.rejects(D.readArchive(descriptor(),{fetch:async()=>response(raw(),headers)}));
 let touched=0;await assert.rejects(D.readArchive({...descriptor(),download_url:'http://outside.invalid'},{fetch:async()=>{touched++;}}));assert.equal(touched,0);
});
test('stream overflow, short body and cancelled read stop the owned reader',async()=>{
 for(const text of ['ab','abcd'])await assert.rejects(D.readArchive(descriptor(),{fetch:async()=>response(new TextEncoder().encode(text))}));
 let cancelled=0,current=true;const bytes=new ReadableStream({pull(c){current=false;c.enqueue(new Uint8Array([1]));},cancel(){cancelled++;}});
 assert.equal(await D.readArchive(descriptor(),{isCurrent:()=>current,fetch:async()=>response(bytes)}),null);assert.equal(cancelled,1);
 let called=0;assert.equal(await D.readArchive(descriptor(),{isCurrent:()=>false,fetch:async()=>{called++;}}),null);assert.equal(called,0);
 const emptyChunk=new ReadableStream({start(c){c.enqueue(new Uint8Array());c.close();}});await assert.rejects(D.readArchive(descriptor(),{fetch:async()=>response(emptyChunk)}));
});
test('controller hashes all actual bytes before one isolated binary handoff',async()=>{
 const s=setup();assert.equal(await s.controller.download(),true);assert.equal(s.seen.prepared.length,1);assert.equal(s.seen.prepared[0].name,'zoe-music-lab-backup.zip');assert.deepEqual(Buffer.from(s.seen.prepared[0].bytes),Buffer.from('abc'));assert.deepEqual(s.seen.states.map(x=>x.phase),['preparing','reading','hashing','idle']);assert.equal(s.controller.status().busy,false);
 s.seen.sent[0].entry_count=999;assert.equal(descriptor().entry_count,1);
});
test('bad descriptor, source bytes, hash or refused handoff never emits onSent',async()=>{
 for(const other of [{prepare:async()=>({...descriptor(),entry_count:-1})},{read:async()=>new ArrayBuffer(2)},{hash:async()=>'f'.repeat(64)},{send:()=>false}]){const s=setup(other);assert.equal(await s.controller.download(),false);assert.equal(s.seen.sent.length,0);assert.equal(s.seen.error.length,1);assert.equal(s.controller.status().busy,false);}
});
test('pending prepare blocks duplicates and cancellation suppresses late success and errors',async()=>{
 const pending=later(),s=setup({prepare:()=>pending.promise});const first=s.controller.download();assert.equal(await s.controller.download(),false);s.controller.cancel();pending.resolve(descriptor());assert.equal(await first,false);assert.equal(s.seen.prepared.length,0);assert.equal(s.seen.error.length,0);
 const failure=later(),next=setup({prepare:()=>failure.promise});const work=next.controller.download();next.controller.cancel();failure.reject(Error('late failure'));assert.equal(await work,false);assert.equal(next.seen.error.length,0);
});
test('read and hash completion recheck lifecycle without changing a newer download state',async()=>{
 for(const phase of ['read','hash']){const pending=later(),entered=later(),s=setup({[phase]:()=>{entered.resolve();return pending.promise;}});const work=s.controller.download();await entered.promise;s.controller.cancel();pending.resolve(phase==='read'?raw():sha);assert.equal(await work,false);assert.equal(s.seen.prepared.length,0);assert.equal(s.seen.error.length,0);}
 const pending=later(),entered=later(),d=descriptor(),s=setup({prepare:async()=>d,read:()=>{entered.resolve();return pending.promise;}});const work=s.controller.download();await entered.promise;d.backup_sha256='f'.repeat(64);pending.resolve(raw());assert.equal(await work,true);assert.equal(s.seen.sent[0].backup_sha256,sha);
});
test('required I/O verification and disposed controllers cannot download',async()=>{
 const callbacks={prepare:()=>{},read:()=>{},hash:()=>{},send:()=>{}};for(const key of Object.keys(callbacks)){const v={...callbacks};delete v[key];assert.throws(()=>M.createController(v));}const s=setup();s.controller.dispose();assert.equal(await s.controller.download(),false);assert.equal(s.seen.prepared.length,0);
});
function dom(other={},failure=''){
 const form={},cancelButton={},live=new Map(),timers=new Map(),listeners=new Map(),sent=[],notes=[],states=[],signals=[];let serial=0,timer=0;
 const events={addEventListener(n,f){if(!listeners.has(n))listeners.set(n,new Set());listeners.get(n).add(f);},removeEventListener(n,f){listeners.get(n)?.delete(f);if(!listeners.get(n)?.size)listeners.delete(n);}};
 const nodes=Object.fromEntries(['backup-verify-file','backup-verify-source','backup-verify-note','backup-verify-cancel'].map(id=>[id,{files:[],value:'',dataset:{},textContent:'',disabled:false}]));
 const document={getElementById:id=>id==='backup-download'?form:id==='backup-download-cancel'?cancelButton:nodes[id],body:{append(){if(failure==='append')throw Error('append refused');}},createElement:()=>({click(){if(failure==='click')throw Error('click refused');sent.push({name:this.download,bytes:live.get(this.href)});},remove(){}})};
 const url={createObjectURL(blob){if(failure==='url')throw Error('URL refused');const key='blob:'+ ++serial;live.set(key,blob.parts[0]);return key;},revokeObjectURL:key=>live.delete(key)};
 const adapter=D.createAdapter(document,{prepare:async signal=>{signals.push(signal);return descriptor();},fetch:async()=>response(),maximum:()=>M.maxBytes,allowed:()=>true,say:(...v)=>notes.push(v),onState:s=>states.push(s),events,byteOptions:{url,BlobType:class{constructor(parts){this.parts=parts;}},schedule:f=>{if(failure==='timer')throw Error('timer refused');timers.set(++timer,f);return timer;},cancel:id=>timers.delete(id)},...other});
 const submit=()=>form.onsubmit({preventDefault(){}}),hide=()=>{for(const f of [...listeners.get('pagehide')])f();},finish=()=>{for(const [id,f] of [...timers]){timers.delete(id);f();}};
 return {adapter,form,cancelButton,live,timers,listeners,sent,notes,states,signals,submit,hide,finish};
}
test('shared native byte sender caps URLs and releases binary downloads on timer/pagehide/dispose',async()=>{
 const s=dom();assert.equal(await s.submit(),true);assert.equal(s.sent[0].name,'zoe-music-lab-backup.zip');assert.deepEqual(Buffer.from(s.sent[0].bytes),Buffer.from('abc'));assert.equal(await s.submit(),true);assert.equal(await s.submit(),false);assert.equal(s.live.size,2);s.hide();assert.equal(s.live.size,0);assert.equal(s.timers.size,0);assert.equal(await s.submit(),true);s.finish();assert.equal(s.adapter.pending(),0);s.adapter.dispose();assert.equal(s.listeners.size,0);assert.equal(await s.submit(),false);
});
test('URL, append, click or timer failure never confirms handoff and releases owned binary URLs',async()=>{
 for(const failure of ['url','append','click','timer']){const s=dom({},failure);assert.equal(await s.submit(),false);assert.equal(s.live.size,0);assert.equal(s.timers.size,0);assert.equal(s.notes.filter(([v])=>v.includes('版並送出下載')).length,0);s.adapter.dispose();}
});
test('cancel control aborts this request and a late reply cannot overwrite cancellation notice',async()=>{
 const pending=later(),started=later();let signal;const s=dom({prepare:sig=>{signal=sig;started.resolve();return pending.promise;}});const work=s.submit();await started.promise;assert.equal(s.cancelButton.disabled,false);s.cancelButton.onclick();assert.equal(signal.aborted,true);assert.equal(s.cancelButton.disabled,true);const note=s.notes.at(-1);pending.resolve(descriptor());assert.equal(await work,false);assert.deepEqual(s.notes.at(-1),note);assert.equal(s.sent.length,0);s.adapter.dispose();
});
test('actual app uses abortable descriptor prepare and full source adapter without form-submit transport',async()=>{
 const app=fs.readFileSync('web/app.js','utf8'),start=app.indexOf('state.backupDownload='),end=app.indexOf('\nasync function setupLibrary()',start),calls=[],state={},seen={},signal=new AbortController().signal;
 const context={state,document:{},fetch:async(...v)=>{calls.push(v);return {ok:true,json:async()=>descriptor()};},backupMaximum:M.maxBytes,libraryEnabled:true,backupRestoring:false,libraryAllowed:()=>true,backupSay:()=>{},backupControls:()=>{},MusicBackupDownloadDom:{createAdapter:(document,options)=>{seen.options=options;return options;}},Error};vm.runInNewContext(app.slice(start,end),context);assert.deepEqual(await seen.options.prepare(signal),descriptor());assert.equal(calls[0][0],'/api/drafts/backup/prepare');assert.equal(calls[0][1].signal,signal);assert.equal(calls[0][1].body,'{}');assert.equal(calls[0][1].method,'POST');assert.equal(seen.options.maximum(),M.maxBytes);assert.equal(app.slice(start,end).includes('.submit()'),false);
});
