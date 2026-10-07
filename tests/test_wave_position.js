// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const P=require('../web/wave-position.js'),DOM=require('../web/wave-position-dom.js');
const sample=(extra={})=>({source:'blob:a',current_source:'blob:a',duration:6,position:.5,ready:true,error:false,...extra});
const mods=(extra={})=>({shift:false,alt:false,control:false,meta:false,...extra});
test('wave view reads current media and resets every public value when unavailable',()=>{
  assert.deepEqual(P.present(sample()),{available:true,minimum:0,maximum:6,value:.5,ratio:1/12,readout:'播放位置 00:00.500 ／ 00:06.000'});
  for(const extra of [{source:null},{current_source:'blob:old'},{ready:false},{error:true},{duration:NaN},{duration:Infinity},{duration:0},{duration:-1},{duration:Number.MAX_SAFE_INTEGER},{position:NaN},{position:-.1},{position:6.01}]){
    assert.deepEqual(P.present(sample(extra)),{available:false,minimum:0,maximum:0,value:0,ratio:0,readout:'尚無可定位音檔'});
  }
  assert.throws(()=>P.present({...sample(),media:1}));assert.throws(()=>P.present(sample({position:'0.5'})));
});
test('wave readout rounds only presentation and carries milliseconds through minute and hour boundaries',()=>{
  const input=sample({duration:3601.0004,position:3599.9996});
  const view=P.present(input);assert.equal(view.readout,'播放位置 01:00:00.000 ／ 01:00:01.000');
  assert.equal(view.value,3599.9996);assert.equal(view.maximum,3601.0004);assert.equal(input.position,3599.9996);
});
test('keyboard normal and fine steps support bounds, Home End and release modified shortcuts',()=>{
  assert.equal(P.keyboard(sample(),'ArrowRight'),1);assert.equal(P.keyboard(sample(),'ArrowUp',mods({shift:true})),.55);
  assert.equal(P.keyboard(sample(),'ArrowDown',mods({shift:true})),.45);
  assert.equal(P.keyboard(sample({position:0}),'ArrowLeft'),0);assert.equal(P.keyboard(sample({position:5.9}),'ArrowRight'),6);
  assert.equal(P.keyboard(sample(),'Home'),0);assert.equal(P.keyboard(sample(),'End'),6);
  for(const extra of [{alt:true},{control:true},{meta:true}])assert.equal(P.keyboard(sample(),'ArrowRight',mods(extra)),null);
  assert.equal(P.keyboard(sample(),'Tab'),null);assert.equal(P.keyboard(sample({ready:false}),'Home'),null);
});
test('pointer rejects invalid geometry and safely clamps outside the live waveform',()=>{
  assert.equal(P.pointer(sample(),40,10,60),3);assert.equal(P.pointer(sample(),-100,10,60),0);assert.equal(P.pointer(sample(),100,10,60),6);
  for(const args of [[40,10,0],[40,10,-2],[NaN,10,60],[40,Infinity,60],[Number.MAX_VALUE,-Number.MAX_VALUE,1]])assert.equal(P.pointer(sample(),...args),null);
});
test('controller rechecks source, duration and ready state before seeking and never applies old media',()=>{
  for(const extra of [{source:'blob:b',current_source:'blob:b'},{duration:2},{ready:false},{error:true}]){
    let reads=0,writes=0,view;
    const c=P.createController({capture:()=>++reads===1?sample():sample(extra),setPosition:()=>writes++,onView:v=>view=v});
    assert.equal(c.key('ArrowRight',mods()),false);assert.equal(writes,0);assert.equal(view.available,P.present(sample(extra)).available);
  }
});
test('controller keeps progressing native playback, reports writer failures, and disposes without more reads',()=>{
  let s=sample(),reads=0,writes=[],errors=[],views=[];
  const c=P.createController({capture:()=>{reads++;return {...s};},setPosition:v=>{writes.push(v);s.position=v;},onView:v=>views.push(v),onError:e=>errors.push(e.message)});
  assert.equal(c.key('End',mods()),true);assert.deepEqual(writes,[6]);assert.equal(views.at(-1).value,6);
  c.dispose();let count=reads;assert.equal(c.pointer(50,0,100),false);assert.equal(c.refresh(),null);assert.equal(reads,count);
  const bad=P.createController({capture:()=>sample(),setPosition:()=>{throw Error('native seek refused');},onError:e=>errors.push(e.message)});
  assert.equal(bad.key('Home',mods()),false);assert.deepEqual(errors,['native seek refused']);
});
function elements(){
  const listeners={},attributes={};return {canvas:{dataset:{},tabIndex:0,setAttribute:(k,v)=>attributes[k]=v,
    addEventListener:(k,v)=>listeners[k]=v,removeEventListener:(k,v)=>{if(listeners[k]===v)delete listeners[k];},
    getBoundingClientRect:()=>({left:10,width:60}),focus(){this.focused=true;}},readout:{textContent:''},listeners,attributes};
}
test('DOM binding clears stale ARIA, releases unavailable keys, handles native seeks and removes only its listeners',()=>{
  const e=elements();let s=sample(),seeks=0,prevented=0;
  const c=DOM.bind({...e,capture:()=>({...s}),setPosition:v=>s.position=v,onSeek:()=>seeks++});
  assert.equal(e.attributes['aria-valuemax'],'6');assert.equal(e.canvas.tabIndex,0);
  e.listeners.keydown({key:'ArrowRight',shiftKey:true,altKey:false,ctrlKey:false,metaKey:false,preventDefault:()=>prevented++});
  assert.equal(s.position,.55);assert.equal(prevented,1);assert.equal(e.readout.textContent,'播放位置 00:00.550 ／ 00:06.000');
  e.listeners.click({clientX:40});assert.equal(s.position,3);assert.equal(e.canvas.focused,true);
  s=sample({source:null,current_source:null,duration:NaN,position:0,ready:false});c.refresh();
  assert.equal(e.attributes['aria-valuemax'],'0');assert.equal(e.attributes['aria-valuenow'],'0');assert.equal(e.attributes['aria-disabled'],'true');assert.equal(e.canvas.tabIndex,-1);
  e.listeners.keydown({key:'Home',shiftKey:false,altKey:false,ctrlKey:false,metaKey:false,preventDefault:()=>prevented++});
  assert.equal(prevented,1);assert.equal(seeks,2);c.dispose();assert.deepEqual(e.listeners,{});
});
test('fixed workbench assets load before app and player lifecycle refreshes independent media positioning',()=>{
  const fs=require('node:fs'),path=require('node:path'),root=path.join(__dirname,'..');
  const html=fs.readFileSync(path.join(root,'web/index.html'),'utf8'),app=fs.readFileSync(path.join(root,'web/app.js'),'utf8');
  assert.ok(html.indexOf('/wave-position.js')<html.indexOf('/wave-position-dom.js')&&html.indexOf('/wave-position-dom.js')<html.indexOf('/app.js'));
  assert.match(html,/aria-describedby="wave-position wave-controls"/);assert.match(html,/Shift＋方向鍵細調 0.05 秒/);
  assert.match(app,/\['loadstart','emptied','durationchange','error'\]/);assert.doesNotMatch(app,/function seek\(seconds\)/);
});

