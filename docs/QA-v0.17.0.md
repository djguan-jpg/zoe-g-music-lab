# v0.17.0 驗證紀錄

2026-10-03 · 本機Windows／Python標準函式庫／既有Node／Codex IAB。只使用本次新工作區合成資料與通用工具指引。精確commit封裝與真正遠端下載見manifest及outputs/v17-qa/release-remote-evidence.json。

| 檢查 | 實際結果 |
|---|---|
| 基線重現 | v0.16載入10秒合成WAV，清空cue開始／結束，「填入播放位置」拒絕；CLI沒有lyrics-seed操作 |
| Python | 156 tests通過，新增10：原文／重複／空白／行號、Unicode空白、UTF8byte／句數／title界限、版本／未知欄位／矛盾來源／clone，真正CLI BOM／CRLF／另一cwd／拒絕覆寫、HTTP assets／route、JSON-lines壞後好、MCP發現／生成／檢查／EOF |
| JavaScript | 168 tests通過，新增22：真正Python seed→draft3留白句、跨語言Unicode契約／UTF8界限、clone、來源／目標／晚成功／錯誤／取消／最新token／外部檔／meta與files矛盾、限定undo；實際位置／毫秒／start/end/move／越界／部分播放 |
| 發現清單 | 預設六工具／明確啟庫十一工具，新增lyrics_seed；既有library／backup等adapter測試通過，未改持久schema或權限 |
| 預覽／取消 | 四句及來源行1/3/4/5，只預覽不替換0–3秒原cue；取消後原cue／音檔保持 |
| 明確套用／復原 | 四句start/end空白，重複／前後空白／段落標籤保持；時長10.000及同一audio blob保持，未編修undo還原原cue |
| 編修保護 | 預覽後改目標文字拒絕套用並保留；套用後改時間拒絕undo；純模型另涵蓋來源變更與其他panels保持 |
| 晚回應／500 | 4秒生成起稿期間改歌曲來源、外部JSON讀取期間改target cue，晚成功無preview／保留新內容；受控500亦保留目標、過期錯誤不顯示。操作前後皆處理中 |
| CLI起稿回讀 | 真正lyrics-seed.json選檔／讀取先預覽、再明確套用；原檔保留，下載JSON語義等同CLI seed |
| 實際播放器 | 空白start先按end拒絕；start記0，波形ArrowRight兩次後end記1。其他3句留白，0.5秒時第一句播放文字及一列highlight正常 |
| 整句移動 | 0–1移到0.5–1.5，長度1秒／文字保持；9.5加句長超過10秒拒絕、表格保持 |
| 匯出 | 空白時間拒絕。人工標記0–1.5／2–3.5／4–5.5／6–7.5四句，驗證後建立LRC／SRT／JSON |
| 真正下載 | seed843bytes、lyrics JSON576、SRT207、LRC109、draft7005；SHA及actual paths見downloads-evidence.json。Windows下載CRLF，JSON語義／換行正規化文字與domain一致，不宣稱LF原bytes相同 |
| 草稿往返 | 真正draft schema3／tool0.17.0含來源seed JSON及四句時間；再次選檔先保持空白table，Enter明確載入才恢復四句時間／title／duration，audio需另選 |
| 未知版／沒音檔 | 起稿schema2拒絕且四句已校時table保持；頁面重載沒audio時stamp拒絕，空白時間不變 |
| 手機／焦點 | 390×844，documentWidth375、preview343px／textarea309px，body無橫溢出；table局部捲動。Enter套用焦點「歌詞1開始」，viewport reset |
| Console／指引 | error／warn捕捉空，四Skill／十五JS語法／diff通過；沒截圖或完整視覺驗收 |
| 前版還原 | v0.16 ZIP369560bytes，SHA256 1d46ead284df35ef0468b7325784b45bb71fd51ff6b47cb1b183f51759c0b193；entries／CRC／解壓原版146Python／146JS通過 |
| 程序 | 基線exec30311/PID283108及新版exec43146/PID212268均QA stop正常exit0/server_closed，tab19關閉、viewport reset；最後8875／PID／封裝與發布終態見inventory-final |

沒有正式歌曲實聽、ASR／對齊模型、音樂或影片生成、其他OS／瀏覽器、完整視覺評審或特定Agent host證據。段落標籤也是未校時句子，需人工調整；LRC只保留開始。使用者草稿／備份／媒體不進Git／封裝，不能列入Git可重建清除候選。非商用、署名及private保持；FreeTWAI未投稿／未核實創始人，滾動目標active。
