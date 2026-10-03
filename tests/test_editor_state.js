// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
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
