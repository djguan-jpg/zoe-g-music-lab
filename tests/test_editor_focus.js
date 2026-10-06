// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const P=require('../web/editor-focus.js'),D=require('../web/editor-focus-dom.js');
const source=ids=>({ids,visible:true,busy:false});

function incompleteIds(kind){
 if(kind==='only')return new Array(1);
 if(kind==='first')return [, 'b'];
 if(kind==='middle')return ['a',,'b'];
 if(kind==='last')return ['a','b',,];
 if(kind==='deleted'){const ids=['a','b'];delete ids[0];return ids;}
 const ids=new Array(2),prototype=Object.create(Array.prototype);prototype[0]='ancestor';Object.setPrototypeOf(ids,prototype);ids[1]='b';return ids;
}

test('focus metadata rejects every missing or inherited position before either locator can create a target',()=>{
 for(const list of Object.keys(P.limits))for(const kind of ['only','first','middle','last','deleted','inherited']){
  const s=source(incompleteIds(kind));assert.throws(()=>P.checkedSource(list,s));assert.throws(()=>P.proposal(list,s,0));assert.throws(()=>P.byId(list,s,'b'));
  for(const flags of [{visible:false},{busy:true}])assert.throws(()=>P.checkedSource(list,{...s,...flags}));
 }
});

test('focus copies actual own IDs without calling caller map or iterator hooks',()=>{
 for(const list of Object.keys(P.limits)){
  const ids=['a','b'];let hooks=0;ids.map=()=>{hooks++;return ['injected','b'];};ids[Symbol.iterator]=()=>{hooks++;throw Error('caller iterator');};
  const checked=P.checkedSource(list,source(ids));assert.deepEqual(checked,source(['a','b']));assert.equal(hooks,0);assert.notEqual(checked.ids,ids);
  assert.deepEqual(P.proposal(list,source(ids),0),{list,id:'a',mode:'entry'});assert.deepEqual(P.byId(list,source(ids),'b'),{list,id:'b',mode:'entry'});assert.equal(hooks,0);
  ids[0]='later';assert.deepEqual(checked.ids,['a','b']);
 }
});

test('invalid first or second ID capture cannot invoke focus and good bad good requests keep working',()=>{
 for(const list of Object.keys(P.limits))for(const entry of ['focus','focusId']){
  for(const malformedAt of [1,2]){
   let reads=0,writes=0,errors=0;const c=P.createController({capture:()=>source(++reads===malformedAt?incompleteIds('first'):['a','b']),focusTarget:()=>{writes++;return true;},onError:()=>errors++});
   assert.equal(entry==='focus'?c.focus(list,1):c.focusId(list,'b'),false);assert.equal(writes,0);assert.equal(errors,1);assert.equal(reads,malformedAt);
  }
  let bad=false,writes=0;const c=P.createController({capture:()=>source(bad?incompleteIds('first'):['a','b']),focusTarget:target=>{assert.equal(target.id,'b');writes++;return true;}});
  const call=()=>entry==='focus'?c.focus(list,1):c.focusId(list,'b');assert.equal(call(),true);bad=true;assert.equal(call(),false);bad=false;assert.equal(call(),true);assert.equal(writes,2);
 }
});

