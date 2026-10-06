// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
 const J=typeof module==='object'&&module.exports?require('../musiclab/assets/json-document.js'):root.MusicJsonDocument;
 function scrollOffset(value){
  if(!value||!J.sameValue(value,value)||!J.sameValue(Object.keys(value).sort(),['bottom','coverBottom','height','top'])||!Object.values(value).every(v=>typeof v==='number'&&Number.isFinite(v)&&Math.abs(v)<=10000000)||value.height<24||value.bottom<value.top)throw Error('鏡頭欄位位置無效；原內容保留');
  const top=Math.max(12,Math.min(value.height-24,value.coverBottom+12)),bottom=value.height-12,size=value.bottom-value.top;
  if(value.top>=top&&value.bottom<=bottom)return 0;
  const position=size>bottom-top?top:top+(bottom-top-size)/2;
  return value.top-position;
 }
 const api=Object.freeze({scrollOffset});if(typeof module==='object'&&module.exports)module.exports=api;else root.MusicShotFieldPosition=api;
})(typeof globalThis==='object'?globalThis:this);
