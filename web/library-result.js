// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
  const node=typeof module==='object'&&module.exports;
  const D=node?require('./library-revision.js'):root.MusicLibraryRevision;
  const T=node?require('../musiclab/assets/utc-timestamp.js'):root.MusicUtcTimestamp;
  const versions=node?require('../musiclab/assets/delivery-versions.js'):root.MusicDeliveryVersions;
  const maxEntries=1000,maxPage=100;
  const exact=(v,keys)=>v&&typeof v==='object'&&!Array.isArray(v)&&Object.keys(v).length===keys.length&&keys.every(k=>Object.hasOwn(v,k));
  const identifier=id=>typeof id==='string'&&id.length===38&&/^draft-[0-9a-f]{32}$/.test(id);
  const fail=()=>{throw Error('保存版本回覆、清單或分頁來源不一致；目前清單、預覽與工作台保留，請重新整理或重試');};
  function checkedEnvelope(action,result){
    if(!['save','list','read'].includes(action)||!exact(result,['files','data','meta'])||!exact(result.files,[])||
      !exact(result.meta,['version','protocol_version','needs_review'])||result.meta.version!==versions.current||
      result.meta.protocol_version!==1||result.meta.needs_review!==(action!=='list'))fail();
    return result.data;
  }
  // The producer sorts original UTC strings, then IDs; do not substitute Date ordering.
  const earlier=(a,b)=>T.compare(a.stored_at,b.stored_at)<0||a.stored_at===b.stored_at&&a.id<b.id;
  function checkedList(payload,result,cursorEntry=null){
    if(!exact(payload,['limit','cursor'])||!Number.isSafeInteger(payload.limit)||payload.limit<1||payload.limit>maxPage||
      payload.cursor!==null&&!identifier(payload.cursor)||!exact(result,['entries','next_cursor','issues','status'])||
      result.status!=='metadata_only_checksum_verified_on_read'||!Array.isArray(result.entries)||result.entries.length>payload.limit||
      !Array.isArray(result.issues)||result.issues.length+result.entries.length>maxEntries)fail();
    const after=payload.cursor===null?null:D.checkedMetadata(payload.cursor,cursorEntry),seen=new Set();
    let previous=after;
    const entries=result.entries.map(entry=>{
      const checked=D.checkedMetadata(entry?.id,entry);
      if(seen.has(checked.id)||previous&&!earlier(checked,previous))fail();
      seen.add(checked.id);previous=checked;return checked;
    });
    if(result.next_cursor!==null&&(!entries.length||entries.length!==payload.limit||result.next_cursor!==entries.at(-1).id))fail();
    const issues=result.issues.map(issue=>{
      if(!exact(issue,['id','error'])||!identifier(issue.id)||issue.error!=='unreadable_revision'||seen.has(issue.id))fail();
      seen.add(issue.id);return {...issue};
    });
    return {entries,next_cursor:result.next_cursor,issues,status:result.status};
  }
  const api=Object.freeze({checkedEnvelope,checkedList,maxEntries,maxPage});if(node)module.exports=api;else root.MusicLibraryResult=api;
})(typeof globalThis==='object'?globalThis:this);
