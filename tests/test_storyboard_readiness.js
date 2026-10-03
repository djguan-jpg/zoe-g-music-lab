// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const R=require('../web/storyboard-readiness.js'),Editor=require('../web/editor-state.js'),Planning=require('../web/planning-import.js');
function draft(){
  const panels={};for(const [name,fields] of Object.entries(Editor.draftFields)){
    panels[name]={fields:Object.fromEntries(fields.map(k=>[k,'']))};if(Editor.draftRows[name])panels[name][Editor.draftRows[name].key]=[];
  }
  panels.music.avoid=[];panels.music.deliverables=[];panels.storyboard.motifs=[];panels.lyrics.fields['lyrics-format']='.lrc';panels.audio.fields['audio-profile']='video';
  return Planning.planningDraft({format:'zoe-music-lab-draft',schema_version:3,tool_version:'test',saved_at:'',tab:'storyboard',panels},'storyboard',JSON.parse(fs.readFileSync(path.join(__dirname,'../examples/first-light-mv.json'),'utf8')));
}
function controller(){const value=draft(),states=[];const c=R.createController({capture:()=>value.panels.storyboard,onState:s=>states.push(s)});return {value,states,c};}
test('complete original fields produce an isolated read-only checklist and optional change reason stays empty',()=>{
  const p=draft().panels.storyboard;for(const s of p.shots)s.change_reason='';const before=structuredClone(p),r=R.inspect(p);
  assert.equal(r.issueCount,0);assert.equal(r.filledShots,4);assert.deepEqual(p,before);r.issues.push({bad:true});assert.equal(R.inspect(p).issueCount,0);
});
test('every required global and shot field is located in original order without filling or rewriting it',()=>{
  for(const field of Editor.draftFields.storyboard){const p=draft().panels.storyboard;p.fields[field]=' \u0085 ';const r=R.inspect(p);assert.ok(r.issues.some(i=>i.scope==='fields'&&i.row===0&&i.field===field));assert.equal(p.fields[field],' \u0085 ');}
  for(const field of Editor.draftRows.storyboard.columns.filter(k=>k!=='change_reason')){const p=draft().panels.storyboard;p.shots[2][field]='';const r=R.inspect(p);assert.ok(r.issues.some(i=>i.scope==='shots'&&i.row===3&&i.field===field));assert.equal(r.filledShots,3);assert.equal(p.shots[2][field],'');}
});
test('empty lists get useful global locations without inventing motifs or shots',()=>{
  const p=draft().panels.storyboard;p.motifs=[];p.shots=[];const r=R.inspect(p);assert.deepEqual(r.issues.map(i=>i.code),['no_motifs','no_shots']);assert.equal(r.filledShots,0);
});
test('missing and dangling references distinguish the source shot and leave other rows untouched',()=>{
  const p=draft().panels.storyboard;p.shots[1].motif_id='';p.shots[3].motif_id='motif-999';const before=structuredClone(p),r=R.inspect(p);
  assert.deepEqual(r.issues.map(i=>[i.row,i.code]),[[2,'missing_field'],[4,'unknown_motif']]);assert.equal(r.filledShots,2);assert.deepEqual(p,before);
});
test('unfinished selected motifs are located as both source motif fields and referenced shots',()=>{
  for(const field of ['name','meaning']){const p=draft().panels.storyboard;p.motifs[0][field]='\u0085';const r=R.inspect(p);assert.ok(r.issues.some(i=>i.scope==='motifs'&&i.row===1&&i.field===field));assert.ok(r.issues.some(i=>i.code==='incomplete_motif'&&i.relatedRow===1));}
});
test('trimmed duplicate names mark both motifs and all ambiguous references without merging IDs',()=>{
  const p=draft().panels.storyboard;p.motifs.push({id:'motif-99',name:'\u0085 '+p.motifs[0].name+' ',meaning:'another original meaning'});const r=R.inspect(p);
  assert.equal(r.issues.filter(i=>i.code==='duplicate_motif_name').length,2);assert.ok(r.issues.some(i=>i.code==='ambiguous_motif'));assert.equal(p.motifs.at(-1).id,'motif-99');
});
test('object-looking motif names remain ordinary registry data',()=>{
  const p=draft().panels.storyboard;p.motifs[0].name='__proto__';assert.equal(R.inspect(p).issueCount,0);p.motifs.push({id:'motif-999',name:' __proto__ ',meaning:'other'});assert.ok(R.inspect(p).issues.some(i=>i.code==='duplicate_motif_name'));
});
test('nonblank clocks retain raw submillisecond values and invalid numeric values still require domain validation',()=>{
  const p=draft().panels.storyboard;p.fields['mv-duration']='24.0004';p.fields['mv-fps']='29.97';p.shots.at(-1).end='24.0004';const before=structuredClone(p);assert.equal(R.inspect(p).issueCount,0);assert.deepEqual(p,before);
  p.shots[1].start='5';p.fields['mv-fps']='invalid';assert.equal(R.inspect(p).issueCount,0);assert.equal(p.shots[1].start,'5');
});
test('invalid direction is a located choice issue while optional explanation never becomes required',()=>{
  const p=draft().panels.storyboard;p.shots[1].screen_direction='diagonal';p.shots[1].change_reason='';const r=R.inspect(p);assert.equal(r.issues[0].field,'screen_direction');assert.equal(r.issues[0].row,2);assert.equal(r.issues[0].code,'invalid_direction');assert.ok(!r.issues.some(i=>i.field==='change_reason'));
});
test('all thousand rows are counted even when only two hundred issue details are retained',()=>{
  const p=draft().panels.storyboard;p.shots=Array.from({length:1000},()=>Object.fromEntries(Editor.draftRows.storyboard.columns.map(k=>[k,k==='screen_direction'?'neutral':''])));const r=R.inspect(p);
  assert.equal(r.totalShots,1000);assert.equal(r.issueCount,10000);assert.equal(r.issues.length,200);assert.equal(r.filledShots,0);assert.equal(r.truncated,true);
});
test('shape row caps identities invalid Unicode and eight MiB limits fail before producing a misleading checklist',()=>{
  for(const edit of [p=>p.extra=true,p=>p.shots[0].extra='data',p=>p.shots[0].start=0,p=>p.fields['mv-title']=null,p=>p.motifs[0].id='bad',p=>p.motifs.push({...p.motifs[0]}),p=>p.motifs=Array.from({length:31},(_,i)=>({id:'motif-'+(i+1),name:'n',meaning:'m'})),p=>p.shots=Array(1001).fill(p.shots[0]),p=>p.fields['mv-title']='\ud800',p=>p.fields['mv-title']='漢'.repeat(3*1024*1024)]){const p=draft().panels.storyboard;edit(p);assert.throws(()=>R.inspect(p));}
});
test('controller captures only storyboard; other panels and media do not stale the report',()=>{
  const {value,c}=controller();value.panels.storyboard.shots[2].visual='';const media={native:true},before=structuredClone(value);const view=c.check();value.panels.music.fields['music-title']='later music';assert.equal(c.refresh().stale,false);assert.equal(c.locate(0).row,3);assert.deepEqual(value.panels.storyboard,before.panels.storyboard);assert.equal(media.native,true);view.report.issues[0].row=99;assert.equal(c.locate(0).row,3);
});
test('silent edits are checked again at location time without trusting old positional buttons',()=>{
  for(const edit of [p=>p.shots.reverse(),p=>p.shots.pop(),p=>p.shots[0].end='5.9',p=>p.motifs[0].name='later name',p=>p.fields['mv-duration']='60',p=>p.shots[2].change_reason='later optional reason']){
    const {value,c,states}=controller();value.panels.storyboard.shots[2].visual='';c.check();edit(value.panels.storyboard);const before=structuredClone(value);assert.equal(c.locate(0),null);assert.equal(states.at(-1).stale,true);assert.deepEqual(value,before);
  }
});
test('canonical key order remains current; recovery rechecks the same exact source and clear removes transient report',()=>{
  const {value,c}=controller();value.panels.storyboard.shots[2].visual='';c.check();const original=structuredClone(value.panels.storyboard);value.panels.storyboard.fields=Object.fromEntries(Object.entries(original.fields).reverse());assert.equal(c.refresh().stale,false);value.panels.storyboard.shots[2].visual='later';assert.equal(c.refresh().stale,true);value.panels.storyboard=original;assert.equal(c.refresh().stale,false);assert.equal(c.locate(0).row,3);c.clear();assert.equal(c.locate(0),null);assert.equal(c.refresh().report,null);
});
test('an invalid changed source and invalid issue indexes cannot locate or rewrite a control',()=>{
  const {value,c}=controller();value.panels.storyboard.shots[2].visual='';c.check();for(const index of [-1,1.5,200,NaN])assert.equal(c.locate(index),null);value.panels.storyboard.shots[2].start=null;assert.equal(c.locate(0),null);assert.equal(c.refresh().stale,true);assert.throws(()=>c.check());
});
test('actual build handler locates an unselected motif before planning conversion or HTTP',()=>{
  const code=fs.readFileSync(path.join(__dirname,'../web/app.js'),'utf8'),start=code.indexOf("$('mv-build').onclick="),end=code.indexOf('function storyboardIssueTarget',start);
  const d=draft();d.panels.storyboard.shots[2].motif_id='';const button={};let located=null,requests=0,planning=0,status='';const c=R.createController({capture:()=>d.panels.storyboard});
  const ctx={$:()=>button,run:(_b,fn)=>{try{fn(()=>true);}catch(e){status=e.message;}},storyboardReadyController:c,locateStoryboardIssue:i=>located=c.locate(i),MusicPlanning:{planningBrief:()=>planning++},getShots:()=>{throw Error('should not read shots');},api:()=>requests++};
  vm.createContext(ctx);vm.runInContext(code.slice(start,end),ctx);button.onclick();assert.equal(located.row,3);assert.equal(located.field,'motif_id');assert.equal(planning,0);assert.equal(requests,0);assert.match(status,/已定位/);
});
test('actual build handler keeps the existing full validation path after field readiness',async()=>{
  const code=fs.readFileSync(path.join(__dirname,'../web/app.js'),'utf8'),start=code.indexOf("$('mv-build').onclick="),end=code.indexOf('function storyboardIssueTarget',start),d=draft(),button={};let operation,selected,result;
  const ctx={$:()=>button,run:(_b,fn)=>fn(()=>true),storyboardReadyController:R.createController({capture:()=>d.panels.storyboard}),locateStoryboardIssue:()=>{throw Error('should not locate');},MusicPlanning:Planning,captureDraft:()=>d,getShots:()=>Planning.planningBrief(d,'storyboard').shots,MusicPlanReview:{inspect:async options=>{assert.equal(options.isCurrent(),true);return options.request(options.operation,options.brief);}},api:async (route,brief)=>{operation=route;selected=brief;return 'full-domain'},applyPlanningResult:()=>{}};
  vm.createContext(ctx);vm.runInContext(code.slice(start,end),ctx);result=await button.onclick();assert.equal(operation,'/api/storyboard');assert.equal(result,'full-domain');assert.deepEqual(selected,Planning.planningBrief(d,'storyboard'));
});
