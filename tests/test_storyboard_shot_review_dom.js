// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),D=require('../web/storyboard-shot-review-dom.js');
function setup(){const nodes=new Map();function element(){return {children:[],textContent:'',value:'id',disabled:false,classList:{toggle(){}},append(...v){this.children.push(...v);},replaceChildren(){this.children=[];}};}
 const doc={getElementById(id){if(!nodes.has(id))nodes.set(id,element());return nodes.get(id);},createElement:element};let busy=false,visible=true,calls=[];
 const d=D.bind(doc,{labels:{visual:'畫面動作'},visible:()=>visible,busy:()=>busy,onLocate:(index,revision)=>calls.push({index,revision})});
 return {d,nodes,calls,set busy(v){busy=v;},set visible(v){visible=v;}};
}
const view=()=>({report:{row:100,total_shots:120,issue_count:1,issues:[{row:100,field:'visual',message:'<原文>',related_row:null}]},stale:false,revision:4});
test('DOM preserves literal issue text and binds the original report revision',()=>{const s=setup();s.d.render(view());const button=s.nodes.get('shot-review-issues').children[0].children[0];assert.equal(button.textContent,'鏡頭 100 · 畫面動作：<原文>');button.onclick();assert.deepEqual(s.calls,[{index:0,revision:4}]);s.d.render({...view(),revision:5});button.onclick();assert.equal(s.calls[1].revision,4);});
test('DOM busy, hidden, stale and empty selection gates keep source buttons unavailable',()=>{const s=setup();s.d.render(view());assert.equal(s.nodes.get('shot-review-check').disabled,false);s.busy=true;s.d.refresh();assert.equal(s.nodes.get('shot-review-check').disabled,true);s.busy=false;s.visible=false;s.d.refresh();assert.equal(s.nodes.get('shot-review-report').disabled,true);s.visible=true;s.d.render({...view(),stale:true});assert.equal(s.nodes.get('shot-review-issues').children[0].children[0].disabled,true);s.nodes.get('shots-order').value='';s.d.refresh();assert.equal(s.nodes.get('shot-review-check').disabled,true);});
