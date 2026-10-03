# v0.30.0 驗證紀錄

2026-10-04，本機 Python 標準函式庫、Node 與 Codex IAB。本輪只讀本次工作區及通用工具指引，沒有參考其他本機作品、GitHub 專案、記憶或 vault。輸入皆為本專案原創合成資料。

## 基線與完整檢查

基線 main 為 21f997299c6576999801fd197a2a7c33a5c84f64；restore-v0.29.0-before-v0.30.0 保留該提交。IAB47 實際重現 BPM 120.0004 被 HTML step=0.001 攔下，焦點留 BPM、沒有成果；相同需求在既有 Python 完整服務接受，總長 136 秒。留白第三段任務則只顯示泛用錯誤，未定位原欄位。

本輪 249 Python、382 JavaScript、四份 Skill、29 個 JS 語法及 diff 檢查通過。新增三個 Python、15 個 JS 測試，涵蓋所有歌曲必填與數值範圍、可選歌詞／避免清單、400 項待辦完整計數與 200 明細界限、Unicode／8 MiB、同文字列 ID 順序、靜默編修、暫態清除、副本隔離及實際建立／起稿 handler。

真 Node 對 Python 的 69 組原始歌曲欄位案例包含 62 組無效、六組有效和一組欄位零待辦卻總長超限的需求；完整 music 與 storyboard_seed 各自接受或拒絕，原來源保持。另 29 組 shared number 對照 Python 有限 float／Unicode／底線規則。既有分鏡待辦與 planning-source 回歸也通過，沒有放寬完整領域驗證。

## 真瀏覽器與 Agent

IAB48 的 26 項 assertion 通過，詳細收據在 outputs/v30-qa/browser-evidence.json，console warning／error 為零。

- 建立與歌曲分鏡起稿先定位第三段原任務；空白歌名、BPM 19、2.5 小節、Unicode 空白需求及空交付清單各定位原欄位／新增控制，原值保持。
- 檢查不改歌曲、其他工作台或原音檔。排序、刪除和後續編修停用舊定位，重新檢查使用新原列位置；20 段共 28 項待辦，頁面明示前 20 項。範例及明確歌曲需求替換清暫態；限定撤回保留後續原編修和其他工作台。
- 實際 BPM 120.0004 建立歌曲包通過完整來源核對，BPM 精度保持、總長 136 秒。真四秒延遲請求停用檢查；期間編修原任務，晚回應保留前版 bytes 與後續輸入、停用下載，新建立恢復。沒有重送或重啟 job。
- 共享快照控制器的分鏡回歸：留白第三鏡畫面建立前定位原欄位，歌曲待辦保持；修復畫面後舊分鏡定位停用。
- 真 JSON-lines Agent 產生 17 鏡／136 秒起稿，原生 chooser 接續；預覽不改任何工作台。明確套用 17 個留白畫面鏡頭，限定撤回恢復四鏡；目前歌曲後續編修與原音檔保持。
- 390×844 尺寸下，Enter 檢查及待辦按鈕定位原任務。內容寬 375、檢查框 left 16／right 359／width 343，沒有頁面橫向溢出。暫時 viewport 已 reset。只有 DOM 幾何／互動，沒有完整視覺評審。

四個 native 歌曲實檔與 application／CLI／JSON-lines／MCP 對照。原生 CRLF 與 wire LF 只在文字比較時規範化，保留各自實際 bytes／SHA，不宣稱原 bytes 相同。CLI 預設第二次寫相同輸出拒絕且 bytes 保持；Agent／MCP 真正 EOF 正常退出，七工具保持。

實際 native 草稿 5886 bytes，SHA-256 21fac0b0827dfe0c03928f2b4c047950359fe206688b4768df4967298b458a30。產品 0.30.0／draft3、六段／原四鏡、BPM 原字串及處理中後續任務保持，暫態 ID／待辦／媒體不進檔；共用 Python 草稿驗證通過後才明確按「已確認草稿檔案」。

原生自有合成六秒 PCM 音檔，接續與撤回前後保留同一 blob 來源。沒有正式作品、實聽、實際音畫或原生 file 播放驗收。CUA 檢查初次使用錯誤的 status ID 已依實際 DOM 修正；產品未改，未重送原請求。

## 封裝與維護

前版 v0.29 ZIP 為 645099 bytes，SHA-256 7c826e4fcf7b2f7385822b28a09cd628a2e90c26e066be89fb44c035e680eb63；解壓後 246 Python／367 JS 通過，限定暫存正常移除。本版由指定提交封裝，解壓重跑完整 Python／JS 及 Agent／MCP metadata；詳細 commit、檔案 SHA 與結果以 Release manifest.json 和 outputs/v30-qa 收據為準。

private PR／合併／prerelease／遠端實際下載 bytes 與 refs 另以本輪收據核實。沒有配置 GitHub CI，本機檢查不宣稱遠端 CI。LICENSE／NOTICE／LICENSING／FOUNDER-RECORD 四個 Git blobs 保持。

owned 47／48 tabs 關閉，managed QA 服務正常 shutdown；只核對本輪確定 PID／8875 與本工作區 outputs。最新三版 ZIP 核對摘要；超過七天且有 Git tag／已驗遠端可重建才列清除候選，使用者草稿、備份及原素材不清。最終盤點以 inventory-final.json 為準。

完整視覺、正式媒體／實聽、特定 Agent Host、其他 OS／browser、原生 file 播放及 FreeTWAI 投稿／創始資格仍未完成；未嘗試繞過既有 file 政策阻擋。rolling goal 保持 active。
