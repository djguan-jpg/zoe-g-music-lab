// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root) {
  // Native seeking is asynchronous even after currentTime reads back as zero.
  function rewind(player,valid) {
    return new Promise((resolve,reject)=>{
      let timer=null,finished=false;
      function cleanup(){clearTimeout(timer);player.removeEventListener('seeked',check);player.removeEventListener('error',failed);}
      function failed(){if(finished)return;finished=true;cleanup();reject(Error('播放器無法完成回到起點'));}
      function check(){if(finished)return;if(!valid()||player.error||Math.abs(player.currentTime)>.001){failed();return;}if(player.seeking)return;finished=true;cleanup();resolve();}
      player.addEventListener('seeked',check);player.addEventListener('error',failed);
      timer=setTimeout(failed,10000);
      try{player.currentTime=0;check();}catch{failed();}
    });
  }
  function createAudioCapture(player,Context=root.AudioContext||root.webkitAudioContext) {
    let owned=null,disposed=false;
    return Object.freeze({
      async get(){
        if(disposed||!player.currentSrc||typeof Context!=='function')throw Error('音檔不可錄製');
        if(!owned){
          const context=new Context();owned={context,source:null,destination:null};
          owned.source=context.createMediaElementSource(player);owned.destination=context.createMediaStreamDestination();
          owned.source.connect(context.destination);owned.source.connect(owned.destination);
        }
        await owned.context.resume();
        if(disposed||owned.context.state!=='running'||!owned.destination)throw Error('音軌啟動未通過確認');
        return owned.destination.stream;
      },
      dispose(){if(disposed)return;disposed=true;if(owned){owned.source?.disconnect();owned.destination?.stream.getTracks().forEach(t=>t.stop());void owned.context.close().catch(()=>{});}}
    });
  }
  const P=root.MusicMVProject,R=root.MusicMVRender;
  function bind({document,events,player,studio,capture,apply,loadAudio,onError=()=>{}}) {
    const $=id=>document.getElementById(id),listeners=[];
    const on=(el,type,fn)=>{el.addEventListener(type,fn);listeners.push([el,type,fn]);};
    const sender=root.MusicTextDownloadDom.createByteSender(document,{events});
    const captureAudio=createAudioCapture(player);
    let disposed=false,pending=false,revision=0,proposal=null,videoURL=null,quick=null;
    const note=text=>{$('mv-project-note').textContent=text;};
    function key(s) {
      const draft={...s.draft,saved_at:'',tab:'storyboard'};
      return JSON.stringify({draft,ids:s.shots.map(e=>e.id),audio:s.media.source,
        duration:s.media.duration,images:s.images.map(e=>[e.shot_id,e.url])});
    }
    function controls() {
      const active=recorder.state().phase,recording=['preparing','recording'].includes(active);
      const preparing=quick?.state().pending;
      for(const id of ['mv-project-save','mv-handoff-download','mv-project-open','mv-project-apply','mv-agent-plan','mv-video-start','mv-quick-create','mv-quick-apply'])$(id).disabled=disposed||pending||preparing||recording||!capture().allowed;
      $('mv-project-apply').disabled ||= !proposal;
      $('mv-quick-apply').disabled ||= quick?.state().phase!=='preview';
      $('mv-quick-images').disabled=$('mv-quick-textcard').checked;
      const selected=$('mv-quick-images').files.length,attached=capture().images.length;
      $('mv-quick-images-note').textContent=$('mv-quick-textcard').checked?'本次起稿只使用文字卡；確認後移除目前鏡頭圖片。':selected?`本次使用新選的 ${selected} 張圖片。`:attached?`未重新選圖時沿用目前 ${attached} 張圖片；仍會重新建立鏡頭時間與創作欄位。`:'最多 64 張；沒有圖片時使用文字卡。';
      $('mv-video-cancel').disabled=!recording;
    }
    function clearVideo() {const video=$('mv-video-playback');video.pause();video.removeAttribute('src');video.load();video.hidden=true;if(videoURL)URL.revokeObjectURL(videoURL);videoURL=null;$('mv-video-download').hidden=true;}
    const image=url=>new Promise((resolve,reject)=>{const art=new Image();art.onload=()=>resolve(art);art.onerror=()=>reject(Error('圖片無法解碼'));art.src=url;});
    async function audioCheck(file) {
      const url=URL.createObjectURL(file),audio=document.createElement('audio');
      try {
        const duration=await new Promise((resolve,reject)=>{
          const timer=setTimeout(()=>finish(Error('音檔時長讀取逾時')),10000);
          function finish(error) {clearTimeout(timer);audio.onloadedmetadata=audio.onerror=null;error?reject(error):resolve(audio.duration);}
          audio.onloadedmetadata=()=>finish();audio.onerror=()=>finish(Error('音檔無法播放'));audio.preload='metadata';audio.src=url;
        });
        if(!Number.isFinite(duration)||duration<=0)throw Error('音檔時長無效');return duration;
      }finally{audio.pause();audio.removeAttribute('src');audio.load();URL.revokeObjectURL(url);}
    }
    const fileFrom=item=>new File([item.bytes],item.name,{type:item.type});
    function assignAudio(file) {
      const transfer=new DataTransfer();transfer.items.add(file);$('lyrics-audio').files=transfer.files;
      if($('lyrics-audio').files.length!==1||$('lyrics-audio').files[0]!==transfer.files[0])throw Error('音檔選擇未通過回讀');
    }
    async function guard(task) {
      if(pending||quick?.state().pending||disposed||!capture().allowed||['preparing','recording'].includes(recorder.state().phase))return;
      pending=true;controls();const epoch=++revision;
      try{await task(epoch);}catch(error){if(!disposed){note(error.message);onError(error);}}
      finally{pending=false;if(!disposed)controls();}
    }
    for(const [id,tab] of [['mv-open-board','storyboard'],['mv-open-cues','lyrics']])on($(id),'click',()=>document.querySelector('[data-tab="'+tab+'"]').click());
    const current=(epoch,baseline)=>!disposed&&epoch===revision&&capture().allowed&&key(capture())===baseline;
    function quickCapture() {
      const s=capture(),selected=[...$('mv-quick-images').files],textcard=$('mv-quick-textcard').checked;
      return {source:s,key:JSON.stringify([key(s),s.media.ready,!!s.media.error,s.media.current_source]),audio:s.audio,title:$('mv-quick-title').value,text:$('mv-quick-lyrics').value,textcard,
        files:textcard?[]:selected.length?selected:s.images.map(e=>e.file),
        imageMode:textcard?'textcard':selected.length?'selected':'current',
        allowed:s.allowed&&!pending&&!['preparing','recording'].includes(recorder.state().phase)};
    }
    async function fileHash(file) {
      if(!file||!Number.isSafeInteger(file.size)||file.size<1||file.size>P.limits.media)throw Error('素材大小無效');
      const raw=await file.arrayBuffer();if(raw.byteLength!==file.size)throw Error('素材讀取大小不同');return P.hash(raw);
    }
    function targetMatches(s,draft,ids) {
      return root.MusicJsonDocument.sameValue({...s.draft,saved_at:'',tab:'storyboard'},{...draft,saved_at:'',tab:'storyboard'})&&
        JSON.stringify(s.shots.map(e=>e.id))===JSON.stringify(ids);
    }
    quick=root.MusicMVSeed.create({
      capture:quickCapture,
      prepare:async snapshot=>{
        const s=snapshot.source,files=snapshot.files;
        if(!s.audio||!s.media.ready||s.media.error||s.media.source!==s.media.current_source)throw Error('請先選擇可播放音檔');
        if(files.length>P.limits.images||files.reduce((sum,f)=>sum+f.size,s.audio.size)>P.limits.media)throw Error('音檔與圖片合計最多 64 MiB、64 張圖片');
        const draft=P.seed(s.draft,snapshot.text,files.length,s.media.duration,snapshot.title),audioSha=await fileHash(s.audio),hashes=[];
        let pixels=0;
        for(const file of files) {
          if(!/^image\/(png|jpeg|webp)$/.test(file.type)||file.size<1||file.size>P.limits.image)throw Error('請選擇 12 MiB 以下的 PNG、JPEG 或 WebP');
          const url=URL.createObjectURL(file);
          try{const art=await image(url);pixels+=art.naturalWidth*art.naturalHeight;if(pixels>40000000)throw Error('圖片合計最多四千萬像素');}
          finally{URL.revokeObjectURL(url);}
          hashes.push(await fileHash(file));
        }
        files.forEach((file,i)=>draft.panels.storyboard.shots[i].visual=file.name);
        return {draft,files:[...files],audio:s.audio,audioSha,hashes,duration:s.media.duration,imageMode:snapshot.imageMode,
          before:{cues:s.cues.length,shots:s.shots.length,images:s.images.length}};
      },
      replace:async(candidate,valid)=>{
        if(!valid())return false;
        const ids=candidate.draft.panels.storyboard.shots.map(()=> 'shot-'+crypto.randomUUID());
        studio.stop();apply(candidate.draft,ids);assignAudio(candidate.audio);await loadAudio($('lyrics-audio').files[0]);
        for(let i=0;i<candidate.files.length;i++) {
          if(!valid()||!targetMatches(capture(),candidate.draft,ids))throw Error('起稿期間工作台已改變；請核對目前內容');
          if(!await studio.selectImage(ids[i],candidate.files[i]))throw Error('圖片未完成載入，請核對工作台');
        }
        return {ids};
      },
      accept:async(candidate,receipt,valid)=>{
        const loaded=capture(),baseline=key(loaded);
        if(!receipt||!targetMatches(loaded,candidate.draft,receipt.ids)||loaded.images.length!==candidate.files.length||
          !loaded.media.ready||loaded.media.error||loaded.media.source!==loaded.media.current_source||Math.abs(loaded.media.duration-candidate.duration)>.001)return false;
        if(await fileHash(loaded.audio)!==candidate.audioSha)return false;
        for(let i=0;i<candidate.files.length;i++) {
          const attached=loaded.images.find(e=>e.shot_id===receipt.ids[i]);
          if(!attached||await fileHash(attached.file)!==candidate.hashes[i])return false;
        }
        if(!valid()||key(capture())!==baseline)return false;
        $('studio-loop-start').value='0';$('studio-loop-end').value=String(candidate.duration);studio.refresh();return true;
      },
      onView:view=>{
        $('mv-quick-review').hidden=view.phase!=='preview';
        if(view.phase==='preparing')note('正在準備起稿預覽；目前工作台與素材保留…');
        if(view.phase==='preview') {
          const c=view.proposal,images=c.imageMode==='selected'?`使用新選的 ${c.files.length} 張圖片`:c.imageMode==='textcard'?'改用文字卡':`沿用目前 ${c.files.length} 張圖片`;
          $('mv-quick-review-note').textContent=`「${c.draft.panels.lyrics.fields['lyrics-title']}」：${c.before.cues} 句 → ${c.draft.panels.lyrics.cues.length} 句，${c.before.shots} 鏡 → ${c.draft.panels.storyboard.shots.length} 鏡；${images}。以歌詞原文重新建立句子並均分 ${c.duration} 秒；目前逐句修訂、校時、母題及鏡頭創作會被替換，本輪成果需重新建立。其餘歌曲企劃與交付條件保留。`;
          note('起稿預覽已準備；確認建立後才替換目前內容。');
        }
        if(view.phase==='applying')note('正在建立並回讀核對試播草稿…');
        if(view.accepted)note('已建立並回讀核對均分時間的試播草稿、原音檔與圖片；請在波形校時修正實際起點。可保存素材專案或匯出 WebM。');
        controls();
      },onError:error=>{note(error.message);onError(error);}
    });
    on($('mv-quick-create'),'click',()=>void quick.preview());
    on($('mv-quick-apply'),'click',()=>void quick.apply());
    on($('mv-quick-cancel'),'click',()=>{quick.cancel();note('已取消起稿預覽；目前工作台與素材保留。');});
    async function save(epoch) {
      const s=capture(),baseline=key(s),attachments=s.images;
      if(!s.audio)throw Error('請先選擇音檔；素材專案會包含這份音檔');
      if(attachments.length>P.limits.images||attachments.reduce((sum,e)=>sum+e.file.size,s.audio.size)>P.limits.media)throw Error('音檔與圖片合計最多 64 MiB、64 張圖片');
      note('正在核對並封裝音檔與圖片…');
      const type=s.audio.type||({wav:'audio/wav',mp3:'audio/mpeg',m4a:'audio/mp4',flac:'audio/flac',ogg:'audio/ogg',aac:'audio/aac',webm:'audio/webm'}[s.audio.name.split('.').at(-1).toLowerCase()]||'');
      const audio=await P.pack(s.audio,type),images=[];
      for(const entry of attachments)images.push({shot_id:entry.shot_id,asset:await P.pack(entry.file)});
      if(!current(epoch,baseline))throw Error('保存期間企劃或素材已改變；請重新保存');
      const project=P.validate({format:'zoe-mv-project',schema_version:1,draft:s.draft,shot_ids:s.shots.map(e=>e.id),audio,images});
      const bytes=new TextEncoder().encode(JSON.stringify(project)+'\n');
      if(bytes.length>P.limits.json)throw Error('專案超過大小上限');
      sender.send({name:'music-video.zoemv.json',bytes});
      note(`已送出素材專案下載：音檔 1 份、圖片 ${images.length} 張，${bytes.length} bytes。請選回下載的檔案，確認素材與企劃可重開。`);
      $('mv-project-receipt').textContent='專案 SHA-256：'+await P.hash(bytes);
    }
    on($('mv-project-save'),'click',()=>void guard(save));
    on($('mv-handoff-download'),'click',()=>void guard(async epoch=>{
      const s=capture(),baseline=key(s),attachments=[...s.images];
      const valid=()=>current(epoch,baseline)&&capture().draft.tab==='storyboard'&&capture().audio===s.audio&&capture().media.ready&&!capture().media.error&&capture().media.source===capture().media.current_source&&
        capture().images.length===attachments.length&&attachments.every(e=>capture().images.some(now=>now.shot_id===e.shot_id&&now.file===e.file));
      if(!s.audio||!s.media.ready||s.media.error||s.media.source!==s.media.current_source)throw Error('請先選擇可播放的原音檔');
      if(attachments.length>P.limits.images||attachments.reduce((n,e)=>n+e.file.size,s.audio.size)>P.limits.media)throw Error('音檔與圖片合計最多 64 MiB、64 張圖片');
      note('正在核對原音檔、字幕與圖片，建立剪輯交接包…');
      async function read(file,type,image=false) {
        if(!Number.isSafeInteger(file.size)||file.size<1||file.size>(image?P.limits.image:P.limits.media))throw Error('素材大小無效');
        const raw=await file.arrayBuffer();if(raw.byteLength!==file.size)throw Error('選檔與讀取大小不同');
        if(!valid())throw Error('封裝期間內容或素材已改變；請重新下載交接包');
        return {name:file.name,type,bytes:new Uint8Array(raw)};
      }
      const type=s.audio.type||({wav:'audio/wav',mp3:'audio/mpeg',m4a:'audio/mp4',flac:'audio/flac',ogg:'audio/ogg',aac:'audio/aac',webm:'audio/webm'}[s.audio.name.split('.').at(-1).toLowerCase()]||'');
      const audio=await read(s.audio,type),images=[];
      for(const entry of attachments)images.push({shot_id:entry.shot_id,asset:await read(entry.file,entry.file.type,true)});
      const prepared=await root.MusicMVHandoff.prepare({draft:s.draft,shot_ids:s.shots.map(e=>e.id),audio,images});
      if(!valid())throw Error('封裝期間內容或素材已改變；請重新下載交接包');
      if(sender.send(prepared)!==true)throw Error('交接包下載未送出；請核對後再試');
      note(`已送出剪輯交接包下載：${prepared.manifest.subtitle_cue_count} 句字幕、1 份原音檔、${images.length} 張圖片。解開 ZIP 後，在原剪輯工具分別匯入素材與 subtitles.srt。`);
      $('mv-project-receipt').textContent='交接包 SHA-256：'+prepared.sha256;
    }));
    on($('mv-agent-plan'),'click',()=>void guard(async()=>{
      const s=capture();sender.send({name:'music-video.plan.json',bytes:new TextEncoder().encode(JSON.stringify({draft:s.draft,shot_ids:s.shots.map(e=>e.id)})+'\n')});
      note('已送出純文字企劃下載。Agent 可修訂四個工作台內容；使用 scripts/mv_project.py revise 核對原專案摘要後另存新版，素材沿鏡頭 ID 保留。');
    }));
    on($('mv-project-open'),'change',()=>{
      const file=$('mv-project-open').files[0];$('mv-project-open').value='';if(!file)return;
      void guard(async epoch=>{
        proposal=null;$('mv-project-review').hidden=true;
        if(!Number.isSafeInteger(file.size)||file.size<1||file.size>P.limits.json)throw Error('素材專案最多 92 MiB');
        const baseline=key(capture());note('正在核對專案、素材 SHA-256 與原生解碼；目前內容保留…');
        const bytes=await file.arrayBuffer();if(bytes.byteLength!==file.size)throw Error('選檔與讀取大小不同');
        const text=new TextDecoder('utf-8',{fatal:true,ignoreBOM:true}).decode(bytes),decoded=await P.materialize(P.parse(text));
        const audio=decoded.audio&&fileFrom(decoded.audio),images=[];let pixels=0;
        if(audio)await audioCheck(audio);
        for(const entry of decoded.images) {
          const selected=fileFrom(entry),url=URL.createObjectURL(selected);
          try{const art=await image(url);pixels+=art.naturalWidth*art.naturalHeight;if(pixels>40000000)throw Error('匯入圖片合計最多四千萬像素');}
          finally{URL.revokeObjectURL(url);}
          images.push({shot_id:entry.shot_id,file:selected});
        }
        if(!current(epoch,baseline))throw Error('讀取期間工作台已改變；請重新選擇專案');
        proposal={project:{...decoded.project,draft:{...decoded.project.draft,tool_version:capture().draft.tool_version}},audio,images,baseline};
        $('mv-project-review').hidden=false;$('mv-project-review-note').textContent=`${file.name}：${decoded.project.shot_ids.length} 鏡、${decoded.project.draft.panels.lyrics.cues.length} 句、${audio?'1 份音檔':'無音檔'}、${images.length} 張圖片。確認後替換四個工作台與素材。`;
        note('專案與全部素材核對通過；確認載入後才替換。');
        $('mv-project-receipt').textContent='匯入專案 SHA-256：'+await P.hash(bytes);
      });
    });
    on($('mv-project-cancel'),'click',()=>{revision++;proposal=null;$('mv-project-review').hidden=true;note('已取消專案預覽，目前內容保留。');controls();});
    on($('mv-project-apply'),'click',()=>void guard(async()=>{
      const selected=proposal;if(!selected||key(capture())!==selected.baseline)throw Error('目前企劃或素材已改變；請重新選擇專案');
      proposal=null;$('mv-project-review').hidden=true;studio.stop();
      apply(selected.project.draft,selected.project.shot_ids);
      if(selected.audio){assignAudio(selected.audio);await loadAudio($('lyrics-audio').files[0],{preserveDuration:true});}
      for(const entry of selected.images)if(!await studio.selectImage(entry.shot_id,entry.file))throw Error('圖片未完成載入；請核對目前工作台');
      const loaded=capture(),expected={...selected.project.draft,saved_at:'',tab:'storyboard'},actual={...loaded.draft,saved_at:'',tab:'storyboard'};
      if(!root.MusicJsonDocument.sameValue(actual,expected)||JSON.stringify(loaded.shots.map(e=>e.id))!==JSON.stringify(selected.project.shot_ids)||loaded.images.length!==selected.images.length)throw Error('載入回讀不符；請核對目前工作台');
      if(selected.audio) {
        await audioCheck(loaded.audio);
        if(await P.hash(await loaded.audio.arrayBuffer())!==selected.project.audio.sha256)throw Error('載入音檔回讀不符');
      }
      for(const entry of loaded.images)if(await P.hash(await entry.file.arrayBuffer())!==selected.project.images.find(e=>e.shot_id===entry.shot_id)?.asset.sha256)throw Error('載入圖片回讀不符');
      document.querySelector('[data-tab="storyboard"]').click();
      note(`已載入並回讀核對原企劃、${selected.audio?'音檔及':''}${selected.images.length} 張圖片。可保存素材專案或下載 Agent 企劃。`);
      studio.refresh();
    }));
    function nativeStart(prepared,valid,refresh) {
      return new Promise(async(resolve,reject)=>{
        let recorder=null,stream=null,audioStream=null,raf=null,timeout=null,complete=false,requested=false,success=false,size=0;
        const chunks=[],rate=player.playbackRate,source=player.currentSrc;let doneResolve,doneReject,started=null,elapsed=null,active=false;
        const done=new Promise((yes,no)=>{doneResolve=yes;doneReject=no;});
        // A late native error is observed even when startup rejects before handing ownership over.
        done.catch(()=>{});
        function cleanup() {
          if(raf!==null)cancelAnimationFrame(raf);clearTimeout(timeout);
          player.removeEventListener('ended',ended);
          for(const type of ['seeking','pause','ratechange'])player.removeEventListener(type,changed);
          stream?.getTracks().forEach(t=>t.stop());
          if(player.currentSrc===source){player.pause();if(player.playbackRate===1)player.playbackRate=rate;}
        }
        async function finish(error) {
          if(complete)return;complete=true;cleanup();
          if(error){doneReject(error);return;}
          if(!success){doneResolve(null);return;}
          try {
            const raw=new Uint8Array(await new Blob(chunks).arrayBuffer());
            const complete=R.withDuration(raw,elapsed);
            doneResolve(new Blob([complete],{type:prepared.mime}));
          }catch(error){doneReject(error);}
        }
        function stop(ok) {if(requested)return;requested=true;success=ok;elapsed=started===null?null:performance.now()-started;if(recorder&&recorder.state!=='inactive')recorder.stop();else void finish();}
        function ended(){if(active&&player.ended&&Math.abs(player.currentTime-prepared.plan.duration)<=.001)stop(valid());}
        function changed(){if(active&&(player.currentSrc!==source||player.seeking||(player.paused&&!player.ended)||player.playbackRate!==1))stop(false);}
        function paint() {
          if(requested)return;
          if(!valid()||player.currentSrc!==source||player.error||player.playbackRate!==1||player.seeking||(player.paused&&!player.ended)||document.hidden){stop(false);return;}
          refresh();R.draw(prepared.context,prepared.canvas,prepared.plan,player.currentTime,prepared.images);
          $('mv-video-note').textContent=`正在錄製 ${player.currentTime.toFixed(1)} ／ ${prepared.plan.duration.toFixed(1)} 秒；保持頁面開啟。`;
          raf=requestAnimationFrame(paint);
        }
        try {
          if(!valid())throw Error('音檔或企劃已改變');
          studio.stop();player.pause();player.playbackRate=1;await rewind(player,valid);
          if(player.playbackRate!==1||Math.abs(player.currentTime)>.001)throw Error('播放器無法回到原速與起點');
          R.draw(prepared.context,prepared.canvas,prepared.plan,0,prepared.images);
          audioStream=await captureAudio.get();if(!valid())throw Error('音檔或企劃已改變');
          const tracks=audioStream.getAudioTracks();if(tracks.length!==1||tracks[0].readyState!=='live')throw Error('瀏覽器未提供可錄製音軌；未匯出無聲影片');
          stream=new MediaStream([...prepared.canvas.captureStream(30).getVideoTracks(),tracks[0].clone()]);
          if(stream.getVideoTracks().length!==1)throw Error('瀏覽器未提供畫面串流');
          recorder=new MediaRecorder(stream,{mimeType:prepared.mime,videoBitsPerSecond:2500000,audioBitsPerSecond:128000});
          recorder.ondataavailable=e=>{if(!e.data.size)return;size+=e.data.size;if(size>128*1024*1024){success=false;chunks.length=0;stop(false);return;}chunks.push(e.data);};
          recorder.onerror=()=>{success=false;finish(Error('原生錄製失敗，未建立影片'));};
          recorder.onstop=()=>finish();player.addEventListener('ended',ended);
          for(const type of ['seeking','pause','ratechange'])player.addEventListener(type,changed);
          timeout=setTimeout(()=>stop(false),(prepared.plan.duration+15)*1000);
          started=performance.now();recorder.start(1000);await player.play();
          if(!valid()||player.paused||player.currentSrc!==source)throw Error('播放器啟動未通過確認');
          active=true;paint();resolve({done,stop});
        }catch(error){success=false;if(recorder?.state!=='inactive')try{recorder?.stop();}catch{}finish(error);reject(error);}
      });
    }
    const recorder=R.createRecorder({
      capture:()=>{const s=capture();return {key:key(s),allowed:s.allowed&&!pending&&!quick.state().pending&&['lyrics','storyboard'].includes(s.draft.tab)&&s.media.ready&&!s.media.error&&s.media.source===s.media.current_source};},
      prepare:async()=>{
        clearVideo();const s=capture(),plan=R.plan(s.shots,s.cues,s.media.duration),images=new Map();
        if(typeof MediaRecorder==='undefined'||typeof (root.AudioContext||root.webkitAudioContext)!=='function'||typeof HTMLCanvasElement.prototype.captureStream!=='function')throw Error('此瀏覽器未支援含音軌的 WebM 匯出；請使用 Chrome 或 Edge');
        const mime=['video/webm;codecs=vp9,opus','video/webm;codecs=vp8,opus'].find(t=>MediaRecorder.isTypeSupported(t));if(!mime)throw Error('瀏覽器沒有可用的 WebM 編碼器');
        if(s.images.length>P.limits.images||s.images.reduce((total,e)=>total+e.file.size,s.audio?.size||0)>P.limits.media)throw Error('影片素材合計最多 64 MiB、64 張圖片');
        let pixels=0;
        for(const e of s.images){const art=await image(e.url);pixels+=art.naturalWidth*art.naturalHeight;if(pixels>40000000)throw Error('影片圖片合計最多四千萬像素');images.set(e.shot_id,art);}
        const canvas=document.createElement('canvas'),size=R.dimensions(s.draft.panels.storyboard.fields['mv-ratio']);canvas.width=size.width;canvas.height=size.height;
        const context=canvas.getContext('2d');if(!context)throw Error('無法建立影片畫面');
        R.checkCanvas(context,canvas,plan,images);
        return {plan,images,canvas,context,mime};
      },start:nativeStart,draw:(prepared,seconds)=>R.draw(prepared.context,prepared.canvas,prepared.plan,seconds,prepared.images),position:()=>player.currentTime,
      onState:v=>{
        if(v.phase==='ready') {
          videoURL=URL.createObjectURL(v.result);$('mv-video-download').href=videoURL;$('mv-video-download').hidden=false;
          $('mv-video-playback').src=videoURL;$('mv-video-playback').hidden=false;
          $('mv-video-note').textContent=`WebM 草稿已完成，${v.result.size} bytes；含原音軌、分鏡圖／文字卡與歌詞。先試看，再下載。`;
        }else if(v.phase==='preparing')$('mv-video-note').textContent='正在核對完整時間與圖片…';
        else if(v.phase==='idle'){$('mv-video-note').textContent='已停止匯出；可重新準備。';clearVideo();}
        controls();
      },onError:error=>{$('mv-video-note').textContent=error.message;onError(error);}
    });
    on($('mv-video-start'),'click',()=>{if(!pending)void recorder.begin();});
    on($('mv-video-cancel'),'click',()=>recorder.cancel());
    on(document,'input',()=>{quick.refresh();recorder.refresh();controls();});on(document,'change',()=>{quick.refresh();recorder.refresh();controls();});
    on(document,'visibilitychange',()=>recorder.refresh());
    function projectLoaded(draft){if(disposed)return;if(quick.state().phase!=='applying')quick.cancel();$('mv-quick-title').value=draft.panels.lyrics.fields['lyrics-title'];$('mv-quick-lyrics').value=draft.panels.lyrics.fields['lyrics-source'];$('mv-quick-images').value='';$('mv-quick-textcard').checked=false;controls();}
    function dispose(){if(disposed)return;disposed=true;revision++;proposal=null;quick.dispose();recorder.dispose();captureAudio.dispose();sender.dispose();clearVideo();for(const [el,type,fn] of listeners)el.removeEventListener(type,fn);}
    on(events,'pagehide',dispose);controls();
    return {refresh:()=>{quick.refresh();recorder.refresh();controls();},projectLoaded,dispose};
  }
  const api=Object.freeze({bind,rewind,createAudioCapture});
  if(typeof module==='object'&&module.exports)module.exports=api;
  else root.MusicMVWorkflowDOM=api;
})(typeof globalThis==='object'?globalThis:this);
