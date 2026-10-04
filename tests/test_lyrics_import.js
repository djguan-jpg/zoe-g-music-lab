// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),{execFileSync}=require('node:child_process');
const E=require('../web/editor-state.js'),I=require('../web/lyrics-import.js'),U=require('../web/draft-undo.js');
const root=path.join(__dirname,'..'),lrc='[00:00.000]合成第一句\n[00:03.000]合成第二句\n',plain='  原創第一句  \r\n\r\n重複句\r\n重複句\r\n[副歌]\r\n';
const srt='1\n00:00:00,000 --> 00:00:02,000\n第一行\n第二行\n\n2\n00:00:03,000 --> 00:00:05,000\n結束\n';
function domain(operation,payload){return JSON.parse(execFileSync(process.platform==='win32'?'python':'python3',['-X','utf8','-c',
  'import json,sys;from musiclab.application import build;r=json.load(sys.stdin);print(json.dumps(build(r["operation"],r["payload"]).wire(),ensure_ascii=False))'],
  {cwd:root,input:JSON.stringify({operation,payload}),encoding:'utf8',timeout:10000}));}
const timed=domain('lyrics',{title:'校時測試',content:lrc,suffix:'.lrc',duration:10});
const seed=domain('lyrics_seed',{title:'校時測試',text:plain});
function draft(){
  const panels={};for(const [name,fields] of Object.entries(E.draftFields)){
    panels[name]={fields:Object.fromEntries(fields.map(f=>[f,'']))};if(E.draftRows[name])panels[name][E.draftRows[name].key]=[];
  }
  panels.music.avoid=[];panels.music.deliverables=[];panels.storyboard.motifs=[];panels.audio.fields['audio-profile']='video';
  Object.assign(panels.lyrics.fields,{'lyrics-format':'.lrc','lyrics-title':'校時測試','lyrics-duration':'10','lyrics-source':lrc});
  panels.lyrics.cues=[{start:'7',end:'8',text:'目前編修'}];
  return {format:'zoe-music-lab-draft',schema_version:3,tool_version:'0.18.0',saved_at:'2026-10-03',tab:'lyrics',panels};
}
function bytes(text){return new TextEncoder().encode(text).buffer;}
function file(name,text){const raw=bytes(text);return {name,size:raw.byteLength,arrayBuffer:async()=>raw};}
function deferred(){let resolve,reject;const promise=new Promise((yes,no)=>{resolve=yes;reject=no;});return {promise,resolve,reject};}
function harness(request){
  const value=draft(),ready=[],errors=[],states=[],requests=[],jobs=[];
  const c=I.createImport({capture:()=>value,request:request||((operation,payload)=>{requests.push({operation,payload});const job=deferred();jobs.push(job);return job.promise;}),
    onReady:view=>ready.push(view),onClear:()=>{},onError:e=>errors.push(e.message),onState:s=>states.push(s)});
  return {value,ready,errors,states,requests,jobs,c,resolve:data=>jobs.at(-1).resolve(structuredClone(data||timed))};
}
test('real Python LRC response is only a preview until proposal; current source, cues and audio condition remain',async()=>{
  const h=harness(),before=structuredClone(h.value),work=h.c.read(file('source.lrc',lrc));await Promise.resolve();h.resolve();assert.equal(await work,true);
  assert.deepEqual(h.value,before);assert.equal(h.ready[0].count,2);assert.match(h.ready[0].notice,/2 句結束/);assert.equal(h.ready[0].name,'source.lrc');
  const p=h.c.proposal();assert.deepEqual(p.draft.panels.lyrics.cues,[{start:'0',end:'3',text:'合成第一句'},{start:'3',end:'10',text:'合成第二句'}]);
  assert.equal(p.draft.panels.lyrics.fields['lyrics-duration'],'10');assert.equal(p.untimed,false);assert.deepEqual(p.files,timed.files);
});
test('real plain UTF8 BOM/CRLF file becomes source-preserving untimed JSON within existing draft3',async()=>{
  const h=harness(async(op,payload)=>domain(op,payload)),before=structuredClone(h.value);
  assert.equal(await h.c.read(file('歌詞.TXT','\uFEFF'+plain)),true);assert.deepEqual(h.value,before);
  const p=h.c.proposal();assert.equal(p.draft.schema_version,3);assert.equal(p.draft.panels.lyrics.fields['lyrics-format'],'.json');assert.equal(p.untimed,true);
  assert.deepEqual(p.draft.panels.lyrics.cues,seed.data.lines.map(l=>({start:'',end:'',text:l.text})));
  assert.equal(JSON.parse(p.draft.panels.lyrics.fields['lyrics-source']).source_text,plain);assert.equal(h.ready[0].convertedText,true);
});
test('real SRT multiline source remains intact while cue flattening and explicit endings are disclosed',async()=>{
  const h=harness(async(op,payload)=>domain(op,payload));assert.equal(await h.c.read(file('source.srt',srt)),true);
  const p=h.c.proposal();assert.equal(p.draft.panels.lyrics.fields['lyrics-source'],srt);assert.equal(p.draft.panels.lyrics.cues[0].text,'第一行 / 第二行');
  assert.equal(h.ready[0].multilineSrt,true);assert.equal(h.ready[0].rows[0].end,'2');
});
test('actual Agent/CLI timed JSON and seed JSON return through the same controller without altering source semantics',async()=>{
  for(const [name,text,untimed] of [['timed.json',timed.files['lyrics.json'],false],['seed.json',seed.files['lyrics-seed.json'],true]]){
    const h=harness(async(op,payload)=>domain(op,payload));assert.equal(await h.c.read(file(name,text)),true);assert.equal(h.c.proposal().untimed,untimed);
    if(untimed)assert.deepEqual(JSON.parse(h.c.proposal().draft.panels.lyrics.fields['lyrics-source']),seed.data);
    else assert.equal(h.c.proposal().draft.panels.lyrics.fields['lyrics-source'],text);
  }
});
test('slow file read cannot overwrite manual original text or submit an obsolete payload',async()=>{
  const h=harness(),wait=deferred(),raw=bytes(lrc),work=h.c.read({name:'slow.lrc',size:raw.byteLength,arrayBuffer:()=>wait.promise});
  h.value.panels.lyrics.fields['lyrics-source']='讀取期間的新原文';wait.resolve(raw);assert.equal(await work,false);
  assert.equal(h.requests.length,0);assert.equal(h.value.panels.lyrics.fields['lyrics-source'],'讀取期間的新原文');assert.match(h.errors.at(-1),/目前內容保留/);
});
test('slow read error after target edit becomes a preservation warning rather than obsolete transport failure',async()=>{
  const h=harness(),wait=deferred(),work=h.c.read({name:'slow.lrc',size:30,arrayBuffer:()=>wait.promise});h.value.panels.lyrics.cues[0].text='後續';wait.reject(Error('old read failure'));
  assert.equal(await work,false);assert.match(h.errors.at(-1),/目標.*修改/);assert.equal(h.errors.join('').includes('old read failure'),false);
});
test('late validation success or error after source/target edits cannot replace anything',async()=>{
  for(const failed of [false,true]){
    const h=harness(),work=h.c.inspectCurrent();h.value.panels.lyrics.cues[0].end='9';
    if(failed)h.jobs[0].reject(Error('old HTTP failure'));else h.resolve({bad:true});assert.equal(await work,false);assert.equal(h.ready.length,0);
    assert.equal(h.value.panels.lyrics.cues[0].end,'9');assert.match(h.errors.at(-1),/目前內容保留/);
  }
});
test('source read with newer file selection accepts only the newest and suppresses old read errors',async()=>{
  for(const failed of [false,true]){
    const h=harness(async(op,payload)=>domain(op,payload)),wait=deferred(),raw=bytes(lrc),old=h.c.read({name:'old.lrc',size:raw.byteLength,arrayBuffer:()=>wait.promise});
    assert.equal(await h.c.read(file('new.txt',plain)),true);
    if(failed)wait.reject(Error('expired'));else wait.resolve(raw);assert.equal(await old,false);assert.deepEqual(h.errors,[]);assert.equal(h.ready.length,1);assert.equal(h.ready[0].name,'new.txt');
  }
});
test('two pending HTTP checks cannot revive an older proposal or pending UI state',async()=>{
  const h=harness(),old=h.c.inspectCurrent(),next=h.c.inspectCurrent();h.jobs[0].reject(Error('old'));assert.equal(await old,false);assert.deepEqual(h.errors,[]);
  h.resolve();assert.equal(await next,true);assert.equal(h.ready.length,1);assert.deepEqual(h.states.at(-1),{reading:false,ready:true});
});
test('cancel during file reading or after preview preserves draft and suppresses stale callbacks',async()=>{
  const h=harness(),wait=deferred(),raw=bytes(lrc),before=structuredClone(h.value),work=h.c.read({name:'old.lrc',size:raw.byteLength,arrayBuffer:()=>wait.promise});
  h.c.cancel();wait.resolve(raw);assert.equal(await work,false);assert.deepEqual(h.value,before);assert.deepEqual(h.errors,[]);assert.equal(h.c.proposal(),null);
  const current=h.c.inspectCurrent();h.resolve();await current;h.c.cancel();assert.equal(h.c.proposal(),null);
});
test('external navigation/revision guard hides a late success before malformed response checks',async()=>{
  const h=harness();let current=true;const work=h.c.inspectCurrent(()=>current);current=false;h.resolve({bad:true});assert.equal(await work,false);assert.deepEqual(h.errors,[]);assert.equal(h.ready.length,0);
});
test('unrelated panels may change while preview runs and are merged at apply time',async()=>{
  const h=harness(),work=h.c.inspectCurrent();h.value.panels.music.fields['music-title']='其他新歌';h.value.panels.audio.fields['audio-profile']='distribution';h.resolve();await work;
  assert.equal(h.c.proposal().draft.panels.music.fields['music-title'],'其他新歌');assert.equal(h.c.proposal().draft.panels.audio.fields['audio-profile'],'distribution');
});
test('new title duration source words or time after preview block proposal and preserve the edit',async()=>{
  for(const edit of [d=>d.panels.lyrics.fields['lyrics-title']='新名',d=>d.panels.lyrics.fields['lyrics-duration']='11',
    d=>d.panels.lyrics.fields['lyrics-source']='新原文',d=>d.panels.lyrics.cues[0].text='新字',d=>d.panels.lyrics.cues[0].start='6']){
    const h=harness(),work=h.c.inspectCurrent();h.resolve();await work;edit(h.value);const changed=structuredClone(h.value);assert.throws(()=>h.c.proposal(),/目前內容保留/);assert.deepEqual(h.value,changed);
  }
});
test('unsupported names zero/oversize metadata invalid UTF8 and mismatched bytes fail before preview and support retry',async()=>{
  const h=harness(async(op,payload)=>domain(op,payload));
  const cases=[{name:'wrong.wav',size:1,arrayBuffer:()=>{throw Error('must not read');}},{name:'empty.lrc',size:0,arrayBuffer:()=>{throw Error('must not read');}},
    {name:'large.lrc',size:2*1024*1024+1,arrayBuffer:()=>{throw Error('must not read');}},{name:'large.txt',size:65540,arrayBuffer:()=>{throw Error('must not read');}},
    {name:'bad.txt',size:1,arrayBuffer:async()=>new Uint8Array([255]).buffer},{name:'changed.txt',size:2,arrayBuffer:async()=>bytes('abc')}];
  for(const f of cases){assert.equal(await h.c.read(f),false);assert.equal(h.ready.length,0);assert.equal(h.value.panels.lyrics.cues[0].text,'目前編修');}
  assert.ok(h.errors.some(e=>e.includes('UTF-8')));assert.equal(await h.c.read(file('good.txt',plain)),true);
});
test('TXT UTF8 byte cap, not character count, is enforced again after decoding',async()=>{
  const h=harness(async(op,payload)=>domain(op,payload));assert.equal(await h.c.read(file('limit.txt','x'.repeat(65536))),true);
  assert.equal(await h.c.read(file('large.txt','中'.repeat(21846))),false);assert.match(h.errors.at(-1),/64 KiB/);
});
test('BOM marker is removed once; literal second BOM and Unicode original text remain',async()=>{
  const h=harness(async(op,payload)=>domain(op,payload));assert.equal(await h.c.read(file('bom.txt','\uFEFF\uFEFF原文')),true);
  assert.equal(JSON.parse(h.c.proposal().draft.panels.lyrics.fields['lyrics-source']).source_text,'\uFEFF原文');
});
test('unknown JSON format seed version or malformed JSON never falls back to guessing a format',async()=>{
  const h=harness();for(const content of ['{','{"format":"future","cues":[]}',JSON.stringify({...seed.data,schema_version:2})]){
    assert.equal(await h.c.read(file('bad.json',content)),false);assert.equal(h.requests.length,0);assert.equal(h.ready.length,0);
  }
});
test('timed reply title duration metadata cues timing JSON file or required artifacts contradictions refuse',async()=>{
  for(const mutate of [r=>r.data.title='wrong',r=>r.data.duration=11,r=>r.data.duration_estimated=true,r=>r.meta.needs_review=false,r=>r.meta.protocol_version=2,
    r=>r.data.cues[0].start='0',r=>r.data.cues[0].end=0,r=>r.data.cues.reverse(),r=>r.data.timing.inferred_end_count=-1,
    r=>r.data.timing.duration_source='last_cue_end',r=>r.files['lyrics.json']='{}',r=>delete r.files['preview.html']]){
    const h=harness(),work=h.c.inspectCurrent(),reply=structuredClone(timed);mutate(reply);h.resolve(reply);assert.equal(await work,false);assert.equal(h.ready.length,0);assert.equal(h.value.panels.lyrics.cues[0].text,'目前編修');
  }
});
test('seed reply must match original plain source or inspected seed with review required',async()=>{
  for(const mutate of [r=>r.data.source_text+='wrong',r=>r.data.title='wrong',r=>r.meta.needs_review=false,r=>r.files['lyrics-seed.json']='{}']){
    const h=harness(),work=h.c.read(file('plain.txt',plain));await Promise.resolve();const reply=structuredClone(seed);mutate(reply);h.resolve(reply);assert.equal(await work,false);assert.equal(h.ready.length,0);
  }
});
test('response/request/view/proposal cloning prevents caller mutation from corrupting pending replacement',async()=>{
  const h=harness(),work=h.c.inspectCurrent();h.requests[0].payload.title='mutated request';const reply=structuredClone(timed);h.jobs[0].resolve(reply);await work;
  reply.data.cues[0].text='mutated response';h.ready[0].rows[0].text='mutated view';const first=h.c.proposal();first.draft.panels.lyrics.cues[0].text='mutated proposal';
  assert.equal(h.c.proposal().draft.panels.lyrics.cues[0].text,'合成第一句');
});
test('missing audio duration leaves field blank and discloses inferred ends without promoting them to provided duration',async()=>{
  const h=harness(async(op,payload)=>domain(op,payload));h.value.panels.lyrics.fields['lyrics-duration']='';assert.equal(await h.c.inspectCurrent(),true);
  assert.equal(h.c.proposal().draft.panels.lyrics.fields['lyrics-duration'],'');assert.match(h.ready[0].notice,/2 句結束/);
  assert.match(h.ready[0].notice,/歌曲總時長尚未由音檔確認/);assert.match(h.ready[0].notice,/加3秒估計/);
});
test('six-row preview does not truncate the full imported proposal',async()=>{
  const text=Array.from({length:10},(_,i)=>'第'+i+'句').join('\n'),h=harness(async(op,payload)=>domain(op,payload));
  assert.equal(await h.c.read(file('ten.txt',text)),true);assert.equal(h.ready[0].rows.length,6);assert.equal(h.ready[0].count,10);assert.equal(h.c.proposal().draft.panels.lyrics.cues.length,10);
});
test('scoped actual-after undo restores old lyric table but retains unrelated edits and refuses later cue edits',async()=>{
  const h=harness(),before=structuredClone(h.value),work=h.c.inspectCurrent();h.resolve();await work;const after=h.c.proposal().draft,undo=U.createUndo();undo.record(before,after,'lyrics');
  const current=structuredClone(after);current.panels.music.fields['music-title']='保留';assert.deepEqual(undo.proposal(current).draft.panels.lyrics,before.panels.lyrics);
  assert.equal(undo.proposal(current).draft.panels.music.fields['music-title'],'保留');current.panels.lyrics.cues[0].text='後續';assert.throws(()=>undo.proposal(current),/已有編修/);
});
test('actual LRC response preserves literal original through preview and proposal without touching draft',async()=>{
  const raw='\uFEFF[offset:125]\r\n[00:01]  字 [00:02] [offset:999]\t  \r[00:04]字\u0085後\u2028尾\u2029終',h=harness(async(op,payload)=>domain(op,payload)),before=structuredClone(h.value);
  assert.equal(await h.c.read(file('literal.LRC',raw)),true);assert.deepEqual(h.value,before);
  const p=h.c.proposal();assert.equal(p.draft.panels.lyrics.fields['lyrics-source'],raw);
  assert.deepEqual(p.draft.panels.lyrics.cues,[{start:'1.125',end:'4.125',text:'  字 [00:02] [offset:999]\t  '},{start:'4.125',end:'10',text:'字\u0085後\u2028尾\u2029終'}]);
});
test('self-consistent valid replacement LRC response cannot substitute words timing duration or inference',async()=>{
  const substitutes=[{cues:[{start:0,text:'改掉第一句'},{start:3,text:'合成第二句'}],duration:10},
    {cues:[{start:1,text:'合成第一句'},{start:3,text:'合成第二句'}],duration:10},
    {cues:[{start:0,end:2,text:'合成第一句'},{start:3,end:10,text:'合成第二句'}],duration:10},
    {cues:[{start:0,text:'合成第一句'}],duration:10}];
  for(const payload of substitutes){
    const h=harness(),before=structuredClone(h.value),work=h.c.inspectCurrent();h.resolve(domain('lyrics',{title:'校時測試',...payload}));
    assert.equal(await work,false);assert.equal(h.ready.length,0);assert.equal(h.c.proposal(),null);assert.deepEqual(h.value,before);assert.match(h.errors.at(-1),/來源不一致/);
  }
});
test('LRC response artifacts cannot substitute text independently of validated data',async()=>{
  for(const name of ['lyrics.lrc','lyrics.srt']){
    const h=harness(),before=structuredClone(h.value),work=h.c.inspectCurrent(),reply=structuredClone(timed);reply.files[name]=reply.files[name].replace('合成第一句','替換文字');h.resolve(reply);
    assert.equal(await work,false);assert.equal(h.c.proposal(),null);assert.deepEqual(h.value,before);assert.match(h.errors.at(-1),/來源不一致/);
  }
});
test('LRC last-start estimate and multi-tag offset are checked against source normalization',async()=>{
  const h=harness(async(op,payload)=>domain(op,payload));h.value.panels.lyrics.fields['lyrics-duration']='';
  const raw='[offset:125]\n[00:01.25][00:02.125]  字  ';assert.equal(await h.c.read(file('multi.lrc',raw)),true);
  assert.deepEqual(h.c.proposal().draft.panels.lyrics.cues,[{start:'1.375',end:'2.25',text:'  字  '},{start:'2.25',end:'5.25',text:'  字  '}]);
  assert.equal(h.c.proposal().draft.panels.lyrics.fields['lyrics-duration'],'');assert.match(h.ready[0].notice,/加3秒估計/);
});
test('LRC file BOM is not stripped twice across request and domain and retry remains possible',async()=>{
  const h=harness(async(op,payload)=>domain(op,payload));assert.equal(await h.c.read(file('two.lrc','\uFEFF\uFEFF[00:01]字')),false);assert.equal(h.ready.length,0);
  assert.equal(await h.c.read(file('one.lrc','\uFEFF[00:01]\uFEFF字')),true);assert.equal(h.c.proposal().draft.panels.lyrics.cues[0].text,'\uFEFF字');
});
function appAdapter(){
  const source=fs.readFileSync(path.join(root,'web/app.js'),'utf8'),a=source.indexOf("$('lyrics-file').onchange="),b=source.indexOf("$('cue-add').onclick=",a);
  assert.ok(a>=0&&b>a);const h=harness(async(op,payload)=>domain(op,payload)),nodes={'lyrics-file':{value:'selected'},'lyrics-import':{}},notices=[];
  const context={readValue:control=>control.value,$:id=>nodes[id],state:{tab:'lyrics',busy:false},lyricsSeedController:{cancel:()=>{}},lyricsImportController:h.c,
    say:m=>notices.push(m),run:async(_button,task)=>task(()=>true)};vm.runInNewContext(source.slice(a,b),context);
  return {...h,nodes,context,notices,choose:f=>nodes['lyrics-file'].onchange({target:{files:[f],value:'selected'}})};
}
test('actual file/Read DOM adapters delegate to preview and never write source or cue table',async()=>{
  const h=appAdapter(),before=structuredClone(h.value);assert.equal(await h.choose(file('plain.txt',plain)),undefined);
  assert.equal(h.ready[0].untimed,true);assert.deepEqual(h.value,before);assert.equal(h.c.proposal().untimed,true);
  await h.nodes['lyrics-import'].onclick();assert.equal(h.ready.at(-1).untimed,false);assert.deepEqual(h.value,before);
});
test('actual DOM file adapter closes baseline race with manual source edits while file bytes are pending',async()=>{
  const h=appAdapter(),wait=deferred(),raw=bytes(lrc),work=h.choose({name:'slow.lrc',size:raw.byteLength,arrayBuffer:()=>wait.promise});
  h.value.panels.lyrics.fields['lyrics-source']='讀取期間的新原文';wait.resolve(raw);await work;assert.equal(h.ready.length,0);assert.equal(h.value.panels.lyrics.fields['lyrics-source'],'讀取期間的新原文');
});
test('actual DOM file adapter accepts newest selection and keeps navigation/busy changes from importing',async()=>{
  const h=appAdapter(),wait=deferred(),raw=bytes(lrc),old=h.choose({name:'old.lrc',size:raw.byteLength,arrayBuffer:()=>wait.promise});
  await h.choose(file('new.txt',plain));wait.resolve(raw);await old;assert.equal(h.ready.length,1);assert.equal(h.ready[0].name,'new.txt');
  h.context.state.busy=true;await h.choose(file('busy.txt',plain));assert.match(h.notices.at(-1),/尚未完成/);assert.equal(h.ready.length,1);
});