test('refused, ignored and displaced writes cannot report a successful waveform seek',()=>{
  for(const write of [()=>false,()=>{},(value,s)=>{s.position=value+.002;}]){
    let s=sample(),errors=[];
    const c=P.createController({capture:()=>({...s}),setPosition:value=>write(value,s),onError:e=>errors.push(e.message)});
    assert.equal(c.key('ArrowRight',mods()),false);assert.equal(errors.length,1);
  }
  let s=sample({position:0});
  const refused=P.createController({capture:()=>({...s}),setPosition:()=>false});
  assert.equal(refused.key('Home',mods()),false);
});

test('void native setters remain compatible only when their actual position is within one millisecond',()=>{
  for(const delta of [0,-.0004,.0004]){
    let s=sample(),errors=[];
    const c=P.createController({capture:()=>({...s}),setPosition:value=>{s.position=value+delta;},onError:e=>errors.push(e.message)});
    assert.equal(c.key('ArrowRight',mods()),true);assert.deepEqual(errors,[]);
  }
  const unchanged=P.createController({capture:()=>sample({position:0}),setPosition:()=>{}});
  assert.equal(unchanged.key('Home',mods()),true);
});

test('successful view comes from the same verified post-write snapshot without a second media read',()=>{
  let s=sample(),reads=0,view;
  const c=P.createController({capture:()=>{reads++;assert.ok(reads<=3);return {...s};},setPosition:value=>{s.position=value;},onView:value=>view=value});
  assert.equal(c.key('ArrowRight',mods()),true);assert.equal(reads,3);assert.equal(view.value,1);
});

