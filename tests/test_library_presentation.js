// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const M=require('../web/library-match.js'),P=require('../web/library-presentation.js'),D=require('../web/library-presentation-dom.js'),F=require('./library_revision_fixture.js');
const record=()=>({...F.revision().entry,label:'🎵aa🎵aa <img src=x>',titles:{music:'🎵aa e\u0301 é <script>x</script>',storyboard:'aaaaa\r\n aa🎵',lyrics:' aa\taa🎵'}});
const source=changes=>({enabled:true,mode:'all',displayed_count:0,selected:null,search:null,issue_count:0,stale:false,pending:false,...changes});
const search=(changes={})=>source({mode:'search',displayed_count:1,selected:record(),search:{query:'aa',record_count:2,match_count:1,issue_count:0},...changes});

test('literal matching returns all four fields with nonoverlapping codepoint spans',()=>{
 const r=record(),before=structuredClone(r),rows=M.matchedFields(r,'aa');assert.equal(rows.length,4);assert.deepEqual(rows[0].spans,[[1,3],[4,6]]);assert.deepEqual(rows[2].spans,[[0,2],[2,4],[8,10]]);
 for(const row of rows){let last=0;for(const [from,to] of row.spans){assert.ok(from>=last);assert.equal([...row.text].slice(from,to).join(''),'aa');last=to;}}
 for(const q of ['AA',' éé','e\u0301é','<IMG'])assert.equal(M.hasMatch(r,q),false);
 for(const q of ['\r\n','e\u0301','é','<script>'])assert.equal(M.hasMatch(r,q),true);
 rows[0].spans[0][0]=99;rows[0].text='changed';assert.deepEqual(r,before);assert.deepEqual(M.matchedFields(r,'aa')[0].spans[0],[1,3]);
});
test('query limits and all selected metadata checked even without a match',()=>{
 const r=record();r.label='🎵'.repeat(200);r.titles=Object.fromEntries(['music','storyboard','lyrics'].map(k=>[k,'🎵'.repeat(120)]));assert.equal(M.checkedQuery('🎵'.repeat(200)).length,400);assert.equal(M.matchedFields(r,'🎵').reduce((n,v)=>n+v.spans.length,0),560);
 for(const q of ['',null,true,'🎵'.repeat(201),'\ud800'])assert.throws(()=>M.matchedFields(r,q));
 for(const change of [v=>v.path='x',v=>v.library_schema_version=2,v=>v.bytes=true,v=>v.titles.music='\udfff',v=>v.created_with='\ud800']){const bad=structuredClone(r);change(bad);assert.throws(()=>M.hasMatch(bad,'not found'));}
});
test('empty and disabled libraries have distinct actionable notes',()=>{
 const empty=P.present(source());assert.equal(empty.empty_kind,'empty');assert.match(empty.selection_note,/尚無保存版本/);assert.equal(empty.show_matches,false);
 const disabled=P.present(source({enabled:false}));assert.equal(disabled.empty_kind,'disabled');assert.match(disabled.selection_note,/未啟用/);
});
test('zero search matches with readable versions never claims the library is empty',()=>{
 const v=P.present(search({displayed_count:0,selected:null,search:{query:'nothing',record_count:2,match_count:0,issue_count:0}}));assert.equal(v.empty_kind,'no_matches');assert.match(v.selection_note,/這次搜尋沒有符合/);assert.doesNotMatch(v.selection_note,/尚無保存/);assert.match(v.search_note,/0／2/);assert.equal(v.more_label,'讀取更多搜尋結果');
});
test('unreadable-only and mixed search sources retain original-data warning',()=>{
 for(const mode of ['all','search']){const v=P.present(source({mode,issue_count:2,search:mode==='search'?{query:'aa',record_count:0,match_count:0,issue_count:2}:null}));assert.equal(v.empty_kind,'unreadable');assert.match(v.selection_note,/沒有可讀/);assert.match(v.selection_note,/2 個版本摘要無法讀取，原資料保留/);}
 const v=P.present(search({issue_count:1,search:{query:'aa',record_count:2,match_count:1,issue_count:1}}));assert.equal(v.empty_kind,null);assert.match(v.library_note,/1 個版本摘要無法讀取/);assert.equal(v.matches.length,4);
});
test('selected metadata notes and marked texts preserve original strings',()=>{
 const s=search(),v=P.present(s);assert.equal(v.matches[0].text,s.selected.label);assert.match(v.selection_note,/歌曲：🎵aa/);assert.equal(v.show_matches,true);assert.equal(v.match_heading,'「aa」搜尋的位置');assert.deepEqual(v.matches,M.matchedFields(s.selected,'aa'));assert.equal(P.present(source({displayed_count:1,selected:s.selected})).matches.length,0);
});
test('pending and stale presentations remain pinned to the accepted query',()=>{
 for(const state of [{stale:true},{pending:true},{stale:true,pending:true}]){const v=P.present(search(state));assert.match(v.search_note,/「aa」結果/);assert.match(v.match_heading,/上一份「aa」/);assert.deepEqual(v.matches,M.matchedFields(record(),'aa'));}
 assert.match(P.present(search({pending:true})).search_note,/正在搜尋/);assert.match(P.present(search({stale:true})).search_note,/請重新搜尋/);
});
test('inconsistent display contexts and nonmatching selected rows refuse before presentation',()=>{
 for(const s of [source({path:'x'}),source({selected:record()}),source({displayed_count:1}),search({issue_count:1}),search({search:{query:'AA',record_count:2,match_count:1,issue_count:0}}),search({search:{query:'aa',record_count:1,match_count:2,issue_count:0}}),source({search:{}}),search({search:{query:'aa',record_count:1000,match_count:1,issue_count:1},issue_count:1})])assert.throws(()=>P.present(s));
});

