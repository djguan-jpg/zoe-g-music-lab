// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
  const node=typeof module==='object'&&module.exports,P=node?require('./lyrics-package.js'):root.MusicLyricsPackage,
    T=node?require('./lyric-time.js'):root.LyricTime,L=node?require('./lyrics-lrc.js'):root.MusicLyricsLrc,
    J=node?require('./json-document.js'):root.MusicJsonDocument,cryptoApi=node?require('node:crypto').webcrypto:root.crypto;
  const maxIssues=200,messages={leading_time_tag:'歌詞以時間標籤開頭，LRC回讀會解讀為額外時間或拒絕；請以完整JSON保存。',blank_srt_line:'這句只有空白或tab，SRT回讀無法保留；請以完整JSON保存。'};
  const notes=['LRC只保存開始與文字，結束時間回讀時會重新推估。','LRC／SRT不保存名稱、作品總長或校時歷史；完整JSON保存全部歌詞包資料。','只核對本工具的格式表達，不保證其他播放器、實聽、作者或版權。'];
  const exact=(v,keys)=>v&&typeof v==='object'&&!Array.isArray(v)&&Object.keys(v).length===keys.length&&keys.every(k=>Object.hasOwn(v,k));
  const canonical=v=>Array.isArray(v)?v.map(canonical):v&&typeof v==='object'?Object.fromEntries(Object.keys(v).sort().map(k=>[k,canonical(v[k])])):v;
  const equal=(a,b)=>JSON.stringify(canonical(a))===JSON.stringify(canonical(b));
  function checkedSource(payload){
    if(!exact(payload,['package'])&&!exact(payload,['package','include_package']))throw Error('格式檢查只接受完整package及明確include_package');
    if(Object.hasOwn(payload,'include_package')&&typeof payload.include_package!=='boolean')throw Error('include_package需為明確布林值');
    return P.validate(payload.package);
  }
  function sourceBytes(data){
    const timing=Object.fromEntries(['duration_source','inferred_end_count','tail_end_inferred'].map(k=>[k,data.timing[k]]));
    if(Object.hasOwn(data.timing,'applied_shift_seconds'))timing.applied_shift_ms=T.milliseconds(data.timing.applied_shift_seconds);
    const value={format:'zoe-lyrics-export-source',schema_version:1,package_schema_version:1,title:data.title,duration_ms:T.milliseconds(data.duration),duration_estimated:data.duration_estimated,
      cues:data.cues.map(c=>({start_ms:T.milliseconds(c.start),end_ms:T.milliseconds(c.end),text:c.text})),timing,review_notes:data.review_notes};
    const raw=JSON.stringify(value);J.parse(raw,{maxBytes:4*1024*1024,label:'格式檢查來源'});return new TextEncoder().encode(raw);
  }
  function analyzeSource(data){
    const counts={lrc:0,srt:0},issues=[];
    for(let i=0;i<data.cues.length;i++)for(const [ext,code,risk] of [['lrc','leading_time_tag',L.startsWithTimestamp(data.cues[i].text)],['srt','blank_srt_line',!/[^ \t]/.test(data.cues[i].text)]])if(risk){counts[ext]++;if(issues.length<maxIssues)issues.push({row:i+1,format:ext,code,message:messages[code]});}
    const total=counts.lrc+counts.srt;
    const formats=Object.fromEntries([['json',['start','end','text']],['lrc',['start','text']],['srt',['start','end','text']]].map(([ext,fields])=>[ext,{checked_cue_fields:fields,checked_cue_fields_preserved:(counts[ext]||0)===0,end_times_encoded:ext!=='lrc',package_metadata_preserved:ext==='json',issue_count:counts[ext]||0}]));
    return {formats,issue_count:total,issues,details_truncated:total>issues.length,recommended_preservation:'lyrics.json',review_notes:[...notes]};
  }
  function analyze(payload){return analyzeSource(checkedSource(payload));}
  async function review(payload){
    const data=checkedSource(payload),result=analyzeSource(data);
    const sha256=[...new Uint8Array(await cryptoApi.subtle.digest('SHA-256',sourceBytes(data)))].map(n=>n.toString(16).padStart(2,'0')).join('');
    return {format:'zoe-lyrics-export-review',schema_version:1,status:result.issue_count?'needs_attention':'checked_cue_fields',source:{title:data.title,duration_ms:T.milliseconds(data.duration),duration_estimated:data.duration_estimated,cue_count:data.cues.length,sha256},...result};
  }
  function markdown(data){
    const lines=['# 歌詞匯出格式檢查','',`共${data.source.cue_count}句；格式提醒${data.issue_count}項。`,`來源SHA-256：${data.source.sha256}`,'','建議保存完整lyrics.json；以下格式檢查不改寫原資料。',''];
    for(const i of data.issues)lines.push(`- 第${i.row}句 · ${i.format.toUpperCase()}：${i.message}`);if(data.details_truncated)lines.push(`- 明細僅列前${maxIssues}項；全部句子已檢查。`);return [...lines,'',...data.review_notes,''].join('\n');
  }
  function files(data,payload){
    const source=checkedSource(payload),result={'lyrics-export-review.json':JSON.stringify(data,null,2)+'\n','lyrics-export-review.md':markdown(data)};
    if(payload.include_package===true){result['lyrics.json']=JSON.stringify(source,null,2)+'\n';J.parse(result['lyrics.json'],{maxBytes:2*1024*1024,label:'完整歌詞包'});}
    return result;
  }
  async function inspect(reply,payload){
    const source=checkedSource(payload),include=payload.include_package===true,expected=await review({package:source});
    const names=['lyrics-export-review.json','lyrics-export-review.md',...(include?['lyrics.json']:[])];
    if(!exact(reply,['data','files','meta'])||!exact(reply.meta,['version','protocol_version','needs_review'])||reply.meta.protocol_version!==1||reply.meta.needs_review!==true||typeof reply.meta.version!=='string'||!reply.meta.version||!equal(reply.data,expected)||!exact(reply.files,names)||!equal(J.parse(reply.files['lyrics-export-review.json'],{maxBytes:256*1024,label:'格式檢查報告'}),expected)||reply.files['lyrics-export-review.md']!==markdown(expected))throw Error('格式檢查報告與本次來源不一致；目前內容保留');
    if(include&&!equal(J.parse(reply.files['lyrics.json'],{maxBytes:2*1024*1024,label:'完整歌詞包'}),source))throw Error('格式報告附帶的完整歌詞包與本次來源不一致；目前內容保留');
    return structuredClone(expected);
  }
  const api={analyze,review,markdown,files,inspect,sourceBytes};if(node)module.exports=api;else root.MusicLyricsExportReview=api;
})(typeof globalThis==='object'?globalThis:this);
