# v0.19.0 驗證紀錄

2026-10-03 · Windows／Python標準函式庫／既有Node／Codex IAB。只讀本次新工作區與通用指引，需求與媒體皆合成資料。收據在outputs/v19-qa，不進Git；精確commit封裝與遠端下載以manifest與release-remote-evidence.json為準。

| 檢查 | 實際結果 |
|---|---|
| 基線 | application與真CLI的v0.18完整JSON回讀丟原標題、10秒total變2秒／estimated；未知包schema999仍抽cues接受 |
| Python | 168 tests通過，新增12項包契約／精度／來源／Unicode／大小／版本／CLI另一cwd與BOM／覆寫拒絕／HTTP／JSON-lines壞後好／MCP握手與EOF |
| JavaScript | 206 tests通過，新增17項真Python資料／strict JSON重複鍵及跳脫同名／溢位／版本／來源／legacy／clone／notice／revise／buildRequest／controller／真正standalone apply VM |
| 共用adapter | 真CLI SRT→包→完整回讀保持title與10秒；JSON-lines檢查與推估產物、MCP initialize／六tool list／lyrics_validate call／EOF；真HTTP200／400與靜態模組 |
| 預覽與轉換 | CLI包選檔先預覽、取消保留；Enter套用名稱／10秒／0–2cue。舊完整包明確轉換後canonical source1、原音檔保持；限定undo回復 |
| 時長與版本 | provided10與目前20衝突拒絕，保持音檔／編修；改回10.000可重試。Agent／MCP包實際預覽／套用；schema2及duplicate schema_version拒絕、不替換現有cue |
| 晚回應 | 兩筆4秒HTTP收據，成功與受控500期間改cue，新文字保持、舊預覽不復活、過期錯誤不顯示 |
| 推估來源 | start1／end4包已有10秒音檔時保持10.000／同一blob；build provided10仍保留inferred_count1／tail true與說明。空白時長不填估計、下載仍estimated4；新提示與實際行為相符 |
| 離線下載 | 真CLI HTML保留0–2cue／total10；估計HTML無音檔下載total4／來源提示。接10秒自製WAV後provided10仍保留曾補句尾與總長更改提示，真CLI回讀一致 |
| 真正下載 | 七份JSON／draft分別402／381／396／461／484／417／6326bytes，SHA見downloads-evidence。工作台CRLF與Python LF不同，JSON語義一致。offline Blob事件超時，精確已知合成檔名／原生bytes／時間核實，不因超時重送 |
| 草稿回讀 | 實檔draft3／tool0.19.0保留source包1；重載後選檔先預覽，Enter才載入，恢復title／10.000／cue1–4／來源JSON，音檔需另選。重建仍保留推估來源 |
| 行動DOM | tab23 CDP390×844，innerWidth／documentWidth均390、轉換按鈕160px；Enter焦點「歌詞 1 開始」。browser viewport API未改21/22的1280，這兩頁記桌面；CDP與viewport已清除 |
| 模組與限制 | 四Skill／十七JS語法／diff通過，無新增依賴。26個實際case，三頁error／warn空。無截圖／完整視覺、正式實聽、ASR／生成媒體、LUFS／true peak、其他OS／瀏覽器或特定Host證據 |
| 備份測試 | 初次failure僅暫態.write-lock初始化bytes不穩；競爭測試排除此協調檔，完整版本／manifest／重用／資料bytes斷言保持；生產鎖未改 |
| 前版還原 | 原v0.18 ZIP411169bytes，SHA058127e3574ccceb2f78905a7ffb31ae2524a5d28fc4e5b45d3e2d9b707c956b；safe entries／CRC／解壓156Python／189JS通過 |

QA只綁127.0.0.1:8875。exec76753／PID303484經qa-stop正常exit0／server_closed，tab21/22/23關閉。合成HTML QA路由只使用script/style SHA CSP，production CSP未改。封裝與發布終態、8875與已確認PID／outputs盤點見inventory-final。

保留最新三封裝v19／v18／v17；更舊未滿七天也保留，無符合清除條件的產物／刪除0。草稿／備份／原始媒體不是Git可重建候選。授權與創辦Git blobs保持；Repo private、FreeTWAI未投稿／未確認創始人，滾動目標active。
