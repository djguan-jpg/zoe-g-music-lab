// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const planning=require('../web/planning-import.js'),input=require('../web/planning-report-input.js'),review=require('../web/storyboard-readiness.js'),undo=require('../web/draft-undo.js'),replacement=require('../web/replacement-preview.js'),f=require('./planning_report_fixture.js');
const example=()=>JSON.parse(fs.readFileSync('examples/first-light-mv.json','utf8'));
const ratios=['16:9','3:2','2.39:1',' 2.39:1 ',' ９：１６ ','需求待定','原值\r\n🎵',''];
test('completed requirement custom ratio roundtrips raw text without changing other panels or creative values',()=>{
 for(const ratio of ratios){const current=f.draft(),before=structuredClone(current),brief=example();brief.aspect_ratio=ratio;
  const draft=planning.planningDraft(current,'storyboard',brief),returned=planning.planningBrief(draft,'storyboard');
  assert.equal(draft.panels.storyboard.fields['mv-ratio'],ratio);assert.equal(returned.aspect_ratio,ratio);
  assert.deepEqual(returned.shots,brief.shots.map(s=>({...s,start:String(s.start),end:String(s.end)})));assert.deepEqual(current,before);
  for(const key of ['music','lyrics','audio'])assert.deepEqual(draft.panels[key],before.panels[key]);
 }
});
test('full diagnostic source preserves custom ratio, unfinished times and original motif IDs through scoped proposal',()=>{
 for(const ratio of ratios){const source=f.panel('storyboard');source.fields['mv-ratio']=ratio;
  const report=review.report(source),selected=input.inspect('storyboard',report),draft=planning.panelDraft(f.draft(),'storyboard',selected.panel);
  assert.deepEqual(draft.panels.storyboard,source);assert.equal(draft.panels.storyboard.shots[0].start,'');assert.equal(draft.panels.storyboard.shots[0].motif_id,'motif-7');
  const bad=structuredClone(report);bad.source.fields['mv-ratio']='';
  if(ratio.trim())assert.throws(()=>input.inspect('storyboard',bad));
 }
});
test('custom ratio scoped Undo matches actual after, refuses later edits, and preserves independent other panels',()=>{
 const before=f.draft(),source=f.panel('storyboard');source.fields['mv-ratio']='2.39:1';
 const after=planning.panelDraft(before,'storyboard',source),history=undo.createUndo();history.record(before,after,'storyboard');
 const edited=structuredClone(after);edited.panels.storyboard.fields['mv-ratio']='3:2';assert.throws(()=>history.proposal(edited));
 edited.panels.storyboard.fields['mv-ratio']='2.39:1';edited.panels.music.fields['music-title']='later song';
 const proposed=history.proposal(edited);assert.deepEqual(proposed.draft.panels.storyboard,before.panels.storyboard);assert.equal(proposed.draft.panels.music.fields['music-title'],'later song');
});
test('custom ratio edits after complete report preview invalidate selected target while preserving the original file source',async()=>{
 let current=f.draft(),ready=[];const source=f.panel('storyboard');source.fields['mv-ratio']='2.39:1';const report=review.report(source),raw=new TextEncoder().encode(JSON.stringify(report));
 const guard=replacement.createPreview({capture:()=>({draft:current,media:[{}]})}),controller=planning.createBriefImport({preview:guard,validate:async(op,d)=>input.inspect(op,d),onReady:r=>ready.push(r),onError:e=>{throw e;}});
 assert.equal(await controller.read({name:'storyboard-review.json',size:raw.length,arrayBuffer:async()=>raw.buffer},'storyboard'),true);
 current.panels.storyboard.fields['mv-ratio']='3:2';assert.throws(()=>guard.proposal());assert.equal(ready[0].result.panel.fields['mv-ratio'],'2.39:1');assert.equal(report.source.fields['mv-ratio'],'2.39:1');
});
