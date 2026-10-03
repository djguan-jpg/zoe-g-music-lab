# v0.12.0 — 讓音檔報告對應這次選擇

ZOE. G 發起，GitHub djguan-jpg；PolyForm Noncommercial 1.0.0，LICENSE／NOTICE 保留。

修正音檔換檔／接受條件後晚回應覆蓋，以及 SHA-256 與量測分開開檔可能混用來源的問題。雜湊與分析使用同一份自有副本；新添 source_evidence 記錄大小及 PCM fmt。拒絕不一致的 block align、byte rate、位元深度及截斷標頭。多聲道不解讀位置，列出確認提醒。複製不是外部同時編修的原子快照，fmt 預檢不是完整 WAV conformance。

工作台將來源與接受條件逐項並排，補齊尾部安靜段／DC offset，區分技術通過、有待確認與上一份報告；靜音顯示 −∞，相關性不可測不當通過。換檔／條件後停用下載，只有目前檔案身份、條件及編修版本仍相符才接收結果；晚到錯誤亦不蓋掉新選擇。JSON／Markdown 真正下載已核對。

124 Python／80 JavaScript／四 Skill／九 JS 語法與 diff 檢查通過；實際 CLI／HTTP／JSON-lines／MCP 與共用操作一致，錯誤後可繼續。IAB 操作、延遲成功／錯誤、靜音／格式錯誤／接受條件失敗、桌面／390px DOM 幾何及鍵盤通過。前版 v0.11 ZIP 271217 bytes，SHA-256 876d241317bdf1ee4b06760fefe34828546052ec51a7248d1e8bfceb0ad9762e，解壓原版 112／69 通過。詳細見 docs/QA-v0.12.0.md。

產品 0.12.0；Agent 1／MCP 2025-11-25／draft 3／library 1／backup 1 保持。source_evidence 是結果資料的新增欄位；未新增工具或權限。預設四操作／明確啟庫九工具；沒有模型、依賴、host 或全域設定新增。

分支 codex/iteration-v0.12.0；還原點 restore-v0.11.0-before-v0.12.0。指定提交封裝解壓驗收後，以 private PR 合併；commit／ZIP SHA-256／Release 遠端位元組以 manifest 與實際證據為準。Git 還原只保護程式，草稿／備份／素材另存。完整視覺、跨瀏覽器、正式歌曲實聽、LUFS／true peak／ASR／媒體生成、特定 host／其他 OS 未驗證。Repo private；FreeTWAI 未投稿或取得平台創始人核實。
