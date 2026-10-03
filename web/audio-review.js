// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
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
    return {file:report.file,bytes:source.bytes,sha256:report.sha256,profile:report.profile,
      needsReview,status:needsReview?'有待確認項目':'本次技術條件通過',
      specifications,channels,warnings:structuredClone(report.warnings),duration:report.duration_seconds,
      leading:quiet.leading_seconds,trailing:quiet.trailing_seconds,quietRatio:quiet.quiet_frame_ratio,
      correlation:report.stereo_correlation===null?'不可測':String(report.stereo_correlation),
      blockAlign:source.block_align,byteRate:source.average_bytes_per_second};
  }
  async function inspect({selected,isCurrent,request,onResult}){
    const selection=selected(),file=selection.file,profile=selection.profile;
    if(!file)throw Error('先選擇 PCM WAV');
    if(!Number.isSafeInteger(file.size)||file.size<=0||file.size>64*1024*1024)throw Error('音檔需介於 1 byte 與 64 MiB');
    const current=()=>{const latest=selected();return isCurrent()&&latest.file===file&&latest.profile===profile;};
    try{
      const result=await request({file,profile});
      if(!current())return false;
      const review=buildReview(result.data);
      if(review.bytes!==file.size||review.profile!==profile)throw Error('音檔報告與這次選擇不一致，沒有替換結果');
      onResult(result,review);return true;
    }catch(error){if(current())throw error;return false;}
  }
  const api={buildReview,inspect};
  if(typeof module==='object'&&module.exports)module.exports=api;else root.MusicAudio=api;
})(typeof globalThis==='object'?globalThis:this);