class Node{
 constructor(tag='text',text=''){this.tag=tag;this.children=[];this.text=text;this.hidden=false;}
 append(...nodes){for(const n of nodes)this.children.push(...(n.tag==='fragment'?n.children:[n]));}
 replaceChildren(...nodes){this.children=[];this.text='';this.append(...nodes);}
 set textContent(value){this.text=String(value);this.children=[];}
 get textContent(){return this.text+this.children.map(v=>v.textContent).join('');}
}
function dom(){const nodes=new Map(),created=[];return {nodes,created,getElementById:id=>{if(!nodes.has(id))nodes.set(id,new Node('existing'));return nodes.get(id);},createDocumentFragment:()=>new Node('fragment'),createTextNode:text=>new Node('text',text),createElement:tag=>{created.push(tag);return new Node(tag);}};}
test('literal detached DOM marks spans without parsing HTML or changing original name text',()=>{
 const document=dom(),s=search({search:{query:'<',record_count:1,match_count:1,issue_count:0}}),errors=[],c=D.createPresenter(document,{capture:()=>s,onError:e=>errors.push(e)});assert.equal(c.update(),true);
 const items=document.nodes.get('library-match-list').children;assert.equal(items.length,2);assert.equal(items[0].children[1].textContent,s.selected.label);assert.equal(items[1].children[1].textContent,s.selected.titles.music);assert.deepEqual([...new Set(document.created)].sort(),['li','mark','span','strong']);assert.equal(errors.length,0);assert.equal(document.nodes.get('library-match-details').hidden,false);
});
test('invalid next capture preserves the previously presented DOM and reports an error',()=>{
 const document=dom(),errors=[];let s=search();const c=D.createPresenter(document,{capture:()=>s,onError:e=>errors.push(e.message)});assert.equal(c.update(),true);const list=document.nodes.get('library-match-list'),items=list.children,old=document.nodes.get('library-selection-note').textContent;s=search({search:{query:'AA',record_count:1,match_count:1,issue_count:0}});assert.equal(c.update(),false);assert.equal(list.children,items);assert.equal(document.nodes.get('library-selection-note').textContent,old);assert.equal(errors.length,1);
});
test('refresh to all or empty replaces only displayed match nodes and hides the detail',()=>{
 const document=dom();let s=search();const c=D.createPresenter(document,{capture:()=>s});c.update();s=source({displayed_count:1,selected:record()});assert.equal(c.update(),true);assert.equal(document.nodes.get('library-match-list').children.length,0);assert.equal(document.nodes.get('library-match-details').hidden,true);assert.equal(document.nodes.get('library-more').textContent,'讀取更早版本');s=source();c.update();assert.match(document.nodes.get('library-selection-note').textContent,/尚無保存版本/);
});
test('actual app presenter captures accepted search context instead of the edited query',()=>{
 const code=fs.readFileSync('web/app.js','utf8'),start=code.indexOf('const libraryPresenter='),end=code.indexOf('function libraryControls',start);assert.ok(start>0&&end>start);let capture;
 const ctx={MusicLibraryPresentationDom:{createPresenter:(d,o)=>{capture=o.capture;return {update(){}};}},document:{},libraryEnabled:true,libraryMode:'search',libraryRecords:[record()],librarySearchContext:{query:'aa',record_count:1,match_count:1,issue_count:0},libraryIssueCount:0,librarySearchState:{pending:false,stale:true},$:id=>({value:id==='library-select'?record().id:'AA'}),librarySay:()=>{}};vm.createContext(ctx);vm.runInContext(code.slice(start,end),ctx);const s=capture();assert.equal(s.search.query,'aa');assert.equal(s.stale,true);assert.deepEqual(P.present(s).matches,M.matchedFields(record(),'aa'));assert.ok(code.includes('libraryPresenter.update()'));
});
test('fixed dependency order and bounded keyboard-reachable name matches are installed',()=>{
 const html=fs.readFileSync('web/index.html','utf8'),css=fs.readFileSync('web/style.css','utf8'),server=fs.readFileSync('music_lab_server.py','utf8');for(const [a,b] of [['library-revision','library-match'],['library-match','library-search'],['library-match','library-presentation'],['library-presentation','library-presentation-dom'],['library-presentation-dom','app']])assert.ok(html.indexOf('/'+a+'.js')<html.indexOf('/'+b+'.js'));
 for(const asset of ['library-match','library-presentation','library-presentation-dom'])assert.ok(server.includes('"/'+asset+'.js"'));assert.match(html,/id="library-match-list" tabindex="0"/);assert.match(css,/#library-match-list\{[^}]*max-height:16rem;overflow:auto/);assert.match(css,/#library-match-list span\{[^}]*overflow-wrap:anywhere/);assert.match(css,/#library-match-list:focus-visible/);
});
