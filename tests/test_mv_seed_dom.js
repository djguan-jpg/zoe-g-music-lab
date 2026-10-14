// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs');
const P=require('../web/mv-project.js'),R=require('../web/mv-render.js'),S=require('../web/mv-seed.js'),H=require('../web/mv-handoff.js'),J=require('../musiclab/assets/json-document.js'),C=require('../contracts/draft-v3.json');
function draft(){
  const panels=Object.fromEntries(Object.entries(C.fields).map(([p,fields])=>[p,{fields:Object.fromEntries(fields.map(f=>[f,'']))}]));
  for(const [p,row] of Object.entries(C.rows))panels[p][row.key]=[];
  panels.music.avoid=[];panels.music.deliverables=[];panels.storyboard.motifs=[];panels.audio.fields['audio-profile']='video';panels.lyrics.fields['lyrics-format']='.json';
  return P.seed({format:C.format,schema_version:3,tool_version:'0.171.0',saved_at:'2026-10-09T00:00:00Z',tab:'storyboard',panels},'  原文 🎵  \n下一句',1,4,'合成 MV');
}
const file=(name,type,bytes)=>({name,type,size:bytes.length,arrayBuffer:async()=>Uint8Array.from(bytes).buffer});
class Element extends EventTarget {
  constructor(){super();this.disabled=false;this.hidden=false;this.checked=false;this.files=[];this.raw='';this.textContent='';}
  get value(){return this.raw;}set value(v){this.raw=v;if(v==='')this.files=[];}
  pause(){}load(){}removeAttribute(){}
  click(){this.dispatchEvent(new Event('click'));}
}
function fixture(mode='ok'){
  const elements=new Map(),document=new EventTarget(),events=new EventTarget(),errors=[],calls=[],revoked=[],viewClicks=[],downloads=[],audioOptions=[];
  const $=id=>{if(!elements.has(id))elements.set(id,new Element());return elements.get(id);};document.getElementById=$;document.querySelector=selector=>({click(){viewClicks.push(selector);}});
  const audio=file('tone.wav','audio/wav',[1,2,3]),art=file('art.png','image/png',[4,5,6]),state={draft:draft(),audio,media:{ready:true,error:null,source:'original',current_source:'original',duration:4},images:[{shot_id:'old-shot',url:'original-art',file:art}],allowed:true};
  state.draft.panels.lyrics.cues[1].text='  已逐句編修 🎵  ';state.draft.panels.storyboard.shots[0].purpose='原本鏡頭創作';
  let ids=['old-shot'],count=0,api;
  const capture=()=>({...state,shots:state.draft.panels.storyboard.shots.map((value,i)=>({id:ids[i],value})),cues:state.draft.panels.lyrics.cues.map(value=>({value}))});
  document.createElement=tag=>{assert.equal(tag,'audio');const el=new Element();el.duration=4;Object.defineProperty(el,'src',{set(){queueMicrotask(()=>el.onloadedmetadata?.());}});return el;};
  const context={File:require('node:buffer').File,Uint8Array,MusicMVProject:P,MusicMVRender:R,MusicMVSeed:S,MusicMVHandoff:H,MusicJsonDocument:J,MusicTextDownloadDom:{createByteSender:()=>({send(value){if(mode==='sender-refusal')return false;downloads.push(value);return true;},dispose(){}})},crypto:{randomUUID:()=>String(++count)},URL:{createObjectURL:()=> 'preview-'+count,revokeObjectURL:u=>revoked.push(u)},Image:class{constructor(){this.naturalWidth=16;this.naturalHeight=16;}set src(value){queueMicrotask(()=>this.onload());}},DataTransfer:class{constructor(){this.files=[];this.items={add:f=>this.files.push(f)};}},setTimeout,clearTimeout,TextEncoder,TextDecoder};
  vm.createContext(context);vm.runInContext(fs.readFileSync('web/mv-workflow-dom.js','utf8'),context);
  api=context.MusicMVWorkflowDOM.bind({document,events,player:new Element(),capture,studio:{stop(){},refresh(){},async selectImage(id,f){calls.push('image');if(mode==='image-refusal')return false;state.images.push({shot_id:id,url:'loaded-art',file:mode==='image-corrupt'?file(f.name,f.type,[7,8,9]):f});return true;}},apply(d,id){calls.push('apply');if(mode==='no-op')return;state.draft=d;ids=id;state.images=[];state.audio=null;api.projectLoaded(d);},async loadAudio(f,options){calls.push('audio');audioOptions.push(options);state.audio=mode==='audio-corrupt'?file(f.name,f.type,[9,9,9]):f;state.media={...state.media,source:'loaded',current_source:'loaded'};},onError:e=>errors.push(e.message)});
  api.projectLoaded(state.draft);
  return {$,api,state,errors,calls,audio,art,revoked,document,viewClicks,downloads,audioOptions,ids:()=>ids,capture};
}
async function wait(check){const deadline=performance.now()+2000;while(performance.now()<deadline){if(check())return;await new Promise(resolve=>setTimeout(resolve,2));}assert.fail('bounded adapter completion was not observed');}
async function preview(a){a.$('mv-quick-create').click();await wait(()=>!a.$('mv-quick-review').hidden&&!a.$('mv-quick-apply').disabled);}
test('actual DOM adapter loads exact quick source and preview or cancellation preserves edited rows IDs and media',async()=>{
  const a=fixture(),before=structuredClone(a.state.draft);assert.equal(a.$('mv-quick-title').value,'合成 MV');assert.equal(a.$('mv-quick-lyrics').value,'  原文 🎵  \n下一句');
  await preview(a);assert.match(a.$('mv-quick-review-note').textContent,/沿用目前 1 張圖片/);assert.match(a.$('mv-quick-review-note').textContent,/逐句修訂、校時、母題及鏡頭創作會被替換/);assert.deepEqual(a.state.draft,before);assert.deepEqual(a.calls,[]);assert.equal(a.state.audio,a.audio);assert.equal(a.state.images[0].file,a.art);assert.deepEqual(a.ids(),['old-shot']);
  a.$('mv-quick-cancel').click();assert.equal(a.$('mv-quick-review').hidden,true);assert.deepEqual(a.state.draft,before);assert.deepEqual(a.calls,[]);a.api.dispose();
});
test('actual DOM preview pins current edits native audio identity and media availability before any replacement',async()=>{
  for(const mutate of [a=>a.state.draft.panels.lyrics.cues[1].text='edited',a=>a.state.audio=file('tone.wav','audio/wav',[1,2,3]),a=>a.state.media.current_source='other',a=>a.state.media.ready=false]){
    const a=fixture();await preview(a);mutate(a);const before=structuredClone(a.state.draft);a.$('mv-quick-apply').click();await wait(()=>a.errors.length>0);assert.deepEqual(a.calls,[]);assert.deepEqual(a.state.draft,before);assert.equal(a.$('mv-quick-review').hidden,true);a.api.dispose();
  }
});
test('actual DOM selected file replacement invalidates previews even with identical names sizes and bytes',async()=>{
  const a=fixture();a.$('mv-quick-images').files=[a.art];await preview(a);a.$('mv-quick-images').files=[file(a.art.name,a.art.type,[4,5,6])];a.document.dispatchEvent(new Event('change'));assert.equal(a.$('mv-quick-review').hidden,true);a.$('mv-quick-apply').click();assert.deepEqual(a.calls,[]);a.api.dispose();
});
test('actual accepted rebuild retains original audio and attached image bytes and deliberately replaces prior cue edits',async()=>{
  const a=fixture(),other=structuredClone(a.state.draft.panels.music);await preview(a);a.$('mv-quick-apply').click();await wait(()=>a.$('mv-project-note').textContent.startsWith('已建立並回讀核對'));
  assert.equal(a.state.draft.panels.lyrics.cues[1].text,'下一句');assert.equal(a.state.images[0].file,a.art);assert.equal(a.state.audio,a.audio);assert.deepEqual(a.state.draft.panels.music,{...other,fields:{...other.fields,'music-title':'合成 MV'}});assert.deepEqual(a.calls,['apply','audio','image']);assert.equal(a.$('studio-loop-end').value,'4');assert.equal(a.errors.length,0);a.api.dispose();
});
test('explicit text cards remove old attachments only after accepted replacement and newly selected images take precedence',async()=>{
  for(const textcard of [true,false]){
    const a=fixture(),selected=file('new.png','image/png',[7,8,9]);a.$('mv-quick-images').files=[selected];a.$('mv-quick-textcard').checked=textcard;await preview(a);assert.equal(a.state.images[0].file,a.art);a.$('mv-quick-apply').click();await wait(()=>a.$('mv-project-note').textContent.startsWith('已建立並回讀核對'));assert.equal(a.state.images.length,textcard?0:1);if(!textcard)assert.equal(a.state.images[0].file,selected);assert.equal(a.$('mv-quick-textcard').checked,false);assert.equal(a.$('mv-quick-images').files.length,0);a.api.dispose();
  }
});
test('actual adapter no-op writes native image refusal or corrupt media never announce successful creation',async()=>{
  for(const mode of ['no-op','image-refusal','image-corrupt','audio-corrupt']){
    const a=fixture(mode);await preview(a);a.$('mv-quick-apply').click();await wait(()=>a.errors.length>0&&!a.$('mv-quick-create').disabled);assert.equal(a.$('mv-project-note').textContent.startsWith('已建立並回讀核對'),false);const before=[...a.calls];a.$('mv-quick-apply').click();assert.deepEqual(a.calls,before);a.api.dispose();
  }
});
test('original application draft load synchronizes quick entry only after all original fields rows and reset steps',()=>{
  const source=fs.readFileSync('web/app.js','utf8'),start=source.indexOf('function applyDraft('),end=source.indexOf('let draftDownloadSource=',start),calls=[],elements=new Map();assert.ok(start>0&&end>start);
  const $=id=>{if(!elements.has(id))elements.set(id,{value:'old',hidden:false});return elements.get(id);};const d=draft();
  const ctx={state:{studio:null,audioAcceptance:null,mvWorkflow:{projectLoaded:loaded=>{assert.equal(loaded,d);assert.equal($('lyrics-source').value,d.panels.lyrics.fields['lyrics-source']);assert.ok(calls.includes('rows'));assert.ok(calls.includes('reset'));calls.push('sync');}}},storyboardDurationController:null,storyboardReadyController:null,seedController:null,lyricsSeedController:null,lyricsImportController:null,clearLibraryReview(){},clearDeletionHistory(){},briefImporter:{cancel(){}},clearBriefReview(){},$,writeValue:(el,v)=>el.value=v,renderSections(){},renderRequirements(){},renderMotifs(){},renderShots(){},renderCues:()=>calls.push('rows'),resetAudio:()=>calls.push('reset'),MusicEditor:{draftFields:C.fields},markDirty(){},document:{querySelector:()=>({click:()=>calls.push('tab'),focus(){}})},clearOutput(){},tick(){}};
  vm.createContext(ctx);vm.runInContext(source.slice(start,end),ctx);ctx.applyDraft(d,['s']);assert.deepEqual(calls,['rows','reset','sync','tab']);
});
test('older media projects reopen under the current tool version while every creative value and media byte remains intact',async()=>{
  const a=fixture(),original={...structuredClone(a.state.draft),tab:'lyrics'},project={format:'zoe-mv-project',schema_version:1,draft:original,shot_ids:['old-shot'],audio:await P.pack(a.audio),images:[{shot_id:'old-shot',asset:await P.pack(a.art)}]};
  const bytes=new TextEncoder().encode(JSON.stringify(project));a.state.draft.tool_version='0.172.0';a.$('mv-project-open').files=[file('previous.zoemv.json','application/json',bytes)];a.$('mv-project-open').dispatchEvent(new Event('change'));
  await wait(()=>a.$('mv-project-review').hidden===false&&!a.$('mv-project-apply').disabled);a.$('mv-project-apply').click();await wait(()=>a.$('mv-project-note').textContent.startsWith('已載入並回讀核對'));
  assert.equal(a.audioOptions.length,1);assert.equal(a.audioOptions[0].preserveDuration,true);
  assert.deepEqual(JSON.parse(JSON.stringify(a.state.draft)),{...original,tool_version:'0.172.0'});assert.deepEqual(a.viewClicks,['[data-tab="storyboard"]']);assert.equal(project.draft.tool_version,'0.171.0');assert.equal(await P.hash(await a.state.audio.arrayBuffer()),project.audio.sha256);assert.equal(await P.hash(await a.state.images[0].file.arrayBuffer()),project.images[0].asset.sha256);assert.deepEqual(a.ids(),['old-shot']);assert.equal(a.errors.length,0);a.api.dispose();
});
test('actual handoff button sends one standard archive without changing original rows or native media',async()=>{
  const a=fixture(),before=structuredClone(a.state.draft);a.$('mv-handoff-download').click();
  await wait(()=>a.$('mv-project-note').textContent.startsWith('已送出剪輯交接包'));
  assert.equal(a.downloads.length,1);const saved=a.downloads[0];assert.equal(saved.name,'music-handoff.zip');
  assert.equal(saved.manifest.subtitle_cue_count,2);assert.equal(saved.manifest.files.find(e=>e.role==='audio').sha256,await P.hash(await a.audio.arrayBuffer()));
  assert.equal(a.$('mv-project-receipt').textContent,'交接包 SHA-256：'+saved.sha256);
  assert.deepEqual(a.state.draft,before);assert.equal(a.state.audio,a.audio);assert.equal(a.state.images[0].file,a.art);assert.deepEqual(a.calls,[]);a.api.dispose();
});
test('handoff refuses changes in source values native file identity visibility tab or disposal while the original read is pending',async()=>{
  for(const change of [a=>a.state.draft.panels.lyrics.cues[0].text='edited',a=>a.state.audio=file('tone.wav','audio/wav',[1,2,3]),a=>a.state.media.source='other',a=>a.state.media.ready=false,a=>a.state.media.error=true,a=>a.state.allowed=false,a=>a.state.draft.tab='lyrics',a=>a.api.dispose()]){
    const a=fixture();let release;a.audio.arrayBuffer=()=>new Promise(resolve=>release=resolve);a.$('mv-handoff-download').click();
    assert.equal(typeof release,'function');change(a);release(new Uint8Array([1,2,3]).buffer);
    await new Promise(resolve=>setTimeout(resolve,10));assert.equal(a.downloads.length,0);assert.deepEqual(a.calls,[]);
    assert.equal(a.$('mv-project-note').textContent.startsWith('已送出剪輯交接包'),false);a.api.dispose();
  }
});
test('handoff never announces download after native sender refusal or invalid subtitle data',async()=>{
  for(const mode of ['sender-refusal','invalid-cue']){
    const a=fixture(mode);if(mode==='invalid-cue')a.state.draft.panels.lyrics.cues[0].end='';
    const before=structuredClone(a.state.draft);a.$('mv-handoff-download').click();await wait(()=>a.errors.length>0);
    assert.equal(a.downloads.length,0);assert.deepEqual(a.state.draft,before);assert.deepEqual(a.calls,[]);a.api.dispose();
  }
});
