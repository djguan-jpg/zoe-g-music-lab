// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const T=require('../web/lyrics-timing.js'),Time=require('../musiclab/assets/lyric-time.js');
function adapter(entries=[]){
  const source=fs.readFileSync(path.join(__dirname,'../web/app.js'),'utf8'),start=source.indexOf("$('cue-add').onclick="),end=source.indexOf("$('lyrics-build').onclick=",start);
  assert.ok(start>=0&&end>start);let rows=structuredClone(entries),writes=0,reads=0,dirty=0,focused=[];const notices=[],button={};
  const context={state:{busy:false},rowSequence:41,LyricTime:Time,MusicTiming:T,$:id=>{assert.equal(id,'cue-add');return button;},
    entriesFor:list=>{assert.equal(list,'cues');reads++;return structuredClone(rows);},
    writeEntries:(list,value)=>{assert.equal(list,'cues');writes++;rows=structuredClone(value);},markDirty:scope=>{assert.equal(scope,'lyrics');dirty++;},
    focusEntry:(...args)=>focused.push(args),say:(message,error=false)=>notices.push({message,error}),Number,String};
  vm.runInNewContext(source.slice(start,end),context);
  return {click:()=>button.onclick(),context,rows:()=>rows,counts:()=>({reads,writes,dirty}),focused,notices};
}
const row=(end='0.119')=>({id:'row-original',value:{start:' 0.000 ',end,text:' 原文  🎵 '}});
test('actual add handler uses exact millisecond candidate instead of floating second addition',()=>{
  const original=row(),a=adapter([original]);a.click();assert.deepEqual(a.rows(),[original,{id:'row-42',value:{start:'0.119',end:'3.119',text:''}}]);
  assert.deepEqual(a.counts(),{reads:1,writes:1,dirty:1});assert.deepEqual(a.focused.map(x=>Array.from(x)),[['cues',1,'new']]);assert.equal(a.notices.at(-1).error,false);
});
test('actual add handler refuses precision overflow before allocating an ID or changing rows',()=>{
  const original=row('9007199254740.99'),a=adapter([original]);a.click();assert.deepEqual(a.rows(),[original]);assert.deepEqual(a.counts(),{reads:1,writes:0,dirty:0});assert.equal(a.context.rowSequence,41);assert.equal(a.focused.length,0);assert.equal(a.notices.at(-1).error,true);
});
test('actual add handler keeps a representable candidate near the precision boundary',()=>{
  const original=row('9007199254737.99'),a=adapter([original]);a.click();assert.equal(a.rows().length,2);assert.deepEqual(a.rows()[0],original);assert.deepEqual(a.rows()[1].value,{start:'9007199254737.99',end:'9007199254740.99',text:''});assert.equal(Time.normalize(a.rows()[1].value.end,'new',true),9007199254740.99);
});
test('busy handler does not read source allocate IDs change rows or move focus',()=>{
  const original=row(),a=adapter([original]);a.context.state.busy=true;a.click();assert.deepEqual(a.rows(),[original]);assert.deepEqual(a.counts(),{reads:0,writes:0,dirty:0});assert.equal(a.context.rowSequence,41);assert.equal(a.focused.length,0);
});
test('actual 10000-row limit refuses new row while preserving all original values and IDs',()=>{
  const source=Array.from({length:10000},(_,i)=>({id:'original-'+i,value:{start:String(i),end:String(i+1),text:' '+i+' 🎵 '}})),a=adapter(source);a.click();assert.deepEqual(a.rows(),source);assert.equal(a.context.rowSequence,41);assert.deepEqual(a.counts(),{reads:1,writes:0,dirty:0});assert.match(a.notices.at(-1).message,/10000/);
});
test('invalid last-end sources cannot erase earlier rows or consume the next ID',()=>{
  for(const end of ['\ufeff','\ufeff1\ufeff','\u200b','-1e-999','0x10','NaN','Infinity','\u001c1\u001c','9007199254741']){
    const source=[row('1'),{id:'last',value:{start:'2',end,text:' 最後句 🎵 '}}],a=adapter(source);a.click();assert.deepEqual(a.rows(),source,end);assert.equal(a.counts().writes,0,end);assert.equal(a.context.rowSequence,41,end);assert.equal(a.notices.at(-1).error,true,end);
  }
});
test('legal numeric whitespace and rounded source remain untouched in original row',()=>{
  for(const end of ['\u00850.119\u0085',' 0.11949 ','1.19e-1','-0e-999']){
    const original=row(end),a=adapter([original]);a.click();assert.deepEqual(a.rows()[0],original);const start=Time.normalize(end,'source',true);assert.deepEqual(a.rows()[1].value,{start:String(start),end:String(Time.seconds(Time.milliseconds(start)+3000)),text:''});assert.equal(a.notices.at(-1).error,false);
  }
});
test('blank last end keeps prior raw text and IDs and uses existing zero-to-three draft behavior',()=>{
  for(const end of ['',' \t ','\u0085','\u001c']){
    const original=row(end),a=adapter([original]);a.click();assert.deepEqual(a.rows(),[original,{id:'row-42',value:{start:'0',end:'3',text:''}}]);
  }
});
test('empty table can still create its first draft cue',()=>{
  const a=adapter();a.click();assert.deepEqual(a.rows(),[{id:'row-42',value:{start:'0',end:'3',text:''}}]);assert.deepEqual(a.focused.map(x=>Array.from(x)),[['cues',0,'new']]);
});
test('pure candidate keeps exact three-second milliseconds across ordinary source clocks',()=>{
  for(let ms=0;ms<=10000;ms++){const source=String(Time.seconds(ms)),candidate=T.nextCue(source);assert.deepEqual(candidate,{start:source,end:String(Time.seconds(ms+3000)),text:''});assert.equal(Time.milliseconds(candidate.end)-Time.milliseconds(candidate.start),3000);}
});
test('pure candidate rejects invalid types and overflowing clocks and returns independent objects',()=>{
  for(const v of [null,true,false,{},[],NaN,Infinity,-1,'-1e-999','\ufeff','9007199254740.99'])assert.throws(()=>T.nextCue(v));
  const a=T.nextCue('0.119');a.end='changed';assert.deepEqual(T.nextCue('0.119'),{start:'0.119',end:'3.119',text:''});assert.deepEqual(T.nextCue(),{start:'0',end:'3',text:''});
});
test('new actual-handler row is accepted by the original shared lyric domain after writing its text',()=>{
  const a=adapter([row()]);a.click();const cues=a.rows().map(e=>({...e.value,text:e.value.text||' 新句  🎵 '})),source=structuredClone(cues),result=Time.normalizeCues(cues);
  assert.deepEqual(result.cues,[{start:0,end:0.119,text:' 原文  🎵 '},{start:0.119,end:3.119,text:' 新句  🎵 '}]);assert.equal(result.duration,3.119);assert.deepEqual(cues,source);
});
