// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
  // Keys are opaque control objects. This layer has no DOM, parsing or I/O.
  function createController({read,write,onState=()=>{}}){
    if(typeof read!=='function'||typeof write!=='function')throw Error('原值欄位 adapter 不完整');
    const records=new WeakMap();
    function bind(key,value){
      if(!key||typeof key!=='object'||typeof value!=='string')throw Error('原值欄位需要文字與控制識別');
      write(key,value);let display=read(key),escaped=display!==value;
      if(escaped){display=JSON.stringify(value).slice(1,-1);write(key,display);}
      if(read(key)!==display)throw Error('欄位無法顯示原值；請保留來源檔案');
      records.set(key,{value,display});onState(key,{escaped});return value;
    }
    function capture(key){
      const current=read(key),record=records.get(key);
      if(typeof current!=='string')throw Error('原值欄位讀取需為文字');
      return record&&current===record.display?record.value:current;
    }
    function edited(key){records.delete(key);onState(key,{escaped:false});}
    return {bind,capture,edited};
  }
  if(typeof module==='object'&&module.exports)module.exports={createController};else root.MusicRawFields={createController};
})(typeof globalThis==='object'?globalThis:this);