test('bounded ID capture rejects changed length or oversized sources without traversing caller hooks',()=>{
 const ids=['a'];Object.defineProperty(ids,0,{get(){ids.push('later');return 'a';},configurable:true});assert.throws(()=>P.checkedSource('cues',source(ids)));assert.equal(ids.length,2);
 for(const [list,limit] of Object.entries(P.limits)){
  const ids=new Array(limit+1);Object.defineProperty(ids,0,{get(){assert.fail('capacity should reject before values');}});assert.throws(()=>P.checkedSource(list,source(ids)));
 }
});
test('empty collections return their add target and existing rows retain their stable ID and requested mode',()=>{
 for(const list of Object.keys(P.limits)){
  assert.deepEqual(P.proposal(list,source([]),0),{list,id:null,mode:'add'});
  assert.deepEqual(P.proposal(list,source(['first','last']),1,'new'),{list,id:'last',mode:'new'});
  assert.deepEqual(P.proposal(list,source(['first','last']),0),{list,id:'first',mode:'entry'});
 }
});
test('focus metadata rejects unknown fields, lists, duplicate IDs, oversized collections and unsafe requests',()=>{
 for(const bad of [{...source([]),other:1},source(['a','a']),source(['']),source(['x'.repeat(65)]),{ids:[],visible:1,busy:false}])assert.throws(()=>P.proposal('cues',bad,0));
 for(const index of [-1,1.5,NaN,Infinity,Number.MAX_SAFE_INTEGER+1])assert.throws(()=>P.proposal('cues',source(['a']),index));
 assert.throws(()=>P.proposal('cues',source([]),1));assert.throws(()=>P.proposal('cues',source(['a']),1));assert.throws(()=>P.proposal('cues',source(['a']),0,'selector'));
 for(const list of ['__proto__','constructor','other'])assert.throws(()=>P.proposal(list,source([]),0));
 for(const [list,limit] of Object.entries(P.limits)){assert.doesNotThrow(()=>P.proposal(list,source(Array.from({length:limit},(_,i)=>'r'+i)),limit-1));assert.throws(()=>P.proposal(list,source(Array.from({length:limit+1},(_,i)=>'r'+i)),0));}
});
test('metadata copies its IDs and does not include values, drafts, media or playback effects',()=>{
 const raw=source(['a']),checked=P.checkedSource('cues',raw);raw.ids[0]='b';assert.deepEqual(checked,source(['a']));assert.deepEqual(Object.keys(checked).sort(),['busy','ids','visible']);
});
test('hidden and busy sources never invoke focus and unknown lists never read DOM metadata',()=>{
 let reads=0,effects=0,errors=0,s=source(['a']);const c=P.createController({capture:()=>{reads++;return s},focusTarget:()=>{effects++;return true},onError:()=>errors++});
 s.visible=false;assert.equal(c.focus('cues',0),false);s.visible=true;s.busy=true;assert.equal(c.focus('cues',0),false);
 assert.equal(c.focus('other',0),false);assert.equal(reads,2);assert.equal(effects,0);assert.equal(errors,1);
});
test('second capture refuses reordered, replaced, deleted or newly blocked targets before focus',()=>{
 for(const after of [source(['b','a']),source(['a','new']),source(['a']),source([]),{...source(['a','b']),visible:false},{...source(['a','b']),busy:true}]){
  let reads=0,effects=0;const c=P.createController({capture:()=>++reads===1?source(['a','b']):after,focusTarget:()=>{effects++;return true}});
  assert.equal(c.focus('cues',1),false);assert.equal(effects,0);
 }
 let reads=0;const c=P.createController({capture:()=>++reads===1?source([]):source(['a']),focusTarget:()=>assert.fail('stale empty target')});assert.equal(c.focus('cues',0),false);
});
test('only confirmed focus returns true and dispose removes future reads or effects',()=>{
 let reads=0,effects=0,success=false;const c=P.createController({capture:()=>{reads++;return source(['a'])},focusTarget:target=>{assert.equal(target.id,'a');effects++;return success}});
 assert.equal(c.focus('cues',0),false);success=true;assert.equal(c.focus('cues',0),true);c.dispose();assert.equal(c.focus('cues',0),false);assert.equal(reads,4);assert.equal(effects,2);
});
function harness(list,ids){
 const document={activeElement:null,getElementById:id=>nodes[id]};
 function node(id){return {id,isConnected:true,hidden:false,disabled:false,focus(){document.activeElement=this},contains(target){return target===this||Object.values(this.targets||{}).includes(target)},children:[]};}
 const panel=list==='cues'?'lyrics':['motifs','shots'].includes(list)?'storyboard':'music';
 const add={arrangement:'section-add','music-avoid':'avoid-add','music-deliverables':'deliverable-add',motifs:'motif-add',shots:'shot-add',cues:'cue-add'}[list];
 const nodes={[panel]:node(panel),[list]:node(list),[add]:node(add)};nodes[panel].contains=target=>target===nodes[add];
 for(const id of ids){const row=node(id),first=node(id+'-first'),text=node(id+'-text'),summary=node(id+'-summary'),motif=node(id+'-motif'),details={open:false};row.dataset={historyId:id};row.targets={first,text,summary,motif};row.details=details;row.querySelector=selector=>({'input,textarea':first,'.lyric-field':text,summary,'[data-key="motif_id"]':motif,details})[selector]||null;nodes[list].children.push(row);}
 let busy=false;return {nodes,document,list,panel,add,setBusy:value=>busy=value,c:D.createAdapter(document,{busy:()=>busy})};
}
test('all six empty DOM collections focus their own add button without writing editor values',()=>{
 for(const list of Object.keys(P.limits)){const h=harness(list,[]);assert.equal(h.c.focus(list,0),true);assert.equal(h.document.activeElement,h.nodes[h.add]);}
});
test('new cues focus text, new shots open details and focus motif, restored shots focus their summary',()=>{
 for(const list of Object.keys(P.limits)){const h=harness(list,['one','two']),row=h.nodes[list].children[1];assert.equal(h.c.focus(list,1,'new'),true);assert.equal(h.document.activeElement,list==='cues'?row.targets.text:list==='shots'?row.targets.motif:row.targets.first);if(list==='shots'){assert.equal(row.details.open,true);row.details.open=false;assert.equal(h.c.focus(list,1),true);assert.equal(row.details.open,true);assert.equal(h.document.activeElement,row.targets.summary);}}
});
test('DOM adapter refuses missing, detached, disabled or hidden targets and unconfirmed native focus',()=>{
 for(const mutation of [h=>h.nodes.cues.children[0].targets.text.isConnected=false,h=>h.nodes.cues.children[0].targets.text.disabled=true,h=>h.nodes.cues.children[0].targets.text.hidden=true,h=>h.nodes.cues.children[0].querySelector=()=>null,h=>h.nodes.lyrics.hidden=true,h=>h.nodes.lyrics.isConnected=false,h=>h.setBusy(true),h=>h.nodes.cues.children[0].targets.text.focus=()=>{}]){const h=harness('cues',['one']);mutation(h);assert.equal(h.c.focus('cues',0,'new'),false);assert.equal(h.document.activeElement,null);}
 const h=harness('cues',[]);h.nodes[h.add].disabled=true;assert.equal(h.c.focus('cues',0),false);
});
test('actual cue-add adapter retains default times and existing raw rows, then explicitly focuses new text',()=>{
 const fs=require('node:fs'),vm=require('node:vm'),app=fs.readFileSync('web/app.js','utf8'),a=app.indexOf("$('cue-add').onclick="),b=app.indexOf('function lyricsBuildSource()',a),button={},events=[],rows=[{id:'original',value:{start:'00.1000',end:'2.0000',text:'原\r\n字 🎵'}}];
 const context={state:{busy:false},$:()=>button,entriesFor:()=>structuredClone(rows),rowSequence:2,LyricTime:require('../musiclab/assets/lyric-time.js'),writeEntries:(list,value)=>events.push({list,value}),markDirty:scope=>events.push(scope),focusEntry:(...args)=>events.push(args),say:message=>events.push(message)};
 vm.runInNewContext(app.slice(a,b),context);button.onclick();assert.equal(events[0].value[0].value.text,'原\r\n字 🎵');assert.deepEqual(JSON.parse(JSON.stringify(events[0].value[1].value)),{start:'2',end:'5',text:''});assert.deepEqual(events[2],['cues',1,'new']);assert.equal(rows.length,1);
});
test('actual deletion of the final row requests index zero fallback and keeps its restorable history',()=>{
 const fs=require('node:fs'),vm=require('node:vm'),app=fs.readFileSync('web/app.js','utf8'),a=app.indexOf('function deleteEntry('),b=app.indexOf('function undoDeletion(',a),rows=[{id:'last',value:{start:'0',end:'3',text:'原句'}}],events=[];
 const context={state:{busy:false},collections:{cues:{scope:'lyrics',label:'歌詞句'}},entriesFor:()=>structuredClone(rows),MusicHistory:require('../web/deletion-history.js'),writeEntries:(list,value)=>events.push(['write',list,value]),deletionHistory:{push:(scope,record)=>events.push(['history',scope,record.entry.id])},refreshDeletionHistory:()=>{},markDirty:()=>{},focusEntry:(...args)=>events.push(['focus',...args]),say:()=>{}};
 vm.runInNewContext(app.slice(a,b),context);context.deleteEntry('cues',0);assert.deepEqual(events[2],['focus','cues',0]);assert.deepEqual(events[1],['history','lyrics','last']);assert.equal(events[0][2].length,0);
});
test('workbench loads fixed modules before app and HTTP static assets have no new operations',()=>{
 const fs=require('node:fs'),html=fs.readFileSync('web/index.html','utf8'),server=fs.readFileSync('music_lab_server.py','utf8');
 for(const name of ['editor-focus.js','editor-focus-dom.js']){assert.ok(html.indexOf('/'+name)<html.indexOf('/app.js'));assert.match(server,new RegExp('"/'+name.replace('.','\\.')+'": \\(\"web/'+name.replace('.','\\.')));}
});

