// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
 const node=typeof module==='object'&&module.exports;
 const P=node?require('./lyrics-package.js'):root.MusicLyricsPackage,T=node?require('./lyric-time.js'):root.LyricTime;
 const formats=Object.freeze(['lrc','srt','json']);
 function select(source,format){
  if(!formats.includes(format))throw Error('歌詞下載格式不支援；請選擇 LRC、SRT 或 JSON');
  const data=P.validate(source);let content;
  if(format==='lrc')content=data.cues.map(c=>`[${T.timecode(c.start,false)}]${c.text}`).join('\n')+'\n';
  else if(format==='srt')content=data.cues.map((c,i)=>`${i+1}\n${T.timecode(c.start,true)} --> ${T.timecode(c.end,true)}\n${c.text}`).join('\n\n')+'\n';
  else content=JSON.stringify(data,null,2);
  return {name:'lyrics.'+format,content};
 }
 const api={formats,select};
 if(node)module.exports=api;else root.MusicLyricsDownload=api;
})(typeof globalThis==='object'?globalThis:this);
