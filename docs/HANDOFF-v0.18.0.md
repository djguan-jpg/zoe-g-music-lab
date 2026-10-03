# v0.18.0 本輪交接

2026-10-03 · ZOE. G 發起 · djguan-jpg/zoe-g-music-lab（private）。前輪保存於docs/HANDOFF-v0.17.0.md。

## 還原與提交

分支codex/iteration-v0.18.0，自main 1ac2cf6f0140d48d1b2a60421d256410bbab5d6f開始；restore-v0.17.0-before-v0.18.0指向起點。前版v0.17 ZIP394097bytes、SHA256 08b98926c7dee67110f2814dd217115903a8a427ea48a8d187e7b3401bc2c0c2，安全entries／CRC／解壓原版156Python／168JS通過。

本版指定commit封裝後private PR合併、v0.18.0 tag／Release；source／tree／ZIP SHA及真正遠端下載以manifest與outputs/v18-qa/release-remote-evidence.json為準。先保存未提交改動，再git switch -c codex/restore-v0.17.0 restore-v0.17.0-before-v0.18.0，或git archive到新目錄；main回寫以revert／PR，不reset／強推。程式與資料還原分開；草稿／備份／媒體不回退覆寫或自動遷移。

## 功能與分層

基線生產File.text adapter慢讀取覆蓋手動新原文，IAB按Read立即替換cue、無本次undo；TXT拒絕。新增web/lyrics-import.js純request／reply／draft提案與controller分層，原生arrayBuffer嚴格UTF-8、單BOM、byte界限，選檔前target snapshot與最新序列。讀取後及HTTP後先核對target，舊成功／錯誤／取消不提交；回應meta／cue／timing／JSON成果核對，無效資料拒絕。

選檔或手動Read先顯示完整原文／句數／前六句，明確Apply／Cancel。預覽不改原文／表格／成果；applyPlanningPanel限定lyrics，保留duration／audio／其他工作台。draft-undo記錄實際after，後續時間／文字編修拒絕整份撤回，其他panel編修保持。app以textContent顯示字面文字、readonly原文與Enter焦點；移除舊內部createLyricsFileImport adapter，26新測試取代五舊測試並擴充。

TXT接既有lyrics_seed1，原文／重複／行號／空白保留，時間留白，存在draft3原有lyrics-source .json；SRT多行合單行但原文保留，LRC補結束與缺音檔時長估計明示。帶時間JSON依目前title／duration驗證，起稿JSON名稱保持；來源檔不改寫。HTTP只新增靜態模組，application／CLI／JSON-lines／MCP原操作沿用，沒有新依賴／protocol／持久欄位。

產品0.18.0，Agent1／MCP2025-11-25／draft3／lyrics seed1／storyboard seed1／library1／backup1保持，六／十一工具。沒有Host安裝／全域設定、模型／外網呼叫。LICENSE／NOTICE／LICENSING／FOUNDER-RECORD保持，PolyForm Noncommercial 1.0.0不另授AGPL或商用，ZOE. G及Codex協作如實記錄。Repo private；FreeTWAI未投稿／未核實創始人。

## 驗證與限制

156Python／189JS、四Skill／十六JS語法／diff通過。28個IAB情境含TXT／字幕／真正CLI／JSON-lines／MCP產物接續、預覽／取消／明確套用／限定撤回、同一音檔保持、4秒晚成功／500保留、取消／最新檔、未知版本／無效UTF8、未校時拒絕、推測時長不寫入欄位、三格式與draft實檔／讀回、390×844 DOM及Enter，詳見docs/QA-v0.18.0.md。

下載seed815bytes、draft7025、JSON396、SRT101、LRC53，SHA見downloads-evidence.json。Windows CRLF與Python LF bytes不同，JSON語義與換行正規化文字相符；TXT原CRLF保留於seed source_text及draft3內來源，合成輸入未改。精確commit封裝另跑全套與Agent／MCPmetadata。沒有截圖／完整視覺、其他OS／瀏覽器、正式作品實聽、ASR／媒體生成、LUFS／true peak或特定host證據；滾動目標active。

## 產物與程序

outputs/v18-qa存本輪合成原檔、真實下載、檢查／還原／封裝／發布與遠端收據，不進Git。草稿／備份／媒體不是Git可重建清除候選。最新三封裝v18／v17／v16保留，更舊未滿七天仍保留；只有超過七天且tag／已驗遠端可重建的本專案產物可清除。本輪沒有符合條件的刪除。

基線HTTP exec81698/PID292508、新版exec19218/PID302248均QA stop正常exit0／server_closed；tab20關閉、viewport reset。最終8875／確認PID及封裝／發布終態、outputs盤點記inventory-final。只處理本輪確認程序，沒有持久服務／監控。只讀本次新工作區與通用指引，不參考其他使用者專案／記憶／GitHub。
