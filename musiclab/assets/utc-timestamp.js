// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
 const node=typeof module==='object'&&module.exports;
 const J=node?require('./json-document.js'):root.MusicJsonDocument;
 const pattern=/^([0-9]{4})-([0-9]{2})-([0-9]{2})[\s\S]([0-9]{2})(?::([0-9]{2})(?::([0-9]{2})(?:\.[0-9]{3}(?:[0-9]{3})?)?)?)?(?:Z|[+-]00:00(?::00(?:\.000(?:000)?)?)?)$/u;
 const fail=()=>{throw Error('保存或備份時間需為有效 UTC 日期；原時間字串保留');};
 function checked(value){
  if(typeof value!=='string'||[...value].length>128)fail();J.assertUnicode(value,'保存或備份時間');
  const m=pattern.exec(value);if(!m||m[0]!==value)fail();
  const [year,month,day,hour,minute,second]=m.slice(1).map(v=>v===undefined?0:Number(v));
  const leap=year%4===0&&(year%100!==0||year%400===0),days=[31,leap?29:28,31,30,31,30,31,31,30,31,30,31];
  if(year<1||year>9999||month<1||month>12||day<1||day>days[month-1]||hour>23||minute>59||second>59)fail();
  return value;
 }
 const api=Object.freeze({checked});if(node)module.exports=api;else root.MusicUtcTimestamp=api;
})(typeof globalThis==='object'?globalThis:this);
