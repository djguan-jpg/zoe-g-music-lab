// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),{execFileSync}=require('node:child_process');
const R=require('../musiclab/assets/lyrics-export-review.js'),O=require('../musiclab/assets/lyrics-offline-export.js'),D=require('../musiclab/assets/lyrics-offline-export-dom.js'),G=require('../web/lyrics-result.js');
const source=G.expectedBuild({title:'離線 <b> __TITLE__',cues:[{start:2,end:3,text:'[00:04] 原文'},{start:4,end:5,text:' \t'},{start:6,end:7,text:'字\u0085後\u2028尾\u2029終\t  '}],duration:10});
function wire(payload){return JSON.parse(execFileSync(process.platform==='win32'?'python':'python3',['-X','utf8','-c','import json,sys;from musiclab.application import build;print(json.dumps(build("lyrics_export_review",json.load(sys.stdin)).wire(),ensure_ascii=False))'],{cwd:path.join(__dirname,'..'),input:JSON.stringify(payload),encoding:'utf8',timeout:10000}));}
function harness(){const views=[],focused=[],controller=O.createController({onView:v=>views.push(v),focus:row=>focused.push(row)});return {views,focused,controller};}
function node(){return {dataset:{},children:[],textContent:'',append(x){this.children.push(x);},replaceChildren(){this.children=[];}};}
function dom(h){const nodes=Object.fromEntries(['lyrics-export-box','lyrics-export-status','lyrics-export-issues','lyrics-export-notes'].map(id=>[id,node()]));const presenter=D.createPresenter({getElementById:id=>nodes[id],createElement:node},(...args)=>h.controller.locate(...args));return {nodes,presenter};}
test('synchronous shared findings match actual Python report and preserve full source',async()=>{
 const before=structuredClone(source),report=wire({package:source}).data,analysis=R.analyze({package:source});for(const key of Object.keys(analysis))assert.deepEqual(analysis[key],report[key]);assert.deepEqual(source,before);assert.deepEqual((await R.review({package:source})),report);
});
test('shared diagnostics work without WebCrypto or any browser network API',()=>{
 const context=vm.createContext({TextEncoder,structuredClone});for(const name of ['lyric-time.js','json-document.js','lyrics-package.js','lyrics-lrc.js','lyrics-export-review.js','lyrics-offline-export.js'])vm.runInContext(fs.readFileSync(path.join(__dirname,'../musiclab/assets',name),'utf8'),context);
 const result=context.MusicLyricsExportReview.analyze({package:source});assert.equal(result.issue_count,2);const seen=[],c=context.MusicLyricsOfflineExport.createController({onView:v=>seen.push(v),focus:()=>true});c.accept(source);assert.equal(seen.at(-1).issue_count,2);assert.equal(context.crypto,undefined);assert.equal(context.fetch,undefined);
});
test('controller exposes only bounded findings and current rows, not full lyrics or source metadata',()=>{
 const h=harness(),before=structuredClone(source),v=h.controller.accept(source);assert.deepEqual(v.issues.map(i=>[i.row,i.format]),[[1,'lrc'],[2,'srt']]);assert.deepEqual(Object.keys(v).sort(),['cue_count','details_truncated','issue_count','issues','review_notes','revision','stale'].sort());assert.equal(h.controller.locate(1,v.revision),true);assert.deepEqual(h.focused,[1]);assert.deepEqual(source,before);
 v.issues[0].row=999;v.review_notes[0]='changed';assert.equal(h.controller.view().issues[0].row,1);
});
test('all10000 cues count while20 visible entries and truncation remain explicit',()=>{
 const p=G.expectedBuild({title:'上限',cues:Array.from({length:10000},(_,i)=>({start:i*2,end:i*2+1,text:i%2?'[00:04]字':' \t'})),duration:20000}),h=harness(),v=h.controller.accept(p);assert.equal(v.issue_count,10000);assert.equal(v.issues.length,20);assert.equal(v.details_truncated,true);assert.equal(h.controller.locate(20,v.revision),false);assert.deepEqual(h.focused,[]);
});
test('edits invalidate old row navigation and fresh accepted source has a new revision',()=>{
 const h=harness(),old=h.controller.accept(source);h.controller.invalidate();assert.equal(h.controller.view().stale,true);assert.equal(h.controller.locate(0,old.revision),false);const p=structuredClone(source);p.cues[0].text='普通原文';const fresh=h.controller.accept(p);assert.equal(fresh.issue_count,1);assert.equal(h.controller.locate(0,old.revision),false);assert.equal(h.controller.locate(0,fresh.revision),true);assert.deepEqual(h.focused,[1]);
});
test('invalid source fails closed and retry preserves source and restores current diagnostics',()=>{
 const h=harness(),v=h.controller.accept(source);for(const bad of [{...source,schema_version:2},{...source,cues:[]},{...source,cues:[{start:1,end:0,text:'bad'}]}]){assert.throws(()=>h.controller.accept(bad));assert.equal(h.controller.view().stale,true);assert.equal(h.controller.locate(0,v.revision),false);}const retry=h.controller.accept(source);assert.equal(retry.stale,false);assert.equal(retry.issue_count,2);
 for(const index of [-1,.5,'0',NaN,999])assert.equal(h.controller.locate(index,retry.revision),false);
});
test('actual presenter labels current original row, disables stale buttons and rejects an old callback after retry',()=>{
 const h=harness(),{nodes,presenter}=dom(h),v=h.controller.accept(source);presenter.render(v);const button=nodes['lyrics-export-issues'].children[1].children[0];assert.match(button.textContent,/第 2 句 · SRT/);assert.equal(button.disabled,false);assert.equal(button.onclick(),true);h.controller.invalidate();presenter.render(h.controller.view());assert.equal(nodes['lyrics-export-box'].dataset.stale,'true');assert.equal(nodes['lyrics-export-issues'].children[0].children[0].disabled,true);assert.equal(button.onclick(),false);
 const p=structuredClone(source);p.cues[1].text='已修改';presenter.render(h.controller.accept(p));assert.equal(button.onclick(),false);assert.match(nodes['lyrics-export-status'].textContent,/提醒 1 項/);assert.deepEqual(h.focused,[1]);
});
test('zero-risk and truncated views still recommend complete JSON and never mutate text',()=>{
 const h=harness(),{nodes,presenter}=dom(h),p=structuredClone(source);p.cues[0].text=' [00:04] 保留';p.cues[1].text='\u2028';const before=structuredClone(p),v=h.controller.accept(p);presenter.render(v);assert.equal(v.issue_count,0);assert.equal(nodes['lyrics-export-issues'].children.length,0);assert.match(nodes['lyrics-export-status'].textContent,/完整 JSON/);assert.equal(nodes['lyrics-export-notes'].children.length,3);assert.deepEqual(p,before);
 const many=G.expectedBuild({title:'截斷',cues:Array.from({length:21},(_,i)=>({start:i*2,end:i*2+1,text:''})),duration:42});presenter.render(h.controller.accept(many));assert.equal(nodes['lyrics-export-issues'].children.length,21);assert.match(nodes['lyrics-export-issues'].children.at(-1).textContent,/前 20 項/);
});
