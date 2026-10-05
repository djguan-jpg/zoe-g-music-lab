// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
  const maxBytes=32*1024*1024;
  const nativeDigest=bytes=>{
    if(typeof root.crypto?.subtle?.digest!=='function')throw Error('這個瀏覽器無法核對備份 SHA-256；原備份與草稿庫保留');
    return root.crypto.subtle.digest('SHA-256',bytes);
  };
  async function sha256(raw,{digest=nativeDigest}={}){
    if(!(raw instanceof ArrayBuffer)||raw.byteLength<1||raw.byteLength>maxBytes)throw Error('備份位元組超過讀取範圍；原備份保留');
    const result=await digest(raw);
    if(!(result instanceof ArrayBuffer)||result.byteLength!==32)throw Error('備份 SHA-256 核對未完成；原備份保留');
    return Array.from(new Uint8Array(result),byte=>byte.toString(16).padStart(2,'0')).join('');
  }
  async function inspect(file,{read=f=>f.arrayBuffer(),digest=nativeDigest}={}){
    if(!file||typeof file.name!=='string'||!file.name.toLowerCase().endsWith('.zip')||
      !Number.isSafeInteger(file.size)||file.size<1||file.size>maxBytes||typeof file.arrayBuffer!=='function')
      throw Error('請選擇 1 byte 至 32 MiB 的草稿庫備份 ZIP；原資料保留');
    let raw=await read(file);
    if(!(raw instanceof ArrayBuffer)||raw.byteLength!==file.size)throw Error('備份讀取大小與選檔資訊不同；原備份保留');
    const hash=await sha256(raw,{digest});raw=null;
    return {bytes:file.size,sha256:hash};
  }
  const api=Object.freeze({inspect,sha256,maxBytes});
  if(typeof module==='object'&&module.exports)module.exports=api;else root.MusicBackupFile=api;
})(typeof globalThis==='object'?globalThis:this);
