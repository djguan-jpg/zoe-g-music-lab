// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
  const node=typeof module==='object'&&module.exports;
  const J=node?require('../musiclab/assets/json-document.js'):root.MusicJsonDocument;
  const V=node?require('./planning-values.js'):root.MusicPlanningValues;
  const T=node?require('../musiclab/assets/utc-timestamp.js'):root.MusicUtcTimestamp;
  const versions=node?require('../musiclab/assets/delivery-versions.js'):root.MusicDeliveryVersions;
  const maxBytes=32*1024*1024,maxEntries=1000;
  const exact=(v,keys)=>v&&typeof v==='object'&&!Array.isArray(v)&&Object.keys(v).length===keys.length&&keys.every(k=>Object.hasOwn(v,k));
  const id=value=>typeof value==='string'&&/^draft-[0-9a-f]{32}$/.test(value);
  const count=value=>Number.isSafeInteger(value)&&value>=0&&value<=maxEntries;
  const hash=value=>typeof value==='string'&&/^[0-9a-f]{64}$/.test(value);
  const fail=()=>{throw Error('備份回覆的版本、來源或恢復計數不一致；原備份與目前工作台保留');};
  function proof(source){
    if(!exact(source,['bytes','sha256'])||!Number.isSafeInteger(source.bytes)||source.bytes<1||source.bytes>maxBytes||!hash(source.sha256))fail();
  }
  function envelope(result){
    if(!exact(result,['files','data','meta'])||!exact(result.files,[])||!exact(result.meta,['version','protocol_version','needs_review'])||
      result.meta.version!==versions.current||result.meta.protocol_version!==1||result.meta.needs_review!==true)fail();
    return result.data;
  }
  function plan(data,source){
    proof(source);
    if(!exact(data,['backup_sha256','backup_schema_version','bytes','entry_count','selection','new_count','reused_count','conflicts','capacity_ok','can_restore','new_ids','entries','status'])||
      data.backup_schema_version!==1||data.backup_sha256!==source.sha256||data.bytes!==source.bytes||data.status!=='backup_validated_not_restored'||
      !['all','selected'].includes(data.selection)||!count(data.entry_count)||!count(data.new_count)||!count(data.reused_count)||
      !Array.isArray(data.entries)||data.entries.length!==data.entry_count||!Array.isArray(data.new_ids)||data.new_ids.length!==data.new_count||
      !Array.isArray(data.conflicts)||data.conflicts.length>maxEntries||typeof data.capacity_ok!=='boolean'||typeof data.can_restore!=='boolean')fail();
    const all=new Set();
    for(const entry of data.entries){
      if(!exact(entry,['id','label','stored_at'])||!id(entry.id)||all.has(entry.id)||typeof entry.label!=='string'||!V.trim(entry.label)||Array.from(entry.label).length>200)fail();
      T.checked(entry.stored_at);
      J.assertUnicode(entry.label,'備份版本名稱');all.add(entry.id);
    }
    const fresh=new Set(),conflicts=new Set();
    for(const value of data.new_ids){if(!id(value)||!all.has(value)||fresh.has(value))fail();fresh.add(value);}
    for(const value of data.conflicts){if(!id(value)||!all.has(value)||fresh.has(value)||conflicts.has(value))fail();conflicts.add(value);}
    if(data.new_count+data.reused_count+data.conflicts.length!==data.entry_count||data.can_restore!==(data.capacity_ok&&!data.conflicts.length))fail();
    return structuredClone(data);
  }
  function checkedInspect(result,source){return plan(envelope(result),source);}
  function checkedRestore(result,source,reviewed){
    const selected=plan(reviewed,source),data=envelope(result);
    if(!selected.can_restore||!exact(data,['backup_sha256','added_count','reused_count','entry_count','status'])||data.backup_sha256!==source.sha256||
      data.status!=='restored_drafts_need_creative_validation'||data.entry_count!==selected.entry_count||!count(data.added_count)||!count(data.reused_count)||
      data.added_count+data.reused_count!==data.entry_count)fail();
    return structuredClone(data);
  }
  const api=Object.freeze({checkedInspect,checkedRestore,maxBytes,maxEntries});if(node)module.exports=api;else root.MusicBackupResult=api;
})(typeof globalThis==='object'?globalThis:this);
