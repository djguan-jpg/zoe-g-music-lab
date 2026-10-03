// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
  const maximum=9007199254740991n;
  function number(value,label){
    if(typeof value==='boolean'||value===null||!['number','string'].includes(typeof value)||
        typeof value==='string'&&!value.trim())throw Error(label+' 必須是數字');
    if(typeof value==='string'&&!/^[+-]?(?:[0-9]+(?:\.[0-9]*)?|\.[0-9]+)(?:e[+-]?[0-9]+)?$/i.test(value.trim()))throw Error(label+' 必須是十進位數字');
    const result=Number(value);if(!Number.isFinite(result))throw Error(label+' 必須是有限數字');return result;
  }
  function milliseconds(value,label='時間'){
    const numeric=number(value,label),parts=String(numeric).match(/^(-?)(\d+)(?:\.(\d+))?(?:e([+-]?\d+))?$/i);
    const digits=BigInt(parts[2]+(parts[3]||'')),power=Number(parts[4]||0)+3-(parts[3]||'').length;
    let result;
    if(power>=0)result=digits*10n**BigInt(power);
    else{const divisor=10n**BigInt(-power);result=(digits+divisor/2n)/divisor;}
    if(result>maximum)throw Error(label+' 超過毫秒整數精度範圍');
    return Number(parts[1]? -result:result);
  }
  function seconds(ms){
    if(!Number.isSafeInteger(ms))throw Error('時間超過毫秒整數精度範圍');
    const result=ms/1000;if(milliseconds(result)!==ms)throw Error('時間無法以秒數保留毫秒精度');return result;
  }
  function normalize(value,label='時間',nonnegative=false){
    const numeric=number(value,label);if(nonnegative&&numeric<0)throw Error(label+' 不能有負時間');
    return seconds(milliseconds(numeric,label));
  }
  function normalizeCues(source,duration=null){
    if(!Array.isArray(source)||!source.length)throw Error('沒有可匯出的逐句歌詞');
    const cues=source.map(c=>{
      if(!c||typeof c.text!=='string'||/[\r\n]/.test(c.text))throw Error('每句需為單行歌詞');
      const start=normalize(c.start,'歌詞開始時間',true),end=c.end==null?null:normalize(c.end,'歌詞結束時間',true);
      if(end!==null&&end<=start)throw Error('結束時間必須晚於開始');return {start,end,text:c.text};
    }).sort((a,b)=>a.start-b.start);
    for(let i=1;i<cues.length;i++){
      if(cues[i].start<=cues[i-1].start)throw Error('逐句歌詞的開始時間不可重複');
      if(cues[i-1].end!==null&&cues[i-1].end>cues[i].start)throw Error('逐句歌詞的結束與下一句重疊');
    }
    const inferred=duration==null,tail=cues.at(-1),timing={duration_source:!inferred?'provided':tail.end!==null?'last_cue_end':'last_start_plus_three',
      inferred_end_count:cues.filter(c=>c.end===null).length,tail_end_inferred:tail.end===null};
    duration=normalize(!inferred?duration:tail.end??seconds(milliseconds(tail.start)+3000),'歌曲時長',true);
    if(duration<=tail.start)throw Error('歌曲時長必須晚於最後一句開始');
    cues.forEach((c,i)=>{c.end=c.end??(cues[i+1]?.start??duration);if(c.end>duration)throw Error('歌詞結束超過歌曲時長');});
    return {cues,duration,duration_estimated:inferred,timing};
  }
  function timecode(value,srt=false){
    if(number(value,'時間')<0)throw Error('時間不能有負時間');
    const ms=milliseconds(value),minutes=Math.floor(ms/60000),secondsPart=Math.floor(ms%60000/1000),fraction=ms%1000;
    if(ms<0)throw Error('時間不能有負時間');
    const pad=(n,width=2)=>String(n).padStart(width,'0');
    return srt?`${pad(Math.floor(minutes/60))}:${pad(minutes%60)}:${pad(secondsPart)},${pad(fraction,3)}`:
      `${pad(minutes)}:${pad(secondsPart)}.${pad(fraction,3)}`;
  }
  function notice(data){
    if(!data.duration_estimated)return '總時長已提供；目前表格的時間仍需實聽核對。';
    return data.timing?.tail_end_inferred?'總時長尚未確認；尾句結束是推估，請選音檔或手動確認。':
      '總時長尚未確認；保留目前結束時間，請實聽核對。';
  }
  const api={milliseconds,seconds,normalize,normalizeCues,timecode,notice};
  if(typeof module==='object'&&module.exports)module.exports=api;else root.LyricTime=api;
})(typeof globalThis==='object'?globalThis:this);
