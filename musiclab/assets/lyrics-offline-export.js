// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
(function(root){
  const node=typeof module==='object'&&module.exports;
  const P=node?require('./lyrics-package.js'):root.MusicLyricsPackage,R=node?require('./lyrics-export-review.js'):root.MusicLyricsExportReview;
  const maxVisible=20;
  function createController({onView,focus}){
    let report=null,stale=true,revision=0;
    function view(){return report?{...structuredClone(report),stale,revision}:{cue_count:0,issue_count:0,issues:[],details_truncated:false,review_notes:[],stale:true,revision};}
    function emit(){onView(view());}
    function invalidate(){revision++;stale=true;emit();}
    function accept(value){
      try{const data=P.validate(value),analysis=R.analyze({package:data});
        report={cue_count:data.cues.length,issue_count:analysis.issue_count,issues:analysis.issues.slice(0,maxVisible),details_truncated:analysis.issue_count>maxVisible,review_notes:[...analysis.review_notes]};revision++;stale=false;emit();return view();
      }catch(error){invalidate();throw error;}
    }
    function locate(index,expectedRevision){if(expectedRevision!==revision||stale||!report||!Number.isInteger(index)||index<0||index>=report.issues.length)return false;return focus(report.issues[index].row-1)!==false;}
    return {accept,invalidate,view,locate};
  }
  const api={createController,maxVisible};if(node)module.exports=api;else root.MusicLyricsOfflineExport=api;
})(typeof globalThis==='object'?globalThis:this);
