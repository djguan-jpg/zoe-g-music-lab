// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const model=require('../web/text-download.js');
test('actual result download reads canonical source and rejects busy, dirty or absent files',()=>{
 const app=fs.readFileSync('web/app.js','utf8'),start=app.indexOf("textDownloader.bind($('export-form')"),end=app.indexOf('\n',start),form={},notes=[],sent=[];
 const nodes={'export-form':form,'output-file':{value:'original.txt'},'output-content':{value:'normalized wrong\n'}},state={tab:'lyrics',busy:false,bundles:{lyrics:{dirty:false}},files:{'original.txt':'\ufeff原文🎵\r\n\r\x00'}};
 const textDownloader={bind:(form,options)=>{const c=model.createController({...options,send:r=>{sent.push(r);return true;}});form.onsubmit=event=>{event.preventDefault();return c.download();};}};
 vm.runInNewContext(app.slice(start,end),{textDownloader,$:id=>nodes[id],state,say:(message,error)=>notes.push({message,error})});
 assert.equal(form.onsubmit({preventDefault(){}}),true);assert.deepEqual(Buffer.from(sent[0].bytes),Buffer.from(state.files['original.txt']));
 for(const mutate of [()=>state.busy=true,()=>{state.busy=false;state.bundles.lyrics.dirty=true},()=>{state.bundles.lyrics.dirty=false;nodes['output-file'].value='absent.txt'}]){mutate();assert.equal(form.onsubmit({preventDefault(){}}),false);assert.equal(notes.at(-1).error,true);}
 assert.equal(sent.length,1);assert.equal(state.files['original.txt'],'\ufeff原文🎵\r\n\r\x00');
});
test('actual saved-version export uses the previewed draft rather than display or current input',()=>{
 const app=fs.readFileSync('web/app.js','utf8'),start=app.indexOf("textDownloader.bind($('library-export')"),end=app.indexOf('\n',start),form={},sent=[],notes=[],preview={entry:{id:'draft-123'},draft:{original:'\r\n🎵'}},context={pendingLibraryReview:preview,libraryAllowed:()=>true,librarySay:(m,e)=>notes.push({m,e}),$:()=>form};
 context.checkedLibraryReview=()=>context.pendingLibraryReview;
 context.textDownloader={bind:(form,options)=>{const c=model.createController({...options,send:r=>{sent.push(r);return true;}});form.onsubmit=e=>{e.preventDefault();return c.download();};}};
 vm.runInNewContext(app.slice(start,end),context);assert.equal(form.onsubmit({preventDefault(){}}),true);assert.equal(sent[0].name,'draft-123.json');assert.equal(Buffer.from(sent[0].bytes).toString(),JSON.stringify(preview.draft,null,2)+'\n');context.pendingLibraryReview=null;assert.equal(form.onsubmit({preventDefault(){}}),false);assert.equal(sent.length,1);assert.equal(notes.at(-1).e,true);
});
test('actual output preview is bounded without splitting emoji or replacing full original source',()=>{
 const app=fs.readFileSync('web/app.js','utf8'),start=app.indexOf('function previewOutput(){'),end=app.indexOf('\n',start),nodes={'output-file':{value:'big.txt'},'output-content':{},'output-preview-note':{}},original='a'.repeat(32767)+'🎵'+'\r\n'.repeat(1000000),state={files:{'big.txt':original}};
 const context={$:id=>nodes[id],state,MusicDeliveryReview:require('../web/delivery-review.js')};vm.runInNewContext(app.slice(start,end)+'\npreviewOutput();',context);assert.equal(nodes['output-content'].value.length,32767);assert.match(nodes['output-preview-note'].textContent,/只顯示開頭/);assert.equal(state.files['big.txt'],original);nodes['output-file'].value='absent.txt';context.previewOutput();assert.equal(nodes['output-content'].value,'');assert.match(nodes['output-preview-note'].textContent,/尚無/);
});
