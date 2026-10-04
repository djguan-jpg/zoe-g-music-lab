// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
  const node=typeof module==='object'&&module.exports,T=node?require('./lyric-time.js'):root.LyricTime,maximum=9007199254740991n;
  const clockPattern='([0-9]{2,}):([0-9]{2}):([0-9]{2})[,.]([0-9]{3})';
  const timing=new RegExp('^[ \\t]*'+clockPattern+'[ \\t]+-->[ \\t]+'+clockPattern+'[ \\t]*$');
  function clock(values){
    const [hours,minutes,seconds,fraction]=values,significant=hours.replace(/^0+/,'')||'0';
    if(significant.length>16)throw Error('SRT 時間超過毫秒整數精度範圍');
    if(Number(minutes)>=60||Number(seconds)>=60)throw Error('SRT 分鐘／秒數需小於 60');
    const total=BigInt(significant)*3600000n+BigInt(minutes)*60000n+BigInt(seconds)*1000n+BigInt(fraction);
    if(total>maximum)throw Error('SRT 時間超過毫秒整數精度範圍');return T.seconds(Number(total));
  }
  function parse(content){
    if(typeof content!=='string')throw Error('SRT 原文需為文字');
    const blocks=[];let block=[];
    for(const line of content.replace(/^\uFEFF/,'').split(/\r\n|\r|\n/)){
      if(!/[^ \t]/.test(line)){if(block.length){blocks.push(block);block=[];}}else block.push(line);
    }
    if(block.length)blocks.push(block);if(!blocks.length)throw Error('SRT 段落缺少時間或文字');
    return blocks.map(lines=>{
      const index=/^[ \t]*[0-9]+[ \t]*$/.exec(lines[0]);if(index&&index[0].length===lines[0].length)lines=lines.slice(1);
      if(lines.length<2)throw Error('SRT 段落缺少時間或文字');
      const m=timing.exec(lines[0]);if(!m||m[0].length!==lines[0].length)throw Error('SRT 時間格式錯誤');
      return {start:clock(m.slice(1,5)),end:clock(m.slice(5,9)),text:lines.slice(1).join(' / ')};
    });
  }
  const api={parse};if(node)module.exports=api;else root.MusicLyricsSrt=api;
})(typeof globalThis==='object'?globalThis:this);
