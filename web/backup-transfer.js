// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
  function createBackupController({request,hashFile,checkPlan,checkRestore,maximum=()=>32*1024*1024,onPreview,onRestored,onError,onState}){
    if(typeof hashFile!=='function'||typeof checkPlan!=='function'||typeof checkRestore!=='function')throw Error('備份來源與回覆核對未設定');
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
          const source=structuredClone(await hashFile(file));
          if(current!==token)return false;
          const result=await request('inspect',file);
          if(current!==token)return false;
          const plan=checkPlan(result,source);
          pending={file,source,plan:structuredClone(plan)};onPreview(structuredClone(plan),file.name);return true;
        }catch(error){if(current===token)onError(error,{retryable:false});return false;}
        finally{if(current===token){reading=false;state();}}
      },
      async restore(){
        if(reading||restoring||!pending||!pending.plan.can_restore)return false;
        const job=pending;restoring=true;state();
        try{
          const reply=await request('restore',job.file,job.plan.backup_sha256);
          const result=checkRestore(reply,job.source,job.plan);
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
