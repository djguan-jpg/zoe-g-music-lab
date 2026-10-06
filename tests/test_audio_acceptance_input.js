// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const input=require('../web/audio-acceptance-input.js'),a=require('../web/audio-acceptance.js'),r=require('../web/audio-acceptance-review.js');
const draft=fields=>({format:a.format,schema_version:1,profile:'video',custom:true,fields:{rates:'48000',bits:'16',channels:'2',...fields}});
const bytes=d=>new TextEncoder().encode(JSON.stringify(d)).buffer;
test('complete checked report and raw draft preserve exact raw source with isolated results',()=>{
 for(const d of [draft(),draft({rates:' ',bits:'16.5',channels:'０'}),{...draft({bits:'未完成'}),custom:false}]){
  const report=r.review(d),before=structuredClone(report),selected=input.inspect(report);assert.deepEqual(selected,{document:d,kind:'review'});
  selected.document.fields.bits='changed';assert.deepEqual(report,before);assert.deepEqual(input.inspect(d),{document:d,kind:'draft'});
  assert.throws(()=>a.decode(bytes(report),bytes(report).byteLength));assert.deepEqual(input.decode(bytes(report),bytes(report).byteLength).document,d);
 }
});
test('whole report validation refuses versions, every derived field, bool coercion, unknown fields and incomplete wrappers',()=>{
 const changes=[d=>d.schema_version=2,d=>d.schema_version=true,d=>d.extra=1,d=>d.issue_count=false,d=>d.analysis_ready=false,d=>d.status='needs_correction',
  d=>d.fields[0].value_count=2,d=>d.fields[0].status='inactive',d=>d.fields[0].extra=1,d=>d.effective_acceptance.rates.push(44100),
  d=>d.review_notes.push('extra'),d=>d.source.fields.rates='',d=>d.source.schema_version=2,d=>d.source.fields.bits='\ud800',d=>d.issues.push({field:'rates'})];
 for(const change of changes){const d=r.review(draft());change(d);assert.throws(()=>input.inspect(d));}
 for(const d of [{source:draft()},{files:{},data:r.review(draft()),meta:{}},{...r.review(draft()),extra:()=>1}])assert.throws(()=>input.inspect(d));
 assert.equal(input.inspect(r.review(draft())).kind,'review');
});
test('bounded native decoding rejects UTF8, duplicates, nonfinite values, invalid Unicode and wrong actual size',()=>{
 const report=r.review(draft()),b=bytes(report);assert.throws(()=>input.decode(b,b.byteLength+1));
 const bom=new Uint8Array([239,187,191,...new Uint8Array(b)]);assert.deepEqual(input.decode(bom.buffer,bom.length).document,draft());
 for(const b of [new Uint8Array([255]).buffer,new Uint8Array(65537).buffer,...['{"x":1,"x":2}','{"x":NaN}','{"x":"\\ud800"}'].map(s=>new TextEncoder().encode(s).buffer)])assert.throws(()=>input.decode(b,b.byteLength));
});
function controller(){
 let source=draft(),media={},busy=false,writes=0,resolve,reject;const errors=[],events=new Map();
 const pending=new Promise((a,b)=>{resolve=a;reject=b;});
 const c=a.createController({capture:()=>source,media:()=>media,replace:d=>{source=d;writes++;},read:()=>pending,decodeSelection:input.decode,
  allowed:()=>!busy,events:{addEventListener:(k,f)=>events.set(k,f),removeEventListener:k=>events.delete(k)},onError:e=>errors.push(e.message)});
 return {c,source:()=>source,edit:()=>{source.fields.bits='24';},media:()=>media,replaceMedia:()=>media={},busy:()=>busy=true,errors,events,writes:()=>writes,
  resolve:d=>resolve(bytes(d)),reject,file:d=>({size:bytes(d).byteLength})};
}
test('report only previews raw conditions, explicit apply retains checkpoint and download stays draft1',async()=>{
 const d=draft({rates:'  ',bits:'16.5'}),report=r.review(d),t=controller(),original=t.source(),media=t.media();
 const work=t.c.inspect(t.file(report));t.resolve(report);assert.equal(await work,true);assert.deepEqual(t.source(),original);assert.equal(t.writes(),0);
 assert.equal(t.c.status().previewKind,'review');assert.deepEqual(t.c.status().preview,d);assert.equal(t.c.apply(),true);
 assert.deepEqual(t.source(),d);assert.equal(t.media(),media);assert.equal(t.c.status().dirty,false);assert.equal(t.c.status().previewKind,null);
 assert.equal(JSON.parse(t.c.download()).format,a.format);t.edit();t.c.changed();assert.equal(t.c.status().dirty,true);assert.equal(t.c.status().mode,'changed_after_download');
 t.c.confirm();assert.equal(t.c.status().dirty,true);t.c.dispose();assert.equal(t.events.size,0);
 const raw=controller(),next=raw.c.inspect(raw.file(d));raw.resolve(d);assert.equal(await next,true);assert.equal(raw.c.status().previewKind,'draft');raw.c.cancel();assert.equal(raw.writes(),0);
});
test('late, changed native media, busy and source edits cannot commit preview or apply',async()=>{
 const report=r.review(draft({bits:'24'}));
 for(const action of [t=>t.c.cancel(),t=>t.edit(),t=>t.replaceMedia(),t=>t.busy()]){
  const t=controller(),work=t.c.inspect(t.file(report));action(t);t.resolve(report);assert.equal(await work,false);assert.equal(t.writes(),0);assert.equal(t.c.status().preview,null);
 }
 const t=controller(),work=t.c.inspect(t.file(report));t.resolve(report);assert.equal(await work,true);t.replaceMedia();assert.equal(t.c.apply(),false);assert.equal(t.writes(),0);
 const invalid=controller(),bad=r.review(draft());bad.issue_count=2;const next=invalid.c.inspect(invalid.file(bad));invalid.resolve(bad);assert.equal(await next,false);assert.equal(invalid.writes(),0);assert.equal(invalid.errors.length,1);
 const late=controller(),last=late.c.inspect(late.file(report));late.c.cancel();late.reject(Error('late read'));assert.equal(await last,false);assert.equal(late.errors.length,0);
});
test('actual DOM adapter injects checked decoder and explains review provenance before explicit apply',async()=>{
 const nodes=new Map(),node=id=>{if(!nodes.has(id))nodes.set(id,{id,value:'',checked:false,disabled:false,hidden:false,textContent:'',dataset:{},files:[],addEventListener(){}});return nodes.get(id);};
 node('audio-profile').value='video';node('audio-custom').checked=true;for(const [k,v] of Object.entries(draft().fields))node('audio-accept-'+k).value=v;
 const media={name:'native.wav'};node('audio-file').files=[media];let changes=0;const errors=[];
 const context={MusicAudioAcceptance:a,MusicAudioAcceptanceInput:input,MusicTextVerificationDOM:require('../web/text-verification-dom.js')};context.globalThis=context;vm.runInNewContext(fs.readFileSync('web/audio-acceptance-dom.js','utf8'),context);
 const adapter=context.MusicAudioAcceptanceDom.createAdapter({getElementById:node},{readValue:n=>n.value,writeValue:(n,v)=>n.value=v,
  events:{addEventListener(){},removeEventListener(){}},allowed:()=>true,downloadText:()=>true,onChange:()=>changes++,onError:e=>errors.push(e.message)});
 const d=draft({rates:'',bits:'16.5'}),b=bytes(r.review(d)),file={size:b.byteLength,arrayBuffer:async()=>b};
 assert.equal(await adapter.inspect(file),true);assert.match(node('audio-accept-preview-note').textContent,/來自條件檢查報告/);assert.match(node('audio-accept-preview-note').textContent,/未完成原值/);
 assert.equal(node('audio-accept-rates').value,'48000');assert.equal(changes,0);node('audio-accept-apply').onclick();assert.equal(changes,1);assert.equal(node('audio-accept-rates').value,'');
 assert.equal(node('audio-file').files[0],media);assert.equal(errors.length,0);assert.match(node('audio-accept-note').textContent,/已載入檔案/);
 const html=fs.readFileSync('web/index.html','utf8');assert.ok(html.indexOf('/audio-acceptance-review.js')<html.indexOf('/audio-acceptance-input.js')&&html.indexOf('/audio-acceptance-input.js')<html.indexOf('/app.js'));
 assert.match(html,/載入條件草稿或檢查報告/);adapter.dispose();
});
