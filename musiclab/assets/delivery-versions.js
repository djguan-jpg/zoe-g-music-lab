// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
  const node=typeof module==='object'&&module.exports;
  const json=node?require('./json-document.js'):root.MusicJsonDocument;
  const maxBytes=8192,maxSupported=256,maxComponent=2147483647;
  const exact=(v,keys)=>v&&typeof v==='object'&&!Array.isArray(v)&&Object.keys(v).length===keys.length&&keys.every(k=>Object.hasOwn(v,k));
  function parts(value){
    const match=typeof value==='string'&&/^(0|[1-9][0-9]{0,9})\.(0|[1-9][0-9]{0,9})\.(0|[1-9][0-9]{0,9})$/.exec(value);
    if(!match||match[0]!==value)throw Error('交付版本需為明確的三段整數版本');
    const values=match.slice(1).map(Number);
    if(values.some(v=>v>maxComponent))throw Error('交付版本整數超過上限');
    return values;
  }
  const compare=(a,b)=>{for(let i=0;i<3;i++)if(a[i]!==b[i])return a[i]-b[i];return 0;};
  function createPolicy(contract){
    if(!exact(contract,['format','schema_version','current','supported'])||contract.format!=='zoe-delivery-versions'||contract.schema_version!==1)throw Error('交付版本契約不支援；沒有推測或遷移');
    parts(contract.current);
    if(!Array.isArray(contract.supported)||contract.supported.length<1||contract.supported.length>maxSupported)throw Error('交付版本清單需有 1–256 個明確版本');
    let previous=null;
    for(const value of contract.supported){const current=parts(value);if(previous&&compare(current,previous)<=0)throw Error('交付版本清單需為不重複的遞增版本');previous=current;}
    if(contract.current!==contract.supported.at(-1))throw Error('目前交付版本需為清單最後一版');
    const supported=Object.freeze([...contract.supported]),accepted=new Set(supported);
    return Object.freeze({current:contract.current,schemaVersion:1,supported,supportsVersion:value=>typeof value==='string'&&accepted.has(value)});
  }
  function decodePolicy(raw){return createPolicy(json.parse(raw,{maxBytes,label:'交付版本契約',allowBOM:false}));}
  function loadFixed(){
    const fs=require('node:fs'),handle=fs.openSync(__dirname+'/delivery-versions.json','r');
    try{const buffer=Buffer.alloc(maxBytes+1),size=fs.readSync(handle,buffer,0,buffer.length,0);return createPolicy(json.decode(buffer.subarray(0,size),{size,maxBytes,label:'交付版本契約',allowBOM:false}));}
    finally{fs.closeSync(handle);}
  }
  const policy=node?loadFixed():createPolicy(root.MusicDeliveryVersionsContract);
  const api=Object.freeze({...policy,createPolicy,decodePolicy});
  if(node)module.exports=api;else root.MusicDeliveryVersions=api;
})(typeof globalThis==='object'?globalThis:this);
