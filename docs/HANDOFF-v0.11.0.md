# v0.11.0 本輪交接

2026-10-03 · ZOE. G 發起 · djguan-jpg/zoe-g-music-lab（private）。前輪交接保存於 docs/HANDOFF-v0.10.0.md。

## 還原與 Git

- 分支 codex/iteration-v0.11.0；起點 fdd47d97fe9333920269544bce821e35b0ada9bb。
- 開工還原點 restore-v0.10.0-before-v0.11.0 指向此起點；保留 v0.10 tag／ZIP。前版 ZIP 244400 bytes，SHA-256 f97b691d0f7467fef62f5d9b2af32e0dba68a206cb20aedb607bdb04f702e0b4，解壓原版 99 Python／55 JavaScript 通過。
- 本輪指定提交 ZIP 解壓驗收後，以 private PR 合併、建立 v0.11.0 tag／Release ZIP／manifest；精確 commit／SHA／合併與遠端 bytes 以 manifest／實際收據為準。

先保存未提交內容；用 git switch -c codex/restore-v0.10.0 restore-v0.10.0-before-v0.11.0，或 git archive 至新目錄。回寫 main 使用 revert／PR 保留歷史。Git tag 只保護程式，草稿／備份／音檔另存；目前 draft 3、library 1、backup 1 不變，回退不備份／遷移使用者資料。校時的一次撤回只在頁面記憶，不是磁碟備份。

## 功能與分層

Python lyric_timing 是純有限十進位／毫秒規則；lyrics 處理排序編修／完整驗證，application 讓 CLI／HTTP／JSON-lines／MCP 同源。原生 lyric-time.js 共用於工作台與離線 lyric_preview；HTML／資料安全一次嵌入。lyrics-timing 管理 stable ID、預覽 token／時間指紋、完整回應核對與一次撤回；app.js 只接 DOM／HTTP／音檔。普通歌詞驗證先排序來源與 ID 再重畫，避免排序後身份錯配。

整批校時先預覽再明確套用，只改 start／end；句長／文字／音檔／刪除歷史保留。後改文字可保留並撤回；任何後改時間或句子增刪拒絕整份撤回。source、指定 duration 不改，缺失 end 編修後推得。正負校時不截斷非法結果，沒有 AI／自動咬字對齊。控制／候選／一次撤回不進草稿；新逐句內容／草稿載入清除。

產品 0.11.0／Agent 1／MCP 2025-11-25／draft 3／library 1／backup 1 分別管理。既有 lyrics 操作的 shift_seconds／time_changes／text_changes 是 additive；sorted original 1-based index，shift → set（已有 end 保留句長）→ text → 最終驗證。半毫秒往遠離零捨入；原始負時間／非有限／布林／非十進位／無法保留毫秒精度拒絕。非零 shift／非空編修 needs_review=true；不宣稱實聽完成。預設四工具／啟庫九工具保持。

## 驗證與限制

112 Python／69 JavaScript／四 Skill／八 JS 語法／diff 通過。真實 CLI 不同 cwd 四檔與 application 一致、JSON-lines 錯誤後恢復、MCP discovery／initialize／call、HTTP Host／Origin 防護、Python／Node corpus、模板安全、跨語言精度及前端候選／撤回保護通過。指定提交封裝再跑全套、Agent metadata／MCP 握手。

IAB 實際預覽／套用／後改文字撤回、後改時間拒絕／修正後撤回、負值／超總長保留、延遲 2 秒晚回應取消、排序 ID 與 JSON／草稿實檔、桌面／390px DOM／焦點通過。獨立頁 precision／8 秒音檔總長／JSON／LRC／SRT Blob 實檔通過；fixture 初始 CSP 錯誤只修忽略 helper，production 政策保持。詳細見 docs/QA-v0.11.0.md。

完整視覺／跨瀏覽器／直接 file://、正式作品實聽／ASR／LUFS／true peak／媒體生成、實際 Agent host／官方 conformance／其他 OS 尚未驗證。沒有新依賴／登入／模型／host 安裝、秘密或其他個人專案參考。PolyForm Noncommercial 1.0.0／LICENSE／NOTICE 及 ZOE. G／Codex 協作紀錄保留。Repo private，FreeTWAI 公開決策未確認、未投稿或取得平台創始人核實。不將一輪交付當作滾動目標全部完成。

## 產物與程序

outputs/v11-qa 僅本輪合成 SRT／WAV、fixture、helper、實際下載／摘要、checks／還原／程序與遠端證據，不進 Git。保存的草稿與使用者備份不可由 Git 重建，不列入封裝清理；重要資料另存可靠位置。

最新三版 v0.11／v0.10／v0.9 保留；其餘未滿七天也保留。只盤點本工作區 outputs、封裝與已知程序；過七天且本專案 tag／已核對遠端可重建才列候選，不清理其他專案、媒體或未確認程序。

自有 HTTP exec 73630（PID 281976）／72326（PID 275472）／99643（PID 277600）皆經 QA stop 正常停止 exit 0、server_closed；8875 監聽 0，自有 tab 12／13 關閉，viewport 已重設。沒有持久服務／背景 worker／監控；沒有聲稱整台機器程序皆已清理。
