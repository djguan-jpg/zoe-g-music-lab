// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
  const node=typeof module==='object'&&module.exports;
  const drafts=node?require('./audio-acceptance.js'):root.MusicAudioAcceptance;
  const reviews=node?require('./audio-acceptance-review.js'):root.MusicAudioAcceptanceReview;
  const json=node?require('../musiclab/assets/json-document.js'):root.MusicJsonDocument;
  function inspect(document){
    if(document?.format==='zoe-audio-acceptance-review')return {document:reviews.validateReport(document).source,kind:'review'};
    return {document:drafts.validate(document),kind:'draft'};
  }
  function decode(raw,size){return inspect(json.decode(raw,{size,maxBytes:drafts.maxBytes,label:'接受條件檔案'}));}
  const api={inspect,decode};if(node)module.exports=api;else root.MusicAudioAcceptanceInput=api;
})(typeof globalThis==='object'?globalThis:this);