test('ID focus locates the exact identity in any current position and has no empty add fallback',()=>{
 for(const list of Object.keys(P.limits))for(const ids of [['a','b','c'],['c','a','b']])assert.deepEqual(P.byId(list,source(ids),'b'),{list,id:'b',mode:'entry'});
 for(const id of ['',null,1,'a'.repeat(65),'gone'])assert.throws(()=>P.byId('arrangement',source(['a']),id));assert.throws(()=>P.byId('arrangement',source([]),'a'));assert.throws(()=>P.byId('arrangement',source(['a']),'a','unknown'));
 assert.equal(P.byId('arrangement',{...source(['a']),busy:true},'a'),null);assert.equal(P.byId('arrangement',{...source(['a']),visible:false},'a'),null);
});
test('ID focus refuses source replacement or reordering before native focus and keeps the original index API',()=>{
 for(const after of [source(['b','a']),source(['a','new']),source(['a']),{...source(['a','b']),busy:true}]){let reads=0,effects=0;const c=P.createController({capture:()=>++reads===1?source(['a','b']):after,focusTarget:()=>{effects++;return true;}});assert.equal(c.focusId('arrangement','b'),false);assert.equal(effects,0);}
 let reads=0;const c=P.createController({capture:()=>{reads++;return source(['a']);},focusTarget:()=>true});assert.equal(c.focusId('unknown','a'),false);assert.equal(reads,0);assert.equal(c.focusId('arrangement','gone'),false);assert.equal(reads,1);assert.equal(c.focusId('arrangement','a'),true);assert.equal(reads,3);assert.equal(c.focus('arrangement',0),true);c.dispose();assert.equal(c.focusId('arrangement','a'),false);assert.equal(reads,5);
});
test('ID DOM focus follows reordered native identities and refuses a missing or disabled target',()=>{
 const h=harness('arrangement',['a','b','c']);h.nodes.arrangement.children.reverse();assert.equal(h.c.focusId('arrangement','a'),true);assert.equal(h.document.activeElement,h.nodes.arrangement.children[2].targets.first);h.document.activeElement=null;h.nodes.arrangement.children[0].targets.first.disabled=true;assert.equal(h.c.focusId('arrangement','c'),false);assert.equal(h.c.focusId('arrangement','missing'),false);assert.equal(h.document.activeElement,null);
});
