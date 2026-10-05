// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
  const node=typeof module==='object'&&module.exports;
  const D=node?require('./library-revision.js'):root.MusicLibraryRevision;
  const J=node?require('../musiclab/assets/json-document.js'):root.MusicJsonDocument;
  const fields=[['label','保存名稱'],['titles.music','歌曲名'],['titles.storyboard','分鏡名'],['titles.lyrics','歌詞名']];
  function checkedQuery(query){
    J.assertUnicode(query);
    if([...query].length<1||[...query].length>200||new TextEncoder().encode(query).length>800)throw Error('搜尋文字需為 1–200 字元、最多 800 UTF-8 bytes；保留大小寫與空白');
    return query;
  }
  function checkedFields(record){
    const checked=D.checkedMetadata(record?.id,record);
    return fields.map(([field,name])=>({field,name,text:field==='label'?checked.label:checked.titles[field.split('.')[1]]}));
  }
  function hasMatch(record,query){checkedQuery(query);return checkedFields(record).some(v=>v.text.includes(query));}
  function matchedFields(record,query){
    checkedQuery(query);const result=[];
    for(const value of checkedFields(record)){
      const spans=[];let start=0,position;
      while((position=value.text.indexOf(query,start))>=0){
        start=position+query.length;spans.push([[...value.text.slice(0,position)].length,[...value.text.slice(0,start)].length]);
      }
      if(spans.length)result.push({...value,spans});
    }
    return result;
  }
  const api=Object.freeze({checkedQuery,hasMatch,matchedFields});if(node)module.exports=api;else root.MusicLibraryMatch=api;
})(typeof globalThis==='object'?globalThis:this);
