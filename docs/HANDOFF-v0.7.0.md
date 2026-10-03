# v0.7.0 本輪交接

2026-10-03 · ZOE. G 發起 · djguan-jpg/zoe-g-music-lab（private）。前輪交接保存於 docs/HANDOFF-v0.6.0.md。

## 還原與 Git

- 分支 codex/iteration-v0.7.0；起點 34fdf440a7e6e4ef7ddcc5759d03082894cbfd22。
- 開工還原點 restore-v0.6.0-before-v0.7.0；v0.6.0 tag／封裝保留。
- 指定提交封裝解壓驗收後，以 private PR 合併、v0.7.0 tag／Release 附 ZIP／manifest。精確提交與 SHA-256／合併狀態以 manifest／GitHub 實際結果為準，本文不是合併證明。

取前版到新分支：git switch -c codex/restore-v0.6.0 restore-v0.6.0-before-v0.7.0；先保存未提交內容。或 git archive --format=zip --prefix=zoe-g-music-lab/ --output=outputs/v0.6.0-restore.zip restore-v0.6.0-before-v0.7.0，解壓至新目錄。保留歷史；需回寫 main 時以 revert／PR 處理。

本輪已重新核對保留 v0.6 ZIP 摘要並解壓，原版 56 Python／24 JavaScript 通過。

## 分層與契約

tool_contracts.py 集中宣告輸入／成功成果 schema，MCP／JSON-lines／HTTP discovery 共用。application 拒絕互斥歌詞來源；audio 在開檔前驗證 profile／整數接受條件，布林不當 1，JSON 整數值正規化。領域計算未搬入 transport。planning-import.js 提供問題位置；app.js／HTML／CSS 處理項目旁提示、焦點／讀屏關聯、修正或回讀時清除暫態標示。

產品 0.7.0；Agent protocol 1、MCP 2025-11-25、草稿 schema 3 不變。未知版本依既有規則拒絕；沒有靜默遷移。來源衝突及 malformed envelope 的拒絕差異見 CHANGELOG.md、docs/AGENT.md。

## 授權、驗證與接續

維持 PolyForm Noncommercial 1.0.0，LICENSE／NOTICE 未變，創辦署名 ZOE. G／GitHub djguan-jpg，AI 協作如實記錄。只讀本工作區新作品與通用指引、官方 MCP 規格；沒有其他個人專案、記憶、秘密或第三方程式搬入。

62 Python／24 JavaScript／四 Skill、八 schema／七次真實 stdio 四工具核對、瀏覽器真正下載／回讀／撤回及窄螢幕 DOM 幾何見 docs/QA-v0.7.0.md。封裝在精確解壓目錄再跑 Python／全部 JS、Agent metadata／MCP 握手。既有 jsonschema 僅作開發核對；沒有新增 runtime／測試依賴。

尚未特定 Agent host 安裝或模型執行，沒有完整官方 conformance／完整視覺與跨瀏覽器／正式作品／媒體生成／ASR／LUFS／true peak。下一輪優先 Agent host 的實際接入與教學、使用者創作資料的可逆操作、正式作品評測與視覺驗收；不以單輪交付宣稱整個滾動目標完成。

FreeTWAI 公開決策仍待回答；Repo 維持 private，未投稿或取得平台創始人核實，沒有更動 live data。

## 產物與程序

僅盤點本工作區 outputs，inventory-start.json／inventory-final.json 位於 outputs/v07-qa。最新三版 v0.5／v0.6／v0.7 保留；更舊檔未超過七天也保留。只有超過七天且可由已驗證 Git／遠端備份重建的本專案產物才列清除候選，本輪無候選／素材刪除。

臨時 HTTP exec 57015 已 Ctrl+C 停止（exit 1），8875 監聽數 0；測試頁 7 關閉、viewport reset。MCP／測試 bounded／EOF 退出，不清理其他程序，不保留背景監控。本輪合成、下載、schema、還原與 GitHub 核對證據保存在忽略的 outputs/v07-qa。
