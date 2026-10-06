// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const model=require('../web/audio-acceptance.js'),history=require('../web/draft-undo.js'),input=require('../web/audio-acceptance-input.js'),review=require('../web/audio-acceptance-review.js');
const draft=(fields={})=>({format:model.format,schema_version:1,profile:'video',custom:true,fields:{rates:'48000',bits:'16',channels:'2',...fields}});
const bytes=d=>new TextEncoder().encode(JSON.stringify(d)).buffer;
function fixture(){
 let current=draft(),media={},busy=false,writes=0,changes=0,receive=d=>d,reader=f=>Promise.resolve(f.bytes);
 const events=new Map(),errors=[],other={title:'other panel unchanged'};
 const controller=model.createController({capture:()=>current,replace:d=>{current=receive(d);writes++;},media:()=>media,
  read:f=>reader(f),decodeSelection:input.decode,allowed:()=>!busy,events:{addEventListener:(k,f)=>events.set(k,f),removeEventListener:k=>events.delete(k)},
  onChange:()=>changes++,onError:e=>errors.push(e.message)});
 return {c:controller,get:()=>structuredClone(current),set:d=>current=structuredClone(d),media:()=>media,changeMedia:()=>media={},other,
  busy:v=>busy=v,reader:f=>reader=f,receive:f=>receive=f,events,errors,counts:()=>({writes,changes}),
  file:d=>({size:bytes(d).byteLength,bytes:bytes(d)}),async load(d,report=false){assert.equal(await controller.inspect(this.file(report?review.review(d):d)),true);assert.equal(controller.apply(),true);}};
}

test('pure validated value history isolates snapshots and retains a refused record for exact retry',()=>{
 const h=history.createValueUndo(model.validate),before=draft({rates:' 未完\r\n'}),after=draft({rates:'44100'});
 assert.equal(h.proposal(before),null);assert.equal(h.available(),false);assert.throws(()=>history.createValueUndo(null));
 h.record(before,after);before.fields.rates='external edit';after.fields.bits='external edit';
 const original=draft({rates:'44100'}),p=h.proposal(original);assert.equal(p.fields.rates,' 未完\r\n');p.fields.rates='proposal edit';
 assert.equal(h.proposal(original).fields.rates,' 未完\r\n');
 assert.throws(()=>h.record(draft(),{...draft(),schema_version:2}));assert.equal(h.available(),true);
 assert.throws(()=>h.proposal(draft({rates:'44_100'})));assert.equal(h.available(),true);assert.equal(h.proposal(original).fields.rates,' 未完\r\n');
 h.clear();assert.equal(h.available(),false);assert.equal(h.proposal(original),null);
});

test('draft and complete review Apply undo restore unsaved raw conditions while preserving current native media',async()=>{
 for(const report of [false,true]){
  const t=fixture(),before=draft({rates:' ４８０００，\r\n44_100 ',bits:'未填',channels:'2,2,1'});
  t.set(before);t.c.changed();const other=structuredClone(t.other);assert.equal(t.c.status().dirty,true);
  await t.load(draft({rates:'44100'}),report);assert.equal(t.c.status().undoAvailable,true);assert.equal(t.c.status().dirty,false);
  t.changeMedia();const selected=t.media();assert.equal(t.c.undo(),true);assert.deepEqual(t.get(),before);
  assert.equal(t.media(),selected);assert.deepEqual(t.other,other);assert.equal(t.c.status().dirty,true);assert.ok(t.events.has('beforeunload'));
  assert.equal(t.c.status().undoAvailable,false);assert.equal(t.c.undo(),false);assert.deepEqual(t.counts(),{writes:2,changes:3});
 }
});

test('latest apply replaces older undo and undo restores the previous loaded checkpoint',async()=>{
 const t=fixture(),first=draft({rates:'44100'}),second=draft({rates:'96000'});
 await t.load(first);await t.load(second,true);assert.equal(t.c.undo(),true);assert.deepEqual(t.get(),first);
 assert.equal(t.c.status().mode,'retained');assert.equal(t.c.status().dirty,false);assert.equal(t.c.undo(),false);
 t.set(second);t.c.changed();assert.equal(t.c.status().dirty,true);
});

test('confirmation after Apply keeps its own snapshot while undo returns to earlier loaded or unsaved values',async()=>{
 const t=fixture(),before=draft({bits:'尚未填完'}),after=draft({rates:'44100'});
 t.set(before);t.c.changed();t.c.download();await t.load(after);assert.equal(t.c.confirm(),true);
 assert.equal(t.c.undo(),true);assert.equal(t.c.status().mode,'retained');assert.deepEqual(t.get(),before);
 const u=fixture();u.set(before);u.c.changed();await u.load(after);u.c.download();u.c.confirm();assert.equal(u.c.undo(),true);
 assert.equal(u.c.status().dirty,true);u.set(after);u.c.changed();assert.equal(u.c.status().mode,'retained');
});

test('later raw, profile and custom edits refuse undo without discarding history or writing conditions',async()=>{
 for(const edit of [d=>d.fields.rates='44_100',d=>d.fields.bits='24',d=>d.profile='distribution',d=>d.custom=false]){
  const t=fixture(),after=draft({rates:'44100'});await t.load(after);const edited=structuredClone(after);edit(edited);t.set(edited);t.c.changed();
  const before=t.counts();assert.equal(t.c.undo(),false);assert.deepEqual(t.get(),edited);assert.deepEqual(t.counts(),before);
  assert.match(t.errors[0],/已有編修/);assert.equal(t.c.status().undoAvailable,true);
  t.set(after);t.c.changed();assert.equal(t.c.undo(),true);assert.deepEqual(t.get(),draft());
 }
});

