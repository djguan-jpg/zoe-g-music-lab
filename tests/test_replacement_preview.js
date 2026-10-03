// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
const jsonFile=(name,content)=>new File([content],name);
const jsonBytes=value=>new TextEncoder().encode(value).buffer;
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const Editor=require('../web/editor-state.js'),Replacement=require('../web/replacement-preview.js');
const {createBriefImport,planningDraft}=require('../web/planning-import.js');
const {createLibraryController}=require('../web/draft-library.js');
function draft(){
  const panels=Object.fromEntries(Object.entries(Editor.draftFields).map(([name,keys])=>[name,{fields:Object.fromEntries(keys.map(k=>[k,'']))}]));
  Object.entries(Editor.draftRows).forEach(([name,rule])=>panels[name][rule.key]=[]);
  panels.music.avoid=[];panels.music.deliverables=[];panels.storyboard.motifs=[];
  panels.lyrics.fields['lyrics-format']='.lrc';panels.audio.fields['audio-profile']='video';
  return {format:'zoe-music-lab-draft',schema_version:3,tool_version:'0.16.0',saved_at:'synthetic',tab:'music',panels};
}
const later=()=>{let resolve,reject;const promise=new Promise((a,b)=>{resolve=a;reject=b;});return {promise,resolve,reject};};
function harness(){const current={draft:draft(),media:[null,null]};return {current,preview:Replacement.createPreview({capture:()=>current})};}
function music(){return JSON.parse(fs.readFileSync(path.join(__dirname,'../examples/first-light-music.json'),'utf8'));}
const file=brief=>jsonFile('brief.json',JSON.stringify(brief));

test('accepted payload and proposals cannot mutate the captured replacement',()=>{
  const h=harness(),token=h.preview.begin('music'),payload={brief:music()};assert.equal(h.preview.proposal(),null);
  assert.equal(h.preview.accept(token,payload),true);payload.brief.title='外部改動';const a=h.preview.proposal();a.brief.title='caller改動';
  assert.equal(h.preview.proposal().brief.title,'樓梯間的回聲');
});
test('scoped preview preserves independent panels, tab, settings and media selection',()=>{
  const h=harness(),token=h.preview.begin('storyboard');h.current.draft.panels.music.fields['music-title']='新歌';h.current.draft.panels.lyrics.fields['lyrics-source']='校時新稿';
  h.current.draft.tab='lyrics';h.current.media=[{name:'one.wav'},{name:'two.wav'}];assert.equal(h.preview.accept(token,{title:'分鏡'}),true);assert.equal(h.preview.proposal().title,'分鏡');
});
test('target edit after preview blocks replacement without losing current edits or pending data',()=>{
  const h=harness(),token=h.preview.begin('music');h.preview.accept(token,{title:'外部歌曲'});h.current.draft.panels.music.fields['music-title']='編修';
  assert.throws(()=>h.preview.proposal(),/目標工作台已有修改/);assert.equal(h.current.draft.panels.music.fields['music-title'],'編修');
  h.current.draft.panels.music.fields['music-title']='';assert.equal(h.preview.proposal().title,'外部歌曲');
});
test('whole draft rejects an edit in any of the four panels',()=>{
  for(const scope of Object.keys(Editor.draftFields)){
    const h=harness(),token=h.preview.begin();h.preview.accept(token,{draft:draft()});h.current.draft.panels[scope].fields[Editor.draftFields[scope][0]]=scope==='audio'?'distribution':'變更';
    assert.throws(()=>h.preview.proposal(),/草稿或音檔選擇已有修改/);
  }
});
test('full replacement checks native source identity even when names and metadata match',()=>{
  const h=harness(),original={name:'same.wav',size:12,lastModified:123};h.current.media=[original,null];const token=h.preview.begin();h.preview.accept(token,{draft:draft()});
  h.current.media=[{...original},null];assert.throws(()=>h.preview.proposal(),/音檔/);h.current.media=[original,null];assert.doesNotThrow(()=>h.preview.proposal());
});
test('tab, timestamp and object key order are not content changes',()=>{
  const h=harness(),token=h.preview.begin();h.current.draft.tab='storyboard';h.current.draft.saved_at='later';
  const p=h.current.draft.panels.music;p.fields=Object.fromEntries(Object.entries(p.fields).reverse());
  assert.equal(h.preview.accept(token,{draft:draft()}),true);assert.doesNotThrow(()=>h.preview.proposal());
});
test('reading target edits refuse acceptance before any UI callback',()=>{
  const h=harness(),token=h.preview.begin('storyboard');h.current.draft.panels.storyboard.motifs=[{id:'motif-1',name:'新母題',meaning:'留下'}];
  assert.throws(()=>h.preview.accept(token,{brief:{}}),/目標/);assert.equal(h.preview.proposal(),null);
});
test('new selection and explicit cancel suppress obsolete success without reusing a prior payload',()=>{
  const h=harness(),old=h.preview.begin('music'),fresh=h.preview.begin('music');assert.equal(h.preview.check(old),false);assert.equal(h.preview.accept(old,{old:true}),false);
  h.preview.accept(fresh,{fresh:true});h.preview.cancel();assert.equal(h.preview.proposal(),null);assert.equal(h.preview.accept(fresh,{}),false);
});
test('unsupported scope refuses and leaves current draft unchanged',()=>{
  const h=harness(),before=structuredClone(h.current.draft);assert.throws(()=>h.preview.begin('audio'),/範圍/);assert.deepEqual(h.current.draft,before);
});
function briefHarness(validate){const h=harness(),ready=[],errors=[];const reader=createBriefImport({preview:h.preview,validate,
  onReady:r=>ready.push(r),onError:e=>errors.push(e.message)});return {...h,reader,ready,errors};}
