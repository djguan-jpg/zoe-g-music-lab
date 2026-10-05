// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
  const node=typeof module==='object'&&module.exports;
  const J=node?require('../musiclab/assets/json-document.js'):root.MusicJsonDocument;
  const exact=(v,keys)=>v&&typeof v==='object'&&!Array.isArray(v)&&Object.keys(v).length===keys.length&&keys.every(k=>Object.hasOwn(v,k));
  const equal=(a,b)=>typeof a===typeof b&&(a===null||typeof a!=='object'?a===b:Array.isArray(a)?Array.isArray(b)&&a.length===b.length&&a.every((v,i)=>equal(v,b[i])):b!==null&&!Array.isArray(b)&&Object.keys(a).length===Object.keys(b).length&&Object.keys(a).every(k=>Object.hasOwn(b,k)&&equal(a[k],b[k])));
  function checkedDocument({expected,document,label}){
    if(!equal(expected,document))throw Error(`${label}與原始欄位不一致或版本不支援；目前內容保留`);
    return structuredClone(expected);
  }
  function checkedResult({expected,reply,jsonName,markdownName,markdown,label}){
    if(!exact(reply,['files','data','meta'])||!exact(reply.meta,['version','protocol_version','needs_review'])||typeof reply.meta.version!=='string'||!reply.meta.version||reply.meta.protocol_version!==1||reply.meta.needs_review!==true||
      !equal(reply.data,expected)||!exact(reply.files,[jsonName,markdownName])||!equal(J.parse(reply.files[jsonName],{maxBytes:8*1024*1024,label}),expected)||reply.files[markdownName]!==markdown(expected))
      throw Error(`${label}與本次來源或版本不一致；目前成果與編修保留`);
    return structuredClone(reply);
  }
  if(node)module.exports={checkedResult,checkedDocument};else root.MusicReadinessReport={checkedResult,checkedDocument};
})(typeof globalThis==='object'?globalThis:this);
