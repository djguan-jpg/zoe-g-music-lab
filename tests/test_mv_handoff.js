// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const H=require('../web/mv-handoff.js'),P=require('../web/mv-project.js'),C=require('../contracts/draft-v3.json');
function source() {
  const panels=Object.fromEntries(Object.entries(C.fields).map(([p,fields])=>[p,{fields:Object.fromEntries(fields.map(f=>[f,'']))}]));
  for(const [p,row] of Object.entries(C.rows))panels[p][row.key]=[];
  panels.music.avoid=[];panels.music.deliverables=[];panels.storyboard.motifs=[];panels.audio.fields['audio-profile']='video';panels.lyrics.fields['lyrics-format']='.json';
  const draft=P.seed({format:C.format,schema_version:3,tool_version:'0.171.0',saved_at:'2026-10-09T00:00:00Z',tab:'storyboard',panels},'  原文 🎵  \n下一句',1,4,'合成 MV');
  return {draft,shot_ids:['shot-1'],audio:{name:'CON.WAV',type:'audio/wav',bytes:new Uint8Array([1,2,3])},images:[{shot_id:'shot-1',asset:{name:'原圖.png',type:'image/png',bytes:new Uint8Array([4,5,6])}}]};
}
test('handoff snapshots original plan and raw buffers before asynchronous digests; fixed names exclude paths and Windows devices',async()=>{
  const s=source(),before=structuredClone(s),pending=H.prepare(s);s.audio.bytes[0]=9;s.images[0].asset.bytes[0]=9;s.draft.panels.lyrics.cues[0].text='changed';
  const saved=await pending,expected=await H.prepare(before);
  assert.deepEqual(saved.bytes,expected.bytes);assert.equal(saved.sha256,expected.sha256);
  assert.deepEqual(saved.manifest.files.map(e=>e.name),['subtitles.srt','music-video.plan.json','README.md','audio-source.wav','image-0001.png']);
  assert.equal(saved.manifest.files.at(-1).shot_id,'shot-1');assert.equal(saved.manifest.creative_acceptance,false);
});
test('handoff rejects incomplete or overlapping cue ranges and unsafe or unavailable media',async()=>{
  const mutations=[s=>s.draft.panels.lyrics.cues[0].end='',s=>s.draft.panels.lyrics.cues[0].text=' ',s=>s.draft.panels.lyrics.cues[0].text='a\0b',s=>s.draft.panels.lyrics.cues[0].end='4',s=>s.audio=null,s=>s.audio.name='../x.wav',s=>s.images[0].shot_id='other',s=>s.images.push(s.images[0])];
  for(const change of mutations){const s=source();change(s);const before=structuredClone(s);await assert.rejects(H.prepare(s));assert.deepEqual(s,before);}
});
test('handoff keeps literal HTML-like text in the Agent plan and marks the output as requiring creative review',async()=>{
  const s=source();s.draft.panels.lyrics.cues[0].text='<b>literal & text</b>';s.audio.name='sound.unknown';
  const saved=await H.prepare(s);assert.equal(saved.manifest.files.find(e=>e.role==='audio').name,'audio-source.bin');
  assert.equal(saved.manifest.subtitle_time_source,'current_explicit_cue_boundaries');assert.equal(saved.manifest.media_transcoded,false);
});
