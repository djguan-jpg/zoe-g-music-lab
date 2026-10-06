// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
 const pageSize=20,maxDetails=200,keys=['detailCount','totalCount','revision','stale','busy','visible'];
 function checked(value){
  if(!value||typeof value!=='object'||Array.isArray(value)||Object.keys(value).length!==keys.length||!keys.every(k=>Object.hasOwn(value,k))||!Number.isSafeInteger(value.detailCount)||value.detailCount<0||value.detailCount>maxDetails||!Number.isSafeInteger(value.totalCount)||value.totalCount<value.detailCount||!Number.isSafeInteger(value.revision)||value.revision<0||['stale','busy','visible'].some(k=>typeof value[k]!=='boolean'))throw Error('待辦分頁來源無效；目前內容保留');
  return Object.fromEntries(keys.map(k=>[k,value[k]]));
 }
 function present(source,page=0){
  const s=checked(source);if(!Number.isSafeInteger(page)||page<0)throw Error('待辦頁碼無效');
  const pages=Math.ceil(s.detailCount/pageSize),selected=Math.min(page,Math.max(0,pages-1)),start=selected*pageSize,end=Math.min(start+pageSize,s.detailCount),available=s.visible&&!s.busy;
  const message=(s.detailCount?`明細 ${start+1}–${end}／${s.detailCount}`:'沒有待辦明細')+(s.totalCount>s.detailCount?`；全部 ${s.totalCount} 項，報告僅保留前 ${s.detailCount} 項。`:'。')+(s.stale?'目前顯示上一份檢查；重新檢查後才能定位。':'');
  return {...s,page:selected,pages,first:s.detailCount?start+1:0,last:end,indices:Array.from({length:end-start},(_,i)=>start+i),canPrevious:available&&selected>0,canNext:available&&selected+1<pages,canLocate:available&&!s.stale,message};
 }
 function createController({capture,onState=()=>{}}){
  let page=0;
  const read=()=>checked(capture()),same=(a,b)=>keys.every(k=>a[k]===b[k]);
  const view=()=>present(read(),page),publish=()=>{const v=view();page=v.page;onState({...v,indices:[...v.indices]});return v;};
  return {view,refresh:publish,reset(){page=0;return publish();},move(direction){if(direction!==-1&&direction!==1)return false;const before=read(),v=present(before,page);if(direction<0?!v.canPrevious:!v.canNext)return false;if(!same(before,read()))return false;page=v.page+direction;publish();return true;},
   reveal(index,revision){const before=read(),v=present(before,page);if(!v.canLocate||!Number.isSafeInteger(index)||index<0||index>=before.detailCount||revision!==before.revision||!same(before,read()))return false;const next=Math.floor(index/pageSize);if(next!==v.page){page=next;publish();}return true;},
   locate(index,revision){const before=read(),v=present(before,page);if(!v.canLocate||!Number.isSafeInteger(index)||!v.indices.includes(index)||revision!==before.revision||!same(before,read()))return null;return {index,revision:before.revision};}};
 }
 const api=Object.freeze({pageSize,maxDetails,checked,present,createController});if(typeof module==='object'&&module.exports)module.exports=api;else root.MusicIssuePage=api;
})(typeof globalThis==='object'?globalThis:this);
