// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root) {
  function same(a,b) {
    return !!a&&!!b&&b.allowed&&a.key===b.key&&a.title===b.title&&a.text===b.text&&a.textcard===b.textcard&&
      Array.isArray(a.files)&&Array.isArray(b.files)&&a.files.length===b.files.length&&a.files.every((file,i)=>file===b.files[i]);
  }
  function create({capture,prepare,replace,accept,onView=()=>{},onError=()=>{}}) {
    let phase='idle',pending=false,token=0,proposal=null,disposed=false;
    const state=()=>({phase,pending,proposal:proposal?.candidate||null});
    const show=()=>onView(state());
    const fail=error=>{if(!disposed)onError(error);};
    async function preview() {
      if(disposed||pending)return false;
      const initial=capture();if(!initial.allowed){fail(Error('目前不能重新起稿'));return false;}
      const snapshot={...initial,files:[...initial.files]},epoch=++token;
      pending=true;phase='preparing';proposal=null;show();
      try {
        const candidate=await prepare(snapshot);
        if(disposed||epoch!==token)return false;
        if(!same(snapshot,capture()))throw Error('準備期間內容或素材已改變；請重新預覽');
        proposal={snapshot,candidate};phase='preview';show();return true;
      }catch(error){if(!disposed&&epoch===token){phase='idle';proposal=null;fail(error);}return false;}
      finally{pending=false;if(!disposed)show();}
    }
    async function apply() {
      if(disposed||pending||!proposal)return false;
      const selected=proposal;
      if(!same(selected.snapshot,capture())){cancel();fail(Error('預覽後內容或素材已改變；請重新預覽'));return false;}
      const epoch=++token;pending=true;phase='applying';proposal=null;show();
      const valid=()=>!disposed&&epoch===token&&capture().allowed;
      try {
        const receipt=await replace(selected.candidate,valid);
        if(!valid())return false;
        if(receipt===false||!await accept(selected.candidate,receipt,valid))throw Error('起稿回讀未通過；請核對目前工作台');
        if(!valid())return false;
        phase='idle';onView({...state(),accepted:true});return true;
      }catch(error){if(!disposed&&epoch===token){phase='idle';fail(error);}return false;}
      finally{pending=false;if(!disposed){phase='idle';show();}}
    }
    function cancel(){token++;proposal=null;phase='idle';if(!disposed)show();}
    function refresh(){if(proposal&&!same(proposal.snapshot,capture())){cancel();fail(Error('預覽後內容或素材已改變；請重新預覽'));}return state();}
    function dispose(){if(disposed)return;cancel();disposed=true;}
    return Object.freeze({preview,apply,cancel,refresh,dispose,state});
  }
  const api=Object.freeze({same,create});
  if(typeof module==='object'&&module.exports)module.exports=api;else root.MusicMVSeed=api;
})(typeof globalThis==='object'?globalThis:this);
