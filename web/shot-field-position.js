// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
 const P=typeof module==='object'&&module.exports?require('./editor-field-position.js'):root.MusicEditorFieldPosition;
 const api=Object.freeze({scrollOffset:P.scrollOffset});if(typeof module==='object'&&module.exports)module.exports=api;else root.MusicShotFieldPosition=api;
})(typeof globalThis==='object'?globalThis:this);
