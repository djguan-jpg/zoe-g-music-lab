// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const {execFileSync}=require('node:child_process');
const Media=require('../musiclab/assets/lyrics-media.js'),Package=require('../musiclab/assets/lyrics-package.js');
const root=path.join(__dirname,'..');
const provided=JSON.parse(execFileSync(process.platform==='win32'?'python':'python3',['-X','utf8','-c',
  "import json;from musiclab.application import build;print(json.dumps(build('lyrics',{'title':'原創十秒作品','duration':10,'cues':[{'start':0,'end':2,'text':'保留尾奏'}]}).wire(),ensure_ascii=False))"],{cwd:root,encoding:'utf8',timeout:10000}));
function harness(duration='10'){
  const value={duration,cues:[{start:'0',end:'2',text:'  保留原文  '}],source:'original',player:'selected'},states=[],writes=[];
  let c=Media.createController({capture:()=>value.duration,apply:text=>{value.duration=text;writes.push(text);c.refresh();},onState:v=>states.push(v)});
  return {c,value,states,writes,edit:text=>{value.duration=text;c.refresh();}};
}
test('selected media and declared work duration remain independent values',()=>{
  const view=Media.compare(' 10.000 ',4);assert.equal(view.status,'differs');assert.equal(view.declaredSeconds,10);
  assert.equal(view.mediaSeconds,4);assert.equal(view.canAdopt,true);assert.equal(view.mediaText,'4.000 秒');
});
test('both clocks use shared half-away-from-zero millisecond rounding',()=>{
  assert.equal(Media.compare('4',4.00049).status,'matches');assert.equal(Media.compare('4',4.0005).status,'differs');
  assert.equal(Media.mediaTime(.00049),null);assert.equal(Media.mediaTime(.0005),.001);
  assert.equal(Media.compare('4.0005',4.001).status,'matches');
});
test('unknown zero sub-millisecond nonfinite or nonnumeric media cannot be adopted',()=>{
  for(const value of [0,-1,NaN,Infinity,true,null,'4',.0001]){
    assert.equal(Media.mediaTime(value),null);assert.equal(Media.compare('10',value).canAdopt,false);
  }
});
test('empty and invalid declared inputs remain visible and unmodified',()=>{
  assert.equal(Media.compare(' ',4).status,'empty');
  for(const value of ['NaN','Infinity','0','-.1','0x10','text'])assert.equal(Media.compare(value,4).status,'invalid');
  assert.throws(()=>Media.compare(10,4));
});
test('already provided declaration is never overwritten by current native metadata',()=>{
  const h=harness('10.000');h.c.select('blob:a');assert.equal(h.c.loaded('blob:a',4),true);
  assert.equal(h.value.duration,'10.000');assert.deepEqual(h.writes,[]);assert.equal(h.c.view().status,'differs');
});
test('unchanged empty declaration receives first native duration and can be undone',()=>{
  const h=harness('');h.c.select('blob:a');h.c.loaded('blob:a',4.0005);
  assert.equal(h.value.duration,'4.001');assert.equal(h.c.view().canUndo,true);h.c.undo();assert.equal(h.value.duration,'');
  assert.equal(h.c.view().canUndo,false);assert.equal(h.c.view().status,'empty');
});
test('manual edit or intentional clear during metadata loading defeats automatic fill',()=>{
  for(const target of ['10','']){
    const h=harness('');h.c.select('blob:a');h.edit('12');h.edit(target);h.c.loaded('blob:a',4);
    assert.equal(h.value.duration,target);assert.deepEqual(h.writes,[]);
  }
});
test('programmatic changed field is preserved even without an input notification',()=>{
  const h=harness('');h.c.select('blob:a');h.value.duration='9';h.c.loaded('blob:a',4);assert.equal(h.value.duration,'9');assert.deepEqual(h.writes,[]);
});
test('other lyrics edits during loading protect the original empty declaration',()=>{
  const h=harness('');h.c.select('blob:a');h.value.cues[0].text='之後編修';h.c.refresh();h.c.loaded('blob:a',4);
  assert.equal(h.value.duration,'');assert.equal(h.value.cues[0].text,'之後編修');assert.equal(h.c.view().canAdopt,true);
});
test('obsolete source metadata and errors cannot change the current comparison',()=>{
  const h=harness();h.c.select('blob:a');h.c.select('blob:b');const before=h.c.view();
  assert.equal(h.c.loaded('blob:a',4),false);assert.equal(h.c.fail('blob:a'),false);assert.deepEqual(h.c.view(),before);
  h.c.loaded('blob:b',6);assert.equal(h.c.view().mediaSeconds,6);assert.equal(h.value.duration,'10');
});
test('repeat metadata never refills an explicitly undone or edited declaration',()=>{
  const h=harness('');h.c.select('blob:a');h.c.loaded('blob:a',4);h.c.undo();h.c.loaded('blob:a',4);
  assert.equal(h.value.duration,'');assert.equal(h.writes.length,2);
});
test('explicit adoption changes only duration and preserves source cues text and player',()=>{
  const h=harness(),before=structuredClone(h.value);h.c.select('blob:a');h.c.loaded('blob:a',4);h.c.adopt();
  assert.deepEqual(h.value,{...before,duration:'4.000'});assert.equal(h.c.view().canAdopt,false);assert.equal(h.c.view().canUndo,true);
  h.c.undo();assert.deepEqual(h.value,before);
});
test('duration edits prevent undo without deleting the restore record',()=>{
  const h=harness();h.c.select('blob:a');h.c.loaded('blob:a',4);h.c.adopt();h.edit('7');
  assert.equal(h.c.view().canUndo,false);assert.throws(()=>h.c.undo(),/已有編修/);assert.equal(h.value.duration,'7');
  h.edit('4.000');h.c.undo();assert.equal(h.value.duration,'10');
});
test('undo retains later cue edits because its scope is only the duration field',()=>{
  const h=harness();h.c.select('blob:a');h.c.loaded('blob:a',4);h.c.adopt();h.value.cues[0].text='保留較晚的文字';h.c.refresh();h.c.undo();
  assert.equal(h.value.duration,'10');assert.equal(h.value.cues[0].text,'保留較晚的文字');
});
test('unknown current media duration and playback failure preserve data and disable adoption',()=>{
  const h=harness();h.c.select('blob:a');h.c.loaded('blob:a',Infinity);assert.equal(h.c.view().phase,'unavailable');assert.throws(()=>h.c.adopt());
  h.c.loaded('blob:a',4);h.c.fail('blob:a');assert.equal(h.c.view().phase,'error');assert.equal(h.c.view().canAdopt,false);assert.equal(h.value.duration,'10');
});
test('full media reset ignores old metadata and clears transient restore without changing declaration',()=>{
  const h=harness();h.c.select('blob:a');h.c.loaded('blob:a',4);h.c.adopt();h.c.clear();
  assert.equal(h.c.loaded('blob:a',6),false);assert.equal(h.c.fail('blob:a'),false);assert.equal(h.value.duration,'4.000');
  assert.equal(h.c.view().phase,'unselected');assert.equal(h.c.view().canUndo,false);
});
test('replacing media keeps an existing declaration and clears only prior media undo',()=>{
  const h=harness();h.c.select('blob:a');h.c.loaded('blob:a',4);h.c.adopt();h.c.select('blob:b');h.c.loaded('blob:b',6);
  assert.equal(h.value.duration,'4.000');assert.equal(h.c.view().canUndo,false);assert.equal(h.c.view().status,'differs');
});
test('identical or unavailable media has no adopt action and cannot overwrite formatting',()=>{
  const h=harness('4.00');h.c.select('blob:a');assert.throws(()=>h.c.adopt());h.c.loaded('blob:a',4);assert.throws(()=>h.c.adopt());
  assert.equal(h.value.duration,'4.00');assert.deepEqual(h.writes,[]);
});
test('read-only state refresh during pending work never counts as a field edit',()=>{
  const h=harness('');h.c.select('blob:a');h.c.refresh({protect:false});h.c.loaded('blob:a',4);assert.equal(h.value.duration,'4.000');
});
test('actual app metadata handler delegates only the currently resolved media source',()=>{
  const source=fs.readFileSync(path.join(root,'web/app.js'),'utf8');
  const start=source.indexOf("$('lyrics-player').onloadedmetadata="),end=source.indexOf("\n$('lyrics-player').ontimeupdate",start);
  const h=harness('10'),player={currentSrc:'blob:a',duration:4},context={$:()=>player,state:{audioUrl:'blob:a'},lyricsMediaController:h.c,tick:()=>{}};
  h.c.select('blob:a');vm.createContext(context);vm.runInContext(source.slice(start,end),context);player.onloadedmetadata();
  assert.equal(h.value.duration,'10');assert.equal(h.c.view().mediaSeconds,4);
  context.state.audioUrl='blob:b';player.duration=6;player.onloadedmetadata();assert.equal(h.c.view().mediaSeconds,4);
});
test('unchanged provided lyrics package stays exactly intact despite a conflicting selected media clock',()=>{
  const h=harness('10');h.c.select('blob:a');h.c.loaded('blob:a',4);
  const p=Package.buildRequest({title:provided.data.title,cues:provided.data.cues,duration:Number(h.value.duration),content:JSON.stringify(provided.data),suffix:'.json'});
  assert.deepEqual(p,{package:provided.data});assert.equal(p.package.duration,10);assert.equal(p.package.review_notes.length,0);
});
test('explicit media duration adoption retains cue timings and honest origin warning; undo restores original request',()=>{
  const h=harness('10');h.c.select('blob:a');h.c.loaded('blob:a',4);h.c.adopt();
  const request=()=>Package.buildRequest({title:provided.data.title,cues:provided.data.cues,duration:Number(h.value.duration),content:JSON.stringify(provided.data),suffix:'.json'});
  const p=request();assert.equal(p.package.duration,4);assert.deepEqual(p.package.cues,provided.data.cues);assert.match(p.package.review_notes[0],/總長已更改/);
  h.c.undo();assert.deepEqual(request(),{package:provided.data});
});
function standalone(data=provided.data){
  const preview=provided.files['preview.html'],start=preview.indexOf('const durationField='),end=preview.indexOf('function message(',start);
  const nodes=new Map(),node=id=>{if(!nodes.has(id))nodes.set(id,{value:'',textContent:'',disabled:false,classList:{toggle:()=>{}}});return nodes.get(id);};
  const context={data:structuredClone(data),MusicLyricsMedia:Media,MusicLyricsPackage:Package,LyricTime:require('../musiclab/assets/lyric-time.js'),
    document:{getElementById:node},rows:{addEventListener:()=>{}},collect:()=>context.data.cues,render:()=>{},tick:()=>{},message:()=>{}};
  vm.createContext(context);vm.runInContext(preview.slice(start,end),context);
  const a=preview.indexOf('function apply(){'),b=preview.indexOf('function tick()',a);vm.runInContext(preview.slice(a,b),context);
  return {context,nodes,controller:vm.runInContext('media',context),duration:node('duration')};
}
test('actual standalone comparison and apply preserve provided package despite different media',()=>{
  const h=standalone();h.controller.select('blob:a');h.controller.loaded('blob:a',4);h.context.apply();
  assert.deepEqual(h.context.data,provided.data);assert.equal(h.duration.value,'10');assert.equal(h.nodes.get('media-audio').textContent,'4.000 秒');
  assert.match(h.nodes.get('media-note').textContent,/不同/);
});
test('actual standalone explicit adoption and duration undo preserve cue data through apply',()=>{
  const h=standalone();h.controller.select('blob:a');h.controller.loaded('blob:a',4);h.controller.adopt();h.context.apply();
  assert.equal(h.context.data.duration,4);assert.deepEqual(h.context.data.cues,provided.data.cues);assert.match(h.context.data.review_notes[0],/總長已更改/);
  h.controller.undo();h.context.apply();assert.equal(h.context.data.duration,10);assert.deepEqual(h.context.data.cues,provided.data.cues);
});
test('standalone estimated source stays estimated until a real clock or manual declaration is adopted',()=>{
  const data=structuredClone(provided.data);data.duration=2;data.duration_estimated=true;data.timing.duration_source='last_cue_end';
  const h=standalone(data);assert.equal(h.duration.value,'');h.context.apply();assert.deepEqual(h.context.data,data);
  h.controller.select('blob:a');h.controller.loaded('blob:a',4);h.context.apply();assert.equal(h.context.data.duration,4);assert.equal(h.context.data.duration_estimated,false);
  assert.match(h.context.data.review_notes[0],/總長已更改/);
});
test('standalone invalid explicit duration cannot replace the last valid package',()=>{
  const h=standalone();h.duration.value='1';const before=structuredClone(h.context.data);assert.throws(()=>h.context.apply());assert.deepEqual(h.context.data,before);
});
