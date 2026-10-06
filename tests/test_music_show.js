// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),Focus=require('../web/editor-focus-dom.js');
const app=fs.readFileSync('web/app.js','utf8');
function setup(){
 let busy=false,selectionReads=0;const nodes={},document={activeElement:null,getElementById:id=>nodes[id]};
 nodes.music={isConnected:true,hidden:false};nodes.arrangement={isConnected:true,children:[]};nodes['section-order-show']={isConnected:true,hidden:false,disabled:false};
 let selected='b';nodes['section-order']={get value(){selectionReads++;return selected;},set value(v){selected=v;}};
 for(const id of ['a','b','c']){const input={isConnected:true,disabled:false,hidden:false,focus(){document.activeElement=input;}},row={dataset:{historyId:id},input,querySelector:()=>input,contains:e=>e===input};nodes.arrangement.children.push(row);}
 const adapter=Focus.createAdapter(document,{busy:()=>busy});const context={state:{get busy(){return busy;}},$:id=>nodes[id],editorFocus:adapter};
 const a=app.indexOf('function showMusicSection('),b=app.indexOf("$('section-earlier').onclick=",a);assert.ok(a>0&&b>a);vm.runInNewContext(app.slice(a,b),context);
 return {nodes,document,context,adapter,get selectionReads(){return selectionReads;},set busy(v){busy=v;}};
}
test('the actual song show action focuses the selected native name field using current stable identity',()=>{
 const h=setup();assert.equal(h.nodes['section-order-show'].onclick(),true);assert.equal(h.document.activeElement,h.nodes.arrangement.children[1].input);h.nodes.arrangement.children.reverse();h.nodes['section-order'].value='a';assert.equal(h.context.showMusicSection(),true);assert.equal(h.document.activeElement,h.nodes.arrangement.children[2].input);assert.equal(h.selectionReads,2);
});
test('busy disabled hidden or detached song controls reject before reading the selector',()=>{
 for(const mode of ['busy','disabled','button-hidden','button-detached','panel-hidden','panel-detached','container-detached']){const h=setup();if(mode==='busy')h.busy=true;if(mode==='disabled')h.nodes['section-order-show'].disabled=true;if(mode==='button-hidden')h.nodes['section-order-show'].hidden=true;if(mode==='button-detached')h.nodes['section-order-show'].isConnected=false;if(mode==='panel-hidden')h.nodes.music.hidden=true;if(mode==='panel-detached')h.nodes.music.isConnected=false;if(mode==='container-detached')h.nodes.arrangement.isConnected=false;assert.equal(h.context.showMusicSection(),false);assert.equal(h.selectionReads,0);assert.equal(h.document.activeElement,null);}
});
test('missing selected IDs empty lists or disabled target fields cannot focus another row or the add control',()=>{
 for(const mode of ['unknown','empty','disabled']){const h=setup();if(mode==='unknown')h.nodes['section-order'].value='gone';if(mode==='empty')h.nodes.arrangement.children=[];if(mode==='disabled')h.nodes.arrangement.children[1].input.disabled=true;assert.equal(h.context.showMusicSection(),false);assert.equal(h.document.activeElement,null);}
});
test('showing a song row has no dependency on writers dirty state histories bundles media or network',()=>{
 const h=setup(),before=h.nodes.arrangement.children.map(r=>r.dataset.historyId);assert.equal(h.context.showMusicSection(),true);assert.deepEqual(h.nodes.arrangement.children.map(r=>r.dataset.historyId),before);assert.equal(h.nodes['section-order'].value,'b');assert.deepEqual(Object.keys(h.context).sort(),['$','editorFocus','showMusicSection','state']);
});
test('the workbench song locate control is a non-submitting button with literal context and native keyboard behavior',()=>{
 const html=fs.readFileSync('web/index.html','utf8');assert.match(html,/<button id="section-order-show" type="button" class="subtle" aria-controls="arrangement">查看選定段落<\/button>/);assert.match(html,/選擇段落後，按「查看選定段落」直接定位名稱欄/);assert.equal((html.match(/id="section-order-show"/g)||[]).length,1);assert.ok(html.indexOf('id="section-order-show"')<html.indexOf('id="arrangement"'));
});
