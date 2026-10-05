// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const H=require('../web/deletion-history.js');
const source=fs.readFileSync('web/app.js','utf8'),begin=source.indexOf('function deleteEntry('),end=source.indexOf("['music','storyboard','lyrics'].forEach",begin);
assert.ok(begin>=0&&end>begin);
const shot=(i,start=String(i*6),finish=String((i+1)*6))=>({id:'row-'+i,value:{start,end:finish,section:'段落 '+i,purpose:' 原用途\n保留 ',visual:'字面<script>🎵',camera:'固定',transition:'切',motif_id:'motif-1',motif_state:'原狀態',character_state:'同人物',change_reason:'',screen_direction:'neutral',open:i%2===0}});
function setup(rows=[shot(0),shot(1),shot(2)],list='shots'){
 let live=structuredClone(rows),writes=0,reads=0;const history=H.createHistory(20),events=[],duration={value:' 0018.000 '},selection={value:'0'},unrelated={music:'原歌曲',lyrics:'原句',media:{source:'owned-blob',paused:true,position:.5},ratio:'16:9',fps:'24'};
 const scope=list==='shots'?'storyboard':list==='cues'?'lyrics':'music';
 const context={state:{busy:false},collections:{[list]:{scope,label:'鏡頭',limit:list==='shots'?1000:40}},
  entriesFor:()=>{reads++;return structuredClone(live);},writeEntries:(_list,rows)=>{live=structuredClone(rows);writes++;},MusicHistory:H,
  MusicEditor:{compactShotTimes:()=>{throw Error('Deletion must never compact clocks');}},deletionHistory:history,
  readValue:x=>x.value,writeValue:(x,v)=>x.value=v,$:id=>id==='mv-duration'?duration:selection,
  refreshDeletionHistory:()=>{selection.value=String(Math.max(0,history.size(scope)-1));},markDirty:s=>events.push(['dirty',s]),focusEntry:(...args)=>events.push(['focus',...args]),say:(message,error=false)=>events.push(['say',message,error])};
 vm.createContext(context);vm.runInContext(source.slice(begin,end),context);
 return {context,history,events,duration,selection,unrelated,scope,list,remove:i=>context.deleteEntry(list,i),undo:()=>context.undoDeletion(scope),get live(){return live;},set live(v){live=structuredClone(v);},get writes(){return writes;},get reads(){return reads;}};
}
test('actual deletion removes only the selected shot at every position, preserving complete raw survivors',()=>{
 for(let index=0;index<4;index++){
  const original=[shot(0),shot(1),shot(2),shot(3)],s=setup(original),other=structuredClone(s.unrelated),expected=structuredClone(original);expected.splice(index,1);s.remove(index);
  assert.deepEqual(s.live,expected);assert.deepEqual(original,[shot(0),shot(1),shot(2),shot(3)]);assert.deepEqual(s.unrelated,other);assert.equal(s.duration.value,' 0018.000 ');assert.equal(s.writes,1);
  const record=s.history.peek('storyboard');assert.deepEqual(record.entry,original[index]);assert.deepEqual(record.patches,[]);assert.deepEqual(record.fields,{});assert.deepEqual(s.events.filter(x=>x[0]==='dirty'),[['dirty','storyboard']]);assert.match(s.events.at(-1)[1],/其他鏡頭原時間與總長保留/);
 }
});
test('invalid, incomplete, negative, underflow and nondecimal times remain literal after another shot is deleted',()=>{
 for(const [start,end] of [['-6','0'],['-1e-9999','6'],['',''],['','12'],['6',''],['9','8'],['6','6'],['NaN','Infinity'],['０.１','１.００'],['0x10','0x20'],[' 0012.000 ',' 0018.000 ']]){
  const rows=[shot(0),shot(1,start,end),shot(2)],s=setup(rows);s.remove(0);assert.deepEqual(s.live,rows.slice(1));s.undo();assert.deepEqual(s.live,rows);assert.equal(s.history.size('storyboard'),0);
 }
});
test('submillisecond positive duration and large clocks are never rounded or collapsed by deletion',()=>{
 for(const [start,end] of [['0.0001','0.0004'],['9007199254740990','9007199254740991'],['1e100','2e100']]){
  const rows=[shot(0),shot(1,start,end)],s=setup(rows);s.remove(0);assert.equal(s.live[0].value.start,start);assert.equal(s.live[0].value.end,end);assert.notEqual(s.live[0].value.start,s.live[0].value.end);
 }
});
test('deleted incomplete shot restores its exact original raw content, Unicode, whitespace and open state',()=>{
 const rows=[shot(0,'',''),shot(1)];rows[0].value.visual=' 原文\r\n🎵\u0000 ';rows[0].value.open=false;const s=setup(rows);s.remove(0);s.history.peek('storyboard').entry.value.visual='不能污染';s.undo();assert.deepEqual(s.live,rows);
});
test('undo preserves later clocks, creative edits, declared duration and unrelated media and panels',()=>{
 const rows=[shot(0),shot(1),shot(2)],s=setup(rows),other=structuredClone(s.unrelated);s.remove(1);s.live[1].value.start='';s.live[1].value.end='25.0004';s.live[1].value.visual='後續畫面';s.duration.value=' 0030.000 ';
 s.undo();assert.deepEqual(s.live[1],rows[1]);assert.equal(s.live[2].value.start,'');assert.equal(s.live[2].value.end,'25.0004');assert.equal(s.live[2].value.visual,'後續畫面');assert.equal(s.duration.value,' 0030.000 ');assert.deepEqual(s.unrelated,other);assert.equal(s.history.size('storyboard'),0);
});
test('sequential deletions and selecting an older record preserve survivor identity and edits',()=>{
 const rows=[shot(0),shot(1),shot(2),shot(3)],s=setup(rows);s.remove(1);s.remove(1);s.live[1].value.start='18.0004';s.selection.value='0';s.undo();assert.deepEqual(s.live.map(e=>e.id),['row-0','row-1','row-3']);assert.equal(s.live[2].value.start,'18.0004');s.selection.value='0';s.undo();assert.deepEqual(s.live.map(e=>e.id),rows.map(e=>e.id));assert.equal(s.live[3].value.start,'18.0004');
});
test('busy deletion and undo do not read rows, change values or remove existing history',()=>{
 const s=setup();s.remove(1);const before=structuredClone(s.live),writes=s.writes,reads=s.reads;s.context.state.busy=true;s.remove(0);s.undo();assert.deepEqual(s.live,before);assert.equal(s.writes,writes);assert.equal(s.reads,reads);assert.equal(s.history.size('storyboard'),1);assert.match(s.events.at(-1)[1],/尚未完成/);
});
test('last-shot deletion stays empty, focuses the add flow and can restore the original row',()=>{
 const rows=[shot(0,'12','18')],s=setup(rows);s.remove(0);assert.deepEqual(s.live,[]);assert.deepEqual(s.events.find(x=>x[0]==='focus'),['focus','shots',0]);s.undo();assert.deepEqual(s.live,rows);assert.equal(s.duration.value,' 0018.000 ');
});
test('1000-shot capacity refusal keeps the chosen history and every later raw value intact',()=>{
 const rows=Array.from({length:1000},(_,i)=>shot(i)),s=setup(rows);s.remove(500);s.live.push(shot(1000,' 7000.000 ',' 7006.000 '));const before=structuredClone(s.live),writes=s.writes;s.undo();assert.deepEqual(s.live,before);assert.equal(s.writes,writes);assert.equal(s.history.size('storyboard'),1);assert.match(s.events.at(-1)[1],/上限/);s.live.pop();s.undo();assert.deepEqual(s.live,rows);
});
test('invalid index and duplicate identity cannot delete or normalize any source',()=>{
 const s=setup(),before=structuredClone(s.live);for(const index of [-1,3,1.5,'1'])assert.throws(()=>s.remove(index));assert.deepEqual(s.live,before);assert.equal(s.writes,0);assert.equal(s.history.size('storyboard'),0);s.live[1].id=s.live[0].id;assert.throws(()=>s.remove(0),/識別/);assert.equal(s.writes,0);
});
test('shared deletion of song and lyric rows still uses the same isolated remove and restore path',()=>{
 for(const list of ['arrangement','cues']){const rows=[shot(0),shot(1),shot(2)],s=setup(rows,list);s.remove(1);assert.deepEqual(s.live,[rows[0],rows[2]]);assert.equal(s.history.size(s.scope),1);s.undo();assert.deepEqual(s.live,rows);assert.equal(s.history.size(s.scope),0);}
});
test('native UI describes time preservation and existing pure compaction has no live deletion caller',()=>{
 const html=fs.readFileSync('web/index.html','utf8');assert.match(html,/id="shot-delete-note"/);assert.match(html,/其他鏡頭的原時間與作品總長保留/);assert.match(source,/aria-describedby="shot-delete-note"/);assert.doesNotMatch(source.slice(begin,end),/compactShotTimes|MusicHistory\.effects|Math\.round|\.start\s*=|\.end\s*=/);
});
