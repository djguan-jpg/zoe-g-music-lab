// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const P=require('../web/mv-project.js'),C=require('../contracts/draft-v3.json');
function draft() {
  const panels=Object.fromEntries(Object.entries(C.fields).map(([p,fields])=>[p,{fields:Object.fromEntries(fields.map(f=>[f,'']))}]));
  for(const [p,row] of Object.entries(C.rows))panels[p][row.key]=[];
  panels.music.avoid=[];panels.music.deliverables=[];panels.storyboard.motifs=[];
  panels.audio.fields['audio-profile']='video';panels.lyrics.fields['lyrics-format']='.json';
  return {format:C.format,schema_version:3,tool_version:'0.171.0',saved_at:'2026-10-09T00:00:00Z',tab:'storyboard',panels};
}
const file=(name,type,bytes)=>({name,type,size:bytes.length,arrayBuffer:async()=>Uint8Array.from(bytes).buffer});
async function project() {
  const d=P.seed(draft(),'  原文 🎵  \n下一句',1,4,'合成 MV');
  return {format:'zoe-mv-project',schema_version:1,draft:d,shot_ids:['shot-1'],audio:await P.pack(file('tone.wav','audio/wav',[1,2,3])),images:[{shot_id:'shot-1',asset:await P.pack(file('art.png','image/png',[4,5,6]))}]};
}
test('media project roundtrip preserves raw creative values IDs and exact media bytes',async()=>{
  const p=await project(),before=structuredClone(p),loaded=await P.materialize(P.parse(JSON.stringify(p)));
  assert.deepEqual(Array.from(loaded.audio.bytes),[1,2,3]);assert.deepEqual(Array.from(loaded.images[0].bytes),[4,5,6]);assert.equal(loaded.project.draft.panels.lyrics.cues[0].text,'  原文 🎵  ');assert.deepEqual(p,before);
  loaded.project.draft.panels.music.fields['music-title']='changed';assert.deepEqual(p,before);
});
test('media project rejects duplicate keys unknown shape versions and stale shot binding before mutation',async()=>{
  const p=await project();assert.throws(()=>P.parse(JSON.stringify(p).replace('"schema_version":1','"schema_version":1,"schema_version":1')));
  for(const mutate of [v=>v.schema_version=2,v=>v.extra=true,v=>v.shot_ids.push('shot-1'),v=>v.shot_ids[0]='../shot',v=>v.images[0].shot_id='gone',v=>v.images.push(structuredClone(v.images[0])),v=>v.audio.name='../secret',v=>v.audio.type='text/plain',v=>v.images[0].asset.type='image/svg+xml']){const v=structuredClone(p);mutate(v);assert.throws(()=>P.validate(v));}
});
test('media hashes size canonical base64 and file-read size all refuse corrupted input',async()=>{
  const p=await project();
  for(const mutate of [v=>v.audio.sha256='0'.repeat(64),v=>v.audio.base64='AQIE',v=>v.audio.size=2,v=>v.audio.base64='AB==']){const v=structuredClone(p);mutate(v);await assert.rejects(()=>P.materialize(v));}
  await assert.rejects(()=>P.pack({name:'x.wav',type:'audio/wav',size:3,arrayBuffer:async()=>new ArrayBuffer(2)}));
  await assert.rejects(()=>P.pack({name:'x.wav',type:'audio/wav',size:P.limits.media+1,arrayBuffer:()=>{throw Error('should not read');}}));
});
test('uniform seed closes complete milliseconds and preserves plain-text Unicode spacing without guessing speech',()=>{
  const original=draft(),copy=structuredClone(original),seed=P.seed(original,'  a 🎵  \r\n\r\nb  b\nend',3,4.001,'title');
  assert.deepEqual(original,copy);assert.equal(seed.panels.lyrics.fields['lyrics-source'],'  a 🎵  \r\n\r\nb  b\nend');assert.deepEqual(seed.panels.lyrics.cues.map(e=>e.end),['1.333','2.667','4.001']);assert.equal(seed.panels.lyrics.cues[0].text,'  a 🎵  ');assert.equal(seed.panels.storyboard.shots.at(-1).end,'4.001');
  assert.equal(P.seed(original,'',0,4,'title').panels.storyboard.shots.length,1);
  for(const args of [['a\nb',2,.001,'title'],['a',65,4,'title'],['a',1,601,'title'],['a',1,4,'']])assert.throws(()=>P.seed(original,...args));
});

test('uniform draft uses shared field-whitespace rules while keeping the entire original lyric source',()=>{
 const text='\u0085\n\u001c\n\ufeff\n  歌詞  ';
 const d=P.seed(draft(),text,0,4,'title');assert.equal(d.panels.lyrics.fields['lyrics-source'],text);assert.deepEqual(d.panels.lyrics.cues.map(e=>e.text),['\ufeff','  歌詞  ']);
});

test('actual app row allocator skips imported live IDs and remains finite at the numeric boundary',()=>{
 const fs=require('node:fs'),vm=require('node:vm'),source=fs.readFileSync(require.resolve('../web/app.js'),'utf8');
 const code=source.slice(source.indexOf('let rowSequence=0;'),source.indexOf('const collections='));
 const shots={children:[{dataset:{historyId:'row-1'}},{dataset:{historyId:'row-9007199254740990'}}]},ctx=vm.createContext({collections:{shots:{}},$:()=>shots});
 vm.runInContext(code,ctx);assert.deepEqual(Array.from(vm.runInContext('rowIds([{},{}])',ctx)),['row-2','row-3']);
 shots.children.push({dataset:{historyId:'row-4'}});assert.deepEqual(Array.from(vm.runInContext('rowIds([{}])',ctx)),['row-5']);
 vm.runInContext('rowSequence=1000000000',ctx);assert.deepEqual(Array.from(vm.runInContext('rowIds([{}])',ctx)),['row-2']);
 assert.deepEqual(Array.from(vm.runInContext("rowIds([{}],['external-id'])",ctx)),['external-id']);
});
