// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const {createLatestTask, activeCueIndex, draftFields, draftRows, validateDraft} = require('../web/editor-state.js');

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
  return {format:'zoe-music-lab-draft',schema_version:1,tool_version:'0.3.0',saved_at:'2026-10-01',tab:'music',panels};
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
