// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const N=require('../web/delivery-navigation.js'),D=require('../web/delivery-navigation-dom.js');
const source=()=>({scope:'music',names:['brief.json','music-plan.json'],busy:false,dirty:false,error:false,message:'已建立'});
function harness(){const s=source(),events=[],views=[];let output=true;const c=N.createController({capture:()=>s,render:v=>views.push(v),goOutput:()=>{events.push('output');return output;},goEditor:scope=>{events.push(scope);return true;}});return {s,c,events,views,fail:()=>output=false};}
test('empty results cannot navigate and all four workbenches have their own return labels',()=>{
  for(const scope of ['music','storyboard','lyrics','audio']){const m=N.describe({...source(),scope,names:[]});assert.equal(m.canView,false);assert.equal(m.count,0);assert.match(m.note,/尚無成果/);assert.ok(m.label);}
});
test('delivery summary preserves its input and distinguishes stale readable files from downloadable current results',()=>{
  const s=source(),before=structuredClone(s);assert.equal(N.describe(s).canView,true);assert.equal(N.describe(s).count,2);assert.deepEqual(s,before);
  const stale=N.describe({...s,dirty:true});assert.equal(stale.canView,true);assert.match(stale.button,/上一份/);assert.match(stale.note,/下載已停用/);
});
test('busy work blocks result navigation even when a previous bundle exists and errors are preserved literally',()=>{
  const m=N.describe({...source(),busy:true,error:true,message:'<script>原始錯誤</script>'});assert.equal(m.canView,false);assert.equal(m.error,true);assert.match(m.note,/<script>原始錯誤<\/script>/);
});
test('unknown workbenches and invalid result states fail instead of implying a valid delivery',()=>{
  for(const change of [{scope:'__proto__'},{scope:'other'},{names:['']},{names:[12]},{names:Array(33).fill('x')},{busy:1},{dirty:null},{message:null},{error:'yes'}])assert.throws(()=>N.describe({...source(),...change}));
  assert.throws(()=>N.createController({capture:()=>source()}));
});
test('refresh and late result updates never move focus until the user explicitly navigates',()=>{
  const h=harness();h.c.refresh();h.s.names.push('tasks.md');h.c.refresh();assert.deepEqual(h.events,[]);assert.equal(h.views.at(-1).count,3);assert.equal(h.views.at(-1).canReturn,false);
  assert.equal(h.c.show('music'),true);assert.deepEqual(h.events,['output']);assert.equal(h.c.back(),true);assert.deepEqual(h.events,['output','music']);
});
test('switching workbench invalidates a previous return target and uses the latest bundle on re-entry',()=>{
  const h=harness();h.c.show('music');h.s.scope='lyrics';h.s.names=[];assert.equal(h.c.back(),false);assert.equal(h.c.show('music'),false);assert.deepEqual(h.events,['output']);
  h.s.names=['lyrics.json'];assert.equal(h.c.show('lyrics'),true);assert.equal(h.c.back(),true);assert.deepEqual(h.events,['output','output','lyrics']);
});
test('a stale click rechecks empty results and busy state without leaving the current workbench',()=>{
  const h=harness();h.c.refresh();h.s.names=[];assert.equal(h.c.show('music'),false);h.s.names=['old.json'];h.s.busy=true;assert.equal(h.c.show('music'),false);assert.deepEqual(h.events,[]);
});
test('an in-flight task temporarily blocks return while preserving the original target after completion',()=>{
  const h=harness();h.c.show('music');h.s.busy=true;assert.equal(h.c.back(),false);h.s.busy=false;assert.equal(h.c.back(),true);assert.deepEqual(h.events,['output','music']);
});
test('failed output focus does not issue a false return target and cleared results still allow return to editing',()=>{
  const h=harness();h.fail();assert.equal(h.c.show('music'),false);assert.equal(h.c.back(),false);
  const good=harness();good.c.show('music');good.s.names=[];assert.equal(good.c.back(),true);assert.deepEqual(good.events,['output','music']);
});
function dom(){
  const ids={},events=[],s=source();
  for(const id of ['output-region','output-heading','delivery-back','music-build','mv-build','lyrics-build','audio-build',...['music','storyboard','lyrics','audio'].flatMap(k=>[k+'-delivery-view',k+'-delivery-status'])])ids[id]={id,disabled:false,textContent:'',scrollTop:99,classList:{toggle:(_key,value)=>ids[id].error=value},scrollIntoView:config=>events.push({action:'scroll',id,config}),focus:config=>events.push({action:'focus',id,config})};
  const c=D.createAdapter({getElementById:id=>ids[id]},()=>s);return {c,ids,events,s};
}
test('DOM adapter exposes one active shortcut and explicit navigation focuses the heading then original shortcut',()=>{
  const h=dom();assert.equal(h.ids['music-delivery-view'].disabled,false);assert.equal(h.ids['lyrics-delivery-view'].disabled,true);assert.deepEqual(h.events,[]);
  h.ids['music-delivery-view'].onclick();assert.equal(h.ids['output-region'].scrollTop,0);assert.equal(h.events.at(-1).id,'output-heading');assert.equal(h.events.at(-1).config.preventScroll,true);
  h.ids['delivery-back'].onclick();assert.equal(h.events.at(-1).id,'music-delivery-view');assert.equal(h.events.at(-2).config.behavior,'auto');assert.deepEqual(h.s,source());
});
test('DOM rendering treats error text as literal text and switching panels cannot return to a hidden button',()=>{
  const h=dom();h.s.message='<img onerror=bad>';h.s.error=true;h.c.refresh();assert.match(h.ids['music-delivery-status'].textContent,/<img onerror=bad>/);assert.equal(h.ids['music-delivery-status'].error,true);
  h.ids['music-delivery-view'].onclick();h.s.scope='audio';h.c.refresh();assert.equal(h.ids['delivery-back'].disabled,true);assert.equal(h.ids['music-delivery-view'].disabled,true);assert.match(h.ids['delivery-back'].textContent,/交付檢查/);
});
test('clearing a bundle keeps return usable by focusing the enabled build control instead of a disabled shortcut',()=>{
  const h=dom();h.ids['music-delivery-view'].onclick();h.s.names=[];h.c.refresh();assert.equal(h.ids['music-delivery-view'].disabled,true);assert.equal(h.ids['delivery-back'].disabled,false);
  h.ids['delivery-back'].onclick();assert.equal(h.events.at(-1).id,'music-build');assert.equal(h.events.at(-1).action,'focus');assert.deepEqual(h.s.names,[]);
});
