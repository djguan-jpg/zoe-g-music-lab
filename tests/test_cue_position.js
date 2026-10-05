// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const C=require('../web/cue-position.js'),DOM=require('../web/cue-position-dom.js');
const media=(extra={})=>({source:'blob:a',current_source:'blob:a',duration:6,position:0,ready:true,error:false,...extra});
const row=(extra={})=>({id:'original',start:'01.234',end:'',text:'  原句🎵  ',...extra});
test('cue start uses the shared millisecond grammar while end, raw strings and partial lyrics stay unchanged',()=>{
 for(const value of [row(),row({end:'尚未填好'}),row({text:'<img src=x>\r\n🎵'})]){const before=structuredClone(value);assert.deepEqual(C.target(value,media()),{id:'original',position:1.234});assert.deepEqual(value,before);}
 assert.equal(C.target(row({start:'.0005'}),media()).position,.001);assert.equal(C.target(row({start:'0'}),media()).position,0);
});
test('invalid, negative, blank, oversized or unknown cue sources cannot become a seek target',()=>{
 for(const value of [null,{},row({id:''}),row({id:'x'.repeat(65)}),row({start:' '.repeat(4097)}),row({end:' '.repeat(4097)}),row({text:1}),{...row(),extra:true},row({start:''}),row({start:'-0.00001'}),row({start:'-1e-999'}),row({start:'Infinity'}),row({start:'1:00'})])assert.throws(()=>C.target(value,media()));
});
test('start at or beyond media end is refused without clamping and invalid native media is unavailable',()=>{
 for(const start of ['6','7','5.9996'])assert.throws(()=>C.target(row({start}),media()),/早於/);
 for(const extra of [{source:null},{current_source:'blob:old'},{ready:false},{error:true},{duration:0},{duration:NaN},{position:-1},{position:7}])assert.equal(C.target(row(),media(extra)),null);
 assert.throws(()=>C.target(row(),{...media(),extra:true}));
});
function setup({read,capture,write,allow}={}){
 let value=row(),audio=media(),reads=0,captures=0,allowed=true,writes=[],seeks=[],errors=[];
 const c=C.createController({readRow:id=>{reads++;return read?read(reads,value,id):value;},captureMedia:()=>{captures++;return capture?capture(captures,audio):audio;},isAllowed:()=>allow?allow():allowed,
  setPosition:(position,expected)=>{writes.push({position,expected});if(write)return write(position,expected,audio,value);audio.position=position;return true;},onSeek:p=>seeks.push(p),onError:e=>errors.push(e.message)});
 return {c,writes,seeks,errors,get row(){return value;},set row(v){value=v;},get media(){return audio;},set media(v){audio=v;},set allowed(v){allowed=v;},counts:()=>({reads,captures})};
}
test('explicit seek changes only native position and confirms the actual target before reporting success',()=>{
 const s=setup(),before=structuredClone(s.row);assert.equal(s.c.seek('original'),true);assert.equal(s.media.position,1.234);assert.deepEqual(s.row,before);assert.deepEqual(s.seeks,[{id:'original',position:1.234}]);assert.equal(s.counts().captures,3);
});
test('busy or hidden operation stops before reading and unavailable media causes no writer call',()=>{
 const s=setup();s.allowed=false;assert.equal(s.c.seek('original'),false);assert.deepEqual(s.counts(),{reads:0,captures:0});s.allowed=true;s.media.ready=false;assert.equal(s.c.seek('original'),false);assert.deepEqual(s.writes,[]);
});
test('source, duration, readiness or error changes between captures prevent an old target seek',()=>{
 for(const change of [a=>a.source='blob:b',a=>a.current_source='blob:b',a=>a.duration=7,a=>a.ready=false,a=>a.error=true]){
  const s=setup({capture:(n,a)=>{if(n===2)change(a);return a;}});assert.equal(s.c.seek('original'),false);assert.deepEqual(s.writes,[]);assert.deepEqual(s.seeks,[]);
 }
});
test('same object row mutation, raw-equivalent timing changes, text edits, deleted or wrong IDs are rechecked',()=>{
 for(const change of [v=>v.start='1.234',v=>v.end='2',v=>v.text='later',v=>v.id='other']){
  const s=setup({read:(n,v)=>{if(n===2)change(v);return v;}});assert.equal(s.c.seek('original'),false);assert.deepEqual(s.writes,[]);
 }
 const gone=setup({read:n=>n===1?row():null});assert.equal(gone.c.seek('original'),false);
 const wrong=setup({read:()=>row({id:'other'})});assert.equal(wrong.c.seek('original'),false);assert.deepEqual(wrong.writes,[]);
});
test('natural playback progress is allowed and the writer receives isolated current raw values',()=>{
 const s=setup({capture:(n,a)=>{if(n===2)a.position=.5;return a;},write:(position,expected,audio)=>{expected.row.text='callback private';expected.media.duration=100;audio.position=position;return true;}});
 assert.equal(s.c.seek('original'),true);assert.equal(s.row.text,'  原句🎵  ');assert.equal(s.media.duration,6);
});
test('a refused or throwing writer, wrong actual position or changed actual source cannot report success',()=>{
 for(const write of [()=>false,()=>{throw Error('refused');},()=>true,(p,e,a)=>{a.position=p+.002;return true;},(p,e,a)=>{a.position=p;a.source=a.current_source='blob:b';return true;}]){
  const s=setup({write});assert.equal(s.c.seek('original'),false);assert.equal(s.seeks.length,0);assert.equal(s.errors.length,1);
 }
 const tolerated=setup({write:(p,e,a)=>{a.position=p+.0004;return true;}});assert.equal(tolerated.c.seek('original'),true);
});
test('source becoming busy before apply and disposed controllers do not seek or retain a request',()=>{
 let allowedReads=0;const s=setup({allow:()=>++allowedReads===1});assert.equal(s.c.seek('original'),false);assert.deepEqual(s.writes,[]);
 const stopped=setup();stopped.c.dispose();assert.equal(stopped.c.seek('original'),false);assert.deepEqual(stopped.counts(),{reads:0,captures:0});
});
function domSetup(){
 let value=row(),audio=media(),allowed=true,listeners={},calls=0,targets=0;
 const button={disabled:true,dataset:{cueSeek:'original'},closest:selector=>selector==='[data-cue-seek]'?button:null};
 const container={contains:target=>target===button,addEventListener:(key,f)=>listeners[key]=f,removeEventListener:(key,f)=>{if(listeners[key]===f)delete listeners[key];}};
 const c=DOM.bind({container,targets:()=>{targets++;return [{button,row:value}];},readRow:()=>value,captureMedia:()=>audio,isAllowed:()=>allowed,setPosition:p=>{calls++;audio.position=p;return true;}});
 return {c,button,listeners,get row(){return value;},set row(v){value=v;},get media(){return audio;},set media(v){audio=v;},set allowed(v){allowed=v;},counts:()=>({calls,targets})};
}
test('DOM delegates native click to the stable ID and rechecks invalid, disabled and foreign targets',()=>{
 const s=domSetup();assert.equal(s.button.disabled,false);s.listeners.click({target:s.button});assert.equal(s.media.position,1.234);
 s.row.start='';s.listeners.input();assert.equal(s.button.disabled,true);s.listeners.click({target:s.button});assert.equal(s.counts().calls,1);
 s.listeners.click({target:{closest:()=>null}});s.listeners.click({target:{closest:()=>({disabled:false,dataset:{cueSeek:'original'}})}});assert.equal(s.counts().calls,1);
});
test('position-only refresh is cheap; raw edits, rendering, media limits and busy state refresh button availability',()=>{
 const s=domSetup(),initial=s.counts().targets;s.media.position=.5;s.c.refresh();assert.equal(s.counts().targets,initial);
 s.row.start='5';s.c.refresh({force:true});assert.equal(s.button.disabled,false);s.media.duration=2;s.c.refresh();assert.equal(s.button.disabled,true);
 s.row.start='1';s.listeners.input();assert.equal(s.button.disabled,false);s.allowed=false;s.c.refresh();assert.equal(s.button.disabled,true);
 s.allowed=true;s.media.ready=false;s.c.refresh();assert.equal(s.button.disabled,true);s.media.ready=true;s.c.refresh();assert.equal(s.button.disabled,false);
});
test('malformed DOM media clears availability and disposal removes only owned listeners without more captures',()=>{
 const s=domSetup();s.media={};s.c.refresh();assert.equal(s.button.disabled,true);s.c.dispose();assert.deepEqual(s.listeners,{});const before=s.counts();s.c.refresh({force:true});assert.deepEqual(s.counts(),before);assert.equal(s.c.seek('original'),false);
});
test('fixed assets, native position assignment and edit/render refreshes stay separate from draft or playback mutation',()=>{
 const fs=require('node:fs'),path=require('node:path'),read=name=>fs.readFileSync(path.join(__dirname,'..',name),'utf8');
 const app=read('web/app.js'),html=read('web/index.html'),server=read('music_lab_server.py');
 assert.ok(html.indexOf('/cue-position.js')<html.indexOf('/cue-position-dom.js')&&html.indexOf('/cue-position-dom.js')<html.indexOf('/app.js'));
 assert.ok(server.includes('"/cue-position.js": ("web/cue-position.js"')&&server.includes('"/cue-position-dom.js": ("web/cue-position-dom.js"'));
 assert.match(app,/data-cue-seek="\$\{esc\(keys\[i\]\)\}"/);assert.match(app,/state\.cuePosition\?\.refresh\(\{force:true\}\)/);
 const adapter=app.slice(app.indexOf('state.cuePosition=MusicCuePositionDOM.bind'),app.indexOf('function tick(){'));
 assert.match(adapter,/currentTime=seconds/);assert.doesNotMatch(adapter,/markDirty|\.play\(|\.pause\(|setInterval|setTimeout/);
});
