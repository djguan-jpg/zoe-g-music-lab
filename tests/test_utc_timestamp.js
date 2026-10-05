// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const T=require('../musiclab/assets/utc-timestamp.js'),D=require('../web/library-revision.js'),L=require('../web/library-result.js'),S=require('../web/library-search.js'),B=require('../web/backup-result.js'),V=require('../musiclab/assets/delivery-versions.js'),F=require('./library_revision_fixture.js');
const valid=['0001-01-01T00:00:00+00:00','9999-12-31T23:59:59.999999-00:00','2000-02-29T01:02:03Z','2026-10-05 01:02:03.123+00:00','2026-10-05🎵01+00:00','2026-10-05t01:02-00:00:00.000000','2026-10-05\n01:02:03+00:00:00.000'];
const invalid=['0000-01-01T00:00:00Z','1900-02-29T01:02:03Z','2026-02-30T01:02:03+00:00','2026-04-31T01:02:03+00:00','2026-10-05T24:00:00+00:00','2026-10-05T01:60:00Z','2026-10-05T01:02:60Z','2026-10-05T01:02:03.1Z','2026-10-05T01:02:03.1234567Z','2026-10-05T01:02:03,123Z','2026-10-05T01:02:03+08:00','2026-10-05T01:02:03+00:00:01','2026-10-05T01:02:03+00:00:00.000001','20261005T010203Z','2026-10-05','2026-10-05T01:02:03Z\n','2026-10-05\ud80001:02:03Z','2026-10-05TT01:02:03Z','2026-10-05T01:02:03z','x'.repeat(129),null,true,42];
const record=time=>({...F.revision().entry,stored_at:time});
const listing=r=>({entries:[r],issues:[],next_cursor:null,status:'metadata_only_checksum_verified_on_read'});
const search=r=>({files:{},data:{format:'zoe-draft-library-search',schema_version:1,query:'保存',search_sha256:'a'.repeat(64),record_count:1,match_count:1,start_index:0,entries:[r],issues:[],next_cursor:null,status:'metadata_only_checksum_verified_on_read'},meta:{version:V.current,protocol_version:1,needs_review:false}});
const proof={bytes:3,sha256:'a'.repeat(64)};
const backup=r=>({files:{},data:{backup_sha256:proof.sha256,backup_schema_version:1,bytes:3,entry_count:1,selection:'all',new_count:1,reused_count:0,conflicts:[],capacity_ok:true,can_restore:true,new_ids:[r.id],entries:[{id:r.id,label:r.label,stored_at:r.stored_at}],status:'backup_validated_not_restored'},meta:{version:V.current,protocol_version:1,needs_review:true}});
test('portable UTC forms retain exact source separators precision and zero-offset aliases',()=>{for(const v of valid)assert.equal(T.checked(v),v);});
test('calendar leap-century invalid days and overflowing clocks are rejected without rollover',()=>{for(const v of invalid)assert.throws(()=>T.checked(v));for(const v of ['2026-02-30T01:02:03+00:00','2026-10-05T24:00:00+00:00'])assert.ok(Number.isFinite(Date.parse(v)));});
test('pure validator operates without Date parsing timezone locale or mutation',()=>{
 const code=fs.readFileSync('musiclab/assets/utc-timestamp.js','utf8'),ctx={module:{exports:{}},require:()=>require('../musiclab/assets/json-document.js'),Date:{parse:()=>{throw Error('native parser unavailable');}}};vm.createContext(ctx);vm.runInContext(code,ctx);for(const v of valid)assert.equal(ctx.module.exports.checked(v),v);for(const v of invalid)assert.throws(()=>ctx.module.exports.checked(v));
});
test('full revision list and search validators share civil clock rules before acceptance',()=>{
 for(const value of valid){const r=record(value);assert.equal(D.checkedMetadata(r.id,r).stored_at,value);assert.equal(L.checkedList({cursor:null,limit:20},listing(r)).entries[0].stored_at,value);assert.equal(S.checkedResult({query:'保存',cursor:null,limit:20},search(r)).entries[0].stored_at,value);}
 for(const value of invalid){const r=record(value);assert.throws(()=>D.checkedMetadata(r.id,r));assert.throws(()=>L.checkedList({cursor:null,limit:20},listing(r)));assert.throws(()=>S.checkedResult({query:'保存',cursor:null,limit:20},search(r)));}
});
test('backup plans refuse impossible times while preserving valid original timestamp and IDs',()=>{
 for(const value of valid){const r=record(value),w=backup(r),before=structuredClone(w);assert.equal(B.checkedInspect(w,proof).entries[0].stored_at,value);assert.deepEqual(w,before);}
 for(const value of invalid)assert.throws(()=>B.checkedInspect(backup(record(value)),proof));
});
test('original timestamp strings and IDs retain lexical pagination order without conversion',()=>{
 const a=record('2026-10-05T01:02:03Z'),b={...record('2026-10-05T01:02:03.999999+00:00'),id:'draft-'+'2'.repeat(32)};assert(Date.parse(a.stored_at)<Date.parse(b.stored_at));const rows={...listing(a),entries:[a,b]};assert.deepEqual(L.checkedList({cursor:null,limit:20},rows).entries,[a,b]);assert.throws(()=>L.checkedList({cursor:null,limit:20},{...rows,entries:[b,a]}));
});
test('fixed native asset loads after strict Unicode and before all timestamp consumers',()=>{
 const html=fs.readFileSync('web/index.html','utf8'),server=fs.readFileSync('music_lab_server.py','utf8');assert.ok(html.indexOf('/json-document.js')<html.indexOf('/utc-timestamp.js'));for(const name of ['library-revision','backup-result'])assert.ok(html.indexOf('/utc-timestamp.js')<html.indexOf('/'+name+'.js'));assert.ok(server.includes('"/utc-timestamp.js": ("musiclab/assets/utc-timestamp.js"'));
});
test('raw Unicode codepoint comparison agrees with Python across supplementary and BMP separators',()=>{
 const a='2026-10-05🎵01+00:00',b='2026-10-05\ue00001+00:00';assert.ok(a<b);assert.equal(T.compare(a,b),1);assert.equal(T.compare(b,a),-1);assert.equal(T.compare(a,a),0);assert.throws(()=>T.compare(a,'bad'));
 const x=record(a),y={...record(b),id:'draft-'+'2'.repeat(32)},rows={...listing(x),entries:[x,y]};assert.deepEqual(L.checkedList({cursor:null,limit:20},rows).entries,[x,y]);assert.throws(()=>L.checkedList({cursor:null,limit:20},{...rows,entries:[y,x]}));
});
test('Unicode search continuation keeps raw timestamp boundary and ASCII ID ordering',()=>{
 const x=record('2026-10-05🎵01+00:00'),y={...record('2026-10-05\ue00001+00:00'),id:'draft-'+'2'.repeat(32)},next={start_index:1,search_sha256:'a'.repeat(64)},w=search(x);w.data.record_count=w.data.match_count=2;w.data.next_cursor=next;
 const first=S.checkedResult({query:'保存',cursor:null,limit:1},w),later=search(y);later.data.record_count=later.data.match_count=2;later.data.start_index=1;assert.equal(S.checkedResult({query:'保存',cursor:next,limit:1},later,first).entries[0].id,y.id);assert.throws(()=>S.checkedResult({query:'保存',cursor:next,limit:1},{...later,data:{...later.data,entries:[x]}},first));
});
