// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),crypto=require('node:crypto'),fs=require('node:fs');
const K=require('../web/search-input.js');
const normal={key:'Enter',isComposing:false,keyCode:13};
test('Enter search ignores modern composition and legacy IME boundary events',()=>{
 for(const keyCode of [0,13,0xffffffff])assert.equal(K.shouldFind({...normal,keyCode}),true);
 for(const v of [{...normal,isComposing:true},{...normal,keyCode:229},{...normal,keyCode:229,isComposing:true},{...normal,key:'Process'},{...normal,key:'Escape'},{...normal,key:'記憶點🎵'}])assert.equal(K.shouldFind(v),false);
});
test('unknown keyboard metadata cannot launch search and is not repaired or mutated',()=>{
 for(const v of [null,[],{},normal.key,{...normal,extra:1},{...normal,isComposing:0},{...normal,isComposing:'false'},{...normal,keyCode:'13'},{...normal,keyCode:NaN},{...normal,keyCode:Infinity},{...normal,keyCode:-1},{...normal,keyCode:13.5},{...normal,keyCode:0x100000000}]){const before=structuredClone(v);assert.equal(K.shouldFind(v),false);assert.deepEqual(v,before);}
});
test('keyboard policy has no event side effects and supports frozen snapshots',()=>{const value=Object.freeze({...normal});assert.equal(K.shouldFind(value),true);assert.deepEqual(value,normal);assert.deepEqual(Object.keys(K),['shouldFind']);});
function node(tag){let own='';return {tag,children:[],isConnected:true,disabled:false,hidden:false,value:'',append(c){this.children.push(c);},replaceChildren(...cs){own='';this.children=cs;},get textContent(){return own+this.children.map(c=>c.textContent).join('');},set textContent(v){own=v;this.children=[];}};}
const tick=()=>new Promise(resolve=>setImmediate(resolve));
function fixture(kind){
 const M=require('../musiclab/assets/'+kind+'-search.js'),D=require('../web/'+kind+'-search-dom.js'),nodes=new Map(),reports=[],requests=[];
 const state={ids:Array.from({length:25},(_,i)=>'id-'+i),visible:true,busy:false,resultRevision:0};const texts=state.ids.map((_,i)=>'原句 '+i+' 記憶點🎵 後文');
 if(kind==='lyrics')state.texts=texts;else state.shots=texts.map(text=>Object.fromEntries(M.fields.map(k=>[k,k==='visual'?text:''])));
 let reads=0,defer=false;
 const search=p=>M.search(p,{hash:b=>crypto.createHash('sha256').update(b).digest('hex')});
 const document={createElement:node,getElementById:id=>nodes.get(id),defaultView:{addEventListener(){}}};for(const k of ['query','find','previous','next','cancel','matches','note'])nodes.set(kind+'-search-'+k,node('button'));
 const controller=D.bind(document,{version:'0.95.0',capture:()=>{reads++;return state;},search,request:async(p,options)=>{const d=await search(p),wire={data:d,files:{[kind+'-search.json']:JSON.stringify(d),[kind+'-search.md']:M.markdown(d)},meta:{version:'0.95.0',protocol_version:1,needs_review:true}},item={p,options};requests.push(item);return defer?new Promise(resolve=>{item.resolve=()=>resolve(wire);}):wire;},focusTarget:()=>true,onReport:(d,f)=>reports.push({d,f})});
 const query=nodes.get(kind+'-search-query');query.value='記憶點🎵';query.oninput();
 const event=value=>{let prevented=0;query.onkeydown({...value,preventDefault(){prevented++;}});return prevented;};
 return {controller,state,nodes,requests,reports,event,reads:()=>reads,defer:()=>{defer=true;},resume:()=>{defer=false;}};
}
for(const kind of ['lyrics','storyboard']){
 test(kind+' original DOM ignores IME Enter without captures, reports, list or source changes',async()=>{
  const f=fixture(kind),before=f.controller.view(),source=structuredClone(f.state),reads=f.reads();
  for(const e of [{...normal,isComposing:true},{...normal,keyCode:229},{...normal,keyCode:229,isComposing:true},{...normal,key:'Process'}])assert.equal(f.event(e),0);
  assert.equal(f.reads(),reads);await tick();assert.equal(f.requests.length,0);assert.equal(f.reports.length,0);assert.deepEqual(f.state,source);assert.deepEqual(f.controller.view(),before);
  assert.equal(f.event(normal),1);await tick();await tick();assert.equal(f.requests.length,1);assert.equal(f.reports.length,1);assert.equal(f.controller.view().matches.length,20);
  const completed=f.controller.view(),again=f.reads();for(const e of [{...normal,isComposing:true},{...normal,keyCode:229}])assert.equal(f.event(e),0);assert.equal(f.reads(),again);await tick();assert.deepEqual(f.controller.view(),completed);assert.equal(f.requests.length,1);assert.equal(f.reports[0].d.matches[0].text,kind==='lyrics'?source.texts[0]:source.shots[0].visual);
 });
 test(kind+' ordinary Enter/button, pending composition and cancel/retry retain request ownership',async()=>{
  const f=fixture(kind);assert.equal(await f.controller.find(),true);const old=f.controller.view().matches;f.defer();const pending=f.controller.next();await tick();await tick();assert.equal(f.requests.length,2);assert.equal(f.controller.view().pending,true);
  const before=f.controller.view(),reads=f.reads();for(const e of [{...normal,isComposing:true},{...normal,keyCode:229}])assert.equal(f.event(e),0);assert.equal(f.reads(),reads);assert.deepEqual(f.controller.view(),before);assert.equal(f.requests[1].options.signal.aborted,false);
  assert.equal(f.event(normal),1);await tick();assert.equal(f.requests.length,2);assert.equal(f.controller.cancel(),true);assert.equal(f.requests[1].options.signal.aborted,true);f.requests[1].resolve();assert.equal(await pending,false);assert.deepEqual(f.controller.view().matches,old);f.resume();assert.equal(await f.controller.next(),true);assert.equal(f.requests.length,3);assert.equal(f.controller.view().startRow,21);
  f.nodes.get(kind+'-search-find').onclick();await tick();await tick();assert.equal(f.requests.length,4);assert.equal(f.controller.view().startRow,1);
 });
}
test('shared keyboard asset is loaded before all three DOM adapters and served by one fixed route',()=>{
 const html=fs.readFileSync('web/index.html','utf8'),server=fs.readFileSync('music_lab_server.py','utf8');for(const kind of ['lyrics','storyboard','delivery']){assert.ok(html.indexOf('/search-input.js')<html.indexOf('/'+kind+'-search-dom.js'));assert.equal((html.match(/src="\/search-input.js"/g)||[]).length,1);}assert.match(server,/"\/search-input.js": \("web\/search-input.js", "text\/javascript"\)/);
});
