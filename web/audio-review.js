// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
  const acceptance=typeof module==='object'&&module.exports?require('./audio-acceptance.js'):root.MusicAudioAcceptance;
  const json=typeof module==='object'&&module.exports?require('../musiclab/assets/json-document.js'):root.MusicJsonDocument;
  const statistics=typeof module==='object'&&module.exports?require('./audio-statistics.js'):root.MusicAudioStatistics;
  const same=(a,b)=>typeof a===typeof b&&(a===null||typeof a!=='object'?a===b:Array.isArray(a)?Array.isArray(b)&&a.length===b.length&&a.every((v,i)=>same(v,b[i])):b!==null&&!Array.isArray(b)&&Object.keys(a).length===Object.keys(b).length&&Object.keys(a).every(k=>Object.hasOwn(b,k)&&same(a[k],b[k])));

  function buildLoudness(report){
    const invalid=()=>{throw Error('響度報告不完整或版本不支援，沒有替換目前結果');};
    const m=report.loudness,finite=v=>typeof v==='number'&&Number.isFinite(v);
    if(m===undefined){
      const version=typeof report.version==='string'?report.version.split('.').map(Number):[];
      if(version.length===3&&version.every(Number.isSafeInteger)&&(version[0]>0||version[1]>=22))invalid();
      return {status:'legacy_unavailable',value:'未提供',note:'這份舊報告未量測整合響度；請重新分析音檔。',blocks:null};
    }
    if(!m||m.format!=='zoe-loudness-measurement'||m.schema_version!==1||
      m.algorithm!=='ITU-R BS.1770-5 Annex 1 integrated loudness'||m.unit!=='LUFS'||
      m.absolute_gate_lufs!==-70||m.relative_gate_lu!==-10||m.block_ms!==400||m.hop_ms!==100||
      !Number.isSafeInteger(report.frames)||report.frames<=0||
      report.frames>Math.floor(report.source_evidence.bytes/report.source_evidence.block_align)||
      Math.abs(report.frames/report.sample_rate-report.duration_seconds)>.00000051||
      !Array.isArray(m.channel_weights))invalid();
    const fields=['complete_block_count','absolute_gate_block_count','gated_block_count','tail_frames'];
    if(fields.some(k=>!Number.isSafeInteger(m[k])||m[k]<0)||
      m.gated_block_count>m.absolute_gate_block_count||m.absolute_gate_block_count>m.complete_block_count)invalid();
    const unsupported=report.channels>2?'unsupported_channels':report.sample_rate<8000||report.sample_rate>192000?'unsupported_sample_rate':null;
    const reasons={unsupported_channels:'聲道位置未知；只支援單聲道與立體聲。',
      unsupported_sample_rate:'響度取樣率範圍為 8000–192000 Hz。',
      insufficient_duration:'音檔不足 400 ms，沒有完整量測區塊。',below_gate:'沒有高於 −70 LUFS 絕對門檻的完整區塊。'};
    if(unsupported){
      if(m.status!==unsupported||m.integrated_lufs!==null||m.relative_gate_lufs!==null||m.window_frames!==null||
        m.channel_weights.length||m.complete_block_count||m.absolute_gate_block_count||m.gated_block_count||m.tail_frames!==report.frames)invalid();
      return {status:m.status,value:'不可測',note:reasons[m.status],blocks:null};
    }
    const window=Math.floor((4*report.sample_rate+5)/10),difference=report.frames-window;
    if(!Number.isSafeInteger(10*difference+4))invalid();
    const count=difference<0?0:Math.floor((10*difference+4)/report.sample_rate)+1;
    const tail=count?report.frames-window-Math.floor(((count-1)*report.sample_rate+5)/10):report.frames;
    if(m.window_frames!==window||m.complete_block_count!==count||m.tail_frames!==tail||
      m.channel_weights.length!==report.channels||m.channel_weights.some(v=>v!==1))invalid();
    if(count===0){
      if(m.status!=='insufficient_duration'||m.integrated_lufs!==null||m.relative_gate_lufs!==null||m.absolute_gate_block_count||m.gated_block_count)invalid();
    }else if(m.absolute_gate_block_count===0){
      if(m.status!=='below_gate'||m.integrated_lufs!==null||m.relative_gate_lufs!==null||m.gated_block_count)invalid();
    }else if(m.status!=='measured'||!finite(m.integrated_lufs)||!finite(m.relative_gate_lufs)||
      m.relative_gate_lufs< -80-.000001||m.integrated_lufs< -70-.000001||
      m.integrated_lufs+.000001<m.relative_gate_lufs+10||m.gated_block_count<1)invalid();
    return {status:m.status,value:m.status==='measured'?`${m.integrated_lufs.toFixed(3)} LUFS`:'不可測',
      note:m.status==='measured'?'依完整區塊與門檻量測；請另行核對收件方的響度要求。':reasons[m.status],
      blocks:`完整 ${count} · 絕對門檻後 ${m.absolute_gate_block_count} · 相對門檻後 ${m.gated_block_count}`,
      relative:m.relative_gate_lufs===null?'不可測':`${m.relative_gate_lufs.toFixed(3)} LUFS`,tailFrames:tail};
  }
  function buildReview(report){
    const invalid=()=>{throw Error('音檔報告不完整，沒有替換目前結果');};
    const finite=value=>typeof value==='number'&&Number.isFinite(value);
    const positiveInteger=value=>Number.isSafeInteger(value)&&value>0;
    const optionalDb=value=>value===null||finite(value);
    if(!report||typeof report.file!=='string'||!['distribution','video'].includes(report.profile)||
      typeof report.sha256!=='string'||!/^[a-f0-9]{64}$/.test(report.sha256)||!positiveInteger(report.sample_rate)||
      ![8,16,24,32].includes(report.bit_depth)||!positiveInteger(report.channels)||report.channels>32||
      !finite(report.duration_seconds)||report.duration_seconds<=0||!Array.isArray(report.warnings)||
      report.warnings.some(w=>typeof w!=='string'))invalid();
    const quiet=report.quiet_regions,source=report.source_evidence;
    if(!quiet||quiet.threshold_dbfs!==-60||!finite(quiet.leading_seconds)||quiet.leading_seconds<0||
      !finite(quiet.trailing_seconds)||quiet.trailing_seconds<0||!finite(quiet.quiet_frame_ratio)||
      quiet.quiet_frame_ratio<0||quiet.quiet_frame_ratio>1||
      !(report.stereo_correlation===null||finite(report.stereo_correlation)&&Math.abs(report.stereo_correlation)<=1)||
      !source||!positiveInteger(source.bytes)||source.analysis_source!=='copied_bytes'||source.wave_format_tag!==1||
      source.block_align!==report.channels*report.bit_depth/8||source.average_bytes_per_second!==report.sample_rate*source.block_align)invalid();
    const specifications=[['sample_rate','rates','取樣率',report.sample_rate,'Hz'],
      ['bit_depth','bits','位元深度',report.bit_depth,'bit'],['channels','channels','聲道數',report.channels,'聲道']]
      .map(([key,accept,label,value,unit])=>{
        const allowed=report.acceptance?.[accept],passed=report.checks?.[key];
        if(!Array.isArray(allowed)||!allowed.length||!allowed.every(positiveInteger)||
          typeof passed!=='boolean'||passed!==allowed.includes(value))invalid();
        return {label,observed:`${value} ${unit}`,accepted:`${allowed.join(' / ')} ${unit}`,passed};
      });
    if(!Array.isArray(report.per_channel)||report.per_channel.length!==report.channels)invalid();
    const channels=report.per_channel.map((channel,i)=>{
      if(!channel||channel.channel!==i+1||!optionalDb(channel.peak_dbfs)||!optionalDb(channel.rms_dbfs)||
        !finite(channel.dc_offset)||!Number.isSafeInteger(channel.full_scale_samples)||channel.full_scale_samples<0)invalid();
      return {number:channel.channel,peak:channel.peak_dbfs===null?'−∞（數位靜音）':`${channel.peak_dbfs} dBFS`,
        rms:channel.rms_dbfs===null?'−∞（數位靜音）':`${channel.rms_dbfs} dBFS`,dc:String(channel.dc_offset),
        fullScale:channel.full_scale_samples};
    });
    const needsReview=report.warnings.length>0;
    if(report.status!==(needsReview?'needs_review':'technical_checks_passed')||
      specifications.some(s=>!s.passed)&&!needsReview)invalid();
    statistics.validate(report);
    return {file:report.file,bytes:source.bytes,sha256:report.sha256,profile:report.profile,custom:report.acceptance_draft?.custom===true,
      needsReview,status:needsReview?'有待確認項目':'本次技術條件通過',
      specifications,channels,warnings:structuredClone(report.warnings),duration:report.duration_seconds,
      leading:quiet.leading_seconds,trailing:quiet.trailing_seconds,quietRatio:quiet.quiet_frame_ratio,
      correlation:report.stereo_correlation===null?'不可測':String(report.stereo_correlation),
      blockAlign:source.block_align,byteRate:source.average_bytes_per_second,loudness:buildLoudness(report)};
  }
  async function inspect({selected,isCurrent,request,onResult}){
    const selection=selected(),file=selection.file,profile=selection.profile;
    if(!file)throw Error('先選擇 PCM WAV');
    if(!Number.isSafeInteger(file.size)||file.size<=0||file.size>64*1024*1024)throw Error('音檔需介於 1 byte 與 64 MiB');
    const document=selection.acceptanceDraft===undefined?null:acceptance.validate(selection.acceptanceDraft);
    if(document&&document.profile!==profile)throw Error('接受條件與這次示範選擇不同');
    const expected=acceptance.prepare(document||{format:acceptance.format,schema_version:1,profile,custom:false,fields:{rates:'',bits:'',channels:''}});
    const key=document?acceptance.fingerprint(document):null;
    const current=()=>{try{const latest=selected();return isCurrent()&&latest.file===file&&latest.profile===profile&&
      (latest.acceptanceDraft===undefined?key===null:acceptance.fingerprint(latest.acceptanceDraft)===key);}catch{return false;}};
    try{
      const result=await request({file,profile,...(document?{acceptanceDraft:document}:{})});
      if(!current())return false;
      const review=buildReview(result.data);
      if(review.bytes!==file.size||review.profile!==profile||!same(result.data.acceptance,expected.acceptance))throw Error('音檔報告與這次選擇或接受值不一致，沒有替換結果');
      if(document){
        const echoed=acceptance.validate(result.data.acceptance_draft);
        const source=acceptance.validate(json.parse(result.files?.['audio-acceptance-draft.json'],{maxBytes:acceptance.maxBytes,label:'接受條件回覆'}));
        const stored=json.parse(result.files?.['report.json'],{maxBytes:8*1024*1024,label:'音檔報告'});
        const filename=Array.from(file.name.replaceAll('\\','/').replace(/\/+$/,'').split('/').filter(p=>p!=='.').at(-1)||'selected.wav').slice(0,200).join('');
        if(acceptance.fingerprint(echoed)!==key||acceptance.fingerprint(source)!==key||!same(stored,result.data)||result.data.file!==filename)
          throw Error('報告來源或條件草稿不一致，沒有替換结果');
      }
      onResult(result,review);return true;
    }catch(error){if(current())throw error;return false;}
  }
  const api={buildReview,buildLoudness,inspect};
  if(typeof module==='object'&&module.exports)module.exports=api;else root.MusicAudio=api;
})(typeof globalThis==='object'?globalThis:this);
