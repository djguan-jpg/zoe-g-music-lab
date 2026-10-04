// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
  const json=typeof module==='object'&&module.exports?require('../musiclab/assets/json-document.js'):root.MusicJsonDocument;
  const drafts=typeof module==='object'&&module.exports?require('./audio-acceptance.js'):root.MusicAudioAcceptance;
  const versions=typeof module==='object'&&module.exports?require('../musiclab/assets/delivery-versions.js'):root.MusicDeliveryVersions;
  const maxTextBytes=8*1024*1024;
  const fields=['tool','version','file','sha256','source_evidence','profile','acceptance','sample_rate','bit_depth','channels','frames',
    'duration_seconds','per_channel','checks','warnings','quiet_regions','stereo_correlation','loudness','status','limitations'];
  const limitations=['PCM WAV only','RMS is not LUFS','sample peak is not true peak','full-scale samples indicate possible clipping; listening is required'];
  const exact=(v,keys)=>v!==null&&typeof v==='object'&&!Array.isArray(v)&&Object.keys(v).length===keys.length&&keys.every(k=>Object.hasOwn(v,k));
  const same=(a,b)=>typeof a===typeof b&&(a===null||typeof a!=='object'?a===b:Array.isArray(a)?Array.isArray(b)&&a.length===b.length&&a.every((v,i)=>same(v,b[i])):b!==null&&!Array.isArray(b)&&Object.keys(a).length===Object.keys(b).length&&Object.keys(a).every(k=>Object.hasOwn(b,k)&&same(a[k],b[k])));
  function displayName(name){
    json.assertUnicode(name,'選定音檔名稱');
    return Array.from(name.replaceAll('\\','/').replace(/\/+$/,'').split('/').filter(p=>p!=='.').at(-1)||'selected.wav').slice(0,200).join('');
  }
  function checked(result,{file,profile,document=null,acceptance,sha256}){
    const fail=()=>{throw Error('音檔回覆版本、來源或交付檔案不一致，沒有替換目前結果；請重新分析原音檔');};
    const names=['report.json','report.md',...(document?['audio-acceptance-draft.json']:[])];
    if(!exact(result,['files','data','meta'])||!exact(result.meta,['version','protocol_version','needs_review'])||
      result.meta.protocol_version!==1||result.meta.version!==versions.current||!exact(result.files,names)||
      !exact(result.data,[...fields,...(document?['acceptance_draft']:[])]))fail();
    const data=result.data;
    if(data.version!==versions.current||data.tool!=='ZOE Audio Delivery'||typeof sha256!=='string'||!/^[a-f0-9]{64}$/.test(sha256)||
      data.sha256!==sha256||data.file!==displayName(file.name)||data.source_evidence?.bytes!==file.size||data.profile!==profile||
      !same(data.acceptance,acceptance)||!Array.isArray(data.warnings)||result.meta.needs_review!==(data.warnings.length>0)||
      !same(data.limitations,limitations))fail();
    for(const name of names){
      const text=result.files[name];json.assertUnicode(text,name);
      if(!text.length||new TextEncoder().encode(text).length>(name==='audio-acceptance-draft.json'?drafts.maxBytes:maxTextBytes))fail();
    }
    if(!same(json.parse(result.files['report.json'],{maxBytes:maxTextBytes,label:'音檔報告'}),data))fail();
    if(document){
      const key=drafts.fingerprint(document),echo=drafts.validate(data.acceptance_draft);
      const source=drafts.validate(json.parse(result.files['audio-acceptance-draft.json'],{maxBytes:drafts.maxBytes,label:'接受條件回覆'}));
      if(drafts.fingerprint(echo)!==key||drafts.fingerprint(source)!==key)fail();
    }
    return data;
  }
  const api=Object.freeze({checked,displayName,maxTextBytes});
  if(typeof module==='object'&&module.exports)module.exports=api;else root.MusicAudioResult=api;
})(typeof globalThis==='object'?globalThis:this);
