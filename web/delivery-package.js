// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
  const json=typeof module==='object'&&module.exports?require('../musiclab/assets/json-document.js'):root.MusicJsonDocument;
  const version='0.40.0',maxSource=8*1024*1024,maxRequest=32*1024*1024,maxArchive=maxSource+65536;
  const scopes=['music','storyboard','lyrics','audio'],reserved='delivery-manifest.json';
  const exact=(v,keys)=>v&&typeof v==='object'&&!Array.isArray(v)&&Object.keys(v).length===keys.length&&keys.every(k=>Object.hasOwn(v,k));
  function source(s){
    if(!s||!scopes.includes(s.scope)||typeof s.label!=='string'||Array.from(s.label).length>200||!s.files||typeof s.files!=='object'||Array.isArray(s.files))throw Error('本輪文字成果來源無效');
    const names=Object.keys(s.files).sort(),lower=new Set();let total=0;
    if(!names.length||names.length>64)throw Error('本輪需有 1–64 個文字成果檔案');
    for(const name of names){
      const key=name.toLowerCase();
      if(!/^[A-Za-z0-9][A-Za-z0-9_.-]{0,99}$/.test(name)||name.endsWith('.')||/^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])(?:\.|$)/i.test(name)||
        !/\.(json|md|txt|csv|html|js|css|lrc|srt)$/i.test(name)||key===reserved||lower.has(key)||typeof s.files[name]!=='string')throw Error('成果需為不重複的可攜單層文字檔名');
      total+=new TextEncoder().encode(s.files[name]).length;if(total>maxSource)throw Error('本輪文字成果總量最多 8 MiB');lower.add(key);
    }
    const payload={scope:s.scope,label:s.label,files:Object.fromEntries(names.map(n=>[n,s.files[n]]))};
    return json.parse(JSON.stringify(payload),{maxBytes:maxRequest,label:'交付封裝',allowBOM:false});
  }
  const fingerprint=s=>JSON.stringify(source(s));
  async function digest(raw){const bytes=new Uint8Array(await root.crypto.subtle.digest('SHA-256',raw));return Array.from(bytes,v=>v.toString(16).padStart(2,'0')).join('');}
  async function manifest(s,hash=digest,toolVersion=version){
    if(!['0.38.0','0.39.0','0.40.0'].includes(toolVersion))throw Error('交付工具版本不支援');
    s=source(s);const files=[];
    for(const [name,content] of Object.entries(s.files)){const raw=new TextEncoder().encode(content);files.push({name,bytes:raw.length,sha256:await hash(raw)});}
    if(files.some(f=>typeof f.sha256!=='string'||!/^[0-9a-f]{64}$/.test(f.sha256)))throw Error('本機檔案摘要未完成');
    return {format:'zoe-delivery-manifest',schema_version:1,tool_version:toolVersion,scope:s.scope,label:s.label,
      source_type:'provided_text_files',content_validation:'not_performed',file_count:files.length,source_bytes:files.reduce((sum,f)=>sum+f.bytes,0),files};
  }
  function downloadId(reply){return typeof reply?.download_url==='string'&&/^\/api\/delivery-package\/download\/[0-9a-f]{32}$/.test(reply.download_url)?reply.download_url.split('/').at(-1):null;}
  function checked(reply,expected){
    if(!exact(reply,['format','schema_version','archive_name','bytes','sha256','manifest','download_url'])||reply.format!=='zoe-delivery-package'||reply.schema_version!==1||reply.archive_name!=='zoe-delivery.zip'||
      !Number.isSafeInteger(reply.bytes)||reply.bytes<=expected.source_bytes||reply.bytes>maxArchive||typeof reply.sha256!=='string'||!/^[0-9a-f]{64}$/.test(reply.sha256)||!downloadId(reply))throw Error('交付封裝回覆不完整或版本不支援；沒有下載');
    checkedManifest(reply.manifest,expected);
    return structuredClone(reply);
  }
  function checkedManifest(m,expected){
    // Ignore object member order, retain exact entry order and every value.
    if(!exact(m,Object.keys(expected))||!Array.isArray(m.files)||!exact(m.files?.[0]||{},['name','bytes','sha256'])||m.files.length!==expected.files.length||
      Object.keys(expected).some(k=>k!=='files'&&m[k]!==expected[k])||m.files.some((f,i)=>!exact(f,['name','bytes','sha256'])||Object.keys(f).some(k=>f[k]!==expected.files[i][k])))throw Error('ZIP 清單與本輪完整成果不一致；沒有下載');
    return structuredClone(m);
  }
  async function inspect({selected,isCurrent,request,onDownload,discard=async()=>{},hash=digest}){
    const selection=selected();if(selection.dirty)throw Error('輸入有修改，請重新建立成果後下載');
    const payload=source(selection),key=fingerprint(payload);
    const current=()=>{try{const s=selected();return isCurrent()&&!s.dirty&&fingerprint(s)===key;}catch{return false;}};
    let reply=null,completed=false;
    try{
      const expected=await manifest(payload,hash);if(!current())return false;
      reply=await request(payload);if(!current())return false;
      const accepted=checked(reply,expected);if(!current())return false;
      await onDownload(accepted);completed=true;return true;
    }catch(error){if(current())throw error;return false;}
    finally{if(reply&&!completed&&downloadId(reply)){try{await discard(downloadId(reply));}catch{/* expiry and server-close retain ownership of cleanup */}}}
  }
  function describe(s){
    const count=Object.keys(s.files||{}).length;let error='';
    if(count)try{source(s);}catch(e){error=e.message;}
    return {count,canExport:count>0&&!s.busy&&!s.dirty&&!error,
      label:`下載本輪所有檔案 ZIP${count?'（'+count+'）':''}`,
      note:!count?'建立成果後可一次下載所有文字檔案。':s.busy?'正在處理，請稍候。':s.dirty?'這是上一份成果；重新建立後再下載所有檔案。':error||`包含本輪 ${count} 個文字檔及逐檔摘要清單；音檔、專案草稿與私人素材另存。`};
  }
  const api={version,maxSource,maxRequest,maxArchive,source,fingerprint,digest,manifest,checkedManifest,checked,downloadId,inspect,describe};
  if(typeof module==='object'&&module.exports)module.exports=api;else root.MusicDeliveryPackage=api;
})(typeof globalThis==='object'?globalThis:this);
