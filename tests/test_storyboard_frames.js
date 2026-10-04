// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),path=require('node:path'),fs=require('node:fs'),vm=require('node:vm');
const {execFileSync}=require('node:child_process');
const Frames=require('../web/storyboard-frames.js'),Review=require('../web/planning-review.js'),Seed=require('../web/storyboard-seed.js');
const root=path.join(__dirname,'..');
const fixtures=JSON.parse(execFileSync(process.platform==='win32'?'python':'python3',['-X','utf8','-c',
  "import json;from pathlib import Path;from musiclab.application import build;from musiclab.storyboard_frames import frame_index;p=json.loads(Path('examples/first-light-mv.json').read_text(encoding='utf-8'));pairs=[(i/8,8) for i in range(25)]+[(v,f) for f in [23.976,29.97,59.94,120] for v in [.06249,.0625,.06251,.93749,.9375,.93751,14400.0009]];print(json.dumps({'report':build('storyboard',p).wire(),'pairs':[[s,f,frame_index(s,f)] for s,f in pairs],'seed':build('storyboard_seed',{'music':json.loads(Path('examples/first-light-music.json').read_text(encoding='utf-8')),'fps':23.9375}).data}))"],{cwd:root,encoding:'utf8',timeout:10000}));
const report=()=>structuredClone(fixtures.report);

test('actual browser draft capture records the current application product version separately from schema',()=>{
  const source=fs.readFileSync(path.join(root,'web/app.js'),'utf8');
  const start=source.indexOf('function captureDraft(){'),end=source.indexOf('function applyDraft(',start);
  assert.ok(start>=0&&end>start);
  const context={MusicEditor:require('../web/editor-state.js'),MusicDeliveryVersions:require('../musiclab/assets/delivery-versions.js'),capturePanel:()=>({}),state:{tab:'storyboard'}};
  vm.createContext(context);vm.runInContext(source.slice(start,end),context);
  const draft=context.captureDraft();assert.equal(draft.tool_version,fixtures.report.meta.version);assert.equal(draft.schema_version,3);
});

test('cross-language fractional FPS, near half and even ties match actual Python boundaries',()=>{
  for(const [seconds,fps,expected] of fixtures.pairs)assert.equal(Frames.frameIndex(seconds,fps),expected);
  for(let i=0;i<20;i++)assert.equal(Frames.frameIndex((i+.5)/8,8),i%2===0?i:i+1);
});
test('frame helper refuses booleans strings nonfinite and range violations',()=>{
  for(const [s,f] of [[true,24],['1',24],[-1,24],[NaN,24],[14401,24],[1,0],[1,121],[1,Infinity]])assert.throws(()=>Frames.frameIndex(s,f));
});
test('actual completed report exposes exact total and exclusive declaration without mutation',()=>{
  const r=report(),before=structuredClone(r),model=Review.buildReview('storyboard',r);
  assert.deepEqual(model.frames,{totalFrames:576,endSemantics:'exclusive',rounding:'nearest_ties_to_even',declared:true});assert.deepEqual(r,before);
});
test('modern report without declaration refuses while valid older report remains explicit legacy',()=>{
  const r=report();delete r.data.frame_timeline;assert.throws(()=>Review.buildReview('storyboard',r));
  r.meta.version='0.22.0';assert.equal(Review.buildReview('storyboard',r).frames.declared,false);
});
test('future major version still requires the independent completed frame declaration',()=>{
  const r=report();r.meta.version='1.0.0';delete r.data.frame_timeline;assert.throws(()=>Review.buildReview('storyboard',r));
});
test('malformed product metadata cannot bypass required completed frame declaration as legacy',()=>{
  for(const version of ['unknown','-1.0.0','0.023.0','0.23','0.23.0-extra','9007199254740992.0.0']){
    const r=report();r.meta.version=version;delete r.data.frame_timeline;assert.throws(()=>Review.buildReview('storyboard',r));
  }
});
test('unknown frame schema rounding semantics totals and extra declaration fields refuse',()=>{
  for(const change of [d=>d.schema_version=2,d=>d.format='other',d=>d.rounding='ceil',d=>d.end_semantics='inclusive',d=>d.total_frames++,d=>d.total_frames='576',d=>d.extra=true]){
    const r=report();change(r.data.frame_timeline);assert.throws(()=>Review.buildReview('storyboard',r));
  }
});
test('completed reports refuse missing or forged frame fields despite valid seconds and motifs',()=>{
  for(const change of [s=>delete s.start_frame,s=>s.start_frame=true,s=>s.start_frame=1,s=>s.end_frame_exclusive++,s=>s.end_frame_exclusive=143.5]){
    const r=report();change(r.data.shots[0]);assert.throws(()=>Review.buildReview('storyboard',r));
  }
});
function tiny(end,start,duration=1,tail=duration){
  return {duration_seconds:duration,fps:24,shots:[{start:0,end,start_frame:0,end_frame_exclusive:Frames.frameIndex(end,24)},
    {start,end:tail,start_frame:Frames.frameIndex(start,24),end_frame_exclusive:Frames.frameIndex(tail,24)}]};
}
test('original sub-millisecond overlap and gap refuse even legacy undeclared plans',()=>{
  for(const [end,start] of [[.06251,.0616],[.06249,.0634],[.104,.105]])assert.throws(()=>Frames.validateTimeline(tiny(end,start)));
});
test('original tolerated missing and extra final frame refuse',()=>{
  for(const [duration,tail] of [[.93751,.9366],[.93749,.9384]])assert.throws(()=>Frames.validateTimeline(tiny(.1,.1,duration,tail)));
});
test('precise correction and harmless same-frame seconds differences recover without mutation',()=>{
  for(const d of [tiny(.0625,.0625),tiny(.1,.1009)]){
    const before=structuredClone(d);assert.equal(Frames.validateTimeline(d).totalFrames,24);assert.deepEqual(d,before);
  }
});
test('zero frame shots empty timelines and too long duration refuse',()=>{
  for(const d of [tiny(.01,.01),{duration_seconds:1,fps:24,shots:[]},tiny(.1,.1,14400.001)])assert.throws(()=>Frames.validateTimeline(d));
});
test('shared seed validator refuses alternative tie-even boundary formerly inside half frame tolerance',()=>{
  const s=structuredClone(fixtures.seed);
  // 8 s * 23.9375 = 191.5: even rule requires 192, not the equally near 191.
  assert.equal(s.slots[0].end_frame_exclusive,192);
  s.slots[0].end_frame_exclusive=191;assert.throws(()=>Seed.validateSeed(s));
  assert.doesNotThrow(()=>Seed.validateSeed(fixtures.seed));
});
test('current invalid frame response preserves prior result and a corrected response commits once',async()=>{
  const commits=[],brief=JSON.parse(fixtures.report.files['mv-brief.json']),r=report();r.data.frame_timeline.schema_version=99;
  const args={operation:'storyboard',brief,isCurrent:()=>true,onResult:(_r,m)=>commits.push(m)};
  await assert.rejects(Review.inspect({...args,request:async()=>r}));assert.equal(commits.length,0);
  assert.equal(await Review.inspect({...args,request:async()=>report()}),true);assert.equal(commits.length,1);
});
test('obsolete invalid frame response is ignored before contract checking or output replacement',async()=>{
  const r=report();r.data.shots[0].start_frame=99;
  assert.equal(await Review.inspect({operation:'storyboard',brief:{title:r.data.title},isCurrent:()=>false,request:async()=>r,onResult:()=>assert.fail('obsolete output')}),false);
});
