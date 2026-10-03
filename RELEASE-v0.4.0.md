# v0.4.0 — 多母題、可逆草稿與 MCP

由 ZOE. G 發起，GitHub 帳號 djguan-jpg；四個原創專案共用此 Repo。Codex 協作如實記於 FOUNDER-RECORD.md。授權 PolyForm Noncommercial 1.0.0，LICENSE／NOTICE 保留。

- 每鏡可選不同母題；改名保留對應，引用中的母題刪除會被拒絕。
- 草稿 schema v2 保存多母題。v1 先展示轉換摘要，明確選擇才載入；可撤回，未知版本拒絕，原檔保留。
- 未完成時間的鏡頭仍可刪除；過深 JSON 回傳錯誤並維持伺服器可使用。
- 無依賴的 MCP stdio 2025-11-25 提供四工具，與 HTTP、CLI、Agent JSON-lines v1 共用 application。沒有安裝任何 host 或呼叫模型。

產品 0.4.0；自訂 Agent protocol 1；MCP protocol 2025-11-25；草稿 schema 2，版本分別管理。

52 Python／8 JavaScript 測試及實際瀏覽器互動／下載驗證。封裝只取指定 commit，包內重跑測試與握手，精確 SHA-256、每檔摘要與檢查結果見同附 manifest.json。還原点 restore-v0.3.0-before-v0.4.0，舊 v0.3 封裝已再次解壓通過 44 測試。

完整視覺／跨瀏覽器、特定 MCP host 及官方 conformance suite、正式作品、生成音樂／影片、ASR、LUFS／true peak 尚未驗證。Repo private；自由工坊未投稿、未取得平台創始人核實。詳見 HANDOFF.md、docs/QA-v0.4.0.md。
