// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const M=require('../web/music-readiness.js'),S=require('../web/storyboard-readiness.js'),T=require('../web/storyboard-timing.js'),E=require('../web/editor-state.js'),P=require('../web/planning-import.js');
function fixture(){
 const panels={};for(const [name,fields] of Object.entries(E.draftFields)){panels[name]={fields:Object.fromEntries(fields.map(k=>[k,'']))};if(E.draftRows[name])panels[name][E.draftRows[name].key]=[];}panels.music.avoid=[];panels.music.deliverables=[];panels.storyboard.motifs=[];panels.lyrics.fields['lyrics-format']='.lrc';panels.audio.fields['audio-profile']='video';
 let d={format:'zoe-music-lab-draft',schema_version:3,tool_version:'test',saved_at:'',tab:'music',panels};d=P.planningDraft(d,'music',JSON.parse(fs.readFileSync('examples/first-light-music.json')));d=P.planningDraft(d,'storyboard',JSON.parse(fs.readFileSync('examples/first-light-mv.json')));
 d.panels.music.sections[0].name='';d.panels.storyboard.shots[0].visual='';d.panels.storyboard.shots[0].start='';return d;
}
for(const kind of ['music','creative','timing']){
 function setup(){const d=fixture(),model={music:M,creative:S,timing:T}[kind],panel=kind==='music'?d.panels.music:kind==='creative'?d.panels.storyboard:T.timingPanel(d.panels.storyboard),rows=panel[kind==='music'?'sections':'shots'];let ids=rows.map((_,i)=>'row-'+i);const c=kind==='timing'?model.createController({capture:()=>({panel,ids})}):model.createController({capture:()=>panel,captureIds:()=>ids});return {panel,c,get ids(){return ids;},set ids(v){ids=v;}};}
 test(kind+' ID checkpoint ignores caller methods and iterator instead of masking a new row order',()=>{
  const x=setup(),normal=[...x.ids],before=structuredClone(x.panel);let calls=0;
  x.ids.some=()=>{calls++;assert.fail('caller some');};x.ids.map=()=>{calls++;assert.fail('caller map');};x.ids[Symbol.iterator]=function*(){calls++;yield*normal;};
  const v=x.c.check();assert.ok(x.c.locate(0,v.revision));[x.ids[0],x.ids[1]]=[x.ids[1],x.ids[0]];
  assert.equal(x.c.locate(0,v.revision),null);assert.equal(x.c.refresh().stale,true);assert.equal(calls,0);assert.deepEqual(x.panel,before);
  const fresh=x.c.check();assert.ok(x.c.locate(0,fresh.revision));assert.equal(x.c.locate(0,v.revision),null);
 });
 test(kind+' ID checkpoint requires own dense bounded unique original identities and preserves the last report',()=>{
  const changes=[a=>{delete a[0];},a=>{const p=Object.create(Array.prototype);p[0]=a[0];delete a[0];Object.setPrototypeOf(a,p);},a=>a[0]='x'.repeat(65),a=>a[0]='',a=>a[0]=1,a=>a[1]=a[0],a=>a.pop(),a=>a.push('extra')];
  for(const change of changes){const x=setup(),before=structuredClone(x.panel),good=x.c.check(),normal=[...x.ids];change(x.ids);assert.throws(()=>x.c.check());const bad=x.c.refresh();assert.equal(bad.revision,good.revision);assert.deepEqual(bad.report,good.report);assert.equal(bad.stale,true);assert.equal(x.c.locate(0,good.revision),null);assert.deepEqual(x.panel,before);x.ids=normal;assert.equal(x.c.refresh().stale,false);assert.ok(x.c.locate(0,good.revision));}
 });
 test(kind+' ID checkpoint reads a fixed initial length and refuses a getter that grows it',()=>{
  const x=setup(),good=x.c.check(),normal=[...x.ids],before=structuredClone(x.panel);let reads=0;
  Object.defineProperty(x.ids,0,{configurable:true,enumerable:true,get(){reads++;x.ids.push('added-'+reads);return normal[0];}});
  assert.throws(()=>x.c.check());assert.equal(reads,1);assert.deepEqual(x.panel,before);x.ids=normal;const v=x.c.refresh();assert.equal(v.revision,good.revision);assert.deepEqual(v.report,good.report);assert.ok(x.c.locate(0,good.revision));
 });
 test(kind+' valid 64-unit IDs and empty row sources remain supported without changing report or source',()=>{
  const x=setup(),before=structuredClone(x.panel),old=x.c.check();x.ids[0]='x'.repeat(64);const fresh=x.c.check();assert.deepEqual(fresh.report,old.report);assert.ok(x.c.locate(0,fresh.revision));assert.deepEqual(x.panel,before);
  x.panel[kind==='music'?'sections':'shots']=[];x.ids=[];const empty=x.c.check();assert.ok(empty.report.issueCount>0);assert.equal(empty.stale,false);
 });
}
test('optional original music and creative no-ID controller callers keep their interface',()=>{const d=fixture();for(const [model,panel] of [[M,d.panels.music],[S,d.panels.storyboard]]){const c=model.createController({capture:()=>panel}),v=c.check();assert.deepEqual(v.report,model.inspect(panel));assert.ok(c.locate(0));assert.ok(c.locate(0,v.revision));}});
test('existing fixed pure identity asset loads before all three readiness models without new asset',()=>{const html=fs.readFileSync('web/index.html','utf8'),position=html.indexOf('src="/editor-focus.js"');assert.ok(position>=0);for(const name of ['music-readiness','storyboard-readiness','storyboard-timing'])assert.ok(html.indexOf('src="/'+name+'.js"')>position);});
