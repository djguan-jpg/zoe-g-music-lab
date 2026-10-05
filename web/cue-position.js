// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
  const node=typeof module==='object'&&module.exports;
  const W=node?require('./wave-position.js'):root.MusicWavePosition,T=node?require('../musiclab/assets/lyric-time.js'):root.LyricTime;
  const exact=(v,keys)=>v&&typeof v==='object'&&!Array.isArray(v)&&Object.keys(v).length===keys.length&&keys.every(k=>Object.hasOwn(v,k));
  function checkedRow(row){
    if(!exact(row,['id','start','end','text'])||typeof row.id!=='string'||!row.id||row.id.length>64||
      ![row.start,row.end,row.text].every(v=>typeof v==='string')||row.start.length>4096||row.end.length>4096)throw Error('定位句首的來源不完整');
    return {...row};
  }
  function target(row,media){
    const value=checkedRow(row),view=W.present(media);if(!view.available)return null;
    const position=T.normalize(value.start,'歌詞開始',true);
    if(position>=view.maximum)throw Error('句首需早於音檔結束；原時間保留');
    return {id:value.id,position};
  }
  const sameMedia=(a,b)=>['source','current_source','duration'].every(k=>a[k]===b[k]);
  const sameRow=(a,b)=>['id','start','end','text'].every(k=>a[k]===b[k]);
  function createController({readRow,captureMedia,isAllowed,setPosition,onSeek=()=>{},onError=()=>{}}){
    let disposed=false;
    return {seek(id){
      if(disposed||isAllowed()!==true)return false;
      try{
        const row=checkedRow(readRow(id));if(row.id!==id)throw Error('定位句首的原列已變更');
        const media={...captureMedia()},proposal=target(row,media);if(proposal===null)throw Error('先載入可定位音檔，再定位句首');
        const current=checkedRow(readRow(id)),now={...captureMedia()};
        if(isAllowed()!==true||!W.present(now).available||!sameRow(row,current)||!sameMedia(media,now))throw Error('句子或音檔已變更；請依目前資料重新定位');
        if(setPosition(proposal.position,{row:{...current},media:{...now}})!==true)throw Error('音檔位置尚未確認；原歌詞保留');
        const actual={...captureMedia()};
        if(!W.present(actual).available||!sameMedia(now,actual)||Math.abs(actual.position-proposal.position)>.001)throw Error('音檔位置尚未確認；原歌詞保留');
        onSeek({...proposal});return true;
      }catch(error){onError(error);return false;}
    },dispose(){disposed=true;}};
  }
  const api=Object.freeze({target,createController});if(node)module.exports=api;else root.MusicCuePosition=api;
})(typeof globalThis==='object'?globalThis:this);
