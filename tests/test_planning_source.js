// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {execFileSync}=require('node:child_process'),Review=require('../web/planning-review.js'),Source=require('../web/planning-source.js');
const root=path.join(__dirname,'..');
const fixtures=JSON.parse(execFileSync(process.platform==='win32'?'python':'python3',['-X','utf8','-c',
  "import json,copy;from pathlib import Path;from musiclab.application import build;cases={};\nfor op,name in [('music','first-light-music.json'),('storyboard','first-light-mv.json')]:\n b=json.loads((Path('examples')/name).read_text(encoding='utf-8'));b['title']='  原創 '+op+'  ';cases[op]={'brief':b,'wire':build(op,b).wire()};f=copy.deepcopy(b);\n if op=='music':f['bpm']=80\n else:f['shots'][0]['visual']='另一份畫面';f['character_anchor']='另一份人物'\n cases['foreign_'+op]={'brief':b,'wire':build(op,f).wire()}\nprint(json.dumps(cases,ensure_ascii=False))"],{cwd:root,encoding:'utf8',timeout:10000}));
const item=op=>structuredClone(fixtures[op]);
async function check(op,brief,wire){let committed=0,model;await Review.inspect({operation:op,brief,isCurrent:()=>true,request:async()=>wire,onResult:(_r,m)=>{committed++;model=m;}});assert.equal(committed,1);return model;}
test('real spaced-title music and storyboard bind entire source and primary JSON without mutation',async()=>{
  for(const op of ['music','storyboard']){const c=item(op),before=structuredClone(c),m=await check(op,c.brief,c.wire);assert.equal(m.sourceChecked,true);assert.equal(m.title,c.brief.title.trim());assert.deepEqual(c,before);}
});
test('same-title self-consistent foreign music and storyboard cannot commit',async()=>{
  for(const op of ['music','storyboard']){const c=item('foreign_'+op);await assert.rejects(check(op,c.brief,c.wire),/不一致/);}
});
test('all music request fields bind even when a response keeps title and timing',()=>{
  const changes=[b=>b.language='另一種語言',b=>b.audience='另一位聽眾',b=>b.theme='另個核心',b=>b.style='另一曲風',b=>b.vocal='另一人聲',b=>b.memory_hook='另一記憶點',b=>b.existing_lyrics+='\n後續原文',b=>b.avoid.push('新限制'),b=>b.deliverables.pop(),b=>b.arrangement[0].name='另一段',b=>b.arrangement[0].bars=5,b=>b.arrangement[0].energy=4,b=>b.arrangement[0].focus='另個任務',b=>b.arrangement[0].texture='另一配置',b=>b.beats_per_bar=3];
  for(const change of changes){const c=item('music');change(c.brief);assert.throws(()=>Source.inspect('music',c.brief,c.wire),/不一致/);}
});
test('storyboard raw source binds all original shot fields, settings and motif meaning',()=>{
  for(const change of [b=>b.fps=30,b=>b.duration_seconds=61,b=>b.aspect_ratio='9:16',b=>b.visual_style+='後續',b=>b.character_anchor+='後續',b=>b.motifs[0].meaning+='後續',b=>b.shots[0].visual+='後續',b=>b.shots[0].transition+='後續',b=>b.shots[0].change_reason='後續理由']){const c=item('storyboard');change(c.brief);assert.throws(()=>Source.inspect('storyboard',c.brief,c.wire),/不一致/);}
});
test('wire data and downloadable plan JSON must match semantically for both operations',()=>{
  for(const op of ['music','storyboard']){const c=item(op),name=op==='music'?'music-plan.json':'storyboard.json',d=JSON.parse(c.wire.files[name]);d.title='錯誤成果';c.wire.files[name]=JSON.stringify(d);assert.throws(()=>Source.inspect(op,c.brief,c.wire),/不一致/);}
});
test('matching JSON files alone cannot hide source-derived music data changes',()=>{
  for(const change of [d=>d.sections[0].texture='異物',d=>d.lyric_units[0].text='改寫',d=>d.lyric_units[0].text_units++,d=>d.memory_hook='改寫',d=>d.review_notes.push('憑空判決'),d=>{d.sections[0].end+=.0008;d.sections[1].start+=.0008;},d=>{d.sections[0].end+=.0004;d.sections[1].start+=.0004;}]){const c=item('music');change(c.wire.data);c.wire.files['music-plan.json']=JSON.stringify(c.wire.data);assert.throws(()=>Source.inspect('music',c.brief,c.wire),/不一致/);}
});
test('matching storyboard files cannot hide changed visuals, continuity, frames or reminders',()=>{
  for(const change of [d=>d.shots[0].visual='改寫',d=>d.continuity[0].character_state='改寫',d=>d.frame_timeline.schema_version=999,d=>d.motifs[Object.keys(d.motifs)[0]]='改写',d=>d.review_notes.push({shot:1,message:'憑空判決'})]){const c=item('storyboard');change(c.wire.data);c.wire.files['storyboard.json']=JSON.stringify(c.wire.data);assert.throws(()=>Source.inspect('storyboard',c.brief,c.wire),/不一致/);}
});
test('duplicate keys including escaped same-name and nonfinite JSON refuse source files',()=>{
  for(const op of ['music','storyboard'])for(const extra of ['"title":"x"','"t\\u0069tle":"x"','"bad":1e999']){const c=item(op),name=op==='music'?'brief.json':'mv-brief.json';c.wire.files[name]=c.wire.files[name].trim().slice(0,-1)+','+extra+'}';assert.throws(()=>Source.inspect(op,c.brief,c.wire));}
});
test('reordered JSON objects and JSON whitespace keep valid semantic content',async()=>{
  for(const op of ['music','storyboard']){const c=item(op);for(const name of Object.keys(c.wire.files).filter(n=>n.endsWith('.json'))){const d=JSON.parse(c.wire.files[name]);c.wire.files[name]='\n'+JSON.stringify(Object.fromEntries(Object.entries(d).reverse()))+'\n';}await check(op,c.brief,c.wire);}
});
test('raw storyboard number-string representation remains original in source artifact',()=>{
  const c=item('storyboard');c.brief.fps=String(c.brief.fps);assert.throws(()=>Source.inspect('storyboard',c.brief,c.wire),/不一致/);
  c.wire.files['mv-brief.json']=JSON.stringify(c.brief);assert.equal(Source.inspect('storyboard',c.brief,c.wire),true);
});
test('number booleans, null and Python-invalid whitespace are not silently defaulted',()=>{
  for(const [key,value] of [['bpm',true],['beats_per_bar',null],['bpm','\x1c120\x1c'],['bpm','\ufeff120'],['bpm','0x78'],['avoid',null],['existing_lyrics',null]]){const c=item('music');c.brief[key]=value;assert.throws(()=>Source.inspect('music',c.brief,c.wire));}
});
test('bounded JSON file refusal cannot call result writer',async()=>{
  const c=item('music');c.wire.files['brief.json']=' '.repeat(Source.maxJsonBytes)+c.wire.files['brief.json'];await assert.rejects(check('music',c.brief,c.wire),/上限|超過|bytes|MiB/);
});
test('latest guard discards a foreign or corrupt response before source inspection',async()=>{
  for(const op of ['music','storyboard']){const c=item(op);let n=0;const answer=await Review.inspect({operation:op,brief:c.brief,isCurrent:()=>false,request:async()=>({broken:true}),onResult:()=>n++});assert.equal(answer,false);assert.equal(n,0);}
});
test('current source or JSON failure retains output callback and a corrected request recovers',async()=>{
  for(const op of ['music','storyboard']){const c=item(op);let count=0;const wrong=item('foreign_'+op).wire;
    await assert.rejects(Review.inspect({operation:op,brief:c.brief,isCurrent:()=>true,request:async()=>wrong,onResult:()=>count++}));assert.equal(count,0);
    await Review.inspect({operation:op,brief:c.brief,isCurrent:()=>true,request:async()=>c.wire,onResult:()=>count++});assert.equal(count,1);}
});
test('Agent brief readback uses same checked result and returns isolated canonical source and notes',()=>{
  for(const op of ['music','storyboard']){const c=item(op),before=structuredClone(c),value=Review.checkedBrief(op,c.brief,c.wire);
    assert.deepEqual(value.brief,JSON.parse(c.wire.files[op==='music'?'brief.json':'mv-brief.json']));
    value.brief.title='caller edit';value.notes.push('caller edit');assert.deepEqual(c,before);}
});
test('Agent brief readback rejects same-title foreign source and duplicate-key JSON before preview',()=>{
  for(const op of ['music','storyboard']){const c=item('foreign_'+op);assert.throws(()=>Review.checkedBrief(op,c.brief,c.wire),/不一致/);
    const valid=item(op),name=op==='music'?'brief.json':'mv-brief.json';valid.wire.files[name]=valid.wire.files[name].trim().slice(0,-1)+',"title":"again"}';assert.throws(()=>Review.checkedBrief(op,valid.brief,valid.wire),/重複/);}
});