test('real brief adapter returns a guarded proposal that merges only the selected panel',async()=>{
  const h=briefHarness(async(_,brief)=>({brief}));await h.reader.read(file(music()),'music');h.current.draft.panels.lyrics.fields['lyrics-source']='新原文';
  const selected=h.preview.proposal(),result=planningDraft(h.current.draft,selected.operation,selected.result.brief);
  assert.equal(result.panels.lyrics.fields['lyrics-source'],'新原文');assert.equal(result.panels.music.fields['music-title'],'樓梯間的回聲');
});
test('real brief read rejects late target success and keeps later edit',async()=>{
  const wait=later(),h=briefHarness(()=>wait.promise),work=h.reader.read(file(music()),'music');await Promise.resolve();await Promise.resolve();
  h.current.draft.panels.music.fields['music-title']='晚回應前新歌名';wait.resolve({brief:music()});assert.equal(await work,false);
  assert.equal(h.ready.length,0);assert.match(h.errors.at(-1),/目標/);assert.equal(h.current.draft.panels.music.fields['music-title'],'晚回應前新歌名');
});
test('target change while file text is pending avoids submitting an obsolete brief',async()=>{
  const wait=later();let calls=0;const h=briefHarness(async()=>{calls++;return {};});const work=h.reader.read({name:'old.json',size:12,arrayBuffer:()=>wait.promise.then(jsonBytes)},'music');
  h.current.draft.panels.music.fields['music-hook']='後續修改';wait.resolve(JSON.stringify(music()));assert.equal(await work,false);assert.equal(calls,0);
});
test('obsolete brief transport error reports preservation rather than the old failure',async()=>{
  const wait=later(),h=briefHarness(()=>wait.promise),work=h.reader.read(file(music()),'music');await Promise.resolve();await Promise.resolve();
  h.current.draft.panels.music.fields['music-title']='編修';wait.reject(Error('controlled old failure'));await work;assert.match(h.errors.at(-1),/目前內容保留/);assert.equal(h.errors.join('').includes('controlled'),false);
});
test('unrelated edits keep a current brief error visible and allow a fresh selection',async()=>{
  const wait=later(),h=briefHarness(()=>wait.promise),work=h.reader.read(file(music()),'music');await Promise.resolve();await Promise.resolve();
  h.current.draft.panels.storyboard.fields['mv-title']='其他分鏡';wait.reject(Error('current failure'));await work;assert.equal(h.errors.at(-1),'current failure');
  h.reader.cancel();assert.equal(h.preview.proposal(),null);
});
test('cancelled guarded brief callback cannot revive after a newer read',async()=>{
  const wait=later();let n=0;const h=briefHarness(async(_,brief)=>++n===1?wait.promise:{brief});const old=h.reader.read(file(music()),'music');await Promise.resolve();await Promise.resolve();h.reader.cancel();
  await h.reader.read(file(music()),'music');wait.resolve({brief:music()});assert.equal(await old,false);assert.equal(h.ready.length,1);assert.deepEqual(h.errors,[]);
});
function libraryHarness(request){const h=harness(),ready=[],errors=[];const library=createLibraryController({preview:h.preview,request,capture:()=>h.current.draft,validate:Editor.validateDraft,
  newId:()=> 'unused',onReady:r=>ready.push(r),onError:e=>errors.push(e.message),onPending:()=>{},onSaved:()=>{},onList:()=>{}});return {...h,library,ready,errors};}
