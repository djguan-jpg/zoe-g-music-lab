// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),{execFileSync}=require('node:child_process');
const J=require('../musiclab/assets/json-document.js'),P=require('../musiclab/assets/lyrics-package.js'),L=require('../musiclab/assets/lyrics-download.js'),D=require('../web/text-download.js'),T=require('../musiclab/assets/lyric-time.js');
const wire=JSON.parse(execFileSync('python',['-X','utf8','-c',`import json
from musiclab.application import build
p=build('lyrics',{'title':'合成🎵','duration':10,'cues':[{'start':1.125,'end':2.5,'text':'原文\\t  🎵'}]}).data
p['review_notes']=[' 原來歷史\\t 🎵 '];p['timing']['applied_shift_seconds']=-.125
print(json.dumps(build('lyrics',{'package':p}).wire(),ensure_ascii=False))`],{encoding:'utf8',timeout:10000})),source=wire.data;
function changed(field,value){const p=structuredClone(source);if(field==='title')p.title=value;else if(field==='cue')p.cues[0].text=value;else p.review_notes=[value];return p;}
test('shared object Unicode boundary accepts scalar pairs literal controls and replacement character without normalizing',()=>{
 for(const text of ['', '繁體\u0085\u2028\u2029\t  <b>🎵\x00\ufeff','\ufffd','🎵'.repeat(200),'\ud83c\udfb5'])assert.equal(J.assertUnicode(text),undefined);
 for(const text of ['\ud800','\udfff','前\ud800後','前\udfff🎵','\ud800x\udfff'])assert.throws(()=>J.assertUnicode(text,'名稱'),/名稱 含無效 Unicode 文字/);
 for(const value of [null,1,[],new Uint8Array(2)])assert.throws(()=>J.assertUnicode(value),/需為文字/);
});
test('complete package checks title every cue and history note without mutating invalid input',()=>{
 for(const [field,label] of [['title','歌詞包名稱'],['cue','歌詞包歌詞'],['note','歌詞包待確認說明']])for(const value of ['前\ud800後','前\udfff後','\ud800x\udfff']){const p=changed(field,value),before=structuredClone(p);assert.throws(()=>P.validate(p),new RegExp(label+' 含無效 Unicode 文字'));assert.deepEqual(p,before);}
 const many=structuredClone(source);many.cues=Array.from({length:1000},(_,i)=>({start:i,end:i+1,text:'字'}));many.duration=1000;many.cues.at(-1).text='last\ud800';assert.throws(()=>P.validate(many),/歌詞包歌詞.*Unicode/);
});
test('legacy conversion revision and build request refuse invalid edits and preserve original valid package',()=>{
 const before=structuredClone(source),legacy=Object.fromEntries(['title','duration','duration_estimated','cues','timing'].map(k=>[k,source[k]]));legacy.title='字\ud800';assert.throws(()=>P.fromLegacy(legacy),/Unicode/);
 assert.throws(()=>P.revise(source,[{start:1,end:2,text:'字\udfff'}]),/歌詞包歌詞.*Unicode/);assert.throws(()=>P.revise(source,source.cues,undefined,'字\ud800'),/歌詞包名稱.*Unicode/);
 assert.throws(()=>P.buildRequest({title:'字\udfff',cues:source.cues,duration:10,content:JSON.stringify(source),suffix:'.json'}),/Unicode/);assert.deepEqual(source,before);
});
test('three download formats and synchronous export diagnostics cannot accept malformed metadata',()=>{
 const R=require('../musiclab/assets/lyrics-export-review.js'),O=require('../musiclab/assets/lyrics-offline-export.js'),views=[],c=O.createController({onView:v=>views.push(v),focus:()=>false});c.accept(source);
 for(const field of ['title','cue','note']){const p=changed(field,'字\ud800');for(const ext of L.formats)assert.throws(()=>L.select(p,ext),/Unicode/);assert.throws(()=>R.analyze({package:p}),/Unicode/);assert.throws(()=>c.accept(p),/Unicode/);assert.equal(c.view().stale,true);c.accept(source);}
});
test('actual standalone Apply and download refuse bad pending text before transport and preserve valid source for correction',()=>{
 let cues=source.cues,rendered=0,sends=0;const messages=[],views=[],note={textContent:''},ctx={data:structuredClone(source),durationField:{value:'10'},player:{currentTime:0},MusicLyricsPackage:P,MusicLyricsDownload:L,LyricTime:T,collect:()=>cues,render:()=>rendered++,tick:()=>{},message:(text,error=false)=>messages.push({text,error}),document:{getElementById:()=>note},media:{refresh(){}}};
 ctx.exportController=require('../musiclab/assets/lyrics-offline-export.js').createController({onView:v=>views.push(v),focus:()=>false});ctx.exportController.accept(source);
 ctx.textDownloads={createController:options=>D.createController({...options,send:()=>{sends++;return true;}})};
 const html=wire.files['preview.html'];vm.runInNewContext(html.slice(html.indexOf('function apply(){'),html.indexOf('function tick()',html.indexOf('function apply(){'))),ctx);vm.runInNewContext(html.slice(html.indexOf('function download(ext)'),html.indexOf("document.getElementById('audio-file')",html.indexOf('function download(ext)'))),ctx);
 const before=structuredClone(ctx.data);cues=[{start:1,end:2,text:'字\ud800'}];ctx.exportController.invalidate();assert.equal(ctx.download('json'),false);assert.deepEqual(ctx.data,before);assert.equal(rendered,0);assert.equal(sends,0);assert.equal(views.at(-1).stale,true);assert.match(messages.at(-1).text,/Unicode/);
 cues=[{start:1,end:2,text:'修正\u0085\u2028\u2029\t  🎵'}];assert.equal(ctx.download('json'),true);assert.equal(sends,1);assert.equal(rendered,1);assert.equal(ctx.data.cues[0].text,cues[0].text);assert.equal(ctx.data.review_notes[0],source.review_notes[0]);assert.equal(ctx.data.timing.applied_shift_seconds,undefined);assert.equal(views.at(-1).stale,false);
});
test('valid Unicode metadata and JSON reimport retain all values at codepoint limits',()=>{
 const p=structuredClone(source);p.title='🎵'.repeat(200);p.review_notes=['🎵'.repeat(400),' 原文\t  \ufffd '];p.cues[0].text='繁體\u0085\u2028\u2029\t  <b>🎵\x00\ufeff';const before=structuredClone(p),valid=P.validate(p),selected=L.select(valid,'json');D.prepare(selected);assert.deepEqual(P.validate(P.parseDocument(selected.content)),p);assert.deepEqual(p,before);
});
test('complete fixed envelope covers shared Unicode helper and package checks without network or WebCrypto',()=>{
 const C=require('./helpers/lyric-preview-contract.js'),G=require('../web/lyrics-result.js').createChecker(C),ctx={TextEncoder,structuredClone};vm.runInNewContext(C.timing_js,ctx);vm.runInNewContext(C.package_js,ctx);assert.equal(ctx.fetch,undefined);assert.equal(ctx.crypto,undefined);assert.throws(()=>ctx.MusicLyricsPackage.validate(changed('note','字\udfff')),/Unicode/);G.checkedResult(source,wire);
 for(const [from,to] of [['assertUnicode:unicode','assertUnicode:()=>{}'],["J.assertUnicode(document.title,'歌詞包名稱')","void document.title"]]){const bad=structuredClone(wire);bad.files['preview.html']=bad.files['preview.html'].replace(from,to);assert.notEqual(bad.files['preview.html'],wire.files['preview.html']);assert.throws(()=>G.checkedResult(source,bad));}
});
