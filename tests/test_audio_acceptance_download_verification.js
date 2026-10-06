// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const Model=require('../web/audio-acceptance.js'),Input=require('../web/audio-acceptance-input.js'),DOM=require('../web/text-verification-dom.js'),Download=require('../web/text-download.js');
const bytes=s=>new TextEncoder().encode(s),flush=()=>new Promise(setImmediate);
const draft=(fields={})=>({format:Model.format,schema_version:1,profile:'video',custom:true,fields:{rates:'48000',bits:'16',channels:'2',...fields}});
function harness(){
 const nodes=new Map(),node=id=>{if(!nodes.has(id))nodes.set(id,{id,value:'',checked:false,disabled:false,hidden:false,files:[],dataset:{},textContent:'',addEventListener(){},focus(){}});return nodes.get(id);};
 const listeners=new Map(),events={addEventListener:(name,fn)=>{if(!listeners.has(name))listeners.set(name,new Set());listeners.get(name).add(fn);},removeEventListener:(name,fn)=>listeners.get(name)?.delete(fn)};
 const outsideLeave=()=>{};events.addEventListener('pagehide',outsideLeave);
 let busy=false,visible=true,sendMode='success',changes=0;const sent=[],errors=[],media={name:'synthetic.wav'},other={title:' 原作🎵 ',rows:[{id:'original-1',text:' 保留\r\n原文 '}],result:'previous result'};
 node('audio-file').files=[media];
 class File{constructor(content,name='saved (1).json'){this.name=name;this.content=content;this.size=bytes(content).length;this.reads=0;}async arrayBuffer(){this.reads++;return bytes(this.content).buffer;}}
 const context={MusicAudioAcceptance:Model,MusicAudioAcceptanceInput:Input,MusicTextVerificationDOM:{bind:(document,options)=>DOM.bind(document,{...options,FileType:File})}};context.globalThis=context;
 vm.runInNewContext(fs.readFileSync('web/audio-acceptance-dom.js','utf8'),context);
 function write(value){node('audio-profile').value=value.profile;node('audio-custom').checked=value.custom;for(const [k,v] of Object.entries(value.fields))node('audio-accept-'+k).value=v;}
 write(draft());
 const controller=context.MusicAudioAcceptanceDom.createAdapter({getElementById:node},{readValue:n=>n.value,writeValue:(n,v)=>n.value=v,events,allowed:()=>!busy,visible:()=>visible,
  downloadText:(name,content)=>{if(sendMode==='false')return false;if(sendMode==='throw')throw Error('synthetic send refusal');const prepared=Download.prepare({name,content});sent.push({name,content,bytes:prepared.bytes});return true;},onChange:()=>changes++,onError:error=>errors.push(error.message)});
 async function verify(file){node('audio-accept-verify-file').files=[file];node('audio-accept-verify-file').value='selected';node('audio-accept-verify-file').onchange();await flush();}
 return {c:controller,node,events,listeners,errors,sent,media,other,File,changes:()=>changes,edit:value=>{write(value);controller.changed();},
  sendMode:value=>sendMode=value,busy:value=>{busy=value;controller.refresh();},visible:value=>{visible=value;controller.refresh();},
  download:()=>node('audio-accept-export').onsubmit({preventDefault(){}}),file:(content=sent.at(-1).content,name)=>new File(content,name),verify,dispose:()=>controller.dispose()};
}