test('busy refuses undo; successful undo cancels a pending read while cancellation or malformed input keeps history',async()=>{
 const t=fixture();await t.load(draft({rates:'44100'}));t.busy(true);assert.equal(t.c.undo(),false);assert.equal(t.c.status().undoAvailable,true);t.busy(false);
 assert.equal(await t.c.inspect(t.file({unknown:true})),false);assert.equal(t.c.status().undoAvailable,true);t.c.cancel();
 let resolve;t.reader(()=>new Promise(r=>resolve=r));const late=t.c.inspect(t.file(draft({rates:'96000'})));
 assert.equal(t.c.undo(),true);resolve(bytes(draft({rates:'96000'})));assert.equal(await late,false);
 assert.equal(t.c.status().preview,null);assert.deepEqual(t.get(),draft());assert.equal(t.c.status().undoAvailable,false);
});

test('actual received after is the undo guard and a partial undo adapter failure never confirms retention',async()=>{
 const t=fixture();let calls=0;t.receive(d=>{calls++;return calls===1?{...d,fields:{...d.fields,bits:'24'}}:d;});
 await t.load(draft({rates:'44100'}));assert.equal(t.get().fields.bits,'24');assert.equal(t.c.status().dirty,true);
 assert.equal(t.c.undo(),true);assert.deepEqual(t.get(),draft());
 const u=fixture();await u.load(draft({rates:'44100'}));u.receive(d=>({...d,fields:{...d.fields,rates:'96000'}}));
 assert.equal(u.c.undo(),false);assert.equal(u.get().fields.rates,'96000');assert.equal(u.c.status().dirty,true);
 assert.equal(u.c.status().undoAvailable,true);assert.match(u.errors[0],/未完整接收/);assert.equal(u.counts().changes,2);
});

test('project load and disposal clear only the transient undo record',async()=>{
 for(const action of ['projectLoaded','dispose']){
  const t=fixture();await t.load(draft({rates:'44100'}));t.c[action]();assert.equal(t.c.status().undoAvailable,false);assert.equal(t.c.undo(),false);
  assert.equal(t.get().fields.rates,'44100');assert.equal(t.get().custom,action==='dispose');
 }
});

test('browser module order resolves history at controller creation and DOM returns undo focus to an editable field',async()=>{
 let focused=null;const nodes=new Map(),node=id=>{if(!nodes.has(id))nodes.set(id,{value:'',checked:false,disabled:false,hidden:false,files:[],textContent:'',dataset:{},addEventListener(){},focus(){focused=id;}});return nodes.get(id);};
 node('audio-profile').value='video';node('audio-custom').checked=true;for(const [k,v]of Object.entries(draft().fields))node('audio-accept-'+k).value=v;
 const media={name:'synthetic.wav'};node('audio-file').files=[media];
 const context={MusicEditor:require('../web/editor-state.js'),MusicPlanningValues:require('../web/planning-values.js'),MusicJsonDocument:require('../musiclab/assets/json-document.js'),
  MusicAudioAcceptanceInput:input,MusicTextVerificationDOM:require('../web/text-verification-dom.js'),structuredClone};context.globalThis=context;context.window=context;
 for(const path of ['web/audio-acceptance.js','web/draft-undo.js','web/audio-acceptance-dom.js'])vm.runInNewContext(fs.readFileSync(path,'utf8'),context);
 const errors=[];const adapter=context.MusicAudioAcceptanceDom.createAdapter({getElementById:node},{readValue:n=>n.value,writeValue:(n,v)=>n.value=v,
  events:{addEventListener(){},removeEventListener(){}},allowed:()=>true,downloadText:()=>true,onChange(){},onError:e=>errors.push(e.message)});
 assert.equal(node('audio-accept-undo').disabled,true);const b=bytes(review.review(draft({rates:'44100'})));
 assert.equal(await adapter.inspect({size:b.byteLength,arrayBuffer:async()=>b}),true);node('audio-accept-apply').onclick();
 assert.equal(node('audio-accept-undo').disabled,false);assert.equal(node('audio-accept-undo-note').hidden,false);
 assert.equal(node('audio-accept-undo').onclick(),true);assert.equal(node('audio-accept-rates').value,'48000');
 assert.equal(focused,'audio-accept-rates');assert.equal(node('audio-accept-undo').disabled,true);assert.equal(node('audio-file').files[0],media);assert.deepEqual(errors,[]);
 node('audio-profile').value='distribution';node('audio-custom').checked=false;adapter.changed();
 assert.equal(await adapter.inspect({size:b.byteLength,arrayBuffer:async()=>b}),true);node('audio-accept-apply').onclick();node('audio-accept-undo').onclick();
 assert.equal(focused,'audio-profile');assert.equal(node('audio-custom').checked,false);assert.equal(node('audio-file').files[0],media);
 const html=fs.readFileSync('web/index.html','utf8');assert.match(html,/id="audio-accept-undo"[^>]*type="button"[^>]*disabled/);
 assert.ok(html.indexOf('/draft-undo.js')<html.indexOf('/app.js'));
});
