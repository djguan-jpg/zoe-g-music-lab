// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const V=require('../web/planning-values.js'),T=require('../web/storyboard-timing.js'),D=require('../web/storyboard-duration.js'),E=require('../web/editor-state.js'),S=require('../web/planning-source.js');
const negative=['-1e-999','-0.000001E-999','-1_0e-9_9_9',' \u0085-１２e-９９９\u0085 ','-١e-٩٩٩','-𝟙e-𝟡𝟡𝟡','-0.0001',-1];
const zero=['-0','-0.0e-999','-０_０e-９９９','-٠e-٩٩٩','-𝟘e-𝟡𝟡𝟡','1e-999','+1e-999',0,-0];
const panel=v=>({fields:{'mv-duration':'1','mv-fps':'24'},shots:[{start:String(v),end:'1'}]});
test('nonnegative values validate original nonzero negative mantissa, preserving general signed number callers',()=>{
  for(const v of negative){assert.equal(V.isNegative(v),true);assert.throws(()=>V.nonnegativeNumber(v),/非負/);assert.ok(V.number(v)<=0);}
  for(const v of zero){assert.equal(V.isNegative(v),false);assert.ok(V.nonnegativeNumber(v)===0);}
});
test('Unicode decimal digits, underscore and numeric whitespace retain their original finite grammar',()=>{
  for(const v of [' \u0085１２.５\u0085 ','١_٢.٥','𝟙_𝟚.𝟝','+12.5e+0'])assert.equal(V.nonnegativeNumber(v),12.5);
  for(const v of ['',true,null,'NaN','Infinity','0x0','-1__0e-999','\ufeff0','\x1c0'])assert.throws(()=>V.nonnegativeNumber(v));
});
test('partial timing range errors keep original row, field, source and zero acceptance',()=>{
  for(const v of negative)for(const field of ['start','end']){const p=panel(0);p.shots[0][field]=String(v);const before=structuredClone(p),r=T.report(p);assert.equal(r.issue_count,1);assert.equal(r.issues[0].code,'invalid_range');assert.equal(r.issues[0].field,field);assert.equal(r.timed_shots,0);assert.deepEqual(p,before);assert.deepEqual(r.source,before);}
  for(const v of zero)assert.equal(T.inspect(panel(v)).issueCount,0);
});
test('negative-underflow cannot offer duration adoption or a valid overview or time compaction',()=>{
  for(const v of negative){const shots=[{id:'a',start:String(v),end:'1'}],before=structuredClone(shots);assert.equal(D.compare({duration:'2',fps:'24',shots}).canAdopt,false);assert.equal(E.shotOverview(shots,[])[0].valid,false);assert.equal(E.compactShotTimes(shots),null);assert.deepEqual(shots,before);}
  for(const v of zero){const shots=[{id:'a',start:String(v),end:'1'}];assert.equal(D.compare({duration:'2',fps:'24',shots}).canAdopt,true);assert.equal(E.shotOverview(shots,[])[0].valid,true);assert.ok(E.compactShotTimes(shots));}
});
test('controller refuses adoption without writing, recovers with genuine zero, undo preserves exact source',()=>{
  const value={duration:'2',fps:'24',shots:[{id:'a',start:'-1e-999',end:'1'}]};let writes=0;const c=D.createController({capture:()=>value,apply:v=>{writes++;value.duration=v;},onState:()=>{}});c.refresh();assert.throws(()=>c.adopt());assert.equal(writes,0);value.shots[0].start='-０e-９９９';c.refresh();c.adopt();assert.equal(value.duration,'1');c.undo();assert.equal(value.duration,'2');assert.equal(value.shots[0].start,'-０e-９９９');
});
test('source guard refuses a self-consistent negative-underflow brief and binary-zero plan',()=>{
  // A complete valid response is derived from the current application.
  const {execFileSync}=require('node:child_process'),root=path.join(__dirname,'..');
  const c=JSON.parse(execFileSync(process.platform==='win32'?'python':'python3',['-X','utf8','-c',"import json;from pathlib import Path;from musiclab.application import build;b=json.loads(Path('examples/first-light-mv.json').read_text(encoding='utf-8'));print(json.dumps({'brief':b,'wire':build('storyboard',b).wire()}))"],{cwd:root,encoding:'utf8',timeout:10000}));
  assert.equal(S.inspect('storyboard',c.brief,c.wire),true);
  for(const v of negative){const x=structuredClone(c);x.brief.shots[0].start=v;x.wire.files['mv-brief.json']=JSON.stringify(x.brief);assert.throws(()=>S.inspect('storyboard',x.brief,x.wire),/不一致/);}
  for(const v of zero){const x=structuredClone(c);x.brief.shots[0].start=v;x.wire.files['mv-brief.json']=JSON.stringify(x.brief);assert.equal(S.inspect('storyboard',x.brief,x.wire),true);}
});
