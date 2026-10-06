// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
 const names=Object.freeze({music:'歌曲設計',storyboard:'母題分鏡',lyrics:'波形校時',audio:'交付檢查'});
 const references=Object.freeze({initial:'起始範例',file:'最近確認的載入檔案',library:'最近確認的保存版本',download:'最近確認的下載草稿'});
 function describe(value){
  const data=(v,k)=>{const d=Object.getOwnPropertyDescriptor(v,k);if(!d||!d.enumerable||!Object.hasOwn(d,'value'))throw Error('草稿差異摘要無效');return d.value;};
  if(!value||typeof value!=='object'||Array.isArray(value)||Reflect.ownKeys(value).length!==2)throw Error('草稿差異摘要無效');
  const reference=data(value,'reference'),panels=data(value,'panels');
  if(!Array.isArray(panels))throw Error('草稿差異工作台無效');
  const length=Object.getOwnPropertyDescriptor(panels,'length')?.value;
  if(!Number.isSafeInteger(length)||length<0||length>4||Reflect.ownKeys(panels).length!==length+1)throw Error('草稿差異工作台無效');
  const selected=new Set();
  for(let i=0;i<length;i++){const name=data(panels,String(i));if(typeof name!=='string'||!Object.hasOwn(names,name)||selected.has(name))throw Error('草稿差異工作台無效');selected.add(name);}
  if(length===0){if(reference!==null)throw Error('空白草稿差異不能宣告參考版本');return '';}
  if(typeof reference!=='string'||!Object.hasOwn(references,reference))throw Error('草稿差異參考版本無效');
  const labels=Object.keys(names).filter(name=>selected.has(name)).map(name=>names[name]);
  return '相對'+references[reference]+'有變更：'+labels.join('、')+'。目前整份草稿仍需另存。';
 }
 const api=Object.freeze({describe});if(typeof module==='object'&&module.exports)module.exports=api;else root.MusicDraftDifference=api;
})(typeof globalThis==='object'?globalThis:this);
