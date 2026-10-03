// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
const jsonFile=(name,content)=>new File([content],name);
const jsonBytes=value=>new TextEncoder().encode(value).buffer;
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const {execFileSync}=require('node:child_process');
const E=require('../web/editor-state.js'),S=require('../web/storyboard-seed.js');
const root=path.join(__dirname,'..');
const result=JSON.parse(execFileSync(process.platform==='win32'?'python':'python3',['-X','utf8','-c',
  "import json;from pathlib import Path;from musiclab.application import build;print(json.dumps(build('storyboard_seed',{'music':json.loads(Path('examples/first-light-music.json').read_text(encoding='utf-8'))}).wire(),ensure_ascii=False))"],{cwd:root,encoding:'utf8',timeout:10000}));
function draft(){
  const panels={};for(const [name,fields] of Object.entries(E.draftFields)){
    panels[name]={fields:Object.fromEntries(fields.map(field=>[field,'']))};if(E.draftRows[name])panels[name][E.draftRows[name].key]=[];
  }
  panels.music.avoid=[];panels.music.deliverables=[];panels.storyboard.motifs=[];
  panels.lyrics.fields['lyrics-format']='.lrc';panels.audio.fields['audio-profile']='video';
  return {format:'zoe-music-lab-draft',schema_version:3,tool_version:'0.15.0',saved_at:'2026-10-03',tab:'music',panels};
}
const file=(content=JSON.stringify(result.data),name='storyboard-seed.json')=>jsonFile(name,content);
function harness(){
  const value={draft:draft(),fps:'24',bars_per_shot:'4'},requests=[],ready=[],jobs=[];
  const c=S.createPreview({capture:()=>value,request:p=>{requests.push(p);return new Promise((resolve,reject)=>jobs.push({resolve,reject}));},onClear:()=>{},onReady:(seed,files,source)=>ready.push({seed,files,source})});
  return {value,requests,ready,jobs,c};
}
async function requested(h){const work=h.c.read(file());await new Promise(setImmediate);assert.equal(h.jobs.length,1);return {work};}
test('external seed previews without a complete song; BOM accepted and source is copied',async()=>{
  const h=harness(),original=structuredClone(h.value.draft),work=h.c.read(file('\ufeff'+JSON.stringify(result.data)));
  await new Promise(setImmediate);assert.deepEqual(h.requests[0],{seed:result.data});h.jobs[0].resolve(structuredClone(result));
  assert.equal(await work,true);assert.deepEqual(h.value.draft,original);assert.equal(h.ready[0].source.origin,'file');
  const proposed=h.c.proposal();assert.equal(proposed.panels.storyboard.shots.length,17);assert.equal(proposed.panels.storyboard.shots[0].visual,'');assert.deepEqual(proposed.panels.music,original.panels.music);
});
test('source song and generator settings edits do not invalidate a file proposal',async()=>{
  const h=harness(),{work}=await requested(h);h.value.draft.panels.music.fields['music-title']='keep later song';h.value.fps='120';h.jobs[0].resolve(structuredClone(result));assert.equal(await work,true);
  h.value.bars_per_shot='128';const proposal=h.c.proposal();assert.equal(proposal.panels.music.fields['music-title'],'keep later song');assert.equal(proposal.panels.storyboard.fields['mv-fps'],'24');
});
test('target changes during request discard malformed late result before validation',async()=>{
  const h=harness(),{work}=await requested(h);h.value.draft.panels.storyboard.fields['mv-title']='keep target';h.jobs[0].resolve({malformed:true});assert.equal(await work,false);assert.equal(h.ready.length,0);assert.equal(h.c.proposal(),null);
});
test('target edits after preview block apply and preserve them',async()=>{
  const h=harness(),{work}=await requested(h);h.jobs[0].resolve(structuredClone(result));await work;h.value.draft.panels.storyboard.fields['mv-title']='later target';assert.throws(()=>h.c.proposal(),/分鏡已有修改/);assert.equal(h.value.draft.panels.storyboard.fields['mv-title'],'later target');
});
test('file read that finishes after a target change makes no request',async()=>{
  const h=harness();let resolve;const f={size:2,name:'late.json',arrayBuffer:()=>new Promise(r=>resolve=value=>r(jsonBytes(value)))},work=h.c.read(f);
  h.value.draft.panels.storyboard.fields['mv-title']='later';resolve('{}');assert.equal(await work,false);assert.equal(h.requests.length,0);
});
test('new file selection cancels old file read and only the latest may preview',async()=>{
  const h=harness();let resolve;const first=h.c.read({size:2,name:'old.json',arrayBuffer:()=>new Promise(r=>resolve=value=>r(jsonBytes(value)))}),second=h.c.read(file());
  await new Promise(setImmediate);resolve('malformed');assert.equal(await first,false);h.jobs[0].resolve(structuredClone(result));assert.equal(await second,true);assert.equal(h.ready.length,1);
});
test('file constraints, malformed JSON, version and extension refuse before transport',async()=>{
  for(const f of [{...file(),size:0},{...file(),size:1024*1024+1},file('{}','text.txt'),file('broken'),file(JSON.stringify({...result.data,schema_version:2})),file(JSON.stringify({...result.data,custom:'must keep'}))]){
    const h=harness();await assert.rejects(h.c.read(f));assert.equal(h.requests.length,0);assert.equal(h.ready.length,0);
  }
});
test('inspection response cannot silently change selected file content',async()=>{
  const h=harness(),{work}=await requested(h),changed=structuredClone(result);changed.data.title='other source';changed.files['storyboard-seed.json']=JSON.stringify(changed.data);h.jobs[0].resolve(changed);await assert.rejects(work,/不完整/);assert.equal(h.ready.length,0);
});
test('cancelled transport errors are ignored and current error allows a new selection',async()=>{
  const h=harness(),{work}=await requested(h);h.c.cancel();h.jobs[0].reject(Error('old'));assert.equal(await work,false);
  const current=h.c.read(file());await new Promise(setImmediate);h.jobs[1].reject(Error('current'));await assert.rejects(current,/current/);
  const next=h.c.read(file());await new Promise(setImmediate);h.jobs[2].resolve(structuredClone(result));assert.equal(await next,true);
});
test('unknown nested creative fields refuse rather than disappearing on apply',()=>{
  for(const change of [s=>s.slots[0].visual='new scene',s=>s.source.path='x',s=>s.source.sections[0].extra='keep']){const data=structuredClone(result.data);change(data);assert.throws(()=>S.validateSeed(data));}
});
test('actual common run can guard storyboard while music edits are retained',async()=>{
  const source=fs.readFileSync(path.join(root,'web/app.js'),'utf8'),a=source.indexOf('async function run('),b=source.indexOf('function setFiles(',a);
  const state={tab:'music',revisions:{music:0,storyboard:0},busy:false},button={disabled:false},notices=[];let resolve,commits=0;
  const pending=new Promise(r=>resolve=r),context={state,say:m=>notices.push(m),timingControls:()=>{},markDirty:()=>{}};vm.runInNewContext(source.slice(a,b),context);
  const work=context.run(button,async current=>{await pending;if(current())commits++;},'storyboard');state.revisions.music++;resolve();await work;assert.equal(commits,1);assert.equal(state.busy,false);
  let reject;const failure=new Promise((r,j)=>reject=j);const late=context.run(button,()=>failure,'storyboard');state.revisions.storyboard++;reject(Error('old target error'));await late;assert.ok(!notices.includes('old target error'));
});
test('actual output marks imports independent while generation still becomes dirty',()=>{
  const source=fs.readFileSync(path.join(root,'web/app.js'),'utf8'),a=source.indexOf('function markDirty('),b=source.indexOf("document.querySelector('.editor')",a);
  const state={tab:'music',revisions:{},bundles:{music:{note:'file',dirty:false,inputIndependent:true}}},nodes={download:{disabled:false},'output-note':{textContent:'file'}};
  const retentionDraft={panels:{music:{fields:{title:'unchanged'}}}},retentionScopes=[];
  const draftRetention=require('../web/draft-retention.js').createGuard({capture:()=>retentionDraft,
    capturePanel:scope=>{retentionScopes.push(scope);return retentionDraft.panels[scope];},
    events:{addEventListener:()=>{},removeEventListener:()=>{}},onState:()=>{}});draftRetention.initialize(retentionDraft);
  let orderRefreshes=0;
  const context={state,draftRetention,arrangementController:{refresh:()=>orderRefreshes++},$:id=>nodes[id],stalePlanningReview:()=>{},staleAudioReview:()=>{}};vm.runInNewContext(source.slice(a,b),context);
  context.markDirty('music');assert.equal(state.revisions.music,1);assert.equal(state.bundles.music.dirty,false);assert.equal(nodes.download.disabled,false);
  state.bundles.music.inputIndependent=false;context.markDirty('music');assert.equal(state.bundles.music.dirty,true);assert.equal(nodes.download.disabled,true);
  assert.equal(orderRefreshes,2);assert.deepEqual(retentionScopes,['music','music']);assert.equal(draftRetention.status().dirty,false);
});
