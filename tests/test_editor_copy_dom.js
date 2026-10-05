// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const P=require('../web/editor-copy.js'),DOM=require('../web/editor-copy-dom.js');
function setup(){
 const nodes={},events=[];let busy=false,reads=0,ids=0,writes=0;
 for(const [list,spec] of Object.entries(P.specs)){nodes[spec.scope]={hidden:false,isConnected:true};const container=nodes[list]={isConnected:true,children:[],listeners:new Map(),querySelectorAll:selector=>{assert.equal(selector,'[data-copy-entry]');return container.children.map(r=>r.button);},addEventListener:(type,fn)=>container.listeners.set(type,fn),removeEventListener:(type,fn)=>{assert.equal(container.listeners.get(type),fn);container.listeners.delete(type);}};
  const row={dataset:{historyId:'source-'+list},parentElement:container,contains:button=>button===row.button,value:Object.fromEntries(spec.fields.map(k=>[k,k==='open'?false:k+'\r\n🎵']))};row.button={disabled:false,isConnected:true,closest:selector=>{assert.equal(selector,'[data-history-id]');return row;}};container.children.push(row);
 }
 const document={getElementById:id=>nodes[id]},options={busy:()=>busy,capture:list=>{reads++;return nodes[list].children.map(r=>({id:r.dataset.historyId,value:r.value}));},newId:()=>{ids++;return 'new-'+ids;},apply:(list,entries)=>{writes++;events.push(['apply',list,entries]);nodes[list].children=entries.map(e=>{const row={dataset:{historyId:e.id},parentElement:nodes[list],value:e.value,contains:button=>button===row.button};row.button={disabled:false,isConnected:true,closest:()=>row};return row;});},onCopied:(...args)=>events.push(['copied',...args]),onError:e=>events.push(['error',e.message])};
 const adapter=DOM.bind(document,options),click=(list,row=nodes[list].children[0])=>nodes[list].listeners.get('click')({target:{closest:()=>row.button}});
 return {nodes,document,options,events,adapter,click,set busy(v){busy=v;},get reads(){return reads;},get ids(){return ids;},get writes(){return writes;}};
}
test('delegated clicks use stable row identity after insertion rather than display numbering',()=>{
 const s=setup();s.click('cues');assert.deepEqual(s.events.at(-1),['copied','cues',{index:1,id:'new-1'}]);s.click('cues',s.nodes.cues.children[1]);assert.deepEqual(s.nodes.cues.children.map(r=>r.dataset.historyId),['source-cues','new-1','new-2']);assert.equal(s.nodes.cues.listeners.size,1);
});
test('cheap refresh disables hidden, busy and full lists without reading original field data',()=>{
 const s=setup();s.adapter.refresh();assert.equal(s.reads,0);s.busy=true;s.adapter.refresh();for(const list of Object.keys(P.specs))assert.equal(s.nodes[list].children[0].button.disabled,true);s.busy=false;s.nodes.storyboard.hidden=true;s.nodes.cues.children=Array.from({length:10000},()=>s.nodes.cues.children[0]);s.adapter.refresh();assert.equal(s.nodes.arrangement.children[0].button.disabled,false);assert.equal(s.nodes.shots.children[0].button.disabled,true);assert.equal(s.nodes.cues.children[0].button.disabled,true);assert.equal(s.reads,0);assert.equal(s.ids,0);
});
test('hidden, busy, full capacity, detached or foreign buttons cannot read fields or allocate IDs',()=>{
 for(const condition of ['busy','hidden','full','detached','foreign','disabled']){const s=setup(),row=s.nodes.shots.children[0];if(condition==='busy')s.busy=true;if(condition==='hidden')s.nodes.storyboard.hidden=true;if(condition==='full')s.nodes.shots.children=Array.from({length:1000},()=>row);if(condition==='detached')row.button.isConnected=false;if(condition==='foreign')row.parentElement=s.nodes.cues;if(condition==='disabled')row.button.disabled=true;s.click('shots',row);assert.equal(s.reads,0,condition);assert.equal(s.ids,0,condition);assert.equal(s.writes,0,condition);assert.deepEqual(s.events,[]);}
});
test('owned listeners dispose cleanly and native control refresh recovers after busy ends',()=>{
 const s=setup();s.busy=true;s.adapter.refresh();s.busy=false;s.adapter.refresh();s.click('arrangement');assert.equal(s.writes,1);s.adapter.dispose();for(const list of Object.keys(P.specs))assert.equal(s.nodes[list].listeners.size,0);
});
test('actual app copy adapter writes and marks only its own scope, focuses its new row and preserves messages',()=>{
 const app=fs.readFileSync('web/app.js','utf8'),start=app.indexOf('editorCopy=MusicEditorCopyDOM.bind('),end=app.indexOf('editorOrder=MusicEditorOrderDOM.bind(',start),events=[];let options;
 const context={editorCopy:null,MusicEditorCopyDOM:{bind:(_document,o)=>{options=o;return {}; }},document:{},state:{busy:false},entriesFor:()=>[],rowSequence:5,collections:{arrangement:{scope:'music',label:'段落'},shots:{scope:'storyboard',label:'鏡頭'},cues:{scope:'lyrics',label:'歌詞句'}},writeEntries:(...args)=>events.push(['write',...args]),markDirty:(...args)=>events.push(['dirty',...args]),refreshCollectionControls:()=>events.push(['refresh']),focusEntry:(...args)=>events.push(['focus',...args]),say:(...args)=>events.push(['say',...args])};vm.runInNewContext(app.slice(start,end),context);
 for(const [list,scope] of [['arrangement','music'],['shots','storyboard'],['cues','lyrics']]){events.length=0;const rows=[{id:'new',value:{text:'原文\r\n'}}];options.apply(list,rows);options.onCopied(list,{index:1,id:'new'});assert.equal(events[0][0],'write');assert.equal(events[0][1],list);assert.deepEqual(events[1],['dirty',scope]);assert.deepEqual(events[3],['focus',list,1,'new']);assert.match(events[4][1],list==='arrangement'?/原編曲欄位保留/:/開始與結束留白/);}assert.equal(options.newId(),'row-6');assert.equal(context.rowSequence,6);
});
