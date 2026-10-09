// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root) {
  const node=typeof module==='object'&&module.exports;
  const S=node?require('./studio-timeline.js'):root.MusicStudioTimeline;
  function plan(shots,cues,duration) {
    if(!Number.isFinite(duration)||duration<=0||duration>600)throw Error('草稿影片需為 0–600 秒的可播放音檔');
    if(!Array.isArray(shots)||!shots.length||shots.length>1000||!Array.isArray(cues)||cues.length>10000)throw Error('請先完成分鏡時間');
    let tail=0;
    const board=shots.map(e=>{
      const range=S.span(e.value.start,e.value.end,duration);
      if(Math.abs(range.start-tail)>.001)throw Error('分鏡需依序從 0 秒完整接到音檔結尾；請修正空隙或重疊');
      tail=range.end;return {id:e.id,value:{...e.value},...range};
    });
    if(Math.abs(tail-duration)>.001)throw Error('最後一鏡需接到音檔結尾');
    let lyricTail=0;
    const lyrics=cues.map(e=>{const range=S.span(e.value.start,e.value.end,duration);if(range.start<lyricTail)throw Error('匯出影片的歌詞需依時間排列且不重疊');lyricTail=range.end;return {...range,text:e.value.text};});
    if(lyrics.some(e=>typeof e.text!=='string'))throw Error('歌詞需為文字');
    return {shots:board,cues:lyrics,duration};
  }
  function frame(plan,seconds) {
    if(!Number.isFinite(seconds)||seconds<0||seconds>plan.duration)throw Error('播放位置無效');
    const t=Math.min(seconds,Math.max(0,Math.min(plan.duration,plan.shots.at(-1).end)-.000001));
    return {shot:plan.shots.find(e=>t>=e.start&&t<e.end)||null,
      text:plan.cues.filter(e=>t>=e.start&&t<e.end).map(e=>e.text).join(' ／ ')};
  }
  function dimensions(ratio) {return ratio==='9:16'?{width:540,height:960}:ratio==='1:1'?{width:720,height:720}:{width:960,height:540};}
  function wrap(ctx,text,width) {
    const lines=[];
    for(const paragraph of text.split('\n')) {
      let line='';for(const char of paragraph){if(line&&ctx.measureText(line+char).width>width){lines.push(line);line=char;}else line+=char;}lines.push(line);
    }
    return lines;
  }
  function checkCanvas(ctx,canvas,plan,images) {
    ctx.font=`600 ${Math.max(18,Math.round(canvas.width*.033))}px sans-serif`;
    if(plan.cues.some(e=>wrap(ctx,e.text,canvas.width*.88).length>6))throw Error('有歌詞超過影片六行容量；請拆句或縮短後再匯出');
    ctx.font=`${Math.round(canvas.width*.03)}px sans-serif`;
    if(plan.shots.some(e=>!images.has(e.id)&&wrap(ctx,e.value.visual||e.value.section||'分鏡文字卡',canvas.width*.84).length>8))throw Error('有文字卡超過影片八行容量；請拆鏡頭或選擇圖片');
  }
  function draw(ctx,canvas,plan,seconds,images) {
    const {width:w,height:h}=canvas,{shot,text}=frame(plan,seconds),image=shot&&images.get(shot.id);
    ctx.fillStyle='#121821';ctx.fillRect(0,0,w,h);
    if(image){const scale=Math.min(w/image.naturalWidth,h/image.naturalHeight),iw=image.naturalWidth*scale,ih=image.naturalHeight*scale;ctx.drawImage(image,(w-iw)/2,(h-ih)/2,iw,ih);}
    else if(shot){ctx.fillStyle='#e5e9ec';ctx.textAlign='center';ctx.font=`${Math.round(w*.03)}px sans-serif`;const lines=wrap(ctx,shot.value.visual||shot.value.section||'分鏡文字卡',w*.84).slice(0,8);lines.forEach((line,i)=>ctx.fillText(line,w/2,h*.32+i*w*.042));}
    if(text){const font=Math.max(18,Math.round(w*.033));ctx.font=`600 ${font}px sans-serif`;ctx.textAlign='center';const lines=wrap(ctx,text,w*.88).slice(0,6),height=lines.length*font*1.4+font;ctx.fillStyle='rgba(0,0,0,.72)';ctx.fillRect(0,h-height,w,height);ctx.fillStyle='white';lines.forEach((line,i)=>ctx.fillText(line,w/2,h-height+font*1.4*(i+1)));}
  }
  // Chrome's native streaming WebM omits Duration. Add the elapsed recording duration
  // only to a layout without SeekHead/Cues offsets; no codec payload is rewritten.
  function withDuration(raw,milliseconds) {
    if(!(raw instanceof Uint8Array)||raw.length<16||raw.length>128*1024*1024)throw Error('瀏覽器未產生有效的 WebM 錄製資料；請重新匯出');
    if(!Number.isFinite(milliseconds)||milliseconds<=0||milliseconds>615000)throw Error('影片錄製時長無效；請重新匯出');
    const width=byte=>{for(let n=1;n<=8;n++)if(byte&(1<<(8-n)))return n;throw Error('WebM EBML 長度無效');};
    function element(offset,bound=raw.length) {
      if(offset>=bound)throw Error('WebM 元素缺漏');
      const iw=width(raw[offset]);if(iw>4||offset+iw>=bound)throw Error('WebM 元素 ID 無效');
      let id=0;for(let i=0;i<iw;i++)id=id*256+raw[offset+i];
      const sizeAt=offset+iw,sw=width(raw[sizeAt]);if(sizeAt+sw>bound)throw Error('WebM 元素長度缺漏');
      let size=raw[sizeAt]&((1<<(8-sw))-1),unknown=size===((1<<(8-sw))-1);
      for(let i=1;i<sw;i++){size=size*256+raw[sizeAt+i];unknown&&=raw[sizeAt+i]===255;}
      const start=sizeAt+sw,end=unknown?bound:start+size;
      if(!unknown&&(!Number.isSafeInteger(size)||end>bound))throw Error('WebM 元素超出原始範圍');
      return {id,sizeAt,sw,start,end,unknown,size};
    }
    function sizeBytes(size,width) {
      if(!Number.isSafeInteger(size)||size<0||size>=2**(7*width)-1)throw Error('WebM 元素長度无法接續');
      const bytes=new Uint8Array(width);for(let i=width-1;i>=0;i--){bytes[i]=size%256;size=Math.floor(size/256);}bytes[0]|=1<<(8-width);return bytes;
    }
    const header=element(0);if(header.id!==0x1a45dfa3||header.unknown)throw Error('缺少 WebM EBML header');
    const segment=element(header.end);if(segment.id!==0x18538067||segment.end!==raw.length)throw Error('WebM Segment 無效');
    let info=null,scale=null,duration=null,p=segment.start;
    while(p<segment.end) {
      const e=element(p,segment.end);
      if(![0x1549a966,0x1654ae6b,0x1f43b675].includes(e.id))throw Error('此 WebM 具有索引或未知元素，不能安全補入時長');
      if(e.id===0x1549a966){if(info||e.unknown)throw Error('WebM Info 無效');info=e;}
      if(e.unknown&&e.id!==0x1f43b675)throw Error('WebM 長度無效');p=e.end;
    }
    if(!info)throw Error('缺少 WebM Info');p=info.start;
    while(p<info.end) {
      const e=element(p,info.end);if(e.unknown||e.id===0xbf)throw Error('WebM Info 校驗格式不支援');
      if(e.id===0x2ad7b1){if(scale!==null||e.end-e.start>6)throw Error('WebM 時間尺度無效');scale=0;for(let i=e.start;i<e.end;i++)scale=scale*256+raw[i];}
      if(e.id===0x4489){if(duration||e.end-e.start!==8)throw Error('WebM Duration 格式不支援');duration=e;}p=e.end;
    }
    if(!Number.isSafeInteger(scale)||scale<=0)throw Error('缺少有效 WebM 時間尺度');
    const value=milliseconds*1000000/scale;
    if(duration){const output=raw.slice();new DataView(output.buffer).setFloat64(duration.start,value,false);return output;}
    const extra=new Uint8Array(11);extra.set([0x44,0x89,0x88]);new DataView(extra.buffer).setFloat64(3,value,false);
    if(raw.length+extra.length>128*1024*1024)throw Error('影片輸出超過 128 MiB');
    const output=new Uint8Array(raw.length+11);output.set(raw.subarray(0,info.end));output.set(extra,info.end);output.set(raw.subarray(info.end),info.end+11);
    output.set(sizeBytes(info.size+11,info.sw),info.sizeAt);
    if(!segment.unknown)output.set(sizeBytes(segment.size+11,segment.sw),segment.sizeAt);
    return output;
  }
  // Only explicitly started work owns native playback. Errors never produce a ready artifact.
  function createRecorder({capture,prepare,start,draw,position,onState=()=>{},onError=()=>{}}) {
    let phase='idle',token=0,owned=null,result=null,inFlight=false,resultKey=null;
    const state=()=>onState({phase,result});
    const key=s=>JSON.stringify(s.key);
    async function begin() {
      if(inFlight)return false;
      const initial=capture();if(!initial.allowed){onError(Error('目前不能匯出；請先完成音檔與分鏡'));return false;}
      const epoch=++token;inFlight=true;phase='preparing';result=null;resultKey=null;state();
      const valid=()=>epoch===token&&capture().allowed&&key(capture())===key(initial);
      try {
        const prepared=await prepare(initial);if(!valid())throw Error('準備期間來源已改變，請重新匯出');
        const native=await start(prepared,valid,()=>refresh());
        if(!native||typeof native.stop!=='function'||!native.done)throw Error('錄製器未啟動');
        if(!valid()){native.stop(false);await native.done;throw Error('啟動期間來源已改變');}
        owned={native,prepared,initial,epoch};phase='recording';state();
        const value=await native.done;
        if(!valid()||value===null)throw Error('影片匯出已取消，未建立可下載成果');
        if(!value||!Number.isSafeInteger(value.size)||value.size<=0||value.size>128*1024*1024)throw Error('影片輸出無效或超過 128 MiB');
        result=value;resultKey=key(initial);phase='ready';return true;
      }catch(error){if(epoch===token){phase='failed';result=null;onError(error);}return false;}
      finally{inFlight=false;if(owned?.epoch===epoch)owned=null;if(epoch===token)state();}
    }
    function refresh() {
      if(!owned){if(resultKey&&key(capture())!==resultKey){result=null;resultKey=null;phase='idle';state();}return;}
      const s=capture();
      if(!s.allowed||key(s)!==key(owned.initial)){cancel();return;}
      try{draw(owned.prepared,position());}catch(error){onError(error);cancel();}
    }
    function cancel(){++token;const current=owned;owned=null;phase='idle';result=null;resultKey=null;current?.native.stop(false);state();}
    return {begin,refresh,cancel,dispose:cancel,state:()=>({phase,result})};
  }
  const api=Object.freeze({plan,frame,dimensions,wrap,checkCanvas,draw,withDuration,createRecorder});
  if(node)module.exports=api;else root.MusicMVRender=api;
})(typeof globalThis==='object'?globalThis:this);
