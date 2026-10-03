# v0.10.0 — 把已保存構思帶到另一個草稿庫

ZOE. G 發起，GitHub djguan-jpg；PolyForm Noncommercial 1.0.0，LICENSE／NOTICE 保留。

本版可下載整個已保存草稿庫的 ZIP，在另一個明確選定的草稿庫先預覽，再加入版本。保留原 ID、名稱、時間、metadata 與 draft 的原始位元組；相同版本重用，不同內容的既有 ID 拒絕。預覽與恢復保留目前未保存編修、音檔及刪除還原紀錄；另行明確載入版本才更改工作台。

先核對整份 ZIP 的來源格式、全部檔案、版本、大小與 SHA-256，恢復時再次核對預覽摘要、全批衝突／容量。已知錯誤不寫入新版本；磁碟故障可能留下完整部分版本，同一 ZIP 重試可補完，不宣稱多目錄交易或斷電安全。ZIP 上限 32 MiB／展開 64 MiB／1000 版，超限由 CLI --ids 明確分批，沒有略過版本或假裝完整。備份不含媒體、成果、未保存編修或刪除歷史。

純版本契約、備份計畫、保存層、檔案／HTTP adapter 與前端控制器分離。HTTP／CLI／JSON-lines／MCP 共用驗證與恢復；明確啟庫共九工具，預設仍四工具。Agent --draft-backup 只在啟動選來源，JSON 不能更換路徑；binary 匯出使用 CLI／工作台。產品 0.10.0／Agent 1／MCP 2025-11-25／draft 3／library 1／backup 1 分別管理。

99 Python／55 JavaScript／四 Skill／六 JS 語法、Windows 真實子程序與三程序恢復、IAB ZIP 實檔摘要、已寫入後 500 同備份重試、衝突／毀損保留、重啟原始 bytes 往返及桌面／390px DOM 幾何通過，詳見 docs/QA-v0.10.0.md。可重現的無效 DEFLATE 轉為資料錯誤；原生下載不導離主頁，取完即清除有界自有暫存。v0.9 ZIP 核對／解壓原版 77／47 通過。

還原點 restore-v0.9.0-before-v0.10.0、指定提交 ZIP／manifest；精確 commit／SHA-256、私有 PR 合併／Release 以實際結果為準。重要草稿另存可靠位置，Git 還原點只備份程式。本輪沒有新依賴／模型／host 安裝；完整視覺、其他瀏覽器／POSIX／hard-link 檔案系統、正式作品／Agent host 與官方 conformance 未驗證。Repo private；FreeTWAI 未投稿或取得平台創始人核實。
