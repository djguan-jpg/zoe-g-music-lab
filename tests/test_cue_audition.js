// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const A=require('../web/cue-audition.js'),DOM=require('../web/cue-audition-dom.js');
function setup(extra={}){
 const s={row:{id:'row-1',start:' 0.5 ',end:'1.5',text:' 原文 🎵  '},media:{source:'blob:a',current_source:'blob:a',duration:4,position:0,ready:true,error:false},playing:false,busy:false,visible:true},writes=[],errors=[],views=[];
 const options={capture:()=>structuredClone(s),setPosition:v=>{writes.push(['seek',v]);s.media.position=v;},play:()=>{writes.push(['play']);s.playing=true;},pause:()=>{writes.push(['pause']);s.playing=false;},onView:v=>views.push(v),onError:e=>errors.push(e.message),...extra};
 return {s,writes,errors,views,options,c:A.createController(options)};
}
test('range uses audio seconds and preserves raw row values while invalid times fail',()=>{
 const a=setup(),before=structuredClone(a.s);assert.deepEqual(A.range(a.s),{id:'row-1',start:.5,end:1.5});assert.deepEqual(a.s,before);
 for(const row of [{start:''},{start:'\ufeff.5'},{start:'-1e-999'},{end:'NaN'},{end:'0.5'},{end:'4.001'}])assert.throws(()=>A.range({...a.s,row:{...a.s.row,...row}}));
 assert.equal(A.range({...a.s,row:{...a.s.row,end:'4'}}).end,4);
});
test('strict snapshot shape is enforced and unavailable hidden busy or missing row cannot start',async()=>{
 const a=setup();for(const value of [null,[],{}, {...a.s,extra:1},{...a.s,playing:1},{...a.s,row:{...a.s.row,id:''}},{...a.s,media:{...a.s.media,extra:1}}])assert.throws(()=>A.range(value));
 for(const edit of [s=>s.row=null,s=>s.busy=true,s=>s.visible=false,s=>s.media.ready=false,s=>s.media.error=true,s=>s.media.current_source='blob:b']){const a=setup();edit(a.s);assert.equal(a.c.refresh().canStart,false);assert.equal(await a.c.start(),false);assert.deepEqual(a.writes,[]);}
});
test('explicit audition seeks then confirms actual playback and stops at or beyond the end',async()=>{
 const a=setup(),row=structuredClone(a.s.row);assert.equal(await a.c.start(),true);assert.deepEqual(a.writes,[['seek',.5],['play']]);assert.equal(a.views.at(-1).phase,'playing');assert.equal(a.views.at(-1).canStart,false);assert.equal(a.views.at(-1).canStop,true);
 a.s.media.position=1.75;a.c.refresh();assert.equal(a.s.playing,false);assert.deepEqual(a.s.row,row);assert.equal(a.s.media.position,1.75);assert.match(a.views.at(-1).text,/不是精準裁切/);assert.equal(a.views.at(-1).phase,'idle');
});
test('manual stop preserves native position and repeated stop does not pause unrelated playback',async()=>{
 const a=setup();await a.c.start();a.s.media.position=.8;assert.equal(a.c.stop(),true);assert.equal(a.s.media.position,.8);assert.equal(a.c.stop(),false);a.s.playing=true;a.c.refresh();assert.equal(a.s.playing,true);assert.equal(a.writes.filter(w=>w[0]==='pause').length,1);
});
test('seek refusal no-op wrong position and exceptions never start playback',async()=>{
 for(const kind of ['false','noop','wrong','throw']){const a=setup();const c=A.createController({...a.options,setPosition:v=>{if(kind==='false'){a.s.media.position=v;return false;}if(kind==='wrong')a.s.media.position=v+.002;if(kind==='throw')throw Error('seek blocked');}});assert.equal(await c.start(),false);assert.ok(a.writes.every(w=>w[0]!=='play'));assert.equal(a.errors.length,1);}
});
test('source row and gates are rechecked before seeking',async()=>{
 for(const mutate of [s=>s.row.text+='x',s=>s.media.duration=3,s=>s.media.source=s.media.current_source='blob:b',s=>s.busy=true,s=>s.visible=false]){const a=setup();let n=0;const c=A.createController({...a.options,capture:()=>{if(++n===2)mutate(a.s);return structuredClone(a.s);}});assert.equal(await c.start(),false);assert.deepEqual(a.writes,[]);}
});
test('changes during seek reject playback without overwriting the native result',async()=>{
 for(const mutate of [s=>s.row.end='2',s=>s.media.duration=3,s=>s.media.source=s.media.current_source='blob:b',s=>s.busy=true,s=>s.visible=false]){const a=setup();const c=A.createController({...a.options,setPosition:v=>{a.s.media.position=v;mutate(a.s);}});assert.equal(await c.start(),false);assert.equal(a.s.media.position,.5);assert.deepEqual(a.writes,[]);}
});
test('native play false rejection and no-op are honestly refused and owned playback is paused',async()=>{
 for(const kind of ['false','reject','noop']){const a=setup();const c=A.createController({...a.options,play:()=>{if(kind==='false'){a.s.playing=true;return false;}if(kind==='reject')return Promise.reject(Error('autoplay blocked'));}});assert.equal(await c.start(),false);assert.equal(a.s.playing,false);assert.equal(a.errors.length,1);assert.equal(a.views.at(-1).phase,'idle');assert.ok(a.writes.some(w=>w[0]==='pause'));}
});
test('changed raw row including invalid numeric edits stops the owned clip without altering edits',async()=>{
 for(const edit of [s=>s.row.start='',s=>s.row.end='NaN',s=>s.row.text+='編修',s=>s.row.id='row-2',s=>s.row=null]){const a=setup();await a.c.start();edit(a.s);const before=structuredClone(a.s.row);a.c.refresh();assert.equal(a.s.playing,false);assert.equal(a.views.at(-1).phase,'idle');assert.deepEqual(a.s.row,before);}
});
test('hidden or busy workspace stops an owned clip and external pause releases it',async()=>{
 for(const edit of [s=>s.visible=false,s=>s.busy=true,s=>s.playing=false,s=>s.media.ready=false,s=>s.media.error=true]){const a=setup();await a.c.start();edit(a.s);a.c.refresh();assert.equal(a.s.playing,false);assert.equal(a.views.at(-1).phase,'idle');assert.equal(a.c.stop(),false);}
});
test('changed audio releases ownership without pausing or seeking the replacement',async()=>{
 const a=setup();await a.c.start();a.s.media.source=a.s.media.current_source='blob:b';a.s.media.position=2;a.c.refresh();assert.equal(a.s.playing,true);assert.equal(a.s.media.position,2);assert.equal(a.views.at(-1).phase,'idle');assert.ok(!a.writes.some(w=>w[0]==='pause'));
});
test('pause refusal and no-op do not report successful stop and permit explicit safe retry',async()=>{
 for(const kind of ['false','noop','throw']){const a=setup();let fail=true;const c=A.createController({...a.options,pause:()=>{if(fail){if(kind==='false'){a.s.playing=false;return false;}if(kind==='throw')throw Error('pause blocked');return;}a.s.playing=false;}});await c.start();assert.equal(c.stop(),false);assert.equal(a.views.at(-1).canStop,true);assert.equal(a.errors.length,1);fail=false;assert.equal(c.stop(),true);assert.equal(a.views.at(-1).phase,'idle');}
});
test('pending playback blocks duplicate audition and can be stopped before promise resolution',async()=>{
 const a=setup();let resolve;const c=A.createController({...a.options,play:()=>{a.s.playing=true;return new Promise(r=>resolve=r);}});const pending=c.start();assert.equal(a.views.at(-1).phase,'pending');assert.equal(await c.start(),false);assert.equal(c.stop(),true);resolve();assert.equal(await pending,false);assert.equal(a.s.playing,false);assert.equal(a.views.at(-1).phase,'idle');assert.equal(a.errors.length,0);
});
test('late play rejection after ownership release cannot affect replacement audio',async()=>{
 const a=setup();let reject;const c=A.createController({...a.options,play:()=>new Promise((_,r)=>reject=r)});const pending=c.start();a.s.media.source=a.s.media.current_source='blob:b';a.s.playing=true;c.refresh();reject(Error('late'));assert.equal(await pending,false);assert.equal(a.s.playing,true);assert.equal(a.errors.length,0);assert.ok(!a.writes.some(w=>w[0]==='pause'));
});
test('dispose cancels owned pending play and prevents late status callbacks',async()=>{
 const a=setup();let resolve;const c=A.createController({...a.options,play:()=>{a.s.playing=true;return new Promise(r=>resolve=r);}});const pending=c.start();assert.equal(c.dispose(),true);const count=a.views.length;resolve();assert.equal(await pending,false);assert.equal(a.s.playing,false);assert.equal(a.views.length,count);assert.equal(c.refresh(),null);assert.equal(await c.start(),false);assert.equal(c.stop(),false);assert.equal(c.dispose(),true);
});
test('reentrant start during capture or seek cannot create another playback job',async()=>{
 for(const phase of ['capture','seek']){const a=setup();let c,inside,count=0;const options={...a.options};if(phase==='capture')options.capture=()=>{if(++count===1)inside=c.start();return structuredClone(a.s);};else options.setPosition=v=>{inside=c.start();a.s.media.position=v;};c=A.createController(options);assert.equal(await c.start(),true);assert.equal(await inside,false);assert.equal(a.writes.filter(w=>w[0]==='play').length,1);c.stop();}
});
test('dispose during source capture or seek prevents any later playback',async()=>{
 for(const phase of ['capture','seek']){const a=setup();let c;const options={...a.options};if(phase==='capture')options.capture=()=>{c.dispose();return structuredClone(a.s);};else options.setPosition=()=>c.dispose();c=A.createController(options);assert.equal(await c.start(),false);assert.ok(!a.writes.some(w=>w[0]==='play'));assert.equal(a.errors.length,0);}
});
function events(){const listeners=new Map();return {listeners,addEventListener:(t,f)=>{if(!listeners.has(t))listeners.set(t,new Set());listeners.get(t).add(f);},removeEventListener:(t,f)=>listeners.get(t)?.delete(f),emit:t=>{for(const f of [...listeners.get(t)||[]])f();}};}
test('DOM native events stop the selected clip while preserving speed source and duration',async()=>{
 const a=setup(),start=events(),stop=events(),selection=events(),container=events(),note={},player=Object.assign(events(),{playbackRate:.5,src:'blob:a',play:()=>{a.s.playing=true;},pause:()=>{a.s.playing=false;}});Object.defineProperty(player,'currentTime',{get:()=>a.s.media.position,set:v=>a.s.media.position=v});
 const ui=DOM.bind({start,stop,note,selection,container,player,capture:a.options.capture});start.emit('click');await Promise.resolve();assert.equal(a.s.playing,true);assert.equal(player.currentTime,.5);assert.equal(player.playbackRate,.5);a.s.media.position=1.6;player.emit('timeupdate');assert.equal(a.s.playing,false);assert.equal(stop.disabled,true);assert.match(note.textContent,/已停止/);assert.equal(player.src,'blob:a');assert.equal(a.s.media.duration,4);ui.dispose();
});
test('DOM selection and input changes stop owned play and cleanup preserves unrelated listeners',async()=>{
 const a=setup(),start=events(),stop=events(),selection=events(),container=events(),note={},page=events(),player=Object.assign(events(),{play:()=>{a.s.playing=true;},pause:()=>{a.s.playing=false;}});Object.defineProperty(player,'currentTime',{get:()=>a.s.media.position,set:v=>a.s.media.position=v});let unrelated=0;player.addEventListener('timeupdate',()=>unrelated++);
 const ui=DOM.bind({start,stop,note,selection,container,player,capture:a.options.capture,events:page});start.emit('click');await Promise.resolve();a.s.row.id='row-2';selection.emit('change');assert.equal(a.s.playing,false);start.emit('click');await Promise.resolve();a.s.row.id='row-3';container.emit('focusin');assert.equal(a.s.playing,false);start.emit('click');await Promise.resolve();a.s.row.end='';container.emit('input');assert.equal(a.s.playing,false);page.emit('pagehide');assert.equal(start.disabled,true);assert.equal(start.listeners.get('click').size,0);assert.equal(selection.listeners.get('change').size,0);assert.equal(container.listeners.get('input').size,0);assert.equal(container.listeners.get('focusin').size,0);player.emit('timeupdate');assert.equal(unrelated,1);assert.equal(player.listeners.get('timeupdate').size,1);assert.equal(page.listeners.get('pagehide').size,0);ui.dispose();
});
test('DOM verifies original audio again immediately before each native setter',async()=>{
 const a=setup(),start=events(),stop=events(),selection=events(),container=events(),note={},player=events();let n=0,plays=0;player.play=()=>plays++;player.pause=()=>{};Object.defineProperty(player,'currentTime',{get:()=>a.s.media.position,set:v=>a.s.media.position=v});
 const capture=()=>{if(++n===4)a.s.media.source=a.s.media.current_source='blob:b';return structuredClone(a.s);};const ui=DOM.bind({start,stop,note,selection,container,player,capture,onError:e=>a.errors.push(e.message)});start.emit('click');await Promise.resolve();assert.equal(plays,0);assert.equal(a.s.media.position,0);assert.equal(a.errors.length,1);ui.dispose();
});
test('actual workbench navigation stops managed audition after destination visibility changes',()=>{
 const fs=require('node:fs'),vm=require('node:vm'),app=fs.readFileSync('web/app.js','utf8'),html=fs.readFileSync('web/index.html','utf8'),server=fs.readFileSync('music_lab_server.py','utf8');
 const line=app.split('\n').find(l=>l.startsWith("document.querySelectorAll('[data-tab]').forEach(button=>button.onclick=")),panels=[{id:'music',hidden:false},{id:'lyrics',hidden:true}],buttons=panels.map(p=>({dataset:{tab:p.id},classList:{toggle(){}},setAttribute(){},removeAttribute(){}})),seen=[];
 const state={tab:'music',bundles:{},cueAudition:{refresh:()=>seen.push({tab:state.tab,lyricsHidden:panels[1].hidden})}},g={state,document:{querySelectorAll:s=>s==='.panel'?panels:buttons},clearOutput(){},setFiles(){},say(){}};
 for(const n of ['lyricsSearchController','storyboardSearchController','musicSearchController','lyricsReviewPager','lyricsExportPager','musicReadyPager','storyboardReadyPager','storyboardTimingPager','editorCopy','editorOrder','editorPosition','shotReviewController','sectionReviewController','cueReviewController'])g[n]=null;
 vm.runInNewContext(line,g);buttons[1].onclick();buttons[0].onclick();assert.deepEqual(seen,[{tab:'lyrics',lyricsHidden:false},{tab:'music',lyricsHidden:true}]);assert.match(app,/state.cueAudition=MusicCueAuditionDOM.bind/);assert.match(app,/cueStampRow\(\$\('cues-order'\).value\)/);assert.ok(html.indexOf('/cue-position.js')<html.indexOf('/cue-audition.js')&&html.indexOf('/cue-audition-dom.js')<html.indexOf('/app.js'));assert.ok(server.includes('"/cue-audition.js": ("web/cue-audition.js", "text/javascript")'));assert.match(html,/id="cue-audition-start" type="button"/);
});
