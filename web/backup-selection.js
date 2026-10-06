// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
 const node=typeof module==='object'&&module.exports;
 const revision=node?require('./library-revision.js'):root.MusicLibraryRevision;
 const download=node?require('./backup-download.js'):root.MusicBackupDownload;
 const same=node?require('../musiclab/assets/json-document.js'):root.MusicJsonDocument;
 const fail=()=>{throw Error('備份選取來源不完整；原選取清單與草稿庫保留');};
 function checked(source){
  if(!source||typeof source!=='object'||Array.isArray(source))fail();
  const keys=Reflect.ownKeys(source);if(keys.length!==3||keys.some(k=>!['enabled','busy','selected'].includes(k)))fail();
  const values={};for(const key of keys){const field=Object.getOwnPropertyDescriptor(source,key);if(!field?.enumerable||!Object.hasOwn(field,'value'))fail();values[key]=field.value;}
  if(typeof values.enabled!=='boolean'||typeof values.busy!=='boolean')fail();
  return {...values,selected:values.selected===null?null:revision.checkedMetadata(values.selected?.id,values.selected)};
 }
 function createController({capture,onState=()=>{},onError=()=>{}}){
  if(typeof capture!=='function')fail();
  const entries=new Map();let disposed=false;
  const view=source=>({entries:[...entries.values()].map(e=>({id:e.id,label:e.label,stored_at:e.stored_at})),count:entries.size,
   canAdd:!disposed&&source.enabled&&!source.busy&&source.selected!==null&&!entries.has(source.selected.id)&&entries.size<download.maxEntries,
   canClear:!disposed&&source.enabled&&!source.busy&&entries.size>0,canDownload:!disposed&&source.enabled&&!source.busy&&entries.size>0});
  function refresh(){let source;try{source=checked(capture());}catch(error){source={enabled:false,busy:true,selected:null};if(!disposed)onError(error);}const state=view(source);onState(state);return state;}
  function allowed(){if(disposed)return null;const source=checked(capture());return source.enabled&&!source.busy?source:null;}
  function act(action){try{const source=allowed();if(!source)return false;const changed=action(source);if(changed)refresh();return changed;}catch(error){if(!disposed)onError(error);return false;}}
  return {refresh,
   add:()=>act(source=>{const entry=source.selected;if(!entry)return false;if(entries.has(entry.id)){if(!same.sameValue(entries.get(entry.id),entry))fail();return false;}if(entries.size>=download.maxEntries)throw Error('備份選取清單最多 1000 版；請明確分批下載');entries.set(entry.id,entry);return true;}),
   remove:id=>act(()=>{download.request({ids:[id]});return entries.delete(id);}),
   clear:()=>act(()=>{if(!entries.size)return false;entries.clear();return true;}),
   request(){if(!allowed()||!entries.size)return null;return download.request({ids:[...entries.keys()]});},
   dispose(){disposed=true;entries.clear();onState(view({enabled:false,busy:true,selected:null}));}
  };
 }
 const api=Object.freeze({checked,createController});if(node)module.exports=api;else root.MusicBackupSelection=api;
})(typeof globalThis==='object'?globalThis:this);
