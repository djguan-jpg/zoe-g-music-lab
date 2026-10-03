// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),{spawnSync}=require('node:child_process');
const J=require('../musiclab/assets/json-document.js'),P=require('../musiclab/assets/lyrics-package.js');
const Editor=require('../web/editor-state.js'),Planning=require('../web/planning-import.js'),Seed=require('../web/storyboard-seed.js');
const bytes=s=>new TextEncoder().encode(s),file=(s,name='brief.json')=>new File([s],name);
const music=JSON.parse(fs.readFileSync('examples/first-light-music.json','utf8'));
function draft(){
  const panels={};for(const [name,fields] of Object.entries(Editor.draftFields)){
    panels[name]={fields:Object.fromEntries(fields.map(field=>[field,'']))};
    if(Editor.draftRows[name])panels[name][Editor.draftRows[name].key]=[];
  }
  panels.music.avoid=[];panels.music.deliverables=[];panels.storyboard.motifs=[];
  panels.lyrics.fields['lyrics-format']='.lrc';panels.audio.fields['audio-profile']='video';
  return {format:'zoe-music-lab-draft',schema_version:3,tool_version:'0.20.0',saved_at:'synthetic',tab:'music',panels};
}
function python(source,input){
  const p=spawnSync('python',['-X','utf8','-c',source],{input,encoding:'utf8'});assert.equal(p.status,0,p.stderr?.slice(-300));return JSON.parse(p.stdout);
}
const seedResult=python("import json;from musiclab.application import build;from pathlib import Path;print(json.dumps(build('storyboard_seed',{'music':json.loads(Path('examples/first-light-music.json').read_text(encoding='utf-8')),'fps':24,'bars_per_shot':4}).wire(),ensure_ascii=False))");

