// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const R=require('../web/playback-rate.js'),DOM=require('../web/playback-rate-dom.js');
function setup(extra={}){
 const s={media:{source:'blob:a',current_source:'blob:a',duration:4,position:1.25,ready:true,error:false},rate:1,busy:false,visible:true},writes=[],errors=[],views=[];
 const options={capture:()=>structuredClone(s),setRate:rate=>{writes.push(rate);s.rate=rate;},onView:v=>views.push(v),onError:e=>errors.push(e.message),...extra};
 return {s,writes,errors,views,options,c:R.createController(options)};
}
test('only explicit speeds are selectable and malformed playback snapshots are refused',()=>{
 assert.deepEqual(R.choices,['0.5','0.75','1','1.25','1.5','2']);assert.ok(Object.isFrozen(R.choices));
 const a=setup();for(const v of [null,{},[],.5,' 0.5','0.50','0','-1','NaN'])assert.equal(a.c.choose(v),false);assert.deepEqual(a.writes,[]);
 for(const v of [null,{...a.s,extra:true},{...a.s,rate:'1'},{...a.s,busy:0},{...a.s,media:{...a.s.media,extra:true}}])assert.throws(()=>R.present(v));
});
test('unavailable media busy or hidden workspace disables the operation without setters',()=>{
 for(const change of [{media:{ready:false}},{media:{error:true}},{media:{source:null}},{media:{current_source:'blob:b'}},{media:{duration:NaN}},{media:{position:5}},{rate:NaN},{rate:0},{busy:true},{visible:false}]){
  const a=setup();if(change.media)Object.assign(a.s.media,change.media);else Object.assign(a.s,change);assert.equal(a.c.refresh().enabled,false);assert.equal(a.c.choose('0.5'),false);assert.equal(a.writes.length,0);
 }
});
test('all listed speeds are read back and leave source duration and media position unchanged',()=>{
 const a=setup(),media=structuredClone(a.s.media);for(const value of R.choices){assert.ok(a.c.choose(value));assert.equal(a.s.rate,Number(value));assert.deepEqual(a.s.media,media);assert.equal(a.views.at(-1).selected,value);}
});
test('same speed avoids writing while an external custom rate remains honestly visible',()=>{
 const a=setup();assert.deepEqual(a.c.choose('1'),{changed:false,rate:1});assert.equal(a.writes.length,0);a.s.rate=.3;const view=a.c.refresh();assert.equal(view.selected,'');assert.match(view.text,/0.3 倍/);assert.equal(view.enabled,true);
});
test('explicit setter refusal is rejected even if the native rate actually changed',()=>{
 const a=setup();a.options.setRate=rate=>{a.s.rate=rate;return false;};const c=R.createController(a.options);assert.equal(c.choose('0.5'),false);assert.equal(a.s.rate,.5);assert.match(a.errors.at(-1),/未接受/);assert.equal(a.views.at(-1).selected,'0.5');
});
test('no-op wrong result and thrown setters reject success and preserve actual native state',()=>{
 for(const mode of ['noop','wrong','throw']){const a=setup();a.options.setRate=()=>{if(mode==='wrong')a.s.rate=.75;if(mode==='throw')throw Error('native refusal');};assert.equal(R.createController(a.options).choose('0.5'),false);assert.equal(a.s.rate,mode==='wrong'?.75:1);assert.equal(a.errors.length,1);}
});
test('intervening source duration rate busy and visibility changes are caught before writing',()=>{
 for(const mutate of [s=>s.media.source='blob:b',s=>s.media.duration=3,s=>s.rate=.75,s=>s.busy=true,s=>s.visible=false]){const a=setup();let reads=0;const c=R.createController({...a.options,capture:()=>{if(++reads===2)mutate(a.s);return structuredClone(a.s);}});assert.equal(c.choose('0.5'),false);assert.equal(a.writes.length,0);}
});
test('source or gate changes inside the setter reject success without rolling back native writes',()=>{
 for(const mutate of [s=>s.media.source=s.media.current_source='blob:b',s=>s.media.duration=3,s=>s.busy=true,s=>s.visible=false]){const a=setup();const c=R.createController({...a.options,setRate:rate=>{a.s.rate=rate;mutate(a.s);}});assert.equal(c.choose('0.5'),false);assert.equal(a.s.rate,.5);assert.equal(a.errors.length,1);}
});
test('natural media progress is permitted and the controller does not seek or play',()=>{
 const a=setup();let reads=0;const c=R.createController({...a.options,capture:()=>{a.s.media.position=1+(++reads)/10;return structuredClone(a.s);}});assert.deepEqual(c.choose('0.75'),{changed:true,rate:.75});assert.equal(a.s.media.position,1.3);assert.deepEqual(a.writes,[.75]);
});
test('dispose during capture setter or view prevents later success callbacks and writes',()=>{
 for(const phase of ['capture','setter','view']){const a=setup();let c;const options={...a.options};if(phase==='capture')options.capture=()=>{c.dispose();return structuredClone(a.s);};if(phase==='setter')options.setRate=()=>c.dispose();if(phase==='view')options.onView=()=>c.dispose();c=R.createController(options);assert.equal(c.choose('0.5'),false);assert.equal(c.choose('0.75'),false);assert.equal(c.refresh(),null);assert.equal(a.errors.length,0);}
});
test('reentrant selection cannot create a second native write and a later ordinary choice works',()=>{
 const a=setup();let c,inside;const options={...a.options,setRate:rate=>{a.writes.push(rate);inside=c.choose('2');a.s.rate=rate;}};c=R.createController(options);assert.ok(c.choose('0.5'));assert.equal(inside,false);assert.deepEqual(a.writes,[.5]);assert.ok(c.choose('0.75'));assert.deepEqual(a.writes,[.5,.75]);
});
function events(){const listeners=new Map();return {listeners,addEventListener:(t,f)=>{if(!listeners.has(t))listeners.set(t,new Set());listeners.get(t).add(f);},removeEventListener:(t,f)=>listeners.get(t)?.delete(f),emit:t=>{for(const f of [...listeners.get(t)||[]])f();}};}
test('DOM uses only playbackRate and native ratechange synchronizes the literal selected speed',()=>{
 const a=setup(),select=Object.assign(events(),{disabled:true,value:'1'}),note={textContent:''},player=events();Object.defineProperty(player,'playbackRate',{get:()=>a.s.rate,set:v=>{a.s.rate=v;}});player.currentTime=1.25;player.src='blob:a';const ui=DOM.bind({select,note,player,capture:a.options.capture});
 select.value='0.5';select.emit('change');assert.equal(player.playbackRate,.5);assert.equal(player.currentTime,1.25);assert.equal(player.src,'blob:a');assert.match(note.textContent,/0.5 倍/);a.s.rate=2;player.emit('ratechange');assert.equal(select.value,'2');a.s.busy=true;ui.refresh();assert.equal(select.disabled,true);select.value='0.75';select.emit('change');assert.equal(a.s.rate,2);a.s.media.ready=false;player.emit('emptied');assert.equal(select.value,'');assert.match(note.textContent,/先載入/);ui.dispose();
});
test('owned DOM listeners are removed on pagehide while unrelated listeners are preserved',()=>{
 const a=setup(),select=Object.assign(events(),{disabled:false,value:'1'}),note={textContent:''},player=Object.assign(events(),{playbackRate:1}),page=events();let unrelated=0;const other=()=>unrelated++;player.addEventListener('ratechange',other);const ui=DOM.bind({select,note,player,capture:a.options.capture,events:page});page.emit('pagehide');assert.equal(select.disabled,true);player.emit('ratechange');assert.equal(unrelated,1);assert.equal(select.listeners.get('change').size,0);assert.equal(page.listeners.get('pagehide').size,0);ui.dispose();
});
test('native app binds a view control and leaves draft fields timing and Agent operations untouched',()=>{
 const fs=require('node:fs'),html=fs.readFileSync('web/index.html','utf8'),app=fs.readFileSync('web/app.js','utf8'),server=fs.readFileSync('music_lab_server.py','utf8');
 assert.match(html,/id="lyrics-playback-rate" data-view-control="true"/);assert.ok(html.indexOf('/wave-position.js')<html.indexOf('/playback-rate.js')&&html.indexOf('/playback-rate-dom.js')<html.indexOf('/app.js'));
 assert.match(app,/state.playbackRate=MusicPlaybackRateDOM.bind/);assert.match(app,/rate:\$\('lyrics-player'\).playbackRate/);assert.match(app,/state.playbackRate\?\.refresh\(\)/);assert.ok(server.includes('"/playback-rate.js": ("web/playback-rate.js", "text/javascript")'));
});
test('actual app navigation refreshes playback controls after destination panel visibility changes',()=>{
 const fs=require('node:fs'),vm=require('node:vm'),app=fs.readFileSync('web/app.js','utf8');
 const binding=app.split('\n').find(line=>line.startsWith("document.querySelectorAll('[data-tab]').forEach(button=>button.onclick="));assert.ok(binding);
 const panels=[{id:'music',hidden:false},{id:'lyrics',hidden:true}],buttons=panels.map(p=>({dataset:{tab:p.id},classList:{toggle(){}},setAttribute(){},removeAttribute(){}})),observed=[];
 const state={tab:'music',bundles:{},playbackRate:{refresh:()=>observed.push({tab:state.tab,visible:!panels.find(p=>p.id===state.tab).hidden})}};
 const globals={state,document:{querySelectorAll:selector=>selector==='.panel'?panels:buttons},setFiles(){},clearOutput(){},say(){}};
 for(const name of ['lyricsSearchController','storyboardSearchController','musicSearchController','lyricsReviewPager','lyricsExportPager','musicReadyPager','storyboardReadyPager','storyboardTimingPager','editorCopy','editorOrder','editorPosition','shotReviewController','sectionReviewController','cueReviewController'])globals[name]=null;
 vm.runInNewContext(binding,globals);buttons[1].onclick();buttons[0].onclick();buttons[1].onclick();
 assert.deepEqual(observed,[{tab:'lyrics',visible:true},{tab:'music',visible:true},{tab:'lyrics',visible:true}]);assert.equal(panels[1].hidden,false);
});
