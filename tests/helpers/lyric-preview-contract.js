// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
'use strict';
const {execFileSync}=require('node:child_process'),path=require('node:path');
module.exports=JSON.parse(execFileSync(process.platform==='win32'?'python':'python3',['-X','utf8','-c','import json;from musiclab.lyric_preview import preview_contract;print(json.dumps(preview_contract(),ensure_ascii=False))'],{cwd:path.join(__dirname,'../..'),encoding:'utf8',timeout:10000}));
