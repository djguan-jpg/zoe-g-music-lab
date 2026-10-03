# v0.4.0 本輪交接

2026-10-03 · 發起 ZOE. G · djguan-jpg/zoe-g-music-lab（private）。前輪交接保留在 docs/HANDOFF-v0.3.0.md。

## 分支、封裝與還原

- 分支 codex/iteration-v0.4.0。
- 起點 fe95a9029ff3af3b33f0a94dc686e4ac195f796f（v0.3 合併提交），開工還原点 restore-v0.3.0-before-v0.4.0；v0.3.0 tag 保留。
- 本輪成果以指定提交封裝並在包內驗收後，經 private PR 合併，v0.4.0 tag／Release 附 ZIP 與 manifest。以實際 GitHub 狀態及 manifest 為準，文件不是已合併的證明。

取前版到新分支：git switch -c codex/restore-v0.3.0 restore-v0.3.0-before-v0.4.0；事前保存未提交內容。或 git archive --format=zip --prefix=zoe-g-music-lab/ --output=outputs/v0.3.0-restore.zip restore-v0.3.0-before-v0.4.0，再解壓至新目錄。保持 Git 歷史，若需 main 回寫以 revert 和 PR 處理。

已實際從保留的 v0.3 ZIP 解壓，核對摘要並通過該版 44 個 Python 測試。v0.4 載出的 v2 草稿不能直接交給 v0.3；還原時另用原有 v1 草稿。v1→v2 必須明確轉換，沒有逆轉 schema 的宣稱。

## 分層與本輪更動

共用 application 層未搬入 transport 計算。新增 music_lab_mcp.py 為獨立 stdio adapter，四工具仍呼叫 application.build；原 Agent v1 保留。HTTP 多巢 JSON 回 400；UI 多母題的 ID／草稿轉換與接續時間純規則置於 editor-state.js，app.js 負責可見表單及事件。詳細差異見 CHANGELOG.md。

產品 0.4.0、Agent protocol 1、MCP 2025-11-25、草稿 schema 2 分別管理。未知版本拒絕，不靜默遷移。各輸出仍預設拒絕覆寫，原媒體保留。

## 授權與來源

維持使用者選定 PolyForm Noncommercial 1.0.0，LICENSE／NOTICE 未更動、不另授 AGPL 或商用許可。只讀本次新工作區與通用工具／官方 MCP 規格，沒有其他個人專案、Git、記憶或素材，未搬入第三方程式。MCP 研究来源見 docs/AGENT.md。

## 驗證與接續

本輪測試／實際下載／390 像素 DOM 幾何／還原證據見 docs/QA-v0.4.0.md。指定提交封裝脚本再次在解壓目錄執行測試、Agent 能力與 MCP 握手；ZIP 摘要／精確提交以 manifest 為準。

下一輪優先：特定 Agent host 的實際接入驗證與易用教學、歌曲／分鏡任務在正式作品中的評測、分鏡長表單的收合或概要導航。歌詞檔快速連續選擇的非同步覆蓋仍需受控重現；未以未驗證推測宣稱已修正。完整視覺與跨瀏覽器尚未完成。沒有媒體生成、ASR、LUFS／true peak、全域設定安裝。

FreeTWAI 需要公開 Repo 的決策仍待使用者回答；維持 private，沒有投稿或變更 live data，沒有取得平台創始人核實。

## 產物與程序

開始時只盤點本工作區 outputs：30 檔，8875 監聽數 0。本輪正式封裝另以版本／commit 命名，保留最新三版；v0.2 還原 ZIP、v0.3 與本輪 v0.4 封裝皆保留。本輪結束另記 inventory-final.json；超過七天且由 verified Git／遠端備份可重建才列清除候選，沒有候選就不刪素材。

本輪 exec session 81297 臨時 HTTP 程序已 Ctrl+C 停止，8875 監聽數 0，測試頁 ID 4 關閉，viewport 已重設；MCP 子程序 EOF 退出。封裝／測試使用 bounded subprocess，沒有背景監控，不動其他程序。忽略的 outputs/v04-qa 保存下載、合成草稿、還原與盤點證據。
