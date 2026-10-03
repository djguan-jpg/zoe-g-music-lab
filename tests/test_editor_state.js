// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const {createLatestTask, activeCueIndex, draftFields, draftRows, validateDraft,inspectDraft,
  convertLegacyDraft,nextMotifId,compactShotTimes} = require('../web/editor-state.js');

test('late completion cannot overwrite a newer audio selection', async () => {
  const task = createLatestTask();
  let resolveOld;
  const oldDecoded = new Promise(resolve => resolveOld = resolve);
  let visible = null;
  const oldToken = task.begin();
  const oldWork = oldDecoded.then(value => {if(task.isCurrent(oldToken))visible=value;});
  const newToken = task.begin();
  if(task.isCurrent(newToken))visible='new audio waveform';
  resolveOld('old audio waveform');
  await oldWork;
  assert.equal(visible, 'new audio waveform');
});

test('deleted and edited cues immediately change the playable preview', () => {
  const cues = [{start:0,end:4,text:'deleted'},{start:4,end:8,text:'keep'}];
  assert.equal(activeCueIndex(cues, 1), 0);
  cues.shift();
  assert.equal(activeCueIndex(cues, 1), -1);
  cues[0].start=0; cues[0].text='edited';
  assert.equal(cues[activeCueIndex(cues, 1)].text, 'edited');
  assert.equal(activeCueIndex(cues, 8), -1);
});

function draft() {
  const panels={};
  Object.entries(draftFields).forEach(([panel,fields])=>{
    panels[panel]={fields:Object.fromEntries(fields.map(field=>[field,'']))};
    if(draftRows[panel])panels[panel][draftRows[panel].key]=[];
  });
  panels.lyrics.fields['lyrics-format']='.lrc';panels.audio.fields['audio-profile']='distribution';
  panels.storyboard.motifs=[];
  return {format:'zoe-music-lab-draft',schema_version:2,tool_version:'0.4.0',saved_at:'2026-10-03',tab:'music',panels};
}

test('draft roundtrip preserves incomplete numeric edits and escapes no content away', () => {
  const value=draft();
  value.panels.music.fields['music-title']='原創 <tag> & "一句話"';
  value.panels.music.sections=[{name:'未完成',bars:'',energy:'3',focus:'',texture:''}];
  const result=validateDraft(JSON.parse(JSON.stringify(value)));
  assert.deepEqual(result,value);
  result.panels.music.fields['music-title']='changed';
  assert.equal(value.panels.music.fields['music-title'],'原創 <tag> & "一句話"');
});

test('future schema and malformed imported rows fail before replacing draft', () => {
  const current=draft(), before=structuredClone(current);
  const future=draft();future.schema_version=99;
  assert.throws(()=>validateDraft(future), /草稿/);
  const bad=draft();bad.panels.lyrics.cues=[{start:0,end:3,text:'number fields are invalid'}];
  assert.throws(()=>validateDraft(bad), /列資料/);
  const partial=draft();delete partial.panels.storyboard;
  assert.throws(()=>validateDraft(partial), /草稿/);
  assert.deepEqual(current,before);
});

function shot(id='motif-1') {
  const row=Object.fromEntries(draftRows.storyboard.columns.map(key=>[key,'']));
  return {...row,start:'0',end:'6',screen_direction:'neutral',motif_id:id};
}
test('multiple motif identity survives rename and draft roundtrip',()=>{
  const value=draft();value.panels.storyboard.motifs=[{id:'motif-1',name:'紙箱',meaning:'未說完'},
    {id:'motif-2',name:'階梯',meaning:'停留'}];value.panels.storyboard.shots=[shot(),shot('motif-2')];
  value.panels.storyboard.motifs[0].name='信封';
  assert.equal(validateDraft(JSON.parse(JSON.stringify(value))).panels.storyboard.shots[0].motif_id,'motif-1');
  assert.equal(nextMotifId(value.panels.storyboard.motifs),'motif-3');
  value.panels.storyboard.motifs.splice(0,1);
  assert.throws(()=>validateDraft(value),/對應/);
});
test('legacy inspection never migrates or changes the original before explicit conversion',()=>{
  const value=draft();value.schema_version=1;value.tool_version='0.3.0';
  const panel=value.panels.storyboard;delete panel.motifs;
  panel.fields['mv-motif']='紙箱';panel.fields['mv-meaning']='未說完';
  const row=shot();delete row.motif_id;panel.shots=[row];
  const original=structuredClone(value),inspection=inspectDraft(value);
  assert.equal(inspection.legacy,true);assert.equal(inspection.draft.schema_version,1);
  assert.throws(()=>validateDraft(value),/草稿/);
  const converted=convertLegacyDraft(inspection.draft);
  assert.equal(converted.schema_version,2);assert.equal(converted.panels.storyboard.shots[0].motif_id,'motif-1');
  assert.equal(converted.panels.storyboard.motifs[0].name,'紙箱');assert.deepEqual(value,original);
});
test('duplicate identity, future versions and invalid legacy rows reject before load',()=>{
  const value=draft();value.panels.storyboard.motifs=[{id:'motif-1',name:'A',meaning:''},{id:'motif-1',name:'B',meaning:''}];
  assert.throws(()=>validateDraft(value),/對應/);
  value.schema_version=3;assert.throws(()=>inspectDraft(value),/草稿/);
  value.schema_version=1;assert.throws(()=>convertLegacyDraft(value),/草稿/);
});
test('deleting an incomplete shot permits compaction once remaining durations are valid',()=>{
  const rows=[shot(),{...shot(),start:'6',end:''},{...shot(),start:'12',end:'18'}];
  assert.equal(compactShotTimes(rows),null);
  rows.splice(1,1);
  assert.deepEqual(compactShotTimes(rows).map(s=>[s.start,s.end]),[['0','6'],['6','12']]);
  assert.equal(rows[1].start,'12');
});

