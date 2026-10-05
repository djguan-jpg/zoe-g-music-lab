// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),crypto=require('node:crypto'),fs=require('node:fs'),vm=require('node:vm');
const model=require('../web/audio-file.js');
test('native File SHA-256 uses actual immutable bytes and the standard abc vector',async()=>{
 const file=new File(['abc'],'original.wav'),before=await file.text();
 assert.equal(await model.sha256(file),'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
 assert.equal(await file.text(),before);assert.ok(Object.isFrozen(model));assert.equal(model.maxBytes,64*1024*1024);
});
test('same filename and size cannot equate different native File content',async()=>{
 const a=new File(['abc'],'same.wav'),b=new File(['abd'],'same.wav');assert.equal(a.size,b.size);assert.equal(a.name,b.name);
 assert.notEqual(await model.sha256(a),await model.sha256(b));
});
test('the exact 64 MiB boundary hashes once and preserves the source',async()=>{
 const raw=Buffer.alloc(model.maxBytes),file=new File([raw],'boundary.wav');let reads=0;
 assert.equal(await model.sha256(file,{read:async f=>{reads++;return f.arrayBuffer();}}),crypto.createHash('sha256').update(raw).digest('hex'));
 assert.equal(reads,1);assert.equal(file.size,model.maxBytes);assert.equal((await file.slice(-1).arrayBuffer()).byteLength,1);
});
test('invalid or oversized selection refuses before reading or digesting',async()=>{
 let reads=0,digests=0;const options={read:async()=>{reads++;return new ArrayBuffer(1)},digest:async()=>{digests++;return new ArrayBuffer(32)}};
 for(const file of [null,new File([],'empty.wav'),{size:1},{size:NaN,arrayBuffer(){}},{size:model.maxBytes+1,arrayBuffer(){}}])await assert.rejects(model.sha256(file,options));
 assert.equal(reads,0);assert.equal(digests,0);
});
test('size mismatch and non-buffer reads fail before digest',async()=>{
 const file=new File(['abc'],'original.wav');let digests=0;
 for(const raw of [new ArrayBuffer(2),new Uint8Array(3),{byteLength:3},null])
  await assert.rejects(model.sha256(file,{read:async()=>raw,digest:async()=>{digests++;return new ArrayBuffer(32)}}),/讀取大小/);
 assert.equal(digests,0);
});
test('read and digest rejection or malformed digest never invent a source hash',async()=>{
 const file=new File(['abc'],'original.wav');await assert.rejects(model.sha256(file,{read:async()=>{throw Error('read failed')}}),/read failed/);
 await assert.rejects(model.sha256(file,{digest:async()=>{throw Error('digest failed')}}),/digest failed/);
 for(const raw of [new ArrayBuffer(31),new Uint8Array(32),null])await assert.rejects(model.sha256(file,{digest:async()=>raw}),/SHA-256 核對未完成/);
});
test('missing browser cryptography fails with an actionable message without fallback',async()=>{
 const context={ArrayBuffer,Uint8Array};vm.runInNewContext(fs.readFileSync('web/audio-file.js','utf8'),context);
 await assert.rejects(context.MusicAudioFile.sha256(new File(['abc'],'original.wav')),/這個瀏覽器無法量測 SHA-256/);
});
