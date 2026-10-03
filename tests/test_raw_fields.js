// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const R=require('../web/raw-fields.js'),D=require('../web/raw-fields-dom.js'),E=require('../web/editor-state.js');
function harness(normalize=value=>value){
  const key={},events=[];let value='';const c=R.createController({read:()=>value,write:(_key,v)=>value=normalize(v),onState:(_key,v)=>events.push(v)});
  return {key,c,events,display:()=>value,set:v=>value=v};
}
test('raw controller keeps unfinished Unicode decimal and unknown enum strings without interpretation',()=>{
  for(const source of ['１２０','4e','1_6','3?',' 24 ','二十四','16：9','0x10','','NaN','Infinity','\ufeff']){
    const h=harness();h.c.bind(h.key,source);assert.equal(h.display(),source);assert.equal(h.c.capture(h.key),source);assert.equal(h.events.at(-1).escaped,false);
  }
});
test('browser single-line CR LF and NUL normalization gets a visible representation and a lossless capture',()=>{
  for(const source of ['a\r\nb','\n首行','\u0000原值','\\n原字','a\r\tb']){
    const h=harness(v=>v.replace(/[\r\n\u0000]/g,''));h.c.bind(h.key,source);assert.equal(h.c.capture(h.key),source);
    if(/[\r\n\u0000]/.test(source)){assert.equal(h.display(),JSON.stringify(source).slice(1,-1));assert.equal(h.events.at(-1).escaped,true);}
  }
});
test('textarea CR normalization keeps exact CRLF until an explicit edit',()=>{
  const h=harness(v=>v.replace(/\r\n?/g,'\n'));h.c.bind(h.key,'\r\n原文\r尾');assert.equal(h.c.capture(h.key),'\r\n原文\r尾');
  const display=h.display();h.c.edited(h.key);assert.equal(h.c.capture(h.key),display);assert.equal(h.events.at(-1).escaped,false);
});
test('explicit editing to the same escaped display chooses new text instead of the old hidden raw value',()=>{
  const h=harness(v=>v.replaceAll('\n',''));h.c.bind(h.key,'a\nb');assert.equal(h.display(),'a\\nb');h.c.edited(h.key);assert.equal(h.c.capture(h.key),'a\\nb');
});
test('rebind replaces old records and unobserved changes capture the current input',()=>{
  const h=harness(v=>v.replaceAll('\n',''));h.c.bind(h.key,'old\n');h.set('later');assert.equal(h.c.capture(h.key),'later');h.c.bind(h.key,'new');assert.equal(h.c.capture(h.key),'new');
});
test('multiple opaque controls keep separate sources without retaining row IDs',()=>{
  const values=new WeakMap(),c=R.createController({read:k=>values.get(k)||'',write:(k,v)=>values.set(k,v.replaceAll('\n',''))}),a={},b={};
  c.bind(a,'one\n');c.bind(b,'two\n');c.edited(a);assert.equal(c.capture(a),'one\\n');assert.equal(c.capture(b),'two\n');
});
test('invalid adapters scalar source and incapable numeric controls fail instead of quietly losing data',()=>{
  assert.throws(()=>R.createController({read:()=>''}));const h=harness();assert.throws(()=>h.c.bind(h.key,12));assert.throws(()=>h.c.bind('row','x'));
  const broken=harness(()=> '');assert.throws(()=>broken.c.bind(broken.key,'4e'),/無法顯示/);
  const bad=R.createController({read:()=>null,write:()=>{}});assert.throws(()=>bad.capture({}),/需為文字/);
});
function control(tag='INPUT',normalize=v=>v){
  const attrs={},listeners=[],options=[],notes=[];let value='';
  const c={tagName:tag,options,notes,listeners,get value(){return value;},set value(v){value=tag==='SELECT'&&!options.some(o=>o.value===v)?'':normalize(v);},
    getAttribute:k=>attrs[k]??null,setAttribute:(k,v)=>attrs[k]=v,removeAttribute:k=>delete attrs[k],
    querySelectorAll:()=>options.filter(o=>o.dataset.rawOption),append:o=>{options.push(o);o.remove=()=>options.splice(options.indexOf(o),1);},
    insertAdjacentElement:(_p,n)=>{notes.push(n);n.remove=()=>notes.splice(notes.indexOf(n),1);},addEventListener:(_e,fn,config)=>listeners.push({fn,config})};return c;
}
const document={createElement:tag=>({tagName:tag.toUpperCase(),dataset:{}})};
test('DOM adapter preserves existing descriptions and removes only its own hint after input',()=>{
  const a=D.createAdapter(document),c=control('INPUT',v=>v.replaceAll('\n',''));c.setAttribute('aria-describedby','domain-error');a.write(c,'a\nb');
  assert.equal(a.read(c),'a\nb');assert.match(c.getAttribute('aria-describedby'),/^domain-error raw-value-note-/);assert.equal(c.notes.length,1);
  a.write(c,'c\nd');assert.equal(c.notes.length,1);assert.equal(c.listeners.length,1);assert.equal(c.listeners[0].config.capture,true);
  c.listeners[0].fn();assert.equal(a.read(c),'c\\nd');assert.equal(c.notes.length,0);assert.equal(c.getAttribute('aria-describedby'),'domain-error');
});
test('unknown enum is represented as a literal temporary option and removed on a known rebind',()=>{
  const a=D.createAdapter(document),c=control('SELECT');c.options.push({value:'16:9',dataset:{}});a.write(c,'16：9');
  assert.equal(c.value,'16：9');assert.equal(a.read(c),'16：9');assert.equal(c.options.length,2);assert.equal(c.options[1].textContent,'原值需核對：16：9');
  a.write(c,'<img onerror=x>\n');assert.equal(c.options.length,2);assert.match(c.options[1].textContent,/^原值需核對：<img/);assert.equal(a.read(c),'<img onerror=x>\n');
  a.write(c,'16:9');assert.equal(c.options.length,1);assert.equal(a.read(c),'16:9');
});
test('empty unknown enum stays empty instead of selecting an accepted first option',()=>{
  const a=D.createAdapter(document),c=control('SELECT');c.options.push({value:'16:9',dataset:{}});a.write(c,'');assert.equal(a.read(c),'');assert.equal(c.options[1].textContent,'尚未選擇');
});
test('actual shot complete-request adapter passes source strings and rejects missing clocks before the service',()=>{
  const source=fs.readFileSync('web/app.js','utf8'),a=source.indexOf('function getShots(){'),b=source.indexOf('function renderStoryboardDuration(',a);
  const rows=[{start:'0x10',end:' 24 ',motif_id:'motif-1',visual:'原創'}],ctx={getMotifs:()=>[{id:'motif-1',name:'原母題'}],rawShots:()=>rows,focusShot:()=>{}};
  vm.createContext(ctx);vm.runInContext(source.slice(a,b),ctx);const result=ctx.getShots()[0];assert.equal(result.start,'0x10');assert.equal(result.end,' 24 ');assert.equal(result.motif,'原母題');assert.equal(rows[0].motif_id,'motif-1');rows[0].start='';assert.throws(()=>ctx.getShots(),/不可空白/);
});
test('shot summaries and deletion compaction reject hex blank and unfinished clocks while accepting finite decimal forms',()=>{
  for(const value of ['0x10','0b10','4e','NaN','Infinity','']){
    const row={start:value,end:'24',motif_id:'',section:''};assert.equal(E.shotOverview([row],[])[0].valid,false);assert.equal(E.compactShotTimes([row]),null);assert.equal(row.start,value);
  }
  const row={start:'１_２',end:' 24 ',motif_id:'',section:''};assert.equal(E.shotOverview([row],[])[0].valid,true);assert.deepEqual(E.compactShotTimes([row]).map(x=>[x.start,x.end]),[['0','12']]);
});
test('actual lyric display refuses hexadecimal values instead of silently playing them at decimal 16',()=>{
  const source=fs.readFileSync('web/app.js','utf8'),a=source.indexOf('function cueValues(){'),b=source.indexOf('function renderCues(',a),rows=[{value:{start:'0x10',end:'20',text:'原句'}}];
  const ctx={entriesFor:()=>rows,LyricTime:require('../musiclab/assets/lyric-time.js')};vm.createContext(ctx);vm.runInContext(source.slice(a,b),ctx);assert.throws(()=>ctx.cueValues(),/十進位/);rows[0].value.start='16';assert.equal(ctx.cueValues()[0].start,16);
});
