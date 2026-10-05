// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),crypto=require('node:crypto'),fs=require('node:fs');
const P=require('../web/search-excerpt.js'),D=require('../web/search-excerpt-dom.js');
const span=(text,query)=>{const at=text.indexOf(query);assert.ok(at>=0);return {text,start_byte:Buffer.byteLength(text.slice(0,at)),end_byte:Buffer.byteLength(text.slice(0,at)+query)};};
test('long repeated prefixes reveal distinct original neighbours around the exact match',()=>{
 const query='記憶點🎵',prefix='相同開場'.repeat(40),a=prefix+'甲前文 '+query+' 後甲',b=prefix+'乙前文 '+query+' 後乙';
 const va=P.present(span(a,query),query),vb=P.present(span(b,query),query);assert.equal(va.match,query);assert.equal(vb.match,query);assert.ok(va.before.endsWith('甲前文 '));assert.ok(vb.before.endsWith('乙前文 '));assert.equal(va.after,' 後甲');assert.equal(va.leading,true);assert.notDeepEqual(va,vb);assert.equal(P.prefix(a),P.prefix(b));
});
test('UTF8 boundary neighbours preserve BOM emoji CRLF controls and literal tags',()=>{
 for(const query of ['🎵','\r\n','\x00','<script>','\ufeff','   ']){const text='\ufeff甲🎵\r\n\x00<script>   乙',hit=span(text,query),copy=structuredClone(hit),v=P.present(hit,query);assert.equal(v.matchShortened,false);assert.deepEqual(hit,copy);assert.ok(!/[\x00-\x1f\x7f\ufeff]/.test(v.before+v.match+v.after));}
 assert.equal(P.present(span('甲\x00乙','\x00'),'\x00').match,'\\u0000');assert.equal(P.present(span('\ufeff甲','\ufeff'),'\ufeff').match,'[BOM]');assert.equal(P.present(span('a   b','   '),'   ').match,'   ');
});
test('start end and whole source have explicit clipping flags and never drop the match',()=>{
 for(const [text,query,leading,trailing] of [['hit','hit',false,false],['hit'+'甲'.repeat(100),'hit',false,true],['甲'.repeat(100)+'hit','hit',true,false]]){const v=P.present(span(text,query),query);assert.equal(v.match,query);assert.equal(v.leading,leading);assert.equal(v.trailing,trailing);}
 for(const query of ['a'.repeat(1024),'🎵'.repeat(256),'\x00'.repeat(1024)]){const v=P.present(span('前'.repeat(100)+query+'後'.repeat(100),query),query);assert.equal(v.matchShortened,true);assert.ok(Array.from(v.match).length<=96);assert.ok(Array.from(v.before).length<=48);assert.ok(Array.from(v.after).length<=48);assert.ok(v.match.includes('…'));if(query[0]==='\x00')assert.ok(!v.match.replaceAll('\\u0000','').replaceAll('…',''));}
});
test('invalid source Unicode UTF8 offsets wrong query oversize and unknown shapes reject',()=>{
 const good=span('a🎵b','🎵');for(const hit of [{...good,extra:0},{...good,text:'\ud800'},{...good,text:'a'.repeat(2001)},{...good,start_byte:2},{...good,end_byte:4},{...good,start_byte:true},{...good,start_byte:-1},{...good,end_byte:99},{...good,end_byte:good.start_byte},{text:'x'.repeat(1025),start_byte:0,end_byte:1025}])assert.throws(()=>P.present(hit,'🎵'));
 for(const query of ['',null,'wrong','\ud800'])assert.throws(()=>P.present(good,query));
 const v=P.present(good,'🎵');for(const change of [{schema_version:1},{before:'a'.repeat(49)},{match:'a'.repeat(97)},{after:'\ud800'},{leading:1},{match:''},{trailing:null}])assert.throws(()=>P.checkedView({...v,...change}));
});
function node(tag){let own='';return {tag,children:[],className:'',isConnected:true,disabled:false,hidden:false,append(child){this.children.push(child);},replaceChildren(...children){own='';this.children=[...children];},get textContent(){return own+this.children.map(c=>c.textContent).join('');},set textContent(v){own=v;this.children=[];},set innerHTML(v){assert.fail('literal DOM required');}};}
test('literal DOM renders a mark and distinguishes shortened query without HTML execution',()=>{
 const document={createElement:node},button=node('button'),v=P.present(span('前<script>後','<script>'),'<script>');D.append(document,button,'第 1 句',v);assert.equal(button.textContent,'第 1 句前<script>後');assert.equal(button.children[1].children[1].tag,'mark');assert.equal(button.children[1].children[1].textContent,'<script>');assert.match(button.title,/摘錄/);
 const long=node('button');D.append(document,long,'鏡頭 1',P.present(span('x'.repeat(1024),'x'.repeat(1024)),'x'.repeat(1024)));assert.match(long.textContent,/命中已摘錄/);const before=long.textContent;assert.throws(()=>D.append(document,long,'a'.repeat(201),v));assert.equal(long.textContent,before);
});
for(const kind of ['lyrics','storyboard'])test(kind+' actual controller DOM keeps full reply and original focus while showing bounded match context',async()=>{
 const M=require('../musiclab/assets/'+kind+'-search.js'),A=require('../web/'+kind+'-search-dom.js'),text='開場'.repeat(100)+'鄰句 <script> 結尾',s={ids:['original-id'],visible:true,busy:false,resultRevision:0},nodes=new Map(),reports=[],focused=[];
 if(kind==='lyrics')s.texts=[text];else s.shots=[Object.fromEntries(M.fields.map(k=>[k,k==='visual'?text:'']))];
 const document={createElement:node,getElementById:id=>nodes.get(id),defaultView:{addEventListener(){}}};for(const k of ['query','find','previous','next','cancel','matches','note'])nodes.set(kind+'-search-'+k,node('button'));
 const search=p=>M.search(p,{hash:b=>crypto.createHash('sha256').update(b).digest('hex')});const c=A.bind(document,{version:'0.94.0',capture:()=>s,search,request:async p=>{const d=await search(p);return {data:d,files:{[kind+'-search.json']:JSON.stringify(d),[kind+'-search.md']:M.markdown(d)},meta:{version:'0.94.0',protocol_version:1,needs_review:true}};},focusTarget:t=>{focused.push(t);return true;},onReport:(d,f)=>reports.push({d,f})});c.setQuery('<script>');assert.equal(await c.find(),true);
 const button=nodes.get(kind+'-search-matches').children[0].children[0];assert.match(button.textContent,/鄰句 <script> 結尾/);assert.ok(button.textContent.length<250);button.onclick();assert.equal(focused[0].text,text);assert.equal(focused[0].id,'original-id');assert.equal(reports[0].d.matches[0].text,text);assert.equal(JSON.parse(reports[0].f[kind+'-search.json']).matches[0].text,text);assert.equal(kind==='lyrics'?s.texts[0]:s.shots[0].visual,text);c.setQuery('new');assert.equal(nodes.get(kind+'-search-matches').children.length,0);
});
test('fixed assets load after UTF8 context and before both DOM adapters with narrow wrapping rules',()=>{
 const html=fs.readFileSync('web/index.html','utf8'),css=fs.readFileSync('web/style.css','utf8');for(const kind of ['lyrics','storyboard']){assert.ok(html.indexOf('/delivery-context.js')<html.indexOf('/search-excerpt.js'));assert.ok(html.indexOf('/search-excerpt.js')<html.indexOf('/search-excerpt-dom.js'));assert.ok(html.indexOf('/search-excerpt-dom.js')<html.indexOf('/'+kind+'-search-dom.js'));}assert.match(css,/search-match-excerpt\{[^}]*white-space:pre-wrap/);assert.match(css,/search-match-excerpt mark/);
});
