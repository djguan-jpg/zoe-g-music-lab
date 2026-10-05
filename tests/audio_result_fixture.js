// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
const version=require('../musiclab/assets/delivery-versions.js').current;
function wire(input){
 const data=structuredClone(input);data.tool='ZOE Audio Delivery';data.version=version;
 data.limitations=['PCM WAV only','RMS is not LUFS','sample peak is not true peak','full-scale samples indicate possible clipping; listening is required'];
 data.loudness??={format:'zoe-loudness-measurement',schema_version:1,algorithm:'ITU-R BS.1770-5 Annex 1 integrated loudness',unit:'LUFS',
  integrated_lufs:-23,status:'measured',absolute_gate_lufs:-70,relative_gate_lu:-10,relative_gate_lufs:-33,
  block_ms:400,hop_ms:100,complete_block_count:7,absolute_gate_block_count:7,gated_block_count:7,channel_weights:Array(data.channels).fill(1),window_frames:19200,tail_frames:0};
 const files={'report.json':JSON.stringify(data),'report.md':'# 合成測試報告\n'};
 if(data.acceptance_draft)files['audio-acceptance-draft.json']=JSON.stringify(data.acceptance_draft);
 return {data,files,meta:{version,protocol_version:1,needs_review:data.warnings.length>0}};
}
const hashFile=async()=> 'a'.repeat(64);
module.exports={wire,hashFile};
