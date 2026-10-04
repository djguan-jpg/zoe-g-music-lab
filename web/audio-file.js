// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
  const maxBytes=64*1024*1024;
  const nativeDigest=bytes=>{
    if(typeof root.crypto?.subtle?.digest!=='function')throw Error('這個瀏覽器無法量測 SHA-256；請使用支援本機安全來源的瀏覽器，原成果保留');
    return root.crypto.subtle.digest('SHA-256',bytes);
  };
  async function sha256(file,{read=f=>f.arrayBuffer(),digest=nativeDigest}={}){
    if(!file||!Number.isSafeInteger(file.size)||file.size<1||file.size>maxBytes||typeof file.arrayBuffer!=='function')
      throw Error('無法讀取選定音檔來核對 SHA-256；原音檔與成果保留');
    let raw=await read(file);
    if(!(raw instanceof ArrayBuffer)||raw.byteLength!==file.size)
      throw Error('音檔讀取大小與選檔資訊不同；原音檔與成果保留');
    const result=await digest(raw);raw=null;
    if(!(result instanceof ArrayBuffer)||result.byteLength!==32)
      throw Error('音檔 SHA-256 核對未完成；原音檔與成果保留');
    return Array.from(new Uint8Array(result),byte=>byte.toString(16).padStart(2,'0')).join('');
  }
  const api=Object.freeze({sha256,maxBytes});
  if(typeof module==='object'&&module.exports)module.exports=api;else root.MusicAudioFile=api;
})(typeof globalThis==='object'?globalThis:this);
