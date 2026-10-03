# 迭代說明

## v0.11.0 — 2026-10-03

- 加入整批歌詞校時的預覽／明確套用／一次撤回；只改 start／end，音檔、後續文字與刪除歷史保留。其他時間改動／增刪句子阻止整份撤回；過期候選／晚回應不寫入。
- 共用 application 的 shift_seconds／time_changes／text_changes，CLI 不另編修。sorted original 1-based index、先 shift 再 set（保留明確句長）／text，再推缺失結束／完整驗證；非法結果不截斷，原來源與指定總長保留。
- 分離 Python lyric_timing、原生 lyric-time.js、離線 lyric_preview 及前端 lyrics-timing controller。half-away-from-zero 至毫秒；修正負的不足半毫秒被接受／跨語言捨入不一致、離線提示／timing 過期與結果排序後句子 ID 錯配。模板標記只替換一次，輸入標記文字保持原樣。
- Agent discovery 同源新增欄位；非零校時／非空編修標 needs_review。產品 0.11.0，預設四工具／啟庫九工具、Agent 1／MCP 2025-11-25／draft 3／library 1／backup 1 不變，暫態控制／撤回不進草稿。
- 112 Python／69 JavaScript／四 Skill／八 JS 語法／diff、實際 transport／CLI、IAB 工作台與獨立實檔下載、桌面／390px DOM 檢查通過；v0.10 ZIP 摘要核對／原版 99／55 通過。詳見 docs/QA-v0.11.0.md。
- PolyForm Noncommercial 1.0.0／LICENSE／NOTICE 保留，沒有依賴／host／模型新增。restore-v0.10.0-before-v0.11.0、指定提交封裝與 private PR／Release 見 HANDOFF.md／manifest。




## v0.10.0 — 2026-10-03

- 加入整庫／明確選 ID 的可攜 ZIP 備份、整份檢查／衝突預覽／恢復。保留原 ID、metadata、名稱、時間與草稿原始 bytes，只新增／重用完整相同版本，既有版本不覆寫。
- 分離 library_contract、draft_backup、CLI backup_files、HTTP backup_downloads 及前端 backup-transfer；HTTP／CLI／Agent 共用 application 與純驗證／保存層。backup schema 1／library 1／draft 3 分別管理，未知版拒絕。
- 限制 ZIP 32 MiB／展開 64 MiB／1000 版，核對中央目錄、檔名、型態、索引、大小與 SHA；不 extractall，整份有錯不略過。恢復前、鎖內重查衝突／容量；磁碟故障可能留下完整部分版本，同一 ZIP 重試補完，不宣稱多目錄交易。
- 工作台加入下載、選 ZIP、唯讀預覽與明確恢復；保留未保存編修、音檔及刪除紀錄。回應未知時保持同一 File／SHA 重試；已知失敗要求重選。Agent 啟動明確 --draft-backup，JSON 不能改來源路徑；明確啟庫共九工具，預設仍四工具。
- 修正可重現的損壞 DEFLATE 未處理例外，HTTP 回 400 且工作台保留。下載先驗證再原生 attachment，錯誤不導離主頁。最多兩份／60 秒的下載暫存，取完即清除自有檔與空目錄，不依賴終端強制停止時的 finally。
- 99 Python／55 JavaScript／四 Skill／六 JS 語法與實際瀏覽器備份、已提交後 500 再試、衝突／毀損保留、重啟、原始 bytes 往返、桌面／390px DOM 檢查通過。v0.9 ZIP 核對／解壓原版 77／47 通過。詳細見 docs/QA-v0.10.0.md。
- 產品 0.10.0，Agent 1／MCP 2025-11-25／草稿 3 不變。PolyForm Noncommercial 1.0.0／LICENSE／NOTICE 保留；無新依賴／host 安裝／模型呼叫。分支 codex/iteration-v0.10.0，還原點 restore-v0.9.0-before-v0.10.0，指定提交封裝與 private PR／Release 見 HANDOFF.md／manifest。


## v0.9.0 — 2026-10-03

