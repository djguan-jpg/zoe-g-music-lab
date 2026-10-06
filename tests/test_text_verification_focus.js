// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const C=require('../web/text-verification-controller.js'),D=require('../web/text-verification-dom.js');
const bytes=s=>new TextEncoder().encode(s),flush=()=>new Promise(setImmediate);
function harness({withCancel=true,canFocus=true,tabindex=null}={}){
 const state={scope:'music',revision:1,busy:false,dirty:false,visible:true,source:{name:'original.txt',content:'原文\r\n🎵'}};
 const document={activeElement:null,getElementById:id=>nodes[id]},listeners=new Map(),reports=[],errors=[];
 function node(){const events=new Map(),attrs=new Map();return {disabled:false,files:[],value:'',textContent:'',dataset:{},events,attrs,
  focus(){if(!canFocus||this.failFocus||this.disabled)return;const old=document.activeElement;document.activeElement=this;if(old!==this)old?.events.get('blur')?.();},
  addEventListener:(n,f)=>events.set(n,f),removeEventListener:(n,f)=>{assert.equal(events.get(n),f);events.delete(n);},
  hasAttribute:n=>attrs.has(n),setAttribute:(n,v)=>attrs.set(n,v)};}
 const nodes={file:node(),note:node(),source:node(),cancel:node(),other:node()};document.activeElement=nodes.other;
 if(tabindex!==null)nodes.note.attrs.set('tabindex',tabindex);
 class File{constructor(text=state.source.content){this.name='saved.txt';this.text=text;this.size=bytes(text).length;this.end=null;this.fail=null;}arrayBuffer(){return new Promise((resolve,reject)=>{this.end=()=>resolve(bytes(this.text).buffer);this.fail=()=>reject(Error('late read'));});}}
 const adapter=D.bind(document,{capture:()=>state,FileType:File,ids:{file:'file',note:'note',source:'source',...(withCancel?{cancel:'cancel'}:{})},events:{addEventListener:(n,f)=>listeners.set(n,f),removeEventListener:(n,f)=>{assert.equal(listeners.get(n),f);listeners.delete(n);}},onReport:r=>reports.push(r),onError:e=>errors.push(e.message)});
 const choose=()=>{const f=new File();nodes.file.files=[f];nodes.file.onchange();return f;};
 const cancel=()=>{nodes.cancel.focus();nodes.cancel.onclick();};
 const fill=()=>{const a=choose();cancel();const b=choose();cancel();return [a,b];};
 return {state,nodes,document,listeners,reports,errors,adapter,choose,cancel,fill};
}
test('explicit cancellation returns focus to an available picker without changing source or accepting proof',async()=>{
 const h=harness(),before=structuredClone(h.state),f=h.choose();h.cancel();assert.equal(h.document.activeElement,h.nodes.file);assert.equal(h.nodes.file.disabled,false);
 f.end();await flush();assert.deepEqual(h.state,before);assert.equal(h.reports.length,0);assert.equal(h.errors.length,0);assert.equal(h.document.activeElement,h.nodes.file);h.adapter.dispose();
});
test('a full reader cap focuses the note and resumes its still-current keyboard invitation after settling',async()=>{
 const h=harness(),[a,b]=h.fill();assert.equal(h.document.activeElement,h.nodes.note);assert.equal(h.nodes.note.attrs.get('tabindex'),'-1');assert.equal(h.nodes.file.disabled,true);
 a.end();await flush();assert.equal(h.document.activeElement,h.nodes.file);assert.equal(h.nodes.file.disabled,false);b.fail();await flush();assert.equal(h.reports.length,0);assert.equal(h.errors.length,0);h.adapter.dispose();
});
test('leaving the note cancels the invitation even if focus later returns to the note',async()=>{
 const h=harness(),[a,b]=h.fill();h.nodes.other.focus();h.nodes.other.value='後續編修';h.nodes.note.focus();a.end();await flush();
 assert.equal(h.document.activeElement,h.nodes.note);assert.equal(h.nodes.other.value,'後續編修');b.fail();await flush();assert.equal(h.document.activeElement,h.nodes.note);assert.equal(h.reports.length,0);h.adapter.dispose();
});
test('full source context changes invalidate focus invitations including content changes without a revision',async()=>{
 for(const mutate of [s=>s.scope='lyrics',s=>s.revision++,s=>s.source.name='next.txt',s=>s.source.content+='新原文']){
  const h=harness(),[a,b]=h.fill();mutate(h.state);h.adapter.refresh();a.end();await flush();assert.equal(h.document.activeElement,h.nodes.note);b.end();await flush();assert.equal(h.document.activeElement,h.nodes.note);assert.equal(h.reports.length,0);h.adapter.dispose();
 }
});
test('ordinary successful and failed completions never move focus from a later edit',async()=>{
 for(const fail of [false,true]){const h=harness(),f=h.choose();h.nodes.other.focus();if(fail)f.fail();else f.end();await flush();assert.equal(h.document.activeElement,h.nodes.other);assert.equal(h.reports.length,fail?0:1);assert.equal(h.errors.length,fail?1:0);h.adapter.dispose();}
});
test('pagehide and dispose discard only their own invitation and blur handler before delayed completion',async()=>{
 for(const dispose of [false,true]){const h=harness(),[a,b]=h.fill();if(dispose)h.adapter.dispose();else h.listeners.get('pagehide')();a.end();b.fail();await flush();assert.equal(h.document.activeElement,h.nodes.note);assert.equal(h.reports.length,0);assert.equal(h.errors.length,0);if(!dispose)h.adapter.dispose();assert.equal(h.nodes.note.events.size,0);assert.equal(h.listeners.size,0);}
});
test('failed picker focus falls back to the note and failed note focus cannot invite later focus',async()=>{
 const h=harness(),f=h.choose();h.nodes.file.failFocus=true;h.cancel();assert.equal(h.document.activeElement,h.nodes.note);f.end();await flush();assert.equal(h.document.activeElement,h.nodes.note);h.adapter.dispose();
 const no=harness({canFocus:false}),[a,b]=no.fill();a.end();b.end();await flush();assert.equal(no.document.activeElement,no.nodes.other);assert.equal(no.reports.length,0);no.adapter.dispose();
});
test('legacy optional controls and an existing note tabindex retain their contracts with three scoped focus styles',async()=>{
 const h=harness({withCancel:false}),f=h.choose();f.end();await flush();assert.equal(h.reports.length,1);assert.equal(h.document.activeElement,h.nodes.other);assert.equal(h.nodes.note.events.size,0);h.adapter.dispose();
 const existing=harness({tabindex:'0'});assert.equal(existing.nodes.note.attrs.get('tabindex'),'0');existing.adapter.dispose();
 const html=fs.readFileSync('web/index.html','utf8'),css=fs.readFileSync('web/style.css','utf8');for(const prefix of ['text','draft','audio-accept']){assert.match(html.match(new RegExp('<p id="'+prefix+'-verify-note"[^>]*>'))[0],/tabindex="-1"/);assert.ok(css.includes('#'+prefix+'-verify-note:focus'));}
});
test('context epoch tracks isolated full source identity without making transient availability part of that identity',()=>{
 const state={scope:'music',revision:1,busy:false,dirty:false,visible:true,source:{name:'x.txt',content:'same'}},c=C.createController({capture:()=>state,describe:()=>({name:'x.txt',size:0}),readFile:()=>bytes('')});
 const first=c.view();assert.equal(c.view().contextRevision,first.contextRevision);first.contextRevision=999;state.busy=true;assert.equal(c.view().contextRevision,1);state.busy=false;
 state.source.content='different';assert.equal(c.view().contextRevision,2);state.source.content='same';assert.equal(c.view().contextRevision,3);c.dispose();
});
