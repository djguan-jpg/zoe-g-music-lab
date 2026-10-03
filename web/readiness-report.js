// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
  const node=typeof module==='object'&&module.exports;
  const J=node?require('../musiclab/assets/json-document.js'):root.MusicJsonDocument;
  const exact=(v,keys)=>v&&typeof v==='object'&&!Array.isArray(v)&&Object.keys(v).length===keys.length&&keys.every(k=>Object.hasOwn(v,k));
  const canonical=v=>Array.isArray(v)?v.map(canonical):v&&typeof v==='object'?Object.fromEntries(Object.keys(v).sort().map(k=>[k,canonical(v[k])])):v;
  const equal=(a,b)=>JSON.stringify(canonical(a))===JSON.stringify(canonical(b));
  function checkedResult({expected,reply,jsonName,markdownName,markdown,label}){
    if(!exact(reply,['files','data','meta'])||!exact(reply.meta,['version','protocol_version','needs_review'])||typeof reply.meta.version!=='string'||!reply.meta.version||reply.meta.protocol_version!==1||reply.meta.needs_review!==true||
      !equal(reply.data,expected)||!exact(reply.files,[jsonName,markdownName])||!equal(J.parse(reply.files[jsonName],{maxBytes:8*1024*1024,label}),expected)||reply.files[markdownName]!==markdown(expected))
      throw Error(`${label}與本次來源或版本不一致；目前成果與編修保留`);
    return structuredClone(reply);
  }
  if(node)module.exports={checkedResult};else root.MusicReadinessReport={checkedResult};
})(typeof globalThis==='object'?globalThis:this);
