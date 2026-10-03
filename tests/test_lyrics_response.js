// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const MusicTiming=require('../web/lyrics-timing.js');

// Execute the actual run and lyric event adapters with a controlled API reply.
function adapter(){
  const source=fs.readFileSync(path.join(__dirname,'../web/app.js'),'utf8');
  const start=source.indexOf('async function run('),end=source.indexOf('function setFiles(',start);
  const handlers=source.indexOf("$('lyrics-import').onclick="),handlersEnd=source.indexOf('function timingSay(',handlers);
  assert.ok(start>=0&&end>start&&handlers>=0&&handlersEnd>handlers);
  const state={tab:'lyrics',revisions:{lyrics:0},busy:false},nodes={};
  for(const id of ['lyrics-import','lyrics-build','cue-add','lyrics-title','lyrics-source','lyrics-format'])nodes[id]={value:id,disabled:false};
  let reply,payload,renderedIds,rows=[{start:0,end:1,text:'原句'}],rendered=0,cleared=0,files=0;
  const notices=[];
  const context={state,$:id=>nodes[id],say:m=>notices.push(m),markDirty:scope=>state.revisions[scope]=(state.revisions[scope]||0)+1,
    api:(_url,value)=>{payload=value;return new Promise(resolve=>reply=resolve);},lyricDuration:()=>null,cueValues:()=>structuredClone(rows),
    renderCues:(value,ids)=>{rows=structuredClone(value);renderedIds=ids;rendered++;},clearDeletionHistory:()=>cleared++,setFiles:()=>files++,
    structuredClone,MusicTiming,timingControls:()=>{},timingController:{invalidate:()=>{}},
    entriesFor:()=>rows.map((value,i)=>({id:`row-${i}`,value})),tick:()=>{},MusicEditor:{lyricsImportNotice:()=> '已匯入'}};
  vm.runInNewContext(source.slice(start,end),context);
  vm.runInNewContext(source.slice(handlers,handlersEnd),context);
  return {nodes,state,notices,choose:id=>nodes[id].onclick(),edit:text=>{rows[0].text=text;state.revisions.lyrics++;},
    reply:(cues=[{start:0,end:1,text:'舊回應'}])=>reply({data:{cues},files:{'lyrics.json':'舊成果'}}),
    setRows:value=>rows=structuredClone(value),payload:()=>payload,renderedIds:()=>Array.from(renderedIds),
    rows:()=>rows,counts:()=>({rendered,cleared,files})};
}

test('late lyric validation does not overwrite subsequent row edits or replace output',async()=>{
  const a=adapter(),work=a.choose('lyrics-build');assert.equal(a.state.busy,true);
  a.edit('驗證中修改');a.reply();await work;
  assert.equal(a.rows()[0].text,'驗證中修改');assert.deepEqual(a.counts(),{rendered:0,cleared:0,files:0});
  assert.equal(a.nodes['lyrics-build'].disabled,false);assert.equal(a.state.busy,false);
  assert.match(a.notices.at(-1),/處理期間輸入有修改/);
});

test('late lyric import keeps current rows and deletion history when source changes',async()=>{
  const a=adapter(),work=a.choose('lyrics-import');a.nodes['lyrics-source'].value='後續原文';a.state.revisions.lyrics++;
  a.reply();await work;
  assert.equal(a.rows()[0].text,'原句');assert.equal(a.nodes['lyrics-source'].value,'後續原文');
  assert.deepEqual(a.counts(),{rendered:0,cleared:0,files:0});assert.equal(a.state.busy,false);
});

test('current lyric validation applies once and retains history even if another panel changes',async()=>{
  const a=adapter(),work=a.choose('lyrics-build');a.state.revisions.music=1;a.reply();await work;
  assert.equal(a.rows()[0].text,'舊回應');assert.deepEqual(a.counts(),{rendered:1,cleared:0,files:1});
  const imported=a.choose('lyrics-import');a.reply();await imported;
  assert.deepEqual(a.counts(),{rendered:2,cleared:1,files:2});
  const b=adapter(),unsorted=[{start:4,end:5,text:'後句'},{start:1,end:2,text:'前句'}];b.setRows(unsorted);
  const sorted=b.choose('lyrics-build');assert.deepEqual(Array.from(b.payload().cues,c=>c.text),['前句','後句']);
  b.reply([unsorted[1],unsorted[0]]);await sorted;assert.deepEqual(b.renderedIds(),['row-1','row-0']);
});
