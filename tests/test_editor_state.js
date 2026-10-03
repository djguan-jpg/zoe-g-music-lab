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
  panels.music.avoid=[];panels.music.deliverables=[];
  return {format:'zoe-music-lab-draft',schema_version:3,tool_version:'0.6.0',saved_at:'2026-10-03',tab:'music',panels};
}

function legacyDraft(version){
  const value=draft();value.schema_version=version;
  delete value.panels.music.fields['music-language'];delete value.panels.music.avoid;delete value.panels.music.deliverables;
  return value;
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
  const value=legacyDraft(1);value.tool_version='0.3.0';
  const panel=value.panels.storyboard;delete panel.motifs;
  panel.fields['mv-motif']='紙箱';panel.fields['mv-meaning']='未說完';
  const row=shot();delete row.motif_id;panel.shots=[row];
  const original=structuredClone(value),inspection=inspectDraft(value);
  assert.equal(inspection.legacy,true);assert.equal(inspection.draft.schema_version,1);
  assert.throws(()=>validateDraft(value),/草稿/);
  const converted=convertLegacyDraft(inspection.draft);
  assert.equal(converted.schema_version,3);assert.equal(converted.panels.storyboard.shots[0].motif_id,'motif-1');
  assert.equal(converted.panels.storyboard.motifs[0].name,'紙箱');assert.deepEqual(value,original);
});
test('duplicate identity, future versions and invalid legacy rows reject before load',()=>{
  const value=draft();value.panels.storyboard.motifs=[{id:'motif-1',name:'A',meaning:''},{id:'motif-1',name:'B',meaning:''}];
  assert.throws(()=>validateDraft(value),/對應/);
  value.schema_version=4;assert.throws(()=>inspectDraft(value),/草稿/);
  value.schema_version=1;assert.throws(()=>convertLegacyDraft(value),/草稿/);
});
test('deleting an incomplete shot permits compaction once remaining durations are valid',()=>{
  const rows=[shot(),{...shot(),start:'6',end:''},{...shot(),start:'12',end:'18'}];
  assert.equal(compactShotTimes(rows),null);
  rows.splice(1,1);
  assert.deepEqual(compactShotTimes(rows).map(s=>[s.start,s.end]),[['0','6'],['6','12']]);
  assert.equal(rows[1].start,'12');
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

test('v2 draft inspection preserves old data and explicit conversion adds prior UI defaults',()=>{
  const value=legacyDraft(2),before=structuredClone(value);
  value.panels.storyboard.motifs=[{id:'motif-1',name:'紙箱',meaning:'回應'}];value.panels.storyboard.shots=[shot()];
  const original=structuredClone(value),inspection=inspectDraft(value);
  assert.equal(inspection.draft.schema_version,2);assert.equal(inspection.legacy,true);
  const converted=convertLegacyDraft(inspection.draft);
  assert.equal(converted.panels.music.fields['music-language'],'繁體中文');
  assert.deepEqual(converted.panels.music.avoid,['用空泛口號取代動作']);
  assert.equal(converted.panels.music.deliverables.length,4);assert.deepEqual(value,original);
  value.panels.storyboard.shots[0].motif_id='motif-99';assert.throws(()=>inspectDraft(value),/對應/);
  assert.equal(before.schema_version,2);
});
test('v3 requirements preserve multiline list items and reject malformed lists',()=>{
  const value=draft();value.panels.music.avoid=['一個項目\n兩行仍是一個項目'];value.panels.music.deliverables=['A','B'];
  assert.deepEqual(validateDraft(value).panels.music.avoid,value.panels.music.avoid);
  value.panels.music.avoid=[7];assert.throws(()=>validateDraft(value),/需求清單/);
});
test('lyric notice distinguishes explicit SRT ends from inferred cue boundaries',()=>{
  const {lyricsImportNotice}=require('../web/editor-state.js');
  assert.match(lyricsImportNotice({duration_estimated:true,timing:{inferred_end_count:0}}),/保留原檔的結束時間/);
  assert.match(lyricsImportNotice({duration_estimated:true,timing:{inferred_end_count:2}}),/2 句結束.*補齊/);
});
