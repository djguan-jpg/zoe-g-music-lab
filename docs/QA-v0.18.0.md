# v0.18.0 驗證紀錄

2026-10-03 · 本機Windows／Python標準函式庫／既有Node／Codex IAB。只讀本次新工作區與通用指引，使用自製合成資料。收據在outputs/v18-qa，不進Git；精確commit封裝與遠端下載見manifest及release-remote-evidence.json。

| 檢查 | 實際結果 |
|---|---|
| 基線重現 | 生產File.text adapter慢讀取覆蓋手動新原文；IAB v0.17按Read立即替換cue、沒有本次undo，TXT拒絕 |
| Python | 156 tests通過；既有domain、CLI／HTTP／JSON-lines／MCP與備份／保存測試保持，HTTP靜態asset加入lyrics-import.js |
| JavaScript | 189 tests通過；26新增controller／實際DOM handler測試取代五舊adapter測試，涵蓋慢讀取／新編修／晚成功錯誤／取消／最新檔／clone／矛盾reply／UTF8／BOM／大小／版本／限定undo |
| 模組與Skill | 十六JS語法、四Skill及diff通過；無新增依賴 |
| 預覽與取消 | LRC／SRT／TXT／Agent JSON／CLI及MCP seed均實際選檔先預覽；原表格0–3「目前已編修」保持，LRC取消不改原文或同一audio blob |
| 明確套用／撤回 | LRC兩句0–3／3–10，保留10.000時長及同一音檔，撤回恢復原表格與原文；其他歌曲工作台編修也保持 |
| TXT來源 | UTF8 BOM／CRLF，四句／行號1/3/4/5；前後空白、重複句與段落標籤保持，start/end留白。轉存既有seed1 JSON／draft3，真正下載source_text保留CRLF |
| SRT | 原始多行原文保留，cue為「第一行 / 第二行」及「結束」，明確結束2／5秒；預覽說明多行轉單行 |
| 四adapter接續 | 真正CLI lyrics-seed檔；JSON-lines lyrics子程序；MCP initialize／六tools list／lyrics_seed payload call／EOF。上述產物由IAB選檔與明確套用；帶時間JSON依目前title／duration驗證，seed名稱保持 |
| 直接原文 | 編修原文再Read只預覽；預覽後改cue再Apply拒絕，保留新文字 |
| 晚回應／500 | 五筆4秒HTTP收據含成功、受控500、取消與重選；晚成功／錯誤後目標新文字保持，過期錯誤未顯示。最新SRT預覽保持，舊LRC不復活 |
| 編修後撤回 | 套用後將第一句結束改2.5，undo拒絕，2.5與其他內容保持 |
| 拒絕與重試 | 非UTF8 TXT、seed schema2拒絕且既有表格／音檔保持；之後有效檔可預覽 |
| 手機與字面HTML | 390×844，documentWidth375、preview343、textarea309，body無橫溢出；十句只預覽六句但套用完整十句。script／img字面文字沒有DOM節點；Enter焦點「歌詞 1 開始」 |
| 真正下載 | seed815bytes、draft7025、JSON396、LRC53、SRT101。SHA見downloads-evidence.json；Windows CRLF下載，JSON語義／換行正規化文字與domain一致，不宣稱LF原bytes相同 |
| 草稿往返 | 真正draft schema3／tool0.18.0含完整來源JSON與四句留白；重載頁面後選檔先預覽，Enter明確載入才恢復。音檔需另選；再次Read來源起稿仍先預覽 |
| 未校時／沒音檔 | 空白時間匯出拒絕。未提供時長LRC預覽0–3／3–6，明示末句加3秒估計；套用後時長欄仍空白，沒有把估計當已提供 |
| Console／視覺 | 捕捉error／warn空。沒有截圖或完整視覺驗收；DOM幾何與操作不能替代完整視覺評審 |
| 前版還原 | v0.17 ZIP394097bytes，SHA256 08b98926c7dee67110f2814dd217115903a8a427ea48a8d187e7b3401bc2c0c2，安全entries／CRC／解壓原版156Python／168JS通過 |
| 程序 | 基線exec81698/PID292508及新版exec19218/PID302248均QA stop正常exit0／server_closed；tab20關閉、viewport reset。最終PID／8875／封裝／發布終態與outputs盤點見inventory-final |

產品0.18.0；Agent1／MCP2025-11-25／draft3／lyrics seed1／storyboard seed1／library1／backup1保持，六／十一工具。沒有host安裝、模型呼叫、ASR、正式作品實聽、音樂／影片生成、其他OS／瀏覽器或完整視覺證據。素材保留，不進Git；草稿／備份／媒體不是Git可重建清除候選。最新三封裝保留，更舊未滿七天仍保留，沒有符合條件的刪除。PolyForm Noncommercial、ZOE. G及private保持；FreeTWAI未投稿／未核實創始人，滾動目標active。
