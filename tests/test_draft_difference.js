// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const {createCheckpoint,createGuard}=require('../web/draft-retention.js'),Difference=require('../web/draft-difference.js');
const panels=['music','storyboard','lyrics','audio'];
const draft=()=>({panels:Object.fromEntries(panels.map(name=>[name,{fields:{title:name},rows:[],list:[' 原文🎵 ','第二行\n保留']}]))});
const change=(value,name,text)=>{const copy=structuredClone(value);copy.panels[name].fields.title=text;return copy;};
const none={reference:null,panels:[]};
test('loading, initial and metadata-only edits have no panel differences',()=>{
 const c=createCheckpoint(),value=draft();assert.deepEqual(c.status().difference,none);
 assert.deepEqual(c.initialize(value).difference,none);value.tab='lyrics';value.saved_at='different';
 assert.deepEqual(c.refresh(value).difference,none);assert.equal(Difference.describe(none),'');
});
test('each of four panels reports real whitespace edits, not its full source',()=>{
 const c=createCheckpoint(),value=draft();c.initialize(value);
 for(const name of panels){const state=c.refresh(change(value,name,name+' '));assert.equal(state.dirty,true);assert.deepEqual(state.difference,{reference:'initial',panels:[name]});assert.equal(JSON.stringify(state.difference).includes('原文'),false);}
});
test('list order and new empty rows are changes and exact restoration clears them',()=>{
 const c=createCheckpoint(),value=draft();c.initialize(value);const edited=structuredClone(value);edited.panels.lyrics.list.reverse();edited.panels.storyboard.rows.push({});
 assert.deepEqual(c.refresh(edited).difference,{reference:'initial',panels:['storyboard','lyrics']});assert.deepEqual(c.refresh(value).difference,none);
});
test('file, library and confirmed download use a complete confirmed reference',()=>{
 for(const kind of ['file','library','download']){const c=createCheckpoint(),value=draft(),saved=change(value,'music','saved');c.initialize(value);c.refresh(saved);
  if(kind==='download'){c.requestDownload(saved);c.confirmDownload();}else c.retain(saved,{kind});
  assert.deepEqual(c.status().difference,none);const next=change(saved,'lyrics','later');assert.deepEqual(c.refresh(next).difference,{reference:kind,panels:['lyrics']});
 }
});
test('pending download cannot replace a confirmed reference',()=>{
 const c=createCheckpoint(),initial=draft(),saved=change(initial,'music','confirmed'),pending=change(saved,'lyrics','pending');c.initialize(initial);c.retain(saved,{kind:'file'});c.refresh(pending);c.requestDownload(pending);
 assert.equal(c.status().mode,'download_unconfirmed');assert.deepEqual(c.status().difference,{reference:'file',panels:['lyrics']});
});
test('confirming the submitted snapshot preserves later edits and then changes the diagnostic reference',()=>{
 const c=createCheckpoint(),initial=draft(),sent=change(initial,'music','sent'),later=change(sent,'audio','later');c.initialize(initial);c.refresh(sent);c.requestDownload(sent);c.refresh(later);c.confirmDownload();
 assert.equal(c.status().dirty,true);assert.deepEqual(c.status().difference,{reference:'download',panels:['audio']});assert.deepEqual(c.refresh(sent).difference,none);
});
test('an older exact complete checkpoint and initial content clear diagnostics despite a different latest reference',()=>{
 const c=createCheckpoint(),initial=draft(),a=change(initial,'music','A'),b=change(initial,'lyrics','B');c.initialize(initial);c.retain(a,{kind:'file'});c.retain(b,{kind:'library'});
 assert.equal(c.refresh(a).mode,'file');assert.deepEqual(c.status().difference,none);assert.equal(c.refresh(initial).mode,'initial');assert.deepEqual(c.status().difference,none);
});
test('mixing panels from two retained versions stays dirty against one latest complete reference',()=>{
 const c=createCheckpoint(),initial=draft(),a=change(initial,'music','A'),b=change(initial,'lyrics','B');c.initialize(initial);c.retain(a,{kind:'file'});c.retain(b,{kind:'library'});const mix=change(b,'music','A');
 assert.equal(c.refresh(mix).dirty,true);assert.deepEqual(c.status().difference,{reference:'library',panels:['music']});
});
test('the newest confirmation event wins and replacing one kind does not retain older versions',()=>{
 const c=createCheckpoint(),initial=draft(),a=change(initial,'music','A'),b=change(initial,'music','B');c.initialize(initial);a.saved_at='future';b.saved_at='past';c.retain(a,{kind:'file'});c.retain(b,{kind:'file'});
 assert.deepEqual(c.refresh(a).difference,{reference:'file',panels:['music']});c.requestDownload(a);c.retain(b,{kind:'library'});c.confirmDownload();
 const other=change(a,'audio','C');assert.deepEqual(c.refresh(other).difference,{reference:'download',panels:['audio']});
});
test('caller mutations of a difference DTO cannot corrupt checkpoint state',()=>{
 const c=createCheckpoint(),initial=draft();c.initialize(initial);c.refresh(change(initial,'music','edited'));const value=c.status();value.difference.reference='pretend';value.difference.panels.push('lyrics');value.difference.panels[0]='audio';
 assert.deepEqual(c.status().difference,{reference:'initial',panels:['music']});assert.deepEqual(Reflect.ownKeys(c.status().difference),['reference','panels']);
});
test('scoped guard emits only the changed panel while beforeunload still rechecks all content',()=>{
 let current=draft(),full=0;const scopes=[],listeners=new Set(),states=[];
 const guard=createGuard({capture:()=>{full++;return current;},capturePanel:name=>{scopes.push(name);return current.panels[name];},events:{addEventListener:(name,fn)=>{assert.equal(name,'beforeunload');listeners.add(fn);},removeEventListener:(name,fn)=>listeners.delete(fn)},onState:value=>states.push(value)});
 guard.initialize(current);current=change(current,'lyrics','edit');guard.refresh('lyrics');assert.equal(full,0);assert.deepEqual(scopes,['lyrics']);assert.deepEqual(states.at(-1).difference,{reference:'initial',panels:['lyrics']});assert.equal(listeners.size,1);
 current=draft();let prevented=false;[...listeners][0]({preventDefault:()=>prevented=true});assert.equal(full,1);assert.equal(prevented,false);guard.refresh();assert.equal(listeners.size,0);guard.dispose();
});
test('formatter uses fixed canonical labels and exact known reference names',()=>{
 const labels={initial:'起始範例',file:'最近確認的載入檔案',library:'最近確認的保存版本',download:'最近確認的下載草稿'};
 for(const [reference,label] of Object.entries(labels))assert.equal(Difference.describe({reference,panels:['audio','lyrics','storyboard','music']}),'相對'+label+'有變更：歌曲設計、母題分鏡、波形校時、交付檢查。目前整份草稿仍需另存。');
});
test('unknown, duplicate, empty-reference and malformed DTO values refuse',()=>{
 const cases=[null,[],{}, {reference:'initial',panels:[]},{reference:null,panels:['music']},{reference:'unknown',panels:['music']},{reference:'initial',panels:['unknown']},{reference:'initial',panels:['music','music']},{reference:'initial',panels:'music'},{reference:'initial',panels:new Array(1)},{reference:'initial',panels:['music'],source:'private'}, {reference:'initial',panels:['music','storyboard','lyrics','audio','extra']}];
 for(const value of cases)assert.throws(()=>Difference.describe(value));
 const hidden={reference:'initial',panels:['music']};Object.defineProperty(hidden,'private',{value:1});assert.throws(()=>Difference.describe(hidden));
 const symbol={reference:'initial',panels:['music'],[Symbol('private')]:1};assert.throws(()=>Difference.describe(symbol));
 const extra=['music'];extra.note='extra';assert.throws(()=>Difference.describe({reference:'initial',panels:extra}));
});
test('formatter refuses accessors before reading them and accepts frozen isolated data',()=>{
 let reads=0;const value={panels:['music']};Object.defineProperty(value,'reference',{enumerable:true,get(){reads++;return 'initial';}});assert.throws(()=>Difference.describe(value));
 const list=[];Object.defineProperty(list,'0',{enumerable:true,get(){reads++;return 'music';}});assert.throws(()=>Difference.describe({reference:'initial',panels:list}));assert.equal(reads,0);
 assert.match(Difference.describe(Object.freeze({reference:'initial',panels:Object.freeze(['music'])})),/歌曲設計/);
});
test('production renderer shows literal panel labels and clears the diagnostic without editing inputs',()=>{
 const source=fs.readFileSync(require.resolve('../web/app.js'),'utf8'),start=source.indexOf('function renderRetention('),end=source.indexOf('\nfunction capturePanel(',start);
 const nodes={'draft-retention-note':{textContent:'',dataset:{}},'draft-retention-difference':{textContent:'',hidden:true},'draft-confirm-download':{hidden:true},'music-title':{value:'原文<literal>🎵'}};
 const context={$:id=>{assert.ok(Object.hasOwn(nodes,id));return nodes[id];},MusicDraftDifference:Difference};vm.runInNewContext(source.slice(start,end)+'\nthis.render=renderRetention;',context);
 context.render({mode:'changed_after_download',dirty:true,pendingDownload:true,difference:{reference:'download',panels:['audio','music']}});assert.equal(nodes['draft-retention-note'].dataset.dirty,'true');assert.equal(nodes['draft-confirm-download'].hidden,false);assert.match(nodes['draft-retention-difference'].textContent,/歌曲設計、交付檢查/);assert.equal(nodes['draft-retention-difference'].hidden,false);
 context.render({mode:'initial',dirty:false,pendingDownload:false,difference:none});assert.equal(nodes['draft-retention-difference'].textContent,'');assert.equal(nodes['draft-retention-difference'].hidden,true);assert.equal(nodes['music-title'].value,'原文<literal>🎵');
});
test('fixed difference asset loads before the app and diagnostics do not enter serialized drafts',()=>{
 const html=fs.readFileSync(require.resolve('../web/index.html'),'utf8');assert.ok(html.indexOf('/draft-retention.js')<html.indexOf('/draft-difference.js'));assert.ok(html.indexOf('/draft-difference.js')<html.indexOf('/app.js'));assert.match(html,/<p id="draft-retention-difference" class="hint" hidden>/);
 const value=draft(),before=JSON.stringify(value),c=createCheckpoint();c.initialize(value);c.refresh(change(value,'music','new'));c.status();assert.equal(JSON.stringify(value),before);
});
