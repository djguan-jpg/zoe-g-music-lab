// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
  function createAdapter(document,{readValue,writeValue,events,allowed,visible=()=>true,downloadText,onChange,onError}){
    const $=id=>document.getElementById(id),model=root.MusicAudioAcceptance,keys=['rates','bits','channels'];
    let sentSource=null,sentRevision=0,verification=null;
    const capture=()=>({format:model.format,schema_version:1,profile:readValue($('audio-profile')),custom:$('audio-custom').checked,
      fields:Object.fromEntries(keys.map(k=>[k,readValue($('audio-accept-'+k))]))});
    const replace=d=>{writeValue($('audio-profile'),d.profile);$('audio-custom').checked=d.custom;keys.forEach(k=>writeValue($('audio-accept-'+k),d.fields[k]));};
    const controller=model.createController({capture,replace,media:()=>$('audio-file').files[0]||null,read:file=>file.arrayBuffer(),decodeSelection:root.MusicAudioAcceptanceInput.decode,events,allowed,onChange,onError,
      onState:value=>{
        $('audio-custom-fields').hidden=!$('audio-custom').checked;
        $('audio-accept-preview').hidden=!value.preview;$('audio-accept-apply').disabled=!value.preview||!value.allowed;
        $('audio-accept-cancel').disabled=!value.allowed;
        $('audio-accept-file').disabled=!value.allowed;
        $('audio-accept-export-button').disabled=!value.allowed;$('audio-accept-confirm').disabled=!value.pendingDownload||!value.allowed;
        $('audio-accept-undo').disabled=!value.undoAvailable||!value.allowed;$('audio-accept-undo-note').hidden=!value.undoAvailable;
        const notes={initial:'接受條件尚未編修。',retained:'目前條件與已載入檔案或已確認的條件草稿一致。',unretained:'接受條件尚未另存；請下載條件草稿。',
          download_unconfirmed:'條件草稿下載已送出；核對檔案後再確認。',changed_after_download:'下載後條件又有改動，請另存目前條件。'};
        $('audio-accept-note').textContent=value.error||notes[value.mode];
        if(value.preview){
          $('audio-accept-preview-content').value=JSON.stringify(value.preview,null,2);
          let note;try{const prepared=model.prepare(value.preview);note=`套用後${value.preview.custom?'使用自訂值':'使用示範條件'}：${prepared.acceptance.rates.join(' / ')} Hz；${prepared.acceptance.bits.join(' / ')} bit；${prepared.acceptance.channels.join(' / ')} 聲道。`;}
          catch(error){note='草稿保留未完成原值，可以套用後繼續編修；分析前請補齊接受值。 '+error.message;}
          $('audio-accept-preview-note').textContent=(value.previewKind==='review'?'來自條件檢查報告；接續其中原始條件，音檔仍須另行分析。 ':'')+note;
        }
        verification?.refresh();
      }});
    keys.forEach(k=>$('audio-accept-'+k).addEventListener('input',()=>controller.changed()));
    $('audio-custom').addEventListener('change',()=>controller.changed());
    $('audio-profile').addEventListener('change',()=>controller.changed());
    $('audio-file').addEventListener('change',()=>controller.cancel());
    $('audio-accept-file').onchange=()=>{const file=$('audio-accept-file').files[0];$('audio-accept-file').value='';if(file)controller.inspect(file);};
    $('audio-accept-apply').onclick=()=>controller.apply();$('audio-accept-cancel').onclick=()=>controller.cancel();
    $('audio-accept-undo').onclick=()=>{const changed=controller.undo();if(changed)($('audio-custom').checked?$('audio-accept-rates'):$('audio-profile')).focus();return changed;};
    $('audio-accept-confirm').onclick=()=>controller.confirm();
    $('audio-accept-export').onsubmit=event=>{event.preventDefault();try{
      const content=controller.download(content=>{if(downloadText('audio-acceptance-draft.json',content)!==true)throw Error('條件草稿下載未送出');});
      sentSource={name:'audio-acceptance-draft.json',content};sentRevision++;verification.refresh();
    }catch(error){onError(error);}};
    verification=root.MusicTextVerificationDOM.bind(document,{
      capture:()=>({scope:'audio',revision:sentRevision,busy:!allowed(),dirty:false,visible:visible(),source:sentSource}),
      maxBytes:model.maxBytes,events,
      ids:{file:'audio-accept-verify-file',note:'audio-accept-verify-note',source:'audio-accept-verify-source',cancel:'audio-accept-verify-cancel'},
      emptyText:'先下載這輪條件草稿，再選回檔案核對。',sourceLabel:'本輪送出的條件草稿：',
      onReport:report=>{if(report.matched)controller.confirm();},onError
    });
    const dispose=controller.dispose;
    controller.dispose=()=>{verification.dispose();sentSource=null;sentRevision++;dispose();};
    controller.refresh();return controller;
  }
  root.MusicAudioAcceptanceDom={createAdapter};
})(typeof globalThis==='object'?globalThis:this);
