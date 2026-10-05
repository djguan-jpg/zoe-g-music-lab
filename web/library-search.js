// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
  const node=typeof module==='object'&&module.exports;
  const D=node?require('./library-revision.js'):root.MusicLibraryRevision;
  const M=node?require('./library-match.js'):root.MusicLibraryMatch;
  const T=node?require('../musiclab/assets/utc-timestamp.js'):root.MusicUtcTimestamp;
  const versions=node?require('../musiclab/assets/delivery-versions.js'):root.MusicDeliveryVersions;
  const exact=(v,keys)=>v&&typeof v==='object'&&!Array.isArray(v)&&Object.keys(v).length===keys.length&&keys.every(k=>Object.hasOwn(v,k));
  const sha=v=>typeof v==='string'&&v.length===64&&/^[0-9a-f]{64}$/.test(v);
  const integer=(v,min,max)=>Number.isSafeInteger(v)&&v>=min&&v<=max;
  const fail=()=>{throw Error('搜尋回覆或接續來源不一致；原清單、預覽與工作台保留，請重新搜尋');};
  const cursor=v=>exact(v,['start_index','search_sha256'])&&integer(v.start_index,1,1000)&&sha(v.search_sha256);
  const earlier=(a,b)=>T.compare(a.stored_at,b.stored_at)<0||a.stored_at===b.stored_at&&a.id<b.id;
  function checkedRequest(value){
    if(typeof value?.query==='string')M.checkedQuery(value.query);
    if(!exact(value,['query','limit','cursor'])||typeof value.query!=='string'||!integer([...value.query].length,1,200)||
       new TextEncoder().encode(value.query).length>800||!integer(value.limit,1,100)||value.cursor!==null&&!cursor(value.cursor))fail();
    return structuredClone(value);
  }
  function checkedResult(payload,wire,previous=null){
    const request=checkedRequest(payload);
    if(!exact(wire,['files','data','meta'])||!exact(wire.files,[])||!exact(wire.meta,['version','protocol_version','needs_review'])||
       wire.meta.version!==versions.current||wire.meta.protocol_version!==1||wire.meta.needs_review!==false)fail();
    const data=wire.data;
    if(!exact(data,['format','schema_version','query','search_sha256','record_count','match_count','start_index','entries','issues','next_cursor','status'])||
       data.format!=='zoe-draft-library-search'||data.schema_version!==1||data.query!==request.query||!sha(data.search_sha256)||
       data.status!=='metadata_only_checksum_verified_on_read'||!integer(data.record_count,0,1000)||!integer(data.match_count,0,data.record_count)||
       data.start_index!==(request.cursor?.start_index??0)||!Array.isArray(data.entries)||!Array.isArray(data.issues)||
       data.record_count+data.issues.length>1000||data.start_index>data.match_count||
       data.entries.length!==Math.min(request.limit,data.match_count-data.start_index))fail();
    let before=null;
    if(request.cursor){
      if(!previous||previous.query!==request.query||!cursor(previous.next_cursor)||
         previous.next_cursor.start_index!==request.cursor.start_index||previous.search_sha256!==request.cursor.search_sha256||
         data.search_sha256!==request.cursor.search_sha256||data.record_count!==previous.record_count||data.match_count!==previous.match_count||
         !Array.isArray(previous.issues)||data.issues.length!==previous.issues.length||
         data.issues.some((issue,i)=>issue?.id!==previous.issues[i]?.id||issue?.error!==previous.issues[i]?.error)||data.start_index>=data.match_count)fail();
      before=previous.entries.at(-1);if(!before)fail();
    }
    const seen=new Set(),entries=data.entries.map(entry=>{
      const checked=D.checkedMetadata(entry?.id,entry);
      if(seen.has(checked.id)||before&&!earlier(checked,before)||!M.hasMatch(checked,request.query))fail();
      seen.add(checked.id);before=checked;return checked;
    });
    let priorIssue='';
    const issues=data.issues.map(issue=>{
      if(!exact(issue,['id','error'])||typeof issue.id!=='string'||issue.id.length!==38||!/^draft-[0-9a-f]{32}$/.test(issue.id)||
         issue.error!=='unreadable_revision'||seen.has(issue.id)||issue.id<=priorIssue)fail();
      seen.add(issue.id);priorIssue=issue.id;return {...issue};
    });
    const next=data.start_index+entries.length;
    if(next<data.match_count){if(!cursor(data.next_cursor)||data.next_cursor.start_index!==next||data.next_cursor.search_sha256!==data.search_sha256)fail();}
    else if(data.next_cursor!==null)fail();
    return {...data,entries,issues,next_cursor:data.next_cursor?{...data.next_cursor}:null};
  }
  function createController({capture,request,checkReply=checkedResult,onReady,onState=()=>{},onError=()=>{}}){
    let token=0,pending=false,accepted=null,stale=false,seenIds=new Set();
    const status=()=>({pending,stale,canContinue:!pending&&!stale&&accepted?.query===capture()&&!!accepted.next_cursor});
    const publish=()=>onState(status());
    const cancel=()=>{token++;pending=false;publish();};
    return {
      status,
      invalidate(){token++;pending=false;stale=!!accepted;publish();},cancel,
      async search(more=false){
        const generation=++token,query=capture();let payload,previous;
        try{
          if(more&&(!accepted||stale||accepted.query!==query||!accepted.next_cursor))fail();
          previous=more?structuredClone(accepted):null;
          payload=checkedRequest({query,limit:20,cursor:previous?.next_cursor??null});
          pending=true;publish();
          const reply=await request(structuredClone(payload));
          if(generation!==token||capture()!==query)return false;
          const result=checkReply(payload,reply,previous);
          if(generation!==token||capture()!==query)return false;
          if(more&&result.entries.some(entry=>seenIds.has(entry.id)))fail();
          const nextIds=new Set(more?seenIds:[]);result.entries.forEach(entry=>nextIds.add(entry.id));
          onReady(structuredClone(result),more);accepted=structuredClone(result);seenIds=nextIds;stale=false;return true;
        }catch(error){if(generation===token&&capture()===query)onError(error);return false;}
        finally{if(generation===token){pending=false;publish();}}
      }
    };
  }
  const api=Object.freeze({checkedRequest,checkedResult,createController});if(node)module.exports=api;else root.MusicLibrarySearch=api;
})(typeof globalThis==='object'?globalThis:this);
