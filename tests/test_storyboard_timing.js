// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const T=require('../web/storyboard-timing.js'),D=require('../web/storyboard-duration.js');
const panel=(duration='1',fps='24',first='.5',second='.5',tail='1')=>({fields:{'mv-duration':duration,'mv-fps':fps},shots:[{start:'0',end:first},{start:second,end:tail}]});
const wire=p=>{const data=T.report(p);return {data,files:{'storyboard-timing-review.json':JSON.stringify(data,null,2)+'\n','storyboard-timing-review.md':T.markdown(data)},meta:{version:'synthetic',protocol_version:1,needs_review:true}};};
test('time checks keep original strings and accept Python finite decimal forms without coercing hex',()=>{
  const p=panel('１','２４','0.5',' .5 ','１'),before=structuredClone(p);assert.equal(T.inspect(p).issueCount,0);assert.equal(T.report(p).total_frames,24);assert.deepEqual(p,before);
  for(const value of ['4e','0x18','NaN','Infinity','\ufeff24']){const p=panel();p.fields['mv-fps']=value;const r=T.inspect(p);assert.equal(r.issues[0].field,'mv-fps');assert.equal(r.issues[0].code,'invalid_number');assert.equal(p.fields['mv-fps'],value);}
});
test('missing globals and partial rows stay distinct from numeric zero',()=>{
  const p=panel('','','','','');p.shots[0].start='';const r=T.report(p);assert.equal(r.issue_count,6);assert.equal(r.timed_shots,0);assert.equal(r.total_frames,null);assert.ok(r.issues.every(i=>i.code==='missing_clock'));
  p.fields['mv-duration']='0';p.fields['mv-fps']='0';assert.equal(T.report(p).issues[0].code,'invalid_range');
});
test('seconds-only and frame-only boundary issues point to the original later row',()=>{
  for(const [first,second,code] of [['.5','.6','seconds_gap'],['.5','.4','seconds_overlap'],['.06251','.0616','frames_overlap'],['.06249','.0634','frames_gap']]){
    const p=panel('1','24',first,second),r=T.report(p);assert.ok(r.issues.some(i=>i.code===code&&i.row===2&&i.field==='start'&&i.related_row===1));assert.deepEqual(r.source,p);
  }
});
test('declaration and tail checks reject frame drift within one-millisecond tolerance',()=>{
  const r=T.report(panel('.93751','24','.1','.1','.9366'));assert.equal(r.issue_count,1);assert.equal(r.issues[0].code,'tail_frames');assert.equal(r.issues[0].row,2);
});
test('subframe shots and a zero-frame declaration have explicit issues',()=>{
  const r=T.report(panel('.001','24','.0005','.0005','.001'));assert.equal(r.total_frames,0);assert.ok(r.issues.some(i=>i.code==='short_declaration'));assert.equal(r.issues.filter(i=>i.code==='short_frame').length,2);
});
test('empty timelines are checked without inventing a shot',()=>{const p=panel();p.shots=[];const r=T.report(p);assert.equal(r.issue_count,1);assert.equal(r.issues[0].code,'no_shots');assert.deepEqual(p.shots,[]);});
test('an invalid previous row suppresses only dependent boundary checks',()=>{const p=panel('10','24','','9','10');const r=T.report(p);assert.equal(r.issue_count,1);assert.equal(r.timed_shots,1);assert.equal(r.issues[0].row,1);});
test('all 1000 rows count even when 200 returned details are full',()=>{const p=panel();p.shots=Array.from({length:1000},()=>({start:'',end:''}));const r=T.report(p);assert.equal(r.issue_count,2000);assert.equal(r.issues.length,200);assert.equal(r.total_shots,1000);assert.equal(r.details_truncated,true);});
test('strict source shape numeric types extra fields Unicode and byte caps refuse',()=>{
  for(const edit of [p=>p.extra='',p=>p.fields['mv-fps']=24,p=>p.shots[0].extra='',p=>p.shots=Array(1001).fill(p.shots[0]),p=>p.fields['mv-fps']='\ud800',p=>p.shots[0].start='漢'.repeat(3*1024*1024)]){const p=panel();edit(p);assert.throws(()=>T.inspect(p));}
});
test('projection keeps only the time fields while preserving raw clocks and order',()=>{
  const full={fields:{'mv-duration':' 1 ','mv-fps':'24',title:'irrelevant'},shots:[{start:'0',end:'4e',visual:'keep'}, {start:' .5 ',end:'1',motif_id:'keep'}],motifs:[]};
  const before=structuredClone(full),p=T.timingPanel(full);assert.deepEqual(p,panel(' 1 ','24','4e',' .5 '));assert.deepEqual(full,before);
});
test('full response checker isolates source and requires report JSON Markdown protocol and version',()=>{
  const p=panel(),reply=wire(p),accepted=T.checkedResult(p,reply);accepted.data.source.fields['mv-fps']='99';assert.equal(reply.data.source.fields['mv-fps'],'24');
  for(const edit of [r=>r.data.schema_version=2,r=>r.meta.protocol_version=2,r=>r.meta.needs_review=false,r=>r.files['extra.md']='x',r=>r.files['storyboard-timing-review.md']+='x',r=>r.files['storyboard-timing-review.json']='{"schema_version":1,"schema_version":1}',r=>r.data.source.shots.reverse()]){const r=wire(p);edit(r);assert.throws(()=>T.checkedResult(p,r));}
});
function controller(){const value={panel:panel('1','24','.06251','.0616'),ids:['a','b']};const c=T.createController({capture:()=>value});return {value,c};}
test('locate checks original clock order and stable IDs even for identical raw rows',()=>{
  for(const edit of [v=>v.panel.fields['mv-fps']='25',v=>v.panel.shots[0].end='.2',v=>v.panel.shots.reverse(),v=>v.ids.reverse(),v=>v.ids[0]='replaced',v=>v.panel.shots.pop()]){const {value,c}=controller();c.check();edit(value);assert.equal(c.locate(0),null);assert.equal(c.refresh().stale,true);}
});
test('unchanged timing permits locate and clear removes old report without writing',()=>{const {value,c}=controller(),before=structuredClone(value);c.check();assert.equal(c.locate(0).row,2);assert.deepEqual(value,before);c.clear();assert.equal(c.locate(0),null);assert.deepEqual(c.refresh(),{report:null,stale:false,revision:2});});
test('invalid IDs and changed unsupported source refuse without mutating original controls',()=>{const {value,c}=controller();value.ids=['a','a'];assert.throws(()=>c.check());value.ids=['a','b'];c.check();value.panel.shots[1].end=null;assert.equal(c.locate(0),null);assert.throws(()=>c.check());});
test('duration adoption shares the same decimal parser and frame diagnostics',()=>{
  const v={duration:'9',fps:'２４',shots:[{id:'a',start:'０',end:'.5'},{id:'b',start:'.5',end:'１'}]},before=structuredClone(v),p=D.proposal(v);assert.equal(p.after,'１');assert.equal(p.seconds,1);assert.equal(p.totalFrames,24);assert.deepEqual(v,before);
  v.shots[0].end='.06251';v.shots[1].start='.0616';assert.throws(()=>D.proposal(v),/影格接點有重疊/);
});
test('actual full storyboard event refuses time issues before a complete HTTP request or conversion',()=>{
  const code=fs.readFileSync('web/app.js','utf8'),a=code.indexOf("$('mv-build').onclick="),b=code.indexOf('function storyboardIssueTarget(',a),button={};let requested=0,planned=0;
  const ctx={$:()=>button,run:(_b,fn)=>fn(()=>true),storyboardReadyController:{check:()=>({report:{issueCount:0}})},checkStoryboardTiming:()=>false,MusicPlanning:{planningBrief:()=>planned++},MusicPlanReview:{inspect:()=>requested++}};
  vm.createContext(ctx);vm.runInContext(code.slice(a,b),ctx);assert.throws(()=>button.onclick(),/分鏡時間有待辦/);assert.equal(planned,0);assert.equal(requested,0);
});
function adapter(){
  const code=fs.readFileSync('web/app.js','utf8'),a=code.indexOf("$('mv-time-report').onclick="),b=code.indexOf("$('mv-ready-report').onclick=",a),nodes={'mv-time-report':{},'mv-visual':{hidden:false}},events=[],p=panel();let resolve;
  const ctx={$:id=>nodes[id],captureStoryboardTiming:()=>({panel:p,ids:['a','b']}),storyboardTimingController:{check:()=>events.push('local')},MusicStoryboardTiming:T,
    api:(route,payload)=>{events.push({route,payload:structuredClone(payload)});return new Promise(r=>resolve=r);},setFiles:(files,note)=>events.push({files,note}),say:s=>events.push(s),current:true,run:(_b,fn)=>fn(()=>ctx.current)};
  vm.createContext(ctx);vm.runInContext(code.slice(a,b),ctx);return {ctx,p,nodes,events,start:()=>nodes['mv-time-report'].onclick(),reply:r=>resolve(r)};
}
test('actual report event uses the shared service and checked source before replacing output',async()=>{const a=adapter(),work=a.start();assert.equal(a.events[1].route,'/api/storyboard-timing-review');a.reply(wire(a.p));await work;assert.equal(a.nodes['mv-visual'].hidden,true);assert.ok(a.events.some(e=>e.files?.['storyboard-timing-review.json']));});
test('actual delayed and mismatched report events cannot hide or replace a previous result',async()=>{
  const a=adapter(),work=a.start();a.ctx.current=false;a.reply(wire(a.p));await work;assert.equal(a.nodes['mv-visual'].hidden,false);assert.equal(a.events.filter(e=>e.files).length,0);
  const b=adapter(),foreign=b.start(),r=wire(b.p);r.data.source.shots[0].end='.1';b.reply(r);await assert.rejects(foreign,/來源或版本不一致/);assert.equal(b.nodes['mv-visual'].hidden,false);assert.equal(b.events.filter(e=>e.files).length,0);
});
