// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),{execFileSync}=require('node:child_process');
const L=require('../musiclab/assets/lyrics-download.js'),D=require('../web/text-download.js'),P=require('../musiclab/assets/lyrics-package.js');
const wire=JSON.parse(execFileSync('python',['-X','utf8','-c',`import json
from musiclab.application import build
p=build('lyrics',{'title':'CON','duration':10,'cues':[{'start':1.125,'end':2.5,'text':'原字\\t  🎵'},{'start':3,'end':4,'text':'[00:05]原文'}]}).data
p['review_notes']=[' 原來歷史\\t '];p['timing']['applied_shift_seconds']=-.125
print(json.dumps(build('lyrics',{'package':p}).wire(),ensure_ascii=False))`],{encoding:'utf8',timeout:10000}));
const source=wire.data,html=wire.files['preview.html'];
function setup(){
 const live=new Map(),timers=new Map(),anchors=new Set(),listeners=new Map(),sent=[],revoked=[],messages=[];let failure='',next=0,current=structuredClone(source),applied=0,applyFailure=false;
 const document={body:{append:a=>{if(failure==='append')throw Error('append refused');anchors.add(a);}},createElement:()=>({click(){if(failure==='click')throw Error('click refused');sent.push({name:this.download,bytes:Buffer.from(live.get(this.href).parts[0])});},remove(){anchors.delete(this);}})};
 const context={MusicTextDownload:D,MusicLyricsDownload:L,message:(text,error=false)=>messages.push({text,error}),apply(){if(applyFailure)throw Error('current edit invalid');applied++;context.data=P.validate(current);},data:structuredClone(source)};
 vm.runInNewContext(fs.readFileSync('web/text-download-dom.js','utf8'),context);
 const events={addEventListener:(n,f)=>listeners.set(n,f),removeEventListener:(n,f)=>{assert.equal(listeners.get(n),f);listeners.delete(n)}};
 const adapter=context.MusicTextDownloadDom.createAdapter(document,{events,url:{createObjectURL:blob=>{if(failure==='url')throw Error('URL refused');const key='blob:owned-'+ ++next;live.set(key,blob);return key;},revokeObjectURL:key=>{revoked.push(key);live.delete(key);}},BlobType:class{constructor(parts){this.parts=parts;}},schedule:f=>{if(failure==='timer')throw Error('timer refused');const id=++next;timers.set(id,f);return id;},cancel:id=>timers.delete(id)});
 context.textDownloads=adapter;
 const start=html.indexOf('function download(ext)'),end=html.indexOf("document.getElementById('audio-file')",start);assert.ok(start>0&&end>start);vm.runInNewContext(html.slice(start,end),context);
 const finish=()=>{for(const [id,f] of [...timers]){timers.delete(id);f();}};
 return {adapter,context,live,timers,anchors,listeners,sent,revoked,messages,finish,setFailure:v=>failure=v,setCurrent:v=>current=structuredClone(v),setInvalid:v=>applyFailure=v,applied:()=>applied};
}
test('pure selection retains actual producer LRC/SRT bytes and complete original JSON values',()=>{
 const before=structuredClone(source);
 for(const ext of ['lrc','srt','json']){const selected=L.select(source,ext),prepared=D.prepare(selected);assert.equal(selected.name,'lyrics.'+ext);assert.deepEqual(Buffer.from(prepared.bytes),Buffer.from(ext==='json'?JSON.stringify(source,null,2):wire.files['lyrics.'+ext]));}
 assert.deepEqual(source,before);
});
test('portable fixed filenames do not rewrite reserved, path-like, control or Unicode titles',()=>{
 for(const title of ['CON','nul. ','C:\\private/name?','標題🎵'.repeat(40),'字\x00尾','  __TITLE__ <script>']){const p=P.validate({...source,title});for(const ext of L.formats){const selected=L.select(p,ext);assert.equal(D.prepare(selected).name,'lyrics.'+ext);if(ext==='json')assert.equal(JSON.parse(selected.content).title,title);}}
 assert.equal(Object.isFrozen(L.formats),true);
});
test('unknown formats, schemas, fields and invalid Unicode never reach browser handoff',()=>{
 for(const ext of ['',null,'JSON','../json','exe'])assert.throws(()=>L.select(source,ext));
 for(const p of [null,{...source,schema_version:2},{...source,extra:1},{...source,cues:[{start:2,end:1,text:'bad'}]},{...source,cues:[{...source.cues[0],extra:1}]}])assert.throws(()=>L.select(p,'json'));
 assert.throws(()=>D.prepare(L.select({...source,cues:[{start:1,end:2,text:'bad\ud800'}]},'lrc')));
 assert.throws(()=>L.select({...source,title:'bad\ud800'},'json'),/Unicode/);
 const s=setup();assert.equal(s.context.download('unknown'),false);assert.equal(s.applied(),0);assert.equal(s.live.size,0);assert.equal(s.sent.length,0);s.adapter.dispose();
});
test('actual generated download runtime releases URLs and anchors for URL append click and timer failures',()=>{
 for(const failure of ['url','append','click','timer']){const s=setup(),before=structuredClone(source);s.setFailure(failure);assert.equal(s.context.download('json'),false);assert.equal(s.live.size,0);assert.equal(s.anchors.size,0);assert.equal(s.timers.size,0);assert.equal(s.adapter.pending(),0);assert.equal(s.messages.at(-1).error,true);assert.equal(s.messages.filter(m=>m.text.includes('已交給')).length,0);assert.deepEqual(s.context.data,before);s.adapter.dispose();}
});
test('failure retry recaptures current literal edits and full history rather than old selection',()=>{
 const s=setup();s.setFailure('click');assert.equal(s.context.download('json'),false);
 const current=P.revise(source,[{start:1,end:2,text:'改字\u0085\u2028\u2029\t  <b>🎵'}],9);s.setCurrent(current);s.setFailure('');assert.equal(s.context.download('json'),true);assert.deepEqual(JSON.parse(s.sent[0].bytes.toString('utf8')),current);assert.equal(s.anchors.size,0);s.finish();assert.equal(s.live.size,0);s.adapter.dispose();
});
test('all three actual runtime handoffs preserve bytes and report browser submission only',()=>{
 const s=setup();for(const ext of L.formats){assert.equal(s.context.download(ext),true);assert.equal(s.sent.at(-1).name,'lyrics.'+ext);assert.deepEqual(s.sent.at(-1).bytes,Buffer.from(L.select(source,ext).content));assert.match(s.messages.at(-1).text,/已交給瀏覽器下載 lyrics\./);assert.match(s.messages.at(-1).text,/請確認保存位置/);assert.doesNotMatch(s.messages.at(-1).text,/已匯出|已保存/);s.finish();}assert.equal(s.applied(),3);s.adapter.dispose();
});
test('invalid pending Apply preserves valid source and never allocates download resources',()=>{
 const s=setup(),before=structuredClone(s.context.data);s.setInvalid(true);assert.equal(s.context.download('json'),false);assert.deepEqual(s.context.data,before);assert.equal(s.sent.length,0);assert.equal(s.live.size,0);assert.equal(s.anchors.size,0);s.setInvalid(false);assert.equal(s.context.download('srt'),true);s.adapter.dispose();
});
test('rapid handoffs are bounded and pagehide releases only owned downloads with restoration retry',()=>{
 const s=setup();s.live.set('blob:audio',{parts:['media preserved']});assert.equal(s.context.download('lrc'),true);assert.equal(s.context.download('srt'),true);assert.equal(s.context.download('json'),false);assert.equal(s.adapter.pending(),2);assert.equal(s.live.size,3);s.listeners.get('pagehide')();assert.equal(s.adapter.pending(),0);assert.equal(s.timers.size,0);assert.deepEqual([...s.live.keys()],['blob:audio']);assert.equal(s.context.download('json'),true);s.adapter.dispose();assert.deepEqual([...s.live.keys()],['blob:audio']);assert.equal(s.listeners.size,0);assert.equal(s.context.download('json'),false);assert.equal(s.sent.length,3);
});
test('shared factory and existing form binding use identical guarded native byte transport',()=>{
 const s=setup(),confirmed=[],errors=[];const options={select:()=>({name:'same.txt',content:'literal\r\n🎵\x00'}),onSent:v=>confirmed.push(v.name),onError:e=>errors.push(e.message)};
 assert.equal(s.adapter.createController(options).download(),true);const form={};s.adapter.bind(form,options);let prevented=0;assert.equal(form.onsubmit({preventDefault:()=>prevented++}),true);assert.equal(prevented,1);assert.deepEqual(s.sent[0].bytes,s.sent[1].bytes);assert.deepEqual(confirmed,['same.txt','same.txt']);s.finish();assert.equal(s.adapter.createController({...options,select:()=>({name:'NUL.txt',content:'bad'})}).download(),false);assert.equal(s.live.size,0);assert.equal(errors.length,1);s.adapter.dispose();
});
test('complete fixed modules run without network or WebCrypto and generated envelope includes download policy',()=>{
 const contract=require('./helpers/lyric-preview-contract.js'),ctx={TextEncoder,structuredClone};vm.runInNewContext(contract.timing_js,ctx);vm.runInNewContext(contract.package_js,ctx);assert.equal(ctx.crypto,undefined);assert.equal(ctx.fetch,undefined);assert.equal(ctx.MusicLyricsDownload.select(source,'json').name,'lyrics.json');assert.equal(typeof ctx.MusicTextDownloadDom.createAdapter,'function');assert.match(html,/id="download-note"/);assert.doesNotMatch(html,/<script[^>]+src=/);assert.deepEqual(require('../web/lyrics-preview.js').createInspector(contract).inspect(source,html),source);
});
