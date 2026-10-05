// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
 const P=typeof module==='object'&&module.exports?require('../musiclab/assets/storyboard-search.js'):root.MusicStoryboardSearch;
 const same=(a,b)=>a&&b&&a.ids.length===b.ids.length&&a.ids.every((id,i)=>id===b.ids[i]&&P.fields.every(k=>a.shots[i][k]===b.shots[i][k]));
 function snapshot(value){
  if(!value||Object.keys(value).length!==5||!['ids','shots','visible','busy','resultRevision'].every(k=>Object.hasOwn(value,k))||!Array.isArray(value.ids)||!Array.isArray(value.shots)||value.ids.length!==value.shots.length||value.ids.length>P.maxRows||new Set(value.ids).size!==value.ids.length||value.ids.some(id=>typeof id!=='string'||!id||id.length>64)||value.shots.some(t=>!t||typeof t!=='object'||Array.isArray(t)||Object.keys(t).length!==P.fields.length||!P.fields.every(k=>Object.hasOwn(t,k)&&typeof t[k]==='string'))||typeof value.visible!=='boolean'||typeof value.busy!=='boolean'||!Number.isSafeInteger(value.resultRevision)||value.resultRevision<0)throw Error('分鏡原文搜尋來源或列ID無效');
  return {...value,ids:[...value.ids],shots:value.shots.map(s=>Object.fromEntries(P.fields.map(k=>[k,s[k]])))};
 }
 function createController({capture,request,focusTarget,version,onState=()=>{},onReport=()=>{},onError=()=>{},search=P.search}){
  let generation=0,query='',pending=false,source=null,batch=null,history=[],message='輸入分鏡原文中的文字再尋找；每批最多20鏡。';
  const read=()=>snapshot(capture());
  const allowed=s=>s.visible&&!s.busy;
  function reset(note){generation++;pending=false;source=null;batch=null;history=[];message=note;}
  function view(){const s=read(),valid=batch&&same(source,s);return {query,pending,message,available:allowed(s),matches:valid?structuredClone(batch.matches):[],totalRows:valid?batch.total_rows:null,totalMatched:valid?batch.total_matched_rows:null,startRow:valid?batch.start_row:null,canPrevious:!!valid&&history.length>0&&!pending&&allowed(s),canNext:!!valid&&batch.next_row!==null&&!pending&&allowed(s),canFocus:!!valid&&!pending&&allowed(s)};}
  const emit=()=>onState(view());
  function refresh(){const s=read();if(source&&!same(source,s))reset('分鏡原文或列順序已改變，請重新搜尋。');else if(pending&&!allowed(s))reset('操作狀態已改變，請重新搜尋。');emit();}
  async function execute(start,pin,newHistory){
   const before=read();if(!allowed(before)||pending)return false;
   const token=++generation;pending=true;source=before;message='正在核對分鏡原文搜尋…';emit();
   const current=()=>{const now=read();return token===generation&&allowed(now)&&same(before,now)&&now.resultRevision===before.resultRevision;};
   try{
    const payload={shots:before.shots.map(s=>({...s})),query,start_row:start,max_results:20,...(pin?{source_sha256:pin}:{})};
    const expected=await search(payload);if(!current())return false;
    payload.source_sha256=expected.source_sha256;
    if(new TextEncoder().encode(JSON.stringify(payload)).length>2*1024*1024)throw Error('完整搜尋請求超過2 MiB，請縮減分鏡原文來源。');
    const reply=await request(payload);if(!current())return false;
    const checked=P.checkedReply(reply,expected,version);if(!current())return false;
    batch=checked;history=[...newHistory];source=before;message=`全部${checked.total_rows}鏡；命中${checked.total_matched_rows}鏡；此批${checked.matches.length}鏡。`+(checked.matches.length?'選擇結果可回到原文字欄。':'沒有符合的分鏡原文；可修改查詢再尋找。');
    onReport(structuredClone(checked),structuredClone(reply.files));return true;
   }catch(error){if(current()){batch=null;history=[];message=error.message;onError(error);}return false;}
   finally{if(token===generation){pending=false;if(!same(before,read()))reset('搜尋期間分鏡原文已修改，請重新搜尋。');else if(!current()&&message==='正在核對分鏡原文搜尋…')reset('搜尋來源或成果已改變，請重新搜尋。');emit();}}
  }
  return {view,refresh,clear(){reset('新的分鏡敘事內容已載入，請重新搜尋。');emit();},setQuery(value){if(typeof value!=='string')throw Error('查詢需為文字');if(value!==query){reset('查詢已修改，請重新搜尋。');query=value;}emit();},
   find(){if(pending)return Promise.resolve(false);return execute(1,null,[]);},
   next(){refresh();if(!view().canNext)return Promise.resolve(false);if(history.length>=512)throw Error('搜尋分頁歷史已滿，請重新搜尋。');return execute(batch.next_row,batch.source_sha256,[...history,batch.start_row]);},
   previous(){refresh();if(!view().canPrevious)return Promise.resolve(false);return execute(history.at(-1),batch.source_sha256,history.slice(0,-1));},
   focus(index){try{refresh();if(!view().canFocus||!Number.isSafeInteger(index)||index<0||index>=batch.matches.length)return false;const hit=batch.matches[index],before=read(),target={id:source.ids[hit.row-1],index:hit.row-1,field:hit.field,text:hit.text};if(!same(source,before)||before.shots[target.index][target.field]!==target.text)return false;const again=read();if(!allowed(again)||!same(before,again))return false;return focusTarget(target)===true;}catch(error){onError(error);return false;}}
  };
 }
 const api=Object.freeze({snapshot,createController});if(typeof module==='object'&&module.exports)module.exports=api;else root.MusicStoryboardSearchController=api;
})(typeof globalThis==='object'?globalThis:this);
