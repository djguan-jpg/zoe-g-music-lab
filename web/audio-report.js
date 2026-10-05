// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
  const json=typeof module==='object'&&module.exports?require('../musiclab/assets/json-document.js'):root.MusicJsonDocument;
  const maxBytes=8*1024*1024;
  const reasons={below_gate:'沒有高於 -70 LUFS 絕對門檻的完整區塊',insufficient_duration:'音檔不足 400 ms，沒有完整量測區塊',
    unsupported_channels:'聲道位置未知；只支援單聲道與立體聲',unsupported_sample_rate:'響度取樣率範圍為 8000–192000 Hz'};
  const invalid=()=>{throw Error('音檔文字報告不完整或數字無效');};
  function decimal(value,places){
    if(!Number.isInteger(places)||places<0||places>8||typeof value!=='number'||!Number.isFinite(value))invalid();
    const scale=10**places,scaled=Math.abs(value)*scale;if(scaled>Number.MAX_SAFE_INTEGER-1)invalid();
    const units=Math.floor(scaled+.5),sign=value<0&&units?'-':'';
    const remainder=units%scale;
    return sign+(units-remainder)/scale+(places?'.'+String(remainder).padStart(places,'0'):'');
  }
  function integer(value){if(!Number.isSafeInteger(value)||value<0)invalid();return String(value);}
  function text(value){json.assertUnicode(value,'音檔文字報告');if(new TextEncoder().encode(value).length>maxBytes)invalid();return value;}
  function render(report){
    try{
      const lines=[`# ${text(report.file)}：音檔交付檢查\n`,`結果：${text(report.status)}\n`,
        `${integer(report.sample_rate)} Hz · ${integer(report.bit_depth)}-bit · ${integer(report.channels)} 聲道 · ${decimal(report.duration_seconds,6)} 秒\n`,
        '\n| 聲道 | Sample peak dBFS | RMS dBFS | DC offset | 滿刻度樣本 |\n|---|---|---|---|---|\n'];
      if(!Array.isArray(report.per_channel)||report.per_channel.length>32)invalid();
      for(const state of report.per_channel){const peak=state.peak_dbfs===null?'-∞（靜音）':decimal(state.peak_dbfs,3),rms=state.rms_dbfs===null?'-∞（靜音）':decimal(state.rms_dbfs,3);
        lines.push(`| ${integer(state.channel)} | ${peak} | ${rms} | ${decimal(state.dc_offset,8)} | ${integer(state.full_scale_samples)} |\n`);}
      const m=report.loudness;if(m.status!=='measured'&&!Object.hasOwn(reasons,m.status))invalid();
      const value=m.status==='measured'?`${decimal(m.integrated_lufs,6)} LUFS`:`不可測：${reasons[m.status]}`;
      const relative=m.relative_gate_lufs===null?'不可測':`${decimal(m.relative_gate_lufs,6)} LUFS`;
      lines.push(`\n## 整合響度\n\n${value}。\n`);
      lines.push(`\n400 ms 區塊／100 ms 步進；完整區塊 ${integer(m.complete_block_count)}，絕對門檻後 ${integer(m.absolute_gate_block_count)}，相對門檻後 ${integer(m.gated_block_count)}。相對門檻 ${relative}；末尾 ${integer(m.tail_frames)} 幀未形成下一完整區塊。\n`);
      lines.push('\n獨立實作 ITU-R BS.1770-5 Annex 1 K-weighting 與 -70 LUFS／-10 LU 門檻；未指定平台響度目標、未正規化、未量測 true peak，尚非完整規範認證。響度不可測不更改既有技術接受結果。\n');
      lines.push('\n## 本次接受條件\n\n| 項目 | 實際值 | 接受值 | 結果 |\n|---|---|---|---|\n');
      for(const [key,accept,unit] of [['sample_rate','rates','Hz'],['bit_depth','bits','bit'],['channels','channels','聲道']]){
        if(typeof report.checks[key]!=='boolean'||!Array.isArray(report.acceptance[accept]))invalid();
        lines.push(`| ${key} | ${integer(report[key])} ${unit} | ${report.acceptance[accept].map(integer).join(', ')} ${unit} | ${report.checks[key]?'符合':'不符'} |\n`);}
      lines.push('\n## 需確認項目\n\n');if(!Array.isArray(report.warnings))invalid();
      for(const item of report.warnings)lines.push(`- ${text(item)}\n`);if(!report.warnings.length)lines.push('本次技術條件沒有提醒項目。\n');
      lines.push('\n本工具預設不是平台通用交付標準。RMS 不是 LUFS，sample peak 不是 true peak。滿刻度樣本需聆聽確認；沒有評估音樂品質或授權。\n');
      lines.push(`\n來源 SHA-256：\`${text(report.sha256)}\`\n`);
      if(Object.hasOwn(report,'source_evidence')){const s=report.source_evidence;lines.push(`\n分析副本：${integer(s.bytes)} bytes；PCM format tag ${integer(s.wave_format_tag)}；block align ${integer(s.block_align)} bytes；byte rate ${integer(s.average_bytes_per_second)} bytes/s。\n`);
        lines.push('\n雜湊與量測使用同一次複製的位元組；不代表檔案系統的原子快照或著作權證明。\n');}
      if(Object.hasOwn(report,'quiet_regions')){const q=report.quiet_regions;lines.push(`\n安靜段（門檻 ${decimal(q.threshold_dbfs,0)} dBFS）：頭 ${decimal(q.leading_seconds,6)} 秒，尾 ${decimal(q.trailing_seconds,6)} 秒。\n`);
        lines.push(`\n立體聲相關性：${report.stereo_correlation===null?'不可測':decimal(report.stereo_correlation,6)}（不是音樂品質評分）。\n`);}
      return text(lines.join(''));
    }catch(error){if(error instanceof TypeError)invalid();throw error;}
  }
  const api=Object.freeze({render,decimal,maxBytes});
  if(typeof module==='object'&&module.exports)module.exports=api;else root.MusicAudioReport=api;
})(typeof globalThis==='object'?globalThis:this);
