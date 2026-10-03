// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
  function createBackupController({request,maximum=()=>32*1024*1024,onPreview,onRestored,onError,onState}){
    let token=0,pending=null,reading=false,restoring=false;
    const state=()=>onState({reading,restoring,ready:!!pending,canRestore:!!pending?.plan.can_restore});
    return {
      async inspect(file){
        if(restoring){onError(Error('恢復尚未完成，請稍候'),{retryable:false});return false;}
        const current=++token;pending=null;reading=false;state();
        if(!file||typeof file.name!=='string'||!file.name.toLowerCase().endsWith('.zip')||
            !Number.isInteger(file.size)||file.size<=0||file.size>maximum()){
          onError(Error('請選擇 1 byte 至 32 MiB 的草稿庫備份 ZIP'),{retryable:false});return false;
        }
        reading=true;state();
        try{
          const plan=await request('inspect',file);
          if(current!==token)return false;
          if(!plan||plan.backup_schema_version!==1||!Array.isArray(plan.entries)||!Array.isArray(plan.conflicts)||
              typeof plan.can_restore!=='boolean'||! /^[0-9a-f]{64}$/.test(plan.backup_sha256))throw Error('備份預覽回應不完整');
          pending={file,plan:structuredClone(plan)};onPreview(structuredClone(plan),file.name);return true;
        }catch(error){if(current===token)onError(error,{retryable:false});return false;}
        finally{if(current===token){reading=false;state();}}
      },
      async restore(){
        if(reading||restoring||!pending||!pending.plan.can_restore)return false;
        const job=pending;restoring=true;state();
        try{
          const result=await request('restore',job.file,job.plan.backup_sha256);
          pending=null;onRestored(result);return true;
        }catch(error){
          if(error.status>=400&&error.status<500)pending=null;
          onError(error,{retryable:pending!==null});return false;
        }finally{restoring=false;state();}
      },
      cancel(){if(restoring)return false;token++;pending=null;reading=false;state();return true;}
    };
  }
  const api={createBackupController};
  if(typeof module==='object'&&module.exports)module.exports=api;else root.MusicBackup=api;
})(typeof globalThis==='object'?globalThis:this);
