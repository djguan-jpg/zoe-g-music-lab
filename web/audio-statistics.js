// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
  // Integer PCM bounds only. Rounded measurements do not prove listening quality.
  function validate(report){
    const invalid=()=>{throw Error('音檔報告數值互相矛盾，沒有替換目前結果；請重新分析原音檔');};
    const finite=v=>typeof v==='number'&&Number.isFinite(v);
    const positive=v=>Number.isSafeInteger(v)&&v>0;
    const optionalDb=v=>v===null||finite(v)&&v<=0;
    if(!report||!positive(report.frames)||!positive(report.sample_rate)||!positive(report.channels)||report.channels>32||
      ![8,16,24,32].includes(report.bit_depth)||!finite(report.duration_seconds)||report.duration_seconds<=0||
      Math.abs(report.frames/report.sample_rate-report.duration_seconds)>.00000051)invalid();
    const source=report.source_evidence,quiet=report.quiet_regions,duration=report.duration_seconds;
    if(!source||!positive(source.bytes)||source.block_align!==report.channels*report.bit_depth/8||
      report.frames>Math.floor(source.bytes/source.block_align)||!quiet||
      !finite(quiet.leading_seconds)||quiet.leading_seconds<0||quiet.leading_seconds>duration||
      !finite(quiet.trailing_seconds)||quiet.trailing_seconds<0||quiet.trailing_seconds>duration||
      !finite(quiet.quiet_frame_ratio)||quiet.quiet_frame_ratio<0||quiet.quiet_frame_ratio>1||
      // An entirely quiet file counts its full duration at BOTH edges.
      quiet.leading_seconds+quiet.trailing_seconds>duration+.00000151&&
        !(quiet.leading_seconds===duration&&quiet.trailing_seconds===duration&&quiet.quiet_frame_ratio===1)||
      !(report.stereo_correlation===null||report.channels===2&&finite(report.stereo_correlation)&&Math.abs(report.stereo_correlation)<=1)||
      !Array.isArray(report.per_channel)||report.per_channel.length!==report.channels)invalid();
    for(const channel of report.per_channel){
      if(!channel||!optionalDb(channel.peak_dbfs)||!optionalDb(channel.rms_dbfs)||
        (channel.peak_dbfs===null)!==(channel.rms_dbfs===null)||
        channel.rms_dbfs!==null&&channel.rms_dbfs>channel.peak_dbfs||
        !finite(channel.dc_offset)||Math.abs(channel.dc_offset)>1||
        !Number.isSafeInteger(channel.full_scale_samples)||channel.full_scale_samples<0||channel.full_scale_samples>report.frames||
        channel.peak_dbfs===null&&(channel.dc_offset!==0||channel.full_scale_samples!==0))invalid();
    }
  }
  const api=Object.freeze({validate});
  if(typeof module==='object'&&module.exports)module.exports=api;else root.MusicAudioStatistics=api;
})(typeof globalThis==='object'?globalThis:this);
