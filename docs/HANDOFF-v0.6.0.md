# v0.6.0 本輪交接

2026-10-03 · 發起 ZOE. G · djguan-jpg/zoe-g-music-lab（private）。前輪交接保留在 docs/HANDOFF-v0.5.0.md。

## 分支、封裝與還原

- 分支 codex/iteration-v0.6.0。
- 起點 c8b292d6e805654be1fdd0e54656ad1edc03eed5（v0.5 合併提交），開工還原點 restore-v0.5.0-before-v0.6.0；v0.5.0 tag 保留。
- 本輪以指定提交封裝，在解壓的精確版本驗收後經 private PR 合併；v0.6.0 tag／Release 附 ZIP 與 manifest。精確提交、摘要與合併狀態以 manifest／GitHub 實際結果為準，本文不是合併證明。

取前版到新分支：git switch -c codex/restore-v0.5.0 restore-v0.5.0-before-v0.6.0；事前保存未提交內容。也可用 git archive --format=zip --prefix=zoe-g-music-lab/ --output=outputs/v0.5.0-restore.zip restore-v0.5.0-before-v0.6.0，解壓至新目錄。保留歷史；若需回寫 main，以 revert 和 PR 處理。

已實際核對保留 v0.5 ZIP 的 SHA-256，解壓後原版 53 Python／13 JavaScript 測試通過。本輪草稿由 schema 2 升為 3，v1／v2 必須預覽並明確轉換；原檔保留，未知版本拒絕。

## 分層與本輪更動

共用 application 與四 adapter 保留。planning-import.js 負責歌曲／分鏡需求與草稿 DTO 轉換，以及最新讀檔／取消判定；editor-state.js 管理草稿版本、母題對應與歌詞時間來源提示；app.js 負責預覽、人工審查提醒、選定工作台載入與限定範圍撤回。Python 領域層仍負責正式時間、連戲與輸出檢查，HTTP／CLI／Agent 共用。

歌曲語言、避免事項與交付清單可編修。需求回讀只改指定工作台，其他工作台後續編修與音檔在撤回後保留；整份草稿回讀仍按既有契約清除音檔選擇。SRT 明確結束時間與未確認歌曲總時長分開提示，輸出新增 timing 來源。詳細差異見 CHANGELOG.md、docs/ARCHITECTURE.md。

產品 0.6.0、Agent protocol 1、MCP 2025-11-25、草稿 schema 3 分別管理，沒有靜默遷移。各輸出預設拒絕覆寫，原媒體保留。scripts/agent_launch.py 只產生設定，沒有安裝或啟動 host。

## 授權與來源

維持使用者選定 PolyForm Noncommercial 1.0.0，LICENSE／NOTICE 未更動，不另授 AGPL 或商用許可。只讀本次新工作區與通用工具指引，沒有參考其他個人專案、Git、記憶或素材，未搬入第三方程式。先前 MCP 規格來源保留在 docs/AGENT.md。

## 驗證與接續

本輪 56 Python／24 JavaScript／四 Skill、實際 MCP 成果 → 瀏覽器 → 下載往返、草稿 v1／v2／v3、指定範圍撤回與 390 像素 DOM 幾何證據見 docs/QA-v0.6.0.md。指定提交封裝腳本在解壓目錄重新跑所有 test_*.js、Python、Agent 能力與 MCP 握手。

成果回讀已驗證；特定 Agent host 的實際工具呼叫與設定安裝尚未完成。下一輪優先實際 host 整合及易用教學、工具 schema／conformance 核對、正式作品歌曲／分鏡評測、完整視覺與跨瀏覽器。沒有媒體生成、ASR、LUFS／true peak；不把單輪交付當整個滾動目標完成。

FreeTWAI 登錄需要公開 Repo，公開決策仍待使用者回答；維持 private，未投稿或變更 live data，未取得平台創始人核實。

## 產物與程序

本輪只盤點本工作區 outputs，開始與結束紀錄保存在 outputs/v06-qa/inventory-start.json 及 inventory-final.json。正式封裝以版本／commit 命名，最新三版為 v0.4／v0.5／v0.6；v0.3 封裝及 v0.2 還原檔尚未超過七天，仍保留。只有超過七天且經已驗證 Git／遠端備份可重建的本專案產物才列清除候選；本輪無候選，未刪素材或其他專案資料。

本輪 exec session 27775（基準）及 88349（新版）的臨時 HTTP 程序已 Ctrl+C 停止（exit 1），8875 監聽數 0，測試頁 ID 6 關閉，viewport 已重設。MCP 子程序 EOF 退出；封裝／測試使用 bounded subprocess，沒有背景監控，也不動其他程序。忽略的 outputs/v06-qa 保存合成資料、實際下載、還原、盤點與本輪 GitHub 上傳核對證據。
