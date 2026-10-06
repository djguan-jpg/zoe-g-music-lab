// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
 const J=typeof module==='object'&&module.exports?require('../musiclab/assets/json-document.js'):root.MusicJsonDocument;
 const maxBytes=32*1024*1024;
 const fail=()=>{throw Error('備份檔案核對來源無效；草稿庫與目前編修保留');};
 function data(value,keys){
  if(!value||typeof value!=='object'||Array.isArray(value)||Reflect.ownKeys(value).length!==keys.length)fail();
  const result={};for(const key of keys){const d=Object.getOwnPropertyDescriptor(value,key);if(!d||!d.enumerable||!Object.hasOwn(d,'value'))fail();result[key]=d.value;}return result;
 }
 function proof(value){
  const p=data(value,['bytes','sha256','entry_count']);
  if(!Number.isSafeInteger(p.bytes)||p.bytes<1||p.bytes>maxBytes||typeof p.sha256!=='string'||!/^[0-9a-f]{64}$/.test(p.sha256)||!Number.isSafeInteger(p.entry_count)||p.entry_count<0||p.entry_count>1000)fail();return p;
 }
 function metadata(value){
  const m=data(value,['name','size']);
  if(typeof m.name!=='string'||!m.name||Array.from(m.name).length>512||new TextEncoder().encode(m.name).length>1024||/[\u0000-\u001f/\\]/.test(m.name)||!Number.isSafeInteger(m.size)||m.size<1||m.size>maxBytes)throw Error('請選回 1 byte 至 32 MiB 的備份檔案；原資料保留');
  J.assertUnicode(m.name,'備份檔名');return m;
 }
 function snapshot(value){
  const s=data(value,['revision','busy','proof']);
  if(!Number.isSafeInteger(s.revision)||s.revision<0||typeof s.busy!=='boolean')fail();return {...s,proof:s.proof===null?null:proof(s.proof)};
 }
 function inspect(expected,selected){
  const p=proof(expected),s=data(selected,['bytes','sha256']);
  if(!Number.isSafeInteger(s.bytes)||s.bytes<1||s.bytes>maxBytes||typeof s.sha256!=='string'||!/^[0-9a-f]{64}$/.test(s.sha256))fail();
  return {format:'zoe-backup-file-verification',schema_version:1,expected_bytes:p.bytes,expected_sha256:p.sha256,selected_bytes:s.bytes,selected_sha256:s.sha256,matched:p.bytes===s.bytes&&p.sha256===s.sha256};
 }
 const api=Object.freeze({proof,metadata,snapshot,inspect,maxBytes});if(typeof module==='object'&&module.exports)module.exports=api;else root.MusicBackupVerification=api;
})(typeof globalThis==='object'?globalThis:this);
