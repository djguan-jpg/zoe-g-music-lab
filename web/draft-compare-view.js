// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
 const scopes=['music','storyboard','lyrics','audio','metadata'],maxDetails=200,pageSize=10;
 function create(){
  let source=[],scope='all',page=0;const expanded=new Set();
  function view(){
   const selected=[];for(let i=0;i<source.length;i++)if(scope==='all'||source[i]===scope)selected.push(i);
   const pages=Math.max(1,Math.ceil(selected.length/pageSize));page=Math.min(page,pages-1);
   const indices=selected.slice(page*pageSize,(page+1)*pageSize),expandedIndices=indices.filter(i=>expanded.has(i));
   return {scope,page,pages,count:selected.length,indices,expandedIndices,pageExpanded:expandedIndices.length,totalExpanded:expanded.size,canPrevious:page>0,canNext:page+1<pages,canExpand:expandedIndices.length<indices.length,canCollapse:expandedIndices.length>0};
  }
  function reset(values){
   if(!Array.isArray(values)||values.length>maxDetails)throw Error('差異閱讀清單超出範圍');
   const copy=[];for(let i=0;i<values.length;i++){const d=Object.getOwnPropertyDescriptor(values,String(i));if(!d||!('value' in d)||!scopes.includes(d.value))throw Error('未知差異範圍');copy.push(d.value);}
   source=copy;scope='all';page=0;expanded.clear();return view();
  }
  function selectScope(value){if(value!=='all'&&!scopes.includes(value))throw Error('未知差異範圍');scope=value;page=0;return view();}
  function move(direction){if(direction!==-1&&direction!==1)throw Error('未知差異頁面方向');const v=view();page=Math.max(0,Math.min(v.pages-1,page+direction));return view();}
  function toggle(index,open){if(typeof open!=='boolean'||!Number.isInteger(index)||!view().indices.includes(index))throw Error('差異位置不在目前頁面');if(open)expanded.add(index);else expanded.delete(index);return view();}
  function setPageExpanded(open){if(typeof open!=='boolean')throw Error('未知差異展開狀態');for(const index of view().indices)if(open)expanded.add(index);else expanded.delete(index);return view();}
  return {view,reset,clear:()=>reset([]),selectScope,move,toggle,setPageExpanded};
 }
 const api={create,maxDetails,pageSize};if(typeof module==='object'&&module.exports)module.exports=api;else root.MusicDraftCompareView=api;
})(typeof globalThis==='object'?globalThis:this);
