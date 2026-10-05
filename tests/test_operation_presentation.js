// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const Presentation=require('../web/operation-presentation.js'),Gate=require('../web/operation-gate.js');
const idle={busy:false,cancelling:false,canCancel:false},running={busy:true,cancelling:false,canCancel:true},cancelling={busy:true,cancelling:true,canCancel:false};
test('operation presentation describes all four workbenches from captured action metadata without reading source',()=>{
 for(const [scope,name] of [['music','歌曲設計'],['storyboard','母題分鏡'],['lyrics','波形校時'],['audio','交付檢查']]){
  const selected={scope,action:'  建立\n待辦報告 🎵  '},before=structuredClone(selected),view=Presentation.describe(running,selected);assert.deepEqual(view,{visible:true,canCancel:true,title:`處理中 · ${name}：建立 待辦報告 🎵`,note:'取消等待會保留編修與上一份成果；後端仍可能完成本次請求。'});assert.deepEqual(selected,before);assert.match(Presentation.describe(cancelling,selected).title,/^正在取消等待/);
 }
});
test('presentation refuses unknown or contradictory gate states instead of inventing cancellability',()=>{
 for(const value of [null,[],true,{}, {...running,extra:true},{...running,busy:1},{...running,cancelling:true},{...idle,cancelling:true},{...idle,canCancel:true},{busy:true,cancelling:false,canCancel:false}])assert.throws(()=>Presentation.describe(value,{scope:'music',action:'報告'}));
});
test('idle presentation clears pending metadata and never reads an obsolete context',()=>{
 assert.deepEqual(Presentation.describe(idle,{get scope(){assert.fail('idle context read');}}),{visible:false,canCancel:false,title:'',note:''});
});
test('captured context is isolated, bounded and Unicode checked with only known workbench and action keys',()=>{
 const source={scope:'music',action:'報告'},copy=Presentation.context(source);source.action='後續字串';assert.deepEqual(copy,{scope:'music',action:'報告'});
 for(const value of [null,[],{scope:'other',action:'報告'},{scope:new String('music'),action:'報告'},{scope:'music',action:''},{scope:'music',action:'  '},{scope:'music',action:'🎵'.repeat(129)},{scope:'music',action:'\ud800'},{scope:'music',action:'報告',media:{private:true}}])assert.throws(()=>Presentation.context(value));
 assert.equal(Presentation.context({scope:'lyrics',action:'🎵'.repeat(128)}).action.length,256);
});
function dom(){
 const body={},doc={body,activeElement:body},bar={hidden:true},title={textContent:''},note={hidden:true,textContent:''},button={disabled:true};let hidden=true;
 Object.defineProperty(button,'hidden',{get:()=>hidden,set:value=>{hidden=value;if(value&&doc.activeElement===button)doc.activeElement=body;}});doc.getElementById=id=>({'operation-cancel':button,'operation-note':note,'operation-bar':bar,'operation-title':title}[id]);
 const gate=Gate.createGate({createAbort:()=>new AbortController()}),ctx={MusicOperationPresentation:Presentation};vm.runInNewContext(fs.readFileSync('web/operation-control-dom.js','utf8'),ctx);let cancelCalls=0;
 const adapter=ctx.MusicOperationControlDOM.createAdapter(doc,{capture:()=>gate.view(),cancel:()=>{cancelCalls++;gate.cancel();adapter.refresh();}});return{doc,bar,title,note,button,gate,adapter,get cancelCalls(){return cancelCalls;}};
}
test('fixed DOM keeps pending feedback outside result state and renders isolated metadata as literal text',()=>{
 const s=dom(),source={scope:'music',action:'<img src=x onerror=boom> 🎵'};assert.equal(s.bar.hidden,true);s.adapter.begin(source);source.action='修改';const job=s.gate.begin();s.adapter.refresh();assert.equal(s.bar.hidden,false);assert.equal(s.button.hidden,false);assert.equal(s.button.disabled,false);assert.equal(s.title.textContent,'處理中 · 歌曲設計：<img src=x onerror=boom> 🎵');s.gate.finish(job);s.adapter.refresh();assert.equal(s.bar.hidden,true);assert.equal(s.title.textContent,'');assert.equal(s.note.textContent,'');
});
test('pending bar cancellation stays visible through the local cancelling phase and retains safe completion focus',()=>{
 const s=dom();s.adapter.begin({scope:'lyrics',action:'建立格式報告與歌詞包'});const job=s.gate.begin();s.adapter.refresh();s.doc.activeElement=s.button;s.button.onclick();assert.equal(s.cancelCalls,1);assert.equal(s.bar.hidden,false);assert.equal(s.button.disabled,true);assert.match(s.title.textContent,/正在取消等待 · 波形校時/);s.button.onclick();assert.equal(s.cancelCalls,1);s.gate.finish(job);s.adapter.refresh();s.adapter.refresh();const target={isConnected:true,disabled:false,closest:()=>null,focus:()=>s.doc.activeElement=target};assert.equal(s.adapter.finishFocus(target),true);assert.equal(s.bar.hidden,true);
});
test('a new pending action replaces the previous label only after the previous gate has settled',()=>{
 const s=dom();s.adapter.begin({scope:'storyboard',action:'建立待辦報告'});const first=s.gate.begin();s.adapter.refresh();assert.match(s.title.textContent,/母題分鏡/);s.gate.finish(first);s.adapter.refresh();s.adapter.begin({scope:'audio',action:'分析音檔'});const second=s.gate.begin();s.adapter.refresh();assert.equal(s.title.textContent,'處理中 · 交付檢查：分析音檔');s.gate.finish(second);s.adapter.refresh();
});
test('actual shared run captures the initiator label once before processing and leaves raw source/history/media untouched',async()=>{
 const app=fs.readFileSync('web/app.js','utf8'),start=app.indexOf('async function run('),end=app.indexOf('function setFiles(',start);assert.ok(start>=0&&end>start);
 const s=dom(),state={busy:false,tab:'storyboard',revisions:{storyboard:0},raw:{text:' 原文🎵 '},history:['刪除鏡2'],media:{id:'原媒體'},operationControl:s.adapter},button={textContent:'建立待辦報告',disabled:false};let resolve;const pending=new Promise(r=>resolve=r);
 const ctx={state,operationGate:s.gate,cueStampEdit:null,say(){},markDirty:()=>assert.fail('unexpected dirty'),timingControls:()=>s.adapter.refresh()};vm.createContext(ctx);vm.runInContext(app.slice(start,end),ctx);const before=structuredClone({raw:state.raw,history:state.history,media:state.media});const work=ctx.run(button,async current=>{assert.equal(current(),true);await pending;});assert.equal(state.busy,true);assert.equal(s.title.textContent,'處理中 · 母題分鏡：建立待辦報告');button.textContent='晚到的按鈕文字';s.adapter.refresh();assert.equal(s.title.textContent,'處理中 · 母題分鏡：建立待辦報告');ctx.cancelRun();resolve();await work;assert.equal(state.busy,false);assert.equal(s.bar.hidden,true);assert.deepEqual({raw:state.raw,history:state.history,media:state.media},before);
});