const stored=()=>({entry:{id:'synthetic',label:'保存案'},draft:draft()});
test('saved-version adapter uses whole-draft preview and blocks later unrelated edits',async()=>{
  const h=libraryHarness(async()=>stored());await h.library.read('synthetic');assert.equal(h.ready.length,1);
  h.current.draft.panels.audio.fields['audio-profile']='distribution';assert.throws(()=>h.preview.proposal(),/草稿/);assert.equal(h.current.draft.panels.audio.fields['audio-profile'],'distribution');
});
test('late saved-version success rejects target edits without replacing any panel',async()=>{
  const wait=later(),h=libraryHarness(()=>wait.promise),work=h.library.read('synthetic');h.current.draft.panels.lyrics.fields['lyrics-title']='新校時';wait.resolve(stored());
  assert.equal(await work,false);assert.equal(h.ready.length,0);assert.match(h.errors.at(-1),/目前內容保留/);
});
test('saved-version read rejects new audio source and suppresses its obsolete failure',async()=>{
  const wait=later(),h=libraryHarness(()=>wait.promise),work=h.library.read('synthetic');h.current.media=[{name:'later.wav'},null];wait.reject(Error('obsolete server error'));
  assert.equal(await work,false);assert.match(h.errors.at(-1),/音檔/);assert.equal(h.errors.join('').includes('obsolete'),false);
});
test('cancelRead keeps old library results and errors out of a newer guarded preview',async()=>{
  const wait=later();let calls=0;const h=libraryHarness(()=>++calls===1?wait.promise:Promise.resolve(stored()));const old=h.library.read('old');h.library.cancelRead();await h.library.read('new');wait.reject(Error('old'));
  assert.equal(await old,false);assert.equal(h.ready.length,1);assert.equal(h.preview.proposal().entry.label,'保存案');assert.deepEqual(h.errors,[]);
});
function appHarness(){
  const h=harness(),elements=new Map(),messages=[],loaded=[];const element=id=>{if(!elements.has(id))elements.set(id,{value:'',hidden:true,textContent:''});return elements.get(id);};
  const context={structuredClone,Number,JSON,Error,state:{busy:false},$:element,MusicEditor:Editor,MusicJsonDocument:require('../musiclab/assets/json-document.js'),draftPreview:h.preview,
    draftTask:Editor.createLatestTask(),clearConversion:()=>{h.preview.cancel();element('draft-conversion').hidden=true;},
    briefImporter:{cancel:()=>{}},clearBriefReview:()=>{},clearLibraryReview:()=>{},say:m=>messages.push(m),loadDraft:d=>loaded.push(structuredClone(d))};
  vm.createContext(context);const source=fs.readFileSync(path.join(__dirname,'../web/app.js'),'utf8');const start=source.indexOf("$('draft-open').onchange="),end=source.indexOf("$('draft-undo').onclick=",start);
  vm.runInContext(source.slice(start,end),context);return {...h,element,messages,loaded};
}
const draftFile=d=>jsonFile('draft.json',JSON.stringify(d));
test('actual draft handler refuses invalid UTF8 before preview and preserves current draft',async()=>{
  const h=appHarness(),before=structuredClone(h.current.draft);
  await chooseDraft(h,new File([new Uint8Array([0xff]),JSON.stringify(draft())],'broken.json'));
  assert.equal(h.element('draft-conversion').hidden,true);assert.deepEqual(h.current.draft,before);
  assert.match(h.messages.at(-1),/UTF-8/);
});
test('actual draft handler refuses duplicate unknown schema instead of taking last version',async()=>{
  const h=appHarness(),before=structuredClone(h.current.draft);
  await chooseDraft(h,jsonFile('ambiguous.json','{"schema_version":999,'+JSON.stringify(draft()).slice(1)));
  assert.equal(h.element('draft-conversion').hidden,true);assert.deepEqual(h.current.draft,before);
  assert.match(h.messages.at(-1),/重複/);
});
const chooseDraft=(h,f)=>h.element('draft-open').onchange({target:{files:[f],value:'selected'}});
test('actual draft handler previews modern data, applies explicitly and cancels without writing',async()=>{
  const h=appHarness();await chooseDraft(h,draftFile(draft()));assert.equal(h.loaded.length,0);assert.equal(h.element('draft-conversion').hidden,false);assert.equal(h.element('draft-convert').textContent,'載入這份草稿');
  h.element('draft-cancel').onclick();h.element('draft-convert').onclick();assert.equal(h.loaded.length,0);
  await chooseDraft(h,draftFile(draft()));h.element('draft-convert').onclick();assert.equal(h.loaded.length,1);
});
test('actual modern-draft read keeps edits made during asynchronous file reading',async()=>{
  const wait=later(),h=appHarness(),work=chooseDraft(h,{name:'draft.json',size:100,arrayBuffer:()=>wait.promise.then(jsonBytes)});h.current.draft.panels.music.fields['music-title']='讀取期間修改';wait.resolve(JSON.stringify(draft()));await work;
  assert.equal(h.loaded.length,0);assert.equal(h.element('draft-conversion').hidden,true);assert.match(h.messages.at(-1),/目前內容保留/);
});
test('actual draft apply refuses a new media source or a later lyric edit',async()=>{
  for(const modify of [h=>{h.current.media=[{name:'new.wav'},null];},h=>{h.current.draft.panels.lyrics.fields['lyrics-source']='後續歌詞';}]){
    const h=appHarness();await chooseDraft(h,draftFile(draft()));modify(h);h.element('draft-convert').onclick();assert.equal(h.loaded.length,0);assert.match(h.messages.at(-1),/目前內容保留/);
  }
});
test('actual draft handler accepts BOM and refuses unknown schema without replacing current content',async()=>{
  const h=appHarness();await chooseDraft(h,jsonFile('draft.json','\uFEFF'+JSON.stringify(draft())));assert.equal(h.element('draft-conversion').hidden,false);
  const unknown=draft();unknown.schema_version=999;await chooseDraft(h,draftFile(unknown));assert.equal(h.loaded.length,0);assert.equal(h.element('draft-conversion').hidden,true);
});
test('actual draft cancellation suppresses late read completion',async()=>{
  const wait=later(),h=appHarness(),work=chooseDraft(h,{name:'draft.json',size:100,arrayBuffer:()=>wait.promise.then(jsonBytes)});h.element('draft-cancel').onclick();wait.resolve(JSON.stringify(draft()));await work;
  assert.equal(h.loaded.length,0);assert.equal(h.element('draft-conversion').hidden,true);
});
test('actual legacy draft preview keeps explicit conversion, refuses later edits and retains original file',async()=>{
  const h=appHarness(),legacy=draft();legacy.schema_version=2;delete legacy.panels.music.fields['music-language'];delete legacy.panels.music.avoid;delete legacy.panels.music.deliverables;
  const original=JSON.stringify(legacy);await chooseDraft(h,draftFile(legacy));assert.equal(h.loaded.length,0);assert.equal(h.element('draft-convert').textContent,'轉換並載入舊版草稿');
  h.current.draft.panels.music.fields['music-title']='後續修改';h.element('draft-convert').onclick();assert.equal(h.loaded.length,0);assert.match(h.messages.at(-1),/目前內容保留/);
  await chooseDraft(h,draftFile(legacy));h.element('draft-convert').onclick();assert.equal(h.loaded.length,1);assert.equal(h.loaded[0].schema_version,3);assert.equal(JSON.stringify(legacy),original);
});