- 新增明確啟用的本機草稿庫，選定目錄後 HTTP／CLI／JSON-lines／MCP 共用 application 與不可覆寫版本保存；預設接口仍無草稿寫入。分頁與摘要核對、1 MiB／1000 版上限、失敗 staged 檔清理及程序間短時鎖獨立於領域計算。
- 草稿 v3 結構改由 contracts/draft-v3.json 共用，Python／瀏覽器／Agent schema 同源，允許未完成的原始字串；保存紀錄 schema 1 另行管理，未知版本拒絕。
- 加入命名保存、保存版本清單、預覽／下載／明確載入／撤回；保存或預覽不重設音檔。未知保存結果保留點擊時的 ID／內容重試，晚編修保留並提示未保存，放棄重試不刪除磁碟版本。
- 修正 Windows 目錄別名使同 ID 並行保存遭誤拒絕；改比對實際檔案系統身分。程序間鎖使容量檢查與發布在同一界線，四程序競爭一版容量的測試通過。
- 草稿 CLI 明確輸出 UTF-8 JSON，避免終端編碼無法表示原創名稱／表情符號時，檔案已保存但回應失敗；以強制 ASCII 終端的實際子程序驗證。
- 77 Python／47 JavaScript、真實三種 transport／CLI、瀏覽器回應失敗重試、重啟、Agent 保存／23 版分頁、實檔下載與毀損保留測試；v0.8 封裝核對／解壓 62／38 通過。詳細 QA、四 Skill 與封裝結果見 docs/QA-v0.9.0.md／manifest。
- 產品 0.9.0，Agent 1／MCP 2025-11-25／草稿 3 不變；授權保持 PolyForm Noncommercial 1.0.0，沒有依賴或 host 安裝。還原點 restore-v0.8.0-before-v0.9.0，交接及 private PR／Release 見 HANDOFF.md。

## v0.8.0 — 2026-10-03

- 加入獨立 deletion-history 層與集合 adapter，六種列可選擇刪除紀錄還原，每工作台最多 20 筆；穩定頁內 ID、插入錨點、原始字串及分鏡自動時間副作用分開，不覆蓋後續其他編修／音檔。
- 母題 ID 在可還原期間保留；容量拒絕不丟紀錄，可刪除另一列後選原紀錄。刪除／還原重新編號及定位，未完成歌曲／歌詞可新增並保存原始空白。
- 修正歌詞匯入／驗證晚回應覆蓋後續表格編修；revision 在替換前檢查，其他工作台修改不受影響。
- 62 Python／38 JavaScript／四 Skill、實際下載回讀、音檔保留、滿容量／20 筆上限、延遲回應及窄螢幕 DOM 驗證通過。前版 v0.7 解壓 62／24 通過。
- 產品 0.8.0，Agent 1／MCP 2025-11-25／草稿 3 不變；授權保持 PolyForm Noncommercial 1.0.0，沒有新依賴／host 安裝／模型呼叫。
- 還原點 restore-v0.7.0-before-v0.8.0；指定提交封裝、private PR／Release，見 HANDOFF.md、docs/QA-v0.8.0.md。

## v0.7.0 — 2026-10-03

- 四工具完整的輸入／成功成果 schema 移至獨立 tool_contracts 層，MCP 與共用 capabilities 使用相同契約，明確描述現代／舊版條件、創作語言、需求清單與母題欄位。
- 修正歌詞同時傳 cues 與 content／suffix 時原文被忽略；改成明確拒絕，保留單一來源的流程。
- 修正音訊接受條件把 true 當 1、接受非整數及錯誤型態進入開檔的問題；開檔前驗證，JSON 整數值 1.0 正規化為 1。
- MCP 非物件 arguments 回協定錯誤；領域／payload 錯誤保留可重試工具結果。後續呼叫仍正常。
- 清單錯誤在項目旁顯示，定位焦點與讀屏關聯；空交付清單定位新增按鈕，修正／回讀／撤回後清除舊標示。
- 62 Python／24 JavaScript／四 Skill、八 schema meta-schema／七次 stdio 四工具核對、實際下載／窄螢幕／前版解壓還原通過。沒有新依賴／特定 host 安裝／模型呼叫；授權保留。
- 還原點 restore-v0.6.0-before-v0.7.0，指定提交封裝、private PR／Release；詳見 HANDOFF.md、docs/QA-v0.7.0.md。

## v0.6.0 — 2026-10-03

