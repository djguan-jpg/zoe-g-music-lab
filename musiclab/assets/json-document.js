// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
  const maxBytes=2*1024*1024,maxDepth=64;
  const unicode=(text,label='文字')=>{if(typeof text!=='string')throw Error(`${label} 需為文字`);for(const char of text){const code=char.codePointAt(0);if(code>=0xd800&&code<=0xdfff)throw Error(`${label} 含無效 Unicode 文字`);}};
  function parse(content,{maxBytes:limit=maxBytes,label='JSON',allowBOM=false}={}){
    if(typeof content!=='string')throw Error(`${label} 需為 UTF-8 JSON 文字`);
    unicode(content,label);
    if(new TextEncoder().encode(content).length>limit)throw Error(`${label} 超過讀取上限`);
    if(allowBOM&&content.startsWith('\ufeff'))content=content.slice(1);
    let position=0;
    const space=()=>{while(/[ \t\r\n]/.test(content[position]||'x'))position++;};
    const syntax=()=>{throw Error(`${label} 格式錯誤；原檔與目前內容保留`);};
    function string(){
      const start=position++;
      while(position<content.length){
        const char=content[position++];if(char==='\\'){position++;continue;}
        if(char==='"'){let value;try{value=JSON.parse(content.slice(start,position));}catch{syntax();}unicode(value,label);return value;}
      }syntax();
    }
    function value(depth){
      if(depth>maxDepth)throw Error(`${label} 結構過深，最多64層`);
      space();const char=content[position];
      if(char==='{'||char==='['){
        const object=char==='{',end=object?'}':']',seen=new Set();position++;space();
        if(content[position]===end){position++;return;}
        while(position<content.length){
          if(object){if(content[position]!=='"')syntax();const key=string();if(seen.has(key))throw Error(`${label} 含重複欄位`);seen.add(key);space();if(content[position++]!==':')syntax();}
          value(depth+1);space();if(content[position]===end){position++;return;}if(content[position++]!==',')syntax();space();
        }syntax();
      }
      if(char==='"'){string();return;}
      const start=position;while(position<content.length&&!/[ \t\r\n,\]}]/.test(content[position]))position++;
      if(position===start)syntax();let scalar;
      try{scalar=JSON.parse(content.slice(start,position));}catch{syntax();}
      if(typeof scalar==='number'&&!Number.isFinite(scalar))throw Error(`${label} 不接受非有限數字`);
    }
    value(0);space();if(position!==content.length)syntax();return JSON.parse(content);
  }
  function decode(raw,{size,maxBytes:limit=maxBytes,label='JSON',allowBOM=true}={}){
    if(!raw||!Number.isSafeInteger(raw.byteLength)||raw.byteLength!==size)throw Error('讀取大小與選檔資訊不同；目前內容保留，請重新選檔');
    if(raw.byteLength<1||raw.byteLength>limit)throw Error(`${label} 超過讀取上限`);
    let content;try{content=new TextDecoder('utf-8',{fatal:true,ignoreBOM:true}).decode(raw);}
    catch{throw Error(`${label} 不是有效的 UTF-8；請另存 UTF-8，原檔與目前內容保留`);}
    return parse(content,{maxBytes:limit,label,allowBOM});
  }
  const maxValueNodes=262144;
  function sameValue(left,right){
    let nodes=0;
    const data=(value,key)=>{const d=Object.getOwnPropertyDescriptor(value,key);return d&&d.enumerable&&Object.hasOwn(d,'value')?d:null;};
    function walk(a,b,depth){
      if(++nodes>maxValueNodes||typeof a!==typeof b)return false;
      if(a===null||b===null)return a===null&&b===null;
      if(typeof a==='number')return Number.isFinite(a)&&Number.isFinite(b)&&a===b;
      if(typeof a==='string'){if(a!==b)return false;unicode(a,'JSON value');return true;}
      if(typeof a==='boolean')return a===b;
      if(typeof a!=='object'||depth>=maxDepth)return false;
      const array=Array.isArray(a);if(array!==Array.isArray(b))return false;
      const keys=Reflect.ownKeys(a),other=Reflect.ownKeys(b);
      if(keys.length!==other.length||keys.some(k=>typeof k!=='string')||other.some(k=>typeof k!=='string'))return false;
      if(array){
        const length=Object.getOwnPropertyDescriptor(a,'length')?.value,otherLength=Object.getOwnPropertyDescriptor(b,'length')?.value;
        if(!Number.isSafeInteger(length)||length<0||length!==otherLength||keys.length!==length+1||length>=maxValueNodes)return false;
        for(let i=0;i<length;i++){const x=data(a,String(i)),y=data(b,String(i));if(!x||!y||!walk(x.value,y.value,depth+1))return false;}
        return true;
      }
      if(Object.prototype.toString.call(a)!=='[object Object]'||Object.prototype.toString.call(b)!=='[object Object]')return false;
      for(const key of keys){unicode(key,'JSON key');const x=data(a,key),y=data(b,key);if(!x||!y||!walk(x.value,y.value,depth+1))return false;}
      return true;
    }
    try{return walk(left,right,0);}catch{return false;}
  }
  const api={maxBytes,maxDepth,maxValueNodes,parse,decode,assertUnicode:unicode,sameValue};
  if(typeof module==='object'&&module.exports)module.exports=api;else root.MusicJsonDocument=api;
})(typeof globalThis==='object'?globalThis:this);
