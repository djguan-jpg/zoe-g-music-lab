// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),{execFileSync}=require('node:child_process');
const policy=require('../musiclab/assets/delivery-versions.js'),pack=require('../web/delivery-package.js');
const json=require('../musiclab/assets/json-document.js'),source=fs.readFileSync('musiclab/assets/delivery-versions.js','utf8');
const contract=()=>JSON.parse(fs.readFileSync('musiclab/assets/delivery-versions.json','utf8'));
test('fixed explicit historical oracle and immutable isolated policy agree with producer version',()=>{
 const expected=Array.from({length:26},(_,i)=>'0.'+(38+i)+'.0');assert.deepEqual(policy.supported,expected);assert.equal(policy.current,'0.63.0');assert.equal(pack.version,policy.current);
 assert.equal(pack.supportsVersion,policy.supportsVersion);assert.equal(policy.schemaVersion,1);assert.ok(Object.isFrozen(policy)&&Object.isFrozen(policy.supported));assert.throws(()=>policy.supported.pop());
 const c=contract(),before=structuredClone(c),p=policy.createPolicy(c);assert.deepEqual(c,before);c.supported.length=0;c.current='9.0.0';assert.equal(p.current,'0.63.0');assert.ok(p.supportsVersion('0.63.0'));
});
test('sparse policies are exact lists without gap inference and browser producers use that rule',async()=>{
 const c=contract();c.current='0.59.0';c.supported=['0.38.0','0.59.0'];const sparse=policy.createPolicy(c);assert.equal(sparse.supportsVersion('0.54.0'),false);
 for(const value of [null,true,[],{},59,'0.59.0\n','0.059.0','0.60.0'])assert.equal(sparse.supportsVersion(value),false);
 const context={MusicJsonDocument:json,MusicDeliveryVersions:sparse,TextEncoder,structuredClone};vm.runInNewContext(fs.readFileSync('web/delivery-package.js','utf8'),context);
 const s={scope:'music',label:'',files:{'source.txt':'原文🎵'}},hash=async()=> 'a'.repeat(64);
 for(const v of ['0.38.0','0.59.0'])assert.equal((await context.MusicDeliveryPackage.manifest(s,hash,v)).tool_version,v);
 await assert.rejects(context.MusicDeliveryPackage.manifest(s,hash,'0.54.0'),/不支援/);
});
test('Python and native validation agree on unknown schemas, order, component bounds and strict shapes',()=>{
 const c=contract(),cases=[null,[],{}, {...c,extra:true},{...c,schema_version:true},{...c,schema_version:2},{...c,format:'other'},{...c,current:'0.58.0'},{...c,supported:[]},{...c,supported:['0.59.0','0.59.0']},{...c,supported:['0.59.0','0.38.0']},{...c,supported:Array(129).fill('0.1.0')}];
 for(const v of ['0.59','0.59.0-beta','0.059.0','０.59.0','+0.59.0','0.59.0\n','0.59.0\r','0.59.0\u2028','0.59.0\x00','2147483648.0.0','0.99999999999.0',1,null])cases.push({...c,current:v,supported:[v]});
 cases.push(c,{...c,current:'0.59.0',supported:['0.38.0','0.59.0']},{...c,current:'2147483647.2147483647.2147483647',supported:['2147483647.2147483647.2147483647']});
 const original=JSON.stringify(cases),accepted=cases.map(v=>{try{policy.createPolicy(v);return true;}catch{return false;}});
 const native=JSON.parse(execFileSync('python',['-X','utf8','-c',`import json,sys
from musiclab.delivery_versions import create_policy
out=[]
for v in json.load(sys.stdin):
 try:create_policy(v);out.append(True)
 except ValueError:out.append(False)
print(json.dumps(out))`],{input:original,encoding:'utf8',timeout:10000}));
 assert.deepEqual(accepted,native);assert.deepEqual(accepted.slice(-3),[true,true,true]);assert.ok(accepted.slice(0,-3).every(v=>v===false));assert.equal(JSON.stringify(cases),original);
});
test('strict text decoding rejects duplicates BOM nonfinite Unicode and byte overflow',()=>{
 const raw=JSON.stringify(contract());for(const v of [raw.replace('"schema_version":1','"schema_version":1,"schema_version":1'),'\ufeff'+raw,raw.replace('"schema_version":1','"schema_version":NaN'),' '.repeat(8193),raw.replaceAll('0.59.0','0.59.0\\ud800')])assert.throws(()=>policy.decodePolicy(v));
 assert.equal(policy.decodePolicy(raw).current,policy.current);
});
test('real Python contract drives browser module and missing or unknown contract fails closed',()=>{
 const script=execFileSync('python',['-X','utf8','-c','from musiclab.delivery_versions import contract_script;print(contract_script(),end="")'],{encoding:'utf8',timeout:10000});
 const context={MusicJsonDocument:json};vm.createContext(context);vm.runInContext(script,context);vm.runInContext(source,context);
 assert.equal(context.MusicDeliveryVersions.current,policy.current);assert.deepEqual([...context.MusicDeliveryVersions.supported],policy.supported);
 context.MusicDeliveryVersionsContract.supported.length=0;assert.ok(context.MusicDeliveryVersions.supportsVersion('0.54.0'));
 assert.throws(()=>vm.runInNewContext(source,{MusicJsonDocument:json}),/不支援/);
 assert.throws(()=>vm.runInNewContext(source,{MusicJsonDocument:json,MusicDeliveryVersionsContract:{...contract(),schema_version:2}}),/不支援/);
});
test('runtime package import and comparison all reject unlisted future producers',async()=>{
 const s={scope:'lyrics',label:'',files:{'source.txt':'原文'}},hash=async()=> 'a'.repeat(64);
 await assert.rejects(pack.manifest(s,hash,'0.64.0'),/不支援/);assert.equal(pack.supportsVersion('0.54.0'),true);
 const importer=require('../web/delivery-import.js'),reports=require('../web/delivery-report.js');
 const manifest={format:'zoe-delivery-manifest',schema_version:1,tool_version:'0.64.0',scope:'lyrics',label:'',source_type:'provided_text_files',content_validation:'not_performed',file_count:1,source_bytes:6,files:[{name:'source.txt',bytes:6,sha256:'a'.repeat(64)}]};
 const data={format:'zoe-delivery-inspection',schema_version:1,archive_bytes:100,archive_sha256:'a'.repeat(64),manifest},wire={files:s.files,data,meta:{version:pack.version,protocol_version:1,needs_review:true}};
 await assert.rejects(importer.checked(wire,{bytes:100,sha256:'a'.repeat(64),manifest},hash),/不支援/);assert.throws(()=>reports.report(data,{}),/不支援/);
});
