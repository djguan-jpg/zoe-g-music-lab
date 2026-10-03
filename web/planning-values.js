// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
  // Python str.strip / splitlines semantics; FEFF is intentionally not whitespace.
  const whitespace=/^[\u0009-\u000d\u001c-\u0020\u0085\u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000]+|[\u0009-\u000d\u001c-\u0020\u0085\u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000]+$/g;
  const digitZeros=[48,1632,1776,1984,2406,2534,2662,2790,2918,3046,3174,3302,3430,3558,3664,3792,3872,4160,4240,6112,6160,6470,6608,6784,6800,6992,7088,7232,7248,42528,43216,43264,43472,43504,43600,44016,65296,66720,68912,69734,69872,69942,70096,70384,70736,70864,71248,71360,71472,71904,72016,72784,73040,73120,92768,93008,120782,120792,120802,120812,120822,123200,123632,125264,130032];
  const strip=s=>s.replace(whitespace,'');
  const numericWhitespace=/^[\u0009-\u000d\u0020\u0085\u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000]+|[\u0009-\u000d\u0020\u0085\u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000]+$/g;
  const fail=()=>{throw Error('請填寫有限十進位數字');};
  function number(v){
    if(typeof v==='string'){
      v=Array.from(v.replace(numericWhitespace,''),c=>{const cp=c.codePointAt(0),zero=digitZeros.find(z=>cp>=z&&cp<z+10);return zero===undefined?c:String(cp-zero);}).join('');
      const digits='[0-9](?:_?[0-9])*',decimal=new RegExp('^[+-]?(?:'+digits+'(?:\\.(?:'+digits+')?)?|\\.'+digits+')(?:[eE][+-]?'+digits+')?$');
      if(!decimal.test(v))fail();v=Number(v.replaceAll('_',''));
    }
    if(typeof v!=='number'||!Number.isFinite(v))fail();return v;
  }
  const api={trim:strip,number};if(typeof module==='object'&&module.exports)module.exports=api;else root.MusicPlanningValues=api;
})(typeof globalThis==='object'?globalThis:this);
