// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const Editor=require('../web/editor-state.js');
const {planningDraft,planningBrief,createBriefImport}=require('../web/planning-import.js');
function draft(){
  const panels={};for(const [name,fields] of Object.entries(Editor.draftFields)){
    panels[name]={fields:Object.fromEntries(fields.map(field=>[field,'']))};
    if(Editor.draftRows[name])panels[name][Editor.draftRows[name].key]=[];
  }
  panels.music.avoid=[];panels.music.deliverables=[];panels.storyboard.motifs=[];
  panels.lyrics.fields['lyrics-format']='.lrc';panels.audio.fields['audio-profile']='video';
  return {format:'zoe-music-lab-draft',schema_version:3,tool_version:'0.6.0',saved_at:'2026-10-03',tab:'lyrics',panels};
}
function example(operation){return JSON.parse(fs.readFileSync(path.join(__dirname,`../examples/first-light-${operation==='music'?'music':'mv'}.json`),'utf8'));}
test('music handoff preserves language, multiline requirements and unrelated unfinished edits',()=>{
  const current=draft(),brief=example('music'),original=structuredClone(current);
  current.panels.lyrics.fields['lyrics-source']='合成原文：保留未完成編修';
  brief.language='English';brief.avoid=['avoid A\nkeep this as one item'];brief.deliverables=['two choruses','arrangement notes'];
  const loaded=planningDraft(current,'music',brief),returned=planningBrief(loaded,'music');
  assert.equal(returned.language,'English');assert.deepEqual(returned.avoid,brief.avoid);assert.deepEqual(returned.deliverables,brief.deliverables);
  assert.deepEqual(loaded.panels.lyrics,current.panels.lyrics);assert.deepEqual(loaded.panels.audio,current.panels.audio);
  assert.equal(current.panels.music.fields['music-title'],original.panels.music.fields['music-title']);
  assert.deepEqual(returned.arrangement.map(s=>s.focus),brief.arrangement.map(s=>s.focus));
});
test('storyboard handoff establishes stable motif identity and roundtrips all editable details',()=>{
  const brief=example('storyboard');brief.motifs.push({name:'信封',meaning:'回應'});brief.shots[1].motif='信封';
  const loaded=planningDraft(draft(),'storyboard',brief),returned=planningBrief(loaded,'storyboard');
  assert.equal(loaded.panels.storyboard.shots[1].motif_id,'motif-2');
  assert.deepEqual(returned.motifs,brief.motifs);assert.equal(returned.shots[1].motif,'信封');
  assert.deepEqual(returned.shots.map(s=>s.visual),brief.shots.map(s=>s.visual));
});
test('wrong operation, unknown fields and unsupported shapes never replace current input',()=>{
  const current=draft(),before=structuredClone(current),brief=example('music');
  assert.throws(()=>planningDraft(current,'audio',brief),/只支援/);
  assert.throws(()=>planningDraft(current,'storyboard',brief),/未支援/);
  brief.unrepresented='must not disappear';assert.throws(()=>planningDraft(current,'music',brief),/未支援/);
  delete brief.unrepresented;brief.arrangement[0].unknown='must not disappear';assert.throws(()=>planningDraft(current,'music',brief),/未支援/);
  assert.deepEqual(current,before);
});
test('unrepresentable ratio, absent motif and oversized requirements fail before loading',()=>{
  const mv=example('storyboard');mv.aspect_ratio='3:2';assert.throws(()=>planningDraft(draft(),'storyboard',mv),/畫幅/);
  mv.aspect_ratio='16:9';mv.shots[0].motif='不存在';assert.throws(()=>planningDraft(draft(),'storyboard',mv),/未登記/);
  const music=example('music');music.deliverables=Array(101).fill('item');assert.throws(()=>planningDraft(draft(),'music',music),/100/);
});
test('incomplete requirements remain valid drafts but cannot produce a misleading completed brief',()=>{
  const loaded=planningDraft(draft(),'music',example('music'));
  loaded.panels.music.avoid.push('');assert.doesNotThrow(()=>Editor.validateDraft(loaded));
  assert.throws(()=>planningBrief(loaded,'music'),/避免事項 3 不可空白/);
  loaded.panels.music.avoid.pop();loaded.panels.music.deliverables=[];
  assert.doesNotThrow(()=>Editor.validateDraft(loaded));assert.throws(()=>planningBrief(loaded,'music'),/至少需要/);
});
test('new file selection suppresses stale validation results and late errors',async()=>{
  let failOld;let visible=null;const errors=[];
  const oldValidation=new Promise((_,reject)=>{failOld=reject;});
  const reader=createBriefImport({validate:async(_,brief)=>brief.title==='old'?oldValidation:brief,
    onReady:result=>visible=result,onError:error=>errors.push(error.message)});
  const old=reader.read({name:'old.json',size:10,text:async()=>' {"title":"old"}'},'music');
  await Promise.resolve();await Promise.resolve();
  await reader.read({name:'new.json',size:10,text:async()=>' {"title":"new"}'},'music');
  failOld(Error('late failure'));await old;
  assert.equal(visible.result.title,'new');assert.deepEqual(errors,[]);
});
test('late successful validation cannot replace the newest ready preview',async()=>{
  let finish;const oldValidation=new Promise(resolve=>finish=resolve);let visible;
  const reader=createBriefImport({validate:async(_,brief)=>brief.title==='old'?oldValidation:brief,
    onReady:result=>visible=result,onError:error=>{throw error;}});
  const old=reader.read({name:'old.json',size:10,text:async()=>'{"title":"old"}'},'music');
  await Promise.resolve();await Promise.resolve();
  await reader.read({name:'new.json',size:10,text:async()=>'{"title":"new"}'},'music');
  finish({title:'old'});assert.equal(await old,false);assert.equal(visible.result.title,'new');
});
test('explicit cancel and invalid file selection discard pending handoff',async()=>{
  let finish;const delayed=new Promise(resolve=>finish=resolve);let count=0;const errors=[];
  const reader=createBriefImport({validate:async(_,brief)=>brief,onReady:()=>count++,onError:error=>errors.push(error.message)});
  const pending=reader.read({name:'old.json',size:10,text:()=>delayed},'music');reader.cancel();finish('{"title":"old"}');
  assert.equal(await pending,false);assert.equal(count,0);
  assert.equal(await reader.read({name:'too-large.json',size:1024*1024+1,text:async()=>''},'music'),false);
  assert.match(errors[0],/1 MiB/);
  assert.equal(await reader.read({name:'wrong.txt',size:4,text:async()=>''},'music'),false);
  assert.equal(await reader.read({name:'bad.json',size:4,text:async()=>'[]'},'music'),false);
  assert.equal(count,0);
});
