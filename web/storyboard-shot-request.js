// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
 const node=typeof module==='object'&&module.exports;
 const Shared=node?require('./readiness-request.js'):root.MusicReadinessRequest;
 const Review=node?require('./storyboard-shot-review.js'):root.MusicStoryboardShotReview;
 const api=Object.freeze({createController:options=>Shared.createController({...options,checkedResult:Review.checkedResult})});
 if(node)module.exports=api;else root.MusicStoryboardShotRequest=api;
})(typeof globalThis==='object'?globalThis:this);
