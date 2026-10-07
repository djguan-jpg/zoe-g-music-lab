// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),{execFileSync}=require('node:child_process');
const T=require('../musiclab/assets/lyric-time.js'),M=require('../musiclab/assets/lyrics-media.js'),I=require('../web/lyrics-import.js'),E=require('../web/editor-state.js');
const {createTimingController,orderedEntries}=require('../web/lyrics-timing.js'),{stamp}=require('../web/cue-stamp.js');
function draft(duration){const panels={};for(const [name,fields] of Object.entries(E.draftFields)){panels[name]={fields:Object.fromEntries(fields.map(f=>[f,'']))};if(E.draftRows[name])panels[name][E.draftRows[name].key]=[];}panels.music.avoid=[];panels.music.deliverables=[];panels.storyboard.motifs=[];panels.audio.fields['audio-profile']='video';Object.assign(panels.lyrics.fields,{'lyrics-title':'合成原句','lyrics-format':'.lrc','lyrics-duration':duration});return {format:'zoe-music-lab-draft',schema_version:3,tool_version:'0.18.0',saved_at:'2026-10-03',tab:'lyrics',panels};}
function timing(duration='10',request=async p=>({cues:p.cues.map(c=>({...c,start:c.start+p.shift_seconds,end:c.end+p.shift_seconds}))})){
 const value={duration,entries:[{id:'a',value:{start:'1',end:'2',text:'原句'}}]},errors=[],previews=[],writes=[];
 const c=createTimingController({request,snapshot:()=>value,applyTimes:e=>{writes.push(e);value.entries=e.map(x=>({id:x.id,value:{...value.entries.find(y=>y.id===x.id).value,...x.value}}));},onPreview:p=>previews.push(p),onApplied:()=>{},onUndone:()=>{},onError:e=>errors.push(e.message),onState:()=>{}});
 return {value,c,errors,previews,writes};
}
test('decimal acceptance matches Python for every strip whitespace, BOM and separator combination',()=>{
 const chars=[...Array.from({length:5},(_,i)=>String.fromCharCode(9+i)),...Array.from({length:5},(_,i)=>String.fromCharCode(28+i)),...['\u0085','\u00a0','\u1680',...Array.from({length:11},(_,i)=>String.fromCharCode(8192+i)),'\u2028','\u2029','\u202f','\u205f','\u3000','\ufeff','\u200b','\u180e']];
 const cases=chars.flatMap(c=>[c,c+'1.2345'+c,c+'-1e-999'+c]),before=[...cases];
 const code="import json,sys;from musiclab.lyric_timing import normalized_seconds;rows=[]\nfor v in json.load(sys.stdin):\n try:rows.append({'ok':True,'value':normalized_seconds(v,nonnegative=True)})\n except ValueError:rows.append({'ok':False})\nprint(json.dumps(rows))";
 const expected=JSON.parse(execFileSync(process.platform==='win32'?'python':'python3',['-X','utf8','-c',code],{input:JSON.stringify(cases),encoding:'utf8',timeout:10000}));
 assert.deepEqual(cases.map(v=>{try{return {ok:true,value:T.normalize(v,'時間',true)};}catch{return {ok:false};}}),expected);assert.deepEqual(cases,before);
});
test('BOM-only declaration survives native metadata and explicit adoption undo restores exact bytes',()=>{
 let value='\ufeff',c;const writes=[];c=M.createController({capture:()=>value,apply:v=>{value=v;writes.push(v);c.refresh();},onState:()=>{}});c.select('selected');c.loaded('selected',4);assert.equal(value,'\ufeff');assert.deepEqual(writes,[]);assert.equal(c.view().status,'invalid');c.adopt();assert.equal(value,'4.000');c.undo();assert.equal(value,'\ufeff');assert.equal(c.view().status,'invalid');
});
test('Python-empty C0 declaration may receive first duration and undo preserves original separators',()=>{
 let value='\u001c\u0085',c;c=M.createController({capture:()=>value,apply:v=>{value=v;c.refresh();},onState:()=>{}});c.select('selected');c.loaded('selected',4);assert.equal(value,'4.000');c.undo();assert.equal(value,'\u001c\u0085');assert.equal(M.compare(value,4).status,'empty');
});
test('timed file request refuses BOM duration without changing the source fields',()=>{
 const fields=draft('\ufeff').panels.lyrics.fields,before=structuredClone(fields);assert.throws(()=>I.sourceRequest('[00:01.000]原句','.lrc',fields));assert.deepEqual(fields,before);fields['lyrics-duration']='\u001c';assert.equal(I.sourceRequest('[00:01.000]原句','.lrc',fields).payload.duration,null);
});
test('complete package Apply cannot silently replace an invalid BOM declaration',()=>{
 const current=draft('\ufeff'),before=structuredClone(current),job={selected:{operation:'lyrics',packageImport:true,content:'原檔',suffix:'.json'},result:{data:{title:'合成原句',duration:4,duration_estimated:false,cues:[{start:1,end:2,text:'原句'}]}}};assert.throws(()=>I.importDraft(current,job));assert.deepEqual(current,before);
});
test('batch preview rejects BOM duration before sending any request and retains later text',async()=>{
 let calls=0;const h=timing('\ufeff',async()=>{calls++;return {};});assert.equal(await h.c.preview('.5'),false);assert.equal(calls,0);assert.equal(h.previews.length,0);assert.equal(h.writes.length,0);assert.equal(h.value.duration,'\ufeff');assert.equal(h.value.entries[0].value.text,'原句');
});
test('accepted NEL times sort by numeric values and batch payload never contains NaN',async()=>{
 const h=timing('\u008510\u0085');h.value.entries=[{id:'b',value:{start:'\u00854\u0085',end:'5',text:'二'}},{id:'a',value:{start:'\u00851\u0085',end:'2',text:'一'}}];assert.deepEqual(orderedEntries(h.value.entries).map(e=>e.id),['a','b']);assert.equal(await h.c.preview('.5'),true);assert.equal(h.previews[0].after[0].value.start,'1.5');assert.equal(h.previews[0].after[1].value.start,'4.5');assert.equal(h.value.entries[0].value.start,'\u00854\u0085');
});
test('undo rejects BOM-wrapped later clock and retains its proof for a corrected retry',async()=>{
 const h=timing();await h.c.preview('.5');h.c.apply();h.value.entries[0].value.start='\ufeff1.5\ufeff';assert.equal(h.c.undo(),false);assert.equal(h.writes.length,1);assert.equal(h.value.entries[0].value.start,'\ufeff1.5\ufeff');h.value.entries[0].value.start='1.500';assert.equal(h.c.undo(),true);assert.equal(h.value.entries[0].value.start,'1');
});
test('actual workbench duration adapter distinguishes invalid BOM from Python-empty fields',()=>{
 const source=fs.readFileSync('web/app.js','utf8'),begin=source.indexOf('function lyricDuration(){'),end=source.indexOf('\n',begin),control={value:'\ufeff'},context={LyricTime:T,$:()=>control,readValue:x=>x.value};assert.ok(begin>=0&&end>begin);vm.runInNewContext(source.slice(begin,end),context);assert.throws(()=>context.lyricDuration());assert.equal(control.value,'\ufeff');control.value='\u001c';assert.equal(context.lyricDuration(),null);control.value='\u00854\u0085';assert.equal(context.lyricDuration(),4);
});
test('standalone embedded timing and media layers retain the same declaration boundary',()=>{
 const contract=require('./helpers/lyric-preview-contract.js'),context={TextEncoder,TextDecoder,structuredClone};vm.runInNewContext(contract.timing_js,context);vm.runInNewContext(contract.package_js,context);assert.throws(()=>context.LyricTime.normalize('\ufeff1\ufeff'));assert.equal(context.LyricTime.normalize('\u00851\u0085'),1);assert.equal(context.MusicLyricsMedia.compare('\ufeff',4).status,'invalid');assert.ok(contract.template.includes('LyricTime.trim(durationField.value)'));
});
test('stamp cannot replace start while silently treating an invalid BOM end as empty',()=>{
 const source={start:'1',end:'\ufeff',text:'原文'},before=structuredClone(source);assert.throws(()=>stamp(source,'start',.5,4));assert.deepEqual(source,before);assert.equal(stamp({...source,end:'\u001c'},'start',.5,4).start,'0.5');
});
