// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const L=require('../web/library-result.js'),D=require('../web/library-revision.js'),R=require('../web/library-receipt.js'),E=require('../web/editor-state.js');
const V=require('../musiclab/assets/delivery-versions.js'),F=require('./library_revision_fixture.js'),P=require('./planning_report_fixture.js');
const {createLibraryController}=require('../web/draft-library.js');
const later=()=>{let resolve,reject;const promise=new Promise((a,b)=>{resolve=a;reject=b;});return {promise,resolve,reject};};
const record=n=>F.revision(n).entry;
const listing=(entries=[],next_cursor=null,issues=[])=>({entries,next_cursor,issues,status:'metadata_only_checksum_verified_on_read'});
const payload=(limit=20,cursor=null)=>({limit,cursor});
const wire=(action,data)=>({files:{},data,meta:{version:V.current,protocol_version:1,needs_review:action!=='list'}});
function appConfig(api,entries=[]){
 const source=fs.readFileSync('web/app.js','utf8'),start=source.indexOf('const libraryController='),end=source.indexOf('\nasync function refreshLibrary',start);
 let options;const context={MusicLibrary:{createLibraryController:x=>(options=x)},MusicLibraryResult:L,MusicLibraryReceipt:R,MusicLibraryRevision:D,MusicEditor:E,libraryPreview:null,api,
 libraryRecords:entries,captureDraft:()=>P.draft(),checkedLibrarySelection:()=>{},crypto:{randomUUID:()=> '1'.repeat(32)}};
 vm.createContext(context);vm.runInContext(source.slice(start,end),context);return {options,context};
}
test('all three library HTTP envelopes enforce current product protocol empty files and operation review flag',()=>{
 for(const action of ['save','list','read']){
  const original=wire(action,{value:'原值'});assert.deepEqual(L.checkedEnvelope(action,original),original.data);
  for(const mutate of [r=>r.extra=1,r=>delete r.meta,r=>r.files={'other.json':'x'},r=>r.meta.extra=true,r=>r.meta.version='0.8.0',r=>r.meta.protocol_version=2,r=>r.meta.protocol_version=true,r=>r.meta.needs_review=!r.meta.needs_review]){
   const bad=structuredClone(original);mutate(bad);assert.throws(()=>L.checkedEnvelope(action,bad));
  }
 }
 for(const action of ['other',null,{},'read\n'])assert.throws(()=>L.checkedEnvelope(action,wire('read',{})));
});
test('shared metadata is isolated codepoint bounded and keeps historical producer and literal text',()=>{
 const r=F.revision('1','🎵'.repeat(119)+'甲尾\r\n'),e=r.entry;e.label=' 原案🎵\r\n';e.created_with='0.8.0';const before=structuredClone(e);
 const checked=D.checkedMetadata(e.id,e);checked.label='changed';checked.titles.music='changed';assert.deepEqual(e,before);
 assert.equal(D.checkedEntry(e.id,e,r.draft).titles.music,'🎵'.repeat(119)+'甲');
 for(const mutate of [v=>v.id+='\n',v=>v.sha256+='\n',v=>v.stored_at+='\n',v=>v.titles.music='x'.repeat(121),v=>v.titles.music=null,v=>v.titles.lyrics='\ud800',v=>v.library_schema_version=2]){
  const bad=structuredClone(e);mutate(bad);assert.throws(()=>D.checkedMetadata(bad.id,bad));
 }
});
test('empty library metadata and pages preserve all raw fields and unreadable IDs without touching drafts',()=>{
 assert.deepEqual(L.checkedList(payload(),listing()),listing());
 const raw=listing([record('3'),record('2')],record('2').id,[{id:record('1').id,error:'unreadable_revision'}]),before=structuredClone(raw);
 const checked=L.checkedList(payload(2),raw);assert.deepEqual(checked,raw);checked.entries[0].titles.music='changed';checked.issues[0].error='changed';assert.deepEqual(raw,before);
});
test('complete page shape counts metadata schemas duplicate entries and issue intersections are rejected',()=>{
 const good=listing([record('3'),record('2')],record('2').id,[{id:record('1').id,error:'unreadable_revision'}]);
 for(const mutate of [v=>v.extra=1,v=>v.status='complete',v=>v.entries.push(record('1')),v=>v.entries[0].library_schema_version=2,v=>v.entries[0].id='bad',v=>v.entries[1]=v.entries[0],v=>v.issues.push(v.issues[0]),v=>v.issues[0].id=v.entries[0].id,v=>v.issues[0].error='private path',v=>v.issues[0].extra=1,v=>v.issues[0].id+='\n',v=>v.entries=null,v=>v.issues=null]){
  const bad=structuredClone(good);mutate(bad);assert.throws(()=>L.checkedList(payload(2),bad));
 }
 const tooMany=Array.from({length:1001},(_,i)=>({id:'draft-'+i.toString(16).padStart(32,'0'),error:'unreadable_revision'}));assert.throws(()=>L.checkedList(payload(),listing([],null,tooMany)));
});
test('pagination uses exact original UTC string and ID descending order',()=>{
 const first=record('3'),second=record('2');assert.deepEqual(L.checkedList(payload(2),listing([first,second],second.id)).entries,[first,second]);
 assert.throws(()=>L.checkedList(payload(),listing([second,first])));
 const a=record('1'),b=record('2');a.stored_at='2026-10-05T01:02:03Z';b.stored_at='2026-10-05T01:02:03.999999+00:00';
 assert(Date.parse(a.stored_at)<Date.parse(b.stored_at));assert.deepEqual(L.checkedList(payload(),listing([a,b])).entries,[a,b]);
 assert.throws(()=>L.checkedList(payload(),listing([b,a])));
});
test('next cursor must be the full page final ID and continuation must be older than its pinned metadata',()=>{
 const after=record('3'),entries=[record('2'),record('1')],good=listing(entries);
 assert.deepEqual(L.checkedList(payload(2,after.id),good,after),good);
 for(const bad of [listing(entries,after.id),listing(entries,entries[0].id),listing([entries[0]],entries[0].id),listing([],after.id),listing([after]),listing([record('4')])])assert.throws(()=>L.checkedList(payload(2,after.id),bad,after));
 assert.throws(()=>L.checkedList(payload(2,after.id),good));assert.throws(()=>L.checkedList(payload(2,after.id),good,record('4')));
});
test('list request bounds reject unknown fields types invalid cursor IDs and unknown page properties',()=>{
 for(const bad of [{limit:0,cursor:null},{limit:101,cursor:null},{limit:true,cursor:null},{limit:20},{limit:20,cursor:'x'},{limit:20,cursor:record('3').id+'\n'},{limit:20,cursor:null,path:'x'}])assert.throws(()=>L.checkedList(bad,listing()));
 assert.throws(()=>L.checkedList(payload(),{entries:[],next_cursor:null,issues:[]}));
 assert.deepEqual(L.checkedList(payload(100),listing()),listing());
});
test('actual app request and save readback adapters refuse wrong HTTP envelopes before handing off data',async()=>{
 const selected=F.revision(),ack={entry:selected.entry,reused:false,status:'draft_only_not_validated'};let reply;
 const h=appConfig(async()=>reply);
 for(const action of ['save','read','list']){reply=wire(action,action==='list'?listing([selected.entry]):action==='save'?ack:selected);reply.meta.version='99.0.0';await assert.rejects(()=>h.options.request(action,{}));}
 reply=wire('read',selected);reply.meta.protocol_version=2;
 await assert.rejects(()=>h.options.confirmSave({id:selected.entry.id,label:selected.entry.label,draft:selected.draft},ack));
 reply=wire('read',selected);assert.deepEqual(await h.options.confirmSave({id:selected.entry.id,label:selected.entry.label,draft:selected.draft},ack),ack);
});
test('actual app list check pins the requested cursor to the current saved metadata',()=>{
 const after=record('3'),h=appConfig(()=>{},[after]);assert.deepEqual(h.options.checkList(payload(2,after.id),listing([record('2')])),listing([record('2')]));
 h.context.libraryRecords=[];assert.throws(()=>h.options.checkList(payload(2,after.id),listing([record('2')])));
});
function controllerHarness(){
 const current={draft:P.draft(),media:{name:'kept.wav'}},calls=[],errors=[],checked=[],saved=[],ready=[];let records=[],cursor=null;
 const c=createLibraryController({capture:()=>current.draft,validate:E.validateDraft,newId:()=>record('1').id,
  request:(action,payload)=>{const call={action,payload,...later()};calls.push(call);return call.promise.then(r=>L.checkedEnvelope(action,r));},
  confirmSave:async(p,r)=>R.checkedAck(p,r,E.validateDraft),checkRead:D.checkedRead,
  checkList:(p,r)=>{checked.push(p);return L.checkedList(p,r,p.cursor===null?null:records.find(e=>e.id===p.cursor));},
  onSaved:r=>saved.push(r),onReady:r=>ready.push(r),onList:(r,append)=>{records=append?[...records,...r.entries]:r.entries;cursor=r.next_cursor;},onError:e=>errors.push(e.message),onPending:()=>{}});
 return {c,current,calls,errors,checked,saved,ready,records:()=>records,cursor:()=>cursor};
}
test('current malformed list keeps the prior page cursor media and editable draft and healthy retry works',async()=>{
 const h=controllerHarness(),first=h.c.list();h.calls[0].resolve(wire('list',listing([record('3')])));assert.equal(await first,true);
 const before=structuredClone(h.current),bad=h.c.list();h.calls[1].resolve(wire('list',listing([record('2'),record('2')])));assert.equal(await bad,false);
 assert.deepEqual(h.records(),[record('3')]);assert.deepEqual(h.current,before);assert.equal(h.errors.length,1);
 const retry=h.c.list();h.calls[2].resolve(wire('list',listing([record('2')])));assert.equal(await retry,true);assert.deepEqual(h.records(),[record('2')]);
});
test('latest list token is checked before pure page validation and late success error cancel do not publish',async()=>{
 const h=controllerHarness(),older=h.c.list(),fresh=h.c.list();h.calls[1].resolve(wire('list',listing([record('3')])));await fresh;
 h.calls[0].resolve(wire('list',{bad:true}));assert.equal(await older,false);assert.equal(h.checked.length,1);assert.equal(h.errors.length,0);
 const canceled=h.c.list();h.c.cancel();h.calls[2].reject(Error('late read failure'));await canceled;assert.equal(h.errors.length,0);assert.deepEqual(h.records(),[record('3')]);
});
test('wrong save envelope preserves identical pending ID and click-time content for explicit retry',async()=>{
 const h=controllerHarness(),first=h.c.save('原案'),p=structuredClone(h.calls[0].payload),r=F.revision('1','');r.draft=p.draft;r.entry.titles.music='';r.entry.label=p.label;
 const ack=wire('save',{entry:r.entry,reused:false,status:'draft_only_not_validated'});ack.meta.version='99.0.0';h.current.draft.panels.music.fields['music-title']='後續編修';h.calls[0].resolve(ack);assert.equal(await first,false);
 assert.deepEqual(h.c.pending(),p);assert.equal(h.saved.length,0);const retry=h.c.retry();assert.deepEqual(h.calls[1].payload,p);
 h.calls[1].resolve(wire('save',{entry:r.entry,reused:true,status:'draft_only_not_validated'}));assert.equal(await retry,true);assert.equal(h.saved[0].changed,true);assert.equal(h.current.media.name,'kept.wav');
});
test('wrong read envelope never publishes a saved preview and healthy read retry retains media',async()=>{
 const h=controllerHarness(),r=F.revision(),first=h.c.read(r.entry.id,r.entry),bad=wire('read',r);bad.files={'other.json':'unrelated'};h.calls[0].resolve(bad);assert.equal(await first,false);assert.equal(h.ready.length,0);
 const retry=h.c.read(r.entry.id,r.entry);h.calls[1].resolve(wire('read',r));assert.equal(await retry,true);assert.deepEqual(h.ready[0],{entry:r.entry,draft:r.draft});assert.equal(h.current.media.name,'kept.wav');
});
test('library list validation is a required injected boundary alongside save and read checks',()=>{
 assert.throws(()=>createLibraryController({confirmSave:()=>{},checkRead:()=>{}}),/保存清單來源核對未設定/);
});
