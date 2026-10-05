// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
const F=require('./planning_report_fixture.js');
function revision(n='1',title='保存原案🎵'){
 const draft=F.draft();draft.panels.music.fields['music-title']=title;
 const entry={library_schema_version:1,id:'draft-'+n.repeat(32),label:'保存案 '+n,stored_at:'2026-10-05T01:02:03.123456+00:00',sha256:n.repeat(64),bytes:2048,draft_schema_version:3,created_with:'0.69.0',titles:Object.fromEntries([['music','music-title'],['storyboard','mv-title'],['lyrics','lyrics-title']].map(([s,k])=>[s,Array.from(draft.panels[s].fields[k]).slice(0,120).join('')]))};
 return {entry,draft,status:'draft_only_not_validated'};
}
module.exports={revision};
