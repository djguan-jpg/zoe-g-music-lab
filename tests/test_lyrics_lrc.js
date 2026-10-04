// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const L=require('../musiclab/assets/lyrics-lrc.js');
test('LRC literal remainder preserves spaces tabs BOM HTML and Unicode separators',()=>{
  for(const text of ['  字\t  ','字 [00:02] 尾 [offset:125]','字\u0085後\u2028尾\u2029終','\ufeff字 <script>','', ' \t '])assert.deepEqual(L.parse('[00:01.125]'+text+'\n'),[{start:1.125,text}]);
});
test('leading adjacent timing expands but following space and inline tags remain literal',()=>{
  assert.deepEqual(L.parse(' \t[00:01.25][00:02.125]  字 [00:03]  '),[{start:1.25,text:'  字 [00:03]  '},{start:2.125,text:'  字 [00:03]  '}]);
  assert.deepEqual(L.parse('[00:01] [00:02]字'),[{start:1,text:' [00:02]字'}]);assert.deepEqual(L.parse('備註 [00:01]字'),[]);
});
test('only standalone case-insensitive offset metadata shifts once with last value across line endings',()=>{
  assert.deepEqual(L.parse('[offset:999]\r\n[00:01]字 [offset:555]\r \t[OFFset:-125]\t\n[00:02]尾'),[{start:.875,text:'字 [offset:555]'},{start:1.875,text:'尾'}]);
});
test('only one initial document BOM is syntax',()=>{
  assert.deepEqual(L.parse('\uFEFF[00:01]\uFEFF字'),[{start:1,text:'\uFEFF字'}]);assert.deepEqual(L.parse('\uFEFF\uFEFF[00:01]字'),[]);assert.deepEqual(L.parse('\n\uFEFF[00:01]字'),[]);
});
test('malformed leading times negative shifted starts and unrepresentable bounds refuse',()=>{
  for(const source of ['[00:60]字','[00:1]字','[00:01.1234]字','[offset:-1001]\n[00:01]字','[offset:9007199254740992]\n[00:01]字','[150119987579:59.991]字','['+'9'.repeat(5000)+':00]字',null])assert.throws(()=>L.parse(source));
});
test('long zero prefixes are bounded before BigInt conversion without losing milliseconds',()=>{
  assert.deepEqual(L.parse('[offset:+'+'0'.repeat(5000)+'125]\n['+'0'.repeat(5000)+'00:01]字'),[{start:1.125,text:'字'}]);
});
test('native script loads after timing without CommonJS and matches exported pure model',()=>{
  const context={};vm.createContext(context);for(const name of ['lyric-time.js','lyrics-lrc.js'])vm.runInContext(fs.readFileSync('musiclab/assets/'+name,'utf8'),context);
  const source='[offset:125]\n[00:01] 字 [00:02] ';assert.deepEqual(JSON.parse(JSON.stringify(context.MusicLyricsLrc.parse(source))),L.parse(source));
});
