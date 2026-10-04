// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const MusicTiming=require('../web/lyrics-timing.js');
const MusicLyricsPackage=require('../musiclab/assets/lyrics-package.js');
const MusicLyricsResult=require('../web/lyrics-result.js');
const MusicLyricsExportReview=require('../musiclab/assets/lyrics-export-review.js');

// Execute the actual run and lyric event adapters with a controlled API reply.
function adapter(){
  const source=fs.readFileSync(path.join(__dirname,'../web/app.js'),'utf8');
  const start=source.indexOf('async function run('),end=source.indexOf('function setFiles(',start);
  const handlers=source.indexOf("$('lyrics-import').onclick="),handlersEnd=source.indexOf('lyricsReviewController=MusicLyricsReview.createController(',handlers);
  assert.ok(start>=0&&end>start&&handlers>=0&&handlersEnd>handlers);
  const state={tab:'lyrics',revisions:{lyrics:0},busy:false},nodes={};
  for(const id of ['lyrics-import','lyrics-build','cue-add','lyrics-title','lyrics-source','lyrics-format'])nodes[id]={value:id,disabled:false};
  let reply,payload,renderedIds,rows=[{start:0,end:1,text:'原句'}],rendered=0,cleared=0,files=0,invalidated=0;
  const notices=[];
  const context={readValue:control=>control.value,LyricTime:require('../musiclab/assets/lyric-time.js'),state,$:id=>nodes[id],say:m=>notices.push(m),markDirty:scope=>state.revisions[scope]=(state.revisions[scope]||0)+1,
    api:(_url,value)=>{payload=value;return new Promise(resolve=>reply=resolve);},lyricDuration:()=>null,cueValues:()=>structuredClone(rows),
    renderCues:(value,ids)=>{rows=structuredClone(value);renderedIds=ids;rendered++;},clearDeletionHistory:()=>cleared++,setFiles:()=>files++,
    lyricsSeedController:{cancel:()=>{}},lyricsImportController:{inspectCurrent:()=>{throw Error('Import has its own guarded preview tests');}},structuredClone,MusicTiming,MusicLyricsPackage,MusicLyricsResult,MusicLyricsExportReview,renderLyricsExportReview:()=>{},MusicLyricsReview:require('../musiclab/assets/lyrics-review.js'),lyricsReviewPayload:()=>({title:'原創',cues:structuredClone(rows)}),renderLyricsReview:()=>{},focusLyricsIssue:()=>{},timingControls:()=>{},timingController:{invalidate:()=>invalidated++},
    entriesFor:()=>rows.map((value,i)=>({id:`row-${i}`,value})),tick:()=>{},MusicEditor:{lyricsImportNotice:()=> '已匯入'}};
  vm.runInNewContext(source.slice(start,end),context);
  vm.runInNewContext(source.slice(handlers,handlersEnd),context);
  return {nodes,state,notices,choose:id=>nodes[id].onclick(),edit:text=>{rows[0].text=text;state.revisions.lyrics++;},
    reply:cues=>{const data=MusicLyricsResult.expectedBuild(cues?{...payload,cues}:payload);reply({data,files:{'lyrics.json':JSON.stringify(data),...MusicLyricsResult.textFiles(data.cues),'preview.html':''},meta:{version:'0.52.0',protocol_version:1,needs_review:MusicLyricsPackage.needsReview(data)}});},
    replyRaw:value=>reply(value),invalidations:()=>invalidated,
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

test('current lyric validation applies once and retains history even if another panel changes',async()=>{
  const a=adapter(),work=a.choose('lyrics-build');a.state.revisions.music=1;a.reply();await work;
  assert.equal(a.rows()[0].text,'原句');assert.deepEqual(a.counts(),{rendered:1,cleared:0,files:1});
  const b=adapter(),unsorted=[{start:4,end:5,text:'後句'},{start:1,end:2,text:'前句'}];b.setRows(unsorted);
  const sorted=b.choose('lyrics-build');assert.deepEqual(Array.from(b.payload().cues,c=>c.text),['前句','後句']);
  b.reply([unsorted[1],unsorted[0]]);await sorted;assert.deepEqual(b.renderedIds(),['row-1','row-0']);
});

test('unrelated self-consistent build reply preserves rows, prior output and timing preview; valid retry works',async()=>{
  const a=adapter(),work=a.choose('lyrics-build');a.reply([{start:0,end:1,text:'錯來源'}]);await work;
  assert.equal(a.rows()[0].text,'原句');assert.deepEqual(a.counts(),{rendered:0,cleared:0,files:0});assert.equal(a.invalidations(),0);
  assert.match(a.notices.at(-1),/來源.*保留/);assert.equal(a.state.busy,false);assert.equal(a.nodes['lyrics-build'].disabled,false);
  const retry=a.choose('lyrics-build');a.reply();await retry;assert.equal(a.rows()[0].text,'原句');assert.equal(a.counts().files,1);assert.equal(a.invalidations(),1);
});

test('malformed current build reply cannot render or install artifacts',async()=>{
  const a=adapter(),work=a.choose('lyrics-build');a.replyRaw({data:{cues:[{start:0,end:1,text:'不完整'}]},files:{'lyrics.json':'broken'}});await work;
  assert.equal(a.rows()[0].text,'原句');assert.equal(a.counts().rendered,0);assert.equal(a.counts().files,0);assert.equal(a.invalidations(),0);assert.match(a.notices.at(-1),/不完整.*保留/);
});

test('late malformed reply is ignored before source checking and cannot change later row edits',async()=>{
  const a=adapter(),work=a.choose('lyrics-build');a.edit('新編修');a.replyRaw(null);await work;
  assert.equal(a.rows()[0].text,'新編修');assert.equal(a.counts().files,0);assert.equal(a.invalidations(),0);assert.match(a.notices.at(-1),/處理期間輸入有修改/);
});
