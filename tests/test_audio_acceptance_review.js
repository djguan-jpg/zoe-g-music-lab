// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const m=require('../web/audio-acceptance-review.js'),a=require('../web/audio-acceptance.js'),v=require('../musiclab/assets/delivery-versions.js');
const draft=fields=>({format:a.format,schema_version:1,profile:'distribution',custom:true,fields:{rates:'48000',bits:'16,24',channels:'1,2',...fields}});
const wire=d=>{const data=m.review(d);return {data,files:{'audio-acceptance-review.json':JSON.stringify(data,null,2)+'\n','audio-acceptance-review.md':m.markdown(data)},meta:{version:v.current,protocol_version:1,needs_review:true}};};
test('all three issues, exact raw strings and inactive custom values',()=>{
 const d=draft({rates:' ',bits:'16.00000000000001',channels:'0'}),before=structuredClone(d),r=m.review(d);
 assert.equal(r.issue_count,3);assert.deepEqual(r.issues.map(i=>i.field),['rates','bits','channels']);assert.equal(r.effective_acceptance,null);assert.deepEqual(d,before);
 r.source.fields.rates='changed';assert.deepEqual(d,before);d.custom=false;const inactive=m.review(d);
 assert.equal(inactive.analysis_ready,true);assert.equal(inactive.issue_count,0);assert.ok(inactive.fields.every(f=>f.status==='inactive'));assert.deepEqual(inactive.effective_acceptance,a.prepare(d).acceptance);
});
test('complete reply rejects changed source, future protocol/product, unknown keys and altered artifacts',()=>{
 const d=draft(),r=wire(d);assert.deepEqual(m.checkedResult(d,r),r);
 const mutations=[r=>r.data.source.fields.rates='44100',r=>r.data.analysis_ready=false,r=>r.meta.version='99.0.0',r=>r.meta.protocol_version=2,
  r=>r.meta.needs_review=false,r=>r.extra=1,r=>r.files.extra='x',r=>r.files['audio-acceptance-review.json']='{"x":1,"x":2}',
  r=>r.files['audio-acceptance-review.md']+='foreign',r=>r.files['audio-acceptance-review.md']='\ud800',r=>r.files['audio-acceptance-review.md']='x'.repeat(262145)];
 for(const mutate of mutations){const reply=wire(d);mutate(reply);assert.throws(()=>m.checkedResult(d,reply));}
 assert.deepEqual(m.checkedResult(d,wire(d)),r);assert.equal(m.review(d).analysis_ready,true);
});
test('current raw source guards navigation, isolated views and edit refresh',()=>{
 let source=draft({rates:'',bits:'0',channels:'2.5'}),view;
 const c=m.createController({capture:()=>source,onState:v=>view=v});c.check();assert.equal(view.report.issue_count,3);assert.equal(c.locate(1).field,'bits');
 view.report.issues[1].field='changed';assert.equal(c.locate(1).field,'bits');source.fields.channels='2';assert.equal(c.locate(1),null);assert.equal(view.stale,true);
 c.check();assert.equal(view.report.issue_count,2);source.custom=false;c.refresh();assert.equal(view.stale,true);c.check();assert.equal(view.report.status,'preset_active');assert.equal(c.locate(0),null);
 c.clear();assert.equal(view.report,null);
});
function dom(){
 const nodes=new Map(),focused=[];const node=id=>{if(!nodes.has(id))nodes.set(id,{id,dataset:{},textContent:'',disabled:false,children:[],attrs:{},classList:{toggle(){}},
  replaceChildren(){this.children=[];},append(n){this.children.push(n);},setAttribute(k,v){this.attrs[k]=v;},removeAttribute(k){delete this.attrs[k];},focus(){focused.push(id);}});return nodes.get(id);};
 const document={getElementById:node,createElement:tag=>({...node('created-'+nodes.size),id:tag})};let source=draft({rates:'',bits:'0',channels:'2.5'}),busy=false;
 const context={MusicAudioAcceptanceReview:m};context.globalThis=context;vm.runInNewContext(fs.readFileSync('web/audio-acceptance-review-dom.js','utf8'),context);
 const controller=context.MusicAudioAcceptanceReviewDom.createAdapter(document,{capture:()=>source,allowed:()=>!busy});
 return {node,focused,controller,source,busy:value=>busy=value};
}
test('DOM uses literal localized issues, focuses original field, stale clears marks and busy prevents actions',()=>{
 const d=dom();assert.equal(d.controller.check(true),false);assert.deepEqual(d.focused,['audio-accept-rates']);
 const list=d.node('audio-accept-ready-issues');assert.equal(list.children.length,3);assert.match(list.children[1].children[0].textContent,/位元深度/);
 list.children[1].children[0].onclick();assert.equal(d.focused.at(-1),'audio-accept-bits');assert.equal(d.node('audio-accept-bits').attrs['aria-invalid'],'true');
 d.source.fields.bits='16';d.controller.refresh();assert.equal(d.node('audio-accept-bits').attrs['aria-invalid'],undefined);assert.ok(list.children.every(li=>li.children[0].disabled));
 d.busy(true);d.controller.refresh();assert.equal(d.node('audio-accept-ready-check').disabled,true);assert.equal(d.controller.check(true),false);
 d.busy(false);d.controller.check();assert.equal(list.children.length,2);
});
test('actual report callback checks complete reply before visible writes and drops late responses',async()=>{
 const source=fs.readFileSync('web/app.js','utf8'),handler=source.slice(source.indexOf("$('audio-accept-ready-report').onclick="));
 for(const mode of ['good','wrong','late']){
  const d=draft(),nodes={'audio-accept-ready-report':{},'audio-visual':{hidden:false}},calls=[],messages=[];let current=true;
  const context={state:{busy:false,audioAcceptance:{capture:()=>structuredClone(d)},audioAcceptanceReview:{check(){}}},$ :id=>nodes[id],
   MusicAudioAcceptanceReview:m,api:async()=>{const reply=wire(d);if(mode==='wrong')reply.files['audio-acceptance-review.md']+='foreign';if(mode==='late')current=false;return reply;},
   run:async(button,task)=>{try{await task(()=>current);}catch(error){messages.push(error.message);}},setFiles:files=>calls.push(files),say:message=>messages.push(message)};
  vm.runInNewContext(handler,context);await nodes['audio-accept-ready-report'].onclick();
  assert.equal(calls.length,mode==='good'?1:0);assert.equal(nodes['audio-visual'].hidden,mode==='good');assert.ok(mode!=='wrong'||messages.some(t=>t.includes('保留')));
 }
});
test('actual audio analyze checks all raw conditions before reading or submitting audio',async()=>{
 const source=fs.readFileSync('web/app.js','utf8'),handler=source.slice(source.indexOf("$('audio-build').onclick="),source.indexOf('const draftTask='));let calls=0,checks=[];
 const nodes={'audio-build':{}},context={$:id=>nodes[id],state:{busy:false,audioAcceptanceReview:{check:focus=>{checks.push(focus);return false;}}},
  run(){calls++;},say(){},MusicAudio:{inspect(){calls++;}}};vm.runInNewContext(handler,context);
 nodes['audio-build'].onclick();assert.equal(calls,0);assert.deepEqual(checks,[true]);context.state.busy=true;nodes['audio-build'].onclick();assert.equal(checks.length,1);
});