// Exercise the production file-input adapter with controlled File.text promises.
function lyricAdapter() {
  const source=fs.readFileSync(path.join(__dirname,'../web/app.js'),'utf8');
  const controllerStart=source.indexOf('const lyricFileImport=');
  const start=controllerStart>=0?controllerStart:source.indexOf("$('lyrics-file').onchange=");
  const end=source.indexOf('function lyricDuration()',start);
  assert.ok(start>=0&&end>start,'production lyric adapter must be located');
  const fields={'lyrics-file':{id:'lyrics-file',dataset:{},closest:selector=>selector==='.panel'?{id:'lyrics'}:null},
    'lyrics-source':{value:'initial'},'lyrics-format':{value:'.lrc'}};
  const notices=[];let dirty=0;
  let inputHandler;
  const context={$:id=>fields[id],MusicEditor:require('../web/editor-state.js'),
    say:(message,error)=>notices.push({message,error}),markDirty:()=>dirty++,
    document:{querySelector:()=>({addEventListener:(_,handler)=>inputHandler=handler})}};
  const inputStart=source.indexOf("document.querySelector('.editor').addEventListener('input'");
  const inputEnd=source.indexOf('function clearOutput()',inputStart);
  assert.ok(inputStart>=0&&inputEnd>inputStart,'production input listener must be located');
  vm.runInNewContext(source.slice(inputStart,inputEnd),context);
  vm.runInNewContext(source.slice(start,end),context);
  return {fields,notices,dirty:()=>dirty,choose:file=>{
    inputHandler({target:fields['lyrics-file']});
    return fields['lyrics-file'].onchange({target:{files:[file]}});
  }};
}
function delayedFile(name) {
  let resolve,reject;const promise=new Promise((yes,no)=>{resolve=yes;reject=no;});
  return {file:{name,size:100,text:()=>promise},resolve,reject};
}
test('production lyric import keeps newest selection when old file finishes last',async()=>{
  const adapter=lyricAdapter(),old=delayedFile('old.srt');
  const oldRead=adapter.choose(old.file);
  await adapter.choose({name:'new.lrc',size:20,text:async()=>'[00:00.000]新的內容'});
  old.resolve('舊內容');await oldRead;
  assert.equal(adapter.fields['lyrics-source'].value,'[00:00.000]新的內容');
  assert.equal(adapter.fields['lyrics-format'].value,'.lrc');
  assert.equal(adapter.dirty(),1,'only accepted content marks output dirty');
});
test('stale lyric read errors cannot replace the accepted import notice',async()=>{
  const adapter=lyricAdapter(),old=delayedFile('old.srt'),work=adapter.choose(old.file);
  await adapter.choose({name:'new.lrc',size:3,text:async()=>'new'});
  old.reject(Error('expired failure'));await work;
  assert.equal(adapter.fields['lyrics-source'].value,'new');
  assert.equal(adapter.notices.length,1);assert.equal(adapter.notices[0].error,undefined);
});
test('manual edit or draft replacement cancels an outstanding text import',async()=>{
  const {createLyricsFileImport}=require('../web/editor-state.js');
  let content='initial';const errors=[];
  const reader=createLyricsFileImport({apply:result=>content=result.content,onError:error=>errors.push(error.message)});
  const old=delayedFile('old.lrc'),work=reader.read(old.file);
  reader.cancel();content='manual or restored draft';old.resolve('stale text');
  assert.equal(await work,false);assert.equal(content,'manual or restored draft');assert.deepEqual(errors,[]);
});
test('failed current selection keeps source and format together and supports retry',async()=>{
  const adapter=lyricAdapter();
  await adapter.choose({name:'bad.srt',size:30,text:async()=>{throw Error('read failed');}});
  assert.equal(adapter.fields['lyrics-source'].value,'initial');assert.equal(adapter.fields['lyrics-format'].value,'.lrc');
  await adapter.choose({name:'not-a-lyric.wav',size:3,text:async()=>{throw Error('should not read');}});
  await adapter.choose({name:'too-large.lrc',size:2*1024*1024+1,text:async()=>{throw Error('should not read');}});
  assert.equal(adapter.dirty(),0);assert.equal(adapter.notices.filter(n=>n.error).length,3);
  await adapter.choose({name:'original.SRT',size:30,text:async()=>'1\n00:00:00,000 --> 00:00:03,000\n原創'});
  assert.equal(adapter.fields['lyrics-format'].value,'.srt');assert.match(adapter.fields['lyrics-source'].value,/原創/);
});
test('storyboard summaries distinguish missing times and keep motif names current',()=>{
  const {shotOverview}=require('../web/editor-state.js');
  const rows=[{...shot(),section:'前奏'},{...shot(''),start:'',end:'12'}];
  const motifs=[{id:'motif-1',name:'紙箱'}];
  assert.equal(shotOverview(rows,motifs)[0].label,'0–6 秒 · 前奏 · 紙箱');
  assert.equal(shotOverview(rows,motifs)[1].valid,false);
  assert.match(shotOverview(rows,motifs)[1].label,/時間未完成.*未選母題/);
  motifs[0].name='信封';assert.match(shotOverview(rows,motifs)[0].label,/信封/);
  assert.equal(rows[0].motif_id,'motif-1');
});
