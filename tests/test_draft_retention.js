// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const {createCheckpoint,createGuard}=require('../web/draft-retention.js');
const {createLibraryController}=require('../web/draft-library.js');
const Editor=require('../web/editor-state.js'),Undo=require('../web/draft-undo.js');
function draft(title='initial'){
  const panels=Object.fromEntries(Object.entries(Editor.draftFields).map(([name,fields])=>[name,{fields:Object.fromEntries(fields.map(id=>[id,'']))}]));
  Object.entries(Editor.draftRows).forEach(([name,rule])=>panels[name][rule.key]=[]);
  panels.music.avoid=['原文\n不修剪'];panels.music.deliverables=[];panels.storyboard.motifs=[];
  panels.music.fields['music-title']=title;panels.lyrics.fields['lyrics-format']='.lrc';panels.audio.fields['audio-profile']='distribution';
  return Editor.validateDraft({format:'zoe-music-lab-draft',schema_version:3,tool_version:'0.21.0',saved_at:'synthetic',tab:'music',panels});
}
function harness(){
  let current=draft(),captureCount=0;const listeners=new Set(),states=[],scopes=[];
  const guard=createGuard({capture:()=>{captureCount++;return structuredClone(current);},capturePanel:scope=>{scopes.push(scope);return structuredClone(current.panels[scope]);},
    events:{addEventListener:(type,fn)=>{assert.equal(type,'beforeunload');listeners.add(fn);},removeEventListener:(type,fn)=>{assert.equal(type,'beforeunload');listeners.delete(fn);}},onState:value=>states.push(value)});
  guard.initialize(current);
  return {guard,listeners,states,scopes,current:()=>current,set:value=>current=value,captures:()=>captureCount};
}
test('initial content regenerates, metadata and panel key order are not lost creative edits',()=>{
  const p=createCheckpoint(),a=draft();assert.equal(p.status().ready,false);p.initialize(a);
  a.tab='lyrics';a.saved_at='later';a.tool_version='another';a.panels.music.fields=Object.fromEntries(Object.entries(a.panels.music.fields).reverse());
  assert.equal(p.refresh(a).dirty,false);assert.equal(p.status().mode,'initial');
});
test('whitespace, list order, empty rows and all four panels are real changes',()=>{
  const p=createCheckpoint(),original=draft();p.initialize(original);
  for(const name of Object.keys(original.panels)){
    const edited=structuredClone(original),id=Object.keys(edited.panels[name].fields)[0];edited.panels[name].fields[id]+=' ';
    assert.equal(p.refresh(edited).dirty,true);assert.equal(p.refresh(original).dirty,false);
  }
  const edited=structuredClone(original);edited.panels.music.deliverables=['甲','乙'];p.retain(edited,{kind:'file'});
  edited.panels.music.deliverables.reverse();assert.equal(p.refresh(edited).dirty,true);
  edited.panels.music.deliverables=[];edited.panels.music.avoid.push('');assert.equal(p.refresh(edited).dirty,true);
});
test('a submitted download never acknowledges persistence and confirmation refers to the submitted snapshot',()=>{
  const p=createCheckpoint();p.initialize(draft());const a=draft('甲'),b=draft('乙');p.refresh(a);p.requestDownload(a);
  assert.equal(p.status().dirty,true);assert.equal(p.status().mode,'download_unconfirmed');
  p.refresh(b);assert.equal(p.status().mode,'changed_after_download');p.confirmDownload();assert.equal(p.status().dirty,true);
  assert.equal(p.refresh(a).mode,'download');assert.equal(p.status().dirty,false);assert.equal(p.confirmDownload(),false);
});
test('late library acknowledgment remembers original content, not whatever is current',()=>{
  const p=createCheckpoint();p.initialize(draft());const a=draft('保存當下'),b=draft('保存後修改');p.refresh(b);p.retain(a,{kind:'library',label:'第一案'});
  assert.equal(p.status().dirty,true);assert.equal(p.refresh(a).dirty,false);assert.equal(p.status().label,'第一案');
  a.panels.music.fields['music-title']='不能污染紀錄';assert.equal(p.status().dirty,false);
});
test('one complete retained draft is required; mixing pieces of retained versions is still dirty',()=>{
  const p=createCheckpoint();p.initialize(draft());const a=draft('歌曲案'),b=draft();b.panels.storyboard.fields['mv-title']='分鏡案';
  p.retain(a,{kind:'file'});p.retain(b,{kind:'library'});const mix=structuredClone(a);mix.panels.storyboard=b.panels.storyboard;
  assert.equal(p.refresh(mix).dirty,true);assert.equal(p.refresh(a).mode,'file');assert.equal(p.refresh(b).mode,'library');
});
test('confirming an older download does not forget the newer confirmed library snapshot',()=>{
  const p=createCheckpoint();p.initialize(draft());const a=draft('舊下載'),b=draft('新保存');p.requestDownload(a);p.retain(b,{kind:'library'});p.refresh(b);p.confirmDownload();
  assert.equal(p.status().dirty,false);assert.equal(p.status().mode,'library');assert.equal(p.refresh(a).mode,'download');
});
test('unsupported checkpoint kinds and scopes refuse; the newest reference per kind is bounded',()=>{
  const p=createCheckpoint();assert.throws(()=>p.retain(draft(),{kind:'file'}),/初始化/);p.initialize(draft());
  assert.throws(()=>p.retain(draft(),{kind:'pretend-save'}),/不支援/);assert.throws(()=>p.updatePanel('unknown',{}),/未知/);
  p.retain(draft('old'),{kind:'file'});p.retain(draft('new'),{kind:'file'});assert.equal(p.refresh(draft('old')).dirty,true);assert.equal(p.refresh(draft('new')).dirty,false);
});
test('scoped keystrokes capture only that panel; listeners appear only for an unretained draft',()=>{
  const h=harness();assert.equal(h.listeners.size,0);h.current().panels.music.fields['music-title']='編修';h.guard.refresh('music');
  assert.deepEqual(h.scopes,['music']);assert.equal(h.captures(),0);assert.equal(h.listeners.size,1);
  h.guard.refresh('music');assert.equal(h.listeners.size,1);h.current().panels.music.fields['music-title']='initial';h.guard.refresh('music');assert.equal(h.listeners.size,0);
});
test('the actual beforeunload handler rechecks current content and stops loss without writing storage',()=>{
  const h=harness();h.set(draft('未另存'));h.guard.refresh();const leave=[...h.listeners][0];let prevented=0,event={preventDefault:()=>prevented++,returnValue:null};
  leave(event);assert.equal(prevented,1);assert.equal(event.returnValue,'');
  h.set(draft());event={preventDefault:()=>prevented++,returnValue:null};leave(event);assert.equal(prevented,1);assert.equal(event.returnValue,null);
  h.guard.refresh();assert.equal(h.listeners.size,0);
});
test('dispose releases its own listener and full-content refresh catches programmatic panel replacement',()=>{
  const h=harness();h.set(draft('whole replacement'));h.guard.refresh();assert.equal(h.listeners.size,1);h.guard.dispose();assert.equal(h.listeners.size,0);
});
test('real save controller exposes an isolated click-time snapshot to retention after a delayed acknowledgment',async()=>{
  const h=harness(),calls=[];h.set(draft('點擊時'));h.guard.refresh();
  const c=createLibraryController({capture:h.current,validate:Editor.validateDraft,newId:()=> 'draft-'+'1'.repeat(32),
    request:(action,payload)=>new Promise((resolve,reject)=>calls.push({action,payload,resolve,reject})),
    onSaved:r=>{h.guard.retain(r.draft,{kind:'library',label:r.entry.label});r.draft.panels.music.fields['music-title']='外部污染';},
    onPending:()=>{},onError:()=>{},onReady:()=>{},onList:()=>{}});
  const saving=c.save('保存案');h.set(draft('晚到期間編修'));h.guard.refresh();calls[0].resolve({entry:{label:'保存案'},reused:false});assert.equal(await saving,true);
  assert.equal(h.guard.status().dirty,true);h.set(draft('點擊時'));h.guard.refresh();assert.equal(h.guard.status().dirty,false);
});
test('unconfirmed failure, abandon and retry cannot mark the later form as retained',async()=>{
  const h=harness(),calls=[];h.set(draft('送出'));h.guard.refresh();
  const c=createLibraryController({capture:h.current,validate:Editor.validateDraft,newId:()=> 'draft-'+'2'.repeat(32),
    request:(action,payload)=>new Promise((resolve,reject)=>calls.push({action,payload,resolve,reject})),onSaved:r=>h.guard.retain(r.draft,{kind:'library'}),
    onPending:()=>{},onError:()=>{},onReady:()=>{},onList:()=>{}});
  const saving=c.save('待確認');calls[0].reject(Error('unknown'));await saving;assert.equal(h.guard.status().dirty,true);
  h.set(draft('後來'));h.guard.refresh();const retry=c.retry();assert.equal(calls[1].payload.draft.panels.music.fields['music-title'],'送出');
  calls[1].resolve({entry:{label:'待確認'},reused:true});await retry;assert.equal(h.guard.status().dirty,true);
  assert.equal(c.abandon(),true);assert.equal(h.guard.status().dirty,true);
});
test('actual undo proposal returns to retained content and clears the content warning',()=>{
  const h=harness(),u=Undo.createUndo(),before=draft('已保存'),after=draft('套用後');h.set(before);h.guard.retain(before,{kind:'library'});u.record(before,after,'music');
  h.set(after);h.guard.refresh('music');assert.equal(h.guard.status().dirty,true);h.set(u.proposal(h.current()).draft);h.guard.refresh('music');assert.equal(h.guard.status().dirty,false);
});
test('production startup keeps edits made while examples load, including an already retained edit',async()=>{
  const source=fs.readFileSync(require.resolve('../web/app.js'),'utf8'),start=source.indexOf('async function initialize(){'),end=source.indexOf('\ninitialize();',start),h=harness();let resolve,loaded=0,notice='';
  const context={writeValue:(control,value)=>{control.value=value;},draftRetention:h.guard,captureDraft:h.current,state:{examples:null},fetch:()=>new Promise(r=>resolve=r),loadMusic:()=>loaded++,loadMv:()=>loaded++,$:()=>({value:''}),drawWave:()=>{},setupLibrary:()=>{},say:s=>notice=s};
  vm.runInNewContext(source.slice(start,end)+'\nthis.init=initialize;',context);const pending=context.init();h.set(draft('載入期間自寫'));h.guard.refresh('music');h.guard.retain(h.current(),{kind:'library'});
  resolve({ok:true,json:async()=>({music:{}})});await pending;assert.equal(loaded,0);assert.equal(h.current().panels.music.fields['music-title'],'載入期間自寫');assert.match(notice,/編修已保留/);
});
test('native downloads stay in a dedicated frame and retention assets load before the app',()=>{
  const html=fs.readFileSync(require.resolve('../web/index.html'),'utf8');
  for(const name of ['draft-export','library-export','export-form'])assert.match(html,new RegExp('<form id="'+name+'"[^>]*target="export-delivery"'));
  assert.match(html,/<iframe name="export-delivery"[^>]*hidden/);assert.match(html,/id="draft-confirm-download" type="button"/);
  assert.ok(html.indexOf('/draft-library.js')<html.indexOf('/draft-retention.js'));assert.ok(html.indexOf('/draft-retention.js')<html.indexOf('/app.js'));
});
test('actual draft export records a submitted snapshot, while an oversized refusal creates no confirmation',()=>{
  const source=fs.readFileSync(require.resolve('../web/app.js'),'utf8'),start=source.indexOf("$('draft-export').onsubmit="),end=source.indexOf("$('draft-open').onchange=",start);
  for(const oversized of [false,true]){
    const h=harness();h.set(draft(oversized?'x'.repeat(1024*1024):'download click'));h.guard.refresh();
    const nodes={'draft-export':{},'draft-content':{value:''},'draft-confirm-download':{}},notes=[];
    vm.runInNewContext(source.slice(start,end),{$:id=>nodes[id],state:{busy:false},MusicEditor:Editor,captureDraft:h.current,draftRetention:h.guard,TextEncoder,say:message=>notes.push(message)});
    let refused=false;nodes['draft-export'].onsubmit({preventDefault:()=>refused=true});
    assert.equal(refused,oversized);assert.equal(h.guard.status().pendingDownload,!oversized);assert.equal(h.guard.status().dirty,true);
    if(!oversized)assert.equal(JSON.parse(nodes['draft-content'].value).panels.music.fields['music-title'],'download click');
    else assert.match(notes[0],/超過/);
  }
});
test('startup fetch failure still tracks subsequent draft edits instead of disabling retention',async()=>{
  const source=fs.readFileSync(require.resolve('../web/app.js'),'utf8'),start=source.indexOf('async function initialize(){'),end=source.indexOf('\ninitialize();',start),h=harness();
  const context={writeValue:(control,value)=>{control.value=value;},draftRetention:h.guard,captureDraft:h.current,state:{examples:null},fetch:async()=>{throw Error('synthetic unavailable');},say:()=>{}};
  vm.runInNewContext(source.slice(start,end)+'\nthis.init=initialize;',context);await context.init();h.set(draft('failure then edit'));h.guard.refresh('music');assert.equal(h.guard.status().dirty,true);assert.equal(h.listeners.size,1);
});
