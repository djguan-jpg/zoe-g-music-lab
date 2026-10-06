// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),P=require('../web/editor-selection.js');
const source=ids=>({ids,visible:true,busy:false});

test('selection shares own dense ID validation and cannot apply inherited or missing captures',()=>{
 for(const list of P.lists)for(const at of [1,2,3])for(const inherited of [false,true]){
  let reads=0,writes=0,errors=0;const bad=new Array(2);bad[1]='b';if(inherited){const prototype=Object.create(Array.prototype);prototype[0]='a';Object.setPrototypeOf(bad,prototype);}
  const c=P.createController({allowed:()=>true,capture:()=>source(++reads===at?bad:['a','b']),selectTarget:()=>{writes++;return true;},onError:()=>errors++});
  assert.equal(c.select(list,'b'),false);assert.equal(reads,at);assert.equal(errors,1);assert.equal(writes,at===3?1:0);
 }
});

test('selection keeps caller methods unused and rejects invalid sources without poisoning later requests',()=>{
 for(const list of P.lists){
  let malformed=false,writes=0,hooks=0;const ids=['a','b'];ids.map=()=>{hooks++;return ['external','b'];};ids[Symbol.iterator]=()=>{hooks++;throw Error('caller iterator');};
  const c=P.createController({allowed:()=>true,capture:()=>source(malformed?[, 'b']:ids),selectTarget:target=>{assert.deepEqual(target,{list,id:'b',index:1});writes++;return true;}});
  assert.equal(c.select(list,'b'),true);malformed=true;assert.equal(c.select(list,'b'),false);malformed=false;assert.equal(c.select(list,'b'),true);assert.equal(writes,2);assert.equal(hooks,0);
 }
});
test('three ordered editors select stable identity from metadata without touching caller arrays',()=>{for(const list of P.lists){const s=source(['same-1','same-2']);assert.deepEqual(P.proposal(list,s,'same-2'),{list,id:'same-2',index:1});const copy=P.source(list,s);copy.ids.reverse();assert.deepEqual(s,source(['same-1','same-2']));assert.deepEqual(Object.keys(copy).sort(),['busy','ids','visible']);}});
test('unknown lists malformed metadata sparse IDs and missing targets are refused',()=>{for(const list of ['motifs','music-avoid','__proto__'])assert.throws(()=>P.proposal(list,source(['a']),'a'));for(const s of [source(new Array(1)),source(['a','a']),source(['']),{...source(['a']),extra:1},{...source(['a']),busy:1}])assert.throws(()=>P.proposal('cues',s,'a'));assert.throws(()=>P.proposal('cues',source([]),'a'));});
test('metadata-only capacity bounds retain the original forty thousand and ten-thousand row contracts',()=>{for(const [list,n] of [['arrangement',40],['shots',1000],['cues',10000]]){const ids=Array.from({length:n},(_,i)=>'r'+i);assert.equal(P.proposal(list,source(ids),ids.at(-1)).index,n-1);assert.throws(()=>P.proposal(list,source([...ids,'extra']),'r0'));}});
test('blocked unknown and disposed requests do not capture values or apply a selection',()=>{let reads=0,writes=0;const c=P.createController({allowed:()=>false,capture:()=>{reads++;return source(['a']);},selectTarget:()=>{writes++;return true;}});assert.equal(c.select('cues','a'),false);assert.equal(c.select('unknown','a'),false);c.dispose();assert.equal(c.select('cues','a'),false);assert.equal(reads,0);assert.equal(writes,0);});
test('reordered replaced deleted or blocked second capture cannot update the selection',()=>{for(const after of [source(['b','a']),source(['a','new']),source(['a']),{...source(['a','b']),visible:false},{...source(['a','b']),busy:true}]){let reads=0,writes=0;const c=P.createController({allowed:()=>true,capture:()=>++reads===1?source(['a','b']):after,selectTarget:()=>{writes++;return true;}});assert.equal(c.select('cues','b'),false);assert.equal(writes,0);}});
test('success requires a confirmed selection and unchanged actual-after metadata without rollback',()=>{for(const confirmed of [true,false]){let reads=0;const c=P.createController({allowed:()=>true,capture:()=>{reads++;return source(['a']);},selectTarget:()=>confirmed});assert.equal(c.select('cues','a'),confirmed);assert.equal(reads,confirmed?3:2);}let ids=['a'];const c=P.createController({allowed:()=>true,capture:()=>source(ids),selectTarget:()=>{ids=['external'];return true;}});assert.equal(c.select('cues','a'),false);assert.deepEqual(ids,['external']);});
