// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
  const values=typeof module==='object'&&module.exports?require('./planning-values.js'):root.MusicPlanningValues;
  const json=typeof module==='object'&&module.exports?require('../musiclab/assets/json-document.js'):root.MusicJsonDocument;
  const format='zoe-audio-acceptance-draft',maxBytes=65536,maxInteger=Number.MAX_SAFE_INTEGER;
  const profiles={distribution:{rates:[44100,48000],bits:[16,24],channels:[1,2]},video:{rates:[48000],bits:[16,24],channels:[1,2]}};
  const keys=['rates','bits','channels'];
  const exact=(v,wanted)=>v&&typeof v==='object'&&!Array.isArray(v)&&Object.keys(v).length===wanted.length&&wanted.every(k=>Object.hasOwn(v,k));
  function validate(d){
    if(!exact(d,['format','schema_version','profile','custom','fields'])||d.format!==format||d.schema_version!==1||
      !Object.hasOwn(profiles,d.profile)||typeof d.profile!=='string'||typeof d.custom!=='boolean'||!exact(d.fields,keys)||
      !keys.every(k=>typeof d.fields[k]==='string'&&Array.from(d.fields[k]).length<=1024))throw Error('接受條件草稿欄位或版本不支援；目前條件保留');
    const checked=json.parse(JSON.stringify(d),{maxBytes,label:'接受條件草稿',allowBOM:false});
    return {format,schema_version:1,profile:checked.profile,custom:checked.custom,fields:Object.fromEntries(keys.map(k=>[k,checked.fields[k]]))};
  }
  const fingerprint=d=>JSON.stringify(validate(d));
  function exactInteger(raw){
    const value=values.number(raw);
    if(!Number.isSafeInteger(value)||value<=0)throw Error('接受值需為正整數');
    const normalized=Array.from(values.trim(raw),c=>/\p{Decimal_Number}/u.test(c)?String(values.number(c)):c).join('').replaceAll('_','');
    const match=/^[+]?([0-9]*)(?:\.([0-9]*))?(?:[eE]([+-]?[0-9]+))?$/.exec(normalized);
    if(!match)throw Error('接受值需為正整數');
    const fraction=match[2]||'',coefficient=(match[1]+fraction).replace(/^0+/,''),scale=Number(match[3]||0)-fraction.length;
    const trailing=coefficient.length-coefficient.replace(/0+$/,'').length;
    if(scale<0&&trailing<-scale)throw Error('接受值需為正整數；不捨入小數');
    return value;
  }
  function prepare(d){
    d=validate(d);const limits=structuredClone(profiles[d.profile]);
    if(d.custom)for(const key of keys){
      const parts=d.fields[key].replaceAll('，',',').split(',');
      if(parts.length>64)throw Error(`${key} 最多 64 個接受值`);
      const list=parts.map(exactInteger);
      if(!list.every(v=>Number.isSafeInteger(v)&&v>0))throw Error(`${key} 需填正整數，以逗號分隔`);
      limits[key]=list;
    }
    return {profile:d.profile,acceptance:limits};
  }
  function decode(raw,size){return validate(json.decode(raw,{size,maxBytes,label:'接受條件草稿'}));}
  function createController({capture,media=()=>null,replace,read,allowed=()=>true,events,onState=()=>{},onChange=()=>{},onError=()=>{}}){
    const initial=fingerprint(capture());let retained=null,pendingDownload=null,preview=null,sequence=0,listening=false;
    const current=()=>fingerprint(capture());
    function status(){
      const key=current(),dirty=key!==initial&&key!==retained;
      return {dirty,mode:!dirty?(key===retained?'retained':'initial'):pendingDownload?(key===pendingDownload.key?'download_unconfirmed':'changed_after_download'):'unretained',
        pendingDownload:!!pendingDownload,preview:preview?structuredClone(preview.document):null,allowed:allowed()};
    }
    function beforeLeave(event){let dirty=true;try{dirty=status().dirty;}catch{}if(dirty){event.preventDefault();event.returnValue='';}}
    function refresh(){
      let value;try{value=status();}catch(error){value={dirty:true,mode:'unretained',pendingDownload:!!pendingDownload,preview:null,allowed:allowed(),error:error.message};}
      if(value.dirty&&!listening){events.addEventListener('beforeunload',beforeLeave);listening=true;}
      if(!value.dirty&&listening){events.removeEventListener('beforeunload',beforeLeave);listening=false;}
      onState(value);return value;
    }
    function cancel(){sequence++;preview=null;return refresh();}
    function changed(){cancel();onChange();}
    async function inspect(file){
      if(!allowed())return false;
      const token=++sequence;let key,source;
      try{key=current();source=media();}catch(error){onError(error);return false;}
      preview=null;refresh();
      const matches=()=>{try{return token===sequence&&allowed()&&current()===key&&media()===source;}catch{return false;}};
      try{
        if(!file||!Number.isSafeInteger(file.size)||file.size<1||file.size>maxBytes)throw Error('接受條件草稿最多 64 KiB');
        const document=decode(await read(file),file.size);
        if(!matches())return false;
        preview={document,key,source};refresh();return true;
      }catch(error){if(matches())onError(error);return false;}
    }
    function apply(){
      if(!preview||!allowed())return false;
      if(current()!==preview.key||media()!==preview.source){cancel();onError(Error('預覽後條件或音檔已改動；請重新選檔'));return false;}
      const document=validate(preview.document);replace(document);retained=fingerprint(document);sequence++;preview=null;onChange();refresh();return true;
    }
    function download(){
      if(!allowed())throw Error('目前操作尚未完成，請稍候');
      const document=validate(capture()),content=JSON.stringify(document,null,2)+'\n';
      pendingDownload={key:fingerprint(document)};refresh();return content;
    }
    function confirm(){if(!pendingDownload||!allowed())return false;retained=pendingDownload.key;pendingDownload=null;refresh();return true;}
    return {capture:()=>validate(capture()),inspect,apply,cancel,changed,refresh,download,confirm,status,
      projectLoaded(){cancel();if(capture().custom){replace({...validate(capture()),custom:false});onChange();}refresh();},
      dispose(){if(listening)events.removeEventListener('beforeunload',beforeLeave);listening=false;sequence++;preview=null;}};
  }
  const api={format,maxBytes,maxInteger,validate,prepare,decode,fingerprint,createController};
  if(typeof module==='object'&&module.exports)module.exports=api;else root.MusicAudioAcceptance=api;
})(typeof globalThis==='object'?globalThis:this);
