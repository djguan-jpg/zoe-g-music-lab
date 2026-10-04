// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
  const node=typeof module==='object'&&module.exports;
  const T=node?require('./lyric-time.js'):root.LyricTime,maximum=9007199254740991n;
  const timestampSource='\\[([0-9]+):([0-9]{2})(?:\\.([0-9]{1,3}))?\\]',leadingTimestamp=new RegExp('^'+timestampSource);
  const startsWithTimestamp=text=>typeof text==='string'&&leadingTimestamp.test(text);
  function integer(value){
    const negative=value.startsWith('-'),digits=value.replace(/^[+-]/,'').replace(/^0+/,'')||'0';
    if(digits.length>16)throw Error('LRC 時間超過毫秒整數精度範圍');
    const result=BigInt(digits)*(negative?-1n:1n);
    if(result>maximum||result< -maximum)throw Error('LRC 時間超過毫秒整數精度範圍');return result;
  }
  function parse(content){
    if(typeof content!=='string')throw Error('LRC 原文需為文字');
    const lines=content.replace(/^\uFEFF/,'').split(/\r\n|\r|\n/);let offset=0n;const cues=[];
    for(const line of lines){const m=/^[ \t]*\[offset:([+-]?[0-9]+)\][ \t]*$/i.exec(line);if(m)offset=integer(m[1]);}
    const tag=new RegExp(timestampSource,'y');
    for(const line of lines){
      let position=/^[ \t]*/.exec(line)[0].length;const starts=[];
      while(true){
        tag.lastIndex=position;const m=tag.exec(line);if(!m)break;
        if(Number(m[2])>=60)throw Error('LRC 秒數需小於 60');
        const total=integer(m[1])*60000n+BigInt(m[2])*1000n+BigInt((m[3]||'0').padEnd(3,'0'))+offset;
        if(total<0n)throw Error('LRC 開始時間不能有負時間');
        if(total>maximum)throw Error('LRC 時間超過毫秒整數精度範圍');
        starts.push(T.seconds(Number(total)));position=tag.lastIndex;
      }
      if(!starts.length){if(/^\[[0-9]+:/.test(line.slice(position)))throw Error('LRC 含無法解析的時間標籤');continue;}
      for(const start of starts)cues.push({start,text:line.slice(position)});
    }
    return cues;
  }
  const api={parse,startsWithTimestamp};if(node)module.exports=api;else root.MusicLyricsLrc=api;
})(typeof globalThis==='object'?globalThis:this);
