// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
  const T=typeof module==='object'&&module.exports?require('./lyric-time.js'):root.LyricTime;
  const J=typeof module==='object'&&module.exports?require('./json-document.js'):root.MusicJsonDocument;
  const maxRows=10000,maxIssues=200;
  const messages={missing_time:'時間尚未標記',invalid_time:'時間需為非負、有限且可保留毫秒的十進位數字',invalid_end:'結束需晚於開始',multiline_text:'每句需為單行歌詞',duplicate_start:'開始時間與另一句相同',overlap:'時間與另一句重疊',past_duration:'時間超過作品宣告總長',invalid_duration:'作品宣告需為正數且可保留毫秒',no_cues:'尚無逐句內容，請先接續歌詞'};
  const notes=['只檢查資料時間，不表示已實聽同步或完成辨識。','原始列順序與文字保留；未填時間不猜測，不裁切或移動句子。'];
  const blank=s=>/^[\t\n\v\f\r \u001c-\u001f\u0085\u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000]*$/u.test(s);
  const clock=(v,label)=>{if(typeof v==='string'){v=v.replace(/^[\t\n\v\f\r \u001c-\u001f\u0085\u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000]+|[\t\n\v\f\r \u001c-\u001f\u0085\u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000]+$/gu,'');if(!/^[+-]?(?:[0-9]+(?:\.[0-9]*)?|\.[0-9]+)(?:e[+-]?[0-9]+)?$/i.test(v))throw Error('invalid clock');}return T.normalize(v,label,true);};
  const empty=v=>v===null||typeof v==='string'&&blank(v);
  const scalar=v=>v===null||['string','boolean'].includes(typeof v)||typeof v==='number'&&Number.isFinite(v);
  const exact=(v,keys)=>v&&typeof v==='object'&&!Array.isArray(v)&&Object.keys(v).length===keys.length&&keys.every(k=>Object.hasOwn(v,k));
  function review(payload){
    if(!payload||typeof payload!=='object'||Array.isArray(payload)||!Object.hasOwn(payload,'cues')||Object.keys(payload).some(k=>!['title','duration','cues'].includes(k)))throw Error('校時檢查欄位不支援');
    const title=Object.hasOwn(payload,'title')?payload.title:'歌詞校時檢查',duration=Object.hasOwn(payload,'duration')?payload.duration:null,cues=payload.cues;
    if(typeof title!=='string'||blank(title)||Array.from(title).length>200||!Array.isArray(cues)||cues.length>maxRows||!scalar(duration)||cues.some(c=>!exact(c,['start','end','text'])||typeof c.text!=='string'||Array.from(c.text).length>2000||!scalar(c.start)||!scalar(c.end)))throw Error('校時檢查來源格式或容量不支援');
    const source=structuredClone({title,duration,cues});
    const values=[title,duration,...cues.flatMap(c=>[c.start,c.end,c.text])],encoder=new TextEncoder();
    if(values.reduce((sum,v)=>sum+(typeof v==='string'?encoder.encode(JSON.stringify(v)).length:32),0)>2*1024*1024)throw Error('校時檢查欄位容量最多2 MiB');
    const issues=[],blocked=new Set();let count=0,total=null,timed=0;
    const add=(row,field,code,related=null)=>{count++;if(row)blocked.add(row);if(issues.length<maxIssues)issues.push({row,field,code,related_row:related,message:messages[code]});};
    const declared=!empty(duration);
    if(declared){try{total=clock(duration,'作品宣告');if(total<=0)throw Error();}catch{total=null;add(0,'duration','invalid_duration');}}
    if(!cues.length)add(0,'cues','no_cues');
    const parsed=cues.map((cue,i)=>{
      const row=i+1,times={};
      for(const field of ['start','end']){
        if(empty(cue[field])){add(row,field,'missing_time');times[field]=null;}
        else{try{times[field]=clock(cue[field],field);}catch{add(row,field,'invalid_time');times[field]=null;}}
      }
      const {start,end}=times,single=!/[\r\n]/.test(cue.text);if(!single)add(row,'text','multiline_text');
      if(start!==null&&end!==null){if(end<=start)add(row,'end','invalid_end');else if(single)timed++;}
      if(total!==null){if(start!==null&&start>=total)add(row,'start','past_duration');if(end!==null&&end>total)add(row,'end','past_duration');}
      return {row,start,end};
    });
    const ordered=parsed.filter(c=>c.start!==null).sort((a,b)=>a.start-b.start),first=new Map(),marked=new Set();let horizon=null;
    for(const cue of ordered){
      const {start,row}=cue;
      if(first.has(start)){const other=first.get(start);if(!marked.has(other)){add(other,'start','duplicate_start',row);marked.add(other);}add(row,'start','duplicate_start',other);}else first.set(start,row);
      if(horizon&&horizon.end>start){add(horizon.row,'end','overlap',row);add(row,'start','overlap',horizon.row);}
      if(cue.end!==null&&cue.end>start&&(!horizon||cue.end>horizon.end))horizon=cue;
    }
    return {format:'zoe-lyrics-review',schema_version:1,status:count?'needs_correction':'timing_checked',source,total_rows:cues.length,timed_rows:timed,blocking_rows:blocked.size,issue_count:count,issues,details_truncated:count>issues.length,duration_declared:declared,review_notes:[...notes]};
  }
  function markdown(data){
    const lines=['# 歌詞校時檢查','',`共${data.total_rows}句；局部時間已填${data.timed_rows}句；需修正${data.blocking_rows}句；問題${data.issue_count}項。`,''];
    for(const i of data.issues){const location=i.row?`第${i.row}句 ${i.field}`:i.field;lines.push(`- ${location}：${i.message}${i.related_row?`（與第${i.related_row}句）`:''}`);}
    if(data.details_truncated)lines.push(`- 明細僅列前${maxIssues}項；全部句子已檢查，修正後請重查。`);
    if(!data.issue_count)lines.push('時間資料可再驗證建立歌詞包；仍需實聽核對。');return [...lines,'',...data.review_notes,''].join('\n');
  }

  const equal=J.sameValue;
  function inspect(reply,payload){
    const expected=review(payload);
    if(!reply?.meta||reply.meta.protocol_version!==1||reply.meta.needs_review!==true||!equal(reply.data,expected)||!exact(reply.files,['lyrics-review.json','lyrics-review.md'])||!equal(J.parse(reply.files['lyrics-review.json'],{maxBytes:8*1024*1024,label:'校時報告'}),expected)||reply.files['lyrics-review.md']!==markdown(expected))throw Error('校時報告與目前來源或版本不一致；目前內容保留');
    return expected;
  }
  function createController({capture,request,onReport,onError,onState}){
    let token=0,pending=false;const state=()=>onState({pending});
    function invalidate(){token++;pending=false;state();}
    return {invalidate,async check(isCurrent=()=>true){const current=++token,payload=structuredClone(capture());pending=true;state();try{
      const reply=await request(payload,isCurrent);if(current!==token||!isCurrent())return false;
      if(!equal(capture(),payload))throw Error('檢查期間內容有修改；請重新檢查');
      const data=inspect(reply,payload);onReport(data,reply.files);return true;
    }catch(error){if(current===token&&isCurrent())onError(error);return false;}finally{if(current===token){pending=false;state();}}}};
  }
  const api={review,markdown,inspect,createController};if(typeof module==='object'&&module.exports)module.exports=api;else root.MusicLyricsReview=api;
})(typeof globalThis==='object'?globalThis:this);
