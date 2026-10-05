// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {createLibraryController,fingerprint}=require('../web/draft-library.js');
const {draftFields,draftRows,validateDraft}=require('../web/editor-state.js');
function draft(){
  const panels=Object.fromEntries(Object.entries(draftFields).map(([name,keys])=>[name,{fields:Object.fromEntries(keys.map(k=>[k,'']))}]));
  Object.entries(draftRows).forEach(([name,rule])=>panels[name][rule.key]=[]);
  panels.music.avoid=['多行\n原文'];panels.music.deliverables=[];panels.storyboard.motifs=[];
  panels.lyrics.fields['lyrics-format']='.lrc';panels.audio.fields['audio-profile']='distribution';
  return {format:'zoe-music-lab-draft',schema_version:3,tool_version:'0.9.0',saved_at:'synthetic',tab:'music',panels};
}
function harness(){
  let current=draft(),sequence=0;const calls=[],saved=[],lists=[],ready=[],errors=[],states=[];
  const controller=createLibraryController({capture:()=>structuredClone(current),validate:validateDraft,newId:()=>`draft-${String(++sequence).padStart(32,'0')}`,confirmSave:async(payload,ack)=>ack,
    request:(action,payload)=>new Promise((resolve,reject)=>calls.push({action,payload,resolve,reject})),
    onSaved:r=>saved.push(r),onList:(r,append)=>lists.push({r,append}),onReady:r=>ready.push(r),onError:(e,s)=>errors.push({message:e.message,...s}),onPending:s=>states.push(s)});
  return {controller,calls,saved,lists,ready,errors,states,current:()=>current,set:value=>current=value,sequence:()=>sequence};
}
const success=call=>({entry:{id:call.payload.id,label:call.payload.label},reused:false});

test('save captures the click-time draft and preserves later form edits with a changed notice',async()=>{
  const h=harness(),work=h.controller.save('第一案');
  h.current().panels.music.fields['music-title']='保存後的新歌名';
  assert.equal(h.calls[0].payload.draft.panels.music.fields['music-title'],'');
  h.calls[0].resolve(success(h.calls[0]));assert.equal(await work,true);
  assert.equal(h.saved[0].changed,true);assert.equal(h.current().panels.music.fields['music-title'],'保存後的新歌名');
  assert.equal(h.controller.pending(),null);assert.deepEqual(h.states.at(-1),{pending:false,saving:false});
});

test('uncertain save failure retries the identical ID and snapshot despite later edits',async()=>{
  const h=harness(),work=h.controller.save('待確認');h.calls[0].reject(Error('connection lost after possible commit'));await work;
  const original=structuredClone(h.calls[0].payload),copy=h.controller.pending();copy.draft.panels.music.avoid[0]='污染';
  h.current().panels.music.avoid[0]='目前編修';assert.equal(await h.controller.save('另存'),false);assert.equal(h.calls.length,1);
  const retry=h.controller.retry();assert.deepEqual(h.calls[1].payload,original);assert.equal(h.sequence(),1);
  h.calls[1].resolve({...success(h.calls[1]),reused:true});await retry;
  assert.equal(h.saved[0].reused,true);assert.equal(h.saved[0].changed,true);assert.equal(h.current().panels.music.avoid[0],'目前編修');
});

test('known input refusal releases pending save so corrected content gets a new ID',async()=>{
  const h=harness(),work=h.controller.save('第一案');const error=Error('invalid input');error.status=400;h.calls[0].reject(error);await work;
  assert.equal(h.controller.pending(),null);assert.equal(h.errors[0].retryable,false);
  const next=h.controller.save('修正案');assert.notEqual(h.calls[1].payload.id,h.calls[0].payload.id);
  h.calls[1].resolve(success(h.calls[1]));await next;
});

test('explicit abandon creates no delete or automatic retry; active save cannot be abandoned',async()=>{
  const h=harness(),work=h.controller.save('待確認');assert.equal(h.controller.abandon(),false);
  h.calls[0].reject(Error('unknown outcome'));await work;assert.equal(h.controller.abandon(),true);assert.equal(h.calls.length,1);
  const next=h.controller.save('明確新版本');assert.equal(h.sequence(),2);assert.ok(h.calls.every(c=>c.action==='save'));
  h.calls[1].resolve(success(h.calls[1]));await next;
});

test('latest read wins and cancel prevents stale previews without applying to current forms',async()=>{
  const h=harness(),before=structuredClone(h.current()),first=h.controller.read('old'),second=h.controller.read('new');
  const value=draft();value.panels.music.fields['music-title']='新預覽';
  h.calls[1].resolve({entry:{id:'new'},draft:value});await second;
  h.calls[0].resolve({entry:{id:'old'},draft:draft()});await first;
  assert.equal(h.ready.length,1);assert.equal(h.ready[0].entry.id,'new');assert.deepEqual(h.current(),before);
  const canceled=h.controller.read('canceled');h.controller.cancelRead();h.calls[2].reject(Error('late error'));await canceled;
  assert.equal(h.ready.length,1);assert.equal(h.errors.length,0);
});

test('latest list response wins and carries an explicit pagination append flag',async()=>{
  const h=harness(),older=h.controller.list('cursor'),fresh=h.controller.list();
  h.calls[1].resolve({entries:[{id:'new'}],next_cursor:null,issues:[]});await fresh;
  h.calls[0].resolve({entries:[{id:'old'}],next_cursor:null,issues:[]});await older;
  assert.equal(h.lists.length,1);assert.equal(h.lists[0].append,false);
  const more=h.controller.list('next');h.calls[2].resolve({entries:[],next_cursor:null,issues:[]});await more;
  assert.equal(h.lists[1].append,true);
});

test('invalid names and unknown draft versions are rejected before any save request',async()=>{
  const h=harness();assert.equal(await h.controller.save(' '),false);assert.equal(await h.controller.save('x'.repeat(201)),false);
  const future=draft();future.schema_version=4;h.set(future);assert.equal(await h.controller.save('未支援'),false);
  assert.equal(h.calls.length,0);assert.equal(h.sequence(),0);assert.equal(h.controller.pending(),null);
});

test('invalid read shape never becomes a preview and preserves the current draft',async()=>{
  const h=harness(),before=structuredClone(h.current()),work=h.controller.read('bad');
  h.calls[0].resolve({entry:{id:'bad'},draft:{schema_version:4}});assert.equal(await work,false);
  assert.equal(h.ready.length,0);assert.equal(h.errors.length,1);assert.deepEqual(h.current(),before);
});

test('save fingerprint ignores volatile metadata and key order but tracks text and row order',()=>{
  const value=draft(),other=structuredClone(value);other.saved_at='later';other.tool_version='other';other.tab='lyrics';
  other.panels.music.fields=Object.fromEntries(Object.entries(other.panels.music.fields).reverse());
  assert.equal(fingerprint(value),fingerprint(other));other.panels.music.avoid.push('新項目');assert.notEqual(fingerprint(value),fingerprint(other));
  const reordered=structuredClone(other);reordered.panels.music.avoid.reverse();assert.notEqual(fingerprint(other),fingerprint(reordered));
});
