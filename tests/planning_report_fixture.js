// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
const E=require('../web/editor-state.js');
function draft(){
 const panels=Object.fromEntries(Object.entries(E.draftFields).map(([name,fields])=>[name,{fields:Object.fromEntries(fields.map(k=>[k,'']))}]));
 for(const [name,row] of Object.entries(E.draftRows))panels[name][row.key]=[];
 panels.music.avoid=[];panels.music.deliverables=[];panels.storyboard.motifs=[];
 panels.lyrics.fields['lyrics-format']='.lrc';panels.audio.fields['audio-profile']='video';
 return {format:'zoe-music-lab-draft',schema_version:3,tool_version:'0.67.0',saved_at:'2026-10-05',tab:'lyrics',panels};
}
function panel(operation){
 const p=draft().panels[operation];
 if(operation==='music'){p.fields['music-title']=' 原歌名\r\n🎵 ';p.fields['music-bpm']='未填';p.deliverables=[' 要完成\r\n'];p.sections=[Object.fromEntries(E.draftRows.music.columns.map(k=>[k,'']))];}
 else{p.fields['mv-title']='原片名🎵';p.fields['mv-ratio']='16:9';p.motifs=[{id:'motif-7',name:' 門 ',meaning:' 意義\r\n'}];p.shots=[Object.fromEntries(E.draftRows.storyboard.columns.map(k=>[k,k==='motif_id'?'motif-7':k==='screen_direction'?'neutral':'']))];}
 return p;
}
module.exports={draft,panel};
