// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
  function createController({capture,source,inspect,onState=()=>{}}){
    let report=null,before=null,stale=false,revision=0;
    const publish=()=>{const view={report:report?structuredClone(report):null,stale,revision};onState(structuredClone(view));return view;};
    const current=()=>{try{return before===JSON.stringify(source(capture()));}catch{return false;}};
    return {
      check(){const selected=source(capture()),next=inspect(structuredClone(selected)),key=JSON.stringify(selected);report=next;before=key;stale=false;revision++;return publish();},
      refresh(){if(report)stale=!current();return publish();},
      locate(index,expectedRevision){if(!report||expectedRevision!==undefined&&expectedRevision!==revision||!Number.isInteger(index)||index<0||index>=report.issues.length)return null;
        if(!current()){stale=true;publish();return null;}stale=false;return structuredClone(report.issues[index]);},
      clear(){report=null;before=null;stale=false;revision++;return publish();}
    };
  }
  const api={createController};if(typeof module==='object'&&module.exports)module.exports=api;else root.MusicReadinessState=api;
})(typeof globalThis==='object'?globalThis:this);
