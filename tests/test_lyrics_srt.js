// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const V=require('../musiclab/assets/lyrics-srt.js');
test('SRT keeps literal edges Unicode separators BOM HTML and inline clock text',()=>{
  for(const text of ['  字\t  ','字\u0085後\u2028尾\u2029終','\u2028','\uFEFF字 <b>','字 00:00:01,000 --> 00:00:02,000'])assert.deepEqual(V.parse('1\n00:00:01,125 --> 00:00:02,500\n'+text+'\n'),[{start:1.125,end:2.5,text}]);
});
test('SRT flattens physical lyric lines only with original per-line spaces retained',()=>{
  assert.deepEqual(V.parse('1\r\n00:00:01,125 --> 00:00:02,500\r\n  第一行\t  \r\n第二行\t \r\n'),[{start:1.125,end:2.5,text:'  第一行\t   / 第二行\t '}]);
});
test('SRT ASCII blank line structure accepts CR LF CRLF dots tabs and optional indices',()=>{
  assert.deepEqual(V.parse('\t \r\n 00:00:01.125\t-->\t00:00:02,500 \r字  \r \t\r99\r00:00:03,000 --> 00:00:04,000\r尾\t  \r'),[{start:1.125,end:2.5,text:'字  '},{start:3,end:4,text:'尾\t  '}]);
});
test('SRT document BOM occurs once and literal following BOM is preserved',()=>{
  assert.equal(V.parse('\uFEFF1\n00:00:01,000 --> 00:00:02,000\n\uFEFF字')[0].text,'\uFEFF字');assert.throws(()=>V.parse('\uFEFF\uFEFF1\n00:00:01,000 --> 00:00:02,000\n字'));
});
test('SRT missing text invalid clocks unsafe integers and Unicode in structural headers refuse',()=>{
  for(const source of [null,'',' \t\n','00:00:01,000 --> 00:00:02,000\n \t\n','1\u2028\n00:00:01,000 --> 00:00:02,000\n字','00:00:01,000 --> 00:00:02,000\u2029\n字',
    ...['00:60:00,000','00:00:60,000','00:00:01,1234','2501999793:00:00,000','9'.repeat(5000)+':00:00,000'].map(c=>c+' --> 00:00:02,500\n字')])assert.throws(()=>V.parse(source));
});
test('SRT long zero hours normalize before integer conversion and keep exact milliseconds',()=>{
  assert.deepEqual(V.parse('0'.repeat(5000)+'00:00:01,125 --> 00:00:02,500\n字'),[{start:1.125,end:2.5,text:'字'}]);
});
test('SRT browser script loads with shared timing and no CommonJS',()=>{
  const context={};vm.createContext(context);for(const name of ['lyric-time.js','lyrics-srt.js'])vm.runInContext(fs.readFileSync('musiclab/assets/'+name,'utf8'),context);
  const raw='1\n00:00:01,000 --> 00:00:02,000\n  字\t  ';assert.deepEqual(JSON.parse(JSON.stringify(context.MusicLyricsSrt.parse(raw))),V.parse(raw));
});