- 歌曲語言、避免事項與交付項目改成可編修清單；多行項目完整保存。草稿 schema 升為 3，v1／v2 需先看摘要、明確轉換，可撤回，原檔保留。
- 工作台回讀 Agent／CLI 的設計 brief：指定歌曲或分鏡、共用應用層檢查、完整預覽／創作待審查提醒、明確載入，只替換選定工作台；限定撤回保留其他工作台後續編修與已選音檔。
- 新增 planning-import.js 純轉換／讀取控制層；未知欄位、不可保存的畫幅／清單拒絕，過期讀取或驗證結果不改預覽。業務檢查仍由 application.build 執行。
- 修正 SRT 明確結束時間被提示為尾句估計；新增 timing 來源 metadata，duration_estimated 仍表示總時長未提供，Agent／MCP 協定不變。
- 封裝發現所有 test_*.js 並檢查新 JS 模組；新增跨 Python／生產 JS 往返、v3／舊版轉換、讀取競態與需求保存測試。
- v0.5 封裝核對 SHA-256、解壓通過原版 53 Python／13 JavaScript。LICENSE／NOTICE 不變，沒有新增 runtime 依賴或參考其他個人專案。

## v0.5.0 — 2026-10-03

- 修正歌詞檔非同步覆蓋：最後一次選檔才提交原文／格式，過期結果及錯誤忽略；手動修改／草稿回讀／離開頁面取消待完成讀取。限制 2 MiB 與 LRC／SRT／JSON。
- 修正失敗選檔使有效成果失效的 input 事件冒泡；只有成功讀入新內容才標記須重建。
- 分鏡加入逐鏡收合、時間／段落／母題摘要與固定定位列，預設只展開第一鏡；編修資料完整保留，缺時間／母題自動展開定位。顯示控制不影響成果有效性。
- 新增無依賴啟動設定產生器，輸出當前 Python 與本版入口的 JSON／Codex TOML；不同目錄的實際 MCP 子程序測試及 Codex 設定解析通過，未安裝或宣稱實際 Agent host 接入。
- 保留產品／Agent／MCP／草稿版本分層，本輪僅產品升為 0.5.0；前輪交接另存，v0.4 封裝核對摘要並還原通過原版 52 Python／8 JavaScript 測試。
- 授權維持 PolyForm Noncommercial 1.0.0，LICENSE／NOTICE 不變；沒有新增依賴或使用其他個人作品。

## v0.4.0 — 2026-10-03

- 分鏡介面支援最多 30 個母題與逐鏡選擇；穩定 ID 避免改名破壞對應，仍被鏡頭使用時拒絕刪除。
- 草稿 schema 升為 v2。v1 經格式檢查後展示轉換摘要，按明確按鈕才轉換／載入；未知版本拒絕，原檔保留，最近一次載入可撤回。
- 修正時間空白時無法刪除問題鏡頭；只在剩餘鏡頭時間有效時重新接續。
- 加入無依賴 MCP stdio adapter，明確支援 2025-11-25、四個工具、文字／結構化成果及兩類錯誤。保留 Agent JSON-lines v1，全部共用 application 層。
- 修正過深 JSON 導致 HTTP 連線被關閉；回傳 400，正常下一次請求仍可使用。
- 封裝增加 MCP 檔案及包內握手／版本一致性驗證；保留 v0.3 交接及還原點。
- 授權仍為 PolyForm Noncommercial 1.0.0；沒有新增依賴、讀取其他作品或對外部署。

## v0.3.0 — 2026-10-01

- HTTP、CLI 與 Agent 共用 application 層；保留 v0.1／v0.2 需求相容。
- 加入 Agent JSON-lines v1：四種 operation、能力查詢、id、結構化錯誤；明確選定音檔，不自動寫檔。
- 修正刪除／修改歌詞後播放預覽使用舊資料，以及舊音檔解碼覆寫最新波形的競態。
- 加入專案草稿 v1 的實際下載、回讀與表單撤回。未知／錯誤版本不替換目前內容；回讀後需重新建立成果。
- 草稿操作列、授權條文與來源通知可由介面查看。
- 依使用者最新選擇加入 PolyForm Noncommercial 1.0.0，取代先前提出的 AGPL；未改寫 v0.2.0 tag。
- 加入指定 commit 封裝、ZIP 完整性／SHA-256 與解壓後驗證腳本；分支與還原方式見 docs/ARCHITECTURE.md。

## v0.2.0 — 2026-10-01

第一版四工作台、原創 Skill、35 項 Python 測試與 private GitHub 上傳。Release tag 保留首次發起與 AI 協作紀錄；未附開源授權、未送出自由工坊投稿。
