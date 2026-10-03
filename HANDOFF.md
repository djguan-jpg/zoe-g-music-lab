# v0.10.0 本輪交接

2026-10-03 · ZOE. G 發起 · djguan-jpg/zoe-g-music-lab（private）。前輪交接在 docs/HANDOFF-v0.9.0.md。

## 還原與 Git

- 分支 codex/iteration-v0.10.0；起點 26a580640d5b32ec7ca6a9050675476d9750a22a。
- 開工還原點 restore-v0.9.0-before-v0.10.0；v0.9.0 tag／封裝保留。v0.9 ZIP 212210 bytes、SHA-256 32daf16c8d58c1bcbadbed2ee76001e80d1467509d298228a43bb2934e91dccd 核對，解壓後原版 77 Python／47 JavaScript 通過。
- 本輪以指定提交 ZIP 解壓驗收，通過後以 private PR 合併並提供 v0.10.0 tag／Release 的 ZIP／manifest。精確 commit、SHA-256 與合併證明以 manifest／遠端實際結果為準，本文記錄程序。

先保存未提交內容；可 git switch -c codex/restore-v0.9.0 restore-v0.9.0-before-v0.10.0，或以該 tag git archive 至新目錄。回寫 main 使用 revert／PR，保留歷史。Git restore tag 只備份程式，先另行下載所選草稿庫 ZIP；保留草稿 v3 JSON 及媒體。v0.9 沒有 ZIP 恢復操作，庫內既有 library 1／draft 3 的檔案仍保留，不由回退程式替你備份／遷移。

## 分層與契約

library_contract.py 是純 metadata／JSON／摘要驗證；draft_library.py 擁有不可覆寫的版本保存與程序間鎖；draft_backup.py 擁有有界 ZIP／完整索引驗證、預覽、衝突／容量計畫與恢復。application 共用檢查／恢復操作及 binary 匯出；CLI backup_files 作完整檔案排他發布；HTTP backup_downloads 管理有界自有暫存；web/backup-transfer.js 管理預覽競態、不可變 File／SHA 與重試，app.js 只接 DOM／HTTP。詳見 docs/ARCHITECTURE.md。

產品 0.10.0／Agent 1／MCP 2025-11-25／草稿 3／保存紀錄 1／備份 1 分別管理。每版 draft 1 MiB／metadata 16 KiB，單庫 1000 版；ZIP 32 MiB／展開 64 MiB／manifest 512 KiB。超限拒絕，可 CLI --ids 明確分批；不略過毀損資料或自動遷移。

已知錯誤在寫入前拒絕，鎖內重查全批衝突與容量。相同 ID 的兩檔 bytes 完全相同才重用；否則拒絕、不覆寫。實際磁碟故障可能留下已完成的部分新版本；同一備份／SHA 重試補完，不宣稱多目錄交易或斷電安全。原 ID、metadata、名稱／時間、draft bytes 保留。

HTTP 只接受明確上傳 ZIP；Agent --draft-backup 選來源、--draft-library 選目的，payload 不得改路徑。預設四工具，明確啟庫共九工具；restore 為寫入，inspect 唯讀。ZIP 匯出由 CLI／HTTP，不塞入 stdio base64；launcher 只列印設定。未知來源／schema 拒絕；hash 不是著作權簽章。

## 已驗證與後續

99 Python／55 JavaScript／四 Skill／六 JS 語法／diff 檢查通過。Windows 實際 CLI、JSON-lines、生成 command／args 的 MCP、HTTP、三程序同 ZIP 恢復已驗證。IAB 真正下載 ZIP、已寫入兩版後 500 與重試 0 新增／2 重用、衝突／毀損／不合法 DEFLATE 保留表單／音檔／歷史、重啟清單、原始 bytes 往返、桌面／390px DOM 幾何通過，見 docs/QA-v0.10.0.md。指定提交封裝解壓後再跑完整測試／Agent metadata／MCP 握手。

LICENSE／NOTICE 與 PolyForm Noncommercial 1.0.0 保留，署名 ZOE. G／GitHub djguan-jpg，Codex 協作記錄不變。沒有新增依賴、安裝 host、模型呼叫或其他個人專案／記憶／秘密／第三方程式搬入。

正式 Agent host 選擇尚未確認；下一輪可優先接入實際 host、正式作品及完整視覺／跨瀏覽器測試。POSIX 鎖與 hard-link 檔案系統、官方 conformance、媒體生成／ASR／LUFS／true peak 未驗證。不以本輪交付宣稱滾動目標全部完成。Repo private，FreeTWAI 公開決策未確認，未投稿或取得平台創始人核實。

## 產物與程序

outputs/v10-qa 只含本輪合成草稿庫、受控失敗 helper、下載／摘要／原版還原／checks／清理與遠端證據；不進 Git／原始碼 ZIP。source／restored 各兩個合成版本，conflict-source 兩個受控版本，沒有建立原使用者 outputs/drafts。保存草稿與使用者備份不可由 Git 重建，不列入清理候選；重要資料另存可靠位置，單一磁碟副本不能防磁碟故障。

保留最新三版 v0.10／v0.9／v0.8，其餘不足七天仍保留。只盤點本工作區 outputs；過七天且可由本專案 tag／已驗證遠端備份重建者才可列清除候選。未刪素材、保存草稿、其他專案或未確認程序。

本輪 HTTP exec 35821／70571／14713／17600／89217／28051 已停止，8875 監聽數 0；測試頁 10／11 關閉，viewport 已重設。下載取完即移除 ZIP 與空目錄，服務仍運作時取得清理收據；先前兩個本輪空暫存目錄逐一核對 ownership／路徑／非連結／空，再非遞迴刪除。正常關閉清理未取走的自有暫存；強制中止可能不執行 finally，仍可能留下未下載的暫存，不聲稱整台機器程序皆已清理。沒有背景 worker／監控或持久服務。
