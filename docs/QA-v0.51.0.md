# v0.51.0 驗證

441 Python／654 JavaScript／54語法／4 Skills與git diff --check通過。十三個新Python＋十三個新JS：SRT單行export roundtrip保留尾空白／tab／Unicode separator／BOM／HTML／inline clock，真正多行明確 / 且各行字面保留；ASCII空白行／可選index／CR-LF-CRLF／dot-comma／tab箭頭、單次BOM、無效時鐘／缺文字／超界／5000位hours、explicit shift／end／總長未確認、倒置／重疊拒絕。actual Python/Node corpus、CLI檔不變／JSON-lines錯後接續／MCP12工具／HTTPasset／script順序通過。controller拒絕self-consistent錯來源文字／time／end／count／inference、獨立LRC／SRT artifact替換與晚到回應；原draft／source／空宣告保留，retry通過。

baseline尾空白匯入被strip、U+0085／U+2028／U+2029被splitlines合成 /、direct BOM SRT被拒絕、browser接受與選定SRT無關但有效的cue bundle；實測後以分層修正。額外LRC Unicode offset候選的gap_unicode helper假設assert失敗exit1；後續新typed helper實測兩語言同start1，原LRC程式／測試恢復無差異，候選撤回、不宣稱bug。沒有重跑同run record。

原生tab85：146byte合成SRT preview保留原source／empty table／output／blank duration；cue1.125–2.5／4.5–5.875，原空白／tab／inline labels／Unicode保持，實際兩行合 /。Space Apply表格與JSON一致，estimated總長5.875／last_cue_end／inferred0且duration欄仍blank、提示尚未由音檔確認；原HTML<b>為字面，table／preview沒有b element。raw-fields保護CR／CRLF／tab，再讀原文同cue；取消保持。Undo原source／empty table／blank宣告，保留music title=v51 保留歌曲編修，舊成果標stale／下載停用。

秒60錯檔先觀察到reading pending，依原流程等待hidden後收到SRT分鐘／秒數需小於60，原source／table保持；不把中間狀態當拒絕完成。之後明確填宣告10、再選同SRT／Apply／Build，cues及SRT字面保持、provided10／estimatedfalse／inferred0。UI最後提示細分「原排版請保存原檔，空白句請以版本1 JSON保存」，全checks後只改這份HTML文字，fresh tab86確認最新提示，無其他source改動。法律與四Skill在commit gate再核對。

tab85三寬度390／1024／1800，doc scroll375／1009／1785，source／import right359／973.1640625／1299，提示寬343／721.328125／1027，無doc橫向溢出。tab85／86關閉、viewport reset、warn／error0。server PID349136／原session7177正常exit0、context closed／lazy staging未建立；輸入兩合成檔SHA保持。未使用實際音檔，不宣稱正式實聽或完整視覺驗收；本輪不再點瀏覽器下載，保存檔仍未驗證。

v50指定ZIP1059767bytes、SHAd48c5328f6ec4fe4c1b694150dded57aaf5fda0688c28b3f6d1c7db98fc96ffb，還原428／641通過、限定暫存移除。本輪指定source ZIP再全測；private PR／prerelease／actual遠端assets bytes-digest／CRC／legal4／source-main tree／refs-clean與latest51／50／49／typed jobs維護依outputs/v51-qa收據。>7天且exact Git/tag可重建才清除；failed v36／unknown／素材／draft／backup／其他程序保留。

SRT多行轉 / 不是原排版無損，ASCII空白cue需JSON；HTML preview未完整語義驗證。正式媒體／實聽、完整視覺、特定Agent Host、瀏覽器保存及FreeTWAI創始認定仍待；platform not_submitted，rolling active。
