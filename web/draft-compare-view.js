// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
 const scopes=['music','storyboard','lyrics','audio','metadata'],kinds=['changed','added','removed'],maxDetails=200,pageSize=10;
 function create(){
  let source=[],scope='all',kind='all',page=0;const expanded=new Set();
  function view(){
   const selected=[],kindCounts={all:0,changed:0,added:0,removed:0};
   for(let i=0;i<source.length;i++){const row=source[i];if(scope!=='all'&&row.scope!==scope)continue;kindCounts.all++;kindCounts[row.status]++;if(kind==='all'||row.status===kind)selected.push(i);}
   const pages=Math.max(1,Math.ceil(selected.length/pageSize));page=Math.min(page,pages-1);
   const indices=selected.slice(page*pageSize,(page+1)*pageSize),expandedIndices=indices.filter(i=>expanded.has(i));
   return {scope,kind,kindCounts,page,pages,count:selected.length,indices,expandedIndices,pageExpanded:expandedIndices.length,totalExpanded:expanded.size,canPrevious:page>0,canNext:page+1<pages,canExpand:expandedIndices.length<indices.length,canCollapse:expandedIndices.length>0};
  }
  function reset(values){
   if(!Array.isArray(values)||values.length>maxDetails)throw Error('差異閱讀清單超出範圍');
   const copy=[];for(let i=0;i<values.length;i++){
    const d=Object.getOwnPropertyDescriptor(values,String(i)),row=d&&'value' in d?d.value:null;
    if(!row||typeof row!=='object'||Array.isArray(row)||Reflect.ownKeys(row).length!==2)throw Error('未知差異閱讀資料');
    const s=Object.getOwnPropertyDescriptor(row,'scope'),k=Object.getOwnPropertyDescriptor(row,'status');
    if(!s||!('value' in s)||!scopes.includes(s.value))throw Error('未知差異範圍');
    if(!k||!('value' in k)||!kinds.includes(k.value))throw Error('未知變動類型');
    copy.push({scope:s.value,status:k.value});
   }
   source=copy;scope='all';kind='all';page=0;expanded.clear();return view();
  }
  function selectScope(value){if(value!=='all'&&!scopes.includes(value))throw Error('未知差異範圍');scope=value;page=0;return view();}
  function selectKind(value){if(value!=='all'&&!kinds.includes(value))throw Error('未知變動類型');kind=value;page=0;return view();}
  function move(direction){if(direction!==-1&&direction!==1)throw Error('未知差異頁面方向');const v=view();page=Math.max(0,Math.min(v.pages-1,page+direction));return view();}
  function toggle(index,open){if(typeof open!=='boolean'||!Number.isInteger(index)||!view().indices.includes(index))throw Error('差異位置不在目前頁面');if(open)expanded.add(index);else expanded.delete(index);return view();}
  function setPageExpanded(open){if(typeof open!=='boolean')throw Error('未知差異展開狀態');for(const index of view().indices)if(open)expanded.add(index);else expanded.delete(index);return view();}
  return {view,reset,clear:()=>reset([]),selectScope,selectKind,move,toggle,setPageExpanded};
 }
 const api={create,maxDetails,pageSize};if(typeof module==='object'&&module.exports)module.exports=api;else root.MusicDraftCompareView=api;
})(typeof globalThis==='object'?globalThis:this);
