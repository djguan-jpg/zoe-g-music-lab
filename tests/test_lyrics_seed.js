// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),path=require('node:path'),{execFileSync}=require('node:child_process');
const E=require('../web/editor-state.js'),S=require('../web/lyrics-seed.js'),U=require('../web/draft-undo.js');
const source='  合成第一句  \r\n\r\n合成第二句\n合成第二句\r[副歌]\n';
const result=JSON.parse(execFileSync(process.platform==='win32'?'python':'python3',['-X','utf8','-c',
  "import json,sys;from musiclab.application import build;print(json.dumps(build('lyrics_seed',json.load(sys.stdin)).wire(),ensure_ascii=False))"],
  {cwd:path.join(__dirname,'..'),input:JSON.stringify({title:'測試',text:source}),encoding:'utf8',timeout:10000}));
function draft(){
  const panels={};for(const [name,fields] of Object.entries(E.draftFields)){
    panels[name]={fields:Object.fromEntries(fields.map(f=>[f,'']))};if(E.draftRows[name])panels[name][E.draftRows[name].key]=[];
  }
  panels.music.avoid=[];panels.music.deliverables=[];panels.storyboard.motifs=[];panels.audio.fields['audio-profile']='video';
  Object.assign(panels.music.fields,{'music-title':'測試','music-lyrics':source});
  Object.assign(panels.lyrics.fields,{'lyrics-format':'.srt','lyrics-title':'原來','lyrics-duration':'10','lyrics-source':'原稿'});
  panels.lyrics.cues=[{start:'0',end:'1',text:'之前'}];
  return E.validateDraft({format:'zoe-music-lab-draft',schema_version:3,tool_version:'0.17.0',saved_at:'2026-10-03',tab:'music',panels});
}
function harness(){
  const value=draft(),ready=[],requests=[],jobs=[];
  const controller=S.createPreview({capture:()=>value,request:p=>{requests.push(p);return new Promise((resolve,reject)=>jobs.push({resolve,reject}));},
    onReady:(data,files,origin)=>ready.push({data,files,origin}),onClear:()=>{}});
  return {value,ready,requests,jobs,c:controller,resolve:()=>jobs.at(-1).resolve(structuredClone(result))};
}
test('actual Python seed preserves raw lines in blank-time schema3 draft and leaves unrelated panels intact',()=>{
  const before=draft(),proposal=S.seedDraft(before,result.data);
  assert.equal(proposal.schema_version,3);assert.equal(proposal.panels.lyrics.fields['lyrics-duration'],'10');assert.equal(proposal.panels.lyrics.fields['lyrics-format'],'.json');
  assert.equal(JSON.parse(proposal.panels.lyrics.fields['lyrics-source']).source_text,source);
  assert.deepEqual(proposal.panels.lyrics.cues,result.data.lines.map(l=>({start:'',end:'',text:l.text})));
  for(const panel of ['music','storyboard','audio'])assert.deepEqual(proposal.panels[panel],before.panels[panel]);assert.equal(before.panels.lyrics.cues[0].text,'之前');
});
test('unknown versions statuses extra times lost whitespace repeats and wrong source lines refuse',()=>{
  for(const change of [s=>s.schema_version=2,s=>s.schema_version=true,s=>s.status='timed',s=>s.start=0,s=>s.lines[0].start=0,
    s=>s.lines[0].text=s.lines[0].text.trim(),s=>s.lines[0].line=true,s=>s.lines.pop(),s=>s.review_notes=[],s=>s.source_text+='later',s=>s.title=' '.repeat(200)+'x']){
    const data=structuredClone(result.data);change(data);assert.throws(()=>S.validateSeed(data),/不完整|版本/);
  }
});
test('byte limit is UTF8 and blank-only Unicode input refuses consistently',()=>{
  for(const raw of ['中'.repeat(21846),'\u0085\u3000\n']){const data=structuredClone(result.data);data.source_text=raw;assert.throws(()=>S.validateSeed(data));}
});
test('Python and browser agree on Unicode blank lines and title whitespace without rewriting lyric text',()=>{
  const payloads=[{title:'\u0085測試\u001c',text:'\u0085\nA\u2028B\n\u3000\n\u001c'},
    {title:'\uFEFF',text:'\uFEFF'}, {title:'🎵'.repeat(200),text:'原文'}];
  const replies=JSON.parse(execFileSync(process.platform==='win32'?'python':'python3',['-X','utf8','-c',
    "import json,sys;from musiclab.application import build;print(json.dumps([build('lyrics_seed',p).data for p in json.load(sys.stdin)],ensure_ascii=False))"],
    {cwd:path.join(__dirname,'..'),input:JSON.stringify(payloads),encoding:'utf8',timeout:10000}));
  replies.forEach(data=>assert.deepEqual(S.validateSeed(data),data));
  assert.equal(replies[0].lines[0].text,'A\u2028B');assert.equal(replies[1].title,'\uFEFF');
});
test('preview clones request and requires explicit apply without replacing current data',async()=>{
  const h=harness(),before=structuredClone(h.value),work=h.c.inspect();assert.equal(h.c.proposal(),null);h.resolve();assert.equal(await work,true);
  assert.deepEqual(h.requests[0],{title:'測試',text:source});assert.deepEqual(h.value,before);assert.equal(h.ready[0].origin,'music');assert.equal(h.c.proposal().panels.lyrics.cues.length,4);
});
test('late source changes discard even malformed results and errors',async()=>{
  for(const failed of [false,true]){const h=harness(),work=h.c.inspect();h.value.panels.music.fields['music-lyrics']='後續';
    if(failed)h.jobs[0].reject(Error('old failure'));else h.jobs[0].resolve({bad:true});assert.equal(await work,false);assert.equal(h.ready.length,0);}
});
test('target edits during HTTP preserve edits and surface repreview message',async()=>{
  const h=harness(),work=h.c.inspect();h.value.panels.lyrics.cues[0].text='後續';h.resolve();await assert.rejects(work,/目標.*修改/);
  assert.equal(h.ready.length,0);assert.equal(h.value.panels.lyrics.cues[0].text,'後續');
});
test('apply after source or target edit refuses without discarding the edit',async()=>{
  for(const panel of ['music','lyrics']){const h=harness(),work=h.c.inspect();h.resolve();await work;
    h.value.panels[panel].fields[panel==='music'?'music-title':'lyrics-title']='後續';assert.throws(()=>h.c.proposal(),/已有修改/);}
});
test('other panel edits and navigation remain in a current scoped proposal',async()=>{
  const h=harness(),work=h.c.inspect();h.value.panels.storyboard.fields['mv-title']='保留';h.value.panels.audio.fields['audio-profile']='distribution';h.value.tab='audio';
  h.resolve();assert.equal(await work,true);const proposal=h.c.proposal();assert.equal(proposal.panels.storyboard.fields['mv-title'],'保留');assert.equal(proposal.panels.audio.fields['audio-profile'],'distribution');
});
test('Agent JSON seed inspection accepts source music edits and keeps selected raw seed',async()=>{
  const h=harness(),seed=structuredClone(result.data),work=h.c.inspectSeed(seed);h.value.panels.music.fields['music-title']='另一作品';seed.lines[0].text='caller mutation';h.resolve();
  assert.equal(await work,true);assert.equal(h.ready[0].origin,'file');assert.equal(h.c.proposal().panels.music.fields['music-title'],'另一作品');assert.equal(h.c.proposal().panels.lyrics.cues[0].text,'  合成第一句  ');
});
test('mismatched source meta and JSON file reject before any preview is accepted',async()=>{
  for(const change of [r=>r.data.title='錯誤',r=>r.meta.needs_review=false,r=>r.meta.protocol_version=2,r=>r.files['lyrics-seed.json']='{}',r=>delete r.files['lyrics-seed.md']]){
    const h=harness(),work=h.c.inspect(),data=structuredClone(result);change(data);h.jobs[0].resolve(data);await assert.rejects(work);assert.equal(h.ready.length,0);}
});
test('cancelled and obsolete success or errors cannot revive a preview',async()=>{
  for(const failed of [false,true]){const h=harness(),work=h.c.inspect();h.c.cancel();if(failed)h.jobs[0].reject(Error('old'));else h.resolve();assert.equal(await work,false);assert.equal(h.c.proposal(),null);}
});
test('two concurrent calls accept only the newest result',async()=>{
  const h=harness(),first=h.c.inspect(),second=h.c.inspect();h.jobs[0].resolve({bad:true});assert.equal(await first,false);
  h.jobs[1].resolve(structuredClone(result));assert.equal(await second,true);assert.equal(h.ready.length,1);
});
test('current failures surface and a subsequent call recovers',async()=>{
  const h=harness(),work=h.c.inspect();h.jobs[0].reject(Error('current'));await assert.rejects(work,/current/);
  const retry=h.c.inspect();h.resolve();assert.equal(await retry,true);
});
test('external revision guard discards a late response',async()=>{
  let current=true;const h=harness(),work=h.c.inspect(()=>current);current=false;h.resolve();assert.equal(await work,false);assert.equal(h.ready.length,0);
});
test('lyric-scoped undo retains later unrelated edits and refuses edited time or wording',()=>{
  const before=draft(),after=S.seedDraft(before,result.data),undo=U.createUndo();undo.record(before,after,'lyrics');
  const current=structuredClone(after);current.panels.storyboard.fields['mv-title']='保留';assert.deepEqual(undo.proposal(current).draft.panels.lyrics,before.panels.lyrics);
  assert.equal(undo.proposal(current).draft.panels.storyboard.fields['mv-title'],'保留');
  for(const field of ['start','end','text']){const changed=structuredClone(after);changed.panels.lyrics.cues[0][field]='1';assert.throws(()=>undo.proposal(changed),/已有編修/);}
});
