// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const E=require('../web/cue-stamp-edit.js'),DOM=require('../web/cue-stamp-edit-dom.js');
function setup(extra={}){
 const rows=new Map([['one',{id:'one',start:'00.200',end:'01.200',text:'  原句🎵  '}],['two',{id:'two',start:'2',end:'4',text:'另句'}]]);
 const media={source:'blob:a',current_source:'blob:a',duration:6,position:.5,ready:true,error:false},errors=[],states=[],writes=[];
 const options={readRow:id=>rows.has(id)?{...rows.get(id)}:null,writeTimes:(id,v)=>{writes.push({id,...v});Object.assign(rows.get(id),v);},captureMedia:()=>({...media}),onError:e=>errors.push(e.message),onState:v=>states.push(v),...extra};
 return {rows,media,errors,states,writes,options,c:E.createController(options)};
}
test('single start stamp restores exact original clocks and preserves later text and other rows',()=>{
 const s=setup();assert.equal(s.c.refresh().canUndo,false);assert.equal(s.c.stamp('one','start').changed,true);
 assert.equal(s.rows.get('one').start,'0.5');s.rows.get('one').text='後續文字';s.rows.get('two').start='2.5';s.media.source=s.media.current_source='blob:new';s.media.duration=3;
 assert.equal(s.c.refresh().canUndo,true);assert.equal(s.c.undo().undone,true);
 assert.deepEqual(s.rows.get('one'),{id:'one',start:'00.200',end:'01.200',text:'後續文字'});assert.equal(s.rows.get('two').start,'2.5');assert.equal(s.c.refresh().canUndo,false);
});
test('end and move actions retain their original milliseconds and latest successful target only',()=>{
 const s=setup();s.media.position=1.5;s.c.stamp('one','end');assert.equal(s.rows.get('one').end,'1.5');
 s.media.position=3;s.c.stamp('two','move');assert.deepEqual([s.rows.get('two').start,s.rows.get('two').end],['3','5']);
 assert.equal(s.c.undo().id,'two');assert.deepEqual([s.rows.get('two').start,s.rows.get('two').end],['2','4']);assert.equal(s.rows.get('one').end,'1.5');
});
test('untimed original strings are restored without inventing a complete cue',()=>{
 const s=setup();s.rows.set('one',{id:'one',start:'',end:'',text:'未校時'});s.c.stamp('one','start');assert.equal(s.rows.get('one').start,'0.5');s.c.undo();assert.equal(s.rows.get('one').start,'');assert.equal(s.rows.get('one').end,'');
});
test('subsequent target-time edits permanently stop an old undo even if a value later matches again',()=>{
 const s=setup();s.c.stamp('one','start');s.rows.get('one').start='0.7';assert.equal(s.c.refresh().canUndo,false);s.rows.get('one').start='0.5';
 assert.equal(s.c.undo(),false);assert.equal(s.rows.get('one').start,'0.5');assert.match(s.errors.at(-1),/修改/);
 s.media.position=.8;assert.ok(s.c.stamp('one','start'));assert.equal(s.c.refresh().canUndo,true);
});
test('deleted or replaced targets stop old undo and explicit load clears all temporary history',()=>{
 const s=setup();s.c.stamp('one','start');const row=s.rows.get('one');s.rows.delete('one');assert.equal(s.c.refresh().canUndo,false);s.rows.set('one',row);assert.equal(s.c.undo(),false);
 s.c.clear();assert.deepEqual(s.c.refresh(),{hasRecord:false,canUndo:false,id:null,action:null,reason:null});
});
test('invalid stamps and same-value stamps retain an earlier valid undo without writing',()=>{
 const s=setup();s.c.stamp('one','start');const count=s.writes.length;
 assert.equal(s.c.stamp('one','end'),false);assert.equal(s.c.stamp('two','guess'),false);assert.equal(s.c.stamp('one','start').changed,false);
 assert.equal(s.writes.length,count);assert.equal(s.c.refresh().canUndo,true);s.c.undo();assert.equal(s.rows.get('one').start,'00.200');
});
test('ready and source guards reject unavailable or changing native media before any write',()=>{
 for(const extra of [{source:null},{current_source:'blob:old'},{ready:false},{error:true},{duration:NaN}]){
  const s=setup();Object.assign(s.media,extra);assert.equal(s.c.stamp('one','start'),false);assert.equal(s.writes.length,0);
 }
 const s=setup();let captures=0;s.options.captureMedia=()=>({...s.media,source:++captures===1?'blob:a':'blob:b'});const c=E.createController(s.options);assert.equal(c.stamp('one','start'),false);assert.equal(s.writes.length,0);
});
test('intervening row edits are refused while natural player progress keeps the original captured mark',()=>{
 const s=setup();let reads=0;const o={...s.options,readRow:id=>{const r=s.options.readRow(id);return {...r,text:++reads===1?r.text:'新內容'};}};
 assert.equal(E.createController(o).stamp('one','start'),false);assert.equal(s.writes.length,0);
 let captures=0;const c=E.createController({...s.options,captureMedia:()=>({...s.media,position:++captures===1?.5:.6})});assert.ok(c.stamp('one','start'));assert.equal(s.rows.get('one').start,'0.5');
});
test('bounded raw times and exact row shape are required and incomplete writes are never reported as success',()=>{
 const s=setup();assert.throws(()=>E.checkedRow('one',{...s.rows.get('one'),extra:true}));assert.throws(()=>E.checkedRow('one',{...s.rows.get('one'),start:' '.repeat(4097)}));
 const c=E.createController({...s.options,writeTimes:()=>{}});assert.equal(c.stamp('one','start'),false);assert.equal(c.refresh().hasRecord,false);assert.match(s.errors.at(-1),/完整套用/);
});
test('native adapter reports current target, blocks busy changes and owns only its undo listener',()=>{
 const s=setup(),listeners={},button={disabled:false,addEventListener:(k,v)=>listeners[k]=v,removeEventListener:(k,v)=>{if(listeners[k]===v)delete listeners[k];}},note={textContent:''};let busy=false,changes=[];
 const ui=DOM.bind({...s.options,button,note,position:()=>1,busy:()=>busy,onChanged:v=>changes.push(v)});
 assert.equal(button.disabled,true);ui.stamp('one','start');assert.equal(button.disabled,false);assert.match(note.textContent,/第 1 句記下開始/);
 busy=true;ui.refresh();assert.equal(button.disabled,true);assert.equal(ui.stamp('two','start'),false);listeners.click();assert.equal(s.rows.get('one').start,'0.5');
 busy=false;listeners.click();assert.equal(s.rows.get('one').start,'00.200');assert.equal(changes.at(-1).undone,true);ui.dispose();assert.deepEqual(listeners,{});assert.equal(ui.stamp('one','start'),false);
});
test('app clears new-content history and shares the source snapshot with waveform positioning',()=>{
 const fs=require('node:fs'),app=fs.readFileSync('web/app.js','utf8'),html=fs.readFileSync('web/index.html','utf8');
 assert.match(app,/if\(!ids\)\{cueStampEdit\?\.clear\(\)/);assert.match(app,/if\(tab==='lyrics'\)\{cueStampEdit\?\.refresh\(\)/);
 assert.match(app,/captureMedia:captureLyricPlayer/);assert.match(app,/capture:captureLyricPlayer/);
 assert.ok(html.indexOf('/wave-position.js')<html.indexOf('/cue-stamp-edit.js')&&html.indexOf('/cue-stamp-edit-dom.js')<html.indexOf('/app.js'));
});
