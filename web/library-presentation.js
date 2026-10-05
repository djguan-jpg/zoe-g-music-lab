// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
  const node=typeof module==='object'&&module.exports;
  const D=node?require('./library-revision.js'):root.MusicLibraryRevision;
  const M=node?require('./library-match.js'):root.MusicLibraryMatch;
  const exact=(v,keys)=>v&&typeof v==='object'&&!Array.isArray(v)&&Object.keys(v).length===keys.length&&keys.every(k=>Object.hasOwn(v,k));
  const count=v=>Number.isSafeInteger(v)&&v>=0&&v<=1000;
  function present(source){
    if(!exact(source,['enabled','mode','displayed_count','selected','search','issue_count','stale','pending'])||
       typeof source.enabled!=='boolean'||!['all','search'].includes(source.mode)||!count(source.displayed_count)||!count(source.issue_count)||
       typeof source.stale!=='boolean'||typeof source.pending!=='boolean')throw Error('保存清單顯示來源不完整；原內容保留');
    const {enabled,mode,displayed_count:shown,issue_count:issues,stale,pending}=source;
    let search=null;
    if(mode==='search'){
      search=source.search;
      if(!exact(search,['query','record_count','match_count','issue_count'])||!count(search.record_count)||!count(search.match_count)||
         !count(search.issue_count)||search.match_count>search.record_count||search.record_count+search.issue_count>1000||
         shown>search.match_count||issues!==search.issue_count)throw Error('搜尋顯示來源不完整；原內容保留');
      M.checkedQuery(search.query);
    }else if(source.search!==null)throw Error('全部版本不能混用搜尋來源；原內容保留');
    const selected=source.selected===null?null:D.checkedMetadata(source.selected?.id,source.selected);
    if(!!selected!==(shown>0))throw Error('選定版本與顯示清單不一致；原內容保留');
    const extra=issues?`；另有 ${issues} 個版本摘要無法讀取，原資料保留`:'';
    let selection,empty_kind=null;
    if(!enabled){selection='草稿庫未啟用；目前編修可下載為草稿。';empty_kind='disabled';}
    else if(selected)selection=`${selected.label} · ${selected.stored_at} · 歌曲：${selected.titles.music||'未命名'}／分鏡：${selected.titles.storyboard||'未命名'}／歌詞：${selected.titles.lyrics||'未命名'}`;
    else if(search&&search.record_count>0){selection='這次搜尋沒有符合的保存版本；可更改查詢，或重新整理查看全部版本'+extra+'。';empty_kind='no_matches';}
    else if(issues){selection='目前沒有可讀的保存版本'+extra+'；請核對原草稿庫或備份。';empty_kind='unreadable';}
    else{selection='草稿庫尚無保存版本；可為目前草稿命名並保存。';empty_kind='empty';}
    const normal=search?`「${search.query}」找到 ${search.match_count}／${search.record_count} 個可讀版本，已顯示 ${shown} 個${extra}。只搜尋名稱，創作內容與音檔仍需驗收。`:'目前顯示全部保存版本；可輸入名稱搜尋全庫。';
    const search_note=search&&pending?`正在搜尋；上一份「${search.query}」結果保留。`:search&&stale?`搜尋文字已變更；目前仍顯示「${search.query}」結果，請重新搜尋。`:normal;
    const matches=enabled&&search&&selected?M.matchedFields(selected,search.query):[];
    if(enabled&&search&&selected&&!matches.length)throw Error('選定版本不符合已接受的搜尋；原內容保留');
    return {selection_note:selection,library_note:enabled?`本機草稿庫已啟用；${search?'目前顯示名稱搜尋結果':'已讀取 '+shown+' 個版本'}${extra}。預覽時核對摘要；保存不含音檔、成果或刪除還原紀錄。`:'草稿庫未啟用；啟動服務時明確選定草稿庫才提供保存操作。',
      search_note,matches,match_heading:search?`${pending?'上一份':stale?'上一份':''}「${search.query}」搜尋的位置${pending?'（正在等待新結果）':stale?'（尚未重新搜尋）':''}`:'符合搜尋的位置',
      show_matches:matches.length>0,more_label:mode==='search'?'讀取更多搜尋結果':'讀取更早版本',empty_kind};
  }
  const api=Object.freeze({present});if(node)module.exports=api;else root.MusicLibraryPresentation=api;
})(typeof globalThis==='object'?globalThis:this);