test('JSON preserves Unicode repeated lyric strings and literal key-like text',()=>{
  const data={title:'原創🎵',lines:['重複','重複','literal "schema_version":999\r\n'],a:[null,true,2.5]};assert.deepEqual(J.parse(JSON.stringify(data)),data);
});
test('duplicate keys nested escaped and prototype names refuse before losing first values',()=>{
  for(const raw of ['{"a":1,"a":2}','{"payload":{"version":999,"version":1}}','{"v":0,"\\u0076":1}','{"__proto__":{},"__proto__":{}}'])assert.throws(()=>J.parse(raw),/重複/);
});
test('nonfinite malformed tokens and escaped lone Unicode surrogates refuse',()=>{
  for(const raw of ['NaN','Infinity','1e999','-1e999','{"a":1,}','{} {}','[]x','{"a":"\\ud800"}','{"\\udfff":1}','"\ud800"'])assert.throws(()=>J.parse(raw));
  assert.equal(J.parse('"\\ud83c\\udfb5"'),'🎵');
});
test('explicit BOM and depth limits preserve literal internal BOM',()=>{
  assert.deepEqual(J.parse('\ufeff{}',{allowBOM:true}),{});assert.throws(()=>J.parse('\ufeff{}'));
  assert.throws(()=>J.parse('\ufeff\ufeff{}',{allowBOM:true}));assert.equal(J.parse('"\ufefftitle"'),'\ufefftitle');
  J.parse('['.repeat(64)+'0'+']'.repeat(64));assert.throws(()=>J.parse('['.repeat(65)+'0'+']'.repeat(65)),/過深/);
});
test('native byte decode rejects lossy UTF8 size mismatches and byte overflow',async()=>{
  const original=file('\ufeff{"title":"原創"}'),raw=await original.arrayBuffer();assert.deepEqual(J.decode(raw,{size:original.size}),{title:'原創'});
  assert.throws(()=>J.decode(raw,{size:original.size-1}),/大小/);assert.throws(()=>J.decode(raw,{size:original.size,maxBytes:original.size-1}),/上限/);
  const broken=new File([new Uint8Array([0xff]),'{}'],'broken.json');assert.throws(()=>J.decode(new Uint8Array([0xff]).buffer,{size:1}),/UTF-8/);assert.ok((await broken.text()).includes('�'));
});
test('Python and JavaScript classify a shared external corpus identically',()=>{
  const corpus=['{}','{"title":"原創🎵"}','{"x":"\\ud800"}','{"a":1,"a":2}','{"x":1e999}','\ufeff{}','[1,true,null]','['.repeat(65)+'0'+']'.repeat(65)];
  const py=python("import json,sys;from musiclab.json_document import decode_json;out=[]\nfor raw in json.load(sys.stdin):\n try:decode_json(raw,allow_bom=True);out.append(True)\n except ValueError:out.append(False)\nprint(json.dumps(out))",JSON.stringify(corpus));
  assert.deepEqual(corpus.map(raw=>{try{J.parse(raw,{allowBOM:true});return true;}catch{return false;}}),py);
});
test('lyrics JSON wrapper delegates strict parse without changing package provenance',()=>{
  assert.throws(()=>P.parseDocument('{"schema_version":999,"schema_version":1}'),/重複/);
  assert.deepEqual(P.parseDocument('{"cues":[]}'),{cues:[]});
});
test('browser globals load common document before dependent modules and standalone embeds it',()=>{
  const context={TextEncoder,TextDecoder,structuredClone};vm.createContext(context);
  for(const name of ['json-document.js','lyric-time.js','lyrics-package.js'])vm.runInContext(fs.readFileSync('musiclab/assets/'+name,'utf8'),context);
  assert.throws(()=>context.MusicLyricsPackage.parseDocument('{"a":0,"a":1}'),/重複/);
  const html=fs.readFileSync('web/index.html','utf8');assert.ok(html.indexOf('/json-document.js')<html.indexOf('/planning-import.js'));
  const preview=python("import json;from musiclab.application import build;print(json.dumps(build('lyrics',{'cues':[{'start':0,'end':1,'text':'Synthetic'}],'duration':2}).files['preview.html']))");
  assert.ok(preview.indexOf('root.MusicJsonDocument=api')<preview.indexOf('root.MusicLyricsPackage=api'));
});
test('planning native invalid UTF8 and duplicate fields make no request and good BOM retries',async()=>{
  let calls=0,ready=0;const errors=[],reader=Planning.createBriefImport({validate:async(_,value)=>{calls++;return value;},onReady:()=>ready++,onError:e=>errors.push(e.message)});
  const json=JSON.stringify(music);const bad=file(new Uint8Array([...bytes('{"title":"'),0xff,...bytes('original"}')]),'broken.json');
  assert.equal(await reader.read(bad,'music'),false);assert.equal(await reader.read(file('{"title":"discarded",'+json.slice(1)),'music'),false);assert.equal(calls,0);
  assert.match(errors[0],/UTF-8/);assert.match(errors[1],/重複/);assert.equal(await reader.read(file('\ufeff'+json),'music'),true);assert.equal(calls,1);assert.equal(ready,1);
});
test('file metadata mismatch refuses and native text method is never used',async()=>{
  let called=0;const errors=[],reader=Planning.createBriefImport({validate:async()=>called++,onReady:()=>{},onError:e=>errors.push(e.message)});
  assert.equal(await reader.read({name:'synthetic.json',size:2,arrayBuffer:async()=>bytes('{"x":1}').buffer,text:()=>{throw Error('must not use lossy text');}},'music'),false);assert.equal(called,0);assert.match(errors[0],/大小/);
});
test('native storyboard seed rejects duplicate and invalid Unicode before requesting then accepts real domain source',async()=>{
  let calls=0,ready=0;const value={draft:draft(),fps:'24',bars_per_shot:'4'};
  const c=Seed.createPreview({capture:()=>value,request:async()=>{calls++;return structuredClone(seedResult);},onReady:()=>ready++,onClear:()=>{}});
  const json=JSON.stringify(seedResult.data);await assert.rejects(c.read(file('{"schema_version":999,'+json.slice(1),'seed.json')),/重複/);
  await assert.rejects(c.read(file(json.replace(seedResult.data.title,'\\ud800'),'seed.json')),/無效 Unicode/);
  assert.equal(calls,0);assert.equal(await c.read(file('\ufeff'+json,'seed.json')),true);assert.equal(calls,1);assert.equal(ready,1);
});
test('preserved requirements roundtrip after strict bytes and invalid replacement keeps untouched draft',async()=>{
  const value=draft(),before=structuredClone(value);let ready;
  const reader=Planning.createBriefImport({validate:async(_op,brief)=>{ready=Planning.planningDraft(value,'music',brief);return brief;},onReady:()=>{},onError:()=>{}});
  const source={...music,avoid:['line1\nline2'],existing_lyrics:'重复\n重复\n'};
  assert.equal(await reader.read(file(JSON.stringify(source)),'music'),true);assert.equal(Planning.planningBrief(ready,'music').existing_lyrics,source.existing_lyrics);assert.deepEqual(value,before);
  assert.equal(await reader.read(file('{"title":"old","title":"new"}'),'music'),false);assert.deepEqual(value,before);
});