test('source or duration changes inside a writer are displayed without accepting the old target',()=>{
  for(const change of [s=>{s.source=s.current_source='blob:b';},s=>{s.current_source='blob:old';},s=>{s.duration=7;},s=>{s.ready=false;},s=>{s.error=true;}]){
    let s=sample(),views=[],errors=[];
    const c=P.createController({capture:()=>({...s}),setPosition:value=>{s.position=value;change(s);},onView:v=>views.push(v),onError:e=>errors.push(e.message)});
    assert.equal(c.pointer(40,10,60),false);assert.equal(errors.length,1);
    assert.deepEqual(views.at(-1),P.present(s));
  }
});

test('natural pre-write playback progress is allowed while a malformed post-write source is refused',()=>{
  let s=sample(),reads=0;
  const c=P.createController({capture:()=>{if(++reads===2)s.position=.8;return {...s};},setPosition:value=>{s.position=value;}});
  assert.equal(c.key('ArrowRight',mods()),true);assert.equal(s.position,1);
  let malformed=false,errors=[];
  const broken=P.createController({capture:()=>malformed?{...sample(),extra:1}:sample(),setPosition:()=>{malformed=true;},onError:e=>errors.push(e.message)});
  assert.equal(broken.key('Home',mods()),false);assert.equal(errors.length,1);
});

test('throwing native writes refresh the current unavailable view and a later valid retry succeeds',()=>{
  let s=sample(),reject=true,views=[],errors=[];
  const c=P.createController({capture:()=>({...s}),setPosition:value=>{if(reject){s.ready=false;throw Error('native seek refused');}s.position=value;},onView:v=>views.push(v),onError:e=>errors.push(e.message)});
  assert.equal(c.key('ArrowRight',mods()),false);assert.equal(views.at(-1).available,false);
  s.ready=true;reject=false;assert.equal(c.key('ArrowRight',mods()),true);assert.equal(s.position,1);
  assert.deepEqual(errors,['native seek refused']);
});

test('disposal during current capture prevents writing and disposal inside a writer prevents success',()=>{
  let c;
  for(const stopAt of [1,2,3]){
    let reads=0,writes=0,callbacks=0,s=sample();
    c=P.createController({capture:()=>{if(++reads===stopAt)c.dispose();return {...s};},setPosition:value=>{writes++;s.position=value;},onView:()=>callbacks++,onError:()=>callbacks++});
    assert.equal(c.key('ArrowRight',mods()),false);assert.equal(reads,stopAt);assert.equal(writes,stopAt===3?1:0);assert.equal(callbacks,0);
  }
  let s=sample(),views=0;
  c=P.createController({capture:()=>({...s}),setPosition:value=>{s.position=value;c.dispose();},onView:()=>views++});
  assert.equal(c.key('ArrowRight',mods()),false);assert.equal(views,0);
});

test('DOM rejected seeks preserve focus and browser keys without firing success, then permit a verified retry',()=>{
  const e=elements();let s=sample(),refused=true,seeks=0,prevented=0,errors=[];
  const c=DOM.bind({...e,capture:()=>({...s}),setPosition:value=>{if(refused)return false;s.position=value;},onSeek:()=>seeks++,onError:error=>errors.push(error.message)});
  const key={key:'ArrowRight',shiftKey:false,altKey:false,ctrlKey:false,metaKey:false,preventDefault:()=>prevented++};
  e.listeners.keydown(key);e.listeners.click({clientX:40});
  assert.equal(s.position,.5);assert.equal(seeks,0);assert.equal(prevented,0);assert.equal(e.canvas.focused,undefined);
  assert.equal(e.attributes['aria-valuenow'],'0.5');assert.equal(errors.length,2);
  refused=false;e.listeners.keydown(key);assert.equal(s.position,1);assert.equal(seeks,1);assert.equal(prevented,1);
  e.listeners.click({clientX:40});assert.equal(s.position,3);assert.equal(seeks,2);assert.equal(e.canvas.focused,true);
  c.dispose();assert.deepEqual(e.listeners,{});
});

test('DOM writer errors clear stale ARIA before any success or focus claim',()=>{
  const e=elements();let s=sample(),seeks=0;
  const c=DOM.bind({...e,capture:()=>({...s}),setPosition:()=>{s.error=true;throw Error('native error');},onSeek:()=>seeks++});
  e.listeners.click({clientX:40});assert.equal(seeks,0);assert.equal(e.canvas.focused,undefined);
  assert.equal(e.attributes['aria-disabled'],'true');assert.equal(e.attributes['aria-valuemax'],'0');assert.equal(e.canvas.tabIndex,-1);
  c.dispose();
});
