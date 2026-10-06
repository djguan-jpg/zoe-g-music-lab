// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const D=require('../web/library-revision.js'),S=require('../web/library-receipt.js'),E=require('../web/editor-state.js');
const {createLibraryController}=require('../web/draft-library.js'),{createPreview}=require('../web/replacement-preview.js');
const F=require('./library_revision_fixture.js'),original=require('./planning_report_fixture.js');
const later=()=>{let resolve,reject;const promise=new Promise((a,b)=>{resolve=a;reject=b;});return {promise,resolve,reject};};
function harness(request){
 const current={draft:original.draft(),media:[{name:'original.wav'},null]},ready=[],errors=[];
 const preview=createPreview({capture:()=>current}),c=createLibraryController({checkList:(payload,result)=>structuredClone(result),request,capture:()=>current.draft,validate:E.validateDraft,preview,newId:()=> 'unused',confirmSave:async()=>{},checkRead:D.checkedRead,
  onSaved:()=>{},onList:()=>{},onReady:r=>ready.push(r),onError:e=>errors.push(e.message),onPending:()=>{}});
 return {current,ready,errors,preview,c};
}
test('complete selected revision is isolated and preserves raw metadata and all four panels',()=>{
 const r=F.revision('1',' 原案🎵\r\n'),before=structuredClone(r),selected=structuredClone(r.entry),ready=D.checkedRead(r.entry.id,r,E.validateDraft,selected);
 ready.entry.label='other';ready.draft.panels.music.fields['music-title']='new';assert.deepEqual(r,before);assert.deepEqual(selected,before.entry);
 assert.equal(D.checkedRead(r.entry.id,r,E.validateDraft).draft.panels.music.fields['music-title'],' 原案🎵\r\n');
});
test('valid other-ID response and every changed selected metadata field are refused',()=>{
 const a=F.revision(),b=F.revision('2','另一案');assert.throws(()=>D.checkedRead(a.entry.id,b,E.validateDraft,a.entry));
 for(const key of ['label','stored_at','sha256','bytes','created_with','titles']){
  const selected=structuredClone(a.entry);selected[key]=key==='bytes'?selected.bytes+1:key==='titles'?{...selected.titles,music:'other'}:selected[key]+'changed';
  assert.throws(()=>D.checkedRead(a.entry.id,a,E.validateDraft,selected));
 }
});
test('whole read data rejects unknown shapes status versions and invalid metadata before preview',()=>{
 const r=F.revision();for(const mutate of [v=>v.extra=true,v=>delete v.status,v=>v.status='complete',v=>v.entry.extra=true,v=>v.entry.library_schema_version=2,v=>v.entry.draft_schema_version=true,v=>v.entry.label=' ',v=>v.entry.titles.music='wrong',v=>v.entry.bytes=0,v=>v.entry.sha256='A'.repeat(64),v=>v.entry.created_with='\ud800',v=>v.draft.schema_version=4,v=>v.draft.panels.music.fields['music-title']=null]){
  const value=structuredClone(r);mutate(value);assert.throws(()=>D.checkedRead(r.entry.id,value,E.validateDraft));
 }
 for(const id of ['old',r.entry.id+'\n',null,{}])assert.throws(()=>D.checkedRead(id,r,E.validateDraft));
});
test('title metadata preserves Python codepoint truncation and historical producer strings',()=>{
 const title='🎵'.repeat(119)+'甲'+'尾\r\n',r=F.revision('1',title);r.entry.created_with='0.8.0';
 const ready=D.checkedRead(r.entry.id,r,E.validateDraft,r.entry);assert.equal(ready.entry.titles.music,'🎵'.repeat(119)+'甲');assert.equal(ready.draft.panels.music.fields['music-title'],title);
 r.entry.titles.music=title.slice(0,120);assert.throws(()=>D.checkedRead(r.entry.id,r,E.validateDraft));
});
test('controller rejects a complete valid other revision without publishing a preview or altering media',async()=>{
 const a=F.revision(),b=F.revision('2','another'),h=harness(async()=>b),before=structuredClone(h.current.draft),media=h.current.media[0];
 assert.equal(await h.c.read(a.entry.id,a.entry),false);assert.equal(h.ready.length,0);assert.equal(h.preview.proposal(),null);assert.deepEqual(h.current.draft,before);assert.equal(h.current.media[0],media);assert.match(h.errors.at(-1),/選定 ID/);
});
test('read captures an isolated selected entry before awaiting transport',async()=>{
 const a=F.revision(),entry=structuredClone(a.entry),wait=later(),h=harness(()=>wait.promise),work=h.c.read(a.entry.id,entry);entry.label='later list mutation';wait.resolve(a);
 assert.equal(await work,true);assert.equal(h.ready[0].entry.label,a.entry.label);assert.equal(h.preview.proposal().entry.id,a.entry.id);
});
test('latest read and explicit cancel suppress old source success and failures',async()=>{
 const a=F.revision(),b=F.revision('2','newer'),wait=later();let calls=0;const h=harness(()=>++calls===1?wait.promise:Promise.resolve(b));
 const old=h.c.read(a.entry.id,a.entry);assert.equal(await h.c.read(b.entry.id,b.entry),true);wait.resolve(a);assert.equal(await old,false);assert.equal(h.ready.length,1);assert.equal(h.preview.proposal().entry.id,b.entry.id);
 const late=later(),other=harness(()=>late.promise),work=other.c.read(a.entry.id,a.entry);other.c.cancelRead();late.reject(Error('obsolete failure'));assert.equal(await work,false);assert.deepEqual(other.errors,[]);assert.equal(other.preview.proposal(),null);
});
test('current edits or native media changes reject late matching source while preserving them',async()=>{
 for(const mutate of [h=>h.current.draft.panels.lyrics.fields['lyrics-title']='後續編修',h=>h.current.media[0]={name:'new.wav'}]){
  const a=F.revision(),wait=later(),h=harness(()=>wait.promise),work=h.c.read(a.entry.id,a.entry);mutate(h);const after=structuredClone(h.current.draft),media=h.current.media[0];wait.resolve(a);
  assert.equal(await work,false);assert.equal(h.ready.length,0);assert.deepEqual(h.current.draft,after);assert.equal(h.current.media[0],media);assert.match(h.errors.at(-1),/目前內容保留/);
 }
});
test('save receipt reuses the same revision checks and still requires the complete click-time draft',()=>{
 const a=F.revision(),p={id:a.entry.id,label:a.entry.label,draft:a.draft},ack={entry:a.entry,reused:true,status:a.status};assert.deepEqual(S.checkedReadback(p,ack,a,E.validateDraft),ack);
 const changed=structuredClone(a);changed.draft.panels.music.avoid=['changed'];assert.throws(()=>S.checkedReadback(p,ack,changed,E.validateDraft));changed.draft=structuredClone(a.draft);changed.entry.label='other';assert.throws(()=>S.checkedReadback(p,ack,changed,E.validateDraft));
});
function app(){
 const source=fs.readFileSync('web/app.js','utf8'),a=F.revision(),nodes={'library-select':{value:a.entry.id},'library-apply':{},'library-export':{}},notes=[],loaded=[],sent=[];
 const context={structuredClone,Error,JSON,$:id=>nodes[id],MusicLibraryRevision:D,MusicEditor:E,libraryRecords:[structuredClone(a.entry)],pendingLibraryReview:{entry:structuredClone(a.entry),draft:structuredClone(a.draft)},libraryAllowed:()=>true,
  libraryPreview:{proposal:()=>structuredClone(context.pendingLibraryReview)},loadDraft:d=>loaded.push(structuredClone(d)),librarySay:(message,error)=>notes.push({message,error}),textDownloader:{bind:(form,options)=>{form.options=options;}}};
 vm.createContext(context);let start=source.indexOf('function checkedLibrarySelection('),end=source.indexOf("$('library-cancel').onclick=",start);vm.runInContext(source.slice(start,end),context);
 start=source.indexOf("textDownloader.bind($('library-export')");end=source.indexOf('\n',start);vm.runInContext(source.slice(start,end),context);
 const exportDraft=()=>{try{const r=nodes['library-export'].options.select();sent.push(r);return true;}catch(e){nodes['library-export'].options.onError(e);return false;}};
 return {a,nodes,notes,loaded,sent,context,exportDraft};
}
test('actual app apply and export recheck current selected ID and complete metadata',()=>{
 const h=app();assert.equal(h.exportDraft(),true);assert.equal(h.sent[0].content,JSON.stringify(h.a.draft,null,2)+'\n');
 h.context.libraryRecords[0].label='changed after preview';h.nodes['library-apply'].onclick();assert.equal(h.loaded.length,0);assert.equal(h.exportDraft(),false);assert.equal(h.sent.length,1);assert.match(h.notes.at(-1).message,/選定保存版本/);
 h.context.libraryRecords[0]=structuredClone(h.a.entry);h.nodes['library-select'].value=F.revision('2').entry.id;h.nodes['library-apply'].onclick();assert.equal(h.loaded.length,0);assert.equal(h.exportDraft(),false);
 h.nodes['library-select'].value=h.a.entry.id;h.nodes['library-apply'].onclick();assert.deepEqual(h.loaded,[h.a.draft]);assert.equal(h.exportDraft(),true);
});
test('actual app read callback rechecks active selection as well as the initial captured entry',()=>{
 const h=app(),source=fs.readFileSync('web/app.js','utf8'),line=source.split('\n').find(s=>s.trim().startsWith('checkRead:'));
 const callback=vm.runInContext('({'+line.trim()+'}).checkRead',h.context);assert.equal(callback(h.a.entry.id,h.a,E.validateDraft,h.a.entry).entry.id,h.a.entry.id);
 h.context.libraryRecords[0].sha256='f'.repeat(64);assert.throws(()=>callback(h.a.entry.id,h.a,E.validateDraft,h.a.entry));
 h.context.libraryRecords[0]=structuredClone(h.a.entry);h.nodes['library-select'].value=F.revision('2').entry.id;assert.throws(()=>callback(h.a.entry.id,h.a,E.validateDraft,h.a.entry));
});
test('controller requires an explicit read checker and changed selection never passes the pure guard',()=>{
 assert.throws(()=>createLibraryController({checkList:(payload,result)=>structuredClone(result),confirmSave:async()=>{}}),/保存版本來源核對未設定/);
 const a=F.revision();assert.throws(()=>D.checkedSelection(a.entry.id,a.entry,null));assert.throws(()=>D.checkedSelection('other',a.entry,a.entry));assert.deepEqual(D.checkedSelection(a.entry.id,a.entry,a.entry),a.entry);
});
test('actual selection event cancels late preview and keeps the new-selection notice with current edits',async()=>{
 const a=F.revision(),wait=later(),h=harness(()=>wait.promise),work=h.c.read(a.entry.id,a.entry),source=fs.readFileSync('web/app.js','utf8'),node={},messages=[];
 const line=source.split('\n').find(v=>v.startsWith("$('library-select').onchange="));
 let backupRefreshes=0;vm.runInNewContext(line,{$:()=>node,clearLibraryReview:()=>h.c.cancelRead(),librarySelection:()=>{},backupControls:()=>{backupRefreshes++;},librarySay:v=>messages.push(v)});
 h.current.draft.panels.music.fields['music-title']='後續編修';const before=structuredClone(h.current.draft),media=h.current.media[0];node.onchange();wait.resolve(a);
 assert.equal(await work,false);assert.equal(h.ready.length,0);assert.equal(h.preview.proposal(),null);assert.deepEqual(h.current.draft,before);assert.equal(h.current.media[0],media);
 assert.deepEqual(h.errors,[]);assert.match(messages.at(-1),/選定版本已變更，請重新預覽/);assert.equal(backupRefreshes,1);
});
