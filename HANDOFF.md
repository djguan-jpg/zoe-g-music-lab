# v0.12.0 本輪交接

2026-10-03 · ZOE. G 發起 · djguan-jpg/zoe-g-music-lab（private）。前輪交接保存在 docs/HANDOFF-v0.11.0.md。

## 還原與 Git

- 分支 codex/iteration-v0.12.0；起點 e2a3b5df93b9f7815f8090faa07b4833113172ce。
- restore-v0.11.0-before-v0.12.0 指向此起點。保留 v0.11 tag／ZIP：271217 bytes，SHA-256 876d241317bdf1ee4b06760fefe34828546052ec51a7248d1e8bfceb0ad9762e；解壓原版 112 Python／69 JavaScript 通過。
- 本輪指定提交 ZIP 解壓後驗收，再 private PR 合併、建立 v0.12.0 tag／Release ZIP／manifest；精確提交、摘要、合併及遠端 bytes 以 manifest／實際收據為準。

先保存未提交內容；用 git switch -c codex/restore-v0.11.0 restore-v0.11.0-before-v0.12.0，或 git archive 到新目錄。回寫 main 以 revert／PR 保留歷史。Git tag 只保護程式；草稿／備份／音檔另存，不隨回退遷移或覆寫。draft 3／library 1／backup 1 不變。

## 分層與功能

musiclab/audio_source.py 只負責開檔一次、雜湊與自有副本／PCM fmt 預檢；副本超過 1 MiB 轉暫存，所有出口關閉。audio.py 用同一副本量測，產生 source_evidence 及 JSON／Markdown；application 共用於 CLI／HTTP／JSON-lines／MCP，沒有來源路徑進報告。這是內部一致性，不是外部同時改寫的原子快照；不解讀多聲道位置或宣稱完整 RIFF conformance。

web/audio-review.js 純驗證／模型轉換及非同步選擇保護；app.js 負責 HTTP／DOM／dirty。成功或錯誤回來時核對編修版本、原生 File 身份及接受條件，過期不替換。摘要有實際／接受／結果、兩端安靜段、DC、來源及範圍；修改後上一份報告與停用下載明確呈現。靜音 −∞／不可測保持語義。

產品 0.12.0／Agent 1／MCP 2025-11-25／draft 3／library 1／backup 1 分別管理；source_evidence 為 additive 結果資料，預設四／啟庫九工具。未新增草稿欄位、模型、依賴或 host 安裝。

## 驗證與限制

124 Python／80 JavaScript／四 Skill／九 JS 語法／diff 通過。新的六種 fmt 不一致、四 PCM 寬度、odd chunk padding、截斷／缺 fmt、受控來源替換、暫存關閉、跨 1 MiB、來源保留與不洩漏路徑、真正 CLI／HTTP／JSON-lines／MCP、錯誤後正常呼叫均通過。指定提交封裝再跑全套與 Agent metadata／MCP 握手。

IAB 實際 stereo／mono／數位靜音、錯誤 block align 保留上一份、切換 profile、延遲成功／錯誤不覆蓋、接受條件失敗、JSON／Markdown 實檔下載及桌面／390px DOM／鍵盤通過，見 docs/QA-v0.12.0.md。頁面下載事件初次逾時與 label locator miss 經新 DOM／role 定位處理，只採後續真實 download.path 及內容摘要為證據。

完整視覺／跨瀏覽器、正式歌曲實聽／ASR／LUFS／true peak／媒體生成、實際 Agent host／完整格式 conformance／其他 OS 尚未驗證。沒有秘密或其他個人專案參考。PolyForm Noncommercial 1.0.0／LICENSE／NOTICE 與 ZOE. G／Codex 紀錄保留。Repo private；FreeTWAI 公開決策未確認、未投稿或取得平台創始人核實。不將一輪交付當作滾動目標全部完成。

## 產物與程序

outputs/v12-qa 僅本輪合成 WAV、helper、基線、實際下載／摘要、checks／還原／程序與遠端證據，不進 Git。使用者草稿／備份／媒體不是 Git 可重建產物，不列封裝清理；重要資料另存可靠位置。

保留最新三版 v0.12／v0.11／v0.10；更舊但未滿七天也保留。只盤點本工作區 outputs 與已確認本輪程序；過七天且本專案 tag／已核對遠端可重建才列候選，不清理其他專案、素材或未確認程序。

自有 HTTP exec 76918（PID 282508）經 QA stop 正常停止 exit 0，server_closed 收據；8875 監聽 0，自有 tab 14 關閉，viewport reset。測試 exec 73199 exit 0。沒有持久服務／背景 worker／監控，不聲稱整台機器程序都已清理。
