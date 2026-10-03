# 分層與版本契約

## 執行路徑

```mermaid
flowchart LR
  UI[瀏覽器 DOM 與表單] --> HTTP[loopback HTTP adapter]
  CLI[CLI adapter] --> APP[application.build]
  AGENT[Agent JSON-lines adapter v1] --> APP
  MCP[MCP stdio adapter 2025-11-25] --> APP
  HTTP --> APP
  APP --> DOMAIN[歌曲 / 分鏡 / 歌詞 / PCM 分析]
  DOMAIN --> RESULT[資料與成果檔內容]
  RESULT --> ADAPTER[各 adapter 決定傳輸或寫入]
```

`musiclab/application.py` 統一操作、資料物件與結果 metadata。領域模組不依賴 HTTP、CLI、Agent 或 DOM；它們不決定 Repo 權限、平台投稿、模型供應商或對外發送。CLI 將結果交給共用輸出層；HTTP 只接受明確選定的音檔位元組；Agent 不自動寫檔。

`web/editor-state.js` 提供可獨立測試的最新任務判定、歌詞播放區間、歌詞檔讀取控制、鏡頭概要與草稿契約。歌詞讀取以 token 判定最後選擇，原文與格式一起提交；失敗與過期任務不替換內容。`web/app.js` 負責 DOM、事件、音檔生命週期及 HTTP；時間／規格的正式檢查仍由共用 Python 邏輯處理。

鏡頭收合與定位屬於 UI 顯示狀態，不寫入草稿、不改變領域需求，也不使已驗證成果失效。表單欄位保持在 DOM，匯出及草稿保存都收集所有鏡頭。新增／刪除時保留其餘鏡頭的展開狀態，重新載入草稿則採預設顯示。

`scripts/agent_launch.py` 依目前 Python 與此 checkout 產生 launch descriptor／Codex TOML，不保存機器路徑到 Git，不執行模型或安裝 host。設定解析、子程序 transport 驗證、真正 Agent host 工具呼叫是不同驗收層級。

`web/planning-import.js` 是需求與工作台狀態的轉換層，不計算音樂時間或判斷連戲。它檢查 UI 可表達的欄位／容量，轉換穩定母題 ID，並提供正反 DTO 轉換；`app.js` 將候選送入現有 HTTP → application.build 檢查，再展示預覽。載入／撤回僅套用選定 panel；完整草稿載入仍有獨立的全表單還原與音檔重選語義。讀取／驗證用 latest token，過期任務不替換預覽。領域驗證仍唯一由 Python 決定。

## 分別管理的版本

- 產品版本：`musiclab.__version__` 與 `projects.json.version`。目前 v0.8.0。
- Agent 協定：`protocol_version: 1`，每個 request 有 id、operation、payload；每行一個 JSON。
- MCP 協定：`2025-11-25`，JSON-RPC 握手／工具列表／呼叫，與自訂 Agent v1 分別管理。拒絕未知版本，不宣稱支援 2026 協定或任一 host。
- 草稿格式：`format: zoe-music-lab-draft`、`schema_version: 3`。保存編修欄位、需求清單及原始文字數值，允許尚未填完的草稿；不包含音檔、驗證成果或授權設定。

草稿 v3 沿用 v2 的穩定母題 ID，新增 music-language 與 avoid／deliverables 字串陣列；多行項目仍是同一陣列項目。v1／v2 僅檢查並顯示摘要，需明確按鈕轉成 v3 才載入；舊版新增欄位沿用已知舊 UI 的固定語言／需求預設，v1 單母題轉穩定 ID，v2 對應保留。不覆寫原檔；撤回保存按下轉換時的表單。未知 Agent／草稿版本拒絕執行或替換。輸入資料是素材，不擴大工具權限；未完成草稿需重建成果才恢復下載。

歌詞輸出新增 timing 來源說明，保留既有 duration_estimated 的總時長語義與 needs_review。provided／last_cue_end／last_start_plus_three 區分總時長來源；逐句缺失結束與尾句推得另外記錄。這是 additive result data，不更動 Agent v1 或 MCP 協定。

## Git 與可逆迭代

每輪從已驗證版建立 `codex/iteration-vX.Y.Z`，先留下 `restore-*` tag。分層變更與對應測試放在該輪分支，以 private PR 保留差異與驗證紀錄，包內驗收通過後再合併至 `main`。

需要還原時，以 release／restore tag 開新分支或新目錄，不使用破壞歷史的 reset 或強推。若需回寫 main，使用 revert commit 和可審閱 PR。應用程式不自動遷移或覆寫舊輸出，草稿導入另提供表單撤回。

每輪更新 CHANGELOG、HANDOFF 與驗證證據；封裝只使用指定 Git commit，不收錄未追蹤檔、音檔、outputs、秘密或其他專案。

## v0.7 的契約與提示層

- tool_contracts.py：可序列化的輸入／成功成果 schema，供 MCP、JSON-lines discovery 與 HTTP capabilities 共用；不依賴 schema engine，不處理 I/O 或領域計算。
- application.py：拒絕互斥歌詞來源同時提供，所有 adapter 都得到同樣錯誤；audio.py 在開檔前驗證 profile 和正整數接受條件，排除布林值，正規化整數數值。
- planning-import.js：requirementIssue 產生清單問題位置，planningBrief 與介面共用這個判定。
- app.js／HTML／CSS：在對應項目旁顯示提示、aria-invalid／aria-describedby 與焦點；空清單定位新增按鈕。標示是暫態 UI，沒有進入草稿，回讀／撤回重畫時清除，再建立時重驗。

產品 0.7.0；Agent protocol 1、MCP 2025-11-25 與草稿 schema 3 不變。輸入 schema 的公布是新增 discovery metadata；領域錯誤與 malformed MCP envelope 分開，無來源被靜默忽略的改動已記錄在 CHANGELOG。


## v0.8 的局部還原層

`web/deletion-history.js` 只處理列 ID、相鄰位置、刪除內容、自動副作用的前後值與 bounded 的各工作台紀錄；不依賴 DOM／HTTP／領域計算。`app.js` 的集合 adapter 收集原始字串、分鏡展開狀態，維持頁內 ID 並套用還原、焦點／提示與 dirty 狀態。母題使用草稿中的穩定 ID，其他頁內 ID 與歷史紀錄不進草稿，schema 3 不變。

還原只插回選定列，不以全 panel 快照覆蓋後續編修。分鏡的自動 start／end／duration 副作用按目前值比對撤回，與後來手動修改衝突的值保留，需重新領域驗證。可選較早紀錄、最多 20 筆；到達既有草稿容量則拒絕且保留紀錄。載入取代內容時只清除對應工作台。音檔生命週期不進刪除還原。

`run` 提供請求當下的工作台 revision 判定給歌詞 adapter，匯入／驗證晚回應在替換表格前檢查；不同工作台的修改不使有效回應失效。成果仍由既有 application／domain 計算，未增加依賴或授權。
