// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),{execFileSync}=require('node:child_process');
const probe=require('../web/delivery-archive.js');
const fixtures=JSON.parse(execFileSync('python',['-X','utf8','-c',`import base64,json,io,zipfile
from musiclab.delivery_package import prepare,MANIFEST_NAME
rows=[]
for scope in ['music','storyboard','lyrics','audio']:
 for version in ['0.38.0','0.39.0','0.40.0','0.41.0']:
  p=prepare({'scope':scope,'label':'來源<label>\\n原文','files':{'source.md':'甲\\n乙'}},tool_version=version)
  rows.append({'raw':base64.b64encode(p.archive).decode(),'manifest':p.manifest})
p=prepare({'scope':'music','files':{'source.md':'甲'}})
z=zipfile.ZipFile(io.BytesIO(p.archive));out=io.BytesIO()
with zipfile.ZipFile(out,'w') as changed:
 for i in z.infolist():changed.writestr(i,(b'\\xef\\xbb\\xbf' if i.filename==MANIFEST_NAME else b'')+z.read(i))
print(json.dumps({'rows':rows,'bom':base64.b64encode(out.getvalue()).decode()},ensure_ascii=False))`],{encoding:'utf8',timeout:10000}));
const sample=()=>Buffer.from(fixtures.rows[0].raw,'base64');
test('bounded probe reads original Python producer manifest for all four scopes and both versions',()=>{for(const f of fixtures.rows)assert.deepEqual(probe.manifest(Buffer.from(f.raw,'base64')),f.manifest);});
test('empty, huge, trailing and unknown ZIPs refuse without extracting paths',()=>{for(const b of [Buffer.alloc(0),Buffer.alloc(probe.maxArchive+1),Buffer.from('not zip'),Buffer.concat([sample(),Buffer.from('hidden')])])assert.throws(()=>probe.manifest(b));});
test('central directory counts, offsets and size budgets refuse malformed envelopes',()=>{for(const edit of [b=>b.writeUInt16LE(66,b.length-22+10),b=>b.writeUInt32LE(32769,b.length-22+12),b=>b.writeUInt32LE(0,b.length-22+16),b=>b.writeUInt16LE(1,b.length-22+4)]){const b=sample();edit(b);assert.throws(()=>probe.manifest(b));}});
test('selected manifest local header size and method must match observed central entry',()=>{const initial=sample(),offset=initial.readUInt32LE(initial.length-22+16);let cursor=offset,last;while(cursor<initial.length-22){last=cursor;cursor+=46+initial.readUInt16LE(cursor+28)+initial.readUInt16LE(cursor+30)+initial.readUInt16LE(cursor+32)}const local=initial.readUInt32LE(last+42);for(const edit of [b=>b.writeUInt16LE(8,local+8),b=>b.writeUInt32LE(1,local+22),b=>b[local+30]^=1,b=>b.writeUInt16LE(1,last+30),b=>b.writeUInt32LE(probe.maxManifest+1,last+24)]){const b=sample();edit(b);assert.throws(()=>probe.manifest(b));}});
test('manifest UTF8 and BOM are strict; no silently repaired source',()=>{const initial=sample(),offset=initial.readUInt32LE(initial.length-22+16);let cursor=offset,last;while(cursor<initial.length-22){last=cursor;cursor+=46+initial.readUInt16LE(cursor+28)}const local=initial.readUInt32LE(last+42),start=local+30+initial.readUInt16LE(local+26);const bad=sample();bad[start]=255;assert.throws(()=>probe.manifest(bad));assert.throws(()=>probe.manifest(Buffer.from(fixtures.bom,'base64')));});
test('probe anchors metadata only; server full CRC and canonical verification is still required',()=>{const b=sample(),start=30+b.readUInt16LE(26);b[start]^=1;assert.deepEqual(probe.manifest(b),fixtures.rows[0].manifest);});
