# 迭代說明

## v0.3.0 — 2026-10-01

- HTTP、CLI 與 Agent 共用 application 層；保留 v0.1／v0.2 需求相容。
- 加入 Agent JSON-lines v1：四種 operation、能力查詢、id、結構化錯誤；明確選定音檔，不自動寫檔。
- 修正刪除／修改歌詞後播放預覽使用舊資料，以及舊音檔解碼覆寫最新波形的競態。
- 加入專案草稿 v1 的實際下載、回讀與表單撤回。未知／錯誤版本不替換目前內容；回讀後需重新建立成果。
- 草稿操作列、授權條文與來源通知可由介面查看。
- 依使用者最新選擇加入 PolyForm Noncommercial 1.0.0，取代先前提出的 AGPL；未改寫 v0.2.0 tag。
- 加入指定 commit 封裝、ZIP 完整性／SHA-256 與解壓後驗證腳本；分支與還原方式見 docs/ARCHITECTURE.md。

## v0.2.0 — 2026-10-01

第一版四工作台、原創 Skill、35 項 Python 測試與 private GitHub 上傳。Release tag 保留首次發起與 AI 協作紀錄；未附開源授權、未送出自由工坊投稿。
