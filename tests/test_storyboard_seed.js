// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {execFileSync}=require('node:child_process');
const Editor=require('../web/editor-state.js'),P=require('../web/planning-import.js'),S=require('../web/storyboard-seed.js'),U=require('../web/draft-undo.js');
const root=path.join(__dirname,'..');
const music=JSON.parse(fs.readFileSync(path.join(root,'examples/first-light-music.json'),'utf8'));
const mv=JSON.parse(fs.readFileSync(path.join(root,'examples/first-light-mv.json'),'utf8'));
const result=JSON.parse(execFileSync(process.platform==='win32'?'python':'python3',['-X','utf8','-c',
  "import json;from pathlib import Path;from musiclab.application import build;print(json.dumps(build('storyboard_seed',{'music':json.loads(Path('examples/first-light-music.json').read_text(encoding='utf-8'))}).wire(),ensure_ascii=False))"],{cwd:root,encoding:'utf8',timeout:10000}));
function draft(){
  const panels={};for(const [name,fields] of Object.entries(Editor.draftFields)){
    panels[name]={fields:Object.fromEntries(fields.map(field=>[field,'']))};
    if(Editor.draftRows[name])panels[name][Editor.draftRows[name].key]=[];
  }
  panels.music.avoid=[];panels.music.deliverables=[];panels.storyboard.motifs=[];
  panels.lyrics.fields['lyrics-format']='.lrc';panels.audio.fields['audio-profile']='video';
  const d={format:'zoe-music-lab-draft',schema_version:3,tool_version:'0.14.0',saved_at:'2026-10-03',tab:'music',panels};
  return P.planningDraft(P.planningDraft(d,'music',music),'storyboard',mv);
}
function harness(){
  let value={draft:draft(),fps:'24',bars_per_shot:'4'},resolve,reject;const ready=[],requests=[],completions=[];
  const c=S.createPreview({capture:()=>value,request:p=>{requests.push(p);return new Promise((r,j)=>{resolve=r;reject=j;completions.push({resolve:r,reject:j});});},
    onReady:(seed,files)=>ready.push({seed,files}),onClear:()=>{}});
  return {c,value,ready,requests,completions,resolve:r=>resolve(r??structuredClone(result)),reject:e=>reject(e)};
}
test('actual Python seed becomes only timing and source tasks; visuals remain blank',()=>{
  const current=draft(),before=structuredClone(current),seed=S.validateSeed(result.data),proposal=S.seedDraft(current,seed);
  assert.equal(proposal.panels.storyboard.shots.length,17);assert.equal(proposal.panels.storyboard.fields['mv-duration'],'136');
  for(const row of proposal.panels.storyboard.shots){assert.equal(row.visual,'');assert.equal(row.motif_id,'');assert.equal(row.camera,'');assert.equal(row.character_state,'');}
  assert.equal(proposal.panels.storyboard.shots[0].purpose,music.arrangement[0].focus);
  assert.deepEqual(proposal.panels.music,before.panels.music);assert.deepEqual(proposal.panels.storyboard.motifs,before.panels.storyboard.motifs);
  assert.equal(proposal.panels.storyboard.fields['mv-style'],before.panels.storyboard.fields['mv-style']);assert.deepEqual(current,before);
});
test('bad version, status, timing, frames, bars, source sections and nonfinite seed refuse',()=>{
  for(const change of [s=>s.schema_version=2,s=>s.status='rendered',s=>s.slots[1].start=0,s=>s.slots[0].end=Infinity,
    s=>s.slots[0].end_frame_exclusive=0,s=>s.slots[0].bar_end=9,s=>s.source.sections.pop(),s=>s.duration_seconds++,s=>s.slots.push(s.slots[0]),
    s=>s.source.bpm=NaN,s=>s.source.sections[0].end=7,s=>s.review_notes=[]]){
    const seed=structuredClone(result.data);change(seed);assert.throws(()=>S.validateSeed(seed),/不完整|版本/);
  }
});
test('current preview copies request and does not apply before an explicit proposal',async()=>{
  const h=harness(),before=structuredClone(h.value.draft),task=h.c.inspect();
  assert.equal(h.c.proposal(),null);assert.notEqual(h.requests[0].music,h.value.draft.panels.music);
  h.resolve();assert.equal(await task,true);assert.equal(h.ready.length,1);assert.deepEqual(h.value.draft,before);
  assert.equal(h.c.proposal().panels.storyboard.shots.length,17);
});
test('late result after source, target, or settings change is ignored before malformed validation',async()=>{
  for(const edit of [h=>h.value.draft.panels.music.fields['music-title']='later',h=>h.value.draft.panels.storyboard.shots[0].visual='later',h=>h.value.fps='30',h=>h.value.bars_per_shot='8']){
    const h=harness(),task=h.c.inspect();edit(h);h.resolve({bad:true});assert.equal(await task,false);assert.equal(h.ready.length,0);assert.equal(h.c.proposal(),null);
  }
});
test('cancellation and late transport error preserve existing draft',async()=>{
  const h=harness(),before=structuredClone(h.value.draft),task=h.c.inspect();h.c.cancel();h.reject(Error('old error'));
  assert.equal(await task,false);assert.deepEqual(h.value.draft,before);assert.equal(h.ready.length,0);
});
test('current error surfaces, then next request can succeed',async()=>{
  const h=harness(),task=h.c.inspect();h.reject(Error('current error'));await assert.rejects(task,/current error/);
  const retry=h.c.inspect();h.resolve();assert.equal(await retry,true);
});
test('source identity, contradictory meta, mismatched file and missing file refuse preview',async()=>{
  for(const change of [r=>r.data.title='wrong',r=>r.data.source.sections[0].focus='wrong',r=>r.meta.needs_review=false,
    r=>r.meta.protocol_version=2,r=>delete r.files['storyboard-seed.md'],r=>r.files['storyboard-seed.json']='{}']){
    const h=harness(),task=h.c.inspect(),r=structuredClone(result);change(r);h.resolve(r);await assert.rejects(task);assert.equal(h.ready.length,0);
  }
});
test('preview application rejects later source or target edits and preserves them',async()=>{
  for(const panel of ['music','storyboard']){
    const h=harness(),task=h.c.inspect();h.resolve();await task;
    h.value.draft.panels[panel].fields[panel==='music'?'music-title':'mv-title']='later edit';
    assert.throws(()=>h.c.proposal(),/已有修改/);assert.equal(h.value.draft.panels[panel].fields[panel==='music'?'music-title':'mv-title'],'later edit');
  }
});
test('unrelated panels may change while preview runs and are retained on apply',async()=>{
  const h=harness(),task=h.c.inspect();h.value.draft.panels.lyrics.fields['lyrics-source']='later lyrics';h.value.draft.panels.audio.fields['audio-profile']='distribution';
  h.resolve();assert.equal(await task,true);const proposal=h.c.proposal();assert.equal(proposal.panels.lyrics.fields['lyrics-source'],'later lyrics');assert.equal(proposal.panels.audio.fields['audio-profile'],'distribution');
});
test('external current guard rejects late response and cancellation clears ready proposal',async()=>{
  const h=harness();let current=true;const task=h.c.inspect(()=>current);current=false;h.resolve();assert.equal(await task,false);
  const next=h.c.inspect();h.resolve();await next;h.c.cancel();assert.equal(h.c.proposal(),null);
});
test('two simultaneous previews accept only the newest task',async()=>{
  const h=harness(),first=h.c.inspect(),second=h.c.inspect();
  h.completions[0].resolve({bad:true});assert.equal(await first,false);
  h.completions[1].resolve(structuredClone(result));assert.equal(await second,true);assert.equal(h.ready.length,1);
});
test('scoped undo restores previous storyboard while preserving unrelated later edits',()=>{
  const before=draft(),after=S.seedDraft(before,result.data),undo=U.createUndo();undo.record(before,after,'storyboard');
  const current=structuredClone(after);current.panels.lyrics.fields['lyrics-source']='keep';current.tab='audio';
  const proposal=undo.proposal(current);assert.deepEqual(proposal.draft.panels.storyboard,before.panels.storyboard);assert.equal(proposal.draft.panels.lyrics.fields['lyrics-source'],'keep');assert.equal(proposal.scope,'storyboard');
});
test('scoped undo refuses edited target without destroying record or current changes',()=>{
  const before=draft(),after=S.seedDraft(before,result.data),undo=U.createUndo();undo.record(before,after,'storyboard');
  const current=structuredClone(after);current.panels.storyboard.shots[0].visual='new scene';assert.throws(()=>undo.proposal(current),/已有編修/);
  assert.equal(current.panels.storyboard.shots[0].visual,'new scene');assert.ok(undo.proposal(after));
});
test('whole draft undo guards all panels and ignores transient tab and timestamp',()=>{
  const before=draft(),after=structuredClone(before);after.panels.music.fields['music-title']='loaded';const undo=U.createUndo();undo.record(before,after);
  const current=structuredClone(after);current.tab='lyrics';current.saved_at='other';assert.deepEqual(undo.proposal(current).draft.panels,before.panels);
  current.panels.audio.fields['audio-profile']='distribution';assert.throws(()=>undo.proposal(current),/已有編修/);
});
test('undo snapshot is isolated and object key order does not count as an edit',()=>{
  const before=draft(),after=S.seedDraft(before,result.data),undo=U.createUndo();undo.record(before,after,'storyboard');
  before.panels.storyboard.fields['mv-title']='mutated';const current=structuredClone(after);
  current.panels.storyboard.fields=Object.fromEntries(Object.entries(current.panels.storyboard.fields).reverse());
  assert.equal(undo.proposal(current).draft.panels.storyboard.fields['mv-title'],mv.title);
});
test('undo clear and invalid contract refuse without manufacturing proposals',()=>{
  const undo=U.createUndo();assert.equal(undo.proposal(draft()),null);assert.throws(()=>undo.record(draft(),draft(),'audio'));
  const bad=draft();bad.schema_version=999;assert.throws(()=>undo.record(bad,draft()));
  undo.record(draft(),draft());undo.clear();assert.equal(undo.proposal(draft()),null);
});
