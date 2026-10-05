// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const app=fs.readFileSync('web/app.js','utf8');
function block(a,b){const i=app.indexOf(a),j=app.indexOf(b,i+1);assert.ok(i>=0&&j>i);return app.slice(i,j);}
function handler(id){const lines=app.split('\n').filter(s=>s.startsWith(`$('${id}').onclick=`));assert.equal(lines.length,1);return lines[0];}
function setup(){
 const nodes={'music-example':{disabled:true},'mv-example':{disabled:true},'lyrics-source':{value:'原始歌詞'}},calls=[];
 const state={busy:false,tab:'music',examples:{music:{title:'範例'},storyboard:{}},revisions:{},files:{old:'原成果'},raw:{music:' 原歌名 🎵 ',storyboard:' 原片名 '},history:{music:['早刪除','新刪除'],storyboard:['鏡頭2']},media:{identity:'原音檔',position:12.4,paused:false}};
 const context={state,$:id=>{assert.ok(nodes[id],id);return nodes[id];},say:(...args)=>calls.push(['say',...args]),
  loadMusic:()=>{calls.push(['load','music']);state.raw.music='合成歌曲';state.history.music=[];},loadMv:()=>{calls.push(['load','storyboard']);state.raw.storyboard='合成分鏡';state.history.storyboard=[];},
  markDirty:scope=>{calls.push(['dirty',scope]);state.revisions[scope]=(state.revisions[scope]||0)+1;},operationGate:require('../web/operation-gate.js').createGate({createAbort:()=>new AbortController()}),cueStampEdit:null};
 vm.createContext(context);vm.runInContext(block('function refreshExampleControls(',"$('music-example').onclick=")+handler('music-example')+handler('mv-example'),context);
 context.timingControls=()=>context.refreshExampleControls();vm.runInContext(block('async function run(','function setFiles('),context);
 return{state,nodes,calls,context,click:id=>nodes[id].onclick(),refresh:()=>context.refreshExampleControls()};
}
test('both actual example handlers refuse busy calls without replacing raw values, history, media or prior results',()=>{
 for(const id of ['music-example','mv-example']){const s=setup();s.state.busy=true;const before=structuredClone(s.state);s.click(id);assert.deepEqual(s.state,before);assert.deepEqual(s.calls,[['say','目前操作尚未完成，請稍候']]);}
});
test('both handlers refuse before examples exist without reading or clearing working content',()=>{
 for(const id of ['music-example','mv-example']){const s=setup();s.state.examples=null;const before=structuredClone(s.state);s.click(id);assert.deepEqual(s.state,before);assert.equal(s.calls.length,1);assert.match(s.calls[0][1],/範例尚未讀取完成/);assert.equal(s.calls[0][2],true);}
});
test('availability waits for source and idle processing and refresh has no content, history, status or focus side effects',()=>{
 const s=setup();for(const [ready,busy] of [[false,false],[false,true],[true,true],[true,false]]){s.state.examples=ready?{}:null;s.state.busy=busy;const before=structuredClone(s.state);s.refresh();for(const node of Object.values(s.nodes).slice(0,2))assert.equal(node.disabled,!ready||busy);assert.deepEqual(s.state,before);assert.equal(s.calls.length,0);}
});
test('idle explicit examples replace only the chosen panel and clear only its own deletion records',()=>{
 for(const [id,scope] of [['music-example','music'],['mv-example','storyboard']]){const s=setup(),before=structuredClone(s.state);s.refresh();s.click(id);assert.equal(s.state.history[scope].length,0);const other=scope==='music'?'storyboard':'music';assert.equal(s.state.raw[other],before.raw[other]);assert.deepEqual(s.state.history[other],before.history[other]);assert.deepEqual(s.state.media,before.media);assert.deepEqual(s.state.files,before.files);assert.equal(s.state.revisions[scope],1);assert.equal(s.calls.filter(x=>x[0]==='load').length,1);}
});
test('actual successful shared run blocks both examples and preserves source and history, then permits an explicit idle retry',async()=>{
 const s=setup(),before=structuredClone(s.state);let resolve;const pending=new Promise(r=>resolve=r),button={disabled:false};const work=s.context.run(button,async current=>{await pending;if(current())s.state.files={report:'同來源報告'};});
 assert.equal(s.state.busy,true);for(const id of ['music-example','mv-example']){assert.equal(s.nodes[id].disabled,true);s.click(id);}assert.deepEqual(s.state.raw,before.raw);assert.deepEqual(s.state.history,before.history);resolve();await work;assert.equal(s.state.busy,false);assert.equal(button.disabled,false);assert.equal(s.state.files.report,'同來源報告');assert.equal(s.nodes['music-example'].disabled,false);s.click('music-example');assert.equal(s.state.history.music.length,0);assert.deepEqual(s.state.history.storyboard,before.history.storyboard);
});
test('actual failed shared run releases ready examples and retains previous results and all deletion records',async()=>{
 const s=setup(),before=structuredClone(s.state);await s.context.run({disabled:false},()=>Promise.reject(Error('合成請求失敗')));assert.equal(s.state.busy,false);assert.deepEqual(s.state.raw,before.raw);assert.deepEqual(s.state.history,before.history);assert.deepEqual(s.state.files,before.files);assert.equal(s.nodes['mv-example'].disabled,false);assert.ok(s.calls.some(x=>x[0]==='say'&&x[1]==='合成請求失敗'&&x[2]));
});
test('manual edits while pending retain later text and previous result when stale completion releases example controls',async()=>{
 const s=setup();let resolve;const pending=new Promise(r=>resolve=r);const work=s.context.run({disabled:false},async current=>{await pending;if(current())s.state.files={wrong:'過期報告'};});s.state.raw.music='晚到前自寫';s.context.markDirty('music');resolve();await work;assert.equal(s.state.raw.music,'晚到前自寫');assert.deepEqual(s.state.files,{old:'原成果'});assert.deepEqual(s.state.history.music,['早刪除','新刪除']);assert.equal(s.nodes['music-example'].disabled,false);
});
function initial(s,{atInitial=true,fetch}={}){
 let initCount=0;s.state.examples=null;Object.assign(s.context,{fetch,draftRetention:{initialize:()=>initCount++,status:()=>({atInitial})},captureDraft:()=>({}),writeValue:(node,value)=>{node.value=value;},drawWave:()=>s.calls.push(['draw']),setupLibrary:()=>s.calls.push(['library'])});vm.runInContext(block('async function initialize(){','\ninitialize();'),s.context);return{start:()=>s.context.initialize(),get initCount(){return initCount;}};
}
test('actual delayed startup disables both examples until the response is parsed and applies only untouched initial inputs',async()=>{
 const s=setup();let resolve;const i=initial(s,{fetch:()=>new Promise(r=>resolve=r)});const pending=i.start();s.click('music-example');assert.equal(s.nodes['music-example'].disabled,true);assert.deepEqual(s.state.history.music,['早刪除','新刪除']);resolve({ok:true,json:async()=>({music:{},storyboard:{}})});await pending;assert.equal(s.nodes['music-example'].disabled,false);assert.equal(s.nodes['mv-example'].disabled,false);assert.equal(i.initCount,2);assert.equal(s.calls.filter(x=>x[0]==='load').length,2);
});
test('actual startup network, HTTP or JSON failure keeps example controls unavailable but preserves editable inputs and histories',async()=>{
 for(const fetch of [async()=>{throw Error('讀取失敗');},async()=>({ok:false}),async()=>({ok:true,json:async()=>{throw Error('合成JSON失敗');}})]){const s=setup(),before=structuredClone(s.state.raw),history=structuredClone(s.state.history);await initial(s,{fetch}).start();assert.equal(s.nodes['music-example'].disabled,true);assert.equal(s.nodes['mv-example'].disabled,true);assert.deepEqual(s.state.raw,before);assert.deepEqual(s.state.history,history);assert.equal(s.calls.filter(x=>x[0]==='load').length,0);}
});
test('late startup never replaces later edits or a busy shared request and never re-enables examples during that request',async()=>{
 for(const busy of [false,true]){const s=setup();let resolve;const i=initial(s,{atInitial:busy,fetch:()=>new Promise(r=>resolve=r)}),pending=i.start();s.state.busy=busy;s.state.raw.music='載入期間人工編修';const before=structuredClone(s.state.raw),history=structuredClone(s.state.history);resolve({ok:true,json:async()=>({music:{},storyboard:{}})});await pending;assert.deepEqual(s.state.raw,before);assert.deepEqual(s.state.history,history);assert.equal(s.calls.filter(x=>x[0]==='load').length,0);assert.equal(s.nodes['music-example'].disabled,busy);if(busy)assert.equal(s.calls.filter(x=>x[0]==='say').length,0);s.state.busy=false;s.refresh();assert.equal(s.nodes['mv-example'].disabled,false);}
});
