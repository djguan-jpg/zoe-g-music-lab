// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),crypto=require('node:crypto'),vm=require('node:vm');
const {execFileSync}=require('node:child_process'),J=require('../musiclab/assets/json-document.js');
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
test('literal JSON values preserve types Unicode original text and object key order independence',()=>{
 for(const value of [null,true,false,0,-0,1.25,'原文🎵\r\n<script>\t\0é e\u0301',[],{},[null,'x',1],{b:[1,'x'],a:null}])assert.equal(J.sameValue(value,structuredClone(value)),true);
 assert.equal(J.sameValue({a:1,b:[2]},{b:[2],a:1}),true);assert.equal(J.sameValue(0,-0),true);
 for(const [a,b] of [[null,0],[0,'0'],[false,0],['é','e\u0301'],['x\r\n','x\n'],[[1],[1,2]],[{a:1},{a:1,b:undefined}]])assert.equal(J.sameValue(a,b),false);
});
test('nonfinite numbers and unsupported values cannot become null or disappear',()=>{
 for(const value of [NaN,Infinity,-Infinity,undefined,()=>null,1n,Symbol('x'),new Date(),new Map(),new Set(),/x/,new Uint8Array()]){assert.equal(J.sameValue(value,value),false);assert.equal(J.sameValue({value},{value:null}),false);}
 for(const raw of ['1e400','-1e400']){const value=JSON.parse(raw);assert.equal(J.sameValue({value},{value:null}),false);}
 for(const value of ['\ud800','\udfff'])assert.equal(J.sameValue(value,value),false);
});
test('own complete arrays are required even when inherited indices or extra properties mask holes',()=>{
 const expected=['a','b'];for(const index of [0,1]){const bad=[...expected];delete bad[index];assert.equal(J.sameValue(bad,expected),false);const prototype=Object.create(Array.prototype);prototype[index]=expected[index];Object.setPrototypeOf(bad,prototype);assert.equal(J.sameValue(bad,expected),false);assert.equal(J.sameValue(bad,bad),false);}
 for(const decorate of [a=>a.extra=undefined,a=>a.map=()=>assert.fail('caller mapper'),a=>a[Symbol('x')]=1]){const bad=[...expected];decorate(bad);assert.equal(J.sameValue(bad,expected),false);}
});
test('own DTO descriptors reject accessors hidden fields and symbols without invoking callers',()=>{
 let calls=0;const getter={};Object.defineProperty(getter,'x',{enumerable:true,get(){calls++;return 1;}});assert.equal(J.sameValue(getter,{x:1}),false);assert.equal(J.sameValue({x:1},getter),false);
 const array=[];Object.defineProperty(array,'0',{enumerable:true,get(){calls++;return 'x';}});assert.equal(J.sameValue(array,['x']),false);
 const serial={x:1,toJSON(){calls++;return {x:1};}};assert.equal(J.sameValue(serial,{x:1}),false);
 const hidden={x:1};Object.defineProperty(hidden,'hidden',{value:1});assert.equal(J.sameValue(hidden,hidden),false);
 const symbol={x:1,[Symbol('x')]:1};assert.equal(J.sameValue(symbol,symbol),false);assert.equal(calls,0);
});
test('null-prototype cross-realm and literal special keys compare without prototype writes',()=>{
 const value=JSON.parse('{"__proto__":{"literal":true},"constructor":"literal","原文":"🎵"}'),foreign=vm.runInNewContext('JSON.parse('+JSON.stringify(JSON.stringify(value))+')'),plain=Object.assign(Object.create(null),value);
 assert.equal(J.sameValue(value,foreign),true);assert.equal(J.sameValue(value,plain),true);assert.equal(Object.prototype.literal,undefined);
 assert.equal(J.sameValue({x:undefined},{x:undefined}),false);
});
test('complete reads leave caller objects untouched and do not serialize them',()=>{
 const value={rows:[{text:'原文🎵\r\n',clock:null}],count:1},before=structuredClone(value);Object.freeze(value.rows[0]);Object.freeze(value.rows);Object.freeze(value);assert.equal(J.sameValue(value,before),true);assert.deepEqual(value,before);
});
test('depth and node boundaries reject cycles and over-limit DTOs without throwing',()=>{
 const nested=n=>{let value='x';while(n--)value={value};return value;};assert.equal(J.sameValue(nested(64),nested(64)),true);assert.equal(J.sameValue(nested(65),nested(65)),false);
 const cycle={};cycle.self=cycle;assert.equal(J.sameValue(cycle,cycle),false);
 const valid=Array(J.maxValueNodes-1).fill(0);assert.equal(J.sameValue(valid,valid),true);const tooMany=Array(J.maxValueNodes).fill(0);assert.equal(J.sameValue(tooMany,tooMany),false);
});
for(const kind of ['music','storyboard','lyrics']){
 const P=require('../musiclab/assets/'+kind+'-search.js'),C=require('../web/'+kind+'-search-controller.js');
 const payload=kind==='lyrics'?{texts:['原文🎵'],query:'原文'}:{[kind==='music'?'sections':'shots']:[Object.fromEntries(P.fields.map(k=>[k,'原文🎵']))],query:'原文'};
 const wire=d=>({data:structuredClone(d),files:{[kind+'-search.json']:JSON.stringify(d),[kind+'-search.md']:P.markdown(d)},meta:{version:'0.108.0',protocol_version:1,needs_review:true}});
 test(kind+' raw wire overflow is rejected while complete good replies and reordered keys still pass',async()=>{
  const data=await P.search(payload,{hash}),good=wire(data);
  for(const scalar of ['1e400','-1e400']){const bad=JSON.parse(JSON.stringify(good).replace('"next_row":null','"next_row":'+scalar));assert.throws(()=>P.checkedReply(bad,data,'0.108.0'));}
  for(const change of [r=>r.data.extra=undefined,r=>r.data.matches[0].extra=()=>null,r=>delete r.data.matches[0],r=>r.data.next_row=NaN]){const bad=wire(data);change(bad);assert.throws(()=>P.checkedReply(bad,data,'0.108.0'));}
  good.data=Object.fromEntries(Object.entries(good.data).reverse());assert.deepEqual(P.checkedReply(good,data,'0.108.0'),data);
 });
 test(kind+' controller good bad good preserves caller source and refuses mismatched report callbacks',async()=>{
  const source={ids:['a'],visible:true,busy:false,resultRevision:0,[kind==='lyrics'?'texts':kind==='music'?'sections':'shots']:structuredClone(payload[kind==='lyrics'?'texts':kind==='music'?'sections':'shots'])},before=structuredClone(source),reports=[],errors=[];let calls=0;
  const c=C.createController({capture:()=>source,version:'0.108.0',search:p=>P.search(p,{hash}),request:async p=>{const good=wire(await P.search(p,{hash}));return ++calls===2?JSON.parse(JSON.stringify(good).replace('"next_row":null','"next_row":1e400')):good;},focusTarget:()=>true,onReport:(d,f)=>reports.push({d,f}),onError:e=>errors.push(e)});
  c.setQuery('原文');assert.equal(await c.find(),true);const previous=structuredClone(reports[0]);assert.equal(await c.find(),false);assert.equal(reports.length,1);assert.deepEqual(reports[0],previous);assert.equal(c.view().pending,false);assert.equal(await c.find(),true);assert.equal(reports.length,2);assert.equal(errors.length,1);assert.deepEqual(source,before);
 });
}
test('lyrics review distinguishes nullable source and related row from raw overflowing numbers',()=>{
 const P=require('../musiclab/assets/lyrics-review.js'),payload={cues:[{start:'',end:'',text:'原文🎵'}]},data=P.review(payload),good={data,files:{'lyrics-review.json':JSON.stringify(data),'lyrics-review.md':P.markdown(data)},meta:{version:require('../musiclab/assets/delivery-versions.js').current,protocol_version:1,needs_review:true}};
 for(const field of ['duration','related_row']){const bad=JSON.parse(JSON.stringify(good).replace('"'+field+'":null','"'+field+'":1e400'));assert.throws(()=>P.inspect(bad,payload));}
 assert.deepEqual(P.inspect(good,payload),data);
});
const fixtures=JSON.parse(execFileSync(process.platform==='win32'?'python':'python3',['-X','utf8','-c',"import json;from pathlib import Path;from musiclab.application import build;cases={};\nfor op,name in [('music','first-light-music.json'),('storyboard','first-light-mv.json')]:\n p=json.loads((Path('examples')/name).read_text(encoding='utf-8'));cases[op]={'payload':p,'wire':build(op,p).wire()}\np={'package':build('lyrics',{'cues':[{'start':0,'end':1,'text':'原文🎵'}],'duration':2}).data};cases['lyrics_export_review']={'payload':p,'wire':build('lyrics_export_review',p).wire()};print(json.dumps(cases,ensure_ascii=False))"],{cwd:require('node:path').join(__dirname,'..'),encoding:'utf8',timeout:10000}));
for(const kind of ['music','storyboard'])test(kind+' planning binds every own field instead of silently dropping extra undefined',()=>{
 const P=require('../web/planning-source.js'),c=structuredClone(fixtures[kind]);assert.equal(P.inspect(kind,c.payload,c.wire),true);c.wire.data[kind==='music'?'sections':'shots'][0].extra=undefined;assert.throws(()=>P.inspect(kind,c.payload,c.wire));
});
test('complete export review rejects extra unsupported runtime fields and recovers with original JSON',async()=>{
 const P=require('../musiclab/assets/lyrics-export-review.js'),c=structuredClone(fixtures.lyrics_export_review),expected=await P.inspect(c.wire,c.payload);c.wire.data.extra=undefined;await assert.rejects(P.inspect(c.wire,c.payload));assert.deepEqual(await P.inspect(fixtures.lyrics_export_review.wire,c.payload),expected);
});
