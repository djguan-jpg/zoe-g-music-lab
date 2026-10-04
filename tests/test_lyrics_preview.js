// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),{execFileSync}=require('node:child_process'),path=require('node:path');
const V=require('../web/lyrics-preview.js'),P=require('../musiclab/assets/lyrics-package.js'),contract=require('./helpers/lyric-preview-contract.js');
const G=require('../web/lyrics-result.js').createChecker(contract),inspector=V.createInspector(contract),root=path.join(__dirname,'..');
const request={title:' 原名 <b> & " \' __TITLE__ ',cues:[{start:1.125,end:2.5,text:'</script> __DATA__ 字\u0085後\u2028尾\u2029終\t  '}],duration:10};
const reply=JSON.parse(execFileSync(process.platform==='win32'?'python':'python3',['-X','utf8','-c','import json,sys;from musiclab.application import build;print(json.dumps(build("lyrics",json.load(sys.stdin)).wire(),ensure_ascii=False))'],{cwd:root,input:JSON.stringify(request),encoding:'utf8',timeout:10000})),data=reply.data,original=reply.files['preview.html'];
const marker='<script id="initial" type="application/json">',end='</script>';
function replaceData(html,raw){const start=html.indexOf(marker)+marker.length,finish=html.indexOf(end,start);return html.slice(0,start)+raw+html.slice(finish);}
function safe(data){return JSON.stringify(data).replace(/</g,'\\u003c').replace(/\u2028/g,'\\u2028').replace(/\u2029/g,'\\u2029');}

test('actual Python complete preview is checked without execution and native renderer preserves its data',()=>{
  assert.deepEqual(inspector.inspect(data,original),data);assert.deepEqual(G.checkedResult(G.expectedBuild(request),reply),reply);
  const native=inspector.render(data);assert.deepEqual(inspector.inspect(data,native),data);assert.ok(original.includes('&lt;b&gt;'));assert.ok(original.includes('&#x27;'));assert.ok(original.includes('\\u003c/script>'));assert.ok(original.includes('\\u2028'));
});
test('empty, missing or wrong-source HTML is refused while other three exports stay valid',()=>{
  const other=P.validate({...data,title:'其他名'});
  for(const html of ['',inspector.render(other),replaceData(original,safe({...data,review_notes:['未送出的歷史']})),null]){const r=structuredClone(reply);r.files['preview.html']=html;assert.throws(()=>G.checkedResult(data,r));}
});
test('title, heading, styles, inline modules and runtime code require the exact trusted envelope',()=>{
  for(const html of [original.replace('<h1>','<h1>替代'),original.replace('<title>','<title>替代'),original.replace('background:#f5f7fa','background:red'),original.replace('function apply(){','function apply(){throw Error("changed");'),original.replace('maxDepth=64','maxDepth=63'),original.replace('</body>','<script src="https://example.invalid/x"></script></body>')]){assert.notEqual(html,original);assert.throws(()=>inspector.inspect(data,html),/預覽/);}
});
test('strict initial JSON rejects duplicate keys, schema drift, malformed Unicode and extra script blocks',()=>{
  for(const html of [replaceData(original,'{"title":"shadow",'+safe(data).slice(1)),replaceData(original,safe({...data,schema_version:2})),replaceData(original,safe(data).replace('原名','\\ud800')),original.replace(marker,marker+'{}'+end+marker),original.replace(marker,'<script id="other" type="application/json">')])assert.throws(()=>inspector.inspect(data,html));
});
test('raw less-than and literal JavaScript separators are refused; escaped literal markers remain text',()=>{
  for(const raw of [JSON.stringify(data),safe(data).replace('\\u2028','\u2028'),safe(data).replace('\\u2029','\u2029')])assert.throws(()=>inspector.inspect(data,replaceData(original,raw)));
  assert.equal(inspector.inspect(data,original).cues[0].text,request.cues[0].text);
});
test('object key order, JSON spacing and integral-number spelling do not change complete source meaning',()=>{
  const changed=Object.fromEntries(Object.entries(data).reverse()),raw=safe(changed).replace('"duration":10','"duration":10.0');
  assert.deepEqual(inspector.inspect(data,replaceData(original,raw)),data);
});
test('unknown or malformed template contracts fail closed and cannot create a permissive checker',()=>{
  for(const c of [null,{...contract,schema_version:2},{...contract,extra:true},{...contract,timing_js:''},{...contract,template:contract.template+marker},{...contract,template:contract.template.replace('__DATA__','')},{...contract,package_js:'x'.repeat(V.maxContract)}])assert.throws(()=>V.createInspector(c));
  assert.throws(()=>require('../web/lyrics-result.js').checkedResult(data,reply));
});
test('captured template and accepted source are isolated from later caller mutations',()=>{
  const c=structuredClone(contract),i=V.createInspector(c);c.template='other';c.package_js='other';const before=structuredClone(data),accepted=i.inspect(data,original);accepted.cues[0].text='later';assert.deepEqual(data,before);assert.deepEqual(i.inspect(data,original),data);
});
test('large escaped initial sources can exceed 2MiB while decoded complete package remains bounded',()=>{
  const large=P.validate({...data,cues:Array.from({length:600},(_,i)=>({start:i,end:i+1,text:'<'.repeat(1000)})),duration:600}),html=inspector.render(large);
  assert.ok(new TextEncoder().encode(html).length>2*1024*1024);assert.deepEqual(inspector.inspect(large,html),large);
  assert.throws(()=>inspector.inspect(data,' '.repeat(V.maxHtml+1)),/預覽/);
});
test('native preview rendering is deterministic and full history/title/source fields participate',()=>{
  const p=P.validate({...data,timing:{...data.timing,applied_shift_seconds:-.125},review_notes:[' 原來歷史\t ']}),html=inspector.render(p);
  assert.equal(html,inspector.render(p));assert.deepEqual(inspector.inspect(p,html),p);assert.throws(()=>inspector.inspect(data,html),/預覽/);
});
