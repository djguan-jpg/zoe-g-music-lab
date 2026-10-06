// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
 const P=typeof module==='object'&&module.exports?require('../musiclab/assets/music-search.js'):root.MusicSongSearch;
 const F=typeof module==='object'&&module.exports?require('./editor-focus.js'):root.MusicEditorFocus;
 const R=typeof module==='object'&&module.exports?require('./search-request.js'):root.MusicSearchRequest;
 const same=(a,b)=>a&&b&&a.ids.length===b.ids.length&&a.ids.every((id,i)=>id===b.ids[i]&&P.fields.every(k=>a.sections[i][k]===b.sections[i][k]));
 function snapshot(value){
  if(!value||Object.keys(value).length!==5||!['ids','sections','visible','busy','resultRevision'].every(k=>Object.hasOwn(value,k))||!Array.isArray(value.sections)||!Number.isSafeInteger(value.resultRevision)||value.resultRevision<0)throw Error('歌曲段落搜尋來源或列ID無效');
  const checked=F.checkedSource('arrangement',{ids:value.ids,visible:value.visible,busy:value.busy}),length=value.sections.length;
  if(length!==checked.ids.length)throw Error('歌曲段落搜尋來源或列ID無效');
  const sections=[];
  for(let i=0;i<length;i++){
   if(!Object.hasOwn(value.sections,i))throw Error('歌曲段落搜尋來源缺列');
   const section=value.sections[i];
   if(!section||typeof section!=='object'||Array.isArray(section)||Object.keys(section).length!==P.fields.length||!P.fields.every(k=>Object.hasOwn(section,k)&&typeof section[k]==='string'))throw Error('歌曲段落搜尋只接受三個文字欄位');
   sections.push(Object.fromEntries(P.fields.map(k=>[k,section[k]])));
  }
  if(value.sections.length!==length)throw Error('歌曲段落搜尋讀取期間來源長度已改變');
  return {...checked,sections,resultRevision:value.resultRevision};
 }
 function createController({capture,request,focusTarget,version,onState=()=>{},onReport=()=>{},onError=()=>{},search=P.search,createAbort=()=>new root.AbortController()}){
  const requests=R.createLifecycle({createAbort});
  let generation=0,query='',pending=false,source=null,batch=null,history=[],message='輸入歌曲段落文字中的文字再尋找；每批最多20段。';
  const read=()=>snapshot(capture());
  const allowed=s=>s.visible&&!s.busy;
  function reset(note){generation++;pending=false;source=null;batch=null;history=[];message=note;requests.invalidate();}
  function view(){const s=read(),valid=batch&&same(source,s);return {query,pending,message,canCancel:pending&&allowed(s),available:allowed(s),matches:valid?structuredClone(batch.matches):[],totalRows:valid?batch.total_rows:null,totalMatched:valid?batch.total_matched_rows:null,startRow:valid?batch.start_row:null,canPrevious:!!valid&&history.length>0&&!pending&&allowed(s),canNext:!!valid&&batch.next_row!==null&&!pending&&allowed(s),canFocus:!!valid&&!pending&&allowed(s)};}
  const emit=()=>onState(view());
  function refresh(){const s=read();if(source&&!same(source,s))reset('歌曲段落文字或列順序已改變，請重新搜尋。');else if(pending&&!allowed(s))reset('操作狀態已改變，請重新搜尋。');emit();}
  async function execute(start,pin,newHistory){
   const before=read();if(!allowed(before)||pending)return false;
   let job;try{job=requests.begin();}catch(error){message=error.message;onError(error);emit();return false;}
   const token=++generation;pending=true;source=before;message='正在核對歌曲段落文字搜尋…';emit();
   const current=()=>{const now=read();return token===generation&&requests.current(job)&&allowed(now)&&same(before,now)&&now.resultRevision===before.resultRevision;};
   try{
    const payload={sections:before.sections.map(s=>({...s})),query,start_row:start,max_results:20,...(pin?{source_sha256:pin}:{})};
    const expected=await search(payload);if(!current())return false;
    payload.source_sha256=expected.source_sha256;
    if(new TextEncoder().encode(JSON.stringify(payload)).length>2*1024*1024)throw Error('完整搜尋請求超過2 MiB，請縮減歌曲段落文字來源。');
    const reply=await request(payload,{signal:job.signal});if(!current())return false;
    const checked=P.checkedReply(reply,expected,version);if(!current())return false;
    batch=checked;history=[...newHistory];source=before;message=`全部${checked.total_rows}段；命中${checked.total_matched_rows}段；此批${checked.matches.length}段。`+(checked.matches.length?'選擇結果可回到原文字欄。':'沒有符合的歌曲段落文字；可修改查詢再尋找。');
    onReport(structuredClone(checked),structuredClone(reply.files));return true;
   }catch(error){if(current()){batch=null;history=[];message=error.message;onError(error);}return false;}
   finally{if(token===generation){pending=false;if(!same(before,read()))reset('搜尋期間歌曲段落文字已修改，請重新搜尋。');else if(!current()&&message==='正在核對歌曲段落文字搜尋…')reset('搜尋來源或成果已改變，請重新搜尋。');requests.finish(job);emit();}else requests.finish(job);}
  }
  return {view,refresh,cancel(){if(!pending)return false;refresh();if(!pending)return false;generation++;pending=false;message='已取消搜尋等待；原文與上一份成果保留。';requests.invalidate();emit();return true;},clear(){reset('新的歌曲段落文字已載入，請重新搜尋。');emit();},setQuery(value){if(typeof value!=='string')throw Error('查詢需為文字');if(value!==query){reset('查詢已修改，請重新搜尋。');query=value;}emit();},
   find(){if(pending)return Promise.resolve(false);return execute(1,null,[]);},
   next(){refresh();if(!view().canNext)return Promise.resolve(false);if(history.length>=512)throw Error('搜尋分頁歷史已滿，請重新搜尋。');return execute(batch.next_row,batch.source_sha256,[...history,batch.start_row]);},
   previous(){refresh();if(!view().canPrevious)return Promise.resolve(false);return execute(history.at(-1),batch.source_sha256,history.slice(0,-1));},
   focus(index){try{refresh();if(!view().canFocus||!Number.isSafeInteger(index)||index<0||index>=batch.matches.length)return false;const hit=batch.matches[index],before=read(),target={id:source.ids[hit.row-1],index:hit.row-1,field:hit.field,text:hit.text};if(!same(source,before)||before.sections[target.index][target.field]!==target.text)return false;const again=read();if(!allowed(again)||!same(before,again))return false;return focusTarget(target)===true;}catch(error){onError(error);return false;}}
  };
 }
 const api=Object.freeze({snapshot,createController});if(typeof module==='object'&&module.exports)module.exports=api;else root.MusicSongSearchController=api;
})(typeof globalThis==='object'?globalThis:this);
