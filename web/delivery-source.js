// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
 // Internal plain bundle values only. Strings are immutable: copy containers,
 // retain their values, and compare them directly without full-text serialization.
 function copy(value){
  if(value===null||typeof value!=='object')return value;
  if(Array.isArray(value))return value.map(copy);
  return Object.fromEntries(Object.keys(value).map(key=>[key,copy(value[key])]));
 }
 function equal(a,b){
  if(a===b)return true;
  if(!a||!b||typeof a!=='object'||typeof b!=='object'||Array.isArray(a)!==Array.isArray(b))return false;
  if(Array.isArray(a)&&a.length!==b.length)return false;
  const left=Object.keys(a),right=Object.keys(b);
  return left.length===right.length&&left.every((key,i)=>key===right[i]&&equal(a[key],b[key]));
 }
 function snapshot(c){return {scope:c.scope,revision:c.revision,resultRevision:c.resultRevision,bundle:copy(c.bundle),media:[...(c.media||[])],busy:!!c.busy};}
 function current(c,b){return !c.busy&&c.scope===b.scope&&c.revision===b.revision&&c.resultRevision===b.resultRevision&&equal(c.bundle,b.bundle)&&(c.media||[]).length===b.media.length&&b.media.every((file,i)=>file===(c.media||[])[i]);}
 const api={copy,equal,snapshot,current};if(typeof module==='object'&&module.exports)module.exports=api;else root.MusicDeliverySource=api;
})(typeof globalThis==='object'?globalThis:this);
