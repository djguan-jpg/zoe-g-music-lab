// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
  const node=typeof module==='object'&&module.exports;
  const P=node?require('../musiclab/assets/lyrics-package.js'):root.MusicLyricsPackage;
  const J=node?require('../musiclab/assets/json-document.js'):root.MusicJsonDocument;
  const maxContract=256*1024,maxEncoded=12*1024*1024,maxHtml=16*1024*1024;
  const marker='<script id="initial" type="application/json">',close='</script>';
  const exact=(v,keys)=>v&&typeof v==='object'&&!Array.isArray(v)&&Object.keys(v).length===keys.length&&keys.every(k=>Object.hasOwn(v,k));
  const canonical=v=>Array.isArray(v)?v.map(canonical):v&&typeof v==='object'?Object.fromEntries(Object.keys(v).sort().map(k=>[k,canonical(v[k])])):v;
  const equal=(a,b)=>JSON.stringify(canonical(a))===JSON.stringify(canonical(b));
  const fail=()=>{throw Error('歌詞預覽與本次來源或共用範本不一致；目前成果與編修保留');};
  function bytes(text,limit){
    if(typeof text!=='string'||text.length>limit)fail();
    for(const char of text){const n=char.codePointAt(0);if(n>=0xd800&&n<=0xdfff)fail();}
    if(new TextEncoder().encode(text).length>limit)fail();
  }
  const escapedTitle=text=>text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#x27;');
  function createInspector(contract){
    if(!exact(contract,['format','schema_version','template','timing_js','package_js'])||contract.format!=='zoe-lyrics-preview-template'||contract.schema_version!==1)fail();
    const c={...contract};bytes(JSON.stringify(c),maxContract);
    for(const key of ['template','timing_js','package_js'])if(typeof c[key]!=='string'||!c[key])fail();
    const expected={TITLE:2,DATA:1,TIMING_JS:1,PACKAGE_JS:1},seen={TITLE:0,DATA:0,TIMING_JS:0,PACKAGE_JS:0};
    for(const token of c.template.match(/__(TITLE|DATA|TIMING_JS|PACKAGE_JS)__/g)||[])seen[token.slice(2,-2)]++;
    if(!equal(seen,expected)||c.template.split(marker).length!==2)fail();
    function compose(data,raw){
      const parts={TITLE:escapedTitle(data.title),DATA:raw,TIMING_JS:c.timing_js,PACKAGE_JS:c.package_js};
      return c.template.replace(/__(TITLE|DATA|TIMING_JS|PACKAGE_JS)__/g,(_token,key)=>parts[key]);
    }
    function inspect(expected,html){
      expected=P.validate(expected);bytes(html,maxHtml);
      const start=html.indexOf(marker),end=html.indexOf(close,start+marker.length);
      if(start<0||end<0||html.indexOf(marker,start+marker.length)!==-1)fail();
      const raw=html.slice(start+marker.length,end);
      if(/[<\u2028\u2029]/u.test(raw))fail();
      const data=P.validate(J.parse(raw,{maxBytes:maxEncoded,label:'歌詞預覽來源'}));
      if(!equal(data,expected)||html!==compose(expected,raw))fail();
      return structuredClone(expected);
    }
    function render(data){
      data=P.validate(data);const raw=JSON.stringify(data).replace(/</g,'\\u003c').replace(/\u2028/g,'\\u2028').replace(/\u2029/g,'\\u2029');
      const result=compose(data,raw);bytes(result,maxHtml);return result;
    }
    return {inspect,render};
  }
  const api={createInspector,maxContract,maxEncoded,maxHtml};if(node)module.exports=api;else root.MusicLyricsPreview=api;
})(typeof window==='undefined'?{}:window);
