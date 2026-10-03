# v0.5.0 本輪交接

2026-10-03 · 發起 ZOE. G · djguan-jpg/zoe-g-music-lab（private）。前輪交接保留在 docs/HANDOFF-v0.4.0.md。

## 分支、封裝與還原

- 分支 codex/iteration-v0.5.0。
- 起點 f9639bea4f240d7c51f369d5b979c265969d55bc（v0.4 合併提交），開工還原點 restore-v0.4.0-before-v0.5.0；v0.4.0 tag 保留。
- 本輪成果以指定提交封裝並在包內驗收後，經 private PR 合併，v0.5.0 tag／Release 附 ZIP 與 manifest。以實際 GitHub 狀態及 manifest 為準，文件不是已合併的證明。

取前版到新分支：git switch -c codex/restore-v0.4.0 restore-v0.4.0-before-v0.5.0；事前保存未提交內容。或 git archive --format=zip --prefix=zoe-g-music-lab/ --output=outputs/v0.4.0-restore.zip restore-v0.4.0-before-v0.5.0，再解壓至新目錄。保持 Git 歷史，若需 main 回寫以 revert 和 PR 處理。

已實際從保留的 v0.4 ZIP 解壓，核對摘要並通過該版 52 Python／8 JavaScript 測試。v0.5 仍採草稿 schema 2，沒有新增資料契約或靜默遷移；收合狀態不在草稿內。

## 分層與本輪更動

共用 application 層與四 adapter 保留。editor-state.js 負責歌詞檔最新任務／取消判定及鏡頭概要；app.js 負責表單提交、錯誤選檔不使成果失效、原生 details 收合與焦點定位。scripts/agent_launch.py 只產生設定，不安裝或啟動 host。詳細差異見 CHANGELOG.md、docs/ARCHITECTURE.md。

產品 0.5.0、Agent protocol 1、MCP 2025-11-25、草稿 schema 2 分別管理。未知版本拒絕，不靜默遷移。各輸出仍預設拒絕覆寫，原媒體保留。

## 授權與來源

維持使用者選定 PolyForm Noncommercial 1.0.0，LICENSE／NOTICE 未更動、不另授 AGPL 或商用許可。只讀本次新工作區與通用工具／CLI help，沒有其他個人專案、Git、記憶或素材，未搬入第三方程式。先前 MCP 規格來源保留在 docs/AGENT.md。

## 驗證與接續

本輪 53 Python／13 JavaScript／四 Skill、實際下載／草稿回讀／390 像素 DOM 幾何／還原證據見 docs/QA-v0.5.0.md。指定提交封裝腳本再次在解壓目錄執行測試、Agent 能力與 MCP 握手；ZIP 摘要／精確提交以 manifest 為準。

歌詞檔覆蓋已受控重現並修正，長分鏡收合／定位已完成。設定生成與 Codex CLI 解析已驗證；後者沒有建立連線。下一輪優先選定 Agent host 的實際工具呼叫與易用教學、正式作品歌曲／分鏡評測、完整視覺與跨瀏覽器。沒有媒體生成、ASR、LUFS／true peak、全域設定安裝，不把單輪交付當整個滾動目標完成。

FreeTWAI 需要公開 Repo 的決策仍待使用者回答；維持 private，沒有投稿或變更 live data，沒有取得平台創始人核實。

## 產物與程序

開始與結束僅盤點本工作區 outputs，紀錄位於 outputs/v05-qa/inventory-start.json 及 inventory-final.json。本輪正式封裝另以版本／commit 命名，保留最新三個封裝版本 v0.3／v0.4／v0.5；v0.2 還原 ZIP 未超過七天，仍保留。只有超過七天且 verified Git／遠端備份可重建才列清除候選，本輪無候選，沒有刪除素材或其他專案資料。

本輪 exec session 81813 臨時 HTTP 程序已 Ctrl+C 停止（exit 1），8875 監聽數 0，測試頁 ID 5 關閉，viewport 已重設；MCP 子程序 EOF 退出。封裝／測試使用 bounded subprocess，沒有背景監控，不動其他程序。忽略的 outputs/v05-qa 保存實際下載、合成資料、設定解析、還原與盤點證據。
