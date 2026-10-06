// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
 const node=typeof module==='object'&&module.exports;
 const revision=node?require('./library-revision.js'):root.MusicLibraryRevision;
 const download=node?require('./backup-download.js'):root.MusicBackupDownload;
 const same=node?require('../musiclab/assets/json-document.js'):root.MusicJsonDocument;
 const fail=()=>{throw Error('備份選取來源不完整；原選取清單與草稿庫保留');};
 function own(value,keys){
  if(!value||typeof value!=='object'||Array.isArray(value))fail();
  const names=Reflect.ownKeys(value);if(names.length!==keys.length||names.some(k=>!keys.includes(k)))fail();
  const copy={};for(const key of keys){const field=Object.getOwnPropertyDescriptor(value,key);if(!field?.enumerable||!Object.hasOwn(field,'value'))fail();copy[key]=field.value;}return copy;
 }
 function metadata(value){
  const copy=own(value,['library_schema_version','id','label','stored_at','sha256','bytes','draft_schema_version','created_with','titles']);
  copy.titles=own(copy.titles,['music','storyboard','lyrics']);return revision.checkedMetadata(copy.id,copy);
 }
 function displayed(value){
  if(!Array.isArray(value)||!Number.isSafeInteger(value.length)||value.length>download.maxEntries||Reflect.ownKeys(value).length!==value.length+1)fail();
  const copy=[];for(let i=0;i<value.length;i++){const field=Object.getOwnPropertyDescriptor(value,String(i));if(!field?.enumerable||!Object.hasOwn(field,'value'))fail();copy.push(metadata(field.value));}return copy;
 }
 function checked(source){
  if(!source||typeof source!=='object'||Array.isArray(source))fail();
  const keys=Object.hasOwn(source,'displayed')?['enabled','busy','selected','displayed']:['enabled','busy','selected'];
  const values=own(source,keys);
  if(typeof values.enabled!=='boolean'||typeof values.busy!=='boolean')fail();
  values.selected=values.selected===null?null:metadata(values.selected);if(keys.length===4)values.displayed=displayed(values.displayed);return values;
 }
 function createController({capture,onState=()=>{},onError=()=>{}}){
  if(typeof capture!=='function')fail();
  const entries=new Map();let disposed=false,undoRecord=null;
  function sameEntries(left,right){if(left.size!==right.size)return false;const other=right.entries();for(const [id,value] of left){const next=other.next().value;if(!next||next[0]!==id||!same.sameValue(next[1],value))return false;}return true;}
  function undoPlan(source){
   if(!undoRecord)return null;
   if(!sameEntries(entries,undoRecord.after))throw Error('選取清單已變更；無法撤回，原清單保留');
   const seen=new Map();for(const entry of [...(source.displayed||[]),...(source.selected?[source.selected]:[])]){const previous=undoRecord.before.get(entry.id)||entries.get(entry.id)||seen.get(entry.id);if(previous&&!same.sameValue(previous,entry))throw Error('目前保存版本資料與上次選取不一致；無法撤回，原清單保留');seen.set(entry.id,entry);}
   return undoRecord.before;
  }
  function plan(source,removing=false){
   const pending=new Map(),seen=new Map();for(const entry of source.displayed||[]){const previous=entries.get(entry.id)||seen.get(entry.id);if(previous&&!same.sameValue(previous,entry))throw Error(`目前顯示版本與已選版本資料不一致；整批未${removing?'移出':'加入'}，原清單保留`);seen.set(entry.id,entry);if(removing?entries.has(entry.id):!entries.has(entry.id))pending.set(entry.id,entry);}
   if(!removing&&entries.size+pending.size>download.maxEntries)throw Error('加入目前顯示版本後會超過 1000 版；整批未加入，請明確分批下載');return pending;
  }
  const view=source=>{let pending=null,removals=null,restoration=null,problem=null,removeProblem=null,undoProblem=null;try{pending=plan(source);}catch(error){problem=error.message;}try{removals=plan(source,true);}catch(error){removeProblem=error.message;}try{restoration=undoPlan(source);}catch(error){undoProblem=error.message;}return {entries:[...entries.values()].map(e=>({id:e.id,label:e.label,stored_at:e.stored_at})),count:entries.size,
   undoKind:undoRecord?.kind||null,undoCount:undoRecord?.before.size??null,undoProblem,
   canUndo:!disposed&&source.enabled&&!source.busy&&restoration!==null,
   displayedCount:source.displayed?.length||0,newDisplayedCount:pending?.size||0,displayedProblem:problem,
   removableDisplayedCount:removals?.size||0,displayedRemoveProblem:removeProblem,
   canRemoveDisplayed:!disposed&&source.enabled&&!source.busy&&removals!==null&&removals.size>0,
   canAddDisplayed:!disposed&&source.enabled&&!source.busy&&pending!==null&&pending.size>0,
   canAdd:!disposed&&source.enabled&&!source.busy&&source.selected!==null&&!entries.has(source.selected.id)&&entries.size<download.maxEntries,
   canClear:!disposed&&source.enabled&&!source.busy&&entries.size>0,canDownload:!disposed&&source.enabled&&!source.busy&&entries.size>0};};
  function refresh(){let source;try{source=checked(capture());}catch(error){source={enabled:false,busy:true,selected:null};if(!disposed)onError(error);}const state=view(source);onState(state);return state;}
  function allowed(){if(disposed)return null;const source=checked(capture());return source.enabled&&!source.busy?source:null;}
  function act(action,kind){try{const source=allowed();if(!source)return false;const before=new Map(entries),changed=action(source);if(changed){undoRecord=kind==='undo'?null:{before,after:new Map(entries),kind};refresh();}return changed;}catch(error){if(!disposed)onError(error);return false;}}
  return {refresh,
   add:()=>act(source=>{const entry=source.selected;if(!entry)return false;if(entries.has(entry.id)){if(!same.sameValue(entries.get(entry.id),entry))fail();return false;}if(entries.size>=download.maxEntries)throw Error('備份選取清單最多 1000 版；請明確分批下載');entries.set(entry.id,entry);return true;},'add'),
   addDisplayed:()=>act(source=>{const pending=plan(source);if(!pending.size)return false;for(const [id,entry] of pending)entries.set(id,entry);return true;},'add-displayed'),
   removeDisplayed:()=>act(source=>{const pending=plan(source,true);if(!pending.size)return false;for(const id of pending.keys())entries.delete(id);return true;},'remove-displayed'),
   remove:id=>act(()=>{download.request({ids:[id]});return entries.delete(id);},'remove'),
   clear:()=>act(()=>{if(!entries.size)return false;entries.clear();return true;},'clear'),
   undo:()=>act(source=>{const before=undoPlan(source);if(!before)return false;entries.clear();for(const [id,entry] of before)entries.set(id,entry);return true;},'undo'),
   request(){if(!allowed()||!entries.size)return null;return download.request({ids:[...entries.keys()]});},
   dispose(){disposed=true;undoRecord=null;entries.clear();onState(view({enabled:false,busy:true,selected:null}));}
  };
 }
 const api=Object.freeze({checked,createController});if(node)module.exports=api;else root.MusicBackupSelection=api;
})(typeof globalThis==='object'?globalThis:this);
