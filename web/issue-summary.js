// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
 const J=typeof module==='object'&&module.exports?require('../musiclab/assets/json-document.js'):root.MusicJsonDocument;
 const invalid=()=>{throw Error('目前待辦說明無效；原內容保留');};
 function exact(value,keys){return value&&J.sameValue(value,value)&&J.sameValue(Object.keys(value).sort(),keys);}
 function text(value,max){return typeof value==='string'&&value.length>0&&value.length<=max;}
 function format(detail){
  if(!exact(detail,['field','location','message','relation'])||!text(detail.location,64)||!text(detail.field,64)||!text(detail.message,1024)||detail.relation!==null&&!text(detail.relation,64))invalid();
  return `${detail.location} · ${detail.field}：${detail.message}${detail.relation===null?'':`（${detail.relation}）`}`;
 }
 function present(value){
  if(!exact(value,['current','detail','index'])||typeof value.current!=='boolean'||value.index!==null&&(!Number.isSafeInteger(value.index)||value.index<0||value.index>=200))invalid();
  if(!value.current||value.index===null){if(value.detail!==null)invalid();return '';}
  return ' 目前定位：'+format(value.detail);
 }
 const api=Object.freeze({format,present});if(typeof module==='object'&&module.exports)module.exports=api;else root.MusicIssueSummary=api;
})(typeof globalThis==='object'?globalThis:this);