test('cancelling condition proof retains its pending sent snapshot, media and later conditions until retry',async()=>{
 const h=harness();h.edit(draft({rates:'old'}));h.download();const old=h.file();let end;old.arrayBuffer=()=>new Promise(r=>end=()=>r(bytes(old.content).buffer));await h.verify(old);
 assert.equal(h.node('audio-accept-verify-cancel').disabled,false);h.node('audio-accept-verify-cancel').onclick();h.edit(draft({rates:'new'}));const before=h.c.capture(),other=structuredClone(h.other),changes=h.changes();end();await flush();
 assert.equal(h.c.status().pendingDownload,true);assert.equal(h.c.status().dirty,true);assert.equal(h.node('audio-accept-verify-note').dataset.match,'unknown');assert.deepEqual(h.c.capture(),before);assert.deepEqual(h.other,other);assert.equal(h.node('audio-file').files[0],h.media);assert.equal(h.changes(),changes);
 await h.verify(h.file());assert.equal(h.c.status().pendingDownload,false);assert.equal(h.c.status().dirty,true);assert.deepEqual(h.c.capture(),before);h.dispose();
});
test('condition file verification is unavailable before a successful native send',()=>{
 const h=harness();assert.equal(h.node('audio-accept-verify-file').disabled,true);assert.match(h.node('audio-accept-verify-source').textContent,/先下載/);assert.equal(h.sent.length,0);h.dispose();
});
test('complete Unicode whitespace and unfinished values confirm only the sent condition snapshot',async()=>{
 const h=harness();h.edit(draft({rates:' ４８０００，\r\n未填🎵 ',bits:'',channels:'2, 2'}));const before=h.c.capture(),other=structuredClone(h.other),changes=h.changes();h.download();assert.equal(h.c.status().dirty,true);assert.equal(h.c.status().mode,'download_unconfirmed');assert.equal(h.node('audio-accept-verify-file').disabled,false);
 const file=h.file();await h.verify(file);assert.equal(file.reads,1);assert.equal(h.c.status().dirty,false);assert.equal(h.c.status().pendingDownload,false);assert.equal(h.node('audio-accept-verify-note').dataset.match,'true');assert.deepEqual(h.c.capture(),before);assert.deepEqual(h.other,other);assert.equal(h.node('audio-file').files[0],h.media);assert.equal(h.changes(),changes);assert.equal(h.node('audio-accept-verify-file').value,'');assert.throws(()=>Model.prepare(h.c.capture()));h.dispose();
});
test('proof of an older sent condition preserves newer raw edits and their unsaved warning',async()=>{
 const h=harness();const sent=draft({rates:'未填🎵'});h.edit(sent);h.download();const file=h.file();h.edit(draft({rates:'44100'}));const before=h.c.capture();await h.verify(file);assert.equal(h.c.status().pendingDownload,false);assert.equal(h.c.status().dirty,true);assert.deepEqual(h.c.capture(),before);assert.match(h.node('audio-accept-note').textContent,/尚未另存/);h.edit(sent);assert.equal(h.c.status().dirty,false);h.dispose();
});
test('same-sized different bytes cannot acknowledge conditions or replace source',async()=>{
 const h=harness();h.edit(draft({rates:'未填'}));h.download();const before=h.c.capture(),wrong=h.file(h.sent.at(-1).content.replace('未填','錯稿'));assert.equal(wrong.size,h.sent.at(-1).bytes.length);await h.verify(wrong);assert.equal(h.c.status().pendingDownload,true);assert.equal(h.c.status().dirty,true);assert.equal(h.node('audio-accept-verify-note').dataset.match,'false');assert.deepEqual(h.c.capture(),before);h.dispose();
});
test('BOM JSON reformatting missing tail unknown version and extra fields all refuse exact confirmation',async()=>{
 for(const mutate of [s=>'\ufeff'+s,s=>JSON.stringify(JSON.parse(s)),s=>s.slice(0,-1),s=>s.replace('"schema_version": 1','"schema_version": 99'),s=>s.replace('"custom": true','"custom": true, "path": "extra"')]){
  const h=harness();h.edit(draft({rates:'未填'}));h.download();await h.verify(h.file(mutate(h.sent.at(-1).content)));assert.equal(h.c.status().pendingDownload,true);assert.equal(h.node('audio-accept-verify-note').dataset.match,'false');h.dispose();
 }
});
test('renamed files and hostile-looking names are compared as bytes and displayed literally',async()=>{
 const h=harness();h.edit(draft({rates:'unfinished'}));h.download();await h.verify(h.file(undefined,'<literal>🎵.json'));assert.equal(h.c.status().dirty,false);assert.match(h.node('audio-accept-verify-note').textContent,/<literal>🎵\.json/);h.dispose();
});
test('64 KiB pre-read bound does not expand the shared result or project-draft verifier',async()=>{
 const h=harness();h.edit(draft({rates:'unfinished'}));h.download();const file=h.file();file.size=65537;await h.verify(file);assert.equal(file.reads,0);assert.equal(h.c.status().pendingDownload,true);assert.match(h.node('audio-accept-verify-note').textContent,/65536/);await h.verify(h.file());assert.equal(h.c.status().dirty,false);h.dispose();
});
test('failed send creates no condition proof while an earlier successful pending send remains usable',async()=>{
 for(const failure of ['false','throw']){const h=harness();h.edit(draft({rates:'old'}));h.sendMode(failure);h.download();assert.equal(h.c.status().pendingDownload,false);assert.equal(h.node('audio-accept-verify-file').disabled,true);h.sendMode('success');h.download();const old=h.file();h.edit(draft({rates:'new'}));h.sendMode(failure);h.download();await h.verify(old);assert.equal(h.c.status().pendingDownload,false);assert.equal(h.c.status().dirty,true);assert.equal(h.c.capture().fields.rates,'new');h.edit(draft({rates:'old'}));assert.equal(h.c.status().dirty,false);h.dispose();}
});
test('busy and hidden workbench states refuse reads and cancel pending proof even after returning',async()=>{
 for(const action of ['busy','visible']){const h=harness();h.edit(draft({rates:'old'}));h.download();h[action](action==='busy');const refused=h.file();await h.verify(refused);assert.equal(refused.reads,0);h[action](action!=='busy');let resolve;const delayed=h.file();delayed.arrayBuffer=()=>new Promise(r=>resolve=r);await h.verify(delayed);h[action](action==='busy');h[action](action!=='busy');resolve(bytes(delayed.content).buffer);await flush();assert.equal(h.c.status().pendingDownload,true);assert.equal(h.node('audio-accept-verify-note').dataset.match,'unknown');h.dispose();}
});
test('late success and error cannot confirm the next condition download',async()=>{
 for(const failure of [false,true]){const h=harness();h.edit(draft({rates:'old'}));h.download();let resolve,reject;const old=h.file();old.arrayBuffer=()=>new Promise((r,j)=>{resolve=r;reject=j;});await h.verify(old);h.edit(draft({rates:'new'}));h.download();if(failure)reject(Error('late source failure'));else resolve(bytes(old.content).buffer);await flush();assert.equal(h.c.status().pendingDownload,true);assert.equal(h.node('audio-accept-verify-note').dataset.match,'unknown');assert.deepEqual(h.errors,[]);await h.verify(h.file());assert.equal(h.c.status().dirty,false);h.dispose();}
});
test('a new send with identical content invalidates an earlier in-flight proof by revision',async()=>{
 const h=harness();h.edit(draft({rates:'old'}));h.download();let resolve;const old=h.file();old.arrayBuffer=()=>new Promise(r=>resolve=r);await h.verify(old);h.download();assert.equal(h.sent[0].content,h.sent[1].content);resolve(bytes(old.content).buffer);await flush();assert.equal(h.c.status().pendingDownload,true);assert.equal(h.node('audio-accept-verify-note').dataset.match,'unknown');await h.verify(h.file());assert.equal(h.c.status().dirty,false);h.dispose();
});
test('a latest exact match survives an old delayed report and subsequent send clears its proof',async()=>{
 const h=harness();h.edit(draft({rates:'old'}));h.download();let resolve;const old=h.file();old.arrayBuffer=()=>new Promise(r=>resolve=r);await h.verify(old);h.edit(draft({rates:'new'}));h.download();await h.verify(h.file());resolve(bytes(old.content).buffer);await flush();assert.equal(h.node('audio-accept-verify-note').dataset.match,'true');h.edit(draft({rates:'third'}));h.download();assert.equal(h.node('audio-accept-verify-note').dataset.match,'unknown');h.dispose();
});
test('short reads changed size read failure and native File impersonation refuse and allow retry',async()=>{
 for(const kind of ['short','drift','io','fake']){const h=harness();h.edit(draft({rates:'old'}));h.download();let file=h.file();if(kind==='fake')file={name:'file.json',size:1,arrayBuffer:()=>assert.fail('not native File')};else file.arrayBuffer=async()=>{if(kind==='short')return bytes('x').buffer;if(kind==='drift'){file.size++;return bytes(file.content).buffer;}throw Error('read failure');};await h.verify(file);assert.equal(h.c.status().pendingDownload,true);assert.equal(h.c.status().dirty,true);await h.verify(h.file());assert.equal(h.c.status().dirty,false);h.dispose();}
});
test('file proof preserves a separately loaded condition checkpoint preview and current media',async()=>{
 const h=harness();h.edit(draft({rates:'old'}));h.download();const old=h.file(),loaded=draft({rates:'44100'}),raw=bytes(JSON.stringify(loaded));assert.equal(await h.c.inspect({size:raw.length,arrayBuffer:async()=>raw.buffer}),true);assert.equal(h.c.apply(),true);const before=h.c.capture();await h.verify(old);assert.deepEqual(h.c.capture(),before);assert.equal(h.c.status().dirty,false);assert.equal(h.c.status().undoAvailable,true);assert.equal(h.node('audio-file').files[0],h.media);
 const preview=draft({rates:'96000'}),next=bytes(JSON.stringify(preview));await h.c.inspect({size:next.length,arrayBuffer:async()=>next.buffer});const changes=h.changes();await h.verify(old);assert.deepEqual(h.c.status().preview,preview);assert.equal(h.changes(),changes);assert.deepEqual(h.c.capture(),before);h.dispose();
});
test('manual confirmation remains available and repeated proof cannot retain subsequent unsent edits',async()=>{
 const h=harness();h.edit(draft({rates:'old'}));h.download();assert.equal(h.node('audio-accept-confirm').disabled,false);h.node('audio-accept-confirm').onclick();assert.equal(h.c.status().pendingDownload,false);h.edit(draft({rates:'new'}));await h.verify(h.file());assert.equal(h.c.status().dirty,true);assert.equal(h.c.capture().fields.rates,'new');h.dispose();
});
test('proof reads the complete canonical sent source rather than editable previews or current conditions',async()=>{
 const h=harness();h.edit(draft({rates:'old'}));h.download();h.node('audio-accept-preview-content').value='untrusted preview';h.node('audio-accept-verify-source').textContent='different label';h.edit(draft({rates:'new'}));await h.verify(h.file());assert.equal(h.c.status().pendingDownload,false);assert.equal(h.c.status().dirty,true);assert.equal(h.c.capture().fields.rates,'new');h.dispose();
});
test('pagehide and dispose refuse late proof and remove only owned listeners',async()=>{
 for(const action of ['pagehide','dispose']){const h=harness();h.edit(draft({rates:'old'}));h.download();let resolve;const old=h.file();old.arrayBuffer=()=>new Promise(r=>resolve=r);await h.verify(old);if(action==='pagehide'){for(const fn of h.listeners.get('pagehide'))fn();}else h.dispose();resolve(bytes(old.content).buffer);await flush();assert.equal(h.c.status().pendingDownload,true);assert.equal(h.c.status().dirty,true);if(action==='pagehide')h.dispose();assert.equal(h.listeners.get('pagehide').size,1);assert.equal(h.listeners.get('beforeunload').size,0);assert.equal(h.node('audio-accept-verify-file').onchange,null);}
});
test('browser integration uses shared verifier before the app with no new source loading or transport',()=>{
 const html=fs.readFileSync('web/index.html','utf8'),dom=fs.readFileSync('web/audio-acceptance-dom.js','utf8'),app=fs.readFileSync('web/app.js','utf8');for(const name of ['text-verification.js','text-verification-controller.js','text-verification-dom.js'])assert.ok(html.indexOf('/'+name)<html.indexOf('/app.js'));assert.match(html,/id="audio-accept-verify-file"[^>]*disabled/);assert.match(html,/id="audio-accept-verify-note"[^>]*role="status"/);assert.match(dom,/maxBytes:model\.maxBytes/);assert.match(dom,/source:sentSource/);assert.match(app,/visible:\(\)=>state\.tab==='audio'/);assert.doesNotMatch(dom,/\/api\/|fetch\(|localStorage|sessionStorage/);
});
test('actual editor input handler ignores the verification File input while genuine condition edits still stale reports',()=>{
 const html=fs.readFileSync('web/index.html','utf8'),tag=html.match(/<input id="audio-accept-verify-file"[^>]*>/)[0];assert.match(tag,/data-view-control="verification"/);
 const app=fs.readFileSync('web/app.js','utf8'),start=app.indexOf("document.querySelector('.editor').addEventListener('input'"),end=app.indexOf('\nfunction clearOutput()',start);assert.ok(start>=0&&end>start);
 let handler;const calls=[];vm.runInNewContext(app.slice(start,end),{document:{querySelector:()=>({addEventListener:(name,fn)=>{assert.equal(name,'input');handler=fn;}})},markDirty:scope=>calls.push(scope),refreshShotOverview(){},lyricsImportController:null,tick(){}});
 handler({target:{id:'audio-accept-verify-file',dataset:{viewControl:tag.match(/data-view-control="([^"]*)"/)[1]},closest:()=>({id:'audio'})}});assert.deepEqual(calls,[]);
 handler({target:{id:'audio-accept-rates',dataset:{},closest:()=>({id:'audio'})}});assert.deepEqual(calls,['audio']);
});
