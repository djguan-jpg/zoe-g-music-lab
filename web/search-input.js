// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
 function shouldFind(value){
  if(!value||typeof value!=='object'||Array.isArray(value)||Object.keys(value).length!==3||!['key','isComposing','keyCode'].every(k=>Object.hasOwn(value,k)))return false;
  return value.key==='Enter'&&value.isComposing===false&&Number.isSafeInteger(value.keyCode)&&value.keyCode>=0&&value.keyCode<=0xffffffff&&value.keyCode!==229;
 }
 const api=Object.freeze({shouldFind});if(typeof module==='object'&&module.exports)module.exports=api;else root.MusicSearchInput=api;
})(typeof globalThis==='object'?globalThis:this);
