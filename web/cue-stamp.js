// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
  const time=typeof module!=='undefined'&&module.exports?require('../musiclab/assets/lyric-time.js'):root.LyricTime;
  function stamp(cue,action,position,duration){
    if(!cue||typeof cue.text!=='string'||!['start','end','move'].includes(action))throw Error('不支援的歌詞標記');
    const at=time.normalize(position,'播放位置',true),total=time.normalize(duration,'音檔時長',true);
    if(total<=0||at>total)throw Error('音檔位置或時長未就緒，請先載入音檔');
    const output={...cue};
    if(action==='start'){
      if(at>=total)throw Error('開始需早於音檔結束');
      if(String(cue.end).trim()&&time.normalize(cue.end,'歌詞結束',true)<=at)throw Error('開始不早於目前結束；請先調整結束，未替換時間');
      output.start=String(at);
    }else if(action==='end'){
      const start=time.normalize(cue.start,'請先記下開始',true);if(at<=start)throw Error('結束需晚於開始，未替換時間');output.end=String(at);
    }else{
      const start=time.normalize(cue.start,'歌詞開始',true),end=time.normalize(cue.end,'歌詞結束',true);
      if(end<=start)throw Error('整句移動需要有效的開始與結束');
      const next=time.seconds(time.milliseconds(at)+time.milliseconds(end)-time.milliseconds(start));
      if(next>total)throw Error('整句移動會超過音檔結束，未替換時間');output.start=String(at);output.end=String(next);
    }
    return output;
  }
  function playableCues(cues){return cues.map(cue=>{
    try{return {...cue,start:time.normalize(cue.start,'開始',true),end:time.normalize(cue.end,'結束',true)};}
    catch{return {...cue,start:NaN,end:NaN};}
  });}
  const api={stamp,playableCues};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.MusicCueStamp=api;
})(typeof window==='undefined'?{}:window);
